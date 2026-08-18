import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const supabase = getSupabaseAdminClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 })

  const { data, error } = await supabase.from("bank_transfer_details").select("bank_name,branch_name,account_name,account_number,account_type").eq("grade", "grade4").eq("is_active", true).maybeSingle()
  if (error || !data) {
    console.error("payment instructions error:", error)
    return NextResponse.json({ error: "Payment instructions are unavailable." }, { status: 503 })
  }

  return NextResponse.json({ bank: data.bank_name, branch: data.branch_name, accountName: data.account_name, accountNumber: data.account_number, accountType: data.account_type })
}
