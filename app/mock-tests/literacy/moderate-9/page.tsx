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

const literacyModerate9Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Climate Change and the Caribbean

The Caribbean is one of the world's most climate-vulnerable regions. Small island nations like Jamaica face particular challenges from rising sea levels, more intense hurricanes, prolonged droughts, and coral reef degradation — all consequences of a warming planet. While Caribbean countries contribute very little to global carbon emissions, they bear a disproportionate share of the consequences of climate change caused largely by wealthier, more industrialised nations.

Rising sea levels pose one of the greatest threats. As polar ice melts and ocean water expands with heat, coastlines are steadily being eroded. In Jamaica, low-lying coastal communities, airports, and agricultural land are at risk. Some scientists predict that without significant intervention, parts of Kingston's coastline could be underwater within this century.

The tourism industry — one of Jamaica's most important economic sectors — is also under threat. Damaged coral reefs reduce the appeal of dive sites. Stronger hurricanes threaten resort infrastructure. Unpredictable rainfall patterns affect water availability for hotels and agricultural operations that supply the tourism sector.

Despite these challenges, Jamaica and other Caribbean nations are taking steps to adapt. Renewable energy projects, coastal protection programmes, and climate-smart agricultural practices are being introduced. Leaders from the region regularly call on wealthier nations to take more ambitious action on emissions reductions and to provide greater financial support for Caribbean adaptation efforts. The message from the Caribbean is clear: climate justice is not just an environmental issue — it is a matter of survival.`,
    question: "What is the MAIN ARGUMENT of the climate change passage?",
    options: [
      "Jamaica should stop using fossil fuels immediately.",
      "The Caribbean is highly vulnerable to climate change despite contributing little to its cause, and urgent global action is needed.",
      "Tourism is the only industry threatened by climate change in Jamaica.",
      "Caribbean countries should build sea walls to protect their coastlines.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers the Caribbean\'s vulnerability, specific threats to Jamaica, and calls for global action. Option B captures all of this."
  },
  {
    id: 2,
    type: "reading",
    passage: `Climate Change and the Caribbean

The Caribbean is one of the world's most climate-vulnerable regions. Small island nations like Jamaica face particular challenges from rising sea levels, more intense hurricanes, prolonged droughts, and coral reef degradation — all consequences of a warming planet. While Caribbean countries contribute very little to global carbon emissions, they bear a disproportionate share of the consequences of climate change caused largely by wealthier, more industrialised nations.

Rising sea levels pose one of the greatest threats. As polar ice melts and ocean water expands with heat, coastlines are steadily being eroded. In Jamaica, low-lying coastal communities, airports, and agricultural land are at risk. Some scientists predict that without significant intervention, parts of Kingston's coastline could be underwater within this century.

The tourism industry — one of Jamaica's most important economic sectors — is also under threat. Damaged coral reefs reduce the appeal of dive sites. Stronger hurricanes threaten resort infrastructure. Unpredictable rainfall patterns affect water availability for hotels and agricultural operations that supply the tourism sector.

Despite these challenges, Jamaica and other Caribbean nations are taking steps to adapt. Renewable energy projects, coastal protection programmes, and climate-smart agricultural practices are being introduced. Leaders from the region regularly call on wealthier nations to take more ambitious action on emissions reductions and to provide greater financial support for Caribbean adaptation efforts. The message from the Caribbean is clear: climate justice is not just an environmental issue — it is a matter of survival.`,
    question: "What does \'disproportionate\' mean in the phrase \'bear a disproportionate share of the consequences\'?",
    options: [
      "An equal and fair share",
      "A share that is larger than what is reasonable given their contribution",
      "A share that is smaller than expected",
      "A share that is planned and agreed upon",
    ],
    correctAnswer: 1,
    explanation: "Disproportionate means not in proportion — the Caribbean\'s share of consequences is far larger than its contribution to the cause."
  },
  {
    id: 3,
    type: "reading",
    passage: `Climate Change and the Caribbean

The Caribbean is one of the world's most climate-vulnerable regions. Small island nations like Jamaica face particular challenges from rising sea levels, more intense hurricanes, prolonged droughts, and coral reef degradation — all consequences of a warming planet. While Caribbean countries contribute very little to global carbon emissions, they bear a disproportionate share of the consequences of climate change caused largely by wealthier, more industrialised nations.

