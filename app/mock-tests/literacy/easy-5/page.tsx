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

const literacyEasy5Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Sports Day at Bethel Primary

Every year, Bethel Primary School holds its Sports Day in October. Students train for weeks to prepare for the events. This year, Marcia was chosen to run the 100-metre race for Grade 4.

On the morning of Sports Day, Marcia felt nervous. Her stomach felt like it had butterflies inside. Her mother braided her hair and told her, "Just do your best, Marcia." That made Marcia feel a little better.

When the race began, Marcia ran as fast as she could. She crossed the finish line in first place. Her classmates cheered and waved their yellow and green streamers. Mr. Brown, her teacher, shook her hand and said, "Well done!"

At the end of the day, Marcia received a gold medal. She smiled all the way home. That night, she told her little brother, "I am going to train even harder next year."
`,
    question: "What is this passage MAINLY about?",
    options: [
      "The history of Bethel Primary School",
      "How Marcia prepared for and won the 100-metre race",
      "Why October is a good month for sports",
      "The types of events held at Sports Day",
    ],
    correctAnswer: 1,
    explanation: "The passage mainly describes how Marcia trained, competed, and won the 100-metre race at Sports Day."
  },
  {
    id: 2,
    type: "reading",
    passage: `Sports Day at Bethel Primary

Every year, Bethel Primary School holds its Sports Day in October. Students train for weeks to prepare for the events. This year, Marcia was chosen to run the 100-metre race for Grade 4.

On the morning of Sports Day, Marcia felt nervous. Her stomach felt like it had butterflies inside. Her mother braided her hair and told her, "Just do your best, Marcia." That made Marcia feel a little better.

When the race began, Marcia ran as fast as she could. She crossed the finish line in first place. Her classmates cheered and waved their yellow and green streamers. Mr. Brown, her teacher, shook her hand and said, "Well done!"

At the end of the day, Marcia received a gold medal. She smiled all the way home. That night, she told her little brother, "I am going to train even harder next year."
`,
    question: "How did Marcia feel BEFORE the race started?",
    options: [
      "Angry",
      "Bored",
      "Nervous",
      "Proud",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Marcia felt nervous on the morning of Sports Day, and that her stomach felt like it had butterflies inside."
  },
  {
    id: 3,
    type: "reading",
    passage: `Sports Day at Bethel Primary

Every year, Bethel Primary School holds its Sports Day in October. Students train for weeks to prepare for the events. This year, Marcia was chosen to run the 100-metre race for Grade 4.

On the morning of Sports Day, Marcia felt nervous. Her stomach felt like it had butterflies inside. Her mother braided her hair and told her, "Just do your best, Marcia." That made Marcia feel a little better.

When the race began, Marcia ran as fast as she could. She crossed the finish line in first place. Her classmates cheered and waved their yellow and green streamers. Mr. Brown, her teacher, shook her hand and said, "Well done!"

At the end of the day, Marcia received a gold medal. She smiled all the way home. That night, she told her little brother, "I am going to train even harder next year."
`,
    question: "What did Marcia receive at the end of Sports Day?",
    options: [
      "A trophy",
      "A ribbon",
      "A gold medal",
      "A blue streamer",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that at the end of the day, Marcia received a gold medal."
  },
  {
    id: 4,
    type: "reading",
    passage: `Sports Day at Bethel Primary

Every year, Bethel Primary School holds its Sports Day in October. Students train for weeks to prepare for the events. This year, Marcia was chosen to run the 100-metre race for Grade 4.

On the morning of Sports Day, Marcia felt nervous. Her stomach felt like it had butterflies inside. Her mother braided her hair and told her, "Just do your best, Marcia." That made Marcia feel a little better.

When the race began, Marcia ran as fast as she could. She crossed the finish line in first place. Her classmates cheered and waved their yellow and green streamers. Mr. Brown, her teacher, shook her hand and said, "Well done!"

At the end of the day, Marcia received a gold medal. She smiled all the way home. That night, she told her little brother, "I am going to train even harder next year."
`,
    question: "What did Marcia's mother tell her before the race?",
    options: [
      "Train harder next time.",
      "You will win for sure.",
      "Run slowly and save your energy.",
      "Just do your best.",
    ],
    correctAnswer: 3,
    explanation: "The passage says Marcia's mother told her, 'Just do your best, Marcia.'"
  },
  {
    id: 5,
    type: "reading",
    passage: `Sports Day at Bethel Primary

