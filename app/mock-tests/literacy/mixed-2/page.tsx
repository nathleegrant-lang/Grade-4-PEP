"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, BookOpen, RotateCcw, Home, Lock, Crown, ArrowLeft, Printer } from "lucide-react"
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

const literacyQuestions: Question[] = [
  // Reading Comprehension Questions (1-10) - Passage 1
  {
    id: 1,
    type: "reading",
    passage: `The Doctor Bird

The doctor bird is Jamaica's national bird. It is also called the swallow-tail hummingbird because of its long, beautiful tail feathers. The male doctor bird has bright green and black feathers with a red bill. Its two long tail feathers can be up to 15 centimeters long!

Doctor birds are very small. They weigh only about 5 grams, which is lighter than a pencil! Despite their tiny size, they are amazing flyers. They can fly forwards, backwards, and even upside down. They beat their wings about 80 times per second, which makes a humming sound.

These birds love to drink nectar from flowers. They use their long bills to reach deep inside hibiscus and other tropical flowers. While they drink, they help spread pollen from flower to flower, which helps new plants grow.

You can find doctor birds all across Jamaica, from the Blue Mountains to the coastal areas. They are most active in the morning when they search for food. Jamaicans are very proud of this beautiful bird, which is why it appears on Jamaican money and stamps.`,
    question: "What is another name for the doctor bird?",
    options: ["Blue mountain bird", "Swallow-tail hummingbird", "Red-billed parrot", "Jamaican finch"],
    correctAnswer: 1,
    explanation: "The passage states that the doctor bird is 'also called the swallow-tail hummingbird because of its long, beautiful tail feathers.'"
  },
  {
    id: 2,
    type: "reading",
    passage: `The Doctor Bird

The doctor bird is Jamaica's national bird. It is also called the swallow-tail hummingbird because of its long, beautiful tail feathers. The male doctor bird has bright green and black feathers with a red bill. Its two long tail feathers can be up to 15 centimeters long!

Doctor birds are very small. They weigh only about 5 grams, which is lighter than a pencil! Despite their tiny size, they are amazing flyers. They can fly forwards, backwards, and even upside down. They beat their wings about 80 times per second, which makes a humming sound.

These birds love to drink nectar from flowers. They use their long bills to reach deep inside hibiscus and other tropical flowers. While they drink, they help spread pollen from flower to flower, which helps new plants grow.

You can find doctor birds all across Jamaica, from the Blue Mountains to the coastal areas. They are most active in the morning when they search for food. Jamaicans are very proud of this beautiful bird, which is why it appears on Jamaican money and stamps.`,
    question: "How much does a doctor bird weigh?",
    options: ["About 15 grams", "About 80 grams", "About 5 grams", "About 10 grams"],
    correctAnswer: 2,
    explanation: "The passage clearly states that doctor birds 'weigh only about 5 grams, which is lighter than a pencil!'"
  },
  {
    id: 3,
    type: "reading",
    passage: `The Doctor Bird

The doctor bird is Jamaica's national bird. It is also called the swallow-tail hummingbird because of its long, beautiful tail feathers. The male doctor bird has bright green and black feathers with a red bill. Its two long tail feathers can be up to 15 centimeters long!

Doctor birds are very small. They weigh only about 5 grams, which is lighter than a pencil! Despite their tiny size, they are amazing flyers. They can fly forwards, backwards, and even upside down. They beat their wings about 80 times per second, which makes a humming sound.

These birds love to drink nectar from flowers. They use their long bills to reach deep inside hibiscus and other tropical flowers. While they drink, they help spread pollen from flower to flower, which helps new plants grow.

You can find doctor birds all across Jamaica, from the Blue Mountains to the coastal areas. They are most active in the morning when they search for food. Jamaicans are very proud of this beautiful bird, which is why it appears on Jamaican money and stamps.`,
    question: "What do doctor birds help spread from flower to flower?",
    options: ["Seeds", "Water", "Pollen", "Leaves"],
    correctAnswer: 2,
    explanation: "The passage explains that 'While they drink, they help spread pollen from flower to flower, which helps new plants grow.'"
  },
  {
    id: 4,
    type: "reading",
    passage: `The Doctor Bird

The doctor bird is Jamaica's national bird. It is also called the swallow-tail hummingbird because of its long, beautiful tail feathers. The male doctor bird has bright green and black feathers with a red bill. Its two long tail feathers can be up to 15 centimeters long!

Doctor birds are very small. They weigh only about 5 grams, which is lighter than a pencil! Despite their tiny size, they are amazing flyers. They can fly forwards, backwards, and even upside down. They beat their wings about 80 times per second, which makes a humming sound.

These birds love to drink nectar from flowers. They use their long bills to reach deep inside hibiscus and other tropical flowers. While they drink, they help spread pollen from flower to flower, which helps new plants grow.

You can find doctor birds all across Jamaica, from the Blue Mountains to the coastal areas. They are most active in the morning when they search for food. Jamaicans are very proud of this beautiful bird, which is why it appears on Jamaican money and stamps.`,
    question: "When are doctor birds most active?",
    options: ["At night", "In the afternoon", "In the morning", "At sunset"],
    correctAnswer: 2,
    explanation: "According to the passage, 'They are most active in the morning when they search for food.'"
  },
  {
    id: 5,
    type: "reading",
    passage: `The Doctor Bird

The doctor bird is Jamaica's national bird. It is also called the swallow-tail hummingbird because of its long, beautiful tail feathers. The male doctor bird has bright green and black feathers with a red bill. Its two long tail feathers can be up to 15 centimeters long!

Doctor birds are very small. They weigh only about 5 grams, which is lighter than a pencil! Despite their tiny size, they are amazing flyers. They can fly forwards, backwards, and even upside down. They beat their wings about 80 times per second, which makes a humming sound.

These birds love to drink nectar from flowers. They use their long bills to reach deep inside hibiscus and other tropical flowers. While they drink, they help spread pollen from flower to flower, which helps new plants grow.

You can find doctor birds all across Jamaica, from the Blue Mountains to the coastal areas. They are most active in the morning when they search for food. Jamaicans are very proud of this beautiful bird, which is why it appears on Jamaican money and stamps.`,
    question: "Why does the doctor bird make a humming sound?",
    options: ["Because it sings", "Because it beats its wings very fast", "Because it calls to other birds", "Because of the wind"],
    correctAnswer: 1,
    explanation: "The passage states that 'They beat their wings about 80 times per second, which makes a humming sound.'"
  },
  // Reading Comprehension Questions (6-10) - Passage 2
  {
    id: 6,
    type: "reading",
    passage: `Market Day in Jamaica

Every Saturday morning, Miss Ivy walks to the local market in her village. She carries a large basket on her head, filled with fresh vegetables from her garden. Miss Ivy grows callaloo, tomatoes, peppers, and sweet potatoes.

The market is a lively place. Vendors call out to customers, announcing their goods. "Fresh fish! Catch dis morning!" shouts the fisherman. "Ripe mangoes! Sweet like sugar!" calls another vendor. The air is filled with the smell of spices, fruits, and freshly baked bammy.

Miss Ivy sets up her stall under a large ackee tree. She arranges her vegetables neatly on a wooden table. Her tomatoes are the reddest in the market, and everyone knows her callaloo is the best. Soon, customers begin to gather around her stall.

By noon, Miss Ivy's basket is empty. She uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter. Then she walks home, already planning what to plant for next week's market.`,
    question: "What does Miss Ivy carry to the market?",
    options: ["A bag of fish", "A basket of vegetables", "A box of spices", "A tray of bammy"],
    correctAnswer: 1,
    explanation: "The passage states that 'She carries a large basket on her head, filled with fresh vegetables from her garden.'"
  },
  {
    id: 7,
    type: "reading",
    passage: `Market Day in Jamaica

Every Saturday morning, Miss Ivy walks to the local market in her village. She carries a large basket on her head, filled with fresh vegetables from her garden. Miss Ivy grows callaloo, tomatoes, peppers, and sweet potatoes.

The market is a lively place. Vendors call out to customers, announcing their goods. "Fresh fish! Catch dis morning!" shouts the fisherman. "Ripe mangoes! Sweet like sugar!" calls another vendor. The air is filled with the smell of spices, fruits, and freshly baked bammy.

Miss Ivy sets up her stall under a large ackee tree. She arranges her vegetables neatly on a wooden table. Her tomatoes are the reddest in the market, and everyone knows her callaloo is the best. Soon, customers begin to gather around her stall.

By noon, Miss Ivy's basket is empty. She uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter. Then she walks home, already planning what to plant for next week's market.`,
    question: "Where does Miss Ivy set up her stall?",
    options: ["Under a mango tree", "Under an ackee tree", "Under a coconut tree", "Inside a building"],
    correctAnswer: 1,
    explanation: "The passage clearly states that 'Miss Ivy sets up her stall under a large ackee tree.'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Market Day in Jamaica

Every Saturday morning, Miss Ivy walks to the local market in her village. She carries a large basket on her head, filled with fresh vegetables from her garden. Miss Ivy grows callaloo, tomatoes, peppers, and sweet potatoes.

The market is a lively place. Vendors call out to customers, announcing their goods. "Fresh fish! Catch dis morning!" shouts the fisherman. "Ripe mangoes! Sweet like sugar!" calls another vendor. The air is filled with the smell of spices, fruits, and freshly baked bammy.

Miss Ivy sets up her stall under a large ackee tree. She arranges her vegetables neatly on a wooden table. Her tomatoes are the reddest in the market, and everyone knows her callaloo is the best. Soon, customers begin to gather around her stall.

By noon, Miss Ivy's basket is empty. She uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter. Then she walks home, already planning what to plant for next week's market.`,
    question: "What does Miss Ivy buy for her granddaughter?",
    options: ["A mango", "A doll", "A ribbon", "A dress"],
    correctAnswer: 2,
    explanation: "The passage states that Miss Ivy 'uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter.'"
  },
  {
    id: 9,
    type: "reading",
    passage: `Market Day in Jamaica

Every Saturday morning, Miss Ivy walks to the local market in her village. She carries a large basket on her head, filled with fresh vegetables from her garden. Miss Ivy grows callaloo, tomatoes, peppers, and sweet potatoes.

The market is a lively place. Vendors call out to customers, announcing their goods. "Fresh fish! Catch dis morning!" shouts the fisherman. "Ripe mangoes! Sweet like sugar!" calls another vendor. The air is filled with the smell of spices, fruits, and freshly baked bammy.

Miss Ivy sets up her stall under a large ackee tree. She arranges her vegetables neatly on a wooden table. Her tomatoes are the reddest in the market, and everyone knows her callaloo is the best. Soon, customers begin to gather around her stall.

By noon, Miss Ivy's basket is empty. She uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter. Then she walks home, already planning what to plant for next week's market.`,
    question: "The word 'lively' in the passage means:",
    options: ["Quiet and peaceful", "Full of energy and activity", "Dark and scary", "Empty and boring"],
    correctAnswer: 1,
    explanation: "The word 'lively' means full of energy and activity, as shown by the vendors calling out and the busy atmosphere described."
  },
  {
    id: 10,
    type: "reading",
    passage: `Market Day in Jamaica

Every Saturday morning, Miss Ivy walks to the local market in her village. She carries a large basket on her head, filled with fresh vegetables from her garden. Miss Ivy grows callaloo, tomatoes, peppers, and sweet potatoes.

The market is a lively place. Vendors call out to customers, announcing their goods. "Fresh fish! Catch dis morning!" shouts the fisherman. "Ripe mangoes! Sweet like sugar!" calls another vendor. The air is filled with the smell of spices, fruits, and freshly baked bammy.

Miss Ivy sets up her stall under a large ackee tree. She arranges her vegetables neatly on a wooden table. Her tomatoes are the reddest in the market, and everyone knows her callaloo is the best. Soon, customers begin to gather around her stall.

By noon, Miss Ivy's basket is empty. She uses the money she earned to buy fish for dinner and a new ribbon for her granddaughter. Then she walks home, already planning what to plant for next week's market.`,
    question: "What can you infer about Miss Ivy from the passage?",
    options: ["She is lazy and does not work hard", "She is hardworking and plans ahead", "She does not like going to the market", "She only sells fish"],
    correctAnswer: 1,
    explanation: "We can infer that Miss Ivy is hardworking because she grows her own vegetables, sells them, and is 'already planning what to plant for next week's market.'"
  },
  // Vocabulary Questions (11-20)
  {
    id: 11,
    type: "vocabulary",
    question: "Which word means the same as 'ancient'?",
    options: ["New", "Modern", "Very old", "Young"],
    correctAnswer: 2,
    explanation: "'Ancient' means very old, belonging to times long past."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "What is the opposite of 'generous'?",
    options: ["Kind", "Selfish", "Giving", "Helpful"],
    correctAnswer: 1,
    explanation: "The opposite of 'generous' (willing to give) is 'selfish' (caring only about oneself)."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "In the sentence 'The fierce storm damaged many houses,' what does 'fierce' mean?",
    options: ["Gentle", "Weak", "Violent and powerful", "Slow"],
    correctAnswer: 2,
    explanation: "'Fierce' means violent, powerful, or intense. A fierce storm would be very strong and dangerous."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word means the same as 'enormous'?",
    options: ["Tiny", "Small", "Huge", "Average"],
    correctAnswer: 2,
    explanation: "'Enormous' means very large or huge in size."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "What is the meaning of 'cautious'?",
    options: ["Careless", "Careful and alert", "Fast", "Brave"],
    correctAnswer: 1,
    explanation: "'Cautious' means being careful to avoid danger or mistakes."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is the opposite of 'brave'?",
    options: ["Courageous", "Fearless", "Cowardly", "Bold"],
    correctAnswer: 2,
    explanation: "The opposite of 'brave' (showing courage) is 'cowardly' (lacking courage)."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "In the sentence 'The delicious aroma filled the kitchen,' what does 'aroma' mean?",
    options: ["Sound", "Light", "Smell", "Taste"],
    correctAnswer: 2,
    explanation: "'Aroma' means a pleasant smell, especially from food or flowers."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word means the same as 'purchase'?",
    options: ["Sell", "Buy", "Give", "Throw"],
    correctAnswer: 1,
    explanation: "'Purchase' means to buy something."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "What does 'abundant' mean?",
    options: ["Scarce", "Few", "Plentiful", "Empty"],
    correctAnswer: 2,
    explanation: "'Abundant' means existing in large quantities; plentiful."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is the opposite of 'frequently'?",
    options: ["Often", "Always", "Rarely", "Usually"],
    correctAnswer: 2,
    explanation: "The opposite of 'frequently' (often) is 'rarely' (not often)."
  },
  // Grammar Questions (21-32)
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct verb: 'The children _____ playing in the schoolyard.'",
    options: ["is", "was", "are", "am"],
    correctAnswer: 2,
    explanation: "'Children' is a plural noun, so it needs the plural verb 'are'."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the correct punctuation?",
    options: ["where are you going.", "Where are you going?", "where are you going?", "Where are you going"],
    correctAnswer: 1,
    explanation: "A question should start with a capital letter and end with a question mark."
  },
  {
    id: 23,
    type: "grammar",
    question: "Choose the correct word: 'Sarah ran _____ than her brother.'",
    options: ["fast", "faster", "fastest", "more fast"],
    correctAnswer: 1,
    explanation: "When comparing two things, we use the comparative form 'faster'."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which word is a noun in this sentence: 'The beautiful butterfly flew away.'",
    options: ["beautiful", "flew", "butterfly", "away"],
    correctAnswer: 2,
    explanation: "'Butterfly' is a noun because it names a thing (an insect)."
  },
  {
    id: 25,
    type: "grammar",
    question: "Choose the correct pronoun: 'Maria gave the book to _____.'",
    options: ["I", "me", "my", "mine"],
    correctAnswer: 1,
    explanation: "'Me' is the object pronoun, which is correct after the preposition 'to'."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which sentence is correct?",
    options: ["Him went to school.", "He went to school.", "His went to school.", "Her went to school."],
    correctAnswer: 1,
    explanation: "'He' is the subject pronoun needed for the subject of the sentence."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct plural form: 'I saw three _____ in the garden.'",
    options: ["butterfly", "butterflys", "butterflies", "butterflyies"],
    correctAnswer: 2,
    explanation: "Words ending in consonant + y change the y to i and add -es: butterfly becomes butterflies."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which word is an adjective in this sentence: 'The tall boy won the race.'",
    options: ["The", "tall", "boy", "won"],
    correctAnswer: 1,
    explanation: "'Tall' is an adjective because it describes the noun 'boy'."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct past tense: 'Yesterday, I _____ to the market.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    explanation: "'Went' is the past tense of 'go'. The word 'Yesterday' tells us it happened in the past."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence needs a comma?",
    options: ["I like apples.", "Yes I am coming.", "The dog barked loudly.", "She ran fast."],
    correctAnswer: 1,
    explanation: "'Yes, I am coming.' needs a comma after 'Yes' because we use a comma after introductory words."
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the correct article: 'I saw _____ elephant at the zoo.'",
    options: ["a", "an", "the an", "a an"],
    correctAnswer: 1,
    explanation: "We use 'an' before words that begin with a vowel sound. 'Elephant' starts with the vowel 'e'."
  },
  {
    id: 32,
    type: "grammar",
    question: "Which word is a verb in this sentence: 'The bird sings beautifully.'",
    options: ["The", "bird", "sings", "beautifully"],
    correctAnswer: 2,
    explanation: "'Sings' is a verb because it shows an action that the bird is doing."
  },
  // Writing Conventions Questions (33-40)
  {
    id: 33,
    type: "writing",
    question: "Which word should be capitalized in this sentence: 'my family visited kingston last summer.'",
    options: ["my", "family", "kingston", "summer"],
    correctAnswer: 2,
    explanation: "'Kingston' should be capitalized because it is a proper noun (the name of a city)."
  },
  {
    id: 34,
    type: "writing",
    question: "Which is the correct way to begin a friendly letter?",
    options: ["dear Marcus,", "Dear Marcus,", "Dear marcus,", "dear marcus,"],
    correctAnswer: 1,
    explanation: "A friendly letter greeting should have 'Dear' capitalized, the person's name capitalized, and a comma at the end."
  },
  {
    id: 35,
    type: "writing",
    question: "Choose the correctly spelled word:",
    options: ["beutiful", "beautful", "beautiful", "beautifull"],
    correctAnswer: 2,
    explanation: "The correct spelling is 'beautiful' - b-e-a-u-t-i-f-u-l."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence is a complete sentence?",
    options: ["Running in the park.", "The happy dog.", "Because it was raining.", "The children played games."],
    correctAnswer: 3,
    explanation: "A complete sentence needs a subject (children) and a predicate (played games). The other options are fragments."
  },
  {
    id: 37,
    type: "writing",
    question: "What punctuation mark goes at the end of this sentence: 'What a wonderful day this is'",
    options: ["Period (.)", "Question mark (?)", "Exclamation mark (!)", "Comma (,)"],
    correctAnswer: 2,
    explanation: "This is an exclamatory sentence expressing strong emotion, so it needs an exclamation mark."
  },
  {
    id: 38,
    type: "writing",
    question: "Which sentence uses quotation marks correctly?",
    options: ["\"Come here,\" said Mother.", "Come here\", said Mother.\"", "\"Come here, said Mother.\"", "Come here, \"said Mother.\""],
    correctAnswer: 0,
    explanation: "Quotation marks go around the exact words someone said: \"Come here,\" The comma goes inside the quotation marks."
  },
  {
    id: 39,
    type: "writing",
    question: "Choose the word that correctly completes the sentence: 'The book is over _____.'",
    options: ["their", "there", "they're", "thier"],
    correctAnswer: 1,
    explanation: "'There' refers to a place. 'Their' shows possession, and 'they're' means 'they are'."
  },
  {
    id: 40,
    type: "writing",
    question: "Which is the correct contraction for 'cannot'?",
    options: ["can't", "can'ot", "cann't", "ca'nt"],
    correctAnswer: 0,
    explanation: "The correct contraction for 'cannot' is 'can't' - the apostrophe replaces the 'no'."
  }
]

export default function LiteracyMixed2MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  // Free users only get preview questions
  const availableQuestions = isPremium ? literacyQuestions : literacyQuestions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  // Initialize answers array based on available questions
  useEffect(() => {
    if (answers.length !== totalQuestions) {
      setAnswers(new Array(totalQuestions).fill(null))
    }
  }, [totalQuestions, answers.length])

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

  const getScorePercentage = () => {
    return Math.round((calculateScore() / totalQuestions) * 100)
  }

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getPerformanceNote = (percentage: number) => {
    if (percentage >= 85) return "Excellent understanding shown in this section."
    if (percentage >= 70) return "Good performance with only a few areas to review."
    if (percentage >= 50) return "Fair effort. More practice will build confidence."
    return "Needs more practice in this section."
  }

  const getSectionSummaries = () => {
    const sections = [
      {
        type: "reading" as const,
        title: "Reading",
        description: "Comprehension, main idea, inference, and details",
      },
      {
        type: "vocabulary" as const,
        title: "Vocabulary",
        description: "Word meaning, synonyms, antonyms, and usage",
      },
      {
        type: "grammar" as const,
        title: "Grammar",
        description: "Sentence structure, punctuation, and language rules",
      },
      {
        type: "writing" as const,
        title: "Writing",
        description: "Writing conventions, spelling, and expression",
      },
    ]

    return sections
      .map((section) => {
        let total = 0
        let correct = 0

        availableQuestions.forEach((currentQuestionItem, index) => {
          if (currentQuestionItem.type === section.type) {
            total += 1
            if (answers[index] === currentQuestionItem.correctAnswer) {
              correct += 1
            }
          }
        })

        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

        return {
          ...section,
          total,
          correct,
          percentage,
          note: getPerformanceNote(percentage),
        }
      })
      .filter((section) => section.total > 0)
  }

  const handleSubmit = () => {
    setCompletedAt(new Date().toLocaleString())
    setTestCompleted(true)
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentQuestion(0)
    setAnswers(new Array(totalQuestions).fill(null))
    setTimeRemaining(isPremium ? 60 * 60 : 10 * 60)
    setShowReview(false)
    setCompletedAt("")
  }

  const question = availableQuestions[currentQuestion]
  const answeredCount = answers.filter(a => a !== null).length

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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 2</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Mixed Practice</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-sky-600">{totalQuestions}</p>
                    <p className="text-sm text-gray-600">Questions {!isPremium && "(Preview)"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-sky-600">{isPremium ? 60 : 10}</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question test with the full report and detailed explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Test Sections:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Reading Comprehension (Questions 1-10)</li>
                    <li>- Vocabulary (Questions 11-20)</li>
                    <li>- Grammar (Questions 21-32)</li>
                    <li>- Writing Conventions (Questions 33-40)</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Select the best answer for each question.</li>
                    <li>- You can navigate between questions.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setTestStarted(true)} 
                  className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6"
                >
                  Start Test
                </Button>

                <Link href="/mock-tests/literacy">
                  <Button variant="outline" className="w-full">
                    Back to Literacy Mock Tests
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
    const percentage = getScorePercentage()
    const { grade, color } = getGrade()
    const sectionSummaries = getSectionSummaries()

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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 2</p>
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
                  <p className="text-sm text-slate-700">
                    This mixed-level literacy report includes section summaries and a full question-by-question review with explanations.
                    You can then print or save the full report as a PDF with the Shazonique&apos;s Inspiration logo.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Section Summary</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sectionSummaries.map((section) => (
                      <div key={section.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-800">{section.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{section.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-sky-700">{section.correct}/{section.total}</p>
                            <p className="text-xs text-slate-500">{section.percentage}%</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-3">{section.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowReview(true)}
                    className="w-full bg-slate-700 hover:bg-slate-800"
                  >
                    Review Answers & Report
                  </Button>
                  <Button
                    onClick={restartTest}
                    variant="outline"
                    className="w-full"
                  >
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
    const sectionSummaries = getSectionSummaries()

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
                    <p className="text-sm font-semibold text-slate-500">
                      Managed by Shazonique&apos;s Inspiration
                    </p>
                    <CardTitle className="text-2xl text-sky-800 mt-1">
                      Grade 4 PEP Literacy Mixed 2 Report
                    </CardTitle>
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
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result and a full question-by-question review,
                  including the student&apos;s answer, the correct answer, and an explanation for each item.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Section Summary</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {sectionSummaries.map((section) => (
                    <div key={section.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{section.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{section.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-sky-700">{section.correct}/{section.total}</p>
                          <p className="text-xs text-slate-500">{section.percentage}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3">{section.note}</p>
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {q.type === "reading"
                                ? "Reading"
                                : q.type === "vocabulary"
                                ? "Vocabulary"
                                : q.type === "grammar"
                                ? "Grammar"
                                : "Writing"}
                            </span>
                          </div>

                          <p className="text-slate-800 mb-3">{q.question}</p>

                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700">
                              <span className="font-medium">Student&apos;s Answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {answers[index] !== null ? q.options[answers[index]!] : "Not answered"}
                              </span>
                            </p>

                            <p className="text-green-700">
                              <span className="font-medium">Correct Answer:</span>{" "}
                              {q.options[q.correctAnswer]}
                            </p>

                            <p className="text-slate-700 mt-2">
                              <span className="font-medium">Explanation:</span>{" "}
                              {q.explanation}
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
      {/* Header with Timer */}
      <header className="bg-slate-800 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/mock-tests/literacy" 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit Test"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Literacy Mixed 2</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
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

      {/* Progress Bar */}
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
          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader className="bg-sky-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-700 uppercase">
                  {question.type === "reading" ? "Reading Comprehension" : 
                   question.type === "vocabulary" ? "Vocabulary" :
                   question.type === "grammar" ? "Grammar" : "Writing Conventions"}
                </span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Passage for reading questions */}
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Read the passage:</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                    {question.passage}
                  </p>
                </div>
              )}

              {/* Question */}
              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>

              {/* Options */}
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
                    <span className="font-medium text-emerald-700 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
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
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-slate-700"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-sky-100"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-100"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
