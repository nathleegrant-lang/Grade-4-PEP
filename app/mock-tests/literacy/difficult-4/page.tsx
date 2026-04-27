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

const literacyDifficult4Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The River Keeper

Everyone in Bartons called her Miss Iris, though no one could say with certainty how long she had been there. She lived in a wooden house at the bend of the river, and her habit — morning and evening — was to walk the bank and remove whatever did not belong: plastic bottles, old tins, rope, the occasional car tyre.

She did not own the river. The river did not belong to anyone, which was perhaps why no one else felt responsible for it. But Miss Iris had long since decided that the absence of ownership was not the same as the absence of obligation. The river had given her family water, fish, and a sense of place for three generations. She owed it something in return.

Children from the village sometimes followed her on the morning walk. She never asked them to come, and she never sent them away. She simply walked, and the ones who were curious fell into step beside her.

A girl named Cleo had walked with her every Saturday for two months. One morning, Cleo asked why she bothered.

"Because someone must," Miss Iris said, without slowing down.

"But you can't clean the whole river," Cleo said.

"No," Miss Iris agreed. "But I can clean this part. And this part is where I live."

Cleo thought about that for a long time. The next Saturday, she arrived early, with her own bag.`,
    question: "What does the phrase \'the absence of ownership was not the same as the absence of obligation\' MEAN?",
    options: [
      "Miss Iris believed she owned the river and was responsible for it.",
      "Just because no one owns something does not mean no one has a duty to care for it.",
      "Miss Iris thought the government should take ownership of the river.",
      "Obligation is the same thing as ownership in legal terms.",
    ],
    correctAnswer: 1,
    explanation: "Miss Iris draws a distinction: the river has no owner, but that doesn\'t eliminate the moral responsibility to care for it. This is the central philosophical idea of the passage."
  },
  {
    id: 2,
    type: "reading",
    passage: `The River Keeper

Everyone in Bartons called her Miss Iris, though no one could say with certainty how long she had been there. She lived in a wooden house at the bend of the river, and her habit — morning and evening — was to walk the bank and remove whatever did not belong: plastic bottles, old tins, rope, the occasional car tyre.

She did not own the river. The river did not belong to anyone, which was perhaps why no one else felt responsible for it. But Miss Iris had long since decided that the absence of ownership was not the same as the absence of obligation. The river had given her family water, fish, and a sense of place for three generations. She owed it something in return.

Children from the village sometimes followed her on the morning walk. She never asked them to come, and she never sent them away. She simply walked, and the ones who were curious fell into step beside her.

A girl named Cleo had walked with her every Saturday for two months. One morning, Cleo asked why she bothered.

"Because someone must," Miss Iris said, without slowing down.

"But you can't clean the whole river," Cleo said.

"No," Miss Iris agreed. "But I can clean this part. And this part is where I live."

Cleo thought about that for a long time. The next Saturday, she arrived early, with her own bag.`,
    question: "What is the SIGNIFICANCE of Cleo arriving early with her own bag on the final Saturday?",
    options: [
      "She wants to show Miss Iris that she is stronger and faster.",
      "She has understood Miss Iris\'s lesson and has taken personal responsibility — showing that the example has been passed on.",
      "She is trying to collect the rubbish to sell it.",
      "She is arriving early to finish before the other children arrive.",
    ],
    correctAnswer: 1,
    explanation: "Cleo\'s action — arriving early, bringing her own bag — shows she has internalised Miss Iris\'s philosophy: care for the part where you live. The lesson has been passed on without being explicitly taught."
  },
  {
    id: 3,
    type: "reading",
    passage: `The River Keeper

Everyone in Bartons called her Miss Iris, though no one could say with certainty how long she had been there. She lived in a wooden house at the bend of the river, and her habit — morning and evening — was to walk the bank and remove whatever did not belong: plastic bottles, old tins, rope, the occasional car tyre.

