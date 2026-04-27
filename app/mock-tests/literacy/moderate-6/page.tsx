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

const literacyModerate6Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Port Royal: Jamaica's Sunken City

Port Royal, located at the end of the Palisadoes peninsula near Kingston Harbour, was once one of the most powerful and notorious cities in the western world. In the seventeenth century, it was the headquarters of English privateers — sailors who were licensed by the British Crown to attack and rob the ships of rival nations, especially Spain. The city grew enormously rich from this trade and became famous throughout the Caribbean and beyond.

At its peak, Port Royal had a population of around six to eight thousand people, making it one of the most densely populated cities in the Americas. It was known for its wealth, its taverns, and its reputation for lawlessness. Merchants, sailors, pirates, and traders from across the world passed through its busy harbour.

Then, on June 7, 1692, disaster struck. A massive earthquake measuring approximately 7.5 on the modern Richter scale shook Jamaica violently. Within two minutes, two-thirds of Port Royal sank beneath the sea. The liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour. Approximately two thousand people died immediately, with thousands more dying in the weeks that followed from disease and injury.

Today, the ruins of Port Royal lie beneath the sea, making it one of the most significant underwater archaeological sites in the western hemisphere. Archaeologists have recovered coins, weapons, pottery, and even a watch stopped at the time of the earthquake. Modern Port Royal is a small fishing village, but its extraordinary history draws historians, divers, and tourists from around the world.`,
    question: "What is the MAIN IDEA of this passage?",
    options: [
      "Port Royal was Jamaica\'s most important fishing village.",
      "Port Royal was a powerful city destroyed by an earthquake in 1692 and is now a major archaeological site.",
      "Port Royal was famous only because of its pirates.",
      "The 1692 earthquake destroyed all of Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers Port Royal\'s history, its destruction, and its current significance as an archaeological site."
  },
  {
    id: 2,
    type: "reading",
    passage: `Port Royal: Jamaica's Sunken City

Port Royal, located at the end of the Palisadoes peninsula near Kingston Harbour, was once one of the most powerful and notorious cities in the western world. In the seventeenth century, it was the headquarters of English privateers — sailors who were licensed by the British Crown to attack and rob the ships of rival nations, especially Spain. The city grew enormously rich from this trade and became famous throughout the Caribbean and beyond.

At its peak, Port Royal had a population of around six to eight thousand people, making it one of the most densely populated cities in the Americas. It was known for its wealth, its taverns, and its reputation for lawlessness. Merchants, sailors, pirates, and traders from across the world passed through its busy harbour.

Then, on June 7, 1692, disaster struck. A massive earthquake measuring approximately 7.5 on the modern Richter scale shook Jamaica violently. Within two minutes, two-thirds of Port Royal sank beneath the sea. The liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour. Approximately two thousand people died immediately, with thousands more dying in the weeks that followed from disease and injury.

Today, the ruins of Port Royal lie beneath the sea, making it one of the most significant underwater archaeological sites in the western hemisphere. Archaeologists have recovered coins, weapons, pottery, and even a watch stopped at the time of the earthquake. Modern Port Royal is a small fishing village, but its extraordinary history draws historians, divers, and tourists from around the world.`,
    question: "What were \'privateers\' as described in the passage?",
    options: [
      "Pirates who stole from Jamaican merchants",
      "Sailors licensed by the British Crown to attack the ships of rival nations",
      "Merchants who traded goods across the Caribbean",
      "Sailors who built ships for the British navy",
    ],
    correctAnswer: 1,
    explanation: "The passage defines privateers as sailors licensed by the British Crown to attack and rob ships of rival nations, especially Spain."
  },
  {
    id: 3,
    type: "reading",
    passage: `Port Royal: Jamaica's Sunken City

Port Royal, located at the end of the Palisadoes peninsula near Kingston Harbour, was once one of the most powerful and notorious cities in the western world. In the seventeenth century, it was the headquarters of English privateers — sailors who were licensed by the British Crown to attack and rob the ships of rival nations, especially Spain. The city grew enormously rich from this trade and became famous throughout the Caribbean and beyond.

