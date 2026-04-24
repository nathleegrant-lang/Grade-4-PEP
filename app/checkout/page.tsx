"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { PRICING_TIERS, SubscriptionTier } from "@/lib/types"
import { Crown, Shield, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading, upgradeSubscription } = useAuth()
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const planId = searchParams.get("plan") as SubscriptionTier
  const plan = PRICING_TIERS.find((t) => t.id === planId)

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

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

  const handlePaymentSuccess = (orderId: string) => {
    console.log("[v0] Payment successful, order ID:", orderId)
    upgradeSubscription(plan.id)
    setPaymentComplete(true)
    setIsProcessing(false)
  }

  const handlePaymentError = (error: string) => {
    console.error("[v0] Payment error:", error)
    setPaymentError(error)
    setIsProcessing(false)
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <div className="max-w-md mx-auto">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Payment Successful!</CardTitle>
                <CardDescription>
                  Your account has been upgraded to {plan.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-slate-600">
                  Thank you for subscribing! You now have full access to all premium features.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard">
                    <Button className="w-full bg-slate-700 hover:bg-slate-800">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/mock-tests">
                    <Button variant="outline" className="w-full">
                      Start a Mock Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
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

        <div className="max-w-2xl mx-auto">
          <Card className="border-sky-200 shadow-lg">
            <CardHeader className="text-center border-b">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Complete Your Purchase</CardTitle>
              <CardDescription>
                Upgrade to {plan.name} for {user?.childName}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Order Summary */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">{plan.name} Plan</span>
                  <span className="font-medium text-slate-800">
                    ${plan.priceJMD.toLocaleString()} JMD
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Billing Period</span>
                  <span className="capitalize">{plan.period}</span>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Total</span>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-800">
                      ${plan.priceUSD.toFixed(2)} USD
                    </p>
                    <p className="text-xs text-slate-500">
                      (${plan.priceJMD.toLocaleString()} JMD)
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Payment Failed</p>
                    <p className="text-sm text-red-600">{paymentError}</p>
                    <button 
                      onClick={() => setPaymentError(null)}
                      className="text-sm text-red-700 underline mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* PayPal Payment */}
              <div className="space-y-4">
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-800 mb-4 text-center">
                    Pay Securely with PayPal
                  </h4>
                  
                  {paypalClientId ? (
                    <PayPalScriptProvider
                      options={{
                        clientId: paypalClientId,
                        currency: "USD",
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "blue",
                          shape: "rect",
                          label: "pay",
                        }}
                        disabled={isProcessing}
                        createOrder={async () => {
                          setIsProcessing(true)
                          setPaymentError(null)
                          try {
                            const response = await fetch("/api/paypal/create-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ plan: plan.id }),
                            })
                            const data = await response.json()
                            if (!response.ok) {
                              throw new Error(data.error || "Failed to create order")
                            }
                            return data.id
                          } catch (error) {
                            handlePaymentError(error instanceof Error ? error.message : "Failed to create order")
                            throw error
                          }
                        }}
                        onApprove={async (data) => {
                          try {
                            const response = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ orderID: data.orderID, plan: plan.id }),
                            })
                            const captureData = await response.json()
                            if (!response.ok) {
                              throw new Error(captureData.error || "Failed to capture payment")
                            }
                            handlePaymentSuccess(captureData.transactionId)
                          } catch (error) {
                            handlePaymentError(error instanceof Error ? error.message : "Failed to process payment")
                          }
                        }}
                        onError={(err) => {
                          handlePaymentError(
                            err instanceof Error 
                              ? err.message 
                              : "An error occurred during payment. Please try again."
                          )
                        }}
                        onCancel={() => {
                          setIsProcessing(false)
                          setPaymentError("Payment was cancelled. Please try again.")
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                      <p className="text-amber-800 font-medium">PayPal Not Configured</p>
                      <p className="text-sm text-amber-600 mt-1">
                        Please contact support to complete your purchase.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Shield className="h-4 w-4" />
                <span>Secure payment processed by PayPal</span>
              </div>

              {/* Plan Features */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-slate-800 mb-3">What you&apos;ll get:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Having trouble? Contact us at{" "}
            <a href="mailto:support@grade4pep.com" className="text-sky-600 hover:text-sky-700">
              support@grade4pep.com
            </a>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