She did not own the river. The river did not belong to anyone, which was perhaps why no one else felt responsible for it. But Miss Iris had long since decided that the absence of ownership was not the same as the absence of obligation. The river had given her family water, fish, and a sense of place for three generations. She owed it something in return.

Children from the village sometimes followed her on the morning walk. She never asked them to come, and she never sent them away. She simply walked, and the ones who were curious fell into step beside her.

A girl named Cleo had walked with her every Saturday for two months. One morning, Cleo asked why she bothered.

"Because someone must," Miss Iris said, without slowing down.

"But you can't clean the whole river," Cleo said.

"No," Miss Iris agreed. "But I can clean this part. And this part is where I live."

Cleo thought about that for a long time. The next Saturday, she arrived early, with her own bag.`,
    question: "Miss Iris says \'I can clean this part. And this part is where I live.\' What does this reveal about her philosophy?",
    options: [
      "She believes small, local action within one\'s own sphere of responsibility is meaningful and sufficient.",
      "She has given up on trying to solve larger problems.",
      "She thinks other people should clean the rest of the river.",
      "She is only interested in the part of the river visible from her house.",
    ],
    correctAnswer: 0,
    explanation: "Miss Iris does not claim to solve everything — she claims responsibility for what is immediately hers. This is a philosophy of focused, personal stewardship rather than overwhelming ambition."
  },
  {
    id: 4,
    type: "reading",
    passage: `The River Keeper

Everyone in Bartons called her Miss Iris, though no one could say with certainty how long she had been there. She lived in a wooden house at the bend of the river, and her habit — morning and evening — was to walk the bank and remove whatever did not belong: plastic bottles, old tins, rope, the occasional car tyre.

She did not own the river. The river did not belong to anyone, which was perhaps why no one else felt responsible for it. But Miss Iris had long since decided that the absence of ownership was not the same as the absence of obligation. The river had given her family water, fish, and a sense of place for three generations. She owed it something in return.

Children from the village sometimes followed her on the morning walk. She never asked them to come, and she never sent them away. She simply walked, and the ones who were curious fell into step beside her.

A girl named Cleo had walked with her every Saturday for two months. One morning, Cleo asked why she bothered.

"Because someone must," Miss Iris said, without slowing down.

"But you can't clean the whole river," Cleo said.

"No," Miss Iris agreed. "But I can clean this part. And this part is where I live."

Cleo thought about that for a long time. The next Saturday, she arrived early, with her own bag.`,
    question: "What is the TONE of the passage about Miss Iris?",
    options: [
      "Humorous and satirical",
      "Urgent and alarmed",
      "Quiet, respectful, and quietly inspiring",
      "Bitter and resentful",
    ],
    correctAnswer: 2,
    explanation: "The language is gentle and measured — Miss Iris acts without drama, teaches without lecturing, and Cleo learns without being told. The tone is quiet, respectful, and subtly hopeful."
  },
  {
    id: 5,
    type: "reading",
    passage: `The River Keeper

Everyone in Bartons called her Miss Iris, though no one could say with certainty how long she had been there. She lived in a wooden house at the bend of the river, and her habit — morning and evening — was to walk the bank and remove whatever did not belong: plastic bottles, old tins, rope, the occasional car tyre.

She did not own the river. The river did not belong to anyone, which was perhaps why no one else felt responsible for it. But Miss Iris had long since decided that the absence of ownership was not the same as the absence of obligation. The river had given her family water, fish, and a sense of place for three generations. She owed it something in return.

Children from the village sometimes followed her on the morning walk. She never asked them to come, and she never sent them away. She simply walked, and the ones who were curious fell into step beside her.

A girl named Cleo had walked with her every Saturday for two months. One morning, Cleo asked why she bothered.

"Because someone must," Miss Iris said, without slowing down.

"But you can't clean the whole river," Cleo said.

"No," Miss Iris agreed. "But I can clean this part. And this part is where I live."

