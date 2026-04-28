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
  type: "number" | "measurement" | "geometry" | "statistics"
  passage?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const numeracyModerate9Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 15,000 - 6,478?`,
    options: [
      "8,422",
      "8,522",
      "8,532",
      "9,522",
    ],
    correctAnswer: 1,
    explanation: `15,000 - 6,000 = 9,000. 9,000 - 478 = 8,522.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 63 x 27?`,
    options: [
      "1,591",
      "1,681",
      "1,701",
      "1,791",
    ],
    correctAnswer: 2,
    explanation: `63 x 27 = (60 x 27) + (3 x 27) = 1,620 + 81 = 1,701.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 1,512 divided by 12?`,
    options: [
      "116",
      "124",
      "126",
      "132",
    ],
    correctAnswer: 2,
    explanation: `1,512 / 12 = 126. Check: 126 x 12 = 1,512.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the LCM of 8, 12, and 16?`,
    options: [
      "24",
      "32",
      "48",
      "96",
    ],
    correctAnswer: 2,
    explanation: `LCM(8,12) = 24. LCM(24,16): 24 = 8x3, 16 = 16. LCM = 48.`
  },
  {
    id: 5,
    type: "number",
    question: `What is 2/3 x 9/10?`,
    options: [
      "11/13",
      "3/5",
      "2/10",
      "18/30",
    ],
    correctAnswer: 1,
    explanation: `(2 x 9) / (3 x 10) = 18/30 = 3/5.`
  },
  {
    id: 6,
    type: "number",
    question: `A price of $160 is reduced by 35%. What is the sale price?`,
    options: [
      "$94",
      "$96",
      "$100",
      "$104",
    ],
    correctAnswer: 3,
    explanation: `35% of $160 = $56. Sale price = $160 - $56 = $104.`
  },
  {
    id: 7,
    type: "number",
    question: `Solve: 2(3n - 4) = 16`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: `2(3n-4) = 16. 3n-4 = 8. 3n = 12. n = 4.`
  },
  {
    id: 8,
    type: "number",
    question: `Write 125/500 as a decimal.`,
    options: [
      "0.025",
      "0.25",
      "2.5",
      "25",
    ],
    correctAnswer: 1,
    explanation: `125/500 = 1/4 = 0.25.`
  },
  {
    id: 9,
    type: "number",
    question: `What is 45% of 180?`,
    options: [
      "72",
      "76",
      "81",
      "90",
    ],
    correctAnswer: 2,
    explanation: `45% of 180 = 0.45 x 180 = 81.`
  },
  {
    id: 10,
    type: "number",
    question: `The sum of three consecutive even numbers is 66. What is the largest?`,
    options: [
      "20",
      "22",
      "24",
      "26",
    ],
    correctAnswer: 2,
    explanation: `Let numbers be n, n+2, n+4. 3n+6=66. 3n=60. n=20. Largest = 24.`
  },
  {
    id: 11,
    type: "number",
    question: `What is 7.2 x 0.05?`,
    options: [
      "0.036",
      "0.36",
      "3.6",
      "36",
    ],
    correctAnswer: 1,
    explanation: `7.2 x 5 = 36. Place 3 decimal places: 0.360 = 0.36.`
  },
  {
    id: 12,
    type: "number",
    question: `A school has 840 students. 5/8 are juniors. How many are NOT juniors?`,
    options: [
      "315",
      "420",
      "525",
      "630",
    ],
    correctAnswer: 0,
    explanation: `Juniors: 5/8 x 840 = 525. Not juniors: 840 - 525 = 315.`
  },
  {
    id: 13,
    type: "number",
    question: `What is the value of 3 squared x 2 cubed?`,
    options: [
      "24",
      "36",
      "54",
      "72",
    ],
    correctAnswer: 3,
    explanation: `3 squared = 9. 2 cubed = 8. 9 x 8 = 72.`
  },
  {
    id: 14,
    type: "number",
    question: `A farmer packs 480 mangoes equally into boxes of 16. How many boxes does he need?`,
    options: [
      "25",
      "28",
      "30",
      "32",
    ],
    correctAnswer: 2,
    explanation: `480 / 16 = 30 boxes.`
  },
  {
    id: 15,
    type: "number",
    question: `What is 12.5% of 400?`,
    options: [
      "40",
      "45",
      "50",
      "55",
    ],
    correctAnswer: 2,
    explanation: `12.5% = 1/8. 1/8 of 400 = 50.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A circular pond has a diameter of 14 m. What is its circumference? (Use pi = 22/7)`,
    options: [
      "22 m",
      "44 m",
      "88 m",
      "154 m",
    ],
    correctAnswer: 1,
    explanation: `Circumference = pi x d = 22/7 x 14 = 44 m.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A tank is 2/3 full and contains 800 litres. What is the full capacity of the tank?`,
    options: [
      "533 L",
      "1,000 L",
      "1,200 L",
      "1,600 L",
    ],
    correctAnswer: 2,
    explanation: `2/3 of tank = 800 L. Full = 800 / (2/3) = 800 x 3/2 = 1,200 L.`
  },
  {
    id: 18,
    type: "measurement",
    question: `How many days are in the months of January, February (non-leap year), and March combined?`,
    options: [
      "89",
      "90",
      "91",
      "92",
    ],
    correctAnswer: 1,
    explanation: `Jan 31 + Feb 28 + Mar 31 = 90 days.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A rectangular path 2 m wide surrounds a garden 20 m x 12 m on the OUTSIDE. What is the area of the path?`,
    options: [
      "144 m2",
      "152 m2",
      "160 m2",
      "168 m2",
    ],
    correctAnswer: 0,
    explanation: `Outer: (20+4) x (12+4) = 24 x 16 = 384 m2. Garden: 20 x 12 = 240 m2. Path = 384 - 240 = 144 m2.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A lorry travels 315 km at 90 km/h. How long does the journey take?`,
    options: [
      "3 h",
      "3 h 15 min",
      "3 h 30 min",
      "4 h",
    ],
    correctAnswer: 2,
    explanation: `315 / 90 = 3.5 hours = 3 hours 30 minutes.`
  },
  {
    id: 21,
    type: "measurement",
    question: `A cube has a side of 6 cm. What is its total surface area?`,
    options: [
      "36 cm2",
      "72 cm2",
      "144 cm2",
      "216 cm2",
    ],
    correctAnswer: 3,
    explanation: `A cube has 6 faces. Each face = 6 x 6 = 36 cm2. Total = 6 x 36 = 216 cm2.`
  },
  {
    id: 22,
    type: "measurement",
    question: `What is 2 hours 48 minutes expressed in minutes?`,
    options: [
      "148 min",
      "158 min",
      "168 min",
      "178 min",
    ],
    correctAnswer: 2,
    explanation: `2 hours = 120 minutes. 120 + 48 = 168 minutes.`
  },
  {
    id: 23,
    type: "measurement",
    question: `A piece of wood is 4.8 m long. It is cut into 6 equal pieces. How long is each piece in cm?`,
    options: [
      "60 cm",
      "70 cm",
      "75 cm",
      "80 cm",
    ],
    correctAnswer: 3,
    explanation: `4.8 m = 480 cm. 480 / 6 = 80 cm.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The area of a triangle is 54 cm2 and its base is 12 cm. What is its height?`,
    options: [
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm",
    ],
    correctAnswer: 3,
    explanation: `Area = 1/2 x base x height. 54 = 1/2 x 12 x h. 54 = 6h. h = 9 cm.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A temperature of -5 degrees C rises by 18 degrees. What is the new temperature?`,
    options: [
      "13 degrees C",
      "14 degrees C",
      "16 degrees C",
      "23 degrees C",
    ],
    correctAnswer: 0,
    explanation: `-5 + 18 = 13 degrees C.`
  },
  {
    id: 26,
    type: "geometry",
    question: `A circle has a radius of 7 cm. What is its area? (Use pi = 22/7)`,
    options: [
      "44 cm2",
      "77 cm2",
      "154 cm2",
      "308 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = pi x r2 = 22/7 x 49 = 154 cm2.`
  },
  {
    id: 27,
    type: "geometry",
    question: `Which of the following is a property of a parallelogram?`,
    options: [
      "All sides are equal",
      "Opposite sides are parallel and equal",
      "All angles are 90 degrees",
      "Diagonals are equal",
    ],
    correctAnswer: 1,
    explanation: `In a parallelogram, opposite sides are parallel and equal in length.`
  },
  {
    id: 28,
    type: "geometry",
    question: `A shape is enlarged so that all sides double in length. By what factor does the area change?`,
    options: [
      "2",
      "3",
      "4",
      "6",
    ],
    correctAnswer: 2,
    explanation: `When all linear dimensions double, area increases by 2 squared = 4 times.`
  },
  {
    id: 29,
    type: "geometry",
    question: `What is the sum of interior angles of a hexagon?`,
    options: [
      "540 degrees",
      "600 degrees",
      "720 degrees",
      "900 degrees",
    ],
    correctAnswer: 2,
    explanation: `(6-2) x 180 = 4 x 180 = 720 degrees.`
  },
  {
    id: 30,
    type: "geometry",
    question: `A right-angled triangle has legs of 6 cm and 8 cm. What is the length of the hypotenuse?`,
    options: [
      "9 cm",
      "10 cm",
      "12 cm",
      "14 cm",
    ],
    correctAnswer: 1,
    explanation: `Hypotenuse = sqrt(6 squared + 8 squared) = sqrt(36+64) = sqrt(100) = 10 cm.`
  },
  {
    id: 31,
    type: "geometry",
    question: `How many faces, edges, and vertices does a triangular prism have?`,
    options: [
      "5 faces, 8 edges, 6 vertices",
      "5 faces, 9 edges, 6 vertices",
      "6 faces, 9 edges, 5 vertices",
      "4 faces, 9 edges, 6 vertices",
    ],
    correctAnswer: 1,
    explanation: `Triangular prism: 5 faces, 9 edges, 6 vertices.`
  },
  {
    id: 32,
    type: "geometry",
    question: `Two angles are complementary. One is 38 degrees. What is the other?`,
    options: [
      "42 degrees",
      "52 degrees",
      "62 degrees",
      "72 degrees",
    ],
    correctAnswer: 1,
    explanation: `Complementary angles add to 90 degrees. 90 - 38 = 52 degrees.`
  },
  {
    id: 33,
    type: "geometry",
    question: `A rectangle has length 18 cm and width 7 cm. What is its perimeter?`,
    options: [
      "25 cm",
      "50 cm",
      "54 cm",
      "126 cm",
    ],
    correctAnswer: 1,
    explanation: `Perimeter = 2 x (18 + 7) = 2 x 25 = 50 cm.`
  },
  {
    id: 34,
    type: "statistics",
    question: `The mean of 5 numbers is 16. If one number is removed and the new mean is 15, what was the removed number?`,
    options: [
      "18",
      "19",
      "20",
      "21",
    ],
    correctAnswer: 2,
    explanation: `Original sum = 80. New sum = 4 x 15 = 60. Removed = 80 - 60 = 20.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 2.1, 3.5, 1.8, 4.2, 2.9, 3.1`,
    options: [
      "2.9",
      "3.0",
      "3.1",
      "3.5",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 1.8, 2.1, 2.9, 3.1, 3.5, 4.2. Median = (2.9+3.1)/2 = 3.0.`
  },
  {
    id: 36,
    type: "statistics",
    question: `A frequency table: Grade A = 8, Grade B = 12, Grade C = 15, Grade D = 5. What percentage achieved Grade A?`,
    options: [
      "16%",
      "20%",
      "25%",
      "32%",
    ],
    correctAnswer: 1,
    explanation: `Total = 40. Grade A = 8. Percentage = 8/40 x 100 = 20%.`
  },
  {
    id: 37,
    type: "statistics",
    question: `What is the range of: 3.6, 7.2, 5.1, 9.8, 4.4?`,
    options: [
      "6.2",
      "6.3",
      "6.4",
      "6.5",
    ],
    correctAnswer: 0,
    explanation: `Range = 9.8 - 3.6 = 6.2.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A bag has 3 red, 5 blue, 4 green, and 2 yellow counters. What is the probability of picking green?`,
    options: [
      "2/7",
      "1/4",
      "2/14",
      "4/7",
    ],
    correctAnswer: 0,
    explanation: `Total = 14. P(green) = 4/14 = 2/7.`
  },
  {
    id: 39,
    type: "statistics",
    question: `In a class of 36, the ratio of boys to girls is 5:4. How many girls are in the class?`,
    options: [
      "14",
      "15",
      "16",
      "18",
    ],
    correctAnswer: 2,
    explanation: `Total parts = 9. Girls = 4/9 x 36 = 16.`
  },
  {
    id: 40,
    type: "statistics",
    question: `In a pie chart, a section for Sport covers 90 degrees. What fraction of students chose Sport?`,
    options: [
      "1/8",
      "1/6",
      "1/4",
      "1/3",
    ],
    correctAnswer: 2,
    explanation: `90 / 360 = 1/4.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate9MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate9Questions : numeracyModerate9Questions.slice(0, FREE_QUESTION_LIMIT)
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
    if (percentage >= 85) { rating = "Excellent"; ratingColor = "text-green-600" }
    else if (percentage >= 70) { rating = "Good"; ratingColor = "text-blue-600" }
    else if (percentage >= 50) { rating = "Fair"; ratingColor = "text-amber-600" }
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
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Numeracy Mock Tests
          </Link>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 9</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Moderate Practice</p>
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
                        <p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question moderate-level numeracy test with reports and explanations.</p>
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
                  <h3 className="font-semibold text-blue-800 mb-2">Moderate-Level Focus:</h3>
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
                <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">Start Test</Button>
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 9</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {SECTION_CONFIG.map((section) => {
                    const stats = getSectionStats(section.type)
                    return (
                      <div key={section.type} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <p className="font-semibold text-blue-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                          <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">This moderate-level numeracy report includes section summaries and a full question-by-question review with explanations.</p>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-slate-700 hover:bg-slate-800">Review Answers &amp; Report</Button>
                  <Button onClick={restartTest} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-2" />Take Test Again</Button>
                  <Link href="/mock-tests/numeracy"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Button></Link>
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
        <style jsx global>{`@media print { header, footer, .no-print { display: none !important; } body { background: #ffffff !important; } .report-sheet { box-shadow: none !important; border: none !important; } }`}</style>
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm">
                    <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 9 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">Student: <span className="font-medium">{user?.childName ?? "Student"}</span></p>
                    <p className="text-sm text-gray-600">Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-blue-700">{score}/{totalQuestions}</p><p className="text-xs text-slate-600">Score</p></div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-blue-700">{percentage}%</p><p className="text-xs text-slate-600">Percent</p></div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]"><p className={`text-lg font-bold ${color}`}>{grade}</p><p className="text-xs text-slate-600">Performance</p></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SECTION_CONFIG.map((section) => {
                  const stats = getSectionStats(section.type)
                  return (
                    <div key={section.type} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="font-semibold text-blue-800">{section.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                        <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                      </div>
                      <div className="mt-2"><Progress value={stats.percentage} className="h-2" /><p className="text-xs text-slate-500 mt-1">{stats.percentage}%</p></div>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {q.type === "number" ? "Number Operations" : q.type === "measurement" ? "Measurement" : q.type === "geometry" ? "Geometry" : q.type === "statistics" ? "Data & Statistics" : ""}
                            </span>
                          </div>
                          <p className="text-slate-800 mb-3">{q.question}</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700"><span className="font-medium">Student&apos;s Answer:</span> <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>{answers[index] !== null ? q.options[answers[index]!] : "Not answered"}</span></p>
                            <p className="text-green-700"><span className="font-medium">Correct Answer:</span> {q.options[q.correctAnswer]}</p>
                            <p className="text-slate-700 mt-2"><span className="font-medium">Explanation:</span> {q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">Managed by Shazonique&apos;s Inspiration · A heart&apos;s home of hope</div>
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print max-w-5xl mx-auto">
            <Button onClick={() => window.print()} className="flex-1 bg-slate-700 hover:bg-slate-800"><Printer className="h-4 w-4 mr-2" />Download / Print Report</Button>
            <Button onClick={restartTest} variant="outline" className="flex-1"><RotateCcw className="h-4 w-4 mr-2" />Take Test Again</Button>
            <Link href="/mock-tests/numeracy" className="flex-1"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Button></Link>
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
              <Link href="/mock-tests/numeracy" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test"><ArrowLeft className="h-5 w-5" /></Link>
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Moderate 9</h1>
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
                  {question.type === "number" ? "Number Operations" : question.type === "measurement" ? "Measurement" : question.type === "geometry" ? "Geometry" : question.type === "statistics" ? "Data & Statistics" : ""}
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
                  <button key={index} onClick={() => handleAnswer(index)} className={cn("w-full p-4 text-left rounded-lg border-2 transition-all", answers[currentQuestion] === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50")}>
                    <span className="font-medium text-blue-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}><ChevronLeft className="h-4 w-4 mr-2" />Previous</Button>
            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800"><Flag className="h-4 w-4 mr-2" />Submit Test</Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-slate-700 hover:bg-slate-800">Next<ChevronRight className="h-4 w-4 ml-2" /></Button>
              )}
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader className="py-3"><CardTitle className="text-sm">Question Navigator</CardTitle></CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (
                  <button key={index} onClick={() => setCurrentQuestion(index)} className={cn("w-8 h-8 rounded text-sm font-medium transition-colors", currentQuestion === index ? "bg-slate-700 text-white" : answers[index] !== null ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>{index + 1}</button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-700"></div><span>Current</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-100"></div><span>Answered</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100"></div><span>Unanswered</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
