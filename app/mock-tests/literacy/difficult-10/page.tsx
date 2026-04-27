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

const literacyDifficult10Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `What the Storm Left

After the hurricane, the neighbourhood looked like it had been rearranged by something indifferent. Trees lay where they had fallen. Roofs opened to the sky. The McGregor family's guava tree — the one Nadia had climbed since she was five — was gone, root and all, replaced by a raw red wound in the earth.

Nadia was fourteen. She had slept through the worst of it, which she felt obscurely ashamed about. Her parents had stayed awake listening and worrying; she had woken only to silence and damage. There was something in this that felt like a small failure — though she could not explain it to herself or anyone else.

Over the following days, the neighbourhood did something Nadia had not expected. People came out. Not just their neighbours, but people from further away — with food, with tools, with hands prepared to work. A man she had never seen before spent a whole afternoon clearing branches from their front yard. An elderly woman from the next street brought a pot of soup that she left at the gate without knocking.

Nadia helped where she could. She carried water, held things, fetched things. She watched the way people moved around each other in the aftermath — efficient and purposeful, with a gentleness that was different from ordinary neighbourliness. It reminded her, she thought, of the way her family behaved in a hospital: something had stripped away the usual noise of daily life, and what remained underneath was something older and more reliable.

She did not think about the guava tree again for a long time. When she did, she noticed that what she remembered most was not the tree itself, but the red earth where it had been — and the strange, stubborn grass that had already begun to grow back in.`,
    question: "What does Nadia feel \'obscurely ashamed\' about, and what does this reveal about her character?",
    options: [
      "She is ashamed that she was afraid of the hurricane.",
      "She is ashamed that she slept through the worst of the storm while her parents stayed awake and worried — suggesting a sense of responsibility and a desire to have been present.",
      "She is ashamed that she did not help her neighbours before the storm.",
      "She is ashamed that she cried when she saw the damaged guava tree.",
    ],
    correctAnswer: 1,
    explanation: "Nadia\'s shame is subtle and self-questioning — she feels she should have been present and awake while her parents worried. This reveals a character with a strong moral conscience and a tendency toward introspection."
  },
  {
    id: 2,
    type: "reading",
    passage: `What the Storm Left

After the hurricane, the neighbourhood looked like it had been rearranged by something indifferent. Trees lay where they had fallen. Roofs opened to the sky. The McGregor family's guava tree — the one Nadia had climbed since she was five — was gone, root and all, replaced by a raw red wound in the earth.

Nadia was fourteen. She had slept through the worst of it, which she felt obscurely ashamed about. Her parents had stayed awake listening and worrying; she had woken only to silence and damage. There was something in this that felt like a small failure — though she could not explain it to herself or anyone else.

Over the following days, the neighbourhood did something Nadia had not expected. People came out. Not just their neighbours, but people from further away — with food, with tools, with hands prepared to work. A man she had never seen before spent a whole afternoon clearing branches from their front yard. An elderly woman from the next street brought a pot of soup that she left at the gate without knocking.

Nadia helped where she could. She carried water, held things, fetched things. She watched the way people moved around each other in the aftermath — efficient and purposeful, with a gentleness that was different from ordinary neighbourliness. It reminded her, she thought, of the way her family behaved in a hospital: something had stripped away the usual noise of daily life, and what remained underneath was something older and more reliable.

She did not think about the guava tree again for a long time. When she did, she noticed that what she remembered most was not the tree itself, but the red earth where it had been — and the strange, stubborn grass that had already begun to grow back in.`,
    question: "What surprised Nadia about the community\'s response to the hurricane?",
    options: [
      "She was surprised that the damage was so extensive.",
      "She was surprised that her parents were upset about the guava tree.",
      "She was surprised that strangers came to help — with food, tools, and physical labour — without being asked.",
      "She was surprised that the storm had left the neighbourhood so quiet.",
    ],
    correctAnswer: 2,
    explanation: "The passage says Nadia \'had not expected\' people to come out — particularly strangers, including a man she had never seen and an elderly woman who left soup without knocking."
  },
  {
    id: 3,
    type: "reading",
    passage: `What the Storm Left

After the hurricane, the neighbourhood looked like it had been rearranged by something indifferent. Trees lay where they had fallen. Roofs opened to the sky. The McGregor family's guava tree — the one Nadia had climbed since she was five — was gone, root and all, replaced by a raw red wound in the earth.

Nadia was fourteen. She had slept through the worst of it, which she felt obscurely ashamed about. Her parents had stayed awake listening and worrying; she had woken only to silence and damage. There was something in this that felt like a small failure — though she could not explain it to herself or anyone else.

Over the following days, the neighbourhood did something Nadia had not expected. People came out. Not just their neighbours, but people from further away — with food, with tools, with hands prepared to work. A man she had never seen before spent a whole afternoon clearing branches from their front yard. An elderly woman from the next street brought a pot of soup that she left at the gate without knocking.

Nadia helped where she could. She carried water, held things, fetched things. She watched the way people moved around each other in the aftermath — efficient and purposeful, with a gentleness that was different from ordinary neighbourliness. It reminded her, she thought, of the way her family behaved in a hospital: something had stripped away the usual noise of daily life, and what remained underneath was something older and more reliable.

She did not think about the guava tree again for a long time. When she did, she noticed that what she remembered most was not the tree itself, but the red earth where it had been — and the strange, stubborn grass that had already begun to grow back in.`,
    question: "What does the comparison to \'the way her family behaved in a hospital\' suggest about post-hurricane community behaviour?",
    options: [
      "Neighbours were rushing around in a chaotic and frightened way.",
      "Crisis strips away ordinary social performance and reveals a deeper, more reliable human capacity for purposeful, gentle cooperation.",
      "Nadia\'s neighbourhood had recently experienced a medical emergency.",
      "People in hospitals are generally more efficient than people in neighbourhoods.",
    ],
    correctAnswer: 1,
    explanation: "A hospital visit strips away ordinary noise and reveals what matters most — care, efficiency, gentleness. Nadia perceives the same quality in the post-hurricane community response: crisis revealing something \'older and more reliable\' underneath."
  },
  {
    id: 4,
    type: "reading",
    passage: `What the Storm Left

After the hurricane, the neighbourhood looked like it had been rearranged by something indifferent. Trees lay where they had fallen. Roofs opened to the sky. The McGregor family's guava tree — the one Nadia had climbed since she was five — was gone, root and all, replaced by a raw red wound in the earth.

Nadia was fourteen. She had slept through the worst of it, which she felt obscurely ashamed about. Her parents had stayed awake listening and worrying; she had woken only to silence and damage. There was something in this that felt like a small failure — though she could not explain it to herself or anyone else.

Over the following days, the neighbourhood did something Nadia had not expected. People came out. Not just their neighbours, but people from further away — with food, with tools, with hands prepared to work. A man she had never seen before spent a whole afternoon clearing branches from their front yard. An elderly woman from the next street brought a pot of soup that she left at the gate without knocking.

Nadia helped where she could. She carried water, held things, fetched things. She watched the way people moved around each other in the aftermath — efficient and purposeful, with a gentleness that was different from ordinary neighbourliness. It reminded her, she thought, of the way her family behaved in a hospital: something had stripped away the usual noise of daily life, and what remained underneath was something older and more reliable.

She did not think about the guava tree again for a long time. When she did, she noticed that what she remembered most was not the tree itself, but the red earth where it had been — and the strange, stubborn grass that had already begun to grow back in.`,
    question: "What is the SIGNIFICANCE of the \'strange, stubborn grass\' growing back in the earth where the guava tree had been?",
    options: [
      "The grass grew back because the soil was unusually fertile.",
      "Nadia was unhappy that grass grew where the tree had stood.",
      "The grass represents resilience — the quiet, persistent renewal of life after loss and destruction.",
      "The grass proves that the hurricane did not cause permanent damage.",
    ],
    correctAnswer: 2,
    explanation: "The grass growing back in the raw earth is a quiet symbol of resilience — life returning without fanfare to a place of loss. The word \'stubborn\' reinforces this: it persists despite the disruption."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the hurricane passage?",
    options: [
      "Fearful and dramatic",
      "Quiet, observational, and gently hopeful",
      "Angry at the forces that caused the storm",
      "Comic and ironic",
    ],
    correctAnswer: 1,
    explanation: "The passage is told through careful, quiet observation — Nadia watching, helping, noticing. The tone is restrained and thoughtful, with a note of gentle hope at the end (\'stubborn grass already growing back\')."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Reparations Question: A Caribbean Perspective

The debate over reparations for the transatlantic slave trade has intensified in recent years, driven in part by the Caribbean Community's formal demands for reparatory justice and the publication of increasingly detailed research documenting the financial scale of the trade and its aftermath. For small island nations like Jamaica — which was among the most economically significant British colonial territories — the question carries particular weight.

The case for reparations rests on several foundations. First, the economic analysis is more precise than opponents sometimes acknowledge. Economists have calculated the value of enslaved labour, the profits extracted, and the compound interest those profits would represent today — with figures running into the trillions. Second, the British government paid compensation at Emancipation in 1833 — but to the enslavers, not the enslaved. This compensation was only fully repaid by British taxpayers in 2015. Caribbean nations received nothing. Third, the structural disadvantages created by slavery — in education, wealth distribution, and institutional capacity — persist measurably into the present.

Critics of reparations raise several objections. They argue that it is unjust to hold present-day citizens financially responsible for the actions of past generations. They question how recipients would be identified and funds distributed equitably. They suggest that the sums involved are politically unworkable.

Proponents respond that reparations need not take the form of direct financial transfers. Debt cancellation, targeted investment in health and education infrastructure, and formal acknowledgement of historical responsibility represent alternatives that address the structural legacy without the distributional challenges of individual payments. The question, ultimately, is not whether a debt exists — the historical record makes this difficult to dispute — but whether the political will to address it can be found.`,
    question: "What is the MOST PRECISE statement of the reparations passage\'s central argument?",
    options: [
      "Caribbean nations should receive immediate financial payments from Britain.",
      "The case for reparations is historically and economically documented, and alternatives to direct payment exist — the question is whether political will can be found.",
      "All British citizens should pay personally for the crimes of their ancestors.",
      "Reparations are impossible because the enslaved people are all dead.",
    ],
    correctAnswer: 1,
    explanation: "The passage builds the economic and historical case, acknowledges political objections, presents alternatives, and concludes that the real question is political will. Option B captures this arc accurately."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Reparations Question: A Caribbean Perspective

The debate over reparations for the transatlantic slave trade has intensified in recent years, driven in part by the Caribbean Community's formal demands for reparatory justice and the publication of increasingly detailed research documenting the financial scale of the trade and its aftermath. For small island nations like Jamaica — which was among the most economically significant British colonial territories — the question carries particular weight.

The case for reparations rests on several foundations. First, the economic analysis is more precise than opponents sometimes acknowledge. Economists have calculated the value of enslaved labour, the profits extracted, and the compound interest those profits would represent today — with figures running into the trillions. Second, the British government paid compensation at Emancipation in 1833 — but to the enslavers, not the enslaved. This compensation was only fully repaid by British taxpayers in 2015. Caribbean nations received nothing. Third, the structural disadvantages created by slavery — in education, wealth distribution, and institutional capacity — persist measurably into the present.

Critics of reparations raise several objections. They argue that it is unjust to hold present-day citizens financially responsible for the actions of past generations. They question how recipients would be identified and funds distributed equitably. They suggest that the sums involved are politically unworkable.

Proponents respond that reparations need not take the form of direct financial transfers. Debt cancellation, targeted investment in health and education infrastructure, and formal acknowledgement of historical responsibility represent alternatives that address the structural legacy without the distributional challenges of individual payments. The question, ultimately, is not whether a debt exists — the historical record makes this difficult to dispute — but whether the political will to address it can be found.`,
    question: "What is SIGNIFICANT about the detail that British compensation for Emancipation was paid to enslavers, not the enslaved, and was only fully repaid by taxpayers in 2015?",
    options: [
      "It proves that British taxpayers are still responsible for slavery today.",
      "It shows that the British government did not support Emancipation.",
      "It demonstrates that enslaved people received nothing at Emancipation while enslavers were financially compensated — and that British taxpayers continued servicing this compensation debt until very recently.",
      "It means that reparations have already been partially paid.",
    ],
    correctAnswer: 2,
    explanation: "This is one of the passage\'s most powerful specific facts: the enslaved received nothing; the enslavers received substantial compensation; and British citizens were still paying for that compensation as recently as 2015. It makes the case for reparatory justice with precision."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Reparations Question: A Caribbean Perspective

The debate over reparations for the transatlantic slave trade has intensified in recent years, driven in part by the Caribbean Community's formal demands for reparatory justice and the publication of increasingly detailed research documenting the financial scale of the trade and its aftermath. For small island nations like Jamaica — which was among the most economically significant British colonial territories — the question carries particular weight.

The case for reparations rests on several foundations. First, the economic analysis is more precise than opponents sometimes acknowledge. Economists have calculated the value of enslaved labour, the profits extracted, and the compound interest those profits would represent today — with figures running into the trillions. Second, the British government paid compensation at Emancipation in 1833 — but to the enslavers, not the enslaved. This compensation was only fully repaid by British taxpayers in 2015. Caribbean nations received nothing. Third, the structural disadvantages created by slavery — in education, wealth distribution, and institutional capacity — persist measurably into the present.

Critics of reparations raise several objections. They argue that it is unjust to hold present-day citizens financially responsible for the actions of past generations. They question how recipients would be identified and funds distributed equitably. They suggest that the sums involved are politically unworkable.

Proponents respond that reparations need not take the form of direct financial transfers. Debt cancellation, targeted investment in health and education infrastructure, and formal acknowledgement of historical responsibility represent alternatives that address the structural legacy without the distributional challenges of individual payments. The question, ultimately, is not whether a debt exists — the historical record makes this difficult to dispute — but whether the political will to address it can be found.`,
    question: "What does the passage mean when it says the historical record makes the existence of a debt \'difficult to dispute\'?",
    options: [
      "Everyone agrees that reparations should be paid immediately.",
      "The documented financial scale of the slave trade and its compensation structure creates a strong factual basis for the claim that something is owed.",
      "The debate about reparations is too complicated for ordinary people to understand.",
      "No serious economist disagrees about the amount that should be paid.",
    ],
    correctAnswer: 1,
    explanation: "\'Difficult to dispute\' means the historical record is detailed and documented enough that denying a debt exists requires ignoring substantial evidence. The passage does not say the debt is uncontested — only that the historical basis is strong."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Reparations Question: A Caribbean Perspective

The debate over reparations for the transatlantic slave trade has intensified in recent years, driven in part by the Caribbean Community's formal demands for reparatory justice and the publication of increasingly detailed research documenting the financial scale of the trade and its aftermath. For small island nations like Jamaica — which was among the most economically significant British colonial territories — the question carries particular weight.

The case for reparations rests on several foundations. First, the economic analysis is more precise than opponents sometimes acknowledge. Economists have calculated the value of enslaved labour, the profits extracted, and the compound interest those profits would represent today — with figures running into the trillions. Second, the British government paid compensation at Emancipation in 1833 — but to the enslavers, not the enslaved. This compensation was only fully repaid by British taxpayers in 2015. Caribbean nations received nothing. Third, the structural disadvantages created by slavery — in education, wealth distribution, and institutional capacity — persist measurably into the present.

Critics of reparations raise several objections. They argue that it is unjust to hold present-day citizens financially responsible for the actions of past generations. They question how recipients would be identified and funds distributed equitably. They suggest that the sums involved are politically unworkable.

Proponents respond that reparations need not take the form of direct financial transfers. Debt cancellation, targeted investment in health and education infrastructure, and formal acknowledgement of historical responsibility represent alternatives that address the structural legacy without the distributional challenges of individual payments. The question, ultimately, is not whether a debt exists — the historical record makes this difficult to dispute — but whether the political will to address it can be found.`,
    question: "What is the AUTHOR\'S PURPOSE in presenting the critics\' objections before discussing alternatives?",
    options: [
      "To show that critics of reparations are right and the debate should end.",
      "To acknowledge genuine difficulties before presenting solutions — strengthening the overall argument by engaging honestly with opposition.",
      "To delay the main argument and fill space in the passage.",
      "To show that the author is neutral and does not have a personal position.",
    ],
    correctAnswer: 1,
    explanation: "Presenting objections before alternatives is a rhetorical strategy: it shows the author has engaged seriously with opposition, making the proposed solutions more credible. This is the structure of a rigorous argument."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the reparations passage?",
    options: [
      "Emotionally charged and partisan",
      "Historically grounded, analytically structured, and carefully persuasive",
      "Dismissive of critics\' concerns",
      "Uncertain and unable to reach a conclusion",
    ],
    correctAnswer: 1,
    explanation: "The passage uses historical evidence, economic data, and logical analysis. It acknowledges opposing arguments before presenting alternatives. The tone is historically grounded, analytically structured, and carefully persuasive."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The neighbourhood looked like it had been rearranged by something INDIFFERENT.\" The word \'indifferent\' means —",
    options: [
      "angry and deliberate",
      "thoughtful and purposeful",
      "without care or concern — acting without awareness of human consequence",
      "shy and hesitant",
    ],
    correctAnswer: 2,
    explanation: "Indifferent means without care or interest in consequences. The hurricane \'rearranged\' the neighbourhood without awareness or concern for what mattered to the people who lived there."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"There was something in this that felt like a small FAILURE.\" In this context, \'failure\' means —",
    options: [
      "a physical collapse or breakdown",
      "a sense of falling short of one\'s own moral or emotional expectations",
      "an official judgement of incompetence",
      "a poor result in a school examination",
    ],
    correctAnswer: 1,
    explanation: "Nadia uses \'failure\' as a moral self-assessment — she feels she failed to be present when it mattered. This is a personal, internal sense of falling short."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The TRANSATLANTIC slave trade.\" The word \'transatlantic\' means —",
    options: [
      "happening within one country",
      "crossing the Atlantic Ocean — between continents",
      "existing before the discovery of the Americas",
      "organised by Atlantic island nations",
    ],
    correctAnswer: 1,
    explanation: "Transatlantic means crossing or relating to the Atlantic Ocean — in this context, the trade that operated between Africa, the Caribbean/Americas, and Europe across the Atlantic."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Economists have calculated the COMPOUND interest those profits would represent today.\" The word \'compound\' in this context means —",
    options: [
      "a type of enclosed space",
      "interest calculated on both the original sum and accumulated interest — causing it to grow exponentially over time",
      "a mixture of two different financial instruments",
      "the total value of all properties owned",
    ],
    correctAnswer: 1,
    explanation: "Compound interest accrues on both the original sum and on previously accumulated interest — meaning it grows at an accelerating rate. Over centuries, even moderate initial sums become enormous."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The STRUCTURAL disadvantages created by slavery persist into the present.\" The word \'structural\' means —",
    options: [
      "relating to the physical structure of buildings",
      "built into the fundamental systems and institutions of society, not merely individual or temporary",
      "caused by natural forces like weather",
      "related to the structure of a legal document",
    ],
    correctAnswer: 1,
    explanation: "Structural disadvantages are built into the foundational systems of society — institutions, policies, wealth distribution — rather than being individual or circumstantial. They persist because the systems that produced them persist."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Efficient and PURPOSEFUL, with a gentleness different from ordinary neighbourliness.\" The word \'purposeful\' means —",
    options: [
      "loud and attention-seeking",
      "acting with a clear direction and intention in mind",
      "careless and disorganised",
      "slow and cautious",
    ],
    correctAnswer: 1,
    explanation: "Purposeful means having a clear sense of purpose or direction — acting with intention and focus. The community members moved efficiently and deliberately."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"DEBT CANCELLATION, targeted investment, and formal acknowledgement represent alternatives.\" What does \'debt cancellation\' mean?",
    options: [
      "The forgiveness of financial debts owed by one party to another",
      "The addition of new financial obligations",
      "The postponement of repayment to a future date",
      "The calculation of total debts owed by all parties",
    ],
    correctAnswer: 0,
    explanation: "Debt cancellation means formally eliminating debts — in this context, wealthier nations cancelling the debts owed by Caribbean nations as a form of reparatory justice."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The question carries PARTICULAR WEIGHT for small island nations like Jamaica.\" The phrase \'carries particular weight\' means —",
    options: [
      "is physically heavy and difficult to move",
      "is especially significant and important in this specific context",
      "creates a financial burden that is hard to bear",
      "has been debated for a particularly long time",
    ],
    correctAnswer: 1,
    explanation: "\'Carries weight\' is an idiom meaning to have significance or importance. \'Particular weight\' means it is especially significant in this specific context — more so than in other places."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"People moved around each other with a GENTLENESS different from ordinary neighbourliness.\" What does this contrast suggest?",
    options: [
      "Neighbours are normally unkind and unfriendly.",
      "Crisis brings out a deeper, more deliberate kind of care in people — different from the habitual politeness of everyday interaction.",
      "The storm had made people frightened of each other.",
      "Nadia\'s neighbourhood was an unusually unfriendly place.",
    ],
    correctAnswer: 1,
    explanation: "\'Different from ordinary neighbourliness\' suggests the post-crisis care was qualitatively different — not the usual surface politeness, but a deeper, more intentional gentleness that crisis reveals."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"REPARATORY JUSTICE.\" The word \'reparatory\' means —",
    options: [
      "relating to the repair of physical buildings",
      "aimed at making amends or repairing harm done",
      "relating to the preparation of legal documents",
      "concerned with the preservation of historical records",
    ],
    correctAnswer: 1,
    explanation: "Reparatory means concerned with making repair or amends — addressing harm that was done. Reparatory justice involves acknowledging and materially addressing historical wrongs."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The structural legacy of slavery and colonialism in the Caribbean are well documented.",
      "The structural legacy of slavery and colonialism in the Caribbean is well documented.",
      "The structural legacy of slavery and colonialism in the Caribbean have been well documented.",
      "The structural legacy of slavery and colonialism in the Caribbean were well documented.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the structural legacy,\' which is singular. The correct verb is \'is well documented.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time the community began to help, Nadia already felt ashamed about sleeping.",
      "By the time the community began to help, Nadia has already felt ashamed about sleeping.",
      "By the time the community began to help, Nadia had already felt ashamed about sleeping.",
      "By the time the community began to help, Nadia was already feeling ashamed about sleeping.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had already felt\') is required for an action completed before another past event — the shame preceded the community\'s arrival."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although critics argue that present-day citizens should not be held responsible, the historical debt is well documented.\'",
    options: [
      "the historical debt is well documented",
      "Although critics argue that present-day citizens should not be held responsible",
      "critics argue that present-day citizens should not be held responsible",
      "should not be held responsible",
    ],
    correctAnswer: 1,
    explanation: "\'Although critics argue that present-day citizens should not be held responsible\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "The reparations case rests on economic analysis, historical records, and documenting the structural legacy.",
      "The reparations case rests on economic analysis, historical records, and the structural legacy of slavery.",
      "The reparations case rests on economic analysis, historical records being important, and the structural legacy.",
      "The reparations case rests on economic analysis, on historical records that exist, and the structural legacy.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses three noun phrases: economic analysis, historical records, and the structural legacy of slavery."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "The community brought food, tools, and physical labour to help with the recovery.",
      "Nadia carried water and helped clear debris from the yard.",
      "The compensation for Emancipation was paid to enslavers, not the enslaved.",
      "Economists have calculated the compound interest on colonial profits.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the compensation\' (subject) receives the action \'was paid.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Jamaica, which was one of Britain\'s most economically significant colonial territories has been central to the reparations debate.",
      "Jamaica which was one of Britain\'s most economically significant colonial territories, has been central to the reparations debate.",
      "Jamaica, which was one of Britain\'s most economically significant colonial territories, has been central to the reparations debate.",
      "Jamaica, which was one of Britain\'s most economically significant colonial territories has been central, to the reparations debate.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which was one of Britain\'s most economically significant colonial territories\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Critics argue that it is unjust to hold present-day citizens responsible for past actions.",
      "Critics argue that it was unjust to hold present-day citizens responsible for past actions.",
      "Critics argued that it is unjust to hold present-day citizens responsible for past actions.",
      "Critics argued that it was unjust to hold present-day citizens responsible for past actions.",
    ],
    correctAnswer: 3,
    explanation: "When the reporting verb (\'argued\') is in the past tense, the reported clause shifts back: \'is unjust\' becomes \'was unjust.\' Option D correctly applies this in both clauses."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Walking through the damaged neighbourhood, Nadia noticed the raw earth where the guava tree had been.",
      "Carrying a pot of soup, the elderly woman left it at the gate without knocking.",
      "Stripped of its usual noise, the neighbourhood revealed something older and more reliable.",
      "Leaving the soup at the gate, the gate stood open to the empty yard.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'leaving the soup at the gate\' should describe the elderly woman, but the subject of the sentence is \'the gate\' — gates cannot leave soup. This is a dangling/misplaced modifier."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Reparations could take many forms; but direct payment is the most discussed.",
      "Reparations could take many forms; however, direct payment is the most discussed.",
      "Reparations could take many forms; and debt cancellation is one of them.",
      "Reparations; could take many forms including debt cancellation and investment.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is a correct construction. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "The objections raised by critics of reparations has been addressed by proponents.",
      "The objections raised by critics of reparations have been addressed by proponents.",
      "The objections raised by critics of reparations is addressed by proponents.",
      "The objections raised by critics of reparations was addressed by proponents.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'objections,\' which is plural. The correct verb is \'have been addressed.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is critical that Britain acknowledges its historical responsibility for slavery.",
      "It is critical that Britain acknowledge its historical responsibility for slavery.",
      "It is critical that Britain acknowledged its historical responsibility for slavery.",
      "It is critical that Britain will acknowledge its historical responsibility for slavery.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is critical that,\' the subjunctive requires the base form of the verb — \'acknowledge,\' not \'acknowledges,\' \'acknowledged,\' or \'will acknowledge.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "Alternatives to direct payment include three options: debt cancellation, infrastructure investment, and formal acknowledgement.",
      "Alternatives to direct payment include: three options debt cancellation, infrastructure investment, and formal acknowledgement.",
      "Alternatives to direct payment include three options debt cancellation: infrastructure investment, and formal acknowledgement.",
      "Alternatives: to direct payment include three options debt cancellation, infrastructure investment, and formal acknowledgement.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list. \'Alternatives to direct payment include three options\' is complete, and the colon correctly introduces the three options."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Caribbean nations deserve formal reparatory justice from Britain?",
    options: [
      "Jamaica was an important British colony for many years.",
      "The debate about reparations has been ongoing for a long time.",
      "The historical record — documenting the financial scale of enslaved labour, the compensation paid to enslavers at Emancipation, and the structural disadvantages that persist today — establishes a compelling case for reparatory justice that Britain cannot credibly continue to ignore.",
      "Many people in the Caribbean feel strongly about the issue of reparations.",
    ],
    correctAnswer: 2,
    explanation: "Option C integrates specific historical evidence (\'compensation paid to enslavers,\' \'structural disadvantages\'), uses formal vocabulary, and ends with a direct, confident claim — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'After the hurricane, people helped each other which was nice.\' What is the MOST EFFECTIVE revision?",
    options: [
      "After the hurricane, people helped each other, and this was really nice and unexpected.",
      "People helped each other after the hurricane which Nadia thought was nice.",
      "In the aftermath of the hurricane, neighbours and strangers alike moved through the damage with purposeful gentleness, stripping away ordinary social noise to reveal a deeper, more reliable human capacity for care.",
      "After the hurricane ended, people came to help each other and it was a nice thing to see.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'purposeful gentleness,\' \'ordinary social noise\'), echoes the passage\'s language (\'deeper, more reliable human capacity\'), and transforms a flat observation into a resonant insight."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The reparations debate is complicated.\'",
    options: [
      "The reparations debate is very complicated and involves many different things.",
      "Reparations are a complicated topic that people disagree about.",
      "The reparations debate is complicated precisely because its historical foundations are well documented — leaving opponents not to dispute the facts, but to argue about the political feasibility and moral responsibility of addressing them.",
      "It is complicated to decide what to do about reparations.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific about what makes it complicated (\'historical foundations are well documented\'), identifies the actual locus of disagreement (\'political feasibility and moral responsibility\'), and transforms a vague claim into a precise analytical statement."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'The post-hurricane community response transformed Nadia\'s understanding of her neighbourhood. Strangers arrived with food, tools, and time without being asked. This kind of purposeful generosity revealed something older and more reliable than ordinary daily courtesy. Port Royal is one of Jamaica\'s most historically significant coastal settlements. Nadia helped where she could and watched the community work.\'",
    options: [
      "Strangers arrived with food, tools, and time without being asked.",
      "This kind of purposeful generosity revealed something older and more reliable than ordinary daily courtesy.",
      "Port Royal is one of Jamaica\'s most historically significant coastal settlements.",
      "Nadia helped where she could and watched the community work.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Nadia\'s experience of the post-hurricane community response. The sentence about Port Royal is historically accurate but completely irrelevant to this focus."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in the reparations debate?",
    options: [
      "Critics say reparations are unjust but they have not looked at the evidence carefully.",
      "Some people oppose reparations, but they are wrong about the history.",
      "While it is true that holding present-day individuals personally responsible for their ancestors\' actions raises genuine questions of fairness, the proposed alternatives — debt cancellation, infrastructure investment, and formal acknowledgement — do not require this, targeting structural legacy rather than individual guilt.",
      "Critics of reparations have not thought seriously about the issue.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the fairness concern honestly (\'raises genuine questions\'), then demonstrates that the proposed alternatives sidestep this concern entirely (\'do not require this\') — a precise and effective concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Nadia noticed that after the storm people were very kind.\' What is the MOST PRECISE revision?",
    options: [
      "Nadia noticed that after the storm, many people were very kind and helpful to others.",
      "After the storm, Nadia saw that people were much kinder than they usually were.",
      "In the storm\'s aftermath, Nadia observed something she had not anticipated: that crisis, far from dividing people, had stripped away ordinary social performance and left behind a purposeful, gentler way of being together.",
      "Nadia noticed how kind people were after the storm had passed.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'social performance,\' \'purposeful\'), echoes the passage\'s insight about crisis revealing something \'older and more reliable,\' and frames the observation analytically."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about community resilience after a natural disaster?",
    options: [
      "Natural disasters are very serious and can cause a lot of damage.",
      "Communities should prepare themselves for natural disasters before they occur.",
      "What the storm leaves behind is not only damage — it leaves behind evidence of what communities are capable of when the ordinary noise of daily life is stripped away and only the essential things remain.",
      "After a natural disaster, people often help each other to recover.",
    ],
    correctAnswer: 2,
    explanation: "Option C echoes the passage\'s language (\'the ordinary noise of daily life stripped away\'), offers a philosophical reframing of \'what the storm leaves,\' and ends with a resonant, open-ended insight — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines what makes an ARGUMENT ETHICALLY STRONG as well as logically valid?",
    options: [
      "An ethically strong argument is one that most people agree with.",
      "An ethically strong argument relies only on emotional appeals to create agreement.",
      "An ethically strong argument is logically valid, based on honest evidence, fair to opposing views, and transparent about its own limitations — so the reader can assess it freely.",
      "An ethically strong argument is one that never concedes any ground to the opposing side.",
    ],
    correctAnswer: 2,
    explanation: "An ethically strong argument combines logical validity with intellectual honesty — using real evidence, engaging fairly with opposing views, and acknowledging uncertainty. Option C correctly identifies these qualities."
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

export default function LiteracyDifficult10Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult10Questions : literacyDifficult10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 10</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 10</h1>
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