Cleo thought about that for a long time. The next Saturday, she arrived early, with her own bag.`,
    question: "What does the detail that Miss Iris \'never asked them to come, and never sent them away\' suggest about her teaching style?",
    options: [
      "She is too busy to notice whether children are following her.",
      "She is cold and indifferent to the children in the village.",
      "She leads by example, allowing curiosity and observation to be the teacher rather than instruction.",
      "She believes children should not be involved in environmental work.",
    ],
    correctAnswer: 2,
    explanation: "Miss Iris never explicitly teaches — she simply acts. Children who are \'curious fall into step.\' Her approach is to model behaviour and allow those who are ready to follow. This is teaching through example."
  },
  {
    id: 6,
    type: "reading",
    passage: `Single-Use Plastics: Jamaica's Ban and Its Effects

In 2018, Jamaica introduced legislation banning certain single-use plastic items — including plastic bags, polystyrene containers, and plastic drinking straws — in a phased rollout completed by 2019. The ban placed Jamaica among a growing number of nations recognising that convenience plastics carry a hidden cost far greater than their purchase price.

The environmental case for the ban is well established. Plastic waste that enters waterways eventually reaches the sea, where it persists for centuries, fragmenting into microplastics that enter the food chain. Jamaica's coral reefs, already stressed by warming waters and runoff, face additional harm from plastic entanglement and chemical leaching. Coastal communities that depend on fishing and tourism bear the most direct consequences.

The transition has not been without difficulty. Small business owners, particularly in the informal economy, faced real challenges adapting to alternatives. Reusable bags and paper containers cost more and require behaviour change from customers accustomed to free plastic bags at every checkout. In the early months after the ban, enforcement was inconsistent, and some vendors continued to use prohibited items.

Nevertheless, supporters argue that these are transitional difficulties, not permanent barriers. Consumer behaviour has shifted measurably. Many Jamaicans now carry their own bags as a matter of habit. Environmental organisations report reductions in plastic litter in monitored coastal and riverine sites. The ban is imperfect but directionally correct — a serious attempt to address a serious problem.`,
    question: "What is the MAIN ARGUMENT of the passage about Jamaica\'s plastic ban?",
    options: [
      "The plastic ban has been a complete failure and should be reversed.",
      "Small businesses should be exempt from the plastic ban.",
      "Jamaica\'s plastic ban is an imperfect but important step toward addressing serious environmental harm from single-use plastics.",
      "Microplastics in the food chain are the only reason Jamaica banned plastic.",
    ],
    correctAnswer: 2,
    explanation: "The passage acknowledges difficulties (\'imperfect\') while ultimately supporting the ban as \'directionally correct\' — a serious response to a serious problem. Option C captures this nuanced position."
  },
  {
    id: 7,
    type: "reading",
    passage: `Single-Use Plastics: Jamaica's Ban and Its Effects

In 2018, Jamaica introduced legislation banning certain single-use plastic items — including plastic bags, polystyrene containers, and plastic drinking straws — in a phased rollout completed by 2019. The ban placed Jamaica among a growing number of nations recognising that convenience plastics carry a hidden cost far greater than their purchase price.

The environmental case for the ban is well established. Plastic waste that enters waterways eventually reaches the sea, where it persists for centuries, fragmenting into microplastics that enter the food chain. Jamaica's coral reefs, already stressed by warming waters and runoff, face additional harm from plastic entanglement and chemical leaching. Coastal communities that depend on fishing and tourism bear the most direct consequences.

The transition has not been without difficulty. Small business owners, particularly in the informal economy, faced real challenges adapting to alternatives. Reusable bags and paper containers cost more and require behaviour change from customers accustomed to free plastic bags at every checkout. In the early months after the ban, enforcement was inconsistent, and some vendors continued to use prohibited items.

