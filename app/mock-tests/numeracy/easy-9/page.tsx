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

const numeracyEasy9Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is 5,000 + 300 + 20 + 6?",
    options: [
      "5,236",
      "5,326",
      "5,326",
      "5,623",
    ],
    correctAnswer: 1,
    explanation: "5,000 + 300 + 20 + 6 = 5,326."
  },
  {
    id: 2,
    type: "number",
    question: "What is 600 - 245?",
    options: [
      "345",
      "355",
      "365",
      "455",
    ],
    correctAnswer: 1,
    explanation: "600 - 245 = 355. Check: 245 + 355 = 600."
  },
  {
    id: 3,
    type: "number",
    question: "What is 11 x 9?",
    options: [
      "90",
      "99",
      "100",
      "109",
    ],
    correctAnswer: 1,
    explanation: "11 x 9 = 99."
  },
  {
    id: 4,
    type: "number",
    question: "A school has 5 classes. Each class has 28 students. How many students are there altogether?",
    options: [
      "120",
      "130",
      "140",
      "150",
    ],
    correctAnswer: 2,
    explanation: "5 x 28 = 140 students."
  },
  {
    id: 5,
    type: "number",
    question: "What is 132 divided by 12?",
    options: [
      "9",
      "10",
      "11",
      "12",
    ],
    correctAnswer: 2,
    explanation: "132 / 12 = 11. Check: 12 x 11 = 132."
  },
  {
    id: 6,
    type: "number",
    question: "Which of these is an EVEN number?",
    options: [
      "103",
      "215",
      "348",
      "497",
    ],
    correctAnswer: 2,
    explanation: "A number is even if it ends in 0, 2, 4, 6, or 8. 348 ends in 8, so it is even."
  },
  {
    id: 7,
    type: "number",
    question: "What is 1/10 of 90?",
    options: [
      "0.9",
      "9",
      "10",
      "19",
    ],
    correctAnswer: 1,
    explanation: "1/10 of 90 = 90 divided by 10 = 9."
  },
  {
    id: 8,
    type: "number",
    question: "Which number comes BETWEEN 4,692 and 4,700?",
    options: [
      "4,692",
      "4,695",
      "4,700",
      "4,705",
    ],
    correctAnswer: 1,
    explanation: "4,695 is greater than 4,692 and less than 4,700."
  },
  {
    id: 9,
    type: "number",
    question: "What is 25 x 8?",
    options: [
      "160",
      "180",
      "200",
      "220",
    ],
    correctAnswer: 2,
    explanation: "25 x 8 = (25 x 4) x 2 = 100 x 2 = 200."
  },
  {
    id: 10,
    type: "number",
    question: "Which fraction is equivalent to 4/8?",
    options: [
      "1/4",
      "1/3",
      "1/2",
      "2/3",
    ],
    correctAnswer: 2,
    explanation: "4/8 simplifies to 1/2 by dividing numerator and denominator by 4."
  },
  {
    id: 11,
    type: "number",
    question: "Write 0.6 as a fraction.",
    options: [
      "6/100",
      "1/6",
      "3/5",
      "6/10",
    ],
    correctAnswer: 3,
    explanation: "0.6 means 6 tenths = 6/10. This can also be simplified to 3/5, but 6/10 is the direct conversion."
  },
  {
    id: 12,
    type: "number",
    question: "A stall sold 85 coconuts in the morning and 47 in the afternoon. How many were sold in total?",
    options: [
      "122",
      "132",
      "138",
      "142",
    ],
    correctAnswer: 1,
    explanation: "85 + 47 = 132 coconuts."
  },
  {
    id: 13,
    type: "number",
    question: "What is 3/8 written as a decimal?",
    options: [
      "0.125",
      "0.375",
      "0.38",
      "3.8",
    ],
    correctAnswer: 1,
    explanation: "3 / 8 = 0.375."
  },
  {
    id: 14,
    type: "number",
    question: "Which number is a factor of BOTH 12 and 18?",
    options: [
      "4",
      "6",
      "8",
      "9",
    ],
    correctAnswer: 1,
    explanation: "6 divides evenly into 12 (12/6=2) and into 18 (18/6=3). 6 is a common factor of both."
  },
  {
    id: 15,
    type: "number",
    question: "What is the next number in the pattern: 80, 70, 60, 50, ___?",
    options: [
      "35",
      "40",
      "45",
      "55",
    ],
    correctAnswer: 1,
    explanation: "The pattern decreases by 10 each time. 50 - 10 = 40."
  },
  {
    id: 16,
    type: "measurement",
    question: "A ribbon is 3 metres long. It is cut into pieces of 50 cm each. How many pieces are there?",
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 2,
    explanation: "3 m = 300 cm. 300 / 50 = 6 pieces."
  },
  {
    id: 17,
    type: "measurement",
    question: "How many days are in the month of June?",
    options: [
      "28",
      "29",
      "30",
      "31",
    ],
    correctAnswer: 2,
    explanation: "June has 30 days. Use the knuckle method or remember: Sep, Apr, Jun, Nov have 30 days."
  },
  {
    id: 18,
    type: "measurement",
    question: "A rectangle has an area of 48 cm2 and a length of 8 cm. What is its width?",
    options: [
      "4 cm",
      "5 cm",
      "6 cm",
      "7 cm",
    ],
    correctAnswer: 2,
    explanation: "Area = length x width. Width = area / length = 48 / 8 = 6 cm."
  },
  {
    id: 19,
    type: "measurement",
    question: "How many millilitres are in 2 litres and 500 millilitres?",
    options: [
      "2,050 mL",
      "2,500 mL",
      "2,500 mL",
      "25,000 mL",
    ],
    correctAnswer: 1,
    explanation: "2 litres = 2,000 mL. 2,000 + 500 = 2,500 mL."
  },
  {
    id: 20,
    type: "measurement",
    question: "A train departs at 9:15 AM and arrives 2 hours 30 minutes later. What time does it arrive?",
    options: [
      "11:15 AM",
      "11:30 AM",
      "11:45 AM",
      "12:00 PM",
    ],
    correctAnswer: 2,
    explanation: "9:15 + 2 hours = 11:15. 11:15 + 30 minutes = 11:45 AM."
  },
  {
    id: 21,
    type: "measurement",
    question: "What is the perimeter of an equilateral triangle with each side 8 cm?",
    options: [
      "8 cm",
      "16 cm",
      "24 cm",
      "32 cm",
    ],
    correctAnswer: 2,
    explanation: "An equilateral triangle has 3 equal sides. Perimeter = 3 x 8 = 24 cm."
  },
  {
    id: 22,
    type: "measurement",
    question: "How many kilograms are equal to 3,500 grams?",
    options: [
      "0.35 kg",
      "3.5 kg",
      "35 kg",
      "350 kg",
    ],
    correctAnswer: 1,
    explanation: "1 kg = 1,000 g. 3,500 g / 1,000 = 3.5 kg."
  },
  {
    id: 23,
    type: "measurement",
    question: "A garden path is 4 m long and 1.5 m wide. What is its area?",
    options: [
      "5.5 m2",
      "6 m2",
      "7 m2",
      "8 m2",
    ],
    correctAnswer: 1,
    explanation: "Area = length x width = 4 x 1.5 = 6 m2."
  },
  {
    id: 24,
    type: "measurement",
    question: "A television programme starts at 7:30 PM and ends at 8:15 PM. How long is it?",
    options: [
      "30 minutes",
      "40 minutes",
      "45 minutes",
      "50 minutes",
    ],
    correctAnswer: 2,
    explanation: "From 7:30 to 8:15: from 7:30 to 8:00 = 30 minutes, then 15 more minutes = 45 minutes total."
  },
  {
    id: 25,
    type: "measurement",
    question: "What is the best unit to measure the capacity of a swimming pool?",
    options: [
      "Millilitres",
      "Litres",
      "Grams",
      "Metres",
    ],
    correctAnswer: 1,
    explanation: "Litres (and kilolitres) are used to measure the capacity of large containers like swimming pools."
  },
  {
    id: 26,
    type: "geometry",
    question: "What is a polygon with 7 sides called?",
    options: [
      "Hexagon",
      "Heptagon",
      "Octagon",
      "Nonagon",
    ],
    correctAnswer: 1,
    explanation: "A heptagon has 7 sides. Hepta means seven."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which of the following shapes is NOT a quadrilateral?",
    options: [
      "Square",
      "Rectangle",
      "Triangle",
      "Rhombus",
    ],
    correctAnswer: 2,
    explanation: "A quadrilateral has 4 sides. A triangle has only 3 sides, so it is not a quadrilateral."
  },
  {
    id: 28,
    type: "geometry",
    question: "Lines that are always the same distance apart and NEVER meet are called:",
    options: [
      "Perpendicular lines",
      "Diagonal lines",
      "Parallel lines",
      "Curved lines",
    ],
    correctAnswer: 2,
    explanation: "Parallel lines always remain the same distance apart and never meet or cross."
  },
  {
    id: 29,
    type: "geometry",
    question: "A cube has sides of 4 cm. What is the total length of all its edges?",
    options: [
      "16 cm",
      "24 cm",
      "32 cm",
      "48 cm",
    ],
    correctAnswer: 3,
    explanation: "A cube has 12 edges. Each edge is 4 cm. Total = 12 x 4 = 48 cm."
  },
  {
    id: 30,
    type: "geometry",
    question: "What type of angle is one that is between 180 degrees and 360 degrees?",
    options: [
      "Acute",
      "Right",
      "Obtuse",
      "Reflex",
    ],
    correctAnswer: 3,
    explanation: "A reflex angle is greater than 180 degrees and less than 360 degrees."
  },
  {
    id: 31,
    type: "geometry",
    question: "Which shape has exactly 5 faces?",
    options: [
      "Cube",
      "Triangular prism",
      "Square-based pyramid",
      "Cone",
    ],
    correctAnswer: 2,
    explanation: "A square-based pyramid has 1 square base and 4 triangular faces = 5 faces."
  },
  {
    id: 32,
    type: "geometry",
    question: "A shape has 4 sides, opposite sides are equal, and all angles are right angles. What is it?",
    options: [
      "Rhombus",
      "Trapezoid",
      "Rectangle",
      "Parallelogram",
    ],
    correctAnswer: 2,
    explanation: "A rectangle has 4 right angles and opposite sides equal. This fits the description exactly."
  },
  {
    id: 33,
    type: "data",
    question: "The heights of 5 plants in cm are: 12, 18, 9, 15, 6. What is the mean height?",
    options: [
      "10",
      "11",
      "12",
      "15",
    ],
    correctAnswer: 2,
    explanation: "Mean = (12 + 18 + 9 + 15 + 6) / 5 = 60 / 5 = 12 cm."
  },
  {
    id: 34,
    type: "data",
    question: "Find the median of: 4, 11, 7, 2, 9, 5, 13",
    options: [
      "5",
      "7",
      "9",
      "11",
    ],
    correctAnswer: 1,
    explanation: "Arranged in order: 2, 4, 5, 7, 9, 11, 13. The middle (4th) value is 7."
  },
  {
    id: 35,
    type: "data",
    question: "In a class survey, 20 students said cricket was their favourite. If the class has 40 students, what fraction chose cricket?",
    options: [
      "1/4",
      "1/3",
      "1/2",
      "2/3",
    ],
    correctAnswer: 2,
    explanation: "Fraction = 20/40 = 1/2."
  },
  {
    id: 36,
    type: "data",
    question: "A bar chart shows books borrowed each month: April = 30, May = 45, June = 25. What is the total?",
    options: [
      "90",
      "95",
      "100",
      "110",
    ],
    correctAnswer: 2,
    explanation: "30 + 45 + 25 = 100 books."
  },
  {
    id: 37,
    type: "data",
    question: "A set of numbers is: 3, 8, 3, 11, 5, 3, 8, 6. What is the mode?",
    options: [
      "3",
      "5",
      "8",
      "11",
    ],
    correctAnswer: 0,
    explanation: "Mode = most frequent value. 3 appears 3 times, 8 appears 2 times. The mode is 3."
  },
  {
    id: 38,
    type: "data",
    question: "A pictograph uses 1 fish to represent 5 fish caught. Pedro has 7 fish symbols and Maria has 5 fish symbols. How many more fish did Pedro catch?",
    options: [
      "2",
      "5",
      "10",
      "12",
    ],
    correctAnswer: 2,
    explanation: "Pedro: 7 x 5 = 35. Maria: 5 x 5 = 25. Difference = 35 - 25 = 10."
  },
  {
    id: 39,
    type: "data",
    question: "A group of students scored these marks: 70, 85, 70, 90, 75, 70, 80. What is the mode?",
    options: [
      "70",
      "75",
      "80",
      "85",
    ],
    correctAnswer: 0,
    explanation: "Mode = most frequent value. 70 appears 3 times, which is more than any other mark."
  },
  {
    id: 40,
    type: "data",
    question: "What is the range of: 34, 19, 45, 28, 52?",
    options: [
      "18",
      "24",
      "33",
      "52",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 52 - 19 = 33."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy9Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy9Questions : numeracyEasy9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 9</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 9</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 9 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 9</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
