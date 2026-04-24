"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, FREE_EXCLUDED_FEATURES, type PlanCode } from "@/lib/types"
import { Check, X, Landmark, MessageCircleMore, Shield, Users } from "lucide-react"
import { BANK_DETAILS, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site-config"

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null)

  const handleSelectPlan = (planId: PlanCode) => {
    setSelectedPlan(planId)
    if (planId === "free") {
      router.push(isAuthenticated ? "/dashboard" : "/register")
      return
    }
    if (!isAuthenticated) {
      router.push(`/register?plan=${planId}`)
      return
    }
    router.push(`/checkout?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Grade 4 PEP Pricing</h1>
          <p className="text-lg text-slate-600">Each Grade 4 plan is sold separately and applies to this Grade 4 programme only. It does not include Grade 5 or full LearnJA access.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-amber-300 bg-amber-50 shadow-sm"><CardContent className="p-5 text-center"><p className="text-slate-700 font-medium">Free = sample access only. Paid access starts after payment verification.</p></CardContent></Card>
        </div>

        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-sky-50 border border-sky-200 rounded-lg text-center">
            <p className="text-sky-800">Please <Link href="/login" className="font-semibold text-sky-700 hover:underline">sign in</Link> or <Link href="/register" className="font-semibold text-sky-700 hover:underline">create an account</Link> before selecting a paid Grade 4 plan.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const isCurrent = user?.subscriptionTier === tier.id
            return (
              <Card key={tier.id} className={`relative border-2 ${tier.popular ? "border-amber-400 shadow-xl" : "border-sky-200"}`}>
                {tier.badgeText && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge className="bg-amber-500 text-white border-0 px-3 py-1">{tier.badgeText}</Badge></div>}
                <CardHeader className="text-center pb-2 pt-6"><CardTitle className="text-xl text-slate-800">{tier.name}</CardTitle><CardDescription>{tier.description}</CardDescription></CardHeader>
                <CardContent className="pt-2">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1"><span className="text-4xl font-bold text-slate-800">{tier.priceJMD === 0 ? "Free" : `$${tier.priceJMD.toLocaleString()}`}</span></div>
                    {tier.priceJMD > 0 && <p className="text-sm text-slate-500 mt-1">JMD {tier.period}</p>}
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Up to {tier.maxStudents} student{tier.maxStudents === 1 ? "" : "s"}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => <li key={index} className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-sm text-slate-600">{feature}</span></li>)}
                    {tier.id === "free" && FREE_EXCLUDED_FEATURES.map((feature, index) => <li key={`excluded-${index}`} className="flex items-start gap-2"><X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" /><span className="text-sm text-slate-400 line-through">{feature}</span></li>)}
                  </ul>
                  <Button onClick={() => handleSelectPlan(tier.id)} disabled={selectedPlan === tier.id || isCurrent} className={`w-full ${tier.popular ? "bg-amber-500 hover:bg-amber-600 text-white" : tier.id === "premium_family_monthly" ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-700"}`}>{isCurrent ? "Current Plan" : tier.id === "free" ? (isAuthenticated ? "Go to Dashboard" : "Start Free") : `Choose ${tier.name}`}</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-sky-200 bg-sky-50/70"><CardContent className="p-8"><h3 className="text-xl font-semibold text-slate-800 text-center mb-6">How payment works</h3><div className="grid md:grid-cols-3 gap-5"><div className="rounded-xl bg-white p-5 border border-sky-100"><div className="flex items-center gap-3 mb-3"><Landmark className="h-5 w-5 text-sky-600" /><p className="font-semibold text-slate-800">Banking details</p></div><div className="text-sm text-slate-600 space-y-1"><p><span className="font-medium text-slate-700">Bank:</span> {BANK_DETAILS.bank}</p><p><span className="font-medium text-slate-700">Branch:</span> {BANK_DETAILS.branch}</p><p><span className="font-medium text-slate-700">Account name:</span> {BANK_DETAILS.accountName}</p><p><span className="font-medium text-slate-700">Account number:</span> {BANK_DETAILS.accountNumber}</p><p><span className="font-medium text-slate-700">Account type:</span> {BANK_DETAILS.accountType}</p></div></div><div className="rounded-xl bg-white p-5 border border-sky-100"><div className="flex items-center gap-3 mb-3"><Shield className="h-5 w-5 text-sky-600" /><p className="font-semibold text-slate-800">Submit payment</p></div><p className="text-sm text-slate-600">Create your free account, select a plan, then submit your payment reference on the checkout page. Admin approval activates access automatically.</p></div><div className="rounded-xl bg-white p-5 border border-sky-100"><div className="flex items-center gap-3 mb-3"><MessageCircleMore className="h-5 w-5 text-sky-600" /><p className="font-semibold text-slate-800">WhatsApp support</p></div><p className="text-sm text-slate-600 mb-3">You can still send your receipt by WhatsApp for quick confirmation and support.</p><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:underline">WhatsApp: {WHATSAPP_DISPLAY}</a></div></div></CardContent></Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
