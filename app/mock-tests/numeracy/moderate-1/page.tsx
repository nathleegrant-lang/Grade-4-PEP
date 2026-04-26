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

const numeracyQuestions: Question[] = [
  // Number Operations (1-15)
  {
    id: 1,
    type: "number",
    question: "A shop sold 248 mangoes on Monday and 376 on Tuesday. How many mangoes were sold altogether?",
    options: ["614", "624", "634", "584"],
    correctAnswer: 1,
    explanation: "248 + 376 = 624. Add the ones, tens, and hundreds carefully to find the total sold over both days.",
  },
  {
    id: 2,
    type: "number",
    question: "A farmer harvested 905 yams and sold 468. How many yams were left?",
    options: ["437", "447", "457", "467"],
    correctAnswer: 0,
    explanation: "905 - 468 = 437. Regroup when subtracting because there are not enough ones or tens in 905.",
  },
  {
    id: 3,
    type: "number",
    question: "There are 36 students in a class. They are arranged in 4 equal rows. How many students are in each row?",
    options: ["8", "9", "10", "12"],
    correctAnswer: 1,
    explanation: "36 ÷ 4 = 9. Dividing the class into 4 equal rows gives 9 students in each row.",
  },
  {
    id: 4,
    type: "number",
    question: "What is the value of 7 in 47,326?",
    options: ["7", "70", "700", "7,000"],
    correctAnswer: 3,
    explanation: "In 47,326, the 7 is in the thousands place, so its value is 7,000.",
  },
  {
    id: 5,
    type: "number",
    question: "Which fraction is greater than 1/2?",
    options: ["2/5", "3/8", "5/8", "1/4"],
    correctAnswer: 2,
    explanation: "5/8 is greater than 1/2 because 1/2 = 4/8, and 5/8 is one eighth more.",
  },
  {
    id: 6,
    type: "number",
    question: "What is 3/4 + 1/8?",
    options: ["4/12", "7/8", "1", "5/8"],
    correctAnswer: 1,
    explanation: "3/4 = 6/8. Then 6/8 + 1/8 = 7/8.",
  },
  {
    id: 7,
    type: "number",
    question: "A bus has 52 seats. If 37 are occupied, how many seats are empty?",
    options: ["15", "16", "17", "25"],
    correctAnswer: 0,
    explanation: "52 - 37 = 15. Subtract the occupied seats from the total seats to find the empty seats.",
  },
  {
    id: 8,
    type: "number",
    question: "Round 6,451 to the nearest hundred.",
    options: ["6,400", "6,500", "6,450", "6,000"],
    correctAnswer: 1,
    explanation: "6,451 rounds to 6,500 because 51 is 50 or more, so you round the hundreds up.",
  },
  {
    id: 9,
    type: "number",
    question: "Which decimal is the greatest? 0.45, 0.54, 0.405, 0.5",
    options: ["0.45", "0.54", "0.405", "0.5"],
    correctAnswer: 1,
    explanation: "0.54 is the greatest. Compare the tenths first: 0.54 has 5 tenths and 4 hundredths, which is more than the others.",
  },
  {
    id: 10,
    type: "number",
    question: "A bakery packed 8 boxes with 24 buns in each box. How many buns were packed?",
    options: ["172", "182", "192", "212"],
    correctAnswer: 2,
    explanation: "8 × 24 = 192. Multiply 24 by 8 to get the total number of buns.",
  },
  {
    id: 11,
    type: "number",
    question: "Which number is a factor of 48?",
    options: ["5", "7", "8", "9"],
    correctAnswer: 2,
    explanation: "8 is a factor of 48 because 48 ÷ 8 = 6 with no remainder.",
  },
  {
    id: 12,
    type: "number",
    question: "A rope is 9.5 m long. Another rope is 4.25 m long. What is the total length?",
    options: ["13.75 m", "13.5 m", "14.75 m", "12.75 m"],
    correctAnswer: 0,
    explanation: "9.5 + 4.25 = 13.75. Write 9.5 as 9.50 to line up the decimal places.",
  },
  {
    id: 13,
    type: "number",
    question: "The pattern is 18, 27, 36, 45, ___. What is the next number?",
    options: ["49", "52", "54", "56"],
    correctAnswer: 2,
    explanation: "The pattern increases by 9 each time. 45 + 9 = 54.",
  },
  {
    id: 14,
    type: "number",
    question: "What is 25% of 40?",
    options: ["5", "8", "10", "15"],
    correctAnswer: 2,
    explanation: "25% means one quarter. One quarter of 40 is 10.",
  },
  {
    id: 15,
    type: "number",
    question: "A class collected 3,250 bottle caps. They packed them into 5 equal bags. How many bottle caps went into each bag?",
    options: ["550", "600", "650", "700"],
    correctAnswer: 2,
    explanation: "3,250 ÷ 5 = 650. Dividing equally among 5 bags gives 650 bottle caps per bag.",
  },

  // Measurement (16-25)
  {
    id: 16,
    type: "measurement",
    question: "A ribbon is 2 m 35 cm long. What is its length in centimeters?",
    options: ["205 cm", "225 cm", "235 cm", "325 cm"],
    correctAnswer: 2,
    explanation: "2 m = 200 cm. Then 200 cm + 35 cm = 235 cm.",
  },
  {
    id: 17,
    type: "measurement",
    question: "A football match starts at 3:20 PM and ends at 5:05 PM. How long does it last?",
    options: ["1 hour 35 minutes", "1 hour 45 minutes", "1 hour 55 minutes", "2 hours 5 minutes"],
    correctAnswer: 1,
    explanation: "From 3:20 to 4:20 is 1 hour, and from 4:20 to 5:05 is 45 minutes. Total = 1 hour 45 minutes.",
  },
  {
    id: 18,
    type: "measurement",
    question: "A bucket holds 3.5 L of water. How many milliliters is this?",
    options: ["35 mL", "350 mL", "3,500 mL", "35,000 mL"],
    correctAnswer: 2,
    explanation: "1 L = 1,000 mL, so 3.5 L = 3,500 mL.",
  },
  {
    id: 19,
    type: "measurement",
    question: "The perimeter of a square is 36 cm. What is the length of one side?",
    options: ["8 cm", "9 cm", "10 cm", "12 cm"],
    correctAnswer: 1,
    explanation: "A square has 4 equal sides. 36 ÷ 4 = 9 cm for each side.",
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the area of a rectangle that is 9 cm long and 4 cm wide?",
    options: ["13 cm²", "18 cm²", "26 cm²", "36 cm²"],
    correctAnswer: 3,
    explanation: "Area = length × width = 9 × 4 = 36 cm².",
  },
  {
    id: 21,
    type: "measurement",
    question: "A box of flour weighs 1.75 kg. Another box weighs 850 g. What is the total mass in grams?",
    options: ["1,600 g", "2,500 g", "2,600 g", "2,700 g"],
    correctAnswer: 2,
    explanation: "1.75 kg = 1,750 g. Then 1,750 g + 850 g = 2,600 g.",
  },
  {
    id: 22,
    type: "measurement",
    question: "A water tank contains 7,250 mL. How many liters and milliliters is this?",
    options: ["7 L 25 mL", "7 L 250 mL", "72 L 50 mL", "725 L 0 mL"],
    correctAnswer: 1,
    explanation: "7,250 mL = 7,000 mL + 250 mL, which is 7 L 250 mL.",
  },
  {
    id: 23,
    type: "measurement",
    question: "If the temperature was 31°C at noon and dropped by 7°C at night, what was the night temperature?",
    options: ["22°C", "23°C", "24°C", "25°C"],
    correctAnswer: 2,
    explanation: "31°C - 7°C = 24°C.",
  },
  {
    id: 24,
    type: "measurement",
    question: "Which unit would be best to measure the amount of juice in a glass?",
    options: ["Kilometers", "Grams", "Milliliters", "Centimeters"],
    correctAnswer: 2,
    explanation: "Milliliters are used to measure small amounts of liquid, such as juice in a glass.",
  },
  {
    id: 25,
    type: "measurement",
    question: "A baker has 5 kg of flour. She uses 1.5 kg. How much flour remains?",
    options: ["2.5 kg", "3 kg", "3.5 kg", "4.5 kg"],
    correctAnswer: 2,
    explanation: "5.0 kg - 1.5 kg = 3.5 kg.",
  },

  // Geometry (26-32)
  {
    id: 26,
    type: "geometry",
    question: "Which shape has exactly one pair of parallel sides?",
    options: ["Rectangle", "Square", "Trapezoid", "Triangle"],
    correctAnswer: 2,
    explanation: "A trapezoid has exactly one pair of parallel sides.",
  },
  {
    id: 27,
    type: "geometry",
    question: "What is the name of an angle that is greater than 90° but less than 180°?",
    options: ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],
    correctAnswer: 2,
    explanation: "An obtuse angle is larger than a right angle (90°) but smaller than a straight angle (180°).",
  },
  {
    id: 28,
    type: "geometry",
    question: "How many lines of symmetry does a square have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "A square has 4 lines of symmetry: vertical, horizontal, and two diagonals.",
  },
  {
    id: 29,
    type: "geometry",
    question: "A cube has 6 faces. How many vertices does it have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    explanation: "A cube has 8 vertices, or corners.",
  },
  {
    id: 30,
    type: "geometry",
    question: "Which triangle has two equal sides?",
    options: ["Equilateral", "Scalene", "Isosceles", "Right-angled only"],
    correctAnswer: 2,
    explanation: "An isosceles triangle has two equal sides.",
  },
  {
    id: 31,
    type: "geometry",
    question: "Which shape could you describe as having curved sides and no corners?",
    options: ["Circle", "Oval", "Both A and B", "Rectangle"],
    correctAnswer: 2,
    explanation: "Both circles and ovals have curved sides and no corners.",
  },
  {
    id: 32,
    type: "geometry",
    question: "If a rectangle is turned upside down, what happens to its shape?",
    options: ["It becomes a square", "It stays a rectangle", "It becomes a parallelogram", "It becomes smaller"],
    correctAnswer: 1,
    explanation: "Turning a rectangle does not change its properties. It is still a rectangle.",
  },

  // Data & Statistics (33-40)
  {
    id: 33,
    type: "data",
    question: "A chart shows books read by 4 students: 6, 8, 5, and 9. How many books were read altogether?",
    options: ["26", "27", "28", "29"],
    correctAnswer: 2,
    explanation: "6 + 8 + 5 + 9 = 28 books.",
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of: 12, 15, 12, 18, 20, 12, 15?",
    options: ["12", "15", "18", "20"],
    correctAnswer: 0,
    explanation: "The mode is the number that appears most often. 12 appears 3 times.",
  },
  {
    id: 35,
    type: "data",
    question: "Find the range of: 22, 18, 30, 15, 27",
    options: ["12", "15", "18", "45"],
    correctAnswer: 1,
    explanation: "Range = highest - lowest = 30 - 15 = 15.",
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of: 4, 7, 9, 12, 16, 18, 20?",
    options: ["9", "12", "16", "18"],
    correctAnswer: 1,
    explanation: "The middle number in the ordered list is 12, so the median is 12.",
  },
  {
    id: 37,
    type: "data",
    question: "In a pictograph, 1 star represents 4 students. If there are 5 stars, how many students are shown?",
    options: ["9", "16", "20", "25"],
    correctAnswer: 2,
    explanation: "5 stars × 4 students each = 20 students.",
  },
  {
    id: 38,
    type: "data",
    question: "A bar graph shows 14 students chose football and 9 chose swimming. How many more students chose football?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    explanation: "14 - 9 = 5 more students chose football.",
  },
  {
    id: 39,
    type: "data",
    question: "What is the mean of: 6, 8, 10, 12?",
    options: ["8", "9", "10", "11"],
    correctAnswer: 1,
    explanation: "Mean = (6 + 8 + 10 + 12) ÷ 4 = 36 ÷ 4 = 9.",
  },
  {
    id: 40,
    type: "data",
    question: "A class has 32 students. One quarter of them are absent. How many students are present?",
    options: ["8", "16", "24", "28"],
    correctAnswer: 2,
    explanation: "One quarter of 32 is 8 absent. 32 - 8 = 24 students present.",
  },
]

