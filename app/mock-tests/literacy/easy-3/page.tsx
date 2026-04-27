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

const literacyEasy3Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The School Library

The library at Riverside Primary was one of the students' favourite places. It was a quiet room with tall wooden shelves filled with books of every kind. There were books about animals, history, adventure, science, and poetry. The librarian, Mrs. Ferguson, kept everything neat and in order.

Every Tuesday, the Grade 4 class visited the library. Students were allowed to borrow two books each week. Mrs. Ferguson always helped anyone who was unsure about which book to choose. She believed that the right book could change a child's life.

One Tuesday, a boy named Devon could not decide between a book about sea creatures and one about the Jamaican rainforest. Mrs. Ferguson suggested he borrow both. Devon smiled and tucked both books under his arm.

That evening, Devon read until his mother called him for dinner three times. When he finally came to the table, he told his family everything he had learned about the blue-ringed octopus. His little sister listened with wide eyes, and even his father put down his newspaper to hear more.`,
    question: "What is this passage MAINLY about?",
    options: [
      "How to choose a good book",
      "The school library and how Devon enjoyed reading",
      "Why Mrs. Ferguson became a librarian",
      "The different types of books sold in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage is mainly about the school library and how a student named Devon discovered a love of reading with the help of the librarian."
  },
  {
    id: 2,
    type: "reading",
    passage: `The School Library

The library at Riverside Primary was one of the students' favourite places. It was a quiet room with tall wooden shelves filled with books of every kind. There were books about animals, history, adventure, science, and poetry. The librarian, Mrs. Ferguson, kept everything neat and in order.

Every Tuesday, the Grade 4 class visited the library. Students were allowed to borrow two books each week. Mrs. Ferguson always helped anyone who was unsure about which book to choose. She believed that the right book could change a child's life.

One Tuesday, a boy named Devon could not decide between a book about sea creatures and one about the Jamaican rainforest. Mrs. Ferguson suggested he borrow both. Devon smiled and tucked both books under his arm.

That evening, Devon read until his mother called him for dinner three times. When he finally came to the table, he told his family everything he had learned about the blue-ringed octopus. His little sister listened with wide eyes, and even his father put down his newspaper to hear more.`,
    question: "When did the Grade 4 class visit the library?",
    options: [
      "Every Monday",
      "Every Wednesday",
      "Every Tuesday",
      "Every Friday",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that every Tuesday the Grade 4 class visited the library."
  },
  {
    id: 3,
    type: "reading",
    passage: `The School Library

The library at Riverside Primary was one of the students' favourite places. It was a quiet room with tall wooden shelves filled with books of every kind. There were books about animals, history, adventure, science, and poetry. The librarian, Mrs. Ferguson, kept everything neat and in order.

Every Tuesday, the Grade 4 class visited the library. Students were allowed to borrow two books each week. Mrs. Ferguson always helped anyone who was unsure about which book to choose. She believed that the right book could change a child's life.

One Tuesday, a boy named Devon could not decide between a book about sea creatures and one about the Jamaican rainforest. Mrs. Ferguson suggested he borrow both. Devon smiled and tucked both books under his arm.

That evening, Devon read until his mother called him for dinner three times. When he finally came to the table, he told his family everything he had learned about the blue-ringed octopus. His little sister listened with wide eyes, and even his father put down his newspaper to hear more.`,
    question: "How many books were students allowed to borrow each week?",
    options: [
      "One book",
      "Two books",
      "Three books",
      "As many as they liked",
    ],
    correctAnswer: 1,
    explanation: "The passage states that students were allowed to borrow two books each week."
  },
  {
    id: 4,
    type: "reading",
    passage: `The School Library

The library at Riverside Primary was one of the students' favourite places. It was a quiet room with tall wooden shelves filled with books of every kind. There were books about animals, history, adventure, science, and poetry. The librarian, Mrs. Ferguson, kept everything neat and in order.

Every Tuesday, the Grade 4 class visited the library. Students were allowed to borrow two books each week. Mrs. Ferguson always helped anyone who was unsure about which book to choose. She believed that the right book could change a child's life.

One Tuesday, a boy named Devon could not decide between a book about sea creatures and one about the Jamaican rainforest. Mrs. Ferguson suggested he borrow both. Devon smiled and tucked both books under his arm.

