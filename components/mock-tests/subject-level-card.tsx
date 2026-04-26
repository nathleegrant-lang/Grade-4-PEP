import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MAX_TEST_SLOTS, getTestHref, type DifficultyKey, type GradeKey, type SubjectKey } from "@/lib/mock-catalog"

type SubjectLevelCardProps = {
  grade?: GradeKey
  subject: SubjectKey
  level: DifficultyKey
  availableTests?: number[]
  questions: number
  minutes: number
  description?: string[]
}

const levelStyles: Record<DifficultyKey, { headerClass: string; buttonClass: string }> = {
  easy: {
    headerClass: "bg-emerald-50",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  moderate: {
    headerClass: "bg-blue-50",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  difficult: {
    headerClass: "bg-amber-50",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  mixed: {
    headerClass: "bg-slate-50",
    buttonClass: "bg-slate-700 hover:bg-slate-800 text-white",
  },
}

export default function SubjectLevelCard({
  grade = "grade4",
  subject,
  level,
  availableTests = [],
  questions,
  minutes,
  description = [],
}: SubjectLevelCardProps) {
  const styles = levelStyles[level]
  const slots = Array.from({ length: MAX_TEST_SLOTS }, (_, i) => i + 1)

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className={styles.headerClass}>
        <CardTitle className="text-2xl text-slate-800 capitalize">{level}</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2 text-slate-700">
          {description.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-3xl font-bold text-slate-800">{questions}</p>
            <p className="text-sm text-slate-600">Questions</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-3xl font-bold text-slate-800">{minutes}</p>
            <p className="text-sm text-slate-600">Minutes</p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-800 mb-3">Available Tests</p>
          <div className="flex flex-wrap gap-2">
            {slots.map((testNumber) => {
              const isAvailable = availableTests.includes(testNumber)

              if (!isAvailable) {
                return (
                  <span
                    key={testNumber}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-400"
                  >
                    {testNumber}
                  </span>
                )
              }

              return (
                <Link
                  key={testNumber}
                  href={getTestHref(subject, level, testNumber, grade)}
                >
                  <Button size="sm" className={`h-8 w-8 p-0 ${styles.buttonClass}`}>
                    {testNumber}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
