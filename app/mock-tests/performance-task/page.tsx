import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import SubjectLevelCard from "@/components/mock-tests/subject-level-card"
import { getSubjectCatalog } from "@/lib/mock-catalog"

export default function PerformanceCategoryPage() {
  const catalog = getSubjectCatalog("performance")

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">Performance Task Mock Tests</h1>
            <p className="text-slate-600">
              Build reading, evidence, and writing skills through levelled performance tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SubjectLevelCard
              subject="performance"
              level="easy"
              availableTests={catalog.easy}
              questions={1}
              minutes={90}
              description={[
                "Stronger focus on direct information",
                "Guided short responses",
                "Simple structured writing",
              ]}
            />

            <SubjectLevelCard
              subject="performance"
              level="moderate"
              availableTests={catalog.moderate}
              questions={1}
              minutes={90}
              description={[
                "Closer to standard Grade 4 PEP level",
                "Evidence from sources",
                "More developed written responses",
              ]}
            />

            <SubjectLevelCard
              subject="performance"
              level="difficult"
              availableTests={catalog.difficult}
              questions={1}
              minutes={90}
              description={[
                "More reasoning-based responses",
                "Stronger use of evidence",
                "More careful organization and writing",
              ]}
            />

            <SubjectLevelCard
              subject="performance"
              level="mixed"
              availableTests={catalog.mixed}
              questions={1}
              minutes={90}
              description={[
                "Blend of easy, moderate, and difficult skills",
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
