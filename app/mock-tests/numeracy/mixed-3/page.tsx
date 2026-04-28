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

const numeracyMixed3Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 5,000 - 2,347?`,
    options: [
      "2,553",
      "2,643",
      "2,653",
      "2,753",
    ],
    correctAnswer: 2,
    explanation: `5,000 - 2,347 = 2,653. Check: 2,347 + 2,653 = 5,000.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 74 x 8?`,
    options: [
      "582",
      "592",
      "602",
      "612",
    ],
    correctAnswer: 1,
    explanation: `74 x 8: (70 x 8) + (4 x 8) = 560 + 32 = 592.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 325 divided by 5?`,
    options: [
      "55",
      "60",
      "65",
      "70",
    ],
    correctAnswer: 2,
    explanation: `325 / 5 = 65. Check: 65 x 5 = 325.`
  },
  {
    id: 4,
    type: "number",
    question: `Which number is divisible by both 3 and 5?`,
    options: [
      "20",
      "25",
      "30",
      "35",
    ],
    correctAnswer: 2,
    explanation: `30 / 3 = 10 and 30 / 5 = 6. Both divide evenly. 30 is correct.`
  },
  {
    id: 5,
    type: "number",
    question: `What is the HCF of 12 and 18?`,
    options: [
      "3",
      "4",
      "6",
      "9",
    ],
    correctAnswer: 2,
    explanation: `Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 3/8 + 1/4?`,
    options: [
      "4/12",
      "4/8",
      "5/8",
      "7/8",
    ],
    correctAnswer: 2,
    explanation: `Convert 1/4 to eighths: 2/8. Then 3/8 + 2/8 = 5/8.`
  },
  {
    id: 7,
    type: "number",
    question: `What is 7/10 as a percentage?`,
    options: [
      "7%",
      "17%",
      "70%",
      "700%",
    ],
    correctAnswer: 2,
    explanation: `7/10 x 100 = 70%.`
  },
  {
    id: 8,
    type: "number",
    question: `Which of these is NOT a factor of 24?`,
    options: [
      "6",
      "8",
      "9",
      "12",
    ],
    correctAnswer: 2,
    explanation: `24 / 9 = 2.67 (not a whole number). 9 is NOT a factor of 24.`
  },
  {
    id: 9,
    type: "number",
    question: `A shop gives a 20% discount on a $60 item. What is the sale price?`,
    options: [
      "$12",
      "$40",
      "$48",
      "$54",
    ],
    correctAnswer: 2,
    explanation: `20% of $60 = $12. Sale price = $60 - $12 = $48.`
  },
  {
    id: 10,
    type: "number",
    question: `What is the value of n in: n + 15 = 42?`,
    options: [
      "17",
      "27",
      "37",
      "57",
    ],
    correctAnswer: 1,
    explanation: `n = 42 - 15 = 27.`
  },
  {
    id: 11,
    type: "number",
    question: `What is 3.5 x 6?`,
    options: [
      "18",
      "21",
      "22",
      "24",
    ],
    correctAnswer: 1,
    explanation: `3.5 x 6: 3 x 6 = 18, 0.5 x 6 = 3. Total = 21.`
  },
  {
    id: 12,
    type: "number",
    question: `Express 45/100 as a decimal.`,
    options: [
      "0.045",
      "0.45",
      "4.5",
      "45",
    ],
    correctAnswer: 1,
    explanation: `45/100 = 0.45. The denominator 100 means two decimal places.`
  },
  {
    id: 13,
    type: "number",
    question: `A recipe needs 2/3 cup of sugar for one batch. How much sugar is needed for 3 batches?`,
    options: [
      "1 cup",
      "2 cups",
      "3 cups",
      "6 cups",
    ],
    correctAnswer: 1,
    explanation: `2/3 x 3 = 6/3 = 2 cups.`
  },
  {
    id: 14,
    type: "number",
    question: `Which shows these decimals greatest to least: 3.2, 3.02, 3.22, 3.002?`,
    options: [
      "3.002, 3.02, 3.2, 3.22",
      "3.22, 3.2, 3.02, 3.002",
      "3.2, 3.22, 3.02, 3.002",
      "3.02, 3.22, 3.2, 3.002",
    ],
    correctAnswer: 1,
    explanation: `3.22 > 3.20 > 3.02 > 3.002. Greatest to least: 3.22, 3.2, 3.02, 3.002.`
  },
  {
    id: 15,
    type: "number",
    question: `A book costs $85. What is the cost of 4 books, and how much change from $400?`,
    options: [
      "$50 change",
      "$60 change",
      "$65 change",
      "$70 change",
    ],
    correctAnswer: 1,
    explanation: `4 x $85 = $340. Change = $400 - $340 = $60.`
  },
  {
    id: 16,
    type: "measurement",
    question: `Which is the best estimate for the mass of a Grade 4 textbook?`,
    options: [
      "5 grams",
      "500 grams",
      "5 kilograms",
      "50 kilograms",
    ],
    correctAnswer: 1,
    explanation: `A school textbook typically weighs about 400-600 grams. 500 g is the most reasonable estimate.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A farmer's field is 40 m long and 25 m wide. What is its area?`,
    options: [
      "130 m2",
      "650 m2",
      "1,000 m2",
      "1,250 m2",
    ],
    correctAnswer: 2,
    explanation: `Area = 40 x 25 = 1,000 m2.`
  },
  {
    id: 18,
    type: "measurement",
    question: `Convert 3 hours 45 minutes to minutes.`,
    options: [
      "195 min",
      "215 min",
      "225 min",
      "235 min",
    ],
    correctAnswer: 2,
    explanation: `3 hours = 180 minutes. 180 + 45 = 225 minutes.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A triangle has a base of 10 cm and a height of 6 cm. What is its area?`,
    options: [
      "16 cm2",
      "30 cm2",
      "60 cm2",
      "48 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area = 1/2 x base x height = 1/2 x 10 x 6 = 30 cm2.`
  },
  {
    id: 20,
    type: "measurement",
    question: `What time is 3 hours after 10:45 AM?`,
    options: [
      "1:45 PM",
      "2:00 PM",
      "2:45 PM",
      "1:15 PM",
    ],
    correctAnswer: 0,
    explanation: `10:45 AM + 3 hours = 1:45 PM.`
  },
  {
    id: 21,
    type: "measurement",
    question: `A rope is 7.5 m long. It is cut into pieces of 50 cm each. How many pieces?`,
    options: [
      "10",
      "12",
      "15",
      "20",
    ],
    correctAnswer: 2,
    explanation: `7.5 m = 750 cm. 750 / 50 = 15 pieces.`
  },
  {
    id: 22,
    type: "measurement",
    question: `What is the best unit for measuring the capacity of a swimming pool?`,
    options: [
      "Millilitres",
      "Litres",
      "Grams",
      "Kilometres",
    ],
    correctAnswer: 1,
    explanation: `Litres are used to measure liquid capacity of large containers.`
  },
  {
    id: 23,
    type: "measurement",
    question: `A temperature at 6 AM was 22 degrees C. By noon it rose 8 degrees. What was the noon temperature?`,
    options: [
      "14 degrees C",
      "28 degrees C",
      "30 degrees C",
      "32 degrees C",
    ],
    correctAnswer: 2,
    explanation: `22 + 8 = 30 degrees C.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The perimeter of a square is 36 cm. What is the length of one side?`,
    options: [
      "6 cm",
      "9 cm",
      "12 cm",
      "18 cm",
    ],
    correctAnswer: 1,
    explanation: `One side = 36 / 4 = 9 cm.`
  },
  {
    id: 25,
    type: "measurement",
    question: `How many days are in 6 weeks?`,
    options: [
      "30",
      "36",
      "42",
      "48",
    ],
    correctAnswer: 2,
    explanation: `1 week = 7 days. 6 x 7 = 42 days.`
  },
  {
    id: 26,
    type: "geometry",
    question: `What is the name of a quadrilateral with all sides equal and all angles equal?`,
    options: [
      "Rectangle",
      "Rhombus",
      "Square",
      "Trapezoid",
    ],
    correctAnswer: 2,
    explanation: `A square has all 4 sides equal AND all 4 angles equal to 90 degrees.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What type of angle is greater than 90 degrees but less than 180 degrees?`,
    options: [
      "Acute",
      "Right",
      "Obtuse",
      "Reflex",
    ],
    correctAnswer: 2,
    explanation: `An obtuse angle is between 90 and 180 degrees.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Which transformation flips a shape over a line?`,
    options: [
      "Translation",
      "Rotation",
      "Reflection",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `A reflection flips a shape over a mirror line.`
  },
  {
    id: 29,
    type: "geometry",
    question: `A rectangle has a length of 12 cm and a width of 7 cm. What is its area?`,
    options: [
      "38 cm2",
      "74 cm2",
      "84 cm2",
      "96 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = 12 x 7 = 84 cm2.`
  },
  {
    id: 30,
    type: "geometry",
    question: `How many vertices does a triangular pyramid have?`,
    options: [
      "3",
      "4",
      "6",
      "8",
    ],
    correctAnswer: 1,
    explanation: `A triangular pyramid has 3 base vertices plus 1 apex = 4 vertices.`
  },
  {
    id: 31,
    type: "geometry",
    question: `What is the sum of interior angles of a triangle?`,
    options: [
      "90 degrees",
      "180 degrees",
      "270 degrees",
      "360 degrees",
    ],
    correctAnswer: 1,
    explanation: `The interior angles of any triangle always add up to 180 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A square has an area of 64 cm2. What is the length of one side?`,
    options: [
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm",
    ],
    correctAnswer: 2,
    explanation: `Side = square root of 64 = 8 cm. Check: 8 x 8 = 64.`
  },
  {
    id: 33,
    type: "data",
    question: `Scores in a quiz: 8, 6, 9, 7, 10, 6, 8, 6. What is the mode?`,
    options: [
      "6",
      "7",
      "8",
      "10",
    ],
    correctAnswer: 0,
    explanation: `6 appears 3 times, which is the most frequent. Mode = 6.`
  },
  {
    id: 34,
    type: "data",
    question: `What is the range of: 15, 22, 9, 31, 18?`,
    options: [
      "13",
      "22",
      "31",
      "9",
    ],
    correctAnswer: 1,
    explanation: `Range = highest - lowest = 31 - 9 = 22.`
  },
  {
    id: 35,
    type: "data",
    question: `A pictograph: Monday = 4 suns, Tuesday = 6 suns, Wednesday = 3 suns. Each sun = 5 students. How many students on Tuesday?`,
    options: [
      "6",
      "25",
      "30",
      "35",
    ],
    correctAnswer: 2,
    explanation: `Tuesday = 6 x 5 = 30 students.`
  },
  {
    id: 36,
    type: "data",
    question: `What is the mean of: 12, 18, 24, 6?`,
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 1,
    explanation: `Mean = (12 + 18 + 24 + 6) / 4 = 60 / 4 = 15.`
  },
  {
    id: 37,
    type: "data",
    question: `In a pie chart, a section represents 1/4 of the data. What angle does it make at the centre?`,
    options: [
      "45 degrees",
      "60 degrees",
      "90 degrees",
      "120 degrees",
    ],
    correctAnswer: 2,
    explanation: `1/4 of 360 degrees = 90 degrees.`
  },
  {
    id: 38,
    type: "data",
    question: `In a survey: 15 chose cricket, 10 chose football, 5 chose swimming. What fraction chose football?`,
    options: [
      "1/3",
      "1/2",
      "1/4",
      "2/5",
    ],
    correctAnswer: 0,
    explanation: `Total = 30. Football = 10. Fraction = 10/30 = 1/3.`
  },
  {
    id: 39,
    type: "data",
    question: `Data set: 5, 8, 12, 7, 10, 9. What is the median?`,
    options: [
      "7.5",
      "8",
      "8.5",
      "9",
    ],
    correctAnswer: 2,
    explanation: `Arranged: 5, 7, 8, 9, 10, 12. Median = (8 + 9) / 2 = 8.5.`
  },
  {
    id: 40,
    type: "data",
    question: `The mean of 4 numbers is 10. Three of the numbers are 8, 12, and 9. What is the fourth number?`,
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 1,
    explanation: `Total = 4 x 10 = 40. Sum of 3 known = 8 + 12 + 9 = 29. Fourth = 40 - 29 = 11.`
  }
]

export default function NumeracyMixed3Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed3Questions : numeracyMixed3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 3</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 3 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 3</h1>
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