Rising sea levels pose one of the greatest threats. As polar ice melts and ocean water expands with heat, coastlines are steadily being eroded. In Jamaica, low-lying coastal communities, airports, and agricultural land are at risk. Some scientists predict that without significant intervention, parts of Kingston's coastline could be underwater within this century.

The tourism industry — one of Jamaica's most important economic sectors — is also under threat. Damaged coral reefs reduce the appeal of dive sites. Stronger hurricanes threaten resort infrastructure. Unpredictable rainfall patterns affect water availability for hotels and agricultural operations that supply the tourism sector.

Despite these challenges, Jamaica and other Caribbean nations are taking steps to adapt. Renewable energy projects, coastal protection programmes, and climate-smart agricultural practices are being introduced. Leaders from the region regularly call on wealthier nations to take more ambitious action on emissions reductions and to provide greater financial support for Caribbean adaptation efforts. The message from the Caribbean is clear: climate justice is not just an environmental issue — it is a matter of survival.`,
    question: "What specific threat does RISING SEA LEVELS pose to Jamaica?",
    options: [
      "It makes hurricanes stronger and more frequent.",
      "It damages coral reefs by warming the water.",
      "It threatens low-lying coastal communities, airports, and agricultural land.",
      "It reduces rainfall and causes prolonged droughts.",
    ],
    correctAnswer: 2,
    explanation: "The passage specifically lists low-lying coastal communities, airports, and agricultural land as things at risk from rising sea levels."
  },
  {
    id: 4,
    type: "reading",
    passage: `Climate Change and the Caribbean

The Caribbean is one of the world's most climate-vulnerable regions. Small island nations like Jamaica face particular challenges from rising sea levels, more intense hurricanes, prolonged droughts, and coral reef degradation — all consequences of a warming planet. While Caribbean countries contribute very little to global carbon emissions, they bear a disproportionate share of the consequences of climate change caused largely by wealthier, more industrialised nations.

Rising sea levels pose one of the greatest threats. As polar ice melts and ocean water expands with heat, coastlines are steadily being eroded. In Jamaica, low-lying coastal communities, airports, and agricultural land are at risk. Some scientists predict that without significant intervention, parts of Kingston's coastline could be underwater within this century.

The tourism industry — one of Jamaica's most important economic sectors — is also under threat. Damaged coral reefs reduce the appeal of dive sites. Stronger hurricanes threaten resort infrastructure. Unpredictable rainfall patterns affect water availability for hotels and agricultural operations that supply the tourism sector.

Despite these challenges, Jamaica and other Caribbean nations are taking steps to adapt. Renewable energy projects, coastal protection programmes, and climate-smart agricultural practices are being introduced. Leaders from the region regularly call on wealthier nations to take more ambitious action on emissions reductions and to provide greater financial support for Caribbean adaptation efforts. The message from the Caribbean is clear: climate justice is not just an environmental issue — it is a matter of survival.`,
    question: "What can be INFERRED about Jamaica\'s relationship to global climate change?",
    options: [
      "Jamaica is one of the main causes of global warming.",
      "Jamaica is unwilling to take action on climate change.",
      "Jamaica suffers serious consequences from a problem it has done very little to create.",
      "Jamaica does not need help from other countries to deal with climate change.",
    ],
    correctAnswer: 2,
    explanation: "The passage states Caribbean countries \'contribute very little to global carbon emissions\' but \'bear a disproportionate share of the consequences.\'"
  },
  {
    id: 5,
    type: "reading",
    passage: `Climate Change and the Caribbean

The Caribbean is one of the world's most climate-vulnerable regions. Small island nations like Jamaica face particular challenges from rising sea levels, more intense hurricanes, prolonged droughts, and coral reef degradation — all consequences of a warming planet. While Caribbean countries contribute very little to global carbon emissions, they bear a disproportionate share of the consequences of climate change caused largely by wealthier, more industrialised nations.

Rising sea levels pose one of the greatest threats. As polar ice melts and ocean water expands with heat, coastlines are steadily being eroded. In Jamaica, low-lying coastal communities, airports, and agricultural land are at risk. Some scientists predict that without significant intervention, parts of Kingston's coastline could be underwater within this century.

