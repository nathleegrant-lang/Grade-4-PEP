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

const literacyDifficult7Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Weight of a Name

Amara had been named after her great-grandmother, a woman she had never met. The name arrived with a story: the original Amara had walked from Portland to Kingston at seventeen, alone, carrying a small bundle and a determination that nobody had the right to question.

For most of her childhood, Amara treated the story as background noise — something adults repeated at family gatherings between the jerk chicken and the rice and peas. She had her own problems: homework, friends, the particular loneliness of being the kind of person who sees more than she says.

It was only when she was preparing a school project on Jamaican women's history that she began to look differently at the story. She found no record of her great-grandmother. No photograph, no document, no census entry. The woman had moved through history like a current under water — present, shaping things, but invisible to the official record.

Amara sat with that silence for a long time. She understood, slowly, that the absence of a record was itself a kind of record — it told you whose lives had been considered worth documenting and whose had not.

She began to write. Not facts — she had none. But she wrote the walk: the red dust of the road, the weight of the bundle, the mountains behind and the unknown city ahead. She gave her great-grandmother a morning. She gave her a pair of shoes. She gave her everything the archive had refused to.

When she finished, Amara felt she understood her name in a way she had not before. Not as a decoration. As a continuation.`,
    question: "What is the SIGNIFICANCE of the detail that Amara\'s great-grandmother \'moved through history like a current under water\'?",
    options: [
      "She was a famous swimmer who crossed rivers on her journey.",
      "Her influence on her family was real and shaping, but invisible to official historical records.",
      "She deliberately hid herself from government authorities.",
      "She was a shy woman who avoided all public attention.",
    ],
    correctAnswer: 1,
    explanation: "\'Like a current under water\' is a simile suggesting something real and powerful but unseen on the surface. The great-grandmother shaped things — she had a real life — but left no trace in the official record."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Weight of a Name

Amara had been named after her great-grandmother, a woman she had never met. The name arrived with a story: the original Amara had walked from Portland to Kingston at seventeen, alone, carrying a small bundle and a determination that nobody had the right to question.

For most of her childhood, Amara treated the story as background noise — something adults repeated at family gatherings between the jerk chicken and the rice and peas. She had her own problems: homework, friends, the particular loneliness of being the kind of person who sees more than she says.

It was only when she was preparing a school project on Jamaican women's history that she began to look differently at the story. She found no record of her great-grandmother. No photograph, no document, no census entry. The woman had moved through history like a current under water — present, shaping things, but invisible to the official record.

Amara sat with that silence for a long time. She understood, slowly, that the absence of a record was itself a kind of record — it told you whose lives had been considered worth documenting and whose had not.

She began to write. Not facts — she had none. But she wrote the walk: the red dust of the road, the weight of the bundle, the mountains behind and the unknown city ahead. She gave her great-grandmother a morning. She gave her a pair of shoes. She gave her everything the archive had refused to.

When she finished, Amara felt she understood her name in a way she had not before. Not as a decoration. As a continuation.`,
    question: "What does Amara mean when she realises that \'the absence of a record was itself a kind of record\'?",
    options: [
      "The fact that no documents exist means the great-grandmother probably never existed.",
      "Amara should look for records in different archives.",
      "The very absence of documentation tells us something important about which lives were considered worth recording — and whose were not.",
      "Records from this period of Jamaican history were destroyed in a natural disaster.",
    ],
    correctAnswer: 2,
    explanation: "The insight is that silence is not neutral — it reflects a deliberate or systematic exclusion. Whose lives are recorded reveals what a society valued and who it rendered invisible."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Weight of a Name

Amara had been named after her great-grandmother, a woman she had never met. The name arrived with a story: the original Amara had walked from Portland to Kingston at seventeen, alone, carrying a small bundle and a determination that nobody had the right to question.

For most of her childhood, Amara treated the story as background noise — something adults repeated at family gatherings between the jerk chicken and the rice and peas. She had her own problems: homework, friends, the particular loneliness of being the kind of person who sees more than she says.

It was only when she was preparing a school project on Jamaican women's history that she began to look differently at the story. She found no record of her great-grandmother. No photograph, no document, no census entry. The woman had moved through history like a current under water — present, shaping things, but invisible to the official record.

