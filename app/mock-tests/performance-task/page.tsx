import Link from "next/link"
import { ArrowLeft, ClipboardList } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SubjectLevelCard } from "@/components/mock-tests/subject-level-card"

export default function PerformanceCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/mock-tests" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mock Tests
        </Link>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Performance Tasks</h1>
            <p className="text-slate-600 mt-2">
              Practice reading sources, answering responses, and writing with evidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SubjectLevelCard
              grade="grade4"
              subject="performance"
              difficulty="easy"
              title="Easy"
              descriptionLines={[
                "Stronger focus on direct source use",
                "Clearer questions and guidance",
                "Shorter written responses",
              ]}
              questionCount={7}
              durationMinutes={90}
              accentClass="bg-emerald-50"
              buttonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="performance"
              difficulty="moderate"
              title="Moderate"
              descriptionLines={[
                "Closer to standard Grade 4 PEP task level",
                "More combining of ideas",
                "Balanced written response demands",
              ]}
              questionCount={7}
              durationMinutes={90}
              accentClass="bg-sky-50"
              buttonClass="bg-sky-600 hover:bg-sky-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="performance"
              difficulty="difficult"
              title="Difficult"
              descriptionLines={[
                "More reasoning from multiple sources",
                "Stronger explanation and evidence",
                "Higher writing demand",
              ]}
              questionCount={7}
              durationMinutes={90}
              accentClass="bg-amber-50"
              buttonClass="bg-amber-500 hover:bg-amber-600 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="performance"
              difficulty="mixed"
              title="Mixed"
              descriptionLines={[
                "Best simulation model",
                "Blend of easier and more demanding parts",
                "Closest to realistic exam preparation",
              ]}
              questionCount={7}
              durationMinutes={90}
              accentClass="bg-violet-50"
              buttonClass="bg-violet-600 hover:bg-violet-700 text-white"
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5 text-center">
            <p className="text-sm text-slate-700">
              Use these tasks to build evidence-based writing, comprehension, and source-handling skills.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
