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

const numeracyEasy10Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: "Which number has 6 in the hundreds place?",
    options: [
      "6,234",
      "2,634",
      "3,462",
      "1,632",
    ],
    correctAnswer: 1,
    explanation: "In 2,634: 2=thousands, 6=hundreds, 3=tens, 4=ones. The hundreds digit is 6."
  },
  {
    id: 2,
    type: "number",
    question: "What is 1,400 - 563?",
    options: [
      "827",
      "837",
      "847",
      "937",
    ],
    correctAnswer: 1,
    explanation: "1,400 - 563 = 837. Check: 563 + 837 = 1,400."
  },
  {
    id: 3,
    type: "number",
    question: "What is 8 x 11?",
    options: [
      "80",
      "82",
      "88",
      "98",
    ],
    correctAnswer: 2,
    explanation: "8 x 11 = 88."
  },
  {
    id: 4,
    type: "number",
    question: "A crate holds 12 bottles. How many bottles are in 9 crates?",
    options: [
      "96",
      "104",
      "108",
      "118",
    ],
    correctAnswer: 2,
    explanation: "12 x 9 = 108 bottles."
  },
  {
    id: 5,
    type: "number",
    question: "What is 144 divided by 12?",
    options: [
      "10",
      "11",
      "12",
      "13",
    ],
    correctAnswer: 2,
    explanation: "144 / 12 = 12. Check: 12 x 12 = 144."
  },
  {
    id: 6,
    type: "number",
    question: "Which of these numbers is a PRIME number?",
    options: [
      "9",
      "15",
      "23",
      "27",
    ],
    correctAnswer: 2,
    explanation: "A prime number has only two factors: 1 and itself. 23 can only be divided by 1 and 23."
  },
  {
    id: 7,
    type: "number",
    question: "What is 1/5 + 2/5?",
    options: [
      "2/10",
      "3/5",
      "3/10",
      "1/2",
    ],
    correctAnswer: 1,
    explanation: "When fractions have the same denominator, add the numerators: 1/5 + 2/5 = 3/5."
  },
  {
    id: 8,
    type: "number",
    question: "A school has 480 books shared equally among 8 classes. How many books does each class get?",
    options: [
      "50",
      "55",
      "60",
      "65",
    ],
    correctAnswer: 2,
    explanation: "480 / 8 = 60 books per class."
  },
  {
    id: 9,
    type: "number",
    question: "What is 5/8 of 40?",
    options: [
      "20",
      "25",
      "28",
      "32",
    ],
    correctAnswer: 1,
    explanation: "1/8 of 40 = 5. 5/8 = 5 x 5 = 25."
  },
  {
    id: 10,
    type: "number",
    question: "Round 9,847 to the nearest thousand.",
    options: [
      "9,000",
      "9,800",
      "9,850",
      "10,000",
    ],
    correctAnswer: 3,
    explanation: "Look at the hundreds digit: 8 is 5 or more, so round up. 9,847 rounds to 10,000."
  },
  {
    id: 11,
    type: "number",
    question: "What is 4.5 + 2.3?",
    options: [
      "6.2",
      "6.5",
      "6.8",
      "7.2",
    ],
    correctAnswer: 2,
    explanation: "4.5 + 2.3 = 6.8. Add the decimals: 5+3=8 tenths, ones: 4+2=6. Answer = 6.8."
  },
  {
    id: 12,
    type: "number",
    question: "Which pair of fractions are EQUIVALENT?",
    options: [
      "1/2 and 2/3",
      "3/4 and 6/8",
      "2/3 and 3/4",
      "1/3 and 2/5",
    ],
    correctAnswer: 1,
    explanation: "3/4 and 6/8 are equivalent because 6/8 = 3/4 when both are divided by 2."
  },
  {
    id: 13,
    type: "number",
    question: "A vendor had 270 mangoes. She sold 3/9 of them. How many mangoes remain?",
    options: [
      "90",
      "150",
      "170",
      "180",
    ],
    correctAnswer: 3,
    explanation: "3/9 = 1/3. 1/3 of 270 = 90 sold. Remaining = 270 - 90 = 180 mangoes."
  },
  {
    id: 14,
    type: "number",
    question: "What is the product of 6 and 15?",
    options: [
      "21",
      "80",
      "90",
      "100",
    ],
    correctAnswer: 2,
    explanation: "Product means multiply. 6 x 15 = 90."
  },
  {
    id: 15,
    type: "number",
    question: "What is the value of 10 squared?",
    options: [
      "20",
      "100",
      "200",
      "1,000",
    ],
    correctAnswer: 1,
    explanation: "10 squared means 10 x 10 = 100."
  },
  {
    id: 16,
    type: "measurement",
    question: "A running track is 400 m long. How many laps must a runner complete to run exactly 2 km?",
    options: [
      "4",
      "5",
      "6",
      "8",
    ],
    correctAnswer: 1,
    explanation: "2 km = 2,000 m. 2,000 / 400 = 5 laps."
  },
  {
    id: 17,
    type: "measurement",
    question: "How many hours and minutes are in 245 minutes?",
    options: [
      "3 hours 45 minutes",
      "4 hours 5 minutes",
      "4 hours 15 minutes",
      "4 hours 25 minutes",
    ],
    correctAnswer: 1,
    explanation: "245 / 60 = 4 remainder 5. So 245 minutes = 4 hours 5 minutes."
  },
  {
    id: 18,
    type: "measurement",
    question: "A rectangle has a perimeter of 36 cm. Its width is 7 cm. What is its length?",
    options: [
      "9 cm",
      "11 cm",
      "18 cm",
      "22 cm",
    ],
    correctAnswer: 1,
    explanation: "2 x (length + 7) = 36. length + 7 = 18. length = 11 cm."
  },
  {
    id: 19,
    type: "measurement",
    question: "How many millilitres are equal to 3/4 of a litre?",
    options: [
      "300 mL",
      "700 mL",
      "750 mL",
      "900 mL",
    ],
    correctAnswer: 2,
    explanation: "3/4 of 1,000 mL = 750 mL."
  },
  {
    id: 20,
    type: "measurement",
    question: "A shop opens at 7:00 AM and closes at 7:00 PM. For how many hours is it open?",
    options: [
      "10 hours",
      "11 hours",
      "12 hours",
      "14 hours",
    ],
    correctAnswer: 2,
    explanation: "From 7:00 AM to 7:00 PM = 12 hours."
  },
  {
    id: 21,
    type: "measurement",
    question: "What is the area of a triangle with a base of 10 cm and a height of 6 cm?",
    options: [
      "16 cm2",
      "30 cm2",
      "60 cm2",
      "80 cm2",
    ],
    correctAnswer: 1,
    explanation: "Area of triangle = 1/2 x base x height = 1/2 x 10 x 6 = 30 cm2."
  },
  {
    id: 22,
    type: "measurement",
    question: "A parcel weighs 3 kg 750 g. What is this in grams?",
    options: [
      "3,075 g",
      "3,750 g",
      "37,050 g",
      "37,500 g",
    ],
    correctAnswer: 1,
    explanation: "3 kg = 3,000 g. 3,000 + 750 = 3,750 g."
  },
  {
    id: 23,
    type: "measurement",
    question: "What is 250 cm in metres?",
    options: [
      "0.25 m",
      "2.5 m",
      "25 m",
      "250 m",
    ],
    correctAnswer: 1,
    explanation: "100 cm = 1 m. 250 cm = 250 / 100 = 2.5 m."
  },
  {
    id: 24,
    type: "measurement",
    question: "A meeting starts at 10:45 AM and ends at 12:15 PM. How long does it last?",
    options: [
      "1 hour 15 minutes",
      "1 hour 30 minutes",
      "1 hour 45 minutes",
      "2 hours",
    ],
    correctAnswer: 1,
    explanation: "10:45 to 12:15: from 10:45 to 11:45 = 1 hour, then 11:45 to 12:15 = 30 minutes. Total = 1 hour 30 minutes."
  },
  {
    id: 25,
    type: "measurement",
    question: "A room is 6 m long and 4 m wide. Tiles cost $8 per square metre. What is the total cost?",
    options: [
      "$152",
      "$160",
      "$176",
      "$192",
    ],
    correctAnswer: 3,
    explanation: "Area = 6 x 4 = 24 m2. Cost = 24 x $8 = $192."
  },
  {
    id: 26,
    type: "geometry",
    question: "What is the total number of faces, edges, and vertices of a cube?",
    options: [
      "24",
      "26",
      "28",
      "30",
    ],
    correctAnswer: 1,
    explanation: "Cube has 6 faces + 12 edges + 8 vertices = 26."
  },
  {
    id: 27,
    type: "geometry",
    question: "Which of these is a property of EVERY rectangle?",
    options: [
      "All sides are equal",
      "All angles are 90 degrees",
      "Opposite sides are unequal",
      "Diagonals are perpendicular",
    ],
    correctAnswer: 1,
    explanation: "Every rectangle has 4 angles of exactly 90 degrees."
  },
  {
    id: 28,
    type: "geometry",
    question: "How many degrees are in a full rotation?",
    options: [
      "90 degrees",
      "180 degrees",
      "270 degrees",
      "360 degrees",
    ],
    correctAnswer: 3,
    explanation: "A full rotation (complete turn) is 360 degrees."
  },
  {
    id: 29,
    type: "geometry",
    question: "A triangle has angles of 55 degrees, 75 degrees, and one unknown angle. What is the unknown angle?",
    options: [
      "40 degrees",
      "45 degrees",
      "50 degrees",
      "55 degrees",
    ],
    correctAnswer: 2,
    explanation: "Angles in a triangle sum to 180 degrees. Unknown = 180 - 55 - 75 = 50 degrees."
  },
  {
    id: 30,
    type: "geometry",
    question: "Which solid has NO vertices at all?",
    options: [
      "Cone",
      "Cube",
      "Cylinder",
      "Triangular prism",
    ],
    correctAnswer: 2,
    explanation: "A cylinder has no vertices (corners). It has two circular edges and a curved surface but no sharp corners."
  },
  {
    id: 31,
    type: "geometry",
    question: "What is a line segment from the centre of a circle to its edge called?",
    options: [
      "Diameter",
      "Radius",
      "Circumference",
      "Chord",
    ],
    correctAnswer: 1,
    explanation: "A radius is the line from the centre of a circle to any point on its edge."
  },
  {
    id: 32,
    type: "geometry",
    question: "Two angles in a triangle are each 60 degrees. What type of triangle is it?",
    options: [
      "Scalene",
      "Isosceles",
      "Equilateral",
      "Right-angled",
    ],
    correctAnswer: 2,
    explanation: "If two angles are 60 degrees, the third is also 60 degrees. All angles equal means all sides equal: equilateral triangle."
  },
  {
    id: 33,
    type: "data",
    question: "The scores of 5 students are: 48, 62, 55, 70, 35. What is the mean score?",
    options: [
      "48",
      "54",
      "55",
      "62",
    ],
    correctAnswer: 1,
    explanation: "Mean = (48 + 62 + 55 + 70 + 35) / 5 = 270 / 5 = 54."
  },
  {
    id: 34,
    type: "data",
    question: "Find the median of: 8, 3, 15, 6, 12, 9, 4",
    options: [
      "6",
      "8",
      "9",
      "12",
    ],
    correctAnswer: 1,
    explanation: "Arranged: 3, 4, 6, 8, 9, 12, 15. The middle (4th) value is 8."
  },
  {
    id: 35,
    type: "data",
    question: "In a class of 36 students, 1/4 walk to school, 1/2 come by bus, and the rest are driven. How many are driven to school?",
    options: [
      "7",
      "8",
      "9",
      "10",
    ],
    correctAnswer: 2,
    explanation: "Walking: 1/4 x 36 = 9. Bus: 1/2 x 36 = 18. Driven: 36 - 9 - 18 = 9."
  },
  {
    id: 36,
    type: "data",
    question: "A bar chart shows: Monday = 15 customers, Tuesday = 22, Wednesday = 18, Thursday = 25, Friday = 20. What is the range?",
    options: [
      "5",
      "7",
      "10",
      "25",
    ],
    correctAnswer: 2,
    explanation: "Range = highest - lowest = 25 - 15 = 10."
  },
  {
    id: 37,
    type: "data",
    question: "A pictograph uses 1 apple to represent 4 fruits sold. A stall shows 8 apples on Monday and 6 apples on Tuesday. How many fruits were sold in total?",
    options: [
      "14",
      "24",
      "48",
      "56",
    ],
    correctAnswer: 3,
    explanation: "Monday: 8 x 4 = 32. Tuesday: 6 x 4 = 24. Total = 32 + 24 = 56 fruits."
  },
  {
    id: 38,
    type: "data",
    question: "The ages of children at a party are: 9, 10, 8, 10, 9, 9, 8, 10. What is the mode?",
    options: [
      "8",
      "9",
      "10",
      "9 and 10",
    ],
    correctAnswer: 3,
    explanation: "9 appears 3 times and 10 appears 3 times. Both are modes. This set is bimodal: 9 and 10."
  },
  {
    id: 39,
    type: "data",
    question: "The temperatures over 4 days were: 28, 31, 26, 33. What was the mean temperature?",
    options: [
      "28",
      "29",
      "29.5",
      "30",
    ],
    correctAnswer: 2,
    explanation: "Mean = (28 + 31 + 26 + 33) / 4 = 118 / 4 = 29.5 degrees."
  },
  {
    id: 40,
    type: "data",
    question: "A class of 30 students was asked their favourite subject. 12 chose Maths. What percentage chose Maths?",
    options: [
      "30%",
      "35%",
      "40%",
      "45%",
    ],
    correctAnswer: 2,
    explanation: "Percentage = (12/30) x 100 = 0.4 x 100 = 40%."
  }
]

