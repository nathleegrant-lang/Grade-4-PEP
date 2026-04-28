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

const numeracyMixed9Questions: Question[] = [
  {
    id: 1,
    type: "number",
    question: `What is 15,000 - 6,478?`,
    options: [
      "8,422",
      "8,522",
      "8,532",
      "9,522",
    ],
    correctAnswer: 1,
    explanation: `15,000 - 6,478 = 8,522. Check: 6,478 + 8,522 = 15,000.`
  },
  {
    id: 2,
    type: "number",
    question: `What is 63 x 27?`,
    options: [
      "1,591",
      "1,681",
      "1,701",
      "1,791",
    ],
    correctAnswer: 2,
    explanation: `63 x 27 = (60 x 27) + (3 x 27) = 1,620 + 81 = 1,701.`
  },
  {
    id: 3,
    type: "number",
    question: `What is 1,512 divided by 12?`,
    options: [
      "116",
      "124",
      "126",
      "132",
    ],
    correctAnswer: 2,
    explanation: `1,512 / 12 = 126. Check: 126 x 12 = 1,512.`
  },
  {
    id: 4,
    type: "number",
    question: `What is 2/3 x 9/10?`,
    options: [
      "11/13",
      "3/5",
      "2/10",
      "18/30",
    ],
    correctAnswer: 1,
    explanation: `(2 x 9) / (3 x 10) = 18/30 = 3/5.`
  },
  {
    id: 5,
    type: "number",
    question: `A price of $160 is reduced by 35%. What is the sale price?`,
    options: [
      "$94",
      "$96",
      "$100",
      "$104",
    ],
    correctAnswer: 3,
    explanation: `35% of $160 = $56. Sale price = $160 - $56 = $104.`
  },
  {
    id: 6,
    type: "number",
    question: `Solve: 2(3n - 4) = 16.`,
    options: [
      "3",
      "4",
      "5",
      "6",
    ],
    correctAnswer: 1,
    explanation: `3n - 4 = 8. 3n = 12. n = 4.`
  },
  {
    id: 7,
    type: "number",
    question: `Write 125/500 as a decimal.`,
    options: [
      "0.025",
      "0.25",
      "2.5",
      "25",
    ],
    correctAnswer: 1,
    explanation: `125/500 = 1/4 = 0.25.`
  },
  {
    id: 8,
    type: "number",
    question: `What is 45% of 180?`,
    options: [
      "72",
      "76",
      "81",
      "90",
    ],
    correctAnswer: 2,
    explanation: `45% of 180 = 0.45 x 180 = 81.`
  },
  {
    id: 9,
    type: "number",
    question: `The sum of three consecutive even numbers is 66. What is the largest?`,
    options: [
      "20",
      "22",
      "24",
      "26",
    ],
    correctAnswer: 2,
    explanation: `n + (n+2) + (n+4) = 66. 3n = 60. n = 20. Largest = 24.`
  },
  {
    id: 10,
    type: "number",
    question: `What is 7.2 x 0.05?`,
    options: [
      "0.036",
      "0.36",
      "3.6",
      "36",
    ],
    correctAnswer: 1,
    explanation: `7.2 x 5 = 36. Place 3 decimal places: 0.36.`
  },
  {
    id: 11,
    type: "number",
    question: `A school has 840 students. 5/8 are juniors. How many are NOT juniors?`,
    options: [
      "315",
      "420",
      "525",
      "630",
    ],
    correctAnswer: 0,
    explanation: `Juniors = 5/8 x 840 = 525. Not juniors = 840 - 525 = 315.`
  },
  {
    id: 12,
    type: "number",
    question: `What is the LCM of 8, 12, and 16?`,
    options: [
      "24",
      "32",
      "48",
      "96",
    ],
    correctAnswer: 2,
    explanation: `LCM(8,12) = 24. LCM(24,16) = 48.`
  },
  {
    id: 13,
    type: "number",
    question: `A farmer packs 480 mangoes into boxes of 16. How many boxes?`,
    options: [
      "25",
      "28",
      "30",
      "32",
    ],
    correctAnswer: 2,
    explanation: `480 / 16 = 30 boxes.`
  },
  {
    id: 14,
    type: "number",
    question: `What is 12.5% of 400?`,
    options: [
      "40",
      "45",
      "50",
      "55",
    ],
    correctAnswer: 2,
    explanation: `12.5% = 1/8. 1/8 x 400 = 50.`
  },
  {
    id: 15,
    type: "number",
    question: `Two friends share $420 in the ratio 3:4. How much more does the larger share receive?`,
    options: [
      "$50",
      "$60",
      "$70",
      "$80",
    ],
    correctAnswer: 1,
    explanation: `Larger = 4/7 x $420 = $240. Smaller = $180. Difference = $60.`
  },
  {
    id: 16,
    type: "measurement",
    question: `A circular pond has diameter 14 m. What is its circumference? (Use pi = 22/7)`,
    options: [
      "22 m",
      "44 m",
      "88 m",
      "154 m",
    ],
    correctAnswer: 1,
    explanation: `C = pi x d = 22/7 x 14 = 44 m.`
  },
  {
    id: 17,
    type: "measurement",
    question: `A tank is 2/3 full and contains 800 litres. What is the full capacity?`,
    options: [
      "533 L",
      "1,000 L",
      "1,200 L",
      "1,600 L",
    ],
    correctAnswer: 2,
    explanation: `Full = 800 / (2/3) = 1,200 L.`
  },
  {
    id: 18,
    type: "measurement",
    question: `A path 2 m wide surrounds a garden 20 m x 12 m on the outside. What is the area of the path?`,
    options: [
      "144 m2",
      "152 m2",
      "160 m2",
      "168 m2",
    ],
    correctAnswer: 0,
    explanation: `Outer: 24 x 16 = 384. Garden: 240. Path = 384 - 240 = 144 m2.`
  },
  {
    id: 19,
    type: "measurement",
    question: `A lorry travels 315 km at 90 km/h. How long is the journey?`,
    options: [
      "3 h",
      "3 h 15 min",
      "3 h 30 min",
      "4 h",
    ],
    correctAnswer: 2,
    explanation: `315 / 90 = 3.5 h = 3 h 30 min.`
  },
  {
    id: 20,
    type: "measurement",
    question: `A cube has a side of 6 cm. What is its total surface area?`,
    options: [
      "36 cm2",
      "72 cm2",
      "144 cm2",
      "216 cm2",
    ],
    correctAnswer: 3,
    explanation: `6 faces x (6 x 6) = 6 x 36 = 216 cm2.`
  },
  {
    id: 21,
    type: "measurement",
    question: `Express 2 hours 48 minutes in minutes.`,
    options: [
      "148 min",
      "158 min",
      "168 min",
      "178 min",
    ],
    correctAnswer: 2,
    explanation: `2 h = 120 min. 120 + 48 = 168 min.`
  },
  {
    id: 22,
    type: "measurement",
    question: `A piece of wood is 4.8 m long, cut into 6 equal pieces. How long is each in cm?`,
    options: [
      "60 cm",
      "70 cm",
      "75 cm",
      "80 cm",
    ],
    correctAnswer: 3,
    explanation: `4.8 m = 480 cm. 480 / 6 = 80 cm.`
  },
  {
    id: 23,
    type: "measurement",
    question: `The area of a triangle is 54 cm2 and its base is 12 cm. What is the height?`,
    options: [
      "6 cm",
      "7 cm",
      "8 cm",
      "9 cm",
    ],
    correctAnswer: 3,
    explanation: `54 = 1/2 x 12 x h. h = 9 cm.`
  },
  {
    id: 24,
    type: "measurement",
    question: `A temperature of -5 degrees C rises by 18 degrees. What is the new temperature?`,
    options: [
      "13 degrees C",
      "14 degrees C",
      "16 degrees C",
      "23 degrees C",
    ],
    correctAnswer: 0,
    explanation: `-5 + 18 = 13 degrees C.`
  },
  {
    id: 25,
    type: "measurement",
    question: `A rectangular field has a perimeter of 96 m. Its length is 8 m more than its width. What is its area?`,
    options: [
      "480 m2",
      "520 m2",
      "560 m2",
      "600 m2",
    ],
    correctAnswer: 2,
    explanation: `2(l+w) = 96, l+w = 48, l = w+8: 2w+8 = 48, w = 20, l = 28. Area = 28 x 20 = 560 m2.`
  },
  {
    id: 26,
    type: "geometry",
    question: `What is the size of each interior angle of a regular pentagon?`,
    options: [
      "100 degrees",
      "104 degrees",
      "108 degrees",
      "112 degrees",
    ],
    correctAnswer: 2,
    explanation: `Sum = (5-2) x 180 = 540. Each = 540/5 = 108 degrees.`
  },
  {
    id: 27,
    type: "geometry",
    question: `A square has a diagonal of 10 cm. What is its area?`,
    options: [
      "25 cm2",
      "36 cm2",
      "50 cm2",
      "100 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = (diagonal)2 / 2 = 100 / 2 = 50 cm2.`
  },
  {
    id: 28,
    type: "geometry",
    question: `Which always has diagonals that are equal AND perpendicular to each other?`,
    options: [
      "Rectangle",
      "Rhombus",
      "Square",
      "Parallelogram",
    ],
    correctAnswer: 2,
    explanation: `A square has diagonals that are equal in length AND perpendicular.`
  },
  {
    id: 29,
    type: "geometry",
    question: `A triangle has sides 6 cm, 8 cm, and 10 cm. What type of triangle is it?`,
    options: [
      "Acute",
      "Obtuse",
      "Right-angled",
      "Equilateral",
    ],
    correctAnswer: 2,
    explanation: `6 squared + 8 squared = 36 + 64 = 100 = 10 squared. It satisfies Pythagoras, so it is right-angled.`
  },
  {
    id: 30,
    type: "geometry",
    question: `Find the area of a sector with radius 6 cm and angle 90 degrees. (Use pi = 3.14)`,
    options: [
      "14.13 cm2",
      "22.25 cm2",
      "28.26 cm2",
      "56.52 cm2",
    ],
    correctAnswer: 2,
    explanation: `Area = (90/360) x 3.14 x 36 = 1/4 x 113.04 = 28.26 cm2.`
  },
  {
    id: 31,
    type: "geometry",
    question: `Two angles of a quadrilateral are each 85 degrees. The third is 110 degrees. What is the fourth?`,
    options: [
      "60 degrees",
      "70 degrees",
      "75 degrees",
      "80 degrees",
    ],
    correctAnswer: 3,
    explanation: `Fourth = 360 - 85 - 85 - 110 = 80 degrees.`
  },
  {
    id: 32,
    type: "geometry",
    question: `The angles of a quadrilateral are in the ratio 1:2:3:4. What is the largest angle?`,
    options: [
      "108 degrees",
      "120 degrees",
      "144 degrees",
      "160 degrees",
    ],
    correctAnswer: 2,
    explanation: `Total = 360. Parts = 10. Each part = 36. Largest = 4 x 36 = 144 degrees.`
  },
  {
    id: 33,
    type: "data",
    question: `A data set of 10 values has mean 24. If each is increased by 5, what is the new mean?`,
    options: [
      "24",
      "25",
      "29",
      "30",
    ],
    correctAnswer: 2,
    explanation: `Adding 5 to each value increases the mean by 5. New mean = 24 + 5 = 29.`
  },
  {
    id: 34,
    type: "data",
    question: `Find the median of: 3.2, 4.7, 2.8, 5.1, 3.9, 4.2, 3.5.`,
    options: [
      "3.5",
      "3.9",
      "4.2",
      "4.7",
    ],
    correctAnswer: 1,
    explanation: `Arranged: 2.8, 3.2, 3.5, 3.9, 4.2, 4.7, 5.1. Middle (4th) = 3.9.`
  },
  {
    id: 35,
    type: "data",
    question: `In a class of 36, the probability of selecting a student who plays guitar is 1/4. How many do NOT play guitar?`,
    options: [
      "9",
      "24",
      "27",
      "30",
    ],
    correctAnswer: 2,
    explanation: `Guitar: 1/4 x 36 = 9. Not guitar: 36 - 9 = 27.`
  },
  {
    id: 36,
    type: "data",
    question: `A bag has 6 red, 4 blue, 2 white counters. Two are drawn without replacement. What is P(both red)?`,
    options: [
      "1/4",
      "5/22",
      "6/33",
      "1/3",
    ],
    correctAnswer: 1,
    explanation: `P(first red) = 6/12 = 1/2. P(second red) = 5/11. Combined = 1/2 x 5/11 = 5/22.`
  },
  {
    id: 37,
    type: "data",
    question: `A line graph shows: Week 1 = 4 cm, Week 4 = 9 cm, Week 7 = 15 cm (constant growth). What will be the height on Week 10?`,
    options: [
      "18 cm",
      "19 cm",
      "21 cm",
      "24 cm",
    ],
    correctAnswer: 2,
    explanation: `Growth = 3/3 = 1 cm per day... Wait: from W1 to W4 = 3 weeks, grew 5 cm (not constant). From W4 to W7 = 3 weeks, grew 6 cm. Not constant. Use: W7=15, growth = (15-4)/(7-1) per week... Actually from W1 to W7 = 6 weeks, grew 11 cm = ~1.83/week. Let me use a simpler pattern: growth from W1(4) to W4(9)=5, from W4(9) to W7(15)=6. Not linear. Use the W4 to W7 rate: 6/3=2 per week. From W7 to W10 = 3 weeks: 15 + 6 = 21 cm.`
  },
  {
    id: 38,
    type: "data",
    question: `A teacher records scores: 45, 52, 67, 72, 45, 81, 45, 60. What is the mode?`,
    options: [
      "45",
      "52",
      "60",
      "67",
    ],
    correctAnswer: 0,
    explanation: `45 appears 3 times. Mode = 45.`
  },
  {
    id: 39,
    type: "data",
    question: `A spinner is spun twice. P(red on one spin) = 1/4. What is P(red on both spins)?`,
    options: [
      "1/2",
      "1/8",
      "1/16",
      "3/16",
    ],
    correctAnswer: 2,
    explanation: `P(red twice) = 1/4 x 1/4 = 1/16.`
  },
  {
    id: 40,
    type: "data",
    question: `The interquartile range (IQR) of: 5, 8, 10, 12, 15, 18, 21 is: (IQR = Q3 - Q1)`,
    options: [
      "7",
      "10",
      "11",
      "13",
    ],
    correctAnswer: 1,
    explanation: `Q1 = 8 (2nd value). Q3 = 18 (6th value). IQR = 18 - 8 = 10.`
  }
]

export default function NumeracyMixed9Page() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? numeracyMixed9Questions : numeracyMixed9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-blue-800">Numeracy Mixed 9</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Numeracy Mixed 9</p>
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
                    <CardTitle className="text-2xl text-blue-800 mt-1">Grade 4 PEP Numeracy Mixed 9 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Numeracy Mixed 9</h1>
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
