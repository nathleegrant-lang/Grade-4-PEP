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
    question: "What is 300 + 200?",
    options: ["400", "500", "600", "700"],
    correctAnswer: 1,
    explanation: "300 + 200 = 500. Add the hundreds: 3 hundreds + 2 hundreds = 5 hundreds.",
  },
  {
    id: 2,
    type: "number",
    question: "What is 95 - 40?",
    options: ["45", "55", "65", "35"],
    correctAnswer: 1,
    explanation: "95 - 40 = 55. Subtract 4 tens from 9 tens.",
  },
  {
    id: 3,
    type: "number",
    question: "What is 6 × 4?",
    options: ["20", "24", "26", "18"],
    correctAnswer: 1,
    explanation: "6 × 4 = 24. Six groups of four make twenty-four.",
  },
  {
    id: 4,
    type: "number",
    question: "What is 36 ÷ 6?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    explanation: "36 ÷ 6 = 6 because 6 × 6 = 36.",
  },
  {
    id: 5,
    type: "number",
    question: "Which fraction shows one half?",
    options: ["1/3", "2/4", "3/4", "2/3"],
    correctAnswer: 1,
    explanation: "2/4 is equal to 1/2 because both numerator and denominator can be divided by 2.",
  },
  {
    id: 6,
    type: "number",
    question: "What is 1/5 + 2/5?",
    options: ["3/10", "3/5", "2/10", "1/5"],
    correctAnswer: 1,
    explanation: "Add the numerators because the denominators are the same: 1/5 + 2/5 = 3/5.",
  },
  {
    id: 7,
    type: "number",
    question: "Round 248 to the nearest ten.",
    options: ["240", "245", "250", "260"],
    correctAnswer: 2,
    explanation: "248 rounds to 250 because the ones digit is 8, so we round up.",
  },
  {
    id: 8,
    type: "number",
    question: "What is the value of 6 in 462?",
    options: ["6", "60", "600", "16"],
    correctAnswer: 1,
    explanation: "In 462, the 6 is in the tens place, so its value is 60.",
  },
  {
    id: 9,
    type: "number",
    question: "Which number is smallest?",
    options: ["0.6", "0.3", "0.9", "0.8"],
    correctAnswer: 1,
    explanation: "0.3 is the smallest decimal listed.",
  },
  {
    id: 10,
    type: "number",
    question: "Keisha has $20 and spends $7. How much money is left?",
    options: ["$11", "$12", "$13", "$14"],
    correctAnswer: 2,
    explanation: "$20 - $7 = $13.",
  },
  {
    id: 11,
    type: "number",
    question: "What is 2 × 3 × 5?",
    options: ["15", "20", "30", "25"],
    correctAnswer: 2,
    explanation: "2 × 3 = 6, then 6 × 5 = 30.",
  },
  {
    id: 12,
    type: "number",
    question: "Which is greater?",
    options: ["1/4", "1/2", "They are equal", "Cannot tell"],
    correctAnswer: 1,
    explanation: "1/2 is greater than 1/4 because one half is larger than one quarter.",
  },
  {
    id: 13,
    type: "number",
    question: "A teacher shares 48 books equally among 6 groups. How many books are in each group?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    explanation: "48 ÷ 6 = 8.",
  },
  {
    id: 14,
    type: "number",
    question: "What is the next number in the pattern: 2, 4, 6, 8, ___?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    explanation: "The pattern counts by 2, so after 8 comes 10.",
  },
  {
    id: 15,
    type: "number",
    question: "What fraction is shaded if 3 out of 4 equal parts are shaded?",
    options: ["1/4", "2/4", "3/4", "4/4"],
    correctAnswer: 2,
    explanation: "3 parts out of 4 parts means 3/4.",
  },

  // Measurement (16-25)
  {
    id: 16,
    type: "measurement",
    question: "How many centimeters are in 2 meters?",
    options: ["20 cm", "200 cm", "2,000 cm", "12 cm"],
    correctAnswer: 1,
    explanation: "1 meter = 100 centimeters, so 2 meters = 200 centimeters.",
  },
  {
    id: 17,
    type: "measurement",
    question: "How long is it from 3:00 PM to 4:00 PM?",
    options: ["30 minutes", "45 minutes", "1 hour", "2 hours"],
    correctAnswer: 2,
    explanation: "From 3:00 PM to 4:00 PM is 1 hour.",
  },
  {
    id: 18,
    type: "measurement",
    question: "How many grams are in 1 kilogram?",
    options: ["100", "500", "1,000", "10,000"],
    correctAnswer: 2,
    explanation: "1 kilogram = 1,000 grams.",
  },
  {
    id: 19,
    type: "measurement",
    question: "1,000 mL is equal to how many liters?",
    options: ["10 L", "1 L", "100 L", "0.1 L"],
    correctAnswer: 1,
    explanation: "1,000 milliliters make 1 liter.",
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the perimeter of a rectangle with length 6 cm and width 4 cm?",
    options: ["10 cm", "20 cm", "24 cm", "16 cm"],
    correctAnswer: 1,
    explanation: "Perimeter = 2 × (6 + 4) = 2 × 10 = 20 cm.",
  },
  {
    id: 21,
    type: "measurement",
    question: "The temperature was 22°C and rose by 5°. What is the new temperature?",
    options: ["17°C", "25°C", "27°C", "28°C"],
    correctAnswer: 2,
    explanation: "22 + 5 = 27, so the new temperature is 27°C.",
  },
  {
    id: 22,
    type: "measurement",
    question: "What is the area of a rectangle that is 5 cm long and 3 cm wide?",
    options: ["8 cm²", "15 cm²", "16 cm²", "10 cm²"],
    correctAnswer: 1,
    explanation: "Area = length × width = 5 × 3 = 15 cm².",
  },
  {
    id: 23,
    type: "measurement",
    question: "School starts at 8:00 AM and ends at 1:00 PM. How long is the school day?",
    options: ["4 hours", "5 hours", "6 hours", "7 hours"],
    correctAnswer: 1,
    explanation: "From 8:00 AM to 1:00 PM is 5 hours.",
  },
  {
    id: 24,
    type: "measurement",
    question: "Which unit is best to measure the height of a door?",
    options: ["Liters", "Centimeters", "Kilograms", "Minutes"],
    correctAnswer: 1,
    explanation: "Centimeters are used to measure length or height.",
  },
  {
    id: 25,
    type: "measurement",
    question: "A rope is 4 meters long. How many centimeters is that?",
    options: ["40 cm", "400 cm", "4,000 cm", "14 cm"],
    correctAnswer: 1,
    explanation: "4 meters = 4 × 100 = 400 centimeters.",
  },

  // Geometry (26-32)
  {
    id: 26,
    type: "geometry",
    question: "How many sides does a pentagon have?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1,
    explanation: "A pentagon has 5 sides.",
  },
  {
    id: 27,
    type: "geometry",
    question: "What type of angle is less than 90 degrees?",
    options: ["Right angle", "Acute angle", "Obtuse angle", "Straight angle"],
    correctAnswer: 1,
    explanation: "An acute angle is smaller than 90 degrees.",
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape has 4 sides that are all equal?",
    options: ["Triangle", "Rectangle", "Square", "Circle"],
    correctAnswer: 2,
    explanation: "A square has 4 equal sides.",
  },
  {
    id: 29,
    type: "geometry",
    question: "How many faces does a cube have?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 2,
    explanation: "A cube has 6 faces.",
  },
  {
    id: 30,
    type: "geometry",
    question: "What is the name of a triangle with 3 equal sides?",
    options: ["Scalene", "Equilateral", "Right", "Open"],
    correctAnswer: 1,
    explanation: "An equilateral triangle has all 3 sides equal.",
  },
  {
    id: 31,
    type: "geometry",
    question: "Lines that never meet are called:",
    options: ["Intersecting", "Curved", "Parallel", "Broken"],
    correctAnswer: 2,
    explanation: "Parallel lines never meet.",
  },
  {
    id: 32,
    type: "geometry",
    question: "How many corners does a circle have?",
    options: ["0", "1", "2", "4"],
    correctAnswer: 0,
    explanation: "A circle has no corners.",
  },

  // Data & Statistics (33-40)
  {
    id: 33,
    type: "data",
    question: "10 students like football, 6 like cricket, and 4 like netball. How many students were counted?",
    options: ["18", "19", "20", "21"],
    correctAnswer: 2,
    explanation: "10 + 6 + 4 = 20 students.",
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of 2, 4, 4, 5, 7?",
    options: ["2", "4", "5", "7"],
    correctAnswer: 1,
    explanation: "The mode is the number that appears most often. 4 appears twice.",
  },
  {
    id: 35,
    type: "data",
    question: "Find the range: 8, 10, 14, 16",
    options: ["6", "8", "10", "16"],
    correctAnswer: 1,
    explanation: "Range = highest - lowest = 16 - 8 = 8.",
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of 3, 5, 7, 9, 11?",
    options: ["5", "7", "9", "11"],
    correctAnswer: 1,
    explanation: "The middle number is 7, so the median is 7.",
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph shows 4 stars, and each star means 2 children. How many children are shown?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    explanation: "4 stars × 2 children each = 8 children.",
  },
  {
    id: 38,
    type: "data",
    question: "A bar graph shows 12 mangoes and 9 oranges. How many more mangoes are there?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "12 - 9 = 3 more mangoes.",
  },
  {
    id: 39,
    type: "data",
    question: "Find the average of 4, 6, 8.",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    explanation: "(4 + 6 + 8) ÷ 3 = 18 ÷ 3 = 6.",
  },
  {
    id: 40,
    type: "data",
    question: "If 5 students are absent from a class of 24, how many students are present?",
    options: ["18", "19", "20", "21"],
    correctAnswer: 1,
    explanation: "24 - 5 = 19 students are present.",
  },
]

