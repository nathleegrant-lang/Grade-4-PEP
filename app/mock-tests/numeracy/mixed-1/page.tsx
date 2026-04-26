"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, Calculator, RotateCcw, Home, Lock, Crown, ArrowLeft, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const FREE_QUESTION_LIMIT = 5

interface Question {
  id: number
  type: "number" | "measurement" | "geometry" | "data"
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const numeracyQuestions: Question[] = [
  // Number Operations (1-15)
  {
    id: 1,
    type: "number",
    question: "What is 392 + 186?",
    options: ["568", "578", "588", "598"],
    correctAnswer: 1,
    explanation: "392 + 186 = 578. Add the ones first: 2 + 6 = 8, tens: 9 + 8 = 17, write 7 and carry 1, then hundreds: 3 + 1 + 1 = 5.",
  },
  {
    id: 2,
    type: "number",
    question: "What is 700 - 248?",
    options: ["442", "452", "462", "472"],
    correctAnswer: 1,
    explanation: "700 - 248 = 452. Regroup 700 as 6 hundreds, 9 tens, and 10 ones, then subtract.",
  },
  {
    id: 3,
    type: "number",
    question: "What is 36 × 7?",
    options: ["242", "252", "262", "272"],
    correctAnswer: 1,
    explanation: "36 × 7 = (30 × 7) + (6 × 7) = 210 + 42 = 252.",
  },
  {
    id: 4,
    type: "number",
    question: "What is 168 ÷ 8?",
    options: ["18", "19", "20", "21"],
    correctAnswer: 3,
    explanation: "168 ÷ 8 = 21 because 8 × 21 = 168.",
  },
  {
    id: 5,
    type: "number",
    question: "Which fraction is equivalent to 3/4?",
    options: ["6/10", "6/8", "9/16", "2/6"],
    correctAnswer: 1,
    explanation: "6/8 is equivalent to 3/4 because both numerator and denominator can be divided by 2 to get 3/4.",
  },
  {
    id: 6,
    type: "number",
    question: "What is 2/8 + 3/8?",
    options: ["5/8", "5/16", "1/8", "6/8"],
    correctAnswer: 0,
    explanation: "When the denominators are the same, add the numerators: 2/8 + 3/8 = 5/8.",
  },
  {
    id: 7,
    type: "number",
    question: "Round 6,451 to the nearest hundred.",
    options: ["6,400", "6,500", "6,450", "6,000"],
    correctAnswer: 1,
    explanation: "The tens digit is 5, so we round the hundreds up. 6,451 rounded to the nearest hundred is 6,500.",
  },
  {
    id: 8,
    type: "number",
    question: "What is the value of 8 in 5,824?",
    options: ["8", "80", "800", "8,000"],
    correctAnswer: 2,
    explanation: "In 5,824, the 8 is in the hundreds place, so its value is 800.",
  },
  {
    id: 9,
    type: "number",
    question: "Which decimal is greatest? 0.6, 0.56, 0.65, 0.59",
    options: ["0.6", "0.56", "0.65", "0.59"],
    correctAnswer: 2,
    explanation: "0.65 is greatest because it has 6 tenths and 5 hundredths, which is more than 0.60, 0.59, or 0.56.",
  },
  {
    id: 10,
    type: "number",
    question: "A student has $100 and spends $37.50. How much money is left?",
    options: ["$61.50", "$62.50", "$63.50", "$64.50"],
    correctAnswer: 1,
    explanation: "$100.00 - $37.50 = $62.50.",
  },
  {
    id: 11,
    type: "number",
    question: "What is the next number in the pattern: 12, 18, 24, 30, ___?",
    options: ["34", "35", "36", "38"],
    correctAnswer: 2,
    explanation: "The pattern increases by 6 each time. 30 + 6 = 36.",
  },
  {
    id: 12,
    type: "number",
    question: "Which is greater: 5/6 or 7/9?",
    options: ["5/6", "7/9", "They are equal", "Cannot tell"],
    correctAnswer: 0,
    explanation: "Compare using a common denominator: 5/6 = 15/18 and 7/9 = 14/18. Since 15/18 is greater, 5/6 is greater.",
  },
  {
    id: 13,
    type: "number",
    question: "A shop packed 96 pencils into boxes of 6. How many boxes were needed?",
    options: ["14", "15", "16", "18"],
    correctAnswer: 2,
    explanation: "96 ÷ 6 = 16, so 16 boxes were needed.",
  },
  {
    id: 14,
    type: "number",
    question: "Write 0.4 as a fraction in simplest form.",
    options: ["4/100", "4/10", "2/5", "1/5"],
    correctAnswer: 2,
    explanation: "0.4 = 4/10, and 4/10 simplifies to 2/5.",
  },
  {
    id: 15,
    type: "number",
    question: "If 3 packs hold 24 stickers, how many stickers are in 5 packs?",
    options: ["35", "40", "45", "48"],
    correctAnswer: 1,
    explanation: "If 3 packs hold 24 stickers, then 1 pack holds 8 stickers. 5 packs hold 5 × 8 = 40 stickers.",
  },

  // Measurement (16-25)
  {
    id: 16,
    type: "measurement",
    question: "How many milliliters are in 2 liters?",
    options: ["20 mL", "200 mL", "2,000 mL", "20,000 mL"],
    correctAnswer: 2,
    explanation: "1 liter = 1,000 milliliters, so 2 liters = 2,000 mL.",
  },
  {
    id: 17,
    type: "measurement",
    question: "A bus trip started at 9:20 AM and ended at 11:05 AM. How long was the trip?",
    options: ["1 hour 35 minutes", "1 hour 45 minutes", "1 hour 50 minutes", "2 hours 5 minutes"],
    correctAnswer: 1,
    explanation: "From 9:20 to 10:20 is 1 hour, and from 10:20 to 11:05 is 45 minutes. Total = 1 hour 45 minutes.",
  },
  {
    id: 18,
    type: "measurement",
    question: "How many centimeters are in 2.4 meters?",
    options: ["24 cm", "240 cm", "2,400 cm", "204 cm"],
    correctAnswer: 1,
    explanation: "1 meter = 100 centimeters, so 2.4 meters = 240 centimeters.",
  },
  {
    id: 19,
    type: "measurement",
    question: "What is the perimeter of a square with side length 9 cm?",
    options: ["18 cm", "27 cm", "36 cm", "81 cm"],
    correctAnswer: 2,
    explanation: "Perimeter of a square = 4 × side length = 4 × 9 = 36 cm.",
  },
  {
    id: 20,
    type: "measurement",
    question: "A bottle holds 750 mL of water. How many such bottles are needed to make 3 liters?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "3 liters = 3,000 mL. 3,000 ÷ 750 = 4 bottles.",
  },
  {
    id: 21,
    type: "measurement",
    question: "What is the area of a rectangle with length 7 cm and width 4 cm?",
    options: ["11 cm²", "22 cm²", "28 cm²", "36 cm²"],
    correctAnswer: 2,
    explanation: "Area = length × width = 7 × 4 = 28 cm².",
  },
  {
    id: 22,
    type: "measurement",
    question: "The temperature was 18°C in the morning and rose to 27°C by noon. By how many degrees did it rise?",
    options: ["7°C", "8°C", "9°C", "10°C"],
    correctAnswer: 2,
    explanation: "27 - 18 = 9, so the temperature rose by 9°C.",
  },
  {
    id: 23,
    type: "measurement",
    question: "School begins at 8:15 AM and finishes at 2:45 PM. How long is the school day?",
    options: ["6 hours", "6 hours 15 minutes", "6 hours 30 minutes", "6 hours 45 minutes"],
    correctAnswer: 2,
    explanation: "From 8:15 AM to 2:15 PM is 6 hours. Add 30 more minutes to reach 2:45 PM.",
  },
  {
    id: 24,
    type: "measurement",
    question: "Which unit is best for measuring the mass of a pineapple?",
    options: ["grams or kilograms", "liters", "centimeters", "hours"],
    correctAnswer: 0,
    explanation: "Mass is measured in grams or kilograms, not liters, centimeters, or hours.",
  },
  {
    id: 25,
    type: "measurement",
    question: "A farmer packed 5 kg of flour into bags of 250 g each. How many bags were filled?",
    options: ["10", "15", "20", "25"],
    correctAnswer: 2,
    explanation: "5 kg = 5,000 g. 5,000 ÷ 250 = 20 bags.",
  },

  // Geometry (26-32)
  {
    id: 26,
    type: "geometry",
    question: "How many vertices does a rectangular prism have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    explanation: "A rectangular prism has 8 vertices, just like a cube.",
  },
  {
    id: 27,
    type: "geometry",
    question: "What type of angle is greater than 90° but less than 180°?",
    options: ["Acute", "Right", "Obtuse", "Straight"],
    correctAnswer: 2,
    explanation: "An obtuse angle is more than 90° but less than 180°.",
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape always has exactly one pair of parallel sides?",
    options: ["Square", "Rectangle", "Trapezoid", "Triangle"],
    correctAnswer: 2,
    explanation: "A trapezoid has one pair of parallel sides.",
  },
  {
    id: 29,
    type: "geometry",
    question: "A triangle has angles measuring 50°, 60°, and 70°. What kind of triangle is it by angle size?",
    options: ["Right triangle", "Obtuse triangle", "Acute triangle", "Equilateral triangle"],
    correctAnswer: 2,
    explanation: "All three angles are less than 90°, so it is an acute triangle.",
  },
  {
    id: 30,
    type: "geometry",
    question: "How many lines of symmetry does a square have?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 3,
    explanation: "A square has 4 lines of symmetry: vertical, horizontal, and two diagonals.",
  },
  {
    id: 31,
    type: "geometry",
    question: "Which statement about a circle is true?",
    options: ["It has 4 sides.", "It has 1 vertex.", "It has no corners.", "It has 2 parallel sides."],
    correctAnswer: 2,
    explanation: "A circle has no corners or vertices.",
  },
  {
    id: 32,
    type: "geometry",
    question: "If two lines cross to make four right angles, the lines are called:",
    options: ["parallel", "perpendicular", "curved", "diagonal"],
    correctAnswer: 1,
    explanation: "Perpendicular lines meet at right angles.",
  },

  // Data & Statistics (33-40)
  {
    id: 33,
    type: "data",
    question: "In a class survey, 9 students chose mango, 6 chose orange, 5 chose banana, and 10 chose apple. How many students were surveyed?",
    options: ["25", "28", "30", "32"],
    correctAnswer: 2,
    explanation: "Add all the choices: 9 + 6 + 5 + 10 = 30 students.",
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of: 2, 5, 5, 7, 8, 5, 9?",
    options: ["2", "5", "7", "9"],
    correctAnswer: 1,
    explanation: "The mode is the number that appears most often. 5 appears 3 times.",
  },
  {
    id: 35,
    type: "data",
    question: "Find the range of: 11, 19, 7, 25, 14",
    options: ["14", "16", "18", "25"],
    correctAnswer: 2,
    explanation: "Range = greatest number - smallest number = 25 - 7 = 18.",
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of: 4, 6, 8, 10, 14?",
    options: ["6", "8", "10", "14"],
    correctAnswer: 1,
    explanation: "The median is the middle number in order. The middle number is 8.",
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph shows 4 stars, and each star stands for 3 books. How many books are shown?",
    options: ["7", "9", "12", "16"],
    correctAnswer: 2,
    explanation: "4 stars × 3 books each = 12 books.",
  },
  {
    id: 38,
    type: "data",
    question: "A bar graph shows 18 students chose football and 12 chose netball. How many more students chose football?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 2,
    explanation: "18 - 12 = 6, so 6 more students chose football.",
  },
  {
    id: 39,
    type: "data",
    question: "Find the mean of: 8, 12, 16, 20",
    options: ["12", "14", "16", "18"],
    correctAnswer: 1,
    explanation: "Mean = (8 + 12 + 16 + 20) ÷ 4 = 56 ÷ 4 = 14.",
  },
  {
    id: 40,
    type: "data",
    question: "If 1/5 of 35 students are absent, how many are present?",
    options: ["7", "21", "28", "30"],
    correctAnswer: 2,
    explanation: "1/5 of 35 = 7 absent. 35 - 7 = 28 present.",
  },
]

export default function NumeracyMixed1Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyQuestions : numeracyQuestions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => {
    if (answers.length !== totalQuestions) {
      setAnswers(new Array(totalQuestions).fill(null))
    }
  }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCompletedAt(new Date().toLocaleString())
            setTestCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (index < availableQuestions.length && answer === availableQuestions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const getScorePercentage = () => {
    return Math.round((calculateScore() / totalQuestions) * 100)
  }

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionTitle = (type: Question["type"]) => {
    switch (type) {
      case "number":
        return "Number Operations"
      case "measurement":
        return "Measurement"
      case "geometry":
        return "Geometry"
      default:
        return "Data & Statistics"
    }
  }

  const getSectionSummary = () => {
    const sections: Question["type"][] = ["number", "measurement", "geometry", "data"]

    return sections.map((section) => {
      const sectionQuestions = availableQuestions.filter((q) => q.type === section)
      const sectionIndices = availableQuestions
        .map((q, index) => ({ q, index }))
        .filter((item) => item.q.type === section)

      const correct = sectionIndices.filter((item) => answers[item.index] === item.q.correctAnswer).length
      const total = sectionQuestions.length
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

      let note = "Needs more practice"
      if (percentage >= 85) note = "Excellent understanding"
      else if (percentage >= 70) note = "Strong performance"
      else if (percentage >= 50) note = "Developing steadily"

      return {
        section,
        title: getSectionTitle(section),
        correct,
        total,
        percentage,
        note,
      }
    })
  }

  const handleSubmit = () => {
    setCompletedAt(new Date().toLocaleString())
    setTestCompleted(true)
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentQuestion(0)
    setAnswers(new Array(totalQuestions).fill(null))
    setTimeRemaining(isPremium ? 60 * 60 : 10 * 60)
    setShowReview(false)
    setCompletedAt("")
  }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Numeracy Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Mixed Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                    <p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                </div>

                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Free Preview Mode</p>
                        <p className="text-sm text-amber-700">
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question mixed-level numeracy test with a detailed report.
                        </p>
                      </div>
                    </div>
                    <Link href="/pricing" className="block mt-3">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Mixed Test Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Number Operations</li>
                    <li>- Measurement</li>
                    <li>- Geometry</li>
                    <li>- Data & Statistics</li>
                    <li>- A blend of easy, moderate, and difficult question styles</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Work through the mixed set one question at a time.</li>
                    <li>- Use rough work if needed.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Start Test
                </Button>

                <Link href="/mock-tests/numeracy">
                  <Button variant="outline" className="w-full">
                    Back to Numeracy Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sections = getSectionSummary()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 1</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                <p className="text-gray-600 mt-2">Questions Correct</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className={`text-2xl font-bold ${color}`}>{grade}</p>
                  <p className="text-sm text-gray-600">Performance</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Section Summary</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sections.map((section) => (
                    <div key={section.section} className="rounded-lg bg-white border border-blue-100 p-4">
                      <p className="font-semibold text-slate-800">{section.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
                      <p className="text-xs text-slate-500 mt-2">{section.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                <p className="text-sm text-slate-700">
                  This mixed-level numeracy report combines easier, standard, and more challenging items, with section summaries and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setShowReview(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                  Review Answers & Report
                </Button>
                <Button onClick={restartTest} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Test Again
                </Button>
                <Link href="/mock-tests/numeracy">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Numeracy Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sections = getSectionSummary()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <style jsx global>{`
          @media print {
            header,
            footer,
            .no-print {
              display: none !important;
            }

            body {
              background: #ffffff !important;
            }

            .report-sheet {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm">
                    <Image
                      src="/images/shazoniques-inspiration-logo.png"
                      alt="Shazonique's Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 1 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Student: <span className="font-medium">{user?.childName ?? "Student"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-blue-700">{score}/{totalQuestions}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-blue-700">{percentage}%</p>
                    <p className="text-xs text-slate-600">Percent</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className={`text-lg font-bold ${color}`}>{grade}</p>
                    <p className="text-xs text-slate-600">Performance</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Section Summary</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sections.map((section) => (
                    <div key={section.section} className="rounded-lg bg-white border border-blue-100 p-4">
                      <p className="font-semibold text-slate-800">{section.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct</p>
                      <p className="text-sm text-blue-700 font-medium mt-1">{section.percentage}%</p>
                      <p className="text-xs text-slate-500 mt-2">{section.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "p-5 rounded-xl border-2",
                        isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {getSectionTitle(q.type)}
                            </span>
                          </div>
                          <p className="text-slate-800 mb-3">{q.question}</p>

                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700">
                              <span className="font-medium">Student&apos;s Answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {answers[index] !== null ? q.options[answers[index]!] : "Not answered"}
                              </span>
                            </p>

                            <p className="text-green-700">
                              <span className="font-medium">Correct Answer:</span>{" "}
                              {q.options[q.correctAnswer]}
                            </p>

                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span>{" "}
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">
                Managed by Shazonique&apos;s Inspiration · A heart&apos;s home of hope
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print max-w-5xl mx-auto">
            <Button onClick={() => window.print()} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Download / Print Report
            </Button>

            <Button onClick={restartTest} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Test Again
            </Button>

            <Link href="/mock-tests/numeracy" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Numeracy Mock Tests
              </Button>
            </Link>
          </div>
        </main>

        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <header className="bg-slate-800 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/mock-tests/numeracy" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Mixed 1</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", timeRemaining <= 300 ? "bg-red-500" : "bg-green-600")}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {answeredCount}/{totalQuestions} answered</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}% complete</span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 uppercase">{getSectionTitle(question.type)}</span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all",
                      answers[currentQuestion] === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    <span className="font-medium text-blue-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={cn(
                      "w-8 h-8 rounded text-sm font-medium transition-colors",
                      currentQuestion === index ? "bg-blue-600 text-white" : answers[index] !== null ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-100"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
