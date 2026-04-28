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

const numeracyMixed4Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 3,246 + 1,587?`,
    options: [
      "4,723",
      "4,733",
      "4,833",
      "4,843",
    ],
    correctAnswer: 2,
    explanation: `3,246 + 1,587: ones 6+7=13 (carry 1), tens 4+8+1=13 (carry 1), hundreds 2+5+1=8, thousands 3+1=4. Answer = 4,833.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 6,000 - 2,748?`,
    options: [
      "3,152",
      "3,252",
      "3,262",
      "3,352",
    ],
    correctAnswer: 1,
    explanation: `6,000 - 2,748 = 3,252. Check: 2,748 + 3,252 = 6,000.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 68 x 9?`,
    options: [
      "562",
      "572",
      "602",
      "612",
    ],
    correctAnswer: 3,
    explanation: `68 x 9: (60 x 9) + (8 x 9) = 540 + 72 = 612.`
  },
  {
    id: 4,
    type: "number",
    question: `What is 504 divided by 6?`,
    options: [
      "74",
      "80",
      "84",
      "86",
    ],
    correctAnswer: 2,
    explanation: `504 / 6 = 84. Check: 84 x 6 = 504.`
  },
  {
    id: 5,
    type: "number",
    question: `What is the LCM of 4 and 6?`,
    options: [
      "8",
      "10",
      "12",
      "24",
    ],
    correctAnswer: 2,
    explanation: `Multiples of 4: 4, 8, 12. Multiples of 6: 6, 12. LCM = 12.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 5/6 - 1/3?`,
    options: [
      "1/6",
      "1/2",
      "2/3",
      "4/6",
    ],
    correctAnswer: 1,
    explanation: `Convert 1/3 to sixths: 2/6. Then 5/6 - 2/6 = 3/6 = 1/2.`
  },
  {
    id: 7,
    type: "number",
    question: `What is 25% of 200?`,
    options: [
      "25",
      "40",
      "50",
      "75",
    ],
    correctAnswer: 2,
    explanation: `25% of 200 = 200 / 4 = 50.`
  },
  {
    id: 8,
    type: "number",
    question: `Solve for n: 3n + 6 = 24.`,
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 2,
    explanation: `3n = 24 - 6 = 18. n = 18 / 3 = 6.`
  },
  {
    id: 9,
    type: "number",
    question: `A shop increases the price of a $80 item by 15%. What is the new price?`,
    options: [
      "$88",
      "$90",
      "$92",
      "$96",
    ],
    correctAnswer: 2,
    explanation: `15% of $80 = $12. New price = $80 + $12 = $92.`
  },
  {
    id: 10,
    type: "number",
    question: `Write 3/5 as a decimal.`,
    options: [
      "0.35",
      "0.53",
      "0.6",
      "0.65",
    ],
    correctAnswer: 2,
    explanation: `3 / 5 = 0.6. Or: 3/5 = 6/10 = 0.6.`
  },
  {
    id: 11,
    type: "number",
    question: `A number pattern: 80, 72, 64, 56, ___. What is the next term?`,
    options: [
      "44",
      "46",
      "48",
      "50",
    ],
    correctAnswer: 2,
    explanation: `The pattern decreases by 8 each time. 56 - 8 = 48.`
  },
  {
    id: 12,
    type: "number",
    question: `Which is greater: 7/10 or 2/3?`,
    options: [
      "7/10",
      "2/3",
      "They are equal",
      "Cannot tell",
    ],
    correctAnswer: 0,
    explanation: `LCD = 30. 7/10 = 21/30 and 2/3 = 20/30. Since 21 > 20, 7/10 is greater.`
  },
  {
    id: 13,
    type: "number",
    question: `A market vendor earns $240 on Monday and $185 on Tuesday. She spends $75 on supplies. How much does she have left?`,
    options: [
      "$330",
      "$340",
      "$350",
      "$360",
    ],
    correctAnswer: 2,
    explanation: `Total = $240 + $185 = $425. Left = $425 - $75 = $350.`
  },
  {
    id: 14,
    type: "number",
    question: `Express 0.8 as a fraction in simplest form.`,
    options: [
      "8/10",
      "4/5",
      "8/100",
      "1/8",
    ],
    correctAnswer: 1,
    explanation: `0.8 = 8/10 = 4/5. Divide by 2.`
  },
  {
    id: 15,
    type: "number",
    question: `Kezia saves $35 per week. How many weeks to save $420?`,
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: `$420 / $35 = 12 weeks.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A triangle has a base of 14 cm and a height of 8 cm. What is its area?`,
    options: [
      "22 cm2",
      "56 cm2",
      "112 cm2",
      "44 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area = 1/2 x 14 x 8 = 56 cm2.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A bus departs at 7:40 AM and arrives at 9:15 AM. How long is the journey?`,
    options: [
      "1 h 25 min",
      "1 h 35 min",
      "1 h 45 min",
      "2 h 5 min",
    ],
    correctAnswer: 1,
    explanation: `7:40 to 8:40 = 1 hour. 8:40 to 9:15 = 35 minutes. Total = 1 hour 35 minutes.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A rectangular garden has length 18 m and width 12 m. What is its perimeter?`,
    options: [
      "30 m",
      "60 m",
      "72 m",
      "216 m",
    ],
    correctAnswer: 1,
    explanation: `Perimeter = 2 x (18 + 12) = 2 x 30 = 60 m.`
  },
  {
    id: 19,
    type: "measurement",
    question: `How many millilitres are in 8.5 litres?`,
    options: [
      "850 mL",
      "1,850 mL",
      "8,050 mL",
      "8,500 mL",
    ],
    correctAnswer: 3,
    explanation: `1 litre = 1,000 mL. 8.5 x 1,000 = 8,500 mL.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A bag of flour weighs 2 kg 750 g. What is its mass in grams?`,
    options: [
      "2,075 g",
      "2,750 g",
      "27,050 g",
      "27,500 g",
    ],
    correctAnswer: 1,
    explanation: `2 kg = 2,000 g. 2,000 + 750 = 2,750 g.`
  },
  {
    id: 21,
    type: "measurement",
    question: `How many weeks are in one year?`,
    options: [
      "48",
      "50",
      "52",
      "54",
    ],
    correctAnswer: 2,
    explanation: `One year has 52 weeks.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A rectangle is 13 cm long and 6 cm wide. What is its area?`,
    options: [
      "19 cm2",
      "38 cm2",
      "72 cm2",
      "78 cm2",
    ],
    correctAnswer: 3,
    explanation: `Area = 13 x 6 = 78 cm2.`
  },
  {
    id: 23,
    type: "measurement",
    question: `Temperature was 18 degrees C at dawn. It rose 9 degrees by midday, then fell 5 degrees by evening. What was the evening temperature?`,
    options: [
      "20 degrees C",
      "22 degrees C",
      "24 degrees C",
      "27 degrees C",
    ],
    correctAnswer: 1,
    explanation: `18 + 9 = 27. 27 - 5 = 22 degrees C.`
  },
  {
    id: 24,
    type: "measurement",
    question: `How many centimetres are in 4.5 metres?`,
    options: [
      "45 cm",
      "405 cm",
      "450 cm",
      "4,500 cm",
    ],
    correctAnswer: 2,
    explanation: `1 m = 100 cm. 4.5 x 100 = 450 cm.`
  },
  {
    id: 25,
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
    id: 26,
    type: "geometry",
    question: `A triangle has sides of 5 cm, 5 cm, and 8 cm. What type of triangle is it?`,
    options: [
      "Equilateral",
      "Isosceles",
      "Scalene",
      "Right-angled",
    ],
    correctAnswer: 1,
    explanation: `An isosceles triangle has exactly 2 equal sides. Here, 2 sides are both 5 cm.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What is the size of each interior angle in an equilateral triangle?`,
    options: [
      "45 degrees",
      "60 degrees",
      "90 degrees",
      "120 degrees",
    ],
    correctAnswer: 1,
    explanation: `180 / 3 = 60 degrees each.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Which transformation slides a shape to a new position without turning or flipping it?`,
    options: [
      "Rotation",
      "Reflection",
      "Translation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `A translation slides a shape without changing its orientation.`
  },
  {
    id: 29,
    type: "geometry",
    question: `How many faces, edges, and vertices does a rectangular prism have?`,
    options: [
      "6 faces, 10 edges, 8 vertices",
      "6 faces, 12 edges, 8 vertices",
      "8 faces, 12 edges, 6 vertices",
      "6 faces, 12 edges, 6 vertices",
    ],
    correctAnswer: 1,
    explanation: `A rectangular prism: 6 faces, 12 edges, 8 vertices.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Two lines that meet at a right angle are called:`,
    options: [
      "Parallel lines",
      "Intersecting lines",
      "Perpendicular lines",
      "Diagonal lines",
    ],
    correctAnswer: 2,
    explanation: `Perpendicular lines meet at exactly 90 degrees.`
  },
  {
    id: 31,
    type: "geometry",
    question: `What is the sum of all interior angles of a quadrilateral?`,
    options: [
      "180 degrees",
      "270 degrees",
      "360 degrees",
      "540 degrees",
    ],
    correctAnswer: 2,
    explanation: `The interior angles of any quadrilateral always add up to 360 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A quadrilateral has angles of 90, 100, and 85 degrees. What is the fourth angle?`,
    options: [
      "75 degrees",
      "80 degrees",
      "85 degrees",
      "95 degrees",
    ],
    correctAnswer: 2,
    explanation: `Fourth angle = 360 - 90 - 100 - 85 = 85 degrees.`
  },
  {
    id: 33,
    type: "data",
    question: `Find the mean of: 24, 18, 30, 12, 36.`,
    options: [
      "20",
      "22",
      "24",
      "26",
    ],
    correctAnswer: 2,
    explanation: `Mean = (24+18+30+12+36) / 5 = 120 / 5 = 24.`
  },
  {
    id: 34,
    type: "data",
    question: `Find the median of: 11, 4, 17, 8, 14, 6, 20.`,
    options: [
      "8",
      "11",
      "14",
      "17",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 4, 6, 8, 11, 14, 17, 20. Middle (4th) value = 11.`
  },
  {
    id: 35,
    type: "data",
    question: `Goals scored in 8 matches: 7, 9, 7, 5, 8, 7, 6, 9. What is the mode?`,
    options: [
      "5",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 1,
    explanation: `7 appears 3 times, which is the most frequent. Mode = 7.`
  },
  {
    id: 36,
    type: "data",
    question: `What is the range of: 45, 28, 63, 19, 52?`,
    options: [
      "34",
      "44",
      "54",
      "64",
    ],
    correctAnswer: 1,
    explanation: `Range = 63 - 19 = 44.`
  },
  {
    id: 37,
    type: "data",
    question: `A pie chart shows 3/8 of students chose Science. There are 40 students. How many chose Science?`,
    options: [
      "10",
      "12",
      "15",
      "20",
    ],
    correctAnswer: 2,
    explanation: `3/8 x 40 = 15 students.`
  },
  {
    id: 38,
    type: "data",
    question: `Data: 6, 13, 9, 11, 7, 15, 8. What is the median?`,
    options: [
      "8",
      "9",
      "11",
      "13",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 6, 7, 8, 9, 11, 13, 15. Middle (4th) value = 9.`
  },
  {
    id: 39,
    type: "data",
    question: `A bag has 4 red, 3 blue, and 3 green counters. What is the probability of picking red?`,
    options: [
      "2/5",
      "3/10",
      "4/10",
      "1/3",
    ],
    correctAnswer: 0,
    explanation: `P(red) = 4/10 = 2/5.`
  },
  {
    id: 40,
    type: "data",
    question: `In a class of 40, the ratio of boys to girls is 3:5. How many girls are there?`,
    options: [
      "15",
      "20",
      "25",
      "30",
    ],
    correctAnswer: 2,
    explanation: `Total parts = 8. Girls = 5/8 x 40 = 25.`
  }
]

export default function NumeracyMixed4Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed4Questions : numeracyMixed4Questions.slice(0, FREE_QUESTION_LIMIT)
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

  const getScorePercentage = () => Math.round((calculateScore() / totalQuestions) * 100)

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionTitle = (type: Question["type"]) => {
    switch (type) {
      case "number": return "Number Operations"
      case "measurement": return "Measurement"
      case "geometry": return "Geometry"
      default: return "Data & Statistics"
    }
  }

  const getSectionSummary = () => {
    const sections: Question["type"][] = ["number", "measurement", "geometry", "data"]
    return sections.map((section) => {
      const sectionQuestions = availableQuestions.filter((q) => q.type === section)
      const sectionIndices = availableQuestions.map((q, index) => ({ q, index })).filter((item) => item.q.type === section)
      const correct = sectionIndices.filter((item) => answers[item.index] === item.q.correctAnswer).length
      const total = sectionQuestions.length
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
      let note = "Needs more practice"
      if (percentage >= 85) note = "Excellent understanding"
      else if (percentage >= 70) note = "Strong performance"
      else if (percentage >= 50) note = "Developing steadily"
      return { section, title: getSectionTitle(section), correct, total, percentage, note }
    })
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
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 4</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Mixed Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{totalQuestions}</p><p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Free Preview Mode</p>
                        <p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question mixed-level numeracy test with a detailed report.</p>
                      </div>
                    </div>
                    <Link href="/pricing" className="block mt-3">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button>
                    </Link>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Mixed Test Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Number Operations</li>
                    <li>- Measurement</li>
                    <li>- Geometry</li>
                    <li>- Data &amp; Statistics</li>
                    <li>- A blend of easy, moderate, and difficult question styles</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Work through the mixed set one question at a time.</li>
                    <li>- Use rough work if needed.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>
                <Button onClick={() => setTestStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">Start Test</Button>
                <Link href="/mock-tests/numeracy"><Button variant="outline" className="w-full">Back to Numeracy Mock Tests</Button></Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sections = getSectionSummary()
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 4</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                <p className="text-gray-600 mt-2">Questions Correct</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Section Summary</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sections.map((section) => (
                    <div key={section.section} className="rounded-lg bg-white border border-blue-100 p-4">
                      <p className="font-semibold text-slate-800">{section.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
                      <p className="text-xs text-slate-500 mt-2">{section.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                <p className="text-sm text-slate-700">This mixed-level numeracy report combines easier, standard, and more challenging items, with section summaries and a full question-by-question review with explanations.</p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setShowReview(true)} className="w-full bg-blue-600 hover:bg-blue-700">Review Answers &amp; Report</Button>
                <Button onClick={restartTest} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-2" />Take Test Again</Button>
                <Link href="/mock-tests/numeracy"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Button></Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sections = getSectionSummary()
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 4 Report</CardTitle>
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
              <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Section Summary</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sections.map((section) => (
                    <div key={section.section} className="rounded-lg bg-white border border-blue-100 p-4">
                      <p className="font-semibold text-slate-800">{section.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct</p>
                      <p className="text-sm text-blue-700 font-medium mt-1">{section.percentage}%</p>
                      <p className="text-xs text-slate-500 mt-2">{section.note}</p>
                    </div>
                  ))}
                </div>
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
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{getSectionTitle(q.type)}</span>
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
              <div>
                <h1 className="text-lg font-bold">Numeracy Mixed 4</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", timeRemaining <= 300 ? "bg-red-500" : "bg-green-600")}>
              <Clock className="h-5 w-5" />{formatTime(timeRemaining)}
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
                <span className="text-sm font-medium text-blue-700 uppercase">{getSectionTitle(question.type)}</span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
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
                {availableQuestions.map((_, index) => (
                  <button key={index} onClick={() => setCurrentQuestion(index)} className={cn("w-8 h-8 rounded text-sm font-medium transition-colors", currentQuestion === index ? "bg-blue-600 text-white" : answers[index] !== null ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>{index + 1}</button>
                ))}
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
