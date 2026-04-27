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

const literacyEasy9Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The School Choir

Grade 4 at Dunrobin Primary had the best choir in the school. Their music teacher, Mr. Reid, practised with them every Thursday afternoon for an hour. The children sang folk songs, hymns, and songs from the Jamaican songbook. Mr. Reid always said, "A choir is not one voice — it is many voices becoming one."

This year, the choir had been selected to perform at the National Schools Festival. It was the first time a Grade 4 choir from Dunrobin had ever been chosen. Every student was excited, but also nervous.

The morning of the festival arrived. The children wore matching pale blue shirts and dark trousers or skirts. Backstage, some students whispered nervously. Mr. Reid gathered them in a circle, put his hand in the centre, and said quietly, "We have worked hard. Trust each other. Sing from the heart." The children placed their hands on top of his.

When they stepped onto the stage, the lights were bright and the hall was full. But as soon as Mr. Reid raised his hand to begin, the children focused. They sang beautifully. When the last note faded, the audience rose to their feet. The choir from Dunrobin Primary had made their school proud.`,
    question: "What is this passage MAINLY about?",
    options: [
      "Why music is important at Dunrobin Primary",
      "The Grade 4 choir\\'s journey to and performance at the National Schools Festival",
      "How Mr. Reid became a music teacher",
      "The history of the National Schools Festival in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage is mainly about the Grade 4 choir being selected for the National Schools Festival, their preparation, and their successful performance."
  },
  {
    id: 2,
    type: "reading",
    passage: `The School Choir

Grade 4 at Dunrobin Primary had the best choir in the school. Their music teacher, Mr. Reid, practised with them every Thursday afternoon for an hour. The children sang folk songs, hymns, and songs from the Jamaican songbook. Mr. Reid always said, "A choir is not one voice — it is many voices becoming one."

This year, the choir had been selected to perform at the National Schools Festival. It was the first time a Grade 4 choir from Dunrobin had ever been chosen. Every student was excited, but also nervous.

The morning of the festival arrived. The children wore matching pale blue shirts and dark trousers or skirts. Backstage, some students whispered nervously. Mr. Reid gathered them in a circle, put his hand in the centre, and said quietly, "We have worked hard. Trust each other. Sing from the heart." The children placed their hands on top of his.

When they stepped onto the stage, the lights were bright and the hall was full. But as soon as Mr. Reid raised his hand to begin, the children focused. They sang beautifully. When the last note faded, the audience rose to their feet. The choir from Dunrobin Primary had made their school proud.`,
    question: "How often did Mr. Reid practise with the choir?",
    options: [
      "Every day after school",
      "Every Monday morning",
      "Every Thursday afternoon for an hour",
      "Every Friday for two hours",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Mr. Reid practised with the choir every Thursday afternoon for an hour."
  },
  {
    id: 3,
    type: "reading",
    passage: `The School Choir

Grade 4 at Dunrobin Primary had the best choir in the school. Their music teacher, Mr. Reid, practised with them every Thursday afternoon for an hour. The children sang folk songs, hymns, and songs from the Jamaican songbook. Mr. Reid always said, "A choir is not one voice — it is many voices becoming one."

This year, the choir had been selected to perform at the National Schools Festival. It was the first time a Grade 4 choir from Dunrobin had ever been chosen. Every student was excited, but also nervous.

The morning of the festival arrived. The children wore matching pale blue shirts and dark trousers or skirts. Backstage, some students whispered nervously. Mr. Reid gathered them in a circle, put his hand in the centre, and said quietly, "We have worked hard. Trust each other. Sing from the heart." The children placed their hands on top of his.

