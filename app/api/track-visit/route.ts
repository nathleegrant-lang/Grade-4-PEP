import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

type TrackVisitPayload = {
  page_path?: string
  session_id?: string
  user_agent?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as TrackVisitPayload

    if (!payload.session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdminClient()

    const { error } = await supabase.from("site_visits").insert({
      page_path: payload.page_path ?? "/",
      session_id: payload.session_id,
      user_agent: payload.user_agent ?? null,
    })

    if (error) {
      console.error("track visit error:", error)
      return NextResponse.json(
        { error: "Failed to track visit" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("track visit route error:", error)

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    )
  }
}
