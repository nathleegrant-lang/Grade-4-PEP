"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Textarea } from "@/components/ui/textarea"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, ClipboardList, RotateCcw, Home, FileText, Lightbulb, Lock, Crown, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const FREE_PARTS_LIMIT = 3

interface TaskPart {
  id: number
  title: string
  type: "multiple-choice" | "short-answer" | "extended-writing"
  question: string
  context?: string
  options?: string[]
  correctAnswer?: number
  guidelines?: string[]
  maxScore: number
}

const performanceTask = {
  title: "Jamaica's Blue Mountains: A National Treasure",
  introduction: `You are a Grade 4 student at a primary school in Jamaica. Your class has been learning about Jamaica's natural environment and national symbols. Your teacher has asked you to complete a research task about the Blue Mountains.

Read the following sources carefully. Then complete the tasks that follow.`,
  sources: [
    {
      id: 1,
      title: "Source 1: About the Blue Mountains",
      content: `The Blue Mountains are Jamaica's highest mountain range. They are located in the eastern part of the island and stretch across the parishes of Portland, St. Thomas, St. Andrew, and St. Mary.

The highest peak is Blue Mountain Peak, which stands at 2,256 meters (7,402 feet) above sea level. It is the highest point in Jamaica and one of the highest points in the Caribbean.

The mountains got their name because they often appear blue when viewed from a distance. This is caused by a haze created by the moisture in the air and the oils released by the many trees that cover the mountains.

The Blue Mountains are home to many plants and animals that cannot be found anywhere else in the world. The area is also famous for growing some of the world's finest coffee, known as "Jamaica Blue Mountain Coffee."

The Blue and John Crow Mountains were named a UNESCO World Heritage Site in 2015 because of their natural beauty and cultural importance.`
    },
    {
      id: 2,
      title: "Source 2: Wildlife in the Blue Mountains",
      content: `The Blue Mountains are a haven for wildlife. Over 800 species of plants grow here, and more than half of them are endemic, meaning they grow nowhere else on Earth.

Many birds make their home in these mountains. The Giant Swallowtail butterfly, one of the largest butterflies in the Western Hemisphere, lives here. The Jamaican Blackbird and the Jamaican Solitaire are also found in this region.

The mountains provide clean water for many communities. Rivers like the Rio Grande and the Hope River start in the Blue Mountains. The forests act like a giant sponge, collecting rainfall and releasing it slowly into the rivers below.

Scientists are working to protect the Blue Mountains. Climate change and human activities threaten the unique plants and animals that live here. The Jamaica Conservation and Development Trust helps to preserve this important natural area.`
    },
    {
      id: 3,
      title: "Source 3: Blue Mountain Coffee",
      content: `Jamaica Blue Mountain Coffee is known around the world for its smooth, mild taste and lack of bitterness. It is grown at elevations between 3,000 and 5,500 feet in the Blue Mountains.

The special conditions in the mountains—cool temperatures, high rainfall, rich soil, and misty weather—create the perfect environment for growing coffee. The coffee cherries take longer to ripen in these conditions, which allows the beans to develop their unique flavor.

Coffee was first brought to Jamaica in 1728. Today, Jamaican farmers carefully grow and harvest the coffee by hand. Each coffee cherry is picked individually when it is perfectly ripe.

Jamaica Blue Mountain Coffee is very expensive because of its quality and limited supply. Most of it is exported to Japan, the United States, and Europe. The coffee industry provides jobs for thousands of Jamaican families.`
    }
  ],
  parts: [
    {
      id: 1,
      title: "Part A: Reading Comprehension",
      type: "multiple-choice" as const,
      question: "According to Source 1, why do the Blue Mountains appear blue from a distance?",
      options: [
        "Because of the blue flowers that grow there",
        "Because of the moisture and oils from trees creating a haze",
        "Because of the blue color of the rocks",
        "Because of the blue sky reflecting on the mountains"
      ],
      correctAnswer: 1,
      maxScore: 2
    },
    {
      id: 2,
      title: "Part B: Finding Information",
      type: "multiple-choice" as const,
      question: "According to Source 2, what does the word 'endemic' mean?",
      options: [
        "Very dangerous",
        "Grows nowhere else on Earth",
        "Very common",
        "Difficult to find"
      ],
      correctAnswer: 1,
      maxScore: 2
    },
    {
      id: 3,
      title: "Part C: Making Connections",
      type: "multiple-choice" as const,
      question: "Based on Source 2 and Source 3, which statement best explains how the Blue Mountains benefit Jamaica?",
      options: [
        "They only provide coffee for people to drink",
        "They only provide homes for birds and butterflies",
        "They provide both natural resources (clean water, wildlife) and economic benefits (coffee industry, jobs)",
        "They only attract tourists to Jamaica"
      ],
      correctAnswer: 2,
      maxScore: 2
    },
    {
      id: 4,
      title: "Part D: Short Response",
      type: "short-answer" as const,
      question: "Using information from Source 3, explain TWO reasons why Jamaica Blue Mountain Coffee is expensive. Write your answer in complete sentences.",
      context: "Hint: Think about how the coffee is grown and how much is available.",
      guidelines: [
        "Write 2-3 complete sentences",
        "Include two specific reasons from the source",
        "Use your own words"
      ],
      maxScore: 4
    },
    {
      id: 5,
      title: "Part E: Combining Information",
      type: "multiple-choice" as const,
      question: "According to Source 2, what are TWO ways the forests in the Blue Mountains help communities?",
      options: [
        "They provide shade and attract tourists",
        "They provide clean water and collect rainfall",
        "They grow coffee and provide jobs",
        "They stop erosion and block the wind"
      ],
      correctAnswer: 1,
      maxScore: 2
    },
    {
      id: 6,
      title: "Part F: Critical Thinking",
      type: "short-answer" as const,
      question: "Source 2 mentions that scientists are working to protect the Blue Mountains. Based on what you have read in all three sources, explain why it is important to protect the Blue Mountains. Give TWO reasons with evidence from the sources.",
      guidelines: [
        "Write 3-4 complete sentences",
        "Give two reasons why protection is important",
        "Use information from at least two sources as evidence"
      ],
      maxScore: 6
    },
    {
      id: 7,
      title: "Part G: Extended Writing",
      type: "extended-writing" as const,
      question: `Your school is creating a booklet about Jamaica's natural treasures. You have been asked to write an article about the Blue Mountains for Grade 4 students.

Using the information from all three sources, write an article that:
• Describes what the Blue Mountains are and where they are located
• Explains why the Blue Mountains are important to Jamaica
• Tells readers what makes the Blue Mountains special

Remember to:
• Write in your own words
• Organize your ideas clearly
• Use information from the sources
• Write at least 3 paragraphs`,
      guidelines: [
        "Introduction paragraph: Introduce the Blue Mountains",
        "Body paragraph: Explain their importance (wildlife, water, coffee)",
        "Conclusion paragraph: What makes them special/worth protecting",
        "Use complete sentences and proper punctuation"
      ],
      maxScore: 12
    }
  ] as TaskPart[]
}

