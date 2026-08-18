import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const FUNNEL_PATHS: Array<[RegExp, string]> = [
  [/^\/$/, "website_visit"],
  [/^\/pricing\/?$/, "pricing_interest"],
  [/^\/register\/?$/, "registration_view"],
  [/^\/checkout\/?$/, "checkout_view"],
  [/^\/mock-tests(?:\/|$)/, "free_experience"],
]

function funnelEventForPath(path: string) {
  return FUNNEL_PATHS.find(([pattern]) => pattern.test(path))?.[1] ?? null
}

type TrackVisitPayload = {
  page_path?: string
  session_id?: string
  user_agent?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as TrackVisitPayload

    if (!payload.session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 })
    }

    const pagePath = payload.page_path ?? "/"
    const supabase = getSupabaseAdminClient()

    const { error } = await supabase.from("site_visits").insert({
      page_path: pagePath,
      session_id: payload.session_id,
      user_agent: payload.user_agent ?? null,
    })

    if (error) {
      console.error("track visit error:", error)
      return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
    }

    const eventName = funnelEventForPath(pagePath)
    if (eventName) {
      const { error: funnelError } = await supabase.from("funnel_events").insert({
        event_name: eventName,
        session_id: payload.session_id,
        grade: "grade4",
        page_path: pagePath,
      })

      if (funnelError) console.error("track funnel event error:", funnelError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("track visit route error:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