When they stepped onto the stage, the lights were bright and the hall was full. But as soon as Mr. Reid raised his hand to begin, the children focused. They sang beautifully. When the last note faded, the audience rose to their feet. The choir from Dunrobin Primary had made their school proud.`,
    question: "What did Mr. Reid say a choir is?",
    options: [
      "The most important part of any school",
      "A group of students who love music",
      "Not one voice, but many voices becoming one",
      "A team that competes at festivals",
    ],
    correctAnswer: 2,
    explanation: "The passage quotes Mr. Reid directly: \\'A choir is not one voice — it is many voices becoming one.\\'"
  },
  {
    id: 4,
    type: "reading",
    passage: `The School Choir

Grade 4 at Dunrobin Primary had the best choir in the school. Their music teacher, Mr. Reid, practised with them every Thursday afternoon for an hour. The children sang folk songs, hymns, and songs from the Jamaican songbook. Mr. Reid always said, "A choir is not one voice — it is many voices becoming one."

This year, the choir had been selected to perform at the National Schools Festival. It was the first time a Grade 4 choir from Dunrobin had ever been chosen. Every student was excited, but also nervous.

The morning of the festival arrived. The children wore matching pale blue shirts and dark trousers or skirts. Backstage, some students whispered nervously. Mr. Reid gathered them in a circle, put his hand in the centre, and said quietly, "We have worked hard. Trust each other. Sing from the heart." The children placed their hands on top of his.

When they stepped onto the stage, the lights were bright and the hall was full. But as soon as Mr. Reid raised his hand to begin, the children focused. They sang beautifully. When the last note faded, the audience rose to their feet. The choir from Dunrobin Primary had made their school proud.`,
    question: "What did the choir wear on the day of the festival?",
    options: [
      "Red and gold uniforms",
      "Pale blue shirts and dark trousers or skirts",
      "White dresses and black shoes",
      "Their regular school uniforms",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the children wore matching pale blue shirts and dark trousers or skirts."
  },
  {
    id: 5,
    type: "reading",
    passage: `The School Choir

Grade 4 at Dunrobin Primary had the best choir in the school. Their music teacher, Mr. Reid, practised with them every Thursday afternoon for an hour. The children sang folk songs, hymns, and songs from the Jamaican songbook. Mr. Reid always said, "A choir is not one voice — it is many voices becoming one."

This year, the choir had been selected to perform at the National Schools Festival. It was the first time a Grade 4 choir from Dunrobin had ever been chosen. Every student was excited, but also nervous.

The morning of the festival arrived. The children wore matching pale blue shirts and dark trousers or skirts. Backstage, some students whispered nervously. Mr. Reid gathered them in a circle, put his hand in the centre, and said quietly, "We have worked hard. Trust each other. Sing from the heart." The children placed their hands on top of his.

When they stepped onto the stage, the lights were bright and the hall was full. But as soon as Mr. Reid raised his hand to begin, the children focused. They sang beautifully. When the last note faded, the audience rose to their feet. The choir from Dunrobin Primary had made their school proud.`,
    question: "How did the audience react at the end of the choir\\'s performance?",
    options: [
      "They clapped politely and left quietly.",
      "They sat in silence.",
      "They rose to their feet.",
      "They asked the choir to sing again.",
    ],
    correctAnswer: 2,
    explanation: "The passage says that when the last note faded, the audience rose to their feet — meaning they gave a standing ovation."
  },
  {
    id: 6,
    type: "reading",
    passage: `Bauxite in Jamaica

Bauxite is a reddish-brown mineral found in the earth. It is the main source of aluminium, a metal used to make aeroplanes, cars, drink cans, and many other products. Jamaica is one of the world\\'s leading producers of bauxite and has been mining it since the 1950s.

Large deposits of bauxite are found beneath the red soil of central Jamaica, especially in the parishes of Manchester, St. Elizabeth, St. Ann, and Trelawny. The red colour of the soil in these areas comes from the iron in the bauxite. When you drive through the interior of Jamaica, you can often see large areas of reddish-brown earth where mining has taken place.

To produce aluminium, bauxite first goes through a process called refining, which removes other materials and produces a white powder called alumina. The alumina is then smelted to produce pure aluminium. Jamaica exports both bauxite and alumina to countries around the world.

