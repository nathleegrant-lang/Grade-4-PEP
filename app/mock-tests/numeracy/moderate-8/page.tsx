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

const numeracyModerate8Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 12,050 - 4,876?`,
    options: [
      "7,074",
      "7,174",
      "7,274",
      "7,374",
    ],
    correctAnswer: 1,
    explanation: `12,050 - 4,876 = 7,174. Check: 4,876 + 7,174 = 12,050.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 47 x 23?`,
    options: [
      "1,071",
      "1,081",
      "1,091",
      "1,101",
    ],
    correctAnswer: 2,
    explanation: `47 x 23 = (47 x 20) + (47 x 3) = 940 + 141 = 1,081.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 945 divided by 9?`,
    options: [
      "95",
      "100",
      "105",
      "115",
    ],
    correctAnswer: 2,
    explanation: `945 / 9 = 105. Check: 105 x 9 = 945.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the HCF of 30 and 45?`,
    options: [
      "5",
      "10",
      "15",
      "20",
    ],
    correctAnswer: 2,
    explanation: `Factors of 30: 1,2,3,5,6,10,15,30. Factors of 45: 1,3,5,9,15,45. HCF = 15.`
  },
  {
    id: 5,
    type: "number",
    question: `Which of these numbers is a perfect square?`,
    options: [
      "50",
      "72",
      "81",
      "90",
    ],
    correctAnswer: 2,
    explanation: `9 x 9 = 81. 81 is a perfect square.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 7/8 - 3/4?`,
    options: [
      "4/4",
      "1/8",
      "1/4",
      "3/8",
    ],
    correctAnswer: 1,
    explanation: `Convert 3/4 to eighths: 3/4 = 6/8. Then 7/8 - 6/8 = 1/8.`
  },
  {
    id: 7,
    type: "number",
    question: `A price of $85 is increased by 20%. What is the new price?`,
    options: [
      "$95",
      "$100",
      "$102",
      "$108",
    ],
    correctAnswer: 2,
    explanation: `20% of $85 = $17. New price = $85 + $17 = $102.`
  },
  {
    id: 8,
    type: "number",
    question: `Solve: n/4 + 3 = 11`,
    options: [
      "28",
      "30",
      "32",
      "34",
    ],
    correctAnswer: 2,
    explanation: `n/4 = 11 - 3 = 8. n = 8 x 4 = 32.`
  },
  {
    id: 9,
    type: "number",
    question: `Express 7/20 as a decimal.`,
    options: [
      "0.07",
      "0.35",
      "0.7",
      "0.72",
    ],
    correctAnswer: 1,
    explanation: `7/20 = 35/100 = 0.35.`
  },
  {
    id: 10,
    type: "number",
    question: `What is 30% of 240?`,
    options: [
      "60",
      "66",
      "72",
      "80",
    ],
    correctAnswer: 2,
    explanation: `30% of 240 = 0.30 x 240 = 72.`
  },
  {
    id: 11,
    type: "number",
    question: `A number rounded to the nearest ten is 80. What is the LARGEST possible value of the original number?`,
    options: [
      "74",
      "79",
      "84",
      "89",
    ],
    correctAnswer: 2,
    explanation: `Numbers that round to 80: 75 to 84. Largest = 84.`
  },
  {
    id: 12,
    type: "number",
    question: `What is 6 and 1/2 - 2 and 3/4?`,
    options: [
      "3 and 1/4",
      "3 and 1/2",
      "3 and 3/4",
      "4 and 1/4",
    ],
    correctAnswer: 2,
    explanation: `6 1/2 = 26/4, 2 3/4 = 11/4. 26/4 - 11/4 = 15/4 = 3 and 3/4.`
  },
  {
    id: 13,
    type: "number",
    question: `A market stall earns $120 profit per day. How much profit is made in 4 and a half days?`,
    options: [
      "$480",
      "$520",
      "$540",
      "$560",
    ],
    correctAnswer: 2,
    explanation: `4.5 x $120 = $540.`
  },
  {
    id: 14,
    type: "number",
    question: `What is the product of the first three prime numbers?`,
    options: [
      "6",
      "15",
      "30",
      "36",
    ],
    correctAnswer: 2,
    explanation: `First three primes: 2, 3, 5. Product = 2 x 3 x 5 = 30.`
  },
  {
    id: 15,
    type: "number",
    question: `Write 0.08 as a percentage.`,
    options: [
      "0.8%",
      "8%",
      "80%",
      "0.08%",
    ],
    correctAnswer: 1,
    explanation: `0.08 x 100 = 8%.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A rectangle has an area of 90 cm2 and a length of 15 cm. What is its width?`,
    options: [
      "5 cm",
      "6 cm",
      "7 cm",
      "8 cm",
    ],
    correctAnswer: 1,
    explanation: `Width = 90 / 15 = 6 cm.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A journey takes 4 hours 20 minutes. If the journey ends at 7:05 PM, when did it start?`,
    options: [
      "2:35 PM",
      "2:45 PM",
      "3:00 PM",
      "3:15 PM",
    ],
    correctAnswer: 1,
    explanation: `7:05 PM minus 4 hours = 3:05 PM. 3:05 PM minus 20 minutes = 2:45 PM.`
  },
  {
    id: 18,
    type: "measurement",
    question: `How many cm3 are in 2.5 litres?`,
    options: [
      "250 cm3",
      "2,050 cm3",
      "2,500 cm3",
      "25,000 cm3",
    ],
    correctAnswer: 2,
    explanation: `1 litre = 1,000 cm3. 2.5 x 1,000 = 2,500 cm3.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A field in the shape of a parallelogram has a base of 20 m and a height of 14 m. What is its area?`,
    options: [
      "34 m2",
      "140 m2",
      "280 m2",
      "560 m2",
    ],
    correctAnswer: 2,
    explanation: `Area = base x height = 20 x 14 = 280 m2.`
  },
  {
    id: 20,
    type: "measurement",
    question: `3 kg 200 g of bananas are divided equally into 8 bags. What is the mass of each bag in grams?`,
    options: [
      "350 g",
      "380 g",
      "400 g",
      "420 g",
    ],
    correctAnswer: 2,
    explanation: `3 kg 200 g = 3,200 g. 3,200 / 8 = 400 g.`
  },
  {
    id: 21,
    type: "measurement",
    question: `Which measurement is the longest?`,
    options: [
      "3,500 m",
      "3.6 km",
      "3,450 m",
      "0.004 km",
    ],
    correctAnswer: 1,
    explanation: `Convert all to m: 3,500 m, 3,600 m, 3,450 m, 4 m. 3,600 m is longest.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A wall is 4 m high and 6 m wide. One tin of paint covers 8 m2. How many tins are needed?`,
    options: [
      "2",
      "3",
      "4",
      "6",
    ],
    correctAnswer: 1,
    explanation: `Wall area = 4 x 6 = 24 m2. Tins = 24 / 8 = 3.`
  },
  {
    id: 23,
    type: "measurement",
    question: `Convert 185 minutes to hours and minutes.`,
    options: [
      "2 h 55 min",
      "3 h 5 min",
      "3 h 15 min",
      "3 h 25 min",
    ],
    correctAnswer: 1,
    explanation: `180 minutes = 3 hours. 185 - 180 = 5 minutes. Total = 3 h 5 min.`
  },
  {
    id: 24,
    type: "measurement",
    question: `A cuboid is 6 cm long, 4 cm wide, and 3 cm tall. What is its volume?`,
    options: [
      "13 cm3",
      "36 cm3",
      "72 cm3",
      "144 cm3",
    ],
    correctAnswer: 2,
    explanation: `Volume = 6 x 4 x 3 = 72 cm3.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A square has a perimeter of 52 cm. What is its area?`,
    options: [
      "52 cm2",
      "104 cm2",
      "169 cm2",
      "208 cm2",
    ],
    correctAnswer: 2,
    explanation: `Side = 52 / 4 = 13 cm. Area = 13 x 13 = 169 cm2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `A regular polygon has 8 sides. What is the size of each interior angle?`,
    options: [
      "120 degrees",
      "125 degrees",
      "135 degrees",
      "145 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = (8-2) x 180 = 1,080 degrees. Each angle = 1,080 / 8 = 135 degrees.`
  },
  {
    id: 27,
    type: "geometry",
    question: `Two angles of a quadrilateral are 85 and 110 degrees. The other two angles are equal. What is each equal angle?`,
    options: [
      "75 degrees",
      "80 degrees",
      "82.5 degrees",
      "85 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = 360. Two equal angles = 360 - 85 - 110 = 165. Each = 165 / 2 = 82.5 degrees.`
  },
  {
    id: 28,
    type: "geometry",
    question: `How many vertices does a hexagonal prism have?`,
    options: [
      "6",
      "8",
      "10",
      "12",
    ],
    correctAnswer: 3,
    explanation: `A hexagonal prism has 2 hexagonal faces, each with 6 vertices. Total = 12 vertices.`
  },
  {
    id: 29,
    type: "geometry",
    question: `A triangle has angles in the ratio 1:2:3. What is the size of the largest angle?`,
    options: [
      "30 degrees",
      "60 degrees",
      "90 degrees",
      "120 degrees",
    ],
    correctAnswer: 2,
    explanation: `Total parts = 6. Each part = 180/6 = 30 degrees. Largest = 3 x 30 = 90 degrees.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Which of these shapes has exactly one pair of parallel sides?`,
    options: [
      "Square",
      "Rectangle",
      "Trapezoid",
      "Rhombus",
    ],
    correctAnswer: 2,
    explanation: `A trapezoid has exactly one pair of parallel sides.`
  },
  {
    id: 31,
    type: "geometry",
    question: `What is the size of each exterior angle of a regular octagon?`,
    options: [
      "40 degrees",
      "45 degrees",
      "50 degrees",
      "55 degrees",
    ],
    correctAnswer: 1,
    explanation: `Sum of exterior angles = 360 degrees. Each = 360 / 8 = 45 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A rectangle is 11 cm long and 8 cm wide. What is its area?`,
    options: [
      "19 cm2",
      "38 cm2",
      "80 cm2",
      "88 cm2",
    ],
    correctAnswer: 3,
    explanation: `Area = 11 x 8 = 88 cm2.`
  },
  {
    id: 33,
    type: "geometry",
    question: `The diagonal of a square is 10 cm. The area of the square is:`,
    options: [
      "25 cm2",
      "50 cm2",
      "100 cm2",
      "200 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area of square = (diagonal)2 / 2 = 100 / 2 = 50 cm2.`
  },
  {
    id: 34,
    type: "statistics",
    question: `Find the mean of: 6, 8, 10, 4, 12, 8, 8`,
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: `Mean = (6+8+10+4+12+8+8) / 7 = 56 / 7 = 8.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 55, 40, 72, 38, 65, 48, 60`,
    options: [
      "48",
      "55",
      "60",
      "65",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 38, 40, 48, 55, 60, 65, 72. Middle (4th) = 55.`
  },
  {
    id: 36,
    type: "statistics",
    question: `Data: 4, 9, 4, 12, 7, 4, 9, 11. What is the mode?`,
    options: [
      "4",
      "7",
      "9",
      "12",
    ],
    correctAnswer: 0,
    explanation: `4 appears 3 times, more than any other. Mode = 4.`
  },
  {
    id: 37,
    type: "statistics",
    question: `The mean of 6 numbers is 14. Five of the numbers are: 11, 18, 9, 15, 17. What is the sixth number?`,
    options: [
      "12",
      "13",
      "14",
      "15",
    ],
    correctAnswer: 2,
    explanation: `Total = 6 x 14 = 84. Sum of 5: 11+18+9+15+17 = 70. Sixth = 84 - 70 = 14.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A bar chart shows: Mon 24, Tue 36, Wed 18, Thu 30. What is the mean?`,
    options: [
      "24",
      "26",
      "27",
      "28",
    ],
    correctAnswer: 2,
    explanation: `Mean = (24+36+18+30) / 4 = 108 / 4 = 27.`
  },
  {
    id: 39,
    type: "statistics",
    question: `A spinner has 12 sections: 4 red, 5 blue, 3 green. What is the probability of NOT landing on blue?`,
    options: [
      "5/12",
      "7/12",
      "2/3",
      "3/4",
    ],
    correctAnswer: 1,
    explanation: `P(not blue) = (12-5)/12 = 7/12.`
  },
  {
    id: 40,
    type: "statistics",
    question: `What is the range of: 1.8, 3.4, 0.9, 4.7, 2.6?`,
    options: [
      "3.8",
      "3.9",
      "4.0",
      "4.1",
    ],
    correctAnswer: 0,
    explanation: `Range = 4.7 - 0.9 = 3.8.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate8MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate8Questions : numeracyModerate8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 8</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 8 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Moderate 8</h1>
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
