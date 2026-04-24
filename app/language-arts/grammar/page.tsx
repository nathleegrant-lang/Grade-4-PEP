"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, Lock, Crown, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/contexts/progress-context"

type TopicType = "nouns" | "verbs" | "adjectives" | "punctuation" | "sentences"

interface GrammarQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const nounsQuestions: GrammarQuestion[] = [
  {
    id: 1,
    question: "Which word is a proper noun?",
    options: ["dog", "Jamaica", "school", "teacher"],
    correctAnswer: 1,
    explanation: "'Jamaica' is a proper noun because it names a specific country. Proper nouns always begin with a capital letter."
  },
  {
    id: 2,
    question: "Which word is a common noun?",
    options: ["Kingston", "Monday", "river", "Marcus"],
    correctAnswer: 2,
    explanation: "'River' is a common noun because it refers to any river, not a specific one. Common nouns do not need capital letters."
  },
  {
    id: 3,
    question: "What is the plural of 'child'?",
    options: ["childs", "childes", "children", "child's"],
    correctAnswer: 2,
    explanation: "The plural of 'child' is 'children'. This is an irregular plural noun."
  },
  {
    id: 4,
    question: "Which sentence has a collective noun?",
    options: ["The dog ran fast.", "The team won the match.", "She ate an apple.", "Birds can fly."],
    correctAnswer: 1,
    explanation: "'Team' is a collective noun because it refers to a group of people working together."
  },
  {
    id: 5,
    question: "What is the plural of 'mango'?",
    options: ["mangos", "mangoes", "mangies", "mango's"],
    correctAnswer: 1,
    explanation: "The plural of 'mango' is 'mangoes'. Words ending in 'o' often add 'es' to form the plural."
  }
]

const verbsQuestions: GrammarQuestion[] = [
  {
    id: 1,
    question: "Which word is a verb in: 'The children play in the yard.'",
    options: ["children", "play", "yard", "the"],
    correctAnswer: 1,
    explanation: "'Play' is the verb because it shows the action that the children are doing."
  },
  {
    id: 2,
    question: "What is the past tense of 'run'?",
    options: ["runned", "runs", "ran", "running"],
    correctAnswer: 2,
    explanation: "'Ran' is the past tense of 'run'. This is an irregular verb."
  },
  {
    id: 3,
    question: "Choose the correct verb: 'She ___ to school every day.'",
    options: ["walk", "walks", "walking", "walked"],
    correctAnswer: 1,
    explanation: "'Walks' is correct because 'she' is singular and requires a verb with 's' in present tense."
  },
  {
    id: 4,
    question: "Which is an action verb?",
    options: ["is", "are", "jump", "was"],
    correctAnswer: 2,
    explanation: "'Jump' is an action verb because it describes a physical action. 'Is', 'are', and 'was' are linking verbs."
  },
  {
    id: 5,
    question: "What is the past tense of 'eat'?",
    options: ["eated", "ate", "eating", "eaten"],
    correctAnswer: 1,
    explanation: "'Ate' is the simple past tense of 'eat'. 'Eaten' is the past participle."
  }
]

const adjectivesQuestions: GrammarQuestion[] = [
  {
    id: 1,
    question: "Which word is an adjective in: 'The tall boy ran fast.'",
    options: ["the", "tall", "boy", "ran"],
    correctAnswer: 1,
    explanation: "'Tall' is an adjective because it describes the noun 'boy'."
  },
  {
    id: 2,
    question: "Choose the correct comparative: 'This mango is ___ than that one.'",
    options: ["sweet", "sweeter", "sweetest", "more sweet"],
    correctAnswer: 1,
    explanation: "'Sweeter' is the comparative form used when comparing two things."
  },
  {
    id: 3,
    question: "Which is a superlative adjective?",
    options: ["big", "bigger", "biggest", "bigly"],
    correctAnswer: 2,
    explanation: "'Biggest' is the superlative form, used when comparing three or more things."
  },
  {
    id: 4,
    question: "How many adjectives are in: 'The little brown dog barked.'",
    options: ["one", "two", "three", "none"],
    correctAnswer: 1,
    explanation: "There are two adjectives: 'little' and 'brown'. Both describe the noun 'dog'."
  },
  {
    id: 5,
    question: "Choose the correct superlative: 'She is the ___ girl in class.'",
    options: ["intelligent", "more intelligent", "most intelligent", "intelligenter"],
    correctAnswer: 2,
    explanation: "'Most intelligent' is correct because 'intelligent' has more than two syllables, so we use 'most' for the superlative."
  }
]

