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

const literacyEasy4Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The New Neighbour

When the Brown family moved into the house at the end of Hibiscus Lane, nobody knew much about them. They arrived on a Saturday with two large trucks filled with furniture and boxes. The children on the street peeped through fences and hedges, curious about the new arrivals.

The Browns had a daughter named Simone who looked about the same age as the other Grade 4 children on the street. She stood in the yard quietly while the adults unloaded the trucks. She did not smile or wave, and some of the children thought she was unfriendly.

But Kezia, who lived two houses away, decided to be different. She walked up to the gate and said, "Hello! My name is Kezia. Welcome to Hibiscus Lane." Simone looked surprised for a moment, then her face broke into a wide smile.

By the end of the afternoon, Simone and Kezia were sitting on the front steps sharing a bag of grapes and talking as though they had been friends for years. The other children slowly came over too. Sometimes, all it takes to make a new friend is one brave hello.`,
    question: "What is this passage MAINLY about?",
    options: [
      "Why moving house is difficult for children",
      "How Kezia helped a new neighbour feel welcome and made a new friend",
      "The street called Hibiscus Lane and its many houses",
      "Why Simone did not smile when she arrived",
    ],
    correctAnswer: 1,
    explanation: "The passage mainly describes how Kezia welcomed Simone to the neighbourhood and how a new friendship began."
  },
  {
    id: 2,
    type: "reading",
    passage: `The New Neighbour

When the Brown family moved into the house at the end of Hibiscus Lane, nobody knew much about them. They arrived on a Saturday with two large trucks filled with furniture and boxes. The children on the street peeped through fences and hedges, curious about the new arrivals.

The Browns had a daughter named Simone who looked about the same age as the other Grade 4 children on the street. She stood in the yard quietly while the adults unloaded the trucks. She did not smile or wave, and some of the children thought she was unfriendly.

But Kezia, who lived two houses away, decided to be different. She walked up to the gate and said, "Hello! My name is Kezia. Welcome to Hibiscus Lane." Simone looked surprised for a moment, then her face broke into a wide smile.

By the end of the afternoon, Simone and Kezia were sitting on the front steps sharing a bag of grapes and talking as though they had been friends for years. The other children slowly came over too. Sometimes, all it takes to make a new friend is one brave hello.`,
    question: "How did Simone behave when she first arrived?",
    options: [
      "She waved at everyone on the street.",
      "She ran around the yard playing.",
      "She stood quietly and did not smile or wave.",
      "She walked over to Kezia\\'s house right away.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Simone stood in the yard quietly and did not smile or wave, which made some children think she was unfriendly."
  },
  {
    id: 3,
    type: "reading",
    passage: `The New Neighbour

When the Brown family moved into the house at the end of Hibiscus Lane, nobody knew much about them. They arrived on a Saturday with two large trucks filled with furniture and boxes. The children on the street peeped through fences and hedges, curious about the new arrivals.

The Browns had a daughter named Simone who looked about the same age as the other Grade 4 children on the street. She stood in the yard quietly while the adults unloaded the trucks. She did not smile or wave, and some of the children thought she was unfriendly.

But Kezia, who lived two houses away, decided to be different. She walked up to the gate and said, "Hello! My name is Kezia. Welcome to Hibiscus Lane." Simone looked surprised for a moment, then her face broke into a wide smile.

By the end of the afternoon, Simone and Kezia were sitting on the front steps sharing a bag of grapes and talking as though they had been friends for years. The other children slowly came over too. Sometimes, all it takes to make a new friend is one brave hello.`,
    question: "What did Kezia say when she walked up to the gate?",
    options: [
      "Can I help you unload the trucks?",
      "Hello! My name is Kezia. Welcome to Hibiscus Lane.",
      "Why are you so quiet? Come and play with us.",
      "My mother says you can come for dinner later.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that Kezia walked up to the gate and said, \'Hello! My name is Kezia. Welcome to Hibiscus Lane.\'"
  },
  {
    id: 4,
    type: "reading",
    passage: `The New Neighbour