Nevertheless, supporters argue that these are transitional difficulties, not permanent barriers. Consumer behaviour has shifted measurably. Many Jamaicans now carry their own bags as a matter of habit. Environmental organisations report reductions in plastic litter in monitored coastal and riverine sites. The ban is imperfect but directionally correct — a serious attempt to address a serious problem.`,
    question: "What does the passage mean by \'convenience plastics carry a hidden cost far greater than their purchase price\'?",
    options: [
      "Plastic bags are actually very expensive to manufacture.",
      "The environmental and social damage caused by plastic waste is far more costly than the low price of plastic items suggests.",
      "People spend too much money on plastic bags when reusable bags are cheaper.",
      "The government charges a hidden tax on plastic items at checkout.",
    ],
    correctAnswer: 1,
    explanation: "\'Hidden cost\' refers to the environmental consequences — reef damage, microplastics, coastal harm — that are not reflected in the low purchase price of a plastic bag. The cost is real but invisible at the point of sale."
  },
  {
    id: 8,
    type: "reading",
    passage: `Single-Use Plastics: Jamaica's Ban and Its Effects

In 2018, Jamaica introduced legislation banning certain single-use plastic items — including plastic bags, polystyrene containers, and plastic drinking straws — in a phased rollout completed by 2019. The ban placed Jamaica among a growing number of nations recognising that convenience plastics carry a hidden cost far greater than their purchase price.

The environmental case for the ban is well established. Plastic waste that enters waterways eventually reaches the sea, where it persists for centuries, fragmenting into microplastics that enter the food chain. Jamaica's coral reefs, already stressed by warming waters and runoff, face additional harm from plastic entanglement and chemical leaching. Coastal communities that depend on fishing and tourism bear the most direct consequences.

The transition has not been without difficulty. Small business owners, particularly in the informal economy, faced real challenges adapting to alternatives. Reusable bags and paper containers cost more and require behaviour change from customers accustomed to free plastic bags at every checkout. In the early months after the ban, enforcement was inconsistent, and some vendors continued to use prohibited items.

Nevertheless, supporters argue that these are transitional difficulties, not permanent barriers. Consumer behaviour has shifted measurably. Many Jamaicans now carry their own bags as a matter of habit. Environmental organisations report reductions in plastic litter in monitored coastal and riverine sites. The ban is imperfect but directionally correct — a serious attempt to address a serious problem.`,
    question: "What is the PURPOSE of the third paragraph in the passage?",
    options: [
      "To argue that the ban should be cancelled because of business difficulties.",
      "To demonstrate that the ban has failed to change consumer behaviour.",
      "To honestly present the real challenges of the ban\'s implementation before supporting the ban overall.",
      "To provide evidence that the informal economy is more important than the environment.",
    ],
    correctAnswer: 2,
    explanation: "The third paragraph is a concession — it acknowledges genuine difficulties. But the final paragraph counters these, labelling them \'transitional difficulties, not permanent barriers.\' This structure strengthens the overall argument."
  },
  {
    id: 9,
    type: "reading",
    passage: `Single-Use Plastics: Jamaica's Ban and Its Effects

In 2018, Jamaica introduced legislation banning certain single-use plastic items — including plastic bags, polystyrene containers, and plastic drinking straws — in a phased rollout completed by 2019. The ban placed Jamaica among a growing number of nations recognising that convenience plastics carry a hidden cost far greater than their purchase price.

The environmental case for the ban is well established. Plastic waste that enters waterways eventually reaches the sea, where it persists for centuries, fragmenting into microplastics that enter the food chain. Jamaica's coral reefs, already stressed by warming waters and runoff, face additional harm from plastic entanglement and chemical leaching. Coastal communities that depend on fishing and tourism bear the most direct consequences.

The transition has not been without difficulty. Small business owners, particularly in the informal economy, faced real challenges adapting to alternatives. Reusable bags and paper containers cost more and require behaviour change from customers accustomed to free plastic bags at every checkout. In the early months after the ban, enforcement was inconsistent, and some vendors continued to use prohibited items.

