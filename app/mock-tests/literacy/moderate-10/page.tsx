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

const literacyModerate10Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Emancipation: Freedom's Long Road

On August 1, 1838, full emancipation came to Jamaica. On that day, more than three hundred thousand enslaved people were legally freed from bondage. It was the culmination of a long struggle — one that had been fought in the fields, in the courts, in the churches, and in the British Parliament.

The road to emancipation had been paved by many forces. The rebellions of enslaved people, including Samuel Sharpe's Christmas Rebellion of 1831, made clear that the system of slavery could not be maintained without increasing violence and resistance. Simultaneously, the abolitionist movement in Britain — led by figures such as William Wilberforce — was building powerful public and political support for an end to slavery.

In 1833, the British Parliament passed the Abolition of Slavery Act, but full freedom did not come immediately. Under a system called Apprenticeship, formerly enslaved people were required to continue working for their former enslavers for up to six years in exchange for wages. Many historians have described the Apprenticeship system as slavery by another name. It was finally brought to an end on August 1, 1838 — two years early — due to continued resistance and the work of abolitionists.

Emancipation did not, however, bring full equality. Formerly enslaved people faced poverty, landlessness, and social discrimination. They built communities, established free villages, attended schools run by missionary churches, and fought for political rights. August 1st is now celebrated every year in Jamaica as Emancipation Day — a day to reflect on the courage of those who endured slavery and to honour the ongoing struggle for dignity and equality.`,
    question: "What is the MAIN IDEA of the emancipation passage?",
    options: [
      "Emancipation happened because of the work of William Wilberforce alone.",
      "The Apprenticeship system gave enslaved people full freedom immediately after 1833.",
      "Emancipation was a long-fought achievement that brought legal freedom but not yet full equality.",
      "Emancipation Day is celebrated on August 6th every year in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "The passage covers the struggle for emancipation, the Apprenticeship system, and the continued inequality after freedom. Option C captures all of this."
  },
  {
    id: 2,
    type: "reading",
    passage: `Emancipation: Freedom's Long Road

On August 1, 1838, full emancipation came to Jamaica. On that day, more than three hundred thousand enslaved people were legally freed from bondage. It was the culmination of a long struggle — one that had been fought in the fields, in the courts, in the churches, and in the British Parliament.

The road to emancipation had been paved by many forces. The rebellions of enslaved people, including Samuel Sharpe's Christmas Rebellion of 1831, made clear that the system of slavery could not be maintained without increasing violence and resistance. Simultaneously, the abolitionist movement in Britain — led by figures such as William Wilberforce — was building powerful public and political support for an end to slavery.

In 1833, the British Parliament passed the Abolition of Slavery Act, but full freedom did not come immediately. Under a system called Apprenticeship, formerly enslaved people were required to continue working for their former enslavers for up to six years in exchange for wages. Many historians have described the Apprenticeship system as slavery by another name. It was finally brought to an end on August 1, 1838 — two years early — due to continued resistance and the work of abolitionists.

Emancipation did not, however, bring full equality. Formerly enslaved people faced poverty, landlessness, and social discrimination. They built communities, established free villages, attended schools run by missionary churches, and fought for political rights. August 1st is now celebrated every year in Jamaica as Emancipation Day — a day to reflect on the courage of those who endured slavery and to honour the ongoing struggle for dignity and equality.`,
    question: "What was the APPRENTICESHIP SYSTEM?",
    options: [
      "A programme that trained enslaved people to read and write",
      "A requirement for formerly enslaved people to continue working for their enslavers for up to six years",
      "A scholarship programme for the children of formerly enslaved people",
      "A system that allowed formerly enslaved people to purchase their freedom",
    ],
    correctAnswer: 1,
    explanation: "The passage defines the Apprenticeship system as a requirement for formerly enslaved people to continue working for their former enslavers for up to six years in exchange for wages."
  },
  {
    id: 3,
    type: "reading",
    passage: `Emancipation: Freedom's Long Road

On August 1, 1838, full emancipation came to Jamaica. On that day, more than three hundred thousand enslaved people were legally freed from bondage. It was the culmination of a long struggle — one that had been fought in the fields, in the courts, in the churches, and in the British Parliament.

