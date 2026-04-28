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

const numeracyEasy5Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is the value of the underlined digit in 7,4_8_2? The digit 4 is underlined.",
    options: [
      "4",
      "40",
      "400",
      "4,000",
    ],
    correctAnswer: 2,
    explanation: "In 7,482, the digit 4 is in the hundreds place. Its value is 400."
  },
  {
    id: 2,
    type: "number",
    question: "What is 125 + 348?",
    options: [
      "463",
      "473",
      "473",
      "483",
    ],
    correctAnswer: 1,
    explanation: "125 + 348: ones 5+8=13 (write 3 carry 1), tens 2+4+1=7, hundreds 1+3=4. Answer = 473."
  },
  {
    id: 3,
    type: "number",
    question: "What is 804 - 356?",
    options: [
      "448",
      "448",
      "452",
      "458",
    ],
    correctAnswer: 0,
    explanation: "804 - 356 = 448. Check: 356 + 448 = 804."
  },
  {
    id: 4,
    type: "number",
    question: "What is 9 x 8?",
    options: [
      "63",
      "64",
      "72",
      "81",
    ],
    correctAnswer: 2,
    explanation: "9 x 8 = 72. This is a key multiplication fact."
  },
  {
    id: 5,
    type: "number",
    question: "Which of the following is an ODD number?",
    options: [
      "246",
      "312",
      "417",
      "520",
    ],
    correctAnswer: 2,
    explanation: "A number ending in 1, 3, 5, 7, or 9 is odd. 417 ends in 7, so it is odd."
  },
  {
    id: 6,
    type: "number",
    question: "What is 1/5 of 45?",
    options: [
      "5",
      "7",
      "9",
      "11",
    ],
    correctAnswer: 2,
    explanation: "1/5 of 45 = 45 divided by 5 = 9."
  },
  {
    id: 7,
    type: "number",
    question: "A jar has 144 sweets. They are shared equally among 12 children. How many does each child get?",
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "144 / 12 = 12 sweets each."
  },
  {
    id: 8,
    type: "number",
    question: "What is 3,000 + 400 + 70 + 5?",
    options: [
      "3,045",
      "3,475",
      "3,745",
      "34,075",
    ],
    correctAnswer: 1,
    explanation: "3,000 + 400 = 3,400. 3,400 + 70 = 3,470. 3,470 + 5 = 3,475."
  },
  {
    id: 9,
    type: "number",
    question: "Round 6,482 to the nearest thousand.",
    options: [
      "6,000",
      "6,500",
      "7,000",
      "6,400",
    ],
    correctAnswer: 0,
    explanation: "Look at the hundreds digit: 4 is less than 5, so round down. 6,482 rounds to 6,000."
  },
  {
    id: 10,
    type: "number",
    question: "What is 56 divided by 7?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "56 / 7 = 8. Check: 7 x 8 = 56."
  },
  {
    id: 11,
    type: "number",
    question: "Which fraction is GREATER: 3/4 or 2/3?",
    options: [
      "3/4",
      "2/3",
      "They are equal",
      "Cannot tell",
    ],
    correctAnswer: 0,
    explanation: "Convert to same denominator (12): 3/4 = 9/12 and 2/3 = 8/12. Since 9/12 > 8/12, 3/4 is greater."
  },
  {
    id: 12,
    type: "number",
    question: "A market vendor had 320 oranges. She sold 175. How many does she have left?",
    options: [
      "135",
      "145",
      "155",
      "165",
    ],
    correctAnswer: 1,
    explanation: "320 - 175 = 145 oranges."
  },
  {
    id: 13,
    type: "number",
    question: "What is the next number in the pattern: 100, 90, 80, 70, ___?",
    options: [
      "55",
      "60",
      "65",
      "70",
    ],
    correctAnswer: 1,
    explanation: "The pattern decreases by 10 each time. 70 - 10 = 60."
  },
  {
    id: 14,
    type: "number",
    question: "Which is the SMALLEST: 1/2, 1/4, 1/3, 3/4?",
    options: [
      "1/2",
      "1/4",
      "1/3",
      "3/4",
    ],
    correctAnswer: 1,
    explanation: "When the numerator is 1, the larger the denominator, the smaller the fraction. 1/4 is the smallest."
  },
  {
    id: 15,
    type: "number",
    question: "What is 14 x 6?",
    options: [
      "76",
      "80",
      "84",
      "88",
    ],
    correctAnswer: 2,
    explanation: "14 x 6 = (10 x 6) + (4 x 6) = 60 + 24 = 84."
  },
  {
    id: 16,
    type: "measurement",
    question: "A rope is 5 metres long. How many centimetres is this?",
    options: [
      "50 cm",
      "500 cm",
      "5,000 cm",
      "50,000 cm",
    ],
    correctAnswer: 1,
    explanation: "1 m = 100 cm. 5 m = 5 x 100 = 500 cm."
  },
  {
    id: 17,
    type: "measurement",
    question: "How many seconds are in 3 minutes?",
    options: [
      "30",
      "100",
      "180",
      "300",
    ],
    correctAnswer: 2,
    explanation: "1 minute = 60 seconds. 3 minutes = 3 x 60 = 180 seconds."
  },
  {
    id: 18,
    type: "measurement",
    question: "A bottle contains 2.5 litres of water. How many millilitres is this?",
    options: [
      "250 mL",
      "1,500 mL",
      "2,500 mL",
      "25,000 mL",
    ],
    correctAnswer: 2,
    explanation: "1 litre = 1,000 mL. 2.5 litres = 2.5 x 1,000 = 2,500 mL."
  },
  {
    id: 19,
    type: "measurement",
    question: "What is the perimeter of a regular triangle (equilateral) with sides of 9 cm?",
    options: [
      "9 cm",
      "18 cm",
      "27 cm",
      "36 cm",
    ],
    correctAnswer: 2,
    explanation: "An equilateral triangle has 3 equal sides. Perimeter = 3 x 9 = 27 cm."
  },
  {
    id: 20,
    type: "measurement",
    question: "If today is Tuesday, what day will it be in 10 days?",
    options: [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday",
    ],
    correctAnswer: 3,
    explanation: "7 days from any day brings you back to the same day. So 7 days later is still Tuesday. 3 more days: Wed, Thu, Fri. Answer = Friday."
  },
  {
    id: 21,
    type: "measurement",
    question: "How many months are in 2 years?",
    options: [
      "12",
      "18",
      "24",
      "36",
    ],
    correctAnswer: 2,
    explanation: "1 year = 12 months. 2 years = 2 x 12 = 24 months."
  },
  {
    id: 22,
    type: "measurement",
    question: "A bag of sugar weighs 500 g. How many bags make 3 kg?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 3,
    explanation: "3 kg = 3,000 g. 3,000 / 500 = 6 bags."
  },
  {
    id: 23,
    type: "measurement",
    question: "What is the area of a rectangle 9 m long and 5 m wide?",
    options: [
      "14 m2",
      "28 m2",
      "40 m2",
      "45 m2",
    ],
    correctAnswer: 3,
    explanation: "Area = length x width = 9 x 5 = 45 m2."
  },
  {
    id: 24,
    type: "measurement",
    question: "A bus leaves at 2:30 PM and arrives 1 hour 20 minutes later. What time does it arrive?",
    options: [
      "3:30 PM",
      "3:40 PM",
      "3:50 PM",
      "4:00 PM",
    ],
    correctAnswer: 2,
    explanation: "2:30 + 1 hour = 3:30. 3:30 + 20 minutes = 3:50 PM."
  },
  {
    id: 25,
    type: "measurement",
    question: "Which is the CORRECT conversion?",
    options: [
      "1 km = 100 m",
      "1 km = 1,000 m",
      "1 m = 1,000 cm",
      "1 cm = 100 mm",
    ],
    correctAnswer: 1,
    explanation: "1 kilometre = 1,000 metres."
  },
  {
    id: 26,
    type: "geometry",
    question: "Which of the following shapes has NO corners?",
    options: [
      "Triangle",
      "Square",
      "Circle",
      "Rectangle",
    ],
    correctAnswer: 2,
    explanation: "A circle has no corners (vertices) and no straight sides."
  },
  {
    id: 27,
    type: "geometry",
    question: "A straight angle measures ___.",
    options: [
      "45 degrees",
      "90 degrees",
      "180 degrees",
      "360 degrees",
    ],
    correctAnswer: 2,
    explanation: "A straight angle measures exactly 180 degrees, forming a straight line."
  },
  {
    id: 28,
    type: "geometry",
    question: "How many edges does a cube have?",
    options: [
      "6",
      "8",
      "10",
      "12",
    ],
    correctAnswer: 3,
    explanation: "A cube has 12 edges: 4 on the top, 4 on the bottom, and 4 vertical edges."
  },
  {
    id: 29,
    type: "geometry",
    question: "Which shape has 4 right angles but sides that are NOT all equal?",
    options: [
      "Square",
      "Rectangle",
      "Rhombus",
      "Trapezoid",
    ],
    correctAnswer: 1,
    explanation: "A rectangle has 4 right angles but its length and width are usually different (not all sides equal)."
  },
  {
    id: 30,
    type: "geometry",
    question: "How many faces does a triangular prism have?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: "A triangular prism has 2 triangular faces and 3 rectangular faces = 5 faces total."
  },
  {
    id: 31,
    type: "geometry",
    question: "What type of angle is 35 degrees?",
    options: [
      "Acute",
      "Right",
      "Obtuse",
      "Reflex",
    ],
    correctAnswer: 0,
    explanation: "An acute angle is less than 90 degrees. 35 degrees is acute."
  },
  {
    id: 32,
    type: "geometry",
    question: "Which shape always has ALL sides equal?",
    options: [
      "Rectangle",
      "Rhombus",
      "Trapezoid",
      "Right-angled triangle",
    ],
    correctAnswer: 1,
    explanation: "A rhombus has all four sides equal in length (like a square but the angles do not have to be 90 degrees)."
  },
  {
    id: 33,
    type: "data",
    question: "A table shows books read: Nia = 8, Kezia = 12, Andre = 6, Tasha = 10. Who read the MOST books?",
    options: [
      "Nia",
      "Kezia",
      "Andre",
      "Tasha",
    ],
    correctAnswer: 1,
    explanation: "Compare: Kezia has 12, which is the highest number."
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of: 3, 5, 3, 8, 5, 3, 7?",
    options: [
      "3",
      "5",
      "7",
      "8",
    ],
    correctAnswer: 0,
    explanation: "Mode = most frequent value. 3 appears 3 times, which is the most."
  },
  {
    id: 35,
    type: "data",
    question: "A bar chart shows: January = 20 mm rain, February = 35 mm, March = 28 mm. What is the total rainfall over the 3 months?",
    options: [
      "63 mm",
      "73 mm",
      "83 mm",
      "93 mm",
    ],
    correctAnswer: 2,
    explanation: "20 + 35 + 28 = 83 mm."
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of: 2, 5, 8, 11, 14?",
    options: [
      "5",
      "8",
      "11",
      "14",
    ],
    correctAnswer: 1,
    explanation: "With 5 values in order: 2, 5, 8, 11, 14. The middle (3rd) value is 8."
  },
  {
    id: 37,
    type: "data",
    question: "In a class of 30, 18 are girls. What fraction are boys?",
    options: [
      "3/5",
      "2/5",
      "1/3",
      "18/30",
    ],
    correctAnswer: 1,
    explanation: "Boys = 30 - 18 = 12. Fraction = 12/30 = 2/5."
  },
  {
    id: 38,
    type: "data",
    question: "Find the mean of: 6, 10, 8, 4, 2",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 2,
    explanation: "Mean = (6 + 10 + 8 + 4 + 2) / 5 = 30 / 5 = 6."
  },
  {
    id: 39,
    type: "data",
    question: "A line graph shows plant heights: Week 1 = 4 cm, Week 2 = 7 cm, Week 3 = 10 cm. By how much does the plant grow each week?",
    options: [
      "2 cm",
      "3 cm",
      "4 cm",
      "7 cm",
    ],
    correctAnswer: 1,
    explanation: "From week 1 to 2: 7-4=3 cm. From week 2 to 3: 10-7=3 cm. It grows 3 cm per week."
  },
  {
    id: 40,
    type: "data",
    question: "In a class of 40, 1/4 of students bring lunch from home. How many bring lunch from home?",
    options: [
      "4",
      "8",
      "10",
      "16",
    ],
    correctAnswer: 2,
    explanation: "1/4 of 40 = 40 / 4 = 10 students."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy5Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy5Questions : numeracyEasy5Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 5</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 5</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 5 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 5</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
