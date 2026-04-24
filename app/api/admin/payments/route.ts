import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import type { PaymentRecord } from "@/lib/types"

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

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ("error" in auth) return auth.error
  const { supabase } = auth
  const { data, error } = await supabase.from("payments").select(`id,parent_id,grade,plan_code,amount_jmd,method,reference_code,proof_url,note,status,submitted_at,verified_at,rejection_reason,profiles:parent_id(full_name,email)`).eq("grade", "grade4").order("submitted_at", { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const payments: PaymentRecord[] = (data ?? []).map((row: Record<string, unknown>) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    const parentProfile = profile as { full_name?: string; email?: string } | null
    return { id: String(row.id), parentId: String(row.parent_id), grade: "grade4", planCode: row.plan_code as PaymentRecord["planCode"], amountJmd: Number(row.amount_jmd), method: String(row.method), referenceCode: row.reference_code as string | null, proofUrl: row.proof_url as string | null, note: row.note as string | null, status: row.status as PaymentRecord["status"], submittedAt: String(row.submitted_at), verifiedAt: row.verified_at as string | null, rejectionReason: row.rejection_reason as string | null, parentName: parentProfile?.full_name ?? null, parentEmail: parentProfile?.email ?? null }
  })
  return NextResponse.json({ payments })
}
