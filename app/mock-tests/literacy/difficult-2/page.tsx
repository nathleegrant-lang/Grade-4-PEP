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

const literacyDifficult2Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Last Cane Cutter

Old Desmond rose before the sun. He had done this every day of his working life — sixty-one years in the cane fields of Westmoreland — and even now, with his back curved like a question mark and his hands mapped with calluses, the habit held him like a rope.

The factory had closed two years ago. The machines had come and gone in the same decade, and now the fields themselves were shrinking, sold off in parcels for hotels and housing schemes. Desmond watched from his gate each morning as trucks carried away the earth he had bent himself double over.

His granddaughter, Simone, had tried to explain it to him once. "Global prices fell, Grandpa. It's not the same world." Desmond had nodded, though he was not sure the world's prices had anything to do with what he felt when he watched the last field go under a bulldozer.

He still kept his machete sharp. He oiled it on Sundays, the way other men might tend a garden or shine their shoes. His wife thought it was stubbornness. But Desmond knew it was something else — a refusal to let the loss be complete. As long as the machete held its edge, some part of the old world remained.

One morning, Simone found him on the back step, the machete across his lap, looking out at nothing.

"You miss it," she said. It was not a question.

"I miss knowing what I was," he said.`,
    question: "What does the detail that Desmond \'still kept his machete sharp\' MOST suggest about his character?",
    options: [
      "He is preparing to return to the cane fields very soon.",
      "He refuses to let the loss of his working life erase who he is.",
      "He is angry at the factory owners and wants revenge.",
      "He is too old to understand that the cane industry is finished.",
    ],
    correctAnswer: 1,
    explanation: "Desmond himself explains it: \'a refusal to let the loss be complete.\' The sharpened machete is a symbol of his identity and dignity, not a practical tool."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Last Cane Cutter

Old Desmond rose before the sun. He had done this every day of his working life — sixty-one years in the cane fields of Westmoreland — and even now, with his back curved like a question mark and his hands mapped with calluses, the habit held him like a rope.

The factory had closed two years ago. The machines had come and gone in the same decade, and now the fields themselves were shrinking, sold off in parcels for hotels and housing schemes. Desmond watched from his gate each morning as trucks carried away the earth he had bent himself double over.

His granddaughter, Simone, had tried to explain it to him once. "Global prices fell, Grandpa. It's not the same world." Desmond had nodded, though he was not sure the world's prices had anything to do with what he felt when he watched the last field go under a bulldozer.

He still kept his machete sharp. He oiled it on Sundays, the way other men might tend a garden or shine their shoes. His wife thought it was stubbornness. But Desmond knew it was something else — a refusal to let the loss be complete. As long as the machete held its edge, some part of the old world remained.

One morning, Simone found him on the back step, the machete across his lap, looking out at nothing.

"You miss it," she said. It was not a question.

"I miss knowing what I was," he said.`,
    question: "The phrase \'his back curved like a question mark\' is an example of —",
    options: [
      "personification",
      "onomatopoeia",
      "a simile",
      "alliteration",
    ],
    correctAnswer: 2,
    explanation: "A simile makes a comparison using \'like\' or \'as.\' The sentence compares the shape of Desmond\'s back to a question mark using the word \'like.\'"
  },
  {
    id: 3,
    type: "reading",
    passage: `The Last Cane Cutter

Old Desmond rose before the sun. He had done this every day of his working life — sixty-one years in the cane fields of Westmoreland — and even now, with his back curved like a question mark and his hands mapped with calluses, the habit held him like a rope.

The factory had closed two years ago. The machines had come and gone in the same decade, and now the fields themselves were shrinking, sold off in parcels for hotels and housing schemes. Desmond watched from his gate each morning as trucks carried away the earth he had bent himself double over.

His granddaughter, Simone, had tried to explain it to him once. "Global prices fell, Grandpa. It's not the same world." Desmond had nodded, though he was not sure the world's prices had anything to do with what he felt when he watched the last field go under a bulldozer.

He still kept his machete sharp. He oiled it on Sundays, the way other men might tend a garden or shine their shoes. His wife thought it was stubbornness. But Desmond knew it was something else — a refusal to let the loss be complete. As long as the machete held its edge, some part of the old world remained.

One morning, Simone found him on the back step, the machete across his lap, looking out at nothing.

"You miss it," she said. It was not a question.

"I miss knowing what I was," he said.`,
    question: "What is the EFFECT of ending the passage with Desmond\'s words: \'I miss knowing what I was\'?",
    options: [
      "It shows that Desmond cannot remember his own name.",
      "It reveals that the real loss is not the job itself, but his sense of identity and purpose.",
      "It suggests Desmond wants Simone to find him a new career.",
      "It proves that Desmond was never really happy in the cane fields.",
    ],
    correctAnswer: 1,
    explanation: "The line shifts the passage from external loss (the fields, the factory) to internal loss — Desmond mourns not just work but the self that work gave him. This is the emotional core of the passage."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Last Cane Cutter

Old Desmond rose before the sun. He had done this every day of his working life — sixty-one years in the cane fields of Westmoreland — and even now, with his back curved like a question mark and his hands mapped with calluses, the habit held him like a rope.

The factory had closed two years ago. The machines had come and gone in the same decade, and now the fields themselves were shrinking, sold off in parcels for hotels and housing schemes. Desmond watched from his gate each morning as trucks carried away the earth he had bent himself double over.

His granddaughter, Simone, had tried to explain it to him once. "Global prices fell, Grandpa. It's not the same world." Desmond had nodded, though he was not sure the world's prices had anything to do with what he felt when he watched the last field go under a bulldozer.

He still kept his machete sharp. He oiled it on Sundays, the way other men might tend a garden or shine their shoes. His wife thought it was stubbornness. But Desmond knew it was something else — a refusal to let the loss be complete. As long as the machete held its edge, some part of the old world remained.

One morning, Simone found him on the back step, the machete across his lap, looking out at nothing.

"You miss it," she said. It was not a question.

"I miss knowing what I was," he said.`,
    question: "What is the TONE of this passage?",
    options: [
      "Angry and bitter",
      "Quiet, reflective, and melancholy",
      "Excited and hopeful",
      "Humorous and light",
    ],
    correctAnswer: 1,
    explanation: "The language is gentle and sorrowful throughout — \'the habit held him like a rope,\' \'the old world remained,\' \'looking out at nothing.\' The tone is quiet, reflective, and melancholy."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Last Cane Cutter

Old Desmond rose before the sun. He had done this every day of his working life — sixty-one years in the cane fields of Westmoreland — and even now, with his back curved like a question mark and his hands mapped with calluses, the habit held him like a rope.

The factory had closed two years ago. The machines had come and gone in the same decade, and now the fields themselves were shrinking, sold off in parcels for hotels and housing schemes. Desmond watched from his gate each morning as trucks carried away the earth he had bent himself double over.

His granddaughter, Simone, had tried to explain it to him once. "Global prices fell, Grandpa. It's not the same world." Desmond had nodded, though he was not sure the world's prices had anything to do with what he felt when he watched the last field go under a bulldozer.

He still kept his machete sharp. He oiled it on Sundays, the way other men might tend a garden or shine their shoes. His wife thought it was stubbornness. But Desmond knew it was something else — a refusal to let the loss be complete. As long as the machete held its edge, some part of the old world remained.

One morning, Simone found him on the back step, the machete across his lap, looking out at nothing.

"You miss it," she said. It was not a question.

"I miss knowing what I was," he said.`,
    question: "Why does Desmond nod when Simone explains global prices, even though he is \'not sure the world\'s prices had anything to do with what he felt\'?",
    options: [
      "He agrees that global prices are the most important issue.",
      "He is too old to understand economic arguments.",
      "He accepts her explanation politely while recognising that it doesn\'t touch his deeper emotional reality.",
      "He plans to argue with her later when he has more information.",
    ],
    correctAnswer: 2,
    explanation: "The gap between what Desmond says (nodding) and what he thinks (\'not sure\') shows that Simone\'s economic explanation, while factually correct, cannot account for what he is experiencing emotionally."
  },
  {
    id: 6,
    type: "reading",
    passage: `Are Zoos Good for Animals?

Few institutions spark as much debate as the modern zoo. Supporters argue that zoos serve vital conservation and educational purposes. Critics contend that no matter how spacious the enclosure, confining wild animals for human entertainment is fundamentally unjust. The truth, as is often the case, resists simple answers.

The strongest argument in favour of zoos is their role in species preservation. Many animals — including the Jamaican iguana and the Arabian oryx — have been saved from extinction partly through captive breeding programmes run by zoos. Without these carefully managed efforts, several species would exist today only in photographs. Zoos also fund field conservation projects, train wildlife biologists, and partner with governments to protect natural habitats.

The educational argument is more complicated. Proponents claim that seeing a live animal creates lasting environmental awareness. However, critics point out that the animals visitors see are often stressed, displaying repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress. An animal performing stereotypies is not a useful ambassador for wildlife conservation; it is a portrait of suffering.

The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes. Modern sanctuaries and wildlife corridors offer alternatives that prioritise the animal's own experience, not its visibility to a paying audience. As our understanding of animal consciousness grows, the ethical cost of confinement becomes harder to ignore.

Whatever side one takes, the question demands serious thought. The animals cannot advocate for themselves.`,
    question: "What is the AUTHOR\'S MAIN PURPOSE in writing this passage?",
    options: [
      "To prove that zoos should be closed immediately",
      "To persuade readers to donate money to wildlife conservation",
      "To present multiple perspectives on zoos and encourage readers to think critically",
      "To explain how captive breeding programmes work in detail",
    ],
    correctAnswer: 2,
    explanation: "The passage presents arguments on both sides and ends with \'the question demands serious thought\' — signalling the author wants readers to engage critically, not simply adopt one side."
  },
  {
    id: 7,
    type: "reading",
    passage: `Are Zoos Good for Animals?

Few institutions spark as much debate as the modern zoo. Supporters argue that zoos serve vital conservation and educational purposes. Critics contend that no matter how spacious the enclosure, confining wild animals for human entertainment is fundamentally unjust. The truth, as is often the case, resists simple answers.

The strongest argument in favour of zoos is their role in species preservation. Many animals — including the Jamaican iguana and the Arabian oryx — have been saved from extinction partly through captive breeding programmes run by zoos. Without these carefully managed efforts, several species would exist today only in photographs. Zoos also fund field conservation projects, train wildlife biologists, and partner with governments to protect natural habitats.

The educational argument is more complicated. Proponents claim that seeing a live animal creates lasting environmental awareness. However, critics point out that the animals visitors see are often stressed, displaying repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress. An animal performing stereotypies is not a useful ambassador for wildlife conservation; it is a portrait of suffering.

The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes. Modern sanctuaries and wildlife corridors offer alternatives that prioritise the animal's own experience, not its visibility to a paying audience. As our understanding of animal consciousness grows, the ethical cost of confinement becomes harder to ignore.

Whatever side one takes, the question demands serious thought. The animals cannot advocate for themselves.`,
    question: "What does the word \'stereotypies\' mean as used in the passage?",
    options: [
      "Creative behaviours that animals perform to entertain visitors",
      "Repetitive, abnormal behaviours in captive animals that indicate psychological distress",
      "Scientific names given to different species of zoo animals",
      "The training techniques used by zoo keepers to prepare animals for display",
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly defines stereotypies: \'repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Are Zoos Good for Animals?

Few institutions spark as much debate as the modern zoo. Supporters argue that zoos serve vital conservation and educational purposes. Critics contend that no matter how spacious the enclosure, confining wild animals for human entertainment is fundamentally unjust. The truth, as is often the case, resists simple answers.

The strongest argument in favour of zoos is their role in species preservation. Many animals — including the Jamaican iguana and the Arabian oryx — have been saved from extinction partly through captive breeding programmes run by zoos. Without these carefully managed efforts, several species would exist today only in photographs. Zoos also fund field conservation projects, train wildlife biologists, and partner with governments to protect natural habitats.

The educational argument is more complicated. Proponents claim that seeing a live animal creates lasting environmental awareness. However, critics point out that the animals visitors see are often stressed, displaying repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress. An animal performing stereotypies is not a useful ambassador for wildlife conservation; it is a portrait of suffering.

The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes. Modern sanctuaries and wildlife corridors offer alternatives that prioritise the animal's own experience, not its visibility to a paying audience. As our understanding of animal consciousness grows, the ethical cost of confinement becomes harder to ignore.

Whatever side one takes, the question demands serious thought. The animals cannot advocate for themselves.`,
    question: "Why does the author describe a stressed zoo animal as \'a portrait of suffering\' rather than \'an ambassador for wildlife conservation\'?",
    options: [
      "To show that animals in zoos are always unhappy",
      "To argue that stressed animals cannot effectively inspire environmental concern in visitors",
      "To suggest that portrait painting should be used to educate people about wildlife",
      "To prove that all zoo animals display stereotypies",
    ],
    correctAnswer: 1,
    explanation: "The contrast between \'ambassador\' (a positive role) and \'portrait of suffering\' (a negative image) highlights the author\'s point that a distressed animal undermines rather than supports the educational argument for zoos."
  },
  {
    id: 9,
    type: "reading",
    passage: `Are Zoos Good for Animals?

Few institutions spark as much debate as the modern zoo. Supporters argue that zoos serve vital conservation and educational purposes. Critics contend that no matter how spacious the enclosure, confining wild animals for human entertainment is fundamentally unjust. The truth, as is often the case, resists simple answers.

The strongest argument in favour of zoos is their role in species preservation. Many animals — including the Jamaican iguana and the Arabian oryx — have been saved from extinction partly through captive breeding programmes run by zoos. Without these carefully managed efforts, several species would exist today only in photographs. Zoos also fund field conservation projects, train wildlife biologists, and partner with governments to protect natural habitats.

The educational argument is more complicated. Proponents claim that seeing a live animal creates lasting environmental awareness. However, critics point out that the animals visitors see are often stressed, displaying repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress. An animal performing stereotypies is not a useful ambassador for wildlife conservation; it is a portrait of suffering.

The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes. Modern sanctuaries and wildlife corridors offer alternatives that prioritise the animal's own experience, not its visibility to a paying audience. As our understanding of animal consciousness grows, the ethical cost of confinement becomes harder to ignore.

Whatever side one takes, the question demands serious thought. The animals cannot advocate for themselves.`,
    question: "What is the STRONGEST CRITIQUE of zoos, according to the passage?",
    options: [
      "Zoos are too expensive for most families to visit.",
      "Zoos do not actually save any species from extinction.",
      "Zoos reflect a belief that animals exist primarily for human purposes.",
      "Zoos employ too few trained wildlife biologists.",
    ],
    correctAnswer: 2,
    explanation: "The passage explicitly states: \'The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes.\'"
  },
  {
    id: 10,
    type: "reading",
    passage: `Are Zoos Good for Animals?

Few institutions spark as much debate as the modern zoo. Supporters argue that zoos serve vital conservation and educational purposes. Critics contend that no matter how spacious the enclosure, confining wild animals for human entertainment is fundamentally unjust. The truth, as is often the case, resists simple answers.

The strongest argument in favour of zoos is their role in species preservation. Many animals — including the Jamaican iguana and the Arabian oryx — have been saved from extinction partly through captive breeding programmes run by zoos. Without these carefully managed efforts, several species would exist today only in photographs. Zoos also fund field conservation projects, train wildlife biologists, and partner with governments to protect natural habitats.

The educational argument is more complicated. Proponents claim that seeing a live animal creates lasting environmental awareness. However, critics point out that the animals visitors see are often stressed, displaying repetitive behaviours called stereotypies — pacing, swaying, or bar-biting — that indicate psychological distress. An animal performing stereotypies is not a useful ambassador for wildlife conservation; it is a portrait of suffering.

The strongest critique of zoos is perhaps this: they reflect a belief that animals exist primarily for human purposes. Modern sanctuaries and wildlife corridors offer alternatives that prioritise the animal's own experience, not its visibility to a paying audience. As our understanding of animal consciousness grows, the ethical cost of confinement becomes harder to ignore.

Whatever side one takes, the question demands serious thought. The animals cannot advocate for themselves.`,
    question: "The final sentence — \'The animals cannot advocate for themselves\' — serves to —",
    options: [
      "prove that animals have no feelings worth considering",
      "suggest that zoo visitors should be required to speak on animals\' behalf",
      "remind the reader of the ethical responsibility humans carry when making decisions about animals",
      "show that the author believes zoos should be replaced by wildlife documentaries",
    ],
    correctAnswer: 2,
    explanation: "The closing line places moral responsibility on humans — since animals have no voice in these decisions, the burden of ethical thinking falls entirely on us. It is a powerful, thought-provoking conclusion."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The habit held him like a ROPE.\" In this context, the comparison suggests that the habit was —",
    options: [
      "thin and easily broken",
      "strong and difficult to escape",
      "useful and practical",
      "painful and harmful",
    ],
    correctAnswer: 1,
    explanation: "A rope holds things firmly and is not easily broken free from. The simile suggests the habit had a powerful, binding hold on Desmond."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Simone tried to EXPLAIN it to him.\" Which word is the closest in meaning to \'explain\' in a more formal context?",
    options: [
      "describe",
      "clarify",
      "guess",
      "ignore",
    ],
    correctAnswer: 1,
    explanation: "To clarify means to make something clearer or easier to understand — it is a more formal synonym for explain in this context."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Critics CONTEND that confining wild animals is unjust.\" The word \'contend\' means —",
    options: [
      "agree reluctantly",
      "argue or maintain as a position",
      "discover by accident",
      "refuse to consider",
    ],
    correctAnswer: 1,
    explanation: "To contend means to argue a position or maintain a claim, especially in a debate or disagreement."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The ethical COST of confinement becomes harder to ignore.\" The word \'ethical\' relates to —",
    options: [
      "questions of profit and loss",
      "questions of right and wrong",
      "scientific research methods",
      "environmental geography",
    ],
    correctAnswer: 1,
    explanation: "Ethical relates to ethics — the study of what is right, wrong, fair, or just in human behaviour and decisions."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"As long as the machete held its EDGE, some part of the old world remained.\" The word \'edge\' is used here to mean —",
    options: [
      "the border of a field",
      "the sharp cutting blade of the tool",
      "a feeling of nervousness",
      "the advantage one person has over another",
    ],
    correctAnswer: 1,
    explanation: "In this context, \'edge\' refers to the sharp cutting quality of the machete blade — the very thing that makes it useful and powerful."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Zoos spark as much DEBATE as any modern institution.\" The word \'debate\' means —",
    options: [
      "a formal written law",
      "a structured argument or discussion about opposing views",
      "a scientific study with controlled experiments",
      "an agreement reached between two parties",
    ],
    correctAnswer: 1,
    explanation: "A debate is a discussion in which people argue opposing sides of an issue."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Many animals have been saved from EXTINCTION partly through captive breeding.\" The word \'extinction\' means —",
    options: [
      "a temporary decline in population",
      "the complete disappearance of a species forever",
      "a period of migration to a safer habitat",
      "the recovery of an endangered population",
    ],
    correctAnswer: 1,
    explanation: "Extinction means the permanent and complete disappearance of a species — once extinct, a species cannot be recovered."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"An animal performing stereotypies is a portrait of SUFFERING.\" The word \'suffering\' means —",
    options: [
      "great happiness and contentment",
      "natural and expected behaviour",
      "physical and emotional pain or distress",
      "the process of learning something new",
    ],
    correctAnswer: 2,
    explanation: "Suffering means experiencing physical or emotional pain. The passage uses it to describe the distress of captive animals."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Modern sanctuaries offer ALTERNATIVES that prioritise the animal\'s own experience.\" The word \'alternatives\' means —",
    options: [
      "problems that make the situation worse",
      "opinions held by scientists",
      "different options or choices that can be used instead",
      "rules that must be followed by law",
    ],
    correctAnswer: 2,
    explanation: "Alternatives are different options or choices available when another option is considered unsatisfactory."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The fields were sold off in PARCELS for hotels and housing schemes.\" The word \'parcels\' means —",
    options: [
      "boxes used for shipping goods",
      "small separated portions or sections of land",
      "legal documents signed by the government",
      "packages of food donated to workers",
    ],
    correctAnswer: 1,
    explanation: "In this context, parcels refers to small, divided sections or portions of land that were sold separately."
  },
  {
    id: 21,
    type: "grammar",
    question: "Identify the ERROR in this sentence: \'The machete, which Desmond had kept for sixty years, were still perfectly sharp.\'",
    options: [
      "machete should be machetes",
      "which should be that",
      "were should be was",
      "perfectly should be perfect",
    ],
    correctAnswer: 2,
    explanation: "The subject is \'the machete,\' which is singular. The relative clause \'which Desmond had kept for sixty years\' does not change the subject. The correct verb is \'was.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence contains a DANGLING MODIFIER?",
    options: [
      "Driving home after the match, Kezia noticed the storm approaching.",
      "Having read the passage carefully, the main idea became clear.",
      "Exhausted from the long journey, Marcus fell asleep immediately.",
      "Determined to succeed, she studied every evening for a month.",
    ],
    correctAnswer: 1,
    explanation: "In option B, the subject implied by \'having read\' is a person, but the sentence says \'the main idea\' read the passage. The modifier dangles because it does not logically attach to the sentence\'s subject."
  },
  {
    id: 23,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "I wish he was here to help us with the project.",
      "I wish he were here to help us with the project.",
      "I wish he is here to help us with the project.",
      "I wish he will be here to help us with the project.",
    ],
    correctAnswer: 1,
    explanation: "The subjunctive mood is used for wishes and hypothetical situations. After \'I wish,\' the correct form is \'were\' for all subjects — not \'was,\' \'is,\' or \'will be.\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Desmond enjoyed sharpening his machete, to oil it, and kept it clean.",
      "Desmond enjoyed sharpening his machete, oiling it, and keeping it clean.",
      "Desmond enjoyed to sharpen his machete, oiling it, and kept it clean.",
      "Desmond enjoyed sharpening his machete, oiled it, and to keep it clean.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a series to use the same grammatical form. Option B uses gerunds (-ing forms) for all three: sharpening, oiling, and keeping."
  },
  {
    id: 25,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The zoo, which was founded in 1962 has received numerous conservation awards.",
      "The zoo which was founded in 1962, has received numerous conservation awards.",
      "The zoo, which was founded in 1962, has received numerous conservation awards.",
      "The zoo which was founded in 1962 has received numerous conservation awards.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which was founded in 1962\' must be enclosed by commas on both sides since it adds extra information but is not essential to identifying the zoo."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "The bulldozer cleared the last cane field in a single afternoon.",
      "Simone explained the global price collapse to her grandfather.",
      "The last cane field was cleared by the bulldozer in a single afternoon.",
      "Desmond watched the trucks carry away the red earth.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. In option C, \'the last cane field\' (subject) receives the action \'was cleared.\' The agent (\'the bulldozer\') appears in a \'by\' phrase."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Simone said that global prices had fallen and it was not the same world.",
      "Simone said that global prices have fallen and it is not the same world.",
      "Simone said that global prices will fall and it is not the same world.",
      "Simone said that global prices fallen and it was not the same world.",
    ],
    correctAnswer: 0,
    explanation: "In reported speech, the verbs shift back one tense from the original. \'Have fallen\' (present perfect) becomes \'had fallen\' (past perfect), and \'is\' becomes \'was.\' Option A is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the type of clause in bold: \'The Jamaican iguana, [WHICH HAS BEEN SAVED BY CAPTIVE BREEDING], is still considered vulnerable.\'",
    options: [
      "Adverbial clause",
      "Conditional clause",
      "Non-restrictive relative clause",
      "Noun clause",
    ],
    correctAnswer: 2,
    explanation: "\'Which has been saved by captive breeding\' is a relative clause introduced by \'which.\' It is non-restrictive because it adds extra information without defining which iguana is meant — it is set off by commas."
  },
  {
    id: 29,
    type: "grammar",
    question: "Which sentence uses the SEMICOLON correctly?",
    options: [
      "Critics argue that zoos cause suffering; but supporters point to conservation successes.",
      "Critics argue that zoos cause suffering; however, supporters point to conservation successes.",
      "Critics argue; that zoos cause suffering however supporters point to conservation successes.",
      "Critics argue that zoos cause suffering; and supporters point to conservation successes.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is a correct and formal construction. Using a semicolon before \'but\' or \'and\' (coordinating conjunctions) is incorrect."
  },
  {
    id: 30,
    type: "grammar",
    question: "Choose the sentence that has CORRECT subject-verb agreement:",
    options: [
      "Neither the critics nor the zoo director have changed their position.",
      "Neither the critics nor the zoo director has changed their position.",
      "Neither the zoo director nor the critics has changed their position.",
      "Neither the zoo director nor the critics have changed their position.",
    ],
    correctAnswer: 3,
    explanation: "With \'neither...nor,\' the verb agrees with the subject closest to it. In option D, \'the critics\' (plural) is the closest subject, so the plural verb \'have changed\' is correct."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Desmond oiled the machete carefully on Sunday mornings.",
      "Carefully, Desmond oiled the machete on Sunday mornings.",
      "Desmond oiled the machete on Sunday mornings, which was kept in perfect condition.",
      "On Sunday mornings, Desmond carefully oiled the machete.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'which was kept in perfect condition\' appears to modify \'Sunday mornings\' rather than \'the machete.\' The modifier is misplaced."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence that CORRECTLY uses the colon:",
    options: [
      "Desmond kept three things: his machete, his dignity, and his routine.",
      "Desmond kept: three things his machete, his dignity, and his routine.",
      "Desmond kept three things his machete: his dignity, and his routine.",
      "Desmond: kept three things his machete, his dignity, and his routine.",
    ],
    correctAnswer: 0,
    explanation: "A colon is placed after a complete clause to introduce a list or elaboration. \'Desmond kept three things\' is a complete clause, and the colon correctly introduces the list."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph arguing that zoos do more harm than good?",
    options: [
      "Zoos have existed for hundreds of years in many different countries.",
      "Some zoo animals pace back and forth in their enclosures all day.",
      "Despite their conservation claims, zoos ultimately prioritise human entertainment over animal welfare, and this contradiction cannot be resolved by larger enclosures alone.",
      "Animals in the wild face many dangers including habitat loss and poaching.",
    ],
    correctAnswer: 2,
    explanation: "Option C states a clear, arguable position with a specific reason and anticipates a counterargument (\'larger enclosures\') — all qualities of a strong persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which revision BEST improves the CLARITY and PRECISION of this sentence? Original: \'Desmond felt bad about the things that happened.\'",
    options: [
      "Desmond felt very, very bad about the many different things that happened to him.",
      "Desmond felt things that were bad and sad about everything.",
      "Desmond grieved not only the loss of his livelihood, but the loss of the identity that sixty years of work had given him.",
      "The things that happened to Desmond made him feel bad and sad.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'grieved,\' \'livelihood,\' \'identity\'), is specific about what was lost, and mirrors the emotional depth of the passage. It is far superior to the vague original."
  },
  {
    id: 35,
    type: "writing",
    question: "A student wrote: \'Zoos are good because they save animals and they are educational and children like going to them.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Zoos are good, and children like going to them, and they save animals.",
      "Although zoos face criticism, they contribute meaningfully to conservation through captive breeding programmes and offer educational experiences that foster environmental awareness.",
      "Zoos save animals and they are educational and children like them, so they are good.",
      "Because children like zoos and they save animals, zoos are educational and good.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses subordination, precise vocabulary (\'captive breeding,\' \'environmental awareness\'), and a more complex sentence structure — the hallmark of improved academic writing."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Old Desmond kept his machete sharp even after the factory closed. The machete was a symbol of his identity and dignity. Machetes are also used in Jamaica for clearing bush and harvesting coconuts. Without it, he felt that part of his old life would be completely gone.\'",
    options: [
      "Old Desmond kept his machete sharp even after the factory closed.",
      "The machete was a symbol of his identity and dignity.",
      "Machetes are also used in Jamaica for clearing bush and harvesting coconuts.",
      "Without it, he felt that part of his old life would be completely gone.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Desmond\'s personal relationship with the machete as a symbol. The sentence about the general agricultural uses of machetes is off-topic and breaks the focus."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in a persuasive argument?",
    options: [
      "Zoos are bad and should be closed.",
      "Some people think zoos are good but they are wrong.",
      "While zoos have undeniably contributed to species survival through captive breeding, this benefit does not justify the psychological harm inflicted on individual animals.",
      "Zoos help animals and people disagree about this sometimes.",
    ],
    correctAnswer: 2,
    explanation: "Option C acknowledges the opposing argument honestly (\'undeniably contributed to species survival\') before countering it — this is the structure of a strong academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'He looked at her and she asked him and he told her about his feelings.\' What is the MOST COMPLETE revision?",
    options: [
      "He looked at her. She asked him. He told her about his feelings.",
      "When Simone sat beside him and asked what he was feeling, Desmond said quietly that he missed knowing what he was.",
      "He looked at Simone and she asked him how he was feeling so he told her about his feelings about the cane fields.",
      "He looked at her and told her his feelings when she asked him.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses subordination, specific names, precise dialogue (\'said quietly\'), and specific content — all of which transform vague prose into vivid, specific narrative."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of preserving cultural traditions like cane cutting?",
    options: [
      "There are many traditions in Jamaica that people should know about.",
      "Cane cutting is a tradition that has existed for a long time.",
      "When we allow traditions to disappear without record or recognition, we do not merely lose a skill — we lose the stories, the dignity, and the identity of the people who carried them.",
      "Traditions are important and we should try to keep them alive.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise, emotionally resonant language (\'dignity,\' \'identity\'), lists what is truly lost (stories, dignity, identity), and ends with a lasting, powerful image — qualities of an excellent closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the purpose of a HOOK in an introductory paragraph?",
    options: [
      "To list all the evidence that will be used in the essay",
      "To provide definitions of the key terms in the essay",
      "To capture the reader\'s attention and make them want to continue reading",
      "To state the conclusion of the essay before the evidence is presented",
    ],
    correctAnswer: 2,
    explanation: "A hook is an opening technique designed to engage the reader immediately — through a striking image, a question, a surprising fact, or a powerful statement. Option C describes this correctly."
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

export default function LiteracyDifficult2Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult2Questions : literacyDifficult2Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 2</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 2</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 2 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Difficult 2</h1>
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