Every year, Bethel Primary School holds its Sports Day in October. Students train for weeks to prepare for the events. This year, Marcia was chosen to run the 100-metre race for Grade 4.

On the morning of Sports Day, Marcia felt nervous. Her stomach felt like it had butterflies inside. Her mother braided her hair and told her, "Just do your best, Marcia." That made Marcia feel a little better.

When the race began, Marcia ran as fast as she could. She crossed the finish line in first place. Her classmates cheered and waved their yellow and green streamers. Mr. Brown, her teacher, shook her hand and said, "Well done!"

At the end of the day, Marcia received a gold medal. She smiled all the way home. That night, she told her little brother, "I am going to train even harder next year."
`,
    question: "Which event happened LAST in the story?",
    options: [
      "Marcia crossed the finish line first.",
      "Mr. Brown shook Marcia's hand.",
      "Marcia's mother braided her hair.",
      "Marcia told her brother she would train harder next year.",
    ],
    correctAnswer: 3,
    explanation: "The last event in the story is Marcia telling her little brother she would train even harder next year — this happened that night after she returned home."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Breadfruit Tree

Breadfruit is a large, round fruit that grows on tall trees. It is one of Jamaica's most important food crops. The skin of the breadfruit is rough and green, and the inside is soft and creamy when cooked.

Breadfruit trees grow in warm, sunny places. They need plenty of rainfall to grow well. A single breadfruit tree can produce hundreds of fruits in one year. The fruit can be roasted, boiled, fried, or baked.

Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793. Jamaicans soon discovered how tasty and filling breadfruit could be. Today, roasted breadfruit is eaten at breakfast, lunch, and dinner across the island.

Breadfruit is not only delicious — it is also nutritious. It contains vitamins and minerals that help the body stay healthy. Many Jamaicans say that a meal with roasted breadfruit is one of the best meals there is.
`,
    question: "Where did the first breadfruit plants in Jamaica come from?",
    options: [
      "Tahiti",
      "Barbados",
      "Africa",
      "England",
    ],
    correctAnswer: 0,
    explanation: "The passage clearly states that Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Breadfruit Tree

Breadfruit is a large, round fruit that grows on tall trees. It is one of Jamaica's most important food crops. The skin of the breadfruit is rough and green, and the inside is soft and creamy when cooked.

Breadfruit trees grow in warm, sunny places. They need plenty of rainfall to grow well. A single breadfruit tree can produce hundreds of fruits in one year. The fruit can be roasted, boiled, fried, or baked.

Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793. Jamaicans soon discovered how tasty and filling breadfruit could be. Today, roasted breadfruit is eaten at breakfast, lunch, and dinner across the island.

Breadfruit is not only delicious — it is also nutritious. It contains vitamins and minerals that help the body stay healthy. Many Jamaicans say that a meal with roasted breadfruit is one of the best meals there is.
`,
    question: "What does the OUTSIDE of a breadfruit look like?",
    options: [
      "Smooth and yellow",
      "Red and shiny",
      "Rough and green",
      "Brown and wrinkled",
    ],
    correctAnswer: 2,
    explanation: "The passage states that the skin of the breadfruit is rough and green."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Breadfruit Tree

Breadfruit is a large, round fruit that grows on tall trees. It is one of Jamaica's most important food crops. The skin of the breadfruit is rough and green, and the inside is soft and creamy when cooked.

Breadfruit trees grow in warm, sunny places. They need plenty of rainfall to grow well. A single breadfruit tree can produce hundreds of fruits in one year. The fruit can be roasted, boiled, fried, or baked.

Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793. Jamaicans soon discovered how tasty and filling breadfruit could be. Today, roasted breadfruit is eaten at breakfast, lunch, and dinner across the island.

Breadfruit is not only delicious — it is also nutritious. It contains vitamins and minerals that help the body stay healthy. Many Jamaicans say that a meal with roasted breadfruit is one of the best meals there is.
`,
    question: "Which person brought breadfruit plants to Jamaica?",
    options: [
      "Mr. Brown",
      "Captain William Bligh",
      "A Jamaican farmer",
      "A French sailor",
    ],
    correctAnswer: 1,
    explanation: "The passage states that Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Breadfruit Tree

