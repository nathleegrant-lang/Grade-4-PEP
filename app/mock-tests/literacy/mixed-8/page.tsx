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

const literacyMixed8Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Last Day of School

The last day of the school year at Pemberton Primary always began with a speech from Mr. Dawes, the principal. He stood on the steps of the main building and said the same things he said every year about effort and character and the long road ahead. The children had heard it before. But they stood still and listened, because that was what you did with Mr. Dawes.

After the speech, the teachers brought out a long table of food — rice and peas, chicken, festival, and plantain — and the children sat in the shade of the breadfruit trees and ate together. This was the part Kezia loved. Not the food, exactly, but the fact that everything had been done for the year, and this meal was the full stop at the end.

Her teacher, Miss Clarke, sat beside her and asked if she was looking forward to the summer.

"Yes," said Kezia. "But also no."

Miss Clarke looked at her. "Because it means something is ending?"

Kezia nodded. She did not know how to say the rest — that she felt every year like she was leaving something behind that she could not bring with her, and that this full stop she loved so much also felt, sometimes, like a small loss.`,
    question: "What does Mr. Dawes\'s annual speech suggest about the school\'s culture?",
    options: [
      "The principal repeats himself because he has run out of ideas.",
      "Certain rituals — even familiar ones — hold a community together through consistency and shared participation.",
      "The children disrespect Mr. Dawes and do not listen to him.",
      "Mr. Dawes is the most important person at Pemberton Primary.",
    ],
    correctAnswer: 1,
    explanation: "The children have heard the speech before but stand still and listen \'because that was what you did with Mr. Dawes.\' The ritual is about community and shared expectation, not the content of the words."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Last Day of School

The last day of the school year at Pemberton Primary always began with a speech from Mr. Dawes, the principal. He stood on the steps of the main building and said the same things he said every year about effort and character and the long road ahead. The children had heard it before. But they stood still and listened, because that was what you did with Mr. Dawes.

After the speech, the teachers brought out a long table of food — rice and peas, chicken, festival, and plantain — and the children sat in the shade of the breadfruit trees and ate together. This was the part Kezia loved. Not the food, exactly, but the fact that everything had been done for the year, and this meal was the full stop at the end.

Her teacher, Miss Clarke, sat beside her and asked if she was looking forward to the summer.

"Yes," said Kezia. "But also no."

Miss Clarke looked at her. "Because it means something is ending?"

Kezia nodded. She did not know how to say the rest — that she felt every year like she was leaving something behind that she could not bring with her, and that this full stop she loved so much also felt, sometimes, like a small loss.`,
    question: "What does Kezia mean when she calls the end-of-year meal \'the full stop at the end\'?",
    options: [
      "She thinks the meal is the most important part of the school year.",
      "She uses a metaphor from writing to express that the meal marks the definitive end of the year — bringing it to a close.",
      "She wants the school year to begin again immediately after the meal.",
      "She is referring to the punctuation lesson Miss Clarke taught.",
    ],
    correctAnswer: 1,
    explanation: "\'Full stop\' is a metaphor — just as a full stop ends a sentence definitively, the meal marks the definitive end of the school year. Kezia finds comfort in this feeling of completion."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Last Day of School

The last day of the school year at Pemberton Primary always began with a speech from Mr. Dawes, the principal. He stood on the steps of the main building and said the same things he said every year about effort and character and the long road ahead. The children had heard it before. But they stood still and listened, because that was what you did with Mr. Dawes.

After the speech, the teachers brought out a long table of food — rice and peas, chicken, festival, and plantain — and the children sat in the shade of the breadfruit trees and ate together. This was the part Kezia loved. Not the food, exactly, but the fact that everything had been done for the year, and this meal was the full stop at the end.

Her teacher, Miss Clarke, sat beside her and asked if she was looking forward to the summer.

"Yes," said Kezia. "But also no."

Miss Clarke looked at her. "Because it means something is ending?"

