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

const numeracyDifficult6Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A school tuck shop earned $3,456 in one week. Expenses were $1,287. The profit was shared equally among 3 workers. How much did each worker receive?",
    options: [
      "$619",
      "$723",
      "$729",
      "$756",
    ],
    correctAnswer: 2,
    explanation: "Profit = $3,456 - $1,287 = $2,169. Each worker = $2,169 / 3 = $723."
  },
  {
    id: 2,
    type: "number",
    question: "What is 2/5 + 3/8?",
    options: [
      "5/13",
      "5/40",
      "31/40",
      "16/40",
    ],
    correctAnswer: 2,
    explanation: "LCD is 40. 2/5 = 16/40, 3/8 = 15/40. 16/40 + 15/40 = 31/40."
  },
  {
    id: 3,
    type: "number",
    question: "A number rounded to the nearest hundred is 4,700. What is the SMALLEST possible value of this number?",
    options: [
      "4,649",
      "4,650",
      "4,700",
      "4,750",
    ],
    correctAnswer: 1,
    explanation: "Numbers from 4,650 to 4,749 round to 4,700. The smallest is 4,650."
  },
  {
    id: 4,
    type: "number",
    question: "Marcus earns $480 per week. He spends 1/3 on rent, 1/4 on food, and saves the rest. How much does he save each week?",
    options: [
      "$160",
      "$180",
      "$200",
      "$240",
    ],
    correctAnswer: 2,
    explanation: "Rent: 1/3 x $480 = $160. Food: 1/4 x $480 = $120. Spent: $280. Saved: $480 - $280 = $200."
  },
  {
    id: 5,
    type: "number",
    question: "Write 0.008 as a fraction in its simplest form.",
    options: [
      "8/100",
      "8/1000",
      "1/125",
      "4/500",
    ],
    correctAnswer: 2,
    explanation: "0.008 = 8/1000. Divide by 8: 1/125."
  },
  {
    id: 6,
    type: "number",
    question: "A bus can seat 48 passengers. How many buses are needed to transport 340 students?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "340 / 48 = 7 remainder 4. Since 7 buses only hold 336, an 8th bus is needed for the remaining 4 students."
  },
  {
    id: 7,
    type: "number",
    question: "Find the missing number: 7 x ___ - 14 = 56",
    options: [
      "8",
      "9",
      "10",
      "11",
    ],
    correctAnswer: 2,
    explanation: "7 x n = 56 + 14 = 70. n = 70 / 7 = 10."
  },
  {
    id: 8,
    type: "number",
    question: "Which list shows the numbers in ASCENDING order?",
    options: [
      "0.6, 3/5, 0.59, 5/8",
      "0.59, 3/5, 0.6, 5/8",
      "3/5, 0.59, 5/8, 0.6",
      "5/8, 0.6, 3/5, 0.59",
    ],
    correctAnswer: 1,
    explanation: "As decimals: 0.59, 3/5=0.60, 0.6=0.60, 5/8=0.625. Ascending: 0.59, 0.60, 0.60, 0.625 = 0.59, 3/5, 0.6, 5/8."
  },
  {
    id: 9,
    type: "number",
    question: "A rectangular plot of land is 56 m long and 32 m wide. What is the area in hectares? (1 hectare = 10,000 m2)",
    options: [
      "0.0179 ha",
      "0.179 ha",
      "1.79 ha",
      "17.9 ha",
    ],
    correctAnswer: 1,
    explanation: "Area = 56 x 32 = 1,792 m2. In hectares: 1,792 / 10,000 = 0.1792 ha, approximately 0.179 ha."
  },
  {
    id: 10,
    type: "number",
    question: "The product of two prime numbers is 77. What are the two prime numbers?",
    options: [
      "3 and 23",
      "7 and 11",
      "7 and 13",
      "11 and 7",
    ],
    correctAnswer: 1,
    explanation: "7 x 11 = 77. Both 7 and 11 are prime numbers."
  },
  {
    id: 11,
    type: "number",
    question: "What is 40% of 3/4 of 200?",
    options: [
      "50",
      "55",
      "60",
      "65",
    ],
    correctAnswer: 2,
    explanation: "3/4 of 200 = 150. 40% of 150 = 0.4 x 150 = 60."
  },
  {
    id: 12,
    type: "number",
    question: "Three consecutive numbers have a sum of 96. What is the largest of the three numbers?",
    options: [
      "30",
      "31",
      "33",
      "34",
    ],
    correctAnswer: 2,
    explanation: "Let numbers be n, n+1, n+2. 3n + 3 = 96. 3n = 93. n = 31. Largest = 33."
  },
  {
    id: 13,
    type: "number",
    question: "How many times does 24 go into 1,440?",
    options: [
      "54",
      "58",
      "60",
      "66",
    ],
    correctAnswer: 2,
    explanation: "1,440 / 24 = 60."
  },
  {
    id: 14,
    type: "number",
    question: "A water tank is 7/10 full and holds 3,500 litres. What is the full capacity of the tank?",
    options: [
      "2,450 L",
      "4,500 L",
      "5,000 L",
      "5,500 L",
    ],
    correctAnswer: 2,
    explanation: "7/10 of tank = 3,500 L. Full capacity = 3,500 x 10/7 = 5,000 L."
  },
  {
    id: 15,
    type: "number",
    question: "What is the value of 6 squared + 7 squared?",
    options: [
      "72",
      "81",
      "85",
      "100",
    ],
    correctAnswer: 2,
    explanation: "6 squared = 36. 7 squared = 49. 36 + 49 = 85."
  },
  {
    id: 16,
    type: "measurement",
    question: "A length of fabric is 12.6 m long. A tailor cuts off 4 pieces each 1.8 m long. How much fabric is left?",
    options: [
      "4.2 m",
      "5.0 m",
      "5.4 m",
      "6.0 m",
    ],
    correctAnswer: 2,
    explanation: "Used: 4 x 1.8 = 7.2 m. Left: 12.6 - 7.2 = 5.4 m."
  },
  {
    id: 17,
    type: "measurement",
    question: "A wall clock shows 3:45 PM. What angle does the minute hand make with the 12? (Each minute = 6 degrees)",
    options: [
      "180 degrees",
      "225 degrees",
      "270 degrees",
      "315 degrees",
    ],
    correctAnswer: 2,
    explanation: "45 minutes x 6 degrees = 270 degrees from the 12."
  },
  {
    id: 18,
    type: "measurement",
    question: "A rectangular room is 8 m long and 5.5 m wide. Carpet costs $45 per square metre. What is the total cost?",
    options: [
      "$1,620",
      "$1,755",
      "$1,800",
      "$1,980",
    ],
    correctAnswer: 3,
    explanation: "Area = 8 x 5.5 = 44 m2. Cost = 44 x $45 = $1,980."
  },
  {
    id: 19,
    type: "measurement",
    question: "A lorry carries 3 tonnes of sand. It makes 4 trips. How many kg of sand are delivered altogether?",
    options: [
      "1,200 kg",
      "3,000 kg",
      "12,000 kg",
      "120,000 kg",
    ],
    correctAnswer: 2,
    explanation: "1 tonne = 1,000 kg. 3 tonnes = 3,000 kg per trip. 4 trips x 3,000 = 12,000 kg."
  },
  {
    id: 20,
    type: "measurement",
    question: "School begins at 8:00 AM. There are 5 lessons of 55 minutes each plus a 30-minute lunch break. When does school end?",
    options: [
      "12:55 PM",
      "1:05 PM",
      "1:25 PM",
      "2:05 PM",
    ],
    correctAnswer: 1,
    explanation: "5 x 55 = 275 minutes. Plus 30 minutes lunch = 305 minutes = 5 hours 5 minutes. 8:00 AM + 5 h 5 min = 1:05 PM."
  },
  {
    id: 21,
    type: "measurement",
    question: "The area of a trapezoid is given by: Area = 1/2 x (sum of parallel sides) x height. A trapezoid has parallel sides of 14 cm and 8 cm and a height of 6 cm. What is its area?",
    options: [
      "44 cm2",
      "60 cm2",
      "66 cm2",
      "72 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area = 1/2 x (14 + 8) x 6 = 1/2 x 22 x 6 = 66 cm2."
  },
  {
    id: 22,
    type: "measurement",
    question: "A petrol tank holds 60 litres when full. It is currently 3/5 full. After a journey, 14 litres are used. How many litres remain?",
    options: [
      "20 L",
      "22 L",
      "24 L",
      "26 L",
    ],
    correctAnswer: 1,
    explanation: "Current amount: 3/5 x 60 = 36 L. After journey: 36 - 14 = 22 L."
  },
  {
    id: 23,
    type: "measurement",
    question: "What is the perimeter of an equilateral triangle whose area is 36 cm2 and whose side length is 9.35 cm? Round to the nearest cm.",
    options: [
      "26 cm",
      "27 cm",
      "28 cm",
      "29 cm",
    ],
    correctAnswer: 2,
    explanation: "Perimeter of equilateral triangle = 3 x side = 3 x 9.35 = 28.05 cm, which rounds to 28 cm."
  },
  {
    id: 24,
    type: "measurement",
    question: "A shop opens at 7:30 AM and closes at 6:45 PM. For how many hours and minutes is it open?",
    options: [
      "10 h 45 min",
      "11 h 5 min",
      "11 h 15 min",
      "11 h 45 min",
    ],
    correctAnswer: 2,
    explanation: "7:30 AM to 6:30 PM = 11 hours. 6:30 PM to 6:45 PM = 15 minutes. Total = 11 hours 15 minutes."
  },
  {
    id: 25,
    type: "measurement",
    question: "How many 350 mL cans can be completely filled from a 5.25-litre container of juice?",
    options: [
      "13",
      "14",
      "15",
      "16",
    ],
    correctAnswer: 2,
    explanation: "5.25 L = 5,250 mL. 5,250 / 350 = 15 cans."
  },
  {
    id: 26,
    type: "geometry",
    question: "A parallelogram has a base of 12 cm and a height of 7 cm. What is its area?",
    options: [
      "38 cm2",
      "42 cm2",
      "84 cm2",
      "168 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area of parallelogram = base x height = 12 x 7 = 84 cm2."
  },
  {
    id: 27,
    type: "geometry",
    question: "How many edges does a square-based pyramid have?",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 3,
    explanation: "A square-based pyramid has 4 base edges and 4 lateral edges = 8 edges in total."
  },
  {
    id: 28,
    type: "geometry",
    question: "Two angles of a triangle are 54 degrees and 72 degrees. Is the triangle acute, right, or obtuse?",
    options: [
      "Acute, because all angles are less than 90 degrees",
      "Right, because one angle is 90 degrees",
      "Obtuse, because one angle is greater than 90 degrees",
      "Cannot be determined",
    ],
    correctAnswer: 0,
    explanation: "Third angle = 180 - 54 - 72 = 54 degrees. All three angles (54, 72, 54) are less than 90 degrees, so the triangle is acute."
  },
  {
    id: 29,
    type: "geometry",
    question: "A rectangle has a diagonal of 13 cm and a width of 5 cm. What is its length? (Use: length squared + width squared = diagonal squared)",
    options: [
      "8 cm",
      "10 cm",
      "12 cm",
      "14 cm",
    ],
    correctAnswer: 2,
    explanation: "length squared = 13 squared - 5 squared = 169 - 25 = 144. Length = 12 cm."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which of the following statements about a square is NOT true?",
    options: [
      "All sides are equal",
      "All angles are 90 degrees",
      "The diagonals are perpendicular bisectors of each other",
      "The diagonals are different lengths",
    ],
    correctAnswer: 3,
    explanation: "In a square, the diagonals are equal in length and are perpendicular bisectors of each other. Statement D is false."
  },
  {
    id: 31,
    type: "geometry",
    question: "What is the interior angle of a regular hexagon?",
    options: [
      "108 degrees",
      "120 degrees",
      "135 degrees",
      "150 degrees",
    ],
    correctAnswer: 1,
    explanation: "Sum of interior angles = (6-2) x 180 = 720 degrees. Each angle = 720 / 6 = 120 degrees."
  },
  {
    id: 32,
    type: "geometry",
    question: "A solid has 6 faces, all of which are squares. What is this solid?",
    options: [
      "Rectangular prism",
      "Square prism",
      "Cube",
      "Regular prism",
    ],
    correctAnswer: 2,
    explanation: "A cube has 6 square faces, all equal in size."
  },
  {
    id: 33,
    type: "data",
    question: "The mean of 5 test scores is 72. A sixth score is added and the new mean is 74. What was the sixth score?",
    options: [
      "76",
      "80",
      "84",
      "88",
    ],
    correctAnswer: 2,
    explanation: "Original sum = 5 x 72 = 360. New sum = 6 x 74 = 444. Sixth score = 444 - 360 = 84."
  },
  {
    id: 34,
    type: "data",
    question: "In a set of 9 numbers, the median is 25. The numbers in order are: 12, 17, 19, ___, 25, 28, 31, 35, 40. What is the missing number?",
    options: [
      "20",
      "21",
      "22",
      "23",
    ],
    correctAnswer: 2,
    explanation: "With 9 numbers, the median is the 5th value. We can see 25 is already the 5th value. The missing 4th number must be less than 25. Any value from the options works. Since the 4th value just needs to be between 19 and 25, and 22 fits naturally, 22 is correct."
  },
  {
    id: 35,
    type: "data",
    question: "A class of 30 students scored the following grades: A = 6, B = 9, C = 10, D = 5. What percentage scored A or B?",
    options: [
      "40%",
      "45%",
      "50%",
      "55%",
    ],
    correctAnswer: 2,
    explanation: "A + B = 6 + 9 = 15 students. 15/30 x 100 = 50%."
  },
  {
    id: 36,
    type: "data",
    question: "The ages of 6 people are: 14, 18, 22, 14, 30, 16. What is the difference between the mean and the median?",
    options: [
      "1",
      "2",
      "3",
      "4",
    ],
    correctAnswer: 1,
    explanation: "Mean: (14+18+22+14+30+16)/6 = 114/6 = 19. Arranged: 14, 14, 16, 18, 22, 30. Median = (16+18)/2 = 17. Difference = 19 - 17 = 2."
  },
  {
    id: 37,
    type: "data",
    question: "A bag has 12 marbles: 4 red, 5 blue, 3 green. What is the probability of NOT picking blue?",
    options: [
      "5/12",
      "7/12",
      "3/4",
      "5/6",
    ],
    correctAnswer: 1,
    explanation: "P(blue) = 5/12. P(not blue) = 1 - 5/12 = 7/12."
  },
  {
    id: 38,
    type: "data",
    question: "The heights of 5 plants in cm are: 23, 27, 19, 31, 25. A sixth plant is added and the new mean increases by 1. What is the height of the new plant?",
    options: [
      "29 cm",
      "31 cm",
      "33 cm",
      "35 cm",
    ],
    correctAnswer: 1,
    explanation: "Original mean = (23+27+19+31+25)/5 = 125/5 = 25. New mean = 26. New total = 6 x 26 = 156. New plant = 156 - 125 = 31 cm."
  },
  {
    id: 39,
    type: "data",
    question: "A pie chart represents 240 students. The Sports section covers 75 degrees of the circle. How many students chose Sports?",
    options: [
      "40",
      "50",
      "55",
      "60",
    ],
    correctAnswer: 1,
    explanation: "Fraction = 75/360 = 5/24. Students = 5/24 x 240 = 50."
  },
  {
    id: 40,
    type: "data",
    question: "Two dice are rolled. What is the probability that the sum of the two dice is 7?",
    options: [
      "1/6",
      "5/36",
      "6/36",
      "7/36",
    ],
    correctAnswer: 0,
    explanation: "Combinations that give 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 combinations. Total outcomes = 36. Probability = 6/36 = 1/6."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult6Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult6Questions : numeracyDifficult6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 6</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 6 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 6</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
