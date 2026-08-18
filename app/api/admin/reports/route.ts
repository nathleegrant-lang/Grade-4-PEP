import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const FUNNEL_ORDER = ["website_visit", "pricing_interest", "registration_view", "registration_completed", "free_experience", "checkout_view", "payment_submitted", "access_activated", "first_paid_use", "return_paid_use"]

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    const [{ data: visits, error }, { data: internalSessions }, { data: internalProfiles }, { data: funnelEvents }] = await Promise.all([
      supabase.from("site_visits").select("*").order("created_at", { ascending: false }),
      supabase.from("internal_test_sessions").select("session_id"),
      supabase.from("profiles").select("id").eq("is_internal_test", true),
      supabase.from("funnel_events").select("event_name,session_id,user_id,created_at").eq("grade", "grade4"),
    ])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const excludedSessionIds = new Set((internalSessions ?? []).map((row) => row.session_id))
    const excludedUserIds = new Set((internalProfiles ?? []).map((row) => row.id))
    const visitRows = (visits ?? []).filter((visit) => !String(visit.page_path || "").startsWith("/admin") && !excludedSessionIds.has(visit.session_id))
    const commercialFunnelEvents = (funnelEvents ?? []).filter((event) => !excludedSessionIds.has(event.session_id) && !excludedUserIds.has(event.user_id))

    const funnel: Record<string, number> = Object.fromEntries(FUNNEL_ORDER.map((name) => [name, 0]))
    for (const event of commercialFunnelEvents) if (event.event_name in funnel) funnel[event.event_name] += 1

    const totalVisits = visitRows.length
    const uniqueVisitors = new Set(visitRows.map((visit) => visit.session_id)).size
    const visitorSummary = Object.values(visitRows.reduce<Record<string, { session_id: string; total_views: number; last_page: string; last_seen_at: string }>>((acc, visit) => {
      const key = visit.session_id
      if (!acc[key]) acc[key] = { session_id: key, total_views: 0, last_page: visit.page_path, last_seen_at: visit.created_at }
      acc[key].total_views += 1
      if (new Date(visit.created_at) > new Date(acc[key].last_seen_at)) {
        acc[key].last_page = visit.page_path
        acc[key].last_seen_at = visit.created_at
      }
      return acc
    }, {})).sort((a, b) => new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime())

    return NextResponse.json({ totalVisits, uniqueVisitors, recentVisits: visitRows.slice(0, 20), visitorSummary, commercialFunnel: funnel, excludedInternalSessions: excludedSessionIds.size, excludedInternalAccounts: excludedUserIds.size })
  } catch (error) {
    console.error("admin reports error:", error)
    return NextResponse.json({ error: "Failed to load admin reports" }, { status: 500 })
  }
}
