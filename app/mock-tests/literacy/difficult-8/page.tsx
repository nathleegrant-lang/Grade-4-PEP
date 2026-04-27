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

const literacyDifficult8Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Mango Tree Council

Every evening in the village of Retreat, the older men gathered under the mango tree at the corner of Market Street. They had been doing this since before anyone could quite remember, and the spot had acquired, over time, a kind of unofficial authority. People brought disputes there. Decisions were discussed. The tree itself, enormous and deeply rooted, seemed to provide not shade so much as permission — to be honest, to disagree, to sit without hurrying.

Desmond was the youngest of the group by about a decade. He was forty-two and had come home from Kingston after twenty years away, carrying a set of ideas about how things could be different. The other men tolerated his opinions the way you tolerate a clever child: with patience, and a private amusement they did not always bother to conceal.

One evening, Desmond proposed that the village apply for a government grant to build a community centre. The older men listened without interrupting. Then Old Man Curtis, who had not spoken in an hour, said: "The last three community centres in this parish sit empty. Empty buildings don't build community. People build community."

Desmond started to argue about different contexts and funding models. Then he stopped himself. He looked at the men around him — men who had built things with their hands, who had watched projects arrive with promises and leave with nothing. He understood, suddenly, that he had been confusing the knowledge that comes from reading with the knowledge that comes from staying.

He did not abandon his idea. But he began to ask questions instead of giving answers.`,
    question: "What does the detail that the mango tree provided \'not shade so much as permission\' suggest?",
    options: [
      "The tree was too old to provide effective shade from the sun.",
      "The gathering place held a kind of informal authority that gave people freedom to speak honestly and take time.",
      "The men preferred to stand in the sun rather than sit in the shade.",
      "Permission from the tree was required before speaking at the council.",
    ],
    correctAnswer: 1,
    explanation: "\'Not shade so much as permission\' is a figurative expression — the tree\'s real value was not physical comfort but the atmosphere it created: permission to be honest, to disagree, and to be unhurried."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Mango Tree Council

Every evening in the village of Retreat, the older men gathered under the mango tree at the corner of Market Street. They had been doing this since before anyone could quite remember, and the spot had acquired, over time, a kind of unofficial authority. People brought disputes there. Decisions were discussed. The tree itself, enormous and deeply rooted, seemed to provide not shade so much as permission — to be honest, to disagree, to sit without hurrying.

Desmond was the youngest of the group by about a decade. He was forty-two and had come home from Kingston after twenty years away, carrying a set of ideas about how things could be different. The other men tolerated his opinions the way you tolerate a clever child: with patience, and a private amusement they did not always bother to conceal.

One evening, Desmond proposed that the village apply for a government grant to build a community centre. The older men listened without interrupting. Then Old Man Curtis, who had not spoken in an hour, said: "The last three community centres in this parish sit empty. Empty buildings don't build community. People build community."

Desmond started to argue about different contexts and funding models. Then he stopped himself. He looked at the men around him — men who had built things with their hands, who had watched projects arrive with promises and leave with nothing. He understood, suddenly, that he had been confusing the knowledge that comes from reading with the knowledge that comes from staying.

He did not abandon his idea. But he began to ask questions instead of giving answers.`,
    question: "What does the phrase \'the knowledge that comes from reading\' versus \'the knowledge that comes from staying\' represent?",
    options: [
      "Desmond is illiterate and must rely on oral tradition rather than books.",
      "The distinction between theoretical or academic knowledge and the practical, lived wisdom that comes from long experience in a specific place.",
      "Desmond reads too many books and needs to spend more time outdoors.",
      "The older men have never read books and are therefore ignorant.",
    ],
    correctAnswer: 1,
    explanation: "This distinction is the passage\'s central intellectual insight: Desmond\'s knowledge (urban, theoretical, credentialed) and the older men\'s knowledge (local, experiential, relational) are different in kind, not just degree."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Mango Tree Council

Every evening in the village of Retreat, the older men gathered under the mango tree at the corner of Market Street. They had been doing this since before anyone could quite remember, and the spot had acquired, over time, a kind of unofficial authority. People brought disputes there. Decisions were discussed. The tree itself, enormous and deeply rooted, seemed to provide not shade so much as permission — to be honest, to disagree, to sit without hurrying.

