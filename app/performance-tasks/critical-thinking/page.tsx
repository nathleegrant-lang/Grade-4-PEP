"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface ThinkingQuestion {
  id: number
  type: "pattern" | "logic" | "problem" | "analyze"
  scenario?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const thinkingQuestions: ThinkingQuestion[] = [
  {
    id: 1,
    type: "pattern",
    question: "What comes next in this pattern? 2, 4, 6, 8, ___",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    explanation: "The pattern adds 2 each time: 2+2=4, 4+2=6, 6+2=8, so 8+2=10."
  },
  {
    id: 2,
    type: "pattern",
    question: "What comes next? Monday, Wednesday, Friday, ___",
    options: ["Saturday", "Sunday", "Thursday", "Tuesday"],
    correctAnswer: 1,
    explanation: "The pattern skips one day each time. After Friday, skipping Saturday, we get Sunday."
  },
  {
    id: 3,
    type: "logic",
    scenario: "All mangoes are fruits. All fruits grow on plants.",
    question: "Based on this, what can we conclude?",
    options: [
      "All plants have mangoes",
      "Mangoes grow on plants",
      "All fruits are mangoes",
      "Plants are fruits"
    ],
    correctAnswer: 1,
    explanation: "If mangoes are fruits, and fruits grow on plants, then mangoes must grow on plants. This is logical reasoning."
  },
  {
    id: 4,
    type: "problem",
    scenario: "Maria has $500. She wants to buy a book for $150 and a pencil case for $75.",
    question: "How much money will Maria have left after buying both items?",
    options: ["$225", "$275", "$325", "$350"],
    correctAnswer: 1,
    explanation: "$500 - $150 - $75 = $275. First subtract the book cost, then the pencil case cost."
  },
  {
    id: 5,
    type: "analyze",
    scenario: "A graph shows that more students buy lunch on Fridays than any other day of the week.",
    question: "Which is a possible reason for this?",
    options: [
      "Students do not like Friday",
      "The cafeteria is closed on Friday",
      "Friday might have a popular menu like fried chicken",
      "There are fewer students on Friday"
    ],
    correctAnswer: 2,
    explanation: "If more students buy lunch on Friday, it is likely because something special is served that day, like a popular food."
  },
  {
    id: 6,
    type: "logic",
    scenario: "If it rains, the school field day will be postponed. It is raining today.",
    question: "What will happen to field day?",
    options: [
      "Field day will happen as planned",
      "Field day will be postponed",
      "Field day will be cancelled forever",
      "We cannot determine what will happen"
    ],
    correctAnswer: 1,
    explanation: "The statement says IF it rains, field day is postponed. It IS raining, so field day WILL be postponed."
  },
  {
    id: 7,
    type: "problem",
    scenario: "A bus can hold 45 students. The school needs to transport 180 students to a field trip.",
    question: "How many buses does the school need?",
    options: ["3 buses", "4 buses", "5 buses", "6 buses"],
    correctAnswer: 1,
    explanation: "180 ÷ 45 = 4. The school needs exactly 4 buses to transport all 180 students."
  },
  {
    id: 8,
    type: "analyze",
    scenario: "John finished his homework in 30 minutes. Mary took 45 minutes to finish the same homework.",
    question: "Which statement is definitely TRUE?",
    options: [
      "John is smarter than Mary",
      "Mary's homework is wrong",
      "John spent less time on homework than Mary",
      "John did not try hard"
    ],
    correctAnswer: 2,
    explanation: "The only fact we know is the time each person spent. We cannot assume anything about quality or intelligence."
  },
  {
    id: 9,
    type: "pattern",
    question: "What is the missing number? 3, 6, ___, 12, 15",
    options: ["7", "8", "9", "10"],
    correctAnswer: 2,
    explanation: "The pattern adds 3 each time: 3+3=6, 6+3=9, 9+3=12, 12+3=15."
  },
  {
    id: 10,
    type: "analyze",
    scenario: "The library is busiest on Tuesdays. It is least busy on Sundays.",
    question: "What might explain why Tuesday is the busiest day?",
    options: [
      "The library is closed on Tuesday",
      "Students might have library class or book returns due on Tuesday",
      "No one likes Tuesday",
      "Books are more expensive on Tuesday"
    ],
    correctAnswer: 1,
    explanation: "Schools often schedule library visits or set book return days on specific days, which could make Tuesday the busiest."
  }
]

