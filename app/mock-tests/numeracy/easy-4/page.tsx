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

const numeracyEasy4Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is the value of the digit 5 in 5,372?",
    options: [
      "5",
      "50",
      "500",
      "5,000",
    ],
    correctAnswer: 3,
    explanation: "In 5,372 the digit 5 is in the thousands place. Its value is 5,000."
  },
  {
    id: 2,
    type: "number",
    question: "What is 284 + 315?",
    options: [
      "499",
      "599",
      "609",
      "699",
    ],
    correctAnswer: 1,
    explanation: "284 + 315: ones 4+5=9, tens 8+1=9, hundreds 2+3=5. Answer = 599."
  },
  {
    id: 3,
    type: "number",
    question: "What is 450 - 187?",
    options: [
      "263",
      "273",
      "283",
      "363",
    ],
    correctAnswer: 0,
    explanation: "450 - 187 = 263. Check: 187 + 263 = 450."
  },
  {
    id: 4,
    type: "number",
    question: "What is 6 x 9?",
    options: [
      "48",
      "54",
      "56",
      "63",
    ],
    correctAnswer: 1,
    explanation: "6 x 9 = 54. This is a basic multiplication fact."
  },
  {
    id: 5,
    type: "number",
    question: "What is 1/3 of 27?",
    options: [
      "3",
      "7",
      "9",
      "12",
    ],
    correctAnswer: 2,
    explanation: "1/3 of 27 = 27 divided by 3 = 9."
  },
  {
    id: 6,
    type: "number",
    question: "Round 1,758 to the nearest hundred.",
    options: [
      "1,700",
      "1,800",
      "1,750",
      "2,000",
    ],
    correctAnswer: 1,
    explanation: "Look at the tens digit: 5 is 5 or more, so round up. 1,758 rounds to 1,800."
  },
  {
    id: 7,
    type: "number",
    question: "A chicken lays 7 eggs per week. How many eggs does it lay in 6 weeks?",
    options: [
      "13",
      "36",
      "42",
      "48",
    ],
    correctAnswer: 2,
    explanation: "7 x 6 = 42 eggs."
  },
  {
    id: 8,
    type: "number",
    question: "Which list is in order from smallest to largest?",
    options: [
      "4,130, 4,103, 4,310",
      "4,103, 4,130, 4,310",
      "4,310, 4,130, 4,103",
      "4,130, 4,310, 4,103",
    ],
    correctAnswer: 1,
    explanation: "Compare: 4,103 has 1 hundred and 0 tens (smallest). 4,130 has 1 hundred and 3 tens. 4,310 has 3 hundreds (largest)."
  },
  {
    id: 9,
    type: "number",
    question: "What is the next number in the pattern: 2, 4, 8, 16, ___?",
    options: [
      "18",
      "20",
      "24",
      "32",
    ],
    correctAnswer: 3,
    explanation: "Each number is doubled. 16 x 2 = 32."
  },
  {
    id: 10,
    type: "number",
    question: "Which fraction is equivalent to 2/4?",
    options: [
      "1/4",
      "1/2",
      "3/4",
      "2/3",
    ],
    correctAnswer: 1,
    explanation: "2/4 simplifies to 1/2 by dividing both numerator and denominator by 2."
  },
  {
    id: 11,
    type: "number",
    question: "What is 72 divided by 8?",
    options: [
      "7",
      "8",
      "9",
      "10",
    ],
    correctAnswer: 2,
    explanation: "72 divided by 8 = 9. Check: 8 x 9 = 72."
  },
  {
    id: 12,
    type: "number",
    question: "A shop had 145 bottles of juice. It sold 68. How many bottles are left?",
    options: [
      "67",
      "77",
      "87",
      "97",
    ],
    correctAnswer: 1,
    explanation: "145 - 68 = 77 bottles remaining."
  },
  {
    id: 13,
    type: "number",
    question: "What is the largest number you can make using the digits 3, 7, 1, and 5?",
    options: [
      "5,713",
      "5,731",
      "7,153",
      "7,531",
    ],
    correctAnswer: 3,
    explanation: "To make the largest number, arrange digits from largest to smallest: 7, 5, 3, 1 = 7,531."
  },
  {
    id: 14,
    type: "number",
    question: "What is 25 x 4?",
    options: [
      "80",
      "90",
      "100",
      "110",
    ],
    correctAnswer: 2,
    explanation: "25 x 4 = 100. Think: 25 x 4 = (20 x 4) + (5 x 4) = 80 + 20 = 100."
  },
  {
    id: 15,
    type: "number",
    question: "Write one thousand and sixty in figures.",
    options: [
      "1,006",
      "1,060",
      "1,600",
      "1,006",
    ],
    correctAnswer: 1,
    explanation: "One thousand = 1,000. Sixty = 60. Together: 1,060."
  },
  {
    id: 16,
    type: "measurement",
    question: "How many days are in 3 weeks?",
    options: [
      "14",
      "18",
      "21",
      "24",
    ],
    correctAnswer: 2,
    explanation: "1 week = 7 days. 3 weeks = 3 x 7 = 21 days."
  },
  {
    id: 17,
    type: "measurement",
    question: "A table is 120 cm long. How many metres is this?",
    options: [
      "0.12 m",
      "1.2 m",
      "12 m",
      "1,200 m",
    ],
    correctAnswer: 1,
    explanation: "100 cm = 1 m. 120 cm = 1.2 m."
  },
  {
    id: 18,
    type: "measurement",
    question: "Which is the best unit to measure the weight of a watermelon?",
    options: [
      "millilitres",
      "grams",
      "kilograms",
      "kilometres",
    ],
    correctAnswer: 2,
    explanation: "Kilograms are used for heavier objects like watermelons. A watermelon typically weighs several kilograms."
  },
  {
    id: 19,
    type: "measurement",
    question: "A lesson begins at 10:20 AM and lasts 40 minutes. When does it end?",
    options: [
      "10:50 AM",
      "11:00 AM",
      "11:10 AM",
      "11:20 AM",
    ],
    correctAnswer: 1,
    explanation: "10:20 + 40 minutes = 11:00 AM."
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the perimeter of a rectangle 8 cm long and 3 cm wide?",
    options: [
      "11 cm",
      "22 cm",
      "24 cm",
      "32 cm",
    ],
    correctAnswer: 1,
    explanation: "Perimeter = 2 x (length + width) = 2 x (8 + 3) = 2 x 11 = 22 cm."
  },
  {
    id: 21,
    type: "measurement",
    question: "How many grams are in half a kilogram?",
    options: [
      "50 g",
      "500 g",
      "5,000 g",
      "50,000 g",
    ],
    correctAnswer: 1,
    explanation: "1 kg = 1,000 g. Half a kg = 500 g."
  },
  {
    id: 22,
    type: "measurement",
    question: "A container holds 3 litres of water. How many millilitres is this?",
    options: [
      "300 mL",
      "1,500 mL",
      "3,000 mL",
      "30,000 mL",
    ],
    correctAnswer: 2,
    explanation: "1 litre = 1,000 mL. 3 litres = 3 x 1,000 = 3,000 mL."
  },
  {
    id: 23,
    type: "measurement",
    question: "Which measurement is the longest?",
    options: [
      "100 cm",
      "1.5 m",
      "95 cm",
      "0.9 m",
    ],
    correctAnswer: 1,
    explanation: "Convert all to cm: 100 cm, 150 cm, 95 cm, 90 cm. 1.5 m = 150 cm is the longest."
  },
  {
    id: 24,
    type: "measurement",
    question: "A clock shows 7:45. What time will it be in 30 minutes?",
    options: [
      "7:75",
      "8:00",
      "8:15",
      "8:30",
    ],
    correctAnswer: 2,
    explanation: "7:45 + 30 minutes: 45 + 30 = 75 minutes = 1 hour 15 minutes. 7:00 + 1 hour 15 min = 8:15 AM."
  },
  {
    id: 25,
    type: "measurement",
    question: "What is the area of a square with sides of 7 cm?",
    options: [
      "14 cm2",
      "21 cm2",
      "28 cm2",
      "49 cm2",
    ],
    correctAnswer: 3,
    explanation: "Area of a square = side x side = 7 x 7 = 49 cm2."
  },
  {
    id: 26,
    type: "geometry",
    question: "How many sides does a pentagon have?",
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 1,
    explanation: "A pentagon has 5 sides. Penta means five."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which of these is an OBTUSE angle?",
    options: [
      "30 degrees",
      "90 degrees",
      "120 degrees",
      "180 degrees",
    ],
    correctAnswer: 2,
    explanation: "An obtuse angle is more than 90 degrees and less than 180 degrees. 120 degrees is obtuse."
  },
  {
    id: 28,
    type: "geometry",
    question: "What is the name of a 3D shape with a circular base and a point at the top?",
    options: [
      "Cylinder",
      "Cone",
      "Pyramid",
      "Sphere",
    ],
    correctAnswer: 1,
    explanation: "A cone has a circular base and comes to a point (apex) at the top."
  },
  {
    id: 29,
    type: "geometry",
    question: "A rectangle has a length of 10 cm and a width of 6 cm. What is its perimeter?",
    options: [
      "16 cm",
      "22 cm",
      "32 cm",
      "60 cm",
    ],
    correctAnswer: 2,
    explanation: "Perimeter = 2 x (10 + 6) = 2 x 16 = 32 cm."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which shape has NO flat faces?",
    options: [
      "Cube",
      "Cylinder",
      "Cone",
      "Sphere",
    ],
    correctAnswer: 3,
    explanation: "A sphere has a completely curved surface with no flat faces at all."
  },
  {
    id: 31,
    type: "geometry",
    question: "How many vertices does a rectangle have?",
    options: [
      "2",
      "3",
      "4",
      "5",
    ],
    correctAnswer: 2,
    explanation: "A rectangle has 4 corners (vertices)."
  },
  {
    id: 32,
    type: "geometry",
    question: "Which of these shapes has exactly 1 pair of parallel sides?",
    options: [
      "Square",
      "Rectangle",
      "Trapezoid",
      "Parallelogram",
    ],
    correctAnswer: 2,
    explanation: "A trapezoid has exactly 1 pair of parallel sides. Squares and rectangles have 2 pairs."
  },
  {
    id: 33,
    type: "data",
    question: "A class survey shows: Football = 12, Cricket = 9, Basketball = 6, Netball = 3. How many students were surveyed in total?",
    options: [
      "24",
      "28",
      "30",
      "34",
    ],
    correctAnswer: 2,
    explanation: "12 + 9 + 6 + 3 = 30 students."
  },
  {
    id: 34,
    type: "data",
    question: "What is the range of: 5, 12, 7, 3, 9?",
    options: [
      "5",
      "7",
      "9",
      "12",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 12 - 3 = 9."
  },
  {
    id: 35,
    type: "data",
    question: "A bar chart shows that 15 students chose Science and 22 chose Maths. How many MORE students chose Maths?",
    options: [
      "5",
      "7",
      "8",
      "37",
    ],
    correctAnswer: 1,
    explanation: "22 - 15 = 7 more students chose Maths."
  },
  {
    id: 36,
    type: "data",
    question: "What is the mean of: 10, 14, 8, 12?",
    options: [
      "10",
      "11",
      "12",
      "14",
    ],
    correctAnswer: 1,
    explanation: "Mean = (10 + 14 + 8 + 12) / 4 = 44 / 4 = 11."
  },
  {
    id: 37,
    type: "data",
    question: "Find the median of: 9, 2, 6, 4, 8",
    options: [
      "4",
      "6",
      "8",
      "9",
    ],
    correctAnswer: 1,
    explanation: "Arrange in order: 2, 4, 6, 8, 9. The middle (3rd) value = 6."
  },
  {
    id: 38,
    type: "data",
    question: "A pie chart shows that 1/2 of students prefer mango. If there are 24 students, how many prefer mango?",
    options: [
      "6",
      "8",
      "12",
      "16",
    ],
    correctAnswer: 2,
    explanation: "1/2 of 24 = 24 / 2 = 12 students."
  },
  {
    id: 39,
    type: "data",
    question: "In a class, 8 students have pets and 12 do not. What fraction has pets?",
    options: [
      "1/3",
      "2/5",
      "8/20",
      "1/2",
    ],
    correctAnswer: 1,
    explanation: "Total = 8 + 12 = 20. Fraction with pets = 8/20 = 2/5."
  },
  {
    id: 40,
    type: "data",
    question: "A pictograph uses 1 symbol = 4 books. Sarah has 3 symbols. How many books has she read?",
    options: [
      "3",
      "7",
      "12",
      "16",
    ],
    correctAnswer: 2,
    explanation: "3 symbols x 4 books per symbol = 12 books."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy4Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy4Questions : numeracyEasy4Questions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => { if (answers.length !== totalQuestions) { setAnswers(new Array(totalQuestions).fill(null)) } }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true); return 0 }
          return prev - 1
        })
      }, 1000)
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
    const correct = sqs.reduce((sum, q) => {
      const index = availableQuestions.findIndex((item) => item.id === q.id)
      return sum + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)
    const total = sqs.length
    const percentage = total ? Math.round((correct / total) * 100) : 0
    const note = percentage >= 85 ? "Excellent work" : percentage >= 70 ? "Good understanding" : percentage >= 50 ? "Developing" : "Needs more practice"
    return { title: sectionConfig[section].title, description: sectionConfig[section].description, correct, total, percentage, note }
  }

  const sectionSummaries = (Object.keys(sectionConfig) as SectionKey[]).map(getSectionSummary).filter((s) => s.total > 0)

  const handleSubmit = () => { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true) }

  const restartTest = () => { setTestStarted(false); setTestCompleted(false); setCurrentQuestion(0); setAnswers(new Array(totalQuestions).fill(null)); setTimeRemaining(isPremium ? 60 * 60 : 10 * 60); setShowReview(false); setCompletedAt("") }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  const sectionLabel = (type: SectionKey) => type === "number" ? "Number Operations" : type === "measurement" ? "Measurement" : type === "geometry" ? "Geometry" : "Data & Statistics"

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Link>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 4</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{totalQuestions}</p><p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-medium text-amber-800">Free Preview Mode</p><p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full paper and printable report.</p></div></div>
                    <Link href="/pricing" className="block mt-3"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button></Link>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Clear place value and number sense questions</li>
                    <li>- Simple measurement and unit understanding</li>
                    <li>- Basic geometry and shape properties</li>
                    <li>- Reading graphs and simple data</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Choose the best answer.</li>
                    <li>- You may move between questions.</li>
                    <li>- Use rough work if needed.</li>
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
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 4</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg"><p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p><p className="text-gray-600 mt-2">Questions Correct</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionSummaries.map((s) => (<div key={s.title} className="rounded-lg bg-white border p-4"><p className="font-semibold text-slate-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.correct}/{s.total} correct · {s.percentage}%</p><p className="text-sm text-blue-700 mt-2 font-medium">{s.note}</p></div>))}
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left"><h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3><p className="text-sm text-slate-700">This easy-level numeracy report includes section summaries and a full question-by-question review with explanations.</p></div>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 4 Report</CardTitle>
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
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionSummaries.map((s) => (<div key={s.title} className="rounded-lg bg-white border p-4"><p className="font-semibold text-slate-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.correct}/{s.total} correct · {s.percentage}%</p><p className="text-sm text-blue-700 mt-2 font-medium">{s.note}</p></div>))}
                </div>
              </div>
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5"><h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3><p className="text-sm text-slate-700">This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.</p></div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2"><p className="font-semibold text-slate-800">Question {index + 1}</p><span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{sectionLabel(q.type)}</span></div>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 4</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
              <div className="flex items-center justify-between"><span className="text-sm font-medium text-blue-700 uppercase">{sectionLabel(question.type)}</span><span className="text-sm text-gray-500">Question {currentQuestion + 1}</span></div>
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