Desmond was the youngest of the group by about a decade. He was forty-two and had come home from Kingston after twenty years away, carrying a set of ideas about how things could be different. The other men tolerated his opinions the way you tolerate a clever child: with patience, and a private amusement they did not always bother to conceal.

One evening, Desmond proposed that the village apply for a government grant to build a community centre. The older men listened without interrupting. Then Old Man Curtis, who had not spoken in an hour, said: "The last three community centres in this parish sit empty. Empty buildings don't build community. People build community."

Desmond started to argue about different contexts and funding models. Then he stopped himself. He looked at the men around him — men who had built things with their hands, who had watched projects arrive with promises and leave with nothing. He understood, suddenly, that he had been confusing the knowledge that comes from reading with the knowledge that comes from staying.

He did not abandon his idea. But he began to ask questions instead of giving answers.`,
    question: "What does Desmond understand when he looks at the men around him after Old Man Curtis speaks?",
    options: [
      "He understands that the community centre proposal is a bad idea.",
      "He understands that the men are too traditional to accept new ideas.",
      "He understands that the men\'s silence and patience carry a form of knowledge that his reading-based confidence had not accounted for.",
      "He understands that he should return to Kingston.",
    ],
    correctAnswer: 2,
    explanation: "Desmond sees men who \'had built things with their hands\' and \'had watched projects arrive with promises and leave with nothing.\' Their experience gives them authority he lacks. He realises he has been confusing his kind of knowledge for the only kind."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Mango Tree Council

Every evening in the village of Retreat, the older men gathered under the mango tree at the corner of Market Street. They had been doing this since before anyone could quite remember, and the spot had acquired, over time, a kind of unofficial authority. People brought disputes there. Decisions were discussed. The tree itself, enormous and deeply rooted, seemed to provide not shade so much as permission — to be honest, to disagree, to sit without hurrying.

Desmond was the youngest of the group by about a decade. He was forty-two and had come home from Kingston after twenty years away, carrying a set of ideas about how things could be different. The other men tolerated his opinions the way you tolerate a clever child: with patience, and a private amusement they did not always bother to conceal.

One evening, Desmond proposed that the village apply for a government grant to build a community centre. The older men listened without interrupting. Then Old Man Curtis, who had not spoken in an hour, said: "The last three community centres in this parish sit empty. Empty buildings don't build community. People build community."

Desmond started to argue about different contexts and funding models. Then he stopped himself. He looked at the men around him — men who had built things with their hands, who had watched projects arrive with promises and leave with nothing. He understood, suddenly, that he had been confusing the knowledge that comes from reading with the knowledge that comes from staying.

He did not abandon his idea. But he began to ask questions instead of giving answers.`,
    question: "Why does the passage describe the other men as tolerating Desmond\'s opinions \'the way you tolerate a clever child\'?",
    options: [
      "To show that Desmond is actually a child attending adult meetings.",
      "To suggest the men are rude and disrespectful to Desmond.",
      "To capture the way experience sometimes views confident youth — with patient, slightly amused indulgence rather than genuine engagement.",
      "To prove that Desmond\'s ideas are always wrong and childish.",
    ],
    correctAnswer: 2,
    explanation: "\'Tolerating a clever child\' is a precise, somewhat ironic description: the men recognise Desmond\'s intelligence but also perceive the gap between his confidence and his understanding — they are patient rather than hostile."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Mango Tree Council

Every evening in the village of Retreat, the older men gathered under the mango tree at the corner of Market Street. They had been doing this since before anyone could quite remember, and the spot had acquired, over time, a kind of unofficial authority. People brought disputes there. Decisions were discussed. The tree itself, enormous and deeply rooted, seemed to provide not shade so much as permission — to be honest, to disagree, to sit without hurrying.

Desmond was the youngest of the group by about a decade. He was forty-two and had come home from Kingston after twenty years away, carrying a set of ideas about how things could be different. The other men tolerated his opinions the way you tolerate a clever child: with patience, and a private amusement they did not always bother to conceal.

