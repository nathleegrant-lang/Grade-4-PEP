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

const literacyMixed3Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Grandmother's Bible

When Great-Aunt Miriam died, she left behind a Bible so old that its cover had separated from the spine and was held together by a rubber band. Inside the front cover, in handwriting that grew smaller and more cramped toward the bottom of the page, were the names and dates of every person in the family going back to 1891.

Dania's mother had kept the Bible in a drawer without looking at it for fifteen years. One afternoon, Dania found it when she was searching for a pen. She opened it carefully, the way you might open something that had been waiting to be opened.

The earliest name was a woman called Constance, born 1891, died 1963. Below her name, in different handwriting, someone had written two words: "Was faithful." That was all. No story, no occupation, no place. Just the judgement that mattered most to whoever had written it.

Dania sat on the edge of her parents' bed for a long time. She tried to imagine Constance — the shape of her hands, the sound of her voice, what faithfulness meant to someone born in 1891 in Jamaica. She could not. But the trying felt important.

She did not put the Bible back in the drawer. She carried it to her own room and set it on her desk, where she could see it when she studied.`,
    question: "What does Dania find when she opens the Bible?",
    options: [
      "A letter written to her by Great-Aunt Miriam",
      "A record of family names and dates going back to 1891, with brief notes about each person",
      "A collection of pressed flowers and photographs",
      "A list of Bible verses that Miriam had memorised",
    ],
    correctAnswer: 1,
    explanation: "The passage states the Bible contained \'the names and dates of every person in the family going back to 1891\' with brief inscriptions beside them."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Grandmother's Bible

When Great-Aunt Miriam died, she left behind a Bible so old that its cover had separated from the spine and was held together by a rubber band. Inside the front cover, in handwriting that grew smaller and more cramped toward the bottom of the page, were the names and dates of every person in the family going back to 1891.

Dania's mother had kept the Bible in a drawer without looking at it for fifteen years. One afternoon, Dania found it when she was searching for a pen. She opened it carefully, the way you might open something that had been waiting to be opened.

The earliest name was a woman called Constance, born 1891, died 1963. Below her name, in different handwriting, someone had written two words: "Was faithful." That was all. No story, no occupation, no place. Just the judgement that mattered most to whoever had written it.

Dania sat on the edge of her parents' bed for a long time. She tried to imagine Constance — the shape of her hands, the sound of her voice, what faithfulness meant to someone born in 1891 in Jamaica. She could not. But the trying felt important.

She did not put the Bible back in the drawer. She carried it to her own room and set it on her desk, where she could see it when she studied.`,
    question: "What are the only words written beside Constance\'s name?",
    options: [
      "\'Died peacefully\'",
      "\'Born in Portland\'",
      "\'Was faithful\'",
      "\'Loved her children\'",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that below Constance\'s name someone had written: \'Was faithful. That was all.\'"
  },
  {
    id: 3,
    type: "reading",
    passage: `The Grandmother's Bible

When Great-Aunt Miriam died, she left behind a Bible so old that its cover had separated from the spine and was held together by a rubber band. Inside the front cover, in handwriting that grew smaller and more cramped toward the bottom of the page, were the names and dates of every person in the family going back to 1891.

Dania's mother had kept the Bible in a drawer without looking at it for fifteen years. One afternoon, Dania found it when she was searching for a pen. She opened it carefully, the way you might open something that had been waiting to be opened.

The earliest name was a woman called Constance, born 1891, died 1963. Below her name, in different handwriting, someone had written two words: "Was faithful." That was all. No story, no occupation, no place. Just the judgement that mattered most to whoever had written it.

Dania sat on the edge of her parents' bed for a long time. She tried to imagine Constance — the shape of her hands, the sound of her voice, what faithfulness meant to someone born in 1891 in Jamaica. She could not. But the trying felt important.

She did not put the Bible back in the drawer. She carried it to her own room and set it on her desk, where she could see it when she studied.`,
    question: "What does Dania\'s long attempt to imagine Constance suggest about her?",
    options: [
      "She has a very good imagination and can picture historical figures easily.",
      "She is curious and empathetic — she tries to connect with a life she cannot fully know.",
      "She is frustrated that the Bible does not give more information.",
      "She believes Constance is still alive somewhere.",
    ],
    correctAnswer: 1,
    explanation: "Dania tries to imagine \'the shape of her hands, the sound of her voice\' — an act of empathy and curiosity about a life separated from hers by over a century."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Grandmother's Bible

When Great-Aunt Miriam died, she left behind a Bible so old that its cover had separated from the spine and was held together by a rubber band. Inside the front cover, in handwriting that grew smaller and more cramped toward the bottom of the page, were the names and dates of every person in the family going back to 1891.

Dania's mother had kept the Bible in a drawer without looking at it for fifteen years. One afternoon, Dania found it when she was searching for a pen. She opened it carefully, the way you might open something that had been waiting to be opened.

The earliest name was a woman called Constance, born 1891, died 1963. Below her name, in different handwriting, someone had written two words: "Was faithful." That was all. No story, no occupation, no place. Just the judgement that mattered most to whoever had written it.

Dania sat on the edge of her parents' bed for a long time. She tried to imagine Constance — the shape of her hands, the sound of her voice, what faithfulness meant to someone born in 1891 in Jamaica. She could not. But the trying felt important.

She did not put the Bible back in the drawer. She carried it to her own room and set it on her desk, where she could see it when she studied.`,
    question: "Why does Dania move the Bible to her own desk rather than returning it to the drawer?",
    options: [
      "She is afraid her mother will lose it again.",
      "She wants to read all the Bible verses inside it.",
      "She wants to keep it visible — as a presence and a reminder of those who came before.",
      "She plans to research Constance at the library.",
    ],
    correctAnswer: 2,
    explanation: "Moving the Bible to her desk \'where she could see it when she studied\' suggests Dania wants it close — a visible connection to her family\'s history and the lives recorded inside."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the grandmother\'s Bible passage?",
    options: [
      "Frightening and unsettling",
      "Quiet, contemplative, and gently moving",
      "Humorous and playful",
      "Critical of family history",
    ],
    correctAnswer: 1,
    explanation: "The passage is written with quiet care — the careful opening of the Bible, the attempt to imagine Constance, the decision to keep it visible. The tone is contemplative and gently moving."
  },
  {
    id: 6,
    type: "reading",
    passage: `Air Pollution in Jamaica: An Underreported Crisis

When people think of environmental problems in Jamaica, they tend to think of plastic waste, coral reef destruction, or deforestation. Air pollution receives far less attention, yet it is quietly responsible for a significant burden of illness and premature death across the island.

The main sources of air pollution in Jamaica include vehicle emissions, industrial activity, agricultural burning, and dust from construction sites. In Kingston and St. Andrew, where traffic congestion is severe, vehicle exhaust is a constant presence. The older the vehicle fleet, the dirtier the emissions — and Jamaica's roads carry a disproportionately large number of ageing vehicles, many imported as used cars from Japan and North America.

Particulate matter — tiny airborne particles from exhaust, dust, and smoke — is among the most harmful forms of pollution. When inhaled, these particles penetrate deep into the lungs and can enter the bloodstream, contributing to respiratory disease, cardiovascular problems, and in vulnerable populations, premature death. Children, the elderly, and people with existing respiratory conditions are at greatest risk.

Despite these dangers, air quality monitoring in Jamaica remains limited. Without reliable data, it is difficult to quantify the problem fully or to hold emitters accountable. Greater investment in monitoring infrastructure, stricter vehicle emission standards, and incentives for cleaner transportation are among the measures that experts recommend. Air quality is not invisible — but it has remained, for too long, unexamined.`,
    question: "What is the MAIN ARGUMENT of the air pollution passage?",
    options: [
      "Air pollution in Jamaica is caused only by vehicle emissions.",
      "Jamaica should ban the import of used vehicles from Japan and North America.",
      "Air pollution is a serious but underreported health crisis in Jamaica that requires monitoring, stronger standards, and cleaner transportation.",
      "Coral reef destruction is a more serious problem than air pollution in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "The passage covers sources, health impacts, the monitoring gap, and recommended measures. Option C captures the full argument accurately."
  },
  {
    id: 7,
    type: "reading",
    passage: `Air Pollution in Jamaica: An Underreported Crisis

When people think of environmental problems in Jamaica, they tend to think of plastic waste, coral reef destruction, or deforestation. Air pollution receives far less attention, yet it is quietly responsible for a significant burden of illness and premature death across the island.

The main sources of air pollution in Jamaica include vehicle emissions, industrial activity, agricultural burning, and dust from construction sites. In Kingston and St. Andrew, where traffic congestion is severe, vehicle exhaust is a constant presence. The older the vehicle fleet, the dirtier the emissions — and Jamaica's roads carry a disproportionately large number of ageing vehicles, many imported as used cars from Japan and North America.

Particulate matter — tiny airborne particles from exhaust, dust, and smoke — is among the most harmful forms of pollution. When inhaled, these particles penetrate deep into the lungs and can enter the bloodstream, contributing to respiratory disease, cardiovascular problems, and in vulnerable populations, premature death. Children, the elderly, and people with existing respiratory conditions are at greatest risk.

Despite these dangers, air quality monitoring in Jamaica remains limited. Without reliable data, it is difficult to quantify the problem fully or to hold emitters accountable. Greater investment in monitoring infrastructure, stricter vehicle emission standards, and incentives for cleaner transportation are among the measures that experts recommend. Air quality is not invisible — but it has remained, for too long, unexamined.`,
    question: "What is PARTICULATE MATTER, as described in the passage?",
    options: [
      "A type of toxic chemical added to vehicle fuel",
      "Tiny airborne particles from exhaust, dust, and smoke that penetrate the lungs",
      "A monitoring instrument used to measure air quality",
      "A disease caused by exposure to vehicle exhaust",
    ],
    correctAnswer: 1,
    explanation: "The passage defines it: \'tiny airborne particles from exhaust, dust, and smoke\' that \'penetrate deep into the lungs and can enter the bloodstream.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Air Pollution in Jamaica: An Underreported Crisis

When people think of environmental problems in Jamaica, they tend to think of plastic waste, coral reef destruction, or deforestation. Air pollution receives far less attention, yet it is quietly responsible for a significant burden of illness and premature death across the island.

The main sources of air pollution in Jamaica include vehicle emissions, industrial activity, agricultural burning, and dust from construction sites. In Kingston and St. Andrew, where traffic congestion is severe, vehicle exhaust is a constant presence. The older the vehicle fleet, the dirtier the emissions — and Jamaica's roads carry a disproportionately large number of ageing vehicles, many imported as used cars from Japan and North America.

Particulate matter — tiny airborne particles from exhaust, dust, and smoke — is among the most harmful forms of pollution. When inhaled, these particles penetrate deep into the lungs and can enter the bloodstream, contributing to respiratory disease, cardiovascular problems, and in vulnerable populations, premature death. Children, the elderly, and people with existing respiratory conditions are at greatest risk.

Despite these dangers, air quality monitoring in Jamaica remains limited. Without reliable data, it is difficult to quantify the problem fully or to hold emitters accountable. Greater investment in monitoring infrastructure, stricter vehicle emission standards, and incentives for cleaner transportation are among the measures that experts recommend. Air quality is not invisible — but it has remained, for too long, unexamined.`,
    question: "Why does the passage mention that Jamaica imports many USED VEHICLES from Japan and North America?",
    options: [
      "To show that Jamaica has a strong relationship with these countries",
      "To explain that used vehicles tend to produce dirtier emissions, worsening air quality",
      "To argue that Jamaica should manufacture its own vehicles",
      "To show that vehicle imports are the largest source of government revenue",
    ],
    correctAnswer: 1,
    explanation: "The passage links old vehicles to dirty emissions: \'the older the vehicle fleet, the dirtier the emissions\' — and identifies the used vehicle import market as the reason Jamaica\'s fleet is ageing."
  },
  {
    id: 9,
    type: "reading",
    passage: `Air Pollution in Jamaica: An Underreported Crisis

When people think of environmental problems in Jamaica, they tend to think of plastic waste, coral reef destruction, or deforestation. Air pollution receives far less attention, yet it is quietly responsible for a significant burden of illness and premature death across the island.

The main sources of air pollution in Jamaica include vehicle emissions, industrial activity, agricultural burning, and dust from construction sites. In Kingston and St. Andrew, where traffic congestion is severe, vehicle exhaust is a constant presence. The older the vehicle fleet, the dirtier the emissions — and Jamaica's roads carry a disproportionately large number of ageing vehicles, many imported as used cars from Japan and North America.

Particulate matter — tiny airborne particles from exhaust, dust, and smoke — is among the most harmful forms of pollution. When inhaled, these particles penetrate deep into the lungs and can enter the bloodstream, contributing to respiratory disease, cardiovascular problems, and in vulnerable populations, premature death. Children, the elderly, and people with existing respiratory conditions are at greatest risk.

Despite these dangers, air quality monitoring in Jamaica remains limited. Without reliable data, it is difficult to quantify the problem fully or to hold emitters accountable. Greater investment in monitoring infrastructure, stricter vehicle emission standards, and incentives for cleaner transportation are among the measures that experts recommend. Air quality is not invisible — but it has remained, for too long, unexamined.`,
    question: "What does the passage mean by \'hold emitters accountable\'?",
    options: [
      "Charge businesses a fee for the amount of electricity they use",
      "Require those who produce air pollution to face consequences and legal responsibility for their emissions",
      "Ask vehicle owners to voluntarily reduce their driving",
      "Create a national register of all factories in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "To hold emitters accountable means to make those who produce pollution legally responsible — requiring them to reduce emissions or face consequences."
  },
  {
    id: 10,
    type: "reading",
    question: "What does the final sentence — \'Air quality is not invisible — but it has remained, for too long, unexamined\' — suggest?",
    options: [
      "Air pollution is impossible to detect without specialist equipment.",
      "The effects of air pollution are real and observable, but have not received the serious policy attention they deserve.",
      "Scientists have not yet studied air pollution in Jamaica.",
      "The government is about to launch a major air quality programme.",
    ],
    correctAnswer: 1,
    explanation: "The sentence means that air pollution\'s effects are real and visible (in illness rates, smog), but the issue has not been examined, monitored, or addressed with the seriousness it warrants."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The cover was held together by a RUBBER BAND.\" This detail suggests the Bible —",
    options: [
      "had been repaired professionally many times",
      "was very old and worn — its physical state reflecting its age and use",
      "was not a real Bible but a notebook",
      "had been damaged in a flood",
    ],
    correctAnswer: 1,
    explanation: "A rubber band holding a separated cover together suggests the Bible was old and deteriorating — a well-used, aged object with history in its physical wear."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Dania opened it CAREFULLY, the way you might open something that had been waiting.\" The word \'carefully\' suggests —",
    options: [
      "she was afraid the pages would fall out",
      "she treated it with reverence — aware of its age and significance",
      "she was looking for a specific page quickly",
      "she had opened it many times before",
    ],
    correctAnswer: 1,
    explanation: "Opening something \'carefully\' — especially something that \'had been waiting to be opened\' — suggests reverence and awareness of the object\'s fragility and significance."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Air pollution receives far less ATTENTION.\" The word \'attention\' means —",
    options: [
      "scientific research funding",
      "public recognition, concern, and policy focus",
      "media coverage in international newspapers",
      "government regulation and enforcement",
    ],
    correctAnswer: 1,
    explanation: "Attention in this context means recognition, concern, and active focus — air pollution does not receive the public and policy focus it deserves."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Vehicle exhaust is a CONSTANT PRESENCE\" in Kingston. The phrase \'constant presence\' means —",
    options: [
      "it appears only during rush hour",
      "it is always there, uninterrupted and ongoing",
      "it varies significantly by season",
      "it has been measured and documented carefully",
    ],
    correctAnswer: 1,
    explanation: "A constant presence means something that is continuously, uninterruptedly there — vehicle exhaust in Kingston is always in the air, not occasional."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Particles PENETRATE deep into the lungs.\" The word \'penetrate\' means —",
    options: [
      "bounce off the surface of",
      "pass into or through something",
      "cover the outside of something",
      "irritate without entering",
    ],
    correctAnswer: 1,
    explanation: "To penetrate means to pass into or through something — the particles enter deeply into the lung tissue rather than remaining on the surface."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Without reliable DATA, it is difficult to quantify the problem.\" The word \'quantify\' means —",
    options: [
      "ignore or dismiss",
      "solve and fix",
      "measure or express in precise numbers",
      "publicise and communicate",
    ],
    correctAnswer: 2,
    explanation: "To quantify means to measure or express something in numbers — without data, the scale of air pollution cannot be precisely measured."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The JUDGEMENT that mattered most.\" In this context, \'judgement\' means —",
    options: [
      "a legal ruling made by a court",
      "a formal academic assessment",
      "an evaluation or assessment of a person\'s character",
      "a religious ceremony",
    ],
    correctAnswer: 2,
    explanation: "Judgement here means an evaluation of someone\'s character — \'Was faithful\' is a character assessment, the most important thing the writer could say about Constance."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The TRYING felt important.\" What does this suggest about imagination and memory?",
    options: [
      "Dania believes she can succeed in imagining Constance with more effort.",
      "Even unsuccessful attempts to connect with the past have value — the effort itself is meaningful.",
      "Dania plans to research Constance in historical records.",
      "Trying to imagine the past is a waste of time.",
    ],
    correctAnswer: 1,
    explanation: "\'The trying felt important\' suggests that the attempt to connect — even when it fails — is itself meaningful. Empathy and historical imagination have value in the process, not just the result."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"In VULNERABLE populations, particulate matter can cause premature death.\" The word \'vulnerable\' means —",
    options: [
      "large and densely populated",
      "easily harmed or at greater risk of negative outcomes",
      "healthy and resistant to disease",
      "well-resourced and supported",
    ],
    correctAnswer: 1,
    explanation: "Vulnerable means at greater risk of being harmed — children, the elderly, and those with respiratory conditions are more susceptible to the effects of air pollution."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Incentives for CLEANER transportation.\" The word \'incentives\' means —",
    options: [
      "laws that prohibit certain activities",
      "fines imposed for breaking regulations",
      "rewards or advantages offered to encourage a desired behaviour",
      "educational programmes about pollution",
    ],
    correctAnswer: 2,
    explanation: "Incentives are rewards or advantages offered to encourage people to do something — in this context, financial or policy benefits for choosing cleaner vehicles or transport."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The effects of vehicle emissions on public health in Jamaica has been significant.",
      "The effects of vehicle emissions on public health in Jamaica have been significant.",
      "The effects of vehicle emissions on public health in Jamaica is significant.",
      "The effects of vehicle emissions on public health in Jamaica was significant.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'effects,\' which is plural. The correct verb is \'have been.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Dania found the Bible, her mother kept it in a drawer for fifteen years.",
      "By the time Dania found the Bible, her mother had kept it in a drawer for fifteen years.",
      "By the time Dania found the Bible, her mother has kept it in a drawer for fifteen years.",
      "By the time Dania found the Bible, her mother was keeping it in a drawer for fifteen years.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had kept\') is required for an action completed before another past event — the keeping preceded the finding."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although air pollution is serious, it receives far less attention than plastic waste.\'",
    options: [
      "it receives far less attention than plastic waste",
      "Although air pollution is serious",
      "air pollution is serious",
      "far less attention than plastic waste",
    ],
    correctAnswer: 1,
    explanation: "\'Although air pollution is serious\' is the subordinate clause — introduced by \'although\' and unable to stand alone."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Experts recommend monitoring infrastructure, stricter standards, and to offer incentives.",
      "Experts recommend monitoring infrastructure, stricter standards, and cleaner transportation incentives.",
      "Experts recommend monitoring infrastructure, to strengthen standards, and incentives.",
      "Experts recommend monitoring infrastructure, stricter standards, and they recommend incentives.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three noun phrases: monitoring infrastructure, stricter standards, and cleaner transportation incentives."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Dania found the Bible when she was searching for a pen.",
      "Her mother had kept the Bible in a drawer for fifteen years.",
      "The Bible had been kept in a drawer for fifteen years by her mother.",
      "Constance\'s name appeared at the top of the family record.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the Bible\' (subject) receives the action \'had been kept.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The Bible, which contained the family records going back to 1891 had belonged to Great-Aunt Miriam.",
      "The Bible which contained the family records going back to 1891, had belonged to Great-Aunt Miriam.",
      "The Bible, which contained the family records going back to 1891, had belonged to Great-Aunt Miriam.",
      "The Bible which contained the family records going back to 1891 had belonged to Great-Aunt Miriam.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which contained the family records going back to 1891\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "The experts say that air quality monitoring in Jamaica is limited.",
      "The experts said that air quality monitoring in Jamaica was limited.",
      "The experts said that air quality monitoring in Jamaica is limited.",
      "The experts said that air quality monitoring in Jamaica will be limited.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech with a past reporting verb (\'said\'), the present tense (\'is\') shifts back to past (\'was\'). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Opening the Bible carefully, Dania discovered the family names inside the front cover.",
      "Written in cramped handwriting, the names filled the inside front cover of the Bible.",
      "Held together by a rubber band, Dania found the old Bible in her parents\' drawer.",
      "Separated from its spine, the cover of the Bible was held together by a rubber band.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'held together by a rubber band\' should describe the Bible, but the sentence\'s subject is \'Dania\' — implying Dania was held together by a rubber band. The modifier is misplaced."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Air pollution is serious; but it receives less attention than other problems.",
      "Air pollution is serious; however, it receives less attention than other problems.",
      "Air pollution is serious; and many people are not aware of its dangers.",
      "Air pollution; is serious and receives less attention than other problems.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the particles inhaled from vehicle exhaust have the potential to cause harm.",
      "Each of the particles inhaled from vehicle exhaust has the potential to cause harm.",
      "Each of the particles inhaled from vehicle exhaust have been causing harm.",
      "Each of the particles inhaled from vehicle exhaust are causing harm.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The correct verb is \'has.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is essential that Jamaica invests in better air quality monitoring.",
      "It is essential that Jamaica invest in better air quality monitoring.",
      "It is essential that Jamaica invested in better air quality monitoring.",
      "It is essential that Jamaica will invest in better air quality monitoring.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is essential that,\' the subjunctive requires the base form — \'invest,\' not \'invests,\' \'invested,\' or \'will invest.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The main sources of air pollution include vehicle emissions industrial activity and burning.",
      "The main sources of air pollution include vehicle emissions, industrial activity, and burning.",
      "The main sources of air pollution include vehicle emissions, industrial activity and burning.",
      "The main sources of air pollution include, vehicle emissions, industrial activity, and burning.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica must invest in air quality monitoring?",
    options: [
      "Jamaica has many environmental problems that need to be addressed.",
      "Air pollution is harmful to health in many countries.",
      "Without comprehensive air quality monitoring, Jamaica cannot measure the scale of its pollution problem, identify the worst offenders, or design effective policy responses — making monitoring the essential first step in any serious strategy.",
      "The government should do more to protect the environment.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, three-part argument (\'cannot measure, identify, design\'), frames monitoring as foundational (\'the essential first step\'), and uses precise vocabulary — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "resposibility",
      "responsibilty",
      "responsibility",
      "responsability",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is responsibility — r-e-s-p-o-n-s-i-b-i-l-i-t-y."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Dania found the Bible while searching for a pen. Inside the front cover were the names of her ancestors going back to 1891. The earliest name was Constance, with the simple inscription \"Was faithful.\" Jamaica has fourteen parishes, each with its own capital town. Dania moved the Bible to her desk so she could see it while she studied.\'",
    options: [
      "The earliest name was Constance, with the simple inscription \'Was faithful.\'",
      "Inside the front cover were the names of her ancestors going back to 1891.",
      "Jamaica has fourteen parishes, each with its own capital town.",
      "Dania moved the Bible to her desk so she could see it while she studied.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Dania and the family Bible. The sentence about Jamaica\'s parishes is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Air pollution is bad for health in Jamaica.\'",
    options: [
      "Air pollution is very bad for health in Jamaica and many people are affected.",
      "In Jamaica, air pollution from vehicle exhaust, industrial activity, and agricultural burning contributes to respiratory disease, cardiovascular problems, and premature death — yet it remains among the least monitored and least regulated of the island\'s environmental challenges.",
      "Air pollution causes health problems and Jamaica needs to do something about it.",
      "Many people in Jamaica are affected by air pollution and it is a serious problem.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise sources (\'vehicle exhaust, industrial activity, agricultural burning\'), specific health effects (\'respiratory disease, cardiovascular problems, premature death\'), and frames the monitoring gap — transforming a vague claim into a rich analytical statement."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about family history?",
    options: [
      "Some people think old family records are not important, but they are wrong.",
      "Family history is interesting but not everyone cares about it.",
      "While it is true that incomplete records — a name, two words, a date — cannot restore a full life to us, the attempt to imagine across that silence is itself a form of respect for those who lived and were not thought worth recording in full.",
      "Old family records are important even though they do not tell us everything.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the limitation honestly (\'cannot restore a full life\'), then reframes the attempt to imagine as meaningful in itself — \'a form of respect.\' This is the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The Bible was old and had family names in it.\' What is the MOST EFFECTIVE revision?",
    options: [
      "The Bible was very old and it had many family names written inside it.",
      "There were family names written in the old Bible.",
      "The Bible — its cover separated from its spine, held together by a rubber band — contained, inside its front cover, a record of every family member going back to 1891: names, dates, and the brief judgements of those who had loved them.",
      "The old Bible had family names and dates written inside the front cover.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses the passage\'s specific details (cover separated, rubber band), correct structure (appositive dash phrases), and vivid final phrase (\'brief judgements of those who had loved them\') — transforming a flat statement into a rich one."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of preserving family records?",
    options: [
      "It is important to keep old family documents safe.",
      "Many families have old Bibles and documents that contain family history.",
      "The names in an old Bible are not merely a list — they are the proof that lives were lived, that people were loved and judged and remembered, and that the family you belong to stretches further back than you can easily imagine.",
      "Old family records should be kept in a safe place so they are not lost.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically rich, builds to a powerful three-part claim (\'lives were lived, people were loved and judged and remembered\'), and ends with a resonant statement about belonging and depth — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the purpose of a TOPIC SENTENCE in a paragraph?",
    options: [
      "To provide specific evidence that supports the paragraph\'s argument",
      "To end the paragraph with a memorable final thought",
      "To state the paragraph\'s main idea clearly so the reader knows what to expect",
      "To introduce a counterargument that will be refuted",
    ],
    correctAnswer: 2,
    explanation: "A topic sentence states the paragraph\'s main idea — it tells the reader what the paragraph is about and sets up everything that follows. Option C correctly identifies this function."
  }
]

export default function LiteracyMixed3MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed3Questions : literacyMixed3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 3</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 3</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 3 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 3</h1>
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
