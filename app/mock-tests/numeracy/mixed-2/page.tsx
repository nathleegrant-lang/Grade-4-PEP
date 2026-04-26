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
    question: "What is 456 + 278?",
    options: ["724", "734", "634", "744"],
    correctAnswer: 1,
    explanation: "456 + 278 = 734. Add the ones (6+8=14, carry 1), tens (5+7+1=13, carry 1), then hundreds (4+2+1=7)."
  },
  {
    id: 2,
    type: "number",
    question: "What is 803 - 467?",
    options: ["346", "336", "436", "326"],
    correctAnswer: 1,
    explanation: "803 - 467 = 336. Subtract by regrouping: 803 = 7 hundreds + 9 tens + 13 ones."
  },
  {
    id: 3,
    type: "number",
    question: "What is 47 × 6?",
    options: ["272", "282", "292", "262"],
    correctAnswer: 1,
    explanation: "47 × 6 = 282. Multiply: (40 × 6) + (7 × 6) = 240 + 42 = 282."
  },
  {
    id: 4,
    type: "number",
    question: "What is 144 ÷ 12?",
    options: ["14", "11", "12", "13"],
    correctAnswer: 2,
    explanation: "144 ÷ 12 = 12. You can check: 12 × 12 = 144."
  },
  {
    id: 5,
    type: "number",
    question: "Which fraction is equivalent to 1/2?",
    options: ["2/3", "3/6", "2/5", "4/6"],
    correctAnswer: 1,
    explanation: "3/6 = 1/2 because 3 ÷ 3 = 1 and 6 ÷ 3 = 2, giving us 1/2."
  },
  {
    id: 6,
    type: "number",
    question: "What is 1/4 + 2/4?",
    options: ["3/8", "3/4", "1/2", "2/4"],
    correctAnswer: 1,
    explanation: "When adding fractions with the same denominator, add the numerators: 1/4 + 2/4 = 3/4."
  },
  {
    id: 7,
    type: "number",
    question: "Round 3,847 to the nearest hundred.",
    options: ["3,800", "3,900", "3,850", "4,000"],
    correctAnswer: 1,
    explanation: "3,847 rounded to the nearest hundred is 3,900. Since 47 is closer to 100 than to 0, we round up."
  },
  {
    id: 8,
    type: "number",
    question: "What is the place value of 7 in 2,759?",
    options: ["7", "70", "700", "7,000"],
    correctAnswer: 2,
    explanation: "In 2,759, the 7 is in the hundreds place, so its value is 700."
  },
  {
    id: 9,
    type: "number",
    question: "Which number is the smallest? 0.5, 0.25, 0.75, 0.1",
    options: ["0.5", "0.25", "0.75", "0.1"],
    correctAnswer: 3,
    explanation: "0.1 (one tenth) is the smallest. Compare by thinking of them as money: $0.10 is less than $0.25, $0.50, or $0.75."
  },
  {
    id: 10,
    type: "number",
    question: "If Marcus has $50 and spends $23.75, how much does he have left?",
    options: ["$26.25", "$27.25", "$26.75", "$27.75"],
    correctAnswer: 0,
    explanation: "$50.00 - $23.75 = $26.25. Subtract from right to left, regrouping as needed."
  },
  {
    id: 11,
    type: "number",
    question: "What is 3 × 4 × 5?",
    options: ["12", "60", "45", "35"],
    correctAnswer: 1,
    explanation: "3 × 4 × 5 = 12 × 5 = 60. Multiply step by step."
  },
  {
    id: 12,
    type: "number",
    question: "Which is greater: 5/8 or 3/4?",
    options: ["5/8", "3/4", "They are equal", "Cannot compare"],
    correctAnswer: 1,
    explanation: "3/4 = 6/8, and 6/8 > 5/8, so 3/4 is greater."
  },
  {
    id: 13,
    type: "number",
    question: "A baker made 156 patties. She sold them in boxes of 12. How many boxes did she fill?",
    options: ["12", "13", "14", "15"],
    correctAnswer: 1,
    explanation: "156 ÷ 12 = 13 boxes. Check: 13 × 12 = 156."
  },
  {
    id: 14,
    type: "number",
    question: "What is the next number in the pattern: 5, 10, 20, 40, ___?",
    options: ["50", "60", "80", "100"],
    correctAnswer: 2,
    explanation: "Each number is doubled (×2). So 40 × 2 = 80."
  },
  {
    id: 15,
    type: "number",
    question: "Write 0.75 as a fraction in simplest form.",
    options: ["75/100", "7/10", "3/4", "1/4"],
    correctAnswer: 2,
    explanation: "0.75 = 75/100 = 3/4 when simplified (divide both by 25)."
  },
  // Measurement (16-25)
  {
    id: 16,
    type: "measurement",
    question: "How many centimeters are in 3 meters?",
    options: ["30 cm", "300 cm", "3,000 cm", "3 cm"],
    correctAnswer: 1,
    explanation: "1 meter = 100 centimeters, so 3 meters = 3 × 100 = 300 cm."
  },
  {
    id: 17,
    type: "measurement",
    question: "A movie starts at 2:45 PM and ends at 4:30 PM. How long is the movie?",
    options: ["1 hour 15 minutes", "1 hour 45 minutes", "2 hours 15 minutes", "1 hour 30 minutes"],
    correctAnswer: 1,
    explanation: "From 2:45 PM to 4:30 PM: 2:45 to 3:45 is 1 hour, 3:45 to 4:30 is 45 minutes. Total: 1 hour 45 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "How many grams are in 2.5 kilograms?",
    options: ["25 grams", "250 grams", "2,500 grams", "25,000 grams"],
    correctAnswer: 2,
    explanation: "1 kilogram = 1,000 grams, so 2.5 kg = 2.5 × 1,000 = 2,500 grams."
  },
  {
    id: 19,
    type: "measurement",
    question: "A jug holds 1,500 mL of juice. How many liters is this?",
    options: ["0.15 L", "1.5 L", "15 L", "150 L"],
    correctAnswer: 1,
    explanation: "1,000 mL = 1 liter, so 1,500 mL = 1.5 liters."
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the perimeter of a rectangle with length 8 cm and width 5 cm?",
    options: ["13 cm", "26 cm", "40 cm", "36 cm"],
    correctAnswer: 1,
    explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 5) = 2 × 13 = 26 cm."
  },
  {
    id: 21,
    type: "measurement",
    question: "The temperature in the morning was 24°C. By afternoon, it rose by 8 degrees. What was the afternoon temperature?",
    options: ["16°C", "28°C", "32°C", "30°C"],
    correctAnswer: 2,
    explanation: "24°C + 8°C = 32°C."
  },
  {
    id: 22,
    type: "measurement",
    question: "What is the area of a square with sides of 6 cm?",
    options: ["12 cm²", "24 cm²", "36 cm²", "18 cm²"],
    correctAnswer: 2,
    explanation: "Area of a square = side × side = 6 × 6 = 36 cm²."
  },
  {
    id: 23,
    type: "measurement",
    question: "School starts at 8:00 AM and ends at 2:30 PM. How many hours is the school day?",
    options: ["5 hours 30 minutes", "6 hours", "6 hours 30 minutes", "7 hours"],
    correctAnswer: 2,
    explanation: "From 8:00 AM to 2:00 PM is 6 hours. Add 30 more minutes to get to 2:30 PM = 6 hours 30 minutes."
  },
  {
    id: 24,
    type: "measurement",
    question: "Which unit would you use to measure the length of a pencil?",
    options: ["Kilometers", "Meters", "Centimeters", "Milliliters"],
    correctAnswer: 2,
    explanation: "Centimeters are the best unit for measuring small objects like pencils. Kilometers are for very long distances."
  },
  {
    id: 25,
    type: "measurement",
    question: "A bag of sugar weighs 2 kg. How many 500g portions can be made?",
    options: ["2", "4", "5", "10"],
    correctAnswer: 1,
    explanation: "2 kg = 2,000 g. 2,000 ÷ 500 = 4 portions."
  },
  // Geometry (26-32)
  {
    id: 26,
    type: "geometry",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    explanation: "A hexagon has 6 sides. 'Hex' means six."
  },
  {
    id: 27,
    type: "geometry",
    question: "What type of angle is 90 degrees?",
    options: ["Acute", "Right", "Obtuse", "Straight"],
    correctAnswer: 1,
    explanation: "A 90-degree angle is called a right angle. It looks like the corner of a square."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape has 4 equal sides and 4 right angles?",
    options: ["Rectangle", "Rhombus", "Square", "Trapezoid"],
    correctAnswer: 2,
    explanation: "A square has 4 equal sides and 4 right angles (90 degrees each)."
  },
  {
    id: 29,
    type: "geometry",
    question: "How many faces does a cube have?",
    options: ["4", "6", "8", "12"],
    correctAnswer: 1,
    explanation: "A cube has 6 faces (flat surfaces). Each face is a square."
  },
  {
    id: 30,
    type: "geometry",
    question: "What is the name of a triangle with all three sides equal?",
    options: ["Scalene", "Isosceles", "Equilateral", "Right"],
    correctAnswer: 2,
    explanation: "An equilateral triangle has all three sides equal in length. 'Equi' means equal."
  },
  {
    id: 31,
    type: "geometry",
    question: "Two lines that never meet are called:",
    options: ["Perpendicular", "Intersecting", "Parallel", "Curved"],
    correctAnswer: 2,
    explanation: "Parallel lines run in the same direction and never meet, like railroad tracks."
  },
  {
    id: 32,
    type: "geometry",
    question: "A circle has how many corners?",
    options: ["0", "1", "2", "Infinite"],
    correctAnswer: 0,
    explanation: "A circle has no corners (vertices). It is a perfectly round shape with no straight edges."
  },
  // Data & Statistics (33-40)
  {
    id: 33,
    type: "data",
    question: "In a class survey, 12 students like football, 8 like cricket, 5 like netball, and 5 like track. How many students were surveyed?",
    options: ["25", "28", "30", "35"],
    correctAnswer: 2,
    explanation: "Total = 12 + 8 + 5 + 5 = 30 students."
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of these numbers: 4, 7, 2, 7, 9, 7, 3?",
    options: ["2", "4", "7", "9"],
    correctAnswer: 2,
    explanation: "The mode is the number that appears most often. 7 appears 3 times, more than any other number."
  },
  {
    id: 35,
    type: "data",
    question: "Find the range of: 15, 23, 8, 31, 12",
    options: ["15", "23", "31", "8"],
    correctAnswer: 1,
    explanation: "Range = highest - lowest = 31 - 8 = 23."
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of: 3, 7, 9, 11, 15?",
    options: ["7", "9", "11", "8"],
    correctAnswer: 1,
    explanation: "The median is the middle number when arranged in order. In 3, 7, 9, 11, 15, the middle number is 9."
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph shows 🍎🍎🍎 where each apple = 5 students. How many students does this represent?",
    options: ["3", "8", "15", "5"],
    correctAnswer: 2,
    explanation: "3 apples × 5 students each = 15 students."
  },
  {
    id: 38,
    type: "data",
    question: "In a bar graph, the bar for 'Mango' reaches 20 and 'Orange' reaches 15. How many more mangoes than oranges?",
    options: ["35", "5", "20", "15"],
    correctAnswer: 1,
    explanation: "Difference = 20 - 15 = 5 more mangoes than oranges."
  },
  {
    id: 39,
    type: "data",
    question: "Calculate the mean (average) of: 10, 15, 20, 15",
    options: ["12", "15", "17", "20"],
    correctAnswer: 1,
    explanation: "Mean = (10 + 15 + 20 + 15) ÷ 4 = 60 ÷ 4 = 15."
  },
  {
    id: 40,
    type: "data",
    question: "If 1/4 of students in a class of 28 are absent, how many students are present?",
    options: ["7", "14", "21", "24"],
    correctAnswer: 2,
    explanation: "Absent = 1/4 × 28 = 7 students. Present = 28 - 7 = 21 students."
  }
]

