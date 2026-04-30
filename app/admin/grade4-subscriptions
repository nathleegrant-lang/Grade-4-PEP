"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"

type PaymentRow = {
  id: string
  parentName: string | null
  parentEmail: string | null
  planCode: string
  status: string
  submittedAt: string
}

export default function Grade4SubscriptionReport() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  const [rows, setRows] = useState<PaymentRow[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?next=/admin/subscriptions")
      return
    }

    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) return

      const res = await fetch("/api/admin/payments", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const json = await res.json()

      if (res.ok) {
        setRows(json.payments || [])
      }
    }

    if (isAuthenticated && isAdmin) load()
  }, [isAuthenticated, isAdmin, supabase])

  const total = rows.length
  const active = rows.filter((r) => r.status === "verified").length
  const pending = rows.filter((r) => r.status === "pending").length

  function exportCSV() {
    const csv = [
      ["Parent", "Email", "Plan", "Status"],
      ...rows.map((r) => [
        r.parentName,
        r.parentEmail,
        r.planCode,
        r.status,
      ]),
    ]

    const blob = new Blob([csv.map((r) => r.join(",")).join("\n")])
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "grade4-report.csv"
    a.click()
  }

  if (isLoading) return null
  if (!isAuthenticated || !isAdmin) return null

  return (
    <div className="min-h-screen bg-sky-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <Link href="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              Total<br /><b>{total}</b>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center text-green-600">
              Verified<br /><b>{active}</b>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center text-amber-600">
              Pending<br /><b>{pending}</b>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Grade 4 Subscription Report</CardTitle>
            <Button onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </CardHeader>

          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>Parent</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td>{row.parentName}</td>
                    <td>{row.parentEmail}</td>
                    <td>{row.planCode}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  )
}
