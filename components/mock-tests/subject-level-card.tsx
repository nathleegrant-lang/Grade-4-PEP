import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  getAvailableTests,
  getTestHref,
  MAX_TEST_SLOTS,
  type DifficultyKey,
  type GradeKey,
  type SubjectKey,
} from "@/lib/mock-catalog"

type SubjectLevelCardProps = {
  grade: GradeKey
  subject: SubjectKey
  difficulty: DifficultyKey
  title: string
  descriptionLines: string[]
  questionCount: number
  durationMinutes: number
  accentClass: string
  buttonClass: string
}

export default function SubjectLevelCard({
  grade,
  subject,
  difficulty,
  title,
  descriptionLines,
  questionCount,
  durationMinutes,
  accentClass,
  buttonClass,
}: SubjectLevelCardProps) {
  const availableTests = getAvailableTests(grade, subject, difficulty)

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className={cn("rounded-t-lg border-b", accentClass)}>
        <CardTitle className="text-xl text-slate-800">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <div className="space-y-1 text-sm text-slate-700">
          {descriptionLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xl font-bold text-slate-800">{questionCount}</p>
            <p className="text-xs text-slate-600">Questions</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xl font-bold text-slate-800">{durationMinutes}</p>
            <p className="text-xs text-slate-600">Minutes</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Available Tests</p>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: MAX_TEST_SLOTS }, (_, index) => index + 1).map((testNumber) => {
              const isAvailable = availableTests.includes(testNumber)

              if (isAvailable) {
                return (
                  <Link key={testNumber} href={getTestHref(subject, difficulty, testNumber, grade)}>
                    <Button className={cn("h-9 min-w-9 px-3", buttonClass)}>{testNumber}</Button>
                  </Link>
                )
              }

              return (
                <Button
                  key={testNumber}
                  variant="outline"
                  disabled
                  className="h-9 min-w-9 px-3 text-slate-400 border-slate-200"
                >
                  {testNumber}
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
