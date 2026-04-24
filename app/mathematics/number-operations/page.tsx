"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Hash, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Input } from "@/components/ui/input"

type OperationType = "addition" | "subtraction" | "multiplication" | "division" | "mixed"
type DifficultyLevel = "easy" | "medium" | "hard"

interface MathProblem {
  num1: number
  num2: number
  operation: "+" | "-" | "×" | "÷"
  answer: number
}

const generateProblem = (type: OperationType, difficulty: DifficultyLevel): MathProblem => {
  let num1: number, num2: number, operation: "+" | "-" | "×" | "÷", answer: number

  const maxNum = difficulty === "easy" ? 20 : difficulty === "medium" ? 50 : 100
  const minNum = difficulty === "easy" ? 1 : difficulty === "medium" ? 10 : 20

  const ops: OperationType[] = type === "mixed" ? ["addition", "subtraction", "multiplication", "division"] : [type]
  const selectedOp = ops[Math.floor(Math.random() * ops.length)]

  switch (selectedOp) {
    case "addition":
      num1 = Math.floor(Math.random() * maxNum) + minNum
      num2 = Math.floor(Math.random() * maxNum) + minNum
      operation = "+"
      answer = num1 + num2
      break
    case "subtraction":
      num1 = Math.floor(Math.random() * maxNum) + minNum
      num2 = Math.floor(Math.random() * num1) + 1
      operation = "-"
      answer = num1 - num2
      break
    case "multiplication":
      const multMax = difficulty === "easy" ? 10 : difficulty === "medium" ? 12 : 15
      num1 = Math.floor(Math.random() * multMax) + 1
      num2 = Math.floor(Math.random() * multMax) + 1
      operation = "×"
      answer = num1 * num2
      break
    case "division":
      num2 = Math.floor(Math.random() * (difficulty === "easy" ? 10 : 12)) + 1
      answer = Math.floor(Math.random() * (difficulty === "easy" ? 10 : 12)) + 1
      num1 = num2 * answer
      operation = "÷"
      break
    default:
      num1 = 5
      num2 = 3
      operation = "+"
      answer = 8
  }

  return { num1, num2, operation, answer }
}

const operations = [
  { id: "addition" as OperationType, title: "Addition", symbol: "+", color: "bg-sky-500" },
  { id: "subtraction" as OperationType, title: "Subtraction", symbol: "-", color: "bg-blue-500" },
  { id: "multiplication" as OperationType, title: "Multiplication", symbol: "×", color: "bg-amber-500" },
  { id: "division" as OperationType, title: "Division", symbol: "÷", color: "bg-rose-500" },
  { id: "mixed" as OperationType, title: "Mixed Practice", symbol: "?", color: "bg-purple-500" },
]

const difficulties: { id: DifficultyLevel; title: string; description: string }[] = [
  { id: "easy", title: "Easy", description: "Numbers up to 20" },
  { id: "medium", title: "Medium", description: "Numbers up to 50" },
  { id: "hard", title: "Challenging", description: "Numbers up to 100" },
]

