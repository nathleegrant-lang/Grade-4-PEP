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

const literacyDifficult6Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Unfinished Letter

After his father died, Marcus found a letter in the bedside drawer. It was written on two sheets of lined paper, the handwriting neat at the top and increasingly urgent toward the bottom, as though the writer had been running out of time — which, Marcus understood, he had been.

The letter was addressed to Marcus's grandmother, who had been dead for eleven years. His father had written to someone who could not read it. The thought made Marcus sit down on the bed and stay there for a long while.

He read it twice. His father wrote about the guava tree in his mother's yard that had been cut down. He wrote about a debt he had never repaid — not a money debt, but something harder to name: a conversation he had never had, an apology that had moved from this year to next year until next year became too late. He wrote about a Sunday dinner when he was twelve and everyone had laughed at something he could no longer remember.

Marcus set the letter down. He had always thought of his father as someone complete — a finished person, someone who had resolved the necessary things. The letter suggested otherwise. His father had carried unfinished business through decades, the way other men carry keys: habitually, without thinking, until the moment arrives when the door must be opened and the key is no longer in the pocket.

He did not put the letter back. He placed it on the table where he could see it. He was not sure what he would do with it. But he knew, with a certainty he could not explain, that it was not finished yet.`,
    question: "What is the CENTRAL IRONY revealed in the passage about Marcus\'s father\'s letter?",
    options: [
      "His father was an excellent writer but never shared his talent with Marcus.",
      "His father wrote a letter to someone who had been dead for eleven years — a communication that could never be received.",
      "Marcus\'s grandmother had also written letters that were never sent.",
      "Marcus\'s father had intended to give the letter to Marcus, not to his grandmother.",
    ],
    correctAnswer: 1,
    explanation: "The central irony is that his father wrote a letter — an act of reaching out — to someone incapable of receiving it. The letter\'s existence is both meaningful and tragically futile at the same time."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Unfinished Letter

After his father died, Marcus found a letter in the bedside drawer. It was written on two sheets of lined paper, the handwriting neat at the top and increasingly urgent toward the bottom, as though the writer had been running out of time — which, Marcus understood, he had been.

The letter was addressed to Marcus's grandmother, who had been dead for eleven years. His father had written to someone who could not read it. The thought made Marcus sit down on the bed and stay there for a long while.

He read it twice. His father wrote about the guava tree in his mother's yard that had been cut down. He wrote about a debt he had never repaid — not a money debt, but something harder to name: a conversation he had never had, an apology that had moved from this year to next year until next year became too late. He wrote about a Sunday dinner when he was twelve and everyone had laughed at something he could no longer remember.

Marcus set the letter down. He had always thought of his father as someone complete — a finished person, someone who had resolved the necessary things. The letter suggested otherwise. His father had carried unfinished business through decades, the way other men carry keys: habitually, without thinking, until the moment arrives when the door must be opened and the key is no longer in the pocket.

He did not put the letter back. He placed it on the table where he could see it. He was not sure what he would do with it. But he knew, with a certainty he could not explain, that it was not finished yet.`,
    question: "What does the metaphor of men carrying keys — \'habitually, without thinking, until the door must be opened and the key is no longer in the pocket\' — represent?",
    options: [
      "Marcus\'s father lost his keys and could not get into the house.",
      "The unresolved things people carry through life often go unaddressed until death makes it impossible to resolve them.",
      "His father was a very forgetful person who often misplaced things.",
      "The letter was meant to unlock a secret his father had kept from the family.",
    ],
    correctAnswer: 1,
    explanation: "The metaphor compares carrying unresolved business (\'the key\') to carrying keys — done habitually and unconsciously. Death (\'the moment the door must be opened\') arrives before the resolution, and the key (\'the apology, the conversation\') is gone."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Unfinished Letter

After his father died, Marcus found a letter in the bedside drawer. It was written on two sheets of lined paper, the handwriting neat at the top and increasingly urgent toward the bottom, as though the writer had been running out of time — which, Marcus understood, he had been.

