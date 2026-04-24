"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, FREE_EXCLUDED_FEATURES, SubscriptionTier } from "@/lib/types"
import { Check, X, MessageCircleMore, Landmark, Shield } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated, isPremium, user } = useAuth()

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (tier === "free") {
      if (!isAuthenticated) {
        router.push("/register")
        return
      }
      router.push("/dashboard")
      return
    }

    if (!isAuthenticated) {
      router.push(`/register?plan=${tier}`)
      return
    }

    router.push(`/checkout?plan=${tier}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700 mb-3">Grade 4 pricing</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Choose Grade 4 Access</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Select the access level that fits your child. This pricing is for the Grade 4 PEP website only and does not include Grade 5 or any other LearnJA product.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-amber-300 bg-amber-50 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className="text-slate-700 font-medium">
                Important: Grade 4 is sold separately. Buying this product does not include Grade 5 PEP or full LearnJA access.
              </p>
            </CardContent>
          </Card>
        </div>

        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-sky-50 border border-sky-200 rounded-lg text-center">
            <p className="text-sky-800">
              Please{" "}
              <Link href="/login" className="font-semibold text-sky-700 hover:underline">
                sign in
              </Link>
              {" "}or{" "}
              <Link href="/register" className="font-semibold text-sky-700 hover:underline">
                create an account
              </Link>
              {" "}before selecting a paid Grade 4 plan.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`relative border-2 ${tier.popular ? "border-amber-400 shadow-xl md:scale-105" : "border-sky-200"}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white border-0 px-3 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-xl text-slate-800">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-800">{tier.priceJMD === 0 ? "Free" : `$${tier.priceJMD.toLocaleString()}`}</span>
                    {tier.priceJMD > 0 && <span className="text-slate-500 text-sm">JMD{tier.id === "monthly" ? "/month" : "/year"}</span>}
                  </div>
                  {tier.priceUSD > 0 && <p className="text-sm text-slate-500 mt-1">~${tier.priceUSD.toFixed(2)} USD</p>}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}

                  {tier.id === "free" &&
                    FREE_EXCLUDED_FEATURES.map((feature, index) => (
                      <li key={`excluded-${index}`} className="flex items-start gap-2">
                        <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400 line-through">{feature}</span>
                      </li>
                    ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={(user?.subscriptionTier === tier.id) || (isPremium && tier.id === "free")}
                  className={`w-full ${
                    tier.popular
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : tier.id === "yearly"
                        ? "bg-sky-600 hover:bg-sky-700 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  {user?.subscriptionTier === tier.id
                    ? "Current Plan"
                    : tier.id === "free"
                      ? isAuthenticated
                        ? "Go to Dashboard"
                        : "Start Free"
                      : `Choose ${tier.name} Grade 4 Access`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-sky-200 bg-sky-50/70">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-800 text-center mb-6">How payment works</h3>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="rounded-xl bg-white p-5 border border-sky-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Landmark className="h-5 w-5 text-sky-600" />
                    <p className="font-semibold text-slate-800">Banking details</p>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Bank:</span> NCB Bank</p>
                    <p><span className="font-medium text-slate-700">Branch:</span> Matilda&apos;s Corner Branch</p>
                    <p><span className="font-medium text-slate-700">Account name:</span> Nathlee Grant</p>
                    <p><span className="font-medium text-slate-700">Account number:</span> 064479806</p>
                    <p><span className="font-medium text-slate-700">Account type:</span> Savings</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-5 border border-sky-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-sky-600" />
                    <p className="font-semibold text-slate-800">Make your payment</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Send the exact amount for your selected Grade 4 plan using the banking details shown here. Keep your receipt, transfer confirmation, or deposit slip.
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 border border-sky-100">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircleMore className="h-5 w-5 text-sky-600" />
                    <p className="font-semibold text-slate-800">Send receipt</p>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Send your payment receipt by WhatsApp to confirm your purchase. Access is activated after payment verification.
                  </p>
                  <a href="https://wa.me/18765055212" target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:underline">
                    WhatsApp: 876-505-5212
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">Does this payment include Grade 5?</h4>
                <p className="text-slate-600">
                  No. This page is for Grade 4 PEP access only. Grade 5 is sold separately as its own product.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">How is access activated?</h4>
                <p className="text-slate-600">
                  After payment is confirmed, your selected Grade 4 access will be activated. Please send your receipt by WhatsApp to 876-505-5212 after making payment.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">Which payment methods are currently available?</h4>
                <p className="text-slate-600">
                  At this time, Grade 4 payments can be made by bank transfer or bank deposit to the NCB account listed on this page. Additional payment methods can be added later.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">Can parents start with the free plan first?</h4>
                <p className="text-slate-600">
                  Yes. The free plan allows families to explore the site before deciding whether to purchase paid Grade 4 access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-5 text-center text-slate-700">
              <span className="font-semibold">Need payment help?</span>{" "}
              Message us on{" "}
              <a href="https://wa.me/18765055212" target="_blank" rel="noreferrer" className="font-semibold text-sky-700 hover:underline">
                WhatsApp 876-505-5212
              </a>
              .
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
