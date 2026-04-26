import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import SubjectLevelCard from "@/components/mock-tests/subject-level-card"
import { getSubjectCatalog } from "@/lib/mock-catalog"

export default function NumeracyCategoryPage() {
  const catalog = getSubjectCatalog("numeracy")

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">Numeracy Mock Tests</h1>
            <p className="text-slate-600">
              Strengthen number sense, reasoning, and problem-solving with levelled practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SubjectLevelCard
              subject="numeracy"
              level="easy"
              availableTests={catalog.easy}
              questions={40}
              minutes={60}
              description={[
                "Direct calculations",
                "Clear problem structure",
                "Simple distractors",
              ]}
            />

            <SubjectLevelCard
              subject="numeracy"
              level="moderate"
              availableTests={catalog.moderate}
              questions={40}
              minutes={60}
              description={[
                "Closer to standard Grade 4 PEP level",
                "More applied problem-solving",
                "Some two-step thinking",
              ]}
            />

            <SubjectLevelCard
              subject="numeracy"
              level="difficult"
              availableTests={catalog.difficult}
              questions={40}
              minutes={60}
              description={[
                "More reasoning-based",
                "Stronger distractors",
                "Closer reading of problems",
              ]}
            />

            <SubjectLevelCard
              subject="numeracy"
              level="mixed"
              availableTests={catalog.mixed}
              questions={40}
              minutes={60}
              description={[
                "Blend of easy, moderate, and difficult items",
                "Best exam-style simulation",
                "Strong preparation for formal assessment",
              ]}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
