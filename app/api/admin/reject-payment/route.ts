import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Missing admin token." }, { status: 401 })
    }

    const body = await request.json()
    const paymentId = body.paymentId as string | undefined
    const reason = body.reason as string | undefined

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required." }, { status: 400 })
    }

    if (!reason?.trim()) {
      return NextResponse.json({ error: "Rejection reason is required." }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid admin session." }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from("payments")
      .update({
        status: "rejected",
        rejection_reason: reason.trim(),
      })
      .eq("id", paymentId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Unable to reject payment." }, { status: 500 })
  }
}