For many decades, bauxite mining was one of Jamaica\\'s most important industries and a major source of income for the country. Although the industry is not as large as it once was, it continues to contribute to Jamaica\\'s economy today.`,
    question: "What is bauxite?",
    options: [
      "A type of Jamaican fruit",
      "A reddish-brown mineral found in the earth",
      "A chemical used in making paper",
      "A plant that grows in central Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that bauxite is a reddish-brown mineral found in the earth."
  },
  {
    id: 7,
    type: "reading",
    passage: `Bauxite in Jamaica

Bauxite is a reddish-brown mineral found in the earth. It is the main source of aluminium, a metal used to make aeroplanes, cars, drink cans, and many other products. Jamaica is one of the world\\'s leading producers of bauxite and has been mining it since the 1950s.

Large deposits of bauxite are found beneath the red soil of central Jamaica, especially in the parishes of Manchester, St. Elizabeth, St. Ann, and Trelawny. The red colour of the soil in these areas comes from the iron in the bauxite. When you drive through the interior of Jamaica, you can often see large areas of reddish-brown earth where mining has taken place.

To produce aluminium, bauxite first goes through a process called refining, which removes other materials and produces a white powder called alumina. The alumina is then smelted to produce pure aluminium. Jamaica exports both bauxite and alumina to countries around the world.

For many decades, bauxite mining was one of Jamaica\\'s most important industries and a major source of income for the country. Although the industry is not as large as it once was, it continues to contribute to Jamaica\\'s economy today.`,
    question: "Since when has Jamaica been mining bauxite?",
    options: [
      "Since the 1920s",
      "Since the 1950s",
      "Since the 1970s",
      "Since the 1990s",
    ],
    correctAnswer: 1,
    explanation: "The passage states that Jamaica has been mining bauxite since the 1950s."
  },
  {
    id: 8,
    type: "reading",
    passage: `Bauxite in Jamaica

Bauxite is a reddish-brown mineral found in the earth. It is the main source of aluminium, a metal used to make aeroplanes, cars, drink cans, and many other products. Jamaica is one of the world\\'s leading producers of bauxite and has been mining it since the 1950s.

Large deposits of bauxite are found beneath the red soil of central Jamaica, especially in the parishes of Manchester, St. Elizabeth, St. Ann, and Trelawny. The red colour of the soil in these areas comes from the iron in the bauxite. When you drive through the interior of Jamaica, you can often see large areas of reddish-brown earth where mining has taken place.

To produce aluminium, bauxite first goes through a process called refining, which removes other materials and produces a white powder called alumina. The alumina is then smelted to produce pure aluminium. Jamaica exports both bauxite and alumina to countries around the world.

For many decades, bauxite mining was one of Jamaica\\'s most important industries and a major source of income for the country. Although the industry is not as large as it once was, it continues to contribute to Jamaica\\'s economy today.`,
    question: "Why is the soil in central Jamaica RED?",
    options: [
      "Because farmers add red dye to it",
      "Because of the iron in the bauxite",
      "Because the climate makes it turn red",
      "Because of the type of grass that grows there",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the red colour of the soil in bauxite-rich areas comes from the iron in the bauxite."
  },
  {
    id: 9,
    type: "reading",
    question: "What is ALUMINA?",
    options: [
      "Pure aluminium metal",
      "The finished product made from bauxite after it is smelted",
      "A white powder produced when bauxite is refined",
      "The red soil found in central Jamaica",
    ],
    correctAnswer: 2,
    explanation: "The passage explains that the refining process produces a white powder called alumina. The alumina is then smelted to produce pure aluminium."
  },
  {
    id: 10,
    type: "reading",
    passage: `Bauxite in Jamaica

Bauxite is a reddish-brown mineral found in the earth. It is the main source of aluminium, a metal used to make aeroplanes, cars, drink cans, and many other products. Jamaica is one of the world\\'s leading producers of bauxite and has been mining it since the 1950s.

