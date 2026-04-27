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

const literacyEasy8Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Granny\\'s Kitchen Garden

Behind Granny Maisie\\'s house in the hills of St. Elizabeth was a kitchen garden that she had tended for more than thirty years. Every vegetable and herb in the garden had its place. Tomatoes climbed wooden stakes near the fence. Thyme, escallion, and peppers grew in neat rows beside the breadfruit tree.

Every school holiday, Granny Maisie\\'s granddaughter Tamara came to stay. Granny Maisie always put Tamara to work in the garden. At first, Tamara did not enjoy pulling weeds and watering plants in the morning heat. But Granny was patient and explained why every task mattered.

"When you pull weeds," Granny said, "you give the good plants more room and more food from the soil. When you water in the morning, the roots drink before the sun is too hot." Slowly, Tamara began to understand the garden, and then she began to love it.

By the end of the holiday, Tamara had grown three of her own tomato seedlings from seed. She named each one. When it was time to go home, she carefully placed the seedlings in a box, put them in the back seat of the car, and promised to look after them at home.`,
    question: "What is this passage MAINLY about?",
    options: [
      "How to grow vegetables in a kitchen garden",
      "Granny Maisie\\'s kitchen garden and how Tamara learned to love gardening",
      "Why St. Elizabeth is a good place for farming",
      "The types of plants that grow in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage is mainly about Granny Maisie\\'s kitchen garden and how Tamara came to understand and love gardening during her school holiday."
  },
  {
    id: 2,
    type: "reading",
    passage: `Granny\\'s Kitchen Garden

Behind Granny Maisie\\'s house in the hills of St. Elizabeth was a kitchen garden that she had tended for more than thirty years. Every vegetable and herb in the garden had its place. Tomatoes climbed wooden stakes near the fence. Thyme, escallion, and peppers grew in neat rows beside the breadfruit tree.

Every school holiday, Granny Maisie\\'s granddaughter Tamara came to stay. Granny Maisie always put Tamara to work in the garden. At first, Tamara did not enjoy pulling weeds and watering plants in the morning heat. But Granny was patient and explained why every task mattered.

"When you pull weeds," Granny said, "you give the good plants more room and more food from the soil. When you water in the morning, the roots drink before the sun is too hot." Slowly, Tamara began to understand the garden, and then she began to love it.

By the end of the holiday, Tamara had grown three of her own tomato seedlings from seed. She named each one. When it was time to go home, she carefully placed the seedlings in a box, put them in the back seat of the car, and promised to look after them at home.`,
    question: "How long had Granny Maisie tended her kitchen garden?",
    options: [
      "About ten years",
      "More than twenty years",
      "More than thirty years",
      "Since Tamara was born",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Granny Maisie had tended the garden for more than thirty years."
  },
  {
    id: 3,
    type: "reading",
    passage: `Granny\\'s Kitchen Garden

Behind Granny Maisie\\'s house in the hills of St. Elizabeth was a kitchen garden that she had tended for more than thirty years. Every vegetable and herb in the garden had its place. Tomatoes climbed wooden stakes near the fence. Thyme, escallion, and peppers grew in neat rows beside the breadfruit tree.

Every school holiday, Granny Maisie\\'s granddaughter Tamara came to stay. Granny Maisie always put Tamara to work in the garden. At first, Tamara did not enjoy pulling weeds and watering plants in the morning heat. But Granny was patient and explained why every task mattered.

"When you pull weeds," Granny said, "you give the good plants more room and more food from the soil. When you water in the morning, the roots drink before the sun is too hot." Slowly, Tamara began to understand the garden, and then she began to love it.

By the end of the holiday, Tamara had grown three of her own tomato seedlings from seed. She named each one. When it was time to go home, she carefully placed the seedlings in a box, put them in the back seat of the car, and promised to look after them at home.`,
    question: "What did Granny Maisie say happens when you water plants in the morning?",
    options: [
      "The plants grow faster in the afternoon sun.",
      "The roots drink before the sun is too hot.",
      "The water keeps away insects and pests.",
      "The soil becomes richer after morning watering.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that Granny Maisie said when you water in the morning, the roots drink before the sun is too hot."
  },
  {
    id: 4,
    type: "reading",
    passage: `Granny\\'s Kitchen Garden

