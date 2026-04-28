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

const numeracyModerate7Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 10,000 - 3,742?`,
    options: [
      "6,158",
      "6,258",
      "6,268",
      "7,258",
    ],
    correctAnswer: 1,
    explanation: `10,000 - 3,742 = 6,258. Check: 3,742 + 6,258 = 10,000.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 95 x 6?`,
    options: [
      "540",
      "560",
      "565",
      "570",
    ],
    correctAnswer: 3,
    explanation: `95 x 6: (90 x 6) + (5 x 6) = 540 + 30 = 570.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 847 divided by 7?`,
    options: [
      "111",
      "119",
      "121",
      "131",
    ],
    correctAnswer: 2,
    explanation: `847 / 7 = 121. Check: 121 x 7 = 847.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the LCM of 9 and 12?`,
    options: [
      "21",
      "27",
      "36",
      "108",
    ],
    correctAnswer: 2,
    explanation: `Multiples of 9: 9,18,27,36. Multiples of 12: 12,24,36. LCM = 36.`
  },
  {
    id: 5,
    type: "number",
    question: `Which of these is NOT a factor of 48?`,
    options: [
      "6",
      "8",
      "9",
      "12",
    ],
    correctAnswer: 2,
    explanation: `48 / 9 = 5.33 (not a whole number). 9 is NOT a factor of 48.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 5/6 + 1/4?`,
    options: [
      "6/10",
      "13/12",
      "11/12",
      "1/2",
    ],
    correctAnswer: 1,
    explanation: `LCD = 12. 5/6 = 10/12, 1/4 = 3/12. 10/12 + 3/12 = 13/12 = 1 and 1/12.`
  },
  {
    id: 7,
    type: "number",
    question: `A television costs $1,200. It is sold at a 15% discount. What is the sale price?`,
    options: [
      "$900",
      "$980",
      "$1,020",
      "$1,080",
    ],
    correctAnswer: 2,
    explanation: `15% of $1,200 = $180. Sale price = $1,200 - $180 = $1,020.`
  },
  {
    id: 8,
    type: "number",
    question: `What is the value of 6 squared + 4 squared?`,
    options: [
      "52",
      "58",
      "60",
      "68",
    ],
    correctAnswer: 0,
    explanation: `6 squared = 36. 4 squared = 16. 36 + 16 = 52.`
  },
  {
    id: 9,
    type: "number",
    question: `Solve: 6n - 5 = 43`,
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: `6n = 43 + 5 = 48. n = 48 / 6 = 8.`
  },
  {
    id: 10,
    type: "number",
    question: `What is 4.5 x 0.6?`,
    options: [
      "0.27",
      "2.7",
      "27",
      "270",
    ],
    correctAnswer: 1,
    explanation: `4.5 x 0.6 = 4.5 x 6/10 = 27/10 = 2.7.`
  },
  {
    id: 11,
    type: "number",
    question: `Write 3/8 as a percentage.`,
    options: [
      "25%",
      "30%",
      "37.5%",
      "38%",
    ],
    correctAnswer: 2,
    explanation: `3/8 x 100 = 300/8 = 37.5%.`
  },
  {
    id: 12,
    type: "number",
    question: `A bag costs $28. If you buy 5, how much change do you receive from $150?`,
    options: [
      "$8",
      "$10",
      "$12",
      "$14",
    ],
    correctAnswer: 1,
    explanation: `5 x $28 = $140. Change = $150 - $140 = $10.`
  },
  {
    id: 13,
    type: "number",
    question: `Which fraction is greater: 5/9 or 3/5?`,
    options: [
      "5/9",
      "3/5",
      "They are equal",
      "Cannot tell",
    ],
    correctAnswer: 1,
    explanation: `LCD = 45. 5/9 = 25/45, 3/5 = 27/45. Since 27 > 25, 3/5 is greater.`
  },
  {
    id: 14,
    type: "number",
    question: `A number when divided by 9 gives 14 remainder 3. What is the number?`,
    options: [
      "126",
      "129",
      "132",
      "135",
    ],
    correctAnswer: 1,
    explanation: `Number = (14 x 9) + 3 = 126 + 3 = 129.`
  },
  {
    id: 15,
    type: "number",
    question: `What is 40% of 350?`,
    options: [
      "100",
      "120",
      "140",
      "160",
    ],
    correctAnswer: 2,
    explanation: `40% of 350 = 0.40 x 350 = 140.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A cuboid is 8 cm long, 5 cm wide, and 4 cm tall. What is its volume?`,
    options: [
      "17 cm3",
      "80 cm3",
      "160 cm3",
      "320 cm3",
    ],
    correctAnswer: 2,
    explanation: `Volume = 8 x 5 x 4 = 160 cm3.`
  },
  {
    id: 17,
    type: "measurement",
    question: `How many minutes are in 3/4 of an hour?`,
    options: [
      "30 min",
      "40 min",
      "45 min",
      "50 min",
    ],
    correctAnswer: 2,
    explanation: `3/4 of 60 = 45 minutes.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A rope is 12 m long. It is cut into pieces of 80 cm each. How many complete pieces can be cut?`,
    options: [
      "12",
      "14",
      "15",
      "16",
    ],
    correctAnswer: 2,
    explanation: `12 m = 1,200 cm. 1,200 / 80 = 15 pieces.`
  },
  {
    id: 19,
    type: "measurement",
    question: `The perimeter of a rectangle is 56 cm. Its width is 12 cm. What is its length?`,
    options: [
      "14 cm",
      "16 cm",
      "18 cm",
      "20 cm",
    ],
    correctAnswer: 1,
    explanation: `2(l + 12) = 56. l + 12 = 28. l = 16 cm.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A car uses 9 litres of fuel per 100 km. How much fuel is needed for a 300 km journey?`,
    options: [
      "18 L",
      "24 L",
      "27 L",
      "30 L",
    ],
    correctAnswer: 2,
    explanation: `(300/100) x 9 = 3 x 9 = 27 L.`
  },
  {
    id: 21,
    type: "measurement",
    question: `What is the area of a square with a side length of 13 cm?`,
    options: [
      "52 cm2",
      "104 cm2",
      "169 cm2",
      "208 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = 13 x 13 = 169 cm2.`
  },
  {
    id: 22,
    type: "measurement",
    question: `School starts at 8:15 AM and ends at 2:45 PM. How long is the school day?`,
    options: [
      "6 hours",
      "6 hours 15 minutes",
      "6 hours 30 minutes",
      "6 hours 45 minutes",
    ],
    correctAnswer: 2,
    explanation: `8:15 to 2:15 = 6 hours. 2:15 to 2:45 = 30 minutes. Total = 6 hours 30 minutes.`
  },
  {
    id: 23,
    type: "measurement",
    question: `3.5 kg of flour is shared equally among 7 bags. What is the mass of each bag?`,
    options: [
      "350 g",
      "400 g",
      "500 g",
      "550 g",
    ],
    correctAnswer: 2,
    explanation: `3.5 kg = 3,500 g. 3,500 / 7 = 500 g.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The temperature fell from 28 degrees C to -2 degrees C overnight. By how much did it fall?`,
    options: [
      "26 degrees",
      "28 degrees",
      "30 degrees",
      "32 degrees",
    ],
    correctAnswer: 2,
    explanation: `Change = 28 - (-2) = 28 + 2 = 30 degrees.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A rectangular plot is 15 m long and 10 m wide. A path 1 m wide runs around the INSIDE of the plot. What is the area of the inner section without the path?`,
    options: [
      "100 m2",
      "104 m2",
      "117 m2",
      "130 m2",
    ],
    correctAnswer: 2,
    explanation: `Inner: (15-2) x (10-2) = 13 x 9 = 117 m2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `How many faces does a triangular prism have?`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: `A triangular prism has 2 triangular faces and 3 rectangular faces = 5 faces.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What is the sum of the interior angles of a triangle?`,
    options: [
      "90 degrees",
      "120 degrees",
      "180 degrees",
      "360 degrees",
    ],
    correctAnswer: 2,
    explanation: `The interior angles of any triangle always add up to 180 degrees.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Which type of angle is between 180 degrees and 360 degrees?`,
    options: [
      "Acute",
      "Obtuse",
      "Straight",
      "Reflex",
    ],
    correctAnswer: 3,
    explanation: `A reflex angle is greater than 180 degrees and less than 360 degrees.`
  },
  {
    id: 29,
    type: "geometry",
    question: `A shape slides 5 units to the right without rotating or flipping. This is a:`,
    options: [
      "Rotation",
      "Reflection",
      "Translation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `Sliding without turning or flipping is a translation.`
  },
  {
    id: 30,
    type: "geometry",
    question: `How many lines of symmetry does a rectangle (non-square) have?`,
    options: [
      "1",
      "2",
      "4",
      "8",
    ],
    correctAnswer: 1,
    explanation: `A non-square rectangle has 2 lines of symmetry: one horizontal and one vertical.`
  },
  {
    id: 31,
    type: "geometry",
    question: `What is the interior angle sum of a pentagon?`,
    options: [
      "360 degrees",
      "450 degrees",
      "540 degrees",
      "720 degrees",
    ],
    correctAnswer: 2,
    explanation: `(5-2) x 180 = 3 x 180 = 540 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A square has a side of 9 cm. What is its area?`,
    options: [
      "18 cm2",
      "36 cm2",
      "72 cm2",
      "81 cm2",
    ],
    correctAnswer: 3,
    explanation: `Area = 9 x 9 = 81 cm2.`
  },
  {
    id: 33,
    type: "geometry",
    question: `What do you call lines that are always the same distance apart and never meet?`,
    options: [
      "Perpendicular",
      "Diagonal",
      "Parallel",
      "Intersecting",
    ],
    correctAnswer: 2,
    explanation: `Parallel lines never meet and remain the same distance apart.`
  },
  {
    id: 34,
    type: "statistics",
    question: `The ages of 6 players are: 14, 16, 13, 15, 14, 18. What is the mean age?`,
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 1,
    explanation: `Mean = (14+16+13+15+14+18) / 6 = 90 / 6 = 15.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 7, 19, 3, 11, 15, 9, 21, 5`,
    options: [
      "9",
      "10",
      "11",
      "12",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 3, 5, 7, 9, 11, 15, 19, 21. Median = (9+11)/2 = 10.`
  },
  {
    id: 36,
    type: "statistics",
    question: `Marks in 8 tests: 75, 82, 75, 91, 68, 75, 88, 79. What is the mode?`,
    options: [
      "68",
      "75",
      "82",
      "91",
    ],
    correctAnswer: 1,
    explanation: `75 appears 3 times. Mode = 75.`
  },
  {
    id: 37,
    type: "statistics",
    question: `What is the range of: 34, 51, 28, 63, 47, 39?`,
    options: [
      "19",
      "25",
      "35",
      "63",
    ],
    correctAnswer: 2,
    explanation: `Range = 63 - 28 = 35.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A survey of 60 students shows 1/4 prefer Art. How many prefer Art?`,
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 1,
    explanation: `1/4 of 60 = 15 students.`
  },
  {
    id: 39,
    type: "statistics",
    question: `In a set of 5 numbers, the mean is 20 and four of the numbers are 18, 25, 17, and 22. What is the fifth number?`,
    options: [
      "16",
      "17",
      "18",
      "19",
    ],
    correctAnswer: 2,
    explanation: `Total = 5 x 20 = 100. Sum of 4 known = 18+25+17+22 = 82. Fifth = 100 - 82 = 18.`
  },
  {
    id: 40,
    type: "statistics",
    question: `A die is rolled. What is the probability of getting a number greater than 4?`,
    options: [
      "1/6",
      "1/3",
      "1/2",
      "2/3",
    ],
    correctAnswer: 1,
    explanation: `Numbers greater than 4: 5, 6. P = 2/6 = 1/3.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate7MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate7Questions : numeracyModerate7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 7</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Moderate 7</h1>
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