When the Brown family moved into the house at the end of Hibiscus Lane, nobody knew much about them. They arrived on a Saturday with two large trucks filled with furniture and boxes. The children on the street peeped through fences and hedges, curious about the new arrivals.

The Browns had a daughter named Simone who looked about the same age as the other Grade 4 children on the street. She stood in the yard quietly while the adults unloaded the trucks. She did not smile or wave, and some of the children thought she was unfriendly.

But Kezia, who lived two houses away, decided to be different. She walked up to the gate and said, "Hello! My name is Kezia. Welcome to Hibiscus Lane." Simone looked surprised for a moment, then her face broke into a wide smile.

By the end of the afternoon, Simone and Kezia were sitting on the front steps sharing a bag of grapes and talking as though they had been friends for years. The other children slowly came over too. Sometimes, all it takes to make a new friend is one brave hello.`,
    question: "How did Simone react when Kezia spoke to her?",
    options: [
      "She walked away without answering.",
      "She looked surprised, then smiled widely.",
      "She asked Kezia to come back later.",
      "She called her mother to come outside.",
    ],
    correctAnswer: 1,
    explanation: "The passage says Simone looked surprised for a moment, then her face broke into a wide smile."
  },
  {
    id: 5,
    type: "reading",
    passage: `The New Neighbour

When the Brown family moved into the house at the end of Hibiscus Lane, nobody knew much about them. They arrived on a Saturday with two large trucks filled with furniture and boxes. The children on the street peeped through fences and hedges, curious about the new arrivals.

The Browns had a daughter named Simone who looked about the same age as the other Grade 4 children on the street. She stood in the yard quietly while the adults unloaded the trucks. She did not smile or wave, and some of the children thought she was unfriendly.

But Kezia, who lived two houses away, decided to be different. She walked up to the gate and said, "Hello! My name is Kezia. Welcome to Hibiscus Lane." Simone looked surprised for a moment, then her face broke into a wide smile.

By the end of the afternoon, Simone and Kezia were sitting on the front steps sharing a bag of grapes and talking as though they had been friends for years. The other children slowly came over too. Sometimes, all it takes to make a new friend is one brave hello.`,
    question: "What is the LESSON of this passage?",
    options: [
      "New neighbours should always speak first.",
      "Moving to a new street is always very hard.",
      "A simple, brave greeting is all it takes to start a new friendship.",
      "Children should never talk to strangers.",
    ],
    correctAnswer: 2,
    explanation: "The final sentence of the passage states the lesson clearly: sometimes all it takes to make a new friend is one brave hello."
  },
  {
    id: 6,
    type: "reading",
    passage: `Sugar Cane in Jamaica

Sugar cane has been grown in Jamaica for hundreds of years. It is a tall grass that can grow up to four metres high. The thick green stalks contain a sweet juice that is used to make sugar, rum, and other products.

Sugar cane grows well in Jamaica's warm climate and fertile soil. Farmers plant sugar cane by placing sections of the stalk into the ground. After about twelve months, the cane is ready to be harvested. Workers cut the stalks close to the ground using sharp machetes or large harvesting machines.

After harvesting, the cane is taken to a factory where it is crushed to extract the sweet juice. The juice is then boiled, filtered, and dried to produce the sugar crystals we use every day. The leftover fibre, called bagasse, is often burned to produce energy for the factory.

