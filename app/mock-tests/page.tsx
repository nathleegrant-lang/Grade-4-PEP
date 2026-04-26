import Image from "next/image"
import Link from "next/link"
import { BookOpen, Calculator, ClipboardList, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  {
    title: "Literacy Mock Tests",
    description:
      "Build reading, vocabulary, grammar, and writing confidence with easy, moderate, difficult, and mixed mock tests.",
    href: "/mock-tests/literacy",
    icon: BookOpen,
    accent: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    tests: ["Easy 1", "Moderate 1", "Difficult 1", "Mixed 1"],
  },
  {
    title: "Numeracy Mock Tests",
    description:
      "Strengthen number operations, measurement, geometry, and data skills with tiered practice tests and report downloads.",
    href: "/mock-tests/numeracy",
    icon: Calculator,
    accent: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tests: ["Easy 1", "Moderate 1", "Difficult 1", "Mixed 1"],
  },
  {
    title: "Performance Task Mock Tests",
    description:
      "Practice reading sources, answering short responses, and completing extended writing tasks with structured review.",
    href: "/mock-tests/performance",
    icon: ClipboardList,
    accent: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    tests: ["Easy 1", "Moderate 1", "Difficult 1", "Mixed 1"],
  },
]

export default function MockTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
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
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Grade 4 PEP Mock Tests</h1>
          <p className="text-lg text-slate-600">
            Choose a subject area, then select the difficulty level that best fits your child&apos;s preparation needs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.title} className={`${category.border} border-2 shadow-lg flex flex-col`}>
                <CardHeader className={`${category.bg} rounded-t-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full bg-white p-3 shadow-sm">
                      <Icon className={`h-7 w-7 ${category.accent}`} />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">{category.title}</CardTitle>
                  </div>
                  <p className="text-slate-600 text-sm leading-6">{category.description}</p>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Available now</p>
                    <div className="flex flex-wrap gap-2">
                      {category.tests.map((test) => (
                        <span
                          key={test}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link href={category.href}>
                      <Button className="w-full bg-slate-700 hover:bg-slate-800">
                        Explore {category.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
