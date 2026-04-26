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

const literacyModerate2Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern part of Jamaica, rising more than 2,200 metres above sea level. They are home to some of the rarest plants and birds found anywhere in the Caribbean. The cool, misty climate makes the region ideal for growing coffee. Jamaican Blue Mountain Coffee is considered one of the finest coffees in the world and is exported to many countries, particularly Japan.

For centuries, the mountains provided shelter for the Maroons, a group of formerly enslaved Africans who escaped from plantations and built free communities in the highlands. They resisted British forces for many years and eventually signed a treaty in 1739 that gave them their freedom.

Today, the Blue Mountains attract hikers and nature lovers from around the world. The trails wind through dense forest and offer stunning views of the island. On clear mornings, some hikers can even see the coast of Cuba from the highest peak.`,
    question: `What is the main topic of the passage about the Blue Mountains?`,
    options: ["The history of coffee farming in Jamaica", "The geography, history, and importance of the Blue Mountains", "How the Maroons defeated the British army", "Why tourists prefer Jamaica over Cuba"],
    correctAnswer: 1,
    explanation: `The passage covers several aspects of the Blue Mountains — its geography, its role in history with the Maroons, and its importance today for tourism and coffee.`,
  },
  {
    id: 2,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern part of Jamaica, rising more than 2,200 metres above sea level. They are home to some of the rarest plants and birds found anywhere in the Caribbean. The cool, misty climate makes the region ideal for growing coffee. Jamaican Blue Mountain Coffee is considered one of the finest coffees in the world and is exported to many countries, particularly Japan.

For centuries, the mountains provided shelter for the Maroons, a group of formerly enslaved Africans who escaped from plantations and built free communities in the highlands. They resisted British forces for many years and eventually signed a treaty in 1739 that gave them their freedom.

Today, the Blue Mountains attract hikers and nature lovers from around the world. The trails wind through dense forest and offer stunning views of the island. On clear mornings, some hikers can even see the coast of Cuba from the highest peak.`,
    question: `According to the passage, why are the Blue Mountains ideal for growing coffee?`,
    options: ["Because they are close to the sea", "Because the soil is very dry and rocky", "Because the cool, misty climate is ideal", "Because the Maroons planted coffee trees"],
    correctAnswer: 2,
    explanation: `The passage states that the cool, misty climate makes the region ideal for growing coffee.`,
  },
  {
    id: 3,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern part of Jamaica, rising more than 2,200 metres above sea level. They are home to some of the rarest plants and birds found anywhere in the Caribbean. The cool, misty climate makes the region ideal for growing coffee. Jamaican Blue Mountain Coffee is considered one of the finest coffees in the world and is exported to many countries, particularly Japan.

For centuries, the mountains provided shelter for the Maroons, a group of formerly enslaved Africans who escaped from plantations and built free communities in the highlands. They resisted British forces for many years and eventually signed a treaty in 1739 that gave them their freedom.

Today, the Blue Mountains attract hikers and nature lovers from around the world. The trails wind through dense forest and offer stunning views of the island. On clear mornings, some hikers can even see the coast of Cuba from the highest peak.`,
    question: `What does the word 'exported' most likely mean as used in paragraph 1?`,
    options: ["Grown and harvested locally", "Sent to other countries for sale", "Kept in storage for many years", "Prepared and served in restaurants"],
    correctAnswer: 1,
    explanation: `'Exported' means sent to other countries for sale — the passage says Blue Mountain Coffee is exported to many countries, particularly Japan.`,
  },
  {
    id: 4,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern part of Jamaica, rising more than 2,200 metres above sea level. They are home to some of the rarest plants and birds found anywhere in the Caribbean. The cool, misty climate makes the region ideal for growing coffee. Jamaican Blue Mountain Coffee is considered one of the finest coffees in the world and is exported to many countries, particularly Japan.

For centuries, the mountains provided shelter for the Maroons, a group of formerly enslaved Africans who escaped from plantations and built free communities in the highlands. They resisted British forces for many years and eventually signed a treaty in 1739 that gave them their freedom.

Today, the Blue Mountains attract hikers and nature lovers from around the world. The trails wind through dense forest and offer stunning views of the island. On clear mornings, some hikers can even see the coast of Cuba from the highest peak.`,
    question: `Which detail best supports the idea that the Blue Mountains have historical importance?`,
    options: ["The mountains rise more than 2,200 metres above sea level.", "The Maroons built free communities and resisted British forces there.", "Hikers can see the coast of Cuba from the highest peak.", "The region is home to rare plants and birds."],
    correctAnswer: 1,
    explanation: `The Maroons' story of building free communities and resisting the British in the Blue Mountains is the strongest evidence of historical significance.`,
  },
  {
    id: 5,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern part of Jamaica, rising more than 2,200 metres above sea level. They are home to some of the rarest plants and birds found anywhere in the Caribbean. The cool, misty climate makes the region ideal for growing coffee. Jamaican Blue Mountain Coffee is considered one of the finest coffees in the world and is exported to many countries, particularly Japan.

For centuries, the mountains provided shelter for the Maroons, a group of formerly enslaved Africans who escaped from plantations and built free communities in the highlands. They resisted British forces for many years and eventually signed a treaty in 1739 that gave them their freedom.

Today, the Blue Mountains attract hikers and nature lovers from around the world. The trails wind through dense forest and offer stunning views of the island. On clear mornings, some hikers can even see the coast of Cuba from the highest peak.`,
    question: `What can the reader infer about Jamaican Blue Mountain Coffee?`,
    options: ["It is the most affordable coffee in the world.", "It is only popular in Jamaica.", "It has a high reputation because of where and how it is grown.", "It was introduced to Jamaica by British farmers."],
    correctAnswer: 2,
    explanation: `The passage says it is considered one of the finest coffees in the world and is exported to many countries — this suggests a high reputation linked to its growing conditions.`,
  },
  {
    id: 6,
    type: "reading",
    passage: `The Letter

Kezia found the old letter at the bottom of her grandmother's wooden chest. The paper was yellowed and the ink faded, but the words were still clear. It was written by her great-grandmother, Mabel, who had come to Jamaica from India in 1912 as an indentured labourer.

In the letter, Mabel described her first days in Jamaica. She wrote about learning new words, tasting ackee for the first time, and missing the smell of her mother's cooking. She ended the letter with the words: "I do not know what tomorrow holds, but I am still here, and I am still hopeful."

Kezia read the letter three times. She thought about how far her family had come and how much courage it must have taken to travel so far from home. She carefully folded the letter and placed it back in the chest, feeling a strong connection to someone she had never met.`,
    question: `Why did Kezia feel a connection to Mabel at the end of the passage?`,
    options: ["Because Mabel had written about her favourite Jamaican foods", "Because Kezia had visited India and understood Mabel's feelings", "Because reading Mabel's words made her feel close to her family's history", "Because Kezia had also written letters about her life in Jamaica"],
    correctAnswer: 2,
    explanation: `Kezia felt connected because reading Mabel's letter gave her a sense of her family's history and the courage it took to build a new life.`,
  },
  {
    id: 7,
    type: "reading",
    passage: `The Letter

Kezia found the old letter at the bottom of her grandmother's wooden chest. The paper was yellowed and the ink faded, but the words were still clear. It was written by her great-grandmother, Mabel, who had come to Jamaica from India in 1912 as an indentured labourer.

In the letter, Mabel described her first days in Jamaica. She wrote about learning new words, tasting ackee for the first time, and missing the smell of her mother's cooking. She ended the letter with the words: "I do not know what tomorrow holds, but I am still here, and I am still hopeful."

Kezia read the letter three times. She thought about how far her family had come and how much courage it must have taken to travel so far from home. She carefully folded the letter and placed it back in the chest, feeling a strong connection to someone she had never met.`,
    question: `What does the phrase 'indentured labourer' suggest about Mabel's situation?`,
    options: ["She was a wealthy landowner who chose to move to Jamaica.", "She was a teacher who travelled to Jamaica to work in schools.", "She was brought to Jamaica under a contract to work, likely under difficult conditions.", "She was a pirate who sailed the Caribbean."],
    correctAnswer: 2,
    explanation: `An indentured labourer was a worker brought under contract, usually to work in difficult conditions on plantations.`,
  },
  {
    id: 8,
    type: "reading",
    passage: `The Letter

Kezia found the old letter at the bottom of her grandmother's wooden chest. The paper was yellowed and the ink faded, but the words were still clear. It was written by her great-grandmother, Mabel, who had come to Jamaica from India in 1912 as an indentured labourer.

In the letter, Mabel described her first days in Jamaica. She wrote about learning new words, tasting ackee for the first time, and missing the smell of her mother's cooking. She ended the letter with the words: "I do not know what tomorrow holds, but I am still here, and I am still hopeful."

Kezia read the letter three times. She thought about how far her family had come and how much courage it must have taken to travel so far from home. She carefully folded the letter and placed it back in the chest, feeling a strong connection to someone she had never met.`,
    question: `Which words best describe the mood of Mabel's letter?`,
    options: ["Angry and bitter", "Hopeful but uncertain", "Joyful and carefree", "Proud and confident"],
    correctAnswer: 1,
    explanation: `Mabel writes about missing home and the uncertainty of tomorrow, yet says she is 'still hopeful' — suggesting a hopeful but uncertain mood.`,
  },
  {
    id: 9,
    type: "reading",
    passage: `The Letter

Kezia found the old letter at the bottom of her grandmother's wooden chest. The paper was yellowed and the ink faded, but the words were still clear. It was written by her great-grandmother, Mabel, who had come to Jamaica from India in 1912 as an indentured labourer.

In the letter, Mabel described her first days in Jamaica. She wrote about learning new words, tasting ackee for the first time, and missing the smell of her mother's cooking. She ended the letter with the words: "I do not know what tomorrow holds, but I am still here, and I am still hopeful."

Kezia read the letter three times. She thought about how far her family had come and how much courage it must have taken to travel so far from home. She carefully folded the letter and placed it back in the chest, feeling a strong connection to someone she had never met.`,
    question: `The author writes that 'the paper was yellowed and the ink faded.' What does this tell the reader?`,
    options: ["The letter was poorly written and hard to understand.", "The letter was damaged because Kezia had handled it carelessly.", "The letter was very old and had been kept for a long time.", "The letter was written in a foreign language."],
    correctAnswer: 2,
    explanation: `Yellowed paper and faded ink are signs that the letter is very old and has been stored for many years.`,
  },
  {
    id: 10,
    type: "reading",
    passage: `The Letter

Kezia found the old letter at the bottom of her grandmother's wooden chest. The paper was yellowed and the ink faded, but the words were still clear. It was written by her great-grandmother, Mabel, who had come to Jamaica from India in 1912 as an indentured labourer.

In the letter, Mabel described her first days in Jamaica. She wrote about learning new words, tasting ackee for the first time, and missing the smell of her mother's cooking. She ended the letter with the words: "I do not know what tomorrow holds, but I am still here, and I am still hopeful."

Kezia read the letter three times. She thought about how far her family had come and how much courage it must have taken to travel so far from home. She carefully folded the letter and placed it back in the chest, feeling a strong connection to someone she had never met.`,
    question: `What is the main theme of the passage about Kezia and the letter?`,
    options: ["Old objects are often worth a lot of money.", "Writing letters is more meaningful than using technology.", "Connecting with family history gives us a sense of identity and strength.", "Jamaica has always welcomed people from other countries."],
    correctAnswer: 2,
    explanation: `The passage shows how Kezia feels a deep connection and sense of strength from learning about her ancestor Mabel — the theme is about family history and identity.`,
  },
  {
    id: 11,
    type: "vocabulary",
    question: `In the sentence 'The principal gave a brief announcement before class,' what does 'brief' mean?`,
    options: ["Loud and clear", "Short in length", "Difficult to understand", "Planned carefully"],
    correctAnswer: 1,
    explanation: `'Brief' means short in length or duration.`,
  },
  {
    id: 12,
    type: "vocabulary",
    question: `Which word is the best synonym for 'ancient'?`,
    options: ["Modern", "New", "Very old", "Broken"],
    correctAnswer: 2,
    explanation: `'Ancient' means very old, from a long time ago.`,
  },
  {
    id: 13,
    type: "vocabulary",
    question: `What is the antonym of 'timid'?`,
    options: ["Shy", "Quiet", "Bold", "Gentle"],
    correctAnswer: 2,
    explanation: `'Timid' means shy or fearful; its antonym is 'bold,' meaning confident and brave.`,
  },
  {
    id: 14,
    type: "vocabulary",
    question: `In the sentence 'The farmer harvested his crops before the storm arrived,' what does 'harvested' mean?`,
    options: ["Planted seeds in the ground", "Watered the plants with a hose", "Gathered crops from the field when ready", "Covered the field with a sheet"],
    correctAnswer: 2,
    explanation: `'Harvested' means gathered or collected crops that are ready to be used.`,
  },
  {
    id: 15,
    type: "vocabulary",
    question: `Which word best completes the sentence? 'The guide spoke _____ so that everyone in the group could hear her.'`,
    options: ["softly", "carelessly", "clearly", "quickly"],
    correctAnswer: 2,
    explanation: `'Clearly' fits because the guide needed everyone to hear and understand her.`,
  },
  {
    id: 16,
    type: "vocabulary",
    question: `'The children were reluctant to leave the beach.' The word 'reluctant' means:`,
    options: ["excited and eager", "unwilling or hesitant", "tired and sleepy", "angry and frustrated"],
    correctAnswer: 1,
    explanation: `'Reluctant' means not wanting to do something; unwilling or hesitant.`,
  },
  {
    id: 17,
    type: "vocabulary",
    question: `Which word means the same as 'generous'?`,
    options: ["Stingy", "Giving", "Proud", "Clever"],
    correctAnswer: 1,
    explanation: `'Generous' means willing to give; the synonym is 'giving.'`,
  },
  {
    id: 18,
    type: "vocabulary",
    question: `In the sentence 'The athlete demonstrated remarkable speed during the race,' what does 'remarkable' mean?`,
    options: ["Ordinary and expected", "Slow and steady", "Worth noticing; impressive", "Dangerous and risky"],
    correctAnswer: 2,
    explanation: `'Remarkable' means worth noticing or impressive — standing out from the ordinary.`,
  },
  {
    id: 19,
    type: "vocabulary",
    question: `What does 'transparent' mean?`,
    options: ["Very heavy and solid", "Easy to see through", "Colourful and bright", "Hidden from view"],
    correctAnswer: 1,
    explanation: `'Transparent' means clear and easy to see through, like glass.`,
  },
  {
    id: 20,
    type: "vocabulary",
    question: `Which word best completes the sentence? 'The scientist made a careful _____ before writing her report.'`,
    options: ["guess", "celebration", "observation", "argument"],
    correctAnswer: 2,
    explanation: `'Observation' fits — a scientist makes careful observations before writing a report.`,
  },
  {
    id: 21,
    type: "grammar",
    question: `Choose the correct verb: 'Each of the students _____ a book to read.'`,
    options: ["have", "has", "are having", "were having"],
    correctAnswer: 1,
    explanation: `'Each' is always singular, so the correct verb is 'has.'`,
  },
  {
    id: 22,
    type: "grammar",
    question: `Which sentence uses the correct verb tense?`,
    options: ["Yesterday she will go to the store.", "Tomorrow she went to the store.", "Yesterday she went to the store.", "Yesterday she goes to the store."],
    correctAnswer: 2,
    explanation: `'Yesterday' signals past tense. 'Went' is the correct past tense form.`,
  },
  {
    id: 23,
    type: "grammar",
    question: `Choose the sentence with correct subject-verb agreement:`,
    options: ["The bunch of bananas are on the table.", "The bunch of bananas is on the table.", "The bunch of bananas were on the table.", "The bunch of bananas be on the table."],
    correctAnswer: 1,
    explanation: `The subject is 'bunch' (singular), not 'bananas.' A singular subject takes 'is.'`,
  },
  {
    id: 24,
    type: "grammar",
    question: `Which word is an adverb in the sentence: 'She sang beautifully at the concert.'?`,
    options: ["sang", "beautifully", "concert", "at"],
    correctAnswer: 1,
    explanation: `'Beautifully' is an adverb — it describes how she sang.`,
  },
  {
    id: 25,
    type: "grammar",
    question: `Choose the correct possessive for one player: 'The _____ uniform was left on the bench.'`,
    options: ["players", "player's", "players'", "player"],
    correctAnswer: 1,
    explanation: `For one player, the possessive is 'player\'s' (apostrophe before the s).`,
  },
  {
    id: 26,
    type: "grammar",
    question: `Which sentence uses 'their,' 'there,' or 'they're' correctly?`,
    options: ["The children left their bags at the gate.", "The children left there bags at the gate.", "The children left they're bags at the gate.", "The children left theirs bags at the gate."],
    correctAnswer: 0,
    explanation: `'Their' is the correct possessive pronoun showing the bags belong to the children.`,
  },
  {
    id: 27,
    type: "grammar",
    question: `Which of these is a compound sentence?`,
    options: ["The dog barked.", "Running through the yard.", "The dog barked, and the cat ran away.", "Because the rain started."],
    correctAnswer: 2,
    explanation: `A compound sentence joins two independent clauses with a conjunction. 'The dog barked, and the cat ran away.' has two complete ideas joined by 'and.'`,
  },
  {
    id: 28,
    type: "grammar",
    question: `Choose the correct comparative form: 'She is _____ than her brother.'`,
    options: ["more tall", "tallest", "taller", "most tall"],
    correctAnswer: 2,
    explanation: `When comparing two people or things, add '-er' to the adjective: 'taller.'`,
  },
  {
    id: 29,
    type: "grammar",
    question: `Which sentence is in the passive voice?`,
    options: ["The teacher marked the papers.", "The papers were marked by the teacher.", "The teacher marks the papers every day.", "The teacher will mark the papers tomorrow."],
    correctAnswer: 1,
    explanation: `In the passive voice, the subject receives the action. 'The papers were marked by the teacher' is passive.`,
  },
  {
    id: 30,
    type: "grammar",
    question: `Choose the best conjunction: 'We stayed inside _____ it was raining.'`,
    options: ["but", "so", "because", "although"],
    correctAnswer: 2,
    explanation: `'Because' correctly explains the reason for staying inside.`,
  },
  {
    id: 31,
    type: "grammar",
    question: `Which sentence uses commas correctly in a list?`,
    options: ["We bought mangoes, bananas and, pawpaw at the market.", "We bought mangoes, bananas, and pawpaw at the market.", "We bought mangoes bananas, and pawpaw at the market.", "We bought, mangoes, bananas, and pawpaw at the market."],
    correctAnswer: 1,
    explanation: `Items in a list are separated by commas. The correct sentence places commas after each item.`,
  },
  {
    id: 32,
    type: "grammar",
    question: `What type of sentence is: 'Please put away your books.'?`,
    options: ["Declarative", "Interrogative", "Exclamatory", "Imperative"],
    correctAnswer: 3,
    explanation: `An imperative sentence gives a command or instruction. 'Please put away your books' is a polite command.`,
  },
  {
    id: 33,
    type: "writing",
    question: `Choose the correctly spelled word:`,
    options: ["recieve", "receive", "receve", "receeve"],
    correctAnswer: 1,
    explanation: `The correct spelling is 'receive.' Remember the rule: 'i before e, except after c.'`,
  },
  {
    id: 34,
    type: "writing",
    question: `Which sentence has correct capitalization?`,
    options: ["My uncle visited kingston last December.", "my uncle visited Kingston last december.", "My uncle visited Kingston last December.", "My Uncle visited Kingston last december."],
    correctAnswer: 2,
    explanation: `'Kingston' is a proper noun and 'December' is a proper noun (month name); both must be capitalized.`,
  },
  {
    id: 35,
    type: "writing",
    question: `Choose the sentence with correct punctuation of dialogue:`,
    options: ["\"Come here\" said the teacher.", "\"Come here,\" said the teacher.", "\"Come here\" said, the teacher.", "\"Come here, said the teacher.\""],
    correctAnswer: 1,
    explanation: `The spoken words go inside the quotation marks, and the comma comes before the closing quotation mark.`,
  },
  {
    id: 36,
    type: "writing",
    question: `Which is the correct contraction for 'I am'?`,
    options: ["Im", "I'm", "I'am", "Iam"],
    correctAnswer: 1,
    explanation: `The apostrophe in 'I\'m' replaces the missing letter 'a' from 'am.'`,
  },
  {
    id: 37,
    type: "writing",
    question: `Choose the correctly spelled word:`,
    options: ["freind", "frend", "friend", "friende"],
    correctAnswer: 2,
    explanation: `The correct spelling is 'friend.'`,
  },
  {
    id: 38,
    type: "writing",
    question: `Which sentence is correctly punctuated?`,
    options: ["The cake was delicious everyone wanted more.", "The cake was delicious, everyone wanted more.", "The cake was delicious; everyone wanted more.", "The cake was delicious everyone, wanted more."],
    correctAnswer: 2,
    explanation: `A semicolon correctly joins two closely related independent clauses without a conjunction.`,
  },
  {
    id: 39,
    type: "writing",
    question: `What is the correct plural of 'knife'?`,
    options: ["knifes", "knives", "knifves", "knife's"],
    correctAnswer: 1,
    explanation: `For words ending in 'fe,' change 'fe' to 'ves': knife → knives.`,
  },
  {
    id: 40,
    type: "writing",
    question: `Which revision best improves this sentence? 'The boy he studied hard and the boy passed his test.'`,
    options: ["The boy he studied hard and passed his test.", "The boy studied hard, and he passed his test.", "The boy, he studied hard, and passed his test.", "He studied hard the boy, and passed his test."],
    correctAnswer: 1,
    explanation: `The revision removes the redundant pronoun and repeated subject, and correctly uses a comma before 'and.'`,
  },
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate2MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate2Questions : literacyModerate2Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 2</CardTitle>
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
                    <li>- Main idea, inference, and author’s purpose</li>
                    <li>- Word meaning in context, synonyms, antonyms</li>
                    <li>- Grammar, sentence structure, and verb agreement</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 2</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 2 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 2</h1>
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
