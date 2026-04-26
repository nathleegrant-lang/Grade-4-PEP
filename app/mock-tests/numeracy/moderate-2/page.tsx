"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, BookOpen, RotateCcw, Home, Lock, Crown, ArrowLeft, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const FREE_QUESTION_LIMIT = 5

interface Question {
  id: number
  type: "number" | "measurement" | "geometry" | "statistics"
  passage?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const numeracyModerate2Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 5,000 − 2,347?`,
    options: ["2,653", "2,753", "2,643", "2,543"],
    correctAnswer: 0,
    explanation: `5,000 − 2,000 = 3,000. Then 3,000 − 347 = 2,653.`,
  },
  {
    id: 2,
    type: "number",
    question: `What is 47 × 8?`,
    options: ["366", "376", "386", "396"],
    correctAnswer: 1,
    explanation: `47 × 8: (40×8)+(7×8) = 320+56 = 376.`,
  },
  {
    id: 3,
    type: "number",
    question: `What is 325 ÷ 5?`,
    options: ["55", "60", "65", "70"],
    correctAnswer: 2,
    explanation: `325 ÷ 5 = 65. Check: 65 × 5 = 325 ✓`,
  },
  {
    id: 4,
    type: "number",
    question: `Which number is divisible by both 3 and 4?`,
    options: ["10", "14", "24", "26"],
    correctAnswer: 2,
    explanation: `24 ÷ 3 = 8 ✓ and 24 ÷ 4 = 6 ✓. The others fail at least one test.`,
  },
  {
    id: 5,
    type: "number",
    question: `What is the HCF (Highest Common Factor) of 12 and 18?`,
    options: ["3", "6", "9", "12"],
    correctAnswer: 1,
    explanation: `Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6.`,
  },
  {
    id: 6,
    type: "number",
    question: `What is 3/8 + 1/4?`,
    options: ["4/12", "4/8", "5/8", "3/4"],
    correctAnswer: 2,
    explanation: `Convert 1/4 to eighths: 1/4 = 2/8. Then 3/8 + 2/8 = 5/8.`,
  },
  {
    id: 7,
    type: "number",
    question: `What is 7/10 expressed as a percentage?`,
    options: ["17%", "70%", "7%", "0.7%"],
    correctAnswer: 1,
    explanation: `7/10 × 100 = 70%.`,
  },
  {
    id: 8,
    type: "number",
    question: `Which of these numbers is NOT a factor of 24?`,
    options: ["6", "8", "9", "12"],
    correctAnswer: 2,
    explanation: `24 ÷ 9 = 2.67 (not a whole number), so 9 is NOT a factor of 24.`,
  },
  {
    id: 9,
    type: "number",
    question: `A shop offers a 20% discount on a $500 item. What is the sale price?`,
    options: ["$400", "$450", "$480", "$100"],
    correctAnswer: 0,
    explanation: `20% of $500 = $100 discount. Sale price = $500 − $100 = $400.`,
  },
  {
    id: 10,
    type: "number",
    question: `What is the value of n in: n + 15 = 42?`,
    options: ["37", "27", "17", "57"],
    correctAnswer: 1,
    explanation: `n = 42 − 15 = 27. Check: 27 + 15 = 42 ✓`,
  },
  {
    id: 11,
    type: "number",
    question: `What is 4.5 × 6?`,
    options: ["24", "27", "24.5", "28"],
    correctAnswer: 1,
    explanation: `4.5 × 6: 4×6=24, 0.5×6=3, total = 24+3 = 27.`,
  },
  {
    id: 12,
    type: "number",
    question: `Express 45/100 as a decimal.`,
    options: ["4.5", "0.045", "0.45", "45.0"],
    correctAnswer: 2,
    explanation: `45/100 = 0.45. The denominator 100 means two decimal places.`,
  },
  {
    id: 13,
    type: "number",
    question: `A recipe needs 2/3 cup of sugar. How much sugar is needed for 3 batches?`,
    options: ["1 cup", "2 cups", "3 cups", "6 cups"],
    correctAnswer: 1,
    explanation: `2/3 × 3 = 6/3 = 2 cups.`,
  },
  {
    id: 14,
    type: "number",
    question: `Which shows these numbers greatest to least: 3.2, 3.02, 3.22, 3.002?`,
    options: ["3.002, 3.02, 3.2, 3.22", "3.22, 3.2, 3.02, 3.002", "3.2, 3.22, 3.02, 3.002", "3.22, 3.02, 3.2, 3.002"],
    correctAnswer: 1,
    explanation: `Comparing: 3.22 > 3.20 > 3.02 > 3.002. Greatest to least: 3.22, 3.2, 3.02, 3.002.`,
  },
  {
    id: 15,
    type: "number",
    question: `A book costs $85. If you buy 4 books, how much change from $400?`,
    options: ["$50", "$60", "$65", "$55"],
    correctAnswer: 1,
    explanation: `4 × $85 = $340. Change = $400 − $340 = $60.`,
  },
  {
    id: 16,
    type: "measurement",
    question: `Which is the best estimate for the mass of a Grade 4 textbook?`,
    options: ["5 grams", "500 grams", "5 kilograms", "50 kilograms"],
    correctAnswer: 1,
    explanation: `A school textbook typically weighs around 400–600 grams. 500 grams is the most reasonable estimate.`,
  },
  {
    id: 17,
    type: "measurement",
    question: `A farmer's field is 40 m long and 25 m wide. What is the area?`,
    options: ["130 m²", "650 m²", "1,000 m²", "1,250 m²"],
    correctAnswer: 2,
    explanation: `Area = length × width = 40 × 25 = 1,000 m².`,
  },
  {
    id: 18,
    type: "measurement",
    question: `Convert 3 hours 45 minutes to minutes.`,
    options: ["195 minutes", "215 minutes", "225 minutes", "180 minutes"],
    correctAnswer: 2,
    explanation: `3 hours = 180 minutes. 180 + 45 = 225 minutes.`,
  },
  {
    id: 19,
    type: "measurement",
    question: `A triangle has a base of 10 cm and a height of 6 cm. What is its area?`,
    options: ["16 cm²", "30 cm²", "60 cm²", "48 cm²"],
    correctAnswer: 1,
    explanation: `Area of a triangle = ½ × base × height = ½ × 10 × 6 = 30 cm².`,
  },
  {
    id: 20,
    type: "measurement",
    question: `What time is 3 hours after 10:45 a.m.?`,
    options: ["1:45 p.m.", "2:45 p.m.", "12:45 p.m.", "1:15 p.m."],
    correctAnswer: 0,
    explanation: `10:45 a.m. + 3 hours = 1:45 p.m.`,
  },
  {
    id: 21,
    type: "measurement",
    question: `A rope is 7.5 m long. It is cut into pieces of 50 cm each. How many pieces?`,
    options: ["10", "12", "15", "20"],
    correctAnswer: 2,
    explanation: `7.5 m = 750 cm. 750 ÷ 50 = 15 pieces.`,
  },
  {
    id: 22,
    type: "measurement",
    question: `Which is the best unit for measuring the capacity of a swimming pool?`,
    options: ["Millilitres", "Litres", "Grams", "Kilometres"],
    correctAnswer: 1,
    explanation: `Litres measure liquid capacity. Grams measure mass; kilometres measure distance.`,
  },
  {
    id: 23,
    type: "measurement",
    question: `A temperature at 6 a.m. was 22°C. By noon it rose by 8°C. What was the noon temperature?`,
    options: ["14°C", "28°C", "30°C", "32°C"],
    correctAnswer: 2,
    explanation: `22°C + 8°C = 30°C.`,
  },
  {
    id: 24,
    type: "measurement",
    question: `The perimeter of a square is 36 cm. What is the length of one side?`,
    options: ["6 cm", "9 cm", "12 cm", "18 cm"],
    correctAnswer: 1,
    explanation: `One side = perimeter ÷ 4 = 36 ÷ 4 = 9 cm.`,
  },
  {
    id: 25,
    type: "measurement",
    question: `How many days are in 6 weeks?`,
    options: ["30", "36", "42", "48"],
    correctAnswer: 2,
    explanation: `1 week = 7 days. 6 weeks = 6 × 7 = 42 days.`,
  },
  {
    id: 26,
    type: "geometry",
    question: `What is the name of a quadrilateral with all sides equal and all angles equal?`,
    options: ["Rectangle", "Rhombus", "Square", "Trapezium"],
    correctAnswer: 2,
    explanation: `A square has all four sides equal AND all four angles equal (90° each).`,
  },
  {
    id: 27,
    type: "geometry",
    question: `An angle measuring more than 90° but less than 180° is called:`,
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    correctAnswer: 2,
    explanation: `An obtuse angle is between 90° and 180°.`,
  },
  {
    id: 28,
    type: "geometry",
    question: `Which transformation flips a shape over a line?`,
    options: ["Translation", "Rotation", "Reflection", "Enlargement"],
    correctAnswer: 2,
    explanation: `A reflection flips a shape over a mirror line.`,
  },
  {
    id: 29,
    type: "geometry",
    question: `A rectangle has length 12 cm and width 7 cm. What is its area?`,
    options: ["38 cm²", "74 cm²", "84 cm²", "96 cm²"],
    correctAnswer: 2,
    explanation: `Area = length × width = 12 × 7 = 84 cm².`,
  },
  {
    id: 30,
    type: "geometry",
    question: `How many vertices does a triangular pyramid (tetrahedron) have?`,
    options: ["3", "4", "6", "8"],
    correctAnswer: 1,
    explanation: `A triangular pyramid has 4 vertices: 3 at the base and 1 at the apex.`,
  },
  {
    id: 31,
    type: "geometry",
    question: `Which angle is less than 90°?`,
    options: ["Obtuse angle", "Right angle", "Acute angle", "Reflex angle"],
    correctAnswer: 2,
    explanation: `An acute angle is less than 90°.`,
  },
  {
    id: 32,
    type: "geometry",
    question: `What is the sum of all interior angles of a triangle?`,
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: 1,
    explanation: `The interior angles of any triangle always add up to 180°.`,
  },
  {
    id: 33,
    type: "geometry",
    question: `A square has an area of 64 cm². What is the length of one side?`,
    options: ["6 cm", "7 cm", "8 cm", "9 cm"],
    correctAnswer: 2,
    explanation: `side = √64 = 8 cm. Check: 8 × 8 = 64 ✓`,
  },
  {
    id: 34,
    type: "statistics",
    question: `Scores in a quiz: 8, 6, 9, 7, 10, 6, 8, 6. What is the mode?`,
    options: ["7", "8", "6", "10"],
    correctAnswer: 2,
    explanation: `The mode is the most frequent value. 6 appears 3 times.`,
  },
  {
    id: 35,
    type: "statistics",
    question: `What is the range of: 15, 22, 9, 31, 18?`,
    options: ["13", "22", "31", "9"],
    correctAnswer: 1,
    explanation: `Range = highest − lowest = 31 − 9 = 22.`,
  },
  {
    id: 36,
    type: "statistics",
    question: `A pictograph: Mon=4 suns, Tue=6 suns, Wed=3 suns. Each sun = 5 students. How many students on Tuesday?`,
    options: ["6", "25", "30", "35"],
    correctAnswer: 2,
    explanation: `Tuesday = 6 suns × 5 students = 30 students.`,
  },
  {
    id: 37,
    type: "statistics",
    question: `What is the mean of: 12, 18, 24, 6?`,
    options: ["12", "15", "18", "24"],
    correctAnswer: 1,
    explanation: `Mean = (12+18+24+6) ÷ 4 = 60 ÷ 4 = 15.`,
  },
  {
    id: 38,
    type: "statistics",
    question: `In a pie chart, a section represents 1/4 of the data. What angle does this section make at the centre?`,
    options: ["45°", "60°", "90°", "120°"],
    correctAnswer: 2,
    explanation: `1/4 of 360° = 90°.`,
  },
  {
    id: 39,
    type: "statistics",
    question: `Survey: 15 students prefer cricket, 10 prefer football, 5 prefer swimming. What fraction prefer football?`,
    options: ["1/3", "1/2", "1/4", "2/5"],
    correctAnswer: 0,
    explanation: `Total = 30. Football = 10. Fraction = 10/30 = 1/3.`,
  },
  {
    id: 40,
    type: "statistics",
    question: `Data: 5, 8, 12, 7, 10, 9. What is the median?`,
    options: ["7.5", "8", "8.5", "9"],
    correctAnswer: 2,
    explanation: `Sorted: 5,7,8,9,10,12. Median = average of 3rd and 4th = (8+9)/2 = 8.5.`,
  },
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate2MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate2Questions : numeracyModerate2Questions.slice(0, FREE_QUESTION_LIMIT)
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

  const getSectionStats = (type: Question["type"]) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === type)
    const correct = sectionQuestions.filter((q) => {
      const originalIndex = availableQuestions.findIndex((item) => item.id === q.id)
      return answers[originalIndex] === q.correctAnswer
    }).length
    const total = sectionQuestions.length
    const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)

    let rating = "Needs Improvement"
    let ratingColor = "text-red-600"

    if (percentage >= 85) {
      rating = "Excellent"
      ratingColor = "text-green-600"
    } else if (percentage >= 70) {
      rating = "Good"
      ratingColor = "text-blue-600"
    } else if (percentage >= 50) {
      rating = "Fair"
      ratingColor = "text-amber-600"
    }

    return { correct, total, percentage, rating, ratingColor }
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
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Numeracy Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-sky-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique&apos;s Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <BookOpen className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Numeracy Moderate 2</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Moderate Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-sky-600">{totalQuestions}</p>
                    <p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-sky-600">{isPremium ? 60 : 10}</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question moderate-level numeracy test with reports and explanations.
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

                <div className="bg-sky-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sky-800 mb-2">Moderate-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Algebra, HCF, LCM, factors, multiples, and ordering</li>
                    <li>- Fractions, decimals, percentages, and problem solving</li>
                    <li>- Measurement, geometry, and transformations</li>
                    <li>- Statistics: mean, median, mode, range, and probability · 40 Questions</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Choose the best answer for each item.</li>
                    <li>- Some questions require more than direct recall.</li>
                    <li>- You may move between questions before submitting.</li>
                    <li>- The test will submit automatically when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">
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
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-sky-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique&apos;s Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 2</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-sky-600">{score}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-sky-600">{percentage}%</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {SECTION_CONFIG.map((section) => {
                    const stats = getSectionStats(section.type)
                    return (
                      <div key={section.type} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                        <p className="font-semibold text-sky-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                          <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This moderate-level numeracy report includes section summaries and a full question-by-question review with explanations.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-slate-700 hover:bg-slate-800">
                    Review Answers &amp; Report
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
                      alt="Shazonique&apos;s Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Numeracy Moderate 2 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Student: <span className="font-medium">{user?.childName ?? "Student"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-sky-700">{score}/{totalQuestions}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-sky-700">{percentage}%</p>
                    <p className="text-xs text-slate-600">Percent</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className={`text-lg font-bold ${color}`}>{grade}</p>
                    <p className="text-xs text-slate-600">Performance</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SECTION_CONFIG.map((section) => {
                  const stats = getSectionStats(section.type)
                  return (
                    <div key={section.type} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <p className="font-semibold text-sky-800">{section.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                        <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={stats.percentage} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">{stats.percentage}%</p>
                      </div>
                    </div>
                  )
                })}
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
                          <p className="font-semibold text-slate-800 mb-1">Question {index + 1}</p>
                          <p className="text-xs uppercase tracking-wide text-sky-700 font-medium mb-2">
                            {q.type === "number"
                              ? "Number"
                              : q.type === "measurement"
                              ? "Measurement"
                              : q.type === "geometry"
                              ? "Geometry"
                              : q.type === "statistics"
                              ? "Statistics"
                              : ""}
                          </p>
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
            <Button onClick={() => window.print()} className="flex-1 bg-slate-700 hover:bg-slate-800">
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
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Moderate 2</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
                timeRemaining <= 300 ? "bg-red-500" : "bg-green-600"
              )}
            >
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
            <CardHeader className="bg-sky-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-700 uppercase">
                  {question.type === "number"
                    ? "Number"
                    : question.type === "measurement"
                    ? "Measurement"
                    : question.type === "geometry"
                    ? "Geometry"
                    : question.type === "statistics"
                    ? "Statistics"
                    : ""}
                </span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-72 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Read the passage:</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">{question.passage}</p>
                </div>
              )}

              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all",
                      answers[currentQuestion] === index
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-sky-50/50"
                    )}
                  >
                    <span className="font-medium text-emerald-700 mr-3">{String.fromCharCode(65 + index)}.</span>
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
                <Button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800">
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-slate-700 hover:bg-slate-800">
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
                      currentQuestion === index
                        ? "bg-slate-700 text-white"
                        : answers[index] !== null
                        ? "bg-sky-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-slate-700"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-sky-100"></div>
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
