
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  Home,
  Lock,
  Crown,
  ArrowLeft,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const FREE_QUESTION_LIMIT = 5

interface Question {
  id: number
  type: "reading" | "vocabulary" | "grammar" | "writing"
  passage?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const literacyEasyQuestions: Question[] = [
  {
    "id": 1,
    "type": "reading",
    "passage": "A Day at the Beach\n\nOn Saturday, Maya went to the beach with her mother and brother. They packed towels, sandwiches, and a big bottle of water. The sun was bright, and the sea was calm.\n\nMaya built a sandcastle near the shore. Her brother collected shells and placed them around the castle. Their mother sat under a tree and read a book.\n\nLater, the family ate lunch together. Before going home, Maya jumped in the shallow water and laughed as the waves touched her feet.",
    "question": "Who went to the beach with Maya?",
    "options": [
      "Her father and sister",
      "Her mother and brother",
      "Her teacher and friend",
      "Her cousin and aunt"
    ],
    "correctAnswer": 1,
    "explanation": "The passage says Maya went to the beach with her mother and brother."
  },
  {
    "id": 2,
    "type": "reading",
    "passage": "A Day at the Beach\n\nOn Saturday, Maya went to the beach with her mother and brother. They packed towels, sandwiches, and a big bottle of water. The sun was bright, and the sea was calm.\n\nMaya built a sandcastle near the shore. Her brother collected shells and placed them around the castle. Their mother sat under a tree and read a book.\n\nLater, the family ate lunch together. Before going home, Maya jumped in the shallow water and laughed as the waves touched her feet.",
    "question": "What did Maya build?",
    "options": [
      "A boat",
      "A tent",
      "A sandcastle",
      "A kite"
    ],
    "correctAnswer": 2,
    "explanation": "The passage states that Maya built a sandcastle near the shore."
  },
  {
    "id": 3,
    "type": "reading",
    "passage": "A Day at the Beach\n\nOn Saturday, Maya went to the beach with her mother and brother. They packed towels, sandwiches, and a big bottle of water. The sun was bright, and the sea was calm.\n\nMaya built a sandcastle near the shore. Her brother collected shells and placed them around the castle. Their mother sat under a tree and read a book.\n\nLater, the family ate lunch together. Before going home, Maya jumped in the shallow water and laughed as the waves touched her feet.",
    "question": "What did Maya's brother collect?",
    "options": [
      "Fish",
      "Shells",
      "Stones",
      "Leaves"
    ],
    "correctAnswer": 1,
    "explanation": "Maya's brother collected shells and placed them around the sandcastle."
  },
  {
    "id": 4,
    "type": "reading",
    "passage": "A Day at the Beach\n\nOn Saturday, Maya went to the beach with her mother and brother. They packed towels, sandwiches, and a big bottle of water. The sun was bright, and the sea was calm.\n\nMaya built a sandcastle near the shore. Her brother collected shells and placed them around the castle. Their mother sat under a tree and read a book.\n\nLater, the family ate lunch together. Before going home, Maya jumped in the shallow water and laughed as the waves touched her feet.",
    "question": "Where did Maya's mother sit?",
    "options": [
      "In the car",
      "On a rock",
      "Under a tree",
      "In the water"
    ],
    "correctAnswer": 2,
    "explanation": "The passage says their mother sat under a tree and read a book."
  },
  {
    "id": 5,
    "type": "reading",
    "passage": "A Day at the Beach\n\nOn Saturday, Maya went to the beach with her mother and brother. They packed towels, sandwiches, and a big bottle of water. The sun was bright, and the sea was calm.\n\nMaya built a sandcastle near the shore. Her brother collected shells and placed them around the castle. Their mother sat under a tree and read a book.\n\nLater, the family ate lunch together. Before going home, Maya jumped in the shallow water and laughed as the waves touched her feet.",
    "question": "What did the family do later?",
    "options": [
      "They ate lunch",
      "They went fishing",
      "They played football",
      "They climbed a hill"
    ],
    "correctAnswer": 0,
    "explanation": "The passage says later the family ate lunch together."
  },
  {
    "id": 6,
    "type": "reading",
    "passage": "The School Garden\n\nMr. Brown and his class started a school garden behind the library. First, they cleared the ground and pulled up weeds. Next, they dug small holes in the soil.\n\nThe students planted tomato seeds, callaloo, and sweet pepper. Every day, two students watered the plants before morning assembly. After a few weeks, the garden became green and healthy.\n\nOne Friday, the class picked the first ripe tomatoes. They were proud because their hard work had paid off.",
    "question": "Where was the school garden?",
    "options": [
      "Beside the canteen",
      "Behind the library",
      "Near the gate",
      "In front of the office"
    ],
    "correctAnswer": 1,
    "explanation": "The passage says the school garden was behind the library."
  },
  {
    "id": 7,
    "type": "reading",
    "passage": "The School Garden\n\nMr. Brown and his class started a school garden behind the library. First, they cleared the ground and pulled up weeds. Next, they dug small holes in the soil.\n\nThe students planted tomato seeds, callaloo, and sweet pepper. Every day, two students watered the plants before morning assembly. After a few weeks, the garden became green and healthy.\n\nOne Friday, the class picked the first ripe tomatoes. They were proud because their hard work had paid off.",
    "question": "What did the students do first?",
    "options": [
      "Water the plants",
      "Pick tomatoes",
      "Clear the ground",
      "Buy seeds"
    ],
    "correctAnswer": 2,
    "explanation": "The passage says first they cleared the ground and pulled up weeds."
  },
  {
    "id": 8,
    "type": "reading",
    "passage": "The School Garden\n\nMr. Brown and his class started a school garden behind the library. First, they cleared the ground and pulled up weeds. Next, they dug small holes in the soil.\n\nThe students planted tomato seeds, callaloo, and sweet pepper. Every day, two students watered the plants before morning assembly. After a few weeks, the garden became green and healthy.\n\nOne Friday, the class picked the first ripe tomatoes. They were proud because their hard work had paid off.",
    "question": "When were the plants watered?",
    "options": [
      "After lunch",
      "Before morning assembly",
      "Only on Fridays",
      "At home"
    ],
    "correctAnswer": 1,
    "explanation": "The passage states that two students watered the plants before morning assembly."
  },
  {
    "id": 9,
    "type": "reading",
    "passage": "The School Garden\n\nMr. Brown and his class started a school garden behind the library. First, they cleared the ground and pulled up weeds. Next, they dug small holes in the soil.\n\nThe students planted tomato seeds, callaloo, and sweet pepper. Every day, two students watered the plants before morning assembly. After a few weeks, the garden became green and healthy.\n\nOne Friday, the class picked the first ripe tomatoes. They were proud because their hard work had paid off.",
    "question": "How did the class feel when they picked the tomatoes?",
    "options": [
      "Tired",
      "Proud",
      "Angry",
      "Sleepy"
    ],
    "correctAnswer": 1,
    "explanation": "The passage says they were proud because their hard work had paid off."
  },
  {
    "id": 10,
    "type": "reading",
    "passage": "The School Garden\n\nMr. Brown and his class started a school garden behind the library. First, they cleared the ground and pulled up weeds. Next, they dug small holes in the soil.\n\nThe students planted tomato seeds, callaloo, and sweet pepper. Every day, two students watered the plants before morning assembly. After a few weeks, the garden became green and healthy.\n\nOne Friday, the class picked the first ripe tomatoes. They were proud because their hard work had paid off.",
    "question": "What is the best title for the passage?",
    "options": [
      "A Rainy Morning",
      "The School Garden",
      "Buying Vegetables",
      "A Trip to Town"
    ],
    "correctAnswer": 1,
    "explanation": "The whole passage is about the class starting and caring for a school garden."
  },
  {
    "id": 11,
    "type": "vocabulary",
    "question": "Which word means the same as 'happy'?",
    "options": [
      "Sad",
      "Glad",
      "Angry",
      "Weak"
    ],
    "correctAnswer": 1,
    "explanation": "'Glad' means the same as happy."
  },
  {
    "id": 12,
    "type": "vocabulary",
    "question": "What is the opposite of 'begin'?",
    "options": [
      "Start",
      "Open",
      "Finish",
      "Move"
    ],
    "correctAnswer": 2,
    "explanation": "The opposite of 'begin' is 'finish'."
  },
  {
    "id": 13,
    "type": "vocabulary",
    "question": "Which word means the same as 'tiny'?",
    "options": [
      "Small",
      "Tall",
      "Heavy",
      "Wide"
    ],
    "correctAnswer": 0,
    "explanation": "'Tiny' means very small."
  },
  {
    "id": 14,
    "type": "vocabulary",
    "question": "In the sentence 'The soup was warm,' what does 'warm' mean?",
    "options": [
      "A little hot",
      "Very cold",
      "Very loud",
      "Very sweet"
    ],
    "correctAnswer": 0,
    "explanation": "'Warm' means a little hot, but not too hot."
  },
  {
    "id": 15,
    "type": "vocabulary",
    "question": "Which word is the opposite of 'clean'?",
    "options": [
      "Fresh",
      "Dirty",
      "Dry",
      "Bright"
    ],
    "correctAnswer": 1,
    "explanation": "The opposite of clean is dirty."
  },
  {
    "id": 16,
    "type": "vocabulary",
    "question": "Which word means the same as 'quick'?",
    "options": [
      "Fast",
      "Slow",
      "Late",
      "Soft"
    ],
    "correctAnswer": 0,
    "explanation": "'Fast' means the same as quick."
  },
  {
    "id": 17,
    "type": "vocabulary",
    "question": "What does 'silent' mean?",
    "options": [
      "Noisy",
      "Quiet",
      "Busy",
      "Funny"
    ],
    "correctAnswer": 1,
    "explanation": "'Silent' means quiet or making no sound."
  },
  {
    "id": 18,
    "type": "vocabulary",
    "question": "Which word is the opposite of 'before'?",
    "options": [
      "Earlier",
      "After",
      "Soon",
      "Again"
    ],
    "correctAnswer": 1,
    "explanation": "The opposite of 'before' is 'after'."
  },
  {
    "id": 19,
    "type": "vocabulary",
    "question": "Which word means the same as 'gift'?",
    "options": [
      "Present",
      "Table",
      "Bottle",
      "Letter"
    ],
    "correctAnswer": 0,
    "explanation": "A gift is also called a present."
  },
  {
    "id": 20,
    "type": "vocabulary",
    "question": "In the sentence 'The path was narrow,' what does 'narrow' mean?",
    "options": [
      "Very long",
      "Not wide",
      "Very smooth",
      "Not safe"
    ],
    "correctAnswer": 1,
    "explanation": "'Narrow' means not wide."
  },
  {
    "id": 21,
    "type": "grammar",
    "question": "Choose the correct verb: 'The boys _____ running on the field.'",
    "options": [
      "is",
      "are",
      "was",
      "am"
    ],
    "correctAnswer": 1,
    "explanation": "'Boys' is plural, so the correct verb is 'are'."
  },
  {
    "id": 22,
    "type": "grammar",
    "question": "Which sentence is correct?",
    "options": [
      "She walk to school.",
      "She walks to school.",
      "She walking to school.",
      "She walkeds to school."
    ],
    "correctAnswer": 1,
    "explanation": "For one person in the present tense, we use 'walks'."
  },
  {
    "id": 23,
    "type": "grammar",
    "question": "Choose the correct pronoun: 'Dad gave the ball to _____.",
    "options": [
      "I",
      "me",
      "my",
      "mine"
    ],
    "correctAnswer": 1,
    "explanation": "'Me' is the correct object pronoun after 'to'."
  },
  {
    "id": 24,
    "type": "grammar",
    "question": "Which word is a noun in this sentence: 'The puppy barked loudly.'",
    "options": [
      "The",
      "puppy",
      "barked",
      "loudly"
    ],
    "correctAnswer": 1,
    "explanation": "'Puppy' is a noun because it names an animal."
  },
  {
    "id": 25,
    "type": "grammar",
    "question": "Choose the correct past tense: 'Yesterday, we _____ mangoes.'",
    "options": [
      "pick",
      "picks",
      "picked",
      "picking"
    ],
    "correctAnswer": 2,
    "explanation": "'Picked' is the past tense and matches the word 'Yesterday'."
  },
  {
    "id": 26,
    "type": "grammar",
    "question": "Which word is an adjective in the sentence 'The red kite flew high'?",
    "options": [
      "red",
      "kite",
      "flew",
      "high"
    ],
    "correctAnswer": 0,
    "explanation": "'Red' is an adjective because it describes the kite."
  },
  {
    "id": 27,
    "type": "grammar",
    "question": "Choose the correct plural form of 'box'.",
    "options": [
      "boxs",
      "boxes",
      "boxies",
      "boxen"
    ],
    "correctAnswer": 1,
    "explanation": "The plural of box is boxes."
  },
  {
    "id": 28,
    "type": "grammar",
    "question": "Which sentence is a question?",
    "options": [
      "Please sit down.",
      "Where is my bag?",
      "The cat is sleeping.",
      "What a bright day!"
    ],
    "correctAnswer": 1,
    "explanation": "A question asks something and ends with a question mark."
  },
  {
    "id": 29,
    "type": "grammar",
    "question": "Choose the correct article: 'I saw _____ owl in the tree.'",
    "options": [
      "a",
      "an",
      "the an",
      "a an"
    ],
    "correctAnswer": 1,
    "explanation": "Use 'an' before words beginning with a vowel sound, like owl."
  },
  {
    "id": 30,
    "type": "grammar",
    "question": "Which sentence uses the correct pronoun?",
    "options": [
      "Her is my friend.",
      "Him is my friend.",
      "She is my friend.",
      "Them is my friend."
    ],
    "correctAnswer": 2,
    "explanation": "'She' is the correct subject pronoun."
  },
  {
    "id": 31,
    "type": "grammar",
    "question": "Which word is a verb in the sentence 'Birds sing at dawn'?",
    "options": [
      "Birds",
      "sing",
      "at",
      "dawn"
    ],
    "correctAnswer": 1,
    "explanation": "'Sing' is the verb because it shows the action."
  },
  {
    "id": 32,
    "type": "grammar",
    "question": "Choose the correct sentence.",
    "options": [
      "The child are hungry.",
      "The child is hungry.",
      "The child am hungry.",
      "The child be hungry."
    ],
    "correctAnswer": 1,
    "explanation": "'Child' is singular, so the correct verb is 'is'."
  },
  {
    "id": 33,
    "type": "writing",
    "question": "Which word should begin with a capital letter? 'We visited montego bay.'",
    "options": [
      "visited",
      "montego",
      "bay",
      "we"
    ],
    "correctAnswer": 1,
    "explanation": "'Montego' is part of a place name, so it should begin with a capital letter."
  },
  {
    "id": 34,
    "type": "writing",
    "question": "Choose the correctly punctuated sentence.",
    "options": [
      "I like bananas",
      "I like bananas.",
      "i like bananas.",
      "I like bananas,"
    ],
    "correctAnswer": 1,
    "explanation": "A complete sentence begins with a capital letter and ends with a full stop."
  },
  {
    "id": 35,
    "type": "writing",
    "question": "Which is the correct spelling?",
    "options": [
      "becaus",
      "becose",
      "because",
      "beecaus"
    ],
    "correctAnswer": 2,
    "explanation": "The correct spelling is 'because'."
  },
  {
    "id": 36,
    "type": "writing",
    "question": "Which sentence is complete?",
    "options": [
      "After the rain.",
      "The little dog barked.",
      "Running in the yard.",
      "Because she was late."
    ],
    "correctAnswer": 1,
    "explanation": "A complete sentence needs a subject and a verb. 'The little dog barked.' has both."
  },
  {
    "id": 37,
    "type": "writing",
    "question": "What punctuation mark should end this sentence? 'Watch out'",
    "options": [
      ".",
      "?",
      "!",
      ","
    ],
    "correctAnswer": 2,
    "explanation": "'Watch out' shows urgency, so it should end with an exclamation mark."
  },
  {
    "id": 38,
    "type": "writing",
    "question": "Choose the correct contraction for 'do not'.",
    "options": [
      "dont",
      "do'nt",
      "don't",
      "d'ont"
    ],
    "correctAnswer": 2,
    "explanation": "The correct contraction for 'do not' is 'don't'."
  },
  {
    "id": 39,
    "type": "writing",
    "question": "Which sentence uses quotation marks correctly?",
    "options": [
      "\"Come in,\" said Mom.",
      "Come in, said Mom.",
      "\"Come in, said Mom.\"",
      "Come in,\" said Mom."
    ],
    "correctAnswer": 0,
    "explanation": "Quotation marks go around the exact words spoken, and the comma stays inside the closing quotation marks."
  },
  {
    "id": 40,
    "type": "writing",
    "question": "Choose the correct word to complete the sentence: 'The shoes are over _____.'",
    "options": [
      "their",
      "there",
      "they're",
      "thare"
    ],
    "correctAnswer": 1,
    "explanation": "'There' is used for a place. 'Their' shows ownership, and 'they're' means 'they are'."
  }
]

function getSectionLabel(type: Question["type"]) {
  switch (type) {
    case "reading":
      return "Reading"
    case "vocabulary":
      return "Vocabulary"
    case "grammar":
      return "Grammar"
    default:
      return "Writing"
  }
}

function getSectionFeedback(percent: number) {
  if (percent >= 85) return "Excellent"
  if (percent >= 70) return "Good"
  if (percent >= 50) return "Fair"
  return "Needs Improvement"
}

export default function LiteracyEasy1MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(50 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasyQuestions : literacyEasyQuestions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => {
    if (answers.length !== totalQuestions) {
      setAnswers(new Array(totalQuestions).fill(null))
    }
  }, [answers.length, totalQuestions])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCompletedAt(new Date().toLocaleString())
            setTestCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, testCompleted, timeRemaining])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (index < availableQuestions.length && answer === availableQuestions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const getScorePercentage = () => Math.round((calculateScore() / totalQuestions) * 100)

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const sectionSummaries = useMemo(() => {
    const sections: Question["type"][] = ["reading", "vocabulary", "grammar", "writing"]

    return sections.map((section) => {
      const sectionQuestions = availableQuestions.filter((q) => q.type === section)
      const correct = sectionQuestions.filter((q) => {
        const answerIndex = availableQuestions.findIndex((item) => item.id === q.id)
        return answers[answerIndex] === q.correctAnswer
      }).length
      const total = sectionQuestions.length
      const percent = total ? Math.round((correct / total) * 100) : 0

      return {
        label: getSectionLabel(section),
        correct,
        total,
        percent,
        feedback: getSectionFeedback(percent),
      }
    })
  }, [answers, availableQuestions])

  const handleSubmit = () => {
    setCompletedAt(new Date().toLocaleString())
    setTestCompleted(true)
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentQuestion(0)
    setAnswers(new Array(totalQuestions).fill(null))
    setTimeRemaining(isPremium ? 50 * 60 : 10 * 60)
    setShowReview(false)
    setCompletedAt("")
  }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== null).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/literacy" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Literacy Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center bg-sky-50 rounded-t-lg">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <BookOpen className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-sky-600">{totalQuestions}</p>
                  <p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-sky-600">{isPremium ? 50 : 10}</p>
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
                        You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question test and printable report.
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

              <div className="bg-sky-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-800 mb-2">Skills Covered:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>- Reading Comprehension (1–10)</li>
                  <li>- Vocabulary (11–20)</li>
                  <li>- Grammar (21–32)</li>
                  <li>- Writing Conventions (33–40)</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">What makes this easy?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>- Shorter passages</li>
                  <li>- Clear text clues</li>
                  <li>- Direct recall and sequencing</li>
                  <li>- Simpler answer choices</li>
                </ul>
              </div>

              <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">
                Start Test
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (testCompleted && !showReview) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-sky-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image
                  src="/images/shazoniques-inspiration-logo.png"
                  alt="Shazonique's Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 1</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-sky-600">{score}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-sky-600">{percentage}%</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className={`text-2xl font-bold ${color}`}>{grade}</p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    This easy-level literacy report includes section summaries and a full question-by-question review with explanations.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {sectionSummaries.map((section) => (
                      <div key={section.label} className="rounded-lg border border-sky-100 bg-white p-4">
                        <p className="font-semibold text-slate-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct · {section.percent}%</p>
                        <p className="text-sm font-medium text-sky-700 mt-1">{section.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-slate-700 hover:bg-slate-800">
                    Review Answers & Report
                  </Button>
                  <Button onClick={restartTest} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Test Again
                  </Button>
                  <Link href="/mock-tests/literacy">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Literacy Mock Tests
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
    const score = calculateScore()
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <style jsx global>{`
          @media print {
            header,
            footer,
            .no-print {
              display: none !important;
            }

            body {
              background: #ffffff !important;
            }

            .report-sheet {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm">
                    <Image
                      src="/images/shazoniques-inspiration-logo.png"
                      alt="Shazonique's Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 1 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Student: <span className="font-medium">{user?.childName ?? "Student"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-sky-700">{score}/{totalQuestions}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-sky-700">{percentage}%</p>
                    <p className="text-xs text-slate-600">Percent</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className={`text-lg font-bold ${color}`}>{grade}</p>
                    <p className="text-xs text-slate-600">Performance</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700 mb-4">
                  This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sectionSummaries.map((section) => (
                    <div key={section.label} className="rounded-lg border border-sky-100 bg-white p-4">
                      <p className="font-semibold text-slate-800">{section.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.correct}/{section.total} correct</p>
                      <p className="text-sm text-slate-600">{section.percent}%</p>
                      <p className="text-sm font-medium text-sky-700 mt-1">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "p-5 rounded-xl border-2",
                        isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}

                        <div className="flex-1">
                          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700 mb-2">{getSectionLabel(q.type)}</p>
                          <p className="font-semibold text-slate-800 mb-2">Question {index + 1}</p>
                          <p className="text-slate-800 mb-3">{q.question}</p>

                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700">
                              <span className="font-medium">Student&apos;s Answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {answers[index] !== null ? q.options[answers[index]!] : "Not answered"}
                              </span>
                            </p>
                            <p className="text-green-700">
                              <span className="font-medium">Correct Answer:</span> {q.options[q.correctAnswer]}
                            </p>
                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">
                Managed by Shazonique&apos;s Inspiration · A heart&apos;s home of hope
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print max-w-5xl mx-auto">
            <Button onClick={() => window.print()} className="flex-1 bg-slate-700 hover:bg-slate-800">
              <Printer className="h-4 w-4 mr-2" />
              Download / Print Report
            </Button>
            <Button onClick={restartTest} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Test Again
            </Button>
            <Link href="/mock-tests/literacy" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Literacy Mock Tests
              </Button>
            </Link>
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
              <Link href="/mock-tests/literacy" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Literacy Easy 1</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
                timeRemaining <= 300 ? "bg-red-500" : "bg-green-600"
              )}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {answeredCount}/{totalQuestions} answered</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}% complete</span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="bg-sky-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-700 uppercase">{getSectionLabel(question.type)}</span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Read the passage:</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">{question.passage}</p>
                </div>
              )}

              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all",
                      answers[currentQuestion] === index
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-sky-50/50"
                    )}
                  >
                    <span className="font-medium text-emerald-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestion === totalQuestions - 1 ? (
              <Button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800">
                <Flag className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-slate-700 hover:bg-slate-800">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          <Card className="mt-6">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={cn(
                      "w-8 h-8 rounded text-sm font-medium transition-colors",
                      currentQuestion === index
                        ? "bg-slate-700 text-white"
                        : answers[index] !== null
                        ? "bg-sky-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
