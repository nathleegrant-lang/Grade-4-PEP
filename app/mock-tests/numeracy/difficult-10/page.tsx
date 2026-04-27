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

const numeracyDifficult10Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A store sells 3 types of fruit in the ratio mango:orange:pineapple = 5:3:2. If 480 fruits are sold in total, how many more mangoes than pineapples are sold?",
    options: [
      "96",
      "108",
      "120",
      "144",
    ],
    correctAnswer: 3,
    explanation: "Total parts = 10. Each part = 48. Mangoes = 5 x 48 = 240. Pineapples = 2 x 48 = 96. Difference = 240 - 96 = 144."
  },
  {
    id: 2,
    type: "number",
    question: "What is 3 and 1/3 + 2 and 3/4 - 1 and 5/6?",
    options: [
      "4 and 1/4",
      "4 and 1/6",
      "4 and 1/12",
      "4 and 5/12",
    ],
    correctAnswer: 0,
    explanation: "LCD = 12. 3 4/12 + 2 9/12 - 1 10/12 = (3+2-1) + (4+9-10)/12 = 4 and 3/12 = 4 and 1/4."
  },
  {
    id: 3,
    type: "number",
    question: "A car travels 120 km in 1.5 hours and then 80 km in 1 hour. What is the average speed for the whole journey?",
    options: [
      "80 km/h",
      "84 km/h",
      "88 km/h",
      "100 km/h",
    ],
    correctAnswer: 0,
    explanation: "Total distance = 200 km. Total time = 2.5 hours. Average speed = 200/2.5 = 80 km/h."
  },
  {
    id: 4,
    type: "number",
    question: "What is the remainder when 4,561 is divided by 17?",
    options: [
      "3",
      "5",
      "7",
      "9",
    ],
    correctAnswer: 1,
    explanation: "17 x 268 = 4,556. 4,561 - 4,556 = 5. Remainder = 5."
  },
  {
    id: 5,
    type: "number",
    question: "The sum of the digits of a 3-digit number is 18. The units digit is 6 and the hundreds digit is twice the tens digit. What is the number?",
    options: [
      "468",
      "486",
      "648",
      "846",
    ],
    correctAnswer: 3,
    explanation: "h + t + 6 = 18, so h + t = 12. h = 2t. 2t + t = 12. t = 4, h = 8. Number = 846."
  },
  {
    id: 6,
    type: "number",
    question: "A bank account earns simple interest at 8% per year. If $2,500 is deposited, how much interest is earned in 3 years?",
    options: [
      "$400",
      "$500",
      "$600",
      "$700",
    ],
    correctAnswer: 2,
    explanation: "Simple interest = Principal x Rate x Time / 100 = 2,500 x 8 x 3 / 100 = $600."
  },
  {
    id: 7,
    type: "number",
    question: "What is the LCM of 4, 6, and 9?",
    options: [
      "18",
      "24",
      "36",
      "72",
    ],
    correctAnswer: 2,
    explanation: "LCM(4,6) = 12. LCM(12,9): 12 = 4x3, 9 = 3 squared. LCM = 4 x 9 = 36."
  },
  {
    id: 8,
    type: "number",
    question: "If a = 3 and b = -2, find the value of 2a squared - 3b + 4.",
    options: [
      "22",
      "26",
      "28",
      "30",
    ],
    correctAnswer: 2,
    explanation: "2(3 squared) - 3(-2) + 4 = 2(9) + 6 + 4 = 18 + 6 + 4 = 28."
  },
  {
    id: 9,
    type: "number",
    question: "A sale reduces prices by 25%. A customer buys 3 items originally priced at $40, $60, and $80. How much does the customer pay in total?",
    options: [
      "$130",
      "$135",
      "$140",
      "$145",
    ],
    correctAnswer: 1,
    explanation: "Original total: $40+$60+$80 = $180. After 25% off: $180 x 0.75 = $135."
  },
  {
    id: 10,
    type: "number",
    question: "What is the value of sqrt(144) + cube root of 27?",
    options: [
      "12",
      "15",
      "17",
      "21",
    ],
    correctAnswer: 1,
    explanation: "sqrt(144) = 12. Cube root of 27 = 3. 12 + 3 = 15."
  },
  {
    id: 11,
    type: "number",
    question: "A car uses 1 litre of petrol for every 14 km. A full tank holds 56 litres. After travelling 392 km, what fraction of the tank remains?",
    options: [
      "1/4",
      "1/3",
      "1/2",
      "2/3",
    ],
    correctAnswer: 2,
    explanation: "Litres used = 392/14 = 28 litres. Remaining = 56 - 28 = 28 litres. Fraction = 28/56 = 1/2."
  },
  {
    id: 12,
    type: "number",
    question: "The product of two numbers is 1,440. Their HCF is 12. What is their LCM?",
    options: [
      "100",
      "110",
      "120",
      "130",
    ],
    correctAnswer: 2,
    explanation: "LCM x HCF = product of the two numbers. LCM = 1,440 / 12 = 120."
  },
  {
    id: 13,
    type: "number",
    question: "A recipe uses 2/3 cup of sugar for every 1 cup of flour. If 4 and 1/2 cups of flour are used, how much sugar is needed?",
    options: [
      "2 cups",
      "2 and 1/3 cups",
      "3 cups",
      "3 and 1/4 cups",
    ],
    correctAnswer: 2,
    explanation: "Sugar = 2/3 x 4.5 = 2/3 x 9/2 = 18/6 = 3 cups."
  },
  {
    id: 14,
    type: "number",
    question: "A ball is dropped from 160 cm. Each time it bounces, it rises to 5/8 of its previous height. How high does it rise after the 2nd bounce?",
    options: [
      "50 cm",
      "62.5 cm",
      "80 cm",
      "100 cm",
    ],
    correctAnswer: 1,
    explanation: "After 1st bounce: 5/8 x 160 = 100 cm. After 2nd bounce: 5/8 x 100 = 62.5 cm."
  },
  {
    id: 15,
    type: "number",
    question: "What is 0.06 x 0.007 x 1,000?",
    options: [
      "0.042",
      "0.42",
      "4.2",
      "42",
    ],
    correctAnswer: 1,
    explanation: "0.06 x 0.007 = 0.00042. x 1,000 = 0.42."
  },
  {
    id: 16,
    type: "measurement",
    question: "A cylindrical can has a diameter of 8 cm and a height of 15 cm. What is its volume? (Use pi = 3.14)",
    options: [
      "753.6 cm3",
      "804.2 cm3",
      "942.0 cm3",
      "1,507.2 cm3",
    ],
    correctAnswer: 0,
    explanation: "Radius = 4 cm. V = 3.14 x 16 x 15 = 3.14 x 240 = 753.6 cm3."
  },
  {
    id: 17,
    type: "measurement",
    question: "A wall is 4.5 m long and 3 m high. A window 1.2 m x 0.9 m is cut from the wall. What is the remaining wall area?",
    options: [
      "11.7 m2",
      "12.0 m2",
      "12.42 m2",
      "13.5 m2",
    ],
    correctAnswer: 2,
    explanation: "Wall: 4.5 x 3 = 13.5 m2. Window: 1.2 x 0.9 = 1.08 m2. Remaining: 13.5 - 1.08 = 12.42 m2."
  },
  {
    id: 18,
    type: "measurement",
    question: "A train travels 270 km at 90 km/h, then 200 km at 80 km/h. What is the total time for the journey?",
    options: [
      "5 h",
      "5 h 30 min",
      "6 h",
      "6 h 30 min",
    ],
    correctAnswer: 1,
    explanation: "First leg: 270/90 = 3 hours. Second leg: 200/80 = 2.5 hours. Total = 5.5 hours = 5 h 30 min."
  },
  {
    id: 19,
    type: "measurement",
    question: "Find the area of a semicircle with diameter 20 cm. (Use pi = 3.14)",
    options: [
      "62.8 cm2",
      "157 cm2",
      "314 cm2",
      "628 cm2",
    ],
    correctAnswer: 1,
    explanation: "Radius = 10 cm. Area of full circle = 3.14 x 100 = 314 cm2. Semicircle = 314/2 = 157 cm2."
  },
  {
    id: 20,
    type: "measurement",
    question: "A compound shape consists of a rectangle 12 cm x 8 cm with a triangle on top that has the same base (12 cm) and a height of 5 cm. What is the total area?",
    options: [
      "96 cm2",
      "102 cm2",
      "114 cm2",
      "126 cm2",
    ],
    correctAnswer: 3,
    explanation: "Rectangle: 12 x 8 = 96 cm2. Triangle: 1/2 x 12 x 5 = 30 cm2. Total = 96 + 30 = 126 cm2."
  },
  {
    id: 21,
    type: "measurement",
    question: "A school canteen serves 450 students in 1.5 hours. At this rate, how long (in minutes) would it take to serve 600 students?",
    options: [
      "100 min",
      "105 min",
      "110 min",
      "120 min",
    ],
    correctAnswer: 3,
    explanation: "Rate: 450/90 min = 5 students per minute. Time for 600: 600/5 = 120 minutes."
  },
  {
    id: 22,
    type: "measurement",
    question: "How many cubic centimetres are in 2.75 litres?",
    options: [
      "275 cm3",
      "2,075 cm3",
      "2,750 cm3",
      "27,500 cm3",
    ],
    correctAnswer: 2,
    explanation: "1 litre = 1,000 cm3. 2.75 x 1,000 = 2,750 cm3."
  },
  {
    id: 23,
    type: "measurement",
    question: "A fence is built around a square field with area 625 m2. Fencing costs $18 per metre. What is the total cost?",
    options: [
      "$1,440",
      "$1,620",
      "$1,800",
      "$2,025",
    ],
    correctAnswer: 2,
    explanation: "Side = sqrt(625) = 25 m. Perimeter = 4 x 25 = 100 m. Cost = 100 x $18 = $1,800."
  },
  {
    id: 24,
    type: "measurement",
    question: "Car A leaves town at 9:00 AM at 60 km/h. Car B leaves the same town at 10:00 AM at 80 km/h on the same road. At what time does Car B overtake Car A?",
    options: [
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
    ],
    correctAnswer: 2,
    explanation: "At 10:00 AM, Car A has a 60 km head start. Car B gains (80-60)=20 km/h. Time to close: 60/20=3 hours after 10:00 AM = 1:00 PM."
  },
  {
    id: 25,
    type: "measurement",
    question: "The surface area of a cube is 96 cm2. What is its volume?",
    options: [
      "16 cm3",
      "32 cm3",
      "64 cm3",
      "128 cm3",
    ],
    correctAnswer: 2,
    explanation: "6 x s squared = 96. s squared = 16. s = 4 cm. Volume = 4 cubed = 64 cm3."
  },
  {
    id: 26,
    type: "geometry",
    question: "In triangle PQR, angle P = 48 degrees and angle Q = 67 degrees. What is the size of the exterior angle at R?",
    options: [
      "65 degrees",
      "75 degrees",
      "105 degrees",
      "115 degrees",
    ],
    correctAnswer: 3,
    explanation: "Angle R = 180 - 48 - 67 = 65 degrees. Exterior angle = 180 - 65 = 115 degrees."
  },
  {
    id: 27,
    type: "geometry",
    question: "A circle has circumference 44 cm. What is its area? (Use pi = 22/7)",
    options: [
      "77 cm2",
      "99 cm2",
      "121 cm2",
      "154 cm2",
    ],
    correctAnswer: 3,
    explanation: "C = 2 pi r = 44. r = 44/(2 x 22/7) = 44 x 7/44 = 7 cm. Area = 22/7 x 49 = 154 cm2."
  },
  {
    id: 28,
    type: "geometry",
    question: "The diagonal of a square is 10 cm. What is the perimeter of the square?",
    options: [
      "20 cm",
      "20 sqrt2 cm",
      "28.28 cm",
      "40 cm",
    ],
    correctAnswer: 2,
    explanation: "Side = diagonal / sqrt(2) = 10/1.414 = 7.07 cm. Perimeter = 4 x 7.07 = 28.28 cm."
  },
  {
    id: 29,
    type: "geometry",
    question: "Two angles of a triangle are in the ratio 2:3. The third angle is 50 degrees. What are the other two angles?",
    options: [
      "50 and 80 degrees",
      "52 and 78 degrees",
      "48 and 82 degrees",
      "40 and 90 degrees",
    ],
    correctAnswer: 1,
    explanation: "Remaining = 180 - 50 = 130 degrees. In ratio 2:3, total parts = 5. Each part = 26 degrees. Angles = 52 and 78 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "What is the volume of a cone with radius 6 cm and height 14 cm? (Use pi = 22/7)",
    options: [
      "528 cm3",
      "616 cm3",
      "792 cm3",
      "924 cm3",
    ],
    correctAnswer: 0,
    explanation: "(1/3) x (22/7) x 36 x 14 = (1/3) x 22 x 36 x 2 = (1/3) x 1,584 = 528 cm3."
  },
  {
    id: 31,
    type: "geometry",
    question: "In a regular polygon, each interior angle is 150 degrees. How many sides does the polygon have?",
    options: [
      "8",
      "10",
      "12",
      "15",
    ],
    correctAnswer: 2,
    explanation: "Each exterior angle = 180 - 150 = 30 degrees. Number of sides = 360/30 = 12."
  },
  {
    id: 32,
    type: "geometry",
    question: "The angles of a quadrilateral are in the ratio 1:2:3:4. What is the size of the largest angle?",
    options: [
      "108 degrees",
      "120 degrees",
      "144 degrees",
      "160 degrees",
    ],
    correctAnswer: 2,
    explanation: "Sum = 360. Total parts = 10. Each part = 36 degrees. Largest = 4 x 36 = 144 degrees."
  },
  {
    id: 33,
    type: "data",
    question: "The mean of 8 numbers is 32. When a 9th number is added, the mean becomes 34. What is the 9th number?",
    options: [
      "48",
      "50",
      "52",
      "54",
    ],
    correctAnswer: 1,
    explanation: "Original sum = 8 x 32 = 256. New sum = 9 x 34 = 306. 9th number = 306 - 256 = 50."
  },
  {
    id: 34,
    type: "data",
    question: "In a data set, Q1 = 18 and Q3 = 36. What is the interquartile range?",
    options: [
      "9",
      "18",
      "27",
      "54",
    ],
    correctAnswer: 1,
    explanation: "IQR = Q3 - Q1 = 36 - 18 = 18."
  },
  {
    id: 35,
    type: "data",
    question: "A school has 300 students. A stratified sample of 60 is taken. There are 90 students in Year 4. How many Year 4 students should be in the sample?",
    options: [
      "12",
      "15",
      "18",
      "20",
    ],
    correctAnswer: 2,
    explanation: "Proportion = 90/300 = 3/10. Year 4 in sample = 3/10 x 60 = 18."
  },
  {
    id: 36,
    type: "data",
    question: "The frequency table shows: Score 5 (freq 2), Score 6 (freq 5), Score 7 (freq 6), Score 8 (freq 4), Score 9 (freq 3). What is the modal score?",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: "The modal score is the one with the highest frequency. Score 7 has frequency 6, the highest."
  },
  {
    id: 37,
    type: "data",
    question: "Two fair dice are rolled. What is the probability of getting a total of 10 or more?",
    options: [
      "1/6",
      "7/36",
      "5/36",
      "1/4",
    ],
    correctAnswer: 0,
    explanation: "Totals of 10+: (4,6),(5,5),(6,4),(5,6),(6,5),(6,6) = 6 combinations out of 36. P = 6/36 = 1/6."
  },
  {
    id: 38,
    type: "data",
    question: "The weights (kg) of 10 students are: 38, 42, 35, 47, 42, 51, 38, 46, 42, 39. What is the mode?",
    options: [
      "38",
      "39",
      "42",
      "46",
    ],
    correctAnswer: 2,
    explanation: "42 appears 3 times, which is more than any other value."
  },
  {
    id: 39,
    type: "data",
    question: "A line graph shows temperature at: 6 AM = 18C, 9 AM = 22C, 12 PM = 28C, 3 PM = 31C, 6 PM = 26C. What was the mean temperature for the day?",
    options: [
      "24.0 C",
      "24.5 C",
      "25.0 C",
      "25.5 C",
    ],
    correctAnswer: 2,
    explanation: "Sum: 18+22+28+31+26 = 125. Mean = 125/5 = 25.0 degrees C."
  },
  {
    id: 40,
    type: "data",
    question: "A biased coin is tossed. P(heads) = 3/5. The coin is tossed twice. What is the probability of getting exactly one head?",
    options: [
      "6/25",
      "12/25",
      "9/25",
      "3/5",
    ],
    correctAnswer: 1,
    explanation: "P(head then tail) = 3/5 x 2/5 = 6/25. P(tail then head) = 2/5 x 3/5 = 6/25. P(exactly one head) = 6/25 + 6/25 = 12/25."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult10Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult10Questions : numeracyDifficult10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 10</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 10 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 10</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