Nevertheless, supporters argue that these are transitional difficulties, not permanent barriers. Consumer behaviour has shifted measurably. Many Jamaicans now carry their own bags as a matter of habit. Environmental organisations report reductions in plastic litter in monitored coastal and riverine sites. The ban is imperfect but directionally correct — a serious attempt to address a serious problem.`,
    question: "What does the phrase \'directionally correct\' suggest about the author\'s view of the plastic ban?",
    options: [
      "The ban is perfect in every detail and should be celebrated without criticism.",
      "The ban is moving in the right direction even if it is not yet fully effective — it is the right policy even with flaws.",
      "The ban was introduced in the wrong direction and needs to be reversed.",
      "The author is uncertain whether the ban was a good idea.",
    ],
    correctAnswer: 1,
    explanation: "\'Directionally correct\' is a carefully chosen phrase — it praises the intent and orientation of the policy without claiming it is perfect. The author supports the ban while being honest about its difficulties."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the plastic ban passage?",
    options: [
      "Angry and confrontational",
      "Balanced and analytically supportive",
      "Dismissive of environmental concerns",
      "Excited and emotional",
    ],
    correctAnswer: 1,
    explanation: "The passage weighs both sides, acknowledges difficulties, uses careful language (\'imperfect,\' \'transitional\'), and ultimately supports the ban with measured enthusiasm. The tone is balanced and analytically supportive."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"She owed it something in RETURN.\" The phrase \'in return\' means —",
    options: [
      "at some point in the future",
      "as a reciprocal response to what something has given you",
      "without expecting anything",
      "as a legal requirement",
    ],
    correctAnswer: 1,
    explanation: "\'In return\' means as a reciprocal act — because the river had given her family so much, she felt she owed it something back."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Plastic waste PERSISTS for centuries in the sea.\" The word \'persists\' means —",
    options: [
      "breaks down quickly",
      "remains and continues to exist over a long period",
      "causes immediate harm",
      "washes back onto the shore",
    ],
    correctAnswer: 1,
    explanation: "To persist means to continue existing or enduring over time — plastic does not biodegrade quickly and remains in the ocean for very long periods."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Plastic FRAGMENTS into microplastics that enter the food chain.\" The word \'fragments\' means —",
    options: [
      "expands and grows larger over time",
      "breaks into many small pieces",
      "sinks to the bottom of the ocean",
      "combines with other materials",
    ],
    correctAnswer: 1,
    explanation: "To fragment means to break into small pieces. Plastic in the ocean breaks down into tiny fragments called microplastics."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"ENFORCEMENT was inconsistent in the early months.\" The word \'enforcement\' means —",
    options: [
      "the creation of new laws",
      "the process of making sure laws are followed and applied",
      "public awareness campaigns",
      "the study of environmental policy",
    ],
    correctAnswer: 1,
    explanation: "Enforcement refers to ensuring that rules or laws are actually followed — checking compliance and applying consequences if they are not."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Consumer BEHAVIOUR has shifted measurably.\" The word \'measurably\' means —",
    options: [
      "in a way that is impossible to detect",
      "slightly and without real significance",
      "in a way that can be observed and quantified",
      "unpredictably and without pattern",
    ],
    correctAnswer: 2,
    explanation: "Measurably means in a way that can be observed and measured. The behaviour change is real and detectable, not just theoretical."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Reusable bags require BEHAVIOUR CHANGE from customers.\" What is the difficulty implied by \'behaviour change\'?",
    options: [
      "Customers are too poor to afford reusable bags.",
      "Changing established habits requires effort, awareness, and repetition — it does not happen automatically.",
      "Reusable bags are too heavy for most customers to carry.",
      "Behaviour change is only possible for young people, not adults.",
    ],
    correctAnswer: 1,
    explanation: "Behaviour change implies overcoming established habits. The difficulty is that customers are accustomed to free plastic bags and must consciously develop new habits."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Miss Iris had long since DECIDED that the absence of ownership was not absence of obligation.\" The word \'obligation\' means —",
    options: [
      "a personal preference or hobby",
      "a legal contract between two parties",
      "a duty or responsibility one feels toward something or someone",
      "a reward given for good behaviour",
    ],
    correctAnswer: 2,
    explanation: "Obligation means a moral or ethical duty — something one feels responsible for, even if not legally required."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The ban is IMPERFECT but directionally correct.\" The word \'imperfect\' means —",
    options: [
      "completely wrong and without merit",
      "not fully developed or without flaws, but still having value",
      "better than any alternative",
      "recently introduced and still being tested",
    ],
    correctAnswer: 1,
    explanation: "Imperfect means having flaws or shortcomings but not being entirely wrong. The author uses it to acknowledge the ban\'s difficulties while still supporting it."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Coral reefs face harm from plastic ENTANGLEMENT and chemical leaching.\" The word \'entanglement\' means —",
    options: [
      "being buried beneath the sea floor",
      "becoming tangled or trapped in something",
      "absorbing chemicals through the surface",
      "attracting predators from deeper water",
    ],
    correctAnswer: 1,
    explanation: "Entanglement means becoming twisted or trapped — marine animals and coral can become physically caught in plastic waste."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The ones who were CURIOUS fell into step beside her.\" The phrase \'fell into step\' means —",
    options: [
      "accidentally tripped and nearly fell",
      "began walking alongside her, matching her pace",
      "stopped walking and stood still",
      "ran ahead to reach the river first",
    ],
    correctAnswer: 1,
    explanation: "\'Fell into step\' is an idiom meaning to begin walking alongside someone, naturally matching their pace or rhythm — often used to suggest following someone\'s lead."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The environmental consequences of plastic pollution is widely documented.",
      "The environmental consequences of plastic pollution are widely documented.",
      "The environmental consequences of plastic pollution was widely documented.",
      "The environmental consequences of plastic pollution have been widely documented.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'consequences,\' which is plural. The correct verb is \'are.\' Note: Option D is grammatically possible but less standard in this context — \'are widely documented\' is the best choice."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time the ban was introduced, plastic pollution already damaged Jamaica\'s reefs.",
      "By the time the ban was introduced, plastic pollution has already damaged Jamaica\'s reefs.",
      "By the time the ban was introduced, plastic pollution had already damaged Jamaica\'s reefs.",
      "By the time the ban was introduced, plastic pollution was damaging Jamaica\'s reefs.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had\' + past participle) is required for an action completed before another past event. \'Had already damaged\' shows the damage preceded the ban."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although enforcement was inconsistent, consumer behaviour shifted measurably.\'",
    options: [
      "consumer behaviour shifted measurably",
      "Although enforcement was inconsistent",
      "enforcement was inconsistent",
      "behaviour shifted measurably",
    ],
    correctAnswer: 1,
    explanation: "\'Although enforcement was inconsistent\' is the subordinate clause — introduced by \'although\' and unable to stand alone as a complete sentence."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Miss Iris walked, removed rubbish, and was teaching the children by example.",
      "Miss Iris walked the bank, removed rubbish, and taught the children by example.",
      "Miss Iris walked the bank, to remove rubbish, and taught the children by example.",
      "Miss Iris was walking, removed rubbish, and was teaching the children by example.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a series to use the same grammatical form. Option B uses three simple past verbs: walked, removed, and taught."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Jamaica introduced the plastic ban in 2018.",
      "Environmental organisations have reported reductions in coastal litter.",
      "Small businesses faced real challenges adapting to the new regulations.",
      "The plastic ban was introduced by Jamaica in 2018.",
    ],
    correctAnswer: 3,
    explanation: "In the passive voice, the subject receives the action. In option D, \'the plastic ban\' (subject) receives the action \'was introduced.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Miss Iris, who had lived at the river bend for decades had never missed a morning walk.",
      "Miss Iris who had lived at the river bend for decades, had never missed a morning walk.",
      "Miss Iris, who had lived at the river bend for decades, had never missed a morning walk.",
      "Miss Iris, who had lived at the river bend for decades had, never missed a morning walk.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'who had lived at the river bend for decades\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Cleo asked why Miss Iris bothers to clean the river.",
      "Cleo asked why Miss Iris bothered to clean the river.",
      "Cleo asked why does Miss Iris bother to clean the river.",
      "Cleo asked why Miss Iris will bother to clean the river.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense (\'bothers\') shifts back to past (\'bothered\'). Question word order also changes — no inversion. Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a DANGLING MODIFIER?",
    options: [
      "Walking along the river bank, Miss Iris collected plastic bottles and old tins.",
      "Carrying her own bag, Cleo arrived at the river early on Saturday morning.",
      "Completing the morning walk, the river looked cleaner than ever.",
      "Having studied the issue, the students understood why plastic pollution is harmful.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'completing the morning walk\' should describe a person, but the sentence says the river completed the walk — this is a dangling modifier."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The ban covers three items plastic bags polystyrene containers and straws.",
      "The ban covers three items, plastic bags polystyrene containers and straws.",
      "The ban covers three items: plastic bags, polystyrene containers, and straws.",
      "The ban covers three items; plastic bags, polystyrene containers, and straws.",
    ],
    correctAnswer: 2,
    explanation: "A colon introduces a list after a complete clause. Items in the list are separated by commas. Option C correctly applies both rules."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement with a collective noun?",
    options: [
      "The community have gathered at the river bank to clean it.",
      "The community has gathered at the river bank to clean it.",
      "The community are gathering at the river bank for to clean it.",
      "The community were to gather at the river bank to clean it.",
    ],
    correctAnswer: 1,
    explanation: "Collective nouns like \'community\' are typically treated as singular in standard formal English. The correct verb is \'has gathered.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "The ban is imperfect; but it is directionally correct.",
      "The ban is imperfect; however, it is directionally correct.",
      "The ban is imperfect; and supporters say it is working.",
      "The ban is imperfect; being directionally correct nevertheless.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is a correct construction. Semicolons should not be followed by coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Identify the ERROR: \'Everyone in the village know that Miss Iris cleaned the river every morning.\'",
    options: [
      "Everyone should be All",
      "know should be knows",
      "cleaned should be was cleaning",
      "every should be each",
    ],
    correctAnswer: 1,
    explanation: "\'Everyone\' is always singular and takes a singular verb. The correct form is \'knows,\' not \'know.\'"
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica\'s plastic ban should be strengthened?",
    options: [
      "Jamaica banned plastic bags in 2019 and some businesses had trouble adjusting.",
      "Many countries around the world have introduced plastic bans.",
      "Jamaica\'s existing plastic ban is a vital first step, but extending it to cover all single-use plastics — including cutlery, cups, and packaging film — is essential to achieving meaningful environmental recovery.",
      "People need to change their habits and use reusable bags instead of plastic ones.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, forward-looking argument with a clear claim and concrete details (\'cutlery, cups, and packaging film\') — the mark of a strong persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Miss Iris was old and she cleaned the river because she cared about it.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Miss Iris, who was old, cleaned the river because she really cared about it a lot.",
      "Old Miss Iris cleaned the river and she cared about it.",
      "Every morning, Miss Iris walked the river bank removing what did not belong — not because the law required it, but because three generations of her family had drunk from those waters.",
      "Miss Iris cared about the river and cleaned it every day even though she was old.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific detail (\'three generations,\' \'drunk from those waters\'), explains the motivation with emotional precision, and avoids the repetitive \'and\' chains of the original."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Plastic is bad for the ocean.\'",
    options: [
      "Plastic is really very bad for the ocean and its animals.",
      "Plastic pollution degrades marine ecosystems, entangles wildlife, and introduces microplastics into the food chain, with consequences that persist for centuries.",
      "The ocean is harmed by plastic in many different ways.",
      "Plastic hurts the ocean because it is bad and does not go away.",
    ],
    correctAnswer: 1,
    explanation: "Option B is precise (\'degrades,\' \'entangles,\' \'microplastics\'), specific about mechanisms, and uses a time-scale (\'centuries\') to convey the severity. It transforms a vague statement into an accurate, detailed claim."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Miss Iris believed everyone had a duty to care for their local environment. She cleaned the river bank every morning regardless of the weather. She never lectured the children who followed her. Jamaica is an island nation surrounded by the Caribbean Sea. Her quiet example was more powerful than any speech.\'",
    options: [
      "She cleaned the river bank every morning regardless of the weather.",
      "She never lectured the children who followed her.",
      "Jamaica is an island nation surrounded by the Caribbean Sea.",
      "Her quiet example was more powerful than any speech.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Miss Iris\'s personal philosophy and teaching style. The sentence about Jamaica as an island nation is factually irrelevant to this focus."
  },
  {
    id: 37,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of individual environmental action?",
    options: [
      "We should all try to do our part for the environment.",
      "There are many ways individuals can help protect the natural world around them.",
      "The river will not clean itself, and the world will not change until the people in it decide — one bag, one walk, one small act at a time — that it is their river too.",
      "Individual actions are important and people need to take them seriously.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific (\'one bag, one walk\'), uses a rhetorical list for rhythmic effect, and ends with a memorable, philosophical image — \'their river too\' — that connects the individual to the collective."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The ban was good because it helped the environment and people used less plastic.\' What is the MOST PRECISE revision?",
    options: [
      "The ban was very good because the environment was helped and plastic use fell.",
      "Jamaica\'s plastic ban produced measurable environmental gains: coastal litter declined, reef habitats received some relief, and consumer behaviour shifted toward reusable alternatives.",
      "The ban was good and helped the environment because people stopped using as much plastic.",
      "The ban helped the environment by reducing plastic and this was good for Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise vocabulary (\'measurable environmental gains,\' \'coastal litter,\' \'reusable alternatives\'), lists specific outcomes, and uses a colon correctly to introduce the evidence."
  },
  {
    id: 39,
    type: "writing",
    question: "Which of the following is the BEST example of a HOOK for an essay about plastic pollution in Jamaica?",
    options: [
      "In this essay, I am going to discuss the problem of plastic pollution in Jamaica.",
      "Plastic pollution is a big problem for many countries in the world today.",
      "Every year, an estimated eight million tonnes of plastic enter the world\'s oceans — and for small island nations like Jamaica, the consequences wash up on shore.",
      "Jamaica has beautiful beaches and many people visit them every year.",
    ],
    correctAnswer: 2,
    explanation: "Option C opens with a striking statistic, immediately connects it to Jamaica, and uses the phrase \'wash up on shore\' both literally and figuratively — all hallmarks of an effective hook."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines the purpose of SUPPORTING EVIDENCE in a persuasive paragraph?",
    options: [
      "To make the paragraph longer and more impressive",
      "To confuse the reader with too many facts",
      "To provide specific, verifiable information that backs up the topic sentence and makes the argument more convincing",
      "To give the writer\'s personal opinions in a more official-sounding way",
    ],
    correctAnswer: 2,
    explanation: "Supporting evidence provides the factual or logical basis for the argument — it makes the claim credible and difficult to dismiss. Option C correctly identifies this function."
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

export default function LiteracyDifficult4Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult4Questions : literacyDifficult4Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 4</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 4</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 4 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 4</h1>
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
