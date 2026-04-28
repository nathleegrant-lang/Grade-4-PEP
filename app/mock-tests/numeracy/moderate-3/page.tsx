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

const numeracyModerate3Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 6,000 - 2,748?`,
    options: [
      "3,152",
      "3,252",
      "3,348",
      "3,452",
    ],
    correctAnswer: 1,
    explanation: `6,000 - 2,000 = 4,000. Then 4,000 - 748 = 3,252.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 68 x 9?`,
    options: [
      "542",
      "602",
      "612",
      "622",
    ],
    correctAnswer: 2,
    explanation: `68 x 9: (60 x 9) + (8 x 9) = 540 + 72 = 612.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 504 divided by 6?`,
    options: [
      "74",
      "80",
      "84",
      "86",
    ],
    correctAnswer: 2,
    explanation: `504 / 6 = 84. Check: 84 x 6 = 504.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the LCM (Lowest Common Multiple) of 4 and 6?`,
    options: [
      "8",
      "10",
      "12",
      "24",
    ],
    correctAnswer: 2,
    explanation: `Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12... The first common multiple is 12.`
  },
  {
    id: 5,
    type: "number",
    question: `Which of these is a prime number?`,
    options: [
      "15",
      "21",
      "29",
      "33",
    ],
    correctAnswer: 2,
    explanation: `29 has no factors other than 1 and itself. 15 = 3 x 5, 21 = 3 x 7, 33 = 3 x 11.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 5/6 - 1/3?`,
    options: [
      "4/3",
      "1/2",
      "4/6",
      "1/6",
    ],
    correctAnswer: 1,
    explanation: `Convert 1/3 to sixths: 1/3 = 2/6. Then 5/6 - 2/6 = 3/6 = 1/2.`
  },
  {
    id: 7,
    type: "number",
    question: `Write 0.35 as a percentage.`,
    options: [
      "3.5%",
      "0.35%",
      "35%",
      "350%",
    ],
    correctAnswer: 2,
    explanation: `Multiply by 100: 0.35 x 100 = 35%.`
  },
  {
    id: 8,
    type: "number",
    question: `Which of these numbers is NOT a multiple of 7?`,
    options: [
      "21",
      "42",
      "56",
      "60",
    ],
    correctAnswer: 3,
    explanation: `21 = 7 x 3, 42 = 7 x 6, 56 = 7 x 8. But 60 / 7 is not a whole number, so 60 is NOT a multiple of 7.`
  },
  {
    id: 9,
    type: "number",
    question: `A school has 360 students. 25% are in Grade 4. How many students are in Grade 4?`,
    options: [
      "72",
      "80",
      "90",
      "100",
    ],
    correctAnswer: 2,
    explanation: `25% of 360 = 360 / 4 = 90 students.`
  },
  {
    id: 10,
    type: "number",
    question: `Solve for n: 4n = 52`,
    options: [
      "11",
      "12",
      "13",
      "14",
    ],
    correctAnswer: 2,
    explanation: `n = 52 / 4 = 13. Check: 4 x 13 = 52.`
  },
  {
    id: 11,
    type: "number",
    question: `What is 3.6 x 7?`,
    options: [
      "21.2",
      "24.2",
      "25.2",
      "26.2",
    ],
    correctAnswer: 2,
    explanation: `3.6 x 7: (3 x 7) + (0.6 x 7) = 21 + 4.2 = 25.2.`
  },
  {
    id: 12,
    type: "number",
    question: `Express 3/5 as a decimal.`,
    options: [
      "0.35",
      "0.53",
      "0.6",
      "0.65",
    ],
    correctAnswer: 2,
    explanation: `3 / 5 = 0.6. Or: 3/5 = 6/10 = 0.6.`
  },
  {
    id: 13,
    type: "number",
    question: `A vendor earns $240 on Monday and $185 on Tuesday. She spends $75 on supplies. How much does she have left?`,
    options: [
      "$340",
      "$350",
      "$360",
      "$370",
    ],
    correctAnswer: 1,
    explanation: `Total earned: $240 + $185 = $425. After spending: $425 - $75 = $350.`
  },
  {
    id: 14,
    type: "number",
    question: `Which shows the decimals in order from LEAST to GREATEST?`,
    options: [
      "1.9, 1.09, 1.90, 1.009",
      "1.009, 1.09, 1.9, 1.90",
      "1.90, 1.9, 1.09, 1.009",
      "1.09, 1.009, 1.9, 1.90",
    ],
    correctAnswer: 1,
    explanation: `1.009 < 1.09 < 1.9 = 1.90. In ascending order: 1.009, 1.09, 1.9, 1.90.`
  },
  {
    id: 15,
    type: "number",
    question: `Kezia saves $35 per week. How many weeks will it take her to save $420?`,
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: `420 / 35 = 12 weeks.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A triangle has a base of 14 cm and a height of 8 cm. What is its area?`,
    options: [
      "22 cm2",
      "56 cm2",
      "112 cm2",
      "44 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area of triangle = 1/2 x base x height = 1/2 x 14 x 8 = 56 cm2.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A rectangular garden has a length of 18 m and a width of 12 m. What is its perimeter?`,
    options: [
      "30 m",
      "60 m",
      "72 m",
      "216 m",
    ],
    correctAnswer: 1,
    explanation: `Perimeter = 2 x (18 + 12) = 2 x 30 = 60 m.`
  },
  {
    id: 18,
    type: "measurement",
    question: `How many minutes are in 2 hours and 25 minutes?`,
    options: [
      "125 min",
      "135 min",
      "145 min",
      "155 min",
    ],
    correctAnswer: 2,
    explanation: `2 hours = 120 minutes. 120 + 25 = 145 minutes.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A tank holds 8.5 litres. How many millilitres is this?`,
    options: [
      "850 mL",
      "1,850 mL",
      "8,050 mL",
      "8,500 mL",
    ],
    correctAnswer: 3,
    explanation: `1 litre = 1,000 mL. 8.5 x 1,000 = 8,500 mL.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A bag of flour weighs 2 kg 750 g. What is its mass in grams?`,
    options: [
      "2,075 g",
      "2,750 g",
      "27,050 g",
      "27,500 g",
    ],
    correctAnswer: 1,
    explanation: `2 kg = 2,000 g. 2,000 + 750 = 2,750 g.`
  },
  {
    id: 21,
    type: "measurement",
    question: `A bus departs at 7:40 AM and arrives at 9:15 AM. How long is the journey?`,
    options: [
      "1 hour 25 minutes",
      "1 hour 35 minutes",
      "1 hour 45 minutes",
      "2 hours 5 minutes",
    ],
    correctAnswer: 1,
    explanation: `7:40 to 8:40 = 1 hour. 8:40 to 9:15 = 35 minutes. Total = 1 hour 35 minutes.`
  },
  {
    id: 22,
    type: "measurement",
    question: `Which is the most appropriate unit to measure the distance across a football field?`,
    options: [
      "Millimetres",
      "Centimetres",
      "Metres",
      "Kilometres",
    ],
    correctAnswer: 2,
    explanation: `A football field is about 100 metres wide. Metres are the most appropriate unit.`
  },
  {
    id: 23,
    type: "measurement",
    question: `A rectangle is 13 cm long and 6 cm wide. What is its area?`,
    options: [
      "19 cm2",
      "38 cm2",
      "72 cm2",
      "78 cm2",
    ],
    correctAnswer: 3,
    explanation: `Area = length x width = 13 x 6 = 78 cm2.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The temperature at dawn was 18 degrees C. It rose by 9 degrees by midday, then fell by 5 degrees in the evening. What was the evening temperature?`,
    options: [
      "20 degrees C",
      "22 degrees C",
      "24 degrees C",
      "27 degrees C",
    ],
    correctAnswer: 1,
    explanation: `18 + 9 = 27. 27 - 5 = 22 degrees C.`
  },
  {
    id: 25,
    type: "measurement",
    question: `How many weeks are in one year?`,
    options: [
      "48",
      "50",
      "52",
      "54",
    ],
    correctAnswer: 2,
    explanation: `One year has 52 weeks (52 x 7 = 364 days, close to 365).`
  },
  {
    id: 26,
    type: "geometry",
    question: `A triangle has sides of 5 cm, 5 cm, and 8 cm. What type of triangle is it?`,
    options: [
      "Equilateral",
      "Isosceles",
      "Scalene",
      "Right-angled",
    ],
    correctAnswer: 1,
    explanation: `An isosceles triangle has exactly two equal sides. Here, two sides are both 5 cm.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What is the size of each interior angle in an equilateral triangle?`,
    options: [
      "45 degrees",
      "60 degrees",
      "90 degrees",
      "120 degrees",
    ],
    correctAnswer: 1,
    explanation: `The three angles of an equilateral triangle are all equal. 180 / 3 = 60 degrees each.`
  },
  {
    id: 28,
    type: "geometry",
    question: `How many faces, edges, and vertices does a rectangular prism (cuboid) have?`,
    options: [
      "6 faces, 10 edges, 8 vertices",
      "6 faces, 12 edges, 8 vertices",
      "8 faces, 12 edges, 6 vertices",
      "6 faces, 12 edges, 6 vertices",
    ],
    correctAnswer: 1,
    explanation: `A rectangular prism has 6 faces, 12 edges, and 8 vertices.`
  },
  {
    id: 29,
    type: "geometry",
    question: `Which transformation moves a shape to a new position WITHOUT turning or flipping it?`,
    options: [
      "Rotation",
      "Reflection",
      "Translation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `A translation slides a shape to a new position without changing its orientation.`
  },
  {
    id: 30,
    type: "geometry",
    question: `How many lines of symmetry does a regular pentagon have?`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: `A regular pentagon has 5 lines of symmetry, one through each vertex and the midpoint of the opposite side.`
  },
  {
    id: 31,
    type: "geometry",
    question: `Two lines that meet at a right angle are called:`,
    options: [
      "Parallel lines",
      "Intersecting lines",
      "Perpendicular lines",
      "Diagonal lines",
    ],
    correctAnswer: 2,
    explanation: `Perpendicular lines meet at exactly 90 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A quadrilateral has angles of 90, 100, and 85 degrees. What is the fourth angle?`,
    options: [
      "75 degrees",
      "80 degrees",
      "85 degrees",
      "95 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum of angles in a quadrilateral = 360 degrees. Fourth angle = 360 - 90 - 100 - 85 = 85 degrees.`
  },
  {
    id: 33,
    type: "geometry",
    question: `A square has an area of 49 cm2. What is its perimeter?`,
    options: [
      "7 cm",
      "14 cm",
      "28 cm",
      "196 cm",
    ],
    correctAnswer: 2,
    explanation: `Side = square root of 49 = 7 cm. Perimeter = 4 x 7 = 28 cm.`
  },
  {
    id: 34,
    type: "statistics",
    question: `Find the mean of: 24, 18, 30, 12, 36`,
    options: [
      "20",
      "22",
      "24",
      "26",
    ],
    correctAnswer: 2,
    explanation: `Mean = (24 + 18 + 30 + 12 + 36) / 5 = 120 / 5 = 24.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 11, 4, 17, 8, 14, 6, 20`,
    options: [
      "8",
      "11",
      "14",
      "17",
    ],
    correctAnswer: 1,
    explanation: `Arranged in order: 4, 6, 8, 11, 14, 17, 20. The middle (4th) value is 11.`
  },
  {
    id: 36,
    type: "statistics",
    question: `The scores of 8 students are: 7, 9, 7, 5, 8, 7, 6, 9. What is the mode?`,
    options: [
      "5",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 1,
    explanation: `7 appears 3 times, which is more than any other score. The mode is 7.`
  },
  {
    id: 37,
    type: "statistics",
    question: `What is the range of: 45, 28, 63, 19, 52?`,
    options: [
      "34",
      "44",
      "54",
      "64",
    ],
    correctAnswer: 1,
    explanation: `Range = highest - lowest = 63 - 19 = 44.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A bar chart shows: Monday = 30 students, Tuesday = 45, Wednesday = 25, Thursday = 40. What is the mean number of students per day?`,
    options: [
      "33",
      "35",
      "37",
      "40",
    ],
    correctAnswer: 1,
    explanation: `Mean = (30 + 45 + 25 + 40) / 4 = 140 / 4 = 35.`
  },
  {
    id: 39,
    type: "statistics",
    question: `In a class of 40, 16 play cricket, 14 play football, and 10 play neither. What fraction of the class plays cricket?`,
    options: [
      "1/4",
      "2/5",
      "3/8",
      "1/2",
    ],
    correctAnswer: 1,
    explanation: `Fraction playing cricket = 16/40 = 2/5.`
  },
  {
    id: 40,
    type: "statistics",
    question: `A spinner has 8 equal sections: 3 red, 2 blue, 2 green, 1 yellow. What is the probability of spinning green?`,
    options: [
      "1/8",
      "1/4",
      "2/5",
      "3/8",
    ],
    correctAnswer: 1,
    explanation: `P(green) = 2/8 = 1/4.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate3MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate3Questions : numeracyModerate3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 3</p>
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
                      alt="Shazonique's Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 3 Report</CardTitle>
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {q.type === "number"
                                ? "Number Operations"
                                : q.type === "measurement"
                                ? "Measurement"
                                : q.type === "geometry"
                                ? "Geometry"
                                : q.type === "statistics"
                                ? "Data & Statistics"
                                : ""}
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
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Moderate 3</h1>
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
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700 uppercase">
                  {question.type === "number"
                    ? "Number Operations"
                    : question.type === "measurement"
                    ? "Measurement"
                    : question.type === "geometry"
                    ? "Geometry"
                    : question.type === "statistics"
                    ? "Data & Statistics"
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
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
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
                        ? "bg-blue-100 text-blue-700"
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