The letter was addressed to Marcus's grandmother, who had been dead for eleven years. His father had written to someone who could not read it. The thought made Marcus sit down on the bed and stay there for a long while.

He read it twice. His father wrote about the guava tree in his mother's yard that had been cut down. He wrote about a debt he had never repaid — not a money debt, but something harder to name: a conversation he had never had, an apology that had moved from this year to next year until next year became too late. He wrote about a Sunday dinner when he was twelve and everyone had laughed at something he could no longer remember.

Marcus set the letter down. He had always thought of his father as someone complete — a finished person, someone who had resolved the necessary things. The letter suggested otherwise. His father had carried unfinished business through decades, the way other men carry keys: habitually, without thinking, until the moment arrives when the door must be opened and the key is no longer in the pocket.

He did not put the letter back. He placed it on the table where he could see it. He was not sure what he would do with it. But he knew, with a certainty he could not explain, that it was not finished yet.`,
    question: "What does Marcus\'s discovery change about his understanding of his father?",
    options: [
      "He learns that his father was dishonest about his financial affairs.",
      "He realises his father was not the \'finished,\' resolved person Marcus had imagined — he carried unfinished emotional business his whole life.",
      "He discovers that his father had a secret family he did not know about.",
      "He learns that his father had a difficult relationship with money.",
    ],
    correctAnswer: 1,
    explanation: "The letter reveals that his father — whom Marcus saw as \'complete\' and \'resolved\' — was carrying undone things: an apology deferred, a conversation never had. This fundamentally shifts Marcus\'s understanding."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Unfinished Letter

After his father died, Marcus found a letter in the bedside drawer. It was written on two sheets of lined paper, the handwriting neat at the top and increasingly urgent toward the bottom, as though the writer had been running out of time — which, Marcus understood, he had been.

The letter was addressed to Marcus's grandmother, who had been dead for eleven years. His father had written to someone who could not read it. The thought made Marcus sit down on the bed and stay there for a long while.

He read it twice. His father wrote about the guava tree in his mother's yard that had been cut down. He wrote about a debt he had never repaid — not a money debt, but something harder to name: a conversation he had never had, an apology that had moved from this year to next year until next year became too late. He wrote about a Sunday dinner when he was twelve and everyone had laughed at something he could no longer remember.

Marcus set the letter down. He had always thought of his father as someone complete — a finished person, someone who had resolved the necessary things. The letter suggested otherwise. His father had carried unfinished business through decades, the way other men carry keys: habitually, without thinking, until the moment arrives when the door must be opened and the key is no longer in the pocket.

He did not put the letter back. He placed it on the table where he could see it. He was not sure what he would do with it. But he knew, with a certainty he could not explain, that it was not finished yet.`,
    question: "Why does Marcus choose not to put the letter back in the drawer?",
    options: [
      "He wants to read it again more carefully in better light.",
      "He is angry at his father and does not want to put the letter back respectfully.",
      "He feels the letter contains something still alive and unresolved — that it should remain visible and part of the world.",
      "He plans to send the letter to his grandmother\'s grave.",
    ],
    correctAnswer: 2,
    explanation: "The final line — \'he knew it was not finished yet\' — explains his decision. Placing it where he can see it keeps the letter — and what it represents — open and alive rather than returned to a closed drawer."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Unfinished Letter

After his father died, Marcus found a letter in the bedside drawer. It was written on two sheets of lined paper, the handwriting neat at the top and increasingly urgent toward the bottom, as though the writer had been running out of time — which, Marcus understood, he had been.

The letter was addressed to Marcus's grandmother, who had been dead for eleven years. His father had written to someone who could not read it. The thought made Marcus sit down on the bed and stay there for a long while.

He read it twice. His father wrote about the guava tree in his mother's yard that had been cut down. He wrote about a debt he had never repaid — not a money debt, but something harder to name: a conversation he had never had, an apology that had moved from this year to next year until next year became too late. He wrote about a Sunday dinner when he was twelve and everyone had laughed at something he could no longer remember.

