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

const numeracyDifficult5Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "Two friends share $420 in the ratio 3:4. How much more does the person with the larger share receive?",
    options: [
      "$50",
      "$60",
      "$70",
      "$80",
    ],
    correctAnswer: 1,
    explanation: "Total parts = 7. Larger share = 4/7 x $420 = $240. Smaller = 3/7 x $420 = $180. Difference = $60."
  },
  {
    id: 2,
    type: "number",
    question: "What is 3.6 x 0.05?",
    options: [
      "0.018",
      "0.18",
      "1.8",
      "18",
    ],
    correctAnswer: 1,
    explanation: "3.6 x 5 = 18. Place 3 decimal places in total: 0.18."
  },
  {
    id: 3,
    type: "number",
    question: "A rectangle has a perimeter of 56 cm. The length is three times the width. What are the dimensions?",
    options: [
      "Length 21 cm, Width 7 cm",
      "Length 24 cm, Width 8 cm",
      "Length 30 cm, Width 10 cm",
      "Length 36 cm, Width 12 cm",
    ],
    correctAnswer: 0,
    explanation: "Let width = w, length = 3w. Perimeter: 2(3w+w) = 8w = 56. w = 7 cm, length = 21 cm."
  },
  {
    id: 4,
    type: "number",
    question: "What is the next perfect square number after 64?",
    options: [
      "72",
      "76",
      "81",
      "100",
    ],
    correctAnswer: 2,
    explanation: "64 = 8 squared. The next perfect square is 9 squared = 81."
  },
  {
    id: 5,
    type: "number",
    question: "Train tickets cost $17.50 each. A family buys tickets for 2 adults and 3 children. Child fares are half the adult fare. How much do they pay altogether?",
    options: [
      "$52.50",
      "$57.75",
      "$61.25",
      "$70.00",
    ],
    correctAnswer: 2,
    explanation: "Adult: $17.50 x 2 = $35.00. Child fare: $8.75 x 3 = $26.25. Total = $35.00 + $26.25 = $61.25."
  },
  {
    id: 6,
    type: "number",
    question: "Which number is divisible by both 4 and 6?",
    options: [
      "18",
      "20",
      "24",
      "30",
    ],
    correctAnswer: 2,
    explanation: "LCM of 4 and 6 = 12. 24 is divisible by both: 24/4 = 6 and 24/6 = 4."
  },
  {
    id: 7,
    type: "number",
    question: "A number is increased by 25% to give 375. What was the original number?",
    options: [
      "280",
      "290",
      "300",
      "310",
    ],
    correctAnswer: 2,
    explanation: "Original x 1.25 = 375. Original = 375 / 1.25 = 300."
  },
  {
    id: 8,
    type: "number",
    question: "What is 2 and 5/8 minus 1 and 3/4?",
    options: [
      "7/8",
      "3/4",
      "1 and 1/8",
      "6/8",
    ],
    correctAnswer: 0,
    explanation: "Convert: 2 5/8 = 21/8. 1 3/4 = 14/8. 21/8 - 14/8 = 7/8."
  },
  {
    id: 9,
    type: "number",
    question: "The product of two numbers is 504. One number is 24. What is the other?",
    options: [
      "18",
      "19",
      "20",
      "21",
    ],
    correctAnswer: 3,
    explanation: "504 / 24 = 21."
  },
  {
    id: 10,
    type: "number",
    question: "A car uses 8 litres of petrol per 100 km. How much petrol is needed for a journey of 350 km?",
    options: [
      "24 L",
      "28 L",
      "32 L",
      "35 L",
    ],
    correctAnswer: 1,
    explanation: "(350/100) x 8 = 3.5 x 8 = 28 L."
  },
  {
    id: 11,
    type: "number",
    question: "What is 12.5% of 480?",
    options: [
      "48",
      "52",
      "60",
      "72",
    ],
    correctAnswer: 2,
    explanation: "12.5% = 1/8. 1/8 x 480 = 60."
  },
  {
    id: 12,
    type: "number",
    question: "The sum of three consecutive even numbers is 78. What are the numbers?",
    options: [
      "22, 26, 30",
      "24, 26, 28",
      "26, 28, 30",
      "20, 28, 30",
    ],
    correctAnswer: 1,
    explanation: "Let the numbers be n, n+2, n+4. 3n + 6 = 78. 3n = 72. n = 24. Numbers: 24, 26, 28."
  },
  {
    id: 13,
    type: "number",
    question: "What is the value of 5 x (3 + 4) squared - 10?",
    options: [
      "225",
      "235",
      "245",
      "255",
    ],
    correctAnswer: 1,
    explanation: "(3+4) squared = 49. 5 x 49 = 245. 245 - 10 = 235."
  },
  {
    id: 14,
    type: "number",
    question: "A store offers a 15% discount on a $260 dress. What is the sale price?",
    options: [
      "$208.00",
      "$211.00",
      "$218.00",
      "$221.00",
    ],
    correctAnswer: 3,
    explanation: "Discount: 15% x $260 = $39. Sale price: $260 - $39 = $221."
  },
  {
    id: 15,
    type: "number",
    question: "Find the LCM of 8, 12, and 18.",
    options: [
      "36",
      "48",
      "72",
      "108",
    ],
    correctAnswer: 2,
    explanation: "LCM(8,12) = 24. LCM(24,18): 24 = 2 cubed x 3, 18 = 2 x 3 squared. LCM = 2 cubed x 3 squared = 72."
  },
  {
    id: 16,
    type: "measurement",
    question: "A tank 4 m long, 3 m wide, and 2 m deep is half full of water. How many litres of water are in it? (1 cubic metre = 1,000 litres)",
    options: [
      "8,000 L",
      "10,000 L",
      "12,000 L",
      "24,000 L",
    ],
    correctAnswer: 2,
    explanation: "Full volume = 4 x 3 x 2 = 24 m3. Half full = 12 m3 = 12,000 litres."
  },
  {
    id: 17,
    type: "measurement",
    question: "A film starts at 2:45 PM and lasts 1 hour 55 minutes. A second film starts 30 minutes later. What time does the second film start?",
    options: [
      "5:00 PM",
      "5:10 PM",
      "5:20 PM",
      "5:30 PM",
    ],
    correctAnswer: 1,
    explanation: "Film 1 ends: 2:45 + 1 h 55 min = 4:40 PM. Second film starts: 4:40 + 30 min = 5:10 PM."
  },
  {
    id: 18,
    type: "measurement",
    question: "A rectangular garden is 12 m long and 7 m wide. A path 2 m wide is built all around the outside. What is the area of the path alone?",
    options: [
      "84 m2",
      "88 m2",
      "90 m2",
      "92 m2",
    ],
    correctAnswer: 3,
    explanation: "Outer: (12+4) x (7+4) = 16 x 11 = 176 m2. Garden: 12 x 7 = 84 m2. Path = 176 - 84 = 92 m2."
  },
  {
    id: 19,
    type: "measurement",
    question: "What is the volume of a rectangular box that is 15 cm long, 8 cm wide, and 6 cm deep?",
    options: [
      "580 cm3",
      "620 cm3",
      "700 cm3",
      "720 cm3",
    ],
    correctAnswer: 3,
    explanation: "Volume = 15 x 8 x 6 = 720 cm3."
  },
  {
    id: 20,
    type: "measurement",
    question: "A car travels at 80 km/h. How long does it take to travel 300 km? Give the answer in hours and minutes.",
    options: [
      "3 h 30 min",
      "3 h 45 min",
      "4 h 0 min",
      "4 h 15 min",
    ],
    correctAnswer: 1,
    explanation: "Time = 300 / 80 = 3.75 hours = 3 hours 45 minutes."
  },
  {
    id: 21,
    type: "measurement",
    question: "A piece of rope is 8.4 m long. It is cut into pieces of 60 cm each. How many complete pieces can be cut, and how much rope is left over?",
    options: [
      "13 pieces, 60 cm left",
      "14 pieces, 0 cm left",
      "14 pieces, 20 cm left",
      "13 pieces, 40 cm left",
    ],
    correctAnswer: 1,
    explanation: "8.4 m = 840 cm. 840 / 60 = 14 exactly. 14 complete pieces with 0 cm left over."
  },
  {
    id: 22,
    type: "measurement",
    question: "A water tank is 3/5 full and contains 720 litres. What is the total capacity of the tank?",
    options: [
      "432 L",
      "960 L",
      "1,200 L",
      "1,440 L",
    ],
    correctAnswer: 2,
    explanation: "3/5 of tank = 720 L. Full capacity = 720 / (3/5) = 720 x 5/3 = 1,200 L."
  },
  {
    id: 23,
    type: "measurement",
    question: "Two clocks both show the correct time at 9:00 AM. Clock A gains 3 minutes per hour. Clock B loses 2 minutes per hour. After 6 real hours, how many minutes apart are the two clocks?",
    options: [
      "18 min",
      "24 min",
      "30 min",
      "36 min",
    ],
    correctAnswer: 2,
    explanation: "Clock A gains 6 x 3 = 18 min (shows 3:18 PM). Clock B loses 6 x 2 = 12 min (shows 2:48 PM). Difference = 18 + 12 = 30 minutes."
  },
  {
    id: 24,
    type: "measurement",
    question: "A right-angled triangular field has legs of 30 m and 40 m. What is its area?",
    options: [
      "350 m2",
      "600 m2",
      "700 m2",
      "1,200 m2",
    ],
    correctAnswer: 1,
    explanation: "Area = 1/2 x base x height = 1/2 x 30 x 40 = 600 m2."
  },
  {
    id: 25,
    type: "measurement",
    question: "A rectangular field is 35 m long. Its perimeter is 110 m. What is the area of the field?",
    options: [
      "560 m2",
      "630 m2",
      "700 m2",
      "770 m2",
    ],
    correctAnswer: 2,
    explanation: "Perimeter: 2(35 + w) = 110, so 35 + w = 55, w = 20 m. Area = 35 x 20 = 700 m2."
  },
  {
    id: 26,
    type: "geometry",
    question: "A regular hexagon is divided into triangles from its centre. How many triangles are formed?",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 2,
    explanation: "A regular hexagon can be divided into 6 equilateral triangles from the centre point."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which shape has the most lines of symmetry?",
    options: [
      "Equilateral triangle",
      "Square",
      "Regular pentagon",
      "Circle",
    ],
    correctAnswer: 3,
    explanation: "A circle has an infinite number of lines of symmetry. The others have 3, 4, and 5 respectively."
  },
  {
    id: 28,
    type: "geometry",
    question: "Two angles of a quadrilateral are 85 degrees and 110 degrees. The other two angles are equal. What is the size of each equal angle?",
    options: [
      "75 degrees",
      "82.5 degrees",
      "85 degrees",
      "90 degrees",
    ],
    correctAnswer: 1,
    explanation: "Sum = 360 degrees. 85 + 110 = 195. Remaining = 360 - 195 = 165. Each = 165 / 2 = 82.5 degrees."
  },
  {
    id: 29,
    type: "geometry",
    question: "What is the sum of the interior angles of an octagon?",
    options: [
      "900 degrees",
      "1,080 degrees",
      "1,260 degrees",
      "1,440 degrees",
    ],
    correctAnswer: 1,
    explanation: "Sum = (n-2) x 180 = (8-2) x 180 = 6 x 180 = 1,080 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "An isosceles triangle has a vertex angle of 40 degrees. What is the size of each base angle?",
    options: [
      "60 degrees",
      "70 degrees",
      "75 degrees",
      "80 degrees",
    ],
    correctAnswer: 1,
    explanation: "Base angles = (180 - 40) / 2 = 140 / 2 = 70 degrees each."
  },
  {
    id: 31,
    type: "geometry",
    question: "Which of these solids can roll in more than one direction?",
    options: [
      "Cylinder",
      "Cone",
      "Sphere",
      "Rectangular prism",
    ],
    correctAnswer: 2,
    explanation: "A sphere rolls in any direction. A cylinder rolls in one direction and a cone rolls in a circle."
  },
  {
    id: 32,
    type: "geometry",
    question: "In a kite, which statement about the diagonals is TRUE?",
    options: [
      "Both diagonals are equal",
      "Both diagonals bisect each other",
      "One diagonal is the perpendicular bisector of the other",
      "Both diagonals are parallel",
    ],
    correctAnswer: 2,
    explanation: "In a kite, one diagonal (the main axis) is the perpendicular bisector of the other diagonal."
  },
  {
    id: 33,
    type: "data",
    question: "The mean of 6 numbers is 18. Five of the numbers are: 14, 22, 16, 20, 18. What is the sixth number?",
    options: [
      "14",
      "18",
      "20",
      "22",
    ],
    correctAnswer: 1,
    explanation: "Total sum = 6 x 18 = 108. Known five: 14+22+16+20+18 = 90. Sixth = 108 - 90 = 18."
  },
  {
    id: 34,
    type: "data",
    question: "The scores of 10 students are: 65, 72, 58, 80, 65, 91, 74, 65, 83, 77. What is the mode and the range?",
    options: [
      "Mode 65, Range 33",
      "Mode 65, Range 36",
      "Mode 74, Range 33",
      "Mode 72, Range 36",
    ],
    correctAnswer: 0,
    explanation: "Mode = 65 (appears 3 times). Range = 91 - 58 = 33."
  },
  {
    id: 35,
    type: "data",
    question: "A school has 240 students. A pie chart shows: 1/4 in Grade 4, 1/3 in Grade 5, 1/6 in Grade 6, and the rest in Grade 3. How many students are in Grade 3?",
    options: [
      "50",
      "60",
      "70",
      "80",
    ],
    correctAnswer: 1,
    explanation: "Grades 4+5+6: 1/4 + 1/3 + 1/6 = 3/12 + 4/12 + 2/12 = 9/12. Grade 3 = 3/12 = 1/4 of 240 = 60."
  },
  {
    id: 36,
    type: "data",
    question: "The probability of rain on any given day is 3/8. What is the probability that it will NOT rain?",
    options: [
      "3/8",
      "4/8",
      "5/8",
      "6/8",
    ],
    correctAnswer: 2,
    explanation: "P(not rain) = 1 - 3/8 = 8/8 - 3/8 = 5/8."
  },
  {
    id: 37,
    type: "data",
    question: "In a survey of 80 people, 35 preferred mango, 28 preferred pineapple, and the rest preferred guava. What percentage preferred guava?",
    options: [
      "17.5%",
      "21.25%",
      "22.5%",
      "25%",
    ],
    correctAnswer: 1,
    explanation: "Guava: 80 - 35 - 28 = 17. Percentage = (17/80) x 100 = 21.25%."
  },
  {
    id: 38,
    type: "data",
    question: "The mean of 4 numbers is 25. If one number is removed, the new mean of the remaining 3 numbers is 27. What was the removed number?",
    options: [
      "15",
      "17",
      "19",
      "21",
    ],
    correctAnswer: 2,
    explanation: "Original sum = 4 x 25 = 100. New sum (3 numbers) = 3 x 27 = 81. Removed = 100 - 81 = 19."
  },
  {
    id: 39,
    type: "data",
    question: "A bag has 5 green, 4 red, 3 blue, and 2 yellow counters. What is the probability of picking a counter that is NOT yellow?",
    options: [
      "1/7",
      "6/7",
      "2/14",
      "5/7",
    ],
    correctAnswer: 1,
    explanation: "Total = 14. Not yellow = 14 - 2 = 12. P = 12/14 = 6/7."
  },
  {
    id: 40,
    type: "data",
    question: "A line graph shows a plant height: Day 1 = 3 cm, Day 4 = 9 cm, Day 7 = 15 cm. If growth is constant, what will the height be on Day 10?",
    options: [
      "18 cm",
      "19 cm",
      "21 cm",
      "24 cm",
    ],
    correctAnswer: 2,
    explanation: "Growth rate = (9-3)/(4-1) = 6/3 = 2 cm per day. From Day 7 to Day 10 = 3 days x 2 = 6 cm. Height = 15 + 6 = 21 cm."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult5Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult5Questions : numeracyDifficult5Questions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => { if (answers.length !== totalQuestions) { setAnswers(new Array(totalQuestions).fill(null)) } }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => { setTimeRemaining((prev) => { if (prev <= 1) { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true); return 0 } return prev - 1 }) }, 1000)
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
    const idxs = availableQuestions.map((q, i) => ({ q, i })).filter(({ q }) => q.type === section)
    const correct = idxs.reduce((s, { q, i }) => s + (answers[i] === q.correctAnswer ? 1 : 0), 0)
    const total = sqs.length
    const pct = total ? Math.round((correct / total) * 100) : 0
    const note = pct >= 85 ? "Excellent" : pct >= 70 ? "Good" : pct >= 50 ? "Fair" : "Needs Improvement"
    return { title: sectionConfig[section].title, description: sectionConfig[section].description, correct, total, percentage: pct, note }
  }

  const sectionSummaries = (Object.keys(sectionConfig) as SectionKey[]).map(getSectionSummary)

  const handleSubmit = () => { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true) }

  const restartTest = () => { setTestStarted(false); setTestCompleted(false); setCurrentQuestion(0); setAnswers(new Array(totalQuestions).fill(null)); setTimeRemaining(isPremium ? 60 * 60 : 10 * 60); setShowReview(false); setCompletedAt("") }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Link>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 5</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Difficult Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{totalQuestions}</p><p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-medium text-amber-800">Free Preview Mode</p><p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question difficult paper with a branded report.</p></div></div>
                    <Link href="/pricing" className="block mt-3"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button></Link>
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
                    <li>- Data &amp; Statistics (Questions 33-40)</li>
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
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 5</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg"><p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p><p className="text-gray-600 mt-2">Questions Correct</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left"><h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3><p className="text-sm text-slate-700">This difficult-level numeracy report includes section summaries and a full question-by-question review with explanations. You can also print or save the full report as a PDF with the Shazonique&apos;s Inspiration logo.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {sectionSummaries.map((s) => (<div key={s.title} className="rounded-xl border border-blue-100 bg-white p-4"><p className="text-base font-semibold text-blue-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.description}</p><div className="mt-3 flex items-center justify-between"><p className="text-sm text-slate-700">{s.correct}/{s.total} correct</p><p className="text-sm font-semibold text-blue-700">{s.percentage}%</p></div><p className="text-xs text-slate-500 mt-1">{s.note}</p></div>))}
                </div>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 5 Report</CardTitle>
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
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5"><h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3><p className="text-sm text-slate-700">This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {sectionSummaries.map((s) => (<div key={s.title} className="rounded-xl border border-blue-100 bg-white p-4"><p className="text-base font-semibold text-blue-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.description}</p><div className="mt-3 flex items-center justify-between"><p className="text-sm text-slate-700">{s.correct}/{s.total} correct</p><p className="text-sm font-semibold text-blue-700">{s.percentage}%</p></div><p className="text-xs text-slate-500 mt-1">{s.note}</p></div>))}
              </div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2"><p className="font-semibold text-slate-800">Question {index + 1}</p><span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{sectionConfig[q.type].title}</span></div>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 5</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
              <div className="flex items-center justify-between"><span className="text-sm font-medium text-blue-700 uppercase">{sectionConfig[question.type].title}</span><span className="text-sm text-gray-500">Question {currentQuestion + 1}</span></div>
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
