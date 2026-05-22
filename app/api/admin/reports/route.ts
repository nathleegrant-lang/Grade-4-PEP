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

    const totalVisits = visits?.length ?? 0
    const uniqueVisitors = new Set((visits ?? []).map((visit) => visit.session_id)).size

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      recentVisits: visits?.slice(0, 20) ?? [],
    })
  } catch (error) {
    console.error("admin reports error:", error)
    return NextResponse.json(
      { error: "Failed to load admin reports" },
      { status: 500 },
    )
  }
}
