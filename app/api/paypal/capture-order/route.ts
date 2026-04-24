import { NextRequest, NextResponse } from "next/server"

const PAYPAL_API_URL = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com"

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const { orderID, plan } = await request.json()

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const captureData = await response.json()

    if (!response.ok) {
      console.error("PayPal capture error:", captureData)
      return NextResponse.json(
        { error: "Failed to capture PayPal order" },
        { status: 500 }
      )
    }

    // Payment successful - return subscription details
    const subscriptionEnd = new Date()
    if (plan === "yearly") {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
    }

    return NextResponse.json({
      success: true,
      transactionId: captureData.id,
      status: captureData.status,
      plan: plan,
      subscriptionEnd: subscriptionEnd.toISOString(),
    })
  } catch (error) {
    console.error("Capture order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