That evening, Devon read until his mother called him for dinner three times. When he finally came to the table, he told his family everything he had learned about the blue-ringed octopus. His little sister listened with wide eyes, and even his father put down his newspaper to hear more.`,
    question: "Which two books did Devon borrow?",
    options: [
      "A book about birds and a book about rivers",
      "A book about sea creatures and a book about the Jamaican rainforest",
      "A book about history and a book about science",
      "A book about adventure and a book about poetry",
    ],
    correctAnswer: 1,
    explanation: "The passage says Devon could not decide between a book about sea creatures and one about the Jamaican rainforest, so Mrs. Ferguson suggested he borrow both."
  },
  {
    id: 5,
    type: "reading",
    passage: `The School Library

The library at Riverside Primary was one of the students' favourite places. It was a quiet room with tall wooden shelves filled with books of every kind. There were books about animals, history, adventure, science, and poetry. The librarian, Mrs. Ferguson, kept everything neat and in order.

Every Tuesday, the Grade 4 class visited the library. Students were allowed to borrow two books each week. Mrs. Ferguson always helped anyone who was unsure about which book to choose. She believed that the right book could change a child's life.

One Tuesday, a boy named Devon could not decide between a book about sea creatures and one about the Jamaican rainforest. Mrs. Ferguson suggested he borrow both. Devon smiled and tucked both books under his arm.

That evening, Devon read until his mother called him for dinner three times. When he finally came to the table, he told his family everything he had learned about the blue-ringed octopus. His little sister listened with wide eyes, and even his father put down his newspaper to hear more.`,
    question: "What did Devon tell his family at dinner?",
    options: [
      "He told them about the Jamaican rainforest.",
      "He told them he had forgotten to return his library books.",
      "He told them everything he had learned about the blue-ringed octopus.",
      "He told them Mrs. Ferguson had given him extra homework.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Devon told his family everything he had learned about the blue-ringed octopus."
  },
  {
    id: 6,
    type: "reading",
    passage: `Flooding in Jamaica

Jamaica is a beautiful island, but it faces a serious challenge during the rainy season — flooding. Heavy rainfall can cause rivers to overflow their banks and water to rush into streets, yards, and homes. This happens most often in low-lying communities that are close to rivers or the sea.

Flooding can damage homes and roads and wash away crops that farmers have worked hard to grow. It can also make it dangerous or impossible for children to get to school. After a flood, families sometimes have to leave their homes until the water goes down and the area is safe again.

The Jamaican government and disaster agencies work together to prepare communities before flooding occurs. They issue warnings so that people have time to move to higher ground or to a safe shelter. Schools and community centres are often used as emergency shelters during bad weather.

Learning about flooding and how to stay safe is important for every Jamaican. Simple steps, such as clearing drains and knowing your local evacuation route, can help protect families when heavy rains come.`,
    question: "What is the MAIN TOPIC of this passage?",
    options: [
      "How the Jamaican government earns money",
      "The beauty of Jamaica\\'s rivers and coastline",
      "Flooding in Jamaica — what causes it and how to stay safe",
      "How to build a house near a river",
    ],
    correctAnswer: 2,
    explanation: "The passage covers what flooding is, what damage it causes, how the government prepares communities, and how families can stay safe."
  },
  {
    id: 7,
    type: "reading",
    passage: `Flooding in Jamaica

Jamaica is a beautiful island, but it faces a serious challenge during the rainy season — flooding. Heavy rainfall can cause rivers to overflow their banks and water to rush into streets, yards, and homes. This happens most often in low-lying communities that are close to rivers or the sea.

Flooding can damage homes and roads and wash away crops that farmers have worked hard to grow. It can also make it dangerous or impossible for children to get to school. After a flood, families sometimes have to leave their homes until the water goes down and the area is safe again.

The Jamaican government and disaster agencies work together to prepare communities before flooding occurs. They issue warnings so that people have time to move to higher ground or to a safe shelter. Schools and community centres are often used as emergency shelters during bad weather.

Learning about flooding and how to stay safe is important for every Jamaican. Simple steps, such as clearing drains and knowing your local evacuation route, can help protect families when heavy rains come.`,
    question: "Which communities are MOST at risk of flooding?",
    options: [
      "Communities high in the mountains",
      "Low-lying communities close to rivers or the sea",
      "Communities far away from any water",
      "Communities near schools and churches",
    ],
    correctAnswer: 1,
    explanation: "The passage states that flooding happens most often in low-lying communities that are close to rivers or the sea."
  },
  {
    id: 8,
    type: "reading",
    passage: `Flooding in Jamaica

Jamaica is a beautiful island, but it faces a serious challenge during the rainy season — flooding. Heavy rainfall can cause rivers to overflow their banks and water to rush into streets, yards, and homes. This happens most often in low-lying communities that are close to rivers or the sea.

Flooding can damage homes and roads and wash away crops that farmers have worked hard to grow. It can also make it dangerous or impossible for children to get to school. After a flood, families sometimes have to leave their homes until the water goes down and the area is safe again.

