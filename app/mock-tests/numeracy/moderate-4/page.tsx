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

const numeracyModerate4Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 8,032 - 3,478?`,
    options: [
      "4,454",
      "4,554",
      "4,564",
      "4,654",
    ],
    correctAnswer: 1,
    explanation: `8,032 - 3,000 = 5,032. Then 5,032 - 478 = 4,554.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 54 x 12?`,
    options: [
      "628",
      "638",
      "648",
      "658",
    ],
    correctAnswer: 2,
    explanation: `54 x 12 = (54 x 10) + (54 x 2) = 540 + 108 = 648.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 756 divided by 9?`,
    options: [
      "74",
      "82",
      "84",
      "88",
    ],
    correctAnswer: 2,
    explanation: `756 / 9 = 84. Check: 84 x 9 = 756.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the HCF (Highest Common Factor) of 16 and 24?`,
    options: [
      "4",
      "6",
      "8",
      "12",
    ],
    correctAnswer: 2,
    explanation: `Factors of 16: 1,2,4,8,16. Factors of 24: 1,2,3,4,6,8,12,24. The HCF = 8.`
  },
  {
    id: 5,
    type: "number",
    question: `Which of the following is a composite number?`,
    options: [
      "7",
      "11",
      "13",
      "15",
    ],
    correctAnswer: 3,
    explanation: `A composite number has more than two factors. 15 = 3 x 5, so 15 is composite.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 2 and 3/4 + 1 and 1/2?`,
    options: [
      "3 and 3/4",
      "4 and 1/4",
      "4 and 3/4",
      "5 and 1/4",
    ],
    correctAnswer: 1,
    explanation: `2 3/4 = 11/4. 1 1/2 = 6/4. Sum = 17/4 = 4 and 1/4.`
  },
  {
    id: 7,
    type: "number",
    question: `A jacket costs $120. The price is increased by 15%. What is the new price?`,
    options: [
      "$132",
      "$135",
      "$138",
      "$142",
    ],
    correctAnswer: 2,
    explanation: `15% of $120 = $18. New price = $120 + $18 = $138.`
  },
  {
    id: 8,
    type: "number",
    question: `Solve: 3n + 7 = 28`,
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: `3n = 28 - 7 = 21. n = 21 / 3 = 7.`
  },
  {
    id: 9,
    type: "number",
    question: `What is 8.4 divided by 0.6?`,
    options: [
      "1.4",
      "14",
      "140",
      "0.14",
    ],
    correctAnswer: 1,
    explanation: `8.4 / 0.6 = 84 / 6 = 14.`
  },
  {
    id: 10,
    type: "number",
    question: `Which fraction is equivalent to 0.75?`,
    options: [
      "3/4",
      "2/3",
      "7/10",
      "4/5",
    ],
    correctAnswer: 0,
    explanation: `0.75 = 75/100 = 3/4. Divide numerator and denominator by 25.`
  },
  {
    id: 11,
    type: "number",
    question: `Round 12.648 to the nearest hundredth.`,
    options: [
      "12.6",
      "12.64",
      "12.65",
      "12.7",
    ],
    correctAnswer: 2,
    explanation: `The thousandths digit is 8 (5 or more), so round up: 12.65.`
  },
  {
    id: 12,
    type: "number",
    question: `A bag of rice weighs 5 kg. Marcus used 2/5 of it. How many kg did he use?`,
    options: [
      "1 kg",
      "2 kg",
      "2.5 kg",
      "3 kg",
    ],
    correctAnswer: 1,
    explanation: `2/5 of 5 = (2 x 5) / 5 = 2 kg.`
  },
  {
    id: 13,
    type: "number",
    question: `5 books cost $67.50. How much do 8 books cost?`,
    options: [
      "$104.00",
      "$108.00",
      "$112.50",
      "$115.00",
    ],
    correctAnswer: 1,
    explanation: `Cost per book = $67.50 / 5 = $13.50. For 8 books: 8 x $13.50 = $108.00.`
  },
  {
    id: 14,
    type: "number",
    question: `What is the next number in the sequence: 2, 6, 18, 54, ___?`,
    options: [
      "108",
      "162",
      "216",
      "270",
    ],
    correctAnswer: 1,
    explanation: `Each term is multiplied by 3. 54 x 3 = 162.`
  },
  {
    id: 15,
    type: "number",
    question: `A box holds 144 eggs packed equally into trays of 12. How many trays are needed?`,
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: `144 / 12 = 12 trays.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A parallelogram has a base of 15 cm and a height of 8 cm. What is its area?`,
    options: [
      "23 cm2",
      "46 cm2",
      "120 cm2",
      "180 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area of parallelogram = base x height = 15 x 8 = 120 cm2.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A square has a perimeter of 48 cm. What is its area?`,
    options: [
      "12 cm2",
      "96 cm2",
      "144 cm2",
      "192 cm2",
    ],
    correctAnswer: 2,
    explanation: `Side = 48 / 4 = 12 cm. Area = 12 x 12 = 144 cm2.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A train arrives at 2:35 PM. The journey took 3 hours 50 minutes. What time did it depart?`,
    options: [
      "10:35 AM",
      "10:45 AM",
      "11:05 AM",
      "11:45 AM",
    ],
    correctAnswer: 1,
    explanation: `2:35 PM minus 3 hours = 11:35 AM. 11:35 AM minus 50 minutes = 10:45 AM.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A rectangular box is 10 cm long, 6 cm wide, and 5 cm tall. What is its volume?`,
    options: [
      "21 cm3",
      "150 cm3",
      "300 cm3",
      "600 cm3",
    ],
    correctAnswer: 2,
    explanation: `Volume = length x width x height = 10 x 6 x 5 = 300 cm3.`
  },
  {
    id: 20,
    type: "measurement",
    question: `How many metres are in 3.2 kilometres?`,
    options: [
      "32 m",
      "320 m",
      "3,200 m",
      "32,000 m",
    ],
    correctAnswer: 2,
    explanation: `1 km = 1,000 m. 3.2 km = 3.2 x 1,000 = 3,200 m.`
  },
  {
    id: 21,
    type: "measurement",
    question: `A bag of sugar has a mass of 1.5 kg. A shop has 24 such bags. What is the total mass in kg?`,
    options: [
      "25.5 kg",
      "32 kg",
      "36 kg",
      "38.5 kg",
    ],
    correctAnswer: 2,
    explanation: `24 x 1.5 = 36 kg.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A tank contains 15 litres of water. Each day 2.5 litres are used. How many days until the tank is empty?`,
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 2,
    explanation: `15 / 2.5 = 6 days.`
  },
  {
    id: 23,
    type: "measurement",
    question: `The temperature in a fridge is -3 degrees C. The room temperature is 24 degrees C. What is the difference?`,
    options: [
      "21 degrees",
      "24 degrees",
      "27 degrees",
      "28 degrees",
    ],
    correctAnswer: 2,
    explanation: `Difference = 24 - (-3) = 24 + 3 = 27 degrees C.`
  },
  {
    id: 24,
    type: "measurement",
    question: `What month comes 7 months after May?`,
    options: [
      "November",
      "December",
      "October",
      "September",
    ],
    correctAnswer: 1,
    explanation: `May is month 5. 5 + 7 = 12, which is December.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A rectangular swimming pool is 25 m long and 10 m wide. What is its area?`,
    options: [
      "35 m2",
      "70 m2",
      "250 m2",
      "500 m2",
    ],
    correctAnswer: 2,
    explanation: `Area = length x width = 25 x 10 = 250 m2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `An angle of 135 degrees is best described as:`,
    options: [
      "Acute",
      "Right",
      "Obtuse",
      "Reflex",
    ],
    correctAnswer: 2,
    explanation: `An obtuse angle is greater than 90 degrees and less than 180 degrees. 135 degrees is obtuse.`
  },
  {
    id: 27,
    type: "geometry",
    question: `Two angles of a triangle are 55 degrees and 70 degrees. What is the third angle?`,
    options: [
      "45 degrees",
      "55 degrees",
      "60 degrees",
      "65 degrees",
    ],
    correctAnswer: 1,
    explanation: `Third angle = 180 - 55 - 70 = 55 degrees.`
  },
  {
    id: 28,
    type: "geometry",
    question: `A rectangle is 16 cm long and 9 cm wide. How many lines of symmetry does it have?`,
    options: [
      "1",
      "2",
      "4",
      "8",
    ],
    correctAnswer: 1,
    explanation: `A non-square rectangle has exactly 2 lines of symmetry: one horizontal and one vertical through the midpoints of opposite sides.`
  },
  {
    id: 29,
    type: "geometry",
    question: `How many edges does a triangular prism have?`,
    options: [
      "5",
      "6",
      "8",
      "9",
    ],
    correctAnswer: 3,
    explanation: `A triangular prism has 3 edges on each triangular face plus 3 edges connecting them = 9 edges.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Which transformation turns a shape around a fixed point?`,
    options: [
      "Translation",
      "Reflection",
      "Rotation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `A rotation turns a shape around a fixed point called the centre of rotation.`
  },
  {
    id: 31,
    type: "geometry",
    question: `In a rhombus, which statement is TRUE?`,
    options: [
      "All angles are right angles",
      "Opposite angles are equal",
      "All angles are different",
      "Adjacent angles are equal",
    ],
    correctAnswer: 1,
    explanation: `In a rhombus, opposite angles are equal (and adjacent angles are supplementary).`
  },
  {
    id: 32,
    type: "geometry",
    question: `Two angles are supplementary. One measures 65 degrees. What is the other?`,
    options: [
      "25 degrees",
      "115 degrees",
      "125 degrees",
      "145 degrees",
    ],
    correctAnswer: 1,
    explanation: `Supplementary angles add to 180 degrees. 180 - 65 = 115 degrees.`
  },
  {
    id: 33,
    type: "geometry",
    question: `A rectangle has a length of 10 cm and a width of 6 cm. What is its area?`,
    options: [
      "16 cm2",
      "32 cm2",
      "56 cm2",
      "60 cm2",
    ],
    correctAnswer: 3,
    explanation: `Area = length x width = 10 x 6 = 60 cm2.`
  },
  {
    id: 34,
    type: "statistics",
    question: `Find the mean of: 8, 15, 12, 20, 5`,
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: `Mean = (8 + 15 + 12 + 20 + 5) / 5 = 60 / 5 = 12.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 19, 7, 25, 13, 31, 9`,
    options: [
      "13",
      "14",
      "16",
      "19",
    ],
    correctAnswer: 2,
    explanation: `Arranged: 7, 9, 13, 19, 25, 31. With 6 values, median = average of 3rd and 4th = (13 + 19) / 2 = 16.`
  },
  {
    id: 36,
    type: "statistics",
    question: `Heights in cm: 140, 135, 148, 135, 152, 135, 141. What is the mode?`,
    options: [
      "135",
      "140",
      "141",
      "148",
    ],
    correctAnswer: 0,
    explanation: `135 appears 3 times, which is more than any other value. The mode is 135.`
  },
  {
    id: 37,
    type: "statistics",
    question: `What is the range of: 85, 62, 94, 71, 58, 88?`,
    options: [
      "26",
      "32",
      "36",
      "38",
    ],
    correctAnswer: 2,
    explanation: `Range = highest - lowest = 94 - 58 = 36.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A bar chart shows books borrowed per day: Mon 20, Tue 35, Wed 15, Thu 30, Fri 25. Which day had the FEWEST books borrowed?`,
    options: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],
    correctAnswer: 2,
    explanation: `Wednesday had 15 books borrowed, which is the smallest value.`
  },
  {
    id: 39,
    type: "statistics",
    question: `A bag has 5 red, 3 blue, and 2 green counters. What is the probability of picking a red counter?`,
    options: [
      "1/2",
      "1/3",
      "3/10",
      "1/5",
    ],
    correctAnswer: 0,
    explanation: `Total = 10. P(red) = 5/10 = 1/2.`
  },
  {
    id: 40,
    type: "statistics",
    question: `In a pie chart, a section covers 120 degrees. What fraction of the whole does this represent?`,
    options: [
      "1/3",
      "1/4",
      "2/5",
      "1/6",
    ],
    correctAnswer: 0,
    explanation: `Fraction = 120 / 360 = 1/3.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate4MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate4Questions : numeracyModerate4Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 4</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 4</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 4 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Moderate 4</h1>
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