At its peak, Port Royal had a population of around six to eight thousand people, making it one of the most densely populated cities in the Americas. It was known for its wealth, its taverns, and its reputation for lawlessness. Merchants, sailors, pirates, and traders from across the world passed through its busy harbour.

Then, on June 7, 1692, disaster struck. A massive earthquake measuring approximately 7.5 on the modern Richter scale shook Jamaica violently. Within two minutes, two-thirds of Port Royal sank beneath the sea. The liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour. Approximately two thousand people died immediately, with thousands more dying in the weeks that followed from disease and injury.

Today, the ruins of Port Royal lie beneath the sea, making it one of the most significant underwater archaeological sites in the western hemisphere. Archaeologists have recovered coins, weapons, pottery, and even a watch stopped at the time of the earthquake. Modern Port Royal is a small fishing village, but its extraordinary history draws historians, divers, and tourists from around the world.`,
    question: "What caused buildings to slide into Kingston Harbour during the earthquake?",
    options: [
      "A giant wave struck the city from the sea.",
      "The buildings were poorly constructed.",
      "The liquefaction of the sandy ground.",
      "Fires that weakened the foundations.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour."
  },
  {
    id: 4,
    type: "reading",
    passage: `Port Royal: Jamaica's Sunken City

Port Royal, located at the end of the Palisadoes peninsula near Kingston Harbour, was once one of the most powerful and notorious cities in the western world. In the seventeenth century, it was the headquarters of English privateers — sailors who were licensed by the British Crown to attack and rob the ships of rival nations, especially Spain. The city grew enormously rich from this trade and became famous throughout the Caribbean and beyond.

At its peak, Port Royal had a population of around six to eight thousand people, making it one of the most densely populated cities in the Americas. It was known for its wealth, its taverns, and its reputation for lawlessness. Merchants, sailors, pirates, and traders from across the world passed through its busy harbour.

Then, on June 7, 1692, disaster struck. A massive earthquake measuring approximately 7.5 on the modern Richter scale shook Jamaica violently. Within two minutes, two-thirds of Port Royal sank beneath the sea. The liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour. Approximately two thousand people died immediately, with thousands more dying in the weeks that followed from disease and injury.

Today, the ruins of Port Royal lie beneath the sea, making it one of the most significant underwater archaeological sites in the western hemisphere. Archaeologists have recovered coins, weapons, pottery, and even a watch stopped at the time of the earthquake. Modern Port Royal is a small fishing village, but its extraordinary history draws historians, divers, and tourists from around the world.`,
    question: "What does the word \'liquefaction\' MOST LIKELY mean based on the passage?",
    options: [
      "The process of water evaporating into steam",
      "The process by which solid ground behaves like liquid during an earthquake",
      "The flooding of a coastal area by the sea",
      "The cooling and hardening of melted rock",
    ],
    correctAnswer: 1,
    explanation: "The passage says liquefaction of the sandy ground caused buildings to slide into the harbour — the ground turned liquid-like during the earthquake."
  },
  {
    id: 5,
    type: "reading",
    passage: `Port Royal: Jamaica's Sunken City

Port Royal, located at the end of the Palisadoes peninsula near Kingston Harbour, was once one of the most powerful and notorious cities in the western world. In the seventeenth century, it was the headquarters of English privateers — sailors who were licensed by the British Crown to attack and rob the ships of rival nations, especially Spain. The city grew enormously rich from this trade and became famous throughout the Caribbean and beyond.

At its peak, Port Royal had a population of around six to eight thousand people, making it one of the most densely populated cities in the Americas. It was known for its wealth, its taverns, and its reputation for lawlessness. Merchants, sailors, pirates, and traders from across the world passed through its busy harbour.

Then, on June 7, 1692, disaster struck. A massive earthquake measuring approximately 7.5 on the modern Richter scale shook Jamaica violently. Within two minutes, two-thirds of Port Royal sank beneath the sea. The liquefaction of the sandy ground caused entire streets of buildings to slide into Kingston Harbour. Approximately two thousand people died immediately, with thousands more dying in the weeks that followed from disease and injury.