const questionTypeLabels: Record<string, { label: string; color: string }> = {
  pattern: { label: "Pattern Recognition", color: "bg-blue-500" },
  logic: { label: "Logical Thinking", color: "bg-sky-500" },
  problem: { label: "Problem Solving", color: "bg-amber-500" },
  analyze: { label: "Analysis", color: "bg-purple-500" }
}

export default function CriticalThinkingPage() {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = thinkingQuestions[currentQuestion]

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < thinkingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
    setStarted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/performance-tasks">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Performance Tasks
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Lightbulb className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Critical Thinking</h2>
            <p className="text-gray-600">Develop skills to analyze and solve problems</p>
          </div>
        </div>

        {/* Introduction */}
        {!started && (
          <div className="space-y-6">
            <Card className="border-purple-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">What is Critical Thinking?</CardTitle>
                <CardDescription>Using your brain to solve problems and make decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Critical thinking means using logic and reasoning to understand information, find patterns, 
                  and solve problems. In the PEP exam, you will need to think carefully about questions and 
                  use clues to find the best answers.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(questionTypeLabels).map(([key, { label, color }]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-3 h-3 rounded-full ${color}`}></span>
                        <h4 className="font-medium text-gray-800">{label}</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {key === "pattern" && "Find what comes next in a sequence"}
                        {key === "logic" && "Use facts to draw conclusions"}
                        {key === "problem" && "Solve real-world problems step by step"}
                        {key === "analyze" && "Look at information and explain why"}
                      </p>
                    </div>
                  ))}
                </div>

                <Button onClick={() => setStarted(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Brain className="mr-2 h-4 w-4" />
                  Start Thinking Challenge
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Thinking Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Read carefully - every word in the question might be important.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Look for patterns - numbers, letters, or ideas that repeat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Eliminate wrong answers first to narrow down your choices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>Stick to the facts - do not assume things that are not stated.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz in Progress */}
        {started && !quizComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge className={questionTypeLabels[question.type].color}>
                {questionTypeLabels[question.type].label}
              </Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {thinkingQuestions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / thinkingQuestions.length) * 100} className="mb-6 h-3" />

            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Think Carefully</CardTitle>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scenario if available */}
                {question.scenario && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-blue-800 font-medium mb-1">Information:</p>
                    <p className="text-blue-700">{question.scenario}</p>
                  </div>
                )}

                <p className="text-lg text-gray-700 font-medium">{question.question}</p>

                <div className="grid gap-3">
                  {question.options.map((option, index) => {
                    let buttonClass = "p-4 text-left rounded-lg border-2 transition-all "
                    
                    if (showResult) {
                      if (index === question.correctAnswer) {
                        buttonClass += "border-sky-500 bg-sky-50 text-sky-800"
                      } else if (index === selectedAnswer && index !== question.correctAnswer) {
                        buttonClass += "border-red-500 bg-red-50 text-red-800"
                      } else {
                        buttonClass += "border-gray-200 bg-gray-50 text-gray-500"
                      }
                    } else {
                      buttonClass += "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="font-medium">{option}</span>
                          {showResult && index === question.correctAnswer && (
                            <CheckCircle className="ml-auto h-5 w-5 text-sky-500 flex-shrink-0" />
                          )}
                          {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                            <XCircle className="ml-auto h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg ${selectedAnswer === question.correctAnswer ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`}>
                    <p className="font-medium">
                      {selectedAnswer === question.correctAnswer ? "Excellent thinking!" : "Not quite right."}
                    </p>
                    <p className="text-sm mt-1">{question.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={resetQuiz}>
                    Start Over
                  </Button>
                  {showResult && (
                    <Button onClick={handleNextQuestion} className="bg-purple-600 hover:bg-purple-700">
                      {currentQuestion < thinkingQuestions.length - 1 ? "Next Question" : "See Results"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Complete */}
        {quizComplete && (
          <div className="max-w-md mx-auto">
            <Card className="border-purple-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Challenge Complete!</CardTitle>
                <CardDescription>
                  You finished the Critical Thinking challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-purple-600">
                  {score}/{thinkingQuestions.length}
                </div>
                <p className="text-gray-600">
                  {score === thinkingQuestions.length
                    ? "Perfect! You are a critical thinking champion!"
                    : score >= thinkingQuestions.length * 0.8
                    ? "Excellent! You think through problems very well!"
                    : score >= thinkingQuestions.length * 0.6
                    ? "Good job! Your thinking skills are improving."
                    : "Keep practicing! Critical thinking gets better with practice."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetQuiz} className="bg-purple-600 hover:bg-purple-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/performance-tasks">
                    <Button variant="outline" className="w-full">
                      Back to Performance Tasks
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
