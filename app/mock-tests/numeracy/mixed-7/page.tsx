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

const numeracyMixed7Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 10,000 - 3,742?`,
    options: [
      "6,158",
      "6,258",
      "6,268",
      "7,258",
    ],
    correctAnswer: 1,
    explanation: `10,000 - 3,742 = 6,258. Check: 3,742 + 6,258 = 10,000.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 95 x 6?`,
    options: [
      "540",
      "560",
      "565",
      "570",
    ],
    correctAnswer: 3,
    explanation: `95 x 6: (90 x 6) + (5 x 6) = 540 + 30 = 570.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 847 divided by 7?`,
    options: [
      "111",
      "119",
      "121",
      "131",
    ],
    correctAnswer: 2,
    explanation: `847 / 7 = 121. Check: 121 x 7 = 847.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the LCM of 9 and 12?`,
    options: [
      "21",
      "27",
      "36",
      "108",
    ],
    correctAnswer: 2,
    explanation: `Multiples of 9: 9,18,27,36. Multiples of 12: 12,24,36. LCM = 36.`
  },
  {
    id: 5,
    type: "number",
    question: `What is 5/6 + 1/4?`,
    options: [
      "6/10",
      "13/12",
      "11/12",
      "1/2",
    ],
    correctAnswer: 1,
    explanation: `LCD = 12. 5/6 = 10/12, 1/4 = 3/12. Sum = 13/12 = 1 and 1/12.`
  },
  {
    id: 6,
    type: "number",
    question: `A television costs $1,200 and is sold at a 15% discount. What is the sale price?`,
    options: [
      "$900",
      "$980",
      "$1,020",
      "$1,080",
    ],
    correctAnswer: 2,
    explanation: `15% of $1,200 = $180. Sale price = $1,200 - $180 = $1,020.`
  },
  {
    id: 7,
    type: "number",
    question: `Solve: 6n - 5 = 43.`,
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: `6n = 48. n = 8.`
  },
  {
    id: 8,
    type: "number",
    question: `What is 4.5 x 0.6?`,
    options: [
      "0.27",
      "2.7",
      "27",
      "270",
    ],
    correctAnswer: 1,
    explanation: `4.5 x 0.6 = 27/10 = 2.7.`
  },
  {
    id: 9,
    type: "number",
    question: `Write 3/8 as a percentage.`,
    options: [
      "25%",
      "30%",
      "37.5%",
      "38%",
    ],
    correctAnswer: 2,
    explanation: `3/8 x 100 = 37.5%.`
  },
  {
    id: 10,
    type: "number",
    question: `A bag costs $28. You buy 5. How much change from $150?`,
    options: [
      "$8",
      "$10",
      "$12",
      "$14",
    ],
    correctAnswer: 1,
    explanation: `5 x $28 = $140. Change = $150 - $140 = $10.`
  },
  {
    id: 11,
    type: "number",
    question: `What is 6 squared + 4 squared?`,
    options: [
      "52",
      "58",
      "60",
      "68",
    ],
    correctAnswer: 0,
    explanation: `6 squared = 36. 4 squared = 16. 36 + 16 = 52.`
  },
  {
    id: 12,
    type: "number",
    question: `What is 40% of 350?`,
    options: [
      "100",
      "120",
      "140",
      "160",
    ],
    correctAnswer: 2,
    explanation: `40% of 350 = 0.40 x 350 = 140.`
  },
  {
    id: 13,
    type: "number",
    question: `A number divided by 9 gives quotient 14 and remainder 3. What is the number?`,
    options: [
      "126",
      "129",
      "132",
      "135",
    ],
    correctAnswer: 1,
    explanation: `Number = (14 x 9) + 3 = 129.`
  },
  {
    id: 14,
    type: "number",
    question: `Which fraction is greater: 5/9 or 3/5?`,
    options: [
      "5/9",
      "3/5",
      "They are equal",
      "Cannot tell",
    ],
    correctAnswer: 1,
    explanation: `LCD = 45. 5/9 = 25/45, 3/5 = 27/45. Since 27 > 25, 3/5 is greater.`
  },
  {
    id: 15,
    type: "number",
    question: `A farmer planted 1,200 seeds. 3/4 germinated. Of those, 2/3 survived to full growth. How many plants grew fully?`,
    options: [
      "400",
      "500",
      "600",
      "700",
    ],
    correctAnswer: 2,
    explanation: `Germinated: 3/4 x 1,200 = 900. Survived: 2/3 x 900 = 600.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A cuboid is 8 cm long, 5 cm wide, and 4 cm tall. What is its volume?`,
    options: [
      "17 cm3",
      "80 cm3",
      "160 cm3",
      "320 cm3",
    ],
    correctAnswer: 2,
    explanation: `Volume = 8 x 5 x 4 = 160 cm3.`
  },
  {
    id: 17,
    type: "measurement",
    question: `School starts at 8:15 AM and ends at 2:45 PM. How long is the school day?`,
    options: [
      "6 h",
      "6 h 15 min",
      "6 h 30 min",
      "6 h 45 min",
    ],
    correctAnswer: 2,
    explanation: `8:15 to 2:15 = 6 h. 2:15 to 2:45 = 30 min. Total = 6 h 30 min.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A rope is 12 m long, cut into pieces of 80 cm each. How many complete pieces?`,
    options: [
      "12",
      "14",
      "15",
      "16",
    ],
    correctAnswer: 2,
    explanation: `12 m = 1,200 cm. 1,200 / 80 = 15 pieces.`
  },
  {
    id: 19,
    type: "measurement",
    question: `The perimeter of a rectangle is 56 cm. Its width is 12 cm. What is its length?`,
    options: [
      "14 cm",
      "16 cm",
      "18 cm",
      "20 cm",
    ],
    correctAnswer: 1,
    explanation: `2(l + 12) = 56. l + 12 = 28. l = 16 cm.`
  },
  {
    id: 20,
    type: "measurement",
    question: `What is the area of a square with side 13 cm?`,
    options: [
      "52 cm2",
      "104 cm2",
      "169 cm2",
      "208 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = 13 x 13 = 169 cm2.`
  },
  {
    id: 21,
    type: "measurement",
    question: `3.5 kg of flour is shared equally among 7 bags. What is the mass of each bag?`,
    options: [
      "350 g",
      "400 g",
      "500 g",
      "550 g",
    ],
    correctAnswer: 2,
    explanation: `3.5 kg = 3,500 g. 3,500 / 7 = 500 g.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A car uses 9 litres of fuel per 100 km. How much fuel for a 300 km journey?`,
    options: [
      "18 L",
      "24 L",
      "27 L",
      "30 L",
    ],
    correctAnswer: 2,
    explanation: `(300/100) x 9 = 27 L.`
  },
  {
    id: 23,
    type: "measurement",
    question: `A cube has a side of 6 cm. What is its total surface area?`,
    options: [
      "36 cm2",
      "72 cm2",
      "144 cm2",
      "216 cm2",
    ],
    correctAnswer: 3,
    explanation: `A cube has 6 faces. Each = 6 x 6 = 36 cm2. Total = 6 x 36 = 216 cm2.`
  },
  {
    id: 24,
    type: "measurement",
    question: `A rectangular plot is 15 m long and 10 m wide. A 1 m path runs around the inside. What is the area of the inner section?`,
    options: [
      "100 m2",
      "104 m2",
      "117 m2",
      "130 m2",
    ],
    correctAnswer: 2,
    explanation: `Inner: (15-2) x (10-2) = 13 x 9 = 117 m2.`
  },
  {
    id: 25,
    type: "measurement",
    question: `How many minutes are in 3/4 of an hour?`,
    options: [
      "30 min",
      "40 min",
      "45 min",
      "50 min",
    ],
    correctAnswer: 2,
    explanation: `3/4 x 60 = 45 minutes.`
  },
  {
    id: 26,
    type: "geometry",
    question: `How many faces does a triangular prism have?`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: `2 triangular faces + 3 rectangular faces = 5 faces.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What is the sum of interior angles of a pentagon?`,
    options: [
      "360 degrees",
      "450 degrees",
      "540 degrees",
      "720 degrees",
    ],
    correctAnswer: 2,
    explanation: `(5-2) x 180 = 540 degrees.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Which type of angle is between 180 and 360 degrees?`,
    options: [
      "Acute",
      "Obtuse",
      "Straight",
      "Reflex",
    ],
    correctAnswer: 3,
    explanation: `A reflex angle is greater than 180 degrees and less than 360 degrees.`
  },
  {
    id: 29,
    type: "geometry",
    question: `A shape slides 5 units to the right without rotating or flipping. This is a:`,
    options: [
      "Rotation",
      "Reflection",
      "Translation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `Sliding without turning or flipping is a translation.`
  },
  {
    id: 30,
    type: "geometry",
    question: `What is the exterior angle of a regular pentagon?`,
    options: [
      "60 degrees",
      "72 degrees",
      "75 degrees",
      "80 degrees",
    ],
    correctAnswer: 1,
    explanation: `Sum of exterior angles = 360. Each = 360 / 5 = 72 degrees.`
  },
  {
    id: 31,
    type: "geometry",
    question: `A right-angled triangle has legs of 6 cm and 8 cm. What is the hypotenuse?`,
    options: [
      "9 cm",
      "10 cm",
      "12 cm",
      "14 cm",
    ],
    correctAnswer: 1,
    explanation: `Hypotenuse = sqrt(36 + 64) = sqrt(100) = 10 cm.`
  },
  {
    id: 32,
    type: "geometry",
    question: `What do you call lines that are always the same distance apart and never meet?`,
    options: [
      "Perpendicular",
      "Diagonal",
      "Parallel",
      "Intersecting",
    ],
    correctAnswer: 2,
    explanation: `Parallel lines never meet and remain the same distance apart.`
  },
  {
    id: 33,
    type: "data",
    question: `The ages of 6 players are: 14, 16, 13, 15, 14, 18. What is the mean age?`,
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 1,
    explanation: `Mean = (14+16+13+15+14+18) / 6 = 90 / 6 = 15.`
  },
  {
    id: 34,
    type: "data",
    question: `Find the median of: 7, 19, 3, 11, 15, 9, 21, 5.`,
    options: [
      "9",
      "10",
      "11",
      "12",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 3, 5, 7, 9, 11, 15, 19, 21. Median = (9+11)/2 = 10.`
  },
  {
    id: 35,
    type: "data",
    question: `Marks in 8 tests: 75, 82, 75, 91, 68, 75, 88, 79. What is the mode?`,
    options: [
      "68",
      "75",
      "82",
      "91",
    ],
    correctAnswer: 1,
    explanation: `75 appears 3 times. Mode = 75.`
  },
  {
    id: 36,
    type: "data",
    question: `What is the range of: 34, 51, 28, 63, 47, 39?`,
    options: [
      "19",
      "25",
      "35",
      "63",
    ],
    correctAnswer: 2,
    explanation: `Range = 63 - 28 = 35.`
  },
  {
    id: 37,
    type: "data",
    question: `A survey of 60 students: 1/4 prefer Art. How many prefer Art?`,
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 1,
    explanation: `1/4 x 60 = 15 students.`
  },
  {
    id: 38,
    type: "data",
    question: `In a set of 5 numbers, the mean is 20. Four numbers are 18, 25, 17, and 22. What is the fifth?`,
    options: [
      "16",
      "17",
      "18",
      "19",
    ],
    correctAnswer: 2,
    explanation: `Total = 100. Sum of 4 = 82. Fifth = 18.`
  },
  {
    id: 39,
    type: "data",
    question: `A die is rolled. What is the probability of getting a number greater than 4?`,
    options: [
      "1/6",
      "1/3",
      "1/2",
      "2/3",
    ],
    correctAnswer: 1,
    explanation: `Numbers > 4: 5 and 6. P = 2/6 = 1/3.`
  },
  {
    id: 40,
    type: "data",
    question: `The mean of 8 numbers is 25. A ninth number is added and the mean drops to 24. What is the ninth number?`,
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 2,
    explanation: `Original sum = 200. New sum = 216. Ninth = 216 - 200 = 16.`
  }
]

export default function NumeracyMixed7Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed7Questions : numeracyMixed7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 7</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 7</h1>
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
