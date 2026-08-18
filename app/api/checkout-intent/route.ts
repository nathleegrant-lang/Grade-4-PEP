import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const INTENT_MINUTES = 30

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const supabase = getSupabaseAdminClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 })

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle()
  if (!profile || profile.role !== "parent") return NextResponse.json({ error: "Parent access required." }, { status: 403 })

  const body = (await request.json()) as { planCode?: string; sessionId?: string }
  if (!body.planCode) return NextResponse.json({ error: "A paid Grade 4 plan is required." }, { status: 400 })

  const { data: plan, error: planError } = await supabase
    .from("pricing_plans")
    .select("code,price_jmd,is_active")
    .eq("grade", "grade4")
    .eq("code", body.planCode)
    .eq("is_active", true)
    .gt("price_jmd", 0)
    .maybeSingle()

  if (planError || !plan) return NextResponse.json({ error: "Invalid paid Grade 4 plan." }, { status: 400 })

  const expiresAt = new Date(Date.now() + INTENT_MINUTES * 60_000).toISOString()
  const { data: intent, error: intentError } = await supabase
    .from("checkout_intents")
    .insert({ parent_id: userData.user.id, grade: "grade4", plan_code: plan.code, expires_at: expiresAt })
    .select("id,plan_code,expires_at")
    .single()

  if (intentError || !intent) return NextResponse.json({ error: "Unable to establish checkout intent." }, { status: 500 })

  await supabase.from("funnel_events").insert({
    event_name: "proceed_to_payment",
    user_id: userData.user.id,
    session_id: body.sessionId || null,
    grade: "grade4",
    plan_code: plan.code,
    page_path: "/checkout",
    metadata: { checkout_intent_id: intent.id },
  })

  return NextResponse.json({ intentId: intent.id, planCode: intent.plan_code, expiresAt: intent.expires_at })
}