The tourism industry — one of Jamaica's most important economic sectors — is also under threat. Damaged coral reefs reduce the appeal of dive sites. Stronger hurricanes threaten resort infrastructure. Unpredictable rainfall patterns affect water availability for hotels and agricultural operations that supply the tourism sector.

Despite these challenges, Jamaica and other Caribbean nations are taking steps to adapt. Renewable energy projects, coastal protection programmes, and climate-smart agricultural practices are being introduced. Leaders from the region regularly call on wealthier nations to take more ambitious action on emissions reductions and to provide greater financial support for Caribbean adaptation efforts. The message from the Caribbean is clear: climate justice is not just an environmental issue — it is a matter of survival.`,
    question: "What is the AUTHOR\'S PURPOSE in writing this passage?",
    options: [
      "To entertain readers with stories about Caribbean weather",
      "To inform readers about Caribbean climate vulnerability and to argue for climate justice",
      "To persuade readers to boycott tourism in Jamaica",
      "To explain the science of global warming in simple terms",
    ],
    correctAnswer: 1,
    explanation: "The passage both informs about threats and advocates for climate justice — the purpose is informative and persuasive."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Return

Auntie Cora had been away in England for twenty-two years. When her taxi turned into the road, Kimi pressed her face against the window and tried to see what twenty-two years of absence might look like on a person.

She had seen photographs. But photographs show you a frozen moment — not the way someone moves through a door, not the weight of how they sit down, not the sound of their voice filling a room that had held only silence on that subject for years.

The taxi door opened. Auntie Cora stepped out slowly, steadying herself on the gate. She was smaller than Kimi had expected. She looked at the yard — at the mango tree, the porch, the galvanised roof that caught the afternoon light — and something shifted in her face. Not sadness exactly. Something older and quieter.

"The mango tree is still here," Auntie Cora said, to no one in particular.

Kimi's grandmother stepped off the porch and crossed the yard without hurrying. When the two women held each other, Kimi looked away. Some things are not meant to be witnessed — they are meant to be quietly honoured.`,
    question: "What does the phrase \'a frozen moment\' suggest about photographs?",
    options: [
      "Photographs make people look cold and unfriendly.",
      "Photographs only capture a single still instant and cannot convey a living person\'s full presence.",
      "The photograph of Auntie Cora was taken in winter.",
      "Photographs fade over time and become unclear.",
    ],
    correctAnswer: 1,
    explanation: "A frozen moment refers to the single instant a photograph captures — it cannot show movement, voice, or the living quality of a real person."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Return

Auntie Cora had been away in England for twenty-two years. When her taxi turned into the road, Kimi pressed her face against the window and tried to see what twenty-two years of absence might look like on a person.

She had seen photographs. But photographs show you a frozen moment — not the way someone moves through a door, not the weight of how they sit down, not the sound of their voice filling a room that had held only silence on that subject for years.

The taxi door opened. Auntie Cora stepped out slowly, steadying herself on the gate. She was smaller than Kimi had expected. She looked at the yard — at the mango tree, the porch, the galvanised roof that caught the afternoon light — and something shifted in her face. Not sadness exactly. Something older and quieter.

"The mango tree is still here," Auntie Cora said, to no one in particular.

Kimi's grandmother stepped off the porch and crossed the yard without hurrying. When the two women held each other, Kimi looked away. Some things are not meant to be witnessed — they are meant to be quietly honoured.`,
    question: "What does Auntie Cora\'s reaction to the mango tree reveal about her?",
    options: [
      "She is surprised the tree is still alive.",
      "She wishes the yard had changed more.",
      "The familiar sight of the tree stirs deep feelings about home and the time she has been away.",
      "She is disappointed by how small the yard looks.",
    ],
    correctAnswer: 2,
    explanation: "Auntie Cora says \'The mango tree is still here\' with a shift in her expression described as \'something older and quieter\' — the tree connects her to deep emotional memories."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Return

Auntie Cora had been away in England for twenty-two years. When her taxi turned into the road, Kimi pressed her face against the window and tried to see what twenty-two years of absence might look like on a person.

She had seen photographs. But photographs show you a frozen moment — not the way someone moves through a door, not the weight of how they sit down, not the sound of their voice filling a room that had held only silence on that subject for years.

