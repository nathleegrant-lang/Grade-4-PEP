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

const numeracyDifficult2Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A bakery made 345 loaves on Monday, 278 on Tuesday, and 96 fewer on Wednesday than on Monday. How many loaves were made altogether?",
    options: [
      "858",
      "867",
      "872",
      "881",
    ],
    correctAnswer: 1,
    explanation: "Wednesday: 345 - 96 = 249. Total: 345 + 278 + 249 = 872."
  },
  {
    id: 2,
    type: "number",
    question: "What is the value of the digit 4 in the number 3.841?",
    options: [
      "4",
      "0.4",
      "0.04",
      "0.004",
    ],
    correctAnswer: 2,
    explanation: "In 3.841 the digit 4 is in the hundredths place, so its value is 0.04."
  },
  {
    id: 3,
    type: "number",
    question: "Which of the following is equivalent to 4/6?",
    options: [
      "2/3",
      "8/10",
      "6/10",
      "3/5",
    ],
    correctAnswer: 0,
    explanation: "Divide numerator and denominator by 2: 4/6 = 2/3."
  },
  {
    id: 4,
    type: "number",
    question: "A market stall sells 24 bags of mangoes per day. Each bag holds 18 mangoes. How many mangoes are sold in 5 days?",
    options: [
      "1,980",
      "2,080",
      "2,160",
      "2,220",
    ],
    correctAnswer: 2,
    explanation: "Per day: 24 x 18 = 432. In 5 days: 432 x 5 = 2,160."
  },
  {
    id: 5,
    type: "number",
    question: "Round 47,386 to the nearest ten thousand.",
    options: [
      "40,000",
      "47,000",
      "48,000",
      "50,000",
    ],
    correctAnswer: 3,
    explanation: "The thousands digit is 7 (5 or more), so round up to 50,000."
  },
  {
    id: 6,
    type: "number",
    question: "What is 3/4 - 1/6?",
    options: [
      "2/5",
      "7/12",
      "1/2",
      "5/12",
    ],
    correctAnswer: 1,
    explanation: "LCD is 12. 3/4 = 9/12 and 1/6 = 2/12. 9/12 - 2/12 = 7/12."
  },
  {
    id: 7,
    type: "number",
    question: "Three-eighths of 32 students wear glasses. How many students do NOT wear glasses?",
    options: [
      "12",
      "18",
      "20",
      "24",
    ],
    correctAnswer: 2,
    explanation: "Wearing glasses: 3/8 x 32 = 12. Not wearing: 32 - 12 = 20."
  },
  {
    id: 8,
    type: "number",
    question: "A grocer buys 6 crates of oranges at $48.50 per crate and sells them all for $354. What is his profit?",
    options: [
      "$51.00",
      "$57.00",
      "$60.00",
      "$63.00",
    ],
    correctAnswer: 3,
    explanation: "Cost: 6 x $48.50 = $291. Profit: $354 - $291 = $63."
  },
  {
    id: 9,
    type: "number",
    question: "Write 7/8 as a decimal.",
    options: [
      "0.75",
      "0.78",
      "0.875",
      "0.87",
    ],
    correctAnswer: 2,
    explanation: "7 / 8 = 0.875."
  },
  {
    id: 10,
    type: "number",
    question: "A pool holds 9,600 litres. Water flows in at 150 litres per minute. How long does it take to fill the pool?",
    options: [
      "56 min",
      "60 min",
      "64 min",
      "72 min",
    ],
    correctAnswer: 2,
    explanation: "9,600 / 150 = 64 minutes."
  },
  {
    id: 11,
    type: "number",
    question: "What is the LCM of 6 and 9?",
    options: [
      "3",
      "12",
      "18",
      "54",
    ],
    correctAnswer: 2,
    explanation: "Multiples of 6: 6, 12, 18... Multiples of 9: 9, 18... The first common multiple is 18."
  },
  {
    id: 12,
    type: "number",
    question: "A factory packs 1,764 items equally into boxes of 42. How many boxes are filled?",
    options: [
      "38",
      "40",
      "42",
      "44",
    ],
    correctAnswer: 2,
    explanation: "1,764 / 42 = 42. Check: 42 x 42 = 1,764."
  },
  {
    id: 13,
    type: "number",
    question: "What is 15% of 240?",
    options: [
      "24",
      "30",
      "36",
      "48",
    ],
    correctAnswer: 2,
    explanation: "10% of 240 = 24. 5% = 12. 15% = 24 + 12 = 36."
  },
  {
    id: 14,
    type: "number",
    question: "Which decimal lies between 0.45 and 0.50?",
    options: [
      "0.44",
      "0.47",
      "0.505",
      "0.51",
    ],
    correctAnswer: 1,
    explanation: "0.47 is greater than 0.45 and less than 0.50. The other choices are outside this range."
  },
  {
    id: 15,
    type: "number",
    question: "Find the mean of: 23, 17, 35, 29, 16",
    options: [
      "22",
      "24",
      "26",
      "28",
    ],
    correctAnswer: 1,
    explanation: "Sum: 23+17+35+29+16 = 120. Mean: 120 / 5 = 24."
  },
  {
    id: 16,
    type: "measurement",
    question: "A recipe needs 1.25 kg of flour. How many grams is this?",
    options: [
      "125 g",
      "1,025 g",
      "1,250 g",
      "12,500 g",
    ],
    correctAnswer: 2,
    explanation: "1 kg = 1,000 g. 1.25 x 1,000 = 1,250 g."
  },
  {
    id: 17,
    type: "measurement",
    question: "A train leaves Kingston at 8:45 AM and arrives in Montego Bay at 11:20 AM. How long is the journey?",
    options: [
      "2 h 15 min",
      "2 h 35 min",
      "2 h 45 min",
      "3 h 5 min",
    ],
    correctAnswer: 1,
    explanation: "8:45 to 10:45 = 2 hours. 10:45 to 11:20 = 35 minutes. Total = 2 hours 35 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "A square has a perimeter of 32 cm. What is its area?",
    options: [
      "8 cm2",
      "16 cm2",
      "32 cm2",
      "64 cm2",
    ],
    correctAnswer: 3,
    explanation: "Side = 32 / 4 = 8 cm. Area = 8 x 8 = 64 cm2."
  },
  {
    id: 19,
    type: "measurement",
    question: "A container holds 3.5 litres of juice. If 750 mL is poured out, how much juice remains (in mL)?",
    options: [
      "2,450 mL",
      "2,650 mL",
      "2,750 mL",
      "3,250 mL",
    ],
    correctAnswer: 2,
    explanation: "3.5 L = 3,500 mL. 3,500 - 750 = 2,750 mL."
  },
  {
    id: 20,
    type: "measurement",
    question: "A rectangular yard is 18 m long and 11 m wide. Fencing costs $35 per metre. What is the total cost to fence the yard?",
    options: [
      "$2,030",
      "$2,065",
      "$2,100",
      "$2,170",
    ],
    correctAnswer: 0,
    explanation: "Perimeter = 2 x (18 + 11) = 58 m. Cost = 58 x $35 = $2,030."
  },
  {
    id: 21,
    type: "measurement",
    question: "How many centimetres are in 4.7 metres?",
    options: [
      "47 cm",
      "407 cm",
      "470 cm",
      "4,700 cm",
    ],
    correctAnswer: 2,
    explanation: "1 m = 100 cm. 4.7 x 100 = 470 cm."
  },
  {
    id: 22,
    type: "measurement",
    question: "A bus left the depot at 6:40 AM and returned at 9:05 AM. How long was the route?",
    options: [
      "2 h 15 min",
      "2 h 20 min",
      "2 h 25 min",
      "2 h 35 min",
    ],
    correctAnswer: 2,
    explanation: "6:40 to 8:40 = 2 hours. 8:40 to 9:05 = 25 minutes. Total = 2 hours 25 minutes."
  },
  {
    id: 23,
    type: "measurement",
    question: "A rectangular floor is 9 m long and 6 m wide. Tiles cost $12 per square metre. What is the total cost?",
    options: [
      "$540",
      "$600",
      "$648",
      "$720",
    ],
    correctAnswer: 2,
    explanation: "Area = 9 x 6 = 54 m2. Cost = 54 x $12 = $648."
  },
  {
    id: 24,
    type: "measurement",
    question: "A box of cereal weighs 750 g. How many boxes can be packed into a crate that holds exactly 15 kg?",
    options: [
      "15",
      "18",
      "20",
      "25",
    ],
    correctAnswer: 2,
    explanation: "15 kg = 15,000 g. 15,000 / 750 = 20 boxes."
  },
  {
    id: 25,
    type: "measurement",
    question: "The temperature in the morning was 19 degrees C. It rose 8 degrees by noon, then fell 5 degrees by evening. What was the evening temperature?",
    options: [
      "20 C",
      "21 C",
      "22 C",
      "23 C",
    ],
    correctAnswer: 2,
    explanation: "19 + 8 = 27. 27 - 5 = 22 degrees C."
  },
  {
    id: 26,
    type: "geometry",
    question: "An angle measures 145 degrees. What type of angle is it?",
    options: [
      "Acute",
      "Right",
      "Obtuse",
      "Reflex",
    ],
    correctAnswer: 2,
    explanation: "An obtuse angle is greater than 90 degrees and less than 180 degrees. 145 degrees is obtuse."
  },
  {
    id: 27,
    type: "geometry",
    question: "How many lines of symmetry does a regular hexagon have?",
    options: [
      "3",
      "4",
      "6",
      "8",
    ],
    correctAnswer: 2,
    explanation: "A regular hexagon has 6 lines of symmetry: 3 through opposite vertices and 3 through midpoints of opposite sides."
  },
  {
    id: 28,
    type: "geometry",
    question: "Which shape has exactly 2 pairs of parallel sides?",
    options: [
      "Trapezoid",
      "Triangle",
      "Pentagon",
      "Parallelogram",
    ],
    correctAnswer: 3,
    explanation: "A parallelogram has 2 pairs of parallel sides. A trapezoid has only 1 pair."
  },
  {
    id: 29,
    type: "geometry",
    question: "A cube has a side length of 4 cm. What is its volume?",
    options: [
      "12 cm3",
      "24 cm3",
      "48 cm3",
      "64 cm3",
    ],
    correctAnswer: 3,
    explanation: "Volume of a cube = side x side x side = 4 x 4 x 4 = 64 cm3."
  },
  {
    id: 30,
    type: "geometry",
    question: "Two angles are complementary. One angle is 38 degrees. What is the other angle?",
    options: [
      "38 degrees",
      "52 degrees",
      "58 degrees",
      "142 degrees",
    ],
    correctAnswer: 1,
    explanation: "Complementary angles add up to 90 degrees. 90 - 38 = 52 degrees."
  },
  {
    id: 31,
    type: "geometry",
    question: "A triangle has angles of 65 degrees and 48 degrees. What is the third angle?",
    options: [
      "57 degrees",
      "67 degrees",
      "77 degrees",
      "87 degrees",
    ],
    correctAnswer: 1,
    explanation: "Angles in a triangle sum to 180 degrees. Third angle = 180 - 65 - 48 = 67 degrees."
  },
  {
    id: 32,
    type: "geometry",
    question: "How many faces does a triangular prism have?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: "A triangular prism has 2 triangular faces and 3 rectangular faces, giving 5 faces in total."
  },
  {
    id: 33,
    type: "data",
    question: "The ages of 7 students are: 10, 11, 9, 11, 12, 10, 11. What is the mode?",
    options: [
      "9",
      "10",
      "11",
      "12",
    ],
    correctAnswer: 2,
    explanation: "The mode is the value that appears most often. 11 appears 3 times."
  },
  {
    id: 34,
    type: "data",
    question: "Find the median of: 14, 7, 22, 9, 18, 31, 5",
    options: [
      "9",
      "14",
      "18",
      "22",
    ],
    correctAnswer: 1,
    explanation: "Arranged in order: 5, 7, 9, 14, 18, 22, 31. The middle (4th) value is 14."
  },
  {
    id: 35,
    type: "data",
    question: "A bar chart shows daily sales: Mon 45, Tue 38, Wed 52, Thu 29, Fri 61. What is the mean daily sale?",
    options: [
      "41",
      "43",
      "45",
      "47",
    ],
    correctAnswer: 2,
    explanation: "Total: 45+38+52+29+61 = 225. Mean: 225 / 5 = 45."
  },
  {
    id: 36,
    type: "data",
    question: "A pictograph uses one fish symbol to represent 6 fish caught. Marcus has 4 symbols and Tricia has 2 and a half symbols. How many more fish did Marcus catch than Tricia?",
    options: [
      "6",
      "9",
      "12",
      "15",
    ],
    correctAnswer: 1,
    explanation: "Marcus: 4 x 6 = 24. Tricia: 2.5 x 6 = 15. Difference: 24 - 15 = 9."
  },
  {
    id: 37,
    type: "data",
    question: "The range of a set of numbers is 28. The smallest number is 17. What is the largest number?",
    options: [
      "11",
      "28",
      "45",
      "46",
    ],
    correctAnswer: 2,
    explanation: "Range = largest - smallest. Largest = 17 + 28 = 45."
  },
  {
    id: 38,
    type: "data",
    question: "In a class of 40 students, 25 play football, 18 play basketball, and 8 play both. How many play neither sport?",
    options: [
      "3",
      "5",
      "7",
      "9",
    ],
    correctAnswer: 1,
    explanation: "Using inclusion-exclusion: 25 + 18 - 8 = 35 play at least one sport. 40 - 35 = 5 play neither."
  },
  {
    id: 39,
    type: "data",
    question: "A bag has 8 sections: 3 red, 2 blue, 2 green, 1 yellow. What is the probability of landing on blue or green?",
    options: [
      "1/8",
      "1/4",
      "1/2",
      "5/8",
    ],
    correctAnswer: 2,
    explanation: "Blue + green = 2 + 2 = 4 sections out of 8. Probability = 4/8 = 1/2."
  },
  {
    id: 40,
    type: "data",
    question: "The scores of 5 students are: 72, 85, 68, 91, 74. What is the range?",
    options: [
      "17",
      "19",
      "23",
      "29",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 91 - 68 = 23."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult2Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult2Questions : numeracyDifficult2Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 2</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 2</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 2 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 2</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