type SectionKey = Question["type"]

const sectionConfig: Record<SectionKey, { title: string; description: string }> = {
  number: { title: "Number Operations", description: "Place value, rounding, fractions, and basic number reasoning." },
  measurement: { title: "Measurement", description: "Units, time, length, mass, and capacity." },
  geometry: { title: "Geometry", description: "Shapes, angles, and spatial reasoning." },
  data: { title: "Data & Statistics", description: "Reading tables, graphs, and simple statistics." },
}

export default function NumeracyEasy10Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyEasy10Questions : numeracyEasy10Questions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => { if (answers.length !== totalQuestions) { setAnswers(new Array(totalQuestions).fill(null)) } }, [totalQuestions, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true); return 0 }
          return prev - 1
        })
      }, 1000)
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
    const correct = sqs.reduce((sum, q) => {
      const index = availableQuestions.findIndex((item) => item.id === q.id)
      return sum + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)
    const total = sqs.length
    const percentage = total ? Math.round((correct / total) * 100) : 0
    const note = percentage >= 85 ? "Excellent work" : percentage >= 70 ? "Good understanding" : percentage >= 50 ? "Developing" : "Needs more practice"
    return { title: sectionConfig[section].title, description: sectionConfig[section].description, correct, total, percentage, note }
  }

  const sectionSummaries = (Object.keys(sectionConfig) as SectionKey[]).map(getSectionSummary).filter((s) => s.total > 0)

  const handleSubmit = () => { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true) }

  const restartTest = () => { setTestStarted(false); setTestCompleted(false); setCurrentQuestion(0); setAnswers(new Array(totalQuestions).fill(null)); setTimeRemaining(isPremium ? 60 * 60 : 10 * 60); setShowReview(false); setCompletedAt("") }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  const sectionLabel = (type: SectionKey) => type === "number" ? "Number Operations" : type === "measurement" ? "Measurement" : type === "geometry" ? "Geometry" : "Data & Statistics"

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/numeracy" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Numeracy Mock Tests</Link>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <Calculator className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Numeracy Easy 10</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{totalQuestions}</p><p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-blue-600">{isPremium ? 60 : 10}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-medium text-amber-800">Free Preview Mode</p><p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full paper and printable report.</p></div></div>
                    <Link href="/pricing" className="block mt-3"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button></Link>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Clear place value and number sense questions</li>
                    <li>- Simple measurement and unit understanding</li>
                    <li>- Basic geometry and shape properties</li>
                    <li>- Reading graphs and simple data</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Choose the best answer.</li>
                    <li>- You may move between questions.</li>
                    <li>- Use rough work if needed.</li>
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
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-blue-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <CheckCircle className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl text-blue-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Easy 10</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg"><p className="text-5xl font-bold text-blue-600">{score}/{totalQuestions}</p><p className="text-gray-600 mt-2">Questions Correct</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-blue-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={`text-2xl font-bold ${color}`}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionSummaries.map((s) => (<div key={s.title} className="rounded-lg bg-white border p-4"><p className="font-semibold text-slate-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.correct}/{s.total} correct · {s.percentage}%</p><p className="text-sm text-blue-700 mt-2 font-medium">{s.note}</p></div>))}
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left"><h3 className="text-lg font-semibold text-blue-800 mb-2">Result Summary</h3><p className="text-sm text-slate-700">This easy-level numeracy report includes section summaries and a full question-by-question review with explanations.</p></div>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Easy 10 Report</CardTitle>
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
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Section Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionSummaries.map((s) => (<div key={s.title} className="rounded-lg bg-white border p-4"><p className="font-semibold text-slate-800">{s.title}</p><p className="text-sm text-slate-600 mt-1">{s.correct}/{s.total} correct · {s.percentage}%</p><p className="text-sm text-blue-700 mt-2 font-medium">{s.note}</p></div>))}
                </div>
              </div>
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5"><h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Summary</h3><p className="text-sm text-slate-700">This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.</p></div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2"><p className="font-semibold text-slate-800">Question {index + 1}</p><span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{sectionLabel(q.type)}</span></div>
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
              <div><h1 className="text-lg font-bold">Numeracy Easy 10</h1><p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p></div>
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
              <div className="flex items-center justify-between"><span className="text-sm font-medium text-blue-700 uppercase">{sectionLabel(question.type)}</span><span className="text-sm text-gray-500">Question {currentQuestion + 1}</span></div>
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
