\"use client\"

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
    question: "A shop sold 248 pencils on Monday, 179 on Tuesday, and 236 on Wednesday. How many pencils were sold altogether?",
    options: ["653", "663", "673", "683"],
    correctAnswer: 1,
    explanation: "Add all three days: 248 + 179 = 427, and 427 + 236 = 663."
  },
  {
    id: 2,
    type: "number",
    question: "What number must be added to 3,468 to make 5,000?",
    options: ["1,422", "1,532", "1,632", "1,542"],
    correctAnswer: 1,
    explanation: "Find the difference: 5,000 - 3,468 = 1,532."
  },
  {
    id: 3,
    type: "number",
    question: "A farmer packs 36 oranges into each box. How many oranges are in 14 boxes?",
    options: ["484", "494", "504", "514"],
    correctAnswer: 2,
    explanation: "36 × 14 = (36 × 10) + (36 × 4) = 360 + 144 = 504."
  },
  {
    id: 4,
    type: "number",
    question: "A factory makes 1,248 juice boxes equally into 16 cartons. How many juice boxes are in each carton?",
    options: ["72", "76", "78", "84"],
    correctAnswer: 2,
    explanation: "1,248 ÷ 16 = 78. Check: 78 × 16 = 1,248."
  },
  {
    id: 5,
    type: "number",
    question: "Which fraction is equivalent to 3/5?",
    options: ["6/8", "9/15", "12/25", "15/20"],
    correctAnswer: 1,
    explanation: "Multiply numerator and denominator by 3: 3/5 = 9/15."
  },
  {
    id: 6,
    type: "number",
    question: "What is 2/3 + 1/6?",
    options: ["3/9", "3/6", "5/6", "4/6"],
    correctAnswer: 2,
    explanation: "Change 2/3 to 4/6, then add: 4/6 + 1/6 = 5/6."
  },
  {
    id: 7,
    type: "number",
    question: "Round 68,749 to the nearest thousand.",
    options: ["68,000", "69,000", "68,700", "70,000"],
    correctAnswer: 1,
    explanation: "Look at the hundreds: 749 is 500 or more, so 68,749 rounds up to 69,000."
  },
  {
    id: 8,
    type: "number",
    question: "What is the value of the digit 6 in 4.683?",
    options: ["6", "0.6", "0.06", "0.006"],
    correctAnswer: 1,
    explanation: "The 6 is in the tenths place, so its value is 0.6."
  },
  {
    id: 9,
    type: "number",
    question: "Which decimal is greatest?",
    options: ["0.709", "0.79", "0.7090", "0.707"],
    correctAnswer: 1,
    explanation: "0.79 is the same as 0.790, which is greater than 0.709 and 0.707."
  },
  {
    id: 10,
    type: "number",
    question: "A family budgeted $125.50 for groceries and spent $89.75. How much money remained?",
    options: ["$35.65", "$35.75", "$36.25", "$36.75"],
    correctAnswer: 1,
    explanation: "$125.50 - $89.75 = $35.75."
  },
  {
    id: 11,
    type: "number",
    question: "A school has 8 classes. Each class has 27 students. If 16 new students join equally among the classes, how many students will there be in total?",
    options: ["216", "222", "232", "244"],
    correctAnswer: 2,
    explanation: "Current students: 8 × 27 = 216. Add 16 new students: 216 + 16 = 232."
  },
  {
    id: 12,
    type: "number",
    question: "Which is greater: 7/10 or 13/20?",
    options: ["7/10", "13/20", "They are equal", "Cannot tell"],
    correctAnswer: 0,
    explanation: "Convert 7/10 to twentieths: 7/10 = 14/20. Since 14/20 > 13/20, 7/10 is greater."
  },
  {
    id: 13,
    type: "number",
    question: "There are 480 seats in a hall arranged in 24 equal rows. How many seats are in each row?",
    options: ["18", "20", "22", "24"],
    correctAnswer: 1,
    explanation: "480 ÷ 24 = 20. So there are 20 seats in each row."
  },
  {
    id: 14,
    type: "number",
    question: "What is the next number in the pattern: 3, 6, 12, 24, 48, ___?",
    options: ["56", "72", "84", "96"],
    correctAnswer: 3,
    explanation: "Each number is doubled. 48 × 2 = 96."
  },
  {
    id: 15,
    type: "number",
    question: "Write 0.625 as a fraction in simplest form.",
    options: ["625/1000", "5/8", "6/25", "1/8"],
    correctAnswer: 1,
    explanation: "0.625 = 625/1000. Divide numerator and denominator by 125 to get 5/8."
  },

  // Measurement (16-25)
  {
    id: 16,
    type: "measurement",
    question: "A road race is 4.5 km long. How many meters is this?",
    options: ["450 m", "4,050 m", "4,500 m", "45,000 m"],
    correctAnswer: 2,
    explanation: "1 km = 1,000 m, so 4.5 km = 4.5 × 1,000 = 4,500 m."
  },
  {
    id: 17,
    type: "measurement",
    question: "A concert began at 6:35 PM and ended at 9:20 PM. How long did it last?",
    options: ["2 hours 35 minutes", "2 hours 45 minutes", "2 hours 55 minutes", "3 hours 5 minutes"],
    correctAnswer: 1,
    explanation: "From 6:35 to 8:35 is 2 hours. From 8:35 to 9:20 is 45 minutes. Total = 2 hours 45 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "How many grams are there in 3.75 kilograms?",
    options: ["375 g", "3,075 g", "3,750 g", "37,500 g"],
    correctAnswer: 2,
    explanation: "1 kg = 1,000 g, so 3.75 kg = 3,750 g."
  },
  {
    id: 19,
    type: "measurement",
    question: "A tank contains 2.8 liters of water. How many milliliters is this?",
    options: ["28 mL", "280 mL", "2,080 mL", "2,800 mL"],
    correctAnswer: 3,
    explanation: "1 liter = 1,000 mL, so 2.8 L = 2,800 mL."
  },
  {
    id: 20,
    type: "measurement",
    question: "What is the perimeter of a rectangle with length 12 cm and width 9 cm?",
    options: ["21 cm", "42 cm", "108 cm", "36 cm"],
    correctAnswer: 1,
    explanation: "Perimeter = 2 × (12 + 9) = 2 × 21 = 42 cm."
  },
  {
    id: 21,
    type: "measurement",
    question: "The temperature at sunrise was 22°C. By midday it rose by 11°C, then fell by 4°C in the evening. What was the evening temperature?",
    options: ["29°C", "30°C", "31°C", "33°C"],
    correctAnswer: 0,
    explanation: "22 + 11 = 33, then 33 - 4 = 29°C."
  },
  {
    id: 22,
    type: "measurement",
    question: "A rectangular garden is 15 m long and 8 m wide. What is its area?",
    options: ["23 m²", "46 m²", "120 m²", "130 m²"],
    correctAnswer: 2,
    explanation: "Area = length × width = 15 × 8 = 120 m²."
  },
  {
    id: 23,
    type: "measurement",
    question: "School begins at 7:50 AM and finishes at 2:20 PM. How long is the school day?",
    options: ["6 hours 20 minutes", "6 hours 30 minutes", "6 hours 40 minutes", "7 hours 20 minutes"],
    correctAnswer: 1,
    explanation: "From 7:50 to 1:50 is 6 hours. From 1:50 to 2:20 is 30 minutes. Total = 6 hours 30 minutes."
  },
  {
    id: 24,
    type: "measurement",
    question: "Which unit is best for measuring the mass of a school bag?",
    options: ["milliliters", "centimeters", "kilograms", "kilometers"],
    correctAnswer: 2,
    explanation: "Kilograms are used to measure mass/weight of items like school bags."
  },
  {
    id: 25,
    type: "measurement",
    question: "A 3 kg bag of flour is packed equally into 12 smaller bags. What is the mass of each smaller bag in grams?",
    options: ["150 g", "200 g", "250 g", "300 g"],
    correctAnswer: 2,
    explanation: "3 kg = 3,000 g. Then 3,000 ÷ 12 = 250 g."
  },

  // Geometry (26-32)
  {
    id: 26,
    type: "geometry",
    question: "How many sides and vertices does a pentagon have?",
    options: ["5 sides and 4 vertices", "5 sides and 5 vertices", "6 sides and 5 vertices", "6 sides and 6 vertices"],
    correctAnswer: 1,
    explanation: "A pentagon has 5 sides and 5 vertices."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which angle is greater than 90° but less than 180°?",
    options: ["acute angle", "right angle", "obtuse angle", "straight angle"],
    correctAnswer: 2,
    explanation: "An obtuse angle is more than 90° and less than 180°."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape always has exactly one pair of parallel sides?",
    options: ["square", "rectangle", "trapezoid", "rhombus"],
    correctAnswer: 2,
    explanation: "A trapezoid has exactly one pair of parallel sides."
  },
  {
    id: 29,
    type: "geometry",
    question: "How many faces, edges, and vertices does a rectangular prism have?",
    options: ["6 faces, 8 edges, 12 vertices", "6 faces, 12 edges, 8 vertices", "8 faces, 12 edges, 6 vertices", "12 faces, 8 edges, 6 vertices"],
    correctAnswer: 1,
    explanation: "A rectangular prism has 6 faces, 12 edges, and 8 vertices."
  },
  {
    id: 30,
    type: "geometry",
    question: "A triangle has sides 7 cm, 7 cm, and 10 cm. What kind of triangle is it?",
    options: ["equilateral", "isosceles", "scalene", "right"],
    correctAnswer: 1,
    explanation: "An isosceles triangle has two equal sides. Here, 7 cm and 7 cm are equal."
  },
  {
    id: 31,
    type: "geometry",
    question: "If two lines meet to form four right angles, the lines are:",
    options: ["parallel", "curved", "perpendicular", "intersecting but not perpendicular"],
    correctAnswer: 2,
    explanation: "Perpendicular lines meet to form right angles."
  },
  {
    id: 32,
    type: "geometry",
    question: "Which statement about a circle is true?",
    options: ["It has 1 side and 1 corner", "It has no sides and no corners", "It has 2 curved sides", "It has 4 equal sides"],
    correctAnswer: 1,
    explanation: "A circle is a round closed shape with no sides and no corners."
  },

  // Data & Statistics (33-40)
  {
    id: 33,
    type: "data",
    question: "A class voted for favorite fruit. Mango = 14, Apple = 9, Banana = 11, Orange = 6. How many students voted altogether?",
    options: ["34", "38", "40", "42"],
    correctAnswer: 2,
    explanation: "14 + 9 + 11 + 6 = 40 students."
  },
  {
    id: 34,
    type: "data",
    question: "What is the mode of: 12, 15, 12, 18, 20, 12, 15?",
    options: ["12", "15", "18", "20"],
    correctAnswer: 0,
    explanation: "The mode is the number that appears most often. 12 appears 3 times."
  },
  {
    id: 35,
    type: "data",
    question: "Find the range of: 42, 35, 56, 61, 39",
    options: ["19", "21", "26", "96"],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 61 - 35 = 26."
  },
  {
    id: 36,
    type: "data",
    question: "What is the median of: 8, 12, 15, 19, 22, 24, 31?",
    options: ["12", "15", "19", "22"],
    correctAnswer: 2,
    explanation: "The median is the middle value. The 4th number in order is 19."
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph shows 6 stars and each star stands for 4 books. How many books does it represent?",
    options: ["10", "20", "24", "30"],
    correctAnswer: 2,
    explanation: "6 stars × 4 books each = 24 books."
  },
  {
    id: 38,
    type: "data",
    question: "A bar graph shows 28 buses on Monday and 17 buses on Tuesday. How many more buses were counted on Monday?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 2,
    explanation: "28 - 17 = 11 more buses on Monday."
  },
  {
    id: 39,
    type: "data",
    question: "Find the mean of: 6, 8, 10, 12, 14",
    options: ["8", "9", "10", "11"],
    correctAnswer: 2,
    explanation: "Mean = (6 + 8 + 10 + 12 + 14) ÷ 5 = 50 ÷ 5 = 10."
  },
  {
    id: 40,
    type: "data",
    question: "One fifth of 45 students were absent. How many students were present?",
    options: ["9", "27", "36", "40"],
    correctAnswer: 2,
    explanation: "Absent = 1/5 × 45 = 9. Present = 45 - 9 = 36."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: {
    title: "Number Operations",
    description: "Multi-step number work, fractions, decimals, place value, and patterns.",
  },
  measurement: {
    title: "Measurement",
    description: "Time, area, perimeter, mass, capacity, and unit conversions.",
  },
  geometry: {
    title: "Geometry",
    description: "Angles, shapes, properties, and solid figures.",
  },
  data: {
    title: "Data & Statistics",
    description: "Reading data, averages, mode, range, and comparisons.",
  },
}

