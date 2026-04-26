import Link from "next/link"
import { ArrowLeft, Calculator } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SubjectLevelCard } from "@/components/mock-tests/subject-level-card"

export default function NumeracyCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/mock-tests" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mock Tests
        </Link>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Numeracy Mock Tests</h1>
            <p className="text-slate-600 mt-2">
              Strengthen number sense, reasoning, and problem-solving with levelled practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SubjectLevelCard
              grade="grade4"
              subject="numeracy"
              difficulty="easy"
              title="Easy"
              descriptionLines={[
                "Direct calculations",
                "Clear problem structure",
                "Simple distractors",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-emerald-50"
              buttonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="numeracy"
              difficulty="moderate"
              title="Moderate"
              descriptionLines={[
                "Closer to standard Grade 4 PEP level",
                "More applied problem-solving",
                "Some two-step thinking",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-blue-50"
              buttonClass="bg-blue-600 hover:bg-blue-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="numeracy"
              difficulty="difficult"
              title="Difficult"
              descriptionLines={[
                "More reasoning-based",
                "Closer reading of word problems",
                "Stronger distractors",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-amber-50"
              buttonClass="bg-amber-500 hover:bg-amber-600 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="numeracy"
              difficulty="mixed"
              title="Mixed"
              descriptionLines={[
                "Best simulation model",
                "Blend of all difficulty levels",
                "Closest to realistic exam preparation",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-violet-50"
              buttonClass="bg-violet-600 hover:bg-violet-700 text-white"
            />
          </div>

          <div className="rounded-xl border border-blue-200 bg-white p-5 text-center">
            <p className="text-sm text-slate-700">
              Build confidence step by step, then use Mixed papers for a full exam-style challenge.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