const punctuationQuestions: GrammarQuestion[] = [
  {
    id: 1,
    question: "Which sentence has correct punctuation?",
    options: ["where is my book", "Where is my book?", "Where is my book", "where is my book?"],
    correctAnswer: 1,
    explanation: "Questions need a capital letter at the start and a question mark at the end."
  },
  {
    id: 2,
    question: "Where should the comma go: 'Marcus bring your book here.'",
    options: ["After 'Marcus'", "After 'bring'", "After 'book'", "No comma needed"],
    correctAnswer: 0,
    explanation: "A comma should come after 'Marcus' because we use a comma when directly addressing someone."
  },
  {
    id: 3,
    question: "Which shows correct use of an apostrophe?",
    options: ["The dogs bone", "The dog's bone", "The dogs' bone", "The dog bone's"],
    correctAnswer: 1,
    explanation: "'The dog's bone' shows that the bone belongs to one dog. The apostrophe + s shows possession."
  },
  {
    id: 4,
    question: "What punctuation ends an exclamatory sentence?",
    options: ["Period (.)", "Question mark (?)", "Exclamation mark (!)", "Comma (,)"],
    correctAnswer: 2,
    explanation: "Exclamatory sentences show strong feeling and end with an exclamation mark (!)"
  },
  {
    id: 5,
    question: "Which sentence uses quotation marks correctly?",
    options: ["She said \"hello.\"", "She said hello.", "\"She\" said hello.", "She \"said\" hello."],
    correctAnswer: 0,
    explanation: "Quotation marks go around the exact words someone speaks. The period goes inside the quotation marks."
  }
]

const sentencesQuestions: GrammarQuestion[] = [
  {
    id: 1,
    question: "Which is a complete sentence?",
    options: ["Running fast.", "The big red.", "Birds fly south.", "Under the tree."],
    correctAnswer: 2,
    explanation: "'Birds fly south' is complete because it has a subject (birds) and a predicate (fly south)."
  },
  {
    id: 2,
    question: "What type of sentence is: 'Close the door.'",
    options: ["Declarative", "Interrogative", "Exclamatory", "Imperative"],
    correctAnswer: 3,
    explanation: "'Close the door' is an imperative sentence because it gives a command."
  },
  {
    id: 3,
    question: "What is the subject in: 'The happy children played outside.'",
    options: ["happy", "children", "The happy children", "played outside"],
    correctAnswer: 2,
    explanation: "'The happy children' is the complete subject - it includes the noun and its modifiers."
  },
  {
    id: 4,
    question: "Which is a compound sentence?",
    options: ["The dog barked.", "The dog barked and ran.", "The big dog barked.", "The dog, which was big, barked."],
    correctAnswer: 1,
    explanation: "'The dog barked and ran' is compound because it has two verbs connected by 'and'."
  },
  {
    id: 5,
    question: "What type of sentence is: 'What a beautiful day!'",
    options: ["Declarative", "Interrogative", "Exclamatory", "Imperative"],
    correctAnswer: 2,
    explanation: "'What a beautiful day!' is exclamatory because it expresses strong feeling and ends with an exclamation mark."
  }
]

const topics = [
  { id: "nouns" as TopicType, title: "Nouns", description: "Common, proper, and plural nouns", color: "bg-blue-500" },
  { id: "verbs" as TopicType, title: "Verbs", description: "Action words and tenses", color: "bg-sky-500" },
  { id: "adjectives" as TopicType, title: "Adjectives", description: "Describing words and comparisons", color: "bg-amber-500" },
  { id: "punctuation" as TopicType, title: "Punctuation", description: "Periods, commas, and more", color: "bg-rose-500" },
  { id: "sentences" as TopicType, title: "Sentence Types", description: "Building complete sentences", color: "bg-purple-500" },
]