export default function NumeracyMixed2Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  // Free users only get preview questions
  const availableQuestions = isPremium ? numeracyQuestions : numeracyQuestions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  // Initialize answers array based on available questions
  useEffect(() => {
    if (answers.length !== totalQuestions) {
      setAnswers(new Array(totalQuestions).fill(null))
    }
  }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
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

  const getSectionLabel = (type: Question["type"]) => {
    switch (type) {
      case "number":
        return "Number Operations"
      case "measurement":
        return "Measurement"
      case "geometry":
        return "Geometry"
      case "data":
        return "Data & Statistics"
      default:
        return "Section"
    }
  }

  const getSectionComment = (percentage: number) => {
    if (percentage >= 85) return "Excellent understanding of this section."
    if (percentage >= 70) return "Good work in this section."
    if (percentage >= 50) return "Fair progress. More practice will help."
    return "Needs more practice in this section."
  }

  const sectionOrder: Question["type"][] = ["number", "measurement", "geometry", "data"]

  const getSectionSummary = (type: Question["type"]) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === type)
    const correct = sectionQuestions.reduce((count, q) => {
      const index = availableQuestions.findIndex((item) => item.id === q.id)
      return count + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)

    const total = sectionQuestions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    return {
      type,
      label: getSectionLabel(type),
      correct,
      total,
      percentage,
      comment: getSectionComment(percentage),
    }
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
  const answeredCount = answers.filter(a => a !== null).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Numeracy Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto">
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 2</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Mixed Practice</p>
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
                    <li>- You may use paper for rough work.</li>
                    <li>- Select the best answer for each question.</li>
                    <li>- You can navigate between questions.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setTestStarted(true)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  Start Test
                </Button>

                <Link href="/mock-tests/numeracy">
                  <Button variant="outline" className="w-full">
                    Back to Numeracy Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sectionSummaries = sectionOrder.map(getSectionSummary)

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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 2</p>
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

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Section Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionSummaries.map((section) => (
                      <div key={section.type} className="rounded-lg border border-blue-100 bg-white p-4">
                        <p className="font-semibold text-slate-800">{section.label}</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">
                          {section.correct}/{section.total}
                        </p>
                        <p className="text-sm text-slate-600">{section.percentage}% correct</p>
                        <p className="text-sm text-slate-500 mt-2">{section.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This mixed-level numeracy report includes section summaries and a full question-by-question review with explanations.
                    You can then print or save the full report as a PDF with the Shazonique's Inspiration logo.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowReview(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Review Answers & Report
                  </Button>
                  <Button
                    onClick={restartTest}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Test Again
                  </Button>
                  <Link href="/mock-tests/numeracy">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Numeracy Mock Tests
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sectionSummaries = sectionOrder.map(getSectionSummary)

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
                    <p className="text-sm font-semibold text-slate-500">
                      Managed by Shazonique&apos;s Inspiration
                    </p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">
                      Grade 4 PEP Numeracy Mixed 2 Report
                    </CardTitle>
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
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Section Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionSummaries.map((section) => (
                    <div key={section.type} className="rounded-lg border border-blue-100 bg-white p-4">
                      <p className="font-semibold text-slate-800">{section.label}</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {section.correct}/{section.total}
                      </p>
                      <p className="text-sm text-slate-600">{section.percentage}% correct</p>
                      <p className="text-sm text-slate-500 mt-2">{section.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student's overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {getSectionLabel(q.type)}
                            </span>
                          </div>

                          <p className="text-slate-800 mb-3">{q.question}</p>

                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700">
                              <span className="font-medium">Student&apos;s Answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {answers[index] !== null ? q.options[answers[index]!] : "Not answered"}
                              </span>
                            </p>

                            <p className="text-green-700">
                              <span className="font-medium">Correct Answer:</span>{" "}
                              {q.options[q.correctAnswer]}
                            </p>

                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span>{" "}
                              {q.explanation}
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

            <Link href="/mock-tests/numeracy" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Numeracy Mock Tests
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
              <Link 
                href="/mock-tests/numeracy" 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit Test"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Mixed 2</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
              timeRemaining <= 300 ? "bg-red-500" : "bg-green-600"
            )}>
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
                <span className="text-sm font-medium text-blue-700 uppercase">
                  {question.type === "number" ? "Number Operations" : 
                   question.type === "measurement" ? "Measurement" :
                   question.type === "geometry" ? "Geometry" : "Data & Statistics"}
                </span>
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
                    <span className="font-medium text-blue-700 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
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
