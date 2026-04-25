import { Suspense } from "react"
import RegisterPageClient from "./register-page-client"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50" />}>
      <RegisterPageClient />
    </Suspense>
  )
}
