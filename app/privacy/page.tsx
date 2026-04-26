"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Lock, Users, FileText, MessageCircleMore } from "lucide-react"
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site-config"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="h-8 w-8 text-sky-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              This Privacy Policy explains how Grade 4 PEP collects, uses, stores, and protects
              information shared by parents and guardians using the platform.
            </p>
            <p className="text-slate-300 text-sm mt-4">Last updated: April 2026</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Who this policy applies to</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  Grade 4 PEP is designed for use by parents or guardians supporting children with
                  Grade 4 learning and exam preparation. Accounts should be created by an adult on
                  behalf of a child.
                </p>
                <p>
                  By using this platform, you confirm that you are a parent, guardian, or other
                  authorized adult responsible for the child connected to the account.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-sky-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-600" />
                    Information we collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-700 space-y-3 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Parent or guardian name</li>
                    <li>Student name</li>
                    <li>Email address</li>
                    <li>WhatsApp or phone number, if provided</li>
                    <li>Plan and subscription details</li>
                    <li>Payment reference information submitted for verification</li>
                    <li>Learning activity, access, and account-related usage information</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-sky-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-sky-600" />
                    How we use information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-700 space-y-3 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To create and manage accounts</li>
                    <li>To provide access to Grade 4 PEP resources and features</li>
                    <li>To verify payments and activate subscriptions</li>
                    <li>To communicate important account or support information</li>
                    <li>To improve the learning experience and platform operations</li>
                    <li>To maintain safety, security, and service reliability</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-sky-600" />
                  Children&apos;s information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  Because this platform supports children, we expect all student-related
                  information to be submitted by a parent or guardian. We do not intend for
                  children to create accounts for themselves.
                </p>
                <p>
                  Student information is used only for educational access, account setup, support,
                  subscription management, and related platform functions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Payments and verification</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  When you submit payment details, we may collect plan information, amount,
                  payment reference, and any note you provide for verification.
                </p>
                <p>
                  Banking information is shared through the payment process or support channels and
                  is used only to confirm and process access requests.
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Storage and security</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  We take reasonable steps to protect personal information from unauthorized
                  access, misuse, or disclosure. No website or online service can promise absolute
                  security, but we aim to use appropriate safeguards for the information we store.
                </p>
                <p>
                  Access to account and payment-related information is limited to what is needed to
                  operate, support, and manage the service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  We keep personal information only for as long as it is reasonably needed for
                  account administration, support, payment verification, subscription management,
                  record-keeping, and legitimate business or legal purposes.
                </p>
                <p>
                  When information is no longer reasonably required, we aim to remove or limit it
                  according to our operational needs and legal obligations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Your choices</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>You may contact us to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Request help with correcting account details</li>
                  <li>Ask questions about how information is used</li>
                  <li>Request account-related support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <MessageCircleMore className="h-5 w-5 text-sky-600" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-3 leading-relaxed">
                <p>
                  If you have questions about this Privacy Policy or your account, please contact
                  us by WhatsApp.
                </p>
                <p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-sky-700 hover:underline"
                  >
                    WhatsApp: {WHATSAPP_DISPLAY}
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">Changes to this policy</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. Any updates will be posted
                  on this page with a revised update date.
                </p>
              </CardContent>
            </Card>

            <div className="text-center pt-2">
              <Link href="/register" className="text-sky-700 font-medium hover:underline">
                Return to registration
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
