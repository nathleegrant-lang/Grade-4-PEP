"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { PaymentRecord } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { getPlanLabel } from "@/lib/subscriptions"

interface AdminPaymentsResponse { payments: PaymentRecord[] }

export default function AdminPaymentsPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const { isLoading, isAuthenticated, isAdmin } = useAuth()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [error, setError] = useState("")
  const [busyPaymentId, setBusyPaymentId] = useState<string | null>(null)

  const loadPayments = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) return
    const res = await fetch("/api/admin/payments", { headers: { Authorization: `Bearer ${token}` } })
    const json = (await res.json()) as AdminPaymentsResponse | { error: string }
    if (!res.ok) {
      setError("error" in json ? json.error : "Unable to load payments.")
      return
    }
    setPayments((json as AdminPaymentsResponse).payments)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?next=/admin/payments")
      return
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/dashboard")
      return
    }
    if (isAdmin) void loadPayments()
  }, [isLoading, isAuthenticated, isAdmin, router])

  const verifyPayment = async (paymentId: string) => {
    setBusyPaymentId(paymentId)
    setError("")
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError("Admin session missing.")
      setBusyPaymentId(null)
      return
    }
    const res = await fetch("/api/admin/verify-payment", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ paymentId }) })
    const json = (await res.json()) as { error?: string }
    if (!res.ok) {
      setError(json.error || "Unable to verify payment.")
      setBusyPaymentId(null)
      return
    }
    await loadPayments()
    setBusyPaymentId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10 space-y-6">
        <div><h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-sky-600" /> Grade 4 Payment Admin</h1><p className="text-slate-600 mt-2">Verify payments to activate subscriptions and set expiry dates automatically.</p></div>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-4 text-sm">{error}</div>}
        <Card className="border-sky-200"><CardHeader><CardTitle>Pending and recent payments</CardTitle><CardDescription>Once you verify a payment, the parent's Grade 4 plan is activated immediately.</CardDescription></CardHeader><CardContent className="space-y-4">{payments.length === 0 ? <p className="text-sm text-slate-500">No payments found yet.</p> : payments.map((payment) => <div key={payment.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-slate-800">{payment.parentName || payment.parentEmail || "Parent account"}</p><p className="text-sm text-slate-500">{payment.parentEmail || "No email"}</p></div><Badge variant={payment.status === "verified" ? "default" : "secondary"}>{payment.status}</Badge></div><div className="grid gap-3 md:grid-cols-4 text-sm"><div><p className="text-slate-500">Plan</p><p className="text-slate-800">{getPlanLabel(payment.planCode)}</p></div><div><p className="text-slate-500">Amount</p><p className="text-slate-800">JMD ${payment.amountJmd.toLocaleString()}</p></div><div><p className="text-slate-500">Submitted</p><p className="text-slate-800">{new Date(payment.submittedAt).toLocaleString()}</p></div><div><p className="text-slate-500">Reference</p><p className="text-slate-800 break-all">{payment.referenceCode || "—"}</p></div></div>{payment.note && <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><span className="font-medium">Note:</span> {payment.note}</div>}{payment.status === "pending" && <Button onClick={() => void verifyPayment(payment.id)} disabled={busyPaymentId === payment.id} className="bg-slate-800 hover:bg-slate-900 text-white">{busyPaymentId === payment.id ? "Verifying..." : "Verify payment"}</Button>}</div>)}</CardContent></Card>
      </main>
      <SiteFooter />
    </div>
  )
}
