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

const literacyDifficult9Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Cartographer's Daughter

Miriam's father had spent thirty years making maps. Not digital maps — hand-drawn ones, with ink and compass and a patience that Miriam had always found slightly puzzling and slightly admirable. He mapped parishes, surveyed coastlines, drew in the places that GPS systems forgot: the unmarked paths, the seasonal streams, the fields with no official name that everyone in the district called by their own names anyway.

When he died, Miriam inherited seven hundred and forty-three maps. She spread them across the living room floor and looked at them for a long time. They were not simply geographical records. They were, she realised, a kind of autobiography: the routes her father had walked, the places he had returned to again and again, the ones that received extra care in the detail of their coastlines or the naming of their hills.

Some maps showed the same area across different decades. She could see a village expand along a road, a river change its course slightly, a forest thin. Each map was a snapshot of a world in motion, and together they told a story the individual maps could not tell alone.

Miriam was a novelist. She had always thought of her work and her father's as entirely different — hers imaginary, his factual. But holding these maps, she understood something she had not expected: they were both cartographers. Her father mapped the visible world. She mapped the interior one — the country of feeling and memory and the unnamed things that shape a life. Different scales. The same impulse.`,
    question: "What does Miriam discover when she looks at the maps her father left behind?",
    options: [
      "She discovers that her father had made several cartographic errors she must correct.",
      "She discovers the maps are too damaged to be preserved and must be scanned.",
      "She discovers that the maps are not merely geographical records but a kind of autobiography — revealing the places her father valued and returned to.",
      "She discovers that her father had mapped the same area only once in his life.",
    ],
    correctAnswer: 2,
    explanation: "The passage says Miriam realises the maps were \'a kind of autobiography: the routes her father had walked, the places he had returned to again and again.\' The maps reveal a personal, emotional geography."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Cartographer's Daughter

Miriam's father had spent thirty years making maps. Not digital maps — hand-drawn ones, with ink and compass and a patience that Miriam had always found slightly puzzling and slightly admirable. He mapped parishes, surveyed coastlines, drew in the places that GPS systems forgot: the unmarked paths, the seasonal streams, the fields with no official name that everyone in the district called by their own names anyway.

When he died, Miriam inherited seven hundred and forty-three maps. She spread them across the living room floor and looked at them for a long time. They were not simply geographical records. They were, she realised, a kind of autobiography: the routes her father had walked, the places he had returned to again and again, the ones that received extra care in the detail of their coastlines or the naming of their hills.

Some maps showed the same area across different decades. She could see a village expand along a road, a river change its course slightly, a forest thin. Each map was a snapshot of a world in motion, and together they told a story the individual maps could not tell alone.

Miriam was a novelist. She had always thought of her work and her father's as entirely different — hers imaginary, his factual. But holding these maps, she understood something she had not expected: they were both cartographers. Her father mapped the visible world. She mapped the interior one — the country of feeling and memory and the unnamed things that shape a life. Different scales. The same impulse.`,
    question: "What does the detail that the maps showed \'the same area across different decades\' allow Miriam to see?",
    options: [
      "That her father made many mistakes and corrected them over time.",
      "That certain areas of Jamaica were more important to map than others.",
      "That the world is in constant motion — villages expand, rivers shift, forests thin — and maps together tell a story no single map can tell alone.",
      "That her father\'s mapping technique improved significantly over thirty years.",
    ],
    correctAnswer: 2,
    explanation: "By comparing maps of the same area across decades, Miriam sees change over time: \'a village expand, a river change course, a forest thin.\' Individual maps are snapshots; together they narrate change."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Cartographer's Daughter

Miriam's father had spent thirty years making maps. Not digital maps — hand-drawn ones, with ink and compass and a patience that Miriam had always found slightly puzzling and slightly admirable. He mapped parishes, surveyed coastlines, drew in the places that GPS systems forgot: the unmarked paths, the seasonal streams, the fields with no official name that everyone in the district called by their own names anyway.

When he died, Miriam inherited seven hundred and forty-three maps. She spread them across the living room floor and looked at them for a long time. They were not simply geographical records. They were, she realised, a kind of autobiography: the routes her father had walked, the places he had returned to again and again, the ones that received extra care in the detail of their coastlines or the naming of their hills.

