"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface DataQuestion {
  id: number
  question: string
  context?: string
  data?: { label: string; value: number }[]
  options: string[]
  correctAnswer: number
  explanation: string
}

const dataQuestions: DataQuestion[] = [
  {
    id: 1,
    question: "Look at the data showing favourite fruits of Grade 4 students. Which fruit is most popular?",
    data: [
      { label: "Mango", value: 12 },
      { label: "Orange", value: 8 },
      { label: "Banana", value: 6 },
      { label: "Apple", value: 4 }
    ],
    options: ["Orange", "Banana", "Mango", "Apple"],
    correctAnswer: 2,
    explanation: "Mango has the highest number (12 students), so it is the most popular fruit."
  },
  {
    id: 2,
    question: "Based on the data above, how many more students chose Mango than Orange?",
    data: [
      { label: "Mango", value: 12 },
      { label: "Orange", value: 8 },
      { label: "Banana", value: 6 },
      { label: "Apple", value: 4 }
    ],
    options: ["2 more", "4 more", "6 more", "8 more"],
    correctAnswer: 1,
    explanation: "12 - 8 = 4. So 4 more students chose Mango than Orange."
  },
  {
    id: 3,
    question: "What is the total number of students who chose a favourite fruit?",
    data: [
      { label: "Mango", value: 12 },
      { label: "Orange", value: 8 },
      { label: "Banana", value: 6 },
      { label: "Apple", value: 4 }
    ],
    options: ["24 students", "26 students", "30 students", "32 students"],
    correctAnswer: 2,
    explanation: "12 + 8 + 6 + 4 = 30 students in total."
  },
  {
    id: 4,
    question: "The table shows test scores. What is the range of the scores?",
    context: "Test Scores: 75, 82, 68, 90, 85",
    options: ["15", "22", "17", "25"],
    correctAnswer: 1,
    explanation: "Range = Highest - Lowest = 90 - 68 = 22."
  },
  {
    id: 5,
    question: "What is the mode of this data set: 5, 7, 5, 8, 5, 9, 7?",
    options: ["5", "7", "8", "9"],
    correctAnswer: 0,
    explanation: "The mode is the number that appears most often. The number 5 appears 3 times, more than any other number."
  },
  {
    id: 6,
    question: "Look at the pictograph showing books read. If each symbol represents 2 books, and Maria has 4 symbols, how many books did she read?",
    options: ["4 books", "6 books", "8 books", "10 books"],
    correctAnswer: 2,
    explanation: "4 symbols × 2 books per symbol = 8 books."
  },
  {
    id: 7,
    question: "What type of graph would be best to show how temperature changes throughout a day?",
    options: ["Bar graph", "Pictograph", "Line graph", "Pie chart"],
    correctAnswer: 2,
    explanation: "A line graph is best for showing changes over time because you can see the trend."
  },
  {
    id: 8,
    question: "In a survey, 25 out of 100 students chose blue as their favourite colour. What fraction of students chose blue?",
    options: ["1/2", "1/4", "1/5", "1/10"],
    correctAnswer: 1,
    explanation: "25 out of 100 = 25/100 = 1/4 (simplified by dividing both by 25)."
  }
]

const BarChartVisual = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Favourite Fruits of Grade 4 Students</h4>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-16 text-sm text-gray-600">{item.label}</span>
            <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden">
              <div 
                className="h-full bg-sky-500 flex items-center justify-end pr-2"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DataStatisticsPage() {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = dataQuestions[currentQuestion]

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < dataQuestions.length - 1) {
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
        <Link href="/mathematics">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mathematics
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Data & Statistics</h2>
            <p className="text-gray-600">Learn to read and interpret graphs, charts, and data</p>
          </div>
        </div>

        {/* Introduction */}
        {!started && (
          <div className="space-y-6">
            <Card className="border-rose-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Understanding Data</CardTitle>
                <CardDescription>Learn to read graphs and work with numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  In this section, you will practice reading bar graphs, pictographs, and tables. 
                  You will also learn about finding the range, mode, and understanding data sets.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Key Terms</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li><strong>Range:</strong> Highest - Lowest value</li>
                      <li><strong>Mode:</strong> Most common value</li>
                      <li><strong>Data:</strong> Information collected</li>
                    </ul>
                  </div>
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h4 className="font-medium text-sky-800 mb-2">Types of Graphs</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li><strong>Bar Graph:</strong> Uses bars to compare</li>
                      <li><strong>Pictograph:</strong> Uses pictures/symbols</li>
                      <li><strong>Line Graph:</strong> Shows change over time</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={() => setStarted(true)} className="w-full bg-rose-600 hover:bg-rose-700">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-rose-200 bg-rose-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Data Reading Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">1.</span>
                    <span>Always read the title and labels on a graph first.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">2.</span>
                    <span>Check what each symbol or bar represents in a pictograph.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">3.</span>
                    <span>When comparing, look at which bar is taller or which has more symbols.</span>
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
              <Badge className="bg-rose-500">Data & Statistics</Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {dataQuestions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / dataQuestions.length) * 100} className="mb-6 h-3" />

            <Card className="border-rose-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Data Question</CardTitle>
                  <Badge variant="outline" className="text-rose-600 border-rose-600">
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Visual Data Display */}
                {question.data && <BarChartVisual data={question.data} />}
                
                {question.context && (
                  <div className="bg-gray-100 p-3 rounded-lg text-center font-mono">
                    {question.context}
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
                      buttonClass += "border-gray-200 hover:border-rose-400 hover:bg-rose-50"
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="font-medium">{option}</span>
                          {showResult && index === question.correctAnswer && (
                            <CheckCircle className="ml-auto h-5 w-5 text-sky-500" />
                          )}
                          {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                            <XCircle className="ml-auto h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg ${selectedAnswer === question.correctAnswer ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`}>
                    <p className="font-medium">
                      {selectedAnswer === question.correctAnswer ? "Correct!" : "Not quite."}
                    </p>
                    <p className="text-sm mt-1">{question.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={resetQuiz}>
                    Start Over
                  </Button>
                  {showResult && (
                    <Button onClick={handleNextQuestion} className="bg-rose-600 hover:bg-rose-700">
                      {currentQuestion < dataQuestions.length - 1 ? "Next Question" : "See Results"}
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
            <Card className="border-rose-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Great Work!</CardTitle>
                <CardDescription>
                  You completed the Data & Statistics quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-rose-600">
                  {score}/{dataQuestions.length}
                </div>
                <p className="text-gray-600">
                  {score === dataQuestions.length
                    ? "Perfect! You are a data analysis expert!"
                    : score >= dataQuestions.length * 0.8
                    ? "Excellent! You read data very well!"
                    : score >= dataQuestions.length * 0.6
                    ? "Good job! Keep practicing."
                    : "Keep trying! Practice makes perfect."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetQuiz} className="bg-rose-600 hover:bg-rose-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/mathematics">
                    <Button variant="outline" className="w-full">
                      Back to Mathematics
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
