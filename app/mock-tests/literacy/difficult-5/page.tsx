"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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

const literacyDifficult5Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Nine Night

When Grandma Elsa died, the house filled with people in a way it never had during her life. Neighbours came who had not crossed the threshold in years. Cousins arrived from Spanish Town and Portmore and one from England, smelling of a different climate. The yard was strung with lights, and from the kitchen rose a steady column of smoke from the pot that had been cooking since early morning.

Kemar was nine years old and did not fully understand what Nine Night meant, only that it was important, and that the rules were different this week. He was allowed to stay up past midnight. Adults spoke openly in front of him about things they would normally hush. He ate more than usual and no one counted.

He sat on the back step watching his Uncle Rohan sing. Rohan sang without embarrassment, which surprised Kemar, because his uncle was a quiet man who measured his words. But grief, Kemar noticed, worked differently on people. Some went very still. Some could not stop moving. Some told stories until the stories became funny, and then they laughed, and the laughing did not seem wrong — it seemed necessary.

On the ninth night, Kemar's mother lit a candle at the corner of the yard where Grandma Elsa used to sit. The flame held in the still air for a long time.

"Is she there?" Kemar whispered.

His mother put her arm around him. "She's in all of it," she said. "The food, the singing, the people who came. That's what Nine Night is for — to remind us that a person doesn't just disappear.`,
    question: "What does Kemar\'s observation that \'grief worked differently on people\' reveal about him?",
    options: [
      "He thinks some people are not truly sad about Grandma Elsa.",
      "He is beginning to develop an empathetic understanding of how emotions are expressed in different ways.",
      "He is confused and frightened by the behaviour of the adults around him.",
      "He believes some people are being dishonest about their feelings.",
    ],
    correctAnswer: 1,
    explanation: "Kemar notices that some people go still, some cannot stop moving, some tell stories and laugh. His observation is perceptive and empathetic — he is developing insight into the complexity of human emotion."
  },
  {
    id: 2,
    type: "reading",
    passage: `Nine Night

When Grandma Elsa died, the house filled with people in a way it never had during her life. Neighbours came who had not crossed the threshold in years. Cousins arrived from Spanish Town and Portmore and one from England, smelling of a different climate. The yard was strung with lights, and from the kitchen rose a steady column of smoke from the pot that had been cooking since early morning.

Kemar was nine years old and did not fully understand what Nine Night meant, only that it was important, and that the rules were different this week. He was allowed to stay up past midnight. Adults spoke openly in front of him about things they would normally hush. He ate more than usual and no one counted.

He sat on the back step watching his Uncle Rohan sing. Rohan sang without embarrassment, which surprised Kemar, because his uncle was a quiet man who measured his words. But grief, Kemar noticed, worked differently on people. Some went very still. Some could not stop moving. Some told stories until the stories became funny, and then they laughed, and the laughing did not seem wrong — it seemed necessary.

On the ninth night, Kemar's mother lit a candle at the corner of the yard where Grandma Elsa used to sit. The flame held in the still air for a long time.

"Is she there?" Kemar whispered.

His mother put her arm around him. "She's in all of it," she said. "The food, the singing, the people who came. That's what Nine Night is for — to remind us that a person doesn't just disappear.`,
    question: "What is the EFFECT of the detail that the laughter \'did not seem wrong — it seemed necessary\'?",
    options: [
      "It suggests that the mourners did not really love Grandma Elsa.",
      "It shows that Kemar found the situation funny and embarrassing.",
      "It reveals the way grief and joy can coexist in a cultural mourning ritual, where laughter is a form of celebration and release.",
      "It proves that the Nine Night was not being taken seriously.",
    ],
    correctAnswer: 2,
    explanation: "The idea that laughter is \'necessary\' rather than \'wrong\' captures something important about Nine Night — it is not only a time of sadness but of communal celebration of a life. Laughter and grief are not opposites here."
  },
  {
    id: 3,
    type: "reading",
    passage: `Nine Night

When Grandma Elsa died, the house filled with people in a way it never had during her life. Neighbours came who had not crossed the threshold in years. Cousins arrived from Spanish Town and Portmore and one from England, smelling of a different climate. The yard was strung with lights, and from the kitchen rose a steady column of smoke from the pot that had been cooking since early morning.

Kemar was nine years old and did not fully understand what Nine Night meant, only that it was important, and that the rules were different this week. He was allowed to stay up past midnight. Adults spoke openly in front of him about things they would normally hush. He ate more than usual and no one counted.

He sat on the back step watching his Uncle Rohan sing. Rohan sang without embarrassment, which surprised Kemar, because his uncle was a quiet man who measured his words. But grief, Kemar noticed, worked differently on people. Some went very still. Some could not stop moving. Some told stories until the stories became funny, and then they laughed, and the laughing did not seem wrong — it seemed necessary.

On the ninth night, Kemar's mother lit a candle at the corner of the yard where Grandma Elsa used to sit. The flame held in the still air for a long time.

"Is she there?" Kemar whispered.

His mother put her arm around him. "She's in all of it," she said. "The food, the singing, the people who came. That's what Nine Night is for — to remind us that a person doesn't just disappear.`,
    question: "Why is it significant that Uncle Rohan, described as \'a quiet man who measured his words,\' sang openly during Nine Night?",
    options: [
      "Rohan was embarrassed and did not realise people were watching him.",
      "It shows that Nine Night breaks through ordinary social constraints and allows authentic emotional expression.",
      "Rohan had always wanted to be a singer but was too shy to perform normally.",
      "It suggests that Rohan was Grandma Elsa\'s favourite relative.",
    ],
    correctAnswer: 1,
    explanation: "The contrast between Rohan\'s usual quiet reserve and his open singing during Nine Night shows how the ritual creates a different emotional space — one where ordinary social constraints do not apply."
  },
  {
    id: 4,
    type: "reading",
    passage: `Nine Night

When Grandma Elsa died, the house filled with people in a way it never had during her life. Neighbours came who had not crossed the threshold in years. Cousins arrived from Spanish Town and Portmore and one from England, smelling of a different climate. The yard was strung with lights, and from the kitchen rose a steady column of smoke from the pot that had been cooking since early morning.

Kemar was nine years old and did not fully understand what Nine Night meant, only that it was important, and that the rules were different this week. He was allowed to stay up past midnight. Adults spoke openly in front of him about things they would normally hush. He ate more than usual and no one counted.

He sat on the back step watching his Uncle Rohan sing. Rohan sang without embarrassment, which surprised Kemar, because his uncle was a quiet man who measured his words. But grief, Kemar noticed, worked differently on people. Some went very still. Some could not stop moving. Some told stories until the stories became funny, and then they laughed, and the laughing did not seem wrong — it seemed necessary.

On the ninth night, Kemar's mother lit a candle at the corner of the yard where Grandma Elsa used to sit. The flame held in the still air for a long time.

"Is she there?" Kemar whispered.

His mother put her arm around him. "She's in all of it," she said. "The food, the singing, the people who came. That's what Nine Night is for — to remind us that a person doesn't just disappear.`,
    question: "Kemar\'s mother says: \'She\'s in all of it — the food, the singing, the people who came.\' What is she suggesting about death and memory?",
    options: [
      "Grandma Elsa\'s spirit is literally present in the physical objects at Nine Night.",
      "A person\'s presence lives on through the communal acts, relationships, and traditions they shaped.",
      "The food and singing are magical rituals that bring Grandma Elsa back temporarily.",
      "Kemar\'s mother is trying to comfort him with a lie.",
    ],
    correctAnswer: 1,
    explanation: "She is saying that Grandma Elsa lives on in the people, actions, and traditions she shaped — not physically, but in the texture of the communal gathering. This is a sophisticated idea about how the dead persist through the living."
  },
  {
    id: 5,
    type: "reading",
    passage: `Nine Night

When Grandma Elsa died, the house filled with people in a way it never had during her life. Neighbours came who had not crossed the threshold in years. Cousins arrived from Spanish Town and Portmore and one from England, smelling of a different climate. The yard was strung with lights, and from the kitchen rose a steady column of smoke from the pot that had been cooking since early morning.

Kemar was nine years old and did not fully understand what Nine Night meant, only that it was important, and that the rules were different this week. He was allowed to stay up past midnight. Adults spoke openly in front of him about things they would normally hush. He ate more than usual and no one counted.

He sat on the back step watching his Uncle Rohan sing. Rohan sang without embarrassment, which surprised Kemar, because his uncle was a quiet man who measured his words. But grief, Kemar noticed, worked differently on people. Some went very still. Some could not stop moving. Some told stories until the stories became funny, and then they laughed, and the laughing did not seem wrong — it seemed necessary.

On the ninth night, Kemar's mother lit a candle at the corner of the yard where Grandma Elsa used to sit. The flame held in the still air for a long time.

"Is she there?" Kemar whispered.

His mother put her arm around him. "She's in all of it," she said. "The food, the singing, the people who came. That's what Nine Night is for — to remind us that a person doesn't just disappear.`,
    question: "Which word BEST describes the TONE of the Nine Night passage?",
    options: [
      "Frightening and eerie",
      "Warm, contemplative, and gently celebratory",
      "Cold and clinical",
      "Angry and resentful",
    ],
    correctAnswer: 1,
    explanation: "The passage is full of warmth — lights, food, singing, community — while also being reflective and thoughtful. The tone is warm, contemplative, and gently celebratory of life even in the face of death."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Case for Financial Literacy in Schools

Most people will spend their entire adult lives managing money: earning it, spending it, saving it, borrowing it, and trying not to lose it. Yet in many school systems, including Jamaica's, students can complete twelve years of formal education without ever being taught the basic mechanics of personal finance. This gap between what schools teach and what life requires is not a minor oversight. It is a structural failure with real consequences.

The evidence suggests that financial literacy is linked to better economic outcomes. Adults who understand compound interest are less likely to be trapped in high-interest debt. Those who understand the difference between assets and liabilities make better long-term decisions about housing, insurance, and investment. Communities with higher rates of financial literacy show greater levels of household stability and intergenerational wealth — a particularly significant point in a country still working to address the economic legacies of colonialism and poverty.

Critics sometimes argue that personal finance is best taught at home. But this logic, however appealing, is deeply flawed. The child whose parents were never taught financial literacy cannot inherit knowledge that was never passed down. Schools exist precisely to provide what homes cannot always give — a structured, equitable foundation of essential knowledge.

Introducing financial literacy as a required subject at the primary level would not be a luxury. It would be a correction — a long-overdue acknowledgement that preparing young people for the world they will actually live in is among the most fundamental responsibilities of any education system.`,
    question: "What is the CENTRAL CLAIM of the financial literacy passage?",
    options: [
      "Schools are failing because teachers are not well trained in financial subjects.",
      "Parents should take sole responsibility for teaching their children about money.",
      "Financial literacy should be a required school subject because its absence is a serious structural gap with real consequences for individuals and communities.",
      "Jamaica\'s economy would immediately improve if financial literacy were taught in schools.",
    ],
    correctAnswer: 2,
    explanation: "The passage argues that the absence of financial literacy education is \'a structural failure,\' not a minor gap, and that making it a required subject would be \'a correction\' — a long-overdue fix."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Case for Financial Literacy in Schools

Most people will spend their entire adult lives managing money: earning it, spending it, saving it, borrowing it, and trying not to lose it. Yet in many school systems, including Jamaica's, students can complete twelve years of formal education without ever being taught the basic mechanics of personal finance. This gap between what schools teach and what life requires is not a minor oversight. It is a structural failure with real consequences.

The evidence suggests that financial literacy is linked to better economic outcomes. Adults who understand compound interest are less likely to be trapped in high-interest debt. Those who understand the difference between assets and liabilities make better long-term decisions about housing, insurance, and investment. Communities with higher rates of financial literacy show greater levels of household stability and intergenerational wealth — a particularly significant point in a country still working to address the economic legacies of colonialism and poverty.

Critics sometimes argue that personal finance is best taught at home. But this logic, however appealing, is deeply flawed. The child whose parents were never taught financial literacy cannot inherit knowledge that was never passed down. Schools exist precisely to provide what homes cannot always give — a structured, equitable foundation of essential knowledge.

Introducing financial literacy as a required subject at the primary level would not be a luxury. It would be a correction — a long-overdue acknowledgement that preparing young people for the world they will actually live in is among the most fundamental responsibilities of any education system.`,
    question: "What does the phrase \'intergenerational wealth\' mean in the context of the passage?",
    options: [
      "Money that is earned during a single generation",
      "Wealth that is accumulated and passed from one generation to the next over time",
      "The difference between what parents earn and what children earn",
      "A government programme designed to reduce poverty",
    ],
    correctAnswer: 1,
    explanation: "Intergenerational wealth refers to assets, savings, or financial security that is built up over time and passed from parents to children and grandchildren across generations."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Case for Financial Literacy in Schools

Most people will spend their entire adult lives managing money: earning it, spending it, saving it, borrowing it, and trying not to lose it. Yet in many school systems, including Jamaica's, students can complete twelve years of formal education without ever being taught the basic mechanics of personal finance. This gap between what schools teach and what life requires is not a minor oversight. It is a structural failure with real consequences.

The evidence suggests that financial literacy is linked to better economic outcomes. Adults who understand compound interest are less likely to be trapped in high-interest debt. Those who understand the difference between assets and liabilities make better long-term decisions about housing, insurance, and investment. Communities with higher rates of financial literacy show greater levels of household stability and intergenerational wealth — a particularly significant point in a country still working to address the economic legacies of colonialism and poverty.

Critics sometimes argue that personal finance is best taught at home. But this logic, however appealing, is deeply flawed. The child whose parents were never taught financial literacy cannot inherit knowledge that was never passed down. Schools exist precisely to provide what homes cannot always give — a structured, equitable foundation of essential knowledge.

Introducing financial literacy as a required subject at the primary level would not be a luxury. It would be a correction — a long-overdue acknowledgement that preparing young people for the world they will actually live in is among the most fundamental responsibilities of any education system.`,
    question: "What does the author mean by \'the child whose parents were never taught financial literacy cannot inherit knowledge that was never passed down\'?",
    options: [
      "Parents who do not understand money are irresponsible.",
      "Financial knowledge can only be gained from formal schooling, not from family.",
      "Relying on the home to teach financial literacy is unfair to children whose parents lacked that education — perpetuating inequality.",
      "Children learn more from their parents than from their teachers.",
    ],
    correctAnswer: 2,
    explanation: "The argument is that \'taught at home\' logic perpetuates inequality: families without financial knowledge cannot transmit what they do not have, so only schools can provide equitable access to this education."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Case for Financial Literacy in Schools

Most people will spend their entire adult lives managing money: earning it, spending it, saving it, borrowing it, and trying not to lose it. Yet in many school systems, including Jamaica's, students can complete twelve years of formal education without ever being taught the basic mechanics of personal finance. This gap between what schools teach and what life requires is not a minor oversight. It is a structural failure with real consequences.

The evidence suggests that financial literacy is linked to better economic outcomes. Adults who understand compound interest are less likely to be trapped in high-interest debt. Those who understand the difference between assets and liabilities make better long-term decisions about housing, insurance, and investment. Communities with higher rates of financial literacy show greater levels of household stability and intergenerational wealth — a particularly significant point in a country still working to address the economic legacies of colonialism and poverty.

Critics sometimes argue that personal finance is best taught at home. But this logic, however appealing, is deeply flawed. The child whose parents were never taught financial literacy cannot inherit knowledge that was never passed down. Schools exist precisely to provide what homes cannot always give — a structured, equitable foundation of essential knowledge.

Introducing financial literacy as a required subject at the primary level would not be a luxury. It would be a correction — a long-overdue acknowledgement that preparing young people for the world they will actually live in is among the most fundamental responsibilities of any education system.`,
    question: "Why does the author describe making financial literacy a required subject as \'a correction\' rather than \'an addition\'?",
    options: [
      "To suggest that financial literacy is more important than other school subjects.",
      "To frame it as fixing an error or gap — restoring something that should always have been there, not adding a luxury.",
      "To indicate that the school curriculum needs to be completely redesigned.",
      "To imply that schools currently teach financial literacy incorrectly.",
    ],
    correctAnswer: 1,
    explanation: "\'A correction\' implies that its absence was wrong — it should have been there all along. This framing is stronger than \'an addition,\' which might suggest it is optional or supplementary."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the financial literacy passage?",
    options: [
      "Uncertain and hesitant",
      "Urgent and analytically persuasive",
      "Angry and accusatory",
      "Light and conversational",
    ],
    correctAnswer: 1,
    explanation: "The passage uses precise evidence, logical structure, and direct language to argue a clear position. The tone is urgent (\'structural failure,\' \'long-overdue\') but grounded in analysis rather than emotion."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Cousins arrived smelling of a DIFFERENT CLIMATE.\" This phrase is used figuratively to suggest —",
    options: [
      "The cousins had been swimming before they arrived.",
      "The cousins carried with them the physical and cultural atmosphere of a different place.",
      "The weather in England is different from the weather in Jamaica.",
      "The cousins wore a strong perfume that smelled unusual.",
    ],
    correctAnswer: 1,
    explanation: "\'Different climate\' is figurative — it suggests the cousin from England brought with him something of that country\'s physical and cultural feel. It is an evocative, poetic way of describing how people carry places with them."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Rohan sang WITHOUT EMBARRASSMENT.\" Why does this detail carry weight?",
    options: [
      "Because singing in public is normally considered inappropriate.",
      "Because Rohan was not a professional singer and usually avoided attention.",
      "Because the author had previously established Rohan as a reserved and measured man — making his open singing surprising and revealing.",
      "Because singing is normally only done in church in Jamaican culture.",
    ],
    correctAnswer: 2,
    explanation: "The contrast works because the reader already knows Rohan \'measured his words.\' Singing without embarrassment is unexpected from this character — which makes it revealing about Nine Night\'s emotional power."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"This gap is not a MINOR OVERSIGHT — it is a structural failure.\" The word \'oversight\' means —",
    options: [
      "a deliberate decision made by policymakers",
      "something that was missed or neglected unintentionally",
      "a law that is no longer being enforced",
      "a complex philosophical argument",
    ],
    correctAnswer: 1,
    explanation: "An oversight is something that was not noticed or was accidentally neglected. The author argues the gap is not merely accidental — it is a serious systemic failure."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Adults who understand COMPOUND INTEREST are less likely to be trapped in debt.\" Compound interest refers to —",
    options: [
      "a simple fee charged by banks on borrowed money",
      "interest calculated not only on the original sum but also on previously earned interest, causing it to grow rapidly",
      "a government tax on savings accounts",
      "the total amount borrowed from a bank",
    ],
    correctAnswer: 1,
    explanation: "Compound interest means interest is charged on both the original amount and on accumulated interest — this causes debt to grow faster than simple interest, and understanding it helps people avoid debt traps."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Schools provide a STRUCTURED, EQUITABLE foundation of essential knowledge.\" The word \'equitable\' means —",
    options: [
      "expensive and difficult to access",
      "fair and giving everyone the same opportunity regardless of background",
      "based on examination results",
      "subject to change depending on government policy",
    ],
    correctAnswer: 1,
    explanation: "Equitable means fair and impartial — providing the same access and opportunities to everyone regardless of their circumstances or background."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The flame HELD in the still air for a long time.\" The word \'held\' suggests —",
    options: [
      "the candle fell over and had to be relighted",
      "the flame remained steady and did not flicker or go out",
      "the flame was too small to see clearly",
      "the wind was blowing strongly that night",
    ],
    correctAnswer: 1,
    explanation: "\'Held\' in this context means the flame remained steady — it stayed alight without being extinguished or flickering. In the context of Nine Night, this has a quiet, significant feeling."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The food, the singing, the people who came — that is what Nine Night is FOR.\" The word \'for\' here implies that Nine Night has a —",
    options: [
      "decorative purpose",
      "commercial purpose",
      "moral and communal purpose — it exists to serve a specific social and emotional function",
      "religious requirement imposed by law",
    ],
    correctAnswer: 2,
    explanation: "\'What Nine Night is for\' means its purpose or function. Kemar\'s mother is explaining that Nine Night is designed to serve a specific communal function — to remind the living that the dead persist through them."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Preparing young people for the world they will ACTUALLY live in.\" The word \'actually\' implies —",
    options: [
      "a theoretical world described in textbooks",
      "the idealised world imagined by curriculum designers",
      "the practical, real world of financial decisions, responsibilities, and challenges",
      "the world described in history lessons",
    ],
    correctAnswer: 2,
    explanation: "\'Actually\' signals a contrast between what schools currently prepare students for (theoretical, academic) and the real, practical world students will genuinely inhabit."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The economic LEGACIES of colonialism and poverty.\" The word \'legacies\' means —",
    options: [
      "legal documents left behind by colonial governments",
      "long-lasting consequences or inheritances from past events and systems",
      "financial payments made by former colonial powers",
      "temporary economic problems that will resolve on their own",
    ],
    correctAnswer: 1,
    explanation: "Legacies are things passed down or left behind — in this context, the long-lasting economic effects of Jamaica\'s colonial history and structural poverty that continue to affect present generations."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Some people could not stop MOVING.\" In the context of the Nine Night passage, what does this restless movement suggest?",
    options: [
      "The people were dancing as part of a traditional ritual.",
      "Movement is one way grief manifests — an inability to be still when overwhelmed by emotion.",
      "The people were nervous about being at the Nine Night.",
      "The house was too small and crowded for people to find a place to sit.",
    ],
    correctAnswer: 1,
    explanation: "Kemar is observing how grief takes different physical forms. The inability to stop moving is one expression of grief — the body externalising an internal emotional state."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The absence of financial literacy in schools have caused real harm.",
      "The absence of financial literacy in schools has caused real harm.",
      "The absence of financial literacy in schools are causing real harm.",
      "The absence of financial literacy in schools were causing real harm.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the absence,\' which is singular. The correct verb is \'has caused.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Kemar turned nine, he already witnessed several Nine Nights.",
      "By the time Kemar turned nine, he had already witnessed several Nine Nights.",
      "By the time Kemar turned nine, he has already witnessed several Nine Nights.",
      "By the time Kemar turned nine, he was already witnessing several Nine Nights.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had\' + past participle) is required for an action completed before another past event. \'Had already witnessed\' is correct."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although many students complete twelve years of school, they may never learn basic financial skills.\'",
    options: [
      "they may never learn basic financial skills",
      "Although many students complete twelve years of school",
      "many students complete twelve years of school",
      "learn basic financial skills",
    ],
    correctAnswer: 1,
    explanation: "\'Although many students complete twelve years of school\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Managing money involves earning it, to save it, and knowing how to spend it.",
      "Managing money involves earning it, saving it, and spending it wisely.",
      "Managing money involves earning, to save, and how you spend it wisely.",
      "Managing money involves to earn it, saving it, and you need to spend it wisely.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a series to use the same grammatical form. Option B uses three gerunds: earning, saving, and spending."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Schools have failed to teach financial literacy for decades.",
      "Students complete their education without learning personal finance.",
      "Financial literacy has been neglected by most school curricula for generations.",
      "Communities with financial literacy show greater household stability.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. In option C, \'financial literacy\' (subject) receives the action \'has been neglected.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a NON-RESTRICTIVE RELATIVE CLAUSE correctly:",
    options: [
      "Nine Night, which is a Jamaican mourning tradition has been practised for generations.",
      "Nine Night which is a Jamaican mourning tradition, has been practised for generations.",
      "Nine Night, which is a Jamaican mourning tradition, has been practised for generations.",
      "Nine Night, which is a Jamaican mourning tradition has been practised, for generations.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which is a Jamaican mourning tradition\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Kemar\'s mother said that a person doesn\'t just disappear.",
      "Kemar\'s mother said that a person didn\'t just disappear.",
      "Kemar\'s mother said that a person hadn\'t just disappear.",
      "Kemar\'s mother said a person won\'t just disappear.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense (\'doesn\'t\') shifts back to past (\'didn\'t\'). Option B correctly applies this backshift."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Sitting on the back step, Kemar watched his uncle sing.",
      "Kemar watched his uncle sing, sitting on the back step.",
      "Singing without embarrassment, Rohan\'s voice carried across the yard.",
      "Lit by the yard lights, the gathering looked almost festive.",
    ],
    correctAnswer: 1,
    explanation: "In option B, \'sitting on the back step\' appears to modify \'his uncle\' rather than \'Kemar.\' The modifier is misplaced — it should be closer to Kemar."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Nine Night is a communal tradition; but it is also deeply personal.",
      "Nine Night is a communal tradition; however, it is also deeply personal.",
      "Nine Night is a communal tradition; and it brings families together.",
      "Nine Night; is a communal tradition that brings families together.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is correct. Semicolons should not precede coordinating conjunctions (\'but,\' \'and\')."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement with \'each\'?",
    options: [
      "Each of the students need to learn basic financial skills.",
      "Each of the students needs to learn basic financial skills.",
      "Each of the students need basic financial skills to be learned.",
      "Each of the students are needing to learn basic financial skills.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular and takes a singular verb. The correct form is \'needs.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the COLON correctly:",
    options: [
      "Financial literacy covers several areas: budgeting, saving, investing, and debt management.",
      "Financial literacy covers: several areas budgeting, saving, investing, and debt management.",
      "Financial literacy covers several areas budgeting: saving, investing, and debt management.",
      "Financial literacy: covers several areas budgeting, saving, investing, and debt management.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list. \'Financial literacy covers several areas\' is a complete clause, and the colon correctly introduces the list."
  },
  {
    id: 32,
    type: "grammar",
    question: "Identify the ERROR: \'The students who attends the financial literacy programme shows improvement.\'",
    options: [
      "students should be student",
      "who attends should be who attend and shows should be show",
      "programme should be programs",
      "improvement should be improvements",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'students\' (plural), which requires \'who attend\' and \'show.\' Both verb errors must be corrected."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that financial literacy should be taught in Jamaican primary schools?",
    options: [
      "Many Jamaican adults do not know how to manage their money well.",
      "Some schools in other countries already teach financial literacy.",
      "Introducing financial literacy at the primary level would equip Jamaica\'s youngest learners with the practical skills that formal education has long overlooked — skills that shape economic security for life.",
      "Financial literacy is important for adults in all countries around the world.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, school-level claim, uses precise vocabulary (\'equip,\' \'practical skills,\' \'economic security\'), and frames the argument as righting a long-standing wrong — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Nine Night is a Jamaican tradition where people come together when someone dies.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Nine Night is a tradition in Jamaica and people come together when someone dies at it.",
      "Nine Night is a Jamaican tradition where many people come to be together when a person dies and there is food.",
      "Nine Night is a Jamaican mourning tradition in which family, neighbours, and community gather for nine nights to celebrate a life, share stories, and ease the passage of grief through song, food, and collective memory.",
      "When someone dies in Jamaica, people come together for a tradition called Nine Night.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses formal vocabulary, specific details (\'nine nights,\' \'song, food, and collective memory\'), and a more complex sentence structure — transforming a simple definition into a rich, accurate description."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Financial literacy is important because it helps people with their money.\'",
    options: [
      "Financial literacy is really very important because it helps many people with all their money problems.",
      "Financial literacy matters because people need to know about money.",
      "Financial literacy is essential because it equips individuals to make informed decisions about debt, savings, and investment — decisions that shape economic security across a lifetime.",
      "It is important to learn about financial literacy because money is something everyone has to deal with.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'equips,\' \'informed decisions,\' \'economic security\'), is specific about the types of decisions involved, and frames the impact in meaningful terms (\'across a lifetime\')."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Nine Night demonstrates how communities honour the dead while supporting the living. The ritual draws neighbours, family members, and even distant relatives together. Music and food play a central role in the tradition. Jamaica also has a national dish called ackee and saltfish. The gathering creates a space for both grief and celebration.\'",
    options: [
      "Music and food play a central role in the tradition.",
      "The ritual draws neighbours, family members, and even distant relatives together.",
      "Jamaica also has a national dish called ackee and saltfish.",
      "The gathering creates a space for both grief and celebration.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is specifically about Nine Night. The sentence about Jamaica\'s national dish is irrelevant and should be removed."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION?",
    options: [
      "Some people say financial literacy is best taught at home, but they are completely wrong.",
      "While parents play an important role in transmitting financial values, the structural inequity of relying solely on the home means that children from financially illiterate families are permanently disadvantaged.",
      "Many people have different opinions about where financial literacy should be taught.",
      "Financial literacy is important both at home and at school.",
    ],
    correctAnswer: 1,
    explanation: "Option B concedes the opposing view honestly (\'parents play an important role\') before countering it with a strong structural argument (\'structural inequity,\' \'permanently disadvantaged\'). This is the format of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Kemar learned a lot from Nine Night about death and grief.\' What is the MOST PRECISE revision?",
    options: [
      "Kemar learned many things from Nine Night about what death and grief are like.",
      "Nine Night taught Kemar many things that were important about life and death.",
      "Through Nine Night, Kemar began to understand that grief is not uniform, that laughter and mourning can coexist, and that a person persists in the lives they have shaped — not as memory alone, but as presence.",
      "Kemar learned about death and grief and what Nine Night meant to his family.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific about what Kemar learned (\'grief is not uniform,\' \'laughter and mourning can coexist\'), uses the language of the passage (\'persists in the lives they have shaped\'), and captures the passage\'s philosophical depth."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of Nine Night?",
    options: [
      "Nine Night is a very important tradition for Jamaican families.",
      "The food and singing at Nine Night help people to feel better about loss.",
      "Nine Night endures because it answers a need no other institution can fully meet — the need to grieve together, to laugh together, and to know that the people we love do not simply leave us when they die.",
      "Families in Jamaica have been practising Nine Night for many generations.",
    ],
    correctAnswer: 2,
    explanation: "Option C explains why Nine Night \'endures\' (why it persists), lists what it provides (\'grieve together, laugh together\'), and ends with a powerful philosophical statement about love and loss. It is the strongest closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the role of a THESIS STATEMENT in a persuasive essay?",
    options: [
      "To list all the evidence the writer will use",
      "To introduce the topic without taking a position",
      "To state the writer\'s central argument clearly and specifically, giving the essay a direction and claim to be supported",
      "To summarise what other people have written about the topic",
    ],
    correctAnswer: 2,
    explanation: "A thesis statement is the central claim of a persuasive essay — it tells the reader what position the writer is arguing. Option C correctly identifies this function."
  }
]

const sectionOrder = ["reading", "vocabulary", "grammar", "writing"] as const

type SectionType = (typeof sectionOrder)[number]

const sectionMeta: Record<SectionType, { label: string; description: string }> = {
  reading: {
    label: "Reading",
    description: "Inference, tone, writer's craft, and close reading of longer passages.",
  },
  vocabulary: {
    label: "Vocabulary",
    description: "Word meaning in context, figurative language, and precise word choice.",
  },
  grammar: {
    label: "Grammar",
    description: "Editing in context, complex sentence structure, and advanced language use.",
  },
  writing: {
    label: "Writing",
    description: "Paragraph coherence, persuasive technique, evidence, and writing conventions.",
  },
}

function getPerformanceNote(percentage: number) {
  if (percentage >= 85) return "Excellent"
  if (percentage >= 70) return "Good"
  if (percentage >= 50) return "Fair"
  return "Needs Improvement"
}

export default function LiteracyDifficult5Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult5Questions : literacyDifficult5Questions.slice(0, FREE_QUESTION_LIMIT)
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

  const sectionSummaries = useMemo(() => {
    return sectionOrder.map((section) => {
      const items = availableQuestions.filter((q) => q.type === section)
      const correct = items.reduce((sum, question) => {
        const index = availableQuestions.findIndex((q) => q.id === question.id)
        return sum + (answers[index] === question.correctAnswer ? 1 : 0)
      }, 0)
      const total = items.length
      const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
      return {
        key: section,
        label: sectionMeta[section].label,
        description: sectionMeta[section].description,
        correct,
        total,
        percentage,
        note: getPerformanceNote(percentage),
      }
    })
  }, [answers, availableQuestions])

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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 5</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Difficult Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question difficult-level literacy test with reports and explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Difficulty Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Stronger inference and closer reading</li>
                    <li>- Tone, writer&apos;s craft, and figurative language</li>
                    <li>- Editing in context and paragraph coherence</li>
                    <li>- More challenging distractors throughout</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Read each passage and question carefully.</li>
                    <li>- Look back at the text when needed.</li>
                    <li>- Think carefully before choosing between close answer choices.</li>
                    <li>- Submit when you are finished.</li>
                    <li>- The test will auto-submit when time runs out.</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 5</p>
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
                  {sectionSummaries.map((section) => (
                    <div key={section.key} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <p className="font-semibold text-sky-800">{section.label}</p>
                      <p className="text-sm text-slate-700 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
                      <p className="text-sm text-slate-600 mt-1">{section.note}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left">
                  <h3 className="text-lg font-semibold text-sky-800 mb-2">Result Summary</h3>
                  <p className="text-sm text-slate-700">
                    This difficult-level literacy report includes section summaries and a full question-by-question review with explanations.
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
            header, footer, .no-print { display: none !important; }
            body { background: #ffffff !important; }
            .report-sheet { box-shadow: none !important; border: none !important; }
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 5 Report</CardTitle>
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
                  This report shows the student&apos;s overall result, section-by-section performance, and a full review of each question with explanations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {sectionSummaries.map((section) => (
                  <div key={section.key} className="rounded-xl border border-sky-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sky-800">{section.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">{section.correct}/{section.total}</p>
                        <p className="text-sm text-slate-600">{section.percentage}%</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-3">{section.note}</p>
                  </div>
                ))}
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-slate-800">Question {index + 1}</p>
                            <span className="text-xs uppercase tracking-wide rounded-full bg-white px-2 py-1 text-slate-600 border">
                              {sectionMeta[q.type].label}
                            </span>
                          </div>
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
                <h1 className="text-lg font-bold">Literacy Difficult 5</h1>
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
                <span className="text-sm font-medium text-emerald-700 uppercase">{sectionMeta[question.type].label}</span>
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