One evening, Desmond proposed that the village apply for a government grant to build a community centre. The older men listened without interrupting. Then Old Man Curtis, who had not spoken in an hour, said: "The last three community centres in this parish sit empty. Empty buildings don't build community. People build community."

Desmond started to argue about different contexts and funding models. Then he stopped himself. He looked at the men around him — men who had built things with their hands, who had watched projects arrive with promises and leave with nothing. He understood, suddenly, that he had been confusing the knowledge that comes from reading with the knowledge that comes from staying.

He did not abandon his idea. But he began to ask questions instead of giving answers.`,
    question: "What change occurs in Desmond at the end of the passage, and what does it suggest?",
    options: [
      "He abandons his idea for the community centre entirely.",
      "He becomes angry and decides to leave the village again.",
      "He shifts from asserting answers to asking questions — suggesting he has moved from confident prescription to genuine listening and learning.",
      "He convinces Old Man Curtis that the community centre is a good idea.",
    ],
    correctAnswer: 2,
    explanation: "\'He began to ask questions instead of giving answers\' shows a fundamental shift in approach — from the posture of an expert dispensing knowledge to that of a learner engaging with others\' experience."
  },
  {
    id: 6,
    type: "reading",
    passage: `Should the Voting Age Be Lowered to Sixteen?

In several countries, sixteen and seventeen-year-olds can already vote in national elections. Scotland, Wales, Austria, and Argentina are among those that have extended suffrage to this age group. Proponents argue that lowering the voting age would strengthen democracy, increase civic engagement, and give young people a formal voice in decisions that will shape their futures. Opponents contend that political maturity and informed decision-making require greater life experience than most sixteen-year-olds have acquired.

The case for lowering the voting age is not simply a matter of fairness, though fairness matters. At sixteen, young people in Jamaica can work, pay taxes, and in some circumstances face criminal prosecution as adults. Yet they have no formal voice in the elections that determine the policies governing their lives. This inconsistency — adult responsibilities without adult political rights — is difficult to defend with principled argument.

Those who argue against lowering the voting age often invoke the concept of cognitive maturity. Research in developmental psychology does suggest that the prefrontal cortex — the brain region associated with long-term reasoning and impulse control — is not fully developed until the mid-twenties. However, this argument proves too much: if neurological development is the criterion for enfranchisement, it would disqualify many existing voters, not just teenagers.

There is also evidence that voting habits form early. Young people who vote at sixteen are statistically more likely to develop lifelong voting habits than those who first vote at eighteen or older. If civic participation is a value democracies wish to cultivate, extending the vote to sixteen-year-olds may be one of the most effective ways to do it.`,
    question: "What is the CENTRAL ARGUMENT of the passage about lowering the voting age?",
    options: [
      "Sixteen-year-olds are too immature to make informed political decisions.",
      "The voting age should be lowered to sixteen because the inconsistency between adult responsibilities and the absence of political rights is indefensible, and early voting cultivates lifelong civic habits.",
      "Voting age policies should match brain development research exactly.",
      "Only countries with strong economies can afford to lower the voting age.",
    ],
    correctAnswer: 1,
    explanation: "The passage makes two main arguments: the inconsistency between adult responsibilities and no voting rights is logically indefensible, and early voting builds lasting civic habits. Option B captures both."
  },
  {
    id: 7,
    type: "reading",
    passage: `Should the Voting Age Be Lowered to Sixteen?

In several countries, sixteen and seventeen-year-olds can already vote in national elections. Scotland, Wales, Austria, and Argentina are among those that have extended suffrage to this age group. Proponents argue that lowering the voting age would strengthen democracy, increase civic engagement, and give young people a formal voice in decisions that will shape their futures. Opponents contend that political maturity and informed decision-making require greater life experience than most sixteen-year-olds have acquired.

The case for lowering the voting age is not simply a matter of fairness, though fairness matters. At sixteen, young people in Jamaica can work, pay taxes, and in some circumstances face criminal prosecution as adults. Yet they have no formal voice in the elections that determine the policies governing their lives. This inconsistency — adult responsibilities without adult political rights — is difficult to defend with principled argument.

