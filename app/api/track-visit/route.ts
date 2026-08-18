import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const FUNNEL_PATHS: Array<[RegExp, string]> = [
  [/^\/$/, "website_visit"],
  [/^\/pricing\/?$/, "pricing_interest"],
  [/^\/register\/?$/, "registration_view"],
  [/^\/checkout\/?$/, "checkout_view"],
  [/^\/mock-tests(?:\/|$)/, "free_experience"],
]
const PAID_USE_PATHS = [/^\/mock-tests(?:\/|$)/, /^\/language-arts(?:\/|$)/, /^\/mathematics(?:\/|$)/, /^\/performance-tasks(?:\/|$)/, /^\/worksheets(?:\/|$)/]

function funnelEventForPath(path: string) {
  return FUNNEL_PATHS.find(([pattern]) => pattern.test(path))?.[1] ?? null
}
function isPaidUsePath(path: string) {
  return PAID_USE_PATHS.some((pattern) => pattern.test(path))
}

type TrackVisitPayload = { page_path?: string; session_id?: string; user_agent?: string }

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as TrackVisitPayload
    if (!payload.session_id) return NextResponse.json({ error: "session_id is required" }, { status: 400 })

    const pagePath = payload.page_path ?? "/"
    const supabase = getSupabaseAdminClient()
    let userId: string | null = null

    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
    if (token) {
      const { data: userData } = await supabase.auth.getUser(token)
      if (userData.user) {
        userId = userData.user.id
        const { data: profile } = await supabase.from("profiles").select("is_internal_test").eq("id", userId).maybeSingle()
        if (profile?.is_internal_test === true) {
          await supabase.from("internal_test_sessions").upsert({ session_id: payload.session_id, user_id: userId, identified_at: new Date().toISOString() })
        }
      }
    }

    const { error } = await supabase.from("site_visits").insert({ page_path: pagePath, session_id: payload.session_id, user_agent: payload.user_agent ?? null })
    if (error) {
      console.error("track visit error:", error)
      return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
    }

    const eventName = funnelEventForPath(pagePath)
    if (eventName) {
      const { error: funnelError } = await supabase.from("funnel_events").insert({ event_name: eventName, session_id: payload.session_id, user_id: userId, grade: "grade4", page_path: pagePath })
      if (funnelError) console.error("track funnel event error:", funnelError)
    }

    if (userId && isPaidUsePath(pagePath)) {
      const { data: activeSubscription } = await supabase.from("subscriptions").select("id").eq("parent_id", userId).eq("grade", "grade4").eq("status", "active").gt("expires_at", new Date().toISOString()).limit(1).maybeSingle()
      if (activeSubscription) {
        const { data: previousPaidEvents } = await supabase.from("funnel_events").select("session_id").eq("user_id", userId).in("event_name", ["first_paid_use", "return_paid_use"]).order("created_at", { ascending: true })
        const previousSessions = new Set((previousPaidEvents ?? []).map((row) => row.session_id).filter(Boolean))
        if (!previousSessions.has(payload.session_id)) {
          await supabase.from("funnel_events").insert({ event_name: previousSessions.size === 0 ? "first_paid_use" : "return_paid_use", session_id: payload.session_id, user_id: userId, grade: "grade4", page_path: pagePath, metadata: { subscription_id: activeSubscription.id } })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("track visit route error:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
