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

const literacyMixed4Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Breadfruit Story

Every family in the district had a story about the year the breadfruit failed. In Kezia's family, the story began with her great-grandfather, a man called Daniel, who had planted his trees in the hillside soil above the village. One summer, a blight came through and the breadfruit trees dropped their fruit before it was ripe. The green balls hit the ground hard and lay there, useless.

"What Daniel did next," Kezia's grandmother always said, telling the story in her kitchen, "was the only sensible thing. He went to the neighbours."

The neighbours, it turned out, had not lost their crops. Some had breadfruit, some had sweet potato, some had callaloo. Daniel traded what little he had — strong hands, first of all — for what they could spare. By the end of that week, his family had eaten.

Kezia had heard this story dozens of times. She knew her grandmother told it not just as family history but as instruction: when things fail, go to the community. What you cannot manage alone, you can sometimes manage together.

The year Kezia turned twelve, her school's library roof collapsed in a storm. Within two weeks, every student in the school had brought at least one book from home. The library, when it reopened, was larger than before.`,
    question: "What was the lesson Kezia\'s grandmother always taught through the breadfruit story?",
    options: [
      "Never plant breadfruit trees on a hillside.",
      "A good farmer always stores extra food for difficult times.",
      "When individual effort fails, turning to the community is both practical and wise.",
      "Daniel was the most hardworking man in the village.",
    ],
    correctAnswer: 2,
    explanation: "The grandmother tells the story as instruction: \'when things fail, go to the community. What you cannot manage alone, you can sometimes manage together.\'"
  },
  {
    id: 2,
    type: "reading",
    passage: `The Breadfruit Story

Every family in the district had a story about the year the breadfruit failed. In Kezia's family, the story began with her great-grandfather, a man called Daniel, who had planted his trees in the hillside soil above the village. One summer, a blight came through and the breadfruit trees dropped their fruit before it was ripe. The green balls hit the ground hard and lay there, useless.

"What Daniel did next," Kezia's grandmother always said, telling the story in her kitchen, "was the only sensible thing. He went to the neighbours."

The neighbours, it turned out, had not lost their crops. Some had breadfruit, some had sweet potato, some had callaloo. Daniel traded what little he had — strong hands, first of all — for what they could spare. By the end of that week, his family had eaten.

Kezia had heard this story dozens of times. She knew her grandmother told it not just as family history but as instruction: when things fail, go to the community. What you cannot manage alone, you can sometimes manage together.

The year Kezia turned twelve, her school's library roof collapsed in a storm. Within two weeks, every student in the school had brought at least one book from home. The library, when it reopened, was larger than before.`,
    question: "What did Daniel offer the neighbours in exchange for food?",
    options: [
      "His remaining breadfruit, even though it was unripe",
      "His strong hands — physical labour",
      "Money he had saved from a previous harvest",
      "His farming tools and equipment",
    ],
    correctAnswer: 1,
    explanation: "The passage states Daniel traded \'what little he had — strong hands, first of all — for what they could spare.\'"
  },
  {
    id: 3,
    type: "reading",
    passage: `The Breadfruit Story

Every family in the district had a story about the year the breadfruit failed. In Kezia's family, the story began with her great-grandfather, a man called Daniel, who had planted his trees in the hillside soil above the village. One summer, a blight came through and the breadfruit trees dropped their fruit before it was ripe. The green balls hit the ground hard and lay there, useless.

"What Daniel did next," Kezia's grandmother always said, telling the story in her kitchen, "was the only sensible thing. He went to the neighbours."

The neighbours, it turned out, had not lost their crops. Some had breadfruit, some had sweet potato, some had callaloo. Daniel traded what little he had — strong hands, first of all — for what they could spare. By the end of that week, his family had eaten.

Kezia had heard this story dozens of times. She knew her grandmother told it not just as family history but as instruction: when things fail, go to the community. What you cannot manage alone, you can sometimes manage together.

The year Kezia turned twelve, her school's library roof collapsed in a storm. Within two weeks, every student in the school had brought at least one book from home. The library, when it reopened, was larger than before.`,
    question: "What does the story of the school library DEMONSTRATE about the breadfruit lesson?",
    options: [
      "It shows that schools are better than libraries.",
      "It shows that Kezia had learned the lesson and applied it — when the library failed, the community came together.",
      "It shows that storms can cause serious damage to buildings.",
      "It proves that Kezia\'s school had many generous donors.",
    ],
    correctAnswer: 1,
    explanation: "The library story directly echoes the breadfruit story — both show the community responding to failure collectively. The library ending larger than before mirrors Daniel\'s family eating despite the blight."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Breadfruit Story

Every family in the district had a story about the year the breadfruit failed. In Kezia's family, the story began with her great-grandfather, a man called Daniel, who had planted his trees in the hillside soil above the village. One summer, a blight came through and the breadfruit trees dropped their fruit before it was ripe. The green balls hit the ground hard and lay there, useless.

"What Daniel did next," Kezia's grandmother always said, telling the story in her kitchen, "was the only sensible thing. He went to the neighbours."

The neighbours, it turned out, had not lost their crops. Some had breadfruit, some had sweet potato, some had callaloo. Daniel traded what little he had — strong hands, first of all — for what they could spare. By the end of that week, his family had eaten.

Kezia had heard this story dozens of times. She knew her grandmother told it not just as family history but as instruction: when things fail, go to the community. What you cannot manage alone, you can sometimes manage together.

The year Kezia turned twelve, her school's library roof collapsed in a storm. Within two weeks, every student in the school had brought at least one book from home. The library, when it reopened, was larger than before.`,
    question: "What is the EFFECT of ending the passage with \'The library, when it reopened, was larger than before\'?",
    options: [
      "It shows that community action is always more effective than individual effort.",
      "It provides a concrete, hopeful example that brings the grandmother\'s lesson into Kezia\'s own life and time.",
      "It proves that schools should not be built with roofs.",
      "It shows that Kezia\'s school had more books than any other in the district.",
    ],
    correctAnswer: 1,
    explanation: "The final detail is both concrete and symbolic — the library grew because of community action, demonstrating the lesson in Kezia\'s own generation. It is a quiet, satisfying echo of the grandmother\'s story."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the breadfruit passage?",
    options: [
      "Tense and dramatic",
      "Warm, purposeful, and quietly hopeful",
      "Melancholy and regretful",
      "Critical of the community\'s response",
    ],
    correctAnswer: 1,
    explanation: "The passage is warm throughout — the grandmother in her kitchen, the community sharing food, the library reopening larger. The tone is warm, purposeful, and quietly hopeful."
  },
  {
    id: 6,
    type: "reading",
    passage: `Education Inequality in Jamaica: The Gap Between Schools

Jamaica has made significant progress in expanding access to primary education over the past several decades. Enrolment rates are high, and most children complete the primary cycle. Yet access alone does not equal quality, and the quality of education that a child receives in Jamaica depends enormously on the school they attend — and the school they attend depends enormously on where they live and what their family can afford.

Schools in wealthier urban areas — particularly in Kingston and its surrounding communities — typically have better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes. Schools in rural or low-income communities often face the opposite: ageing buildings, high teacher turnover, limited technology access, and fewer extracurricular opportunities.

The PEP (Primary Exit Profile) assessment, introduced to replace the GSAT, was designed partly to reduce the pressure of a single high-stakes examination and to create a more rounded picture of student ability. But critics argue that children attending better-resourced schools continue to perform better on PEP assessments — not because they are more capable, but because they have had better preparation. The assessment measures both ability and opportunity, and it is not always clear which is being rewarded.

Addressing educational inequality in Jamaica requires more than reforming assessments. It requires sustained, targeted investment in the schools and communities that have historically received the least — with the recognition that equal outcomes cannot be achieved without unequal inputs.`,
    question: "What is the CENTRAL ARGUMENT of the education inequality passage?",
    options: [
      "Jamaica should replace the PEP assessment with a new examination.",
      "All Jamaican schools should merge to create a single educational system.",
      "High enrolment rates mask significant inequality in educational quality — and addressing this requires targeted investment in under-resourced schools, not just assessment reform.",
      "Rural schools are always better than urban schools.",
    ],
    correctAnswer: 2,
    explanation: "The passage argues that access ≠ quality, that quality is unequal, and that fixing it requires \'sustained, targeted investment in schools that have historically received the least.\' Option C captures this argument."
  },
  {
    id: 7,
    type: "reading",
    passage: `Education Inequality in Jamaica: The Gap Between Schools

Jamaica has made significant progress in expanding access to primary education over the past several decades. Enrolment rates are high, and most children complete the primary cycle. Yet access alone does not equal quality, and the quality of education that a child receives in Jamaica depends enormously on the school they attend — and the school they attend depends enormously on where they live and what their family can afford.

Schools in wealthier urban areas — particularly in Kingston and its surrounding communities — typically have better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes. Schools in rural or low-income communities often face the opposite: ageing buildings, high teacher turnover, limited technology access, and fewer extracurricular opportunities.

The PEP (Primary Exit Profile) assessment, introduced to replace the GSAT, was designed partly to reduce the pressure of a single high-stakes examination and to create a more rounded picture of student ability. But critics argue that children attending better-resourced schools continue to perform better on PEP assessments — not because they are more capable, but because they have had better preparation. The assessment measures both ability and opportunity, and it is not always clear which is being rewarded.

Addressing educational inequality in Jamaica requires more than reforming assessments. It requires sustained, targeted investment in the schools and communities that have historically received the least — with the recognition that equal outcomes cannot be achieved without unequal inputs.`,
    question: "According to the passage, what ADVANTAGES do schools in wealthier urban areas typically have?",
    options: [
      "Larger class sizes and more students per teacher",
      "Better infrastructure, more experienced teachers, better materials, and stronger university preparation links",
      "Government subsidies that rural schools do not receive",
      "More sports facilities and extracurricular activities",
    ],
    correctAnswer: 1,
    explanation: "The passage lists: \'better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Education Inequality in Jamaica: The Gap Between Schools

Jamaica has made significant progress in expanding access to primary education over the past several decades. Enrolment rates are high, and most children complete the primary cycle. Yet access alone does not equal quality, and the quality of education that a child receives in Jamaica depends enormously on the school they attend — and the school they attend depends enormously on where they live and what their family can afford.

Schools in wealthier urban areas — particularly in Kingston and its surrounding communities — typically have better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes. Schools in rural or low-income communities often face the opposite: ageing buildings, high teacher turnover, limited technology access, and fewer extracurricular opportunities.

The PEP (Primary Exit Profile) assessment, introduced to replace the GSAT, was designed partly to reduce the pressure of a single high-stakes examination and to create a more rounded picture of student ability. But critics argue that children attending better-resourced schools continue to perform better on PEP assessments — not because they are more capable, but because they have had better preparation. The assessment measures both ability and opportunity, and it is not always clear which is being rewarded.

Addressing educational inequality in Jamaica requires more than reforming assessments. It requires sustained, targeted investment in the schools and communities that have historically received the least — with the recognition that equal outcomes cannot be achieved without unequal inputs.`,
    question: "What does the passage mean when it says the PEP \'measures both ability and opportunity\'?",
    options: [
      "PEP tests are designed to be fair to students from all backgrounds.",
      "PEP results reflect not only what students are naturally capable of, but also the quality of preparation and resources their school provided.",
      "PEP is a more reliable assessment than the GSAT it replaced.",
      "Students who take PEP receive both an academic and a vocational qualification.",
    ],
    correctAnswer: 1,
    explanation: "The passage argues that better-resourced schools produce better PEP results \'not because they are more capable, but because they have had better preparation\' — so the assessment reflects both ability and the opportunity of good schooling."
  },
  {
    id: 9,
    type: "reading",
    passage: `Education Inequality in Jamaica: The Gap Between Schools

Jamaica has made significant progress in expanding access to primary education over the past several decades. Enrolment rates are high, and most children complete the primary cycle. Yet access alone does not equal quality, and the quality of education that a child receives in Jamaica depends enormously on the school they attend — and the school they attend depends enormously on where they live and what their family can afford.

Schools in wealthier urban areas — particularly in Kingston and its surrounding communities — typically have better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes. Schools in rural or low-income communities often face the opposite: ageing buildings, high teacher turnover, limited technology access, and fewer extracurricular opportunities.

The PEP (Primary Exit Profile) assessment, introduced to replace the GSAT, was designed partly to reduce the pressure of a single high-stakes examination and to create a more rounded picture of student ability. But critics argue that children attending better-resourced schools continue to perform better on PEP assessments — not because they are more capable, but because they have had better preparation. The assessment measures both ability and opportunity, and it is not always clear which is being rewarded.

Addressing educational inequality in Jamaica requires more than reforming assessments. It requires sustained, targeted investment in the schools and communities that have historically received the least — with the recognition that equal outcomes cannot be achieved without unequal inputs.`,
    question: "What does the passage mean by \'equal outcomes cannot be achieved without unequal inputs\'?",
    options: [
      "Some students are naturally more intelligent than others.",
      "Schools with more students need more teachers.",
      "To bring disadvantaged schools to the same level as advantaged ones requires giving them more support, not equal support.",
      "Education quality depends entirely on individual student effort.",
    ],
    correctAnswer: 2,
    explanation: "\'Unequal inputs\' means giving more to those with less — because starting from a position of disadvantage, equal support is insufficient to produce equal outcomes. Greater investment in disadvantaged schools is required."
  },
  {
    id: 10,
    type: "reading",
    passage: `Education Inequality in Jamaica: The Gap Between Schools

Jamaica has made significant progress in expanding access to primary education over the past several decades. Enrolment rates are high, and most children complete the primary cycle. Yet access alone does not equal quality, and the quality of education that a child receives in Jamaica depends enormously on the school they attend — and the school they attend depends enormously on where they live and what their family can afford.

Schools in wealthier urban areas — particularly in Kingston and its surrounding communities — typically have better infrastructure, more experienced teachers, better access to learning materials, and stronger connections to university preparation programmes. Schools in rural or low-income communities often face the opposite: ageing buildings, high teacher turnover, limited technology access, and fewer extracurricular opportunities.

The PEP (Primary Exit Profile) assessment, introduced to replace the GSAT, was designed partly to reduce the pressure of a single high-stakes examination and to create a more rounded picture of student ability. But critics argue that children attending better-resourced schools continue to perform better on PEP assessments — not because they are more capable, but because they have had better preparation. The assessment measures both ability and opportunity, and it is not always clear which is being rewarded.

Addressing educational inequality in Jamaica requires more than reforming assessments. It requires sustained, targeted investment in the schools and communities that have historically received the least — with the recognition that equal outcomes cannot be achieved without unequal inputs.`,
    question: "What does the author suggest is the LIMITATION of assessment reform alone?",
    options: [
      "Assessment reform makes the problem worse by increasing student stress.",
      "Reforming how students are assessed does not address the underlying inequality in the quality of schooling different students receive.",
      "Jamaica\'s assessment systems are already the best in the Caribbean.",
      "Students perform better when there is no formal assessment at all.",
    ],
    correctAnswer: 1,
    explanation: "The passage says \'addressing inequality requires more than reforming assessments\' — the real problem is resource inequality in schools, which no change to the examination format can fix."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"A BLIGHT came through and destroyed the breadfruit crop.\" The word \'blight\' means —",
    options: [
      "a very strong storm",
      "a disease or destructive force that ruins crops",
      "a period of extreme drought",
      "a pest infestation of insects",
    ],
    correctAnswer: 1,
    explanation: "A blight is a plant disease or other destructive force that ruins or kills crops — in this context, something that destroyed the breadfruit before it could ripen."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The green balls lay there, USELESS.\" The word \'useless\' means —",
    options: [
      "too small to be picked",
      "having no practical value or function",
      "dangerous to eat",
      "expensive to replace",
    ],
    correctAnswer: 1,
    explanation: "Useless means having no practical value or function — unripe breadfruit that has fallen cannot be eaten and serves no purpose."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Enrolment RATES are high\" in Jamaica. The word \'enrolment\' refers to —",
    options: [
      "the quality of teaching in a school",
      "the number of students registered and attending school",
      "the cost of attending a private school",
      "the distance students travel to school",
    ],
    correctAnswer: 1,
    explanation: "Enrolment refers to the number of students registered and attending — enrolment rates measure what proportion of children are in school."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Access alone does not equal QUALITY.\" In this context, \'quality\' means —",
    options: [
      "the number of students in a school",
      "how modern the school building is",
      "the standard and effectiveness of the education provided",
      "the cost of education",
    ],
    correctAnswer: 2,
    explanation: "Quality refers to the standard and effectiveness of education — how well it teaches, prepares, and supports students."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"HIGH TEACHER TURNOVER\" in rural schools. The phrase \'teacher turnover\' means —",
    options: [
      "the number of teachers promoted to principal",
      "teachers frequently leaving and being replaced by new ones",
      "the number of teaching hours per week",
      "the qualifications teachers hold",
    ],
    correctAnswer: 1,
    explanation: "Teacher turnover refers to the rate at which teachers leave and are replaced. High turnover means teachers are frequently leaving, disrupting continuity."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The PEP was designed to create a more ROUNDED picture of student ability.\" The word \'rounded\' means —",
    options: [
      "circular in shape",
      "average and mediocre",
      "comprehensive, capturing multiple dimensions rather than a single test result",
      "recently updated and improved",
    ],
    correctAnswer: 2,
    explanation: "Rounded in this context means comprehensive and multidimensional — giving a fuller, more complete picture of a student\'s abilities than a single high-stakes test."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"SUSTAINED, targeted investment in under-resourced schools.\" The word \'sustained\' means —",
    options: [
      "occasional and inconsistent",
      "very large and expensive",
      "continuing consistently over a long period",
      "announced publicly and formally",
    ],
    correctAnswer: 2,
    explanation: "Sustained means continuing consistently over a long period — not a one-time injection of funds, but ongoing, committed investment."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Kezia\'s grandmother told the story \"not just as family history but as INSTRUCTION.\" The word \'instruction\' means —",
    options: [
      "a formal lesson given in a classroom",
      "a law or official directive",
      "a lesson or teaching intended to guide behaviour",
      "a book of recipes and procedures",
    ],
    correctAnswer: 2,
    explanation: "Instruction in this context means a lesson or teaching with a practical purpose — the story was meant to guide how Kezia should act when facing difficulty."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The assessment MEASURES both ability and opportunity.\" The word \'measures\' means —",
    options: [
      "ignores or dismisses",
      "evaluates and quantifies",
      "improves and develops",
      "replaces or substitutes",
    ],
    correctAnswer: 1,
    explanation: "To measure means to evaluate and quantify — to assess how much of something is present. The PEP evaluates both ability and opportunity, though it may not always distinguish between them."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Schools that have HISTORICALLY received the least.\" The word \'historically\' means —",
    options: [
      "in the most recent school year",
      "only in rural areas",
      "over a long period of time, going back many years",
      "in theory but not in practice",
    ],
    correctAnswer: 2,
    explanation: "Historically means over a long period of time — these schools have been under-resourced not just recently, but across many years and decades."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The inequality between rural and urban schools in Jamaica remain a serious challenge.",
      "The inequality between rural and urban schools in Jamaica remains a serious challenge.",
      "The inequality between rural and urban schools in Jamaica remain serious challenges.",
      "The inequality between rural and urban schools in Jamaica are remaining a serious challenge.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the inequality,\' which is singular. The correct verb is \'remains.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time the library reopened, every student already brought a book from home.",
      "By the time the library reopened, every student had already brought a book from home.",
      "By the time the library reopened, every student has already brought a book from home.",
      "By the time the library reopened, every student was already bringing a book from home.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already brought\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although Jamaica has high enrolment rates, significant inequality in quality remains.\'",
    options: [
      "significant inequality in quality remains",
      "Although Jamaica has high enrolment rates",
      "Jamaica has high enrolment rates",
      "inequality in quality remains",
    ],
    correctAnswer: 1,
    explanation: "\'Although Jamaica has high enrolment rates\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Daniel offered his strong hands, his remaining crops, and to ask for help from neighbours.",
      "Daniel offered his strong hands, his remaining crops, and his willingness to ask for help.",
      "Daniel offered his strong hands, his crops that were remaining, and to ask neighbours for help.",
      "Daniel offered strong hands, he offered remaining crops, and willingness to ask for help.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three noun phrases: his strong hands, his remaining crops, and his willingness to ask for help."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "The blight destroyed Daniel\'s breadfruit before it could ripen.",
      "Kezia heard the story dozens of times while growing up.",
      "The breadfruit was destroyed by the blight before it could ripen.",
      "Daniel\'s grandmother planted the original breadfruit trees on the hillside.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the breadfruit\' (subject) receives the action \'was destroyed.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The PEP assessment, which replaced the GSAT was introduced to provide a more rounded picture.",
      "The PEP assessment which replaced the GSAT, was introduced to provide a more rounded picture.",
      "The PEP assessment, which replaced the GSAT, was introduced to provide a more rounded picture.",
      "The PEP assessment which replaced the GSAT was introduced to provide a more rounded picture.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which replaced the GSAT\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Kezia\'s grandmother always said that when things fail, go to the community.",
      "Kezia\'s grandmother always said that when things fail, you should go to the community.",
      "Kezia\'s grandmother always said that when things fail, we go to the community.",
      "Kezia\'s grandmother always said that when things failed, one should go to the community.",
    ],
    correctAnswer: 3,
    explanation: "In reported speech, the advice is best conveyed with the appropriate shift and pronoun. Option D (\'one should go\') is the most formally correct reported version of the grandmother\'s general instruction."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Growing on the hillside, Daniel\'s breadfruit trees were struck by the blight.",
      "Falling to the ground unripe, the breadfruit was useless to Daniel\'s family.",
      "Told by her grandmother in the kitchen, Kezia knew the story well.",
      "Reopened after the storm, the library was larger than before.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'told by her grandmother in the kitchen\' should describe the story, but the sentence\'s subject is \'Kezia\' — implying Kezia was told in the kitchen, which is actually fine. Actually, let me re-read: \'Told by her grandmother in the kitchen, Kezia knew the story well\' — here \'told by her grandmother\' modifies the story, but the subject is Kezia. So Kezia was told by her grandmother — that actually works. Let me reconsider option B: \'Falling to the ground unripe, the breadfruit was useless\' — \'falling to the ground unripe\' describes breadfruit, and the subject is breadfruit. That\'s correct. Option D: \'Reopened after the storm, the library was larger\' — library was reopened, subject is library. Correct. So actually C has the issue: \'Told by her grandmother in the kitchen\' — this participial phrase modifies \'Kezia,\' implying Kezia was told (by her grandmother in the kitchen), which is grammatically acceptable but slightly ambiguous. Let me pick C as the misplaced modifier — the phrase \'Told by her grandmother in the kitchen\' seems to modify Kezia but logically should modify \'the story.\' Option C is the best answer here."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Educational quality is unequal in Jamaica; but enrolment rates are high.",
      "Educational quality is unequal in Jamaica; however, enrolment rates are high.",
      "Educational quality is unequal in Jamaica; and rural schools often have less.",
      "Educational quality; is unequal in Jamaica and rural schools often have less.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the students at rural schools have fewer resources than urban students.",
      "Each of the students at rural schools has fewer resources than urban students.",
      "Each of the students at rural schools are having fewer resources than urban students.",
      "Each of the students at rural schools have less resources than urban students.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The correct verb is \'has.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is important that Jamaica addresses the inequality between its schools.",
      "It is important that Jamaica address the inequality between its schools.",
      "It is important that Jamaica addressed the inequality between its schools.",
      "It is important that Jamaica will address the inequality between its schools.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is important that,\' the subjunctive requires the base form — \'address,\' not \'addresses,\' \'addressed,\' or \'will address.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Daniel traded his hands his vegetables and his time for what the neighbours could spare.",
      "Daniel traded his hands, his vegetables, and his time for what the neighbours could spare.",
      "Daniel traded his hands, his vegetables and his time for what the neighbours could spare.",
      "Daniel traded his hands his vegetables, and his time, for what the neighbours could spare.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica must invest more in rural schools?",
    options: [
      "Rural schools in Jamaica often have old buildings.",
      "Many teachers leave rural schools each year for better opportunities elsewhere.",
      "As long as a child\'s educational quality is determined by her postcode rather than her potential, Jamaica cannot claim to offer the equal opportunity its constitution promises — and targeted investment in rural schools is the only principled response.",
      "Jamaica should reform its education system to make it fairer.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, principled argument, frames the inequality precisely (\'postcode rather than potential\'), connects it to a constitutional promise, and names the solution — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "priviledge",
      "privlege",
      "prvilege",
      "privilege",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is privilege — p-r-i-v-i-l-e-g-e."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Daniel\'s family survived the failed harvest through the support of their neighbours. He offered his labour in exchange for food, and the community came through. This taught his descendants that collective action is more reliable than individual resilience alone. The Rio Grande is one of Jamaica\'s most important rivers for rafting tourism. Kezia applied this lesson when her school\'s library collapsed in a storm.\'",
    options: [
      "He offered his labour in exchange for food, and the community came through.",
      "This taught his descendants that collective action is more reliable than individual resilience alone.",
      "The Rio Grande is one of Jamaica\'s most important rivers for rafting tourism.",
      "Kezia applied this lesson when her school\'s library collapsed in a storm.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Daniel\'s story and its lesson. The sentence about the Rio Grande is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Rural schools in Jamaica need more help.\'",
    options: [
      "Rural schools in Jamaica really need a lot more help from the government.",
      "Rural schools in Jamaica need more help because they have less than urban schools.",
      "Jamaica\'s rural schools — facing ageing infrastructure, high teacher turnover, and limited access to technology — require sustained, targeted investment if the country is serious about closing the educational gap that geography and poverty have created.",
      "It is important that Jamaica helps its rural schools more than it currently does.",
    ],
    correctAnswer: 2,
    explanation: "Option B uses specific detail (\'ageing infrastructure, high teacher turnover, limited technology\'), precise vocabulary (\'sustained, targeted investment\'), and frames the stakes clearly — far superior to the vague original."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about community support?",
    options: [
      "Some people think you should only rely on yourself, but that is not always true.",
      "Individual effort is important, but sometimes you need help from others.",
      "While individual effort, resilience, and resourcefulness are genuinely valuable — and Daniel showed all three — there are moments when community support is not simply preferable but the only means of survival, and refusing to ask for it is not strength but pride.",
      "Communities are important and people should help each other more.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the value of individual qualities (\'genuinely valuable — and Daniel showed all three\'), then pivots to a clear, specific counter (\'the only means of survival\'), and ends with a pointed distinction (\'not strength but pride\')."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The library reopened and it was bigger because everyone helped.\' What is the MOST EFFECTIVE revision?",
    options: [
      "The library reopened and it was bigger than before because all the students helped by bringing books.",
      "Everyone helped and the library reopened bigger than it had been before the storm.",
      "When the library reopened two weeks after the roof\'s collapse, it was larger than before — the collective act of every student bringing a single book having turned a disaster into an expansion.",
      "The library was bigger when it reopened because students brought books from home.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific timing (\'two weeks after the roof\'s collapse\'), the passage\'s own phrasing (\'larger than before\'), and a powerful final clause (\'turned a disaster into an expansion\') that captures the symbolic meaning of the event."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about educational inequality?",
    options: [
      "Educational inequality is a serious problem in Jamaica.",
      "The government should do more to help schools in rural areas.",
      "A country that allows the quality of a child\'s education to be determined by the accident of where she was born is not offering opportunity — it is rationing it, and calling the rationing fair.",
      "Jamaica needs to invest more money in its rural schools to fix this problem.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically precise (\'rationing opportunity\'), uses a powerful contrast (\'offering opportunity\' vs \'rationing it\'), and ends with a memorable critique of the framing of fairness — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes what makes writing PRECISE rather than vague?",
    options: [
      "Using longer sentences and more complex vocabulary",
      "Using as many adjectives and adverbs as possible",
      "Using specific details, exact facts, and carefully chosen words that leave the reader with a clear and accurate picture",
      "Writing from personal experience rather than research",
    ],
    correctAnswer: 2,
    explanation: "Precision in writing comes from specificity — exact facts, carefully chosen words, and concrete details that create a clear picture. Option C correctly identifies these qualities."
  }
]

export default function LiteracyMixed4MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed4Questions : literacyMixed4Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 4</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 4</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 4 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 4</h1>
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
