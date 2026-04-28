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

const numeracyEasy7Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is the value of the digit 8 in 8,253?",
    options: [
      "8",
      "80",
      "800",
      "8,000",
    ],
    correctAnswer: 3,
    explanation: "In 8,253 the digits are: 8=thousands, 2=hundreds, 5=tens, 3=ones. The 8 is in the thousands place. Its value is 8,000."
  },
  {
    id: 2,
    type: "number",
    question: "What is 432 + 259?",
    options: [
      "681",
      "691",
      "691",
      "791",
    ],
    correctAnswer: 1,
    explanation: "432 + 259: ones 2+9=11 (write 1 carry 1), tens 3+5+1=9, hundreds 4+2=6. Answer = 691."
  },
  {
    id: 3,
    type: "number",
    question: "What is 705 - 268?",
    options: [
      "437",
      "447",
      "537",
      "447",
    ],
    correctAnswer: 0,
    explanation: "705 - 268 = 437. Check: 268 + 437 = 705."
  },
  {
    id: 4,
    type: "number",
    question: "A box holds 8 oranges. How many oranges are in 9 boxes?",
    options: [
      "64",
      "70",
      "72",
      "81",
    ],
    correctAnswer: 2,
    explanation: "8 x 9 = 72 oranges."
  },
  {
    id: 5,
    type: "number",
    question: "What is 96 divided by 8?",
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "96 / 8 = 12. Check: 8 x 12 = 96."
  },
  {
    id: 6,
    type: "number",
    question: "Which number is closest to 5,000?",
    options: [
      "4,850",
      "4,950",
      "5,100",
      "5,200",
    ],
    correctAnswer: 1,
    explanation: "Find the difference from 5,000: 4,850 is 150 away, 4,950 is 50 away, 5,100 is 100 away, 5,200 is 200 away. 4,950 is closest."
  },
  {
    id: 7,
    type: "number",
    question: "What is 2/5 of 30?",
    options: [
      "6",
      "10",
      "12",
      "15",
    ],
    correctAnswer: 2,
    explanation: "1/5 of 30 = 6. 2/5 = 2 x 6 = 12."
  },
  {
    id: 8,
    type: "number",
    question: "Which number is a MULTIPLE of both 3 and 4?",
    options: [
      "8",
      "9",
      "12",
      "14",
    ],
    correctAnswer: 2,
    explanation: "12 is divisible by both 3 (12/3=4) and 4 (12/4=3). 12 is a multiple of both."
  },
  {
    id: 9,
    type: "number",
    question: "What is 7 x 6?",
    options: [
      "36",
      "42",
      "48",
      "54",
    ],
    correctAnswer: 1,
    explanation: "7 x 6 = 42."
  },
  {
    id: 10,
    type: "number",
    question: "Round 3,749 to the nearest hundred.",
    options: [
      "3,700",
      "3,750",
      "3,800",
      "4,000",
    ],
    correctAnswer: 0,
    explanation: "Look at the tens digit of 3,749: it is 4, which is less than 5. Round down: 3,749 rounds to 3,700."
  },
  {
    id: 11,
    type: "number",
    question: "A baker makes 48 cupcakes and puts them equally on 6 trays. How many cupcakes are on each tray?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "48 / 6 = 8 cupcakes per tray."
  },
  {
    id: 12,
    type: "number",
    question: "What is 3/10 written as a decimal?",
    options: [
      "0.03",
      "0.3",
      "3.0",
      "30",
    ],
    correctAnswer: 1,
    explanation: "Tenths are written after the decimal point. 3/10 = 0.3."
  },
  {
    id: 13,
    type: "number",
    question: "Which list of numbers is in order from LARGEST to SMALLEST?",
    options: [
      "1,290, 1,902, 1,092",
      "1,902, 1,290, 1,092",
      "1,092, 1,290, 1,902",
      "1,902, 1,092, 1,290",
    ],
    correctAnswer: 1,
    explanation: "1,902 is largest (9 hundreds). 1,290 is next (2 hundreds). 1,092 is smallest (0 hundreds)."
  },
  {
    id: 14,
    type: "number",
    question: "What is 13 x 5?",
    options: [
      "55",
      "60",
      "65",
      "70",
    ],
    correctAnswer: 2,
    explanation: "13 x 5 = (10 x 5) + (3 x 5) = 50 + 15 = 65."
  },
  {
    id: 15,
    type: "number",
    question: "A packet of biscuits costs $4.50. How much do 6 packets cost?",
    options: [
      "$24.00",
      "$25.00",
      "$27.00",
      "$28.50",
    ],
    correctAnswer: 2,
    explanation: "6 x $4.50 = $27.00."
  },
  {
    id: 16,
    type: "measurement",
    question: "How many metres are in 2.5 kilometres?",
    options: [
      "25 m",
      "250 m",
      "2,500 m",
      "25,000 m",
    ],
    correctAnswer: 2,
    explanation: "1 km = 1,000 m. 2.5 km = 2.5 x 1,000 = 2,500 m."
  },
  {
    id: 17,
    type: "measurement",
    question: "A lesson ends at 11:55 AM. It lasted 35 minutes. What time did it start?",
    options: [
      "11:10 AM",
      "11:20 AM",
      "11:30 AM",
      "12:30 PM",
    ],
    correctAnswer: 1,
    explanation: "11:55 minus 35 minutes: 55-35=20. The lesson started at 11:20 AM."
  },
  {
    id: 18,
    type: "measurement",
    question: "What is the perimeter of a rectangle 12 cm long and 7 cm wide?",
    options: [
      "19 cm",
      "38 cm",
      "42 cm",
      "84 cm",
    ],
    correctAnswer: 1,
    explanation: "Perimeter = 2 x (length + width) = 2 x (12 + 7) = 2 x 19 = 38 cm."
  },
  {
    id: 19,
    type: "measurement",
    question: "A jug holds 2 litres. How many 250 mL cups can be filled from it?",
    options: [
      "4",
      "6",
      "8",
      "10",
    ],
    correctAnswer: 2,
    explanation: "2 litres = 2,000 mL. 2,000 / 250 = 8 cups."
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the area of a rectangle 10 cm long and 6 cm wide?",
    options: [
      "16 cm2",
      "32 cm2",
      "60 cm2",
      "100 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area = length x width = 10 x 6 = 60 cm2."
  },
  {
    id: 21,
    type: "measurement",
    question: "How many grams are in 1.5 kilograms?",
    options: [
      "150 g",
      "1,050 g",
      "1,500 g",
      "15,000 g",
    ],
    correctAnswer: 2,
    explanation: "1 kg = 1,000 g. 1.5 kg = 1.5 x 1,000 = 1,500 g."
  },
  {
    id: 22,
    type: "measurement",
    question: "A clock shows 4:30 PM. What time will it show 2 hours and 15 minutes later?",
    options: [
      "6:30 PM",
      "6:45 PM",
      "7:00 PM",
      "7:15 PM",
    ],
    correctAnswer: 1,
    explanation: "4:30 + 2 hours = 6:30. 6:30 + 15 minutes = 6:45 PM."
  },
  {
    id: 23,
    type: "measurement",
    question: "Which temperature is COLDEST?",
    options: [
      "15 degrees C",
      "22 degrees C",
      "8 degrees C",
      "30 degrees C",
    ],
    correctAnswer: 2,
    explanation: "The lowest number represents the coldest temperature. 8 degrees C is the coldest."
  },
  {
    id: 24,
    type: "measurement",
    question: "A field is 25 m long and 20 m wide. What is its area?",
    options: [
      "45 m2",
      "90 m2",
      "500 m2",
      "1,000 m2",
    ],
    correctAnswer: 2,
    explanation: "Area = length x width = 25 x 20 = 500 m2."
  },
  {
    id: 25,
    type: "measurement",
    question: "How many minutes are in one and a half hours?",
    options: [
      "60",
      "80",
      "90",
      "100",
    ],
    correctAnswer: 2,
    explanation: "1 hour = 60 minutes. Half hour = 30 minutes. Total = 60 + 30 = 90 minutes."
  },
  {
    id: 26,
    type: "geometry",
    question: "Which of these shapes has ONLY ONE line of symmetry?",
    options: [
      "Square",
      "Circle",
      "Isosceles triangle",
      "Equilateral triangle",
    ],
    correctAnswer: 2,
    explanation: "An isosceles triangle has exactly one line of symmetry, running from the apex to the midpoint of the base."
  },
  {
    id: 27,
    type: "geometry",
    question: "How many edges does a rectangular prism (cuboid) have?",
    options: [
      "8",
      "10",
      "12",
      "14",
    ],
    correctAnswer: 2,
    explanation: "A rectangular prism has 12 edges: 4 on the top face, 4 on the bottom face, and 4 vertical edges."
  },
  {
    id: 28,
    type: "geometry",
    question: "Two lines that cross each other at right angles are called:",
    options: [
      "Parallel lines",
      "Perpendicular lines",
      "Diagonal lines",
      "Curved lines",
    ],
    correctAnswer: 1,
    explanation: "Perpendicular lines meet or cross at exactly 90 degrees (right angles)."
  },
  {
    id: 29,
    type: "geometry",
    question: "A triangle has angles of 45 degrees and 90 degrees. What is the third angle?",
    options: [
      "35 degrees",
      "45 degrees",
      "55 degrees",
      "90 degrees",
    ],
    correctAnswer: 1,
    explanation: "Angles in a triangle sum to 180 degrees. Third angle = 180 - 45 - 90 = 45 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which solid shape has a square base and 4 triangular faces?",
    options: [
      "Cube",
      "Rectangular prism",
      "Square-based pyramid",
      "Triangular prism",
    ],
    correctAnswer: 2,
    explanation: "A square-based pyramid has 1 square base and 4 triangular faces that meet at a point."
  },
  {
    id: 31,
    type: "geometry",
    question: "Which of these is a QUADRILATERAL?",
    options: [
      "Triangle",
      "Pentagon",
      "Hexagon",
      "Rhombus",
    ],
    correctAnswer: 3,
    explanation: "A quadrilateral is any shape with 4 sides. A rhombus has 4 sides, so it is a quadrilateral."
  },
  {
    id: 32,
    type: "geometry",
    question: "What type of angle is formed by the hands of a clock at 3 o\'clock?",
    options: [
      "Acute angle",
      "Right angle",
      "Obtuse angle",
      "Straight angle",
    ],
    correctAnswer: 1,
    explanation: "At 3 o\'clock, the minute hand points to 12 and the hour hand points to 3, forming a 90-degree right angle."
  },
  {
    id: 33,
    type: "data",
    question: "A class voted for their favourite sport: Cricket 9, Football 14, Netball 7, Swimming 10. How many students voted in total?",
    options: [
      "30",
      "38",
      "40",
      "50",
    ],
    correctAnswer: 2,
    explanation: "9 + 14 + 7 + 10 = 40 students."
  },
  {
    id: 34,
    type: "data",
    question: "What is the range of these marks: 65, 72, 58, 80, 49?",
    options: [
      "23",
      "28",
      "31",
      "35",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 80 - 49 = 31."
  },
  {
    id: 35,
    type: "data",
    question: "Find the mode of: 5, 9, 3, 5, 7, 5, 9, 2",
    options: [
      "2",
      "3",
      "5",
      "9",
    ],
    correctAnswer: 2,
    explanation: "Mode = most frequent value. 5 appears 3 times, which is the most."
  },
  {
    id: 36,
    type: "data",
    question: "A bar chart shows plants grown: Monday = 4, Tuesday = 7, Wednesday = 5, Thursday = 8, Friday = 6. What is the mean?",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 1,
    explanation: "Mean = (4 + 7 + 5 + 8 + 6) / 5 = 30 / 5 = 6."
  },
  {
    id: 37,
    type: "data",
    question: "Find the median of: 14, 8, 22, 6, 17",
    options: [
      "8",
      "14",
      "17",
      "22",
    ],
    correctAnswer: 1,
    explanation: "Arranged in order: 6, 8, 14, 17, 22. The middle (3rd) value is 14."
  },
  {
    id: 38,
    type: "data",
    question: "Out of 40 students, 15 chose Art, 10 chose Music, and the rest chose Drama. How many chose Drama?",
    options: [
      "10",
      "12",
      "15",
      "25",
    ],
    correctAnswer: 2,
    explanation: "Drama = 40 - 15 - 10 = 15 students."
  },
  {
    id: 39,
    type: "data",
    question: "A pictograph uses 1 symbol to represent 10 mangoes. Ria has 4 symbols and Sam has 6 symbols. How many mangoes do they have altogether?",
    options: [
      "10",
      "60",
      "80",
      "100",
    ],
    correctAnswer: 3,
    explanation: "Ria: 4 x 10 = 40. Sam: 6 x 10 = 60. Total = 40 + 60 = 100."
  },
  {
    id: 40,
    type: "data",
    question: "In a survey, 24 out of 60 students prefer reading. What fraction prefer reading, in its simplest form?",
    options: [
      "24/60",
      "2/5",
      "12/30",
      "6/15",
    ],
    correctAnswer: 1,
    explanation: "24/60 = 2/5. Divide both by 12: 24/12=2, 60/12=5."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy7Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy7Questions : numeracyEasy7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 7</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 7 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 7</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