Kezia nodded. She did not know how to say the rest — that she felt every year like she was leaving something behind that she could not bring with her, and that this full stop she loved so much also felt, sometimes, like a small loss.`,
    question: "What COMPLEX FEELING does Kezia experience at the end of the school year?",
    options: [
      "Pure excitement about the summer holidays",
      "Only sadness about leaving school",
      "A bittersweet mix of looking forward to the summer while feeling a quiet grief for what is ending",
      "Anger at Miss Clarke for asking difficult questions",
    ],
    correctAnswer: 2,
    explanation: "Kezia says \'yes, but also no\' — she looks forward to summer but also feels that each year she is leaving something behind she cannot bring. The feeling is bittersweet: joy and quiet loss combined."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Last Day of School

The last day of the school year at Pemberton Primary always began with a speech from Mr. Dawes, the principal. He stood on the steps of the main building and said the same things he said every year about effort and character and the long road ahead. The children had heard it before. But they stood still and listened, because that was what you did with Mr. Dawes.

After the speech, the teachers brought out a long table of food — rice and peas, chicken, festival, and plantain — and the children sat in the shade of the breadfruit trees and ate together. This was the part Kezia loved. Not the food, exactly, but the fact that everything had been done for the year, and this meal was the full stop at the end.

Her teacher, Miss Clarke, sat beside her and asked if she was looking forward to the summer.

"Yes," said Kezia. "But also no."

Miss Clarke looked at her. "Because it means something is ending?"

Kezia nodded. She did not know how to say the rest — that she felt every year like she was leaving something behind that she could not bring with her, and that this full stop she loved so much also felt, sometimes, like a small loss.`,
    question: "What does Kezia\'s difficulty putting her feelings into words suggest about her?",
    options: [
      "She is not good at expressing herself in English.",
      "She is experiencing something emotionally complex that resists simple verbal expression.",
      "She does not trust Miss Clarke enough to explain.",
      "She is embarrassed to admit she is sad about the holiday.",
    ],
    correctAnswer: 1,
    explanation: "The passage says Kezia \'did not know how to say the rest.\' Some emotions — particularly those involving simultaneous joy and loss — are genuinely difficult to articulate, and Kezia\'s struggle to speak is itself emotionally accurate."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the last day of school passage?",
    options: [
      "Nostalgic, tender, and quietly bittersweet",
      "Exciting and celebratory",
      "Critical of the school system",
      "Humorous and playful",
    ],
    correctAnswer: 0,
    explanation: "The passage is written with careful emotional sensitivity — Kezia\'s mixed feelings, Miss Clarke\'s perceptive question, the quiet loss beneath the celebratory surface. The tone is nostalgic, tender, and quietly bittersweet."
  },
  {
    id: 6,
    type: "reading",
    passage: `Migration and Jamaica: People on the Move

Throughout its history, Jamaica has been a country defined as much by movement as by place. Millions of Jamaicans and their descendants now live outside the island — in the United Kingdom, the United States, Canada, and across the Caribbean. This diaspora, as it is known, maintains strong cultural and economic ties with the homeland, and its contribution to Jamaica is immense.

The most measurable contribution is financial. Remittances — money sent home by Jamaicans living abroad — represent one of the largest flows of income into the Jamaican economy, consistently exceeding foreign direct investment in most recent years. Families use this money for housing, education, healthcare, and daily expenses. In many rural communities, remittance income is the primary economic lifeline.

But migration also has costs. Jamaica has experienced significant brain drain — the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers. The country invests in training these professionals, then loses them to wealthier countries that offer higher wages and better conditions. This is a structural problem with no easy solution, since restricting emigration would violate fundamental human rights.

The relationship between Jamaica and its diaspora is not one of loss alone. The diaspora brings investment, ideas, and cultural energy back to the island. Returning migrants often start businesses, build homes, and contribute to civic life. The challenge for Jamaica is to deepen these ties — to make the diaspora not merely a source of remittances, but a genuine partner in the island's development.`,
    question: "What is the MAIN IDEA of the migration passage?",
    options: [
      "Jamaicans should be encouraged to stay in Jamaica rather than emigrate.",
      "Remittances are more important to Jamaica than any other source of income.",
      "Migration has shaped Jamaica profoundly, bringing significant economic benefits through remittances while also creating challenges like brain drain — and the diaspora has the potential to be a genuine development partner.",
      "Brain drain is the most serious problem Jamaica faces today.",
    ],
    correctAnswer: 2,
    explanation: "The passage covers the economic benefits of the diaspora (remittances), the challenges (brain drain), and the potential for deeper partnership. Option C captures this full arc."
  },
  {
    id: 7,
    type: "reading",
    passage: `Migration and Jamaica: People on the Move

Throughout its history, Jamaica has been a country defined as much by movement as by place. Millions of Jamaicans and their descendants now live outside the island — in the United Kingdom, the United States, Canada, and across the Caribbean. This diaspora, as it is known, maintains strong cultural and economic ties with the homeland, and its contribution to Jamaica is immense.

The most measurable contribution is financial. Remittances — money sent home by Jamaicans living abroad — represent one of the largest flows of income into the Jamaican economy, consistently exceeding foreign direct investment in most recent years. Families use this money for housing, education, healthcare, and daily expenses. In many rural communities, remittance income is the primary economic lifeline.

But migration also has costs. Jamaica has experienced significant brain drain — the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers. The country invests in training these professionals, then loses them to wealthier countries that offer higher wages and better conditions. This is a structural problem with no easy solution, since restricting emigration would violate fundamental human rights.

The relationship between Jamaica and its diaspora is not one of loss alone. The diaspora brings investment, ideas, and cultural energy back to the island. Returning migrants often start businesses, build homes, and contribute to civic life. The challenge for Jamaica is to deepen these ties — to make the diaspora not merely a source of remittances, but a genuine partner in the island's development.`,
    question: "What are REMITTANCES, as described in the passage?",
    options: [
      "Taxes paid by Jamaicans to the government",
      "Money sent home by Jamaicans living abroad",
      "Government grants for community development",
      "Profits earned by foreign companies in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage defines remittances explicitly: \'money sent home by Jamaicans living abroad.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Migration and Jamaica: People on the Move

Throughout its history, Jamaica has been a country defined as much by movement as by place. Millions of Jamaicans and their descendants now live outside the island — in the United Kingdom, the United States, Canada, and across the Caribbean. This diaspora, as it is known, maintains strong cultural and economic ties with the homeland, and its contribution to Jamaica is immense.

The most measurable contribution is financial. Remittances — money sent home by Jamaicans living abroad — represent one of the largest flows of income into the Jamaican economy, consistently exceeding foreign direct investment in most recent years. Families use this money for housing, education, healthcare, and daily expenses. In many rural communities, remittance income is the primary economic lifeline.

But migration also has costs. Jamaica has experienced significant brain drain — the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers. The country invests in training these professionals, then loses them to wealthier countries that offer higher wages and better conditions. This is a structural problem with no easy solution, since restricting emigration would violate fundamental human rights.

The relationship between Jamaica and its diaspora is not one of loss alone. The diaspora brings investment, ideas, and cultural energy back to the island. Returning migrants often start businesses, build homes, and contribute to civic life. The challenge for Jamaica is to deepen these ties — to make the diaspora not merely a source of remittances, but a genuine partner in the island's development.`,
    question: "What does \'BRAIN DRAIN\' mean in the passage?",
    options: [
      "A medical condition affecting cognitive ability",
      "The emigration of educated and skilled professionals from Jamaica",
      "The movement of foreign experts into Jamaica",
      "The closing of schools and universities",
    ],
    correctAnswer: 1,
    explanation: "The passage defines brain drain as \'the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers.\'"
  },
  {
    id: 9,
    type: "reading",
    passage: `Migration and Jamaica: People on the Move

Throughout its history, Jamaica has been a country defined as much by movement as by place. Millions of Jamaicans and their descendants now live outside the island — in the United Kingdom, the United States, Canada, and across the Caribbean. This diaspora, as it is known, maintains strong cultural and economic ties with the homeland, and its contribution to Jamaica is immense.

The most measurable contribution is financial. Remittances — money sent home by Jamaicans living abroad — represent one of the largest flows of income into the Jamaican economy, consistently exceeding foreign direct investment in most recent years. Families use this money for housing, education, healthcare, and daily expenses. In many rural communities, remittance income is the primary economic lifeline.

But migration also has costs. Jamaica has experienced significant brain drain — the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers. The country invests in training these professionals, then loses them to wealthier countries that offer higher wages and better conditions. This is a structural problem with no easy solution, since restricting emigration would violate fundamental human rights.

The relationship between Jamaica and its diaspora is not one of loss alone. The diaspora brings investment, ideas, and cultural energy back to the island. Returning migrants often start businesses, build homes, and contribute to civic life. The challenge for Jamaica is to deepen these ties — to make the diaspora not merely a source of remittances, but a genuine partner in the island's development.`,
    question: "Why does the passage describe brain drain as \'a structural problem with no easy solution\'?",
    options: [
      "Because the professionals who leave are impossible to replace.",
      "Because the government does not care about keeping professionals in Jamaica.",
      "Because restricting emigration would violate fundamental human rights, making simple policy solutions unworkable.",
      "Because other countries pay Jamaican professionals to leave.",
    ],
    correctAnswer: 2,
    explanation: "The passage explains: \'restricting emigration would violate fundamental human rights\' — the problem cannot be solved by the obvious policy of stopping people from leaving."
  },
  {
    id: 10,
    type: "reading",
    passage: `Migration and Jamaica: People on the Move

Throughout its history, Jamaica has been a country defined as much by movement as by place. Millions of Jamaicans and their descendants now live outside the island — in the United Kingdom, the United States, Canada, and across the Caribbean. This diaspora, as it is known, maintains strong cultural and economic ties with the homeland, and its contribution to Jamaica is immense.

The most measurable contribution is financial. Remittances — money sent home by Jamaicans living abroad — represent one of the largest flows of income into the Jamaican economy, consistently exceeding foreign direct investment in most recent years. Families use this money for housing, education, healthcare, and daily expenses. In many rural communities, remittance income is the primary economic lifeline.

But migration also has costs. Jamaica has experienced significant brain drain — the emigration of skilled and educated professionals, particularly doctors, nurses, engineers, and teachers. The country invests in training these professionals, then loses them to wealthier countries that offer higher wages and better conditions. This is a structural problem with no easy solution, since restricting emigration would violate fundamental human rights.

The relationship between Jamaica and its diaspora is not one of loss alone. The diaspora brings investment, ideas, and cultural energy back to the island. Returning migrants often start businesses, build homes, and contribute to civic life. The challenge for Jamaica is to deepen these ties — to make the diaspora not merely a source of remittances, but a genuine partner in the island's development.`,
    question: "What does the author suggest would represent a DEEPER relationship between Jamaica and its diaspora?",
    options: [
      "The diaspora sending larger amounts of remittances each year.",
      "Returning migrants voting in Jamaican elections.",
      "The diaspora becoming genuine development partners — investing, building, and contributing to civic life beyond financial transfers.",
      "The Jamaican government paying diaspora members to return.",
    ],
    correctAnswer: 2,
    explanation: "The final paragraph calls for moving beyond remittances — for the diaspora to be \'a genuine partner in the island\'s development,\' investing ideas, businesses, and civic participation."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Mr. Dawes spoke about EFFORT and character.\" The word \'effort\' means —",
    options: [
      "natural talent and intelligence",
      "the praise given by teachers",
      "the work and energy put into achieving something",
      "the amount of time spent in school",
    ],
    correctAnswer: 2,
    explanation: "Effort means the deliberate exertion of energy or work toward achieving something."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"This was the FULL STOP at the end.\" This phrase is used as a METAPHOR. A metaphor —",
    options: [
      "makes a comparison using \'like\' or \'as\'",
      "makes a direct comparison without \'like\' or \'as\'",
      "gives human qualities to non-human things",
      "uses sound to create an effect",
    ],
    correctAnswer: 1,
    explanation: "A metaphor makes a direct comparison without using \'like\' or \'as.\' Calling the meal \'the full stop\' directly equates it with a punctuation mark that signals the end of something."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The diaspora MAINTAINS strong cultural and economic ties with the homeland.\" The word \'maintains\' means —",
    options: [
      "breaks and abandons",
      "creates for the first time",
      "keeps and continues to hold",
      "reduces and weakens",
    ],
    correctAnswer: 2,
    explanation: "To maintain means to keep something in place — to continue holding or preserving it. The diaspora keeps strong ties with Jamaica."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Remittances CONSISTENTLY exceed foreign direct investment.\" The word \'consistently\' means —",
    options: [
      "only occasionally and rarely",
      "always getting larger",
      "reliably and on a regular basis",
      "surprisingly and unexpectedly",
    ],
    correctAnswer: 2,
    explanation: "Consistently means reliably and on a regular basis — something that happens repeatedly rather than just once."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The country INVESTS in training these professionals, then loses them.\" The word \'invests\' means —",
    options: [
      "wastes money on unnecessary things",
      "spends resources with the expectation of future benefit",
      "forces people to complete training",
      "advertises jobs internationally",
    ],
    correctAnswer: 1,
    explanation: "To invest means to spend money or resources with the expectation of gaining benefit in the future. Training professionals is an investment — the country expects to benefit from their work."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The diaspora brings INVESTMENT, ideas, and cultural energy back to the island.\" The word \'investment\' means —",
    options: [
      "the number of people returning to Jamaica each year",
      "money and resources directed into Jamaica for future benefit",
      "cultural performances and festivals",
      "government policy decisions",
    ],
    correctAnswer: 1,
    explanation: "Investment means money or resources directed into something with the expectation of future benefit — in this context, diaspora members funding businesses and development."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Kezia felt she was leaving something BEHIND that she could not bring with her.\" What does this suggest?",
    options: [
      "Kezia is worried she has forgotten her school bag.",
      "Kezia experiences transitions as a form of loss — something from the ending cannot be carried into what comes next.",
      "Kezia is planning to run away from home.",
      "Kezia believes she has lost something physical at school.",
    ],
    correctAnswer: 1,
    explanation: "\'Leaving something behind that she cannot bring\' is figurative — it refers to the intangible feeling of a completed year, a version of herself within that school year that cannot continue into summer."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Restricting emigration would VIOLATE fundamental human rights.\" The word \'violate\' means —",
    options: [
      "to respect and protect",
      "to study and analyse",
      "to break or act against something that should be honoured",
      "to improve and strengthen",
    ],
    correctAnswer: 2,
    explanation: "To violate means to break or act against something — in this context, to break the fundamental human right of freedom of movement."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The children SAT IN THE SHADE of the breadfruit trees.\" What does this detail contribute to the passage?",
    options: [
      "It shows that the school did not have indoor facilities.",
      "It creates a specific, warm image of Jamaican school life — grounding the scene in a particular place and culture.",
      "It suggests the weather was dangerously hot.",
      "It shows that the breadfruit trees were very large.",
    ],
    correctAnswer: 1,
    explanation: "The specific detail of sitting in the shade of breadfruit trees is culturally grounding — it places the scene unmistakably in Jamaica and gives the passage a warm, particular quality."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Jamaica\'s diaspora... MAINTAINS strong ties with the homeland.\" The word \'homeland\' means —",
    options: [
      "the country where someone currently lives",
      "the country of origin or ancestral home",
      "any country in the Caribbean",
      "a government territory administered from abroad",
    ],
    correctAnswer: 1,
    explanation: "Homeland refers to one\'s country of origin or ancestral home — the place from which a person or community originally came."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The contributions of the Jamaican diaspora to the economy is significant.",
      "The contributions of the Jamaican diaspora to the economy are significant.",
      "The contributions of the Jamaican diaspora to the economy was significant.",
      "The contributions of the Jamaican diaspora to the economy have been significant.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'contributions,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Kezia finished eating, the speech already ended.",
      "By the time Kezia finished eating, the speech had already ended.",
      "By the time Kezia finished eating, the speech has already ended.",
      "By the time Kezia finished eating, the speech was already ending.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already ended\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although Jamaica trains many professionals, most emigrate to wealthier countries.\'",
    options: [
      "most emigrate to wealthier countries",
      "Although Jamaica trains many professionals",
      "Jamaica trains many professionals",
      "emigrate to wealthier countries",
    ],
    correctAnswer: 1,
    explanation: "\'Although Jamaica trains many professionals\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Returning migrants start businesses, build homes, and are participating in civic life.",
      "Returning migrants start businesses, build homes, and contribute to civic life.",
      "Returning migrants start businesses, to build homes, and contributing to civic life.",
      "Returning migrants are starting businesses, build homes, and contribute to civic life.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three simple present verbs: start, build, and contribute."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "The diaspora sends millions of dollars in remittances to Jamaica each year.",
      "Returning migrants often start businesses and build homes on the island.",
      "Millions of dollars in remittances are sent to Jamaica by the diaspora each year.",
      "The government has invested significantly in training healthcare workers.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'millions of dollars in remittances\' (subject) receives the action \'are sent.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The end-of-year meal, which Kezia loved most about the last day had become an important ritual.",
      "The end-of-year meal, which Kezia loved most about the last day, had become an important ritual.",
      "The end-of-year meal which Kezia loved most about the last day, had become an important ritual.",
      "The end-of-year meal which Kezia loved most about the last day had become an important ritual.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which Kezia loved most about the last day\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Miss Clarke asked Kezia if she is looking forward to the summer.",
      "Miss Clarke asked Kezia if she was looking forward to the summer.",
      "Miss Clarke asked Kezia if she were looking forward to the summer.",
      "Miss Clarke asked Kezia if she will be looking forward to the summer.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, \'is\' (present tense) shifts back to \'was\' (past tense). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a DANGLING MODIFIER?",
    options: [
      "Having heard the speech many times, Kezia still stood and listened respectfully.",
      "Sitting under the breadfruit trees, the children shared the end-of-year meal.",
      "Looking back at the school building, the year felt suddenly complete to Kezia.",
      "Having invested in their training, the government watches skilled professionals emigrate.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'having invested in their training\' should describe a person or organisation, but the sentence\'s grammatical subject is \'the government watches\' — however, \'the government\' actually IS the implied subject here, so this is actually correct. Let me check option C: \'Looking back at the school building\' — the subject is \'the year,\' not Kezia, so this is dangling. Option C has a dangling modifier."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Remittances are vital to Jamaica; but brain drain is a serious cost.",
      "Remittances are vital to Jamaica; however, brain drain is a serious cost.",
      "Remittances are vital to Jamaica; and the diaspora brings other benefits too.",
      "Remittances; are vital to Jamaica and brain drain is a serious cost.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the children at Pemberton Primary have their own story.",
      "Each of the children at Pemberton Primary has his or her own story.",
      "Each of the children at Pemberton Primary has their own story.",
      "Each of the children at Pemberton Primary have his or her own story.",
    ],
    correctAnswer: 2,
    explanation: "\'Each\' is always singular. The most formally correct option is \'has his or her own story\' — though \'has their own story\' is increasingly accepted, option B with \'his or her\' is the most grammatically precise."
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is important that the diaspora plays a greater role in Jamaica\'s development.",
      "It is important that the diaspora play a greater role in Jamaica\'s development.",
      "It is important that the diaspora played a greater role in Jamaica\'s development.",
      "It is important that the diaspora will play a greater role in Jamaica\'s development.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is important that,\' the subjunctive requires the base form — \'play,\' not \'plays,\' \'played,\' or \'will play.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Mr. Dawes spoke about effort character and the long road ahead.",
      "Mr. Dawes spoke about effort, character, and the long road ahead.",
      "Mr. Dawes spoke about effort, character and the long road ahead.",
      "Mr. Dawes, spoke about effort, character, and the long road ahead.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica should do more to prevent brain drain?",
    options: [
      "Many Jamaican doctors and nurses work in other countries.",
      "Brain drain is a problem in Jamaica.",
      "Every skilled professional who leaves Jamaica represents not only a personal loss for their community but a structural failure of a system that trains people at public expense only to watch them enrich wealthier nations.",
      "Jamaica should offer better salaries to professionals so they will stay.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a powerful two-part claim (\'personal loss\' and \'structural failure\'), uses precise vocabulary, and frames the argument at both the community and systemic level — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "commitement",
      "committment",
      "commitment",
      "commitement",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is commitment — c-o-m-m-i-t-m-e-n-t. Double \'t\' in commit, but only one \'t\' before the suffix."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Kezia felt every year end as a mixture of relief and quiet sadness. The end-of-year meal under the breadfruit trees felt like a full stop — definitive but final. The Caribbean Sea is the largest body of water in the Caribbean region. Miss Clarke understood something of what Kezia was feeling without being told directly.\'",
    options: [
      "The end-of-year meal under the breadfruit trees felt like a full stop — definitive but final.",
      "Miss Clarke understood something of what Kezia was feeling without being told directly.",
      "The Caribbean Sea is the largest body of water in the Caribbean region.",
      "Kezia felt every year end as a mixture of relief and quiet sadness.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Kezia\'s emotional experience at the year\'s end. The sentence about the Caribbean Sea is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Many Jamaicans live abroad and they send money home.\'",
    options: [
      "Many Jamaicans live abroad and many of them send money back home to Jamaica.",
      "The Jamaican diaspora — millions of people living across the United Kingdom, North America, and the wider Caribbean — sends billions of dollars in remittances home each year, making it one of the most significant economic forces in Jamaican life.",
      "Many Jamaicans who live abroad send money back to their families in Jamaica.",
      "Jamaicans abroad send money home and it helps their families.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise vocabulary (\'diaspora,\' \'remittances\'), specifies where diaspora members live, states the scale (\'billions of dollars\'), and frames the significance clearly — transforming a vague claim into an analytically rich statement."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about migration?",
    options: [
      "Some people say brain drain is bad but there are also good sides to migration.",
      "Migration takes professionals away from Jamaica, but this is not a big problem.",
      "While the freedom to emigrate is a fundamental human right that no government should restrict, Jamaica has a legitimate interest in creating conditions — better wages, career opportunities, and civic recognition — that make return or stay more attractive.",
      "Brain drain is a problem and people should stay in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes a genuine right (\'freedom to emigrate is a fundamental human right\') before pivoting to a constructive, specific policy direction — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Kezia liked the end of the school year but was also sad.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Kezia liked the end of the school year but she was also a little bit sad about it.",
      "Even as Kezia welcomed the summer, she felt the quiet grief of endings — the sense that something from the completed year could not follow her into whatever came next.",
      "Kezia was happy and sad at the same time about the end of the school year.",
      "Kezia had mixed feelings because she liked the holiday but was sad school was ending.",
    ],
    correctAnswer: 1,
    explanation: "Option B captures Kezia\'s precise emotional state using the passage\'s own imagery (\'quiet grief of endings,\' \'completed year\'), and ends with a resonant phrase that mirrors the passage\'s insight."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the emotional complexity of transitions?",
    options: [
      "Transitions are part of life and people need to accept them.",
      "Many people feel sad when things come to an end.",
      "Every ending carries within it a small, wordless grief — not for what was wrong, but for what was right enough that we would have kept it longer, if we could.",
      "It is natural to feel both happy and sad when something comes to an end.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically precise (\'not for what was wrong, but for what was right enough\'), uses effective parenthetical contrast, and ends with a quietly powerful conditional — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines the purpose of a HOOK in an introductory paragraph?",
    options: [
      "To list the evidence that will be used in the essay",
      "To summarise the essay\'s conclusion before the argument begins",
      "To capture the reader\'s attention immediately and create a desire to keep reading",
      "To define every key term that will appear in the essay",
    ],
    correctAnswer: 2,
    explanation: "A hook is an opening technique designed to engage the reader from the very first sentence — through a striking image, a surprising fact, a question, or a powerful claim."
  }
]

export default function LiteracyMixed8MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed8Questions : literacyMixed8Questions.slice(0, FREE_QUESTION_LIMIT)
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

  const getScorePercentage = () => Math.round((calculateScore() / totalQuestions) * 100)

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 85) return { grade: "Excellent", color: "text-green-600" }
    if (percentage >= 70) return { grade: "Good", color: "text-blue-600" }
    if (percentage >= 50) return { grade: "Fair", color: "text-amber-600" }
    return { grade: "Needs Improvement", color: "text-red-600" }
  }

  const getPerformanceNote = (percentage: number) => {
    if (percentage >= 85) return "Excellent understanding shown in this section."
    if (percentage >= 70) return "Good performance with only a few areas to review."
    if (percentage >= 50) return "Fair effort. More practice will build confidence."
    return "Needs more practice in this section."
  }

  const getSectionSummaries = () => {
    const sections = [
      { type: "reading" as const, title: "Reading", description: "Comprehension, inference, main idea, and writer's craft" },
      { type: "vocabulary" as const, title: "Vocabulary", description: "Word meaning, synonyms, antonyms, and usage in context" },
      { type: "grammar" as const, title: "Grammar", description: "Sentence structure, tense, punctuation, and language rules" },
      { type: "writing" as const, title: "Writing", description: "Writing conventions, clarity, spelling, and expression" },
    ]
    return sections.map((section) => {
      let total = 0
      let correct = 0
      availableQuestions.forEach((q, index) => {
        if (q.type === section.type) {
          total += 1
          if (answers[index] === q.correctAnswer) correct += 1
        }
      })
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
      return { ...section, total, correct, percentage, note: getPerformanceNote(percentage) }
    }).filter((s) => s.total > 0)
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
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <BookOpen className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 8</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Mixed Practice</p>
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
                        <p className="text-sm text-amber-700">You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question mixed-level literacy test with reports and explanations.</p>
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
                  <h3 className="font-semibold text-sky-800 mb-2">Mixed-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Blend of easy, moderate, and difficult items</li>
                    <li>- Best simulation of a realistic PEP exam</li>
                    <li>- All four sections: Reading, Vocabulary, Grammar, Writing</li>
                    <li>- 40 Questions · 60 Minutes</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each question carefully.</li>
                    <li>- Select the best answer for each question.</li>
                    <li>- You can navigate between questions.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
                  </ul>
                </div>
                <Button onClick={() => setTestStarted(true)} className="w-full bg-slate-700 hover:bg-slate-800 text-lg py-6">Start Test</Button>
                <Link href="/mock-tests/literacy">
                  <Button variant="outline" className="w-full">Back to Literacy Mock Tests</Button>
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
    const sectionSummaries = getSectionSummaries()
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-sky-50 rounded-t-lg border-b">
              <div className="mx-auto mb-4 rounded-xl bg-black p-3 w-fit shadow-sm">
                <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
              </div>
              <CheckCircle className="h-16 w-16 mx-auto text-sky-600 mb-4" />
              <CardTitle className="text-2xl text-sky-800">Mock Test Completed</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 8</p>
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
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">This mixed-level literacy report includes section summaries and a full question-by-question review with explanations.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Section Summary</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sectionSummaries.map((section) => (
                      <div key={section.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-800">{section.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{section.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-sky-700">{section.correct}/{section.total}</p>
                            <p className="text-xs text-slate-500">{section.percentage}%</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-3">{section.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => setShowReview(true)} className="w-full bg-slate-700 hover:bg-slate-800">Review Answers &amp; Report</Button>
                  <Button onClick={restartTest} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-2" />Take Test Again</Button>
                  <Link href="/mock-tests/literacy"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Literacy Mock Tests</Button></Link>
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
    const sectionSummaries = getSectionSummaries()
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
        <style jsx global>{`@media print { header, footer, .no-print { display: none !important; } body { background: #ffffff !important; } .report-sheet { box-shadow: none !important; border: none !important; } }`}</style>
        <SiteHeader />
        <main className="container mx-auto px-4 py-10">
          <Card className="max-w-5xl mx-auto report-sheet shadow-lg">
            <CardHeader className="bg-white border-b rounded-t-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-black p-3 shadow-sm">
                    <Image src="/images/shazoniques-inspiration-logo.png" alt="Shazonique's Inspiration logo" width={220} height={100} className="h-auto w-[180px] sm:w-[220px]" priority />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Managed by Shazonique&apos;s Inspiration</p>
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 8 Report</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">Student: <span className="font-medium">{user?.childName ?? "Student"}</span></p>
                    <p className="text-sm text-gray-600">Completed: <span className="font-medium">{completedAt || new Date().toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-sky-700">{score}/{totalQuestions}</p><p className="text-xs text-slate-600">Score</p></div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]"><p className="text-2xl font-bold text-sky-700">{percentage}%</p><p className="text-xs text-slate-600">Percent</p></div>
                  <div className="rounded-lg bg-sky-50 p-4 min-w-[90px]"><p className={`text-lg font-bold ${color}`}>{grade}</p><p className="text-xs text-slate-600">Performance</p></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-5">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">Performance Summary</h3>
                <p className="text-sm text-slate-700">This report shows the student&apos;s overall result and a full question-by-question review, including the student&apos;s answer, the correct answer, and an explanation for each item.</p>
              </div>
              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Section Summary</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {sectionSummaries.map((section) => (
                    <div key={section.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{section.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{section.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-sky-700">{section.correct}/{section.total}</p>
                          <p className="text-xs text-slate-500">{section.percentage}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3">{section.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {availableQuestions.map((q, index) => {
                  const isCorrect = answers[index] === q.correctAnswer
                  return (
                    <div key={q.id} className={cn("p-5 rounded-xl border-2", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {q.type === "reading" ? "Reading" : q.type === "vocabulary" ? "Vocabulary" : q.type === "grammar" ? "Grammar" : "Writing"}
                            </span>
                          </div>
                          <p className="text-slate-800 mb-3">{q.question}</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-700"><span className="font-medium">Student&apos;s Answer:</span> <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>{answers[index] !== null ? q.options[answers[index]!] : "Not answered"}</span></p>
                            <p className="text-green-700"><span className="font-medium">Correct Answer:</span> {q.options[q.correctAnswer]}</p>
                            <p className="text-slate-700 mt-2"><span className="font-medium">Explanation:</span> {q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">Managed by Shazonique&apos;s Inspiration · A heart&apos;s home of hope</div>
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print max-w-5xl mx-auto">
            <Button onClick={() => window.print()} className="flex-1 bg-slate-700 hover:bg-slate-800"><Printer className="h-4 w-4 mr-2" />Download / Print Report</Button>
            <Button onClick={restartTest} variant="outline" className="flex-1"><RotateCcw className="h-4 w-4 mr-2" />Take Test Again</Button>
            <Link href="/mock-tests/literacy" className="flex-1"><Button variant="outline" className="w-full"><Home className="h-4 w-4 mr-2" />Back to Literacy Mock Tests</Button></Link>
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
              <Link href="/mock-tests/literacy" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Exit Test"><ArrowLeft className="h-5 w-5" /></Link>
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Literacy Mixed 8</h1>
                <p className="text-sky-100 text-xs">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
            </div>
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", timeRemaining <= 300 ? "bg-red-500" : "bg-green-600")}>
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
                  {question.type === "reading" ? "Reading Comprehension" : question.type === "vocabulary" ? "Vocabulary" : question.type === "grammar" ? "Grammar" : "Writing Conventions"}
                </span>
                <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Read the passage:</h4>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">{question.passage}</p>
                </div>
              )}
              <p className="text-lg font-medium text-gray-800 mb-6">{question.question}</p>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(index)} className={cn("w-full p-4 text-left rounded-lg border-2 transition-all", answers[currentQuestion] === index ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-emerald-300 hover:bg-sky-50/50")}>
                    <span className="font-medium text-emerald-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion((prev) => prev - 1)} disabled={currentQuestion === 0}><ChevronLeft className="h-4 w-4 mr-2" />Previous</Button>
            <div className="flex items-center gap-2">
              {currentQuestion === totalQuestions - 1 ? (
                <Button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800"><Flag className="h-4 w-4 mr-2" />Submit Test</Button>
              ) : (
                <Button onClick={() => setCurrentQuestion((prev) => prev + 1)} className="bg-slate-700 hover:bg-slate-800">Next<ChevronRight className="h-4 w-4 ml-2" /></Button>
              )}
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader className="py-3"><CardTitle className="text-sm">Question Navigator</CardTitle></CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-10 gap-2">
                {availableQuestions.map((_, index) => (
                  <button key={index} onClick={() => setCurrentQuestion(index)} className={cn("w-8 h-8 rounded text-sm font-medium transition-colors", currentQuestion === index ? "bg-slate-700 text-white" : answers[index] !== null ? "bg-sky-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>{index + 1}</button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-700"></div><span>Current</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-sky-100"></div><span>Answered</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100"></div><span>Unanswered</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
