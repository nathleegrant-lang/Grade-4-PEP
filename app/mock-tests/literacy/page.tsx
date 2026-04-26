import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { SubjectLevelCard } from "@/components/mock-tests/subject-level-card"

export default function LiteracyCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/mock-tests" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mock Tests
        </Link>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Literacy Mock Tests</h1>
            <p className="text-slate-600 mt-2">
              Build confidence with levelled Grade 4 literacy practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SubjectLevelCard
              grade="grade4"
              subject="literacy"
              difficulty="easy"
              title="Easy"
              descriptionLines={[
                "Shorter passages",
                "Direct recall",
                "Clear text clues",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-emerald-50"
              buttonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="literacy"
              difficulty="moderate"
              title="Moderate"
              descriptionLines={[
                "Closer to standard Grade 4 PEP level",
                "More inference and main idea",
                "A few two-step thinking items",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-sky-50"
              buttonClass="bg-sky-600 hover:bg-sky-700 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="literacy"
              difficulty="difficult"
              title="Difficult"
              descriptionLines={[
                "More reasoning-based",
                "Stronger distractors",
                "Closer reading and editing in context",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-amber-50"
              buttonClass="bg-amber-500 hover:bg-amber-600 text-white"
            />

            <SubjectLevelCard
              grade="grade4"
              subject="literacy"
              difficulty="mixed"
              title="Mixed"
              descriptionLines={[
                "Best simulation model",
                "A blend of easy, moderate, and difficult items",
                "Closest to realistic exam preparation",
              ]}
              questionCount={40}
              durationMinutes={60}
              accentClass="bg-violet-50"
              buttonClass="bg-violet-600 hover:bg-violet-700 text-white"
            />
          </div>

          <div className="rounded-xl border border-sky-200 bg-white p-5 text-center">
            <p className="text-sm text-slate-700">
              Start with Easy 1 to build confidence, then move to Moderate, Difficult, and Mixed.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
