import { Suspense } from "react"
import LoginPageClient from "./login-page-client"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
          <p className="text-slate-600 text-sm">Loading sign in...</p>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  )
}
