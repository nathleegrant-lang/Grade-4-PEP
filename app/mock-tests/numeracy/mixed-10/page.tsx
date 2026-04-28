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

const numeracyMixed10Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `A store sells mangoes, oranges, and pineapples in the ratio 5:3:2. If 480 fruits are sold, how many more mangoes than pineapples are sold?`,
    options: [
      "96",
      "108",
      "120",
      "144",
    ],
    correctAnswer: 3,
    explanation: `Each part = 48. Mangoes = 240. Pineapples = 96. Difference = 144.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 3 and 1/3 + 2 and 3/4 - 1 and 5/6?`,
    options: [
      "4 and 1/4",
      "4 and 1/6",
      "4 and 1/12",
      "4 and 5/12",
    ],
    correctAnswer: 0,
    explanation: `LCD = 12. 3 4/12 + 2 9/12 - 1 10/12 = 4 3/12 = 4 and 1/4.`
  },
  {
    id: 3,
    type: "number",
    question: `A car travels 120 km in 1.5 hours, then 80 km in 1 hour. What is the average speed for the whole journey?`,
    options: [
      "80 km/h",
      "84 km/h",
      "88 km/h",
      "100 km/h",
    ],
    correctAnswer: 0,
    explanation: `Total distance = 200 km. Total time = 2.5 h. Average = 200/2.5 = 80 km/h.`
  },
  {
    id: 4,
    type: "number",
    question: `A bank account earns 8% simple interest per year. $2,500 is deposited. How much interest is earned in 3 years?`,
    options: [
      "$400",
      "$500",
      "$600",
      "$700",
    ],
    correctAnswer: 2,
    explanation: `Interest = 2,500 x 8 x 3 / 100 = $600.`
  },
  {
    id: 5,
    type: "number",
    question: `What is the LCM of 4, 6, and 9?`,
    options: [
      "18",
      "24",
      "36",
      "72",
    ],
    correctAnswer: 2,
    explanation: `LCM(4,6) = 12. LCM(12,9) = 36.`
  },
  {
    id: 6,
    type: "number",
    question: `A sale reduces prices by 25%. A customer buys 3 items priced at $40, $60, and $80. How much does the customer pay?`,
    options: [
      "$130",
      "$135",
      "$140",
      "$145",
    ],
    correctAnswer: 1,
    explanation: `Total = $180. After 25% off: $180 x 0.75 = $135.`
  },
  {
    id: 7,
    type: "number",
    question: `What is sqrt(144) + cube root of 27?`,
    options: [
      "12",
      "15",
      "17",
      "21",
    ],
    correctAnswer: 1,
    explanation: `sqrt(144) = 12. Cube root of 27 = 3. 12 + 3 = 15.`
  },
  {
    id: 8,
    type: "number",
    question: `The product of two numbers is 1,440. Their HCF is 12. What is their LCM?`,
    options: [
      "100",
      "110",
      "120",
      "130",
    ],
    correctAnswer: 2,
    explanation: `LCM x HCF = product. LCM = 1,440 / 12 = 120.`
  },
  {
    id: 9,
    type: "number",
    question: `A recipe uses 2/3 cup of sugar for every 1 cup of flour. If 4 and 1/2 cups of flour are used, how much sugar is needed?`,
    options: [
      "2 cups",
      "2 and 1/3 cups",
      "3 cups",
      "3 and 1/4 cups",
    ],
    correctAnswer: 2,
    explanation: `2/3 x 4.5 = 2/3 x 9/2 = 3 cups.`
  },
  {
    id: 10,
    type: "number",
    question: `A ball is dropped from 160 cm and bounces to 5/8 of its previous height each time. How high does it rise after the 2nd bounce?`,
    options: [
      "50 cm",
      "62.5 cm",
      "80 cm",
      "100 cm",
    ],
    correctAnswer: 1,
    explanation: `After 1st: 5/8 x 160 = 100 cm. After 2nd: 5/8 x 100 = 62.5 cm.`
  },
  {
    id: 11,
    type: "number",
    question: `What is 0.06 x 0.007 x 1,000?`,
    options: [
      "0.042",
      "0.42",
      "4.2",
      "42",
    ],
    correctAnswer: 1,
    explanation: `0.06 x 0.007 = 0.00042. x 1,000 = 0.42.`
  },
  {
    id: 12,
    type: "number",
    question: `What is 4(2n + 3) = 44? Find n.`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: `2n + 3 = 11. 2n = 8. n = 4.`
  },
  {
    id: 13,
    type: "number",
    question: `A jacket was sold for $289.80 after a 10% profit was added. What was the original cost?`,
    options: [
      "$260",
      "$264",
      "$268",
      "$270",
    ],
    correctAnswer: 1,
    explanation: `Original x 1.10 = $289.80. Original = $264.`
  },
  {
    id: 14,
    type: "number",
    question: `How many prime numbers are between 10 and 30?`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 3,
    explanation: `Primes: 11, 13, 17, 19, 23, 29 = 6 prime numbers.`
  },
  {
    id: 15,
    type: "number",
    question: `What is 0.4 squared?`,
    options: [
      "0.008",
      "0.016",
      "0.04",
      "0.16",
    ],
    correctAnswer: 3,
    explanation: `0.4 x 0.4 = 0.16.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A cylindrical can has a diameter of 8 cm and height 15 cm. What is its volume? (Use pi = 3.14)`,
    options: [
      "753.6 cm3",
      "804.2 cm3",
      "942.0 cm3",
      "1,507.2 cm3",
    ],
    correctAnswer: 0,
    explanation: `Radius = 4. V = 3.14 x 16 x 15 = 753.6 cm3.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A wall is 4.5 m long and 3 m high. A window 1.2 m x 0.9 m is cut from it. What is the remaining wall area?`,
    options: [
      "11.7 m2",
      "12.0 m2",
      "12.42 m2",
      "13.5 m2",
    ],
    correctAnswer: 2,
    explanation: `Wall = 4.5 x 3 = 13.5. Window = 1.2 x 0.9 = 1.08. Remaining = 13.5 - 1.08 = 12.42 m2.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A train travels 270 km at 90 km/h, then 200 km at 80 km/h. What is the total time?`,
    options: [
      "5 h",
      "5 h 30 min",
      "5 h 45 min",
      "6 h",
    ],
    correctAnswer: 1,
    explanation: `First: 270/90 = 3 h. Second: 200/80 = 2.5 h. Total = 5.5 h = 5 h 30 min.`
  },
  {
    id: 19,
    type: "measurement",
    question: `Find the area of a semicircle with diameter 20 cm. (Use pi = 3.14)`,
    options: [
      "62.8 cm2",
      "157 cm2",
      "314 cm2",
      "628 cm2",
    ],
    correctAnswer: 1,
    explanation: `Radius = 10. Full circle = 3.14 x 100 = 314. Semicircle = 157 cm2.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A school serves 450 students in 1.5 hours. How long (in minutes) to serve 600 students at the same rate?`,
    options: [
      "100 min",
      "105 min",
      "110 min",
      "120 min",
    ],
    correctAnswer: 3,
    explanation: `Rate = 450/90 = 5 per min. Time for 600 = 600/5 = 120 min.`
  },
  {
    id: 21,
    type: "measurement",
    question: `A cuboid tank is 80 cm x 50 cm x 40 cm. How many litres does it hold? (1 L = 1,000 cm3)`,
    options: [
      "8 L",
      "16 L",
      "80 L",
      "160 L",
    ],
    correctAnswer: 3,
    explanation: `Volume = 80 x 50 x 40 = 160,000 cm3 = 160 L.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A fence is built around a square field with area 625 m2. Fencing costs $18 per metre. What is the total cost?`,
    options: [
      "$1,440",
      "$1,620",
      "$1,800",
      "$2,025",
    ],
    correctAnswer: 2,
    explanation: `Side = 25 m. Perimeter = 100 m. Cost = 100 x $18 = $1,800.`
  },
  {
    id: 23,
    type: "measurement",
    question: `Car A leaves at 9:00 AM at 60 km/h. Car B leaves the same point at 10:00 AM at 80 km/h on the same road. At what time does Car B overtake Car A?`,
    options: [
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
    ],
    correctAnswer: 2,
    explanation: `Head start = 60 km. Gain rate = 20 km/h. Time = 3 h from 10:00 AM = 1:00 PM.`
  },
  {
    id: 24,
    type: "measurement",
    question: `The surface area of a cube is 96 cm2. What is its volume?`,
    options: [
      "16 cm3",
      "32 cm3",
      "64 cm3",
      "128 cm3",
    ],
    correctAnswer: 2,
    explanation: `6s2 = 96. s2 = 16. s = 4. Volume = 64 cm3.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A compound shape has a rectangle 12 cm x 8 cm with a triangle on top (same base, height 5 cm). What is the total area?`,
    options: [
      "96 cm2",
      "102 cm2",
      "114 cm2",
      "126 cm2",
    ],
    correctAnswer: 3,
    explanation: `Rectangle = 96 cm2. Triangle = 1/2 x 12 x 5 = 30 cm2. Total = 126 cm2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `In triangle PQR, angle P = 48 degrees and angle Q = 67 degrees. What is the exterior angle at R?`,
    options: [
      "65 degrees",
      "75 degrees",
      "105 degrees",
      "115 degrees",
    ],
    correctAnswer: 3,
    explanation: `Angle R = 180 - 48 - 67 = 65. Exterior = 180 - 65 = 115 degrees.`
  },
  {
    id: 27,
    type: "geometry",
    question: `A circle has circumference 44 cm. What is its area? (Use pi = 22/7)`,
    options: [
      "77 cm2",
      "99 cm2",
      "121 cm2",
      "154 cm2",
    ],
    correctAnswer: 3,
    explanation: `C = 2 pi r = 44. r = 7. Area = 22/7 x 49 = 154 cm2.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Two angles of a triangle are in the ratio 2:3. The third angle is 50 degrees. What are the other two angles?`,
    options: [
      "50 and 80 degrees",
      "52 and 78 degrees",
      "48 and 82 degrees",
      "40 and 90 degrees",
    ],
    correctAnswer: 1,
    explanation: `Remaining = 130 degrees. In ratio 2:3, parts = 5. Each part = 26. Angles = 52 and 78 degrees.`
  },
  {
    id: 29,
    type: "geometry",
    question: `What is the volume of a cone with radius 6 cm and height 14 cm? (Use pi = 22/7)`,
    options: [
      "528 cm3",
      "616 cm3",
      "792 cm3",
      "924 cm3",
    ],
    correctAnswer: 0,
    explanation: `V = (1/3) x (22/7) x 36 x 14 = (1/3) x 1,584 = 528 cm3.`
  },
  {
    id: 30,
    type: "geometry",
    question: `In a regular polygon, each interior angle is 150 degrees. How many sides does it have?`,
    options: [
      "8",
      "10",
      "12",
      "15",
    ],
    correctAnswer: 2,
    explanation: `Exterior angle = 30. Sides = 360/30 = 12.`
  },
  {
    id: 31,
    type: "geometry",
    question: `The angles of a quadrilateral are in the ratio 1:2:3:4. What is the largest angle?`,
    options: [
      "108 degrees",
      "120 degrees",
      "144 degrees",
      "160 degrees",
    ],
    correctAnswer: 2,
    explanation: `Parts = 10. Each part = 36. Largest = 4 x 36 = 144 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `A rhombus has diagonals of 12 cm and 16 cm. What is its area?`,
    options: [
      "48 cm2",
      "96 cm2",
      "192 cm2",
      "384 cm2",
    ],
    correctAnswer: 1,
    explanation: `Area = (d1 x d2) / 2 = (12 x 16) / 2 = 96 cm2.`
  },
  {
    id: 33,
    type: "data",
    question: `The mean of 8 numbers is 32. When a 9th number is added, the mean becomes 34. What is the 9th number?`,
    options: [
      "48",
      "50",
      "52",
      "54",
    ],
    correctAnswer: 1,
    explanation: `Original sum = 256. New sum = 306. 9th = 306 - 256 = 50.`
  },
  {
    id: 34,
    type: "data",
    question: `Find the median of: 0.5, 1.3, 2.7, 0.8, 1.9, 3.2, 1.3, 2.1.`,
    options: [
      "1.3",
      "1.4",
      "1.6",
      "1.9",
    ],
    correctAnswer: 2,
    explanation: `Arranged: 0.5, 0.8, 1.3, 1.3, 1.9, 2.1, 2.7, 3.2. Median = (1.3+1.9)/2 = 1.6.`
  },
  {
    id: 35,
    type: "data",
    question: `A school has 300 students. A sample of 60 is taken. There are 90 in Year 4. How many Year 4 students should be in the sample?`,
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 2,
    explanation: `Proportion = 90/300 = 3/10. Year 4 in sample = 3/10 x 60 = 18.`
  },
  {
    id: 36,
    type: "data",
    question: `Two dice are rolled. What is P(sum of 10 or more)?`,
    options: [
      "1/6",
      "7/36",
      "5/36",
      "1/4",
    ],
    correctAnswer: 0,
    explanation: `Totals of 10+: (4,6),(5,5),(6,4),(5,6),(6,5),(6,6) = 6. P = 6/36 = 1/6.`
  },
  {
    id: 37,
    type: "data",
    question: `A frequency table: Score 5(2), Score 6(5), Score 7(6), Score 8(4), Score 9(3). What is the modal score?`,
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: `Score 7 has frequency 6, the highest.`
  },
  {
    id: 38,
    type: "data",
    question: `The weights of 10 students: 38, 42, 35, 47, 42, 51, 38, 46, 42, 39. What is the mode?`,
    options: [
      "38",
      "39",
      "42",
      "46",
    ],
    correctAnswer: 2,
    explanation: `42 appears 3 times. Mode = 42.`
  },
  {
    id: 39,
    type: "data",
    question: `A line graph shows temperature at: 6AM=18C, 9AM=22C, 12PM=28C, 3PM=31C, 6PM=26C. What was the mean temperature?`,
    options: [
      "24.0 C",
      "24.5 C",
      "25.0 C",
      "25.5 C",
    ],
    correctAnswer: 2,
    explanation: `Mean = (18+22+28+31+26) / 5 = 125 / 5 = 25.0 degrees C.`
  },
  {
    id: 40,
    type: "data",
    question: `A biased coin: P(heads) = 3/5. Tossed twice. What is P(exactly one head)?`,
    options: [
      "6/25",
      "12/25",
      "9/25",
      "3/5",
    ],
    correctAnswer: 1,
    explanation: `P(HT) = 3/5 x 2/5 = 6/25. P(TH) = 2/5 x 3/5 = 6/25. Total = 12/25.`
  }
]

export default function NumeracyMixed10Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed10Questions : numeracyMixed10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 10</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 10</h1>
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
