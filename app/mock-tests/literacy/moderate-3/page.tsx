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

const literacyModerate3Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Mama's Kitchen

Every Saturday morning, the smell of ackee and saltfish drifted through the house like a warm invitation. Mama cooked with her whole body — stirring, tasting, humming songs that no one else knew the words to. She never used a recipe book. "The food already knows what it wants to be," she would say with a wink.

Dani loved to sit on the kitchen stool and watch. The sizzle of onions, the pop of scotch bonnet, the steam rising from the pot — each sound and smell told a story. Sometimes Mama would hand Dani a wooden spoon and say, "Go on then, stir with purpose." Dani stirred as if mixing magic into the pot.

One Saturday, a power cut left the kitchen dark and quiet. "What do we do now, Mama?" Dani asked. Mama lit two candles, smiled, and said, "We cook by heart." And so they did. The food that day tasted like something beyond the recipe — like memory, like love.`,
    question: `What is the best title for the passage about Mama's kitchen?`,
    options: ["How to Cook Ackee and Saltfish", "The Day the Power Went Out", "Cooking by Heart: Mama's Kitchen", "Dani Becomes a Chef"],
    correctAnswer: 2,
    explanation: `The passage is about Mama's approach to cooking with love and memory, passed on to Dani — 'Cooking by Heart' captures this best.`,
  },
  {
    id: 2,
    type: "reading",
    passage: `Mama's Kitchen

Every Saturday morning, the smell of ackee and saltfish drifted through the house like a warm invitation. Mama cooked with her whole body — stirring, tasting, humming songs that no one else knew the words to. She never used a recipe book. "The food already knows what it wants to be," she would say with a wink.

Dani loved to sit on the kitchen stool and watch. The sizzle of onions, the pop of scotch bonnet, the steam rising from the pot — each sound and smell told a story. Sometimes Mama would hand Dani a wooden spoon and say, "Go on then, stir with purpose." Dani stirred as if mixing magic into the pot.

One Saturday, a power cut left the kitchen dark and quiet. "What do we do now, Mama?" Dani asked. Mama lit two candles, smiled, and said, "We cook by heart." And so they did. The food that day tasted like something beyond the recipe — like memory, like love.`,
    question: `What does the phrase 'cook with her whole body' tell the reader about Mama?`,
    options: ["Mama was a professional chef trained at a cooking school.", "Mama was fully involved and passionate about cooking.", "Mama was tired from cooking every single day.", "Mama needed help because cooking was difficult for her."],
    correctAnswer: 1,
    explanation: `The phrase suggests Mama puts her entire self into cooking — she stirs, tastes, and hums — showing she is fully involved and passionate.`,
  },
  {
    id: 3,
    type: "reading",
    passage: `Mama's Kitchen

Every Saturday morning, the smell of ackee and saltfish drifted through the house like a warm invitation. Mama cooked with her whole body — stirring, tasting, humming songs that no one else knew the words to. She never used a recipe book. "The food already knows what it wants to be," she would say with a wink.

Dani loved to sit on the kitchen stool and watch. The sizzle of onions, the pop of scotch bonnet, the steam rising from the pot — each sound and smell told a story. Sometimes Mama would hand Dani a wooden spoon and say, "Go on then, stir with purpose." Dani stirred as if mixing magic into the pot.

One Saturday, a power cut left the kitchen dark and quiet. "What do we do now, Mama?" Dani asked. Mama lit two candles, smiled, and said, "We cook by heart." And so they did. The food that day tasted like something beyond the recipe — like memory, like love.`,
    question: `What does Mama mean when she says 'We cook by heart'?`,
    options: ["They will cook a meal shaped like a heart.", "They will cook from memory and feeling, without needing lights or instructions.", "They will only cook their favourite recipes.", "They will stop cooking because the power is out."],
    correctAnswer: 1,
    explanation: `'Cooking by heart' means using memory, feeling, and skill rather than following instructions.`,
  },
  {
    id: 4,
    type: "reading",
    passage: `Mama's Kitchen

Every Saturday morning, the smell of ackee and saltfish drifted through the house like a warm invitation. Mama cooked with her whole body — stirring, tasting, humming songs that no one else knew the words to. She never used a recipe book. "The food already knows what it wants to be," she would say with a wink.

Dani loved to sit on the kitchen stool and watch. The sizzle of onions, the pop of scotch bonnet, the steam rising from the pot — each sound and smell told a story. Sometimes Mama would hand Dani a wooden spoon and say, "Go on then, stir with purpose." Dani stirred as if mixing magic into the pot.

One Saturday, a power cut left the kitchen dark and quiet. "What do we do now, Mama?" Dani asked. Mama lit two candles, smiled, and said, "We cook by heart." And so they did. The food that day tasted like something beyond the recipe — like memory, like love.`,
    question: `Why did Dani stir 'as if mixing magic into the pot'?`,
    options: ["Dani believed the food contained a magic spell.", "Dani had been trained to stir in a special way.", "Dani stirred with great care and imagination, feeling the cooking was special.", "Dani was trying to make the food cook faster."],
    correctAnswer: 2,
    explanation: `This is a metaphor — Dani stirred with such care and wonder that it felt like creating something magical.`,
  },
  {
    id: 5,
    type: "reading",
    passage: `Mama's Kitchen

Every Saturday morning, the smell of ackee and saltfish drifted through the house like a warm invitation. Mama cooked with her whole body — stirring, tasting, humming songs that no one else knew the words to. She never used a recipe book. "The food already knows what it wants to be," she would say with a wink.

Dani loved to sit on the kitchen stool and watch. The sizzle of onions, the pop of scotch bonnet, the steam rising from the pot — each sound and smell told a story. Sometimes Mama would hand Dani a wooden spoon and say, "Go on then, stir with purpose." Dani stirred as if mixing magic into the pot.

One Saturday, a power cut left the kitchen dark and quiet. "What do we do now, Mama?" Dani asked. Mama lit two candles, smiled, and said, "We cook by heart." And so they did. The food that day tasted like something beyond the recipe — like memory, like love.`,
    question: `Which word best describes the mood of the passage about Mama's kitchen?`,
    options: ["Tense and frightening", "Warm and loving", "Sad and lonely", "Exciting and adventurous"],
    correctAnswer: 1,
    explanation: `The passage is filled with warmth, family love, and the comfort of shared traditions — the overall mood is warm and loving.`,
  },
  {
    id: 6,
    type: "reading",
    passage: `The Coral Reef

Jamaica is surrounded by some of the most beautiful coral reefs in the Caribbean. These underwater structures are built by tiny creatures called coral polyps, which produce hard calcium carbonate skeletons. Over thousands of years, millions of these skeletons stack up to form the reef.

Coral reefs are sometimes called "the rainforests of the sea" because they support an enormous variety of life. Fish, sea turtles, lobsters, sponges, and hundreds of other species depend on reefs for food and shelter. Scientists estimate that coral reefs support about 25% of all ocean species, even though they cover less than 1% of the ocean floor.

Unfortunately, Jamaica's reefs face serious threats. Rising sea temperatures cause coral bleaching, a process in which corals expel the algae living in their tissues and turn white. Pollution, overfishing, and boat anchors also damage reefs. Without urgent protection, these ecosystems may disappear within decades.`,
    question: `What is the main argument of the third paragraph of the coral reef passage?`,
    options: ["Coral reefs are beautiful and should be visited by tourists.", "Jamaica's coral reefs face serious threats and need urgent protection.", "Scientists know very little about coral reefs.", "Jamaica has the largest coral reef in the world."],
    correctAnswer: 1,
    explanation: `The third paragraph lists threats and warns reefs may disappear without urgent protection.`,
  },
  {
    id: 7,
    type: "reading",
    passage: `The Coral Reef

Jamaica is surrounded by some of the most beautiful coral reefs in the Caribbean. These underwater structures are built by tiny creatures called coral polyps, which produce hard calcium carbonate skeletons. Over thousands of years, millions of these skeletons stack up to form the reef.

Coral reefs are sometimes called "the rainforests of the sea" because they support an enormous variety of life. Fish, sea turtles, lobsters, sponges, and hundreds of other species depend on reefs for food and shelter. Scientists estimate that coral reefs support about 25% of all ocean species, even though they cover less than 1% of the ocean floor.

Unfortunately, Jamaica's reefs face serious threats. Rising sea temperatures cause coral bleaching, a process in which corals expel the algae living in their tissues and turn white. Pollution, overfishing, and boat anchors also damage reefs. Without urgent protection, these ecosystems may disappear within decades.`,
    question: `Why does the author compare coral reefs to 'rainforests of the sea'?`,
    options: ["Because both rainforests and reefs are found only in tropical countries.", "Because both are green and leafy environments.", "Because both support a very large variety of living things.", "Because both are being cut down by loggers."],
    correctAnswer: 2,
    explanation: `Both rainforests and coral reefs support an enormous variety of species — they are biodiversity hotspots.`,
  },
  {
    id: 8,
    type: "reading",
    passage: `The Coral Reef

Jamaica is surrounded by some of the most beautiful coral reefs in the Caribbean. These underwater structures are built by tiny creatures called coral polyps, which produce hard calcium carbonate skeletons. Over thousands of years, millions of these skeletons stack up to form the reef.

Coral reefs are sometimes called "the rainforests of the sea" because they support an enormous variety of life. Fish, sea turtles, lobsters, sponges, and hundreds of other species depend on reefs for food and shelter. Scientists estimate that coral reefs support about 25% of all ocean species, even though they cover less than 1% of the ocean floor.

Unfortunately, Jamaica's reefs face serious threats. Rising sea temperatures cause coral bleaching, a process in which corals expel the algae living in their tissues and turn white. Pollution, overfishing, and boat anchors also damage reefs. Without urgent protection, these ecosystems may disappear within decades.`,
    question: `What does 'coral bleaching' mean, according to the passage?`,
    options: ["Corals grow too large and block sunlight.", "Corals lose their colour when they expel the algae in their tissues due to heat.", "Corals are painted white by pollution from factories.", "Corals die because of overfishing near the reef."],
    correctAnswer: 1,
    explanation: `The passage defines coral bleaching as corals expelling their algae and turning white due to rising sea temperatures.`,
  },
  {
    id: 9,
    type: "reading",
    passage: `The Coral Reef

Jamaica is surrounded by some of the most beautiful coral reefs in the Caribbean. These underwater structures are built by tiny creatures called coral polyps, which produce hard calcium carbonate skeletons. Over thousands of years, millions of these skeletons stack up to form the reef.

Coral reefs are sometimes called "the rainforests of the sea" because they support an enormous variety of life. Fish, sea turtles, lobsters, sponges, and hundreds of other species depend on reefs for food and shelter. Scientists estimate that coral reefs support about 25% of all ocean species, even though they cover less than 1% of the ocean floor.

Unfortunately, Jamaica's reefs face serious threats. Rising sea temperatures cause coral bleaching, a process in which corals expel the algae living in their tissues and turn white. Pollution, overfishing, and boat anchors also damage reefs. Without urgent protection, these ecosystems may disappear within decades.`,
    question: `Which statistic best shows how important coral reefs are despite their small size?`,
    options: ["They cover less than 1% of the ocean floor.", "They are built over thousands of years.", "They support about 25% of all ocean species.", "They produce hard calcium carbonate skeletons."],
    correctAnswer: 2,
    explanation: `Reefs cover less than 1% of the ocean floor yet support 25% of all ocean species — showing they are disproportionately important.`,
  },
  {
    id: 10,
    type: "reading",
    passage: `The Coral Reef

Jamaica is surrounded by some of the most beautiful coral reefs in the Caribbean. These underwater structures are built by tiny creatures called coral polyps, which produce hard calcium carbonate skeletons. Over thousands of years, millions of these skeletons stack up to form the reef.

Coral reefs are sometimes called "the rainforests of the sea" because they support an enormous variety of life. Fish, sea turtles, lobsters, sponges, and hundreds of other species depend on reefs for food and shelter. Scientists estimate that coral reefs support about 25% of all ocean species, even though they cover less than 1% of the ocean floor.

Unfortunately, Jamaica's reefs face serious threats. Rising sea temperatures cause coral bleaching, a process in which corals expel the algae living in their tissues and turn white. Pollution, overfishing, and boat anchors also damage reefs. Without urgent protection, these ecosystems may disappear within decades.`,
    question: `What is the author's main purpose in writing the coral reef passage?`,
    options: ["To entertain readers with a story about life underwater.", "To inform and warn readers about the importance and threats facing coral reefs.", "To persuade readers to become marine scientists.", "To describe a personal visit to a reef in Jamaica."],
    correctAnswer: 1,
    explanation: `The passage presents facts and ends with a warning about threats — the author's purpose is to inform and raise awareness.`,
  },
  {
    id: 11,
    type: "vocabulary",
    question: `In the sentence 'The explorer ventured deep into the forest,' what does 'ventured' mean?`,
    options: ["stayed safely at home", "went boldly into a risky or unknown place", "rested quietly under a tree", "ran away from danger"],
    correctAnswer: 1,
    explanation: `'Ventured' means to go somewhere that involves risk or uncertainty.`,
  },
  {
    id: 12,
    type: "vocabulary",
    question: `Which word is the best antonym for 'courageous'?`,
    options: ["brave", "strong", "cowardly", "honest"],
    correctAnswer: 2,
    explanation: `'Courageous' means brave; its antonym is 'cowardly,' meaning lacking bravery.`,
  },
  {
    id: 13,
    type: "vocabulary",
    question: `'The student made a significant contribution to the science fair.' What does 'significant' mean?`,
    options: ["small and unimportant", "colourful and creative", "notable and meaningful", "surprising and strange"],
    correctAnswer: 2,
    explanation: `'Significant' means notable, important, or having a meaningful impact.`,
  },
  {
    id: 14,
    type: "vocabulary",
    question: `Which word best completes the sentence? 'The children listened _____ to the storyteller.'`,
    options: ["rudely", "attentively", "loudly", "carelessly"],
    correctAnswer: 1,
    explanation: `'Attentively' means with careful attention — fitting for listening to a storyteller.`,
  },
  {
    id: 15,
    type: "vocabulary",
    question: `What does 'preserve' mean?`,
    options: ["to destroy or throw away", "to keep safe or protect from harm", "to sell to another country", "to cook food at a high temperature"],
    correctAnswer: 1,
    explanation: `'Preserve' means to keep something safe and protect it from damage or loss.`,
  },
  {
    id: 16,
    type: "vocabulary",
    question: `In the sentence 'The thunder rumbled in the distance,' the word 'rumbled' suggests a sound that is:`,
    options: ["high-pitched and sharp", "silent and still", "low and rolling", "quick and very short"],
    correctAnswer: 2,
    explanation: `'Rumbled' describes a deep, low, rolling sound — the kind thunder makes.`,
  },
  {
    id: 17,
    type: "vocabulary",
    question: `What is the meaning of 'frequently'?`,
    options: ["rarely", "soon", "often", "never"],
    correctAnswer: 2,
    explanation: `'Frequently' means happening often or many times.`,
  },
  {
    id: 18,
    type: "vocabulary",
    question: `In the sentence 'The narrow bridge could support only one car at a time,' what does 'support' mean?`,
    options: ["to enjoy or appreciate", "to hold the weight of", "to build or construct", "to cross over safely"],
    correctAnswer: 1,
    explanation: `In this context, 'support' means to bear or hold the weight of something.`,
  },
  {
    id: 19,
    type: "vocabulary",
    question: `Which word means the same as 'exhausted'?`,
    options: ["energetic", "very tired", "very hungry", "bored"],
    correctAnswer: 1,
    explanation: `'Exhausted' means extremely tired, having used up all one's energy.`,
  },
  {
    id: 20,
    type: "vocabulary",
    question: `'The instructions were concise.' This means the instructions were:`,
    options: ["confusing and very long", "beautifully decorated", "short and clear", "written in another language"],
    correctAnswer: 2,
    explanation: `'Concise' means brief and clearly expressed.`,
  },
  {
    id: 21,
    type: "grammar",
    question: `Which word is a preposition in this sentence: 'The cat sat on the mat.'?`,
    options: ["cat", "sat", "on", "mat"],
    correctAnswer: 2,
    explanation: `'On' is a preposition — it shows the relationship between 'the cat' and 'the mat.'`,
  },
  {
    id: 22,
    type: "grammar",
    question: `Choose the correctly structured sentence:`,
    options: ["Me and my friend went to school.", "My friend and I went to school.", "I and my friend went to school.", "My friend and me went to school."],
    correctAnswer: 1,
    explanation: `When referring to yourself and another person as the subject, use 'I' — and place yourself last: 'My friend and I.'`,
  },
  {
    id: 23,
    type: "grammar",
    question: `Which sentence uses the future tense correctly?`,
    options: ["She went to the library tomorrow.", "She goes to the library yesterday.", "She will go to the library tomorrow.", "She was going to the library tomorrow."],
    correctAnswer: 2,
    explanation: `'Will go' is the correct future tense. 'Tomorrow' confirms we need the future tense.`,
  },
  {
    id: 24,
    type: "grammar",
    question: `'Neither the teacher nor the students _____ ready.' Choose the correct verb.`,
    options: ["was", "were", "is", "be"],
    correctAnswer: 1,
    explanation: `With 'neither...nor,' the verb agrees with the subject closest to it — 'students' is plural, so 'were' is correct.`,
  },
  {
    id: 25,
    type: "grammar",
    question: `Which option correctly changes this sentence to the passive voice? 'The chef cooked the meal.'`,
    options: ["The meal was cooked by the chef.", "The meal cooked the chef.", "The chef was cooked by the meal.", "The meal is cooked."],
    correctAnswer: 0,
    explanation: `In the passive voice, the object becomes the subject: 'The meal was cooked by the chef.'`,
  },
  {
    id: 26,
    type: "grammar",
    question: `Choose the correct relative pronoun: 'The girl _____ won the spelling bee is my neighbour.'`,
    options: ["which", "what", "who", "whom"],
    correctAnswer: 2,
    explanation: `'Who' is used for people as the subject of a relative clause.`,
  },
  {
    id: 27,
    type: "grammar",
    question: `Choose the grammatically correct sentence:`,
    options: ["She don't like mangoes.", "She doesn't likes mangoes.", "She doesn't like mangoes.", "She not like mangoes."],
    correctAnswer: 2,
    explanation: `'Doesn't' is the correct negative form for third-person singular (she). The base verb 'like' follows 'doesn't.'`,
  },
  {
    id: 28,
    type: "grammar",
    question: `Identify the adjective in: 'The tall woman carried a heavy basket.'`,
    options: ["carried", "basket", "tall", "woman"],
    correctAnswer: 2,
    explanation: `'Tall' is an adjective — it describes the noun 'woman.'`,
  },
  {
    id: 29,
    type: "grammar",
    question: `Which sentence is correctly punctuated?`,
    options: ["What a wonderful day it is", "What a wonderful day it is?", "What a wonderful day it is!", "What, a wonderful day it is."],
    correctAnswer: 2,
    explanation: `An exclamatory sentence that expresses strong feeling ends with an exclamation mark.`,
  },
  {
    id: 30,
    type: "grammar",
    question: `Choose the correct verb form: 'By next week, she _____ the project.'`,
    options: ["finishes", "finished", "will have finished", "was finishing"],
    correctAnswer: 2,
    explanation: `'Will have finished' is the future perfect tense — an action completed before a future point.`,
  },
  {
    id: 31,
    type: "grammar",
    question: `Which of the following is a simple sentence?`,
    options: ["The teacher arrived, and the class began.", "Although it was raining, she walked to school.", "The dog wagged its tail.", "She studied because the exam was tomorrow."],
    correctAnswer: 2,
    explanation: `A simple sentence has one independent clause. 'The dog wagged its tail' has one subject and one verb.`,
  },
  {
    id: 32,
    type: "grammar",
    question: `Which word correctly completes the sentence? 'I haven't eaten _____ breakfast.'`,
    options: ["from", "at", "since", "until"],
    correctAnswer: 2,
    explanation: `'Since' indicates a point in time from which something has continued. 'I haven't eaten since breakfast' is correct.`,
  },
  {
    id: 33,
    type: "writing",
    question: `Choose the correctly spelled word:`,
    options: ["seperate", "separate", "seprate", "separrate"],
    correctAnswer: 1,
    explanation: `The correct spelling is 'separate.' A helpful tip: there is 'a rat' in sep-a-rat-e.`,
  },
  {
    id: 34,
    type: "writing",
    question: `Which sentence is correctly capitalized?`,
    options: ["The national hero of Jamaica is Nanny of the maroons.", "The National hero of Jamaica is Nanny of the Maroons.", "The national hero of Jamaica is Nanny of the Maroons.", "the national hero of jamaica is nanny of the maroons."],
    correctAnswer: 2,
    explanation: `'Nanny' is a proper name and 'Maroons' is a proper noun — both must be capitalized.`,
  },
  {
    id: 35,
    type: "writing",
    question: `Which sentence uses an apostrophe correctly for one dog?`,
    options: ["The dogs' bone is buried in the yard.", "The dog's bone is buried in the yard.", "The dogs bone is buried in the yard.", "The dog's' bone is buried in the yard."],
    correctAnswer: 1,
    explanation: `For one dog, the possessive is 'dog\'s' — the apostrophe goes before the 's.'`,
  },
  {
    id: 36,
    type: "writing",
    question: `Which of the following is a run-on sentence?`,
    options: ["The sun set over the mountains, painting the sky orange.", "The sun set over the mountains it was beautiful.", "The sun set over the mountains.", "As the sun set over the mountains, the birds fell silent."],
    correctAnswer: 1,
    explanation: `A run-on sentence incorrectly joins two independent clauses without punctuation or a conjunction.`,
  },
  {
    id: 37,
    type: "writing",
    question: `Choose the correctly spelled word:`,
    options: ["grammer", "grammarr", "grammar", "gramer"],
    correctAnswer: 2,
    explanation: `The correct spelling is 'grammar.'`,
  },
  {
    id: 38,
    type: "writing",
    question: `Which punctuation correctly ends this sentence? 'Is the homework due tomorrow ___'`,
    options: [".", "!", ",", "?"],
    correctAnswer: 3,
    explanation: `A question ends with a question mark (?).`,
  },
  {
    id: 39,
    type: "writing",
    question: `Choose the sentence with correct capitalization of a special day:`,
    options: ["We celebrate Emancipation day on August 1st.", "We celebrate emancipation Day on August 1st.", "We celebrate Emancipation Day on August 1st.", "we celebrate emancipation day on august 1st."],
    correctAnswer: 2,
    explanation: `'Emancipation Day' is a proper noun (a named holiday) — both words must be capitalized.`,
  },
  {
    id: 40,
    type: "writing",
    question: `Which revision best corrects this sentence? 'She went to the store she buyed some bread.'`,
    options: ["She went to the store, and she bought some bread.", "She went to the store she bought some bread.", "She went to the store and buyed some bread.", "She went to the store, she buyed some bread."],
    correctAnswer: 0,
    explanation: `The revision adds a comma and 'and' to join two clauses, and uses 'bought' (correct past tense) instead of 'buyed.'`,
  },
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate3MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate3Questions : literacyModerate3Questions.slice(0, FREE_QUESTION_LIMIT)
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
                  alt="Shazonique&apos;s Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <BookOpen className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 3</CardTitle>
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
                    <li>- Fictional and informational passage reading</li>
                    <li>- Vocabulary in context, synonyms, and antonyms</li>
                    <li>- Grammar, tense, and sentence revision</li>
                    <li>- 40 Questions · 60 Minutes</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
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
                  alt="Shazonique&apos;s Inspiration logo"
                  width={220}
                  height={100}
                  className="h-auto w-[180px] sm:w-[220px]"
                  priority
                />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 3</p>
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
                    Review Answers &amp; Report
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
                      alt="Shazonique&apos;s Inspiration logo"
                      width={220}
                      height={100}
                      className="h-auto w-[180px] sm:w-[220px]"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 3 Report</CardTitle>
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
                              : q.type === "writing"
                              ? "Writing"
                              : ""}
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
                <h1 className="text-lg font-bold">Literacy Moderate 3</h1>
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
                    : question.type === "writing"
                    ? "Writing"
                    : ""}
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
