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

const numeracyModerate10Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 20,000 - 8,364?`,
    options: [
      "11,636",
      "11,736",
      "12,636",
      "12,736",
    ],
    correctAnswer: 0,
    explanation: `20,000 - 8,000 = 12,000. 12,000 - 364 = 11,636.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 38 x 45?`,
    options: [
      "1,620",
      "1,710",
      "1,720",
      "1,810",
    ],
    correctAnswer: 1,
    explanation: `38 x 45 = (40 x 45) - (2 x 45) = 1,800 - 90 = 1,710.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 2,016 divided by 14?`,
    options: [
      "132",
      "140",
      "144",
      "148",
    ],
    correctAnswer: 2,
    explanation: `2,016 / 14 = 144. Check: 144 x 14 = 2,016.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the HCF of 36, 48, and 60?`,
    options: [
      "6",
      "8",
      "12",
      "18",
    ],
    correctAnswer: 2,
    explanation: `Factors of all three: 1,2,3,4,6,12. HCF = 12.`
  },
  {
    id: 5,
    type: "number",
    question: `What is 3/5 of 2 hours in minutes?`,
    options: [
      "60 min",
      "66 min",
      "72 min",
      "78 min",
    ],
    correctAnswer: 2,
    explanation: `2 hours = 120 minutes. 3/5 x 120 = 72 minutes.`
  },
  {
    id: 6,
    type: "number",
    question: `A $250 bag is discounted by 16%. What is the sale price?`,
    options: [
      "$200",
      "$205",
      "$210",
      "$215",
    ],
    correctAnswer: 2,
    explanation: `16% of $250 = $40. Sale price = $250 - $40 = $210.`
  },
  {
    id: 7,
    type: "number",
    question: `Solve: 4(2n + 3) = 44`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: `4(2n+3) = 44. 2n+3 = 11. 2n = 8. n = 4.`
  },
  {
    id: 8,
    type: "number",
    question: `Which number is 100 more than the product of 25 and 8?`,
    options: [
      "200",
      "250",
      "300",
      "350",
    ],
    correctAnswer: 2,
    explanation: `25 x 8 = 200. 200 + 100 = 300.`
  },
  {
    id: 9,
    type: "number",
    question: `What is 3.6 squared?`,
    options: [
      "10.8",
      "12.96",
      "13.06",
      "14.4",
    ],
    correctAnswer: 1,
    explanation: `3.6 x 3.6: (3 x 3.6) + (0.6 x 3.6) = 10.8 + 2.16 = 12.96.`
  },
  {
    id: 10,
    type: "number",
    question: `Express the ratio 45:60 in its simplest form.`,
    options: [
      "3:4",
      "4:5",
      "3:5",
      "9:12",
    ],
    correctAnswer: 0,
    explanation: `GCF of 45 and 60 = 15. 45/15 : 60/15 = 3:4.`
  },
  {
    id: 11,
    type: "number",
    question: `A factory produces 1,440 items in 8 hours. How many does it produce per hour?`,
    options: [
      "160",
      "170",
      "180",
      "190",
    ],
    correctAnswer: 2,
    explanation: `1,440 / 8 = 180 items per hour.`
  },
  {
    id: 12,
    type: "number",
    question: `What is 1/4 + 3/8 + 1/2?`,
    options: [
      "5/8",
      "9/8",
      "1 and 1/8",
      "1 and 3/8",
    ],
    correctAnswer: 2,
    explanation: `LCD = 8. 2/8 + 3/8 + 4/8 = 9/8 = 1 and 1/8.`
  },
  {
    id: 13,
    type: "number",
    question: `A jacket was sold for $289.80 after a 10% profit was added. What was the original cost?`,
    options: [
      "$260",
      "$264",
      "$268",
      "$270",
    ],
    correctAnswer: 1,
    explanation: `Original x 1.10 = $289.80. Original = $289.80 / 1.10 = $264.`
  },
  {
    id: 14,
    type: "number",
    question: `What is 0.4 squared?`,
    options: [
      "0.008",
      "0.016",
      "0.04",
      "0.16",
    ],
    correctAnswer: 3,
    explanation: `0.4 x 0.4 = 0.16.`
  },
  {
    id: 15,
    type: "number",
    question: `How many prime numbers are between 10 and 30?`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 3,
    explanation: `Primes between 10 and 30: 11, 13, 17, 19, 23, 29 = 6 prime numbers.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A circle has a circumference of 88 cm. What is its diameter? (Use pi = 22/7)`,
    options: [
      "14 cm",
      "28 cm",
      "44 cm",
      "56 cm",
    ],
    correctAnswer: 1,
    explanation: `C = pi x d. d = 88 / (22/7) = 88 x 7/22 = 28 cm.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A rectangular room is 7 m long and 5 m wide. Tiles are 50 cm x 50 cm. How many tiles are needed?`,
    options: [
      "140",
      "175",
      "200",
      "280",
    ],
    correctAnswer: 0,
    explanation: `Room in cm: 700 x 500. Tile area = 50 x 50 = 2,500 cm2. Room area = 350,000 cm2. Tiles = 350,000 / 2,500 = 140.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A lorry travels 240 km. The first 120 km at 60 km/h, the last 120 km at 80 km/h. What is the total journey time?`,
    options: [
      "2 h 30 min",
      "3 h",
      "3 h 30 min",
      "4 h",
    ],
    correctAnswer: 2,
    explanation: `First: 120/60 = 2 h. Second: 120/80 = 1.5 h. Total = 3.5 h = 3 h 30 min.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A cube has a total surface area of 150 cm2. What is the length of one side?`,
    options: [
      "4 cm",
      "5 cm",
      "6 cm",
      "7 cm",
    ],
    correctAnswer: 1,
    explanation: `6 x s2 = 150. s2 = 25. s = 5 cm.`
  },
  {
    id: 20,
    type: "measurement",
    question: `How many litres of water fill a cuboid tank 80 cm x 50 cm x 40 cm? (1 L = 1,000 cm3)`,
    options: [
      "8 L",
      "16 L",
      "80 L",
      "160 L",
    ],
    correctAnswer: 3,
    explanation: `Volume = 80 x 50 x 40 = 160,000 cm3 = 160 litres.`
  },
  {
    id: 21,
    type: "measurement",
    question: `The area of a trapezoid is 84 cm2. Its parallel sides are 10 cm and 11 cm. What is its height? (Area = 1/2 x (a+b) x h)`,
    options: [
      "8 cm",
      "9 cm",
      "10 cm",
      "12 cm",
    ],
    correctAnswer: 0,
    explanation: `84 = 1/2 x (10+11) x h. 84 = 1/2 x 21 x h. 84 = 10.5h. h = 8 cm.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A flight departs at 10:40 PM and arrives at 6:15 AM. How long is the flight?`,
    options: [
      "6 h 45 min",
      "7 h 15 min",
      "7 h 35 min",
      "8 h 15 min",
    ],
    correctAnswer: 2,
    explanation: `10:40 PM to midnight = 1 h 20 min. Midnight to 6:15 AM = 6 h 15 min. Total = 7 h 35 min.`
  },
  {
    id: 23,
    type: "measurement",
    question: `Express 3 years 8 months in months.`,
    options: [
      "38 months",
      "44 months",
      "46 months",
      "48 months",
    ],
    correctAnswer: 1,
    explanation: `3 years = 36 months. 36 + 8 = 44 months.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The temperature at the top of a mountain is -12 degrees C. At the base it is 21 degrees C. What is the difference?`,
    options: [
      "9 degrees",
      "21 degrees",
      "33 degrees",
      "42 degrees",
    ],
    correctAnswer: 2,
    explanation: `-12 to 21: difference = 21 - (-12) = 33 degrees.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A rectangular field has a perimeter of 96 m. Its length is 8 m more than its width. What is its area?`,
    options: [
      "480 m2",
      "520 m2",
      "560 m2",
      "600 m2",
    ],
    correctAnswer: 2,
    explanation: `2(l+w) = 96, l+w = 48. l = w+8: 2w+8 = 48, 2w = 40, w = 20, l = 28. Area = 28 x 20 = 560 m2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `What is the size of each interior angle of a regular pentagon?`,
    options: [
      "100 degrees",
      "104 degrees",
      "108 degrees",
      "112 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = (5-2) x 180 = 540 degrees. Each angle = 540 / 5 = 108 degrees.`
  },
  {
    id: 27,
    type: "geometry",
    question: `Two parallel lines are cut by a transversal. The co-interior angles are:`,
    options: [
      "Equal",
      "Complementary",
      "Supplementary",
      "Corresponding",
    ],
    correctAnswer: 2,
    explanation: `Co-interior angles (same side of transversal) add up to 180 degrees. They are supplementary.`
  },
  {
    id: 28,
    type: "geometry",
    question: `A kite has diagonals of 8 cm and 10 cm. What is its area?`,
    options: [
      "18 cm2",
      "40 cm2",
      "80 cm2",
      "160 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area of kite = (d1 x d2) / 2 = (8 x 10) / 2 = 40 cm2.`
  },
  {
    id: 29,
    type: "geometry",
    question: `The angles of a quadrilateral are in the ratio 2:3:4:6. What is the size of the LARGEST angle?`,
    options: [
      "96 degrees",
      "120 degrees",
      "144 degrees",
      "160 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = 360. Total parts = 15. Each part = 24 degrees. Largest = 6 x 24 = 144 degrees.`
  },
  {
    id: 30,
    type: "geometry",
    question: `A cylinder has a radius of 5 cm and height of 10 cm. What is its volume? (Use pi = 3.14)`,
    options: [
      "314 cm3",
      "785 cm3",
      "1,570 cm3",
      "2,355 cm3",
    ],
    correctAnswer: 1,
    explanation: `V = pi x r2 x h = 3.14 x 25 x 10 = 785 cm3.`
  },
  {
    id: 31,
    type: "geometry",
    question: `A triangle has vertices at coordinates (0,0), (4,0), and (0,3). What type of triangle is it?`,
    options: [
      "Equilateral",
      "Isosceles",
      "Scalene",
      "Right-angled",
    ],
    correctAnswer: 3,
    explanation: `The angle at (0,0) is 90 degrees since the two sides lie along the x and y axes. It is right-angled.`
  },
  {
    id: 32,
    type: "geometry",
    question: `The exterior angle of a regular polygon is 40 degrees. How many sides does it have?`,
    options: [
      "7",
      "8",
      "9",
      "10",
    ],
    correctAnswer: 2,
    explanation: `Number of sides = 360 / exterior angle = 360 / 40 = 9 sides.`
  },
  {
    id: 33,
    type: "geometry",
    question: `A rhombus has diagonals of 12 cm and 16 cm. What is its area?`,
    options: [
      "48 cm2",
      "96 cm2",
      "192 cm2",
      "384 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area of rhombus = (d1 x d2) / 2 = (12 x 16) / 2 = 96 cm2.`
  },
  {
    id: 34,
    type: "statistics",
    question: `The mean of 8 numbers is 25. A ninth number is added and the new mean is 24. What is the ninth number?`,
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 2,
    explanation: `Original sum = 8 x 25 = 200. New sum = 9 x 24 = 216. Ninth = 216 - 200 = 16.`
  },
  {
    id: 35,
    type: "statistics",
    question: `Find the median of: 0.5, 1.3, 2.7, 0.8, 1.9, 3.2, 1.3, 2.1`,
    options: [
      "1.3",
      "1.4",
      "1.6",
      "1.9",
    ],
    correctAnswer: 2,
    explanation: `Arranged: 0.5, 0.8, 1.3, 1.3, 1.9, 2.1, 2.7, 3.2. Median = (1.3+1.9)/2 = 1.6.`
  },
  {
    id: 36,
    type: "statistics",
    question: `A data set has mean = 30, median = 28, mode = 25. Which measure gives the lowest value?`,
    options: [
      "Mean",
      "Median",
      "Mode",
      "All equal",
    ],
    correctAnswer: 2,
    explanation: `Mode = 25, median = 28, mean = 30. Mode gives the lowest value.`
  },
  {
    id: 37,
    type: "statistics",
    question: `In a survey of 80 students, 35 prefer Football, 25 prefer Cricket, and 20 prefer Netball. What angle does Football occupy in a pie chart?`,
    options: [
      "140 degrees",
      "157.5 degrees",
      "168 degrees",
      "175 degrees",
    ],
    correctAnswer: 1,
    explanation: `Angle = (35/80) x 360 = 0.4375 x 360 = 157.5 degrees.`
  },
  {
    id: 38,
    type: "statistics",
    question: `A fair die is rolled twice. What is the probability of getting 6 on both rolls?`,
    options: [
      "1/6",
      "1/12",
      "1/36",
      "2/36",
    ],
    correctAnswer: 2,
    explanation: `P(6 on first) = 1/6. P(6 on second) = 1/6. Combined = 1/6 x 1/6 = 1/36.`
  },
  {
    id: 39,
    type: "statistics",
    question: `The interquartile range of a data set is 14. Q1 = 22. What is Q3?`,
    options: [
      "30",
      "34",
      "36",
      "38",
    ],
    correctAnswer: 2,
    explanation: `Q3 = Q1 + IQR = 22 + 14 = 36.`
  },
  {
    id: 40,
    type: "statistics",
    question: `In a class of 40: 18 play sports, 12 do art, 6 do both, the rest do neither. What fraction does neither?`,
    options: [
      "1/4",
      "2/5",
      "3/8",
      "16/40",
    ],
    correctAnswer: 1,
    explanation: `Sports only + Art only + Both: 18+12-6 = 24 do at least one. Neither = 40-24 = 16. Fraction = 16/40 = 2/5.`
  }
]

const SECTION_CONFIG = [
  { type: "number" as const, label: "Number Operations", note: "place value, algebra, HCF, LCM, fractions, and decimals" },
  { type: "measurement" as const, label: "Measurement", note: "area, perimeter, volume, time, capacity, and estimation" },
  { type: "geometry" as const, label: "Geometry", note: "shapes, transformations, angles, and 3D figures" },
  { type: "statistics" as const, label: "Data & Statistics", note: "mean, mode, median, range, graphs, and probability" },
]

export default function NumeracyModerate10MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyModerate10Questions : numeracyModerate10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 10</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Moderate 10</h1>
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
