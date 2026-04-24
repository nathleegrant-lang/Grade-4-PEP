"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface ResearchQuestion {
  id: number
  scenario: string
  source?: { title: string; content: string }
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const researchQuestions: ResearchQuestion[] = [
  {
    id: 1,
    scenario: "Your teacher asks you to find information about Jamaica's national bird.",
    question: "Which would be the BEST source to find accurate information?",
    options: [
      "A social media post from a friend",
      "The Jamaica Information Service website",
      "A cartoon about birds",
      "A video game about animals"
    ],
    correctAnswer: 1,
    explanation: "Official government websites like the Jamaica Information Service provide accurate, reliable information about national symbols."
  },
  {
    id: 2,
    scenario: "You need to write a report about hurricanes in Jamaica.",
    source: {
      title: "Jamaica's Hurricane Season",
      content: "Jamaica's official hurricane season runs from June 1 to November 30. The country has experienced several major hurricanes including Hurricane Gilbert in 1988 and Hurricane Ivan in 2004. The Office of Disaster Preparedness and Emergency Management (ODPEM) helps Jamaicans prepare for storms."
    },
    question: "According to the passage, when does hurricane season in Jamaica begin?",
    options: ["January 1", "June 1", "September 1", "November 30"],
    correctAnswer: 1,
    explanation: "The passage clearly states that 'Jamaica's official hurricane season runs from June 1 to November 30.'"
  },
  {
    id: 3,
    scenario: "You are reading a book about Jamaican heroes for a school project.",
    source: {
      title: "Marcus Garvey - National Hero",
      content: "Marcus Mosiah Garvey was born on August 17, 1887, in St. Ann's Bay, Jamaica. He founded the Universal Negro Improvement Association (UNIA) and inspired millions of people of African descent around the world. He is one of Jamaica's seven National Heroes."
    },
    question: "What is a fact you can find in this passage?",
    options: [
      "Marcus Garvey was the best leader ever",
      "Everyone loved Marcus Garvey",
      "Marcus Garvey was born in St. Ann's Bay",
      "Marcus Garvey's birthday should be a holiday"
    ],
    correctAnswer: 2,
    explanation: "A fact is something that can be proven true. The passage states he was born in St. Ann's Bay. The other options are opinions."
  },
  {
    id: 4,
    scenario: "You want to learn about traditional Jamaican foods for a cultural presentation.",
    question: "What is the FIRST step in doing research?",
    options: [
      "Start writing your presentation immediately",
      "Decide what specific questions you want to answer",
      "Copy information from the first website you find",
      "Ask a friend what they think"
    ],
    correctAnswer: 1,
    explanation: "Good research starts with deciding what questions you need to answer. This helps you focus your search and find relevant information."
  },
  {
    id: 5,
    scenario: "You found two sources about the Blue Mountains. One is from a travel blog, and one is from National Geographic.",
    question: "Which source is more likely to have accurate, well-researched information?",
    options: [
      "The travel blog because it is more fun to read",
      "National Geographic because it is a respected publication with expert writers",
      "Both are equally reliable",
      "Neither can be trusted"
    ],
    correctAnswer: 1,
    explanation: "National Geographic is a respected publication known for accurate, well-researched content. Travel blogs can be helpful but may contain personal opinions."
  },
  {
    id: 6,
    scenario: "You are taking notes from an encyclopedia article about Jamaican music.",
    question: "What is the best way to record information from a source?",
    options: [
      "Copy everything word for word",
      "Write the main ideas in your own words and note where you found them",
      "Only remember it in your head",
      "Take a photo and forget about it"
    ],
    correctAnswer: 1,
    explanation: "Writing main ideas in your own words (paraphrasing) shows understanding. Noting your source allows you to give credit and find the information again."
  },
  {
    id: 7,
    source: {
      title: "Table of Contents",
      content: "Chapter 1: Jamaica's Geography... page 5\nChapter 2: Jamaica's History... page 23\nChapter 3: Jamaica's Government... page 45\nChapter 4: Jamaica's Culture... page 67\nChapter 5: Jamaica's Economy... page 89"
    },
    scenario: "You are using a book about Jamaica and want to find information about traditional music and dances.",
    question: "Which chapter would most likely have this information?",
    options: ["Chapter 1: Geography", "Chapter 2: History", "Chapter 4: Culture", "Chapter 5: Economy"],
    correctAnswer: 2,
    explanation: "Traditional music and dances are part of culture, so Chapter 4: Jamaica's Culture would be the best place to look."
  },
  {
    id: 8,
    scenario: "Your assignment is to compare two Jamaican parishes.",
    question: "What kind of information would be most useful for a comparison?",
    options: [
      "Your personal feelings about each parish",
      "Facts like population, size, main industries, and landmarks",
      "Which parish sounds nicer",
      "Made-up information"
    ],
    correctAnswer: 1,
    explanation: "A good comparison uses facts and data that can be verified, such as population, size, industries, and notable landmarks."
  }
]

