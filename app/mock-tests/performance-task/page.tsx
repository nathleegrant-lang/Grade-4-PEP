import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ClipboardList } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const performanceLevels = [
  {
    title: "Easy",
    description: ["Simpler source reading", "Direct information retrieval", "Shorter writing expectations"],
    hrefBase: "/mock-tests/performance/easy",
    accent: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    title: "Moderate",
    description: ["Standard Grade 4 PEP task level", "Evidence from sources", "Balanced writing demands"],
    hrefBase: "/mock-tests/performance/moderate",
    accent: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    title: "Difficult",
    description: ["More reasoning-based responses", "Stronger source integration", "Longer written thinking"],
    hrefBase: "/mock-tests/performance/difficult",
    accent: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    title: "Mixed",
    description: ["Easy, moderate, and difficult blend", "Realistic exam preparation", "Best for full task simulation"],
    hrefBase: "/mock-tests/performance/mixed",
    accent: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
]

const testNumbers = [1, 2, 3, 4, 5]

export default function PerformanceCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/mock-tests" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mock Tests
        </Link>

        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="mx-auto mb-5 rounded-xl bg-black p-3 w-fit shadow-sm">
            <Image
              src="/images/shazoniques-inspiration-logo.png"
              alt="Shazonique's Inspiration logo"
              width={220}
              height={100}
              className="h-auto w-[180px] sm:w-[220px]"
              priority
            />
          </div>
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-amber-100 p-4 shadow-sm">
              <ClipboardList className="h-8 w-8 text-amber-700" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Performance Task Mock Tests</h1>
          <p className="text-lg text-slate-600">
            Select the task level you want to practise, then choose a test number.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {performanceLevels.map((level) => (
            <Card key={level.title} className={`${level.border} border-2 shadow-lg`}>
              <CardHeader className={`${level.bg} rounded-t-lg`}>
                <CardTitle className={`text-2xl ${level.accent}`}>{level.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-sm text-slate-700 mb-5">
                  {level.description.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-4 text-center mb-5">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-2xl font-bold text-slate-800">7</p>
                    <p className="text-xs text-slate-500">Task Parts</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-2xl font-bold text-slate-800">90</p>
                    <p className="text-xs text-slate-500">Minutes</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Available Tests</p>
                  <div className="flex flex-wrap gap-2">
                    {testNumbers.map((num) => {
                      const isAvailable = num === 1
                      return isAvailable ? (
                        <Link key={num} href={`${level.hrefBase}-${num}`}>
                          <Button className="bg-slate-700 hover:bg-slate-800 min-w-10">{num}</Button>
                        </Link>
                      ) : (
                        <Button key={num} variant="outline" disabled className="min-w-10 opacity-60">
                          {num}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
