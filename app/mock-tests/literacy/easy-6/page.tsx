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

const literacyEasy6Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Post Office

One afternoon, Nadia's grandmother handed her a sealed envelope and a small piece of paper with an address written on it. "Take this to the post office for me, please," Grandma said. It was a birthday card for Nadia's Aunt Gloria, who lived in England.

Nadia had never been to the post office alone before. She walked three streets down to the small blue building on Main Street. Inside, there was a short queue of people. Nadia waited patiently, holding the envelope carefully so it would not get bent or dirty.

When it was her turn, the postal worker behind the counter smiled at her. "Where is this going?" he asked. "To England," Nadia replied. The man weighed the envelope, placed a stamp on it, and told Nadia the cost. She paid with the money Grandma had given her and received the change.

On the way home, Nadia felt proud of herself. She had completed a grown-up errand all on her own. When she got back, Grandma gave her a big hug and said, "Well done, my big girl." `,
    question: "What is this passage MAINLY about?",
    options: [
      "How Grandma writes birthday cards",
      "Nadia\\'s first trip to the post office to mail a card for her grandmother",
      "How the post office works in Jamaica",
      "Why Aunt Gloria lives in England",
    ],
    correctAnswer: 1,
    explanation: "The passage is mainly about Nadia visiting the post office alone for the first time to mail a birthday card for her grandmother."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Post Office

One afternoon, Nadia's grandmother handed her a sealed envelope and a small piece of paper with an address written on it. "Take this to the post office for me, please," Grandma said. It was a birthday card for Nadia's Aunt Gloria, who lived in England.

Nadia had never been to the post office alone before. She walked three streets down to the small blue building on Main Street. Inside, there was a short queue of people. Nadia waited patiently, holding the envelope carefully so it would not get bent or dirty.

When it was her turn, the postal worker behind the counter smiled at her. "Where is this going?" he asked. "To England," Nadia replied. The man weighed the envelope, placed a stamp on it, and told Nadia the cost. She paid with the money Grandma had given her and received the change.

On the way home, Nadia felt proud of herself. She had completed a grown-up errand all on her own. When she got back, Grandma gave her a big hug and said, "Well done, my big girl." `,
    question: "Where was the birthday card being sent?",
    options: [
      "To Kingston",
      "To Portmore",
      "To England",
      "To Mandeville",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Nadia\\'s Aunt Gloria lived in England and the card was being sent there."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Post Office

One afternoon, Nadia's grandmother handed her a sealed envelope and a small piece of paper with an address written on it. "Take this to the post office for me, please," Grandma said. It was a birthday card for Nadia's Aunt Gloria, who lived in England.

Nadia had never been to the post office alone before. She walked three streets down to the small blue building on Main Street. Inside, there was a short queue of people. Nadia waited patiently, holding the envelope carefully so it would not get bent or dirty.

When it was her turn, the postal worker behind the counter smiled at her. "Where is this going?" he asked. "To England," Nadia replied. The man weighed the envelope, placed a stamp on it, and told Nadia the cost. She paid with the money Grandma had given her and received the change.

On the way home, Nadia felt proud of herself. She had completed a grown-up errand all on her own. When she got back, Grandma gave her a big hug and said, "Well done, my big girl." `,
    question: "Why had Nadia never been to the post office alone before?",
    options: [
      "She was not allowed to go out alone.",
      "The passage does not give a reason — it was simply her first time going alone.",
      "The post office was too far away.",
      "Grandma always went herself.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that Nadia had never been to the post office alone before, but gives no specific reason. It was simply her first time."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Post Office

One afternoon, Nadia's grandmother handed her a sealed envelope and a small piece of paper with an address written on it. "Take this to the post office for me, please," Grandma said. It was a birthday card for Nadia's Aunt Gloria, who lived in England.

Nadia had never been to the post office alone before. She walked three streets down to the small blue building on Main Street. Inside, there was a short queue of people. Nadia waited patiently, holding the envelope carefully so it would not get bent or dirty.

When it was her turn, the postal worker behind the counter smiled at her. "Where is this going?" he asked. "To England," Nadia replied. The man weighed the envelope, placed a stamp on it, and told Nadia the cost. She paid with the money Grandma had given her and received the change.

On the way home, Nadia felt proud of herself. She had completed a grown-up errand all on her own. When she got back, Grandma gave her a big hug and said, "Well done, my big girl." `,
    question: "What did the postal worker do after weighing the envelope?",
    options: [
      "He asked Nadia to come back tomorrow.",
      "He placed a stamp on it and told Nadia the cost.",
      "He wrote Aunt Gloria\\'s address on the envelope.",
      "He called Nadia\\'s grandmother to confirm the address.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the man weighed the envelope, placed a stamp on it, and told Nadia the cost."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Post Office

One afternoon, Nadia's grandmother handed her a sealed envelope and a small piece of paper with an address written on it. "Take this to the post office for me, please," Grandma said. It was a birthday card for Nadia's Aunt Gloria, who lived in England.

Nadia had never been to the post office alone before. She walked three streets down to the small blue building on Main Street. Inside, there was a short queue of people. Nadia waited patiently, holding the envelope carefully so it would not get bent or dirty.

When it was her turn, the postal worker behind the counter smiled at her. "Where is this going?" he asked. "To England," Nadia replied. The man weighed the envelope, placed a stamp on it, and told Nadia the cost. She paid with the money Grandma had given her and received the change.

On the way home, Nadia felt proud of herself. She had completed a grown-up errand all on her own. When she got back, Grandma gave her a big hug and said, "Well done, my big girl." `,
    question: "How did Nadia feel on the way home?",
    options: [
      "Worried that the card would get lost",
      "Tired from the long walk",
      "Proud of completing the errand alone",
      "Upset that Grandma had not come with her",
    ],
    correctAnswer: 2,
    explanation: "The passage says Nadia felt proud of herself because she had completed a grown-up errand all on her own."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Ackee

The ackee is Jamaica's national fruit. It is a bright red fruit that grows on tall trees. When the ackee is fully ripe, its pod splits open to reveal a creamy yellow flesh attached to shiny black seeds. Only the yellow flesh is eaten — the seeds and the red pod are poisonous and must never be eaten.

Ackee was brought to Jamaica from West Africa in the eighteenth century. It is believed that the fruit arrived on a slave ship around 1778. Today, ackee trees grow all over Jamaica, in gardens, yards, and along roadsides.

Ackee and saltfish is the national dish of Jamaica. To prepare it, the ackee flesh is boiled and then cooked with saltfish, onions, tomatoes, and Scotch bonnet pepper. It is a popular breakfast meal enjoyed by Jamaicans across the island and around the world.

Jamaica is the only country where ackee is widely eaten as food. It is also canned and exported to Jamaican communities in other countries. The ackee tree even appears on the Coat of Arms of Jamaica.`,
    question: "What is the NATIONAL FRUIT of Jamaica?",
    options: [
      "Mango",
      "Banana",
      "Breadfruit",
      "Ackee",
    ],
    correctAnswer: 3,
    explanation: "The passage clearly states that the ackee is Jamaica\\'s national fruit."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Ackee

The ackee is Jamaica's national fruit. It is a bright red fruit that grows on tall trees. When the ackee is fully ripe, its pod splits open to reveal a creamy yellow flesh attached to shiny black seeds. Only the yellow flesh is eaten — the seeds and the red pod are poisonous and must never be eaten.

Ackee was brought to Jamaica from West Africa in the eighteenth century. It is believed that the fruit arrived on a slave ship around 1778. Today, ackee trees grow all over Jamaica, in gardens, yards, and along roadsides.

Ackee and saltfish is the national dish of Jamaica. To prepare it, the ackee flesh is boiled and then cooked with saltfish, onions, tomatoes, and Scotch bonnet pepper. It is a popular breakfast meal enjoyed by Jamaicans across the island and around the world.

Jamaica is the only country where ackee is widely eaten as food. It is also canned and exported to Jamaican communities in other countries. The ackee tree even appears on the Coat of Arms of Jamaica.`,
    question: "Which part of the ackee is SAFE to eat?",
    options: [
      "The red pod",
      "The shiny black seeds",
      "The creamy yellow flesh",
      "All parts of the ackee",
    ],
    correctAnswer: 2,
    explanation: "The passage states that only the yellow flesh is eaten. The seeds and the red pod are poisonous."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Ackee

The ackee is Jamaica's national fruit. It is a bright red fruit that grows on tall trees. When the ackee is fully ripe, its pod splits open to reveal a creamy yellow flesh attached to shiny black seeds. Only the yellow flesh is eaten — the seeds and the red pod are poisonous and must never be eaten.

Ackee was brought to Jamaica from West Africa in the eighteenth century. It is believed that the fruit arrived on a slave ship around 1778. Today, ackee trees grow all over Jamaica, in gardens, yards, and along roadsides.

Ackee and saltfish is the national dish of Jamaica. To prepare it, the ackee flesh is boiled and then cooked with saltfish, onions, tomatoes, and Scotch bonnet pepper. It is a popular breakfast meal enjoyed by Jamaicans across the island and around the world.

Jamaica is the only country where ackee is widely eaten as food. It is also canned and exported to Jamaican communities in other countries. The ackee tree even appears on the Coat of Arms of Jamaica.`,
    question: "How did ackee arrive in Jamaica?",
    options: [
      "Jamaican farmers grew it from local seeds.",
      "It was brought from West Africa, believed to have arrived on a slave ship around 1778.",
      "It was a gift from the British government.",
      "It grew wild in the Jamaican mountains.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that ackee was brought to Jamaica from West Africa and is believed to have arrived on a slave ship around 1778."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Ackee

The ackee is Jamaica's national fruit. It is a bright red fruit that grows on tall trees. When the ackee is fully ripe, its pod splits open to reveal a creamy yellow flesh attached to shiny black seeds. Only the yellow flesh is eaten — the seeds and the red pod are poisonous and must never be eaten.

Ackee was brought to Jamaica from West Africa in the eighteenth century. It is believed that the fruit arrived on a slave ship around 1778. Today, ackee trees grow all over Jamaica, in gardens, yards, and along roadsides.

Ackee and saltfish is the national dish of Jamaica. To prepare it, the ackee flesh is boiled and then cooked with saltfish, onions, tomatoes, and Scotch bonnet pepper. It is a popular breakfast meal enjoyed by Jamaicans across the island and around the world.

Jamaica is the only country where ackee is widely eaten as food. It is also canned and exported to Jamaican communities in other countries. The ackee tree even appears on the Coat of Arms of Jamaica.`,
    question: "What is Jamaica\\'s national dish?",
    options: [
      "Curry goat and rice",
      "Ackee and saltfish",
      "Callaloo soup",
      "Jerk chicken and festival",
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that ackee and saltfish is the national dish of Jamaica."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Ackee

The ackee is Jamaica's national fruit. It is a bright red fruit that grows on tall trees. When the ackee is fully ripe, its pod splits open to reveal a creamy yellow flesh attached to shiny black seeds. Only the yellow flesh is eaten — the seeds and the red pod are poisonous and must never be eaten.

Ackee was brought to Jamaica from West Africa in the eighteenth century. It is believed that the fruit arrived on a slave ship around 1778. Today, ackee trees grow all over Jamaica, in gardens, yards, and along roadsides.

Ackee and saltfish is the national dish of Jamaica. To prepare it, the ackee flesh is boiled and then cooked with saltfish, onions, tomatoes, and Scotch bonnet pepper. It is a popular breakfast meal enjoyed by Jamaicans across the island and around the world.

Jamaica is the only country where ackee is widely eaten as food. It is also canned and exported to Jamaican communities in other countries. The ackee tree even appears on the Coat of Arms of Jamaica.`,
    question: "Where does the ackee tree appear, according to the passage?",
    options: [
      "On the Jamaican flag",
      "On the national currency",
      "On the Coat of Arms of Jamaica",
      "On Jamaican passports",
    ],
    correctAnswer: 2,
    explanation: "The passage states that the ackee tree appears on the Coat of Arms of Jamaica."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Nadia waited PATIENTLY in the queue at the post office.\" The word \\'patiently\\' means —",
    options: [
      "quickly and nervously",
      "calmly and without complaining",
      "loudly and restlessly",
      "slowly and carelessly",
    ],
    correctAnswer: 1,
    explanation: "Patiently means waiting calmly and without becoming upset or complaining."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'errand\\'?",
    options: [
      "adventure",
      "task",
      "holiday",
      "reward",
    ],
    correctAnswer: 1,
    explanation: "An errand is a short task or job that someone is sent to do. Task is the closest synonym."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The ackee pod SPLITS open when the fruit is ripe.\" The word \\'splits\\' means —",
    options: [
      "swells up and becomes bigger",
      "breaks apart or opens along a line",
      "falls off the tree and hits the ground",
      "turns from red to yellow",
    ],
    correctAnswer: 1,
    explanation: "To split means to break or divide along a line. The ackee pod breaks open when the fruit is ready."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'poisonous\\'?",
    options: [
      "harmful",
      "dangerous",
      "safe",
      "bitter",
    ],
    correctAnswer: 2,
    explanation: "The opposite of poisonous (harmful if eaten or touched) is safe (not harmful)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Ackee is EXPORTED to Jamaican communities in other countries.\" The word \\'exported\\' means —",
    options: [
      "grown and sold locally",
      "sent abroad to be sold in other countries",
      "imported from another country",
      "stored for later use",
    ],
    correctAnswer: 1,
    explanation: "To export means to send goods to another country to be sold or used there."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "recieve",
      "beleive",
      "achieve",
      "freind",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is achieve — a-c-h-i-e-v-e. The rule is \\'i before e\\' applies here."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Nadia held the envelope CAREFULLY so it would not get bent.\" Which word is the SYNONYM of \\'carefully\\'?",
    options: [
      "quickly",
      "carelessly",
      "gently",
      "loudly",
    ],
    correctAnswer: 2,
    explanation: "Carefully means with close attention and caution. Gently is the closest synonym in this context — both suggest handling something with care."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'address\\'?",
    options: [
      "address",
      "addresss",
      "addressies",
      "addresses",
    ],
    correctAnswer: 3,
    explanation: "The correct plural of address is addresses — nouns ending in -ss add -es to form the plural."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Nadia RECEIVED the change from the postal worker.\" The word \\'received\\' means —",
    options: [
      "gave away",
      "threw away",
      "got or was given",
      "refused to take",
    ],
    correctAnswer: 2,
    explanation: "To receive means to be given or to get something. Nadia was given the change after paying."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'ripe\\'?",
    options: [
      "fresh",
      "red",
      "unripe",
      "sweet",
    ],
    correctAnswer: 2,
    explanation: "The opposite of ripe (fully grown and ready to eat) is unripe (not yet ready to be eaten)."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"Each of the students ___ a pencil and a ruler.\"",
    options: [
      "have",
      "are",
      "need",
      "needs",
    ],
    correctAnswer: 3,
    explanation: "\"Each\" is always singular and takes a singular verb. \\'Needs\\' is the correct singular third-person verb here."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a NOUN? \"The postal worker placed a stamp on the envelope.\"",
    options: [
      "placed",
      "stamp",
      "on",
      "postal",
    ],
    correctAnswer: 1,
    explanation: "A noun is a person, place, or thing. \\'Stamp\\' is a thing — it is a noun. \\'Placed\\' is a verb and \\'postal\\' is an adjective."
  },
  {
    id: 23,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Nadia went to the post office she mailed the card.",
      "Nadia went to the post office, and she mailed the card.",
      "Nadia went to the post office and, she mailed the card.",
      "Nadia went to the post office. And mailed the card.",
    ],
    correctAnswer: 1,
    explanation: "Two independent clauses joined by \\'and\\' need a comma before the conjunction. Option B correctly uses a comma before \\'and.\\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"She bought ___ apple and ___ orange at the market.\"",
    options: [
      "a / a",
      "an / a",
      "an / an",
      "a / an",
    ],
    correctAnswer: 2,
    explanation: "We use \\'an\\' before vowel sounds. \\'Apple\\' and \\'orange\\' both begin with vowel sounds, so both need \\'an.\\' "
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "every year, jamaica celebrates independence day in august.",
      "Every year, Jamaica celebrates independence day in August.",
      "Every year, Jamaica celebrates Independence Day in August.",
      "Every Year, Jamaica Celebrates Independence Day In August.",
    ],
    correctAnswer: 2,
    explanation: "Sentences begin with a capital letter. Proper nouns and the names of specific events and months are capitalised. Option C follows all these rules correctly."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADJECTIVE? \"Grandma handed Nadia a sealed envelope.\"",
    options: [
      "handed",
      "Nadia",
      "envelope",
      "sealed",
    ],
    correctAnswer: 3,
    explanation: "An adjective describes a noun. \\'Sealed\\' describes the envelope — it tells us what kind of envelope it was."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word: \"By the time Nadia arrived home, Grandma ___ already prepared dinner.\"",
    options: [
      "has",
      "have",
      "had",
      "is",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\\'had\\' + past participle) is used for an action completed before another past event. \\'Had already prepared\\' is correct here."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The ackee\\'s seeds are poisonous and must not be eaten.",
      "The ackees seeds are poisonous and must not be eaten.",
      "The ackees\\' seeds are poisonous and must not be eaten.",
      "The ackee seeds\\' are poisonous and must not be eaten.",
    ],
    correctAnswer: 0,
    explanation: "An apostrophe followed by -s shows possession for a singular noun. \\'The ackee\\'s seeds\\' correctly shows that the seeds belong to the ackee."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the word that CORRECTLY completes the sentence: \"Nadia completed the errand faster ___ her older brother would have.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' in comparisons. \\'Then\\' refers to time. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is CORRECT?",
    options: [
      "Her and her sister walked to school.",
      "She and her sister walked to school.",
      "Her and she walked to school.",
      "She and her walked to school.",
    ],
    correctAnswer: 1,
    explanation: "When a pronoun is used as the subject of a sentence, use the subject form. \\'She\\' is the correct subject pronoun. \\'Her\\' is an object pronoun."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"It grows on tall trees all over Jamaica.\"",
    options: [
      "grows",
      "tall",
      "Jamaica",
      "It",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'It\\' stands in place of \\'ackee\\' from a previous sentence — it is the pronoun."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the word that BEST completes this sentence: \"The children sang ___ at the school concert.\"",
    options: [
      "beautiful",
      "beautifully",
      "more beautiful",
      "beauty",
    ],
    correctAnswer: 1,
    explanation: "An adverb describes how an action is performed. \\'Beautifully\\' is the adverb that correctly describes how the children sang."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST opening sentence for a paragraph about Jamaica\\'s national symbols?",
    options: [
      "Jamaica has a flag.",
      "National symbols tell the story of a country\\'s identity, history, and pride.",
      "There are many countries in the Caribbean.",
      "I learned about Jamaica\\'s symbols at school last year.",
    ],
    correctAnswer: 1,
    explanation: "Option B makes a broad, engaging statement about national symbols that introduces the main idea clearly and invites the reader to learn more."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong in this paragraph? \\'The ackee is Jamaica\\'s national fruit. It is bright red when ripe. Mangoes are sweet and juicy. The yellow flesh of the ackee is eaten with saltfish.\\'",
    options: [
      "The ackee is Jamaica\\'s national fruit.",
      "It is bright red when ripe.",
      "Mangoes are sweet and juicy.",
      "The yellow flesh of the ackee is eaten with saltfish.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about the ackee. \\'Mangoes are sweet and juicy\\' is off-topic and does not belong."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence is the BEST closing sentence for a paragraph about the value of doing errands?",
    options: [
      "Errands can sometimes take a long time to complete.",
      "There are many different types of errands that people run every day.",
      "In short, doing errands teaches young people responsibility and builds their confidence in the world around them.",
      "Post offices are found in most towns across Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C summarises the main idea (responsibility and confidence), uses \\'in short\\' to signal a conclusion, and brings the paragraph to a satisfying close."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "wednesday",
      "Wensday",
      "Wednessday",
      "Wednesday",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is Wednesday — W-e-d-n-e-s-d-a-y. The \\'d\\' in the middle is silent but must be included."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The crowd ___ as the athlete crossed the finish line in first place.\"",
    options: [
      "talked",
      "sat",
      "roared",
      "looked",
    ],
    correctAnswer: 2,
    explanation: "\"Roared\" is the most vivid and precise word — it tells us the crowd burst into a loud, exciting sound, perfectly matching the excitement of winning."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why breakfast is the most important meal of the day?",
    options: [
      "Many Jamaicans eat ackee and saltfish for breakfast.",
      "I eat breakfast every morning before I go to school.",
      "Eating a healthy breakfast gives your body and brain the energy needed to start the day well.",
      "Breakfast foods include eggs, bread, and fruit.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, direct claim about why breakfast matters. It introduces the main idea that the rest of the paragraph could support with facts and reasons."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. She licked the stamp and pressed it onto the envelope. 2. First, Grandma wrote the birthday message inside the card. 3. Then she placed the card inside the envelope and sealed it. 4. Finally, Nadia carried the envelope to the post office.",
    options: [
      "1, 2, 3, 4",
      "2, 3, 1, 4",
      "4, 3, 2, 1",
      "2, 1, 3, 4",
    ],
    correctAnswer: 1,
    explanation: "The correct order is: write the message (2), seal the envelope (3), add the stamp (1), take it to the post office (4). This gives the sequence 2, 3, 1, 4."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The bird sat on a branch.\\'",
    options: [
      "The bird sat on a very very big branch.",
      "The tiny yellow bird perched silently on the highest branch of the mango tree.",
      "The bird was sitting on a branch in a tree.",
      "It sat there on the branch.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses specific, vivid details — \\'tiny yellow,\\' \\'perched silently,\\' and \\'the highest branch of the mango tree\\' — to create a clear and interesting picture."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy6MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy6Questions : literacyEasy6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 6</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 6 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 6</h1>
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