export default function ResearchSkillsPage() {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = researchQuestions[currentQuestion]

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < researchQuestions.length - 1) {
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
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Research Skills</h2>
            <p className="text-gray-600">Learn to find, evaluate, and use information</p>
          </div>
        </div>

        {/* Introduction */}
        {!started && (
          <div className="space-y-6">
            <Card className="border-amber-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">What are Research Skills?</CardTitle>
                <CardDescription>Important skills for Performance Tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Research skills help you find accurate information, understand what you read, and use that 
                  information to complete tasks. In the PEP Performance Task, you will need to read sources 
                  and answer questions based on what you learn.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Types of Sources
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>Books and encyclopedias</li>
                      <li>Official websites (.gov, .edu)</li>
                      <li>News articles</li>
                      <li>Interviews with experts</li>
                    </ul>
                  </div>
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h4 className="font-medium text-sky-800 mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Research Steps
                    </h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>1. Identify your question</li>
                      <li>2. Find reliable sources</li>
                      <li>3. Read and take notes</li>
                      <li>4. Use information correctly</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={() => setStarted(true)} className="w-full bg-amber-500 hover:bg-amber-600">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Research Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">1.</span>
                    <span>Always check if a source is reliable before using the information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">2.</span>
                    <span>Look for facts (can be proven) not just opinions (what someone thinks).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">3.</span>
                    <span>Use the table of contents and index to find information quickly in books.</span>
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
              <Badge className="bg-amber-500">Research Skills</Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {researchQuestions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / researchQuestions.length) * 100} className="mb-6 h-3" />

            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Research Question</CardTitle>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scenario */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">Scenario:</p>
                  <p className="text-blue-700">{question.scenario}</p>
                </div>

                {/* Source if available */}
                {question.source && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium mb-2">{question.source.title}</p>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{question.source.content}</p>
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
                      buttonClass += "border-gray-200 hover:border-amber-400 hover:bg-amber-50"
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
                    <Button onClick={handleNextQuestion} className="bg-amber-500 hover:bg-amber-600">
                      {currentQuestion < researchQuestions.length - 1 ? "Next Question" : "See Results"}
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
            <Card className="border-amber-200 text-center">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Well Done!</CardTitle>
                <CardDescription>
                  You completed the Research Skills practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-amber-500">
                  {score}/{researchQuestions.length}
                </div>
                <p className="text-gray-600">
                  {score === researchQuestions.length
                    ? "Perfect! You are a research expert!"
                    : score >= researchQuestions.length * 0.8
                    ? "Excellent! You know how to find and use information!"
                    : score >= researchQuestions.length * 0.6
                    ? "Good job! Keep practicing your research skills."
                    : "Keep trying! Research skills take practice."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={resetQuiz} className="bg-amber-500 hover:bg-amber-600">
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
