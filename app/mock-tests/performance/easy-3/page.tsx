"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Textarea } from "@/components/ui/textarea"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, ClipboardList, RotateCcw, Home, FileText, Lightbulb, Lock, Crown, ArrowLeft, Printer, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const FREE_PARTS_LIMIT = 3

interface TaskPart {
  id: number
  title: string
  category: "reading" | "short-response" | "extended-writing"
  type: "multiple-choice" | "short-answer" | "extended-writing"
  question: string
  context?: string
  options?: string[]
  correctAnswer?: number
  explanation?: string
  reviewGuidance?: string
  guidelines?: string[]
  maxScore: number
}

interface TaskSource {
  id: number
  title: string
  content: string
}

interface PerformanceTaskSet {
  title: string
  subtitle: string
  introduction: string
  difficultyLabel: string
  sources: TaskSource[]
  parts: TaskPart[]
}

const performanceTask: PerformanceTaskSet = {
  "title": "Performance Easy 3",
  "subtitle": "Grade 4 PEP Easy Practice Task",
  "introduction": "Read the sources about markets in Jamaica. Then answer the questions that follow. Use the information from the sources to help you.",
  "difficultyLabel": "Easy • Clear facts, direct evidence, and simpler writing support",
  "sources": [
    {
      "id": 1,
      "title": "Source 1: What Is a Market?",
      "content": "A market is a place where people buy and sell things. In Jamaica, markets are very busy and full of colour. Vendors sell fresh fruits, vegetables, fish, and other foods. People come from many different areas to shop at the market. Markets are an important part of life in Jamaica."
    },
    {
      "id": 2,
      "title": "Source 2: What You Can Find at the Market",
      "content": "At a Jamaican market you can find many things. There are mangoes, bananas, yams, sweet potatoes, and many other fruits and vegetables. Some vendors also sell spices, herbs, and handmade crafts. The market is a good place to find fresh, local produce. Shopping at the market helps local farmers earn money."
    },
    {
      "id": 3,
      "title": "Source 3: Market Day",
      "content": "Market day is a special time for many communities in Jamaica. Families often go together to buy food for the week. The market is noisy and lively. People talk, bargain, and catch up with friends. Many children enjoy going to the market with their parents because it is exciting and full of activity."
    }
  ],
  "parts": [
    {
      "id": 1,
      "title": "Part A: Reading Comprehension",
      "category": "reading",
      "type": "multiple-choice",
      "question": "According to Source 1, what do vendors sell at Jamaican markets?",
      "options": [
        "Only fish",
        "Only crafts",
        "Fresh fruits, vegetables, fish, and other foods",
        "Only spices"
      ],
      "correctAnswer": 2,
      "explanation": "Source 1 says vendors sell fresh fruits, vegetables, fish, and other foods.",
      "maxScore": 2
    },
    {
      "id": 2,
      "title": "Part B: Finding Information",
      "category": "reading",
      "type": "multiple-choice",
      "question": "According to Source 2, how does shopping at the market help the community?",
      "options": [
        "It helps children win prizes",
        "It helps local farmers earn money",
        "It helps tourists find hotels",
        "It helps schools buy books"
      ],
      "correctAnswer": 1,
      "explanation": "Source 2 says shopping at the market helps local farmers earn money.",
      "maxScore": 2
    },
    {
      "id": 3,
      "title": "Part C: Making Connections",
      "category": "reading",
      "type": "multiple-choice",
      "question": "What do Sources 1 and 3 both suggest about Jamaican markets?",
      "options": [
        "They are quiet and calm",
        "They are only for adults",
        "They are busy and important to the community",
        "They only sell crafts"
      ],
      "correctAnswer": 2,
      "explanation": "Source 1 describes the market as busy and important to life in Jamaica, and Source 3 says market day is lively and special.",
      "maxScore": 2
    },
    {
      "id": 4,
      "title": "Part D: Short Response",
      "category": "short-response",
      "type": "short-answer",
      "question": "Give TWO facts about Jamaican markets from the sources. Write in complete sentences.",
      "guidelines": [
        "Write 2 complete sentences",
        "Give 2 correct facts",
        "Use your own words"
      ],
      "reviewGuidance": "Choose two clear facts, such as what is sold, why people visit, or how market day feels.",
      "maxScore": 4,
      "context": "You may use any two of the three sources."
    },
    {
      "id": 5,
      "title": "Part E: Understanding Importance",
      "category": "reading",
      "type": "multiple-choice",
      "question": "Why do many children enjoy going to the market?",
      "options": [
        "It is quiet and peaceful",
        "It is exciting and full of activity",
        "They can shop alone",
        "They sell toys there"
      ],
      "correctAnswer": 1,
      "explanation": "Source 3 says children enjoy going because it is exciting and full of activity.",
      "maxScore": 2
    },
    {
      "id": 6,
      "title": "Part F: Short Response",
      "category": "short-response",
      "type": "short-answer",
      "question": "Explain why markets are important to people in Jamaica.",
      "guidelines": [
        "Write 2-3 complete sentences",
        "Use information from the sources"
      ],
      "reviewGuidance": "Mention that markets provide fresh food, help farmers earn money, and bring communities together on market day.",
      "maxScore": 6
    },
    {
      "id": 7,
      "title": "Part G: Extended Writing",
      "category": "extended-writing",
      "type": "extended-writing",
      "question": "Write a short article for your class booklet about markets in Jamaica. Tell what a market is, what you can find there, and why market day is special.",
      "guidelines": [
        "Write at least 2 paragraphs",
        "Use facts from the sources",
        "Write in complete sentences"
      ],
      "reviewGuidance": "Introduce what a market is and why it matters. Describe what people buy and sell. Explain what makes market day a special community event.",
      "maxScore": 12
    }
  ]
}

