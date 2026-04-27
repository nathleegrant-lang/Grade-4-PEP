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

const literacyEasy2Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `A Trip to the Market

Every Saturday morning, Keisha woke up early to go to the market with her grandmother, Miss Pearl. The market was a busy, lively place full of colours, sounds, and smells. Vendors sold fresh vegetables, fruits, and spices laid out on wooden tables.

Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers. She knew exactly which stalls had the freshest produce. Keisha loved walking beside her grandmother and watching her pick up each vegetable carefully before deciding to buy it.

While Miss Pearl shopped, Keisha watched a man selling fresh coconut water. He used a sharp machete to cut the top off each coconut. Keisha asked her grandmother for one, and Miss Pearl smiled and bought her a cold coconut.

On the way home, Keisha carried the heavy bag of vegetables. Her arms ached, but she did not complain. She knew that by evening, Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it.`,
    question: "What is this passage MAINLY about?",
    options: [
      "How to cook callaloo soup",
      "Keisha\\'s Saturday trips to the market with her grandmother",
      "The different vegetables sold at a Jamaican market",
      "Why Miss Pearl liked shopping",
    ],
    correctAnswer: 1,
    explanation: "The passage describes Keisha visiting the market with her grandmother each Saturday, what they did there, and how Keisha felt about it."
  },
  {
    id: 2,
    type: "reading",
    passage: `A Trip to the Market

Every Saturday morning, Keisha woke up early to go to the market with her grandmother, Miss Pearl. The market was a busy, lively place full of colours, sounds, and smells. Vendors sold fresh vegetables, fruits, and spices laid out on wooden tables.

Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers. She knew exactly which stalls had the freshest produce. Keisha loved walking beside her grandmother and watching her pick up each vegetable carefully before deciding to buy it.

While Miss Pearl shopped, Keisha watched a man selling fresh coconut water. He used a sharp machete to cut the top off each coconut. Keisha asked her grandmother for one, and Miss Pearl smiled and bought her a cold coconut.

On the way home, Keisha carried the heavy bag of vegetables. Her arms ached, but she did not complain. She knew that by evening, Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it.`,
    question: "What did Miss Pearl buy at the market?",
    options: [
      "Coconut water, pepper, and bread",
      "Callaloo, thyme, and scotch bonnet peppers",
      "Fruits, spices, and saltfish",
      "Tomatoes, onions, and herbs",
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers."
  },
  {
    id: 3,
    type: "reading",
    passage: `A Trip to the Market

Every Saturday morning, Keisha woke up early to go to the market with her grandmother, Miss Pearl. The market was a busy, lively place full of colours, sounds, and smells. Vendors sold fresh vegetables, fruits, and spices laid out on wooden tables.

Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers. She knew exactly which stalls had the freshest produce. Keisha loved walking beside her grandmother and watching her pick up each vegetable carefully before deciding to buy it.

While Miss Pearl shopped, Keisha watched a man selling fresh coconut water. He used a sharp machete to cut the top off each coconut. Keisha asked her grandmother for one, and Miss Pearl smiled and bought her a cold coconut.

On the way home, Keisha carried the heavy bag of vegetables. Her arms ached, but she did not complain. She knew that by evening, Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it.`,
    question: "What did the man near Miss Pearl\\'s stall sell?",
    options: [
      "Fresh fruits",
      "Sugar cane juice",
      "Roasted corn",
      "Fresh coconut water",
    ],
    correctAnswer: 3,
    explanation: "The passage says Keisha watched a man selling fresh coconut water while Miss Pearl shopped."
  },
  {
    id: 4,
    type: "reading",
    passage: `A Trip to the Market

Every Saturday morning, Keisha woke up early to go to the market with her grandmother, Miss Pearl. The market was a busy, lively place full of colours, sounds, and smells. Vendors sold fresh vegetables, fruits, and spices laid out on wooden tables.

Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers. She knew exactly which stalls had the freshest produce. Keisha loved walking beside her grandmother and watching her pick up each vegetable carefully before deciding to buy it.

While Miss Pearl shopped, Keisha watched a man selling fresh coconut water. He used a sharp machete to cut the top off each coconut. Keisha asked her grandmother for one, and Miss Pearl smiled and bought her a cold coconut.

On the way home, Keisha carried the heavy bag of vegetables. Her arms ached, but she did not complain. She knew that by evening, Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it.`,
    question: "Why did Keisha NOT complain even though the bag was heavy?",
    options: [
      "She was too tired to speak.",
      "Her grandmother told her to be quiet.",
      "She knew Miss Pearl would cook a delicious pot of callaloo soup that evening.",
      "She wanted to impress the vendors.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Keisha did not complain because she knew Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it."
  },
  {
    id: 5,
    type: "reading",
    passage: `A Trip to the Market

Every Saturday morning, Keisha woke up early to go to the market with her grandmother, Miss Pearl. The market was a busy, lively place full of colours, sounds, and smells. Vendors sold fresh vegetables, fruits, and spices laid out on wooden tables.

Miss Pearl always bought callaloo, thyme, and scotch bonnet peppers. She knew exactly which stalls had the freshest produce. Keisha loved walking beside her grandmother and watching her pick up each vegetable carefully before deciding to buy it.

While Miss Pearl shopped, Keisha watched a man selling fresh coconut water. He used a sharp machete to cut the top off each coconut. Keisha asked her grandmother for one, and Miss Pearl smiled and bought her a cold coconut.

On the way home, Keisha carried the heavy bag of vegetables. Her arms ached, but she did not complain. She knew that by evening, Miss Pearl would cook a delicious pot of callaloo soup, and that made every step worth it.`,
    question: "Which word BEST describes how Miss Pearl shopped?",
    options: [
      "Quickly and carelessly",
      "Slowly and carelessly",
      "Carefully and knowingly",
      "Lazily and slowly",
    ],
    correctAnswer: 2,
    explanation: "The passage says Miss Pearl knew exactly which stalls had the freshest produce, and she picked up each vegetable carefully before deciding to buy it. This shows she was careful and knowledgeable."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Doctor Bird

The Doctor Bird is the national bird of Jamaica. It is a type of hummingbird known for its beautiful long tail feathers. The male Doctor Bird has shiny green and black feathers and two long, streaming tail feathers that trail behind it as it flies.

Doctor Birds are very small but extremely fast. They beat their wings so quickly that the wings make a humming sound. This is why hummingbirds got their name. The Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter.

Doctor Birds feed on the sweet nectar from flowers. They use their long, thin beaks to reach deep inside flowers to drink the nectar. As they feed, they help to pollinate the flowers by carrying pollen from plant to plant.

In Jamaica, the Doctor Bird is protected by law. It is illegal to harm or capture this bird. Jamaicans are very proud of their national bird, and it appears on many Jamaican products and decorations.`,
    question: "What is the national bird of Jamaica?",
    options: [
      "The parrot",
      "The pelican",
      "The eagle",
      "The Doctor Bird",
    ],
    correctAnswer: 3,
    explanation: "The passage clearly states in the first sentence that the Doctor Bird is the national bird of Jamaica."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Doctor Bird

The Doctor Bird is the national bird of Jamaica. It is a type of hummingbird known for its beautiful long tail feathers. The male Doctor Bird has shiny green and black feathers and two long, streaming tail feathers that trail behind it as it flies.

Doctor Birds are very small but extremely fast. They beat their wings so quickly that the wings make a humming sound. This is why hummingbirds got their name. The Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter.

Doctor Birds feed on the sweet nectar from flowers. They use their long, thin beaks to reach deep inside flowers to drink the nectar. As they feed, they help to pollinate the flowers by carrying pollen from plant to plant.

In Jamaica, the Doctor Bird is protected by law. It is illegal to harm or capture this bird. Jamaicans are very proud of their national bird, and it appears on many Jamaican products and decorations.`,
    question: "What do Doctor Birds eat?",
    options: [
      "Seeds and berries",
      "Small insects and worms",
      "Sweet nectar from flowers",
      "Leaves and fruit",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Doctor Birds feed on the sweet nectar from flowers."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Doctor Bird

The Doctor Bird is the national bird of Jamaica. It is a type of hummingbird known for its beautiful long tail feathers. The male Doctor Bird has shiny green and black feathers and two long, streaming tail feathers that trail behind it as it flies.

Doctor Birds are very small but extremely fast. They beat their wings so quickly that the wings make a humming sound. This is why hummingbirds got their name. The Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter.

Doctor Birds feed on the sweet nectar from flowers. They use their long, thin beaks to reach deep inside flowers to drink the nectar. As they feed, they help to pollinate the flowers by carrying pollen from plant to plant.

In Jamaica, the Doctor Bird is protected by law. It is illegal to harm or capture this bird. Jamaicans are very proud of their national bird, and it appears on many Jamaican products and decorations.`,
    question: "Why is the Doctor Bird called a \\'hummingbird\\'?",
    options: [
      "Because it hums a song when it sleeps.",
      "Because its wings beat so quickly they make a humming sound.",
      "Because it lives near rivers that hum.",
      "Because Jamaicans named it after a song.",
    ],
    correctAnswer: 1,
    explanation: "The passage explains that Doctor Birds beat their wings so quickly that the wings make a humming sound, which is how hummingbirds got their name."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Doctor Bird

The Doctor Bird is the national bird of Jamaica. It is a type of hummingbird known for its beautiful long tail feathers. The male Doctor Bird has shiny green and black feathers and two long, streaming tail feathers that trail behind it as it flies.

Doctor Birds are very small but extremely fast. They beat their wings so quickly that the wings make a humming sound. This is why hummingbirds got their name. The Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter.

Doctor Birds feed on the sweet nectar from flowers. They use their long, thin beaks to reach deep inside flowers to drink the nectar. As they feed, they help to pollinate the flowers by carrying pollen from plant to plant.

In Jamaica, the Doctor Bird is protected by law. It is illegal to harm or capture this bird. Jamaicans are very proud of their national bird, and it appears on many Jamaican products and decorations.`,
    question: "Which of the following can a Doctor Bird do?",
    options: [
      "Fly only in a straight line",
      "Swim underwater",
      "Fly forwards, backwards, and hover in place",
      "Change the colour of its feathers",
    ],
    correctAnswer: 2,
    explanation: "The passage states that the Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Doctor Bird

The Doctor Bird is the national bird of Jamaica. It is a type of hummingbird known for its beautiful long tail feathers. The male Doctor Bird has shiny green and black feathers and two long, streaming tail feathers that trail behind it as it flies.

Doctor Birds are very small but extremely fast. They beat their wings so quickly that the wings make a humming sound. This is why hummingbirds got their name. The Doctor Bird can fly forwards, backwards, and even hover in place like a tiny helicopter.

Doctor Birds feed on the sweet nectar from flowers. They use their long, thin beaks to reach deep inside flowers to drink the nectar. As they feed, they help to pollinate the flowers by carrying pollen from plant to plant.

In Jamaica, the Doctor Bird is protected by law. It is illegal to harm or capture this bird. Jamaicans are very proud of their national bird, and it appears on many Jamaican products and decorations.`,
    question: "What would happen to a person who harms a Doctor Bird in Jamaica?",
    options: [
      "They would be asked to leave the country.",
      "They would receive a warning.",
      "Nothing would happen.",
      "They would be breaking the law.",
    ],
    correctAnswer: 3,
    explanation: "The passage states that the Doctor Bird is protected by law and that it is illegal to harm or capture this bird. Breaking the law means they could be punished."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The market was a busy, LIVELY place full of colours and sounds.\" The word \\'lively\\' means —",
    options: [
      "quiet and empty",
      "full of energy and activity",
      "dark and crowded",
      "old and broken",
    ],
    correctAnswer: 1,
    explanation: "Lively means full of life, energy, and activity. A lively market is busy and exciting."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"VENDORS sold fresh vegetables from wooden tables.\" The word \\'vendors\\' means —",
    options: [
      "shoppers who buy things",
      "people who sell things",
      "farmers who grow food",
      "trucks that carry goods",
    ],
    correctAnswer: 1,
    explanation: "A vendor is a person who sells things, especially in a market or on the street."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'butterfly\\'?",
    options: [
      "butterflys",
      "butterfliess",
      "butterflies",
      "butterfly",
    ],
    correctAnswer: 2,
    explanation: "The correct plural of butterfly is butterflies. Words ending in -y after a consonant change the -y to -ies in the plural."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'delicious\\'?",
    options: [
      "tasteless",
      "beautiful",
      "tasty",
      "tiny",
    ],
    correctAnswer: 2,
    explanation: "A synonym has the same or similar meaning. Tasty means pleasant to eat — it is a synonym for delicious."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'sharp\\'?",
    options: [
      "bright",
      "blunt",
      "hard",
      "clear",
    ],
    correctAnswer: 1,
    explanation: "The opposite of sharp is blunt. A blunt knife or blade does not cut well."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Doctor Birds drink NECTAR from flowers.\" The word \\'nectar\\' means —",
    options: [
      "a type of pollen",
      "a sweet liquid found inside flowers",
      "a small insect",
      "the leaf of a plant",
    ],
    correctAnswer: 1,
    explanation: "Nectar is the sweet liquid produced inside flowers. Many birds and insects feed on it."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"It is ILLEGAL to harm the Doctor Bird.\" The word \\'illegal\\' means —",
    options: [
      "very dangerous",
      "against the law",
      "very difficult",
      "very rare",
    ],
    correctAnswer: 1,
    explanation: "Illegal means not allowed by law. Doing something illegal can lead to punishment."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "beutiful",
      "beautifull",
      "beautiful",
      "beatiful",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is beautiful. Remember: b-e-a-u-t-i-f-u-l."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Keisha ACHED to carry the heavy bag.\" The word \\'ached\\' means —",
    options: [
      "She felt a dull pain.",
      "She was angry.",
      "She was happy.",
      "She was tired of walking.",
    ],
    correctAnswer: 0,
    explanation: "Ached means to feel a continuous, dull pain. Keisha\\'s arms hurt from carrying the heavy bag."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'tiny\\'?",
    options: [
      "little",
      "small",
      "enormous",
      "thin",
    ],
    correctAnswer: 2,
    explanation: "The opposite of tiny (very small) is enormous (very large)."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"The birds ___ singing in the mango tree.\"",
    options: [
      "was",
      "am",
      "were",
      "is",
    ],
    correctAnswer: 2,
    explanation: "The subject \\'the birds\\' is plural, so the correct past tense verb is \\'were.\\' \\'Was\\' and \\'is\\' are used with singular subjects."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a VERB? \"Keisha carried the heavy bag home.\"",
    options: [
      "Keisha",
      "heavy",
      "bag",
      "carried",
    ],
    correctAnswer: 3,
    explanation: "A verb is an action or doing word. \\'Carried\\' tells us what Keisha did — it is the verb."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence has the CORRECT punctuation?",
    options: [
      "Where is my school bag.",
      "Where is my school bag!",
      "Where is my school bag?",
      "Where is my school bag,",
    ],
    correctAnswer: 2,
    explanation: "A question must end with a question mark. \\'Where is my school bag?\\' is a question, so it needs a question mark."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"She ate ___ orange for breakfast.\"",
    options: [
      "a",
      "an",
      "the",
      "some",
    ],
    correctAnswer: 1,
    explanation: "We use \\'an\\' before words that begin with a vowel sound. \\'Orange\\' starts with the vowel sound \\'o,\\' so we say \\'an orange.\\' "
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses a CAPITAL LETTER correctly?",
    options: [
      "she lives in Kingston, Jamaica.",
      "She lives in kingston, Jamaica.",
      "She lives in Kingston, jamaica.",
      "She lives in Kingston, Jamaica.",
    ],
    correctAnswer: 3,
    explanation: "Sentences must begin with a capital letter, and proper nouns like Kingston and Jamaica must always be capitalised. Only option D follows both rules."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADJECTIVE? \"The bright sun warmed the green hills.\"",
    options: [
      "warmed",
      "sun",
      "hills",
      "bright",
    ],
    correctAnswer: 3,
    explanation: "An adjective is a describing word. \\'Bright\\' describes the noun \\'sun,\\' so it is the adjective. (\\'Green\\' is also an adjective, but \\'bright\\' appears first in the answer choices.)"
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"Yesterday, the children ___ to school early.\"",
    options: [
      "go",
      "goes",
      "going",
      "went",
    ],
    correctAnswer: 3,
    explanation: "The time clue \\'Yesterday\\' tells us the sentence is in the past tense. The correct past tense of \\'go\\' is \\'went.\\'"
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The dogs bone was buried in the yard.",
      "The dogs\\' bone was buried in the yard.",
      "The dog\\'s bone was buried in the yard.",
      "The dogs\\'s bone was buried in the yard.",
    ],
    correctAnswer: 2,
    explanation: "An apostrophe is used to show possession. \\'The dog\\'s bone\\' correctly shows that the bone belongs to the dog."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"Marcia ran faster ___ Patrice.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' to make comparisons. \\'Then\\' refers to time. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is CORRECT?",
    options: [
      "Me and my brother walked to school.",
      "My brother and me walked to school.",
      "My brother and I walked to school.",
      "I and my brother walked to school.",
    ],
    correctAnswer: 2,
    explanation: "When listing yourself as the subject of a sentence, use \\'I\\' not \\'me.\\' The polite order is to name the other person first: \\'My brother and I.\\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is a PRONOUN in this sentence? \"He placed the books neatly on the shelf.\"",
    options: [
      "placed",
      "books",
      "neatly",
      "He",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'He\\' is a pronoun that stands in place of a person\\'s name."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"The baby slept ___ through the night.\"",
    options: [
      "peaceful",
      "peacefully",
      "peacefulness",
      "more peaceful",
    ],
    correctAnswer: 1,
    explanation: "An adverb describes how an action is done. \\'Peacefully\\' is the adverb that correctly describes how the baby slept."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence would make the BEST opening sentence for a paragraph about a visit to the beach?",
    options: [
      "The ocean is made of salt water.",
      "On a bright Sunday morning, my family drove to Hellshire Beach for a day of fun and swimming.",
      "The sand at the beach can get very hot.",
      "There are many beaches all over Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "A strong opening sentence introduces the specific topic and makes the reader want to continue. Option B names the event, the place, and gives a sense of excitement."
  },
  {
    id: 34,
    type: "writing",
    question: "Read the paragraph. Which sentence does NOT belong? \\'Our classroom is neat and colourful. There are posters on the walls. My cousin lives in Portmore. We keep our desks clean and tidy.\\'",
    options: [
      "Our classroom is neat and colourful.",
      "There are posters on the walls.",
      "My cousin lives in Portmore.",
      "We keep our desks clean and tidy.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about the classroom. \\'My cousin lives in Portmore\\' is completely unrelated to this topic and should be removed."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence would make the BEST closing sentence for a paragraph about why we should drink more water?",
    options: [
      "Water comes from rivers, lakes, and rainfall.",
      "Some people prefer to drink juice.",
      "In summary, drinking enough water every day is one of the simplest ways to keep our bodies healthy.",
      "Water has no colour or taste.",
    ],
    correctAnswer: 2,
    explanation: "A closing sentence sums up the main idea clearly. Option C restates the main idea in a strong, complete way and uses a summary phrase."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "recieve",
      "beleive",
      "freind",
      "receive",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is \\'receive.\\' Remember the rule: \\'i before e except after c.\\' After the letter c, we write \\'ei\\'—r-e-c-e-i-v-e."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The excited puppy ___ around the yard when it saw its owner.\"",
    options: [
      "walked",
      "went",
      "raced",
      "moved",
    ],
    correctAnswer: 2,
    explanation: "\"Raced\" is the most vivid and precise word choice for an excited puppy moving quickly. It gives the reader a clear image of the animal\\'s energy."
  },
  {
    id: 38,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph about keeping our school clean?",
    options: [
      "There is a dustbin near every classroom door.",
      "Keeping our school clean is everyone\\'s responsibility.",
      "I like cleaning the classroom on Fridays.",
      "Our principal talks about cleanliness at assembly.",
    ],
    correctAnswer: 1,
    explanation: "A topic sentence states the main idea of the paragraph. Option B makes a broad, clear statement about cleanliness that the rest of the paragraph could support with details."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in the CORRECT order: 1. Next, she added the eggs and stirred the mixture. 2. First, Grandma measured out the flour and sugar. 3. Finally, she took the golden cake out of the oven. 4. Then she poured the batter into a greased baking pan.",
    options: [
      "1, 2, 3, 4",
      "2, 1, 4, 3",
      "3, 4, 1, 2",
      "4, 1, 3, 2",
    ],
    correctAnswer: 1,
    explanation: "The correct logical order is: measure flour and sugar (2), add eggs and stir (1), pour batter into pan (4), take cake out of oven (3). This gives the sequence 2, 1, 4, 3."
  },
  {
    id: 40,
    type: "writing",
    question: "Which detail would BEST improve this sentence? \"Tia went to school.\"",
    options: [
      "School is an important place.",
      "Tia walked quickly to St. Catherine Primary, clutching her brand-new backpack.",
      "She likes going to school.",
      "There are many schools in Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "Option B adds specific details — how Tia moved, where she was going, and what she was carrying. These details make the sentence vivid and interesting."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy2MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy2Questions : literacyEasy2Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 2</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 2</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 2 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 2</h1>
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