The road to emancipation had been paved by many forces. The rebellions of enslaved people, including Samuel Sharpe's Christmas Rebellion of 1831, made clear that the system of slavery could not be maintained without increasing violence and resistance. Simultaneously, the abolitionist movement in Britain — led by figures such as William Wilberforce — was building powerful public and political support for an end to slavery.

In 1833, the British Parliament passed the Abolition of Slavery Act, but full freedom did not come immediately. Under a system called Apprenticeship, formerly enslaved people were required to continue working for their former enslavers for up to six years in exchange for wages. Many historians have described the Apprenticeship system as slavery by another name. It was finally brought to an end on August 1, 1838 — two years early — due to continued resistance and the work of abolitionists.

Emancipation did not, however, bring full equality. Formerly enslaved people faced poverty, landlessness, and social discrimination. They built communities, established free villages, attended schools run by missionary churches, and fought for political rights. August 1st is now celebrated every year in Jamaica as Emancipation Day — a day to reflect on the courage of those who endured slavery and to honour the ongoing struggle for dignity and equality.`,
    question: "What does the phrase \'slavery by another name\' suggest about the Apprenticeship system?",
    options: [
      "That it was a completely different system from slavery",
      "That historians liked the name \'Apprenticeship\' better than \'slavery\'",
      "That despite its different name, the system still forced people to work without true freedom",
      "That the system was only practised in Jamaica, not in other colonies",
    ],
    correctAnswer: 2,
    explanation: "Calling it \'slavery by another name\' suggests that despite the new label, the Apprenticeship system still denied people genuine freedom — it was slavery in practice if not in name."
  },
  {
    id: 4,
    type: "reading",
    passage: `Emancipation: Freedom's Long Road

On August 1, 1838, full emancipation came to Jamaica. On that day, more than three hundred thousand enslaved people were legally freed from bondage. It was the culmination of a long struggle — one that had been fought in the fields, in the courts, in the churches, and in the British Parliament.

The road to emancipation had been paved by many forces. The rebellions of enslaved people, including Samuel Sharpe's Christmas Rebellion of 1831, made clear that the system of slavery could not be maintained without increasing violence and resistance. Simultaneously, the abolitionist movement in Britain — led by figures such as William Wilberforce — was building powerful public and political support for an end to slavery.

In 1833, the British Parliament passed the Abolition of Slavery Act, but full freedom did not come immediately. Under a system called Apprenticeship, formerly enslaved people were required to continue working for their former enslavers for up to six years in exchange for wages. Many historians have described the Apprenticeship system as slavery by another name. It was finally brought to an end on August 1, 1838 — two years early — due to continued resistance and the work of abolitionists.

Emancipation did not, however, bring full equality. Formerly enslaved people faced poverty, landlessness, and social discrimination. They built communities, established free villages, attended schools run by missionary churches, and fought for political rights. August 1st is now celebrated every year in Jamaica as Emancipation Day — a day to reflect on the courage of those who endured slavery and to honour the ongoing struggle for dignity and equality.`,
    question: "What can be INFERRED about formerly enslaved people after Emancipation?",
    options: [
      "They were given land and financial support by the British government.",
      "They faced significant hardship but actively built communities and fought for rights.",
      "They were immediately given the right to vote and run for political office.",
      "They returned to Africa after gaining their freedom.",
    ],
    correctAnswer: 1,
    explanation: "The passage states they faced \'poverty, landlessness, and social discrimination\' but also \'built communities, established free villages...and fought for political rights.\'"
  },
  {
    id: 5,
    type: "reading",
    passage: `Emancipation: Freedom's Long Road

On August 1, 1838, full emancipation came to Jamaica. On that day, more than three hundred thousand enslaved people were legally freed from bondage. It was the culmination of a long struggle — one that had been fought in the fields, in the courts, in the churches, and in the British Parliament.

The road to emancipation had been paved by many forces. The rebellions of enslaved people, including Samuel Sharpe's Christmas Rebellion of 1831, made clear that the system of slavery could not be maintained without increasing violence and resistance. Simultaneously, the abolitionist movement in Britain — led by figures such as William Wilberforce — was building powerful public and political support for an end to slavery.

In 1833, the British Parliament passed the Abolition of Slavery Act, but full freedom did not come immediately. Under a system called Apprenticeship, formerly enslaved people were required to continue working for their former enslavers for up to six years in exchange for wages. Many historians have described the Apprenticeship system as slavery by another name. It was finally brought to an end on August 1, 1838 — two years early — due to continued resistance and the work of abolitionists.