function getSectionLabel(category: TaskPart["category"]) {
  if (category === "reading") return "Reading & Information"
  if (category === "short-response") return "Short Response"
  return "Extended Writing"
}

function getSectionSummary(parts: TaskPart[], answers: (number | string | null)[]) {
  const categories: TaskPart["category"][] = ["reading", "short-response", "extended-writing"]
  return categories.map((category) => {
    const sectionParts = parts.filter((part) => part.category === category)
    const earned = sectionParts.reduce((sum, part) => {
      const index = parts.findIndex((item) => item.id === part.id)
      const answer = answers[index]
      if (part.type === "multiple-choice") return sum + (answer === part.correctAnswer ? part.maxScore : 0)
      if (typeof answer === "string" && answer.trim()) {
        if (part.type === "extended-writing") {
          if (answer.trim().length > 220) return sum + Math.round(part.maxScore * 0.75)
          if (answer.trim().length > 120) return sum + Math.round(part.maxScore * 0.5)
          return sum + Math.round(part.maxScore * 0.25)
        }
        if (answer.trim().length > 90) return sum + Math.round(part.maxScore * 0.75)
        if (answer.trim().length > 40) return sum + Math.round(part.maxScore * 0.5)
        return sum + Math.round(part.maxScore * 0.25)
      }
      return sum
    }, 0)
    const possible = sectionParts.reduce((sum, part) => sum + part.maxScore, 0)
    const percentage = possible ? Math.round((earned / possible) * 100) : 0
    let note = "Needs more support"
    if (percentage >= 85) note = "Excellent understanding"
    else if (percentage >= 70) note = "Good progress"
    else if (percentage >= 50) note = "Developing steadily"
    return { label: getSectionLabel(category), earned, possible, percentage, note }
  })
}

