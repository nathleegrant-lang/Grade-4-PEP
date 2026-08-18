"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type Visit = { id: string; page_path: string; session_id: string; user_agent: string | null; created_at: string }
type VisitorSummary = { session_id: string; total_views: number; last_page: string; last_seen_at: string }

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [totalVisits, setTotalVisits] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [recentVisits, setRecentVisits] = useState<Visit[]>([])
  const [visitorSummary, setVisitorSummary] = useState<VisitorSummary[]>([])
  const [commercialFunnel, setCommercialFunnel] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadReports() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token
        const response = await fetch("/api/admin/reports", { cache: "no-store", headers: token ? { Authorization: `Bearer ${token}` } : {} })
        const data = await response.json()
        setTotalVisits(data.totalVisits || 0)
        setUniqueVisitors(data.uniqueVisitors || 0)
        setRecentVisits(data.recentVisits || [])
        setVisitorSummary(data.visitorSummary || [])
        setCommercialFunnel(data.commercialFunnel || {})
      } catch (error) {
        console.error("Failed to load reports:", error)
      } finally {
        setLoading(false)
      }
    }
    void loadReports()
  }, [])

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading reports...</div>

  return (
    <div className="min-h-screen bg-sky-50">
      <SiteHeader />
      <main className="container mx-auto space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800">Admin Reports</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Commercial Visits</p><p className="mt-2 text-4xl font-bold text-sky-700">{totalVisits}</p></div>
          <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Commercial Visitors</p><p className="mt-2 text-4xl font-bold text-emerald-700">{uniqueVisitors}</p></div>
        </div>
        <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Commercial Funnel</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(commercialFunnel).map(([event, count]) => <div key={event} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{event.replaceAll("_", " ")}</p><p className="text-2xl font-bold text-slate-800">{count}</p></div>)}
          </div>
          <p className="mt-4 text-xs text-slate-500">Known internal/test accounts and sessions are excluded from these commercial figures.</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm"><h2 className="mb-4 text-xl font-semibold text-slate-800">Unique Visitor Summary</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Last Seen</th><th className="py-2">Total Views</th><th className="py-2">Last Page Viewed</th><th className="py-2">Session</th></tr></thead><tbody>{visitorSummary.map((visitor) => <tr key={visitor.session_id} className="border-b"><td className="py-2">{new Date(visitor.last_seen_at).toLocaleString()}</td><td className="py-2 font-semibold text-slate-800">{visitor.total_views}</td><td className="py-2">{visitor.last_page}</td><td className="py-2 text-xs text-slate-500">{visitor.session_id}</td></tr>)}</tbody></table>{visitorSummary.length === 0 && <p className="py-4 text-sm text-slate-500">No visitor summary available yet.</p>}</div></div>
        <div className="rounded-xl border border-sky-200 bg-white p-6 shadow-sm"><h2 className="mb-4 text-xl font-semibold text-slate-800">Recent Commercial Visits</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Time</th><th className="py-2">Page</th><th className="py-2">Session</th></tr></thead><tbody>{recentVisits.map((visit) => <tr key={visit.id} className="border-b"><td className="py-2">{new Date(visit.created_at).toLocaleString()}</td><td className="py-2">{visit.page_path}</td><td className="py-2 text-xs text-slate-500">{visit.session_id}</td></tr>)}</tbody></table>{recentVisits.length === 0 && <p className="py-4 text-sm text-slate-500">No visits recorded yet.</p>}</div></div>
      </main>
      <SiteFooter />
    </div>
  )
}