Those who argue against lowering the voting age often invoke the concept of cognitive maturity. Research in developmental psychology does suggest that the prefrontal cortex — the brain region associated with long-term reasoning and impulse control — is not fully developed until the mid-twenties. However, this argument proves too much: if neurological development is the criterion for enfranchisement, it would disqualify many existing voters, not just teenagers.

There is also evidence that voting habits form early. Young people who vote at sixteen are statistically more likely to develop lifelong voting habits than those who first vote at eighteen or older. If civic participation is a value democracies wish to cultivate, extending the vote to sixteen-year-olds may be one of the most effective ways to do it.`,
    question: "What does the phrase \'this argument proves too much\' mean when applied to the cognitive maturity objection?",
    options: [
      "The argument about brain development uses too many scientific sources.",
      "If neurological development were the true criterion for voting, it would disqualify many current adult voters, not just teenagers — making the argument self-defeating.",
      "The cognitive maturity argument is too complicated for most people to understand.",
      "The passage proves that sixteen-year-olds are more mature than researchers claim.",
    ],
    correctAnswer: 1,
    explanation: "\'Proves too much\' is a logical concept: an argument that, if accepted, would lead to conclusions far beyond what the arguer intends. If brain development determines voting rights, many adults in their 20s would also be disqualified."
  },
  {
    id: 8,
    type: "reading",
    passage: `Should the Voting Age Be Lowered to Sixteen?

In several countries, sixteen and seventeen-year-olds can already vote in national elections. Scotland, Wales, Austria, and Argentina are among those that have extended suffrage to this age group. Proponents argue that lowering the voting age would strengthen democracy, increase civic engagement, and give young people a formal voice in decisions that will shape their futures. Opponents contend that political maturity and informed decision-making require greater life experience than most sixteen-year-olds have acquired.

The case for lowering the voting age is not simply a matter of fairness, though fairness matters. At sixteen, young people in Jamaica can work, pay taxes, and in some circumstances face criminal prosecution as adults. Yet they have no formal voice in the elections that determine the policies governing their lives. This inconsistency — adult responsibilities without adult political rights — is difficult to defend with principled argument.

Those who argue against lowering the voting age often invoke the concept of cognitive maturity. Research in developmental psychology does suggest that the prefrontal cortex — the brain region associated with long-term reasoning and impulse control — is not fully developed until the mid-twenties. However, this argument proves too much: if neurological development is the criterion for enfranchisement, it would disqualify many existing voters, not just teenagers.

There is also evidence that voting habits form early. Young people who vote at sixteen are statistically more likely to develop lifelong voting habits than those who first vote at eighteen or older. If civic participation is a value democracies wish to cultivate, extending the vote to sixteen-year-olds may be one of the most effective ways to do it.`,
    question: "What does \'ENFRANCHISEMENT\' mean as used in the passage?",
    options: [
      "The right to own property",
      "The right to vote and participate in elections",
      "The right to stand for political office",
      "The right to free education",
    ],
    correctAnswer: 1,
    explanation: "Enfranchisement means being granted the right to vote. The passage uses it when discussing who should or should not be allowed to vote based on neurological development."
  },
  {
    id: 9,
    type: "reading",
    passage: `Should the Voting Age Be Lowered to Sixteen?

In several countries, sixteen and seventeen-year-olds can already vote in national elections. Scotland, Wales, Austria, and Argentina are among those that have extended suffrage to this age group. Proponents argue that lowering the voting age would strengthen democracy, increase civic engagement, and give young people a formal voice in decisions that will shape their futures. Opponents contend that political maturity and informed decision-making require greater life experience than most sixteen-year-olds have acquired.

The case for lowering the voting age is not simply a matter of fairness, though fairness matters. At sixteen, young people in Jamaica can work, pay taxes, and in some circumstances face criminal prosecution as adults. Yet they have no formal voice in the elections that determine the policies governing their lives. This inconsistency — adult responsibilities without adult political rights — is difficult to defend with principled argument.