type SectionType = Question["type"]

const sectionMeta: Record<SectionType, { title: string; description: string }> = {
  number: {
    title: "Number Operations",
    description: "Calculation, place value, fractions, decimals, patterns, and problem solving.",
  },
  measurement: {
    title: "Measurement",
    description: "Time, length, mass, capacity, area, perimeter, and temperature.",
  },
  geometry: {
    title: "Geometry",
    description: "Properties of shapes, angles, symmetry, solids, and spatial reasoning.",
  },
  data: {
    title: "Data & Statistics",
    description: "Reading graphs, mean, median, mode, range, and interpreting data.",
  },
}

export default function NumeracyModerate1Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyQuestions : numeracyQuestions.slice(0, FREE_QUESTION_LIMIT)
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

  const getScorePercentage = () => {
    return Math.round((calculateScore() / totalQuestions) * 100)
  }

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionSummary = (section: SectionType) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === section)
    const total = sectionQuestions.length
    const correct = sectionQuestions.filter((q) => {
      const originalIndex = availableQuestions.findIndex((item) => item.id === q.id)
      return answers[originalIndex] === q.correctAnswer
    }).length
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100)

    let note = "Needs more practice"
    if (percent >= 85) note = "Excellent"
    else if (percent >= 70) note = "Good understanding"
    else if (percent >= 50) note = "Developing"

    return { total, correct, percent, note }
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
          <Link href="/mock-tests" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Moderate 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Assessment</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                    <p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                </div>

                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Free Preview Mode</p>
                        <p className="text-sm text-amber-700">
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question test with detailed analytics.
                        </p>
                      </div>
                    </div>
                    <Link href="/pricing" className="block mt-3">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Moderate-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Closer to standard Grade 4 PEP numeracy level</li>
                    <li>- Multi-step number and measurement problems</li>
                    <li>- Geometry and data reasoning questions</li>
                    <li>- Stronger but still grade-appropriate distractors</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Test Sections:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Number Operations (Questions 1-15)</li>
                    <li>- Measurement (Questions 16-25)</li>
                    <li>- Geometry (Questions 26-32)</li>
                    <li>- Data & Statistics (Questions 33-40)</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Some items require more than one step of thinking.</li>
                    <li>- You may use paper for rough work.</li>
                    <li>- Select the best answer for each question.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Start Test
                </Button>

                <Link href="/mock-tests">
                  <Button variant="outline" className="w-full">
                    Back to Mock Tests
                  </Button>
                </Link>
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Moderate 1</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className={`text-2xl font-bold ${color}`}>{grade}</p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {(["number", "measurement", "geometry", "data"] as SectionType[]).map((section) => {
                    const summary = getSectionSummary(section)
                    const meta = sectionMeta[section]
                    return (
                      <div key={section} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <h4 className="font-semibold text-blue-800">{meta.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{meta.description}</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-slate-700 font-medium">{summary.correct}/{summary.total} correct</span>
                          <span className="text-blue-700 font-bold">{summary.percent}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{summary.note}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    Review each question to see the student&apos;s answer, the correct answer, and a clear explanation.
                    You can also print or save the full report as a PDF with the Shazonique&apos;s Inspiration logo.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Review Answers & Report
                  </Button>
                  <Button onClick={restartTest} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Test Again
                  </Button>
                  <Link href="/mock-tests">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Mock Tests
                    </Button>
                  </Link>
                </div>
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <style jsx global>{`
          @media print {
            header,
            footer,
            .no-print {
              display: none !important;
            }

            body {
              background: #ffffff !important;
            }

            .report-sheet {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm">
                    <Image
                      src="/images/shazoniques-inspiration-logo.png"
                      alt="Shazonique's Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Moderate 1 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Student: <span className="font-medium">{user?.childName ?? "Student"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-blue-700">{score}/{totalQuestions}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-blue-700">{percentage}%</p>
                    <p className="text-xs text-slate-600">Percent</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 min-w-[90px]">
                    <p className={`text-lg font-bold ${color}`}>{grade}</p>
                    <p className="text-xs text-slate-600">Performance</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result and a full question-by-question review,
                  including the student&apos;s answer, the correct answer, and an explanation for each item.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {(["number", "measurement", "geometry", "data"] as SectionType[]).map((section) => {
                  const summary = getSectionSummary(section)
                  const meta = sectionMeta[section]
                  return (
                    <div key={section} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <h4 className="font-semibold text-blue-800">{meta.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{meta.description}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-slate-700 font-medium">{summary.correct}/{summary.total} correct</span>
                        <span className="text-blue-700 font-bold">{summary.percent}%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{summary.note}</p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "p-5 rounded-xl border-2",
                        isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}

                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 mb-2">Question {index + 1}</p>
                          <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-2">
                            {sectionMeta[q.type].title}
                          </p>
                          <p className="text-slate-800 mb-3">{q.question}</p>

                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700">
                              <span className="font-medium">Student&apos;s Answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {answers[index] !== null ? q.options[answers[index]!] : "Not answered"}
                              </span>
                            </p>

                            <p className="text-green-700">
                              <span className="font-medium">Correct Answer:</span> {q.options[q.correctAnswer]}
                            </p>

                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">
                Managed by Shazonique&apos;s Inspiration · A heart&apos;s home of hope
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print max-w-5xl mx-auto">
            <Button onClick={() => window.print()} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Download / Print Report
            </Button>

            <Button onClick={restartTest} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Test Again
            </Button>

            <Link href="/mock-tests" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Mock Tests
              </Button>
            </Link>
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
              <Link href="/mock-tests" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Moderate 1</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
                timeRemaining <= 300 ? "bg-red-500" : "bg-green-600"
              )}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
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
                <span className="text-sm font-medium text-blue-700 uppercase">{sectionMeta[question.type].title}</span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all",
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    <span className="font-medium text-blue-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={cn(
                      "w-8 h-8 rounded text-sm font-medium transition-colors",
                      currentQuestion === index
                        ? "bg-blue-600 text-white"
                        : answers[index] !== null
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-100"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
