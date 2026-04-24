import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { calculateExpiry } from "@/lib/subscriptions"

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace(/^Bearer\s+/i, "")
  if (!token) return { error: NextResponse.json({ error: "Missing authorization token." }, { status: 401 }) }
  const supabase = getSupabaseAdminClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return { error: NextResponse.json({ error: "Invalid admin session." }, { status: 401 }) }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single()
  if (!profile || profile.role !== "admin") return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) }
  return { supabase, adminId: userData.user.id }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ("error" in auth) return auth.error
  const { paymentId } = (await request.json()) as { paymentId?: string }
  if (!paymentId) return NextResponse.json({ error: "Payment ID is required." }, { status: 400 })
  const { supabase, adminId } = auth
  const { data: payment, error: paymentError } = await supabase.from("payments").select("id,parent_id,grade,plan_code,amount_jmd,status").eq("id", paymentId).single()
  if (paymentError || !payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 })
  if (payment.status !== "pending") return NextResponse.json({ error: "Only pending payments can be verified." }, { status: 400 })
  const { data: plan, error: planError } = await supabase.from("pricing_plans").select("code,max_students").eq("code", payment.plan_code).eq("grade", "grade4").single()
  if (planError || !plan) return NextResponse.json({ error: "Pricing plan not found." }, { status: 404 })
  const now = new Date()
  const expiry = calculateExpiry(payment.plan_code)
  const { data: existingSubscription } = await supabase.from("subscriptions").select("id").eq("parent_id", payment.parent_id).eq("grade", "grade4").in("status", ["pending", "active"]).maybeSingle()
  if (existingSubscription?.id) {
    const { error: updateError } = await supabase.from("subscriptions").update({ plan_code: payment.plan_code, status: "active", starts_at: now.toISOString(), expires_at: expiry?.toISOString() ?? null, max_students: plan.max_students, payment_id: payment.id }).eq("id", existingSubscription.id)
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  } else {
    const { error: insertError } = await supabase.from("subscriptions").insert({ parent_id: payment.parent_id, grade: "grade4", plan_code: payment.plan_code, status: "active", starts_at: now.toISOString(), expires_at: expiry?.toISOString() ?? null, max_students: plan.max_students, payment_id: payment.id })
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  const { error: paymentUpdateError } = await supabase.from("payments").update({ status: "verified", verified_at: now.toISOString(), verified_by: adminId }).eq("id", payment.id)
  if (paymentUpdateError) return NextResponse.json({ error: paymentUpdateError.message }, { status: 500 })
  await supabase.from("admin_audit_log").insert({ actor_id: adminId, action: "verify_payment", target_table: "payments", target_id: payment.id, details: { plan_code: payment.plan_code, grade: payment.grade, expires_at: expiry?.toISOString() ?? null, max_students: plan.max_students } })
  return NextResponse.json({ success: true, expiresAt: expiry?.toISOString() ?? null, maxStudents: plan.max_students })
}
