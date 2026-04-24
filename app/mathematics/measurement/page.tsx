"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Ruler, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, Clock, Thermometer, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type MeasurementType = "length" | "mass" | "time" | "temperature"

interface MeasurementQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  visual?: string
}

const lengthQuestions: MeasurementQuestion[] = [
  {
    id: 1,
    question: "How many centimetres are in 1 metre?",
    options: ["10 cm", "100 cm", "1000 cm", "50 cm"],
    correctAnswer: 1,
    explanation: "There are 100 centimetres in 1 metre. Remember: centi means hundredth!"
  },
  {
    id: 2,
    question: "Which unit would you use to measure the length of your classroom?",
    options: ["Centimetres", "Millimetres", "Metres", "Kilometres"],
    correctAnswer: 2,
    explanation: "Metres are best for measuring rooms and buildings. A classroom might be about 8-10 metres long."
  },
  {
    id: 3,
    question: "A pencil is 15 cm long. How many millimetres is that?",
    options: ["15 mm", "150 mm", "1500 mm", "1.5 mm"],
    correctAnswer: 1,
    explanation: "To convert cm to mm, multiply by 10. So 15 cm × 10 = 150 mm."
  },
  {
    id: 4,
    question: "Which is longer: 2 metres or 150 centimetres?",
    options: ["2 metres", "150 centimetres", "They are equal", "Cannot compare"],
    correctAnswer: 0,
    explanation: "2 metres = 200 cm, which is longer than 150 cm."
  },
  {
    id: 5,
    question: "The distance from Kingston to Montego Bay is about 180 ___.",
    options: ["metres", "centimetres", "kilometres", "millimetres"],
    correctAnswer: 2,
    explanation: "Long distances between cities are measured in kilometres."
  }
]

const massQuestions: MeasurementQuestion[] = [
  {
    id: 1,
    question: "How many grams are in 1 kilogram?",
    options: ["10 g", "100 g", "1000 g", "500 g"],
    correctAnswer: 2,
    explanation: "There are 1000 grams in 1 kilogram. Kilo means thousand!"
  },
  {
    id: 2,
    question: "Which unit would you use to measure a bag of sugar?",
    options: ["Milligrams", "Grams", "Kilograms", "Tonnes"],
    correctAnswer: 2,
    explanation: "A bag of sugar is usually 1 or 2 kilograms."
  },
  {
    id: 3,
    question: "A mango weighs about 300 grams. How much do 4 mangoes weigh?",
    options: ["700 g", "1200 g", "1000 g", "400 g"],
    correctAnswer: 1,
    explanation: "4 mangoes × 300 g each = 1200 g (or 1.2 kg)."
  },
  {
    id: 4,
    question: "Which is heavier: 2 kg or 1500 g?",
    options: ["2 kg", "1500 g", "They are equal", "Cannot compare"],
    correctAnswer: 0,
    explanation: "2 kg = 2000 g, which is heavier than 1500 g."
  },
  {
    id: 5,
    question: "A Grade 4 student might weigh about ___.",
    options: ["30 grams", "30 kilograms", "300 kilograms", "3 grams"],
    correctAnswer: 1,
    explanation: "A Grade 4 student (about 9-10 years old) typically weighs between 25-35 kilograms."
  }
]

const timeQuestions: MeasurementQuestion[] = [
  {
    id: 1,
    question: "How many minutes are in 1 hour?",
    options: ["30 minutes", "60 minutes", "100 minutes", "45 minutes"],
    correctAnswer: 1,
    explanation: "There are 60 minutes in 1 hour."
  },
  {
    id: 2,
    question: "If school starts at 8:30 a.m. and ends at 2:30 p.m., how long is the school day?",
    options: ["4 hours", "5 hours", "6 hours", "7 hours"],
    correctAnswer: 2,
    explanation: "From 8:30 a.m. to 2:30 p.m. is 6 hours."
  },
  {
    id: 3,
    question: "What time is it 45 minutes after 10:15?",
    options: ["10:60", "11:00", "11:15", "10:45"],
    correctAnswer: 1,
    explanation: "10:15 + 45 minutes = 11:00. When minutes go past 60, add 1 to the hour."
  },
  {
    id: 4,
    question: "How many days are in February during a leap year?",
    options: ["28 days", "29 days", "30 days", "31 days"],
    correctAnswer: 1,
    explanation: "February has 29 days during a leap year (every 4 years)."
  },
  {
    id: 5,
    question: "3:45 p.m. in 24-hour time is ___.",
    options: ["3:45", "13:45", "15:45", "345"],
    correctAnswer: 2,
    explanation: "For p.m. times (except 12), add 12 to the hour. 3 + 12 = 15, so it is 15:45."
  }
]

