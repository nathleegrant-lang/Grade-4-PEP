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

const literacyModerate4Questions: Question[] = [
  // Reading Comprehension Questions (1-10)
  {
    id: 1,
    type: "reading",
    passage: `The School Garden Project

When Grade 4 students at Orange Hill Primary returned to school in September, they found an empty piece of land behind the library. Their teacher, Mrs. Thomas, suggested that the class turn the area into a garden. At first, some students thought the work would be too hard, but they agreed to try.

During the first week, the class measured the plot, pulled weeds, and removed stones. Parents donated tools, and the principal gave the class permission to use old paint buckets to collect water. The students planted tomato seedlings, callaloo, sweet pepper, and herbs.

After a month, the plants began to grow well. The students noticed that the callaloo grew fastest after rainy days. They also discovered that plants near the fence received less sunlight in the afternoon. Because of this, the class moved the herb pots to a sunnier spot.

By December, the garden produced enough vegetables for the school canteen to use in soup. The students felt proud because their work helped the school. Mrs. Thomas said the project taught more than science; it also taught patience, teamwork, and problem-solving.`,
    question: "What was the main purpose of the passage?",
    options: [
      "To explain how to build a library",
      "To describe how a class created and learned from a garden project",
      "To persuade students to leave school early",
      "To compare two different schools",
    ],
    correctAnswer: 1,
    explanation: "The passage mainly describes how Grade 4 students created a school garden and what they learned from the experience."
  },
  {
    id: 2,
    type: "reading",
    passage: `The School Garden Project

When Grade 4 students at Orange Hill Primary returned to school in September, they found an empty piece of land behind the library. Their teacher, Mrs. Thomas, suggested that the class turn the area into a garden. At first, some students thought the work would be too hard, but they agreed to try.

During the first week, the class measured the plot, pulled weeds, and removed stones. Parents donated tools, and the principal gave the class permission to use old paint buckets to collect water. The students planted tomato seedlings, callaloo, sweet pepper, and herbs.

After a month, the plants began to grow well. The students noticed that the callaloo grew fastest after rainy days. They also discovered that plants near the fence received less sunlight in the afternoon. Because of this, the class moved the herb pots to a sunnier spot.

By December, the garden produced enough vegetables for the school canteen to use in soup. The students felt proud because their work helped the school. Mrs. Thomas said the project taught more than science; it also taught patience, teamwork, and problem-solving.`,
    question: "Why did the class move the herb pots?",
    options: [
      "The pots were too heavy to carry",
      "The herbs were getting too much rain",
      "The herbs needed more sunlight",
      "The principal asked them to move the pots",
    ],
    correctAnswer: 2,
    explanation: "The passage says the plants near the fence received less sunlight, so the class moved the herb pots to a sunnier spot."
  },
  {
    id: 3,
    type: "reading",
    passage: `The School Garden Project

When Grade 4 students at Orange Hill Primary returned to school in September, they found an empty piece of land behind the library. Their teacher, Mrs. Thomas, suggested that the class turn the area into a garden. At first, some students thought the work would be too hard, but they agreed to try.

During the first week, the class measured the plot, pulled weeds, and removed stones. Parents donated tools, and the principal gave the class permission to use old paint buckets to collect water. The students planted tomato seedlings, callaloo, sweet pepper, and herbs.

After a month, the plants began to grow well. The students noticed that the callaloo grew fastest after rainy days. They also discovered that plants near the fence received less sunlight in the afternoon. Because of this, the class moved the herb pots to a sunnier spot.

By December, the garden produced enough vegetables for the school canteen to use in soup. The students felt proud because their work helped the school. Mrs. Thomas said the project taught more than science; it also taught patience, teamwork, and problem-solving.`,
    question: "Which detail best shows that the project helped the whole school?",
    options: [
      "Parents donated tools",
      "The students measured the plot",
      "The canteen used the vegetables in soup",
      "Some students thought the work was hard",
    ],
    correctAnswer: 2,
    explanation: "The strongest evidence is that the vegetables were used in the school canteen, which benefited the wider school community."
  },
  {
    id: 4,
    type: "reading",
    passage: `The School Garden Project

When Grade 4 students at Orange Hill Primary returned to school in September, they found an empty piece of land behind the library. Their teacher, Mrs. Thomas, suggested that the class turn the area into a garden. At first, some students thought the work would be too hard, but they agreed to try.

During the first week, the class measured the plot, pulled weeds, and removed stones. Parents donated tools, and the principal gave the class permission to use old paint buckets to collect water. The students planted tomato seedlings, callaloo, sweet pepper, and herbs.

After a month, the plants began to grow well. The students noticed that the callaloo grew fastest after rainy days. They also discovered that plants near the fence received less sunlight in the afternoon. Because of this, the class moved the herb pots to a sunnier spot.

By December, the garden produced enough vegetables for the school canteen to use in soup. The students felt proud because their work helped the school. Mrs. Thomas said the project taught more than science; it also taught patience, teamwork, and problem-solving.`,
    question: "How did the students solve a problem in the garden?",
    options: [
      "They stopped planting herbs",
      "They asked another class to help them",
      "They moved some plants after noticing a lack of sunlight",
      "They covered the whole garden with buckets",
    ],
    correctAnswer: 2,
    explanation: "The students noticed a problem with sunlight and solved it by moving the herb pots to a sunnier place."
  },
  {
    id: 5,
    type: "reading",
    passage: `The School Garden Project

When Grade 4 students at Orange Hill Primary returned to school in September, they found an empty piece of land behind the library. Their teacher, Mrs. Thomas, suggested that the class turn the area into a garden. At first, some students thought the work would be too hard, but they agreed to try.

During the first week, the class measured the plot, pulled weeds, and removed stones. Parents donated tools, and the principal gave the class permission to use old paint buckets to collect water. The students planted tomato seedlings, callaloo, sweet pepper, and herbs.

After a month, the plants began to grow well. The students noticed that the callaloo grew fastest after rainy days. They also discovered that plants near the fence received less sunlight in the afternoon. Because of this, the class moved the herb pots to a sunnier spot.

By December, the garden produced enough vegetables for the school canteen to use in soup. The students felt proud because their work helped the school. Mrs. Thomas said the project taught more than science; it also taught patience, teamwork, and problem-solving.`,
    question: "What can the reader infer about the students at the end of the project?",
    options: [
      "They regretted joining the project",
      "They felt disappointed with the results",
      "They became more confident because their effort was successful",
      "They preferred library work to outdoor work",
    ],
    correctAnswer: 2,
    explanation: "The students felt proud and saw positive results, so we can infer that they became more confident in what they could do."
  },
  {
    id: 6,
    type: "reading",
    passage: `A Morning at Port Royal

On Heritage Day, Jamal's class visited Port Royal. Before the trip, Jamal had only heard adults call the town "the wickedest city on earth," and he imagined a place filled with pirates and treasure maps. He was surprised when he saw fishermen repairing nets, children walking to school, and tour guides welcoming visitors.

At the museum, the guide explained that long ago Port Royal was a busy town where ships from many countries stopped to trade. Some sailors were merchants, but others were pirates. Jamal listened carefully as the guide described the earthquake of 1692, when part of the town sank beneath the sea.

After lunch, the class walked along the shoreline and sketched what they saw. Jamal drew old stone walls standing beside bright fishing boats. On the ride back to school, he said that Port Royal felt different from what he had imagined. It was a place where history and modern life stood side by side.`,
    question: "How did Jamal's opinion of Port Royal change?",
    options: [
      "He became less interested in the town",
      "He realized the town was only about pirates",
      "He understood that Port Royal is both historic and part of present-day Jamaica",
      "He thought the museum guide had told the wrong story",
    ],
    correctAnswer: 2,
    explanation: "At first Jamal imagined only pirates, but by the end he understood that Port Royal contains both history and modern life."
  },
  {
    id: 7,
    type: "reading",
    passage: `A Morning at Port Royal

On Heritage Day, Jamal's class visited Port Royal. Before the trip, Jamal had only heard adults call the town "the wickedest city on earth," and he imagined a place filled with pirates and treasure maps. He was surprised when he saw fishermen repairing nets, children walking to school, and tour guides welcoming visitors.

At the museum, the guide explained that long ago Port Royal was a busy town where ships from many countries stopped to trade. Some sailors were merchants, but others were pirates. Jamal listened carefully as the guide described the earthquake of 1692, when part of the town sank beneath the sea.

After lunch, the class walked along the shoreline and sketched what they saw. Jamal drew old stone walls standing beside bright fishing boats. On the ride back to school, he said that Port Royal felt different from what he had imagined. It was a place where history and modern life stood side by side.`,
    question: "Why does the writer include the details about fishermen, children, and tour guides in paragraph 1?",
    options: [
      "To show that Jamal's first impression was incomplete",
      "To prove that Jamal does not like museums",
      "To explain how to repair a fishing net",
      "To show that Port Royal has no history",
    ],
    correctAnswer: 0,
    explanation: "Those details show that Port Royal is a real, living community today, which challenges Jamal's first idea of the town."
  },
  {
    id: 8,
    type: "reading",
    passage: `A Morning at Port Royal

On Heritage Day, Jamal's class visited Port Royal. Before the trip, Jamal had only heard adults call the town "the wickedest city on earth," and he imagined a place filled with pirates and treasure maps. He was surprised when he saw fishermen repairing nets, children walking to school, and tour guides welcoming visitors.

At the museum, the guide explained that long ago Port Royal was a busy town where ships from many countries stopped to trade. Some sailors were merchants, but others were pirates. Jamal listened carefully as the guide described the earthquake of 1692, when part of the town sank beneath the sea.

After lunch, the class walked along the shoreline and sketched what they saw. Jamal drew old stone walls standing beside bright fishing boats. On the ride back to school, he said that Port Royal felt different from what he had imagined. It was a place where history and modern life stood side by side.`,
    question: "What is the best meaning of the word 'trade' as it is used in paragraph 2?",
    options: [
      "To change one thing for another in a game",
      "To buy and sell goods",
      "To teach a skill to someone",
      "To travel without a plan",
    ],
    correctAnswer: 1,
    explanation: "In the passage, ships stopped in Port Royal to exchange goods, so 'trade' means to buy and sell goods."
  },
  {
    id: 9,
    type: "reading",
    passage: `A Morning at Port Royal

On Heritage Day, Jamal's class visited Port Royal. Before the trip, Jamal had only heard adults call the town "the wickedest city on earth," and he imagined a place filled with pirates and treasure maps. He was surprised when he saw fishermen repairing nets, children walking to school, and tour guides welcoming visitors.

At the museum, the guide explained that long ago Port Royal was a busy town where ships from many countries stopped to trade. Some sailors were merchants, but others were pirates. Jamal listened carefully as the guide described the earthquake of 1692, when part of the town sank beneath the sea.

After lunch, the class walked along the shoreline and sketched what they saw. Jamal drew old stone walls standing beside bright fishing boats. On the ride back to school, he said that Port Royal felt different from what he had imagined. It was a place where history and modern life stood side by side.`,
    question: "Which sentence best supports the idea that Port Royal blends past and present?",
    options: [
      "He imagined a place filled with pirates and treasure maps.",
      "Some sailors were merchants, but others were pirates.",
      "Jamal drew old stone walls standing beside bright fishing boats.",
      "The guide described the earthquake of 1692.",
    ],
    correctAnswer: 2,
    explanation: "Old stone walls represent history and bright fishing boats represent modern life, so this detail best supports the idea that past and present exist together."
  },
  {
    id: 10,
    type: "reading",
    passage: `A Morning at Port Royal

On Heritage Day, Jamal's class visited Port Royal. Before the trip, Jamal had only heard adults call the town "the wickedest city on earth," and he imagined a place filled with pirates and treasure maps. He was surprised when he saw fishermen repairing nets, children walking to school, and tour guides welcoming visitors.

At the museum, the guide explained that long ago Port Royal was a busy town where ships from many countries stopped to trade. Some sailors were merchants, but others were pirates. Jamal listened carefully as the guide described the earthquake of 1692, when part of the town sank beneath the sea.

After lunch, the class walked along the shoreline and sketched what they saw. Jamal drew old stone walls standing beside bright fishing boats. On the ride back to school, he said that Port Royal felt different from what he had imagined. It was a place where history and modern life stood side by side.`,
    question: "Which word best describes Jamal's attitude at the end of the passage?",
    options: [
      "Confused",
      "Curious and thoughtful",
      "Angry",
      "Bored",
    ],
    correctAnswer: 1,
    explanation: "Jamal reflects on what he learned and sees the town in a new way, so 'curious and thoughtful' fits best."
  },

  // Vocabulary Questions (11-20)
  {
    id: 11,
    type: "vocabulary",
    question: "In the sentence 'The crowd grew silent as the principal began to speak,' the word 'silent' means:",
    options: ["restless", "quiet", "excited", "crowded"],
    correctAnswer: 1,
    explanation: "'Silent' means quiet, making little or no sound."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is the best synonym for 'careful'?",
    options: ["cautious", "careless", "speedy", "sudden"],
    correctAnswer: 0,
    explanation: "'Cautious' means careful and alert."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "What is the opposite of 'generous'?",
    options: ["friendly", "selfish", "polite", "proud"],
    correctAnswer: 1,
    explanation: "The opposite of generous is selfish because a selfish person does not like to share."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "In the sentence 'The muddy field made walking difficult,' the word 'difficult' means:",
    options: ["easy", "hard", "pleasant", "quick"],
    correctAnswer: 1,
    explanation: "'Difficult' means hard to do."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "Which word best completes the sentence? 'The teacher praised the class for their _____ work.'",
    options: ["messy", "excellent", "sleepy", "empty"],
    correctAnswer: 1,
    explanation: "'Excellent' fits because it means very good and matches the idea of praise."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "If a road is 'narrow,' it is:",
    options: ["wide", "long", "not wide", "crowded"],
    correctAnswer: 2,
    explanation: "A narrow road is not wide."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "In the sentence 'The kitten crept under the chair,' what does 'crept' mean?",
    options: ["moved slowly and quietly", "jumped high", "made a loud sound", "fell down"],
    correctAnswer: 0,
    explanation: "'Crept' means moved slowly and quietly."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is the best antonym for 'ancient'?",
    options: ["old", "historic", "modern", "broken"],
    correctAnswer: 2,
    explanation: "The opposite of ancient is modern."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "What does 'fortunate' most nearly mean?",
    options: ["lucky", "hungry", "angry", "tired"],
    correctAnswer: 0,
    explanation: "'Fortunate' means lucky or having good fortune."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "In the sentence 'The artist used bright colours to create a cheerful poster,' the word 'cheerful' means:",
    options: ["gloomy", "joyful", "untidy", "ordinary"],
    correctAnswer: 1,
    explanation: "'Cheerful' means joyful or happy."
  },

  // Grammar Questions (21-32)
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct verb: 'The players _____ ready for the match.'",
    options: ["is", "was", "are", "am"],
    correctAnswer: 2,
    explanation: "'Players' is plural, so the correct verb is 'are'."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence is punctuated correctly?",
    options: ["Where are you going.", "Where are you going?", "where are you going?", "Where are you going"],
    correctAnswer: 1,
    explanation: "A correctly punctuated question begins with a capital letter and ends with a question mark."
  },
  {
    id: 23,
    type: "grammar",
    question: "Choose the correct pronoun: 'Grandma gave the gift to _____. '",
    options: ["I", "me", "my", "mine"],
    correctAnswer: 1,
    explanation: "'Me' is the correct object pronoun after the preposition 'to'."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which word is an adjective in this sentence: 'The noisy bus stopped suddenly.'",
    options: ["noisy", "bus", "stopped", "suddenly"],
    correctAnswer: 0,
    explanation: "'Noisy' is an adjective because it describes the noun 'bus'."
  },
  {
    id: 25,
    type: "grammar",
    question: "Choose the correct past tense: 'Yesterday, we _____ to the beach.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    explanation: "'Went' is the past tense of 'go'."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which sentence is complete?",
    options: ["After the rain stopped.", "Because the bell rang.", "The children cheered loudly.", "Running across the field."],
    correctAnswer: 2,
    explanation: "A complete sentence needs a subject and a predicate. 'The children cheered loudly.' has both."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct plural form: 'There are many _____ in the basket.'",
    options: ["mango", "mangoes", "mangoses", "mango's"],
    correctAnswer: 1,
    explanation: "The standard plural form is 'mangoes'."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses the article correctly?",
    options: ["She saw a elephant.", "She saw an elephant.", "She saw the an elephant.", "She saw an elephant?"],
    correctAnswer: 1,
    explanation: "We use 'an' before words that begin with a vowel sound, such as 'elephant'."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the best revision: 'The puppies runs in the yard.'",
    options: ["The puppies run in the yard.", "The puppies running in the yard.", "The puppies ran in the yard always.", "The puppies is in the yard."],
    correctAnswer: 0,
    explanation: "'Puppies' is plural, so the verb must be 'run'."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which word is a verb in this sentence: 'My sister painted a bright mural.'",
    options: ["sister", "painted", "bright", "mural"],
    correctAnswer: 1,
    explanation: "'Painted' is the verb because it shows the action in the sentence."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence needs a comma after an introductory word?",
    options: ["Yes I can help you.", "The dog barked loudly.", "We went to town yesterday.", "My brother likes cricket."],
    correctAnswer: 0,
    explanation: "'Yes, I can help you.' needs a comma after the introductory word 'Yes'."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the correct comparative word: 'This puzzle is _____ than the last one.'",
    options: ["hard", "harder", "hardest", "more hardest"],
    correctAnswer: 1,
    explanation: "When comparing two things, the correct comparative form is 'harder'."
  },

  // Writing Conventions Questions (33-40)
  {
    id: 33,
    type: "writing",
    question: "Which word should be capitalized in this sentence: 'my aunt visited montego bay in august.'",
    options: ["aunt", "visited", "montego bay", "in"],
    correctAnswer: 2,
    explanation: "'Montego Bay' is a place name, so both words should be capitalized."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence uses quotation marks correctly?",
    options: [
      '"Please line up," said the teacher.',
      'Please line up," said the teacher."',
      '"Please line up, said the teacher."',
      'Please "line up," said the teacher.',
    ],
    correctAnswer: 0,
    explanation: "The spoken words go inside the quotation marks, and the comma comes before the closing quotation mark."
  },
  {
    id: 35,
    type: "writing",
    question: "Choose the correctly spelled word.",
    options: ["beleive", "believe", "belive", "beleeve"],
    correctAnswer: 1,
    explanation: "The correct spelling is 'believe'."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence is written correctly?",
    options: [
      "Last saturday we went to the beach.",
      "Last Saturday we went to the beach.",
      "last Saturday we went to the beach.",
      "Last Saturday, we went to the beach?",
    ],
    correctAnswer: 1,
    explanation: "'Saturday' is a proper noun and must be capitalized, and the sentence ends with a period."
  },
  {
    id: 37,
    type: "writing",
    question: "What punctuation mark should end this sentence? 'Watch out'",
    options: [".", "?", "!", ","],
    correctAnswer: 2,
    explanation: "'Watch out!' is an exclamation because it shows strong feeling or urgency."
  },
  {
    id: 38,
    type: "writing",
    question: "Choose the correct contraction for 'they are'.",
    options: ["their", "theyre", "they're", "there"],
    correctAnswer: 2,
    explanation: "The correct contraction is 'they're'. The apostrophe replaces the missing 'a'."
  },
  {
    id: 39,
    type: "writing",
    question: "Which word best completes the sentence? 'We packed our bags and left _____ the rain started.'",
    options: ["before", "because", "under", "unless"],
    correctAnswer: 0,
    explanation: "'Before' makes the sentence logical: they left before the rain started."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision makes this sentence clearer? 'The boy with the red cap he won the race.'",
    options: [
      "The boy with the red cap won the race.",
      "The boy with the red cap he was won the race.",
      "The boy with red cap won race.",
      "The boy, with the red cap, he won the race.",
    ],
    correctAnswer: 0,
    explanation: "The clearer sentence removes the extra pronoun 'he' and keeps the sentence complete and correct."
  },
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate4MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate4Questions : literacyModerate4Questions.slice(0, FREE_QUESTION_LIMIT)
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

  const getSectionStats = (type: Question["type"]) => {
    const sectionQuestions = availableQuestions.filter((q) => q.type === type)
    const correct = sectionQuestions.filter((q) => {
      const originalIndex = availableQuestions.findIndex((item) => item.id === q.id)
      return answers[originalIndex] === q.correctAnswer
    }).length
    const total = sectionQuestions.length
    const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)

    let rating = "Needs Improvement"
    let ratingColor = "text-red-600"

    if (percentage >= 85) {
      rating = "Excellent"
      ratingColor = "text-green-600"
    } else if (percentage >= 70) {
      rating = "Good"
      ratingColor = "text-blue-600"
    } else if (percentage >= 50) {
      rating = "Fair"
      ratingColor = "text-amber-600"
    }

    return { correct, total, percentage, rating, ratingColor }
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

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />

        <main className="container mx-auto px-4 py-10">
          <Link href="/mock-tests/literacy" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Literacy Mock Tests
          </Link>

          <Card className="max-w-2xl mx-auto shadow-lg">
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 4</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Moderate Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question moderate-level literacy test with reports and explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Moderate-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- More inference, main idea, and author&apos;s purpose</li>
                    <li>- Word meaning in context and stronger vocabulary choices</li>
                    <li>- Editing, grammar, punctuation, and sentence revision</li>
                    <li>- 40 Questions · 60 Minutes</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each passage and question carefully.</li>
                    <li>- Choose the best answer for each item.</li>
                    <li>- Some questions require more than direct recall.</li>
                    <li>- You may move between questions before submitting.</li>
                    <li>- The test will submit automatically when time runs out.</li>
                  </ul>
                </div>

                <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 4</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {SECTION_CONFIG.map((section) => {
                    const stats = getSectionStats(section.type)
                    return (
                      <div key={section.type} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                        <p className="font-semibold text-sky-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                          <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This moderate-level literacy report includes section summaries and a full question-by-question review with explanations.
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 4 Report</CardTitle>
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
                  This report shows the student&apos;s overall result, section-by-section performance, and a full question-by-question review with explanations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SECTION_CONFIG.map((section) => {
                  const stats = getSectionStats(section.type)
                  return (
                    <div key={section.type} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <p className="font-semibold text-sky-800">{section.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-700">{stats.correct}/{stats.total} correct</span>
                        <span className={`text-sm font-semibold ${stats.ratingColor}`}>{stats.rating}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={stats.percentage} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">{stats.percentage}%</p>
                      </div>
                    </div>
                  )
                })}
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
                          <p className="font-semibold text-slate-800 mb-1">Question {index + 1}</p>
                          <p className="text-xs uppercase tracking-wide text-sky-700 font-medium mb-2">
                            {q.type === "reading"
                              ? "Reading"
                              : q.type === "vocabulary"
                              ? "Vocabulary"
                              : q.type === "grammar"
                              ? "Grammar"
                              : "Writing"}
                          </p>
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
                <h1 className="text-lg font-bold">Literacy Moderate 4</h1>
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
                <span className="text-sm font-medium text-emerald-700 uppercase">
                  {question.type === "reading"
                    ? "Reading"
                    : question.type === "vocabulary"
                    ? "Vocabulary"
                    : question.type === "grammar"
                    ? "Grammar"
                    : "Writing"}
                </span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-72 overflow-y-auto">
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

            <div className="flex items-center gap-2">
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