Sugar cane was once Jamaica's most important crop. Large sugar plantations covered much of the island's flat land. Today, the sugar industry is smaller than it once was, but sugar cane remains an important part of Jamaica's agricultural history and economy.`,
    question: "What is sugar cane MAINLY used to produce in Jamaica?",
    options: [
      "Bread, flour, and biscuits",
      "Sugar, rum, and other products",
      "Cooking oil, soap, and medicine",
      "Animal feed and fertiliser",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the sweet juice from sugar cane stalks is used to make sugar, rum, and other products."
  },
  {
    id: 7,
    type: "reading",
    passage: `Sugar Cane in Jamaica

Sugar cane has been grown in Jamaica for hundreds of years. It is a tall grass that can grow up to four metres high. The thick green stalks contain a sweet juice that is used to make sugar, rum, and other products.

Sugar cane grows well in Jamaica's warm climate and fertile soil. Farmers plant sugar cane by placing sections of the stalk into the ground. After about twelve months, the cane is ready to be harvested. Workers cut the stalks close to the ground using sharp machetes or large harvesting machines.

After harvesting, the cane is taken to a factory where it is crushed to extract the sweet juice. The juice is then boiled, filtered, and dried to produce the sugar crystals we use every day. The leftover fibre, called bagasse, is often burned to produce energy for the factory.

Sugar cane was once Jamaica's most important crop. Large sugar plantations covered much of the island's flat land. Today, the sugar industry is smaller than it once was, but sugar cane remains an important part of Jamaica's agricultural history and economy.`,
    question: "How tall can sugar cane grow?",
    options: [
      "Up to one metre",
      "Up to two metres",
      "Up to four metres",
      "Up to ten metres",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that sugar cane is a tall grass that can grow up to four metres high."
  },
  {
    id: 8,
    type: "reading",
    passage: `Sugar Cane in Jamaica

Sugar cane has been grown in Jamaica for hundreds of years. It is a tall grass that can grow up to four metres high. The thick green stalks contain a sweet juice that is used to make sugar, rum, and other products.

Sugar cane grows well in Jamaica's warm climate and fertile soil. Farmers plant sugar cane by placing sections of the stalk into the ground. After about twelve months, the cane is ready to be harvested. Workers cut the stalks close to the ground using sharp machetes or large harvesting machines.

After harvesting, the cane is taken to a factory where it is crushed to extract the sweet juice. The juice is then boiled, filtered, and dried to produce the sugar crystals we use every day. The leftover fibre, called bagasse, is often burned to produce energy for the factory.

Sugar cane was once Jamaica's most important crop. Large sugar plantations covered much of the island's flat land. Today, the sugar industry is smaller than it once was, but sugar cane remains an important part of Jamaica's agricultural history and economy.`,
    question: "How do farmers PLANT sugar cane?",
    options: [
      "They scatter seeds across the field.",
      "They place sections of the stalk into the ground.",
      "They grow it first in pots, then move it to the field.",
      "They plant the roots of the cane in shallow water.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that farmers plant sugar cane by placing sections of the stalk into the ground."
  },
  {
    id: 9,
    type: "reading",
    passage: `Sugar Cane in Jamaica

Sugar cane has been grown in Jamaica for hundreds of years. It is a tall grass that can grow up to four metres high. The thick green stalks contain a sweet juice that is used to make sugar, rum, and other products.

Sugar cane grows well in Jamaica's warm climate and fertile soil. Farmers plant sugar cane by placing sections of the stalk into the ground. After about twelve months, the cane is ready to be harvested. Workers cut the stalks close to the ground using sharp machetes or large harvesting machines.

After harvesting, the cane is taken to a factory where it is crushed to extract the sweet juice. The juice is then boiled, filtered, and dried to produce the sugar crystals we use every day. The leftover fibre, called bagasse, is often burned to produce energy for the factory.

Sugar cane was once Jamaica's most important crop. Large sugar plantations covered much of the island's flat land. Today, the sugar industry is smaller than it once was, but sugar cane remains an important part of Jamaica's agricultural history and economy.`,
    question: "What is BAGASSE?",
    options: [
      "The sweet juice extracted from sugar cane",
      "A machine used to harvest sugar cane",
      "The leftover fibre after the cane juice is extracted",
      "A type of sugar crystal used in baking",
    ],
    correctAnswer: 2,
    explanation: "The passage defines bagasse as the leftover fibre after the juice is removed. It is often burned to produce energy for the factory."
  },
  {
    id: 10,
    type: "reading",
    passage: `Sugar Cane in Jamaica

Sugar cane has been grown in Jamaica for hundreds of years. It is a tall grass that can grow up to four metres high. The thick green stalks contain a sweet juice that is used to make sugar, rum, and other products.

Sugar cane grows well in Jamaica's warm climate and fertile soil. Farmers plant sugar cane by placing sections of the stalk into the ground. After about twelve months, the cane is ready to be harvested. Workers cut the stalks close to the ground using sharp machetes or large harvesting machines.

After harvesting, the cane is taken to a factory where it is crushed to extract the sweet juice. The juice is then boiled, filtered, and dried to produce the sugar crystals we use every day. The leftover fibre, called bagasse, is often burned to produce energy for the factory.

Sugar cane was once Jamaica's most important crop. Large sugar plantations covered much of the island's flat land. Today, the sugar industry is smaller than it once was, but sugar cane remains an important part of Jamaica's agricultural history and economy.`,
    question: "Which sentence from the passage BEST shows that sugar cane was once very important to Jamaica?",
    options: [
      "Sugar cane grows well in Jamaica\\'s warm climate and fertile soil.",
      "Large sugar plantations covered much of the island\\'s flat land.",
      "Workers cut the stalks close to the ground using sharp machetes.",
      "The juice is then boiled, filtered, and dried to produce sugar crystals.",
    ],
    correctAnswer: 1,
    explanation: "\'Large sugar plantations covered much of the island\\'s flat land\' directly shows how widespread and important sugar cane farming once was in Jamaica."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The children were CURIOUS about the new family on the street.\" The word \\'curious\\' means —",
    options: [
      "frightened and worried",
      "eager to know or learn about something",
      "angry and upset",
      "tired and uninterested",
    ],
    correctAnswer: 1,
    explanation: "Curious means having a strong desire to know or learn about something. The children wanted to find out about the new neighbours."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'arrive\\'?",
    options: [
      "leave",
      "come",
      "wait",
      "travel",
    ],
    correctAnswer: 1,
    explanation: "A synonym has the same or similar meaning. \\'Come\\' means to move toward or reach a place — it is a synonym for arrive."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The soil in Jamaica is FERTILE, which helps crops to grow well.\" The word \\'fertile\\' means —",
    options: [
      "dry and hard",
      "rich and able to support plant growth",
      "dark and wet",
      "sandy and loose",
    ],
    correctAnswer: 1,
    explanation: "Fertile soil is rich in the nutrients that plants need to grow well. Jamaica\\'s fertile soil helps sugar cane and other crops thrive."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'ancient\\'?",
    options: [
      "old",
      "historical",
      "modern",
      "large",
    ],
    correctAnswer: 2,
    explanation: "The opposite of ancient (very old) is modern (belonging to the present time or recent history)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The workers used sharp machetes to HARVEST the sugar cane.\" The word \\'harvest\\' means —",
    options: [
      "to plant crops in the ground",
      "to water and care for growing crops",
      "to cut and gather crops that are ready",
      "to carry crops to the market",
    ],
    correctAnswer: 2,
    explanation: "To harvest means to cut and gather crops that have grown and are ready to be collected."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "What does the word \\'EXTRACT\\' mean in the sentence: \\'The cane is crushed to extract the sweet juice\\'?",
    options: [
      "to add something to a mixture",
      "to remove or take something out",
      "to boil something until it is dry",
      "to grind something into a powder",
    ],
    correctAnswer: 1,
    explanation: "To extract means to remove or draw out something from a substance. The crushing extracts the juice from the cane."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "neighbour",
      "nieghbour",
      "naighbour",
      "nighbour",
    ],
    correctAnswer: 0,
    explanation: "The correct spelling is neighbour — n-e-i-g-h-b-o-u-r. Remember: \\'e\\' before \\'i\\' after \\'n\\' in this word."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Kezia\\'s face showed a BRAVE expression as she walked up to the gate.\" Which word is the best SYNONYM for \\'brave\\'?",
    options: [
      "foolish",
      "bold",
      "quiet",
      "nervous",
    ],
    correctAnswer: 1,
    explanation: "A synonym for brave is bold — both words describe someone who is willing to act even when it is difficult or uncertain."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'factory\\'?",
    options: [
      "factorys",
      "factories",
      "factory",
      "factorees",
    ],
    correctAnswer: 1,
    explanation: "The correct plural of factory is factories. Words ending in -y after a consonant change -y to -ies in the plural."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The two girls talked as though they had been friends for YEARS.\" The word \\'though\\' means —",
    options: [
      "because",
      "after",
      "even if / as if",
      "before",
    ],
    correctAnswer: 2,
    explanation: "In this sentence, \\'as though\\' means \\'as if.\\' It introduces a comparison — the girls acted as if they had known each other for a long time, even though they had just met."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word to complete the sentence: \"Every student ___ expected to bring a pencil and a ruler.\"",
    options: [
      "are",
      "were",
      "is",
      "have",
    ],
    correctAnswer: 2,
    explanation: "\"Every student\" is singular. The correct singular verb is \\'is.\\' \\'Are\\' and \\'were\\' are plural forms."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a VERB? \"The factory crushes the sugar cane stalks.\"",
    options: [
      "factory",
      "sugar",
      "stalks",
      "crushes",
    ],
    correctAnswer: 3,
    explanation: "A verb is an action or doing word. \\'Crushes\\' tells us what the factory does — it is the verb."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence uses CORRECT punctuation?",
    options: [
      "Please bring your books pencils and eraser to class.",
      "Please bring your books, pencils, and eraser to class.",
      "Please bring your books, pencils and, eraser to class.",
      "Please bring your books pencils and, eraser to class.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list must be separated by commas. Option B correctly places a comma after each item: books, pencils, and eraser."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"There is ___ umbrella near the front door.\"",
    options: [
      "a",
      "an",
      "some",
      "the",
    ],
    correctAnswer: 1,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Umbrella\\' begins with the vowel sound \\'u,\\' so we say \\'an umbrella.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "my family visited Port royal last easter.",
      "My family visited port royal last Easter.",
      "My family visited Port Royal last Easter.",
      "My Family visited Port Royal Last Easter.",
    ],
    correctAnswer: 2,
    explanation: "Sentences begin with a capital letter. Proper nouns (Port Royal, Easter) are always capitalised. Only option C follows all three rules correctly."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADVERB? \"The workers carefully cut the sugar cane stalks.\"",
    options: [
      "workers",
      "cut",
      "carefully",
      "stalks",
    ],
    correctAnswer: 2,
    explanation: "An adverb describes how an action is done. \\'Carefully\\' tells us how the workers cut — it is the adverb."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word: \"By the time we arrived, the show ___ already started.\"",
    options: [
      "has",
      "have",
      "had",
      "is",
    ],
    correctAnswer: 2,
    explanation: "The past perfect tense (\\'had\\' + past participle) is used for an action completed before another past event. \\'The show had already started\\' correctly uses the past perfect."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The childrens\\' paintings were hung on the wall.",
      "The childrens paintings were hung on the wall.",
      "The children\\'s paintings were hung on the wall.",
      "The childrens\\'s paintings were hung on the wall.",
    ],
    correctAnswer: 2,
    explanation: "The apostrophe for an irregular plural like \\'children\\' (which does not end in -s) is placed before the -s: children\\'s."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"She is taller ___ her older brother.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' when making comparisons. \\'Then\\' refers to time. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "Him and I went to the shop together.",
      "He and me went to the shop together.",
      "He and I went to the shop together.",
      "Him and me went to the shop together.",
    ],
    correctAnswer: 2,
    explanation: "When two people are the subject of a sentence, use subject pronouns: \\'he\\' and \\'I.\\' \\'Him\\' and \\'me\\' are object pronouns and cannot be used as subjects."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the ADJECTIVE in this sentence? \"Simone gave Kezia a grateful smile.\"",
    options: [
      "gave",
      "Kezia",
      "grateful",
      "smile",
    ],
    correctAnswer: 2,
    explanation: "An adjective describes a noun. \\'Grateful\\' describes the noun \\'smile\\' — it is the adjective."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence that is in the PRESENT TENSE:",
    options: [
      "The children played in the school yard yesterday.",
      "The children will play in the school yard tomorrow.",
      "The children play in the school yard every day.",
      "The children had played in the school yard before.",
    ],
    correctAnswer: 2,
    explanation: "The simple present tense describes actions that happen regularly or are always true. \\'The children play in the school yard every day\\' uses the present tense correctly."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence is the BEST opening for a paragraph about the importance of being kind?",
    options: [
      "Kind people are nice to others.",
      "A simple act of kindness, like Kezia\\'s warm welcome, can change someone\\'s entire day.",
      "There are many ways to be kind.",
      "Kindness is a word we hear often at school.",
    ],
    correctAnswer: 1,
    explanation: "Option B is specific, interesting, and connects to a real idea. It grabs the reader\\'s attention and sets up the main idea of the paragraph."
  },
  {
    id: 34,
    type: "writing",
    question: "Read the paragraph. Which sentence does NOT belong? \\'Sugar cane is an important crop in Jamaica. It is used to make sugar and rum. The Blue Mountains are the highest mountains in Jamaica. Sugar cane grows in warm, fertile soil.\\'",
    options: [
      "Sugar cane is an important crop in Jamaica.",
      "It is used to make sugar and rum.",
      "The Blue Mountains are the highest mountains in Jamaica.",
      "Sugar cane grows in warm, fertile soil.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about sugar cane. \\'The Blue Mountains are the highest mountains in Jamaica\\' is completely off-topic and should be removed."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence is the BEST closing sentence for a paragraph about the benefits of teamwork?",
    options: [
      "Teams can have many different members.",
      "Sometimes working in a team can be difficult.",
      "Clearly, when people work together with respect and a shared goal, they can achieve far more than any one person working alone.",
      "Our school has many different sports teams.",
    ],
    correctAnswer: 2,
    explanation: "A strong closing sentence summarises the main idea and provides a satisfying ending. Option C restates the value of teamwork clearly and uses the word \\'clearly\\' to signal a conclusion."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "grammer",
      "gramer",
      "grammar",
      "grammir",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is grammar — g-r-a-m-m-a-r. The word ends in -ar, not -er."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The principal ___ the student\\'s outstanding performance in front of the whole school.\"",
    options: [
      "mentioned",
      "said",
      "praised",
      "told",
    ],
    correctAnswer: 2,
    explanation: "\"Praised\" is the most precise and appropriate word. It means to express strong approval or admiration, which fits the context of recognising outstanding performance in front of the school."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why every student should learn to swim?",
    options: [
      "Swimming is done in a pool or the sea.",
      "Many Jamaicans enjoy going to the beach.",
      "Learning to swim is an important life skill that can one day save your life.",
      "My swimming lessons are on Saturday mornings.",
    ],
    correctAnswer: 2,
    explanation: "A topic sentence states the main idea. Option C makes a clear, general claim about the importance of learning to swim that could be supported with details in the rest of the paragraph."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. She wrapped the gift in bright paper and tied a ribbon around it. 2. First, Maya chose a book from the shop for her friend\\'s birthday. 3. Finally, she handed the gift to her friend, who smiled with delight. 4. Next, she wrote a birthday card with a kind message inside.",
    options: [
      "2, 1, 4, 3",
      "1, 2, 3, 4",
      "2, 4, 1, 3",
      "3, 4, 1, 2",
    ],
    correctAnswer: 2,
    explanation: "The correct logical order is: choose the book (2), write the card (4), wrap the gift (1), hand it over (3). This gives the sequence 2, 4, 1, 3."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The boy ate his food fast.\\'",
    options: [
      "The boy ate his food very very fast.",
      "He ate fast at the table.",
      "The hungry boy devoured his dinner in minutes, barely stopping to breathe.",
      "The boy ate his food quickly and fast.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses vivid, precise language — \\'hungry,\\' \\'devoured,\\' and \\'barely stopping to breathe\\' — to create a much more interesting and detailed picture than the original sentence."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy4MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy4Questions : literacyEasy4Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 4</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 4</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 4 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 4</h1>
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