export default function PerformanceTaskExpanded() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [answers, setAnswers] = useState<(number | string | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(90 * 60)
  const [showReview, setShowReview] = useState(false)
  const [showSources, setShowSources] = useState(true)
  const [completedAt, setCompletedAt] = useState("")

  const availableParts = isPremium ? performanceTask.parts : performanceTask.parts.slice(0, FREE_PARTS_LIMIT)
  const totalParts = availableParts.length

  useEffect(() => { if (answers.length !== totalParts) { setAnswers(new Array(totalParts).fill(null)) } }, [totalParts, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => { if (prev <= 1) { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true); return 0 } return prev - 1 })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const handleAnswer = (answer: number | string) => { const a = [...answers]; a[currentPart] = answer; setAnswers(a) }

  const calculateScore = () => {
    let score = 0
    availableParts.forEach((part, index) => {
      const answer = answers[index]
      if (part.type === "multiple-choice") { if (answer === part.correctAnswer) score += part.maxScore; return }
      if (typeof answer === "string" && answer.trim()) {
        if (part.type === "extended-writing") {
          if (answer.trim().length > 220) score += Math.round(part.maxScore * 0.75)
          else if (answer.trim().length > 120) score += Math.round(part.maxScore * 0.5)
          else score += Math.round(part.maxScore * 0.25)
          return
        }
        if (answer.trim().length > 90) score += Math.round(part.maxScore * 0.75)
        else if (answer.trim().length > 40) score += Math.round(part.maxScore * 0.5)
        else score += Math.round(part.maxScore * 0.25)
      }
    })
    return score
  }

  const getTotalPossibleScore = () => availableParts.reduce((sum, part) => sum + part.maxScore, 0)
  const getScorePercentage = () => Math.round((calculateScore() / getTotalPossibleScore()) * 100)

  const getGrade = () => {
    const p = getScorePercentage()
    if (p >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (p >= 70) return { grade: "Good", color: "text-blue-600" }
    if (p >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const handleSubmit = () => { setCompletedAt(new Date().toLocaleString()); setTestCompleted(true) }

  const restartTest = () => {
    setTestStarted(false); setTestCompleted(false); setCurrentPart(0)
    setAnswers(new Array(totalParts).fill(null)); setTimeRemaining(isPremium ? 90 * 60 : 20 * 60)
    setShowReview(false); setCompletedAt("")
  }

  const part = availableParts[currentPart]
  const answeredCount = answers.filter((a) => a !== null && a !== "").length
  const sectionSummary = getSectionSummary(availableParts, answers)

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/performance" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Performance Task Mock Tests</Link>
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-amber-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <ClipboardList className="h-16 w-16 mx-auto text-amber-600 mb-4" />
              <CardTitle className="text-2xl text-amber-800">{performanceTask.title}</CardTitle>
              <p className="text-gray-600 mt-2">{performanceTask.subtitle}</p>
              <p className="text-sm font-medium text-amber-700 mt-2">{performanceTask.difficultyLabel}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm text-slate-700 whitespace-pre-line">{performanceTask.introduction}</p></div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-amber-600">{totalParts}</p><p className="text-sm text-gray-600">Parts {!isPremium && "(Preview)"}</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-2xl font-bold text-amber-600">{isPremium ? 90 : 20}</p><p className="text-sm text-gray-600">Minutes</p></div>
                </div>
                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-medium text-amber-800">Free Preview Mode</p><p className="text-sm text-amber-700">You can try {FREE_PARTS_LIMIT} parts for free. Upgrade to Premium for the full performance task with the branded report.</p></div></div>
                    <Link href="/pricing" className="block mt-3"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />Upgrade to Premium</Button></Link>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Task Layout</h3>
                  <ul className="text-sm text-gray-700 space-y-1"><li>- Reading &amp; information questions</li><li>- Short constructed responses</li><li>- One extended writing task</li><li>- Printable report with section summaries</li></ul>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Sources Included</h3>
                  <ul className="text-sm text-gray-700 space-y-1">{performanceTask.sources.map((source) => (<li key={source.id}>• {source.title}</li>))}</ul>
                </div>
                <Button onClick={() => setTestStarted(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6">Start Task</Button>
                <Link href="/mock-tests/performance"><Button variant="outline" className="w-full">Back to Performance Task Mock Tests</Button></Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore(); const total = getTotalPossibleScore(); const percentage = getScorePercentage(); const { grade, color } = getGrade()
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-amber-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm"><Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority /></div>
              <CheckCircle className="h-16 w-16 mx-auto text-amber-600 mb-4" />
              <CardTitle className="text-2xl text-amber-800">Performance Task Completed</CardTitle>
              <p className="text-gray-600 mt-2">{performanceTask.title}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg"><p className="text-5xl font-bold text-amber-600">{score}/{total}</p><p className="text-gray-600 mt-2">Points Earned</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-3xl font-bold text-amber-600">{percentage}%</p><p className="text-sm text-gray-600">Score</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className={cn("text-2xl font-bold", color)}>{grade}</p><p className="text-sm text-gray-600">Performance</p></div>
                  <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p><p className="text-sm text-gray-600">Completed</p></div>
                </div>
                <div className="grid gap-4 md:grid-cols-3 text-left">
                  {sectionSummary.map((section) => (<div key={section.label} className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-800">{section.label}</p><p className="text-2xl font-bold text-slate-800 mt-2">{section.earned}/{section.possible}</p><p className="text-sm text-slate-600">{section.percentage}%</p><p className="text-xs text-slate-500 mt-2">{section.note}</p></div>))}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-left"><h3 className="text-lg font-semibold text-amber-800 mb-2">Result Summary</h3><p className="text-sm text-slate-700">This easy performance task report includes section summaries, multiple-choice results, written responses, and teacher-style guidance. Then print or save the report as a PDF with the logo.</p></div>
                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-amber-500 hover:bg-amber-600">Review Answers &amp; Report</Button>
                  <Button onClick={restartTest} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-2" />Take Task Again</Button>
                  <Link href="/mock-tests/performance"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Performance Task Mock Tests</Button></Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showReview) {
    const score = calculateScore(); const total = getTotalPossibleScore(); const percentage = getScorePercentage(); const { grade, color } = getGrade()
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
                    <CardTitle className="text-2xl text-amber-800 mt-1">Grade 4 PEP Performance Task Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">Student: <span className="font-medium">{user?.childName ?? "Student"}</span></p>
                    <p className="text-sm text-gray-600">Task: <span className="font-medium">{performanceTask.title}</span></p>
                    <p className="text-sm text-gray-600">Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-amber-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-amber-700">{score}/{total}</p><p className="text-xs text-slate-600">Score</p></div>
                  <div className="rounded-lg bg-amber-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-amber-700">{percentage}%</p><p className="text-xs text-slate-600">Percent</p></div>
                  <div className="rounded-lg bg-amber-50 p-4 min-w-[90px]"><p className={cn("text-lg font-bold", color)}>{grade}</p><p className="text-xs text-slate-600">Performance</p></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Section Summary</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {sectionSummary.map((section) => (<div key={section.label} className="rounded-lg bg-white border border-amber-100 p-4"><p className="font-semibold text-slate-800">{section.label}</p><p className="text-2xl font-bold text-amber-700 mt-2">{section.earned}/{section.possible}</p><p className="text-sm text-slate-600">{section.percentage}%</p><p className="text-xs text-slate-500 mt-2">{section.note}</p></div>))}
                </div>
              </div>
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5"><h3 className="text-lg font-semibold text-amber-800 mb-2">Performance Summary</h3><p className="text-sm text-slate-700">This report includes reading and information questions, written responses, and teacher-style feedback. Written responses are estimated using response length and completion. In a live classroom, a teacher would also mark content, organization, and use of evidence.</p></div>
              <div className="space-y-6">
                {availableParts.map((taskPart, index) => {
                  const isCorrect = taskPart.type === "multiple-choice" && answers[index] === taskPart.correctAnswer
                  return (
                    <div key={taskPart.id} className={cn("p-5 rounded-xl border-2", taskPart.type === "multiple-choice" ? isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50")}>
                      <div className="flex items-start gap-3">
                        {taskPart.type === "multiple-choice" ? (isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />) : (<ClipboardList className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />)}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2"><p className="font-semibold text-slate-800">{taskPart.title}</p><span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">{getSectionLabel(taskPart.category)}</span></div>
                          <p className="text-slate-800 whitespace-pre-line mb-3">{taskPart.question}</p>
                          {taskPart.type === "multiple-choice" && taskPart.options && (
                            <div className="space-y-1 text-sm">
                              <p className="text-slate-700"><span className="font-medium">Student&apos;s Answer:</span> <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>{answers[index] !== null ? taskPart.options[answers[index] as number] : "Not answered"}</span></p>
                              <p className="text-green-700"><span className="font-medium">Correct Answer:</span> {taskPart.options[taskPart.correctAnswer!]}</p>
                              {taskPart.explanation && (<p className="text-slate-700 mt-2"><span className="font-medium">Explanation:</span> {taskPart.explanation}</p>)}
                            </div>
                          )}
                          {(taskPart.type === "short-answer" || taskPart.type === "extended-writing") && (
                            <div className="space-y-3 text-sm">
                              <div><p className="font-medium text-slate-700 mb-1">Student&apos;s Response:</p><div className="rounded-lg border bg-white p-3 text-slate-700 whitespace-pre-line">{answers[index] || <span className="italic text-slate-400">No response provided</span>}</div></div>
                              <div className="rounded-lg border border-amber-100 bg-white p-3"><p className="font-medium text-amber-800 mb-1">Writing Guidance</p><p className="text-slate-700">{taskPart.reviewGuidance || "Use evidence from the sources, organize ideas clearly, and write in complete sentences."}</p></div>
                            </div>
                          )}
                          <p className="text-xs text-slate-500 mt-3">Maximum points: {taskPart.maxScore}</p>
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
            <Button onClick={() => window.print()} className="flex-1 bg-amber-500 hover:bg-amber-600"><Printer className="h-4 w-4 mr-2" />Download / Print Report</Button>
            <Button onClick={restartTest} variant="outline" className="flex-1"><RotateCcw className="h-4 w-4 mr-2" />Take Task Again</Button>
            <Link href="/mock-tests/performance" className="flex-1"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Performance Task Mock Tests</Button></Link>
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
              <Link href="/mock-tests/performance" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test"><ArrowLeft className="h-5 w-5" /></Link>
              <ClipboardList className="h-8 w-8" />
              <div><h1 className="text-lg font-bold">{performanceTask.title}</h1><p className="text-sky-100 text-xs">Part {currentPart + 1} of {totalParts}</p></div>
            </div>
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", timeRemaining <= 300 ? "bg-red-500" : "bg-green-600")}><Clock className="h-5 w-5" />{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </header>
      <div className="bg-white border-b shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2"><span>Progress: {answeredCount}/{totalParts} parts completed</span><span>{Math.round((answeredCount / totalParts) * 100)}% complete</span></div>
          <Progress value={(answeredCount / totalParts) * 100} className="h-2" />
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6"><Button variant="outline" onClick={() => setShowSources(!showSources)} className="w-full md:w-auto"><FileText className="h-4 w-4 mr-2" />{showSources ? "Hide Sources" : "Show Sources"}</Button></div>
          <div className="grid lg:grid-cols-2 gap-6">
            {showSources && (
              <div className="space-y-4">
                {performanceTask.sources.map((source) => (
                  <Card key={source.id} className="border-gray-200">
                    <CardHeader className="py-3 bg-gray-50"><CardTitle className="text-sm text-gray-800">{source.title}</CardTitle></CardHeader>
                    <CardContent className="text-sm text-gray-700 whitespace-pre-line max-h-56 overflow-y-auto">{source.content}</CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className={showSources ? "" : "lg:col-span-2 max-w-3xl mx-auto w-full"}>
              <Card className="mb-6">
                <CardHeader className="bg-amber-50"><div className="flex items-center justify-between"><span className="text-sm font-medium text-amber-700">{part.title}</span><span className="text-sm text-gray-500">{part.maxScore} points</span></div></CardHeader>
                <CardContent className="p-6">
                  {part.context && (<div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-start gap-2"><Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />{part.context}</div>)}
                  <p className="text-lg text-gray-800 mb-6 whitespace-pre-line">{part.question}</p>
                  {part.guidelines && (<div className="mb-4 p-3 bg-amber-50 rounded-lg"><p className="text-sm font-medium text-amber-800 mb-2">Guidelines:</p><ul className="text-sm text-gray-700 space-y-1">{part.guidelines.map((g, i) => (<li key={i}>• {g}</li>))}</ul></div>)}
                  {part.type === "multiple-choice" && part.options && (
                    <div className="space-y-3">
                      {part.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(index)} className={cn("w-full p-4 text-left rounded-lg border-2 transition-all", answers[currentPart] === index ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50")}>
                          <span className="font-medium text-amber-700 mr-3">{String.fromCharCode(65 + index)}.</span>{option}
                        </button>
                      ))}
                    </div>
                  )}
                  {part.type === "short-answer" && (<Textarea placeholder="Write your answer here..." value={(answers[currentPart] as string) || ""} onChange={(e) => handleAnswer(e.target.value)} className="min-h-[150px]" />)}
                  {part.type === "extended-writing" && (<Textarea placeholder="Write your response here..." value={(answers[currentPart] as string) || ""} onChange={(e) => handleAnswer(e.target.value)} className="min-h-[300px]" />)}
                </CardContent>
              </Card>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentPart((prev) => prev - 1)} disabled={currentPart === 0}><ChevronLeft className="h-4 w-4 mr-2" />Previous</Button>
                <div className="flex items-center gap-2">
                  {currentPart === totalParts - 1 ? (<Button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600"><Flag className="h-4 w-4 mr-2" />Submit Task</Button>) : (<Button onClick={() => setCurrentPart((prev) => prev + 1)} className="bg-amber-500 hover:bg-amber-600">Next<ChevronRight className="h-4 w-4 ml-2" /></Button>)}
                </div>
              </div>
              <Card className="mt-6">
                <CardHeader className="py-3"><CardTitle className="text-sm">Task Parts</CardTitle></CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-7 gap-2">
                    {availableParts.map((_, index) => (<button key={index} onClick={() => setCurrentPart(index)} className={cn("w-full h-10 rounded text-sm font-medium transition-colors", currentPart === index ? "bg-amber-500 text-white" : answers[index] !== null && answers[index] !== "" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>{String.fromCharCode(65 + index)}</button>))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