The taxi door opened. Auntie Cora stepped out slowly, steadying herself on the gate. She was smaller than Kimi had expected. She looked at the yard — at the mango tree, the porch, the galvanised roof that caught the afternoon light — and something shifted in her face. Not sadness exactly. Something older and quieter.

"The mango tree is still here," Auntie Cora said, to no one in particular.

Kimi's grandmother stepped off the porch and crossed the yard without hurrying. When the two women held each other, Kimi looked away. Some things are not meant to be witnessed — they are meant to be quietly honoured.`,
    question: "What does \'something shifted in her face\' MOST LIKELY mean?",
    options: [
      "Auntie Cora was physically unwell from the journey.",
      "An emotion too complex to name briefly passed across her face.",
      "Auntie Cora was pretending not to recognise the house.",
      "The afternoon light made it hard to see her expression.",
    ],
    correctAnswer: 1,
    explanation: "The passage describes the shift as \'not sadness exactly — something older and quieter\' — a complex, hard-to-name emotion crossed her face."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Return

Auntie Cora had been away in England for twenty-two years. When her taxi turned into the road, Kimi pressed her face against the window and tried to see what twenty-two years of absence might look like on a person.

She had seen photographs. But photographs show you a frozen moment — not the way someone moves through a door, not the weight of how they sit down, not the sound of their voice filling a room that had held only silence on that subject for years.

The taxi door opened. Auntie Cora stepped out slowly, steadying herself on the gate. She was smaller than Kimi had expected. She looked at the yard — at the mango tree, the porch, the galvanised roof that caught the afternoon light — and something shifted in her face. Not sadness exactly. Something older and quieter.

"The mango tree is still here," Auntie Cora said, to no one in particular.

Kimi's grandmother stepped off the porch and crossed the yard without hurrying. When the two women held each other, Kimi looked away. Some things are not meant to be witnessed — they are meant to be quietly honoured.`,
    question: "Why does Kimi look away when the two women embrace?",
    options: [
      "She is bored and wants to go inside.",
      "She feels jealous of their relationship.",
      "She understands the moment is too private and meaningful to be observed.",
      "She is trying to give Auntie Cora space to settle in.",
    ],
    correctAnswer: 2,
    explanation: "The passage says \'Some things are not meant to be witnessed — they are meant to be quietly honoured.\' Kimi looks away out of deep respect for the moment."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Return

Auntie Cora had been away in England for twenty-two years. When her taxi turned into the road, Kimi pressed her face against the window and tried to see what twenty-two years of absence might look like on a person.

She had seen photographs. But photographs show you a frozen moment — not the way someone moves through a door, not the weight of how they sit down, not the sound of their voice filling a room that had held only silence on that subject for years.

The taxi door opened. Auntie Cora stepped out slowly, steadying herself on the gate. She was smaller than Kimi had expected. She looked at the yard — at the mango tree, the porch, the galvanised roof that caught the afternoon light — and something shifted in her face. Not sadness exactly. Something older and quieter.

"The mango tree is still here," Auntie Cora said, to no one in particular.

