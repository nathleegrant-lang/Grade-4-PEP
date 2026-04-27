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

const literacyEasy7Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `A Visit to Hope Zoo

On a bright Saturday morning, Mrs. Clarke's family visited Hope Zoo in Kingston. It was the children's first visit to a zoo. As soon as they passed through the gate, Tyrone and his younger sister Abby began looking in every direction, trying to see as many animals as possible.

Their first stop was the reptile section. Tyrone pressed his face against the glass to look at a large iguana resting on a rock. The iguana did not move. "It looks like a dinosaur!" Tyrone whispered. Abby stepped back and pulled at her mother's hand.

Next, they visited the birds. Hope Zoo is home to several Jamaican birds, including the Doctor Bird — Jamaica's national bird. A zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law.

At the end of the visit, the family stopped at the small café near the exit. The children ate ice cream and talked excitedly about their favourite animals. Tyrone said his favourite was the iguana. Abby, who had been afraid at first, surprised everyone by saying hers was the crocodile.`,
    question: "What is this passage MAINLY about?",
    options: [
      "How zoos are built and managed in Jamaica",
      "The Clarke family\\'s visit to Hope Zoo and what they saw",
      "Why Abby was afraid of animals",
      "The history of Hope Zoo in Kingston",
    ],
    correctAnswer: 1,
    explanation: "The passage mainly describes the Clarke family visiting Hope Zoo, what they saw, and how the children reacted."
  },
  {
    id: 2,
    type: "reading",
    passage: `A Visit to Hope Zoo

On a bright Saturday morning, Mrs. Clarke's family visited Hope Zoo in Kingston. It was the children's first visit to a zoo. As soon as they passed through the gate, Tyrone and his younger sister Abby began looking in every direction, trying to see as many animals as possible.

Their first stop was the reptile section. Tyrone pressed his face against the glass to look at a large iguana resting on a rock. The iguana did not move. "It looks like a dinosaur!" Tyrone whispered. Abby stepped back and pulled at her mother's hand.

Next, they visited the birds. Hope Zoo is home to several Jamaican birds, including the Doctor Bird — Jamaica's national bird. A zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law.

At the end of the visit, the family stopped at the small café near the exit. The children ate ice cream and talked excitedly about their favourite animals. Tyrone said his favourite was the iguana. Abby, who had been afraid at first, surprised everyone by saying hers was the crocodile.`,
    question: "Where is Hope Zoo located?",
    options: [
      "Montego Bay",
      "Spanish Town",
      "Kingston",
      "Ocho Rios",
    ],
    correctAnswer: 2,
    explanation: "The passage states that the family visited Hope Zoo in Kingston."
  },
  {
    id: 3,
    type: "reading",
    passage: `A Visit to Hope Zoo

On a bright Saturday morning, Mrs. Clarke's family visited Hope Zoo in Kingston. It was the children's first visit to a zoo. As soon as they passed through the gate, Tyrone and his younger sister Abby began looking in every direction, trying to see as many animals as possible.

Their first stop was the reptile section. Tyrone pressed his face against the glass to look at a large iguana resting on a rock. The iguana did not move. "It looks like a dinosaur!" Tyrone whispered. Abby stepped back and pulled at her mother's hand.

Next, they visited the birds. Hope Zoo is home to several Jamaican birds, including the Doctor Bird — Jamaica's national bird. A zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law.

At the end of the visit, the family stopped at the small café near the exit. The children ate ice cream and talked excitedly about their favourite animals. Tyrone said his favourite was the iguana. Abby, who had been afraid at first, surprised everyone by saying hers was the crocodile.`,
    question: "What did the zookeeper say about the Doctor Bird?",
    options: [
      "It is the largest bird in Jamaica.",
      "It is protected by law and is the most photographed bird in Jamaica.",
      "It can only be found at Hope Zoo.",
      "It was brought to Jamaica from another country.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law."
  },
  {
    id: 4,
    type: "reading",
    passage: `A Visit to Hope Zoo

On a bright Saturday morning, Mrs. Clarke's family visited Hope Zoo in Kingston. It was the children's first visit to a zoo. As soon as they passed through the gate, Tyrone and his younger sister Abby began looking in every direction, trying to see as many animals as possible.

Their first stop was the reptile section. Tyrone pressed his face against the glass to look at a large iguana resting on a rock. The iguana did not move. "It looks like a dinosaur!" Tyrone whispered. Abby stepped back and pulled at her mother's hand.

Next, they visited the birds. Hope Zoo is home to several Jamaican birds, including the Doctor Bird — Jamaica's national bird. A zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law.

At the end of the visit, the family stopped at the small café near the exit. The children ate ice cream and talked excitedly about their favourite animals. Tyrone said his favourite was the iguana. Abby, who had been afraid at first, surprised everyone by saying hers was the crocodile.`,
    question: "How did Abby react when she saw the iguana?",
    options: [
      "She laughed and moved closer.",
      "She took a photograph.",
      "She stepped back and pulled at her mother\\'s hand.",
      "She asked the zookeeper about it.",
    ],
    correctAnswer: 2,
    explanation: "The passage says Abby stepped back and pulled at her mother\\'s hand when she saw the iguana."
  },
  {
    id: 5,
    type: "reading",
    passage: `A Visit to Hope Zoo

On a bright Saturday morning, Mrs. Clarke's family visited Hope Zoo in Kingston. It was the children's first visit to a zoo. As soon as they passed through the gate, Tyrone and his younger sister Abby began looking in every direction, trying to see as many animals as possible.

Their first stop was the reptile section. Tyrone pressed his face against the glass to look at a large iguana resting on a rock. The iguana did not move. "It looks like a dinosaur!" Tyrone whispered. Abby stepped back and pulled at her mother's hand.

Next, they visited the birds. Hope Zoo is home to several Jamaican birds, including the Doctor Bird — Jamaica's national bird. A zookeeper explained that the Doctor Bird is the most photographed bird in Jamaica and is protected by law.

At the end of the visit, the family stopped at the small café near the exit. The children ate ice cream and talked excitedly about their favourite animals. Tyrone said his favourite was the iguana. Abby, who had been afraid at first, surprised everyone by saying hers was the crocodile.`,
    question: "Which animal did Abby name as her favourite at the end of the visit?",
    options: [
      "The Doctor Bird",
      "The iguana",
      "The crocodile",
      "The parrot",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Abby, who had been afraid at first, surprised everyone by saying her favourite was the crocodile."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Jamaican Flag

The Jamaican flag was first raised on Independence Day, August 6, 1962, the day Jamaica became an independent nation. It was designed by a bipartisan committee of the Jamaican Parliament and is one of the most recognisable flags in the Caribbean.

The flag has three colours: black, gold, and green. These colours are arranged in a pattern of two triangles on each side and two triangles at the top and bottom, all separated by a diagonal gold cross called a saltire. The overall shape created by the saltire divides the flag into four sections.

Each colour on the flag has a meaning. Black represents the strength and creativity of the Jamaican people. Gold represents the natural wealth and beauty of sunlight. Green represents hope and the lush vegetation of the island.

The Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue. Jamaicans are very proud of their flag. It is flown at schools, government buildings, and during celebrations such as Independence Day and Emancipation Day.`,
    question: "When was the Jamaican flag FIRST raised?",
    options: [
      "August 6, 1960",
      "August 6, 1962",
      "August 1, 1962",
      "August 6, 1970",
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that the Jamaican flag was first raised on August 6, 1962 — Independence Day."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Jamaican Flag

The Jamaican flag was first raised on Independence Day, August 6, 1962, the day Jamaica became an independent nation. It was designed by a bipartisan committee of the Jamaican Parliament and is one of the most recognisable flags in the Caribbean.

The flag has three colours: black, gold, and green. These colours are arranged in a pattern of two triangles on each side and two triangles at the top and bottom, all separated by a diagonal gold cross called a saltire. The overall shape created by the saltire divides the flag into four sections.

Each colour on the flag has a meaning. Black represents the strength and creativity of the Jamaican people. Gold represents the natural wealth and beauty of sunlight. Green represents hope and the lush vegetation of the island.

The Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue. Jamaicans are very proud of their flag. It is flown at schools, government buildings, and during celebrations such as Independence Day and Emancipation Day.`,
    question: "What are the THREE colours on the Jamaican flag?",
    options: [
      "Red, white, and blue",
      "Red, gold, and green",
      "Black, gold, and green",
      "Black, white, and green",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that the flag has three colours: black, gold, and green."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Jamaican Flag

The Jamaican flag was first raised on Independence Day, August 6, 1962, the day Jamaica became an independent nation. It was designed by a bipartisan committee of the Jamaican Parliament and is one of the most recognisable flags in the Caribbean.

The flag has three colours: black, gold, and green. These colours are arranged in a pattern of two triangles on each side and two triangles at the top and bottom, all separated by a diagonal gold cross called a saltire. The overall shape created by the saltire divides the flag into four sections.

Each colour on the flag has a meaning. Black represents the strength and creativity of the Jamaican people. Gold represents the natural wealth and beauty of sunlight. Green represents hope and the lush vegetation of the island.

The Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue. Jamaicans are very proud of their flag. It is flown at schools, government buildings, and during celebrations such as Independence Day and Emancipation Day.`,
    question: "What does the colour GREEN represent on the Jamaican flag?",
    options: [
      "The strength and creativity of the people",
      "The natural wealth and beauty of sunlight",
      "Hope and the lush vegetation of the island",
      "The ocean that surrounds Jamaica",
    ],
    correctAnswer: 2,
    explanation: "The passage states that green represents hope and the lush vegetation of the island."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Jamaican Flag

The Jamaican flag was first raised on Independence Day, August 6, 1962, the day Jamaica became an independent nation. It was designed by a bipartisan committee of the Jamaican Parliament and is one of the most recognisable flags in the Caribbean.

The flag has three colours: black, gold, and green. These colours are arranged in a pattern of two triangles on each side and two triangles at the top and bottom, all separated by a diagonal gold cross called a saltire. The overall shape created by the saltire divides the flag into four sections.

Each colour on the flag has a meaning. Black represents the strength and creativity of the Jamaican people. Gold represents the natural wealth and beauty of sunlight. Green represents hope and the lush vegetation of the island.

The Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue. Jamaicans are very proud of their flag. It is flown at schools, government buildings, and during celebrations such as Independence Day and Emancipation Day.`,
    question: "What is the name of the DIAGONAL GOLD CROSS on the Jamaican flag?",
    options: [
      "A saltire",
      "A chevron",
      "A cross potent",
      "A canton",
    ],
    correctAnswer: 0,
    explanation: "The passage states that the diagonal gold cross on the flag is called a saltire."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Jamaican Flag

The Jamaican flag was first raised on Independence Day, August 6, 1962, the day Jamaica became an independent nation. It was designed by a bipartisan committee of the Jamaican Parliament and is one of the most recognisable flags in the Caribbean.

The flag has three colours: black, gold, and green. These colours are arranged in a pattern of two triangles on each side and two triangles at the top and bottom, all separated by a diagonal gold cross called a saltire. The overall shape created by the saltire divides the flag into four sections.

Each colour on the flag has a meaning. Black represents the strength and creativity of the Jamaican people. Gold represents the natural wealth and beauty of sunlight. Green represents hope and the lush vegetation of the island.

The Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue. Jamaicans are very proud of their flag. It is flown at schools, government buildings, and during celebrations such as Independence Day and Emancipation Day.`,
    question: "What makes the Jamaican flag UNUSUAL compared to most other national flags?",
    options: [
      "It is the only flag with a diagonal cross.",
      "It does not contain red, white, or blue — making it one of only two such flags.",
      "It was designed by a single person, not a committee.",
      "It is the largest flag in the Caribbean.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the Jamaican flag is one of only two national flags in the world that does not contain the colours red, white, or blue."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Tyrone and Abby were looking in every DIRECTION.\" The word \\'direction\\' means —",
    options: [
      "a list of rules to follow",
      "the way something faces or moves toward",
      "a name given to a place",
      "a type of map",
    ],
    correctAnswer: 1,
    explanation: "Direction refers to the way something faces, points, or moves. The children were looking all around them."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'recognisable\\'?",
    options: [
      "unknown",
      "familiar",
      "complicated",
      "rare",
    ],
    correctAnswer: 1,
    explanation: "Recognisable means easy to identify or familiar. Familiar is the closest synonym."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The Jamaican flag is FLOWN at schools and government buildings.\" The word \\'flown\\' means —",
    options: [
      "burned and replaced",
      "designed and printed",
      "raised and displayed on a flagpole",
      "taken down and stored",
    ],
    correctAnswer: 2,
    explanation: "In this context, \\'flown\\' means raised and displayed on a flagpole. Flags are flown to show pride or mark an occasion."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'independent\\'?",
    options: [
      "free",
      "proud",
      "dependent",
      "strong",
    ],
    correctAnswer: 2,
    explanation: "The opposite of independent (free to govern oneself) is dependent (relying on another for support or control)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The iguana was RESTING on a rock inside its enclosure.\" The word \\'resting\\' means —",
    options: [
      "sleeping deeply",
      "moving very slowly",
      "lying still and relaxing",
      "eating its food",
    ],
    correctAnswer: 2,
    explanation: "Resting means lying or sitting still in a relaxed way. The iguana was still and quiet on the rock."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "independance",
      "independents",
      "independence",
      "independense",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is independence — i-n-d-e-p-e-n-d-e-n-c-e."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The committee DESIGNED the flag for the new nation.\" The word \\'designed\\' means —",
    options: [
      "repaired and fixed",
      "made a plan or drawing for",
      "destroyed and rebuilt",
      "purchased from abroad",
    ],
    correctAnswer: 1,
    explanation: "To design something means to plan and draw it out, deciding what it will look like. The committee planned and created the flag\\'s appearance."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'lush\\'?",
    options: [
      "dry",
      "barren",
      "rich and green",
      "flat",
    ],
    correctAnswer: 2,
    explanation: "Lush means rich, green, and growing abundantly. \\'Rich and green\\' is the closest synonym in this context."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The flag REPRESENTS the values of the Jamaican people.\" The word \\'represents\\' means —",
    options: [
      "hides",
      "stands for or is a symbol of",
      "replaces",
      "belongs to",
    ],
    correctAnswer: 1,
    explanation: "To represent means to stand for or be a symbol of something. The colours on the flag stand for specific values and ideas."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'triangle\\'?",
    options: [
      "trianglies",
      "trianglee",
      "triangles",
      "triangle",
    ],
    correctAnswer: 2,
    explanation: "The correct plural of triangle is triangles — regular nouns simply add -s to form the plural."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"The children ___ very excited when they arrived at the zoo.\"",
    options: [
      "was",
      "is",
      "am",
      "were",
    ],
    correctAnswer: 3,
    explanation: "\"The children\" is plural, so the correct past tense verb is \\'were.\\' \\'Was\\' and \\'is\\' are used with singular subjects."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a VERB? \"The zookeeper explained the history of the Doctor Bird.\"",
    options: [
      "zookeeper",
      "history",
      "Doctor Bird",
      "explained",
    ],
    correctAnswer: 3,
    explanation: "A verb is an action or doing word. \\'Explained\\' tells us what the zookeeper did — it is the verb."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence has CORRECT punctuation?",
    options: [
      "Jamaica became independent in 1962 it has its own flag and anthem.",
      "Jamaica became independent in 1962, it has its own flag and anthem.",
      "Jamaica became independent in 1962. It has its own flag and anthem.",
      "Jamaica became independent in 1962 It has its own flag and anthem.",
    ],
    correctAnswer: 2,
    explanation: "Two separate sentences must be divided by a full stop (period). Option C correctly uses a full stop between the two complete thoughts."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"She is ___ engineer who designed the bridge.\"",
    options: [
      "a",
      "an",
      "the",
      "some",
    ],
    correctAnswer: 1,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Engineer\\' begins with the vowel sound \\'e,\\' so we say \\'an engineer.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "the jamaican flag was raised on independence day.",
      "The Jamaican flag was raised on independence day.",
      "The jamaican flag was raised on Independence Day.",
      "The Jamaican flag was raised on Independence Day.",
    ],
    correctAnswer: 3,
    explanation: "Proper adjectives (\\'Jamaican\\'), proper nouns, and names of specific events (\\'Independence Day\\') must all be capitalised. Only option D applies all three rules."
  },
  {
    id: 26,
    type: "grammar",
    question: "Identify the ADJECTIVE in this sentence: \"The diagonal gold cross divides the flag into four sections.\"",
    options: [
      "divides",
      "sections",
      "diagonal",
      "flag",
    ],
    correctAnswer: 2,
    explanation: "An adjective describes a noun. \\'Diagonal\\' describes the cross — it tells us what kind of cross it is."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word: \"The flag ___ at the school every morning since term began.\"",
    options: [
      "fly",
      "flew",
      "has been flown",
      "flown",
    ],
    correctAnswer: 2,
    explanation: "The present perfect (\\'has been\\' + past participle) is used for an action that started in the past and continues into the present. \\'Has been flown\\' is correct here."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "Jamaicas flag is one of the most beautiful in the Caribbean.",
      "Jamaica\\'s flag is one of the most beautiful in the Caribbean.",
      "Jamaicas\\' flag is one of the most beautiful in the Caribbean.",
      "Jamaicas flag\\'s is one of the most beautiful in the Caribbean.",
    ],
    correctAnswer: 1,
    explanation: "An apostrophe + s shows possession for a singular noun. \\'Jamaica\\'s flag\\' correctly shows that the flag belongs to Jamaica."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"Abby was more frightened ___ her brother.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' to make comparisons. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "The teacher gave the prize to she and her partner.",
      "The teacher gave the prize to her and her partner.",
      "The teacher gave the prize to she and she\\'s partner.",
      "The teacher gave the prize to her and she\\'s partner.",
    ],
    correctAnswer: 1,
    explanation: "After a preposition like \\'to,\\' use object pronouns. \\'Her\\' is the correct object pronoun. \\'She\\' is a subject pronoun and cannot follow \\'to.\\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"We are very proud of the Jamaican flag.\"",
    options: [
      "proud",
      "Jamaican",
      "flag",
      "We",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'We\\' is a pronoun that stands in place of a group of people — it is the pronoun in this sentence."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the word that BEST completes this sentence: \"The zookeeper spoke ___ to the group of children.\"",
    options: [
      "kind",
      "kindness",
      "kindly",
      "more kind",
    ],
    correctAnswer: 2,
    explanation: "An adverb tells us how an action is done. \\'Kindly\\' is the adverb that describes how the zookeeper spoke."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST opening sentence for a paragraph about the importance of national symbols?",
    options: [
      "A country\\'s flag has different colours.",
      "National symbols like flags and anthems remind a people of who they are and where they come from.",
      "Jamaica has a black, gold, and green flag.",
      "I know all the symbols of Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "Option B makes a clear, interesting statement about why national symbols matter — it introduces the main idea and draws the reader in."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong in this paragraph? \\'Hope Zoo is a popular attraction in Kingston. It is home to many Jamaican and exotic animals. Ice cream is sold in many flavours across Jamaica. Visitors can learn about wildlife and conservation at the zoo.\\'",
    options: [
      "Hope Zoo is a popular attraction in Kingston.",
      "It is home to many Jamaican and exotic animals.",
      "Ice cream is sold in many flavours across Jamaica.",
      "Visitors can learn about wildlife and conservation at the zoo.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Hope Zoo. \\'Ice cream is sold in many flavours across Jamaica\\' is completely off-topic and does not belong."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence is the BEST closing sentence for a paragraph about visiting a zoo?",
    options: [
      "Zoos have many different types of animals from around the world.",
      "Admission prices at zoos can vary.",
      "A visit to the zoo leaves children with lasting memories and a deeper appreciation for the natural world.",
      "Some animals at the zoo are fed at specific times of the day.",
    ],
    correctAnswer: 2,
    explanation: "Option C summarises the value of a zoo visit beautifully, focusing on memories and appreciation for nature — a strong, meaningful closing."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "commitee",
      "committe",
      "committee",
      "comittee",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is committee — c-o-m-m-i-t-t-e-e. Note the double \\'m,\\' double \\'t,\\' and double \\'e.\\' "
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"Abby ___ at the sight of the large crocodile lying beside the pond.\"",
    options: [
      "looked",
      "went",
      "gasped",
      "moved",
    ],
    correctAnswer: 2,
    explanation: "\"Gasped\" is the most vivid and precise word — it tells us Abby suddenly drew in a sharp breath of surprise or fear, giving the reader a clear picture of her reaction."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why Jamaica should be proud of its flag?",
    options: [
      "The Jamaican flag has black, gold, and green on it.",
      "The flag was first raised in 1962.",
      "Jamaica\\'s flag is a powerful symbol of the nation\\'s strength, hope, and natural beauty.",
      "Flags are used at schools, events, and government buildings.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a direct claim about what the flag represents and why it is a source of pride — ideal as a topic sentence for this paragraph."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. Finally, the flag was officially raised on Independence Day, August 6, 1962. 2. The committee chose three colours — black, gold, and green. 3. A bipartisan committee was formed to design a new flag for Jamaica. 4. They arranged the colours in a pattern of triangles divided by a gold cross.",
    options: [
      "3, 2, 4, 1",
      "1, 2, 3, 4",
      "2, 3, 4, 1",
      "4, 3, 1, 2",
    ],
    correctAnswer: 0,
    explanation: "The correct logical sequence is: form the committee (3), choose the colours (2), arrange the design (4), raise the flag (1). This gives the order 3, 2, 4, 1."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The zoo was nice.\\'",
    options: [
      "The zoo was very very nice.",
      "It was a nice place.",
      "Hope Zoo was a wonderful place filled with the sounds, sights, and smells of dozens of amazing creatures.",
      "The zoo had many animals in it.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific, sensory language — \\'sounds, sights, and smells\\' and \\'dozens of amazing creatures\\' — to create a vivid and engaging description of the zoo."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy7MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy7Questions : literacyEasy7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 7</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 7</h1>
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