Some maps showed the same area across different decades. She could see a village expand along a road, a river change its course slightly, a forest thin. Each map was a snapshot of a world in motion, and together they told a story the individual maps could not tell alone.

Miriam was a novelist. She had always thought of her work and her father's as entirely different — hers imaginary, his factual. But holding these maps, she understood something she had not expected: they were both cartographers. Her father mapped the visible world. She mapped the interior one — the country of feeling and memory and the unnamed things that shape a life. Different scales. The same impulse.`,
    question: "What insight does Miriam reach about the relationship between her work and her father\'s?",
    options: [
      "She realises her father\'s work was more valuable and accurate than her own.",
      "She understands that they were both cartographers — one mapping the visible external world, the other mapping the internal world of feeling and memory.",
      "She decides to give up writing novels and become a cartographer instead.",
      "She recognises that maps and novels have nothing meaningful in common.",
    ],
    correctAnswer: 1,
    explanation: "The passage\'s climax is Miriam\'s insight: \'They were both cartographers. Her father mapped the visible world. She mapped the interior one.\' They share the same fundamental impulse despite different scales and subjects."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Cartographer's Daughter

Miriam's father had spent thirty years making maps. Not digital maps — hand-drawn ones, with ink and compass and a patience that Miriam had always found slightly puzzling and slightly admirable. He mapped parishes, surveyed coastlines, drew in the places that GPS systems forgot: the unmarked paths, the seasonal streams, the fields with no official name that everyone in the district called by their own names anyway.

When he died, Miriam inherited seven hundred and forty-three maps. She spread them across the living room floor and looked at them for a long time. They were not simply geographical records. They were, she realised, a kind of autobiography: the routes her father had walked, the places he had returned to again and again, the ones that received extra care in the detail of their coastlines or the naming of their hills.

Some maps showed the same area across different decades. She could see a village expand along a road, a river change its course slightly, a forest thin. Each map was a snapshot of a world in motion, and together they told a story the individual maps could not tell alone.

Miriam was a novelist. She had always thought of her work and her father's as entirely different — hers imaginary, his factual. But holding these maps, she understood something she had not expected: they were both cartographers. Her father mapped the visible world. She mapped the interior one — the country of feeling and memory and the unnamed things that shape a life. Different scales. The same impulse.`,
    question: "What is the TONE of the passage about Miriam and her father?",
    options: [
      "Dramatic and suspenseful",
      "Quiet, reflective, and intellectually tender",
      "Angry and accusatory",
      "Comic and ironic",
    ],
    correctAnswer: 1,
    explanation: "The passage is slow-paced, inward, and characterised by Miriam\'s quiet contemplation of the maps. The relationship between father and daughter is explored with care and intelligence. The tone is quiet, reflective, and intellectually tender."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Cartographer's Daughter

Miriam's father had spent thirty years making maps. Not digital maps — hand-drawn ones, with ink and compass and a patience that Miriam had always found slightly puzzling and slightly admirable. He mapped parishes, surveyed coastlines, drew in the places that GPS systems forgot: the unmarked paths, the seasonal streams, the fields with no official name that everyone in the district called by their own names anyway.

When he died, Miriam inherited seven hundred and forty-three maps. She spread them across the living room floor and looked at them for a long time. They were not simply geographical records. They were, she realised, a kind of autobiography: the routes her father had walked, the places he had returned to again and again, the ones that received extra care in the detail of their coastlines or the naming of their hills.

Some maps showed the same area across different decades. She could see a village expand along a road, a river change its course slightly, a forest thin. Each map was a snapshot of a world in motion, and together they told a story the individual maps could not tell alone.