Marcus set the letter down. He had always thought of his father as someone complete — a finished person, someone who had resolved the necessary things. The letter suggested otherwise. His father had carried unfinished business through decades, the way other men carry keys: habitually, without thinking, until the moment arrives when the door must be opened and the key is no longer in the pocket.

He did not put the letter back. He placed it on the table where he could see it. He was not sure what he would do with it. But he knew, with a certainty he could not explain, that it was not finished yet.`,
    question: "The phrase \'the handwriting neat at the top and increasingly urgent toward the bottom\' suggests —",
    options: [
      "The writer was getting tired and losing concentration.",
      "The letter was written over several days and the second part was rushed.",
      "The physical act of writing mirrored the emotional experience — urgency and time pressure intensifying as the letter progressed.",
      "The pen the writer used was running out of ink.",
    ],
    correctAnswer: 2,
    explanation: "The shift in handwriting is a physical reflection of the emotional state — calmness giving way to urgency as the writer felt the pressure of time. It gives us a physical trace of the dying man\'s psychological experience."
  },
  {
    id: 6,
    type: "reading",
    passage: `Heritage Tourism in Jamaica: Preservation or Performance?

Jamaica's history is both its greatest cultural asset and one of its most complex legacies. From the Taino peoples who first inhabited the island to the enslaved Africans who transformed its land and culture, from the Maroons who fought for freedom in the mountains to the colonial architecture that lines Kingston's streets — the island's story is layered, contested, and profoundly human. In recent years, heritage tourism has emerged as a significant sector, attracting visitors to historical sites, cultural festivals, and living traditions. But the growing commercialisation of Jamaican heritage raises a question that deserves serious attention: does tourism preserve culture, or does it slowly transform authentic traditions into performances for an external audience?

The argument in favour of heritage tourism is compelling. Economic incentives can protect sites that might otherwise fall into disrepair. The Accompong Maroon Festival, for example, draws international visitors whose spending helps fund community development. At Seville Heritage Park in St. Ann, archaeological excavation and interpretation have been made possible partly through tourism revenue. When communities profit from their own history, they are more likely to invest in its preservation.

However, critics argue that commercialisation carries a hidden cost. When a tradition exists primarily to satisfy the expectations of tourists, it begins to change in response to those expectations. Dances become more theatrical. Foods are simplified or altered to suit unfamiliar palates. The narratives presented at heritage sites may emphasise certain aspects of history — the heroic, the picturesque — while quietly setting aside the more painful or complicated truths. Over time, the performance of a culture can begin to replace the living practice of it.

The most thoughtful answer may lie not in resolving this tension, but in managing it honestly. Heritage tourism need not be a choice between preservation and profit. But the communities at the centre of these traditions must be the primary decision-makers — not tourism boards, not tour operators, and not the preferences of visitors. Culture belongs to those who live it.`,
    question: "What is the CENTRAL QUESTION the heritage tourism passage poses?",
    options: [
      "How much money does heritage tourism generate for Jamaica each year?",
      "Should Jamaica allow tourists to visit historically sensitive sites?",
      "Does tourism preserve authentic cultural traditions, or does it transform them into performances designed for external audiences?",
      "Are Jamaican tourism boards spending enough money on cultural preservation?",
    ],
    correctAnswer: 2,
    explanation: "The passage poses this question explicitly: \'does tourism preserve culture, or does it slowly transform authentic traditions into performances for an external audience?\' — and then explores both sides."
  },
  {
    id: 7,
    type: "reading",
    passage: `Heritage Tourism in Jamaica: Preservation or Performance?

Jamaica's history is both its greatest cultural asset and one of its most complex legacies. From the Taino peoples who first inhabited the island to the enslaved Africans who transformed its land and culture, from the Maroons who fought for freedom in the mountains to the colonial architecture that lines Kingston's streets — the island's story is layered, contested, and profoundly human. In recent years, heritage tourism has emerged as a significant sector, attracting visitors to historical sites, cultural festivals, and living traditions. But the growing commercialisation of Jamaican heritage raises a question that deserves serious attention: does tourism preserve culture, or does it slowly transform authentic traditions into performances for an external audience?