export default function NumberOperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null)
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const generateNewProblem = useCallback(() => {
    if (selectedOperation && selectedDifficulty) {
      setCurrentProblem(generateProblem(selectedOperation, selectedDifficulty))
      setUserAnswer("")
      setShowResult(false)
    }
  }, [selectedOperation, selectedDifficulty])

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false)
      setGameOver(true)
    }
  }, [timeLeft, gameActive])

  const startGame = () => {
    setGameActive(true)
    setGameOver(false)
    setScore(0)
    setTotalQuestions(0)
    setStreak(0)
    setTimeLeft(60)
    generateNewProblem()
  }

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer) return

    const correct = parseInt(userAnswer) === currentProblem.answer
    setIsCorrect(correct)
    setShowResult(true)
    setTotalQuestions(totalQuestions + 1)

    if (correct) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const nextProblem = () => {
    generateNewProblem()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showResult) {
        nextProblem()
      } else {
        checkAnswer()
      }
    }
  }

  const resetGame = () => {
    setSelectedOperation(null)
    setSelectedDifficulty(null)
    setCurrentProblem(null)
    setUserAnswer("")
    setShowResult(false)
    setScore(0)
    setTotalQuestions(0)
    setStreak(0)
    setTimeLeft(60)
    setGameActive(false)
    setGameOver(false)
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
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Hash className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Number Operations</h2>
            <p className="text-gray-600">Practice your math facts with timed challenges</p>
          </div>
        </div>

        {/* Operation Selection */}
        {!selectedOperation && (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose an Operation</CardTitle>
                <CardDescription>Select the type of math problems you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {operations.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOperation(op.id)}
                      className={`p-6 rounded-lg text-white text-center transition-transform hover:scale-105 ${op.color}`}
                    >
                      <div className="text-4xl font-bold mb-2">{op.symbol}</div>
                      <div className="font-medium">{op.title}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Math Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>For addition, start with the larger number and count up.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>For subtraction, think: what plus the smaller number equals the larger?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Learn your times tables - they help with multiplication AND division!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Difficulty Selection */}
        {selectedOperation && !selectedDifficulty && (
          <div className="max-w-xl mx-auto">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Choose Difficulty</CardTitle>
                  <Badge className={operations.find(o => o.id === selectedOperation)?.color}>
                    {operations.find(o => o.id === selectedOperation)?.title}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 hover:bg-blue-50 ${
                      diff.id === "easy" ? "border-sky-200" : diff.id === "medium" ? "border-amber-200" : "border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-800">{diff.title}</div>
                        <div className="text-gray-600">{diff.description}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                ))}
                <Button variant="outline" onClick={() => setSelectedOperation(null)} className="w-full mt-4">
                  Change Operation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Ready */}
        {selectedOperation && selectedDifficulty && !gameActive && !gameOver && (
          <div className="max-w-xl mx-auto">
            <Card className="border-blue-200 text-center">
              <CardHeader>
                <CardTitle className="text-slate-800 text-2xl">Ready to Start!</CardTitle>
                <CardDescription>
                  Solve as many {operations.find(o => o.id === selectedOperation)?.title.toLowerCase()} problems as you can in 60 seconds!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-4">
                  <Badge className={operations.find(o => o.id === selectedOperation)?.color}>
                    {operations.find(o => o.id === selectedOperation)?.title}
                  </Badge>
                  <Badge variant="outline">{difficulties.find(d => d.id === selectedDifficulty)?.title}</Badge>
                </div>
                <Button onClick={startGame} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                  <Timer className="mr-2 h-5 w-5" />
                  Start Challenge
                </Button>
                <Button variant="outline" onClick={resetGame}>
                  Change Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Game */}
        {gameActive && currentProblem && (
          <div className="max-w-xl mx-auto">
            {/* Timer and Score Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className={`h-5 w-5 ${timeLeft <= 10 ? "text-red-500" : "text-blue-600"}`} />
                <span className={`font-bold text-lg ${timeLeft <= 10 ? "text-red-500" : "text-gray-700"}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Score: <strong className="text-blue-600">{score}</strong></span>
                {streak >= 3 && (
                  <Badge className="bg-amber-500">
                    {streak} Streak!
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={(timeLeft / 60) * 100} className="mb-6 h-3" />

            <Card className="border-blue-200">
              <CardContent className="pt-8 pb-6">
                {/* Problem Display */}
                <div className="text-center mb-8">
                  <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                    {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
                  </div>
                </div>

                {/* Answer Input */}
                <div className="flex gap-4 justify-center items-center mb-6">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your answer"
                    className="text-center text-2xl font-bold w-32 h-14"
                    disabled={showResult}
                    autoFocus
                  />
                  {!showResult ? (
                    <Button onClick={checkAnswer} className="bg-blue-600 hover:bg-blue-700 h-14 px-6">
                      Check
                    </Button>
                  ) : (
                    <Button onClick={nextProblem} className="bg-slate-700 hover:bg-slate-800 h-14 px-6">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Result Feedback */}
                {showResult && (
                  <div className={`text-center p-4 rounded-lg ${isCorrect ? "bg-sky-100" : "bg-red-100"}`}>
                    <div className="flex items-center justify-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="h-6 w-6 text-sky-600" />
                          <span className="text-sky-800 font-bold text-lg">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          <span className="text-red-800 font-bold text-lg">
                            The answer is {currentProblem.answer}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="max-w-md mx-auto">
            <Card className="border-blue-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Time&apos;s Up!</CardTitle>
                <CardDescription>Great effort on your math challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{score}</div>
                    <div className="text-gray-600">Correct</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">{totalQuestions}</div>
                    <div className="text-gray-600">Total</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {score >= 15
                    ? "Amazing! You are a math superstar!"
                    : score >= 10
                    ? "Great work! Keep practicing!"
                    : score >= 5
                    ? "Good effort! You are improving!"
                    : "Keep trying! Practice makes perfect!"}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={resetGame}>
                    Change Settings
                  </Button>
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