Miriam was a novelist. She had always thought of her work and her father's as entirely different — hers imaginary, his factual. But holding these maps, she understood something she had not expected: they were both cartographers. Her father mapped the visible world. She mapped the interior one — the country of feeling and memory and the unnamed things that shape a life. Different scales. The same impulse.`,
    question: "The phrase \'the country of feeling and memory and the unnamed things that shape a life\' uses the word \'country\' to mean —",
    options: [
      "the nation of Jamaica",
      "a physical territory with defined borders",
      "a metaphorical interior space or domain — the emotional and psychological landscape a novelist explores",
      "the countryside or rural areas outside cities",
    ],
    correctAnswer: 2,
    explanation: "\'Country\' is used metaphorically here — not as a geographical nation but as an interior landscape. Miriam maps the inner human experience the way her father mapped the physical world."
  },
  {
    id: 6,
    type: "reading",
    passage: `Social Media and Young People: The Evidence So Far

Few topics generate more heat and less light than the debate about social media's effects on young people. Alarmist headlines compete with industry-funded reassurances, and parents, educators, and policymakers are left navigating a genuinely uncertain landscape. What does the evidence actually suggest?

The clearest signal comes from studies of heavy social media use — defined roughly as more than three hours daily. Adolescents in this category report higher rates of anxiety, loneliness, and poor sleep compared to lighter users. The relationship, however, is correlational rather than causal: it is not fully clear whether social media causes these problems or whether young people who are already anxious and lonely are more likely to seek connection through screens. Disentangling cause and effect remains one of the field's central methodological challenges.

Some research suggests that the effects of social media are not uniform. The platform matters. The purpose matters. Passive consumption — scrolling without interaction — appears to correlate more strongly with negative outcomes than active engagement — commenting, creating, connecting. Girls appear more vulnerable than boys to image-based platforms, likely due to stronger social comparison tendencies. Age matters too: twelve and thirteen-year-olds show more pronounced effects than older teenagers.

Rather than treating social media as uniformly harmful or uniformly beneficial, a more productive approach may be to ask under what conditions and for which young people it is helpful or harmful. This requires better research, better digital literacy education, and platforms willing to design for wellbeing rather than purely for engagement. None of these are impossible. Most are simply not yet a priority.`,
    question: "What is the MAIN POINT of the passage about social media and young people?",
    options: [
      "Social media is universally harmful to all young people and should be banned.",
      "The evidence about social media\'s effects is complex and varies by platform, purpose, age, and gender — and the most productive approach asks under what conditions it is harmful or helpful.",
      "Social media companies are dishonest and cannot be trusted.",
      "Parents are the only people who can protect young people from social media.",
    ],
    correctAnswer: 1,
    explanation: "The passage resists simple conclusions — \'alarmist headlines\' and \'industry-funded reassurances\' are both rejected. The main point is that effects vary by condition, and the right question is \'under what conditions and for which young people.\'"
  },
  {
    id: 7,
    type: "reading",
    passage: `Social Media and Young People: The Evidence So Far

Few topics generate more heat and less light than the debate about social media's effects on young people. Alarmist headlines compete with industry-funded reassurances, and parents, educators, and policymakers are left navigating a genuinely uncertain landscape. What does the evidence actually suggest?

The clearest signal comes from studies of heavy social media use — defined roughly as more than three hours daily. Adolescents in this category report higher rates of anxiety, loneliness, and poor sleep compared to lighter users. The relationship, however, is correlational rather than causal: it is not fully clear whether social media causes these problems or whether young people who are already anxious and lonely are more likely to seek connection through screens. Disentangling cause and effect remains one of the field's central methodological challenges.

Some research suggests that the effects of social media are not uniform. The platform matters. The purpose matters. Passive consumption — scrolling without interaction — appears to correlate more strongly with negative outcomes than active engagement — commenting, creating, connecting. Girls appear more vulnerable than boys to image-based platforms, likely due to stronger social comparison tendencies. Age matters too: twelve and thirteen-year-olds show more pronounced effects than older teenagers.

Rather than treating social media as uniformly harmful or uniformly beneficial, a more productive approach may be to ask under what conditions and for which young people it is helpful or harmful. This requires better research, better digital literacy education, and platforms willing to design for wellbeing rather than purely for engagement. None of these are impossible. Most are simply not yet a priority.`,
    question: "What does the passage mean by \'the relationship is correlational rather than causal\'?",
    options: [
      "The research was conducted by a company with a conflict of interest.",
      "Social media use and anxiety occur together, but it is not proven that one causes the other — they may both be caused by a third factor.",
      "Correlation means the relationship has been proven beyond doubt.",
      "Young people who use social media for more than three hours show no negative effects.",
    ],
    correctAnswer: 1,
    explanation: "Correlational means two things occur together, but causation (one causing the other) has not been established. Anxious young people may use social media more, rather than social media making them anxious — or both may be caused by a third factor."
  },
  {
    id: 8,
    type: "reading",
    passage: `Social Media and Young People: The Evidence So Far

Few topics generate more heat and less light than the debate about social media's effects on young people. Alarmist headlines compete with industry-funded reassurances, and parents, educators, and policymakers are left navigating a genuinely uncertain landscape. What does the evidence actually suggest?

The clearest signal comes from studies of heavy social media use — defined roughly as more than three hours daily. Adolescents in this category report higher rates of anxiety, loneliness, and poor sleep compared to lighter users. The relationship, however, is correlational rather than causal: it is not fully clear whether social media causes these problems or whether young people who are already anxious and lonely are more likely to seek connection through screens. Disentangling cause and effect remains one of the field's central methodological challenges.

Some research suggests that the effects of social media are not uniform. The platform matters. The purpose matters. Passive consumption — scrolling without interaction — appears to correlate more strongly with negative outcomes than active engagement — commenting, creating, connecting. Girls appear more vulnerable than boys to image-based platforms, likely due to stronger social comparison tendencies. Age matters too: twelve and thirteen-year-olds show more pronounced effects than older teenagers.

Rather than treating social media as uniformly harmful or uniformly beneficial, a more productive approach may be to ask under what conditions and for which young people it is helpful or harmful. This requires better research, better digital literacy education, and platforms willing to design for wellbeing rather than purely for engagement. None of these are impossible. Most are simply not yet a priority.`,
    question: "According to the passage, which type of social media use correlates MORE STRONGLY with negative outcomes?",
    options: [
      "Active engagement — commenting, creating, and connecting with others",
      "Passive consumption — scrolling without meaningful interaction",
      "Using social media for educational purposes",
      "Using social media during school hours",
    ],
    correctAnswer: 1,
    explanation: "The passage states: \'Passive consumption — scrolling without interaction — appears to correlate more strongly with negative outcomes than active engagement — commenting, creating, connecting.\'"
  },
  {
    id: 9,
    type: "reading",
    question: "What does the passage mean by \'generating more heat than light\'?",
    options: [
      "The debate produces a great deal of emotion and noise but relatively little genuine understanding or evidence.",
      "Social media platforms use a great deal of electrical energy.",
      "The debate about social media has been going on for a very long time.",
      "Social media companies spend a great deal of money on advertising.",
    ],
    correctAnswer: 0,
    explanation: "\'Generating heat but not light\' is an idiom for a debate that produces strong emotion and argument without illuminating the actual truth. The passage suggests the social media debate is characterised by alarm rather than evidence."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the social media passage?",
    options: [
      "Alarmed and panicked",
      "Measured, evidentially cautious, and analytically critical",
      "Dismissive of research",
      "Enthusiastic about social media\'s potential",
    ],
    correctAnswer: 1,
    explanation: "The passage carefully evaluates evidence, acknowledges uncertainty (\'not fully clear\'), distinguishes correlation from causation, and resists extreme positions. The tone is measured, evidentially cautious, and analytically critical."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"They were, she realised, a kind of AUTOBIOGRAPHY.\" The word \'autobiography\' means —",
    options: [
      "a book written about another person\'s life",
      "a story of one\'s own life told through one\'s own words or actions",
      "a formal geographical record",
      "a collection of letters and documents",
    ],
    correctAnswer: 1,
    explanation: "An autobiography is the story of a person\'s own life, told by themselves. Miriam sees the maps as a self-told story of her father\'s life — where he went, what he valued."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Each map was a SNAPSHOT of a world in motion.\" The word \'snapshot\' is used here to mean —",
    options: [
      "a photograph taken with a camera",
      "a fixed moment of capture that preserves one instant of an ongoing process",
      "a quick and inaccurate summary",
      "a small section of a larger document",
    ],
    correctAnswer: 1,
    explanation: "\'Snapshot\' means a fixed record of a single moment — here, each map captures one moment of a continuously changing landscape."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"DISENTANGLING cause and effect remains one of the field\'s central methodological challenges.\" The word \'disentangling\' means —",
    options: [
      "creating a connection between two separate things",
      "separating things that are twisted or confused together to clarify their relationship",
      "proving that two things are completely unrelated",
      "designing a new research study",
    ],
    correctAnswer: 1,
    explanation: "To disentangle means to separate things that are intertwined or confused — to work out which factor causes which when they occur together."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Passive CONSUMPTION — scrolling without interaction.\" In this context, \'consumption\' means —",
    options: [
      "spending money on products",
      "eating and drinking at a meal",
      "taking in content without actively engaging or contributing",
      "using a device for too long",
    ],
    correctAnswer: 2,
    explanation: "Consumption here means the passive intake or reception of content — watching or scrolling without interacting, creating, or engaging meaningfully."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Girls appear more VULNERABLE than boys to image-based platforms.\" The word \'vulnerable\' means —",
    options: [
      "more interested in",
      "more technically skilled with",
      "more easily harmed or negatively affected by",
      "more likely to use frequently",
    ],
    correctAnswer: 2,
    explanation: "Vulnerable means susceptible to being harmed — girls are described as more easily negatively affected by image-based platforms, likely due to social comparison."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"A more productive approach may be to ask UNDER WHAT CONDITIONS social media is harmful.\" The phrase \'under what conditions\' means —",
    options: [
      "at what time of day social media is used",
      "in what specific circumstances or situations",
      "with what kind of device",
      "at what level of intensity",
    ],
    correctAnswer: 1,
    explanation: "\'Under what conditions\' means in what specific circumstances or situations — the question is not whether social media is harmful, but when and for whom it is."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Platforms willing to DESIGN FOR WELLBEING rather than purely for engagement.\" The phrase \'design for wellbeing\' means —",
    options: [
      "making platforms visually attractive and easy to navigate",
      "building platforms with the users\' mental and physical health as a primary goal, not just keeping them online longer",
      "reducing the number of features available on a platform",
      "making platforms available in multiple languages",
    ],
    correctAnswer: 1,
    explanation: "\'Design for wellbeing\' means making design choices with users\' health and flourishing as the priority — contrasted with designing purely for engagement (keeping users online as long as possible)."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Miriam realised that she and her father shared \'the SAME IMPULSE\' despite different work. The word \'impulse\' here means —",
    options: [
      "an electrical signal",
      "a sudden uncontrolled action",
      "a fundamental drive or motivation underlying their different activities",
      "a physical force or energy",
    ],
    correctAnswer: 2,
    explanation: "Impulse here means a deep, underlying drive or motivation. Both Miriam and her father were driven to map — to record, to preserve, to understand — just in different domains."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The unmarked paths, the seasonal streams, the fields with NO OFFICIAL NAME that everyone in the district called by their own names anyway.\" What does this detail suggest?",
    options: [
      "Official maps are always more accurate than unofficial ones.",
      "There is a gap between what official records recognise and what communities actually know and name — lived geography exceeds official geography.",
      "Seasonal streams should not appear on professional maps.",
      "People in rural areas prefer not to use official names.",
    ],
    correctAnswer: 1,
    explanation: "The detail captures the difference between official cartography and lived local knowledge. Communities have names for places that official records ignore — pointing to the limits of formal documentation."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Rather than treating social media as UNIFORMLY harmful or beneficial.\" The word \'uniformly\' means —",
    options: [
      "occasionally and in specific circumstances",
      "in all cases and without exception",
      "in a fair and balanced manner",
      "at all times of the day",
    ],
    correctAnswer: 1,
    explanation: "Uniformly means without variation or exception — in all cases. The passage argues social media should not be treated as harmful or beneficial in every single instance, regardless of context."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The effects of social media on adolescent wellbeing is still being studied.",
      "The effects of social media on adolescent wellbeing are still being studied.",
      "The effects of social media on adolescent wellbeing was still being studied.",
      "The effects of social media on adolescent wellbeing has been still being studied.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'effects,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "Miriam spread the maps across the floor and realised she never thought about them as autobiographies.",
      "Miriam spread the maps across the floor and realised she had never thought about them as autobiographies.",
      "Miriam spread the maps across the floor and realised she has never thought about them as autobiographies.",
      "Miriam spread the maps across the floor and realised she was never thinking about them as autobiographies.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had never thought\') is required because this reflects a state prior to the moment of spreading the maps — a completed absence of thought before that moment."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although the research on social media is growing, cause and effect remain difficult to establish.\'",
    options: [
      "cause and effect remain difficult to establish",
      "Although the research on social media is growing",
      "the research on social media is growing",
      "remain difficult to establish",
    ],
    correctAnswer: 1,
    explanation: "\'Although the research on social media is growing\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Better research, improving digital literacy, and platforms willing to change are all needed.",
      "Better research, better digital literacy education, and platforms willing to design for wellbeing are all needed.",
      "Better research, digital literacy that improves, and platforms willing to change are all needed.",
      "Better research, digital literacy education, and platforms needing to change are all needed.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses three noun phrases of consistent structure: \'better research,\' \'better digital literacy education,\' and \'platforms willing to design for wellbeing.\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Miriam inherited seven hundred and forty-three maps from her father.",
      "Her father drew the maps by hand with ink and compass.",
      "The maps were drawn by hand with ink and compass over thirty years.",
      "Miriam spread the maps across the living room floor.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the maps\' (subject) receives the action \'were drawn.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Social media platforms, which are designed primarily for engagement have been linked to poor mental health outcomes.",
      "Social media platforms which are designed primarily for engagement, have been linked to poor mental health outcomes.",
      "Social media platforms, which are designed primarily for engagement, have been linked to poor mental health outcomes.",
      "Social media platforms, which are designed primarily for engagement have been linked, to poor mental health outcomes.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which are designed primarily for engagement\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "The researcher said that social media causes anxiety in adolescents.",
      "The researcher said that social media caused anxiety in adolescents.",
      "The researcher said that social media will cause anxiety in adolescents.",
      "The researcher said that social media had caused anxiety in adolescents always.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense (\'causes\') shifts back to past (\'caused\'). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Having spread the maps across the floor, Miriam began to see them differently.",
      "Looking carefully at the coastlines, Miriam noticed her father\'s extra care.",
      "Drawn over thirty years, the maps revealed her father\'s entire working life.",
      "Studying the maps carefully, a new understanding occurred to Miriam about her own work.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'studying the maps carefully\' should describe Miriam, but the sentence\'s subject is \'a new understanding\' — understanding cannot study maps. The modifier dangles."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Some maps showed one area; but others showed completely different regions.",
      "Some maps showed one area; however, others showed completely different regions.",
      "Some maps showed one area; and these were the most detailed.",
      "Some maps showed one area; they being her father\'s favourites.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is a correct construction. Semicolons should not precede coordinating conjunctions like \'but\' and \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "The question of which young people are most harmed by social media have not been answered.",
      "The question of which young people are most harmed by social media has not been answered.",
      "The question of which young people are most harmed by social media were not been answered.",
      "The question of which young people are most harmed by social media have been not answered.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the question,\' which is singular. The correct verb is \'has not been answered.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is necessary that the platforms prioritises users\' wellbeing over engagement metrics.",
      "It is necessary that the platforms prioritise users\' wellbeing over engagement metrics.",
      "It is necessary that the platforms prioritised users\' wellbeing over engagement metrics.",
      "It is necessary that the platforms will prioritise users\' wellbeing over engagement metrics.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is necessary that,\' the subjunctive requires the base form of the verb — \'prioritise,\' not \'prioritises,\' \'prioritised,\' or \'will prioritise.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "Miriam noticed two things immediately: the scale of the collection and the care in each map.",
      "Miriam noticed: two things immediately the scale of the collection and the care in each map.",
      "Miriam noticed two things: immediately the scale of the collection and the care in each map.",
      "Miriam noticed two things immediately the scale: of the collection and the care in each map.",
    ],
    correctAnswer: 0,
    explanation: "A colon follows a complete clause to introduce a list or elaboration. \'Miriam noticed two things immediately\' is complete, and the colon correctly introduces the two things."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that social media companies must redesign their platforms to protect young users?",
    options: [
      "Many young people use social media for several hours every day.",
      "Research shows a correlation between heavy social media use and anxiety in adolescents.",
      "Social media companies, which have engineered their platforms for maximum engagement rather than user wellbeing, bear a direct responsibility for the documented harm to young people\'s mental health — and must be held accountable for redesigning their systems accordingly.",
      "Young people need to be taught how to use social media more responsibly.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, specific claim (\'direct responsibility\'), identifies the mechanism of harm (\'engineered for maximum engagement\'), and states a concrete demand (\'redesigning their systems\') — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'Miriam realised that her work was like her father\'s even though they seemed different.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Miriam realised that her work as a novelist was similar to her father\'s work as a cartographer even though they seemed different.",
      "At first Miriam thought her work and her father\'s were very different, but then she realised they were alike.",
      "Holding her father\'s maps, Miriam understood that both she and he were cartographers — one charting the geography of land, the other the unmapped terrain of memory and feeling — driven by the same fundamental impulse to record what is real.",
      "Miriam realised that writing and map-making were more similar than she had originally thought.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise language (\'unmapped terrain of memory and feeling,\' \'fundamental impulse\'), the language of the passage (\'cartographers,\' \'charting\'), and a rhythmic contrast between father and daughter."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Social media is bad for teenagers in some ways but not in others.\'",
    options: [
      "Social media has some bad effects on teenagers and some good effects depending on different things.",
      "Social media can be bad or good for teenagers.",
      "The effects of social media on adolescents are neither uniformly harmful nor uniformly beneficial — they vary significantly by platform, purpose, intensity of use, and the individual characteristics of the user.",
      "Teenagers experience social media differently and it is not always bad.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise academic vocabulary (\'uniformly,\' \'intensity of use\'), identifies four specific variables, and transforms a vague observation into an analytically precise claim."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Miriam had always thought of map-making as entirely factual and novel-writing as entirely imaginary. Her father\'s maps revealed a deeply personal geography — places he valued, returned to, and drew with extra care. Jamaica is divided into fourteen parishes, each with its own administrative centre. Together, the maps told a story no single map could tell alone.\'",
    options: [
      "Miriam had always thought of map-making as entirely factual and novel-writing as entirely imaginary.",
      "Her father\'s maps revealed a deeply personal geography — places he valued, returned to, and drew with extra care.",
      "Jamaica is divided into fourteen parishes, each with its own administrative centre.",
      "Together, the maps told a story no single map could tell alone.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Miriam\'s personal insight regarding the maps and their meaning. The sentence about Jamaica\'s administrative geography is factually accurate but completely off-topic."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in a discussion of social media?",
    options: [
      "Social media has some positives, but the negatives are much worse.",
      "Some people think social media is fine for young people, but research proves them wrong.",
      "While active, purposeful social media use — connecting with peers, creating content, participating in communities — can support young people\'s social and creative development, the design of most commercial platforms prioritises passive consumption, which the evidence links to measurably worse outcomes.",
      "Social media can be used well or badly, and it depends on the person.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes that purposeful use can be beneficial (\'support young people\'s social and creative development\'), then pivots to the problem of platform design — honest, specific, and logically structured."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The maps were interesting and showed lots of things about Jamaica.\' What is the MOST PRECISE revision?",
    options: [
      "The maps were interesting and showed many different things about Jamaica and its geography.",
      "Miriam\'s father\'s maps were interesting because they showed things about Jamaica.",
      "Laid across the living room floor, the maps formed a layered record of Jamaica\'s changing landscape — rivers shifting course, forests thinning, villages growing along new roads — each decade adding another stratum to the island\'s documentary history.",
      "The maps were very interesting and told a lot about Jamaica over many years.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'layered record,\' \'stratum,\' \'documentary history\'), specific detail (\'rivers shifting course, forests thinning\'), and creates a vivid image of the maps as collective record."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about maps as autobiography?",
    options: [
      "Maps are useful tools that help us navigate unfamiliar places.",
      "Miriam\'s father made many maps over his thirty-year career.",
      "A map drawn by hand is not only a record of the world as it was — it is a record of the attention, the preference, and the particular human life that chose to look at that piece of earth and say: this matters.",
      "The maps Miriam inherited were important to her because they helped her understand her father.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophical and resonant — it defines what makes a hand-drawn map meaningful (\'the attention, the preference, the particular human life\'), and ends with a powerful, direct statement (\'this matters\') that elevates the close."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the technique of USING SPECIFIC EXAMPLES to support a claim?",
    options: [
      "Adding more sentences to a paragraph to make it longer",
      "Restating the same idea in different words several times",
      "Providing concrete, particular instances that make the claim vivid, believable, and harder to dismiss",
      "Using statistics from official sources to replace personal opinion",
    ],
    correctAnswer: 2,
    explanation: "Specific examples work because they ground abstract claims in concrete reality — making arguments more vivid, believable, and difficult to refute. Option C correctly identifies this function."
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

export default function LiteracyDifficult9Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult9Questions : literacyDifficult9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 9</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 9</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 9 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 9</h1>
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
