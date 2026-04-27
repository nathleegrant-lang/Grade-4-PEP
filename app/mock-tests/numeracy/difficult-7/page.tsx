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

const numeracyDifficult7Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "A farmer planted 1,200 seeds. 3/4 germinated. Of those, 2/3 survived to full growth. How many plants grew fully?",
    options: [
      "500",
      "550",
      "600",
      "650",
    ],
    correctAnswer: 2,
    explanation: "Germinated: 3/4 x 1,200 = 900. Survived: 2/3 x 900 = 600."
  },
  {
    id: 2,
    type: "number",
    question: "What is 1/3 of 1/4 of 360?",
    options: [
      "20",
      "25",
      "30",
      "35",
    ],
    correctAnswer: 2,
    explanation: "1/4 of 360 = 90. 1/3 of 90 = 30."
  },
  {
    id: 3,
    type: "number",
    question: "A shopkeeper buys 15 kg of rice for $450 and sells it at $38 per kg. What is the percentage profit?",
    options: [
      "24%",
      "26.7%",
      "28%",
      "30%",
    ],
    correctAnswer: 1,
    explanation: "Revenue = 15 x $38 = $570. Profit = $570 - $450 = $120. % profit = (120/450) x 100 = 26.67%, approximately 26.7%."
  },
  {
    id: 4,
    type: "number",
    question: "What is the value of 2 to the power of 5 plus 3 cubed?",
    options: [
      "51",
      "55",
      "59",
      "63",
    ],
    correctAnswer: 2,
    explanation: "2 to the power 5 = 32. 3 cubed = 27. 32 + 27 = 59."
  },
  {
    id: 5,
    type: "number",
    question: "A number is divided by 8. The quotient is 43 and the remainder is 5. What is the original number?",
    options: [
      "344",
      "349",
      "350",
      "352",
    ],
    correctAnswer: 1,
    explanation: "Number = (43 x 8) + 5 = 344 + 5 = 349."
  },
  {
    id: 6,
    type: "number",
    question: "Write 35/56 in its simplest form.",
    options: [
      "5/8",
      "7/11",
      "5/9",
      "6/9",
    ],
    correctAnswer: 0,
    explanation: "GCF of 35 and 56 is 7. 35/56 = 5/8."
  },
  {
    id: 7,
    type: "number",
    question: "A piece of wood is 3.6 m long. It is cut into pieces 0.45 m each. How many complete pieces can be cut?",
    options: [
      "6",
      "7",
      "8",
      "9",
    ],
    correctAnswer: 2,
    explanation: "3.6 / 0.45 = 360 / 45 = 8 pieces."
  },
  {
    id: 8,
    type: "number",
    question: "The ratio of boys to girls in a school is 7:5. There are 840 students in total. How many more boys than girls are there?",
    options: [
      "120",
      "140",
      "160",
      "180",
    ],
    correctAnswer: 1,
    explanation: "Boys: 7/12 x 840 = 490. Girls: 5/12 x 840 = 350. Difference = 490 - 350 = 140."
  },
  {
    id: 9,
    type: "number",
    question: "What is 3.75 x 0.4?",
    options: [
      "0.15",
      "1.5",
      "15",
      "150",
    ],
    correctAnswer: 1,
    explanation: "3.75 x 4 = 15. Shift one decimal place: 3.75 x 0.4 = 1.5."
  },
  {
    id: 10,
    type: "number",
    question: "A school has 560 students. 35% are in the junior department. How many students are NOT in the junior department?",
    options: [
      "196",
      "256",
      "364",
      "392",
    ],
    correctAnswer: 2,
    explanation: "Junior: 35% x 560 = 196. Not junior: 560 - 196 = 364."
  },
  {
    id: 11,
    type: "number",
    question: "Find the value of n: 4n + 9 = 37",
    options: [
      "5",
      "6",
      "7",
      "8",
    ],
    correctAnswer: 2,
    explanation: "4n = 37 - 9 = 28. n = 28 / 4 = 7."
  },
  {
    id: 12,
    type: "number",
    question: "A bus travels 60 km in 45 minutes. What is its speed in km/h?",
    options: [
      "72 km/h",
      "75 km/h",
      "80 km/h",
      "90 km/h",
    ],
    correctAnswer: 2,
    explanation: "45 minutes = 3/4 hour. Speed = 60 / (3/4) = 60 x 4/3 = 80 km/h."
  },
  {
    id: 13,
    type: "number",
    question: "What is the HCF (Highest Common Factor) of 72 and 96?",
    options: [
      "12",
      "18",
      "24",
      "36",
    ],
    correctAnswer: 2,
    explanation: "Factors of 72: 1,2,3,4,6,8,9,12,18,24,36,72. Factors of 96: 1,2,3,4,6,8,12,16,24,32,48,96. HCF = 24."
  },
  {
    id: 14,
    type: "number",
    question: "A jacket originally costs $650. It is reduced by 20%, then reduced by a further 10% in a sale. What is the final price?",
    options: [
      "$455",
      "$468",
      "$475",
      "$480",
    ],
    correctAnswer: 1,
    explanation: "After 20% off: $650 x 0.80 = $520. After 10% off: $520 x 0.90 = $468."
  },
  {
    id: 15,
    type: "number",
    question: "What is the next term in this sequence: 1, 4, 9, 16, 25, ___?",
    options: [
      "30",
      "35",
      "36",
      "40",
    ],
    correctAnswer: 2,
    explanation: "The sequence is perfect squares: 1, 4, 9, 16, 25. Next is 6 squared = 36."
  },
  {
    id: 16,
    type: "measurement",
    question: "A rectangle has a perimeter of 84 cm. Its length is twice its width. What is the area of the rectangle?",
    options: [
      "196 cm2",
      "288 cm2",
      "392 cm2",
      "448 cm2",
    ],
    correctAnswer: 2,
    explanation: "2(2w + w) = 84. 6w = 84. w = 14 cm, length = 28 cm. Area = 28 x 14 = 392 cm2."
  },
  {
    id: 17,
    type: "measurement",
    question: "A train leaves at 10:50 AM and arrives at its destination at 2:15 PM. The train was 25 minutes late. What was the scheduled arrival time?",
    options: [
      "1:40 PM",
      "1:50 PM",
      "2:05 PM",
      "2:10 PM",
    ],
    correctAnswer: 1,
    explanation: "Actual arrival = 2:15 PM. It was 25 minutes late, so scheduled = 2:15 - 0:25 = 1:50 PM."
  },
  {
    id: 18,
    type: "measurement",
    question: "A swimming pool is 25 m long, 10 m wide, and 1.8 m deep. What is the volume of the pool in cubic metres?",
    options: [
      "350 m3",
      "400 m3",
      "450 m3",
      "500 m3",
    ],
    correctAnswer: 2,
    explanation: "Volume = 25 x 10 x 1.8 = 450 m3."
  },
  {
    id: 19,
    type: "measurement",
    question: "A bag of sugar weighs 2.75 kg. A shop has 18 such bags. What is the total mass in kg?",
    options: [
      "44.5 kg",
      "49.5 kg",
      "50.5 kg",
      "54.5 kg",
    ],
    correctAnswer: 1,
    explanation: "18 x 2.75 = 18 x 2 + 18 x 0.75 = 36 + 13.5 = 49.5 kg."
  },
  {
    id: 20,
    type: "measurement",
    question: "A rectangular garden is 20 m x 12 m. A fountain takes up a circular area with radius 2 m. What is the remaining garden area? (Use pi = 3.14)",
    options: [
      "226.44 m2",
      "227.44 m2",
      "228.44 m2",
      "229.44 m2",
    ],
    correctAnswer: 1,
    explanation: "Garden: 20 x 12 = 240 m2. Circle area: 3.14 x 2 squared = 3.14 x 4 = 12.56 m2. Remaining: 240 - 12.56 = 227.44 m2."
  },
  {
    id: 21,
    type: "measurement",
    question: "Convert 2 hours 48 minutes to minutes.",
    options: [
      "148 min",
      "158 min",
      "168 min",
      "178 min",
    ],
    correctAnswer: 2,
    explanation: "2 hours = 120 minutes. 120 + 48 = 168 minutes."
  },
  {
    id: 22,
    type: "measurement",
    question: "A cube has a volume of 125 cm3. What is the area of one face of the cube?",
    options: [
      "5 cm2",
      "10 cm2",
      "20 cm2",
      "25 cm2",
    ],
    correctAnswer: 3,
    explanation: "Volume = side cubed = 125. Side = 5 cm. Area of one face = 5 x 5 = 25 cm2."
  },
  {
    id: 23,
    type: "measurement",
    question: "A water pipe releases 2.5 litres per minute. How many hours does it take to fill a 3,000-litre tank?",
    options: [
      "15 hours",
      "18 hours",
      "20 hours",
      "24 hours",
    ],
    correctAnswer: 2,
    explanation: "Time = 3,000 / 2.5 = 1,200 minutes = 1,200 / 60 = 20 hours."
  },
  {
    id: 24,
    type: "measurement",
    question: "A path 2 m wide is built around the outside of a rectangular garden 18 m x 11 m. What is the area of the path alone?",
    options: [
      "124 m2",
      "128 m2",
      "132 m2",
      "136 m2",
    ],
    correctAnswer: 2,
    explanation: "Outer: (18+4) x (11+4) = 22 x 15 = 330 m2. Garden: 18 x 11 = 198 m2. Path = 330 - 198 = 132 m2."
  },
  {
    id: 25,
    type: "measurement",
    question: "Which measurement is closest to the height of a standard classroom door?",
    options: [
      "2 mm",
      "2 cm",
      "2 m",
      "2 km",
    ],
    correctAnswer: 2,
    explanation: "A standard classroom door is approximately 2 metres tall."
  },
  {
    id: 26,
    type: "geometry",
    question: "A regular octagon has a perimeter of 96 cm. What is the length of each side?",
    options: [
      "8 cm",
      "10 cm",
      "12 cm",
      "14 cm",
    ],
    correctAnswer: 2,
    explanation: "An octagon has 8 sides. 96 / 8 = 12 cm per side."
  },
  {
    id: 27,
    type: "geometry",
    question: "An angle on a straight line measures 2x + 30 degrees. Another angle on the same line measures 3x - 10 degrees. Find x.",
    options: [
      "28",
      "30",
      "32",
      "34",
    ],
    correctAnswer: 2,
    explanation: "Angles on a straight line sum to 180 degrees. (2x+30) + (3x-10) = 180. 5x + 20 = 180. 5x = 160. x = 32."
  },
  {
    id: 28,
    type: "geometry",
    question: "How many axes of symmetry does a regular pentagon have?",
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 2,
    explanation: "A regular pentagon has 5 lines of symmetry, one through each vertex and the midpoint of the opposite side."
  },
  {
    id: 29,
    type: "geometry",
    question: "The base of an isosceles triangle is 12 cm and the two equal sides are each 10 cm. What is the height of the triangle?",
    options: [
      "4 cm",
      "6 cm",
      "8 cm",
      "10 cm",
    ],
    correctAnswer: 2,
    explanation: "The height bisects the base, creating a right triangle with hypotenuse 10 cm and base 6 cm. Height = sqrt(100 - 36) = sqrt(64) = 8 cm."
  },
  {
    id: 30,
    type: "geometry",
    question: "A rhombus has diagonals of 10 cm and 24 cm. What is the area of the rhombus?",
    options: [
      "60 cm2",
      "120 cm2",
      "240 cm2",
      "480 cm2",
    ],
    correctAnswer: 1,
    explanation: "Area of rhombus = (diagonal 1 x diagonal 2) / 2 = (10 x 24) / 2 = 120 cm2."
  },
  {
    id: 31,
    type: "geometry",
    question: "What is the size of each exterior angle of a regular pentagon?",
    options: [
      "60 degrees",
      "70 degrees",
      "72 degrees",
      "75 degrees",
    ],
    correctAnswer: 2,
    explanation: "Sum of exterior angles of any polygon = 360 degrees. Each exterior angle of regular pentagon = 360 / 5 = 72 degrees."
  },
  {
    id: 32,
    type: "geometry",
    question: "A rectangular pyramid has a base 6 cm x 4 cm and 4 triangular faces, each with a slant height of 5 cm. What is the total surface area?",
    options: [
      "44 cm2",
      "64 cm2",
      "74 cm2",
      "84 cm2",
    ],
    correctAnswer: 2,
    explanation: "Base: 6 x 4 = 24 cm2. Two triangles (base 6): 2 x (1/2 x 6 x 5) = 30 cm2. Two triangles (base 4): 2 x (1/2 x 4 x 5) = 20 cm2. Total = 24 + 30 + 20 = 74 cm2."
  },
  {
    id: 33,
    type: "data",
    question: "The mean weight of 4 students is 38 kg. A fifth student joins and the mean rises to 40 kg. How heavy is the fifth student?",
    options: [
      "44 kg",
      "46 kg",
      "48 kg",
      "50 kg",
    ],
    correctAnswer: 2,
    explanation: "Original sum = 4 x 38 = 152 kg. New sum = 5 x 40 = 200 kg. Fifth student = 200 - 152 = 48 kg."
  },
  {
    id: 34,
    type: "data",
    question: "A set of 7 numbers has a median of 14 and a range of 18. The smallest number is 8. What is the largest number?",
    options: [
      "22",
      "24",
      "26",
      "28",
    ],
    correctAnswer: 2,
    explanation: "Largest = smallest + range = 8 + 18 = 26."
  },
  {
    id: 35,
    type: "data",
    question: "In a class of 40 students, 12 play cricket, 15 play football, and 5 play both. How many play neither sport?",
    options: [
      "14",
      "16",
      "18",
      "20",
    ],
    correctAnswer: 2,
    explanation: "Using inclusion-exclusion: 12 + 15 - 5 = 22 play at least one sport. 40 - 22 = 18 play neither."
  },
  {
    id: 36,
    type: "data",
    question: "A frequency table shows that 8 students scored between 60-69, 12 scored 70-79, 15 scored 80-89, and 5 scored 90-99. What percentage scored 80 or above?",
    options: [
      "40%",
      "45%",
      "50%",
      "55%",
    ],
    correctAnswer: 2,
    explanation: "Scored 80+: 15 + 5 = 20 students. Total = 8+12+15+5 = 40. Percentage = 20/40 x 100 = 50%."
  },
  {
    id: 37,
    type: "data",
    question: "A bag contains red, blue, and yellow counters in the ratio 3:2:1. If there are 24 counters in total, what is the probability of picking a yellow counter?",
    options: [
      "1/6",
      "1/4",
      "1/3",
      "2/3",
    ],
    correctAnswer: 0,
    explanation: "Total parts = 6. Yellow = 1/6 x 24 = 4. P(yellow) = 4/24 = 1/6."
  },
  {
    id: 38,
    type: "data",
    question: "The mean of 6 numbers is 15. If 3 is subtracted from each number, what is the new mean?",
    options: [
      "9",
      "10",
      "12",
      "15",
    ],
    correctAnswer: 2,
    explanation: "Subtracting 3 from each number reduces the mean by 3. New mean = 15 - 3 = 12."
  },
  {
    id: 39,
    type: "data",
    question: "A bar chart shows the number of books read by 5 students: 8, 12, 6, 15, 9. What is the median number of books read?",
    options: [
      "8",
      "9",
      "10",
      "12",
    ],
    correctAnswer: 1,
    explanation: "Arranged: 6, 8, 9, 12, 15. The middle (3rd) value is 9."
  },
  {
    id: 40,
    type: "data",
    question: "A spinner has 10 equal sections numbered 1 to 10. What is the probability of spinning a number greater than 6?",
    options: [
      "2/5",
      "3/5",
      "3/10",
      "4/10",
    ],
    correctAnswer: 0,
    explanation: "Numbers greater than 6: 7, 8, 9, 10 = 4 numbers. P = 4/10 = 2/5."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Multi-step number work, fractions, decimals, place value, and patterns." },
  measurement: { title: "Measurement", description: "Time, area, perimeter, mass, capacity, and unit conversions." },
  geometry: { title: "Geometry", description: "Angles, shapes, properties, and solid figures." },
  data: { title: "Data & Statistics", description: "Reading data, averages, mode, range, and comparisons." },
}

export default function NumeracyDifficult7Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyDifficult7Questions : numeracyDifficult7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Difficult 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Difficult 7</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Difficult 7 Report</CardTitle>
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
              <div><h1 className="text-lg font-bold">Numeracy Difficult 7</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