The Jamaican government and disaster agencies work together to prepare communities before flooding occurs. They issue warnings so that people have time to move to higher ground or to a safe shelter. Schools and community centres are often used as emergency shelters during bad weather.

Learning about flooding and how to stay safe is important for every Jamaican. Simple steps, such as clearing drains and knowing your local evacuation route, can help protect families when heavy rains come.`,
    question: "Which buildings are OFTEN used as emergency shelters during bad weather?",
    options: [
      "Police stations and hospitals",
      "Banks and post offices",
      "Schools and community centres",
      "Libraries and supermarkets",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that schools and community centres are often used as emergency shelters during bad weather."
  },
  {
    id: 9,
    type: "reading",
    passage: `Flooding in Jamaica

Jamaica is a beautiful island, but it faces a serious challenge during the rainy season — flooding. Heavy rainfall can cause rivers to overflow their banks and water to rush into streets, yards, and homes. This happens most often in low-lying communities that are close to rivers or the sea.

Flooding can damage homes and roads and wash away crops that farmers have worked hard to grow. It can also make it dangerous or impossible for children to get to school. After a flood, families sometimes have to leave their homes until the water goes down and the area is safe again.

The Jamaican government and disaster agencies work together to prepare communities before flooding occurs. They issue warnings so that people have time to move to higher ground or to a safe shelter. Schools and community centres are often used as emergency shelters during bad weather.

Learning about flooding and how to stay safe is important for every Jamaican. Simple steps, such as clearing drains and knowing your local evacuation route, can help protect families when heavy rains come.`,
    question: "According to the passage, what is ONE simple step families can take to help protect themselves from flooding?",
    options: [
      "Move to another country during the rainy season",
      "Build their homes out of concrete",
      "Clear drains and know their local evacuation route",
      "Plant more trees inside their homes",
    ],
    correctAnswer: 2,
    explanation: "The passage mentions clearing drains and knowing your local evacuation route as simple steps that can help protect families when heavy rains come."
  },
  {
    id: 10,
    type: "reading",
    passage: `Flooding in Jamaica

Jamaica is a beautiful island, but it faces a serious challenge during the rainy season — flooding. Heavy rainfall can cause rivers to overflow their banks and water to rush into streets, yards, and homes. This happens most often in low-lying communities that are close to rivers or the sea.

Flooding can damage homes and roads and wash away crops that farmers have worked hard to grow. It can also make it dangerous or impossible for children to get to school. After a flood, families sometimes have to leave their homes until the water goes down and the area is safe again.

The Jamaican government and disaster agencies work together to prepare communities before flooding occurs. They issue warnings so that people have time to move to higher ground or to a safe shelter. Schools and community centres are often used as emergency shelters during bad weather.