Today, the ruins of Port Royal lie beneath the sea, making it one of the most significant underwater archaeological sites in the western hemisphere. Archaeologists have recovered coins, weapons, pottery, and even a watch stopped at the time of the earthquake. Modern Port Royal is a small fishing village, but its extraordinary history draws historians, divers, and tourists from around the world.`,
    question: "What is the AUTHOR\'S PURPOSE in writing the passage about Port Royal?",
    options: [
      "To warn readers about the dangers of living near the sea",
      "To persuade readers to visit Port Royal as tourists",
      "To inform readers about Port Royal\'s dramatic history and ongoing historical significance",
      "To argue that Port Royal should be rebuilt",
    ],
    correctAnswer: 2,
    explanation: "The passage presents historical facts and explains current archaeological significance. The purpose is primarily to inform."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Map on the Wall

In the classroom of Mr. Beckford at Whitfield Town Primary, there was a large map of Jamaica on the wall. It had been there so long that its edges were yellowed and one corner had come away from the tack. But every morning, Mr. Beckford pointed to something new on it, and the students leaned forward in their chairs.

Twelve-year-old Donovan had sat in front of that map for nearly a year. He knew where the Blue Mountains were, and the parishes, and the rivers. But one Tuesday, Mr. Beckford asked a question no one expected: "Which part of Jamaica has no name on this map?"

The class went quiet. Donovan stared. He saw the Cockpit Country, the coast, the towns. Then he saw it — or rather, he saw the space between things. The ocean surrounding the island had no label.

"The sea," Donovan said.

Mr. Beckford smiled — not the broad smile he gave for correct answers, but a quieter one. "Yes," he said. "We spend so long looking at the land that we forget the sea. But Jamaica would not exist without it."

Donovan looked at the map differently after that. He began to notice all the things that were not named — the spaces between rivers, the unmarked paths, the unnamed hills. He realised that a map shows you what someone chose to record. It cannot show you everything.`,
    question: "What does Donovan\'s observation about the sea suggest about him?",
    options: [
      "He is more interested in geography than history.",
      "He pays closer attention than his classmates.",
      "He is able to think beyond the obvious and notice what others overlook.",
      "He had already learned about this from his parents.",
    ],
    correctAnswer: 2,
    explanation: "Donovan is the only student who notices the space between things — showing he can think beyond the obvious."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Map on the Wall

In the classroom of Mr. Beckford at Whitfield Town Primary, there was a large map of Jamaica on the wall. It had been there so long that its edges were yellowed and one corner had come away from the tack. But every morning, Mr. Beckford pointed to something new on it, and the students leaned forward in their chairs.

Twelve-year-old Donovan had sat in front of that map for nearly a year. He knew where the Blue Mountains were, and the parishes, and the rivers. But one Tuesday, Mr. Beckford asked a question no one expected: "Which part of Jamaica has no name on this map?"

The class went quiet. Donovan stared. He saw the Cockpit Country, the coast, the towns. Then he saw it — or rather, he saw the space between things. The ocean surrounding the island had no label.

"The sea," Donovan said.

Mr. Beckford smiled — not the broad smile he gave for correct answers, but a quieter one. "Yes," he said. "We spend so long looking at the land that we forget the sea. But Jamaica would not exist without it."