Breadfruit is a large, round fruit that grows on tall trees. It is one of Jamaica's most important food crops. The skin of the breadfruit is rough and green, and the inside is soft and creamy when cooked.

Breadfruit trees grow in warm, sunny places. They need plenty of rainfall to grow well. A single breadfruit tree can produce hundreds of fruits in one year. The fruit can be roasted, boiled, fried, or baked.

Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793. Jamaicans soon discovered how tasty and filling breadfruit could be. Today, roasted breadfruit is eaten at breakfast, lunch, and dinner across the island.

Breadfruit is not only delicious — it is also nutritious. It contains vitamins and minerals that help the body stay healthy. Many Jamaicans say that a meal with roasted breadfruit is one of the best meals there is.
`,
    question: "In what year did breadfruit first arrive in Jamaica?",
    options: [
      "1793",
      "1863",
      "1692",
      "1900",
    ],
    correctAnswer: 0,
    explanation: "The passage clearly states that Captain William Bligh brought breadfruit to Jamaica in 1793."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Breadfruit Tree

Breadfruit is a large, round fruit that grows on tall trees. It is one of Jamaica's most important food crops. The skin of the breadfruit is rough and green, and the inside is soft and creamy when cooked.

Breadfruit trees grow in warm, sunny places. They need plenty of rainfall to grow well. A single breadfruit tree can produce hundreds of fruits in one year. The fruit can be roasted, boiled, fried, or baked.

Captain William Bligh brought the first breadfruit plants to Jamaica from Tahiti in 1793. Jamaicans soon discovered how tasty and filling breadfruit could be. Today, roasted breadfruit is eaten at breakfast, lunch, and dinner across the island.

Breadfruit is not only delicious — it is also nutritious. It contains vitamins and minerals that help the body stay healthy. Many Jamaicans say that a meal with roasted breadfruit is one of the best meals there is.
`,
    question: "What is the BEST title for this passage?",
    options: [
      "How to Cook Breadfruit",
      "Captain William Bligh's Journey",
      "Breadfruit: Jamaica's Important Crop",
      "Fruits That Grow in Warm Places",
    ],
    correctAnswer: 2,
    explanation: "The passage mainly discusses what breadfruit is, how it grows, its history in Jamaica, and why it is important. Option C best captures all these ideas."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The dog ran swiftly across the yard.\" The word \"swiftly\" means —",
    options: [
      "slowly",
      "lazily",
      "quietly",
      "quickly",
    ],
    correctAnswer: 3,
    explanation: "Swiftly means quickly or at great speed."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \"ancient\"?",
    options: [
      "old",
      "modern",
      "broken",
      "large",
    ],
    correctAnswer: 1,
    explanation: "The opposite of ancient (very old) is modern (belonging to the present time)."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The children were DELIGHTED when they heard the news.\" The word \"delighted\" means —",
    options: [
      "angry",
      "afraid",
      "very happy",
      "confused",
    ],
    correctAnswer: 2,
    explanation: "Delighted means filled with great joy or very happy."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \"large\"?",
    options: [
      "tiny",
      "round",
      "heavy",
      "enormous",
    ],
    correctAnswer: 3,
    explanation: "Enormous means very large — it is a synonym for large."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Mama told Kezia to tidy her CLUTTERED room.\" The word \"cluttered\" means —",
    options: [
      "clean",
      "messy",
      "dark",
      "small",
    ],
    correctAnswer: 1,
    explanation: "Cluttered means untidy and full of things — it means the room was messy."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \"brave\"?",
    options: [
      "bold",
      "cowardly",
      "strong",
      "clever",
    ],
    correctAnswer: 1,
    explanation: "The opposite of brave is cowardly — a coward is someone who is not brave."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The fruit was RIPE and ready to eat.\" The word \"ripe\" means —",
    options: [
      "sour and unready",
      "hard and green",
      "fully grown and ready",
      "soft and rotten",
    ],
    correctAnswer: 2,
    explanation: "Ripe means fully grown and ready to eat."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "What is the PLURAL of the word \"leaf\"?",
    options: [
      "leafs",
      "leafes",
      "leaved",
      "leaves",
    ],
    correctAnswer: 3,
    explanation: "The correct plural of leaf is leaves — words ending in -f often change to -ves in the plural."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"She spoke in a HUSHED voice in the library.\" The word \"hushed\" means —",
    options: [
      "very loud",
      "very soft and quiet",
      "rude and angry",
      "slow and boring",
    ],
    correctAnswer: 1,
    explanation: "Hushed means soft and quiet. People use hushed voices to avoid disturbing others."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \"tired\"?",
    options: [
      "weary",
      "alert",
      "hungry",
      "cheerful",
    ],
    correctAnswer: 0,
    explanation: "Weary means tired and in need of rest — it is a synonym for tired."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"The children ___ playing in the yard.\"",
    options: [
      "was",
      "are",
      "is",
      "am",
    ],
    correctAnswer: 1,
    explanation: "The subject 'the children' is plural, so the correct verb is 'are'. 'Was' and 'is' are used with singular subjects."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a NOUN? \"The dog barked at the gate.\"",
    options: [
      "barked",
      "at",
      "dog",
      "the",
    ],
    correctAnswer: 2,
    explanation: "A noun is a person, place, or thing. 'Dog' is a noun (a thing/animal). 'Barked' is a verb and 'at' is a preposition."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence has the CORRECT punctuation at the end?",
    options: [
      "Did you eat your breakfast.",
      "Did you eat your breakfast?",
      "Did you eat your breakfast!",
      "Did you eat your breakfast,",
    ],
    correctAnswer: 1,
    explanation: "A question must end with a question mark (?). 'Did you eat your breakfast?' is a question."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"There is ___ orange on the table.\"",
    options: [
      "a",
      "an",
      "the",
      "some",
    ],
    correctAnswer: 1,
    explanation: "We use 'an' before words that begin with a vowel sound. 'Orange' starts with the vowel sound 'o', so we say 'an orange'."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses a CAPITAL LETTER correctly?",
    options: [
      "We visited Kingston city last weekend.",
      "we visited Kingston last weekend.",
      "We visited kingston last weekend.",
      "We Visited Kingston Last Weekend.",
    ],
    correctAnswer: 0,
    explanation: "A sentence must begin with a capital letter, and proper nouns like 'Kingston' must be capitalised. Only option A follows both rules correctly."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADJECTIVE? \"The tall boy jumped over the fence.\"",
    options: [
      "jumped",
      "fence",
      "over",
      "tall",
    ],
    correctAnswer: 3,
    explanation: "An adjective describes a noun. 'Tall' describes the noun 'boy', so it is the adjective."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"Marcus ___ his homework before dinner.\"",
    options: [
      "done",
      "did",
      "doing",
      "does",
    ],
    correctAnswer: 1,
    explanation: "The sentence is in the past tense. 'Did' is the correct simple past form of 'do'."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence shows CORRECT use of an apostrophe?",
    options: [
      "The bag's belonging to Maria.",
      "The bag belong's to Maria.",
      "The bag belong to Maria.",
      "Maria's bag was on the chair.",
    ],
    correctAnswer: 3,
    explanation: "An apostrophe is used to show possession. 'Maria's bag' correctly shows that the bag belongs to Maria."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word to fill in the blank: \"She ran faster ___ all the other girls.\"",
    options: [
      "then",
      "that",
      "than",
      "those",
    ],
    correctAnswer: 2,
    explanation: "'Than' is used in comparisons. 'Then' refers to time. The correct word here is 'than'."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "My mother and me went to the market.",
      "My mother and I went to the market.",
      "My mother and myself went to the market.",
      "Me and my mother went to the market.",
    ],
    correctAnswer: 1,
    explanation: "When listing yourself with others as the subject of a sentence, use 'I', not 'me' or 'myself'. 'My mother and I went to the market' is correct."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is a PRONOUN in this sentence? \"She placed the books on the shelf.\"",
    options: [
      "placed",
      "books",
      "shelf",
      "She",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. 'She' is a pronoun that replaces the name of a person."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"The teacher spoke ___ to the class.\"",
    options: [
      "quiet",
      "quietly",
      "quietness",
      "quieter",
    ],
    correctAnswer: 1,
    explanation: "An adverb modifies a verb. 'Quietly' is the adverb that correctly describes how the teacher spoke."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence would make the BEST opening sentence for a paragraph about a trip to the beach?",
    options: [
      "Sand is made of tiny pieces of rock and shell.",
      "Last Saturday, my family visited Hellshire Beach for the first time.",
      "The sun was setting slowly behind the mountains.",
      "There are many beaches in Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "A strong opening sentence introduces the specific topic clearly. Option B names the event, the place, and gives the reader a reason to keep reading."
  },
  {
    id: 34,
    type: "writing",
    question: "Read the paragraph. Which sentence does NOT belong? \"Our school has a beautiful garden. The students water the plants every morning. Dogs make good pets. The principal is proud of our garden.\"",
    options: [
      "Our school has a beautiful garden.",
      "The students water the plants every morning.",
      "Dogs make good pets.",
      "The principal is proud of our garden.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about the school garden. 'Dogs make good pets' is completely unrelated and does not belong."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence would make the BEST closing sentence for a paragraph about why exercise is important?",
    options: [
      "Exercise helps us run faster in sports.",
      "Some people do not like to exercise.",
      "Therefore, we should all try to exercise every day to stay healthy and strong.",
      "Gyms have a lot of different equipment.",
    ],
    correctAnswer: 2,
    explanation: "A closing sentence sums up the main idea and brings the paragraph to a satisfying end. Option C restates the main idea clearly and uses a transition word 'therefore'."
  },
  {
    id: 36,
    type: "writing",
    question: "Which of these words is spelled CORRECTLY?",
    options: [
      "beleive",
      "recieve",
      "believe",
      "beleeve",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is 'believe'. Remember the rule: 'i before e except after c'."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The hungry puppy ___ all the food in its bowl.\"",
    options: [
      "see",
      "looked",
      "devoured",
      "touched",
    ],
    correctAnswer: 2,
    explanation: "'Devoured' means to eat something very quickly and eagerly — it is the most precise and vivid word choice for a hungry puppy."
  },
  {
    id: 38,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph about the importance of reading?",
    options: [
      "Reading every day helps us learn new words and ideas.",
      "I enjoy reading books about animals.",
      "The school library has many books on the shelves.",
      "My favourite book is about a girl named Maya.",
    ],
    correctAnswer: 0,
    explanation: "A topic sentence states the main idea of the paragraph. Option A makes a clear, general statement about the importance of reading that could be supported by the rest of the paragraph."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. Then she poured the mixture into a pan and baked it. 2. First, Grandma gathered all the ingredients for the cake. 3. Finally, the delicious cake was ready to eat. 4. Next, she mixed the flour, eggs, butter, and sugar together.",
    options: [
      "1, 2, 3, 4",
      "3, 4, 1, 2",
      "2, 4, 1, 3",
      "4, 1, 3, 2",
    ],
    correctAnswer: 2,
    explanation: "The correct logical order is: gather ingredients (2), mix them (4), bake the mixture (1), and finally the cake is ready (3). This gives sequence 2, 4, 1, 3."
  },
  {
    id: 40,
    type: "writing",
    question: "Which detail would BEST improve this sentence? \"Marcus went to the shop.\"",
    options: [
      "The shop was far away.",
      "Marcus quickly ran to the corner shop to buy bread for his mother.",
      "He likes to go shopping.",
      "Shops sell many things.",
    ],
    correctAnswer: 1,
    explanation: "Option B adds specific detail — why Marcus went, how he went, and what he bought. This makes the sentence much more informative and vivid."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy5MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy5Questions : literacyEasy5Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 5</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question easy-level literacy test with reports and explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Easy-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Direct recall and clear text clues</li>
                    <li>- Basic grammar, vocabulary, and punctuation</li>
                    <li>- Comprehension, sequencing, and spelling</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 5</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 5 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 5</h1>
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
