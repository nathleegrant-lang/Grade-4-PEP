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

const numeracyEasy8Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What does the digit 9 represent in the number 9,048?",
    options: [
      "9",
      "90",
      "900",
      "9,000",
    ],
    correctAnswer: 3,
    explanation: "In 9,048 the digit 9 is in the thousands place. Its value is 9,000."
  },
  {
    id: 2,
    type: "number",
    question: "Which number is 1,000 more than 6,347?",
    options: [
      "6,447",
      "6,357",
      "7,347",
      "7,447",
    ],
    correctAnswer: 2,
    explanation: "6,347 + 1,000 = 7,347. Adding 1,000 increases the thousands digit by 1."
  },
  {
    id: 3,
    type: "number",
    question: "What is 567 + 384?",
    options: [
      "941",
      "951",
      "961",
      "971",
    ],
    correctAnswer: 1,
    explanation: "567 + 384: ones 7+4=11 (write 1 carry 1), tens 6+8+1=15 (write 5 carry 1), hundreds 5+3+1=9. Answer = 951."
  },
  {
    id: 4,
    type: "number",
    question: "What is 900 - 456?",
    options: [
      "344",
      "354",
      "444",
      "454",
    ],
    correctAnswer: 2,
    explanation: "900 - 456 = 444. Check: 456 + 444 = 900."
  },
  {
    id: 5,
    type: "number",
    question: "What is 4 x 12?",
    options: [
      "44",
      "46",
      "48",
      "52",
    ],
    correctAnswer: 2,
    explanation: "4 x 12 = 4 x 10 + 4 x 2 = 40 + 8 = 48."
  },
  {
    id: 6,
    type: "number",
    question: "A bus has 6 rows of seats. Each row has 8 seats. How many seats are there in total?",
    options: [
      "40",
      "42",
      "46",
      "48",
    ],
    correctAnswer: 3,
    explanation: "6 x 8 = 48 seats."
  },
  {
    id: 7,
    type: "number",
    question: "What is 108 divided by 9?",
    options: [
      "9",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "108 / 9 = 12. Check: 9 x 12 = 108."
  },
  {
    id: 8,
    type: "number",
    question: "Which fraction is the LARGEST?",
    options: [
      "1/2",
      "2/3",
      "3/4",
      "1/4",
    ],
    correctAnswer: 2,
    explanation: "Convert to same denominator (12): 1/2=6/12, 2/3=8/12, 3/4=9/12, 1/4=3/12. 3/4 = 9/12 is the largest."
  },
  {
    id: 9,
    type: "number",
    question: "What is the value of 4,000 + 200 + 0 + 7?",
    options: [
      "4,027",
      "4,207",
      "4,270",
      "42,007",
    ],
    correctAnswer: 1,
    explanation: "4,000 + 200 + 0 + 7 = 4,207. The tens digit is 0."
  },
  {
    id: 10,
    type: "number",
    question: "Round 7,362 to the nearest ten.",
    options: [
      "7,300",
      "7,360",
      "7,370",
      "7,400",
    ],
    correctAnswer: 1,
    explanation: "Look at the ones digit: 2 is less than 5, so round down. 7,362 rounds to 7,360."
  },
  {
    id: 11,
    type: "number",
    question: "What is 3/4 of 28?",
    options: [
      "7",
      "14",
      "18",
      "21",
    ],
    correctAnswer: 3,
    explanation: "1/4 of 28 = 7. 3/4 = 3 x 7 = 21."
  },
  {
    id: 12,
    type: "number",
    question: "Which of these numbers is a FACTOR of 24?",
    options: [
      "5",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "A factor divides evenly into a number. 24 / 8 = 3 with no remainder. 8 is a factor of 24."
  },
  {
    id: 13,
    type: "number",
    question: "A market stall sells 35 pineapples each day. How many pineapples are sold in 5 days?",
    options: [
      "150",
      "160",
      "175",
      "180",
    ],
    correctAnswer: 2,
    explanation: "35 x 5 = 175 pineapples."
  },
  {
    id: 14,
    type: "number",
    question: "What is 7/10 written as a decimal?",
    options: [
      "0.07",
      "0.7",
      "7.0",
      "70",
    ],
    correctAnswer: 1,
    explanation: "Tenths are written in the first decimal place. 7/10 = 0.7."
  },
  {
    id: 15,
    type: "number",
    question: "What is the next number in the pattern: 1, 3, 9, 27, ___?",
    options: [
      "30",
      "36",
      "54",
      "81",
    ],
    correctAnswer: 3,
    explanation: "Each number is multiplied by 3. 27 x 3 = 81."
  },
  {
    id: 16,
    type: "measurement",
    question: "How many centimetres are in 2 metres 45 centimetres?",
    options: [
      "245 cm",
      "254 cm",
      "245 cm",
      "2,045 cm",
    ],
    correctAnswer: 0,
    explanation: "2 metres = 200 cm. 200 + 45 = 245 cm."
  },
  {
    id: 17,
    type: "measurement",
    question: "A film starts at 5:20 PM and is 1 hour 35 minutes long. What time does it end?",
    options: [
      "6:45 PM",
      "6:50 PM",
      "6:55 PM",
      "7:05 PM",
    ],
    correctAnswer: 2,
    explanation: "5:20 + 1 hour = 6:20. 6:20 + 35 minutes = 6:55 PM."
  },
  {
    id: 18,
    type: "measurement",
    question: "What is the perimeter of a square with sides of 11 cm?",
    options: [
      "22 cm",
      "33 cm",
      "44 cm",
      "121 cm",
    ],
    correctAnswer: 2,
    explanation: "Perimeter of a square = 4 x side = 4 x 11 = 44 cm."
  },
  {
    id: 19,
    type: "measurement",
    question: "Three bags of flour weigh 750 g, 500 g, and 250 g. What is the total mass?",
    options: [
      "1 kg",
      "1.25 kg",
      "1.5 kg",
      "1.75 kg",
    ],
    correctAnswer: 2,
    explanation: "750 + 500 + 250 = 1,500 g = 1.5 kg."
  },
  {
    id: 20,
    type: "measurement",
    question: "Which unit is best for measuring the distance from Kingston to Montego Bay?",
    options: [
      "Millimetres",
      "Centimetres",
      "Metres",
      "Kilometres",
    ],
    correctAnswer: 3,
    explanation: "Kilometres are used for long distances between towns and cities."
  },
  {
    id: 21,
    type: "measurement",
    question: "A water bottle holds 600 mL. How many bottles are needed to fill a 3-litre container?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: "3 litres = 3,000 mL. 3,000 / 600 = 5 bottles."
  },
  {
    id: 22,
    type: "measurement",
    question: "What is the area of a rectangle with length 15 cm and width 4 cm?",
    options: [
      "19 cm2",
      "38 cm2",
      "55 cm2",
      "60 cm2",
    ],
    correctAnswer: 3,
    explanation: "Area = length x width = 15 x 4 = 60 cm2."
  },
  {
    id: 23,
    type: "measurement",
    question: "A school day starts at 8:00 AM and ends at 2:30 PM. How long is the school day?",
    options: [
      "5 hours 30 minutes",
      "6 hours",
      "6 hours 30 minutes",
      "7 hours",
    ],
    correctAnswer: 2,
    explanation: "8:00 to 2:00 = 6 hours. 2:00 to 2:30 = 30 minutes. Total = 6 hours 30 minutes."
  },
  {
    id: 24,
    type: "measurement",
    question: "How many kilograms are in 4,500 grams?",
    options: [
      "0.45 kg",
      "4.5 kg",
      "45 kg",
      "450 kg",
    ],
    correctAnswer: 1,
    explanation: "1,000 g = 1 kg. 4,500 g = 4,500 / 1,000 = 4.5 kg."
  },
  {
    id: 25,
    type: "measurement",
    question: "A wall is 3 m tall and 5 m wide. What is its area?",
    options: [
      "8 m2",
      "15 m2",
      "16 m2",
      "30 m2",
    ],
    correctAnswer: 1,
    explanation: "Area = height x width = 3 x 5 = 15 m2."
  },
  {
    id: 26,
    type: "geometry",
    question: "Which of these shapes has PARALLEL sides?",
    options: [
      "Circle",
      "Triangle",
      "Trapezoid",
      "Cone",
    ],
    correctAnswer: 2,
    explanation: "A trapezoid has at least one pair of parallel sides (the two horizontal sides)."
  },
  {
    id: 27,
    type: "geometry",
    question: "What is the name of a triangle that has all three sides of DIFFERENT lengths?",
    options: [
      "Equilateral triangle",
      "Isosceles triangle",
      "Scalene triangle",
      "Right triangle",
    ],
    correctAnswer: 2,
    explanation: "A scalene triangle has all three sides of different lengths and all angles different."
  },
  {
    id: 28,
    type: "geometry",
    question: "How many faces does a triangular pyramid (tetrahedron) have?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: "A triangular pyramid has 4 triangular faces."
  },
  {
    id: 29,
    type: "geometry",
    question: "A shape has 4 sides. All sides are equal. The angles are NOT right angles. What is it?",
    options: [
      "Square",
      "Rectangle",
      "Rhombus",
      "Parallelogram",
    ],
    correctAnswer: 2,
    explanation: "A rhombus has 4 equal sides but the angles are not necessarily 90 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which of these angles is OBTUSE?",
    options: [
      "15 degrees",
      "90 degrees",
      "145 degrees",
      "190 degrees",
    ],
    correctAnswer: 2,
    explanation: "An obtuse angle is greater than 90 degrees and less than 180 degrees. 145 degrees is obtuse."
  },
  {
    id: 31,
    type: "geometry",
    question: "How many lines of symmetry does a regular hexagon have?",
    options: [
      "2",
      "4",
      "6",
      "8",
    ],
    correctAnswer: 2,
    explanation: "A regular hexagon has 6 lines of symmetry."
  },
  {
    id: 32,
    type: "geometry",
    question: "What is the sum of the angles in a quadrilateral?",
    options: [
      "90 degrees",
      "180 degrees",
      "270 degrees",
      "360 degrees",
    ],
    correctAnswer: 3,
    explanation: "The four angles of any quadrilateral always add up to 360 degrees."
  },
  {
    id: 33,
    type: "data",
    question: "A tally chart shows: Red = 8, Blue = 12, Green = 5, Yellow = 3. What colour was chosen LEAST?",
    options: [
      "Red",
      "Blue",
      "Green",
      "Yellow",
    ],
    correctAnswer: 3,
    explanation: "Yellow was chosen only 3 times, which is the smallest number."
  },
  {
    id: 34,
    type: "data",
    question: "Find the mean of: 8, 12, 6, 14, 10",
    options: [
      "8",
      "9",
      "10",
      "12",
    ],
    correctAnswer: 2,
    explanation: "Mean = (8 + 12 + 6 + 14 + 10) / 5 = 50 / 5 = 10."
  },
  {
    id: 35,
    type: "data",
    question: "Find the mode of: 7, 2, 9, 7, 4, 7, 3, 9",
    options: [
      "2",
      "4",
      "7",
      "9",
    ],
    correctAnswer: 2,
    explanation: "Mode = most frequent value. 7 appears 3 times, which is the most frequent."
  },
  {
    id: 36,
    type: "data",
    question: "Find the median of: 22, 15, 9, 18, 11",
    options: [
      "9",
      "15",
      "18",
      "22",
    ],
    correctAnswer: 1,
    explanation: "Arranged in order: 9, 11, 15, 18, 22. The middle (3rd) value is 15."
  },
  {
    id: 37,
    type: "data",
    question: "A pie chart shows that 1/4 of students prefer swimming. There are 32 students. How many prefer swimming?",
    options: [
      "4",
      "6",
      "8",
      "10",
    ],
    correctAnswer: 2,
    explanation: "1/4 of 32 = 32 / 4 = 8 students."
  },
  {
    id: 38,
    type: "data",
    question: "A pictograph uses 1 star to represent 3 goals. Team A has 5 stars and Team B has 4 stars. How many goals did both teams score altogether?",
    options: [
      "9",
      "18",
      "24",
      "27",
    ],
    correctAnswer: 3,
    explanation: "Team A: 5 x 3 = 15 goals. Team B: 4 x 3 = 12 goals. Total = 15 + 12 = 27 goals."
  },
  {
    id: 39,
    type: "data",
    question: "In a class of 35, 14 students play an instrument. What fraction do NOT play an instrument?",
    options: [
      "14/35",
      "2/5",
      "3/5",
      "21/35",
    ],
    correctAnswer: 2,
    explanation: "Students who do not play = 35 - 14 = 21. Fraction = 21/35 = 3/5."
  },
  {
    id: 40,
    type: "data",
    question: "The range of a set of numbers is 15. The smallest number is 8. What is the largest number?",
    options: [
      "7",
      "15",
      "20",
      "23",
    ],
    correctAnswer: 3,
    explanation: "Range = largest - smallest. Largest = smallest + range = 8 + 15 = 23."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy8Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy8Questions : numeracyEasy8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 8</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 8 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 8</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
