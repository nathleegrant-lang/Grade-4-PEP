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

const numeracyDifficult9Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A shopkeeper bought 240 items for $3.50 each and sold them for $5.25 each. What was the total profit?",
    options: [
      "$380",
      "$400",
      "$420",
      "$440",
    ],
    correctAnswer: 2,
    explanation: "Cost: 240 x $3.50 = $840. Revenue: 240 x $5.25 = $1,260. Profit = $1,260 - $840 = $420."
  },
  {
    id: 2,
    type: "number",
    question: "What is 5/6 - 3/8 - 1/4?",
    options: [
      "5/24",
      "7/24",
      "11/24",
      "13/24",
    ],
    correctAnswer: 0,
    explanation: "LCD = 24. 5/6=20/24, 3/8=9/24, 1/4=6/24. 20/24 - 9/24 - 6/24 = 5/24."
  },
  {
    id: 3,
    type: "number",
    question: "A car costs $56,000. After 3 years it is worth 60% of its original value. What is its value after 3 years?",
    options: [
      "$32,400",
      "$33,600",
      "$34,800",
      "$36,000",
    ],
    correctAnswer: 1,
    explanation: "60% of $56,000 = 0.60 x $56,000 = $33,600."
  },
  {
    id: 4,
    type: "number",
    question: "If x = 4, what is the value of 3x squared - 2x + 5?",
    options: [
      "37",
      "41",
      "43",
      "45",
    ],
    correctAnswer: 3,
    explanation: "3(4 squared) - 2(4) + 5 = 3(16) - 8 + 5 = 48 - 8 + 5 = 45."
  },
  {
    id: 5,
    type: "number",
    question: "A factory produces 1,440 items per day working 8 hours. If it works 6 hours instead, how many items does it produce?",
    options: [
      "960",
      "1,000",
      "1,080",
      "1,200",
    ],
    correctAnswer: 2,
    explanation: "Per hour: 1,440/8 = 180 items. In 6 hours: 180 x 6 = 1,080."
  },
  {
    id: 6,
    type: "number",
    question: "What is 3 and 1/4 x 2 and 2/5?",
    options: [
      "6.5",
      "7.0",
      "7.5",
      "7.8",
    ],
    correctAnswer: 3,
    explanation: "3 1/4 = 13/4. 2 2/5 = 12/5. Product = (13 x 12)/(4 x 5) = 156/20 = 7.8."
  },
  {
    id: 7,
    type: "number",
    question: "The price of a TV was reduced by 30%. The sale price is $840. What was the original price?",
    options: [
      "$1,100",
      "$1,150",
      "$1,200",
      "$1,250",
    ],
    correctAnswer: 2,
    explanation: "Sale price = 70% of original. Original = $840/0.70 = $1,200."
  },
  {
    id: 8,
    type: "number",
    question: "A train travels at 90 km/h. How many metres does it travel in 40 seconds?",
    options: [
      "900 m",
      "1,000 m",
      "1,100 m",
      "1,200 m",
    ],
    correctAnswer: 1,
    explanation: "90 km/h = 90,000 m per 3,600 s = 25 m/s. In 40 seconds: 25 x 40 = 1,000 m."
  },
  {
    id: 9,
    type: "number",
    question: "Simplify: (18 x 24) / (6 x 4)",
    options: [
      "16",
      "17",
      "18",
      "19",
    ],
    correctAnswer: 2,
    explanation: "(18 x 24) / (6 x 4) = 432 / 24 = 18."
  },
  {
    id: 10,
    type: "number",
    question: "A number is increased by 40% and then decreased by 20%. What is the net percentage change?",
    options: [
      "10% decrease",
      "8% decrease",
      "12% increase",
      "12% increase",
    ],
    correctAnswer: 3,
    explanation: "After 40% increase: 1.40. After 20% decrease: 1.40 x 0.80 = 1.12. Net change = +12%."
  },
  {
    id: 11,
    type: "number",
    question: "How many prime numbers are there between 20 and 40?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: "Prime numbers between 20 and 40: 23, 29, 31, 37 = 4 prime numbers."
  },
  {
    id: 12,
    type: "number",
    question: "What is 0.003 x 4,000?",
    options: [
      "1.2",
      "12",
      "120",
      "1,200",
    ],
    correctAnswer: 1,
    explanation: "0.003 x 4,000 = 3 x 4 = 12."
  },
  {
    id: 13,
    type: "number",
    question: "Kareem, Nadine, and Troy share $630 in the ratio 3:4:2. How much more does Nadine receive than Troy?",
    options: [
      "$70",
      "$100",
      "$140",
      "$210",
    ],
    correctAnswer: 2,
    explanation: "Total parts = 9. Each part = $630/9 = $70. Nadine: 4 x $70 = $280. Troy: 2 x $70 = $140. Difference = $140."
  },
  {
    id: 14,
    type: "number",
    question: "What is the cube root of 216?",
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 2,
    explanation: "6 cubed = 6 x 6 x 6 = 216. So the cube root of 216 = 6."
  },
  {
    id: 15,
    type: "number",
    question: "A swimming pool contains 54,000 litres. Water is pumped out at 900 litres per hour. How many days does it take to empty the pool?",
    options: [
      "2 days",
      "2.5 days",
      "3 days",
      "3.5 days",
    ],
    correctAnswer: 1,
    explanation: "Hours = 54,000 / 900 = 60 hours. Days = 60 / 24 = 2.5 days."
  },
  {
    id: 16,
    type: "measurement",
    question: "A room is 6.4 m long and 4.5 m wide. Tiles measuring 40 cm x 40 cm are used to tile the floor. How many tiles are needed?",
    options: [
      "160",
      "168",
      "175",
      "180",
    ],
    correctAnswer: 3,
    explanation: "Room in cm: 640 x 450. Tile area = 40 x 40 = 1,600 cm2. Room area = 640 x 450 = 288,000 cm2. Tiles = 288,000 / 1,600 = 180."
  },
  {
    id: 17,
    type: "measurement",
    question: "A field is in the shape of a parallelogram with base 45 m and height 28 m. What is the area?",
    options: [
      "1,080 m2",
      "1,160 m2",
      "1,260 m2",
      "1,360 m2",
    ],
    correctAnswer: 2,
    explanation: "Area of parallelogram = base x height = 45 x 28 = 1,260 m2."
  },
  {
    id: 18,
    type: "measurement",
    question: "It is 11:40 AM. How long until 3:15 PM?",
    options: [
      "3 h 25 min",
      "3 h 35 min",
      "3 h 45 min",
      "4 h 5 min",
    ],
    correctAnswer: 1,
    explanation: "11:40 to 12:40 = 1 hour. 12:40 to 3:15 = 2 h 35 min. Total = 3 h 35 min."
  },
  {
    id: 19,
    type: "measurement",
    question: "A cylindrical water tank has radius 3 m and height 4 m. What is its capacity in litres? (1 m3 = 1,000 litres, pi = 3.14)",
    options: [
      "88,000 L",
      "108,000 L",
      "113,040 L",
      "120,000 L",
    ],
    correctAnswer: 2,
    explanation: "Volume = pi x r squared x h = 3.14 x 9 x 4 = 113.04 m3 = 113,040 litres."
  },
  {
    id: 20,
    type: "measurement",
    question: "The perimeter of a rectangle is 68 cm. The length is 4 cm more than the width. What is the area?",
    options: [
      "240 cm2",
      "260 cm2",
      "280 cm2",
      "285 cm2",
    ],
    correctAnswer: 3,
    explanation: "2(l + w) = 68, so l + w = 34. l = w + 4: (w+4) + w = 34. 2w = 30. w = 15, l = 19. Area = 15 x 19 = 285 cm2."
  },
  {
    id: 21,
    type: "measurement",
    question: "A metal rod is 3.6 m long. It is cut into pieces of 0.45 m each. How many complete pieces are there?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "3.6 / 0.45 = 360 / 45 = 8 pieces."
  },
  {
    id: 22,
    type: "measurement",
    question: "Express 1.5 hours in seconds.",
    options: [
      "90 s",
      "900 s",
      "5,400 s",
      "9,000 s",
    ],
    correctAnswer: 2,
    explanation: "1.5 hours = 1.5 x 60 x 60 = 5,400 seconds."
  },
  {
    id: 23,
    type: "measurement",
    question: "A trapezoid has parallel sides of 16 cm and 10 cm and a height of 8 cm. What is its area?",
    options: [
      "84 cm2",
      "96 cm2",
      "104 cm2",
      "128 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area = 1/2 x (sum of parallel sides) x height = 1/2 x (16+10) x 8 = 1/2 x 26 x 8 = 104 cm2."
  },
  {
    id: 24,
    type: "measurement",
    question: "A car uses 12 litres of fuel per 100 km. How much fuel is needed for a 450 km journey?",
    options: [
      "48 L",
      "52 L",
      "54 L",
      "60 L",
    ],
    correctAnswer: 2,
    explanation: "(450/100) x 12 = 4.5 x 12 = 54 litres."
  },
  {
    id: 25,
    type: "measurement",
    question: "A rectangular box is 50 cm long, 30 cm wide, and 20 cm tall. What is its surface area?",
    options: [
      "5,200 cm2",
      "6,000 cm2",
      "6,200 cm2",
      "7,200 cm2",
    ],
    correctAnswer: 2,
    explanation: "SA = 2(lb + bh + lh) = 2(1,500 + 600 + 1,000) = 2 x 3,100 = 6,200 cm2."
  },
  {
    id: 26,
    type: "geometry",
    question: "A circle has an area of 78.5 cm2. What is its radius? (Use pi = 3.14)",
    options: [
      "4 cm",
      "5 cm",
      "6 cm",
      "7 cm",
    ],
    correctAnswer: 1,
    explanation: "Area = pi x r squared. 78.5 = 3.14 x r squared. r squared = 25. r = 5 cm."
  },
  {
    id: 27,
    type: "geometry",
    question: "What is the sum of all exterior angles of any convex polygon?",
    options: [
      "180 degrees",
      "270 degrees",
      "360 degrees",
      "540 degrees",
    ],
    correctAnswer: 2,
    explanation: "The sum of the exterior angles of any convex polygon is always 360 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "A square has a diagonal of 10 cm. What is the area of the square?",
    options: [
      "25 cm2",
      "36 cm2",
      "50 cm2",
      "100 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area of square = (diagonal squared)/2 = (10 squared)/2 = 100/2 = 50 cm2."
  },
  {
    id: 29,
    type: "geometry",
    question: "Which of the following always has diagonals that are equal AND perpendicular to each other?",
    options: [
      "Rectangle",
      "Rhombus",
      "Square",
      "Parallelogram",
    ],
    correctAnswer: 2,
    explanation: "A square has diagonals that are both equal in length AND perpendicular to each other."
  },
  {
    id: 30,
    type: "geometry",
    question: "A triangle has sides of 6 cm, 8 cm, and 10 cm. What type of triangle is it?",
    options: [
      "Acute",
      "Obtuse",
      "Right-angled",
      "Equilateral",
    ],
    correctAnswer: 2,
    explanation: "Check: 6 squared + 8 squared = 36 + 64 = 100 = 10 squared. This satisfies Pythagoras, so it is a right-angled triangle."
  },
  {
    id: 31,
    type: "geometry",
    question: "Find the area of a sector with radius 6 cm and angle 90 degrees. (Use pi = 3.14)",
    options: [
      "14.13 cm2",
      "22.25 cm2",
      "28.26 cm2",
      "56.52 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area of sector = (angle/360) x pi x r squared = (90/360) x 3.14 x 36 = 1/4 x 113.04 = 28.26 cm2."
  },
  {
    id: 32,
    type: "geometry",
    question: "Two angles of a quadrilateral are each 85 degrees. The third is 110 degrees. What is the fourth angle?",
    options: [
      "60 degrees",
      "70 degrees",
      "75 degrees",
      "80 degrees",
    ],
    correctAnswer: 3,
    explanation: "Sum of angles = 360. Fourth = 360 - 85 - 85 - 110 = 80 degrees."
  },
  {
    id: 33,
    type: "data",
    question: "A data set has 10 values. The mean is 24. If each value is increased by 5, what is the new mean?",
    options: [
      "24",
      "25",
      "29",
      "30",
    ],
    correctAnswer: 2,
    explanation: "Adding 5 to every value increases the mean by 5. New mean = 24 + 5 = 29."
  },
  {
    id: 34,
    type: "data",
    question: "In a class of 36, the probability of selecting a student who plays guitar is 1/4. How many students do NOT play guitar?",
    options: [
      "9",
      "24",
      "27",
      "30",
    ],
    correctAnswer: 2,
    explanation: "Guitar players: 1/4 x 36 = 9. Non-players: 36 - 9 = 27."
  },
  {
    id: 35,
    type: "data",
    question: "Find the median of: 3.2, 4.7, 2.8, 5.1, 3.9, 4.2, 3.5",
    options: [
      "3.5",
      "3.9",
      "4.2",
      "4.7",
    ],
    correctAnswer: 1,
    explanation: "Arranged: 2.8, 3.2, 3.5, 3.9, 4.2, 4.7, 5.1. The middle (4th) value = 3.9."
  },
  {
    id: 36,
    type: "data",
    question: "In a survey, 3/5 of 200 people preferred Brand A. The rest preferred Brand B. How many more people preferred Brand A than Brand B?",
    options: [
      "40",
      "50",
      "60",
      "80",
    ],
    correctAnswer: 0,
    explanation: "Brand A: 3/5 x 200 = 120. Brand B: 200 - 120 = 80. Difference = 120 - 80 = 40."
  },
  {
    id: 37,
    type: "data",
    question: "A bag has marbles: 6 red, 4 blue, 2 white. One marble is drawn and not replaced. Then a second marble is drawn. What is the probability that both are red?",
    options: [
      "1/4",
      "5/22",
      "6/33",
      "1/3",
    ],
    correctAnswer: 1,
    explanation: "P(first red) = 6/12 = 1/2. P(second red) = 5/11. Combined = 1/2 x 5/11 = 5/22."
  },
  {
    id: 38,
    type: "data",
    question: "A teacher records test scores: 45, 52, 67, 72, 45, 81, 45, 60. What is the mode?",
    options: [
      "45",
      "52",
      "60",
      "67",
    ],
    correctAnswer: 0,
    explanation: "The mode is the most frequent value. 45 appears 3 times."
  },
  {
    id: 39,
    type: "data",
    question: "What is the interquartile range (IQR) of: 5, 8, 10, 12, 15, 18, 21? (IQR = Q3 - Q1)",
    options: [
      "7",
      "10",
      "11",
      "13",
    ],
    correctAnswer: 1,
    explanation: "Q1 = 8 (2nd value of 7). Q3 = 18 (6th value). IQR = 18 - 8 = 10."
  },
  {
    id: 40,
    type: "data",
    question: "A spinner is spun twice. The probability of landing on red on one spin is 1/4. What is the probability of landing on red on both spins?",
    options: [
      "1/2",
      "1/8",
      "1/16",
      "3/16",
    ],
    correctAnswer: 2,
    explanation: "P(red twice) = 1/4 x 1/4 = 1/16."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult9Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult9Questions : numeracyDifficult9Questions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => { if (answers.length !== totalQuestions) { setAnswers(new Array(totalQuestions).fill(null)) } }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => { setTimeRemaining((prev) => { if (prev <= 1) { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true); return 0 } return prev - 1 }) }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const handleAnswer = (answerIndex: number) => { const newAnswers = [...answers]; newAnswers[currentQuestion] = answerIndex; setAnswers(newAnswers) }

  const calculateScore = () => { let correct = 0; answers.forEach((answer, index) => { if (index < availableQuestions.length && answer === availableQuestions[index].correctAnswer) correct++ }); return correct }

  const getScorePercentage = () => Math.round((calculateScore() / totalQuestions) * 100)

  const getGrade = () => {
    const p = getScorePercentage()
    if (p >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (p >= 70) return { grade: "Good", color: "text-blue-600" }
    if (p >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionSummary = (section: SectionKey) => {
    const sqs = availableQuestions.filter((q) => q.type === section)
    const idxs = availableQuestions.map((q, i) => ({ q, i })).filter(({ q }) => q.type === section)
    const correct = idxs.reduce((s, { q, i }) => s + (answers[i] === q.correctAnswer ? 1 : 0), 0)
    const total = sqs.length
    const pct = total ? Math.round((correct / total) * 100) : 0
    const note = pct >= 85 ? "Excellent" : pct >= 70 ? "Good" : pct >= 50 ? "Fair" : "Needs Improvement"
    return { title: sectionConfig[section].title, description: sectionConfig[section].description, correct, total, percentage: pct, note }
  }

  const sectionSummaries = (Object.keys(sectionConfig) as SectionKey[]).map(getSectionSummary)

  const handleSubmit = () => { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true) }

  const restartTest = () => { setTestStarted(false); setTestCompleted(false); setCurrentQuestion(0); setAnswers(new Array(totalQuestions).fill(null)); setTimeRemaining(isPremium ? 60 * 60 : 10 * 60); setShowReview(false); setCompletedAt("") }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Link>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 9</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Difficult Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{totalQuestions}</p><p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-medium text-amber-800">Free Preview Mode</p><p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question difficult paper with a branded report.</p></div></div>
                    <Link href="/pricing" className="block mt-3"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button></Link>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Difficulty Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Multi-step reasoning and closer problem reading</li>
                    <li>- Stronger distractors and more careful choice of method</li>
                    <li>- Higher emphasis on number relationships and comparisons</li>
                    <li>- Standard Grade 4 content with greater thinking demand</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Test Sections:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Number Operations (Questions 1-15)</li>
                    <li>- Measurement (Questions 16-25)</li>
                    <li>- Geometry (Questions 26-32)</li>
                    <li>- Data &amp; Statistics (Questions 33-40)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each problem carefully before choosing an answer.</li>
                    <li>- Use rough working if needed.</li>
                    <li>- Look out for details in units, fractions, and wording.</li>
                    <li>- You can move between questions before you submit.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>
                <Button onClick={() => setTestStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">Start Test</Button>
                <Link href="/mock-tests/numeracy"><Button variant="outline" className="w-full">Back to Numeracy Mock Tests</Button></Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore(); const percentage = getScorePercentage(); const { grade, color } = getGrade()
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 9</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg"><p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p><p className="text-gray-600 mt-2">Questions Correct</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left"><h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3><p className="text-sm text-slate-700">This difficult-level numeracy report includes section summaries and a full question-by-question review with explanations. You can also print or save the full report as a PDF with the Shazonique&apos;s Inspiration logo.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {sectionSummaries.map((s) => (<div key={s.title} className="rounded-xl border border-blue-100 bg-white p-4"><p className="text-base font-semibold text-blue-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.description}</p><div className="mt-3 flex items-center justify-between"><p className="text-sm text-slate-700">{s.correct}/{s.total} correct</p><p className="text-sm font-semibold text-blue-700">{s.percentage}%</p></div><p className="text-xs text-slate-500 mt-1">{s.note}</p></div>))}
                </div>
                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-blue-600 hover:bg-blue-700">Review Answers &amp; Report</Button>
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
    const score = calculateScore(); const percentage = getScorePercentage(); const { grade, color } = getGrade()
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <style jsx global>{`@media print { header, footer, .no-print { display: none !important; } body { background: #ffffff !important; } .report-sheet { box-shadow: none !important; border: none !important; } }`}</style>
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 9 Report</CardTitle>
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
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5"><h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3><p className="text-sm text-slate-700">This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {sectionSummaries.map((s) => (<div key={s.title} className="rounded-xl border border-blue-100 bg-white p-4"><p className="text-base font-semibold text-blue-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.description}</p><div className="mt-3 flex items-center justify-between"><p className="text-sm text-slate-700">{s.correct}/{s.total} correct</p><p className="text-sm font-semibold text-blue-700">{s.percentage}%</p></div><p className="text-xs text-slate-500 mt-1">{s.note}</p></div>))}
              </div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2"><p className="font-semibold text-slate-800">Question {index + 1}</p><span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{sectionConfig[q.type].title}</span></div>
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
            <Button onClick={() => window.print()} className="flex-1 bg-blue-600 hover:bg-blue-700"><Printer className="h-4 w-4 mr-2" />Download / Print Report</Button>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 9</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
            </div>
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", timeRemaining <= 300 ? "bg-red-500" : "bg-green-600")}><Clock className="h-5 w-5" />{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </header>
      <div className="bg-white border-b shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2"><span>Progress: {answeredCount}/{totalQuestions} answered</span><span>{Math.round((answeredCount / totalQuestions) * 100)}% complete</span></div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between"><span className="text-sm font-medium text-blue-700 uppercase">{sectionConfig[question.type].title}</span><span className="text-sm text-gray-500">Question {currentQuestion + 1}</span></div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(index)} className={cn("w-full p-4 text-left rounded-lg border-2 transition-all", answers[currentQuestion] === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50")}>
                    <span className="font-medium text-blue-700 mr-3">{String.fromCharCode(65 + index)}.</span>{option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}><ChevronLeft className="h-4 w-4 mr-2" />Previous</Button>
            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700"><Flag className="h-4 w-4 mr-2" />Submit Test</Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-blue-600 hover:bg-blue-700">Next<ChevronRight className="h-4 w-4 ml-2" /></Button>
              )}
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader className="py-3"><CardTitle className="text-sm">Question Navigator</CardTitle></CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (<button key={index} onClick={() => setCurrentQuestion(index)} className={cn("w-8 h-8 rounded text-sm font-medium transition-colors", currentQuestion === index ? "bg-blue-600 text-white" : answers[index] !== null ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>{index + 1}</button>))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-600"></div><span>Current</span></div>
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
