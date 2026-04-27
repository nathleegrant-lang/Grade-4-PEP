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

const numeracyDifficult8Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A baker uses 0.75 kg of flour per loaf. She has 15 kg of flour. After baking as many loaves as possible, how much flour is left over?",
    options: [
      "0 kg",
      "0.25 kg",
      "0.5 kg",
      "0.75 kg",
    ],
    correctAnswer: 0,
    explanation: "15 / 0.75 = 20 loaves exactly. Remainder = 0 kg."
  },
  {
    id: 2,
    type: "number",
    question: "What is 2/5 x 3/4 x 10/9?",
    options: [
      "1/3",
      "1/4",
      "5/12",
      "1/2",
    ],
    correctAnswer: 0,
    explanation: "(2 x 3 x 10) / (5 x 4 x 9) = 60/180 = 1/3."
  },
  {
    id: 3,
    type: "number",
    question: "A price increases from $80 to $100. What is the percentage increase?",
    options: [
      "20%",
      "22%",
      "25%",
      "28%",
    ],
    correctAnswer: 2,
    explanation: "Increase = $20. Percentage = (20/80) x 100 = 25%."
  },
  {
    id: 4,
    type: "number",
    question: "What is 4 and 2/3 divided by 1 and 1/6?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: "4 2/3 = 14/3. 1 1/6 = 7/6. Division: 14/3 / (7/6) = 14/3 x 6/7 = 84/21 = 4."
  },
  {
    id: 5,
    type: "number",
    question: "The sum of three numbers is 252. The second number is twice the first, and the third is three times the first. What is the largest number?",
    options: [
      "36",
      "72",
      "108",
      "126",
    ],
    correctAnswer: 3,
    explanation: "Let first = n. n + 2n + 3n = 6n = 252. n = 42. Largest = 3n = 3 x 42 = 126."
  },
  {
    id: 6,
    type: "number",
    question: "A car depreciates in value by 15% per year. If it is worth $40,000 now, what will it be worth after 2 years?",
    options: [
      "$26,000",
      "$28,900",
      "$30,600",
      "$34,000",
    ],
    correctAnswer: 1,
    explanation: "After year 1: $40,000 x 0.85 = $34,000. After year 2: $34,000 x 0.85 = $28,900."
  },
  {
    id: 7,
    type: "number",
    question: "What is the value of 48 / (2 x 3) + 5 squared - 7?",
    options: [
      "22",
      "26",
      "30",
      "34",
    ],
    correctAnswer: 1,
    explanation: "48 / (2 x 3) = 48/6 = 8. 5 squared = 25. 8 + 25 - 7 = 26."
  },
  {
    id: 8,
    type: "number",
    question: "A cinema sells adult tickets for $12 and child tickets for $8. On Saturday, 150 adult and 200 child tickets were sold. What was the total revenue?",
    options: [
      "$3,200",
      "$3,400",
      "$3,600",
      "$4,000",
    ],
    correctAnswer: 1,
    explanation: "Adults: 150 x $12 = $1,800. Children: 200 x $8 = $1,600. Total = $3,400."
  },
  {
    id: 9,
    type: "number",
    question: "Order these numbers from largest to smallest: 0.7, 3/5, 2/3, 0.65",
    options: [
      "0.7, 2/3, 0.65, 3/5",
      "2/3, 0.7, 3/5, 0.65",
      "0.7, 0.65, 2/3, 3/5",
      "3/5, 0.65, 2/3, 0.7",
    ],
    correctAnswer: 0,
    explanation: "As decimals: 0.7, 0.6, 0.667, 0.65. Descending: 0.7, 0.667=2/3, 0.65, 0.6=3/5."
  },
  {
    id: 10,
    type: "number",
    question: "A tank holds 800 litres when full. It is currently 5/8 full. 100 litres is then added. What fraction of the tank is now full?",
    options: [
      "3/4",
      "6/8",
      "7/8",
      "9/10",
    ],
    correctAnswer: 0,
    explanation: "Current: 5/8 x 800 = 500 L. After adding 100: 600 L. Fraction: 600/800 = 3/4."
  },
  {
    id: 11,
    type: "number",
    question: "What number is exactly halfway between 3.8 and 4.6?",
    options: [
      "4.0",
      "4.1",
      "4.2",
      "4.3",
    ],
    correctAnswer: 2,
    explanation: "Halfway = (3.8 + 4.6) / 2 = 8.4 / 2 = 4.2."
  },
  {
    id: 12,
    type: "number",
    question: "A recipe for 4 people uses 320 g of rice. How many grams are needed for 7 people?",
    options: [
      "480 g",
      "520 g",
      "560 g",
      "600 g",
    ],
    correctAnswer: 2,
    explanation: "Per person: 320 / 4 = 80 g. For 7: 80 x 7 = 560 g."
  },
  {
    id: 13,
    type: "number",
    question: "What is 7.2 / 0.09?",
    options: [
      "8",
      "80",
      "800",
      "0.8",
    ],
    correctAnswer: 1,
    explanation: "7.2 / 0.09 = 720 / 9 = 80."
  },
  {
    id: 14,
    type: "number",
    question: "A number multiplied by itself gives 196. What is the number?",
    options: [
      "12",
      "13",
      "14",
      "15",
    ],
    correctAnswer: 2,
    explanation: "14 x 14 = 196. The square root of 196 = 14."
  },
  {
    id: 15,
    type: "number",
    question: "In a class, the ratio of boys to girls is 4:3. There are 28 boys. How many students are in the class altogether?",
    options: [
      "42",
      "49",
      "56",
      "63",
    ],
    correctAnswer: 1,
    explanation: "If 4 parts = 28 boys, then 1 part = 7. Girls = 3 x 7 = 21. Total = 28 + 21 = 49."
  },
  {
    id: 16,
    type: "measurement",
    question: "A container is 40 cm long, 30 cm wide, and 20 cm deep. What is its capacity in litres? (1 litre = 1,000 cm3)",
    options: [
      "12 L",
      "24 L",
      "240 L",
      "2,400 L",
    ],
    correctAnswer: 1,
    explanation: "Volume = 40 x 30 x 20 = 24,000 cm3. In litres: 24,000 / 1,000 = 24 L."
  },
  {
    id: 17,
    type: "measurement",
    question: "A flight departs at 9:35 PM and arrives at 6:20 AM the next morning. How long is the flight?",
    options: [
      "7 h 35 min",
      "8 h 25 min",
      "8 h 45 min",
      "9 h 15 min",
    ],
    correctAnswer: 2,
    explanation: "9:35 PM to midnight = 2 h 25 min. Midnight to 6:20 AM = 6 h 20 min. Total = 2 h 25 min + 6 h 20 min = 8 h 45 min."
  },
  {
    id: 18,
    type: "measurement",
    question: "A square room has an area of 144 m2. What is the perimeter of the room?",
    options: [
      "36 m",
      "40 m",
      "48 m",
      "56 m",
    ],
    correctAnswer: 2,
    explanation: "Side = sqrt(144) = 12 m. Perimeter = 4 x 12 = 48 m."
  },
  {
    id: 19,
    type: "measurement",
    question: "How many 250 mL glasses can be filled from 3.5 litres of water?",
    options: [
      "12",
      "13",
      "14",
      "15",
    ],
    correctAnswer: 2,
    explanation: "3.5 L = 3,500 mL. 3,500 / 250 = 14."
  },
  {
    id: 20,
    type: "measurement",
    question: "A triangle has a base of 16 cm and an area of 88 cm2. What is the height of the triangle?",
    options: [
      "9 cm",
      "10 cm",
      "11 cm",
      "12 cm",
    ],
    correctAnswer: 2,
    explanation: "Area = 1/2 x base x height. 88 = 1/2 x 16 x h. 88 = 8h. h = 11 cm."
  },
  {
    id: 21,
    type: "measurement",
    question: "A car travels 252 km on 18 litres of petrol. How far can it travel on 25 litres?",
    options: [
      "325 km",
      "340 km",
      "350 km",
      "375 km",
    ],
    correctAnswer: 2,
    explanation: "Per litre: 252/18 = 14 km. For 25 litres: 14 x 25 = 350 km."
  },
  {
    id: 22,
    type: "measurement",
    question: "A clock gains 2 minutes every hour. If it shows the correct time at noon, what time will it show when the real time is 6:00 PM?",
    options: [
      "6:08 PM",
      "6:10 PM",
      "6:12 PM",
      "6:14 PM",
    ],
    correctAnswer: 2,
    explanation: "6 hours pass. Clock gains 6 x 2 = 12 minutes. It shows 6:12 PM."
  },
  {
    id: 23,
    type: "measurement",
    question: "A rectangular plot is 24 m x 18 m. A square flower bed 6 m x 6 m is in one corner. What is the remaining area?",
    options: [
      "396 m2",
      "400 m2",
      "414 m2",
      "432 m2",
    ],
    correctAnswer: 0,
    explanation: "Rectangle: 24 x 18 = 432 m2. Square: 6 x 6 = 36 m2. Remaining: 432 - 36 = 396 m2."
  },
  {
    id: 24,
    type: "measurement",
    question: "What is the volume of a cylinder with radius 5 cm and height 10 cm? (Use pi = 3.14)",
    options: [
      "314 cm3",
      "785 cm3",
      "1,570 cm3",
      "2,140 cm3",
    ],
    correctAnswer: 1,
    explanation: "V = pi x r squared x h = 3.14 x 25 x 10 = 785 cm3."
  },
  {
    id: 25,
    type: "measurement",
    question: "A lorry travels 416 km in 5.2 hours. What is its average speed in km/h?",
    options: [
      "72 km/h",
      "75 km/h",
      "78 km/h",
      "80 km/h",
    ],
    correctAnswer: 3,
    explanation: "Speed = 416 / 5.2 = 80 km/h."
  },
  {
    id: 26,
    type: "geometry",
    question: "A circle has a circumference of 62.8 cm. What is its radius? (Use pi = 3.14)",
    options: [
      "5 cm",
      "8 cm",
      "10 cm",
      "20 cm",
    ],
    correctAnswer: 2,
    explanation: "C = 2 x pi x r. 62.8 = 2 x 3.14 x r. r = 62.8 / 6.28 = 10 cm."
  },
  {
    id: 27,
    type: "geometry",
    question: "What is the sum of the interior angles of a hexagon?",
    options: [
      "540 degrees",
      "600 degrees",
      "720 degrees",
      "900 degrees",
    ],
    correctAnswer: 2,
    explanation: "(6-2) x 180 = 4 x 180 = 720 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "A rectangle is 12 cm long and 5 cm wide. What is the length of its diagonal?",
    options: [
      "11 cm",
      "12 cm",
      "13 cm",
      "14 cm",
    ],
    correctAnswer: 2,
    explanation: "Diagonal = sqrt(12 squared + 5 squared) = sqrt(144 + 25) = sqrt(169) = 13 cm."
  },
  {
    id: 29,
    type: "geometry",
    question: "Two parallel lines are cut by a transversal. One co-interior angle is 65 degrees. What is the other co-interior angle?",
    options: [
      "65 degrees",
      "90 degrees",
      "115 degrees",
      "125 degrees",
    ],
    correctAnswer: 2,
    explanation: "Co-interior angles (same side of transversal) are supplementary: they add up to 180 degrees. 180 - 65 = 115 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "A regular polygon has interior angles of 135 degrees. How many sides does it have?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "Each exterior angle = 180 - 135 = 45 degrees. Number of sides = 360 / 45 = 8 sides."
  },
  {
    id: 31,
    type: "geometry",
    question: "What is the area of a circle with diameter 14 cm? (Use pi = 22/7)",
    options: [
      "44 cm2",
      "88 cm2",
      "154 cm2",
      "176 cm2",
    ],
    correctAnswer: 2,
    explanation: "Radius = 7 cm. Area = (22/7) x 7 squared = (22/7) x 49 = 22 x 7 = 154 cm2."
  },
  {
    id: 32,
    type: "geometry",
    question: "Which of the following is a property of a trapezoid that is NOT a property of a parallelogram?",
    options: [
      "Opposite sides are parallel",
      "Has at least one pair of parallel sides",
      "Both pairs of opposite sides are parallel",
      "Diagonals bisect each other",
    ],
    correctAnswer: 1,
    explanation: "A trapezoid has exactly one pair of parallel sides. A parallelogram has two pairs. The key difference is that a trapezoid has AT LEAST one pair while a parallelogram has BOTH pairs."
  },
  {
    id: 33,
    type: "data",
    question: "A set of numbers has mean = 20, mode = 18, and median = 19. Which statement is most likely TRUE?",
    options: [
      "The data is symmetrically distributed",
      "There are more high values pulling the mean up",
      "There is only one value above 20",
      "The mean and median are equal",
    ],
    correctAnswer: 1,
    explanation: "When mean > median > mode, the distribution is positively skewed, meaning high values are pulling the mean upward."
  },
  {
    id: 34,
    type: "data",
    question: "In a survey of 120 students, 3/8 prefer Science, 1/4 prefer Maths, and the rest prefer English. How many prefer English?",
    options: [
      "40",
      "42",
      "44",
      "45",
    ],
    correctAnswer: 3,
    explanation: "Science: 3/8 x 120 = 45. Maths: 1/4 x 120 = 30. English = 120 - 45 - 30 = 45."
  },
  {
    id: 35,
    type: "data",
    question: "A die is rolled once. What is the probability of getting a prime number?",
    options: [
      "1/3",
      "1/2",
      "2/3",
      "3/4",
    ],
    correctAnswer: 1,
    explanation: "Prime numbers on a die: 2, 3, 5 = 3 primes. Total outcomes = 6. P = 3/6 = 1/2."
  },
  {
    id: 36,
    type: "data",
    question: "The range of a data set is 24. If each value is doubled, what is the new range?",
    options: [
      "12",
      "24",
      "36",
      "48",
    ],
    correctAnswer: 3,
    explanation: "When all values are doubled, the range doubles too. New range = 24 x 2 = 48."
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph shows: Jamaica = 4 symbols, Trinidad = 2.5 symbols, Barbados = 1.5 symbols. Each symbol = 8 thousands of tourists. How many thousands of tourists visited Jamaica and Trinidad combined?",
    options: [
      "44",
      "48",
      "52",
      "56",
    ],
    correctAnswer: 2,
    explanation: "Jamaica: 4 x 8 = 32. Trinidad: 2.5 x 8 = 20. Total = 52 thousand tourists."
  },
  {
    id: 38,
    type: "data",
    question: "Find the mean of this frequency table: Score 2 (freq 3), Score 4 (freq 5), Score 6 (freq 2)",
    options: [
      "3.5",
      "3.8",
      "4.0",
      "4.2",
    ],
    correctAnswer: 1,
    explanation: "Total values = 3+5+2 = 10. Total sum = (2x3)+(4x5)+(6x2) = 6+20+12 = 38. Mean = 38/10 = 3.8."
  },
  {
    id: 39,
    type: "data",
    question: "A box has 5 red and 3 blue pens. Two pens are drawn at random without replacement. What is the probability that both are red?",
    options: [
      "10/56",
      "20/56",
      "5/14",
      "25/64",
    ],
    correctAnswer: 2,
    explanation: "P(first red) = 5/8. P(second red) = 4/7. Combined = 5/8 x 4/7 = 20/56 = 5/14."
  },
  {
    id: 40,
    type: "data",
    question: "The median of 7 values is 15. The values in order are: 9, 12, 13, ___, 17, 20, 23. What is the missing value?",
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 1,
    explanation: "With 7 values, the median is the 4th value. So the missing 4th value = 15."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult8Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult8Questions : numeracyDifficult8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 8</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 8 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 8</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