Behind Granny Maisie\\'s house in the hills of St. Elizabeth was a kitchen garden that she had tended for more than thirty years. Every vegetable and herb in the garden had its place. Tomatoes climbed wooden stakes near the fence. Thyme, escallion, and peppers grew in neat rows beside the breadfruit tree.

Every school holiday, Granny Maisie\\'s granddaughter Tamara came to stay. Granny Maisie always put Tamara to work in the garden. At first, Tamara did not enjoy pulling weeds and watering plants in the morning heat. But Granny was patient and explained why every task mattered.

"When you pull weeds," Granny said, "you give the good plants more room and more food from the soil. When you water in the morning, the roots drink before the sun is too hot." Slowly, Tamara began to understand the garden, and then she began to love it.

By the end of the holiday, Tamara had grown three of her own tomato seedlings from seed. She named each one. When it was time to go home, she carefully placed the seedlings in a box, put them in the back seat of the car, and promised to look after them at home.`,
    question: "How many tomato seedlings did Tamara grow by the end of the holiday?",
    options: [
      "One",
      "Two",
      "Three",
      "Four",
    ],
    correctAnswer: 2,
    explanation: "The passage states that by the end of the holiday, Tamara had grown three of her own tomato seedlings from seed."
  },
  {
    id: 5,
    type: "reading",
    passage: `Granny\\'s Kitchen Garden

Behind Granny Maisie\\'s house in the hills of St. Elizabeth was a kitchen garden that she had tended for more than thirty years. Every vegetable and herb in the garden had its place. Tomatoes climbed wooden stakes near the fence. Thyme, escallion, and peppers grew in neat rows beside the breadfruit tree.

Every school holiday, Granny Maisie\\'s granddaughter Tamara came to stay. Granny Maisie always put Tamara to work in the garden. At first, Tamara did not enjoy pulling weeds and watering plants in the morning heat. But Granny was patient and explained why every task mattered.

"When you pull weeds," Granny said, "you give the good plants more room and more food from the soil. When you water in the morning, the roots drink before the sun is too hot." Slowly, Tamara began to understand the garden, and then she began to love it.

