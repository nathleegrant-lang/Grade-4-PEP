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
  // Reading Comprehension Questions (1-10)
  {
    id: 1,
    type: "reading",
    passage: `The School Garden Project

Room 4 at Sunrise Primary started a school garden in September. At first, the students were excited because they imagined bright flowers and baskets of vegetables. However, after the first week, some students realized that gardening was harder than they thought.

Every Tuesday afternoon, the class watered the beds, pulled weeds, and checked the young plants. The teacher, Miss Lewis, showed them how to loosen the soil carefully so the roots could spread. She also reminded them that plants do not grow overnight.

By October, little green shoots began to appear. Janelle noticed the callaloo first. Omar was proud of the carrots because he had measured the rows himself. Even the students who had complained in September began to look closely for new leaves and tiny buds.

In November, the class picked their first vegetables. They did not harvest a huge amount, but everyone agreed that the garden had taught them patience, teamwork, and responsibility.`,
    question: "Why did some students change their minds after the first week?",
    options: [
      "They did not like Miss Lewis",
      "They saw that gardening took real effort",
      "The garden was too small",
      "The vegetables were already finished"
    ],
    correctAnswer: 1,
    explanation: "The passage says some students realized gardening was harder than they thought, which means they saw that it required real effort."
  },
  {
    id: 2,
    type: "reading",
    passage: `The School Garden Project

Room 4 at Sunrise Primary started a school garden in September. At first, the students were excited because they imagined bright flowers and baskets of vegetables. However, after the first week, some students realized that gardening was harder than they thought.

Every Tuesday afternoon, the class watered the beds, pulled weeds, and checked the young plants. The teacher, Miss Lewis, showed them how to loosen the soil carefully so the roots could spread. She also reminded them that plants do not grow overnight.

By October, little green shoots began to appear. Janelle noticed the callaloo first. Omar was proud of the carrots because he had measured the rows himself. Even the students who had complained in September began to look closely for new leaves and tiny buds.

In November, the class picked their first vegetables. They did not harvest a huge amount, but everyone agreed that the garden had taught them patience, teamwork, and responsibility.`,
    question: "Which detail best shows that the class became more interested in the garden over time?",
    options: [
      "They worked only on Tuesdays",
      "Miss Lewis loosened the soil",
      "Students began watching closely for leaves and buds",
      "They imagined bright flowers"
    ],
    correctAnswer: 2,
    explanation: "The detail about students watching closely for leaves and buds shows that their interest grew over time."
  },
  {
    id: 3,
    type: "reading",
    passage: `The School Garden Project

Room 4 at Sunrise Primary started a school garden in September. At first, the students were excited because they imagined bright flowers and baskets of vegetables. However, after the first week, some students realized that gardening was harder than they thought.

Every Tuesday afternoon, the class watered the beds, pulled weeds, and checked the young plants. The teacher, Miss Lewis, showed them how to loosen the soil carefully so the roots could spread. She also reminded them that plants do not grow overnight.

By October, little green shoots began to appear. Janelle noticed the callaloo first. Omar was proud of the carrots because he had measured the rows himself. Even the students who had complained in September began to look closely for new leaves and tiny buds.

In November, the class picked their first vegetables. They did not harvest a huge amount, but everyone agreed that the garden had taught them patience, teamwork, and responsibility.`,
    question: "What is the main idea of the passage?",
    options: [
      "Carrots grow faster than callaloo",
      "A class garden helped students learn important lessons",
      "Miss Lewis was the best gardening teacher",
      "School gardens always produce huge harvests"
    ],
    correctAnswer: 1,
    explanation: "The passage mainly shows that the school garden taught students patience, teamwork, and responsibility."
  },
  {
    id: 4,
    type: "reading",
    passage: `The School Garden Project

Room 4 at Sunrise Primary started a school garden in September. At first, the students were excited because they imagined bright flowers and baskets of vegetables. However, after the first week, some students realized that gardening was harder than they thought.

Every Tuesday afternoon, the class watered the beds, pulled weeds, and checked the young plants. The teacher, Miss Lewis, showed them how to loosen the soil carefully so the roots could spread. She also reminded them that plants do not grow overnight.

By October, little green shoots began to appear. Janelle noticed the callaloo first. Omar was proud of the carrots because he had measured the rows himself. Even the students who had complained in September began to look closely for new leaves and tiny buds.

In November, the class picked their first vegetables. They did not harvest a huge amount, but everyone agreed that the garden had taught them patience, teamwork, and responsibility.`,
    question: "Why did Miss Lewis remind the class that plants do not grow overnight?",
    options: [
      "To encourage patience",
      "To make them hurry",
      "To stop them from watering",
      "To make them plant flowers instead"
    ],
    correctAnswer: 0,
    explanation: "Miss Lewis wanted the class to understand that growth takes time, so they needed patience."
  },
  {
    id: 5,
    type: "reading",
    passage: `The School Garden Project

Room 4 at Sunrise Primary started a school garden in September. At first, the students were excited because they imagined bright flowers and baskets of vegetables. However, after the first week, some students realized that gardening was harder than they thought.

Every Tuesday afternoon, the class watered the beds, pulled weeds, and checked the young plants. The teacher, Miss Lewis, showed them how to loosen the soil carefully so the roots could spread. She also reminded them that plants do not grow overnight.

By October, little green shoots began to appear. Janelle noticed the callaloo first. Omar was proud of the carrots because he had measured the rows himself. Even the students who had complained in September began to look closely for new leaves and tiny buds.

In November, the class picked their first vegetables. They did not harvest a huge amount, but everyone agreed that the garden had taught them patience, teamwork, and responsibility.`,
    question: "The word 'harvest' most nearly means:",
    options: ["throw away", "collect when grown", "hide from others", "buy from a shop"],
    correctAnswer: 1,
    explanation: "In the passage, 'harvest' means collecting vegetables when they are ready."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Rainy-Day Library

One rainy lunchtime, the students at Cedar Grove Primary could not play outside. Instead of complaining, the principal opened the old reading room near the office. Many students had passed that room before, but very few had ever gone inside.

The room was not large, yet it felt special. Tall shelves reached almost to the ceiling, and the windows let in soft gray light. There were books about animals, heroes, planets, inventors, and folktales. A faded rug lay in the middle of the floor, and two rocking chairs stood near the corner.

At first, the children wandered around quietly, unsure of what to choose. Then Malik found a book about hurricanes and called his friends over. Soon, every table was taken. Some students read silently, while others whispered excitedly about their discoveries.

When the bell rang, several children groaned. The principal smiled and said, "The reading room will be open every Wednesday at lunch." By the following week, a line had already formed outside the door.`,
    question: "How did the students probably feel when the bell rang?",
    options: ["Relieved", "Disappointed", "Confused", "Angry"],
    correctAnswer: 1,
    explanation: "The students groaned when the bell rang, which suggests that they were disappointed the reading time ended."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Rainy-Day Library

One rainy lunchtime, the students at Cedar Grove Primary could not play outside. Instead of complaining, the principal opened the old reading room near the office. Many students had passed that room before, but very few had ever gone inside.

The room was not large, yet it felt special. Tall shelves reached almost to the ceiling, and the windows let in soft gray light. There were books about animals, heroes, planets, inventors, and folktales. A faded rug lay in the middle of the floor, and two rocking chairs stood near the corner.

At first, the children wandered around quietly, unsure of what to choose. Then Malik found a book about hurricanes and called his friends over. Soon, every table was taken. Some students read silently, while others whispered excitedly about their discoveries.

When the bell rang, several children groaned. The principal smiled and said, "The reading room will be open every Wednesday at lunch." By the following week, a line had already formed outside the door.`,
    question: "What does the line at the end of the passage suggest?",
    options: [
      "The students wanted to leave school early",
      "The reading room had become popular",
      "The children were waiting for lunch",
      "The principal was closing the room"
    ],
    correctAnswer: 1,
    explanation: "A line forming outside the reading room shows that many students now wanted to use it."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Rainy-Day Library

One rainy lunchtime, the students at Cedar Grove Primary could not play outside. Instead of complaining, the principal opened the old reading room near the office. Many students had passed that room before, but very few had ever gone inside.

The room was not large, yet it felt special. Tall shelves reached almost to the ceiling, and the windows let in soft gray light. There were books about animals, heroes, planets, inventors, and folktales. A faded rug lay in the middle of the floor, and two rocking chairs stood near the corner.

At first, the children wandered around quietly, unsure of what to choose. Then Malik found a book about hurricanes and called his friends over. Soon, every table was taken. Some students read silently, while others whispered excitedly about their discoveries.

When the bell rang, several children groaned. The principal smiled and said, "The reading room will be open every Wednesday at lunch." By the following week, a line had already formed outside the door.`,
    question: "Why does the writer describe the rug, shelves, and rocking chairs?",
    options: [
      "To show how messy the room was",
      "To help the reader imagine the room",
      "To prove the room was expensive",
      "To compare the room to a classroom"
    ],
    correctAnswer: 1,
    explanation: "These details help the reader picture the reading room clearly."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Rainy-Day Library

One rainy lunchtime, the students at Cedar Grove Primary could not play outside. Instead of complaining, the principal opened the old reading room near the office. Many students had passed that room before, but very few had ever gone inside.

The room was not large, yet it felt special. Tall shelves reached almost to the ceiling, and the windows let in soft gray light. There were books about animals, heroes, planets, inventors, and folktales. A faded rug lay in the middle of the floor, and two rocking chairs stood near the corner.

At first, the children wandered around quietly, unsure of what to choose. Then Malik found a book about hurricanes and called his friends over. Soon, every table was taken. Some students read silently, while others whispered excitedly about their discoveries.

When the bell rang, several children groaned. The principal smiled and said, "The reading room will be open every Wednesday at lunch." By the following week, a line had already formed outside the door.`,
    question: "Which sentence best states the author's purpose?",
    options: [
      "To persuade students to buy more books",
      "To describe how one school discovered a love of reading",
      "To explain how to build a library",
      "To warn students about rainy days"
    ],
    correctAnswer: 1,
    explanation: "The passage mainly shows how students discovered and enjoyed the reading room."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Rainy-Day Library

One rainy lunchtime, the students at Cedar Grove Primary could not play outside. Instead of complaining, the principal opened the old reading room near the office. Many students had passed that room before, but very few had ever gone inside.

The room was not large, yet it felt special. Tall shelves reached almost to the ceiling, and the windows let in soft gray light. There were books about animals, heroes, planets, inventors, and folktales. A faded rug lay in the middle of the floor, and two rocking chairs stood near the corner.

At first, the children wandered around quietly, unsure of what to choose. Then Malik found a book about hurricanes and called his friends over. Soon, every table was taken. Some students read silently, while others whispered excitedly about their discoveries.

When the bell rang, several children groaned. The principal smiled and said, "The reading room will be open every Wednesday at lunch." By the following week, a line had already formed outside the door.`,
    question: "Which word best describes the tone of this passage?",
    options: ["gloomy", "hopeful", "frightening", "angry"],
    correctAnswer: 1,
    explanation: "The passage has a hopeful tone because it shows students discovering something positive and exciting."
  },

  // Vocabulary Questions (11-20)
  {
    id: 11,
    type: "vocabulary",
    question: "Which word means nearly the same as 'careful'?",
    options: ["rude", "cautious", "noisy", "careless"],
    correctAnswer: 1,
    explanation: "'Cautious' means careful and alert."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "What is the opposite of 'ancient'?",
    options: ["modern", "famous", "broken", "quiet"],
    correctAnswer: 0,
    explanation: "The opposite of 'ancient' (very old) is 'modern'."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "In the sentence 'The narrow path curved around the hill,' what does 'narrow' mean?",
    options: ["very wide", "long and flat", "not wide", "hard to see"],
    correctAnswer: 2,
    explanation: "'Narrow' means not wide."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word best completes the sentence? 'The audience sat in _____ while the singer performed.'",
    options: ["silence", "anger", "dust", "haste"],
    correctAnswer: 0,
    explanation: "'Silence' fits because an audience may sit quietly while listening."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "Which pair of words are synonyms?",
    options: ["happy, joyful", "small, huge", "early, late", "sharp, dull"],
    correctAnswer: 0,
    explanation: "'Happy' and 'joyful' have similar meanings."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "What does 'generous' most likely mean?",
    options: ["willing to share", "easy to upset", "full of energy", "afraid of noise"],
    correctAnswer: 0,
    explanation: "'Generous' means willing to share or give."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "In the sentence 'The bright scarf stood out in the crowd,' what does 'stood out' mean?",
    options: ["fell down", "was noticed easily", "became smaller", "looked untidy"],
    correctAnswer: 1,
    explanation: "'Stood out' means it was noticed easily."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is the best antonym for 'rapid'?",
    options: ["fast", "slow", "quiet", "tidy"],
    correctAnswer: 1,
    explanation: "'Rapid' means fast, so its antonym is 'slow'."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "The word 'fragile' means:",
    options: ["easy to break", "easy to lift", "hard to clean", "hard to find"],
    correctAnswer: 0,
    explanation: "'Fragile' means delicate or easy to break."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which meaning of the word 'branch' is used in this sentence? 'The bird landed on a branch.'",
    options: ["a part of a tree", "a part of a bank", "a subject in school", "a road turning"],
    correctAnswer: 0,
    explanation: "Here, 'branch' means a part of a tree."
  },

  // Grammar Questions (21-32)
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct verb: 'The puppies _____ playing in the yard.'",
    options: ["is", "was", "are", "am"],
    correctAnswer: 2,
    explanation: "'Puppies' is plural, so it takes the plural verb 'are'."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence is punctuated correctly?",
    options: [
      "Where are you going.",
      "Where are you going?",
      "where are you going?",
      "Where are you going"
    ],
    correctAnswer: 1,
    explanation: "A question needs a capital letter and a question mark."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which word is a pronoun?",
    options: ["garden", "quickly", "they", "beautiful"],
    correctAnswer: 2,
    explanation: "'They' is a pronoun because it takes the place of a noun."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct past tense: 'Yesterday, we _____ to the beach.'",
    options: ["go", "went", "goes", "going"],
    correctAnswer: 1,
    explanation: "'Went' is the correct past tense of 'go'."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is complete?",
    options: [
      "Running across the field.",
      "Because it was raining.",
      "The children laughed loudly.",
      "Under the tall tree."
    ],
    correctAnswer: 2,
    explanation: "A complete sentence needs a subject and a predicate. 'The children laughed loudly.' has both."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word is an adjective in this sentence? 'The tiny kitten slept.'",
    options: ["tiny", "kitten", "slept", "the"],
    correctAnswer: 0,
    explanation: "'Tiny' is an adjective because it describes the kitten."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct article: 'I saw _____ owl in the tree.'",
    options: ["a", "an", "the a", "a an"],
    correctAnswer: 1,
    explanation: "We use 'an' before vowel sounds. 'Owl' begins with a vowel sound."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses the pronoun correctly?",
    options: [
      "Her and I played chess.",
      "She and I played chess.",
      "Me and her played chess.",
      "Him and I played chess."
    ],
    correctAnswer: 1,
    explanation: "'She and I' is the correct subject form."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the best revision: 'The class was tired they had worked hard.'",
    options: [
      "The class was tired. They had worked hard.",
      "The class was tired they. had worked hard.",
      "The class was tired, they had worked hard.",
      "The class was tired they had, worked hard."
    ],
    correctAnswer: 0,
    explanation: "This fixes the run-on sentence by making two complete sentences."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which word is a verb in this sentence? 'Birds build nests carefully.'",
    options: ["Birds", "build", "nests", "carefully"],
    correctAnswer: 1,
    explanation: "'Build' is a verb because it shows action."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence uses commas correctly?",
    options: [
      "After lunch we had art.",
      "After lunch, we had art.",
      "After, lunch we had art.",
      "After lunch we, had art."
    ],
    correctAnswer: 1,
    explanation: "A comma is needed after the introductory phrase 'After lunch'."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the correct plural form of 'leaf'.",
    options: ["leafs", "leaves", "leafes", "leafies"],
    correctAnswer: 1,
    explanation: "The correct plural of 'leaf' is 'leaves'."
  },

  // Writing Conventions Questions (33-40)
  {
    id: 33,
    type: "writing",
    question: "Which word should be capitalized in this sentence? 'we visited montego bay in july.'",
    options: ["we only", "montego bay and july", "visited only", "bay only"],
    correctAnswer: 1,
    explanation: "'Montego Bay' is a place name and 'July' is a month, so both should be capitalized."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence is spelled correctly?",
    options: ["The butterfy was colorful.", "The butterfly was colorful.", "The buterfly was colorful.", "The butterfly was colorfull."],
    correctAnswer: 1,
    explanation: "'Butterfly' and 'colorful' are both spelled correctly in the second sentence."
  },
  {
    id: 35,
    type: "writing",
    question: "Which punctuation mark should end this sentence? 'What a fantastic surprise'",
    options: ["period", "comma", "question mark", "exclamation mark"],
    correctAnswer: 3,
    explanation: "A strong feeling or exclamation should end with an exclamation mark."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence uses quotation marks correctly?",
    options: [
      "\"Please sit down,\" said Dad.",
      "Please sit down,\" said Dad.\"",
      "\"Please sit down, said Dad.\"",
      "Please \"sit down,\" said Dad."
    ],
    correctAnswer: 0,
    explanation: "The spoken words go inside quotation marks, and the comma belongs inside as well."
  },
  {
    id: 37,
    type: "writing",
    question: "Which contraction is correct for 'I am'?",
    options: ["Im", "I'am", "I'm", "I,m"],
    correctAnswer: 2,
    explanation: "'I'm' is the correct contraction of 'I am'."
  },
  {
    id: 38,
    type: "writing",
    question: "Choose the best topic sentence for a paragraph about helping at home.",
    options: [
      "My broom is by the door.",
      "Helping at home teaches children responsibility.",
      "Yesterday was Tuesday.",
      "Sometimes chores are short."
    ],
    correctAnswer: 1,
    explanation: "A topic sentence should clearly introduce the paragraph's main idea."
  },
  {
    id: 39,
    type: "writing",
    question: "Which sentence is written most clearly?",
    options: [
      "The boy which runs is fast.",
      "The boy who runs is fast.",
      "The boy run fast is who.",
      "The boy which running fast."
    ],
    correctAnswer: 1,
    explanation: "'The boy who runs is fast.' is the clearest and grammatically correct sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which word correctly completes the sentence? 'The books are over _____.",
    options: ["their", "there", "they're", "thier"],
    correctAnswer: 1,
    explanation: "'There' shows place. 'Their' shows ownership, and 'they're' means 'they are'."
  }
]

export default function LiteracyMixed1MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyQuestions : literacyQuestions.slice(0, FREE_QUESTION_LIMIT)
  const totalQuestions = availableQuestions.length

  useEffect(() => {
    if (answers.length !== totalQuestions) {
      setAnswers(new Array(totalQuestions).fill(null))
    }
  }, [totalQuestions, answers.length])

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

  const getGrade = (percentage: number) => {
    if (percentage >= 85) return { label: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { label: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { label: "Fair", color: "text-amber-600" }
    return { label: "Needs Improvement", color: "text-red-600" }
  }

  const getSectionTitle = (type: Question["type"]) => {
    switch (type) {
      case "reading":
        return "Reading"
      case "vocabulary":
        return "Vocabulary"
      case "grammar":
        return "Grammar"
      case "writing":
        return "Writing"
      default:
        return "Section"
    }
  }

  const getSectionNote = (percentage: number) => {
    if (percentage >= 85) return "Excellent understanding shown in this section."
    if (percentage >= 70) return "Good work. A little more practice will build even more confidence."
    if (percentage >= 50) return "Fair progress. Review this area for stronger performance."
    return "More practice is needed in this section."
  }

  const getSectionSummary = (type: Question["type"]) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === type)
    const sectionIndexes = availableQuestions
      .map((q, index) => ({ q, index }))
      .filter((item) => item.q.type === type)

    const correct = sectionIndexes.filter(
      ({ q, index }) => answers[index] === q.correctAnswer
    ).length

    const total = sectionQuestions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    return {
      title: getSectionTitle(type),
      correct,
      total,
      percentage,
      note: getSectionNote(percentage),
    }
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
  const answeredCount = answers.filter((a) => a !== null).length
  const percentage = getScorePercentage()
  const grade = getGrade(percentage)
  const sectionSummaries = [
    getSectionSummary("reading"),
    getSectionSummary("vocabulary"),
    getSectionSummary("grammar"),
    getSectionSummary("writing"),
  ]

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Tests
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 1</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Realistic Simulation</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question mixed simulation.
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
                  <h3 className="font-semibold text-sky-800 mb-2">About this test:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- A blend of easy, moderate, and difficult questions</li>
                    <li>- Strong exam-style practice across all literacy strands</li>
                    <li>- Reading, Vocabulary, Grammar, and Writing included</li>
                    <li>- Designed to feel close to a real test experience</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Choose the best answer for each question.</li>
                    <li>- Use the navigator to move around the test.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">
                  Start Test
                </Button>

                <Link href="/mock-tests">
                  <Button variant="outline" className="w-full">
                    Back to Mock Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (testCompleted && !showReview) {
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 1</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-5xl font-bold text-sky-600">{calculateScore()}/{totalQuestions}</p>
                  <p className="text-gray-600 mt-2">Questions Correct</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-sky-600">{percentage}%</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">{completedAt || new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-left">
                  {sectionSummaries.map((section) => (
                    <div key={section.title} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <p className="font-semibold text-sky-800">{section.title}</p>
                      <p className="text-2xl font-bold text-sky-700 mt-2">
                        {section.correct}/{section.total}
                      </p>
                      <p className="text-sm text-slate-600">{section.percentage}% correct</p>
                      <p className="text-sm text-slate-700 mt-2">{section.note}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This mixed paper blends easier, moderate, and more challenging questions to simulate a realistic exam-style experience.
                    Review the report to see strengths, weak areas, and explanations for each answer.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-slate-700 hover:bg-slate-800">
                    Review Answers & Report
                  </Button>
                  <Button onClick={restartTest} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Test Again
                  </Button>
                  <Link href="/mock-tests">
                    <Button variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Mock Tests
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (showReview) {
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
                      Grade 4 PEP Literacy Mixed 1 Report
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
                    <p className="text-2xl font-bold text-sky-700">{calculateScore()}/{totalQuestions}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className="text-2xl font-bold text-sky-700">{percentage}%</p>
                    <p className="text-xs text-slate-600">Percent</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]">
                    <p className={`text-lg font-bold ${grade.color}`}>{grade.label}</p>
                    <p className="text-xs text-slate-600">Performance</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">
                  This report shows the student&apos;s overall result, section-by-section performance,
                  and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {sectionSummaries.map((section) => (
                  <div key={section.title} className="rounded-xl border border-sky-200 bg-white p-4">
                    <p className="font-semibold text-sky-800">{section.title}</p>
                    <p className="text-2xl font-bold text-sky-700 mt-2">
                      {section.correct}/{section.total}
                    </p>
                    <p className="text-sm text-slate-600">{section.percentage}% correct</p>
                    <p className="text-sm text-slate-700 mt-2">{section.note}</p>
                  </div>
                ))}
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
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs font-medium uppercase tracking-wide text-sky-700 bg-sky-100 rounded-full px-3 py-1 w-fit">
                              {getSectionTitle(q.type)}
                            </span>
                          </div>

                          {q.passage && (
                            <div className="mb-4 p-4 bg-white rounded-lg border max-h-56 overflow-y-auto">
                              <h4 className="font-semibold text-gray-800 mb-2">Passage</h4>
                              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                                {q.passage}
                              </p>
                            </div>
                          )}

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

            <Link href="/mock-tests" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Mock Tests
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
              <Link
                href="/mock-tests"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Exit Test"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Literacy Mixed 1</h1>
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
                <span className="text-sm font-medium text-sky-700 uppercase">
                  {getSectionTitle(question.type)}
                </span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Read the passage:</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                    {question.passage}
                  </p>
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
                        : "border-gray-200 hover:border-sky-300 hover:bg-sky-50/50"
                    )}
                  >
                    <span className="font-medium text-sky-700 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800">
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
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
                        ? "bg-sky-100 text-sky-700"
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
