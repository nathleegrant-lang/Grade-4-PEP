import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

async function requireAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return { error: NextResponse.json({ error: "Missing authorization token." }, { status: 401 }) }
  const supabase = getSupabaseAdminClient()
  const { data: userData, error } = await supabase.auth.getUser(token)
  if (error || !userData.user) return { error: NextResponse.json({ error: "Invalid admin session." }, { status: 401 }) }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single()
  if (profile?.role !== "admin") return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) }
  return { supabase, adminId: userData.user.id }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ("error" in auth) return auth.error
  const { parentId, studentId, planCode, startsAt, expiresAt, reason } = await request.json() as {
    parentId?: string; studentId?: string; planCode?: string; startsAt?: string; expiresAt?: string; reason?: string
  }
  if (!parentId || !studentId || !planCode || !startsAt || !expiresAt || !reason?.trim()) {
    return NextResponse.json({ error: "Parent, beneficiary, plan, start, expiry and reason are required." }, { status: 400 })
  }
  if (planCode === "free") return NextResponse.json({ error: "Goodwill must map to a paid-equivalent plan." }, { status: 400 })
  const start = new Date(startsAt); const expiry = new Date(expiresAt)
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(expiry.getTime()) || expiry <= start) {
    return NextResponse.json({ error: "Goodwill access requires a valid finite start and expiry." }, { status: 400 })
  }

  const { supabase, adminId } = auth
  const [{ data: student }, { data: plan }, { data: existing }] = await Promise.all([
    supabase.from("students").select("id,parent_id,grade_level").eq("id", studentId).eq("parent_id", parentId).eq("grade_level", 4).maybeSingle(),
    supabase.from("pricing_plans").select("code,grade,is_active").eq("code", planCode).eq("grade", "grade4").eq("is_active", true).maybeSingle(),
    supabase.from("subscriptions").select("id,access_source,status,expires_at").eq("parent_id", parentId).eq("grade", "grade4").in("status", ["pending","active"]),
  ])
  if (!student) return NextResponse.json({ error: "Beneficiary student was not found for this Parent." }, { status: 404 })
  if (!plan) return NextResponse.json({ error: "Active Grade 4 plan-equivalent capability not found." }, { status: 400 })
  if ((existing ?? []).some((row) => row.status === "active" && (!row.expires_at || new Date(row.expires_at) > start))) {
    return NextResponse.json({ error: "An active Grade 4 entitlement already exists. Reconcile it before granting goodwill." }, { status: 409 })
  }

  const { data: entitlement, error: insertError } = await supabase.from("subscriptions").insert({
    parent_id: parentId, grade: "grade4", plan_code: planCode, status: "active",
    starts_at: start.toISOString(), expires_at: expiry.toISOString(), max_students: 1,
    payment_id: null, access_source: "goodwill", goodwill_reason: reason.trim(),
    goodwill_authorized_by: adminId, beneficiary_student_id: studentId,
  }).select("id,expires_at").single()
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  const { error: studentError } = await supabase.from("students").update({ subscription_id: entitlement.id }).eq("id", studentId).eq("parent_id", parentId)
  if (studentError) {
    await supabase.from("subscriptions").delete().eq("id", entitlement.id)
    return NextResponse.json({ error: "Goodwill entitlement could not be linked to its beneficiary." }, { status: 500 })
  }

  await supabase.from("admin_audit_log").insert({
    actor_id: adminId, action: "grant_goodwill_access", target_table: "subscriptions", target_id: entitlement.id,
    details: { grade: "grade4", plan_code: planCode, beneficiary_student_id: studentId, starts_at: start.toISOString(), expires_at: expiry.toISOString(), reason: reason.trim() },
  })
  return NextResponse.json({ success: true, entitlementId: entitlement.id, expiresAt: entitlement.expires_at })
}