The argument in favour of heritage tourism is compelling. Economic incentives can protect sites that might otherwise fall into disrepair. The Accompong Maroon Festival, for example, draws international visitors whose spending helps fund community development. At Seville Heritage Park in St. Ann, archaeological excavation and interpretation have been made possible partly through tourism revenue. When communities profit from their own history, they are more likely to invest in its preservation.

However, critics argue that commercialisation carries a hidden cost. When a tradition exists primarily to satisfy the expectations of tourists, it begins to change in response to those expectations. Dances become more theatrical. Foods are simplified or altered to suit unfamiliar palates. The narratives presented at heritage sites may emphasise certain aspects of history — the heroic, the picturesque — while quietly setting aside the more painful or complicated truths. Over time, the performance of a culture can begin to replace the living practice of it.

The most thoughtful answer may lie not in resolving this tension, but in managing it honestly. Heritage tourism need not be a choice between preservation and profit. But the communities at the centre of these traditions must be the primary decision-makers — not tourism boards, not tour operators, and not the preferences of visitors. Culture belongs to those who live it.`,
    question: "What does the passage mean by \'the performance of a culture can begin to replace the living practice of it\'?",
    options: [
      "Cultural performers are being paid too much to perform at heritage festivals.",
      "When a tradition is adapted primarily for tourist audiences, it can lose its authentic lived quality and become a staged version of itself.",
      "Communities should stop performing their traditions for tourists entirely.",
      "Traditional dances are better performed on stage than in community settings.",
    ],
    correctAnswer: 1,
    explanation: "The passage warns that when a tradition is shaped by tourist expectations rather than community practice, it stops being lived authentically and becomes a staged performance — a copy rather than the original."
  },
  {
    id: 8,
    type: "reading",
    passage: `Heritage Tourism in Jamaica: Preservation or Performance?

Jamaica's history is both its greatest cultural asset and one of its most complex legacies. From the Taino peoples who first inhabited the island to the enslaved Africans who transformed its land and culture, from the Maroons who fought for freedom in the mountains to the colonial architecture that lines Kingston's streets — the island's story is layered, contested, and profoundly human. In recent years, heritage tourism has emerged as a significant sector, attracting visitors to historical sites, cultural festivals, and living traditions. But the growing commercialisation of Jamaican heritage raises a question that deserves serious attention: does tourism preserve culture, or does it slowly transform authentic traditions into performances for an external audience?

The argument in favour of heritage tourism is compelling. Economic incentives can protect sites that might otherwise fall into disrepair. The Accompong Maroon Festival, for example, draws international visitors whose spending helps fund community development. At Seville Heritage Park in St. Ann, archaeological excavation and interpretation have been made possible partly through tourism revenue. When communities profit from their own history, they are more likely to invest in its preservation.

However, critics argue that commercialisation carries a hidden cost. When a tradition exists primarily to satisfy the expectations of tourists, it begins to change in response to those expectations. Dances become more theatrical. Foods are simplified or altered to suit unfamiliar palates. The narratives presented at heritage sites may emphasise certain aspects of history — the heroic, the picturesque — while quietly setting aside the more painful or complicated truths. Over time, the performance of a culture can begin to replace the living practice of it.