Donovan looked at the map differently after that. He began to notice all the things that were not named — the spaces between rivers, the unmarked paths, the unnamed hills. He realised that a map shows you what someone chose to record. It cannot show you everything.`,
    question: "What LESSON does Mr. Beckford want to teach with his question?",
    options: [
      "Students should memorise the names of all Jamaican parishes.",
      "Maps are not useful tools for learning.",
      "There is always more to see than what is immediately obvious — we must learn to look at the spaces between things.",
      "The ocean is more important than the land in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Mr. Beckford\'s quieter smile and his statement — \'We spend so long looking at the land that we forget the sea\' — suggest the lesson is about looking beyond the obvious."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Map on the Wall

In the classroom of Mr. Beckford at Whitfield Town Primary, there was a large map of Jamaica on the wall. It had been there so long that its edges were yellowed and one corner had come away from the tack. But every morning, Mr. Beckford pointed to something new on it, and the students leaned forward in their chairs.

Twelve-year-old Donovan had sat in front of that map for nearly a year. He knew where the Blue Mountains were, and the parishes, and the rivers. But one Tuesday, Mr. Beckford asked a question no one expected: "Which part of Jamaica has no name on this map?"

The class went quiet. Donovan stared. He saw the Cockpit Country, the coast, the towns. Then he saw it — or rather, he saw the space between things. The ocean surrounding the island had no label.

"The sea," Donovan said.

Mr. Beckford smiled — not the broad smile he gave for correct answers, but a quieter one. "Yes," he said. "We spend so long looking at the land that we forget the sea. But Jamaica would not exist without it."

Donovan looked at the map differently after that. He began to notice all the things that were not named — the spaces between rivers, the unmarked paths, the unnamed hills. He realised that a map shows you what someone chose to record. It cannot show you everything.`,
    question: "What does Donovan realise at the END of the passage?",
    options: [
      "He needs to study more geography at home.",
      "A map can only record what someone chose to include — it cannot show everything.",
      "He should ask Mr. Beckford for a newer map.",
      "The ocean is the most important part of any map.",
    ],
    correctAnswer: 1,
    explanation: "The final paragraph states clearly: \'He realised that a map shows you what someone chose to record. It cannot show you everything.\'"
  },
  {
    id: 9,
    type: "reading",
    passage: `The Map on the Wall

In the classroom of Mr. Beckford at Whitfield Town Primary, there was a large map of Jamaica on the wall. It had been there so long that its edges were yellowed and one corner had come away from the tack. But every morning, Mr. Beckford pointed to something new on it, and the students leaned forward in their chairs.

Twelve-year-old Donovan had sat in front of that map for nearly a year. He knew where the Blue Mountains were, and the parishes, and the rivers. But one Tuesday, Mr. Beckford asked a question no one expected: "Which part of Jamaica has no name on this map?"

The class went quiet. Donovan stared. He saw the Cockpit Country, the coast, the towns. Then he saw it — or rather, he saw the space between things. The ocean surrounding the island had no label.

"The sea," Donovan said.

Mr. Beckford smiled — not the broad smile he gave for correct answers, but a quieter one. "Yes," he said. "We spend so long looking at the land that we forget the sea. But Jamaica would not exist without it."

Donovan looked at the map differently after that. He began to notice all the things that were not named — the spaces between rivers, the unmarked paths, the unnamed hills. He realised that a map shows you what someone chose to record. It cannot show you everything.`,
    question: "\'The students leaned forward in their chairs\' suggests that —",
    options: [
      "the students were tired and falling asleep",
      "Mr. Beckford\'s lessons were boring",
      "the students were engaged and eager",
      "the chairs in the classroom were uncomfortable",
    ],
    correctAnswer: 2,
    explanation: "Leaning forward is a physical sign of interest and engagement — the students were attentive and eager."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Map on the Wall

In the classroom of Mr. Beckford at Whitfield Town Primary, there was a large map of Jamaica on the wall. It had been there so long that its edges were yellowed and one corner had come away from the tack. But every morning, Mr. Beckford pointed to something new on it, and the students leaned forward in their chairs.

Twelve-year-old Donovan had sat in front of that map for nearly a year. He knew where the Blue Mountains were, and the parishes, and the rivers. But one Tuesday, Mr. Beckford asked a question no one expected: "Which part of Jamaica has no name on this map?"

The class went quiet. Donovan stared. He saw the Cockpit Country, the coast, the towns. Then he saw it — or rather, he saw the space between things. The ocean surrounding the island had no label.

"The sea," Donovan said.

Mr. Beckford smiled — not the broad smile he gave for correct answers, but a quieter one. "Yes," he said. "We spend so long looking at the land that we forget the sea. But Jamaica would not exist without it."

Donovan looked at the map differently after that. He began to notice all the things that were not named — the spaces between rivers, the unmarked paths, the unnamed hills. He realised that a map shows you what someone chose to record. It cannot show you everything.`,
    question: "Which word BEST describes Mr. Beckford\'s teaching style?",
    options: [
      "Strict and demanding",
      "Thought-provoking and patient",
      "Quick and impatient",
      "Dull and repetitive",
    ],
    correctAnswer: 1,
    explanation: "Mr. Beckford asks unexpected questions, waits for students to think, and responds with a meaningful quiet smile. He is thought-provoking and patient."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Port Royal was NOTORIOUS across the Caribbean.\" The word \'notorious\' means —",
    options: [
      "famous for positive achievements",
      "well known for something bad or negative",
      "unknown and mysterious",
      "powerful and well organised",
    ],
    correctAnswer: 1,
    explanation: "Notorious means famous or well known for something negative."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The city was one of the most DENSELY POPULATED in the Americas.\" This phrase means —",
    options: [
      "having very few people",
      "having a very large number of people in a small area",
      "having people from many countries",
      "having people spread over a wide area",
    ],
    correctAnswer: 1,
    explanation: "Densely populated means a very high number of people living in a relatively small area."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Archaeologists have RECOVERED coins and weapons from the ruins.\" The word \'recovered\' means —",
    options: [
      "destroyed and disposed of",
      "studied and published",
      "retrieved or got back",
      "reported to the government",
    ],
    correctAnswer: 2,
    explanation: "To recover something means to find and get it back after it was lost."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The ruins make Port Royal one of the most SIGNIFICANT underwater sites.\" The word \'significant\' means —",
    options: [
      "small and unimportant",
      "very large in size",
      "important and meaningful",
      "recently discovered",
    ],
    correctAnswer: 2,
    explanation: "Significant means important and having a notable impact or meaning."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The map\'s edges were yellowed and one corner had come away from the tack.\" What does this tell us?",
    options: [
      "It was a very expensive map.",
      "It had been on the wall for a long time.",
      "It had been recently replaced.",
      "It was printed in Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "Yellowed edges and a loose corner are signs of age and long use."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Jamaica would not EXIST without the sea.\" The word \'exist\' means —",
    options: [
      "to be famous",
      "to grow and develop",
      "to be or have being",
      "to produce food",
    ],
    correctAnswer: 2,
    explanation: "To exist means to be real or to have being."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "Which word is the best SYNONYM for \'notorious\'?",
    options: [
      "celebrated",
      "admirable",
      "infamous",
      "respected",
    ],
    correctAnswer: 2,
    explanation: "Notorious and infamous both mean well known for something bad or negative."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Mr. Beckford gave \'a quieter smile — not the broad one for correct answers.\' What does this contrast suggest?",
    options: [
      "Mr. Beckford did not think Donovan\'s answer was correct.",
      "Donovan\'s answer deserved a deeper, more thoughtful kind of approval.",
      "Mr. Beckford was unhappy with the class.",
      "Donovan had given an unexpected but wrong answer.",
    ],
    correctAnswer: 1,
    explanation: "The contrast between the two smiles suggests Donovan\'s answer earned a more meaningful kind of approval — wiser than a simple correct answer."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The archaeological sites draw historians, divers, and TOURISTS from around the world.\" The word \'tourists\' means —",
    options: [
      "people who study history professionally",
      "people who travel for pleasure and interest",
      "government officials who manage heritage sites",
      "journalists who write about historical events",
    ],
    correctAnswer: 1,
    explanation: "Tourists are people who travel to places for pleasure, leisure, or interest."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"A map shows you what someone CHOSE to record.\" The word \'chose\' means —",
    options: [
      "was forced to include",
      "decided to include",
      "forgot to include",
      "was unable to include",
    ],
    correctAnswer: 1,
    explanation: "Chose is the past tense of choose — to decide or select. The mapmaker decided what to include."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The ruins of Port Royal has attracted archaeologists for decades.",
      "The ruins of Port Royal have attracted archaeologists for decades.",
      "The ruins of Port Royal is attracting archaeologists for decades.",
      "The ruins of Port Royal attract archaeologists since decades.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'ruins,\' which is plural. The correct verb is \'have attracted.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time rescuers arrived, thousands of people already died.",
      "By the time rescuers arrived, thousands of people had already died.",
      "By the time rescuers arrived, thousands of people have already died.",
      "By the time rescuers arrived, thousands of people will have died.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had\' + past participle) shows an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Because the ground liquefied, entire streets slid into the harbour.\'",
    options: [
      "entire streets slid into the harbour",
      "Because the ground liquefied",
      "entire streets slid",
      "into the harbour",
    ],
    correctAnswer: 1,
    explanation: "A subordinate clause cannot stand alone as a sentence. \'Because the ground liquefied\' is dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Port Royal, which sank in 1692 is now an underwater archaeological site.",
      "Port Royal which sank in 1692, is now an underwater archaeological site.",
      "Port Royal, which sank in 1692, is now an underwater archaeological site.",
      "Port Royal which sank in 1692 is now an underwater archaeological site.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'which sank in 1692\' must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "An earthquake destroyed two-thirds of Port Royal.",
      "Archaeologists recovered coins from the harbour floor.",
      "Two-thirds of Port Royal was destroyed by the earthquake.",
      "Donovan noticed the unlabelled sea on the map.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. \'Two-thirds of Port Royal\' receives the action \'was destroyed.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the word that correctly completes: \'Neither the coins nor the pottery ___ been disturbed by the divers.\'",
    options: [
      "have",
      "has",
      "was",
      "were",
    ],
    correctAnswer: 1,
    explanation: "With \'neither...nor,\' the verb agrees with the closest subject. \'The pottery\' is singular, so \'has\' is correct."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence uses a RELATIVE CLAUSE correctly?",
    options: [
      "Donovan, who sat near the window noticed the unlabelled sea first.",
      "Donovan who sat near the window, noticed the unlabelled sea first.",
      "Donovan, who sat near the window, noticed the unlabelled sea first.",
      "Donovan who sat near the window noticed the unlabelled sea first.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'who sat near the window\' must be enclosed by commas on both sides."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the ERROR: \'The earthquake, which occurred in 1692, were one of the most destructive in Caribbean history.\'",
    options: [
      "earthquake should be earthquakes",
      "were should be was",
      "in should be of",
      "which should be that",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the earthquake,\' which is singular. The correct verb is \'was,\' not \'were.\'"
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses a SEMICOLON correctly:",
    options: [
      "Port Royal was once powerful; but it was destroyed by an earthquake.",
      "Port Royal was once powerful; however, it was destroyed by an earthquake.",
      "Port Royal was once; powerful, it was destroyed by an earthquake.",
      "Port Royal was once powerful; and wealthy too.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by the conjunctive adverb \'however\' and a comma is a correct construction."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence maintains CONSISTENT tense?",
    options: [
      "Mr. Beckford pointed to the map and asks the class a question.",
      "Mr. Beckford points to the map and asked the class a question.",
      "Mr. Beckford pointed to the map and asked the class a question.",
      "Mr. Beckford had pointed to the map and asks the class a question.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses the simple past consistently: \'pointed\' and \'asked.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence with CORRECT apostrophe use:",
    options: [
      "The earthquake\'s effects were felt across the entire island.",
      "The earthquakes effects were felt across the entire island.",
      "The earthquake effects\' were felt across the entire island.",
      "The earthquakes\' effects were felt across the entire island.",
    ],
    correctAnswer: 0,
    explanation: "An apostrophe + s shows possession for a singular noun. \'The earthquake\'s effects\' is correct."
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses REPORTED SPEECH correctly?",
    options: [
      "Mr. Beckford said that Jamaica would not exist without the sea.",
      "Mr. Beckford said that Jamaica will not exist without the sea.",
      "Mr. Beckford said that Jamaica does not exist without the sea.",
      "Mr. Beckford said that Jamaica had not existed without the sea.",
    ],
    correctAnswer: 0,
    explanation: "In reported speech, \'would not exist\' correctly reports the original present-tense statement."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Port Royal should be better protected as a heritage site?",
    options: [
      "Port Royal sank in 1692 after a large earthquake.",
      "Archaeologists have found coins and weapons at Port Royal.",
      "Port Royal\'s submerged ruins represent an irreplaceable window into seventeenth-century Caribbean history that deserves urgent protection.",
      "Port Royal is located near Kingston Harbour.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, specific argument with a reason — ideal as a topic sentence for a persuasive paragraph."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED to improve paragraph focus? \'Mr. Beckford was an excellent teacher at Whitfield Town Primary. He used the classroom map to challenge his students\' thinking. He also coached the school football team on weekends. His most memorable lesson involved asking students what had no name on the map.\'",
    options: [
      "Mr. Beckford was an excellent teacher at Whitfield Town Primary.",
      "He used the classroom map to challenge his students\' thinking.",
      "He also coached the school football team on weekends.",
      "His most memorable lesson involved asking students what had no name on the map.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph focuses on Mr. Beckford as a classroom teacher. The sentence about coaching football is off-topic."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The earthquake was very bad and many people died.\'",
    options: [
      "The earthquake was very, very bad and so many people died.",
      "The earthquake happened and lots of people died from it.",
      "The earthquake of 1692 was catastrophic, claiming approximately two thousand lives within minutes and altering Jamaica forever.",
      "The earthquake was bad and people died because of it.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise language — \'catastrophic,\' \'approximately two thousand lives,\' \'within minutes\' — to convey the scale powerfully."
  },
  {
    id: 36,
    type: "writing",
    question: "A student wrote: \'Donovan looks at the map different after the lesson and notices things he never seen before.\' What is the MOST COMPLETE correction?",
    options: [
      "Donovan looked at the map differently after the lesson and noticed things he had never seen before.",
      "Donovan looks at the map differently after the lesson and notices things he never seen before.",
      "Donovan looked at the map different after the lesson and noticed things he had never seen before.",
      "Donovan looked at the map differently after the lesson and noticed things he never seen before.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects all errors: past tense (\'looked/noticed\'), adverb (\'differently\'), and past perfect (\'had never seen\')."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of specific evidence?",
    options: [
      "Port Royal was very important in history.",
      "Archaeologists have found many things at Port Royal.",
      "Archaeologists have recovered artefacts including coins, weapons, and a watch stopped at the exact time of the 1692 earthquake.",
      "Port Royal is an important place that people should know about.",
    ],
    correctAnswer: 2,
    explanation: "Option C provides specific details — the types of artefacts and the striking detail of the stopped watch — that make the evidence vivid and convincing."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about Donovan\'s lesson about maps?",
    options: [
      "Donovan enjoyed Mr. Beckford\'s geography lessons.",
      "The map in Mr. Beckford\'s classroom was old and had yellowed edges.",
      "Like Donovan, we would all benefit from learning to look beyond what is labelled — for it is often in the unnamed spaces that the most important truths are found.",
      "Donovan went home and told his mother about the map.",
    ],
    correctAnswer: 2,
    explanation: "Option C extends Donovan\'s lesson into a broader universal insight — the kind of memorable conclusion that gives a paragraph lasting impact."
  },
  {
    id: 39,
    type: "writing",
    question: "A student is writing a report on Port Royal for a history project. Which sentence BEST introduces the topic?",
    options: [
      "I am going to tell you about Port Royal in my report.",
      "Port Royal is near Kingston Harbour and it sank a long time ago.",
      "Once the wealthiest and most powerful city in the western hemisphere, Port Royal met a dramatic end when a catastrophic earthquake swallowed two-thirds of it into the sea in 1692.",
      "Port Royal was where pirates lived and worked a long time ago.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific, uses formal language, and immediately engages the reader with a dramatic, fact-rich statement."
  },
  {
    id: 40,
    type: "writing",
    question: "Which BEST describes the structure of a well-organised paragraph?",
    options: [
      "A list of interesting facts about a topic",
      "A topic sentence, supporting details with evidence, and a closing sentence that restates the main idea",
      "An opening question followed by a long personal story",
      "Several sentences, each about a different topic",
    ],
    correctAnswer: 1,
    explanation: "A well-organised paragraph has a topic sentence, supporting details, and a closing sentence. Option B describes this correctly."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate6MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate6Questions : literacyModerate6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 6</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 6 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 6</h1>
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
