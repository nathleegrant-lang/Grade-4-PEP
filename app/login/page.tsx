import { Suspense } from "react"
import LoginPageClient from "./login-page-client"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50" />}>
      <LoginPageClient />
    </Suspense>
  )
}
