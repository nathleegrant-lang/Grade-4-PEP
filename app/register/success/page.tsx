import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="border-sky-200 shadow-lg overflow-hidden">
            <div className="bg-slate-950 px-6 py-5 flex justify-center">
              <Image
                src="/images/shazoniques-inspiration-logo.png"
                alt="Shazonique's Inspiration logo"
                width={220}
                height={100}
                className="h-auto w-[180px] sm:w-[220px]"
                priority
              />
            </div>

            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">
                Account Created
              </CardTitle>
              <CardDescription className="text-base">
                Your account was created. Please confirm your email if prompted, then sign in to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <Button asChild className="w-full bg-slate-700 hover:bg-slate-800">
                <Link href="/login">Go to Sign In</Link>
              </Button>

              <Link
                href="/"
                className="inline-block text-sm text-slate-500 hover:text-slate-700"
              >
                Return to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
