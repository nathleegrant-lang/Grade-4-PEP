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

const numeracyMixed6Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 9,000 - 4,385?`,
    options: [
      "4,415",
      "4,515",
      "4,615",
      "4,715",
    ],
    correctAnswer: 2,
    explanation: `9,000 - 4,385 = 4,615. Check: 4,385 + 4,615 = 9,000.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 84 x 7?`,
    options: [
      "568",
      "578",
      "582",
      "588",
    ],
    correctAnswer: 3,
    explanation: `84 x 7: (80 x 7) + (4 x 7) = 560 + 28 = 588.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 648 divided by 8?`,
    options: [
      "71",
      "79",
      "81",
      "91",
    ],
    correctAnswer: 2,
    explanation: `648 / 8 = 81. Check: 81 x 8 = 648.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the HCF of 24 and 36?`,
    options: [
      "6",
      "8",
      "12",
      "18",
    ],
    correctAnswer: 2,
    explanation: `Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12.`
  },
  {
    id: 5,
    type: "number",
    question: `What is 3/4 + 5/8?`,
    options: [
      "8/12",
      "11/8",
      "1 and 3/8",
      "13/16",
    ],
    correctAnswer: 2,
    explanation: `3/4 = 6/8. 6/8 + 5/8 = 11/8 = 1 and 3/8.`
  },
  {
    id: 6,
    type: "number",
    question: `Express 65% as a fraction in simplest form.`,
    options: [
      "65/100",
      "13/20",
      "6/10",
      "7/10",
    ],
    correctAnswer: 1,
    explanation: `65/100 = 13/20. Divide both by 5.`
  },
  {
    id: 7,
    type: "number",
    question: `A car travels 60 km per hour. How far does it travel in 2 hours 30 minutes?`,
    options: [
      "120 km",
      "140 km",
      "150 km",
      "180 km",
    ],
    correctAnswer: 2,
    explanation: `2.5 hours x 60 km/h = 150 km.`
  },
  {
    id: 8,
    type: "number",
    question: `Solve for n: 8n + 4 = 60.`,
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: `8n = 56. n = 7.`
  },
  {
    id: 9,
    type: "number",
    question: `A jersey costs $48. After a 25% reduction, what is the new price?`,
    options: [
      "$34",
      "$36",
      "$38",
      "$40",
    ],
    correctAnswer: 1,
    explanation: `25% of $48 = $12. New price = $48 - $12 = $36.`
  },
  {
    id: 10,
    type: "number",
    question: `Write 9/20 as a decimal.`,
    options: [
      "0.09",
      "0.20",
      "0.45",
      "0.90",
    ],
    correctAnswer: 2,
    explanation: `9/20 = 45/100 = 0.45.`
  },
  {
    id: 11,
    type: "number",
    question: `A class has 32 students. 3/8 wear glasses. How many do NOT wear glasses?`,
    options: [
      "12",
      "16",
      "20",
      "24",
    ],
    correctAnswer: 2,
    explanation: `Wearing glasses: 3/8 x 32 = 12. Not wearing: 32 - 12 = 20.`
  },
  {
    id: 12,
    type: "number",
    question: `What is 5.6 divided by 0.8?`,
    options: [
      "0.7",
      "7",
      "70",
      "0.07",
    ],
    correctAnswer: 1,
    explanation: `5.6 / 0.8 = 56 / 8 = 7.`
  },
  {
    id: 13,
    type: "number",
    question: `Round 8.356 to the nearest tenth.`,
    options: [
      "8.3",
      "8.35",
      "8.4",
      "8.36",
    ],
    correctAnswer: 2,
    explanation: `The hundredths digit is 5 (round up). 8.356 rounds to 8.4.`
  },
  {
    id: 14,
    type: "number",
    question: `Which number is a multiple of both 4 and 9?`,
    options: [
      "24",
      "32",
      "36",
      "48",
    ],
    correctAnswer: 2,
    explanation: `36 / 4 = 9 and 36 / 9 = 4. Both divide evenly.`
  },
  {
    id: 15,
    type: "number",
    question: `A shop earned $3,456 in a week. Expenses were $1,287. The profit was shared equally among 3 workers. How much did each worker receive?`,
    options: [
      "$619",
      "$723",
      "$729",
      "$756",
    ],
    correctAnswer: 1,
    explanation: `Profit = $3,456 - $1,287 = $2,169. Each = $2,169 / 3 = $723.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A room is 9 m long and 6 m wide. Carpet costs $15 per m2. What is the total cost?`,
    options: [
      "$720",
      "$810",
      "$900",
      "$810",
    ],
    correctAnswer: 1,
    explanation: `Area = 9 x 6 = 54 m2. Cost = 54 x $15 = $810.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A school day is 6 hours 30 minutes. How many minutes is this?`,
    options: [
      "360 min",
      "380 min",
      "390 min",
      "400 min",
    ],
    correctAnswer: 2,
    explanation: `6 hours = 360 minutes. 360 + 30 = 390 minutes.`
  },
  {
    id: 18,
    type: "measurement",
    question: `Convert 4 km 350 m into metres.`,
    options: [
      "435 m",
      "4,035 m",
      "4,350 m",
      "43,500 m",
    ],
    correctAnswer: 2,
    explanation: `4 km = 4,000 m. 4,000 + 350 = 4,350 m.`
  },
  {
    id: 19,
    type: "measurement",
    question: `How many 500 mL bottles can be filled from a 6-litre container?`,
    options: [
      "8",
      "10",
      "12",
      "14",
    ],
    correctAnswer: 2,
    explanation: `6 L = 6,000 mL. 6,000 / 500 = 12 bottles.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A piece of wire is 5.4 m long. It is cut into pieces of 0.6 m each. How many pieces?`,
    options: [
      "7",
      "8",
      "9",
      "10",
    ],
    correctAnswer: 2,
    explanation: `5.4 / 0.6 = 9 pieces.`
  },
  {
    id: 21,
    type: "measurement",
    question: `An event begins at 2:15 PM and lasts 2 hours 45 minutes. When does it end?`,
    options: [
      "4:45 PM",
      "4:55 PM",
      "5:00 PM",
      "5:05 PM",
    ],
    correctAnswer: 2,
    explanation: `2:15 + 2 h = 4:15. 4:15 + 45 min = 5:00 PM.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A bag of rice weighs 3 kg 600 g. What is its total mass in grams?`,
    options: [
      "3,060 g",
      "3,600 g",
      "36,000 g",
      "36 g",
    ],
    correctAnswer: 1,
    explanation: `3 kg = 3,000 g. 3,000 + 600 = 3,600 g.`
  },
  {
    id: 23,
    type: "measurement",
    question: `What is the perimeter of a rectangle 16 cm long and 11 cm wide?`,
    options: [
      "27 cm",
      "48 cm",
      "54 cm",
      "176 cm",
    ],
    correctAnswer: 2,
    explanation: `Perimeter = 2 x (16 + 11) = 54 cm.`
  },
  {
    id: 24,
    type: "measurement",
    question: `A rectangular field is 12 m long and 8 m wide. How many square tiles of 40 cm x 40 cm are needed to cover it?`,
    options: [
      "600",
      "720",
      "750",
      "800",
    ],
    correctAnswer: 0,
    explanation: `Field in cm: 1,200 x 800 = 960,000 cm2. Tile area = 40 x 40 = 1,600 cm2. Tiles = 960,000 / 1,600 = 600.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A lorry travels 315 km at 90 km/h. How long does the journey take?`,
    options: [
      "3 h",
      "3 h 30 min",
      "3 h 45 min",
      "4 h",
    ],
    correctAnswer: 1,
    explanation: `315 / 90 = 3.5 h = 3 h 30 min.`
  },
  {
    id: 26,
    type: "geometry",
    question: `A shape is reflected across a vertical line. What transformation is this?`,
    options: [
      "Translation",
      "Reflection",
      "Rotation",
      "Enlargement",
    ],
    correctAnswer: 1,
    explanation: `Flipping a shape over a line is reflection.`
  },
  {
    id: 27,
    type: "geometry",
    question: `What type of triangle has all three sides of DIFFERENT lengths?`,
    options: [
      "Equilateral",
      "Isosceles",
      "Scalene",
      "Right-angled",
    ],
    correctAnswer: 2,
    explanation: `A scalene triangle has no equal sides.`
  },
  {
    id: 28,
    type: "geometry",
    question: `A parallelogram has a base of 12 cm and height 7 cm. What is its area?`,
    options: [
      "19 cm2",
      "38 cm2",
      "84 cm2",
      "168 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = base x height = 12 x 7 = 84 cm2.`
  },
  {
    id: 29,
    type: "geometry",
    question: `How many edges does a cube have?`,
    options: [
      "6",
      "8",
      "10",
      "12",
    ],
    correctAnswer: 3,
    explanation: `A cube has 12 edges.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Which transformation preserves both size and shape?`,
    options: [
      "Enlargement only",
      "Rotation only",
      "Rotation, reflection, and translation",
      "Enlargement and rotation only",
    ],
    correctAnswer: 2,
    explanation: `Rotation, reflection, and translation are all isometric (they preserve size and shape).`
  },
  {
    id: 31,
    type: "geometry",
    question: `One angle of a right-angled triangle is 37 degrees. What is the third angle?`,
    options: [
      "43 degrees",
      "47 degrees",
      "53 degrees",
      "63 degrees",
    ],
    correctAnswer: 2,
    explanation: `Third angle = 180 - 90 - 37 = 53 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `What is the interior angle of a regular octagon?`,
    options: [
      "120 degrees",
      "125 degrees",
      "135 degrees",
      "145 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = (8-2) x 180 = 1,080. Each angle = 1,080 / 8 = 135 degrees.`
  },
  {
    id: 33,
    type: "data",
    question: `What is the mean of: 5, 11, 8, 14, 7, 9?`,
    options: [
      "8",
      "9",
      "10",
      "11",
    ],
    correctAnswer: 1,
    explanation: `Mean = (5+11+8+14+7+9) / 6 = 54 / 6 = 9.`
  },
  {
    id: 34,
    type: "data",
    question: `Temperatures over 5 days: 28, 31, 25, 33, 28. What is the mode?`,
    options: [
      "25",
      "28",
      "31",
      "33",
    ],
    correctAnswer: 1,
    explanation: `28 appears twice. Mode = 28.`
  },
  {
    id: 35,
    type: "data",
    question: `Find the median of: 42, 17, 35, 28, 53, 21, 46.`,
    options: [
      "28",
      "35",
      "38",
      "42",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 17, 21, 28, 35, 42, 46, 53. Middle (4th) = 35.`
  },
  {
    id: 36,
    type: "data",
    question: `A pie chart shows Netball covers 120 degrees. What fraction of students chose Netball?`,
    options: [
      "1/4",
      "1/3",
      "2/5",
      "1/6",
    ],
    correctAnswer: 1,
    explanation: `120 / 360 = 1/3.`
  },
  {
    id: 37,
    type: "data",
    question: `Find the range of: 4.5, 7.2, 3.8, 9.1, 6.0.`,
    options: [
      "4.6",
      "5.3",
      "5.7",
      "6.2",
    ],
    correctAnswer: 1,
    explanation: `Range = 9.1 - 3.8 = 5.3.`
  },
  {
    id: 38,
    type: "data",
    question: `In a class of 30, 12 prefer Maths and 10 prefer Science. What fraction prefer neither?`,
    options: [
      "4/15",
      "8/30",
      "2/5",
      "4/30",
    ],
    correctAnswer: 0,
    explanation: `Neither = 30 - 12 - 10 = 8. Fraction = 8/30 = 4/15.`
  },
  {
    id: 39,
    type: "data",
    question: `A bag contains 6 red, 4 blue, and 2 yellow marbles. What is the probability of picking yellow?`,
    options: [
      "1/12",
      "1/6",
      "2/12",
      "1/4",
    ],
    correctAnswer: 1,
    explanation: `P(yellow) = 2/12 = 1/6.`
  },
  {
    id: 40,
    type: "data",
    question: `The mean of 6 numbers is 15. If 3 is added to each number, what is the new mean?`,
    options: [
      "12",
      "15",
      "18",
      "21",
    ],
    correctAnswer: 2,
    explanation: `Adding 3 to each value increases the mean by 3. New mean = 15 + 3 = 18.`
  }
]

export default function NumeracyMixed6Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed6Questions : numeracyMixed6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 6</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 6 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 6</h1>
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