export default function NumeracyDifficult1Page() {
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

  const getSectionSummary = (section: SectionKey) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === section)
    const sectionIndexes = availableQuestions
      .map((q, index) => ({ q, index }))
      .filter(({ q }) => q.type === section)

    const correct = sectionIndexes.reduce((sum, { q, index }) => {
      return sum + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)

    const total = sectionQuestions.length
    const percentage = total ? Math.round((correct / total) * 100) : 0

    let note = "Needs Improvement"
    if (percentage >= 85) note = "Excellent"
    else if (percentage >= 70) note = "Good"
    else if (percentage >= 50) note = "Fair"

    return {
      title: sectionConfig[section].title,
      description: sectionConfig[section].description,
      correct,
      total,
      percentage,
      note,
    }
  }

  const sectionSummaries = (Object.keys(sectionConfig) as SectionKey[]).map((section) =>
    getSectionSummary(section)
  )

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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Practice Series</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question difficult paper with a branded report.
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
                  <h3 className="font-semibold text-blue-800 mb-2">Difficulty Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Multi-step reasoning and closer problem reading</li>
                    <li>- Stronger distractors and more careful choice of method</li>
                    <li>- Higher emphasis on number relationships and comparisons</li>
                    <li>- Standard Grade 4 content with greater thinking demand</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Test Sections:</h3>
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
                    <li>- Read each problem carefully before choosing an answer.</li>
                    <li>- Use rough working if needed.</li>
                    <li>- Look out for details in units, fractions, and wording.</li>
                    <li>- You can move between questions before you submit.</li>
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
              <CardTitle className="text-2xl text-blue-800">Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 1</p>
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
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    Review each question to see the selected answer, the correct answer, and an explanation.
                    You can also print or save the full report as a PDF with the Shazonique&apos;s Inspiration logo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {sectionSummaries.map((section) => (
                    <div key={section.title} className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-base font-semibold text-blue-800">{section.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-slate-700">
                          {section.correct}/{section.total} correct
                        </p>
                        <p className="text-sm font-semibold text-blue-700">{section.percentage}%</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{section.note}</p>
                    </div>
                  ))}
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
                    <p className="text-sm font-semibold text-slate-500">
                      Managed by Shazonique&apos;s Inspiration
                    </p>
                    <CardTitle className="text-2xl text-blue-800 mt-1">
                      Grade 4 PEP Numeracy Difficult 1 Report
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
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result, section summaries, and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {sectionSummaries.map((section) => (
                  <div key={section.title} className="rounded-xl border border-blue-100 bg-white p-4">
                    <p className="text-base font-semibold text-blue-800">{section.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-slate-700">
                        {section.correct}/{section.total} correct
                      </p>
                      <p className="text-sm font-semibold text-blue-700">{section.percentage}%</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{section.note}</p>
                  </div>
                ))}
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
                          <p className="font-semibold text-slate-800 mb-1">Question {index + 1}</p>
                          <p className="text-xs font-medium uppercase tracking-wide text-blue-700 mb-2">
                            {sectionConfig[q.type].title}
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
              <Link
                href="/mock-tests"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit Test"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Numeracy Difficult 1</h1>
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
                <span className="text-sm font-medium text-blue-700 uppercase">
                  {sectionConfig[question.type].title}
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
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
            >
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
