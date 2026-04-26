import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Lightbulb, Target, Sparkles, MessageCircleMore, WalletCards } from "lucide-react"
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site-config"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Grade 4 PEP</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              A guided digital learning space designed to help Jamaican families prepare with confidence.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-sky-400 border-t-4 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center">
                  <div className="mb-8">
                    <div className="relative w-full max-w-xl h-72 md:h-80 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/creator.jpg"
                        alt="Nathlee R. Grant - Creator of Grade 4 PEP"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    <p className="text-center mt-4 text-slate-700 font-medium">Nathlee R. Grant</p>
                    <p className="text-center text-sm text-slate-500 italic max-w-sm md:max-w-md">
                      &quot;Circumstances dictate the narrative, but choices determine the outcome.&quot;
                    </p>
                  </div>

                  <div className="prose prose-lg max-w-none text-center">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      This platform was created by <strong className="text-slate-800">Nathlee R. Grant</strong> through{" "}
                      <strong className="text-slate-800">Shazonique&apos;s Inspiration</strong> to help young Jamaican learners
                      practise, review, and grow in confidence.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Grade 4 PEP gives parents a structured way to support learning at home through topic practice,
                      mock tests, study guides, and printable resources.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      <em className="text-slate-800 font-medium">
                        The goal is to inspire learning, build confidence, and help every student reach their full potential.
                      </em>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Uplift & Empower</h3>
                      <p className="text-gray-600">
                        Provide a child-friendly digital learning experience that encourages growth and confidence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Structured Learning</h3>
                      <p className="text-gray-600">
                        Offer a clear pathway from free exploration to verified paid access for full Grade 4 support.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">PEP Focused</h3>
                      <p className="text-gray-600">
                        Keep all content aligned with the Grade 4 PEP pathway and Jamaican classroom expectations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Parent Friendly</h3>
                      <p className="text-gray-600">
                        Parents can create accounts, submit payments, and monitor access from the dashboard.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <Card className="border-sky-200">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <MessageCircleMore className="h-5 w-5 text-sky-600" />
                    Support
                  </div>
                  <p className="text-slate-600 text-sm">
                    Questions about access, payment verification, or student setup? Reach out by WhatsApp.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">WhatsApp:</span>{" "}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:underline"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-sky-200">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <WalletCards className="h-5 w-5 text-sky-600" />
                    Payment Information
                  </div>
                  <p className="text-slate-600 text-sm">
                    Grade 4 is a separate product. Paid access is activated after payment verification.
                  </p>
                  <p className="text-slate-600 text-sm">
                    For security, bank transfer details are not displayed publicly on this page.
                  </p>
                  <p className="text-slate-600 text-sm">
                    Payment instructions are provided during checkout or through direct support.
                  </p>
                  <p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:underline font-semibold"
                    >
                      Contact WhatsApp for payment help
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