Amara sat with that silence for a long time. She understood, slowly, that the absence of a record was itself a kind of record — it told you whose lives had been considered worth documenting and whose had not.

She began to write. Not facts — she had none. But she wrote the walk: the red dust of the road, the weight of the bundle, the mountains behind and the unknown city ahead. She gave her great-grandmother a morning. She gave her a pair of shoes. She gave her everything the archive had refused to.

When she finished, Amara felt she understood her name in a way she had not before. Not as a decoration. As a continuation.`,
    question: "What does Amara\'s act of writing the walk represent?",
    options: [
      "An attempt to create false historical records to deceive future scholars.",
      "A creative act of restoration — giving presence, dignity, and specificity to a life the archive erased.",
      "A school assignment she completes reluctantly to meet a deadline.",
      "An admission that she has no interest in real historical research.",
    ],
    correctAnswer: 1,
    explanation: "Amara gives her great-grandmother \'a morning,\' \'a pair of shoes,\' \'everything the archive had refused to\' — this is a creative act of reclamation, restoring what institutional history erased."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Weight of a Name

Amara had been named after her great-grandmother, a woman she had never met. The name arrived with a story: the original Amara had walked from Portland to Kingston at seventeen, alone, carrying a small bundle and a determination that nobody had the right to question.

For most of her childhood, Amara treated the story as background noise — something adults repeated at family gatherings between the jerk chicken and the rice and peas. She had her own problems: homework, friends, the particular loneliness of being the kind of person who sees more than she says.

It was only when she was preparing a school project on Jamaican women's history that she began to look differently at the story. She found no record of her great-grandmother. No photograph, no document, no census entry. The woman had moved through history like a current under water — present, shaping things, but invisible to the official record.

Amara sat with that silence for a long time. She understood, slowly, that the absence of a record was itself a kind of record — it told you whose lives had been considered worth documenting and whose had not.

She began to write. Not facts — she had none. But she wrote the walk: the red dust of the road, the weight of the bundle, the mountains behind and the unknown city ahead. She gave her great-grandmother a morning. She gave her a pair of shoes. She gave her everything the archive had refused to.

When she finished, Amara felt she understood her name in a way she had not before. Not as a decoration. As a continuation.`,
    question: "The final sentence — \'Not as a decoration. As a continuation.\' — suggests that Amara now sees her name as —",
    options: [
      "something beautiful but meaningless",
      "a living connection to a woman whose story she is carrying forward",
      "a burden she wishes she could change",
      "proof that her great-grandmother was a famous person",
    ],
    correctAnswer: 1,
    explanation: "\'Decoration\' suggests something merely ornamental. \'Continuation\' suggests an active, living connection — Amara carrying the great-grandmother\'s story forward through her own life and writing."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the passage about Amara?",
    options: [
      "Angry and confrontational",
      "Quiet, reflective, and ultimately hopeful",
      "Frightened and uncertain",
      "Celebratory and festive",
    ],
    correctAnswer: 1,
    explanation: "The passage moves from indifference to insight to creative act — the tone is quiet and inward throughout, with a sense of discovery and quiet hope at the end."
  },
  {
    id: 6,
    type: "reading",
    passage: `Deforestation in Jamaica: A Slow Emergency

Jamaica loses thousands of hectares of forest each year to logging, agriculture, urban expansion, and charcoal production. This loss is rarely dramatic — no single tree's removal causes headlines — and yet its cumulative effect on the island's ecology, water security, and climate resilience is profound and accelerating.

Forests regulate Jamaica's water supply in ways that are often taken for granted. Tree roots absorb rainfall and release it gradually into streams and underground aquifers. When forests are cleared, rainfall runs off the exposed soil rapidly, causing floods in the wet season and water shortages in the dry season. The parishes most affected by deforestation — St. Thomas, Portland, and parts of St. Elizabeth — are the same areas that experience the most severe flooding and drought cycles.

The Blue and John Crow Mountains National Park, a UNESCO World Heritage Site since 2015, protects Jamaica's largest remaining tract of tropical forest. Yet even protected areas face pressure from illegal logging and agricultural encroachment along their borders. The park's biodiversity — home to hundreds of endemic species found nowhere else on earth — is increasingly fragmented.

The charcoal industry presents a particular challenge. Many rural families depend on charcoal production for their livelihoods, making a simple ban politically and economically unworkable. Viable alternatives — liquefied petroleum gas subsidies, community forestry programmes, and reforestation incentives — exist but have been inconsistently funded and implemented.

Addressing Jamaica's deforestation crisis requires treating it not as an environmental issue in isolation, but as a question of economic policy, rural development, and long-term national survival.`,
    question: "According to the passage, why is Jamaica\'s deforestation described as a \'slow emergency\'?",
    options: [
      "Because the government is too slow to respond to environmental problems.",
      "Because it happens gradually without dramatic single events, yet its cumulative effect is profound and accelerating.",
      "Because trees in Jamaica grow back very slowly after being cut.",
      "Because deforestation only affects Jamaica during hurricane season.",
    ],
    correctAnswer: 1,
    explanation: "The phrase \'slow emergency\' captures the paradox: the loss is real and serious, but because it accumulates gradually rather than in one dramatic event, it fails to generate the urgency it deserves."
  },
  {
    id: 7,
    type: "reading",
    passage: `Deforestation in Jamaica: A Slow Emergency

Jamaica loses thousands of hectares of forest each year to logging, agriculture, urban expansion, and charcoal production. This loss is rarely dramatic — no single tree's removal causes headlines — and yet its cumulative effect on the island's ecology, water security, and climate resilience is profound and accelerating.

Forests regulate Jamaica's water supply in ways that are often taken for granted. Tree roots absorb rainfall and release it gradually into streams and underground aquifers. When forests are cleared, rainfall runs off the exposed soil rapidly, causing floods in the wet season and water shortages in the dry season. The parishes most affected by deforestation — St. Thomas, Portland, and parts of St. Elizabeth — are the same areas that experience the most severe flooding and drought cycles.

The Blue and John Crow Mountains National Park, a UNESCO World Heritage Site since 2015, protects Jamaica's largest remaining tract of tropical forest. Yet even protected areas face pressure from illegal logging and agricultural encroachment along their borders. The park's biodiversity — home to hundreds of endemic species found nowhere else on earth — is increasingly fragmented.

The charcoal industry presents a particular challenge. Many rural families depend on charcoal production for their livelihoods, making a simple ban politically and economically unworkable. Viable alternatives — liquefied petroleum gas subsidies, community forestry programmes, and reforestation incentives — exist but have been inconsistently funded and implemented.

Addressing Jamaica's deforestation crisis requires treating it not as an environmental issue in isolation, but as a question of economic policy, rural development, and long-term national survival.`,
    question: "What is the relationship between deforestation and water security described in the passage?",
    options: [
      "Deforestation increases the amount of water in underground aquifers.",
      "Deforestation has no direct effect on Jamaica\'s water supply.",
      "Deforestation disrupts the gradual absorption and release of rainfall, causing both flooding and drought.",
      "Deforestation only affects water supply in the Blue Mountains.",
    ],
    correctAnswer: 2,
    explanation: "The passage explains that tree roots absorb rainfall slowly — when forests are cleared, water runs off rapidly, causing floods in wet seasons and shortages in dry seasons."
  },
  {
    id: 8,
    type: "reading",
    passage: `Deforestation in Jamaica: A Slow Emergency

Jamaica loses thousands of hectares of forest each year to logging, agriculture, urban expansion, and charcoal production. This loss is rarely dramatic — no single tree's removal causes headlines — and yet its cumulative effect on the island's ecology, water security, and climate resilience is profound and accelerating.

Forests regulate Jamaica's water supply in ways that are often taken for granted. Tree roots absorb rainfall and release it gradually into streams and underground aquifers. When forests are cleared, rainfall runs off the exposed soil rapidly, causing floods in the wet season and water shortages in the dry season. The parishes most affected by deforestation — St. Thomas, Portland, and parts of St. Elizabeth — are the same areas that experience the most severe flooding and drought cycles.

The Blue and John Crow Mountains National Park, a UNESCO World Heritage Site since 2015, protects Jamaica's largest remaining tract of tropical forest. Yet even protected areas face pressure from illegal logging and agricultural encroachment along their borders. The park's biodiversity — home to hundreds of endemic species found nowhere else on earth — is increasingly fragmented.

The charcoal industry presents a particular challenge. Many rural families depend on charcoal production for their livelihoods, making a simple ban politically and economically unworkable. Viable alternatives — liquefied petroleum gas subsidies, community forestry programmes, and reforestation incentives — exist but have been inconsistently funded and implemented.

Addressing Jamaica's deforestation crisis requires treating it not as an environmental issue in isolation, but as a question of economic policy, rural development, and long-term national survival.`,
    question: "Why does the passage describe a simple ban on charcoal production as \'politically and economically unworkable\'?",
    options: [
      "The charcoal industry is protected by international law.",
      "Rural families depend on charcoal production for their livelihoods — banning it without alternatives would cause serious economic harm.",
      "The government does not have the authority to regulate charcoal production.",
      "Charcoal production is not actually a significant cause of deforestation.",
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly states that many rural families depend on charcoal — a ban without economic alternatives would harm already vulnerable communities. This is why alternatives are needed."
  },
  {
    id: 9,
    type: "reading",
    question: "What is the author\'s MAIN ARGUMENT in the final paragraph?",
    options: [
      "Deforestation should be addressed by environmental agencies alone.",
      "Deforestation in Jamaica is too serious a problem to be solved.",
      "Deforestation cannot be effectively addressed unless it is understood as intersecting with economic policy, rural development, and national survival — not just as an environmental issue.",
      "The government should invest in tourism to compensate for environmental losses.",
    ],
    correctAnswer: 2,
    explanation: "The final paragraph explicitly reframes deforestation: not an environmental issue in isolation, but one that \'requires treating it as a question of economic policy, rural development, and long-term national survival.\'"
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the deforestation passage?",
    options: [
      "Optimistic and encouraging",
      "Urgent, analytical, and concerned",
      "Neutral and purely scientific",
      "Angry and accusatory",
    ],
    correctAnswer: 1,
    explanation: "The passage presents evidence and analysis with a clear sense of concern and urgency — \'profound and accelerating,\' \'slow emergency,\' \'long-term national survival.\' The tone is urgent and analytically concerned."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The story arrived with a DETERMINATION that nobody had the right to question.\" The word \'determination\' means —",
    options: [
      "physical strength and stamina",
      "a feeling of sadness and loss",
      "a firm resolve or purpose that is not easily broken",
      "a request made of another person",
    ],
    correctAnswer: 2,
    explanation: "Determination means a firm, unwavering purpose or resolve — in this context, the great-grandmother\'s inner strength and commitment to her journey."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Amara treated the story as BACKGROUND NOISE.\" This phrase suggests she —",
    options: [
      "could not hear the story because of actual noise in the room",
      "found the story unimportant and paid it little conscious attention",
      "believed the story was not true",
      "had memorised the story so well she no longer needed to listen",
    ],
    correctAnswer: 1,
    explanation: "\'Background noise\' is an idiom for something present but not consciously attended to — sounds or information we register but do not truly hear. Amara knew the story but did not engage with it."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Its CUMULATIVE effect on Jamaica\'s ecology is profound and accelerating.\" The word \'cumulative\' means —",
    options: [
      "immediate and dramatic",
      "building up gradually over time through repeated addition",
      "random and unpredictable",
      "temporary and reversible",
    ],
    correctAnswer: 1,
    explanation: "Cumulative means increasing or building up through the addition of many small amounts over time. The effects of deforestation accumulate with each tree removed."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The park\'s BIODIVERSITY is increasingly fragmented.\" The word \'biodiversity\' refers to —",
    options: [
      "the beauty of natural landscapes",
      "the variety of plant and animal species in an ecosystem",
      "the number of tourists visiting a protected area",
      "the amount of rainfall received by a forest",
    ],
    correctAnswer: 1,
    explanation: "Biodiversity refers to the variety of living species in a given area — including plants, animals, fungi, and microorganisms. High biodiversity indicates a healthy, complex ecosystem."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Viable ALTERNATIVES — LPG subsidies, community forestry programmes — exist but have been inconsistently implemented.\" The word \'viable\' means —",
    options: [
      "expensive and impractical",
      "capable of working successfully in real conditions",
      "new and untested",
      "controversial and widely opposed",
    ],
    correctAnswer: 1,
    explanation: "Viable means workable, practical, and capable of success. The passage acknowledges these alternatives exist and could work — the problem is inconsistent implementation."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"She gave her everything the ARCHIVE had refused to.\" The word \'archive\' refers to —",
    options: [
      "a creative writing notebook",
      "a type of government building",
      "a collection of historical records and documents",
      "a family photo album",
    ],
    correctAnswer: 2,
    explanation: "An archive is a collection of historical records — documents, census data, photographs — maintained for research and preservation. The archive \'refused\' to document the great-grandmother\'s life."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Agricultural ENCROACHMENT along the borders of the protected park.\" The word \'encroachment\' means —",
    options: [
      "the deliberate protection of a natural area",
      "a gradual and often illegal intrusion into territory or space",
      "a government programme to support farmers",
      "the construction of buildings near a forest",
    ],
    correctAnswer: 1,
    explanation: "Encroachment means gradually intruding into or taking over space that belongs to something or someone else — here, farming activities moving into the edges of protected forest."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Amara felt she understood her name in a way she had not before — not as a decoration. As a CONTINUATION.\" The word \'continuation\' implies —",
    options: [
      "that Amara will change her name to match her great-grandmother\'s",
      "that Amara\'s life and work carry forward something the great-grandmother began",
      "that the great-grandmother is still alive somewhere",
      "that Amara plans to finish the letter the great-grandmother never wrote",
    ],
    correctAnswer: 1,
    explanation: "Continuation means carrying something forward — extending it into the future. Amara\'s life, and particularly her writing, continues the story of a woman the archive erased."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Tree roots ABSORB rainfall and release it gradually.\" The word \'absorb\' means —",
    options: [
      "repel and push away",
      "take in and hold within",
      "filter and purify",
      "collect and redirect elsewhere",
    ],
    correctAnswer: 1,
    explanation: "To absorb means to take in and hold a substance. Tree roots absorb water from rainfall, holding it in the soil and releasing it gradually."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The loss is rarely DRAMATIC — no single tree\'s removal causes headlines.\" The word \'dramatic\' here means —",
    options: [
      "involving acting or performance",
      "sudden, striking, and attention-grabbing",
      "slow and gradual",
      "important and historically significant",
    ],
    correctAnswer: 1,
    explanation: "Dramatic in this context means sudden, visually striking, and attention-commanding — the kind of event that generates headlines. Deforestation is the opposite: gradual and unremarkable in individual instances."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The cumulative effects of deforestation on Jamaica\'s water supply is alarming.",
      "The cumulative effects of deforestation on Jamaica\'s water supply are alarming.",
      "The cumulative effects of deforestation on Jamaica\'s water supply was alarming.",
      "The cumulative effects of deforestation on Jamaica\'s water supply has been alarming.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'effects,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Amara started the project, she never thought about the story seriously.",
      "By the time Amara started the project, she has never thought about the story seriously.",
      "By the time Amara started the project, she had never thought about the story seriously.",
      "By the time Amara started the project, she was never thinking about the story seriously.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had\' + past participle) is required for an action completed before another past event. \'Had never thought\' is correct."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE in: \'Although Jamaica\'s forests are legally protected in some areas, deforestation continues along their borders.\'",
    options: [
      "deforestation continues along their borders",
      "Although Jamaica\'s forests are legally protected in some areas",
      "Jamaica\'s forests are legally protected in some areas",
      "deforestation continues",
    ],
    correctAnswer: 1,
    explanation: "\'Although Jamaica\'s forests are legally protected in some areas\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Amara wrote the walk, she gave her great-grandmother shoes, and a morning was created.",
      "Amara wrote the walk, gave her great-grandmother shoes, and created a morning.",
      "Amara wrote the walk, her great-grandmother was given shoes, and she created a morning.",
      "Amara wrote the walk, giving her great-grandmother shoes, and to create a morning.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses three simple past verbs: wrote, gave, and created."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Rural families depend on charcoal production for their livelihoods.",
      "The government has inconsistently funded alternative programmes.",
      "Jamaica\'s forests are threatened by logging, agriculture, and urban expansion.",
      "The Blue Mountains National Park protects Jamaica\'s largest remaining tropical forest.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'Jamaica\'s forests\' (subject) receives the action \'are threatened.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The Blue Mountains, which became a UNESCO World Heritage Site in 2015 protect hundreds of endemic species.",
      "The Blue Mountains which became a UNESCO World Heritage Site in 2015, protect hundreds of endemic species.",
      "The Blue Mountains, which became a UNESCO World Heritage Site in 2015, protect hundreds of endemic species.",
      "The Blue Mountains which became a UNESCO World Heritage Site in 2015 protect hundreds of endemic species.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which became a UNESCO World Heritage Site in 2015\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "The author argued that deforestation is both an environmental and an economic crisis.",
      "The author argued that deforestation was both an environmental and an economic crisis.",
      "The author argued that deforestation will be both an environmental and an economic crisis.",
      "The author argued that deforestation had been both an environmental and an economic crisis always.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense (\'is\') shifts back to past (\'was\'). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a DANGLING MODIFIER?",
    options: [
      "Having studied the archive carefully, Amara found no record of her great-grandmother.",
      "Looking through the historical documents, the records were completely empty.",
      "Cleared of its trees, the hillside was vulnerable to flooding and erosion.",
      "Stripped of its forest cover, the community faced severe water shortages.",
    ],
    correctAnswer: 1,
    explanation: "In option B, \'looking through the historical documents\' should describe a person, but the sentence says \'the records\' were looking — this is a dangling modifier."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Deforestation causes flooding; but it also causes drought in dry seasons.",
      "Deforestation causes flooding; however, it also causes drought in dry seasons.",
      "Deforestation causes flooding; and dry season droughts are also a consequence.",
      "Deforestation; causes both flooding and drought in different seasons.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is a correct construction. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the endemic species found in the Blue Mountains are now threatened.",
      "Each of the endemic species found in the Blue Mountains is now threatened.",
      "Each of the endemic species found in the Blue Mountains were now threatened.",
      "Each of the endemic species found in the Blue Mountains have been now threatened.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular and takes a singular verb. The correct form is \'is now threatened.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is essential that the government funds alternative programmes for charcoal producers.",
      "It is essential that the government fund alternative programmes for charcoal producers.",
      "It is essential that the government funded alternative programmes for charcoal producers.",
      "It is essential that the government will fund alternative programmes for charcoal producers.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is essential that,\' the subjunctive requires the base form of the verb — \'fund,\' not \'funds,\' \'funded,\' or \'will fund.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "Deforestation is driven by several factors: logging, agriculture, urban expansion, and charcoal production.",
      "Deforestation is driven by: several factors logging, agriculture, urban expansion, and charcoal production.",
      "Deforestation is driven by several factors logging: agriculture, urban expansion, and charcoal production.",
      "Deforestation: is driven by several factors logging, agriculture, urban expansion, and charcoal production.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list. \'Deforestation is driven by several factors\' is complete, and the colon correctly introduces the list."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica must treat deforestation as an economic emergency?",
    options: [
      "Jamaica has many beautiful forests that attract tourists and hikers.",
      "Deforestation is a problem in many countries, not only Jamaica.",
      "Until Jamaica addresses deforestation as a question of economic survival — not merely environmental concern — the rural communities most dependent on forest ecosystem services will continue to bear the greatest cost.",
      "The government should plant more trees in the Blue Mountains to replace those that are cut down.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, multi-dimensional argument (\'economic survival,\' \'ecosystem services,\' \'rural communities\'), frames the urgency clearly, and uses formal vocabulary — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Amara wrote about her great-grandmother because she wanted to tell her story.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Amara wrote about her great-grandmother because she really wanted to tell her story and make it known.",
      "The reason Amara wrote about her great-grandmother was because she wanted to tell her story.",
      "Amara wrote not to record facts — she had none — but to restore what the archive had erased: a morning, a pair of shoes, a woman moving with purpose through a landscape that would not remember her.",
      "Amara wrote about her great-grandmother\'s story because it was an interesting story that needed to be told.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses the language of the passage (\'restore what the archive had erased\'), specific detail (\'a morning, a pair of shoes\'), and a rhythmic final clause that captures the passage\'s emotional depth."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Deforestation is a big problem for Jamaica.\'",
    options: [
      "Deforestation is a very big and serious problem for Jamaica and its people.",
      "Deforestation is Jamaica\'s most serious environmental problem and everyone should care about it.",
      "Deforestation threatens Jamaica\'s water security, biodiversity, and long-term climate resilience — making it not merely an environmental concern, but a question of national survival.",
      "Jamaica has a big deforestation problem and needs to solve it.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'water security,\' \'climate resilience,\' \'national survival\'), is specific about the consequences, and reframes the issue as fundamental — far superior to \'big problem.\'"
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Amara found no record of her great-grandmother in any archive. The official silence was itself revealing — it showed whose lives colonial record-keeping had considered worth documenting. Jamaica has many interesting museums that preserve the island\'s history. Amara\'s response was to write the story herself, giving her great-grandmother what the archive had refused to provide.\'",
    options: [
      "The official silence was itself revealing — it showed whose lives colonial record-keeping had considered worth documenting.",
      "Amara found no record of her great-grandmother in any archive.",
      "Jamaica has many interesting museums that preserve the island\'s history.",
      "Amara\'s response was to write the story herself, giving her great-grandmother what the archive had refused to provide.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Amara\'s specific experience with the archive and her response to it. The sentence about Jamaica\'s museums is off-topic."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION?",
    options: [
      "Some people say charcoal production causes deforestation but they are simply wrong.",
      "Charcoal production is bad for forests and the government should stop it.",
      "While banning charcoal production outright would cause real economic hardship for rural families, a phased transition supported by subsidies for cleaner fuels and reforestation incentives offers a more just and effective path forward.",
      "The government knows charcoal is a problem but has not done enough about it.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the genuine harm of an outright ban (\'real economic hardship\'), then presents a specific, constructive alternative — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Amara understood her name differently at the end.\' What is the MOST PRECISE revision?",
    options: [
      "At the end Amara had a different understanding about what her name meant to her.",
      "By the end of the passage, Amara had come to understand her name differently than before.",
      "By writing her great-grandmother\'s story, Amara transformed her name from an inherited ornament into an active inheritance — a commitment to carry forward a life the archive had refused to preserve.",
      "Amara understood her name better because she had written her great-grandmother\'s story.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses the language of the passage (\'active inheritance,\' \'carry forward\'), makes the contrast precise (\'ornament\' vs \'inheritance\'), and captures the passage\'s central insight in a single, well-constructed sentence."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of recording marginalised histories?",
    options: [
      "It is important to record the history of all people, not just famous ones.",
      "Many people\'s lives have not been properly recorded in official archives.",
      "When we write the lives that history refused to record, we do not merely recover the past — we challenge the silence that decided, without our consent, whose stories were worth keeping.",
      "Archives should be made more accessible to the public so people can find their family history.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses active, powerful language (\'challenge the silence\'), introduces a moral dimension (\'without our consent\'), and ends with a resonant, philosophical statement that elevates the closing beyond summary."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines the difference between PERSUASION and MANIPULATION in writing?",
    options: [
      "Persuasion uses long sentences; manipulation uses short ones.",
      "Persuasion relies on honest evidence and sound reasoning; manipulation relies on distortion, omission, or emotional exploitation to bypass critical thinking.",
      "Persuasion is used in essays; manipulation is used in advertisements.",
      "Persuasion is always effective; manipulation sometimes fails.",
    ],
    correctAnswer: 1,
    explanation: "Persuasion is ethical — it works through honest evidence and valid reasoning. Manipulation is unethical — it distorts facts, omits important information, or exploits emotions to produce agreement without genuine understanding."
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

export default function LiteracyDifficult7Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult7Questions : literacyDifficult7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 7</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 7</h1>
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
