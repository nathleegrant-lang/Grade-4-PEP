"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Volume2, CheckCircle, XCircle, RotateCcw, Trophy, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type GameMode = "synonyms" | "antonyms" | "context" | "spelling"

interface VocabQuestion {
  id: number
  word: string
  definition: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const synonymQuestions: VocabQuestion[] = [
  {
    id: 1,
    word: "happy",
    definition: "Which word means the same as 'happy'?",
    options: ["joyful", "sad", "angry", "tired"],
    correctAnswer: 0,
    explanation: "'Joyful' means feeling great happiness, just like 'happy'."
  },
  {
    id: 2,
    word: "big",
    definition: "Which word means the same as 'big'?",
    options: ["tiny", "small", "narrow", "large"],
    correctAnswer: 3,
    explanation: "'Large' means of great size, just like 'big'."
  },
  {
    id: 3,
    word: "fast",
    definition: "Which word means the same as 'fast'?",
    options: ["slow", "lazy", "quick", "heavy"],
    correctAnswer: 2,
    explanation: "'Quick' means moving with speed, just like 'fast'."
  },
  {
    id: 4,
    word: "beautiful",
    definition: "Which word means the same as 'beautiful'?",
    options: ["ugly", "lovely", "plain", "dull"],
    correctAnswer: 1,
    explanation: "'Lovely' means very attractive, just like 'beautiful'."
  },
  {
    id: 5,
    word: "brave",
    definition: "Which word means the same as 'brave'?",
    options: ["courageous", "scared", "weak", "shy"],
    correctAnswer: 0,
    explanation: "'Courageous' means showing courage, just like 'brave'."
  }
]

const antonymQuestions: VocabQuestion[] = [
  {
    id: 1,
    word: "hot",
    definition: "Which word is the opposite of 'hot'?",
    options: ["warm", "cool", "heated", "cold"],
    correctAnswer: 3,
    explanation: "'Cold' is the opposite of 'hot' - it means having a low temperature."
  },
  {
    id: 2,
    word: "loud",
    definition: "Which word is the opposite of 'loud'?",
    options: ["quiet", "noisy", "sound", "echo"],
    correctAnswer: 0,
    explanation: "'Quiet' is the opposite of 'loud' - it means making little noise."
  },
  {
    id: 3,
    word: "up",
    definition: "Which word is the opposite of 'up'?",
    options: ["above", "down", "over", "top"],
    correctAnswer: 1,
    explanation: "'Down' is the opposite of 'up' - it means toward a lower position."
  },
  {
    id: 4,
    word: "old",
    definition: "Which word is the opposite of 'old'?",
    options: ["ancient", "aged", "elderly", "young"],
    correctAnswer: 3,
    explanation: "'Young' is the opposite of 'old' - it means having lived for a short time."
  },
  {
    id: 5,
    word: "empty",
    definition: "Which word is the opposite of 'empty'?",
    options: ["vacant", "full", "hollow", "bare"],
    correctAnswer: 1,
    explanation: "'Full' is the opposite of 'empty' - it means containing as much as possible."
  }
]

const contextQuestions: VocabQuestion[] = [
  {
    id: 1,
    word: "abundant",
    definition: "The mango trees were abundant with fruit this season. What does 'abundant' mean?",
    options: ["empty", "broken", "tall", "plentiful"],
    correctAnswer: 3,
    explanation: "'Abundant' means existing in large quantities, or plentiful."
  },
  {
    id: 2,
    word: "cautious",
    definition: "Marcus was cautious when crossing the busy road. What does 'cautious' mean?",
    options: ["careful", "careless", "fast", "loud"],
    correctAnswer: 0,
    explanation: "'Cautious' means being careful to avoid danger or mistakes."
  },
  {
    id: 3,
    word: "enormous",
    definition: "The Blue Mountains looked enormous from the valley below. What does 'enormous' mean?",
    options: ["tiny", "very large", "green", "far away"],
    correctAnswer: 1,
    explanation: "'Enormous' means very large in size or quantity."
  },
  {
    id: 4,
    word: "delicious",
    definition: "Grandma's ackee and saltfish was absolutely delicious. What does 'delicious' mean?",
    options: ["salty", "hot", "tasty", "cold"],
    correctAnswer: 2,
    explanation: "'Delicious' means highly pleasant to taste, or very tasty."
  },
  {
    id: 5,
    word: "exhausted",
    definition: "After Sports Day, all the children were exhausted. What does 'exhausted' mean?",
    options: ["excited", "happy", "hungry", "very tired"],
    correctAnswer: 3,
    explanation: "'Exhausted' means extremely tired, having no energy left."
  }
]

const spellingQuestions: VocabQuestion[] = [
  {
    id: 1,
    word: "beautiful",
    definition: "Which spelling is correct?",
    options: ["beautiful", "beautful", "beutiful", "beautyful"],
    correctAnswer: 0,
    explanation: "The correct spelling is 'beautiful' - remember: b-e-a-u-t-i-f-u-l."
  },
  {
    id: 2,
    word: "Wednesday",
    definition: "Which spelling is correct?",
    options: ["Wensday", "Wendesday", "Wednsday", "Wednesday"],
    correctAnswer: 3,
    explanation: "The correct spelling is 'Wednesday' - it has a silent 'd' in the middle."
  },
  {
    id: 3,
    word: "because",
    definition: "Which spelling is correct?",
    options: ["becuase", "becouse", "because", "becase"],
    correctAnswer: 2,
    explanation: "The correct spelling is 'because' - remember: be-cause."
  },
  {
    id: 4,
    word: "friend",
    definition: "Which spelling is correct?",
    options: ["freind", "friend", "frend", "freand"],
    correctAnswer: 1,
    explanation: "The correct spelling is 'friend' - remember: 'i' before 'e' except after 'c', but this is an exception!"
  },
  {
    id: 5,
    word: "received",
    definition: "Which spelling is correct?",
    options: ["recieved", "receved", "recived", "received"],
    correctAnswer: 3,
    explanation: "The correct spelling is 'received' - 'i' before 'e' except after 'c'."
  }
]

const gameModes = [
  { id: "synonyms" as GameMode, title: "Synonyms", description: "Find words with similar meanings", color: "bg-emerald-500" },
  { id: "antonyms" as GameMode, title: "Antonyms", description: "Find words with opposite meanings", color: "bg-blue-500" },
  { id: "context" as GameMode, title: "Context Clues", description: "Figure out word meanings from sentences", color: "bg-amber-500" },
  { id: "spelling" as GameMode, title: "Spelling Bee", description: "Choose the correct spelling", color: "bg-rose-500" },
]

export default function VocabularyPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const getQuestions = (mode: GameMode): VocabQuestion[] => {
    switch (mode) {
      case "synonyms": return synonymQuestions
      case "antonyms": return antonymQuestions
      case "context": return contextQuestions
      case "spelling": return spellingQuestions
    }
  }

