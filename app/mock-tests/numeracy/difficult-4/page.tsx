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

const numeracyDifficult4Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A farm harvested 1,248 coconuts. One-third were sold, one-quarter were made into oil, and the rest were stored. How many were stored?",
    options: [
      "416",
      "468",
      "520",
      "572",
    ],
    correctAnswer: 2,
    explanation: "Sold: 1/3 x 1,248 = 416. Oil: 1/4 x 1,248 = 312. Stored: 1,248 - 416 - 312 = 520."
  },
  {
    id: 2,
    type: "number",
    question: "What is 0.8 x 0.6?",
    options: [
      "0.014",
      "0.14",
      "0.48",
      "4.8",
    ],
    correctAnswer: 2,
    explanation: "8 x 6 = 48. Place 2 decimal places: 0.48."
  },
  {
    id: 3,
    type: "number",
    question: "A car travels 315 km in 4.5 hours. What is its average speed in km/h?",
    options: [
      "60 km/h",
      "65 km/h",
      "70 km/h",
      "75 km/h",
    ],
    correctAnswer: 2,
    explanation: "Speed = distance / time = 315 / 4.5 = 70 km/h."
  },
  {
    id: 4,
    type: "number",
    question: "What is the sum of the first 5 odd numbers?",
    options: [
      "15",
      "20",
      "25",
      "30",
    ],
    correctAnswer: 2,
    explanation: "The first 5 odd numbers are: 1, 3, 5, 7, 9. Sum = 1+3+5+7+9 = 25."
  },
  {
    id: 5,
    type: "number",
    question: "Write 5/8 as a percentage.",
    options: [
      "58%",
      "60%",
      "62.5%",
      "65%",
    ],
    correctAnswer: 2,
    explanation: "5 / 8 = 0.625. As a percentage: 0.625 x 100 = 62.5%."
  },
  {
    id: 6,
    type: "number",
    question: "A factory produces 2,160 items in 8 hours. How many items are produced per hour?",
    options: [
      "240",
      "265",
      "270",
      "280",
    ],
    correctAnswer: 2,
    explanation: "2,160 / 8 = 270 items per hour."
  },
  {
    id: 7,
    type: "number",
    question: "What is 3/5 of one hour, in minutes?",
    options: [
      "30 min",
      "36 min",
      "40 min",
      "45 min",
    ],
    correctAnswer: 1,
    explanation: "1 hour = 60 minutes. 3/5 x 60 = 36 minutes."
  },
  {
    id: 8,
    type: "number",
    question: "A number has 5 in the thousands place, 3 in the tens place, 8 in the tenths place, and 0 in all other places. What is the number?",
    options: [
      "5,038",
      "5,030.8",
      "5,030.08",
      "5,308",
    ],
    correctAnswer: 1,
    explanation: "5,000 + 30 + 0.8 = 5,030.8."
  },
  {
    id: 9,
    type: "number",
    question: "What is 13 squared?",
    options: [
      "26",
      "130",
      "156",
      "169",
    ],
    correctAnswer: 3,
    explanation: "13 squared = 13 x 13 = 169."
  },
  {
    id: 10,
    type: "number",
    question: "A school raised $4,500 and spent 40% on books and 30% on sports equipment. How much money is left?",
    options: [
      "$900",
      "$1,100",
      "$1,350",
      "$1,500",
    ],
    correctAnswer: 2,
    explanation: "Books: 40% x $4,500 = $1,800. Sports: 30% x $4,500 = $1,350. Spent: $3,150. Left: $4,500 - $3,150 = $1,350."
  },
  {
    id: 11,
    type: "number",
    question: "Round 8.475 to the nearest hundredth.",
    options: [
      "8.47",
      "8.48",
      "8.4",
      "8.5",
    ],
    correctAnswer: 1,
    explanation: "Look at the thousandths digit: 5. Round up the hundredths digit: 8.48."
  },
  {
    id: 12,
    type: "number",
    question: "If 5n - 7 = 28, what is the value of n?",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: "5n = 28 + 7 = 35. n = 35 / 5 = 7."
  },
  {
    id: 13,
    type: "number",
    question: "Which is greater: 5/7 or 3/4?",
    options: [
      "5/7",
      "3/4",
      "They are equal",
      "Cannot be determined",
    ],
    correctAnswer: 1,
    explanation: "Common denominator 28: 5/7 = 20/28, 3/4 = 21/28. Since 21/28 > 20/28, 3/4 is greater."
  },
  {
    id: 14,
    type: "number",
    question: "A tap drips 40 mL of water per minute. How many litres will drip in 6 hours?",
    options: [
      "12.8 L",
      "14.4 L",
      "24 L",
      "240 L",
    ],
    correctAnswer: 1,
    explanation: "6 hours = 360 minutes. 360 x 40 = 14,400 mL = 14.4 L."
  },
  {
    id: 15,
    type: "number",
    question: "What is the value of 3 cubed - 2 to the power of 4?",
    options: [
      "4",
      "9",
      "11",
      "13",
    ],
    correctAnswer: 2,
    explanation: "3 cubed = 27. 2 to the power of 4 = 16. 27 - 16 = 11."
  },
  {
    id: 16,
    type: "measurement",
    question: "A roll of ribbon is 7.2 m long. It is cut into pieces of 30 cm each. How many complete pieces can be cut?",
    options: [
      "22",
      "24",
      "26",
      "28",
    ],
    correctAnswer: 1,
    explanation: "7.2 m = 720 cm. 720 / 30 = 24 pieces."
  },
  {
    id: 17,
    type: "measurement",
    question: "A clock shows 7:48. What will the time be in 2 hours and 35 minutes?",
    options: [
      "10:13",
      "10:23",
      "10:33",
      "10:43",
    ],
    correctAnswer: 1,
    explanation: "7:48 + 2 hours = 9:48. 9:48 + 35 minutes = 10:23."
  },
  {
    id: 18,
    type: "measurement",
    question: "A rectangular field is 45 m long and 28 m wide. What is its area?",
    options: [
      "146 m2",
      "1,216 m2",
      "1,260 m2",
      "1,296 m2",
    ],
    correctAnswer: 2,
    explanation: "Area = 45 x 28. 45 x 28 = 45 x 20 + 45 x 8 = 900 + 360 = 1,260 m2."
  },
  {
    id: 19,
    type: "measurement",
    question: "How many millilitres are in 3/4 of a litre?",
    options: [
      "300 mL",
      "700 mL",
      "750 mL",
      "800 mL",
    ],
    correctAnswer: 2,
    explanation: "3/4 x 1,000 = 750 mL."
  },
  {
    id: 20,
    type: "measurement",
    question: "The perimeter of a square is 52 cm. What is its area?",
    options: [
      "104 cm2",
      "156 cm2",
      "169 cm2",
      "182 cm2",
    ],
    correctAnswer: 2,
    explanation: "Side = 52 / 4 = 13 cm. Area = 13 x 13 = 169 cm2."
  },
  {
    id: 21,
    type: "measurement",
    question: "A bus travels 180 km at 60 km/h. If the bus leaves at 10:30 AM, what time does it arrive?",
    options: [
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
    ],
    correctAnswer: 2,
    explanation: "Time = 180 / 60 = 3 hours. 10:30 AM + 3 hours = 1:30 PM."
  },
  {
    id: 22,
    type: "measurement",
    question: "Three parcels weigh 2 kg 450 g, 1 kg 780 g, and 3 kg 200 g. What is the total mass?",
    options: [
      "7 kg 30 g",
      "7 kg 230 g",
      "7 kg 330 g",
      "7 kg 430 g",
    ],
    correctAnswer: 3,
    explanation: "In grams: 2,450 + 1,780 + 3,200 = 7,430 g = 7 kg 430 g."
  },
  {
    id: 23,
    type: "measurement",
    question: "A triangle has a base of 14 cm and a height of 9 cm. What is its area?",
    options: [
      "46 cm2",
      "56 cm2",
      "63 cm2",
      "126 cm2",
    ],
    correctAnswer: 2,
    explanation: "Area = 1/2 x base x height = 1/2 x 14 x 9 = 63 cm2."
  },
  {
    id: 24,
    type: "measurement",
    question: "A barrel contains 240 litres of water. Three-eighths is used for watering plants. How many litres remain?",
    options: [
      "90 L",
      "150 L",
      "155 L",
      "165 L",
    ],
    correctAnswer: 1,
    explanation: "Used: 3/8 x 240 = 90 L. Remaining: 240 - 90 = 150 L."
  },
  {
    id: 25,
    type: "measurement",
    question: "School starts at 7:50 AM and has 6 periods of 45 minutes each plus a 20-minute break. When does school end?",
    options: [
      "12:30 PM",
      "12:40 PM",
      "1:00 PM",
      "1:10 PM",
    ],
    correctAnswer: 1,
    explanation: "6 x 45 = 270 min, plus 20 min break = 290 min = 4 h 50 min. 7:50 AM + 4 h 50 min = 12:40 PM."
  },
  {
    id: 26,
    type: "geometry",
    question: "What is the sum of the interior angles of a pentagon?",
    options: [
      "360 degrees",
      "450 degrees",
      "540 degrees",
      "720 degrees",
    ],
    correctAnswer: 2,
    explanation: "Sum of interior angles = (n - 2) x 180. For pentagon (n=5): 3 x 180 = 540 degrees."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which statement about a rhombus is TRUE?",
    options: [
      "All angles must be 90 degrees",
      "Its diagonals are always equal",
      "Its diagonals bisect each other at right angles",
      "It always has 4 lines of symmetry",
    ],
    correctAnswer: 2,
    explanation: "In a rhombus, the diagonals bisect each other at right angles. Angles need not be 90 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which of the following is NOT a property of a rectangle?",
    options: [
      "All angles are 90 degrees",
      "Opposite sides are equal",
      "Diagonals are equal in length",
      "All four sides are equal",
    ],
    correctAnswer: 3,
    explanation: "In a rectangle, opposite sides are equal but not necessarily all four. Having all sides equal is a property of a square."
  },
  {
    id: 29,
    type: "geometry",
    question: "A cone has how many faces, edges, and vertices?",
    options: [
      "1 face, 0 edges, 0 vertices",
      "2 faces, 1 edge, 1 vertex",
      "2 faces, 0 edges, 1 vertex",
      "1 face, 1 edge, 0 vertices",
    ],
    correctAnswer: 1,
    explanation: "A cone has 2 faces (1 flat circular base and 1 curved surface), 1 curved edge, and 1 vertex (the apex)."
  },
  {
    id: 30,
    type: "geometry",
    question: "Parallel lines are cut by a transversal. One angle is 65 degrees. What is the alternate interior angle?",
    options: [
      "25 degrees",
      "65 degrees",
      "115 degrees",
      "125 degrees",
    ],
    correctAnswer: 1,
    explanation: "Alternate interior angles are equal when lines are parallel. The alternate interior angle is also 65 degrees."
  },
  {
    id: 31,
    type: "geometry",
    question: "What type of triangle has no equal sides and no equal angles?",
    options: [
      "Equilateral",
      "Isosceles",
      "Right",
      "Scalene",
    ],
    correctAnswer: 3,
    explanation: "A scalene triangle has three sides of different lengths and three different angles."
  },
  {
    id: 32,
    type: "geometry",
    question: "How many faces does a square-based pyramid have?",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 1,
    explanation: "A square-based pyramid has 1 square base and 4 triangular faces = 5 faces total."
  },
  {
    id: 33,
    type: "data",
    question: "The temperatures for a week were: 28, 31, 29, 33, 27, 30, 32. What is the mean temperature?",
    options: [
      "28.5 C",
      "29 C",
      "30 C",
      "30.5 C",
    ],
    correctAnswer: 2,
    explanation: "Sum: 28+31+29+33+27+30+32 = 210. Mean: 210 / 7 = 30 degrees C."
  },
  {
    id: 34,
    type: "data",
    question: "Find the median of: 55, 42, 68, 37, 55, 71, 49, 60",
    options: [
      "52",
      "55",
      "57",
      "60",
    ],
    correctAnswer: 1,
    explanation: "Arranged: 37, 42, 49, 55, 55, 60, 68, 71. Median = average of 4th and 5th: (55+55)/2 = 55."
  },
  {
    id: 35,
    type: "data",
    question: "In a class of 36, the ratio of boys to girls is 5:4. How many girls are in the class?",
    options: [
      "14",
      "16",
      "18",
      "20",
    ],
    correctAnswer: 1,
    explanation: "Total parts = 5+4 = 9. Girls = 4/9 x 36 = 16."
  },
  {
    id: 36,
    type: "data",
    question: "A bag has 4 red, 6 blue, and 2 yellow marbles. If one marble is picked at random, what is the probability of picking blue?",
    options: [
      "1/2",
      "6/12",
      "1/6",
      "2/3",
    ],
    correctAnswer: 0,
    explanation: "Total = 12. P(blue) = 6/12 = 1/2."
  },
  {
    id: 37,
    type: "data",
    question: "The mean of 5 numbers is 14. Four of the numbers are 12, 17, 11, and 15. What is the fifth number?",
    options: [
      "14",
      "15",
      "16",
      "17",
    ],
    correctAnswer: 1,
    explanation: "Sum = 5 x 14 = 70. Known four: 12+17+11+15 = 55. Fifth = 70 - 55 = 15."
  },
  {
    id: 38,
    type: "data",
    question: "A line graph shows a plant growing from 4 cm in Week 1 to 19 cm in Week 4. What is the total growth?",
    options: [
      "13 cm",
      "15 cm",
      "17 cm",
      "19 cm",
    ],
    correctAnswer: 1,
    explanation: "Total growth = 19 - 4 = 15 cm."
  },
  {
    id: 39,
    type: "data",
    question: "Which measure of average is MOST affected by extremely large or small values?",
    options: [
      "Mode",
      "Median",
      "Mean",
      "Range",
    ],
    correctAnswer: 2,
    explanation: "The mean (average) uses every value in the calculation, so it is most affected by extreme values."
  },
  {
    id: 40,
    type: "data",
    question: "A pie chart shows: 1/4 sport, 1/3 reading, 1/6 TV, and the rest labelled other. What fraction represents other?",
    options: [
      "1/4",
      "1/6",
      "1/5",
      "1/3",
    ],
    correctAnswer: 0,
    explanation: "1/4 + 1/3 + 1/6 = 3/12 + 4/12 + 2/12 = 9/12 = 3/4. Other = 1 - 3/4 = 1/4."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult4Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult4Questions : numeracyDifficult4Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 4</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 4</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 4 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 4</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