Learning about flooding and how to stay safe is important for every Jamaican. Simple steps, such as clearing drains and knowing your local evacuation route, can help protect families when heavy rains come.`,
    question: "Which event happens FIRST during a flood warning?",
    options: [
      "Families return home after the water goes down.",
      "Schools and community centres are used as shelters.",
      "The government and disaster agencies issue warnings.",
      "Crops are washed away by rushing water.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that authorities issue warnings so that people have time to move to higher ground or a shelter. This happens before people evacuate or shelters fill up."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Mrs. Ferguson kept the library neat and in ORDER.\" The word \\'order\\' in this sentence means —",
    options: [
      "a command given by a teacher",
      "a request for food at a restaurant",
      "a tidy, organised arrangement",
      "a letter sent through the post",
    ],
    correctAnswer: 2,
    explanation: "In this context, \\'order\\' means a tidy and organised arrangement. Mrs. Ferguson kept everything neatly arranged."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'serious\\'?",
    options: [
      "funny",
      "unimportant",
      "grave",
      "cheerful",
    ],
    correctAnswer: 2,
    explanation: "Synonyms are words with the same or similar meaning. Grave means serious and important — it is a synonym for serious."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The river OVERFLOWED its banks after the heavy rain.\" The word \\'overflowed\\' means —",
    options: [
      "dried up completely",
      "ran over the edges because it was too full",
      "turned a different colour",
      "slowed down and stopped",
    ],
    correctAnswer: 1,
    explanation: "To overflow means to flow over the edge of a container or boundary because it is too full. The river rose too high and spilled over its banks."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'danger\\'?",
    options: [
      "risk",
      "safety",
      "fear",
      "caution",
    ],
    correctAnswer: 1,
    explanation: "The opposite of danger is safety. When there is no danger, people are safe."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Devon was UNSURE about which book to choose.\" The word \\'unsure\\' means —",
    options: [
      "confident and ready",
      "not certain; not sure",
      "excited and happy",
      "tired and bored",
    ],
    correctAnswer: 1,
    explanation: "Unsure means not certain or not confident about something. Devon could not make up his mind."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "What is the correct PLURAL of the word \\'shelf\\'?",
    options: [
      "shelfs",
      "shelves",
      "shelfes",
      "shelf",
    ],
    correctAnswer: 1,
    explanation: "The correct plural of shelf is shelves. Words ending in -f or -fe often change to -ves in the plural."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The government issued WARNINGS before the storm.\" The word \\'warnings\\' means —",
    options: [
      "celebrations held before an event",
      "notices that tell people about possible danger",
      "rules that must be followed at school",
      "lists of things to buy at the market",
    ],
    correctAnswer: 1,
    explanation: "A warning is a notice or message that alerts people to possible danger so they can take action to stay safe."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "enviroment",
      "envirenment",
      "environment",
      "envirement",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is environment — e-n-v-i-r-o-n-m-e-n-t."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The librarian SUGGESTED Devon borrow both books.\" The word \\'suggested\\' means —",
    options: [
      "ordered",
      "refused",
      "recommended",
      "demanded",
    ],
    correctAnswer: 2,
    explanation: "To suggest means to put forward an idea for someone to consider. Mrs. Ferguson recommended that Devon take both books."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'damage\\'?",
    options: [
      "repair",
      "protect",
      "harm",
      "build",
    ],
    correctAnswer: 2,
    explanation: "A synonym has the same or similar meaning. To harm something means to damage it — harm is a synonym for damage."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"The books ___ on the top shelf of the library.\"",
    options: [
      "was",
      "is",
      "am",
      "are",
    ],
    correctAnswer: 3,
    explanation: "The subject \\'the books\\' is plural, so the correct verb is \\'are.\\' \\'Was\\' and \\'is\\' are used with singular subjects."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a NOUN? \"The heavy rain flooded the road.\"",
    options: [
      "flooded",
      "heavy",
      "the",
      "road",
    ],
    correctAnswer: 3,
    explanation: "A noun is a person, place, thing, or idea. \\'Road\\' is a thing — it is a noun. \\'Flooded\\' is a verb and \\'heavy\\' is an adjective."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence is punctuated CORRECTLY?",
    options: [
      "Wow that is amazing",
      "Wow that is amazing.",
      "Wow, that is amazing!",
      "Wow that is amazing!",
    ],
    correctAnswer: 2,
    explanation: "An exclamatory sentence ends with an exclamation mark. A comma is also needed after the interjection \\'Wow.\\' Option C follows both rules correctly."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"He is ___ honest student.\"",
    options: [
      "a",
      "an",
      "the",
      "some",
    ],
    correctAnswer: 1,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Honest\\' starts with the vowel sound \\'o\\' (the \\'h\\' is silent), so we say \\'an honest student.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which word in this sentence is an ADJECTIVE? \"The little girl carried a colourful umbrella.\"",
    options: [
      "carried",
      "umbrella",
      "colourful",
      "girl",
    ],
    correctAnswer: 2,
    explanation: "An adjective is a word that describes a noun. \\'Colourful\\' describes the umbrella — it is the adjective. (\\'Little\\' also describes \\'girl\\' but \\'colourful\\' is one of the listed options.)"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the correct word: \"Neither Marcus nor his sister ___ ready for school.\"",
    options: [
      "are",
      "were",
      "am",
      "was",
    ],
    correctAnswer: 3,
    explanation: "When \\'neither...nor\\' joins two singular subjects, the verb agrees with the subject closest to it. \\'His sister\\' is singular, so the correct verb is \\'was.\\'"
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence is in the FUTURE TENSE?",
    options: [
      "The children played in the yard.",
      "The children are playing in the yard.",
      "The children will play in the yard.",
      "The children played and laughed in the yard.",
    ],
    correctAnswer: 2,
    explanation: "The future tense uses \\'will\\' + the base verb. \\'The children will play\\' correctly uses the future tense."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses CORRECT punctuation with a list?",
    options: [
      "We need pencils erasers rulers and paper.",
      "We need pencils, erasers, rulers, and paper.",
      "We need, pencils, erasers rulers and paper.",
      "We need pencils erasers, rulers and, paper.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list must be separated by commas. Option B correctly places a comma after each item in the list."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"She sings more BEAUTIFULLY ___ anyone else in the choir.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' when making a comparison. \\'Then\\' refers to time or sequence. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "The team of players are warming up on the field.",
      "The team of players is warming up on the field.",
      "The team of players were warming up on the field.",
      "The team of players am warming up on the field.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \\'team,\\' which is a collective noun treated as singular. The correct singular verb is \\'is.\\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"They decorated the classroom for the concert.\"",
    options: [
      "decorated",
      "classroom",
      "concert",
      "They",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'They\\' stands in place of a group of people — it is the pronoun in this sentence."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the word that BEST completes this sentence: \"The puppy ran ___ across the yard.\"",
    options: [
      "quick",
      "quicker",
      "quickest",
      "quickly",
    ],
    correctAnswer: 3,
    explanation: "An adverb describes how an action is done. \\'Quickly\\' is the adverb that correctly describes how the puppy ran."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence would make the BEST opening sentence for a paragraph about National Heroes Day in Jamaica?",
    options: [
      "Jamaica has several national heroes.",
      "Every year on the third Monday in October, Jamaicans celebrate National Heroes Day to honour the men and women who shaped our nation.",
      "Heroes are people who do brave things.",
      "There are many public holidays in Jamaica every year.",
    ],
    correctAnswer: 1,
    explanation: "A strong opening sentence is specific and draws the reader in. Option B names the holiday, the date, and the purpose — giving the reader all the key information right away."
  },
  {
    id: 34,
    type: "writing",
    question: "Read the paragraph. Which sentence does NOT belong? \\'Exercise is good for the body. Running and swimming help the heart stay strong. Jamaica has many beautiful beaches. Eating healthy food is also important for staying fit.\\'",
    options: [
      "Exercise is good for the body.",
      "Running and swimming help the heart stay strong.",
      "Jamaica has many beautiful beaches.",
      "Eating healthy food is also important for staying fit.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about exercise and staying healthy. \\'Jamaica has many beautiful beaches\\' is off-topic and does not belong in this paragraph."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence would make the BEST closing sentence for a paragraph about the importance of libraries?",
    options: [
      "Libraries have many shelves and books.",
      "My school library opens every day at eight o\\'clock.",
      "For these reasons, every school and community should have a well-stocked library where students can explore, discover, and grow.",
      "Some libraries also have computers for students to use.",
    ],
    correctAnswer: 2,
    explanation: "A strong closing sentence restates the main idea and brings the paragraph to a satisfying end. Option C summarises why libraries matter and uses the phrase \\'for these reasons\\' to signal a conclusion."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "seperate",
      "seperrate",
      "separate",
      "separete",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is separate — s-e-p-a-r-a-t-e. A common error is writing \\'seperate,\\' but the correct vowel in the middle is \\'a.\\' "
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The crowd at National Stadium ___ when the athlete crossed the finish line.\"",
    options: [
      "talked",
      "sat",
      "erupted",
      "stood",
    ],
    correctAnswer: 2,
    explanation: "\"Erupted\" is the most vivid and precise word — it tells us the crowd suddenly and loudly burst into celebration, giving the reader a powerful image of the moment."
  },
  {
    id: 38,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph about why students should read every day?",
    options: [
      "I read a book about dinosaurs last week.",
      "Books can be borrowed from the school library.",
      "Reading every day helps students build a stronger vocabulary and become better thinkers.",
      "There are many different types of books to choose from.",
    ],
    correctAnswer: 2,
    explanation: "A topic sentence states the main idea clearly. Option C makes a direct claim about the benefits of daily reading that the rest of the paragraph could support."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER to form a paragraph: 1. After the race, all the students cheered and hugged each other. 2. On Sports Day, the students lined up at the starting line. 3. The teacher blew the whistle and the race began. 4. The fastest runner crossed the finish line in first place.",
    options: [
      "1, 2, 3, 4",
      "3, 2, 4, 1",
      "2, 3, 4, 1",
      "4, 3, 2, 1",
    ],
    correctAnswer: 2,
    explanation: "The correct sequence is: students lined up (2), the teacher blew the whistle (3), the fastest runner crossed the line (4), and then everyone cheered (1). This follows a logical time order: 2, 3, 4, 1."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The old man sat outside.\\'",
    options: [
      "The very very old man sat outside.",
      "The elderly man sat quietly on the wooden bench outside his gate, watching the road.",
      "He was old and he sat outside his house.",
      "The old man sat outside in the open air.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses specific, descriptive language — \\'elderly,\\' \\'quietly,\\' \\'wooden bench,\\' and \\'watching the road\\' — to paint a clear and vivid picture. This is much more interesting and precise than the original."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy3MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy3Questions : literacyEasy3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 3</p>
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
                    This easy-level literacy report includes section summaries and a full question-by-question review with explanations.
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 3 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 3</h1>
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