export default function GrammarPage() {
  const { isPremium } = useAuth()
  const { canTakeQuiz, recordQuizAttempt, getQuizAttempts, earnCertificate, hasCertificate } = useProgress()
  
  const [selectedTopic, setSelectedTopic] = useState<TopicType | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [quizLocked, setQuizLocked] = useState(false)

  // Check if selected topic quiz is locked for free users
  useEffect(() => {
    if (selectedTopic) {
      const quizId = `grammar-${selectedTopic}`
      setQuizLocked(!canTakeQuiz(quizId))
    }
  }, [selectedTopic, canTakeQuiz])

  const getQuestions = (topic: TopicType): GrammarQuestion[] => {
    switch (topic) {
      case "nouns": return nounsQuestions
      case "verbs": return verbsQuestions
      case "adjectives": return adjectivesQuestions
      case "punctuation": return punctuationQuestions
      case "sentences": return sentencesQuestions
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

  // Record quiz attempt when completed
  useEffect(() => {
    if (quizComplete && selectedTopic) {
      const quizId = `grammar-${selectedTopic}`
      const percentage = Math.round((score / questions.length) * 100)
      
      recordQuizAttempt({
        quizId,
        category: "language-arts",
        topic: topics.find(t => t.id === selectedTopic)?.title || selectedTopic,
        score,
        totalQuestions: questions.length,
        percentage,
      })

      // Award certificate for 80%+ score (premium feature)
      if (isPremium && percentage >= 80 && !hasCertificate(quizId)) {
        earnCertificate({
          type: "quiz",
          title: `Grammar Master: ${topics.find(t => t.id === selectedTopic)?.title}`,
          description: `Scored ${percentage}% on the ${topics.find(t => t.id === selectedTopic)?.title} quiz`,
          score: percentage,
          quizId,
        })
      }
    }
  }, [quizComplete])

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
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Grammar & Punctuation</h2>
            <p className="text-gray-600">Master the rules of English language</p>
          </div>
        </div>

        {/* Topic Selection */}
        {!selectedTopic && (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose a Grammar Topic</CardTitle>
                <CardDescription>Select a topic to practice your grammar skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((topic) => {
                    const quizId = `grammar-${topic.id}`
                    const attempts = getQuizAttempts(quizId)
                    const hasAttempted = attempts.length > 0
                    const bestScore = hasAttempted ? Math.max(...attempts.map(a => a.percentage)) : 0
                    const isLocked = !isPremium && hasAttempted
                    const hasCert = hasCertificate(quizId)

                    return (
                      <button
                        key={topic.id}
                        onClick={() => !isLocked && setSelectedTopic(topic.id)}
                        disabled={isLocked}
                        className={`p-6 rounded-lg text-white text-left transition-transform ${
                          isLocked 
                            ? "opacity-75 cursor-not-allowed" 
                            : "hover:scale-105"
                        } ${topic.color} relative`}
                      >
                        {isLocked && (
                          <div className="absolute top-2 right-2">
                            <Lock className="h-5 w-5 text-white/80" />
                          </div>
                        )}
                        {hasCert && (
                          <div className="absolute top-2 right-2">
                            <Award className="h-5 w-5 text-amber-300" />
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                        <p className="text-white/90 text-sm">{topic.description}</p>
                        {hasAttempted && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs text-white/80">
                              Best: {bestScore}% {isPremium && `(${attempts.length} attempts)`}
                            </p>
                          </div>
                        )}
                        {isLocked && (
                          <p className="text-xs text-white/70 mt-2">Upgrade for unlimited retries</p>
                        )}
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
                  Grammar Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Every sentence needs a subject (who or what) and a predicate (what happens).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Proper nouns (names of specific people, places, things) always start with capital letters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Read sentences aloud to help catch punctuation errors.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz in Progress */}
        {selectedTopic && !quizComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge className={topics.find(t => t.id === selectedTopic)?.color}>
                {topics.find(t => t.id === selectedTopic)?.title}
              </Badge>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <Progress value={(currentQuestion / questions.length) * 100} className="mb-6 h-3" />

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-xl">Grammar Question</CardTitle>
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
                  <Button variant="outline" onClick={goToTopicSelection}>
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
                  You completed the {topics.find(t => t.id === selectedTopic)?.title} quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-5xl font-bold text-blue-600">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600">
                  {score === questions.length
                    ? "Perfect! You have mastered this topic!"
                    : score >= questions.length * 0.8
                    ? "Excellent! You know your grammar well!"
                    : score >= questions.length * 0.6
                    ? "Good job! Keep practicing."
                    : "Keep trying! You will improve with practice."}
                </p>

                {/* Certificate Earned Badge */}
                {isPremium && Math.round((score / questions.length) * 100) >= 80 && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-amber-700">
                      <Award className="h-5 w-5" />
                      <span className="font-medium">Certificate Earned!</span>
                    </div>
                    <p className="text-sm text-amber-600 mt-1">View in your Dashboard</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {isPremium ? (
                    <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  ) : (
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Quiz completed - Upgrade for unlimited retries</span>
                      </div>
                      <Link href="/pricing">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </div>
                  )}
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