Large deposits of bauxite are found beneath the red soil of central Jamaica, especially in the parishes of Manchester, St. Elizabeth, St. Ann, and Trelawny. The red colour of the soil in these areas comes from the iron in the bauxite. When you drive through the interior of Jamaica, you can often see large areas of reddish-brown earth where mining has taken place.

To produce aluminium, bauxite first goes through a process called refining, which removes other materials and produces a white powder called alumina. The alumina is then smelted to produce pure aluminium. Jamaica exports both bauxite and alumina to countries around the world.

For many decades, bauxite mining was one of Jamaica\\'s most important industries and a major source of income for the country. Although the industry is not as large as it once was, it continues to contribute to Jamaica\\'s economy today.`,
    question: "What does Jamaica do with its bauxite and alumina?",
    options: [
      "Uses all of it to build roads and buildings in Jamaica",
      "Sells it only to countries in the Caribbean",
      "Exports it to countries around the world",
      "Stores it underground until prices improve",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Jamaica exports both bauxite and alumina to countries around the world."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The children sang FOLK SONGS, hymns, and songs from the Jamaican songbook.\" The term \\'folk songs\\' means —",
    options: [
      "songs written by professional music composers",
      "songs from radio and television",
      "traditional songs passed down among ordinary people over generations",
      "songs performed only at church",
    ],
    correctAnswer: 2,
    explanation: "Folk songs are traditional songs that have been passed down through generations of ordinary people — they reflect a community\\'s culture and history."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'selected\\'?",
    options: [
      "rejected",
      "ignored",
      "chosen",
      "created",
    ],
    correctAnswer: 2,
    explanation: "Selected means chosen from a group. Chosen is the direct synonym."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Bauxite is the MAIN SOURCE of aluminium.\" In this sentence, \\'source\\' means —",
    options: [
      "a type of tool",
      "the origin or starting point of something",
      "a container for storing things",
      "a product ready to use",
    ],
    correctAnswer: 1,
    explanation: "A source is the origin or starting point — bauxite is the material from which aluminium comes."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'nervous\\'?",
    options: [
      "worried",
      "anxious",
      "calm",
      "afraid",
    ],
    correctAnswer: 2,
    explanation: "The opposite of nervous (anxious and worried) is calm (relaxed and at ease)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Jamaica is one of the world\\'s LEADING PRODUCERS of bauxite.\" The phrase \\'leading producers\\' means —",
    options: [
      "countries that use the most bauxite",
      "countries among the top producers in the world",
      "countries that discovered bauxite first",
      "countries with the cheapest bauxite",
    ],
    correctAnswer: 1,
    explanation: "Leading producers are those ranked among the top in the world for producing a particular product."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "performence",
      "performanse",
      "performince",
      "performance",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is performance — p-e-r-f-o-r-m-a-n-c-e."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The mining industry continues to CONTRIBUTE to Jamaica\\'s economy.\" The word \\'contribute\\' means —",
    options: [
      "take away from",
      "damage",
      "add to or give something toward",
      "control or manage",
    ],
    correctAnswer: 2,
    explanation: "To contribute means to give or add something toward a result. The mining industry adds to Jamaica\\'s economy."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'faded\\'?",
    options: [
      "grew louder",
      "disappeared gradually",
      "started suddenly",
      "became stronger",
    ],
    correctAnswer: 1,
    explanation: "Faded means gradually became less strong or disappeared. The sound of the last note slowly disappeared — it faded."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The process of REFINING removes other materials from the bauxite.\" The word \\'refining\\' means —",
    options: [
      "destroying and discarding",
      "heating to very high temperatures",
      "purifying or processing to remove unwanted substances",
      "digging out of the ground",
    ],
    correctAnswer: 2,
    explanation: "Refining means processing a raw material to remove impurities and produce a purer, more useful substance."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'parish\\'?",
    options: [
      "parishs",
      "parish",
      "parishes",
      "parishes",
    ],
    correctAnswer: 2,
    explanation: "The correct plural of parish is parishes — nouns ending in -sh add -es to form the plural."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"The choir ___ beautifully at the National Schools Festival.\"",
    options: [
      "sing",
      "singing",
      "sings",
      "sang",
    ],
    correctAnswer: 3,
    explanation: "The sentence is in the past tense. The simple past tense of \\'sing\\' is \\'sang.\\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a NOUN? \"Mr. Reid gathered the children in a circle before the performance.\"",
    options: [
      "gathered",
      "before",
      "circle",
      "in",
    ],
    correctAnswer: 2,
    explanation: "A noun is a person, place, or thing. \\'Circle\\' is a thing — it is a noun. \\'Gathered\\' is a verb and \\'before\\' is a preposition."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence is punctuated CORRECTLY?",
    options: [
      "The children were nervous, but they performed beautifully.",
      "The children were nervous but, they performed beautifully.",
      "The children were nervous but they, performed beautifully.",
      "The children were nervous but they performed, beautifully.",
    ],
    correctAnswer: 0,
    explanation: "When two independent clauses are joined by \\'but,\\' a comma is placed before the conjunction. Option A correctly places the comma before \\'but.\\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"It was ___ honour to perform at the festival.\"",
    options: [
      "a",
      "the",
      "an",
      "some",
    ],
    correctAnswer: 2,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Honour\\' begins with the vowel sound \\'o\\' (the h is silent), so we say \\'an honour.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "The choir performed at the national schools festival in kingston.",
      "The Choir performed at the National Schools Festival in Kingston.",
      "The choir performed at the National Schools Festival in Kingston.",
      "the choir performed at the National Schools Festival in Kingston.",
    ],
    correctAnswer: 2,
    explanation: "The sentence must begin with a capital letter, and proper nouns and the name of a specific event must be capitalised. Option C follows all these rules correctly."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADJECTIVE? \"The bright stage lights made some children blink.\"",
    options: [
      "made",
      "blink",
      "bright",
      "lights",
    ],
    correctAnswer: 2,
    explanation: "An adjective describes a noun. \\'Bright\\' describes the stage lights — it is the adjective."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence written in the SIMPLE PAST TENSE:",
    options: [
      "The choir will perform next year.",
      "The choir performs every year.",
      "The choir performed at the festival.",
      "The choir has performed at the festival.",
    ],
    correctAnswer: 2,
    explanation: "The simple past tense describes a completed action. \\'Performed\\' is the simple past form of \\'perform.\\'"
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The students voices filled the hall with beautiful music.",
      "The students\\' voices filled the hall with beautiful music.",
      "The student\\'s voices filled the hall with beautiful music.",
      "The students voices\\' filled the hall with beautiful music.",
    ],
    correctAnswer: 1,
    explanation: "When the noun is plural and already ends in -s (students), the apostrophe is placed after the -s: students\\'. Option B is correct."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"Dunrobin\\'s choir sang better ___ any other group at the festival.\"",
    options: [
      "then",
      "that",
      "then",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' in comparisons. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "Mr. Reid told we to sing from the heart.",
      "Mr. Reid told us to sing from the heart.",
      "Mr. Reid told ourselves to sing from the heart.",
      "Mr. Reid told we students to sing from the heart.",
    ],
    correctAnswer: 1,
    explanation: "After a verb like \\'told,\\' use an object pronoun. \\'Us\\' is the correct object pronoun. \\'We\\' is a subject pronoun and cannot be used here."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"They dug deep into the red earth to find the bauxite.\"",
    options: [
      "dug",
      "earth",
      "bauxite",
      "They",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'They\\' stands in place of a group of people (the miners) — it is the pronoun."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the CORRECT sentence:",
    options: [
      "The choir sing beautifully every Thursday afternoon.",
      "The choir sings beautifully every Thursday afternoon.",
      "The choir singing beautifully every Thursday afternoon.",
      "The choir have sing beautifully every Thursday afternoon.",
    ],
    correctAnswer: 1,
    explanation: "\"The choir\" is a collective noun treated as singular. The correct present tense singular verb is \\'sings.\\'"
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST opening sentence for a paragraph about music in Jamaican schools?",
    options: [
      "Schools have many different subjects.",
      "Music has the power to bring students together, build confidence, and celebrate the richness of Jamaican culture.",
      "My favourite subject at school is music.",
      "Teachers spend a lot of time preparing lessons.",
    ],
    correctAnswer: 1,
    explanation: "Option B makes a broad, engaging claim about what music can do — ideal for drawing a reader into a paragraph about music in schools."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong in this paragraph? \\'Bauxite is an important mineral found in Jamaica. It is used to produce aluminium. Aluminium is used to make aeroplanes and drink cans. The Blue Mountains are covered in beautiful green forest. Jamaica exports bauxite and alumina to many countries.\\'",
    options: [
      "Bauxite is an important mineral found in Jamaica.",
      "It is used to produce aluminium.",
      "The Blue Mountains are covered in beautiful green forest.",
      "Jamaica exports bauxite and alumina to many countries.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about bauxite. \\'The Blue Mountains are covered in beautiful green forest\\' is off-topic and should be removed."
  },
  {
    id: 35,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about the school choir?",
    options: [
      "The choir meets every Thursday afternoon to practise.",
      "The choir has performed at many different events.",
      "When many voices come together in harmony, they create something far greater than any single voice could achieve alone.",
      "Mr. Reid is a very good music teacher.",
    ],
    correctAnswer: 2,
    explanation: "Option C offers a memorable, meaningful close that echoes the theme of the passage and captures the spirit of what a choir represents."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "ocassion",
      "occasoin",
      "occassion",
      "occasion",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is occasion — o-c-c-a-s-i-o-n. One \\'c\\' and one \\'s.\\' "
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"The miners ___ large quantities of bauxite from the red hills of central Jamaica.\"",
    options: [
      "got",
      "took",
      "extracted",
      "moved",
    ],
    correctAnswer: 2,
    explanation: "\"Extracted\" is the most precise and technical word — it means to remove or draw out material from the ground, which is exactly what miners do."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about the importance of the bauxite industry to Jamaica?",
    options: [
      "Bauxite is a reddish-brown mineral.",
      "The bauxite industry has played a significant role in Jamaica\\'s economic development for more than seventy years.",
      "Aluminium is used to make aeroplanes and drink cans.",
      "Bauxite is found in the parishes of Manchester and St. Elizabeth.",
    ],
    correctAnswer: 1,
    explanation: "Option B makes a clear, broad claim about the importance of the industry to Jamaica\\'s economy — ideal for introducing a paragraph on this topic."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. Finally, the pure aluminium is shaped into products like cans and aircraft parts. 2. First, workers mine bauxite from beneath Jamaica\\'s red soil. 3. The alumina is then heated and smelted to produce aluminium. 4. The bauxite is refined into a white powder called alumina.",
    options: [
      "2, 4, 3, 1",
      "1, 2, 3, 4",
      "4, 3, 2, 1",
      "2, 3, 4, 1",
    ],
    correctAnswer: 0,
    explanation: "The correct sequence of the aluminium production process is: mine bauxite (2), refine into alumina (4), smelt into aluminium (3), shape into products (1). This gives the order 2, 4, 3, 1."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The choir sang well.\\'",
    options: [
      "The choir sang very well.",
      "The choir sang well and people liked it.",
      "The choir\\'s voices soared through the packed hall, filling every corner with a sound so pure it made the audience hold their breath.",
      "The choir sang, and it was good.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses vivid, expressive language — \\'soared,\\' \\'packed hall,\\' \\'filling every corner,\\' and \\'hold their breath\\' — to bring the performance to life in a way that the original sentence cannot."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy9MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy9Questions : literacyEasy9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 9</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 9</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 9 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 9</h1>
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
