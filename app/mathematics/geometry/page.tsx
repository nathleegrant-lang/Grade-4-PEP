"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shapes, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type GeometryTopic = "2d-shapes" | "3d-shapes" | "angles" | "lines"

interface GeometryQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  shape?: React.ReactNode
}

const shapes2DQuestions: GeometryQuestion[] = [
  {
    id: 1,
    question: "How many sides does a hexagon have?",
    options: ["4 sides", "5 sides", "6 sides", "8 sides"],
    correctAnswer: 2,
    explanation: "A hexagon has 6 sides. The prefix 'hex' means six."
  },
  {
    id: 2,
    question: "What shape has 4 equal sides and 4 right angles?",
    options: ["Rectangle", "Square", "Rhombus", "Trapezoid"],
    correctAnswer: 1,
    explanation: "A square has 4 equal sides AND 4 right angles (90°). A rhombus has 4 equal sides but not necessarily right angles."
  },
  {
    id: 3,
    question: "How many vertices (corners) does a triangle have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "A triangle has 3 vertices (corners), 3 sides, and 3 angles."
  },
  {
    id: 4,
    question: "What is the name of a shape with 8 sides?",
    options: ["Pentagon", "Hexagon", "Heptagon", "Octagon"],
    correctAnswer: 3,
    explanation: "An octagon has 8 sides. Think of an octopus with 8 legs! A stop sign is an octagon."
  },
  {
    id: 5,
    question: "A rectangle has ___.",
    options: ["4 equal sides", "2 pairs of equal sides", "No equal sides", "3 equal sides"],
    correctAnswer: 1,
    explanation: "A rectangle has 2 pairs of equal sides - opposite sides are equal in length."
  }
]

const shapes3DQuestions: GeometryQuestion[] = [
  {
    id: 1,
    question: "What 3D shape does a dice look like?",
    options: ["Sphere", "Cube", "Cylinder", "Cone"],
    correctAnswer: 1,
    explanation: "A dice is shaped like a cube - it has 6 square faces, 8 vertices, and 12 edges."
  },
  {
    id: 2,
    question: "How many faces does a rectangular prism have?",
    options: ["4 faces", "5 faces", "6 faces", "8 faces"],
    correctAnswer: 2,
    explanation: "A rectangular prism (like a cereal box) has 6 faces - a top, bottom, front, back, and two sides."
  },
  {
    id: 3,
    question: "What shape is a football (soccer ball)?",
    options: ["Cylinder", "Cone", "Sphere", "Cube"],
    correctAnswer: 2,
    explanation: "A football is a sphere - it is perfectly round like a ball."
  },
  {
    id: 4,
    question: "A cone has ___ flat face(s) and ___ curved surface(s).",
    options: ["0 and 1", "1 and 1", "2 and 0", "1 and 2"],
    correctAnswer: 1,
    explanation: "A cone has 1 flat circular face at the bottom and 1 curved surface that goes up to the point."
  },
  {
    id: 5,
    question: "What 3D shape can you make by rolling up a rectangle?",
    options: ["Cone", "Cylinder", "Cube", "Sphere"],
    correctAnswer: 1,
    explanation: "Rolling a rectangle creates a cylinder shape, like a paper towel roll."
  }
]

const anglesQuestions: GeometryQuestion[] = [
  {
    id: 1,
    question: "A right angle measures exactly ___.",
    options: ["45°", "90°", "180°", "360°"],
    correctAnswer: 1,
    explanation: "A right angle is exactly 90 degrees - like the corner of a book or the letter L."
  },
  {
    id: 2,
    question: "An angle less than 90° is called a(n) ___ angle.",
    options: ["right", "obtuse", "acute", "straight"],
    correctAnswer: 2,
    explanation: "An acute angle is less than 90°. Think 'a cute little angle' - it is smaller than a right angle."
  },
  {
    id: 3,
    question: "An angle greater than 90° but less than 180° is called a(n) ___ angle.",
    options: ["acute", "right", "obtuse", "reflex"],
    correctAnswer: 2,
    explanation: "An obtuse angle is greater than 90° but less than 180°. It is 'bigger' than a right angle."
  },
  {
    id: 4,
    question: "A straight angle measures ___.",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: 1,
    explanation: "A straight angle is 180° - it forms a straight line."
  },
  {
    id: 5,
    question: "How many degrees are in a full turn (complete circle)?",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: 3,
    explanation: "A full turn or complete circle is 360 degrees."
  }
]

