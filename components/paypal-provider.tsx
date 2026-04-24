"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { ReactNode } from "react"

interface PayPalProviderProps {
  children: ReactNode
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

  if (!clientId) {
    console.warn("[v0] PayPal Client ID not configured")
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