Emancipation did not, however, bring full equality. Formerly enslaved people faced poverty, landlessness, and social discrimination. They built communities, established free villages, attended schools run by missionary churches, and fought for political rights. August 1st is now celebrated every year in Jamaica as Emancipation Day — a day to reflect on the courage of those who endured slavery and to honour the ongoing struggle for dignity and equality.`,
    question: "What is the AUTHOR\'S PURPOSE in writing this passage?",
    options: [
      "To argue that Jamaica should seek reparations from Britain",
      "To entertain readers with stories from the period of slavery",
      "To inform readers about the process of emancipation in Jamaica and its complex legacy",
      "To persuade readers that the Apprenticeship system was fair",
    ],
    correctAnswer: 2,
    explanation: "The passage presents historical information about the emancipation process, its limitations, and its legacy. The purpose is to inform."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Sea Glass Collector

Every morning before school, Maya walked the shoreline below her grandmother's house in Port Antonio, searching for sea glass. Sea glass is created when broken pieces of glass — from bottles, jars, and other discarded objects — are tumbled for years by the waves until their edges are smooth and their surfaces are frosted. Each piece, Maya thought, was a small act of patience by the sea.

She kept her collection in three glass jars on her windowsill, sorted by colour. Green was the most common — bottle glass. White and brown were also easy to find. But the rare colours — blue, red, amber — those required real dedication. Maya had been looking for a piece of red sea glass for three years.

One morning, she found it. It was smaller than her thumbnail, no bigger than a nail clipping, but unmistakably red — deep and wine-dark, catching the light in a way that made her breath stop. She held it carefully between two fingers and stood very still.

She did not run home to show anyone. She stood at the water's edge and looked at the sea for a long moment. Then she put the glass in her pocket and walked home slowly, as if carrying something that required that particular kind of care.`,
    question: "What does Maya think about each piece of sea glass?",
    options: [
      "That it is a piece of rubbish that the sea has cleaned.",
      "That it is a small act of patience by the sea.",
      "That it was thrown away by someone careless.",
      "That it is a rare and valuable treasure.",
    ],
    correctAnswer: 1,
    explanation: "The passage states: \'Each piece, Maya thought, was a small act of patience by the sea.\'"
  },
  {
    id: 7,
    type: "reading",
    passage: `The Sea Glass Collector

Every morning before school, Maya walked the shoreline below her grandmother's house in Port Antonio, searching for sea glass. Sea glass is created when broken pieces of glass — from bottles, jars, and other discarded objects — are tumbled for years by the waves until their edges are smooth and their surfaces are frosted. Each piece, Maya thought, was a small act of patience by the sea.

She kept her collection in three glass jars on her windowsill, sorted by colour. Green was the most common — bottle glass. White and brown were also easy to find. But the rare colours — blue, red, amber — those required real dedication. Maya had been looking for a piece of red sea glass for three years.

One morning, she found it. It was smaller than her thumbnail, no bigger than a nail clipping, but unmistakably red — deep and wine-dark, catching the light in a way that made her breath stop. She held it carefully between two fingers and stood very still.

She did not run home to show anyone. She stood at the water's edge and looked at the sea for a long moment. Then she put the glass in her pocket and walked home slowly, as if carrying something that required that particular kind of care.`,
    question: "Why does finding red sea glass require \'real dedication\'?",
    options: [
      "Red glass is created by a different process than other colours.",
      "Red sea glass can only be found in Port Antonio.",
      "Red is a rare colour, and Maya had been searching for three years without finding it.",
      "Red sea glass is very large and difficult to carry home.",
    ],
    correctAnswer: 2,
    explanation: "The passage states rare colours \'required real dedication\' and that Maya \'had been looking for a piece of red sea glass for three years.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `The Sea Glass Collector

Every morning before school, Maya walked the shoreline below her grandmother's house in Port Antonio, searching for sea glass. Sea glass is created when broken pieces of glass — from bottles, jars, and other discarded objects — are tumbled for years by the waves until their edges are smooth and their surfaces are frosted. Each piece, Maya thought, was a small act of patience by the sea.

She kept her collection in three glass jars on her windowsill, sorted by colour. Green was the most common — bottle glass. White and brown were also easy to find. But the rare colours — blue, red, amber — those required real dedication. Maya had been looking for a piece of red sea glass for three years.

One morning, she found it. It was smaller than her thumbnail, no bigger than a nail clipping, but unmistakably red — deep and wine-dark, catching the light in a way that made her breath stop. She held it carefully between two fingers and stood very still.

She did not run home to show anyone. She stood at the water's edge and looked at the sea for a long moment. Then she put the glass in her pocket and walked home slowly, as if carrying something that required that particular kind of care.`,
    question: "Why does Maya NOT run home to show anyone when she finds the red sea glass?",
    options: [
      "She is afraid she will drop it if she runs.",
      "She does not want her family to take it from her.",
      "The moment is too personal and meaningful to immediately share — she wants to honour it privately first.",
      "She is late for school and must walk directly there.",
    ],
    correctAnswer: 2,
    explanation: "Maya stands still, looks at the sea, and walks home slowly. The final line — \'as if carrying something that required that particular kind of care\' — shows the moment is deeply personal."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Sea Glass Collector

Every morning before school, Maya walked the shoreline below her grandmother's house in Port Antonio, searching for sea glass. Sea glass is created when broken pieces of glass — from bottles, jars, and other discarded objects — are tumbled for years by the waves until their edges are smooth and their surfaces are frosted. Each piece, Maya thought, was a small act of patience by the sea.

She kept her collection in three glass jars on her windowsill, sorted by colour. Green was the most common — bottle glass. White and brown were also easy to find. But the rare colours — blue, red, amber — those required real dedication. Maya had been looking for a piece of red sea glass for three years.

One morning, she found it. It was smaller than her thumbnail, no bigger than a nail clipping, but unmistakably red — deep and wine-dark, catching the light in a way that made her breath stop. She held it carefully between two fingers and stood very still.

She did not run home to show anyone. She stood at the water's edge and looked at the sea for a long moment. Then she put the glass in her pocket and walked home slowly, as if carrying something that required that particular kind of care.`,
    question: "The phrase \'a small act of patience by the sea\' is an example of —",
    options: [
      "a simile",
      "alliteration",
      "personification",
      "onomatopoeia",
    ],
    correctAnswer: 2,
    explanation: "Personification gives human qualities to non-human things. The sea is described as performing an act of patience — a human quality."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Sea Glass Collector

Every morning before school, Maya walked the shoreline below her grandmother's house in Port Antonio, searching for sea glass. Sea glass is created when broken pieces of glass — from bottles, jars, and other discarded objects — are tumbled for years by the waves until their edges are smooth and their surfaces are frosted. Each piece, Maya thought, was a small act of patience by the sea.

She kept her collection in three glass jars on her windowsill, sorted by colour. Green was the most common — bottle glass. White and brown were also easy to find. But the rare colours — blue, red, amber — those required real dedication. Maya had been looking for a piece of red sea glass for three years.

One morning, she found it. It was smaller than her thumbnail, no bigger than a nail clipping, but unmistakably red — deep and wine-dark, catching the light in a way that made her breath stop. She held it carefully between two fingers and stood very still.

She did not run home to show anyone. She stood at the water's edge and looked at the sea for a long moment. Then she put the glass in her pocket and walked home slowly, as if carrying something that required that particular kind of care.`,
    question: "What is the MOOD of the sea glass passage?",
    options: [
      "Exciting and fast-paced",
      "Humorous and light",
      "Quiet, thoughtful, and intimate",
      "Tense and suspenseful",
    ],
    correctAnswer: 2,
    explanation: "The passage is written in a gentle, reflective tone — slow pace, careful observation, quiet emotion. The mood is quiet, thoughtful, and intimate."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Emancipation was the CULMINATION of a long struggle.\" The word \'culmination\' means —",
    options: [
      "the beginning of an event",
      "the highest point or final result of a series of events",
      "the most difficult stage of a process",
      "a temporary pause in events",
    ],
    correctAnswer: 1,
    explanation: "Culmination means the highest point or final result reached after a long process."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The ABOLITIONIST movement was building powerful support.\" The word \'abolitionist\' refers to —",
    options: [
      "someone who supports slavery",
      "a person who campaigns for the ending of a practice, especially slavery",
      "a judge who makes legal decisions",
      "a plantation owner who treats workers fairly",
    ],
    correctAnswer: 1,
    explanation: "An abolitionist is someone who campaigns for the abolition — the official ending — of a practice."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Formerly enslaved people faced LANDLESSNESS after emancipation.\" The word \'landlessness\' means —",
    options: [
      "the condition of having too much land to manage",
      "the condition of owning no land",
      "the process of buying land cheaply",
      "the practice of sharing land equally",
    ],
    correctAnswer: 1,
    explanation: "Landlessness means the condition of owning no land. After emancipation, many formerly enslaved people could not afford to buy land."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Sea glass is TUMBLED by the waves for years.\" The word \'tumbled\' means —",
    options: [
      "thrown violently into the sea",
      "sorted and arranged carefully",
      "turned and rolled repeatedly by the action of water",
      "buried beneath the sand",
    ],
    correctAnswer: 2,
    explanation: "Tumbled means turned and rolled repeatedly. Waves tumble the glass pieces, wearing down their edges over many years."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The red sea glass caught the light in a way that made her breath STOP.\" This expression means —",
    options: [
      "Maya was having difficulty breathing.",
      "Maya was so struck by the beauty of the glass that she paused in amazement.",
      "The light was too bright and hurt Maya\'s eyes.",
      "Maya was frightened by what she found.",
    ],
    correctAnswer: 1,
    explanation: "Making your breath stop is an expression for being momentarily overwhelmed by something beautiful or surprising."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"She put it in her pocket and walked home slowly, as if carrying something that required that PARTICULAR KIND OF CARE.\" What does this suggest?",
    options: [
      "The red sea glass was very fragile and might break.",
      "Maya was treating the find as something precious and emotionally significant.",
      "Maya\'s pocket had a hole in it and she was walking carefully.",
      "Maya was exhausted from the morning walk.",
    ],
    correctAnswer: 1,
    explanation: "The phrase suggests Maya is treating the red sea glass with great reverence — not just physical care, but emotional care, as if the object carries deep personal meaning."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Through continued RESISTANCE, the Apprenticeship ended two years early.\" The word \'resistance\' means —",
    options: [
      "cooperation with authorities",
      "the act of fighting against or opposing something",
      "the seeking of legal justice",
      "the writing of petitions and letters",
    ],
    correctAnswer: 1,
    explanation: "Resistance means actively opposing or fighting against something — in this context, the continued refusal to accept the Apprenticeship system."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"August 1st is a day to REFLECT on the courage of those who endured slavery.\" The word \'reflect\' means —",
    options: [
      "to shine light in a new direction",
      "to think deeply and carefully about something",
      "to celebrate with music and dancing",
      "to record in a written history",
    ],
    correctAnswer: 1,
    explanation: "To reflect means to think deeply and carefully about something — in this context, to give serious thought to the meaning of emancipation."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The piece was unmistakably red — DEEP and WINE-DARK.\" What effect do these descriptive words create?",
    options: [
      "They tell us the glass was made from a wine bottle.",
      "They make the colour seem unremarkable and common.",
      "They give the reader a precise and vivid sense of the rich, dark quality of the red colour.",
      "They tell us the glass was very large.",
    ],
    correctAnswer: 2,
    explanation: "Deep and wine-dark are precise, evocative descriptors that help the reader visualise the exact quality of the colour — rich, dark, and intense."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Sea glass has surfaces that are FROSTED.\" In this context, \'frosted\' means —",
    options: [
      "covered in ice",
      "cold to the touch",
      "having a cloudy, rough surface rather than clear glass",
      "painted white",
    ],
    correctAnswer: 2,
    explanation: "Frosted glass has a rough, cloudy surface — not transparent. The wave action creates this effect on sea glass over time."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The struggles of enslaved people in Jamaica has shaped the nation\'s history.",
      "The struggles of enslaved people in Jamaica have shaped the nation\'s history.",
      "The struggles of enslaved people in Jamaica shapes the nation\'s history.",
      "The struggles of enslaved people in Jamaica is shaping the nation\'s history.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'struggles,\' which is plural. The correct verb is \'have shaped.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By August 1838, enslaved people in Jamaica already endured centuries of bondage.",
      "By August 1838, enslaved people in Jamaica have already endured centuries of bondage.",
      "By August 1838, enslaved people in Jamaica had already endured centuries of bondage.",
      "By August 1838, enslaved people in Jamaica enduring centuries of bondage.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\'had\' + past participle) shows an action completed before another past moment. \'Had already endured\' is correct."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although full freedom came in 1838, formerly enslaved people still faced poverty and discrimination.\'",
    options: [
      "formerly enslaved people still faced poverty and discrimination",
      "Although full freedom came in 1838",
      "full freedom came in 1838",
      "poverty and discrimination",
    ],
    correctAnswer: 1,
    explanation: "A subordinate clause cannot stand alone. \'Although full freedom came in 1838\' is introduced by a subordinating conjunction and depends on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Maya, who had been searching for three years finally found the red sea glass.",
      "Maya who had been searching for three years, finally found the red sea glass.",
      "Maya, who had been searching for three years, finally found the red sea glass.",
      "Maya who had been searching for three years finally found the red sea glass.",
    ],
    correctAnswer: 2,
    explanation: "The relative clause \'who had been searching for three years\' is non-restrictive and must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Maya found the red sea glass on the shoreline in Port Antonio.",
      "The waves tumbled the glass for many years.",
      "The red sea glass was found by Maya on the shoreline.",
      "Maya kept her collection in three glass jars on her windowsill.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. \'The red sea glass\' receives the action \'was found.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the word that correctly completes: \'Neither the green glass nor the rare blue pieces ___ as precious to Maya as the red.\'",
    options: [
      "is",
      "has",
      "was",
      "were",
    ],
    correctAnswer: 3,
    explanation: "With \'neither...nor,\' the verb agrees with the closest subject. \'The rare blue pieces\' is plural, so \'were\' is correct."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "The formerly enslaved built communities, establishing free villages, and to fight for rights.",
      "The formerly enslaved built communities, established free villages, and fought for rights.",
      "The formerly enslaved built communities, established free villages, and were fighting for rights.",
      "The formerly enslaved were building communities, established free villages, and fighting for rights.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses the simple past for all three: built, established, and fought."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the ERROR: \'Maya\'s collection of sea glass were displayed in three jars on her windowsill.\'",
    options: [
      "collection should be collections",
      "were should be was",
      "jars should be jar",
      "her should be the",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'collection,\' which is singular. The correct verb is \'was displayed,\' not \'were displayed.\'"
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses a SEMICOLON correctly:",
    options: [
      "Emancipation came in 1838; but inequality persisted for many years.",
      "Emancipation came in 1838; however, inequality persisted for many years.",
      "Emancipation came in 1838; and life improved for formerly enslaved people.",
      "Emancipation; came in 1838 and inequality persisted.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by the conjunctive adverb \'however\' and a comma is correct. Option B follows this rule."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence maintains CONSISTENT tense?",
    options: [
      "Maya found the red sea glass and holds it carefully in her fingers.",
      "Maya found the red sea glass and held it carefully in her fingers.",
      "Maya finds the red sea glass and held it carefully in her fingers.",
      "Maya had found the red sea glass and holds it carefully in her fingers.",
    ],
    correctAnswer: 1,
    explanation: "Option B consistently uses the simple past: \'found\' and \'held.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence uses DIRECT SPEECH correctly?",
    options: [
      "Maya said, she had waited three years for this.",
      "Maya thought, \"I have waited three years for this.\"",
      "Maya said that, \'I have waited three years for this.\'",
      "Maya thought I have waited three years for this.",
    ],
    correctAnswer: 1,
    explanation: "Direct speech uses quotation marks around the exact words. Option B correctly formats Maya\'s thought as direct speech."
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses REPORTED SPEECH correctly?",
    options: [
      "The passage stated that Emancipation Day is celebrated on August 1st.",
      "The passage stated that Emancipation Day was celebrated on August 1st.",
      "The passage states that Emancipation Day was celebrated on August 1st.",
      "The passage had stated that Emancipation Day is celebrated on August 1st.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech in the past, the present tense shifts to past. \'Is celebrated\' becomes \'was celebrated.\' Option B is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Emancipation Day deserves greater recognition in Jamaica?",
    options: [
      "August 1st is a public holiday in Jamaica.",
      "Emancipation Day is celebrated every year with cultural events.",
      "Emancipation Day deserves our deepest recognition — it marks not just the end of legal slavery, but the beginning of a people\'s long and ongoing journey toward full dignity and equality.",
      "Some people spend Emancipation Day at the beach.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a strong, specific argument that frames Emancipation Day as historically significant and ongoing — ideal as a topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'Sea glass is created when glass is broken and tumbled by waves. Each piece is smooth and frosted. Maya collected it in glass jars by colour. Green sea glass is the most common. Jamaica has some of the most beautiful beaches in the Caribbean.\'",
    options: [
      "Each piece is smooth and frosted.",
      "Green sea glass is the most common.",
      "Jamaica has some of the most beautiful beaches in the Caribbean.",
      "Maya collected it in glass jars by colour.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about sea glass. \'Jamaica has some of the most beautiful beaches in the Caribbean\' is too general and off-topic for this focused paragraph."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The Apprenticeship system was like slavery.\'",
    options: [
      "The Apprenticeship system was very much like slavery in many different ways.",
      "Historians have described the Apprenticeship system as slavery by another name — a legal rebrand that preserved forced labour while claiming to offer freedom.",
      "The Apprenticeship system was basically slavery and people hated it.",
      "The Apprenticeship system was similar to slavery because people still had to work.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise language — \'legal rebrand,\' \'preserved forced labour\' — and captures the historians\' interpretation with the vivid phrase \'slavery by another name.\'"
  },
  {
    id: 36,
    type: "writing",
    question: "A student wrote: \'Maya has been looking for red sea glass since three years and she finally finded it on the beach.\' Choose the MOST COMPLETE correction:",
    options: [
      "Maya had been looking for red sea glass for three years and she finally found it on the shoreline.",
      "Maya has been looking for red sea glass since three years and she finally found it on the beach.",
      "Maya had been looking for red sea glass for three years and she finally finded it on the shoreline.",
      "Maya had been looking for red sea glass since three years and she finally found it on the beach.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects all errors: \'had been looking\' (past perfect continuous), \'since\' to \'for\' (duration), \'finded\' to \'found\' (irregular past), and \'beach\' to \'shoreline\' (more specific)."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence uses the MOST PRECISE and FORMAL language for a history essay?",
    options: [
      "The people who were enslaved worked really hard to get their freedom.",
      "Enslaved people fought a lot for their freedom and finally got it.",
      "Through sustained resistance, political advocacy, and moral argument, enslaved people and their allies secured the abolition of the Apprenticeship system in 1838.",
      "Freedom came in 1838 and it was a big deal for everyone.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses formal, precise vocabulary — \'sustained resistance,\' \'political advocacy,\' \'moral argument,\' \'secured the abolition\' — appropriate for a history essay."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about the significance of Emancipation Day?",
    options: [
      "August 1st is a public holiday in Jamaica.",
      "People celebrate Emancipation Day with cultural events and music.",
      "When we observe Emancipation Day, we do not merely mark a moment in history — we recommit ourselves to the unfinished work of building a society worthy of those who sacrificed everything for freedom.",
      "Emancipation Day was first established as a holiday in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C is powerful and forward-looking — it connects the past to the present and frames the holiday as a call to ongoing action."
  },
  {
    id: 39,
    type: "writing",
    question: "A student is writing a narrative about finding something precious. Which opening sentence BEST establishes a thoughtful, reflective tone?",
    options: [
      "One day I found something really amazing at the beach.",
      "It was a Saturday morning when I went to look for sea glass.",
      "There are mornings that begin like any other and end with something you carry in your pocket for the rest of your life.",
      "I had been searching for a long time before I found it.",
    ],
    correctAnswer: 2,
    explanation: "Option C opens with a philosophical, reflective statement that immediately establishes a thoughtful, literary tone — drawing the reader in with quiet mystery and significance."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST explains why specific details make writing more effective?",
    options: [
      "Specific details make writing longer and more impressive.",
      "Specific details give readers exact information that is more convincing, vivid, and memorable than general statements.",
      "Specific details are only needed in fiction, not in reports or essays.",
      "Specific details make writing more complicated and harder to read.",
    ],
    correctAnswer: 1,
    explanation: "Specific details provide exact, verifiable information that creates a clear picture and persuades the reader more effectively than vague generalisations."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate10MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate10Questions : literacyModerate10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 10</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 10</h1>
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