  const questions = selectedMode ? getQuestions(selectedMode) : []
  const question = questions[currentQuestion]

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setGameComplete(false)
  }

  const goToModeSelection = () => {
    setSelectedMode(null)
    resetGame()
  }

  const getModeColor = (mode: GameMode) => {
    switch (mode) {
      case "synonyms": return "emerald"
      case "antonyms": return "blue"
      case "context": return "amber"
      case "spelling": return "rose"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/language-arts">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Language Arts
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
            <Volume2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Vocabulary Building</h2>
            <p className="text-gray-600">Learn new words and their meanings</p>
          </div>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="space-y-6">
            <Card className="border-sky-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose a Word Game</CardTitle>
                <CardDescription>Select a game mode to practice different vocabulary skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {gameModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-6 rounded-lg text-white text-left transition-transform hover:scale-105 ${mode.color}`}
                    >
                      <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                      <p className="text-white/90">{mode.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-sky-200 bg-sky-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Vocabulary Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">1.</span>
                    <span>Read the word and all options carefully before answering.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">2.</span>
                    <span>For context clues, look at the whole sentence for hints about the word&apos;s meaning.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">3.</span>
                    <span>When unsure, eliminate answers you know are wrong first.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game in Progress */}
        {selectedMode && !gameComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge className={`bg-${getModeColor(selectedMode)}-500`}>
                {gameModes.find(m => m.id === selectedMode)?.title}
              </Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / questions.length) * 100} className="mb-6 h-3" />

            <Card className="border-sky-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">
                    {selectedMode === "spelling" ? "Spelling Challenge" : `Word: "${question.word}"`}
                  </CardTitle>
                  <Badge variant="outline" className="text-sky-600 border-sky-600">
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700 font-medium">{question.definition}</p>

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
                      buttonClass += "border-gray-200 hover:border-sky-400 hover:bg-sky-50"
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
                      {selectedAnswer === question.correctAnswer ? "Excellent work!" : "Not quite right."}
                    </p>
                    <p className="text-sm mt-1">{question.explanation}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={goToModeSelection}>
                    Change Game
                  </Button>
                  {showResult && (
                    <Button onClick={handleNextQuestion} className="bg-slate-700 hover:bg-slate-800">
                      {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <div className="max-w-md mx-auto">
            <Card className="border-sky-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Great Job!</CardTitle>
                <CardDescription>
                  You completed the {gameModes.find(m => m.id === selectedMode)?.title} challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-sky-600">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600">
                  {score === questions.length
                    ? "Perfect score! You are a vocabulary master!"
                    : score >= questions.length * 0.8
                    ? "Excellent work! You really know your words!"
                    : score >= questions.length * 0.6
                    ? "Good effort! Keep practicing to improve."
                    : "Keep trying! Practice makes perfect."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetGame} className="bg-slate-700 hover:bg-slate-800">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={goToModeSelection}>
                    Choose Different Game
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