By the end of the holiday, Tamara had grown three of her own tomato seedlings from seed. She named each one. When it was time to go home, she carefully placed the seedlings in a box, put them in the back seat of the car, and promised to look after them at home.`,
    question: "Which words BEST describe Granny Maisie as a teacher?",
    options: [
      "Strict and impatient",
      "Patient and knowledgeable",
      "Busy and distracted",
      "Quiet and unhelpful",
    ],
    correctAnswer: 1,
    explanation: "The passage describes Granny Maisie as patient, and she explains clearly why every task matters — showing she is patient and knowledgeable."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern parishes of Jamaica, forming the longest mountain range on the island. The highest peak, Blue Mountain Peak, rises to 2,256 metres above sea level and is the highest point in Jamaica. On a clear day, Cuba can be seen from its summit.

The Blue Mountains get their name from the blue mist that often hangs over them, especially in the mornings. This mist is caused by the cool, moist air that rises from the valleys below. The mountains receive a great deal of rainfall, which makes the soil rich and the vegetation thick and green.

The area is famous for Blue Mountain Coffee, which is considered one of the finest coffees in the world. The cool temperatures and fertile soil create the perfect conditions for growing high-quality coffee beans. Blue Mountain Coffee is exported to countries including Japan, Europe, and North America.

The Blue Mountains are also home to a wide variety of plants and animals, including many that are found nowhere else on earth. The Blue Mountains and John Crow Mountains National Park protects this unique ecosystem. Hikers come from across Jamaica and abroad to walk the trails and experience the beauty of this extraordinary natural environment.`,
    question: "How high is Blue Mountain Peak?",
    options: [
      "1,256 metres",
      "2,256 metres",
      "3,256 metres",
      "756 metres",
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that Blue Mountain Peak rises to 2,256 metres above sea level."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern parishes of Jamaica, forming the longest mountain range on the island. The highest peak, Blue Mountain Peak, rises to 2,256 metres above sea level and is the highest point in Jamaica. On a clear day, Cuba can be seen from its summit.

The Blue Mountains get their name from the blue mist that often hangs over them, especially in the mornings. This mist is caused by the cool, moist air that rises from the valleys below. The mountains receive a great deal of rainfall, which makes the soil rich and the vegetation thick and green.

The area is famous for Blue Mountain Coffee, which is considered one of the finest coffees in the world. The cool temperatures and fertile soil create the perfect conditions for growing high-quality coffee beans. Blue Mountain Coffee is exported to countries including Japan, Europe, and North America.

The Blue Mountains are also home to a wide variety of plants and animals, including many that are found nowhere else on earth. The Blue Mountains and John Crow Mountains National Park protects this unique ecosystem. Hikers come from across Jamaica and abroad to walk the trails and experience the beauty of this extraordinary natural environment.`,
    question: "What causes the blue mist over the mountains?",
    options: [
      "Smoke from nearby factories",
      "Cool, moist air rising from the valleys below",
      "Clouds that never leave the mountain tops",
      "The coffee plants releasing moisture into the air",
    ],
    correctAnswer: 1,
    explanation: "The passage explains that the blue mist is caused by the cool, moist air that rises from the valleys below."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern parishes of Jamaica, forming the longest mountain range on the island. The highest peak, Blue Mountain Peak, rises to 2,256 metres above sea level and is the highest point in Jamaica. On a clear day, Cuba can be seen from its summit.

The Blue Mountains get their name from the blue mist that often hangs over them, especially in the mornings. This mist is caused by the cool, moist air that rises from the valleys below. The mountains receive a great deal of rainfall, which makes the soil rich and the vegetation thick and green.

The area is famous for Blue Mountain Coffee, which is considered one of the finest coffees in the world. The cool temperatures and fertile soil create the perfect conditions for growing high-quality coffee beans. Blue Mountain Coffee is exported to countries including Japan, Europe, and North America.

The Blue Mountains are also home to a wide variety of plants and animals, including many that are found nowhere else on earth. The Blue Mountains and John Crow Mountains National Park protects this unique ecosystem. Hikers come from across Jamaica and abroad to walk the trails and experience the beauty of this extraordinary natural environment.`,
    question: "Why is Blue Mountain Coffee considered special?",
    options: [
      "It is the cheapest coffee in the world.",
      "It is grown only in the city of Kingston.",
      "The cool temperatures and fertile soil create perfect conditions for high-quality coffee beans.",
      "It is imported from Japan and Europe.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that the cool temperatures and fertile soil of the Blue Mountains create the perfect conditions for growing high-quality coffee beans."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern parishes of Jamaica, forming the longest mountain range on the island. The highest peak, Blue Mountain Peak, rises to 2,256 metres above sea level and is the highest point in Jamaica. On a clear day, Cuba can be seen from its summit.

The Blue Mountains get their name from the blue mist that often hangs over them, especially in the mornings. This mist is caused by the cool, moist air that rises from the valleys below. The mountains receive a great deal of rainfall, which makes the soil rich and the vegetation thick and green.

The area is famous for Blue Mountain Coffee, which is considered one of the finest coffees in the world. The cool temperatures and fertile soil create the perfect conditions for growing high-quality coffee beans. Blue Mountain Coffee is exported to countries including Japan, Europe, and North America.

The Blue Mountains are also home to a wide variety of plants and animals, including many that are found nowhere else on earth. The Blue Mountains and John Crow Mountains National Park protects this unique ecosystem. Hikers come from across Jamaica and abroad to walk the trails and experience the beauty of this extraordinary natural environment.`,
    question: "What can be seen from the summit of Blue Mountain Peak on a clear day?",
    options: [
      "Barbados",
      "Haiti",
      "Cuba",
      "The Panama Canal",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that on a clear day, Cuba can be seen from the summit."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Blue Mountains

The Blue Mountains stretch across the eastern parishes of Jamaica, forming the longest mountain range on the island. The highest peak, Blue Mountain Peak, rises to 2,256 metres above sea level and is the highest point in Jamaica. On a clear day, Cuba can be seen from its summit.

The Blue Mountains get their name from the blue mist that often hangs over them, especially in the mornings. This mist is caused by the cool, moist air that rises from the valleys below. The mountains receive a great deal of rainfall, which makes the soil rich and the vegetation thick and green.

The area is famous for Blue Mountain Coffee, which is considered one of the finest coffees in the world. The cool temperatures and fertile soil create the perfect conditions for growing high-quality coffee beans. Blue Mountain Coffee is exported to countries including Japan, Europe, and North America.

The Blue Mountains are also home to a wide variety of plants and animals, including many that are found nowhere else on earth. The Blue Mountains and John Crow Mountains National Park protects this unique ecosystem. Hikers come from across Jamaica and abroad to walk the trails and experience the beauty of this extraordinary natural environment.`,
    question: "What is the PURPOSE of the Blue Mountains and John Crow Mountains National Park?",
    options: [
      "To attract tourists and earn money for Jamaica",
      "To protect the unique ecosystem of the area",
      "To provide land for coffee farming",
      "To give hikers a place to exercise",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the National Park protects the unique ecosystem of the Blue Mountains and John Crow Mountains area."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Granny Maisie TENDED her garden for more than thirty years.\" The word \\'tended\\' means —",
    options: [
      "destroyed and replanted",
      "looked after and cared for",
      "visited occasionally",
      "sold vegetables from",
    ],
    correctAnswer: 1,
    explanation: "To tend a garden means to look after it with regular care — watering, weeding, and maintaining it over time."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'fertile\\'?",
    options: [
      "dry",
      "rocky",
      "productive and rich",
      "sandy",
    ],
    correctAnswer: 2,
    explanation: "Fertile means capable of producing abundant vegetation or crops. \\'Productive and rich\\' is the closest synonym."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The vegetation in the Blue Mountains is thick and GREEN.\" The word \\'vegetation\\' means —",
    options: [
      "the weather and temperature of an area",
      "plant life, including trees, shrubs, and grass",
      "the animals and insects of a region",
      "the soil and minerals underground",
    ],
    correctAnswer: 1,
    explanation: "Vegetation refers to all the plant life in an area — trees, shrubs, grasses, and other plants."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'unique\\'?",
    options: [
      "rare",
      "special",
      "ordinary",
      "unusual",
    ],
    correctAnswer: 2,
    explanation: "The opposite of unique (one of a kind; unlike anything else) is ordinary (common and not special)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The coffee is EXPORTED to countries including Japan and Europe.\" The word \\'exported\\' means —",
    options: [
      "grown and sold within Jamaica only",
      "sent to other countries to be sold",
      "imported from other countries",
      "stored in large factories",
    ],
    correctAnswer: 1,
    explanation: "To export means to send goods to another country for sale or use."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "enviroment",
      "enviorment",
      "environment",
      "envirament",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is environment — e-n-v-i-r-o-n-m-e-n-t."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The summit of the mountain offers a BREATHTAKING view.\" The word \\'breathtaking\\' means —",
    options: [
      "difficult to climb",
      "very boring",
      "so beautiful or impressive it takes your breath away",
      "cold and windy",
    ],
    correctAnswer: 2,
    explanation: "Breathtaking describes something so impressive or beautiful that it feels like it takes your breath away."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'extraordinary\\'?",
    options: [
      "ordinary",
      "small",
      "remarkable",
      "common",
    ],
    correctAnswer: 2,
    explanation: "Extraordinary means very unusual and impressive. Remarkable is the closest synonym."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Tamara PROMISED to look after the seedlings at home.\" The word \\'promised\\' means —",
    options: [
      "hoped",
      "wished",
      "gave a firm commitment to do something",
      "asked someone else to do something",
    ],
    correctAnswer: 2,
    explanation: "To promise means to make a firm, sincere commitment to do something."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'peak\\'?",
    options: [
      "peakes",
      "peakies",
      "peaks",
      "peak",
    ],
    correctAnswer: 2,
    explanation: "The correct plural of peak is peaks. Regular nouns add -s to form the plural."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"The Blue Mountains ___ the tallest range of mountains in Jamaica.\"",
    options: [
      "is",
      "was",
      "am",
      "are",
    ],
    correctAnswer: 3,
    explanation: "\"The Blue Mountains\" is a plural subject, so the correct verb is \\'are.\\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a NOUN? \"Granny Maisie planted tomatoes near the wooden fence.\"",
    options: [
      "planted",
      "wooden",
      "near",
      "fence",
    ],
    correctAnswer: 3,
    explanation: "A noun is a person, place, or thing. \\'Fence\\' is a thing — it is a noun. \\'Planted\\' is a verb and \\'wooden\\' is an adjective."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence is punctuated CORRECTLY?",
    options: [
      "Tamara enjoyed gardening once she understood it and she looked after her plants at home.",
      "Tamara enjoyed gardening once she understood it, and she looked after her plants at home.",
      "Tamara enjoyed gardening, once she understood it and she looked after her plants at home.",
      "Tamara enjoyed gardening once she understood it and, she looked after her plants at home.",
    ],
    correctAnswer: 1,
    explanation: "When two independent clauses are joined by \\'and,\\' a comma should be placed before the conjunction. Option B is correct."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"Tamara found ___ old seed packet in the corner of the shed.\"",
    options: [
      "a",
      "an",
      "the",
      "some",
    ],
    correctAnswer: 1,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Old\\' begins with the vowel sound \\'o,\\' so we say \\'an old seed packet.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "blue mountain coffee is famous all over the world.",
      "Blue Mountain Coffee is Famous all over the world.",
      "Blue Mountain Coffee is famous all over the world.",
      "Blue mountain Coffee is famous all over the world.",
    ],
    correctAnswer: 2,
    explanation: "Proper nouns and product names like \\'Blue Mountain Coffee\\' are capitalised. Regular adjectives and common nouns like \\'famous\\' and \\'world\\' are not. Option C is correct."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADVERB? \"Tamara carefully placed her seedlings in the box.\"",
    options: [
      "Tamara",
      "placed",
      "seedlings",
      "carefully",
    ],
    correctAnswer: 3,
    explanation: "An adverb describes how an action is done. \\'Carefully\\' tells us how Tamara placed the seedlings — it is the adverb."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word: \"Before Tamara arrived, Granny Maisie ___ the garden in the morning rain.\"",
    options: [
      "water",
      "waters",
      "had watered",
      "is watering",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\\'had\\' + past participle) is used for an action completed before another past event. \\'Had watered\\' correctly shows that the watering happened before Tamara arrived."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The gardens vegetables were fresh and delicious.",
      "The garden\\'s vegetables were fresh and delicious.",
      "The gardens\\' vegetables were fresh and delicious.",
      "The garden vegetables\\' were fresh and delicious.",
    ],
    correctAnswer: 1,
    explanation: "An apostrophe + s shows possession for a singular noun. \\'The garden\\'s vegetables\\' correctly shows that the vegetables belong to the garden."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"The Blue Mountains are taller ___ any other range in Jamaica.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' in comparisons. The correct word is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is CORRECT?",
    options: [
      "Between you and I, the garden is beautiful.",
      "Between you and myself, the garden is beautiful.",
      "Between you and me, the garden is beautiful.",
      "Between me and yourself, the garden is beautiful.",
    ],
    correctAnswer: 2,
    explanation: "\"Between\" is a preposition and must be followed by object pronouns. \\'Me\\' is the correct object pronoun — not \\'I\\' or \\'myself.\\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"She named each seedling and carried them home.\"",
    options: [
      "named",
      "seedling",
      "them",
      "home",
    ],
    correctAnswer: 2,
    explanation: "A pronoun replaces a noun. \\'Them\\' stands in place of \\'the seedlings\\' — it is the pronoun in this sentence."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the CORRECT sentence:",
    options: [
      "The children plays in Granny\\'s garden every holiday.",
      "The children play in Granny\\'s garden every holiday.",
      "The children played in Granny\\'s garden every holiday and next holiday too.",
      "The children is playing in Granny\\'s garden every holiday.",
    ],
    correctAnswer: 1,
    explanation: "\"The children\" is plural, so the correct present tense verb is \\'play\\' (no -s). Option B is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST opening sentence for a paragraph about the importance of growing your own food?",
    options: [
      "Food is sold at markets and supermarkets all over Jamaica.",
      "Growing your own food is a rewarding experience that connects you to the land and teaches patience.",
      "Some people have large gardens and some people have small ones.",
      "I planted tomatoes in my backyard last year.",
    ],
    correctAnswer: 1,
    explanation: "Option B makes a clear, engaging claim about why growing your own food matters — ideal for drawing a reader into the paragraph."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong in this paragraph? \\'The Blue Mountains are the highest range in Jamaica. They are often covered in blue mist. Blue Mountain Coffee is world-famous. The Rio Grande river begins in the Blue Mountains. Reggae music is loved all around the world.\\'",
    options: [
      "The Blue Mountains are the highest range in Jamaica.",
      "Blue Mountain Coffee is world-famous.",
      "Reggae music is loved all around the world.",
      "The Rio Grande river begins in the Blue Mountains.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about the Blue Mountains. \\'Reggae music is loved all around the world\\' is off-topic and does not belong."
  },
  {
    id: 35,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about kitchen gardens?",
    options: [
      "Kitchen gardens need water, sunlight, and good soil.",
      "Many Jamaicans grow vegetables in their backyards.",
      "A kitchen garden is more than a source of food — it is a place of patience, learning, and quiet pride.",
      "Tomatoes and callaloo are popular vegetables in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C offers a memorable, meaningful conclusion that goes beyond just facts — it summarises the deeper value of a kitchen garden."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "febuary",
      "Febuary",
      "Feburary",
      "February",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is February — F-e-b-r-u-a-r-y. The \\'r\\' after \\'Feb\\' is often forgotten but must be included."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"Tamara ___ each tiny seedling out of the soil and placed it gently in a box.\"",
    options: [
      "took",
      "got",
      "lifted",
      "moved",
    ],
    correctAnswer: 2,
    explanation: "\"Lifted\" is the most precise word in this context — it tells us exactly how Tamara carefully raised each seedling from the soil, which suits the gentle, careful action described."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why the Blue Mountains are important to Jamaica?",
    options: [
      "The Blue Mountains are very tall.",
      "The Blue Mountains produce excellent coffee.",
      "The Blue Mountains are one of Jamaica\\'s greatest natural treasures, offering rich biodiversity, world-class coffee, and breathtaking scenery.",
      "Many people visit the Blue Mountains every year.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a broad, confident claim that introduces multiple reasons why the Blue Mountains matter — perfect as a topic sentence."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. She watered the seedlings each morning so the roots could drink before the heat of the day. 2. First, Tamara prepared three small pots with rich soil from the garden. 3. After several weeks, three small green shoots appeared above the soil. 4. Then she placed one tomato seed in each pot and pressed the soil down gently.",
    options: [
      "1, 2, 4, 3",
      "3, 4, 2, 1",
      "2, 4, 1, 3",
      "4, 2, 1, 3",
    ],
    correctAnswer: 2,
    explanation: "The correct sequence is: prepare the pots (2), plant the seeds (4), water each morning (1), shoots appear (3). This gives the order 2, 4, 1, 3."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The mountain was big.\\'",
    options: [
      "The mountain was very, very big.",
      "It was a big mountain that was tall.",
      "Blue Mountain Peak rose dramatically against the morning sky, its misty summit hidden above the clouds.",
      "The mountain had a big top.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific, vivid language — \\'rose dramatically,\\' \\'misty summit,\\' and \\'hidden above the clouds\\' — to create a powerful and precise image of the mountain."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy8MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy8Questions : literacyEasy8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 8</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 8 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 8</h1>
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
