"use client"

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, type PlanCode, type PricingTier } from "@/lib/types"
import { Crown, ArrowLeft, Landmark, ShieldCheck } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type PendingPayment = { id: string; status: "pending"; submitted_at: string; plan_code: PlanCode; reference_code: string | null }
type ActiveSubscription = { id: string; status: "active"; expires_at: string | null; max_students: number }
type BankDetails = { bank: string; branch: string | null; accountName: string; accountNumber: string; accountType: string | null }
type PricingPlanRow = { code: PlanCode; grade: "grade4" | "grade5"; name: string; price_jmd: number; period: string; description: string | null; features: unknown; max_students: number; badge_text: string | null; popular: boolean; is_active: boolean }

function normalizeFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [] } catch { return [] }
  }
  return []
}

function mapPlanRowToTier(row: PricingPlanRow): PricingTier {
  return { id: row.code, name: row.name, priceJMD: Number(row.price_jmd), period: row.period, description: row.description || "", features: normalizeFeatures(row.features), popular: row.popular, maxStudents: row.max_students, badgeText: row.badge_text }
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const planId = searchParams.get("plan") as PlanCode | null

  const [referenceCode, setReferenceCode] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null)
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null)
  const [plan, setPlan] = useState<PricingTier | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [loadingBankDetails, setLoadingBankDetails] = useState(false)

  const hasPendingPayment = Boolean(pendingPayment)
  const hasActiveSubscription = Boolean(activeSubscription)
  const formLocked = submitting || checkingStatus || hasPendingPayment || hasActiveSubscription

  useEffect(() => {
    const loadPlan = async () => {
      if (!planId) { setPlan(null); setLoadingPlan(false); return }
      try {
        const { data } = await supabase.from("pricing_plans").select("code, grade, name, price_jmd, period, description, features, max_students, badge_text, popular, is_active").eq("grade", "grade4").eq("code", planId).eq("is_active", true).maybeSingle()
        setPlan(data ? mapPlanRowToTier(data as PricingPlanRow) : PRICING_TIERS.find((tier) => tier.id === planId) ?? null)
      } catch { setPlan(PRICING_TIERS.find((tier) => tier.id === planId) ?? null) }
      finally { setLoadingPlan(false) }
    }
    void loadPlan()
  }, [planId, supabase])

  const getExistingSubmissionState = async (parentId: string) => {
    const [{ data: pendingData }, { data: subscriptionData }] = await Promise.all([
      supabase.from("payments").select("id, status, submitted_at, plan_code, reference_code").eq("parent_id", parentId).eq("grade", "grade4").eq("status", "pending").order("submitted_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("subscriptions").select("id, status, expires_at, max_students").eq("parent_id", parentId).eq("grade", "grade4").eq("status", "active").order("expires_at", { ascending: false }).limit(1).maybeSingle(),
    ])
    const validActiveSubscription = subscriptionData?.expires_at && new Date(subscriptionData.expires_at) > new Date() ? subscriptionData as ActiveSubscription : null
    return { pendingPayment: pendingData as PendingPayment | null, activeSubscription: validActiveSubscription }
  }

  const loadSubmissionState = async () => {
    if (!user) { setPendingPayment(null); setActiveSubscription(null); setCheckingStatus(false); return }
    setCheckingStatus(true)
    const result = await getExistingSubmissionState(user.id)
    setPendingPayment(result.pendingPayment)
    setActiveSubscription(result.activeSubscription)
    setCheckingStatus(false)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push(`/register?plan=${planId ?? ""}`); return }
    if (!isLoading && isAuthenticated && user) void loadSubmissionState()
  }, [isLoading, isAuthenticated, user, planId, router])

  useEffect(() => {
    const loadBankDetails = async () => {
      if (!isAuthenticated || !user || hasPendingPayment || hasActiveSubscription) return
      setLoadingBankDetails(true)
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token
        if (!token) throw new Error("Missing session")
        const response = await fetch("/api/payment-instructions", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
        if (!response.ok) throw new Error("Payment instructions unavailable")
        setBankDetails(await response.json() as BankDetails)
      } catch { setError("We couldn’t load the secure bank-transfer instructions. Please refresh the page or contact support.") }
      finally { setLoadingBankDetails(false) }
    }
    void loadBankDetails()
  }, [isAuthenticated, user, hasPendingPayment, hasActiveSubscription, supabase])

  const handleSubmitPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !plan || plan.id === "free") return
    setSubmitting(true); setError(""); setSuccess("")
    const latestState = await getExistingSubmissionState(user.id)
    setPendingPayment(latestState.pendingPayment); setActiveSubscription(latestState.activeSubscription)
    if (latestState.pendingPayment) { setError("Your payment submission has already been received and is awaiting verification."); setSubmitting(false); return }
    if (latestState.activeSubscription) { setError("Your Grade 4 access is already active. No new payment submission is needed right now."); setSubmitting(false); return }
    const { error: insertError } = await supabase.from("payments").insert({ parent_id: user.id, grade: "grade4", plan_code: plan.id, amount_jmd: plan.priceJMD, method: "bank_transfer", reference_code: referenceCode || null, note: note || null, status: "pending" })
    if (insertError) { setError(insertError.code === "23505" ? "You already have a payment submission awaiting verification." : "We couldn’t submit your payment details right now. Please try again or contact support."); setSubmitting(false); return }
    await loadSubmissionState(); await refreshUser()
    setSuccess("Your payment confirmation was received. Status: Verification Pending. We will activate Grade 4 access after approval.")
    setSubmitting(false)
  }

  if (isLoading || loadingPlan) return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center"><p className="text-slate-600">Loading...</p></div>
  if (!plan || plan.id === "free") { router.push("/pricing"); return null }

  return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
    <SiteHeader />
    <main className="container mx-auto px-4 py-10">
      <Link href="/pricing"><Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800"><ArrowLeft className="mr-2 h-4 w-4" />Back to Pricing</Button></Link>
      <div className="max-w-3xl mx-auto space-y-6"><Card className="border-sky-200 shadow-lg">
        <CardHeader className="text-center border-b"><div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4"><Crown className="h-8 w-8 text-amber-600" /></div><CardTitle className="text-2xl text-slate-800">Grade 4 Bank Transfer</CardTitle><CardDescription>{plan.name} for {user?.childName ?? "your student"}</CardDescription></CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4"><h3 className="font-semibold text-slate-800 mb-3">Plan Summary</h3><div className="flex justify-between"><span>{plan.name}</span><span className="font-medium">${plan.priceJMD.toLocaleString()} JMD</span></div></div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex gap-3"><ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" /><div><p className="font-semibold text-slate-800">Secure payment journey</p><p className="text-sm text-slate-600">These bank details are shown only after you sign in and deliberately proceed to payment. After transferring, return here and submit your payment confirmation. Access begins only after admin verification.</p></div></div>
          {hasPendingPayment && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-semibold">Verification Pending</p><p className="text-sm text-slate-600">Your payment confirmation has been received. Please do not submit another payment while verification is pending.</p>{pendingPayment?.reference_code && <p className="text-sm mt-2"><b>Reference:</b> {pendingPayment.reference_code}</p>}</div>}
          {hasActiveSubscription ? <div className="space-y-4"><div className="rounded-xl border-2 border-emerald-600 bg-emerald-100 p-5"><p className="text-lg font-extrabold text-emerald-900">✅ Access Already Active</p><p className="text-sm text-emerald-900">Your Grade 4 access is active{activeSubscription.expires_at ? ` until ${new Date(activeSubscription.expires_at).toLocaleDateString()}` : ""}.</p></div><Link href="/dashboard"><Button className="w-full bg-slate-800 text-white">Go to Dashboard</Button></Link></div> : <>
            <div className="rounded-xl border border-sky-200 bg-white p-5"><div className="flex items-center gap-2 mb-3"><Landmark className="h-5 w-5 text-sky-600" /><h4 className="font-semibold">Step 1 — Make your bank transfer</h4></div>{loadingBankDetails ? <p className="text-sm text-slate-600">Loading secure bank details...</p> : bankDetails ? <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm"><div><dt className="text-slate-500">Bank</dt><dd className="font-semibold">{bankDetails.bank}</dd></div><div><dt className="text-slate-500">Branch</dt><dd className="font-semibold">{bankDetails.branch}</dd></div><div><dt className="text-slate-500">Account name</dt><dd className="font-semibold">{bankDetails.accountName}</dd></div><div><dt className="text-slate-500">Account number</dt><dd className="font-semibold">{bankDetails.accountNumber}</dd></div><div><dt className="text-slate-500">Account type</dt><dd className="font-semibold">{bankDetails.accountType}</dd></div><div><dt className="text-slate-500">Amount</dt><dd className="font-semibold">${plan.priceJMD.toLocaleString()} JMD</dd></div></dl> : null}</div>
            <form onSubmit={handleSubmitPayment} className={`space-y-4 ${formLocked ? "opacity-60" : ""}`}>{error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}{success && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>}<div className="space-y-2"><Label htmlFor="referenceCode">Step 2 — Payment reference or deposit slip number</Label><Input id="referenceCode" value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} placeholder="Enter your transfer or receipt reference" disabled={formLocked} /></div><div className="space-y-2"><Label htmlFor="note">Optional note</Label><Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add any helpful note for payment verification" rows={4} disabled={formLocked} /></div><div className="flex flex-col sm:flex-row gap-3"><Link href="/pricing" className="flex-1"><Button variant="outline" className="w-full">Choose Another Plan</Button></Link><Button type="submit" className="flex-1 bg-slate-800 text-white" disabled={formLocked || !bankDetails}>{checkingStatus ? "Checking status..." : submitting ? "Submitting..." : "Submit Payment Confirmation"}</Button></div></form>
          </>}
        </CardContent>
      </Card></div>
    </main><SiteFooter />
  </div>
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center"><p className="text-slate-600">Loading checkout...</p></div>}><CheckoutContent /></Suspense>
}
