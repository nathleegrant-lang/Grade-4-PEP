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

const numeracyEasy3Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is the place value of the digit 6 in 3,641?",
    options: [
      "Ones",
      "Tens",
      "Hundreds",
      "Thousands",
    ],
    correctAnswer: 2,
    explanation: "In 3,641 the digits are: 3=thousands, 6=hundreds, 4=tens, 1=ones. The 6 is in the hundreds place."
  },
  {
    id: 2,
    type: "number",
    question: "Round 352 to the nearest ten.",
    options: [
      "300",
      "350",
      "360",
      "400",
    ],
    correctAnswer: 1,
    explanation: "Look at the ones digit: 2 is less than 5, so round down. 352 rounds to 350."
  },
  {
    id: 3,
    type: "number",
    question: "What is 47 + 36?",
    options: [
      "73",
      "83",
      "84",
      "93",
    ],
    correctAnswer: 1,
    explanation: "47 + 36: 7+6=13, write 3 carry 1. 4+3+1=8. Answer = 83."
  },
  {
    id: 4,
    type: "number",
    question: "What is 1/2 of 18?",
    options: [
      "6",
      "8",
      "9",
      "12",
    ],
    correctAnswer: 2,
    explanation: "Half of 18 = 18 divided by 2 = 9."
  },
  {
    id: 5,
    type: "number",
    question: "Which number is greater: 2,340 or 2,304?",
    options: [
      "2,304",
      "2,340",
      "They are equal",
      "Cannot tell",
    ],
    correctAnswer: 1,
    explanation: "Compare digit by digit: thousands (2=2), hundreds (3=3), tens (4 vs 0). 4 > 0, so 2,340 is greater."
  },
  {
    id: 6,
    type: "number",
    question: "What is 8 x 7?",
    options: [
      "48",
      "54",
      "56",
      "63",
    ],
    correctAnswer: 2,
    explanation: "8 x 7 = 56. This is a basic multiplication fact."
  },
  {
    id: 7,
    type: "number",
    question: "A farmer picks 96 mangoes and packs them equally into 8 bags. How many mangoes are in each bag?",
    options: [
      "9",
      "10",
      "12",
      "14",
    ],
    correctAnswer: 2,
    explanation: "96 divided by 8 = 12 mangoes per bag."
  },
  {
    id: 8,
    type: "number",
    question: "What is the next number in the pattern: 5, 10, 15, 20, ___?",
    options: [
      "22",
      "24",
      "25",
      "30",
    ],
    correctAnswer: 2,
    explanation: "The pattern increases by 5 each time. 20 + 5 = 25."
  },
  {
    id: 9,
    type: "number",
    question: "Which fraction is the same as 1/2?",
    options: [
      "2/3",
      "3/6",
      "4/9",
      "5/8",
    ],
    correctAnswer: 1,
    explanation: "3/6 = 1/2 because both numerator and denominator are divided by 3. 3 divided by 3 = 1, 6 divided by 3 = 2."
  },
  {
    id: 10,
    type: "number",
    question: "What is 500 - 237?",
    options: [
      "253",
      "263",
      "273",
      "283",
    ],
    correctAnswer: 1,
    explanation: "500 - 237 = 263. Check: 237 + 263 = 500."
  },
  {
    id: 11,
    type: "number",
    question: "Write the number two thousand, four hundred and nine in figures.",
    options: [
      "2,049",
      "2,409",
      "2,490",
      "24,009",
    ],
    correctAnswer: 1,
    explanation: "Two thousand = 2,000. Four hundred = 400. Nine = 9. Together: 2,409."
  },
  {
    id: 12,
    type: "number",
    question: "What is 1/4 of 40?",
    options: [
      "4",
      "8",
      "10",
      "16",
    ],
    correctAnswer: 2,
    explanation: "1/4 of 40 = 40 divided by 4 = 10."
  },
  {
    id: 13,
    type: "number",
    question: "Which number is the SMALLEST: 4,302, 4,230, 4,032, 4,320?",
    options: [
      "4,302",
      "4,230",
      "4,032",
      "4,320",
    ],
    correctAnswer: 2,
    explanation: "Compare hundreds digits: 4,032 has 0 hundreds, which is the smallest. 4,032 is the smallest number."
  },
  {
    id: 14,
    type: "number",
    question: "A school shop sells 45 pens on Monday and 38 pens on Tuesday. How many pens were sold in total?",
    options: [
      "73",
      "83",
      "87",
      "93",
    ],
    correctAnswer: 1,
    explanation: "45 + 38 = 83 pens."
  },
  {
    id: 15,
    type: "number",
    question: "What is 63 divided by 9?",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: "63 divided by 9 = 7. Check: 9 x 7 = 63."
  },
  {
    id: 16,
    type: "measurement",
    question: "Which unit would you use to measure the length of a pencil?",
    options: [
      "kilometres",
      "metres",
      "centimetres",
      "millilitres",
    ],
    correctAnswer: 2,
    explanation: "A pencil is a small object. Centimetres are the best unit for measuring small lengths like pencils."
  },
  {
    id: 17,
    type: "measurement",
    question: "How many minutes are in 2 hours?",
    options: [
      "20",
      "60",
      "100",
      "120",
    ],
    correctAnswer: 3,
    explanation: "1 hour = 60 minutes. 2 hours = 2 x 60 = 120 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "A jug holds 1 litre of water. How many millilitres is that?",
    options: [
      "10 mL",
      "100 mL",
      "500 mL",
      "1,000 mL",
    ],
    correctAnswer: 3,
    explanation: "1 litre = 1,000 millilitres."
  },
  {
    id: 19,
    type: "measurement",
    question: "A bag of rice weighs 2 kg. How many grams is that?",
    options: [
      "20 g",
      "200 g",
      "2,000 g",
      "20,000 g",
    ],
    correctAnswer: 2,
    explanation: "1 kg = 1,000 g. 2 kg = 2 x 1,000 = 2,000 g."
  },
  {
    id: 20,
    type: "measurement",
    question: "A class starts at 9:00 AM and ends at 11:30 AM. How long is the class?",
    options: [
      "1 hour 30 minutes",
      "2 hours",
      "2 hours 30 minutes",
      "3 hours",
    ],
    correctAnswer: 2,
    explanation: "From 9:00 to 11:00 = 2 hours. From 11:00 to 11:30 = 30 minutes. Total = 2 hours 30 minutes."
  },
  {
    id: 21,
    type: "measurement",
    question: "What is the perimeter of a square with a side of 5 cm?",
    options: [
      "5 cm",
      "10 cm",
      "20 cm",
      "25 cm",
    ],
    correctAnswer: 2,
    explanation: "A square has 4 equal sides. Perimeter = 4 x 5 = 20 cm."
  },
  {
    id: 22,
    type: "measurement",
    question: "How many centimetres are in 1 metre?",
    options: [
      "10",
      "50",
      "100",
      "1,000",
    ],
    correctAnswer: 2,
    explanation: "1 metre = 100 centimetres."
  },
  {
    id: 23,
    type: "measurement",
    question: "A bottle contains 750 mL of juice. Another contains 500 mL. How much juice is there in total?",
    options: [
      "1,000 mL",
      "1,150 mL",
      "1,250 mL",
      "1,500 mL",
    ],
    correctAnswer: 2,
    explanation: "750 + 500 = 1,250 mL."
  },
  {
    id: 24,
    type: "measurement",
    question: "A film starts at 3:15 PM and lasts 1 hour and 45 minutes. What time does it end?",
    options: [
      "4:45 PM",
      "5:00 PM",
      "5:15 PM",
      "5:30 PM",
    ],
    correctAnswer: 1,
    explanation: "3:15 + 1 hour = 4:15. 4:15 + 45 minutes = 5:00 PM."
  },
  {
    id: 25,
    type: "measurement",
    question: "What is the area of a rectangle 6 cm long and 4 cm wide?",
    options: [
      "10 cm2",
      "20 cm2",
      "24 cm2",
      "28 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area = length x width = 6 x 4 = 24 cm2."
  },
  {
    id: 26,
    type: "geometry",
    question: "How many sides does a triangle have?",
    options: [
      "2",
      "3",
      "4",
      "5",
    ],
    correctAnswer: 1,
    explanation: "A triangle always has exactly 3 sides."
  },
  {
    id: 27,
    type: "geometry",
    question: "What do we call an angle that is exactly 90 degrees?",
    options: [
      "Acute angle",
      "Right angle",
      "Obtuse angle",
      "Straight angle",
    ],
    correctAnswer: 1,
    explanation: "A right angle measures exactly 90 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape has 4 equal sides and 4 right angles?",
    options: [
      "Rectangle",
      "Rhombus",
      "Square",
      "Trapezoid",
    ],
    correctAnswer: 2,
    explanation: "A square has 4 equal sides AND 4 right angles. A rectangle has right angles but not necessarily equal sides."
  },
  {
    id: 29,
    type: "geometry",
    question: "How many faces does a cube have?",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 2,
    explanation: "A cube has 6 faces, all of which are squares."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which of these angles is ACUTE?",
    options: [
      "90 degrees",
      "120 degrees",
      "45 degrees",
      "180 degrees",
    ],
    correctAnswer: 2,
    explanation: "An acute angle is less than 90 degrees. 45 degrees is the only angle less than 90 degrees."
  },
  {
    id: 31,
    type: "geometry",
    question: "What is the name of a 6-sided shape?",
    options: [
      "Pentagon",
      "Hexagon",
      "Heptagon",
      "Octagon",
    ],
    correctAnswer: 1,
    explanation: "A hexagon has 6 sides. Penta = 5, Hexa = 6, Hepta = 7, Octa = 8."
  },
  {
    id: 32,
    type: "geometry",
    question: "How many lines of symmetry does a square have?",
    options: [
      "1",
      "2",
      "3",
      "4",
    ],
    correctAnswer: 3,
    explanation: "A square has 4 lines of symmetry: 2 through opposite corners and 2 through midpoints of opposite sides."
  },
  {
    id: 33,
    type: "data",
    question: "A class of 25 students voted for their favourite colour. 10 chose blue, 8 chose red, and the rest chose yellow. How many chose yellow?",
    options: [
      "5",
      "7",
      "8",
      "10",
    ],
    correctAnswer: 1,
    explanation: "Yellow = 25 - 10 - 8 = 7 students."
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of: 4, 7, 4, 9, 4, 2, 7?",
    options: [
      "2",
      "4",
      "7",
      "9",
    ],
    correctAnswer: 1,
    explanation: "The mode is the number that appears most often. 4 appears 3 times, which is the most."
  },
  {
    id: 35,
    type: "data",
    question: "A bar chart shows: Monday = 12 books, Tuesday = 8 books, Wednesday = 15 books. How many books were read altogether?",
    options: [
      "25",
      "33",
      "35",
      "38",
    ],
    correctAnswer: 2,
    explanation: "12 + 8 + 15 = 35 books."
  },
  {
    id: 36,
    type: "data",
    question: "Find the median of: 3, 7, 2, 9, 5",
    options: [
      "2",
      "5",
      "7",
      "9",
    ],
    correctAnswer: 1,
    explanation: "Arrange in order: 2, 3, 5, 7, 9. The middle value (3rd) is 5."
  },
  {
    id: 37,
    type: "data",
    question: "A tally chart shows: Mango = 5, Orange = 3, Banana = 4, Pineapple = 2. How many more students chose mango than pineapple?",
    options: [
      "1",
      "2",
      "3",
      "4",
    ],
    correctAnswer: 2,
    explanation: "5 - 2 = 3 more students chose mango than pineapple."
  },
  {
    id: 38,
    type: "data",
    question: "What is the mean of: 4, 6, 8, 10?",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: "Mean = (4 + 6 + 8 + 10) divided by 4 = 28 divided by 4 = 7."
  },
  {
    id: 39,
    type: "data",
    question: "In a class of 20 students, 12 are girls. What fraction of the class are boys?",
    options: [
      "2/5",
      "3/10",
      "8/20",
      "2/10",
    ],
    correctAnswer: 0,
    explanation: "Boys = 20 - 12 = 8. Fraction = 8/20 = 2/5."
  },
  {
    id: 40,
    type: "data",
    question: "A pictograph uses one star to represent 5 students. If there are 4 stars, how many students does this represent?",
    options: [
      "4",
      "9",
      "20",
      "25",
    ],
    correctAnswer: 2,
    explanation: "4 stars x 5 students per star = 20 students."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy3Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy3Questions : numeracyEasy3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 3</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 3 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 3</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