The most thoughtful answer may lie not in resolving this tension, but in managing it honestly. Heritage tourism need not be a choice between preservation and profit. But the communities at the centre of these traditions must be the primary decision-makers — not tourism boards, not tour operators, and not the preferences of visitors. Culture belongs to those who live it.`,
    question: "According to the passage, what is the MOST IMPORTANT safeguard for heritage tourism?",
    options: [
      "Having tourism boards set strict rules about what traditions can be shown.",
      "Limiting the number of tourists allowed to attend cultural festivals.",
      "Ensuring that the communities who live the traditions are the primary decision-makers about how they are presented.",
      "Prioritising profit to ensure heritage sites remain financially sustainable.",
    ],
    correctAnswer: 2,
    explanation: "The passage\'s final paragraph makes this explicit: \'the communities at the centre of these traditions must be the primary decision-makers — not tourism boards, not tour operators, and not the preferences of visitors.\'"
  },
  {
    id: 9,
    type: "reading",
    question: "What does the phrase \'culture belongs to those who live it\' suggest about the author\'s position?",
    options: [
      "Tourists have no right to learn about or experience another culture.",
      "Cultural heritage is ultimately the property and responsibility of the communities who practice it — they must have authority over its representation.",
      "Only governments should make decisions about cultural presentation.",
      "People who do not practise a tradition should be prevented from attending cultural events.",
    ],
    correctAnswer: 1,
    explanation: "\'Belongs to those who live it\' is a powerful, condensed argument: the community\'s relationship to their culture gives them authority over it. External parties — tourism boards, tour operators, visitors — should not override this."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the heritage tourism passage?",
    options: [
      "Angry and dismissive of tourism",
      "Enthusiastically promotional of Jamaican tourism",
      "Analytically balanced, raising both the value and the risks of heritage tourism",
      "Pessimistic and resigned about the future of Jamaican culture",
    ],
    correctAnswer: 2,
    explanation: "The passage presents both sides — economic benefits and risks of commercialisation — and ends with a nuanced position rather than a simple verdict. The tone is analytically balanced."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The debt he had never repaid — not a money debt, but something HARDER TO NAME.\" This phrase suggests —",
    options: [
      "His father owed money to a bank.",
      "The debt was an emotional or relational one — perhaps an apology or an honest conversation — that resists simple definition.",
      "His father could not remember what the debt was.",
      "The debt had already been repaid without his father\'s knowledge.",
    ],
    correctAnswer: 1,
    explanation: "\'Harder to name\' signals that the debt is not financial but emotional — something intangible that the passage goes on to describe as \'a conversation he had never had, an apology\' deferred until too late."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"His father had written to someone who COULD NOT READ IT.\" What effect does this detail have on the reader?",
    options: [
      "It creates suspense because the reader wonders who will read the letter.",
      "It creates a feeling of deep, quiet tragedy — a final act of communication rendered impossible by death.",
      "It suggests Marcus\'s grandmother was illiterate.",
      "It implies the letter was written in a language she did not speak.",
    ],
    correctAnswer: 1,
    explanation: "The detail is quietly devastating: the letter is an attempt to reach someone, but death makes reception impossible. It emphasises the tragedy of things left undone until it is too late."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The COMMERCIALISATION of Jamaican heritage raises serious questions.\" The word \'commercialisation\' means —",
    options: [
      "the protection of cultural traditions from outside influence",
      "the process of turning something into a product to be bought and sold for profit",
      "the education of tourists about Jamaican history",
      "the building of new museums and heritage centres",
    ],
    correctAnswer: 1,
    explanation: "Commercialisation means the process of making something into a commercial product — treating it as something to be sold and marketed for financial gain."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Narratives may EMPHASISE certain aspects of history while setting aside more complicated truths.\" The word \'emphasise\' means —",
    options: [
      "ignore completely",
      "remove permanently",
      "give special prominence or attention to",
      "question the accuracy of",
    ],
    correctAnswer: 2,
    explanation: "To emphasise means to give something particular prominence or importance. Heritage narratives may highlight heroic or attractive aspects of history while downplaying others."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The island\'s story is LAYERED, contested, and profoundly human.\" The word \'layered\' suggests —",
    options: [
      "Jamaica\'s history is simple and straightforward",
      "Jamaica\'s history has multiple levels of complexity — different groups, perspectives, and truths overlapping",
      "Jamaica\'s story has been told in too many books",
      "Jamaica\'s history is primarily about its landscape",
    ],
    correctAnswer: 1,
    explanation: "Layered means having multiple levels or strata. Jamaica\'s history is described as layered because it involves the Taino, enslaved Africans, Maroons, colonial powers — overlapping, complex stories."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"A tradition exists primarily to SATISFY the expectations of tourists.\" The word \'satisfy\' here implies —",
    options: [
      "to improve and enhance",
      "to meet and fulfil, often at the cost of authenticity",
      "to reject and dismiss",
      "to document and record",
    ],
    correctAnswer: 1,
    explanation: "To satisfy expectations means to meet what people anticipate — but the context implies this comes at a cost: the tradition is shaped to match external desires rather than to remain authentic."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Culture belongs to those who LIVE IT.\" The phrase \'live it\' means —",
    options: [
      "to perform it on stage for an audience",
      "to actually practice it as part of daily life and identity",
      "to study it academically",
      "to export it to other countries",
    ],
    correctAnswer: 1,
    explanation: "\'Live it\' means to practise the culture as a genuine, lived part of one\'s identity and daily experience — not to perform it for others or study it from the outside."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The apology had moved FROM THIS YEAR TO NEXT YEAR until next year became too late.\" What does this suggest about how people manage difficult conversations?",
    options: [
      "People are generally very good at having difficult conversations when needed.",
      "People frequently defer uncomfortable emotional tasks — putting them off repeatedly until opportunity is permanently lost.",
      "Apologies are best given in writing rather than in person.",
      "People become better at difficult conversations as they get older.",
    ],
    correctAnswer: 1,
    explanation: "The phrase captures a universal human tendency: deferring the difficult thing — \'I\'ll do it next year\' — until death or time makes it permanently impossible. It is a gentle but devastating observation."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"At Seville Heritage Park, ARCHAEOLOGICAL excavation has been made possible through tourism revenue.\" The word \'archaeological\' relates to —",
    options: [
      "the preservation of colonial architecture",
      "the study and excavation of ancient human remains, artefacts, and sites",
      "the promotion of traditional music and dance",
      "the training of tour guides in Jamaican history",
    ],
    correctAnswer: 1,
    explanation: "Archaeological relates to archaeology — the study of human history through excavation and analysis of physical remains, artefacts, and structures."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Foods are simplified or ALTERED to suit unfamiliar palates.\" The word \'palates\' refers to —",
    options: [
      "the decorative patterns used in heritage site design",
      "the tastes and flavour preferences of different groups of people",
      "the plates and utensils used at cultural festivals",
      "the prices charged for food at tourist sites",
    ],
    correctAnswer: 1,
    explanation: "Palate refers to a person\'s sense of taste and flavour preferences. \'Unfamiliar palates\' means tourists who are not accustomed to the authentic flavours of Jamaican food."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The collection of unfinished letters found in the drawer were remarkable.",
      "The collection of unfinished letters found in the drawer was remarkable.",
      "The collection of unfinished letters found in the drawer are remarkable.",
      "The collection of unfinished letters found in the drawer have been remarkable.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the collection,\' which is singular. The correct verb is \'was.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Marcus found the letter, his father already died.",
      "By the time Marcus found the letter, his father has already died.",
      "By the time Marcus found the letter, his father had already died.",
      "By the time Marcus found the letter, his father was already dying.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had\' + past participle) shows an action completed before another past event. \'Had already died\' correctly shows that the father\'s death preceded Marcus finding the letter."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Heritage tourism can protect sites, creating employment, and it also supports cultural identity.",
      "Heritage tourism can protect sites, create employment, and support cultural identity.",
      "Heritage tourism can protect sites, to create employment, and supporting cultural identity.",
      "Heritage tourism can protect sites, creating employment, and to support cultural identity.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses three bare infinitives: protect, create, and support."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The letter, which Marcus found in the bedside drawer had been written before his father died.",
      "The letter which Marcus found in the bedside drawer, had been written before his father died.",
      "The letter, which Marcus found in the bedside drawer, had been written before his father died.",
      "The letter which Marcus found in the bedside drawer had been written before his father died.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which Marcus found in the bedside drawer\' must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Marcus found the unfinished letter in his father\'s bedside drawer.",
      "The unfinished letter was found by Marcus in his father\'s bedside drawer.",
      "His father had written the letter to a woman who had been dead for eleven years.",
      "The guava tree in his grandmother\'s yard had been cut down years before.",
    ],
    correctAnswer: 1,
    explanation: "In the passive voice, the subject receives the action. In option B, \'the unfinished letter\' (subject) receives the action \'was found.\' Note: Option D is also passive — but B is the clearest example with an explicit \'by\' phrase."
  },
  {
    id: 26,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although heritage tourism brings economic benefits, it may alter the traditions it claims to preserve.\'",
    options: [
      "it may alter the traditions it claims to preserve",
      "Although heritage tourism brings economic benefits",
      "heritage tourism brings economic benefits",
      "alter the traditions it claims to preserve",
    ],
    correctAnswer: 1,
    explanation: "\'Although heritage tourism brings economic benefits\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "The author argued that culture belongs to those who live it.",
      "The author argued that culture belonged to those who lived it.",
      "The author argued that culture will belong to those who live it.",
      "The author argued that culture had belonged to those who lived it.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech with a past reporting verb (\'argued\'), the present tense (\'belongs\') shifts back to past (\'belonged\'). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a DANGLING MODIFIER?",
    options: [
      "Reading the letter carefully, Marcus began to see his father differently.",
      "Written in increasingly urgent handwriting, Marcus found the letter in the drawer.",
      "Written in increasingly urgent handwriting, the letter revealed a man under pressure of time.",
      "Having read the letter twice, Marcus set it down on the table.",
    ],
    correctAnswer: 1,
    explanation: "In option B, \'written in increasingly urgent handwriting\' should describe the letter, but the sentence\'s subject is \'Marcus\' — implying Marcus was written in urgent handwriting. The letter is the correct subject."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Heritage tourism brings economic benefits; but it may compromise cultural authenticity.",
      "Heritage tourism brings economic benefits; however, it may compromise cultural authenticity.",
      "Heritage tourism brings economic benefits; and communities benefit from tourism revenue.",
      "Heritage tourism; brings economic benefits and may compromise cultural authenticity.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is a correct and formal construction. Semicolons should not precede coordinating conjunctions (\'but,\' \'and\')."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "The communities at the centre of these traditions is the primary decision-makers.",
      "The communities at the centre of these traditions are the primary decision-makers.",
      "The communities at the centre of these traditions was the primary decision-makers.",
      "The communities at the centre of these traditions has been the primary decision-makers.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'communities,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is important that the community makes decisions about its own heritage.",
      "It is important that the community make decisions about its own heritage.",
      "It is important that the community made decisions about its own heritage.",
      "It is important that the community will make decisions about its own heritage.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is important that,\' the subjunctive is required — the base form of the verb (\'make\'), not \'makes,\' \'made,\' or \'will make.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "Marcus noticed three things that unsettled him: the urgent handwriting, the dead addressee, and the unresolved apology.",
      "Marcus noticed: three things that unsettled him the urgent handwriting, the dead addressee, and the unresolved apology.",
      "Marcus noticed three things: that unsettled him the urgent handwriting, the dead addressee, and the unresolved apology.",
      "Marcus noticed three things that: unsettled him the urgent handwriting, the dead addressee, and the unresolved apology.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list. \'Marcus noticed three things that unsettled him\' is a complete clause, and the colon correctly introduces the list."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaican communities should control the presentation of their own heritage?",
    options: [
      "Jamaica has many important historical sites that tourists enjoy visiting.",
      "Tourism boards work hard to make Jamaican heritage accessible to international visitors.",
      "The communities whose history, traditions, and stories form the substance of heritage tourism must retain authority over how that heritage is presented — because without their agency, tourism becomes extraction rather than celebration.",
      "Heritage tourism is good for Jamaica\'s economy and brings many visitors to the island.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, specific argument (\'must retain authority\'), explains the reason (\'without their agency\'), and uses a powerful contrast (\'extraction rather than celebration\') — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Marcus was sad when he read the letter because it showed him things about his dad he did not know.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Marcus felt very sad after reading the letter and realising that he did not know his dad as well as he thought.",
      "Reading the letter made Marcus sad because it told him new things about his dad.",
      "The letter unsettled Marcus profoundly — revealing not a completed man but one who had carried unfinished emotional business through decades, deferring what mattered most until time ran out.",
      "The letter made Marcus sad because it showed him that his father had problems he never talked about.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'unsettled,\' \'profoundly,\' \'deferring\'), specific detail (\'unfinished emotional business,\' \'through decades\'), and captures the passage\'s central insight about the father."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Heritage tourism can be good for Jamaica.\'",
    options: [
      "Heritage tourism can be very good and beneficial for Jamaica in different ways.",
      "When managed with community authority and cultural integrity, heritage tourism can generate economic sustainability while strengthening the living traditions it seeks to celebrate.",
      "Heritage tourism is good because it helps Jamaica earn money from visitors.",
      "Heritage tourism in Jamaica is a positive thing for many reasons.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise vocabulary (\'cultural integrity,\' \'economic sustainability\'), specifies the conditions (\'when managed with community authority\'), and avoids the vague \'good\' with specific outcomes."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Marcus found the unfinished letter in his father\'s bedside drawer after his father died. It was addressed to his grandmother, who had been dead for eleven years. The handwriting grew increasingly urgent toward the bottom of the page. Jamaica has beautiful mountains and coastlines that attract tourists every year. The letter contained an apology that had been deferred for too long.\'",
    options: [
      "It was addressed to his grandmother, who had been dead for eleven years.",
      "The handwriting grew increasingly urgent toward the bottom of the page.",
      "Jamaica has beautiful mountains and coastlines that attract tourists every year.",
      "The letter contained an apology that had been deferred for too long.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Marcus and the letter. The sentence about Jamaica\'s geography is completely irrelevant and should be removed."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about heritage tourism?",
    options: [
      "Some people think heritage tourism is bad but they are wrong and it is actually good.",
      "Heritage tourism has some problems but it also has good things about it.",
      "While the economic benefits of heritage tourism are genuine and significant, they cannot justify allowing commercial pressures to reshape cultural traditions in ways that communities have not chosen for themselves.",
      "Heritage tourism is important even though some people disagree about it.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the opposing point honestly (\'genuine and significant\') before presenting a clear, principled counter — exactly the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The letter was important to Marcus.\' What is the MOST PRECISE and DEVELOPED revision?",
    options: [
      "The letter was very important and meaningful to Marcus in many ways.",
      "Marcus found the letter to be really important because of what it said.",
      "The letter mattered to Marcus not merely because it revealed secrets, but because it fundamentally revised his understanding of who his father was — replacing a completed portrait with a more human, more unfinished one.",
      "The important letter changed the way Marcus thought about things.",
    ],
    correctAnswer: 2,
    explanation: "Option C explains what specifically made it matter (\'fundamentally revised his understanding\'), specifies the change (\'replacing a completed portrait\'), and uses the metaphor of portraiture to echo the passage\'s themes."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of preserving cultural authenticity in heritage tourism?",
    options: [
      "Heritage tourism should respect Jamaican culture and traditions.",
      "Tourism boards should listen more carefully to local communities.",
      "When a culture is performed primarily for the comfort of outsiders, it is no longer fully alive — it has become a reflection rather than a source, and reflections, however beautiful, cannot sustain what they merely mirror.",
      "It is important that heritage tourism is done in a way that is authentic and respectful.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses a powerful metaphor (\'reflection rather than a source\'), builds to a philosophical insight (\'reflections cannot sustain what they merely mirror\'), and ends memorably — exactly what a closing sentence should achieve."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST explains what makes an ARGUMENT BALANCED rather than one-sided?",
    options: [
      "A balanced argument uses more words to describe both sides equally.",
      "A balanced argument avoids taking any final position, leaving the reader to decide.",
      "A balanced argument honestly acknowledges the strengths of opposing views before presenting evidence and reasoning for its own position.",
      "A balanced argument uses a question at the end so the reader does not feel lectured.",
    ],
    correctAnswer: 2,
    explanation: "A balanced argument does not mean \'no position\' — it means acknowledging counterarguments honestly and fairly before making the case for a specific position. Option C describes this correctly."
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

export default function LiteracyDifficult6Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult6Questions : literacyDifficult6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 6</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 6 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 6</h1>
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