const linesQuestions: GeometryQuestion[] = [
  {
    id: 1,
    question: "Lines that never meet and stay the same distance apart are called ___.",
    options: ["perpendicular lines", "parallel lines", "intersecting lines", "curved lines"],
    correctAnswer: 1,
    explanation: "Parallel lines never meet and are always the same distance apart - like railroad tracks."
  },
  {
    id: 2,
    question: "Lines that cross each other at a right angle (90°) are called ___.",
    options: ["parallel lines", "perpendicular lines", "diagonal lines", "wavy lines"],
    correctAnswer: 1,
    explanation: "Perpendicular lines meet at exactly 90° - like the lines on a plus sign (+)."
  },
  {
    id: 3,
    question: "A line segment has ___.",
    options: ["one endpoint", "two endpoints", "no endpoints", "three endpoints"],
    correctAnswer: 1,
    explanation: "A line segment has exactly two endpoints - it starts and stops."
  },
  {
    id: 4,
    question: "A ray has ___.",
    options: ["two endpoints", "no endpoints", "one endpoint", "three endpoints"],
    correctAnswer: 2,
    explanation: "A ray has one endpoint and goes on forever in one direction - like a ray of sunlight from the sun."
  },
  {
    id: 5,
    question: "Which is an example of parallel lines in real life?",
    options: ["The hands of a clock", "Railroad tracks", "The letter X", "Tree branches"],
    correctAnswer: 1,
    explanation: "Railroad tracks are parallel - they run side by side and never meet."
  }
]

const geometryTopics = [
  { id: "2d-shapes" as GeometryTopic, title: "2D Shapes", description: "Flat shapes like squares, triangles, circles", color: "bg-blue-500" },
  { id: "3d-shapes" as GeometryTopic, title: "3D Shapes", description: "Solid shapes like cubes, spheres, cones", color: "bg-sky-500" },
  { id: "angles" as GeometryTopic, title: "Angles", description: "Right, acute, obtuse angles", color: "bg-amber-500" },
  { id: "lines" as GeometryTopic, title: "Lines", description: "Parallel, perpendicular, intersecting", color: "bg-purple-500" },
]

export default function GeometryPage() {
  const [selectedTopic, setSelectedTopic] = useState<GeometryTopic | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const getQuestions = (topic: GeometryTopic): GeometryQuestion[] => {
    switch (topic) {
      case "2d-shapes": return shapes2DQuestions
      case "3d-shapes": return shapes3DQuestions
      case "angles": return anglesQuestions
      case "lines": return linesQuestions
    }
  }

  const questions = selectedTopic ? getQuestions(selectedTopic) : []
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

  const goToTopicSelection = () => {
    setSelectedTopic(null)
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
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Shapes className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Geometry & Shapes</h2>
            <p className="text-gray-600">Explore shapes, angles, and lines</p>
          </div>
        </div>

        {/* Topic Selection */}
        {!selectedTopic && (
          <div className="space-y-6">
            <Card className="border-purple-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose a Geometry Topic</CardTitle>
                <CardDescription>Select what you want to learn about</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {geometryTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-6 rounded-lg text-white text-left transition-transform hover:scale-105 ${topic.color}`}
                    >
                      <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                      <p className="text-white/90">{topic.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Geometry Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Look for shapes in the world around you - buildings, signs, nature!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Remember: 2D shapes are flat, 3D shapes have depth (you can hold them).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Use the corner of a paper to check if an angle is a right angle.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Shape Reference */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Shape Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-2 border-2 border-blue-500"></div>
                    <p className="font-medium">Square</p>
                    <p className="text-xs text-gray-500">4 equal sides</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-12 mx-auto mb-2 border-2 border-sky-500"></div>
                    <p className="font-medium">Rectangle</p>
                    <p className="text-xs text-gray-500">2 pairs equal sides</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-0 h-0 mx-auto mb-2 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-amber-500"></div>
                    <p className="font-medium">Triangle</p>
                    <p className="text-xs text-gray-500">3 sides</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-rose-500"></div>
                    <p className="font-medium">Circle</p>
                    <p className="text-xs text-gray-500">No sides or corners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz in Progress */}
        {selectedTopic && !quizComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge className={geometryTopics.find(t => t.id === selectedTopic)?.color}>
                {geometryTopics.find(t => t.id === selectedTopic)?.title}
              </Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / questions.length) * 100} className="mb-6 h-3" />

            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Geometry Question</CardTitle>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
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
                  <Button variant="outline" onClick={goToTopicSelection}>
                    Change Topic
                  </Button>
                  {showResult && (
                    <Button onClick={handleNextQuestion} className="bg-purple-600 hover:bg-purple-700">
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
            <Card className="border-purple-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Fantastic!</CardTitle>
                <CardDescription>
                  You completed the {geometryTopics.find(t => t.id === selectedTopic)?.title} quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-purple-600">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600">
                  {score === questions.length
                    ? "Perfect! You are a geometry expert!"
                    : score >= questions.length * 0.8
                    ? "Excellent! You really know your shapes!"
                    : score >= questions.length * 0.6
                    ? "Good effort! Keep practicing."
                    : "Keep trying! Practice makes perfect."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetQuiz} className="bg-purple-600 hover:bg-purple-700">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={goToTopicSelection}>
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