Those who argue against lowering the voting age often invoke the concept of cognitive maturity. Research in developmental psychology does suggest that the prefrontal cortex — the brain region associated with long-term reasoning and impulse control — is not fully developed until the mid-twenties. However, this argument proves too much: if neurological development is the criterion for enfranchisement, it would disqualify many existing voters, not just teenagers.

There is also evidence that voting habits form early. Young people who vote at sixteen are statistically more likely to develop lifelong voting habits than those who first vote at eighteen or older. If civic participation is a value democracies wish to cultivate, extending the vote to sixteen-year-olds may be one of the most effective ways to do it.`,
    question: "What does the evidence about voting habits forming early suggest about the argument for lowering the voting age?",
    options: [
      "Young people who vote at sixteen become more politically extreme.",
      "Early voting experience leads to lifelong civic participation — making sixteen-year-old suffrage a practical investment in democratic health.",
      "Young people should be required to vote from age sixteen by law.",
      "Eighteen is actually the ideal age to begin forming voting habits.",
    ],
    correctAnswer: 1,
    explanation: "The passage argues that sixteen-year-olds who vote are \'statistically more likely to develop lifelong voting habits.\' If civic participation is a democratic value, extending the vote early is an effective way to cultivate it."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the voting age passage?",
    options: [
      "Dismissive of young people\'s political capacity",
      "Logically reasoned and moderately persuasive",
      "Angry at existing political systems",
      "Neutral and without any clear position",
    ],
    correctAnswer: 1,
    explanation: "The passage presents arguments on both sides but clearly favours lowering the voting age, using logical analysis (\'proves too much,\' \'difficult to defend\') rather than emotional appeals. The tone is logically reasoned and moderately persuasive."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The spot had acquired, over time, a kind of UNOFFICIAL AUTHORITY.\" The phrase \'unofficial authority\' means —",
    options: [
      "power granted by the government for legal purposes",
      "recognised influence or status that exists without formal legal sanction",
      "the authority of the oldest man in the group",
      "a temporary arrangement that would soon be made formal",
    ],
    correctAnswer: 1,
    explanation: "Unofficial authority is influence or status that people recognise and respect, even though it has no legal or formal basis. The mango tree gathering had this kind of cultural authority."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The men TOLERATED his opinions with patience and private amusement.\" The word \'tolerated\' implies —",
    options: [
      "they fully agreed with and admired his opinions",
      "they respectfully engaged with his arguments",
      "they endured his opinions without necessarily accepting them, with mild amusement",
      "they were secretly planning to remove him from the group",
    ],
    correctAnswer: 2,
    explanation: "To tolerate means to endure or put up with something without necessarily approving of it. The men were patient but not genuinely persuaded."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"PROPONENTS argue that lowering the voting age strengthens democracy.\" The word \'proponents\' means —",
    options: [
      "opponents who reject an idea",
      "people who support and advocate for an idea",
      "researchers who study an issue",
      "politicians who make laws",
    ],
    correctAnswer: 1,
    explanation: "Proponents are people who support or champion an idea or cause — they argue in favour of it."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"This INCONSISTENCY — adult responsibilities without adult political rights — is difficult to defend.\" The word \'inconsistency\' means —",
    options: [
      "a lack of fairness in financial matters",
      "a contradiction between two things that should logically align",
      "a mistake made by the government",
      "a difference of opinion between groups",
    ],
    correctAnswer: 1,
    explanation: "An inconsistency is a contradiction — two things that are logically in conflict with each other. Giving young people adult responsibilities while denying them adult political rights is internally contradictory."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The PREFRONTAL CORTEX is not fully developed until the mid-twenties.\" The prefrontal cortex is described in the passage as —",
    options: [
      "the part of the brain responsible for language and speech",
      "the brain region associated with long-term reasoning and impulse control",
      "the emotional centre of the brain that controls feelings",
      "the region that controls physical coordination and movement",
    ],
    correctAnswer: 1,
    explanation: "The passage defines it explicitly: \'the brain region associated with long-term reasoning and impulse control.\'"
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"If civic PARTICIPATION is a value democracies wish to cultivate.\" The word \'cultivate\' means —",
    options: [
      "to farm or grow plants in a field",
      "to encourage the development and growth of something over time",
      "to study something scientifically",
      "to reward with financial incentives",
    ],
    correctAnswer: 1,
    explanation: "To cultivate means to encourage or nurture the development of something over time — here, the value of civic participation."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"People BROUGHT DISPUTES there.\" In the context of the passage, the word \'disputes\' means —",
    options: [
      "gifts and offerings brought to the community",
      "disagreements or conflicts that needed resolution",
      "important documents requiring signatures",
      "new ideas to be shared with the group",
    ],
    correctAnswer: 1,
    explanation: "Disputes are disagreements or conflicts — situations where people have opposing views or interests that need to be worked out."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"He had been CONFUSING the knowledge that comes from reading with the knowledge that comes from staying.\" What does this distinction reveal?",
    options: [
      "Desmond reads too much and needs to work more with his hands.",
      "Book-learning and lived experience are different kinds of knowledge, and Desmond had mistaken one for the whole.",
      "The older men have no respect for formal education.",
      "Desmond needs to go back to university before his ideas will be taken seriously.",
    ],
    correctAnswer: 1,
    explanation: "Desmond had assumed that his reading-derived knowledge was comprehensive. Old Man Curtis\'s comment reveals that it is a different kind of knowledge — not superior — from the experiential wisdom the older men hold."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"SUFFRAGE to this age group.\" The word \'suffrage\' means —",
    options: [
      "the right to own property and assets",
      "the right to vote in democratic elections",
      "the right to receive government benefits",
      "the right to run for elected office",
    ],
    correctAnswer: 1,
    explanation: "Suffrage means the right to vote. The passage is discussing whether voting rights (suffrage) should be extended to sixteen and seventeen-year-olds."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Old Man Curtis, who had NOT SPOKEN in an hour, said...\" What effect does this detail have?",
    options: [
      "It suggests Old Man Curtis was bored by the discussion.",
      "It makes his eventual words more significant — silence before speaking suggests deliberation and weight.",
      "It shows that Old Man Curtis did not understand the conversation.",
      "It proves that Old Man Curtis was the least important person in the group.",
    ],
    correctAnswer: 1,
    explanation: "A character who has been silent for an hour who then speaks carries natural weight — the silence implies thought and deliberation. When Curtis finally speaks, the reader expects something important."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The knowledge that comes from years of lived experience in a community are irreplaceable.",
      "The knowledge that comes from years of lived experience in a community is irreplaceable.",
      "The knowledge that comes from years of lived experience in a community were irreplaceable.",
      "The knowledge that comes from years of lived experience in a community have been irreplaceable.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the knowledge,\' which is singular. The correct verb is \'is.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Desmond realised his error, he already argued his case at length.",
      "By the time Desmond realised his error, he has already argued his case at length.",
      "By the time Desmond realised his error, he had already argued his case at length.",
      "By the time Desmond realised his error, he was already arguing his case.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had\' + past participle) is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although sixteen-year-olds can work and pay taxes, they have no formal say in national elections.\'",
    options: [
      "they have no formal say in national elections",
      "Although sixteen-year-olds can work and pay taxes",
      "sixteen-year-olds can work and pay taxes",
      "no formal say in national elections",
    ],
    correctAnswer: 1,
    explanation: "\'Although sixteen-year-olds can work and pay taxes\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Young voters are more likely to register, to vote consistently, and showing political engagement.",
      "Young voters are more likely to register, vote consistently, and show political engagement.",
      "Young voters are more likely to register, voting consistently, and to show political engagement.",
      "Young voters are more likely to register, they vote consistently, and show political engagement.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three bare infinitives (without \'to\'): register, vote, and show."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Desmond proposed the community centre idea at the evening gathering.",
      "Old Man Curtis rejected the idea with a single quiet observation.",
      "The proposal was rejected by Old Man Curtis with a single quiet observation.",
      "The older men listened to Desmond without interrupting him.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the proposal\' (subject) receives the action \'was rejected.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Scotland, which lowered its voting age in 2015 now allows sixteen-year-olds to vote.",
      "Scotland which lowered its voting age in 2015, now allows sixteen-year-olds to vote.",
      "Scotland, which lowered its voting age in 2015, now allows sixteen-year-olds to vote.",
      "Scotland, which lowered its voting age in 2015 now allows, sixteen-year-olds to vote.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which lowered its voting age in 2015\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Old Man Curtis said that empty buildings don\'t build community — people build community.",
      "Old Man Curtis said that empty buildings didn\'t build community — people built community.",
      "Old Man Curtis said that empty buildings don\'t built community — people build community.",
      "Old Man Curtis said that empty buildings hadn\'t built community — people have built community.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense shifts back to past. \'Don\'t build\' becomes \'didn\'t build\' and \'build\' becomes \'built.\' Option B applies this consistently."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Sitting under the mango tree, the men discussed the proposal for hours.",
      "Having lived in Kingston for twenty years, Desmond brought new ideas to the village.",
      "Rooted in the community for decades, the old men\'s wisdom could not be dismissed.",
      "Growing up quickly, Desmond\'s ideas were soon accepted by the council.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'growing up quickly\' should describe Desmond, but the sentence\'s subject is \'Desmond\'s ideas\' — ideas cannot grow up. The modifier dangles."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Desmond had book knowledge; but the older men had experiential wisdom.",
      "Desmond had book knowledge; however, the older men had experiential wisdom.",
      "Desmond had book knowledge; and the older men had experiential wisdom.",
      "Desmond had book knowledge; yet this was not enough on its own.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is a correct construction. Semicolons should not precede coordinating conjunctions like \'but\' and \'and.\' Note: Option D uses \'yet\' as a conjunctive adverb without a comma, which is also incorrect."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "The arguments in favour of lowering the voting age has been well documented.",
      "The arguments in favour of lowering the voting age have been well documented.",
      "The arguments in favour of lowering the voting age is well documented.",
      "The arguments in favour of lowering the voting age was well documented.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'arguments,\' which is plural. The correct verb is \'have been.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is vital that every eligible citizen votes in every election.",
      "It is vital that every eligible citizen vote in every election.",
      "It is vital that every eligible citizen voted in every election.",
      "It is vital that every eligible citizen will vote in every election.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is vital that,\' the subjunctive requires the base form of the verb — \'vote,\' not \'votes,\' \'voted,\' or \'will vote.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "Desmond returned to the village with three things: new ideas, a determination to help, and a willingness to listen.",
      "Desmond returned to the village with: three things new ideas, a determination to help, and a willingness to listen.",
      "Desmond returned to the village with three things new ideas: a determination to help, and a willingness to listen.",
      "Desmond: returned to the village with three things new ideas, a determination to help, and a willingness to listen.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list. \'Desmond returned to the village with three things\' is complete, and the colon correctly introduces the list."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica should lower its voting age to sixteen?",
    options: [
      "Many countries have already lowered their voting age to sixteen.",
      "Sixteen-year-olds in Jamaica are old enough to work and pay taxes.",
      "Jamaica should lower its voting age to sixteen, both to correct the indefensible inconsistency of granting adult responsibilities without adult rights, and to invest in the lifelong civic habits that early voting cultivates.",
      "Young people are interested in politics and should be allowed to vote.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes two specific arguments (\'correct the indefensible inconsistency\' and \'invest in lifelong civic habits\'), uses formal vocabulary, and explains the reasoning — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Desmond learned something important from the older men.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Desmond learned something very important from what the older men said to him.",
      "The older men taught Desmond something important that he had not known before.",
      "Through Old Man Curtis\'s quiet rebuttal, Desmond learned that the knowledge born of decades in one place carries a weight that no amount of reading from elsewhere can fully replicate.",
      "Desmond learned an important lesson from the older men about community and knowledge.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific (\'Old Man Curtis\'s quiet rebuttal\'), uses precise vocabulary (\'rebuttal,\' \'replicate\'), and captures the passage\'s central insight in one well-constructed sentence."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Sixteen-year-olds should be allowed to vote because they are affected by government decisions.\'",
    options: [
      "Sixteen-year-olds should definitely be allowed to vote because many government decisions affect them very much.",
      "Since sixteen-year-olds are affected by government decisions, they should be allowed to vote.",
      "Sixteen-year-olds, who bear adult responsibilities including work and taxation, have a legitimate democratic stake in the policies that govern their lives — making their exclusion from the vote a principled injustice, not a practical necessity.",
      "It is not fair that sixteen-year-olds cannot vote when they are affected by government decisions.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'legitimate democratic stake,\' \'principled injustice\'), specifies the adult responsibilities (work, taxation), and frames the conclusion with analytical precision."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'The mango tree gathering in Retreat had a kind of unofficial authority recognised by the whole village. People brought disputes there and expected reasoned discussion. The village also had a primary school that had been recently renovated. Decisions made under that tree carried real moral weight in the community.\'",
    options: [
      "People brought disputes there and expected reasoned discussion.",
      "The village also had a primary school that had been recently renovated.",
      "The mango tree gathering in Retreat had a kind of unofficial authority recognised by the whole village.",
      "Decisions made under that tree carried real moral weight in the community.",
    ],
    correctAnswer: 1,
    explanation: "The paragraph is about the authority and function of the mango tree council. The sentence about the primary school renovation is off-topic."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about the voting age?",
    options: [
      "Some people say young people are not mature enough to vote, but this is just an excuse.",
      "Although there is evidence that the prefrontal cortex continues developing into the mid-twenties, applying neurological development as a blanket criterion for enfranchisement would logically disqualify millions of existing adult voters — revealing the argument\'s fundamental inconsistency.",
      "Brain development research is interesting but not relevant to the question of voting rights.",
      "Young people can be just as mature as adults and sometimes more so.",
    ],
    correctAnswer: 1,
    explanation: "Option B concedes the cognitive maturity argument (\'there is evidence\') before demonstrating its internal inconsistency (\'would logically disqualify millions of existing adult voters\') — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Old Man Curtis made a good point about community centres.\' What is the MOST PRECISE revision?",
    options: [
      "Old Man Curtis made a very good and important point about community centres being empty.",
      "What Old Man Curtis said about community centres was a good point that made Desmond think.",
      "With a single observation — that empty buildings do not build community, people do — Old Man Curtis reframed the entire discussion, exposing the gap between Desmond\'s theoretical solution and the lived reality of the village.",
      "Old Man Curtis made a point about community centres that was very meaningful to Desmond.",
    ],
    correctAnswer: 2,
    explanation: "Option C quotes the key idea precisely, uses strong analytical vocabulary (\'reframed,\' \'exposing the gap,\' \'theoretical solution\'), and captures the structural significance of Curtis\'s intervention."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the value of experiential knowledge in community decision-making?",
    options: [
      "Experienced people have a lot of useful knowledge that others should listen to.",
      "Communities should always include older people in their decision-making processes.",
      "The knowledge that comes from staying — from watching projects fail, from rebuilding after storms, from knowing which road floods in August — is not less valid than formal expertise: it is differently obtained, and often more reliably true.",
      "Older community members should be respected for what they know.",
    ],
    correctAnswer: 2,
    explanation: "Option C defines \'staying knowledge\' precisely with concrete examples (\'which road floods in August\'), makes a direct comparison with formal expertise, and ends with a powerful, quotable insight — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the FUNCTION of a COUNTERARGUMENT in a persuasive essay?",
    options: [
      "To prove that the writer\'s position is wrong and should be abandoned.",
      "To confuse the reader so they cannot make up their own mind.",
      "To show that the writer has considered opposing views, then to refute or outweigh them — strengthening the overall argument\'s credibility.",
      "To agree with the opposing side and find a middle ground between two positions.",
    ],
    correctAnswer: 2,
    explanation: "Presenting and then refuting a counterargument shows intellectual honesty and strengthens credibility. Option C correctly identifies this function — the writer does not abandon their position but strengthens it by engaging with opposition."
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

export default function LiteracyDifficult8Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult8Questions : literacyDifficult8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 8</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 8 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 8</h1>
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
