import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()

    const { data: visits, error } = await supabase
      .from("site_visits")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const visitRows = visits ?? []

    const totalVisits = visitRows.length
    const uniqueVisitors = new Set(
      visitRows.map((visit) => visit.session_id),
    ).size

    const visitorSummary = Object.values(
      visitRows.reduce<Record<string, {
        session_id: string
        total_views: number
        last_page: string
        last_seen_at: string
      }>>((acc, visit) => {
        const key = visit.session_id

        if (!acc[key]) {
          acc[key] = {
            session_id: key,
            total_views: 0,
            last_page: visit.page_path,
            last_seen_at: visit.created_at,
          }
        }

        acc[key].total_views += 1

        if (new Date(visit.created_at) > new Date(acc[key].last_seen_at)) {
          acc[key].last_page = visit.page_path
          acc[key].last_seen_at = visit.created_at
        }

        return acc
      }, {}),
    ).sort(
      (a, b) =>
        new Date(b.last_seen_at).getTime() -
        new Date(a.last_seen_at).getTime(),
    )

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      recentVisits: visitRows.slice(0, 20),
      visitorSummary,
    })
  } catch (error) {
    console.error("admin reports error:", error)
    return NextResponse.json(
      { error: "Failed to load admin reports" },
      { status: 500 },
    )
  }
}
