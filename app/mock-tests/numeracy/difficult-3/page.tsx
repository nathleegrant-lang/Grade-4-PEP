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

const numeracyDifficult3Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A vendor bought 480 mangoes for $144. She sold 360 at $0.50 each and the rest at $0.35 each. What was her profit?",
    options: [
      "$60.00",
      "$66.00",
      "$78.00",
      "$84.00",
    ],
    correctAnswer: 2,
    explanation: "Revenue: 360 x $0.50 = $180. Remaining 120 x $0.35 = $42. Total = $222. Profit = $222 - $144 = $78."
  },
  {
    id: 2,
    type: "number",
    question: "What is the value of the digit 7 in the number 5.073?",
    options: [
      "7",
      "0.7",
      "0.07",
      "0.007",
    ],
    correctAnswer: 2,
    explanation: "In 5.073, the digit 7 is in the hundredths place. Its value is 0.07."
  },
  {
    id: 3,
    type: "number",
    question: "Which fraction is NOT equivalent to 3/4?",
    options: [
      "6/8",
      "9/12",
      "12/16",
      "15/24",
    ],
    correctAnswer: 3,
    explanation: "6/8 = 3/4, 9/12 = 3/4, 12/16 = 3/4. But 15/24 = 5/8, which is not equal to 3/4."
  },
  {
    id: 4,
    type: "number",
    question: "A school collected $2,340 in fees from 36 students, each paying the same amount. How much did each student pay?",
    options: [
      "$60",
      "$65",
      "$70",
      "$75",
    ],
    correctAnswer: 1,
    explanation: "2,340 / 36 = 65. Each student paid $65."
  },
  {
    id: 5,
    type: "number",
    question: "Order from smallest to largest: 0.3, 1/4, 2/5, 0.29",
    options: [
      "1/4, 0.29, 0.3, 2/5",
      "0.29, 1/4, 0.3, 2/5",
      "1/4, 0.3, 0.29, 2/5",
      "0.3, 0.29, 1/4, 2/5",
    ],
    correctAnswer: 0,
    explanation: "As decimals: 1/4 = 0.25, 0.29, 0.30, 2/5 = 0.40. Order: 1/4, 0.29, 0.3, 2/5."
  },
  {
    id: 6,
    type: "number",
    question: "What is 2/3 x 3/8?",
    options: [
      "1/4",
      "5/11",
      "1/3",
      "6/11",
    ],
    correctAnswer: 0,
    explanation: "Multiply numerators and denominators: (2 x 3) / (3 x 8) = 6/24 = 1/4."
  },
  {
    id: 7,
    type: "number",
    question: "A number divided by 7 gives a quotient of 23 and a remainder of 4. What is the number?",
    options: [
      "161",
      "165",
      "168",
      "172",
    ],
    correctAnswer: 1,
    explanation: "Number = (quotient x divisor) + remainder = (23 x 7) + 4 = 161 + 4 = 165."
  },
  {
    id: 8,
    type: "number",
    question: "What is the next term in the sequence: 2, 6, 18, 54, ___?",
    options: [
      "108",
      "144",
      "162",
      "216",
    ],
    correctAnswer: 2,
    explanation: "Each term is multiplied by 3. 54 x 3 = 162."
  },
  {
    id: 9,
    type: "number",
    question: "Express 0.375 as a fraction in its simplest form.",
    options: [
      "375/1000",
      "37/100",
      "3/8",
      "1/3",
    ],
    correctAnswer: 2,
    explanation: "0.375 = 375/1000. Divide numerator and denominator by 125 to get 3/8."
  },
  {
    id: 10,
    type: "number",
    question: "A school trip costs $85 per student. If 42 students attend, how much is collected?",
    options: [
      "$3,470",
      "$3,570",
      "$3,630",
      "$3,780",
    ],
    correctAnswer: 1,
    explanation: "42 x $85: 40 x 85 = 3,400 and 2 x 85 = 170. Total = $3,570."
  },
  {
    id: 11,
    type: "number",
    question: "What is 20% of 350?",
    options: [
      "50",
      "60",
      "70",
      "80",
    ],
    correctAnswer: 2,
    explanation: "10% of 350 = 35. 20% = 35 x 2 = 70."
  },
  {
    id: 12,
    type: "number",
    question: "A bookshelf has 5 shelves, each holding 32 books. The shelf is 3/4 full. How many books are on it altogether?",
    options: [
      "96",
      "100",
      "108",
      "120",
    ],
    correctAnswer: 3,
    explanation: "Total capacity: 5 x 32 = 160. Books present: 3/4 x 160 = 120."
  },
  {
    id: 13,
    type: "number",
    question: "What is the GCF (Greatest Common Factor) of 36 and 48?",
    options: [
      "6",
      "8",
      "12",
      "18",
    ],
    correctAnswer: 2,
    explanation: "Factors of 36: 1,2,3,4,6,9,12,18,36. Factors of 48: 1,2,3,4,6,8,12,16,24,48. GCF = 12."
  },
  {
    id: 14,
    type: "number",
    question: "What is the value of 4 squared + 5 squared - 3 squared?",
    options: [
      "28",
      "30",
      "32",
      "34",
    ],
    correctAnswer: 2,
    explanation: "4 squared = 16, 5 squared = 25, 3 squared = 9. 16 + 25 - 9 = 32."
  },
  {
    id: 15,
    type: "number",
    question: "Write 125/200 as a decimal.",
    options: [
      "0.25",
      "0.525",
      "0.625",
      "0.725",
    ],
    correctAnswer: 2,
    explanation: "Simplify: 125/200 = 5/8. Then 5 / 8 = 0.625."
  },
  {
    id: 16,
    type: "measurement",
    question: "A rectangular pool is 25 m long and 12 m wide. What is its perimeter?",
    options: [
      "37 m",
      "74 m",
      "150 m",
      "300 m",
    ],
    correctAnswer: 1,
    explanation: "Perimeter = 2 x (25 + 12) = 2 x 37 = 74 m."
  },
  {
    id: 17,
    type: "measurement",
    question: "A plane departs at 9:15 AM and lands 3 hours 40 minutes later. What time does it land?",
    options: [
      "12:45 PM",
      "12:55 PM",
      "1:05 PM",
      "1:15 PM",
    ],
    correctAnswer: 1,
    explanation: "9:15 + 3 hours = 12:15. 12:15 + 40 minutes = 12:55 PM."
  },
  {
    id: 18,
    type: "measurement",
    question: "A bottle contains 1.5 litres of juice. How many 250 mL cups can be completely filled?",
    options: [
      "4",
      "5",
      "6",
      "7",
    ],
    correctAnswer: 2,
    explanation: "1.5 L = 1,500 mL. 1,500 / 250 = 6 cups."
  },
  {
    id: 19,
    type: "measurement",
    question: "The area of a rectangle is 84 cm2. Its length is 12 cm. What is its width?",
    options: [
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm",
    ],
    correctAnswer: 1,
    explanation: "Width = Area / length = 84 / 12 = 7 cm."
  },
  {
    id: 20,
    type: "measurement",
    question: "How many minutes are in 2 days and 3 hours?",
    options: [
      "2,820 min",
      "2,940 min",
      "3,060 min",
      "3,180 min",
    ],
    correctAnswer: 2,
    explanation: "2 days = 48 hours. Total = 51 hours. 51 x 60 = 3,060 minutes."
  },
  {
    id: 21,
    type: "measurement",
    question: "A plot of land can be divided into two rectangles: one 10 m x 6 m and another 4 m x 3 m. What is the total area?",
    options: [
      "52 m2",
      "60 m2",
      "72 m2",
      "84 m2",
    ],
    correctAnswer: 2,
    explanation: "Rectangle 1: 10 x 6 = 60 m2. Rectangle 2: 4 x 3 = 12 m2. Total = 72 m2."
  },
  {
    id: 22,
    type: "measurement",
    question: "A jug holds 4.2 litres. Water is poured into 350 mL glasses until the jug is empty. How many full glasses can be poured?",
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "4.2 L = 4,200 mL. 4,200 / 350 = 12 full glasses."
  },
  {
    id: 23,
    type: "measurement",
    question: "The temperature dropped from 30 degrees C to 18 degrees C overnight, then rose 7 degrees by midday. What was the midday temperature?",
    options: [
      "20 C",
      "23 C",
      "25 C",
      "28 C",
    ],
    correctAnswer: 2,
    explanation: "Temperature after drop: 18 degrees C. After rise: 18 + 7 = 25 degrees C."
  },
  {
    id: 24,
    type: "measurement",
    question: "A bag of rice weighs 2 kg 350 g. What is the total mass in grams of three identical bags?",
    options: [
      "6,050 g",
      "6,750 g",
      "7,050 g",
      "7,550 g",
    ],
    correctAnswer: 2,
    explanation: "One bag: 2,350 g. Three bags: 2,350 x 3 = 7,050 g."
  },
  {
    id: 25,
    type: "measurement",
    question: "What is the area of a right-angled triangle with base 10 cm and height 8 cm?",
    options: [
      "18 cm2",
      "40 cm2",
      "80 cm2",
      "160 cm2",
    ],
    correctAnswer: 1,
    explanation: "Area of triangle = 1/2 x base x height = 1/2 x 10 x 8 = 40 cm2."
  },
  {
    id: 26,
    type: "geometry",
    question: "What is the sum of all interior angles in a quadrilateral?",
    options: [
      "180 degrees",
      "270 degrees",
      "360 degrees",
      "540 degrees",
    ],
    correctAnswer: 2,
    explanation: "The interior angles of any quadrilateral always add up to 360 degrees."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which shape has all sides equal and all interior angles equal to 60 degrees?",
    options: [
      "Square",
      "Rectangle",
      "Equilateral triangle",
      "Rhombus",
    ],
    correctAnswer: 2,
    explanation: "An equilateral triangle has 3 equal sides and each interior angle measures 60 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "A cylinder has 3 faces (2 circular, 1 curved), 2 edges, and 0 vertices. Which statement about it is TRUE?",
    options: [
      "It has 4 faces",
      "It has no edges",
      "It has 0 vertices",
      "It has 1 vertex",
    ],
    correctAnswer: 2,
    explanation: "A cylinder has 3 faces, 2 edges (where flat meets curved), and 0 vertices (no corners)."
  },
  {
    id: 29,
    type: "geometry",
    question: "Two angles are supplementary. One measures 73 degrees. What is the other?",
    options: [
      "17 degrees",
      "27 degrees",
      "107 degrees",
      "117 degrees",
    ],
    correctAnswer: 2,
    explanation: "Supplementary angles add to 180 degrees. 180 - 73 = 107 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "How many vertices does a triangular prism have?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 3,
    explanation: "A triangular prism has 2 triangular ends (3 vertices each) = 6 vertices in total."
  },
  {
    id: 31,
    type: "geometry",
    question: "An angle of 270 degrees is called a:",
    options: [
      "Straight angle",
      "Obtuse angle",
      "Right angle",
      "Reflex angle",
    ],
    correctAnswer: 3,
    explanation: "A reflex angle is greater than 180 degrees and less than 360 degrees. 270 degrees is reflex."
  },
  {
    id: 32,
    type: "geometry",
    question: "A rectangle is 14 cm long and 9 cm wide. What is its perimeter?",
    options: [
      "23 cm",
      "42 cm",
      "46 cm",
      "126 cm",
    ],
    correctAnswer: 2,
    explanation: "Perimeter = 2 x (14 + 9) = 2 x 23 = 46 cm."
  },
  {
    id: 33,
    type: "data",
    question: "The scores of 8 students are: 72, 85, 68, 91, 74, 85, 79, 62. What is the range?",
    options: [
      "19",
      "23",
      "27",
      "29",
    ],
    correctAnswer: 3,
    explanation: "Range = highest - lowest = 91 - 62 = 29."
  },
  {
    id: 34,
    type: "data",
    question: "Find the median of: 13, 27, 8, 42, 19, 35, 8, 24",
    options: [
      "19",
      "21.5",
      "22",
      "24",
    ],
    correctAnswer: 1,
    explanation: "Arranged: 8, 8, 13, 19, 24, 27, 35, 42. With 8 values, median = average of 4th and 5th: (19+24)/2 = 21.5."
  },
  {
    id: 35,
    type: "data",
    question: "A tuck shop sold: 30 patties, 18 buns, 24 juices, 12 waters. What fraction of items sold were juices?",
    options: [
      "1/4",
      "2/7",
      "3/8",
      "1/3",
    ],
    correctAnswer: 1,
    explanation: "Total: 30+18+24+12 = 84. Fraction for juices: 24/84 = 2/7."
  },
  {
    id: 36,
    type: "data",
    question: "In a survey, 15 out of 60 students said Maths was their favourite subject. What percentage chose Maths?",
    options: [
      "20%",
      "25%",
      "30%",
      "35%",
    ],
    correctAnswer: 1,
    explanation: "15/60 = 1/4 = 25%."
  },
  {
    id: 37,
    type: "data",
    question: "Find the mean of: 12, 18, 24, 30",
    options: [
      "18",
      "20",
      "21",
      "22",
    ],
    correctAnswer: 2,
    explanation: "Total: 12+18+24+30 = 84. Mean: 84 / 4 = 21."
  },
  {
    id: 38,
    type: "data",
    question: "A pictograph uses one star to represent 5 items. James has 6 stars and Maria has 4 stars. How many items do they have altogether?",
    options: [
      "40",
      "45",
      "50",
      "55",
    ],
    correctAnswer: 2,
    explanation: "James: 6 x 5 = 30. Maria: 4 x 5 = 20. Total: 30 + 20 = 50."
  },
  {
    id: 39,
    type: "data",
    question: "In a class of 30 students, the probability of picking one who walks to school is 2/5. How many students do NOT walk to school?",
    options: [
      "12",
      "15",
      "16",
      "18",
    ],
    correctAnswer: 3,
    explanation: "Walkers: 2/5 x 30 = 12. Non-walkers: 30 - 12 = 18."
  },
  {
    id: 40,
    type: "data",
    question: "A bar graph shows: Reading 45, Maths 60, Science 35, Art 40. What is the difference between the highest and lowest values?",
    options: [
      "15",
      "20",
      "25",
      "30",
    ],
    correctAnswer: 2,
    explanation: "Highest = 60 (Maths). Lowest = 35 (Science). Difference = 60 - 35 = 25."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult3Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult3Questions : numeracyDifficult3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 3</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 3 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 3</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
