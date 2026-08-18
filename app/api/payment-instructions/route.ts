import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const intentId = request.nextUrl.searchParams.get("intent")
  if (!intentId) return NextResponse.json({ error: "Valid checkout intent required." }, { status: 403 })

  const supabase = getSupabaseAdminClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 })

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) return NextResponse.json({ error: "Unable to authorize payment instructions." }, { status: 503 })
  if (!profile || profile.role !== "parent") return NextResponse.json({ error: "Parent access required." }, { status: 403 })

  const { data: intent, error: intentError } = await supabase
    .from("checkout_intents")
    .select("id,parent_id,grade,plan_code,expires_at")
    .eq("id", intentId)
    .eq("parent_id", userData.user.id)
    .eq("grade", "grade4")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  if (intentError || !intent) return NextResponse.json({ error: "Valid checkout intent required." }, { status: 403 })

  const { data: plan, error: planError } = await supabase
    .from("pricing_plans")
    .select("code,price_jmd,is_active")
    .eq("grade", "grade4")
    .eq("code", intent.plan_code)
    .eq("is_active", true)
    .gt("price_jmd", 0)
    .maybeSingle()

  if (planError || !plan) return NextResponse.json({ error: "Checkout plan is no longer available." }, { status: 403 })

  const { data, error } = await supabase
    .from("bank_transfer_details")
    .select("bank_name,branch_name,account_name,account_number,account_type")
    .eq("grade", "grade4")
    .eq("is_active", true)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: "Payment instructions are unavailable." }, { status: 503 })

  return NextResponse.json({
    bank: data.bank_name,
    branch: data.branch_name,
    accountName: data.account_name,
    accountNumber: data.account_number,
    accountType: data.account_type,
    planCode: plan.code,
  })
}
