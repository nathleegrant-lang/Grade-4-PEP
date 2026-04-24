"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, FREE_EXCLUDED_FEATURES, SubscriptionTier } from "@/lib/types"
import { Check, X, Crown, Sparkles, Shield, Star, CreditCard, Lock, Zap } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated, isPremium, user } = useAuth()
  const [isProcessing, setIsProcessing] = useState<SubscriptionTier | null>(null)

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    if (tier === "free") {
      if (!isAuthenticated) {
        router.push("/register")
      }
      return
    }

    if (!isAuthenticated) {
      router.push(`/register?plan=${tier}`)
      return
    }

    setIsProcessing(tier)
    router.push(`/checkout?plan=${tier}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Invest in Your Child&apos;s Success
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Unlock full access to all PEP preparation materials and give your child the best chance to excel
          </p>
        </div>

        {/* Auth Notice */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-amber-800">
              Please{" "}
              <Link href="/login" className="font-semibold text-amber-700 hover:underline">
                sign in
              </Link>{" "}
              or{" "}
              <Link href="/register" className="font-semibold text-amber-700 hover:underline">
                create an account
              </Link>{" "}
              first to purchase a subscription.
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative border-2 ${
                tier.popular 
                  ? "border-amber-400 shadow-xl md:scale-105" 
                  : "border-sky-200"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white border-0 px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-xl text-slate-800">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      {tier.priceJMD === 0 ? "Free" : `$${tier.priceJMD.toLocaleString()}`}
                    </span>
                    {tier.priceJMD > 0 && (
                      <span className="text-slate-500 text-sm">JMD{tier.id === "monthly" ? "/month" : "/year"}</span>
                    )}
                  </div>
                  {tier.priceUSD > 0 && (
                    <p className="text-sm text-slate-500 mt-1">
                      ~${tier.priceUSD.toFixed(2)} USD
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                  
                  {/* Show excluded features for free tier */}
                  {tier.id === "free" && FREE_EXCLUDED_FEATURES.map((feature, index) => (
                    <li key={`excluded-${index}`} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-400 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={
                    isProcessing === tier.id || 
                    (user?.subscriptionTier === tier.id) ||
                    (isPremium && tier.id === "free")
                  }
                  className={`w-full ${
                    tier.popular
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : tier.id === "yearly"
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  {user?.subscriptionTier === tier.id ? (
                    "Current Plan"
                  ) : isProcessing === tier.id ? (
                    "Processing..."
                  ) : tier.id === "free" ? (
                    isAuthenticated ? "Current Plan" : "Get Started Free"
                  ) : (
                    "Pay with PayPal"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Info Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="border-sky-200 bg-sky-50/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-800 text-center mb-6 flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-sky-600" />
                Secure Payment with PayPal
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">Pay with any NCB, Scotiabank, or JMMB Visa/Mastercard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">No PayPal account needed - pay as guest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">Instant account activation after payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">7-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">How do I pay from Jamaica?</h4>
                <p className="text-slate-600">
                  You can pay using any Visa or MasterCard debit/credit card through PayPal. NCB, Scotiabank, JMMB, and other Jamaican bank cards are accepted. You don&apos;t need a PayPal account.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">How long does activation take?</h4>
                <p className="text-slate-600">
                  Your account is activated instantly after successful payment. You can start using all premium features right away!
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">Can I cancel my subscription?</h4>
                <p className="text-slate-600">
                  Yes, you can cancel anytime. Your access will continue until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">Is there a refund policy?</h4>
                <p className="text-slate-600">
                  We offer a 7-day money-back guarantee if you&apos;re not satisfied with the premium features.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-800 mb-2">How many children can use one account?</h4>
                <p className="text-slate-600">
                  Monthly plans are for 1 child. Yearly plans include a Family Account for up to 3 children.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-xl mx-auto border-sky-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Have Questions?</h3>
              <p className="text-slate-600 mb-4">
                We&apos;re here to help! Reach out to us for any questions about subscriptions or payment.
              </p>
              <Button variant="outline" className="border-sky-400 text-sky-600 hover:bg-sky-50">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