export default function PerformanceTaskMockTest() {
  const { isPremium } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [answers, setAnswers] = useState<(number | string | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(90 * 60) // 90 minutes
  const [showReview, setShowReview] = useState(false)
  const [showSources, setShowSources] = useState(true)

  // Free users only get preview parts
  const availableParts = isPremium ? performanceTask.parts : performanceTask.parts.slice(0, FREE_PARTS_LIMIT)
  const totalParts = availableParts.length

  // Initialize answers array based on available parts
  useEffect(() => {
    if (answers.length !== totalParts) {
      setAnswers(new Array(totalParts).fill(null))
    }
  }, [totalParts, answers.length])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTestCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const handleAnswer = (answer: number | string) => {
    const newAnswers = [...answers]
    newAnswers[currentPart] = answer
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    let score = 0
    availableParts.forEach((part, index) => {
      if (part.type === "multiple-choice" && answers[index] === part.correctAnswer) {
        score += part.maxScore
      } else if ((part.type === "short-answer" || part.type === "extended-writing") && answers[index]) {
        // For written responses, give partial credit if they wrote something
        const response = answers[index] as string
        if (response.length > 50) {
          score += Math.round(part.maxScore * 0.7) // 70% for attempting
        } else if (response.length > 20) {
          score += Math.round(part.maxScore * 0.4) // 40% for minimal attempt
        }
      }
    })
    return score
  }

  const getTotalPossibleScore = () => {
    return availableParts.reduce((sum, part) => sum + part.maxScore, 0)
  }

  const getScorePercentage = () => {
    return Math.round((calculateScore() / getTotalPossibleScore()) * 100)
  }

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const handleSubmit = () => {
    setTestCompleted(true)
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentPart(0)
    setAnswers(new Array(totalParts).fill(null))
    setTimeRemaining(isPremium ? 90 * 60 : 20 * 60)
    setShowReview(false)
  }

  const part = availableParts[currentPart]
  const answeredCount = answers.filter(a => a !== null && a !== "").length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center bg-amber-50 rounded-t-lg">
              <ClipboardList className="h-16 w-16 mx-auto text-amber-600 mb-4" />
              <CardTitle className="text-2xl text-amber-800">Performance Task Mock Test</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Assessment</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{totalParts}</p>
                    <p className="text-sm text-gray-600">Parts {!isPremium && "(Preview)"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{isPremium ? 90 : 20}</p>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                </div>

                {!isPremium && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Free Preview Mode</p>
                        <p className="text-sm text-amber-700">
                          You can try {FREE_PARTS_LIMIT} parts for free. Upgrade to Premium for the full 7-part performance task with writing practice and rubrics.
                        </p>
                      </div>
                    </div>
                    <Link href="/pricing" className="block mt-3">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Task Overview:</h3>
                  <p className="text-sm text-gray-700 mb-3">{performanceTask.title}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read 3 informational sources</li>
                    <li>- Answer comprehension questions</li>
                    <li>- Write short responses</li>
                    <li>- Complete an extended writing task</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read all sources carefully before answering.</li>
                    <li>- Answer all parts of the task.</li>
                    <li>- Use information from the sources in your answers.</li>
                    <li>- Write in complete sentences.</li>
                    <li>- Check your spelling and punctuation.</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setTestStarted(true)} 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6"
                >
                  Start Task
                </Button>

                <Link href="/mock-tests">
                  <Button variant="outline" className="w-full">
                    Back to Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const total = getTotalPossibleScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center bg-amber-50 rounded-t-lg">
              <CheckCircle className="h-16 w-16 mx-auto text-amber-600 mb-4" />
              <CardTitle className="text-2xl text-amber-800">Task Completed!</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-amber-600">{score}/{total}</p>
                  <p className="text-gray-600 mt-2">Points Earned</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">{percentage}%</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className={`text-2xl font-bold ${color}`}>{grade}</p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">Note about scoring:</h4>
                  <p className="text-sm text-gray-700">
                    Written responses (short answer and extended writing) have been given partial credit 
                    based on length. In the actual PEP, teachers would evaluate your writing for content, 
                    organization, and use of evidence from sources.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowReview(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    Review Answers
                  </Button>
                  <Button 
                    onClick={restartTest}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Test Again
                  </Button>
                  <Link href="/mock-tests">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Mock Tests
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="bg-amber-50 rounded-t-lg">
              <CardTitle className="text-xl text-amber-800">Answer Review</CardTitle>
              <p className="text-gray-600">Score: {calculateScore()}/{getTotalPossibleScore()} ({getScorePercentage()}%)</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {availableParts.map((p, index) => {
                  const isCorrect = p.type === "multiple-choice" && answers[index] === p.correctAnswer
                  return (
                    <div key={p.id} className={cn(
                      "p-4 rounded-lg border-2",
                      p.type === "multiple-choice" 
                        ? isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50"
                    )}>
                      <h4 className="font-semibold text-gray-800 mb-2">{p.title}</h4>
                      <p className="text-gray-700 mb-3">{p.question}</p>
                      
                      {p.type === "multiple-choice" && (
                        <div className="text-sm">
                          <p className="text-gray-600">
                            Your answer: <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {answers[index] !== null && p.options ? p.options[answers[index] as number] : "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && p.options && (
                            <p className="text-green-600">
                              Correct answer: {p.options[p.correctAnswer!]}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {(p.type === "short-answer" || p.type === "extended-writing") && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Your response:</p>
                          <div className="bg-white p-3 rounded border text-sm text-gray-700">
                            {answers[index] || <span className="italic text-gray-400">No response provided</span>}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">Points: {p.maxScore}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={restartTest}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Test Again
                </Button>
                <Link href="/mock-tests" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <header className="bg-slate-800 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/mock-tests" 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit Test"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <ClipboardList className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Performance Task</h1>
                <p className="text-sky-100 text-xs">Part {currentPart + 1} of {totalParts}</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
              timeRemaining <= 300 ? "bg-red-500" : "bg-green-600"
            )}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {answeredCount}/{totalParts} parts completed</span>
            <span>{Math.round((answeredCount / totalParts) * 100)}% complete</span>
          </div>
          <Progress value={(answeredCount / totalParts) * 100} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Introduction and Sources Toggle */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowSources(!showSources)}
              className="w-full md:w-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showSources ? "Hide Sources" : "Show Sources"}
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sources Panel */}
            {showSources && (
              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base text-blue-800">Introduction</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    {performanceTask.introduction}
                  </CardContent>
                </Card>

                {performanceTask.sources.map((source) => (
                  <Card key={source.id} className="border-gray-200">
                    <CardHeader className="py-3 bg-gray-50">
                      <CardTitle className="text-sm text-gray-800">{source.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 whitespace-pre-line max-h-48 overflow-y-auto">
                      {source.content}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Question Panel */}
            <div className={showSources ? "" : "lg:col-span-2 max-w-3xl mx-auto w-full"}>
              <Card className="mb-6">
                <CardHeader className="bg-amber-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-700">{part.title}</span>
                    <span className="text-sm text-gray-500">{part.maxScore} points</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {part.context && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {part.context}
                    </div>
                  )}

                  <p className="text-lg text-gray-800 mb-6 whitespace-pre-line">{part.question}</p>

                  {part.guidelines && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 mb-2">Guidelines:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {part.guidelines.map((g, i) => (
                          <li key={i}>• {g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {part.type === "multiple-choice" && part.options && (
                    <div className="space-y-3">
                      {part.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={cn(
                            "w-full p-4 text-left rounded-lg border-2 transition-all",
                            answers[currentPart] === index
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                          )}
                        >
                          <span className="font-medium text-amber-700 mr-3">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {part.type === "short-answer" && (
                    <Textarea
                      placeholder="Write your answer here..."
                      value={(answers[currentPart] as string) || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="min-h-[150px]"
                    />
                  )}

                  {part.type === "extended-writing" && (
                    <Textarea
                      placeholder="Write your article here..."
                      value={(answers[currentPart] as string) || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="min-h-[300px]"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPart(prev => prev - 1)}
                  disabled={currentPart === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentPart === totalParts - 1 ? (
                    <Button 
                      onClick={handleSubmit}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Submit Task
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentPart(prev => prev + 1)}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Part Navigator */}
              <Card className="mt-6">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Task Parts</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-7 gap-2">
                    {availableParts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPart(index)}
                        className={cn(
                          "w-full h-10 rounded text-sm font-medium transition-colors",
                          currentPart === index
                            ? "bg-amber-500 text-white"
                            : answers[index] !== null && answers[index] !== ""
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-amber-500"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-amber-100"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-gray-100"></div>
                      <span>Not Started</span>
                    </div>
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