Kimi's grandmother stepped off the porch and crossed the yard without hurrying. When the two women held each other, Kimi looked away. Some things are not meant to be witnessed — they are meant to be quietly honoured.`,
    question: "Which word BEST describes the TONE of the passage about Auntie Cora\'s return?",
    options: [
      "Exciting and joyful",
      "Tense and dramatic",
      "Quiet, emotional, and reflective",
      "Sad and hopeless",
    ],
    correctAnswer: 2,
    explanation: "The passage is filled with restrained emotion — \'something older and quieter,\' looking away, honouring the moment. The tone is quiet and reflective."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The Caribbean is one of the most climate-VULNERABLE regions.\" The word \'vulnerable\' means —",
    options: [
      "powerful and well protected",
      "at risk of being harmed or damaged",
      "far from other countries",
      "rich in natural resources",
    ],
    correctAnswer: 1,
    explanation: "Vulnerable means exposed to risk or easily harmed. A vulnerable region is one that can be damaged by certain conditions."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Caribbean countries bear a DISPROPORTIONATE share of climate consequences.\" The word \'disproportionate\' means —",
    options: [
      "fair and equally distributed",
      "randomly distributed",
      "larger or smaller than what is proportional or reasonable",
      "carefully measured",
    ],
    correctAnswer: 2,
    explanation: "Disproportionate means not in proportion — the consequences are far larger than the Caribbean\'s share of responsibility."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Climate-smart AGRICULTURAL practices are being introduced.\" The word \'agricultural\' relates to —",
    options: [
      "the tourism industry",
      "fishing and maritime activities",
      "farming and the growing of crops",
      "city planning and construction",
    ],
    correctAnswer: 2,
    explanation: "Agricultural relates to agriculture — the practice of farming, growing crops, and raising livestock."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Photographs show you a FROZEN MOMENT.\" This is an example of —",
    options: [
      "a simile",
      "personification",
      "a metaphor",
      "alliteration",
    ],
    correctAnswer: 2,
    explanation: "A metaphor makes a direct comparison without \'like\' or \'as.\' Calling a photograph a \'frozen moment\' is a metaphor — moments cannot literally freeze."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Some things are not meant to be WITNESSED — they are meant to be quietly honoured.\" The word \'witnessed\' means —",
    options: [
      "recorded on film or video",
      "seen or observed directly",
      "written about in a journal",
      "shared with others",
    ],
    correctAnswer: 1,
    explanation: "To witness something means to see or observe it directly. Kimi understands the reunion is too private to observe."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Leaders call on wealthier nations to take more AMBITIOUS action.\" The word \'ambitious\' means —",
    options: [
      "slow and cautious",
      "ordinary and expected",
      "bold and requiring great effort",
      "fair and balanced",
    ],
    correctAnswer: 2,
    explanation: "Ambitious means requiring significant effort and boldness — going beyond what is easy or ordinary."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"She STEADIED herself on the gate.\" The word \'steadied\' means —",
    options: [
      "pushed the gate open",
      "waved to the family",
      "balanced or supported herself",
      "locked and secured the gate",
    ],
    correctAnswer: 2,
    explanation: "To steady oneself means to balance or support yourself to avoid falling — Auntie Cora used the gate to regain her balance."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The galvanised roof caught the afternoon light.\" \'Galvanised\' most likely means —",
    options: [
      "made of clay tiles",
      "painted in bright colours",
      "coated with zinc for protection — a type of metal roofing",
      "made from old pieces of wood",
    ],
    correctAnswer: 2,
    explanation: "Galvanised metal is steel or iron coated with zinc to prevent rust — a very common type of roofing in Jamaica."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Greater financial support for Caribbean ADAPTATION efforts.\" The word \'adaptation\' means —",
    options: [
      "the process of causing climate change",
      "actions taken to adjust to the effects of climate change",
      "the building of new industries",
      "the process of reducing carbon emissions",
    ],
    correctAnswer: 1,
    explanation: "Adaptation refers to adjustments made to cope with new conditions — in this context, dealing with the effects of climate change."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Some things are meant to be quietly HONOURED.\" The word \'honoured\' means —",
    options: [
      "loudly celebrated",
      "forgotten and moved past",
      "given proper respect and reverence",
      "discussed and analysed",
    ],
    correctAnswer: 2,
    explanation: "To honour something means to show it proper respect and reverence — Kimi honours the moment by quietly looking away."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The consequences of climate change in the Caribbean is severe.",
      "The consequences of climate change in the Caribbean are severe.",
      "The consequences of climate change in the Caribbean was severe.",
      "The consequences of climate change in the Caribbean were being severe.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'consequences,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PRESENT PERFECT correctly?",
    options: [
      "Caribbean nations called on wealthier countries to act for years.",
      "Caribbean nations are calling on wealthier countries to act.",
      "Caribbean nations have called on wealthier countries to act.",
      "Caribbean nations had called on wealthier countries to act.",
    ],
    correctAnswer: 2,
    explanation: "The present perfect (\'have\' + past participle) describes an action that started in the past and is still relevant. \'Have called\' correctly describes ongoing advocacy."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although Caribbean countries emit very little carbon, they suffer the most severe consequences.\'",
    options: [
      "they suffer the most severe consequences",
      "Although Caribbean countries emit very little carbon",
      "emit very little carbon",
      "suffer the most severe consequences",
    ],
    correctAnswer: 1,
    explanation: "A subordinate clause cannot stand alone. \'Although Caribbean countries emit very little carbon\' depends on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Auntie Cora, who had been away for twenty-two years stepped slowly out of the taxi.",
      "Auntie Cora who had been away for twenty-two years, stepped slowly out of the taxi.",
      "Auntie Cora, who had been away for twenty-two years, stepped slowly out of the taxi.",
      "Auntie Cora who had been away for twenty-two years stepped slowly out of the taxi.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'who had been away for twenty-two years\' must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Jamaica\'s leaders regularly call on wealthier nations to act.",
      "The tourism industry is threatened by stronger hurricanes.",
      "Climate change affects small island nations most severely.",
      "Scientists have predicted rising sea levels along Jamaica\'s coast.",
    ],
    correctAnswer: 1,
    explanation: "In the passive voice, the subject receives the action. \'The tourism industry\' receives the action \'is threatened.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the word that correctly completes: \'Neither the hotels nor the agricultural sector ___ immune to the effects of climate change.\'",
    options: [
      "are",
      "were",
      "is",
      "have been",
    ],
    correctAnswer: 2,
    explanation: "With \'neither...nor,\' the verb agrees with the closest subject. \'The agricultural sector\' is singular, so \'is\' is correct."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Climate change threatens Jamaica\'s coastlines, its reefs, and causing damage to its tourism.",
      "Climate change threatens Jamaica\'s coastlines, its reefs, and its tourism industry.",
      "Climate change threatens Jamaica\'s coastlines, the reefs, and damage to tourism.",
      "Climate change threatens coastlines, the reefs are threatened, and so is tourism.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a list to use the same grammatical form. Option B uses three noun phrases consistently."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the ERROR: \'Auntie Cora and the grandmother embraced for a long time, and Kimi look away.\'",
    options: [
      "and should be but",
      "Kimi should be She",
      "look should be looked",
      "away should be aside",
    ],
    correctAnswer: 2,
    explanation: "The sentence is in the past tense. \'Look\' should be \'looked\' to maintain tense consistency."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses a SEMICOLON correctly:",
    options: [
      "Caribbean nations emit very little carbon; but they suffer the most.",
      "Caribbean nations emit very little carbon; however, they suffer the most.",
      "Caribbean nations emit very little carbon; and they suffer the most.",
      "Caribbean nations emit; very little carbon they suffer the most.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by the conjunctive adverb \'however\' and a comma is a correct construction."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence maintains CONSISTENT tense?",
    options: [
      "Kimi pressed her face to the window and watches the taxi arrive.",
      "Kimi presses her face to the window and watched the taxi arrive.",
      "Kimi pressed her face to the window and watched the taxi arrive.",
      "Kimi had pressed her face to the window and watches the taxi arrive.",
    ],
    correctAnswer: 2,
    explanation: "Option C consistently uses the simple past: \'pressed\' and \'watched.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence uses DIRECT SPEECH correctly?",
    options: [
      "Auntie Cora said, \'The mango tree is still here.\'",
      "Auntie Cora said the mango tree is still here.",
      "Auntie Cora said, \"The mango tree is still here.\"",
      "Auntie Cora said that, \'The mango tree is still here.\'",
    ],
    correctAnswer: 2,
    explanation: "Direct speech uses quotation marks around the exact words and a comma before the opening quotation mark. Option C is correct."
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses REPORTED SPEECH correctly?",
    options: [
      "The passage stated that climate justice is a matter of survival.",
      "The passage stated that climate justice was a matter of survival.",
      "The passage states that climate justice was a matter of survival.",
      "The passage had stated that climate justice is a matter of survival.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, present tense shifts back to past. \'Is\' becomes \'was.\' Option B is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that wealthier nations must help Caribbean countries adapt to climate change?",
    options: [
      "Caribbean countries are very small and have beautiful beaches.",
      "Climate change is caused by carbon emissions from many countries.",
      "It is a matter of basic justice that the nations most responsible for climate change provide meaningful support to those suffering its greatest consequences.",
      "Jamaica is working hard to adapt to the effects of climate change.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear moral argument — framing climate support as a matter of justice — ideal as a topic sentence for a persuasive paragraph."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'Caribbean nations are vulnerable to climate change. Rising sea levels threaten coastlines and airports. Hurricanes are becoming more intense. Usain Bolt is one of Jamaica\'s most celebrated athletes. Coral reefs are being destroyed by warming oceans.\'",
    options: [
      "Rising sea levels threaten coastlines and airports.",
      "Hurricanes are becoming more intense.",
      "Usain Bolt is one of Jamaica\'s most celebrated athletes.",
      "Coral reefs are being destroyed by warming oceans.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Caribbean climate vulnerability. The sentence about Usain Bolt is completely off-topic."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Climate change is bad for Jamaica.\'",
    options: [
      "Climate change is very bad for Jamaica in many ways.",
      "Climate change is really bad and Jamaica is affected by it a lot.",
      "From rising sea levels that threaten coastal communities to intensifying hurricanes that damage infrastructure, climate change poses an existential threat to Jamaica\'s future.",
      "Jamaica suffers from climate change very much.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific examples, precise vocabulary (\'existential threat\'), and a strong structure — a major upgrade from the vague original."
  },
  {
    id: 36,
    type: "writing",
    question: "A student wrote: \'Kimi looked at her auntie who had came all the way from England and she felt like she don\'t know her.\' Choose the MOST COMPLETE correction:",
    options: [
      "Kimi looked at her aunt, who had come all the way from England, and she felt as if she did not know her.",
      "Kimi looked at her auntie, who had came all the way from England, and she felt as if she didn\'t know her.",
      "Kimi looked at her aunt, who had come all the way from England, and she felt like she doesn\'t know her.",
      "Kimi looked at her auntie who had come all the way from England and she felt as if she did not know her.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects all errors: \'had came\' to \'had come,\' adds commas around the relative clause, and \'don\'t know\' to \'did not know\' (past tense, formal)."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence uses the MOST PRECISE language for a report about climate change?",
    options: [
      "The sea is getting higher and that\'s a big problem for Jamaica.",
      "Sea levels are rising due to climate change and this is not good.",
      "Rising sea levels, driven by melting polar ice and the thermal expansion of ocean water, pose a significant threat to Jamaica\'s low-lying coastal communities.",
      "The water is getting higher because the ice is melting and Jamaica could flood.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise scientific vocabulary — \'melting polar ice,\' \'thermal expansion,\' \'low-lying coastal communities\' — appropriate for a formal report."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about Auntie Cora\'s return?",
    options: [
      "Auntie Cora had been away for twenty-two years.",
      "The mango tree was still standing in the yard.",
      "In that quiet yard, with the mango tree as witness, twenty-two years of absence dissolved into a single, wordless embrace.",
      "Kimi was happy to see her aunt again.",
    ],
    correctAnswer: 2,
    explanation: "Option C is evocative and powerful — the mango tree as witness, the dissolving of years — it brings the passage to a beautiful, resonant close."
  },
  {
    id: 39,
    type: "writing",
    question: "A student is writing a persuasive essay about climate change. Which sentence BEST introduces a counterargument before refuting it?",
    options: [
      "Some people believe climate change is not a problem at all.",
      "Climate change is a serious issue that affects everyone.",
      "While some argue that individual lifestyle changes are sufficient to address climate change, the evidence suggests that systemic policy reform at the national and international level is essential.",
      "Many countries are working to reduce their carbon emissions.",
    ],
    correctAnswer: 2,
    explanation: "Option C introduces a counterargument (\'while some argue...\') and immediately begins to counter it — the hallmark of effective persuasive writing."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines the purpose of a THESIS STATEMENT in an essay?",
    options: [
      "To list all the evidence that will be used in the essay",
      "To introduce the topic in a general, broad way",
      "To state the main argument or position of the essay clearly and specifically",
      "To summarise what other writers have said about the topic",
    ],
    correctAnswer: 2,
    explanation: "A thesis statement presents the writer\'s main argument or position clearly and specifically — it is the central claim that the rest of the essay supports."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate9MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate9Questions : literacyModerate9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 9</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Moderate Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question moderate-level literacy test with reports and explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Moderate-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- More inference, main idea, and author&apos;s purpose</li>
                    <li>- Word meaning in context and stronger vocabulary choices</li>
                    <li>- Editing, grammar, punctuation, and sentence revision</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 9</p>
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
                    This moderate-level literacy report includes section summaries and a full question-by-question review with explanations.
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 9 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 9</h1>
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