const temperatureQuestions: MeasurementQuestion[] = [
  {
    id: 1,
    question: "Water freezes at ___ degrees Celsius.",
    options: ["0°C", "10°C", "100°C", "-10°C"],
    correctAnswer: 0,
    explanation: "Water freezes at 0°C (zero degrees Celsius)."
  },
  {
    id: 2,
    question: "On a hot day in Jamaica, the temperature might be about ___.",
    options: ["15°C", "25°C", "33°C", "50°C"],
    correctAnswer: 2,
    explanation: "A hot day in Jamaica is usually around 30-35°C."
  },
  {
    id: 3,
    question: "Water boils at ___ degrees Celsius.",
    options: ["50°C", "75°C", "100°C", "200°C"],
    correctAnswer: 2,
    explanation: "Water boils at 100°C (one hundred degrees Celsius)."
  },
  {
    id: 4,
    question: "A fever temperature for a person would be about ___.",
    options: ["30°C", "37°C", "39°C", "45°C"],
    correctAnswer: 2,
    explanation: "Normal body temperature is about 37°C. A fever is usually 38°C or higher, so 39°C indicates a fever."
  },
  {
    id: 5,
    question: "Which temperature is coldest?",
    options: ["5°C", "0°C", "-5°C", "10°C"],
    correctAnswer: 2,
    explanation: "-5°C is coldest because negative numbers are below zero."
  }
]

const measurementTypes = [
  { id: "length" as MeasurementType, title: "Length", description: "Metres, centimetres, millimetres", color: "bg-blue-500", icon: Ruler },
  { id: "mass" as MeasurementType, title: "Mass (Weight)", description: "Kilograms and grams", color: "bg-sky-500", icon: Scale },
  { id: "time" as MeasurementType, title: "Time", description: "Hours, minutes, and calendars", color: "bg-amber-500", icon: Clock },
  { id: "temperature" as MeasurementType, title: "Temperature", description: "Degrees Celsius", color: "bg-rose-500", icon: Thermometer },
]

export default function MeasurementPage() {
  const [selectedType, setSelectedType] = useState<MeasurementType | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const getQuestions = (type: MeasurementType): MeasurementQuestion[] => {
    switch (type) {
      case "length": return lengthQuestions
      case "mass": return massQuestions
      case "time": return timeQuestions
      case "temperature": return temperatureQuestions
    }
  }

  const questions = selectedType ? getQuestions(selectedType) : []
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
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
  }

  const goToTypeSelection = () => {
    setSelectedType(null)
    resetQuiz()
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
            <Ruler className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Measurement</h2>
            <p className="text-gray-600">Learn to measure length, mass, time, and temperature</p>
          </div>
        </div>

        {/* Type Selection */}
        {!selectedType && (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose a Measurement Topic</CardTitle>
                <CardDescription>Select what you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {measurementTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-6 rounded-lg text-white text-left transition-transform hover:scale-105 ${type.color}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-8 w-8" />
                          <h3 className="text-xl font-bold">{type.title}</h3>
                        </div>
                        <p className="text-white/90">{type.description}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Measurement Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Remember: kilo = 1000, centi = 1/100, milli = 1/1000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>To convert larger to smaller units, multiply. To convert smaller to larger, divide.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Think about everyday objects to help estimate measurements.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz in Progress */}
        {selectedType && !quizComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge className={measurementTypes.find(t => t.id === selectedType)?.color}>
                {measurementTypes.find(t => t.id === selectedType)?.title}
              </Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / questions.length) * 100} className="mb-6 h-3" />

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Measurement Question</CardTitle>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      buttonClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
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
                  <Button variant="outline" onClick={goToTypeSelection}>
                    Change Topic
                  </Button>
                  {showResult && (
                    <Button onClick={handleNextQuestion} className="bg-blue-600 hover:bg-blue-700">
                      {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
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
            <Card className="border-blue-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Well Done!</CardTitle>
                <CardDescription>
                  You completed the {measurementTypes.find(t => t.id === selectedType)?.title} quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-blue-600">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600">
                  {score === questions.length
                    ? "Perfect! You are a measurement master!"
                    : score >= questions.length * 0.8
                    ? "Excellent! You understand measurement well!"
                    : score >= questions.length * 0.6
                    ? "Good job! Keep practicing."
                    : "Keep trying! You will improve."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={goToTypeSelection}>
                    Choose Different Topic
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
