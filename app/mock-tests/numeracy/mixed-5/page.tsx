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

const numeracyMixed5Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 7,004 - 3,867?`,
    options: [
      "3,037",
      "3,137",
      "3,147",
      "3,237",
    ],
    correctAnswer: 1,
    explanation: `7,004 - 3,867 = 3,137. Check: 3,867 + 3,137 = 7,004.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 76 x 8?`,
    options: [
      "568",
      "598",
      "608",
      "618",
    ],
    correctAnswer: 2,
    explanation: `76 x 8: (70 x 8) + (6 x 8) = 560 + 48 = 608.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 693 divided by 9?`,
    options: [
      "69",
      "73",
      "77",
      "99",
    ],
    correctAnswer: 3,
    explanation: `693 / 9 = 77. Check: 77 x 9 = 693.`
  },
  {
    id: 4,
    type: "number",
    question: `What is the LCM of 5 and 8?`,
    options: [
      "13",
      "16",
      "40",
      "80",
    ],
    correctAnswer: 2,
    explanation: `Multiples of 5: 5,10,15,20,25,30,35,40. Multiples of 8: 8,16,24,32,40. LCM = 40.`
  },
  {
    id: 5,
    type: "number",
    question: `Which number is divisible by both 3 and 4?`,
    options: [
      "20",
      "28",
      "36",
      "44",
    ],
    correctAnswer: 2,
    explanation: `36 / 3 = 12 and 36 / 4 = 9. Both divide evenly.`
  },
  {
    id: 6,
    type: "number",
    question: `What is 7/10 - 2/5?`,
    options: [
      "5/5",
      "3/10",
      "1/2",
      "9/10",
    ],
    correctAnswer: 1,
    explanation: `Convert 2/5 to tenths: 4/10. Then 7/10 - 4/10 = 3/10.`
  },
  {
    id: 7,
    type: "number",
    question: `A vendor bought 8 dozen eggs. How many is that?`,
    options: [
      "86",
      "92",
      "96",
      "100",
    ],
    correctAnswer: 2,
    explanation: `1 dozen = 12. 8 x 12 = 96 eggs.`
  },
  {
    id: 8,
    type: "number",
    question: `Express 2/5 as a percentage.`,
    options: [
      "20%",
      "25%",
      "40%",
      "50%",
    ],
    correctAnswer: 2,
    explanation: `2/5 x 100 = 40%.`
  },
  {
    id: 9,
    type: "number",
    question: `What is 2.8 x 9?`,
    options: [
      "23.2",
      "25.2",
      "26.2",
      "27.2",
    ],
    correctAnswer: 1,
    explanation: `2.8 x 9: (2 x 9) + (0.8 x 9) = 18 + 7.2 = 25.2.`
  },
  {
    id: 10,
    type: "number",
    question: `A number pattern: 3, 7, 11, 15, ___. What is the next term?`,
    options: [
      "17",
      "18",
      "19",
      "20",
    ],
    correctAnswer: 2,
    explanation: `The pattern increases by 4 each time. 15 + 4 = 19.`
  },
  {
    id: 11,
    type: "number",
    question: `What is the HCF of 20 and 30?`,
    options: [
      "5",
      "10",
      "15",
      "20",
    ],
    correctAnswer: 1,
    explanation: `Common factors: 1, 2, 5, 10. HCF = 10.`
  },
  {
    id: 12,
    type: "number",
    question: `Marcus earns $55 per day. How much does he earn in 6 days?`,
    options: [
      "$300",
      "$320",
      "$325",
      "$330",
    ],
    correctAnswer: 3,
    explanation: `6 x $55 = $330.`
  },
  {
    id: 13,
    type: "number",
    question: `A shop gives a 30% discount on a $90 item. What is the sale price?`,
    options: [
      "$27",
      "$54",
      "$60",
      "$63",
    ],
    correctAnswer: 3,
    explanation: `30% of $90 = $27. Sale price = $90 - $27 = $63.`
  },
  {
    id: 14,
    type: "number",
    question: `Write 0.625 as a fraction in simplest form.`,
    options: [
      "625/1000",
      "5/8",
      "6/25",
      "3/5",
    ],
    correctAnswer: 1,
    explanation: `0.625 = 625/1000 = 5/8. Divide by 125.`
  },
  {
    id: 15,
    type: "number",
    question: `If 4 packs hold 32 stickers, how many stickers are in 7 packs?`,
    options: [
      "52",
      "56",
      "60",
      "64",
    ],
    correctAnswer: 1,
    explanation: `Per pack: 32 / 4 = 8 stickers. For 7 packs: 7 x 8 = 56.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A square field has sides of 35 m. What is its area?`,
    options: [
      "70 m2",
      "140 m2",
      "1,225 m2",
      "1,325 m2",
    ],
    correctAnswer: 2,
    explanation: `Area = 35 x 35 = 1,225 m2.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A bottle contains 1.75 litres. How many 250 mL cups can be filled?`,
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: `1.75 L = 1,750 mL. 1,750 / 250 = 7 cups.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A clock shows 11:48 AM. What time will it be in 1 hour and 35 minutes?`,
    options: [
      "12:48 PM",
      "1:03 PM",
      "1:13 PM",
      "1:23 PM",
    ],
    correctAnswer: 3,
    explanation: `11:48 + 1 hour = 12:48. 12:48 + 35 minutes = 1:23 PM.`
  },
  {
    id: 19,
    type: "measurement",
    question: `How many seconds are in 2 minutes and 30 seconds?`,
    options: [
      "130 s",
      "145 s",
      "150 s",
      "160 s",
    ],
    correctAnswer: 2,
    explanation: `2 minutes = 120 seconds. 120 + 30 = 150 seconds.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A rectangular floor is 8 m long and 5 m wide. Tiling costs $12 per m2. What is the total cost?`,
    options: [
      "$420",
      "$480",
      "$520",
      "$580",
    ],
    correctAnswer: 1,
    explanation: `Area = 8 x 5 = 40 m2. Cost = 40 x $12 = $480.`
  },
  {
    id: 21,
    type: "measurement",
    question: `What is the perimeter of an equilateral triangle with sides of 12 cm?`,
    options: [
      "12 cm",
      "24 cm",
      "36 cm",
      "48 cm",
    ],
    correctAnswer: 2,
    explanation: `Perimeter = 3 x 12 = 36 cm.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A race starts at 9:55 AM and ends at 11:20 AM. How long does the race last?`,
    options: [
      "1 h 15 min",
      "1 h 20 min",
      "1 h 25 min",
      "1 h 35 min",
    ],
    correctAnswer: 2,
    explanation: `9:55 to 11:00 = 1 h 5 min. 11:00 to 11:20 = 20 min. Total = 1 h 25 min.`
  },
  {
    id: 23,
    type: "measurement",
    question: `How many grams are in 4.25 kg?`,
    options: [
      "425 g",
      "4,025 g",
      "4,250 g",
      "42,500 g",
    ],
    correctAnswer: 2,
    explanation: `4.25 x 1,000 = 4,250 g.`
  },
  {
    id: 24,
    type: "measurement",
    question: `Which measurement is the longest?`,
    options: [
      "3,500 m",
      "3.6 km",
      "3,450 m",
      "0.004 km",
    ],
    correctAnswer: 1,
    explanation: `3.6 km = 3,600 m, which is the largest.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A cuboid is 10 cm long, 6 cm wide, and 4 cm tall. What is its volume?`,
    options: [
      "20 cm3",
      "100 cm3",
      "240 cm3",
      "480 cm3",
    ],
    correctAnswer: 2,
    explanation: `Volume = 10 x 6 x 4 = 240 cm3.`
  },
  {
    id: 26,
    type: "geometry",
    question: `What is the sum of the interior angles of a quadrilateral?`,
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
    id: 27,
    type: "geometry",
    question: `Which solid has exactly 2 circular faces and 1 curved surface?`,
    options: [
      "Sphere",
      "Cone",
      "Cylinder",
      "Prism",
    ],
    correctAnswer: 2,
    explanation: `A cylinder has 2 flat circular faces and 1 curved surface around the side.`
  },
  {
    id: 28,
    type: "geometry",
    question: `A shape is rotated 90 degrees clockwise. What transformation has taken place?`,
    options: [
      "Translation",
      "Reflection",
      "Rotation",
      "Enlargement",
    ],
    correctAnswer: 2,
    explanation: `Turning a shape around a fixed point is rotation.`
  },
  {
    id: 29,
    type: "geometry",
    question: `How many vertices does a square-based pyramid have?`,
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 1,
    explanation: `1 apex + 4 base vertices = 5 vertices.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Which of these shapes has no line of symmetry?`,
    options: [
      "Equilateral triangle",
      "Scalene triangle",
      "Isosceles triangle",
      "Square",
    ],
    correctAnswer: 1,
    explanation: `A scalene triangle has all sides different and no lines of symmetry.`
  },
  {
    id: 31,
    type: "geometry",
    question: `A square has a perimeter of 64 cm. What is its area?`,
    options: [
      "16 cm2",
      "64 cm2",
      "128 cm2",
      "256 cm2",
    ],
    correctAnswer: 3,
    explanation: `Side = 64 / 4 = 16 cm. Area = 16 x 16 = 256 cm2.`
  },
  {
    id: 32,
    type: "geometry",
    question: `What is the interior angle of a regular hexagon?`,
    options: [
      "90 degrees",
      "108 degrees",
      "120 degrees",
      "135 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = (6-2) x 180 = 720. Each angle = 720 / 6 = 120 degrees.`
  },
  {
    id: 33,
    type: "data",
    question: `Find the mean of: 15, 9, 21, 18, 12.`,
    options: [
      "13",
      "14",
      "15",
      "16",
    ],
    correctAnswer: 2,
    explanation: `Mean = (15+9+21+18+12) / 5 = 75 / 5 = 15.`
  },
  {
    id: 34,
    type: "data",
    question: `Find the median of: 32, 15, 28, 41, 19, 36, 23.`,
    options: [
      "23",
      "28",
      "29",
      "32",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 15, 19, 23, 28, 32, 36, 41. Middle (4th) = 28.`
  },
  {
    id: 35,
    type: "data",
    question: `Goals in 7 matches: 2, 4, 1, 3, 4, 2, 4. What is the mode?`,
    options: [
      "1",
      "2",
      "3",
      "4",
    ],
    correctAnswer: 3,
    explanation: `4 appears 3 times. Mode = 4.`
  },
  {
    id: 36,
    type: "data",
    question: `The range of a data set is 19. The smallest value is 14. What is the largest?`,
    options: [
      "5",
      "19",
      "28",
      "33",
    ],
    correctAnswer: 3,
    explanation: `Largest = smallest + range = 14 + 19 = 33.`
  },
  {
    id: 37,
    type: "data",
    question: `A pie chart shows that 3/8 of students chose Sport. There are 40 students. How many chose Sport?`,
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
    question: `A bag has 4 red, 3 blue, and 3 green counters. What is the probability of picking blue?`,
    options: [
      "3/10",
      "1/3",
      "4/10",
      "1/4",
    ],
    correctAnswer: 0,
    explanation: `P(blue) = 3/10.`
  },
  {
    id: 39,
    type: "data",
    question: `In a survey of 30 students, 12 preferred Maths. What percentage preferred Maths?`,
    options: [
      "30%",
      "35%",
      "40%",
      "45%",
    ],
    correctAnswer: 2,
    explanation: `12/30 x 100 = 40%.`
  },
  {
    id: 40,
    type: "data",
    question: `The mean of 5 numbers is 14. Four of the numbers are 12, 17, 11, and 15. What is the fifth number?`,
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 1,
    explanation: `Total = 5 x 14 = 70. Sum of 4 known = 55. Fifth = 70 - 55 = 15.`
  }
]

export default function NumeracyMixed5Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed5Questions : numeracyMixed5Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 5</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 5</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 5 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 5</h1>
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