export default function NumeracyEasy1Test() {
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

  const getScorePercentage = () => Math.round((calculateScore() / totalQuestions) * 100)

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionSummary = (type: Question["type"]) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === type)
    const sectionIndexes = availableQuestions
      .map((q, index) => ({ q, index }))
      .filter((item) => item.q.type === type)

    let correct = 0
    sectionIndexes.forEach(({ q, index }) => {
      if (answers[index] === q.correctAnswer) correct++
    })

    const total = sectionQuestions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    const note =
      percentage >= 85
        ? "Excellent work"
        : percentage >= 70
          ? "Good understanding"
          : percentage >= 50
            ? "Developing"
            : "Needs more practice"

    return { correct, total, percentage, note }
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
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question test and printable report.
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
                  <h3 className="font-semibold text-blue-800 mb-2">Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Clear direct questions</li>
                    <li>- Simple calculations and measurement</li>
                    <li>- Basic geometry and data handling</li>
                    <li>- Strong focus on confidence building</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- You may use paper for rough work.</li>
                    <li>- Choose the best answer.</li>
                    <li>- You can move between questions.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Start Test
                </Button>

                <Link href="/mock-tests/numeracy">
                  <Button variant="outline" className="w-full">Back to Numeracy Mock Tests</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    const numberSummary = getSectionSummary("number")
    const measurementSummary = getSectionSummary("measurement")
    const geometrySummary = getSectionSummary("geometry")
    const dataSummary = getSectionSummary("data")

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-4xl mx-auto shadow-lg">
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 1</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[{ label: "Number Operations", ...numberSummary }, { label: "Measurement", ...measurementSummary }, { label: "Geometry", ...geometrySummary }, { label: "Data & Statistics", ...dataSummary }].map((section) => (
                      <div key={section.label} className="rounded-lg bg-white border p-4">
                        <p className="font-semibold text-slate-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
                        <p className="text-sm text-blue-700 mt-2 font-medium">{section.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This easy-level numeracy report includes section summaries and a full question-by-question review with explanations. You can also print or save the report as a PDF.
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
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    const numberSummary = getSectionSummary("number")
    const measurementSummary = getSectionSummary("measurement")
    const geometrySummary = getSectionSummary("geometry")
    const dataSummary = getSectionSummary("data")

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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 1 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">Student: <span className="font-medium">{user?.childName ?? "Student"}</span></p>
                    <p className="text-sm text-gray-600">Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span></p>
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
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{ label: "Number Operations", ...numberSummary }, { label: "Measurement", ...measurementSummary }, { label: "Geometry", ...geometrySummary }, { label: "Data & Statistics", ...dataSummary }].map((section) => (
                    <div key={section.label} className="rounded-lg bg-white border p-4">
                      <p className="font-semibold text-slate-800">{section.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
                      <p className="text-sm text-blue-700 mt-2 font-medium">{section.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
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
                              {q.type === "number"
                                ? "Number Operations"
                                : q.type === "measurement"
                                ? "Measurement"
                                : q.type === "geometry"
                                ? "Geometry"
                                : "Data & Statistics"}
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
                              <span className="font-medium">Correct Answer:</span> {q.options[q.correctAnswer]}
                            </p>

                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span> {q.explanation}
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
                <h1 className="text-lg font-bold">Numeracy Easy 1</h1>
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
                <span className="text-sm font-medium text-blue-700 uppercase">
                  {question.type === "number" ? "Number Operations" : question.type === "measurement" ? "Measurement" : question.type === "geometry" ? "Geometry" : "Data & Statistics"}
                </span>
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
