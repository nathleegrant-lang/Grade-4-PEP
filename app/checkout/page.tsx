"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, SubscriptionTier } from "@/lib/types"
import { Crown, ArrowLeft, Landmark, MessageCircleMore, ShieldCheck } from "lucide-react"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading } = useAuth()

  const planId = searchParams.get("plan") as SubscriptionTier
  const plan = PRICING_TIERS.find((t) => t.id === planId)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/register?plan=${planId}`)
    }
  }, [isLoading, isAuthenticated, router, planId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!plan || plan.id === "free") {
    router.push("/pricing")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/pricing">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-sky-200 shadow-lg">
            <CardHeader className="text-center border-b">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Complete Your Grade 4 Access Request</CardTitle>
              <CardDescription>
                {user?.childName ? `Selected for ${user.childName}` : "Selected plan"}: {plan.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Plan Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">{plan.name} Grade 4 plan</span>
                  <span className="font-medium text-slate-800">${plan.priceJMD.toLocaleString()} JMD</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Billing period</span>
                  <span className="capitalize">{plan.period}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Payment verification flow</p>
                    <p className="text-sm text-slate-600">
                      Pay for your selected Grade 4 plan using the banking details below, then send your receipt by WhatsApp for verification. Access will be activated after payment has been confirmed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-sky-100 bg-white p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Landmark className="h-5 w-5 text-sky-600" />
                    <h4 className="font-semibold text-slate-800">Step 1</h4>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Bank:</span> NCB Bank</p>
                    <p><span className="font-medium text-slate-700">Branch:</span> Matilda&apos;s Corner Branch</p>
                    <p><span className="font-medium text-slate-700">Account name:</span> Nathlee Grant</p>
                    <p><span className="font-medium text-slate-700">Account number:</span> 064479806</p>
                    <p><span className="font-medium text-slate-700">Account type:</span> Savings</p>
                  </div>
                </div>
                <div className="rounded-xl border border-sky-100 bg-white p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-5 w-5 text-sky-600" />
                    <h4 className="font-semibold text-slate-800">Step 2</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Pay the exact amount for your selected plan. Keep your deposit slip, transfer screenshot, or bank confirmation as proof of payment.
                  </p>
                </div>
                <div className="rounded-xl border border-sky-100 bg-white p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircleMore className="h-5 w-5 text-sky-600" />
                    <h4 className="font-semibold text-slate-800">Step 3</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Send your receipt by WhatsApp so your Grade 4 access can be verified and activated.
                  </p>
                  <a href="https://wa.me/18765055212" target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:underline">
                    WhatsApp: 876-505-5212
                  </a>
                </div>
              </div>

              <div className="rounded-xl bg-sky-50 border border-sky-200 p-5">
                <h4 className="font-semibold text-slate-800 mb-2">Payment note</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This payment gives access to your selected Grade 4 plan only. Grade 5 PEP and other LearnJA products are sold separately.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Choose Another Plan
                  </Button>
                </Link>
                <a href="https://wa.me/18765055212" target="_blank" rel="noreferrer" className="flex-1">
                  <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                    Send Receipt on WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
          <p className="text-slate-600">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
