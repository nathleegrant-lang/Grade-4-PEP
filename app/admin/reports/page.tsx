"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Visit = {
  id: string
  page_path: string
  session_id: string
  user_agent: string | null
  created_at: string
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [totalVisits, setTotalVisits] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [recentVisits, setRecentVisits] = useState<Visit[]>([])

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/admin/reports", {
          cache: "no-store",
        })

        const data = await response.json()

        setTotalVisits(data.totalVisits || 0)
        setUniqueVisitors(data.uniqueVisitors || 0)
        setRecentVisits(data.recentVisits || [])
      } catch (error) {
        console.error("Failed to load reports:", error)
      } finally {
        setLoading(false)
      }
    }

    void loadReports()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading reports...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      <main className="container mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Admin Reports
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-sky-700">{totalVisits}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-700">
                {uniqueVisitors}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Time</th>
                  <th className="py-2">Page</th>
                  <th className="py-2">Session</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((visit) => (
                  <tr key={visit.id} className="border-b">
                    <td className="py-2">
                      {new Date(visit.created_at).toLocaleString()}
                    </td>
                    <td className="py-2">{visit.page_path}</td>
                    <td className="py-2 text-xs text-slate-500">
                      {visit.session_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentVisits.length === 0 && (
              <p className="text-slate-500 text-sm py-4">
                No visits recorded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
