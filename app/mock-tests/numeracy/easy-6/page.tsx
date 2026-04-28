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

const numeracyEasy6Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "What is 2,000 + 600 + 40 + 8?",
    options: [
      "2,648",
      "2,468",
      "2,684",
      "26,048",
    ],
    correctAnswer: 0,
    explanation: "2,000 + 600 + 40 + 8 = 2,648."
  },
  {
    id: 2,
    type: "number",
    question: "Round 5,629 to the nearest thousand.",
    options: [
      "5,000",
      "5,600",
      "6,000",
      "5,700",
    ],
    correctAnswer: 2,
    explanation: "Look at the hundreds digit: 6 is 5 or more, so round up. 5,629 rounds to 6,000."
  },
  {
    id: 3,
    type: "number",
    question: "What is 327 + 468?",
    options: [
      "785",
      "793",
      "795",
      "895",
    ],
    correctAnswer: 2,
    explanation: "327 + 468: ones 7+8=15 (write 5 carry 1), tens 2+6+1=9, hundreds 3+4=7. Answer = 795."
  },
  {
    id: 4,
    type: "number",
    question: "What is 1,000 - 347?",
    options: [
      "643",
      "653",
      "663",
      "753",
    ],
    correctAnswer: 1,
    explanation: "1,000 - 347 = 653. Check: 347 + 653 = 1,000."
  },
  {
    id: 5,
    type: "number",
    question: "What is 7 x 8?",
    options: [
      "48",
      "54",
      "56",
      "64",
    ],
    correctAnswer: 2,
    explanation: "7 x 8 = 56."
  },
  {
    id: 6,
    type: "number",
    question: "A basket holds 9 mangoes. How many mangoes are in 12 baskets?",
    options: [
      "96",
      "98",
      "106",
      "108",
    ],
    correctAnswer: 3,
    explanation: "9 x 12 = 108 mangoes."
  },
  {
    id: 7,
    type: "number",
    question: "What is 84 divided by 7?",
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "84 / 7 = 12. Check: 7 x 12 = 84."
  },
  {
    id: 8,
    type: "number",
    question: "Which number is between 3,450 and 3,500?",
    options: [
      "3,400",
      "3,450",
      "3,475",
      "3,500",
    ],
    correctAnswer: 2,
    explanation: "3,475 is greater than 3,450 and less than 3,500, so it falls between them."
  },
  {
    id: 9,
    type: "number",
    question: "What is 3/4 of 40?",
    options: [
      "10",
      "20",
      "30",
      "40",
    ],
    correctAnswer: 2,
    explanation: "1/4 of 40 = 10. 3/4 = 3 x 10 = 30."
  },
  {
    id: 10,
    type: "number",
    question: "A number is multiplied by 6 to give 54. What is the number?",
    options: [
      "7",
      "8",
      "9",
      "10",
    ],
    correctAnswer: 2,
    explanation: "54 / 6 = 9. Check: 9 x 6 = 54."
  },
  {
    id: 11,
    type: "number",
    question: "What is the next number in the pattern: 3, 6, 12, 24, ___?",
    options: [
      "30",
      "36",
      "42",
      "48",
    ],
    correctAnswer: 3,
    explanation: "Each number is doubled. 24 x 2 = 48."
  },
  {
    id: 12,
    type: "number",
    question: "Which fraction is equivalent to 6/9?",
    options: [
      "1/3",
      "2/3",
      "3/4",
      "4/6",
    ],
    correctAnswer: 1,
    explanation: "6/9: divide numerator and denominator by 3. 6/3=2, 9/3=3. So 6/9 = 2/3."
  },
  {
    id: 13,
    type: "number",
    question: "What is 15 x 4?",
    options: [
      "50",
      "55",
      "60",
      "65",
    ],
    correctAnswer: 2,
    explanation: "15 x 4 = (10 x 4) + (5 x 4) = 40 + 20 = 60."
  },
  {
    id: 14,
    type: "number",
    question: "A bus has 48 seats. 29 passengers are seated. How many empty seats are there?",
    options: [
      "17",
      "18",
      "19",
      "21",
    ],
    correctAnswer: 2,
    explanation: "48 - 29 = 19 empty seats."
  },
  {
    id: 15,
    type: "number",
    question: "Write four thousand and fifty in figures.",
    options: [
      "4,005",
      "4,050",
      "4,500",
      "40,050",
    ],
    correctAnswer: 1,
    explanation: "Four thousand = 4,000. Fifty = 50. Together: 4,050."
  },
  {
    id: 16,
    type: "measurement",
    question: "How many centimetres are in 3.5 metres?",
    options: [
      "35 cm",
      "305 cm",
      "350 cm",
      "3,500 cm",
    ],
    correctAnswer: 2,
    explanation: "1 m = 100 cm. 3.5 m = 3.5 x 100 = 350 cm."
  },
  {
    id: 17,
    type: "measurement",
    question: "A race starts at 10:05 AM and ends at 10:42 AM. How long does the race take?",
    options: [
      "32 minutes",
      "37 minutes",
      "42 minutes",
      "47 minutes",
    ],
    correctAnswer: 1,
    explanation: "From 10:05 to 10:42 = 42 - 5 = 37 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "Which is the most appropriate unit for measuring the mass of a feather?",
    options: [
      "Kilogram",
      "Gram",
      "Milligram",
      "Tonne",
    ],
    correctAnswer: 1,
    explanation: "A feather is very light. Grams (not kilograms) are appropriate. Milligrams may also be considered but grams is the standard choice at this level."
  },
  {
    id: 19,
    type: "measurement",
    question: "A rectangle is 11 cm long and 5 cm wide. What is its perimeter?",
    options: [
      "16 cm",
      "22 cm",
      "32 cm",
      "55 cm",
    ],
    correctAnswer: 2,
    explanation: "Perimeter = 2 x (11 + 5) = 2 x 16 = 32 cm."
  },
  {
    id: 20,
    type: "measurement",
    question: "How many millilitres are in 4.5 litres?",
    options: [
      "450 mL",
      "4,050 mL",
      "4,500 mL",
      "45,000 mL",
    ],
    correctAnswer: 2,
    explanation: "1 litre = 1,000 mL. 4.5 x 1,000 = 4,500 mL."
  },
  {
    id: 21,
    type: "measurement",
    question: "A shop opens at 8:30 AM and closes at 5:00 PM. How long is it open?",
    options: [
      "7 hours",
      "7 hours 30 minutes",
      "8 hours",
      "8 hours 30 minutes",
    ],
    correctAnswer: 3,
    explanation: "8:30 to 5:00: from 8:30 to 4:30 = 8 hours. From 4:30 to 5:00 = 30 minutes. Total = 8 hours 30 minutes."
  },
  {
    id: 22,
    type: "measurement",
    question: "What is the area of a square with sides of 9 cm?",
    options: [
      "18 cm2",
      "36 cm2",
      "72 cm2",
      "81 cm2",
    ],
    correctAnswer: 3,
    explanation: "Area = side x side = 9 x 9 = 81 cm2."
  },
  {
    id: 23,
    type: "measurement",
    question: "A package weighs 2 kg 350 g. How many grams is this?",
    options: [
      "2,035 g",
      "2,350 g",
      "2,530 g",
      "23,500 g",
    ],
    correctAnswer: 1,
    explanation: "2 kg = 2,000 g. 2,000 + 350 = 2,350 g."
  },
  {
    id: 24,
    type: "measurement",
    question: "A train journey takes 3 hours 45 minutes. If it arrives at 1:30 PM, what time did it depart?",
    options: [
      "9:15 AM",
      "9:45 AM",
      "10:15 AM",
      "10:45 AM",
    ],
    correctAnswer: 1,
    explanation: "Subtract 3 hours 45 minutes from 1:30 PM. 1:30 - 3 hours = 10:30. 10:30 - 45 min = 9:45 AM."
  },
  {
    id: 25,
    type: "measurement",
    question: "A field is 30 m long and 20 m wide. What is its area?",
    options: [
      "50 m2",
      "100 m2",
      "300 m2",
      "600 m2",
    ],
    correctAnswer: 3,
    explanation: "Area = length x width = 30 x 20 = 600 m2."
  },
  {
    id: 26,
    type: "geometry",
    question: "What is the name of the shape that has 8 sides?",
    options: [
      "Hexagon",
      "Heptagon",
      "Octagon",
      "Nonagon",
    ],
    correctAnswer: 2,
    explanation: "An octagon has 8 sides. Octo means eight."
  },
  {
    id: 27,
    type: "geometry",
    question: "How many vertices (corners) does a cube have?",
    options: [
      "4",
      "6",
      "8",
      "12",
    ],
    correctAnswer: 2,
    explanation: "A cube has 8 vertices, one at each corner."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which angle is a REFLEX angle?",
    options: [
      "45 degrees",
      "90 degrees",
      "180 degrees",
      "270 degrees",
    ],
    correctAnswer: 3,
    explanation: "A reflex angle is greater than 180 degrees and less than 360 degrees. 270 degrees is reflex."
  },
  {
    id: 29,
    type: "geometry",
    question: "A triangle has angles of 60 degrees and 80 degrees. What is the third angle?",
    options: [
      "30 degrees",
      "40 degrees",
      "50 degrees",
      "60 degrees",
    ],
    correctAnswer: 1,
    explanation: "Angles in a triangle add up to 180 degrees. Third angle = 180 - 60 - 80 = 40 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which solid has a curved surface and two circular faces?",
    options: [
      "Cone",
      "Cylinder",
      "Sphere",
      "Prism",
    ],
    correctAnswer: 1,
    explanation: "A cylinder has two flat circular faces (top and bottom) and one curved surface around the side."
  },
  {
    id: 31,
    type: "geometry",
    question: "Which of the following shapes has 2 pairs of parallel sides?",
    options: [
      "Trapezoid",
      "Parallelogram",
      "Triangle",
      "Circle",
    ],
    correctAnswer: 1,
    explanation: "A parallelogram has 2 pairs of parallel sides. Opposite sides are parallel and equal."
  },
  {
    id: 32,
    type: "geometry",
    question: "What is the sum of angles in a triangle?",
    options: [
      "90 degrees",
      "120 degrees",
      "180 degrees",
      "360 degrees",
    ],
    correctAnswer: 2,
    explanation: "The angles of any triangle always add up to 180 degrees."
  },
  {
    id: 33,
    type: "data",
    question: "A table shows test scores: Marcus = 72, Kezia = 85, Andre = 68, Tasha = 79. Who scored the LOWEST?",
    options: [
      "Marcus",
      "Kezia",
      "Andre",
      "Tasha",
    ],
    correctAnswer: 2,
    explanation: "Compare: 72, 85, 68, 79. Andre scored 68, which is the lowest."
  },
  {
    id: 34,
    type: "data",
    question: "What is the range of these temperatures: 28, 31, 22, 35, 26?",
    options: [
      "6",
      "9",
      "13",
      "22",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 35 - 22 = 13."
  },
  {
    id: 35,
    type: "data",
    question: "A bar chart shows rainfall: April = 60 mm, May = 75 mm, June = 45 mm. What is the mean monthly rainfall?",
    options: [
      "55 mm",
      "60 mm",
      "65 mm",
      "70 mm",
    ],
    correctAnswer: 1,
    explanation: "Mean = (60 + 75 + 45) / 3 = 180 / 3 = 60 mm."
  },
  {
    id: 36,
    type: "data",
    question: "Find the median of: 11, 5, 8, 14, 3, 9, 7",
    options: [
      "5",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "Arranged: 3, 5, 7, 8, 9, 11, 14. The middle (4th) value = 8."
  },
  {
    id: 37,
    type: "data",
    question: "In a class, 3/5 of students walked to school. There are 30 students. How many walked?",
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 2,
    explanation: "3/5 of 30 = (3 x 30) / 5 = 90 / 5 = 18 students."
  },
  {
    id: 38,
    type: "data",
    question: "A frequency table shows: Score 5 = 4 students, Score 6 = 7 students, Score 7 = 9 students. How many students scored 6 or above?",
    options: [
      "7",
      "9",
      "13",
      "16",
    ],
    correctAnswer: 3,
    explanation: "Students scoring 6 or above: 7 + 9 = 16 students."
  },
  {
    id: 39,
    type: "data",
    question: "What is the mean of: 15, 21, 18, 10, 6?",
    options: [
      "12",
      "14",
      "15",
      "18",
    ],
    correctAnswer: 1,
    explanation: "Mean = (15 + 21 + 18 + 10 + 6) / 5 = 70 / 5 = 14."
  },
  {
    id: 40,
    type: "data",
    question: "A pictograph shows: Monday = 3 symbols, Tuesday = 5 symbols, Wednesday = 4 symbols. Each symbol = 6 apples. How many apples were sold altogether?",
    options: [
      "60",
      "66",
      "72",
      "78",
    ],
    correctAnswer: 2,
    explanation: "Total symbols = 3 + 5 + 4 = 12. Total apples = 12 x 6 = 72."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy6Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy6Questions : numeracyEasy6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 6</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 6 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 6</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
