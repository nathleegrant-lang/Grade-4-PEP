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

const literacyModerate8Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Norman Washington Manley: Architect of Modern Jamaica

Norman Washington Manley was born on July 4, 1893, in Roxborough, Manchester, Jamaica. He was an exceptionally gifted student who won a Rhodes Scholarship to Oxford University in England, where he studied law. He returned to Jamaica as a brilliant barrister — a lawyer who argues cases in court — and quickly became one of the most respected legal minds on the island.

Beyond the courtroom, Manley was deeply committed to the political and social advancement of the Jamaican people. In 1938, he founded the People's National Party (PNP), one of Jamaica's two major political parties. The PNP was established during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions. Manley believed that ordinary Jamaicans deserved a greater say in how their country was governed.

Manley was a central figure in Jamaica's push for universal adult suffrage — the right of all adults, regardless of income or property, to vote. This right was achieved in 1944. He also played a pivotal role in Jamaica's journey toward independence, which was achieved on August 6, 1962. Although it was his political rival, Alexander Bustamante, who became Jamaica's first Prime Minister, Manley's groundwork was essential to the nation's democratic foundations.

Norman Manley was declared a National Hero of Jamaica and is honoured on the Jamaican five-hundred-dollar bill. The Norman Manley International Airport in Kingston is also named in his honour. He is remembered as one of the most important architects of modern Jamaica.`,
    question: "What is the MAIN IDEA of the passage about Norman Manley?",
    options: [
      "Norman Manley was the first Prime Minister of Jamaica.",
      "Norman Manley was a lawyer who won a scholarship to Oxford.",
      "Norman Manley was a gifted lawyer and political leader who played a crucial role in shaping modern Jamaica.",
      "Norman Manley founded the Jamaica Labour Party in 1938.",
    ],
    correctAnswer: 2,
    explanation: "The passage covers Manley\'s education, legal career, political work, and legacy. Option C captures all of this."
  },
  {
    id: 2,
    type: "reading",
    passage: `Norman Washington Manley: Architect of Modern Jamaica

Norman Washington Manley was born on July 4, 1893, in Roxborough, Manchester, Jamaica. He was an exceptionally gifted student who won a Rhodes Scholarship to Oxford University in England, where he studied law. He returned to Jamaica as a brilliant barrister — a lawyer who argues cases in court — and quickly became one of the most respected legal minds on the island.

Beyond the courtroom, Manley was deeply committed to the political and social advancement of the Jamaican people. In 1938, he founded the People's National Party (PNP), one of Jamaica's two major political parties. The PNP was established during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions. Manley believed that ordinary Jamaicans deserved a greater say in how their country was governed.

Manley was a central figure in Jamaica's push for universal adult suffrage — the right of all adults, regardless of income or property, to vote. This right was achieved in 1944. He also played a pivotal role in Jamaica's journey toward independence, which was achieved on August 6, 1962. Although it was his political rival, Alexander Bustamante, who became Jamaica's first Prime Minister, Manley's groundwork was essential to the nation's democratic foundations.

Norman Manley was declared a National Hero of Jamaica and is honoured on the Jamaican five-hundred-dollar bill. The Norman Manley International Airport in Kingston is also named in his honour. He is remembered as one of the most important architects of modern Jamaica.`,
    question: "What was universal adult suffrage?",
    options: [
      "The right to run for political office",
      "The right of all adults to vote regardless of income or property",
      "The right of adults to free education",
      "The right of workers to form trade unions",
    ],
    correctAnswer: 1,
    explanation: "The passage defines universal adult suffrage as the right of all adults, regardless of income or property, to vote."
  },
  {
    id: 3,
    type: "reading",
    passage: `Norman Washington Manley: Architect of Modern Jamaica

Norman Washington Manley was born on July 4, 1893, in Roxborough, Manchester, Jamaica. He was an exceptionally gifted student who won a Rhodes Scholarship to Oxford University in England, where he studied law. He returned to Jamaica as a brilliant barrister — a lawyer who argues cases in court — and quickly became one of the most respected legal minds on the island.

Beyond the courtroom, Manley was deeply committed to the political and social advancement of the Jamaican people. In 1938, he founded the People's National Party (PNP), one of Jamaica's two major political parties. The PNP was established during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions. Manley believed that ordinary Jamaicans deserved a greater say in how their country was governed.

Manley was a central figure in Jamaica's push for universal adult suffrage — the right of all adults, regardless of income or property, to vote. This right was achieved in 1944. He also played a pivotal role in Jamaica's journey toward independence, which was achieved on August 6, 1962. Although it was his political rival, Alexander Bustamante, who became Jamaica's first Prime Minister, Manley's groundwork was essential to the nation's democratic foundations.

Norman Manley was declared a National Hero of Jamaica and is honoured on the Jamaican five-hundred-dollar bill. The Norman Manley International Airport in Kingston is also named in his honour. He is remembered as one of the most important architects of modern Jamaica.`,
    question: "What can be INFERRED about the period when the PNP was founded?",
    options: [
      "Jamaica was a peaceful and prosperous country in 1938.",
      "Jamaican workers were satisfied with their wages in 1938.",
      "There was significant social and economic inequality that caused widespread unrest.",
      "The British government had already agreed to give Jamaica independence.",
    ],
    correctAnswer: 2,
    explanation: "The passage states the PNP was founded \'during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions.\'"
  },
  {
    id: 4,
    type: "reading",
    passage: `Norman Washington Manley: Architect of Modern Jamaica

Norman Washington Manley was born on July 4, 1893, in Roxborough, Manchester, Jamaica. He was an exceptionally gifted student who won a Rhodes Scholarship to Oxford University in England, where he studied law. He returned to Jamaica as a brilliant barrister — a lawyer who argues cases in court — and quickly became one of the most respected legal minds on the island.

Beyond the courtroom, Manley was deeply committed to the political and social advancement of the Jamaican people. In 1938, he founded the People's National Party (PNP), one of Jamaica's two major political parties. The PNP was established during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions. Manley believed that ordinary Jamaicans deserved a greater say in how their country was governed.

Manley was a central figure in Jamaica's push for universal adult suffrage — the right of all adults, regardless of income or property, to vote. This right was achieved in 1944. He also played a pivotal role in Jamaica's journey toward independence, which was achieved on August 6, 1962. Although it was his political rival, Alexander Bustamante, who became Jamaica's first Prime Minister, Manley's groundwork was essential to the nation's democratic foundations.

Norman Manley was declared a National Hero of Jamaica and is honoured on the Jamaican five-hundred-dollar bill. The Norman Manley International Airport in Kingston is also named in his honour. He is remembered as one of the most important architects of modern Jamaica.`,
    question: "What does \'PIVOTAL\' most likely mean in \'He also played a pivotal role in Jamaica\'s journey toward independence\'?",
    options: [
      "minor and unimportant",
      "recent and unexpected",
      "central and critically important",
      "long and complicated",
    ],
    correctAnswer: 2,
    explanation: "Pivotal means of critical importance — central to the outcome."
  },
  {
    id: 5,
    type: "reading",
    passage: `Norman Washington Manley: Architect of Modern Jamaica

Norman Washington Manley was born on July 4, 1893, in Roxborough, Manchester, Jamaica. He was an exceptionally gifted student who won a Rhodes Scholarship to Oxford University in England, where he studied law. He returned to Jamaica as a brilliant barrister — a lawyer who argues cases in court — and quickly became one of the most respected legal minds on the island.

Beyond the courtroom, Manley was deeply committed to the political and social advancement of the Jamaican people. In 1938, he founded the People's National Party (PNP), one of Jamaica's two major political parties. The PNP was established during a period of great social unrest, when Jamaican workers were rising up against poor wages and harsh working conditions. Manley believed that ordinary Jamaicans deserved a greater say in how their country was governed.

Manley was a central figure in Jamaica's push for universal adult suffrage — the right of all adults, regardless of income or property, to vote. This right was achieved in 1944. He also played a pivotal role in Jamaica's journey toward independence, which was achieved on August 6, 1962. Although it was his political rival, Alexander Bustamante, who became Jamaica's first Prime Minister, Manley's groundwork was essential to the nation's democratic foundations.

Norman Manley was declared a National Hero of Jamaica and is honoured on the Jamaican five-hundred-dollar bill. The Norman Manley International Airport in Kingston is also named in his honour. He is remembered as one of the most important architects of modern Jamaica.`,
    question: "What is the AUTHOR\'S PURPOSE in writing the passage about Norman Manley?",
    options: [
      "To argue that Manley was a better leader than Bustamante",
      "To inform readers about Manley\'s life, contributions, and lasting legacy",
      "To persuade readers to join the People\'s National Party",
      "To entertain readers with stories from Manley\'s time at Oxford",
    ],
    correctAnswer: 1,
    explanation: "The passage presents biographical information and discusses Manley\'s contributions and legacy. The purpose is to inform."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Empty Lot

For as long as anyone could remember, the empty lot on Acacia Drive had been a problem. Weeds grew as tall as a child's shoulder. Old tyres and broken glass lurked in the undergrowth. The neighbours talked about it endlessly but nobody did anything — until the day Petra decided she had had enough.

Petra was eleven years old. She did not ask for permission. She went to Mr. Thompson next door and borrowed a cutlass. She went to Miss Samuels across the road and borrowed a rake. She started clearing.

By lunchtime, three neighbours had come to help. By evening, seven more had joined. Nobody had planned it. It simply happened the way things sometimes do when one person stops waiting for someone else to begin.

Three weeks later, the lot had been transformed. There were raised garden beds made from old wooden pallets, a small seating area with two benches built from reclaimed timber, and a painted mural on the back wall showing a river, a mountain, and the outline of a Doctor Bird in flight.

On the morning the garden opened, Mr. Thompson looked at Petra and said, "This was your doing." Petra shook her head. "This was everyone's doing," she said. "I just started." `,
    question: "What does Petra\'s decision to start clearing WITHOUT asking for permission suggest?",
    options: [
      "She was disrespectful of others in her community.",
      "She was impatient and difficult to work with.",
      "She was a self-motivated, decisive individual who believed action was better than discussion.",
      "She did not think the task would take very long.",
    ],
    correctAnswer: 2,
    explanation: "Petra does not wait for a meeting or organiser — she simply starts. This shows she is self-motivated and action-oriented."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Empty Lot

For as long as anyone could remember, the empty lot on Acacia Drive had been a problem. Weeds grew as tall as a child's shoulder. Old tyres and broken glass lurked in the undergrowth. The neighbours talked about it endlessly but nobody did anything — until the day Petra decided she had had enough.

Petra was eleven years old. She did not ask for permission. She went to Mr. Thompson next door and borrowed a cutlass. She went to Miss Samuels across the road and borrowed a rake. She started clearing.

By lunchtime, three neighbours had come to help. By evening, seven more had joined. Nobody had planned it. It simply happened the way things sometimes do when one person stops waiting for someone else to begin.

Three weeks later, the lot had been transformed. There were raised garden beds made from old wooden pallets, a small seating area with two benches built from reclaimed timber, and a painted mural on the back wall showing a river, a mountain, and the outline of a Doctor Bird in flight.

On the morning the garden opened, Mr. Thompson looked at Petra and said, "This was your doing." Petra shook her head. "This was everyone's doing," she said. "I just started." `,
    question: "What is the SIGNIFICANCE of \'It simply happened the way things sometimes do when one person stops waiting for someone else to begin.\'?",
    options: [
      "The neighbours had already planned the project before Petra started.",
      "Collective action often begins with one individual taking the first step.",
      "Nobody really wanted to help Petra.",
      "The neighbours were bored and looking for something to do.",
    ],
    correctAnswer: 1,
    explanation: "This sentence reflects the idea that community action can be sparked by a single person willing to take initiative."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Empty Lot

For as long as anyone could remember, the empty lot on Acacia Drive had been a problem. Weeds grew as tall as a child's shoulder. Old tyres and broken glass lurked in the undergrowth. The neighbours talked about it endlessly but nobody did anything — until the day Petra decided she had had enough.

Petra was eleven years old. She did not ask for permission. She went to Mr. Thompson next door and borrowed a cutlass. She went to Miss Samuels across the road and borrowed a rake. She started clearing.

By lunchtime, three neighbours had come to help. By evening, seven more had joined. Nobody had planned it. It simply happened the way things sometimes do when one person stops waiting for someone else to begin.

Three weeks later, the lot had been transformed. There were raised garden beds made from old wooden pallets, a small seating area with two benches built from reclaimed timber, and a painted mural on the back wall showing a river, a mountain, and the outline of a Doctor Bird in flight.

On the morning the garden opened, Mr. Thompson looked at Petra and said, "This was your doing." Petra shook her head. "This was everyone's doing," she said. "I just started." `,
    question: "Why does Petra say \'This was everyone\'s doing\' rather than accepting full credit?",
    options: [
      "She is shy and does not like being praised.",
      "She is being dishonest about her role.",
      "She recognises that the success depended on the whole community\'s effort.",
      "She is angry at Mr. Thompson.",
    ],
    correctAnswer: 2,
    explanation: "By saying \'This was everyone\'s doing,\' Petra acknowledges that the transformation required the work of the whole community."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Empty Lot

For as long as anyone could remember, the empty lot on Acacia Drive had been a problem. Weeds grew as tall as a child's shoulder. Old tyres and broken glass lurked in the undergrowth. The neighbours talked about it endlessly but nobody did anything — until the day Petra decided she had had enough.

Petra was eleven years old. She did not ask for permission. She went to Mr. Thompson next door and borrowed a cutlass. She went to Miss Samuels across the road and borrowed a rake. She started clearing.

By lunchtime, three neighbours had come to help. By evening, seven more had joined. Nobody had planned it. It simply happened the way things sometimes do when one person stops waiting for someone else to begin.

Three weeks later, the lot had been transformed. There were raised garden beds made from old wooden pallets, a small seating area with two benches built from reclaimed timber, and a painted mural on the back wall showing a river, a mountain, and the outline of a Doctor Bird in flight.

On the morning the garden opened, Mr. Thompson looked at Petra and said, "This was your doing." Petra shook her head. "This was everyone's doing," she said. "I just started." `,
    question: "What does the MURAL on the back wall suggest about the community\'s values?",
    options: [
      "They want to move away from Acacia Drive.",
      "They value Jamaican natural heritage and national identity.",
      "They want to attract tourists to their neighbourhood.",
      "They are skilled professional artists.",
    ],
    correctAnswer: 1,
    explanation: "The mural shows a river, a mountain, and a Doctor Bird — all symbols of Jamaican natural beauty and national identity."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Empty Lot

For as long as anyone could remember, the empty lot on Acacia Drive had been a problem. Weeds grew as tall as a child's shoulder. Old tyres and broken glass lurked in the undergrowth. The neighbours talked about it endlessly but nobody did anything — until the day Petra decided she had had enough.

Petra was eleven years old. She did not ask for permission. She went to Mr. Thompson next door and borrowed a cutlass. She went to Miss Samuels across the road and borrowed a rake. She started clearing.

By lunchtime, three neighbours had come to help. By evening, seven more had joined. Nobody had planned it. It simply happened the way things sometimes do when one person stops waiting for someone else to begin.

Three weeks later, the lot had been transformed. There were raised garden beds made from old wooden pallets, a small seating area with two benches built from reclaimed timber, and a painted mural on the back wall showing a river, a mountain, and the outline of a Doctor Bird in flight.

On the morning the garden opened, Mr. Thompson looked at Petra and said, "This was your doing." Petra shook her head. "This was everyone's doing," she said. "I just started." `,
    question: "Which word BEST describes how the community\'s involvement came about?",
    options: [
      "Planned and organised in advance",
      "Forced by local authorities",
      "Spontaneous and organic",
      "Slow and reluctant",
    ],
    correctAnswer: 2,
    explanation: "The passage states \'Nobody had planned it. It simply happened.\' The community\'s involvement was spontaneous."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Manley was an EXCEPTIONALLY gifted student.\" The word \'exceptionally\' means —",
    options: [
      "barely or just enough",
      "in an ordinary way",
      "to an unusually high degree",
      "recently or newly",
    ],
    correctAnswer: 2,
    explanation: "Exceptionally means to a degree that is much greater than usual."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Old tyres and broken glass LURKED in the undergrowth.\" The word \'lurked\' means —",
    options: [
      "were piled neatly",
      "lay hidden in a threatening or sinister way",
      "were clearly visible",
      "had been recently removed",
    ],
    correctAnswer: 1,
    explanation: "To lurk means to be present in a concealed and somewhat threatening way."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "Which word is CLOSEST in meaning to \'transformed\'?",
    options: [
      "slightly improved",
      "completely changed",
      "partially repaired",
      "carefully cleaned",
    ],
    correctAnswer: 1,
    explanation: "Transformed means completely changed in appearance or character."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Manley\'s GROUNDWORK was essential to the nation\'s democratic foundations.\" The word \'groundwork\' means —",
    options: [
      "the physical land on which a building stands",
      "the preliminary work that provides a foundation for later achievement",
      "a legal document signed by a government",
      "the first official speech made by a new Prime Minister",
    ],
    correctAnswer: 1,
    explanation: "Groundwork refers to foundational work done in advance that makes later achievement possible."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"RECLAIMED timber was used to build the benches.\" The word \'reclaimed\' means —",
    options: [
      "brand new and freshly cut",
      "treated with special chemicals",
      "recovered and reused from previous use",
      "imported from another country",
    ],
    correctAnswer: 2,
    explanation: "Reclaimed material has been recovered from previous use and repurposed rather than discarded."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The workers were rising up against HARSH working conditions.\" The word \'harsh\' means —",
    options: [
      "generous and comfortable",
      "pleasant and fair",
      "severe and difficult",
      "temporary and changeable",
    ],
    correctAnswer: 2,
    explanation: "Harsh means severe, difficult, and lacking in comfort or fairness."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Manley was COMMITTED to the political advancement of the Jamaican people.\" The word \'committed\' means —",
    options: [
      "uncertain and unsure",
      "deeply dedicated to a cause",
      "forced to do something",
      "temporarily involved",
    ],
    correctAnswer: 1,
    explanation: "Committed means deeply dedicated and devoted to a goal or cause."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "The passage says Manley is remembered as an \'ARCHITECT of modern Jamaica.\' Here \'architect\' means —",
    options: [
      "a person who designs buildings",
      "someone who imagined and built something new",
      "a legal expert",
      "a person who writes history books",
    ],
    correctAnswer: 1,
    explanation: "Used figuratively, architect means someone who designs and creates something significant."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"One person stops WAITING for someone else to begin.\" The word \'waiting\' suggests —",
    options: [
      "planning carefully before taking action",
      "expecting someone else to take responsibility",
      "asking others for permission",
      "preparing materials for a project",
    ],
    correctAnswer: 1,
    explanation: "Waiting here implies passively expecting someone else to act rather than taking initiative yourself."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Manley was committed to the political and social ADVANCEMENT of the Jamaican people.\" The word \'advancement\' means —",
    options: [
      "the history and heritage of a people",
      "progress and improvement",
      "the laws and rights of a country",
      "the wealth and economy of a nation",
    ],
    correctAnswer: 1,
    explanation: "Advancement means progress, improvement, and moving forward to a better position."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The contributions of Norman Manley to Jamaica\'s democracy is significant.",
      "The contributions of Norman Manley to Jamaica\'s democracy are significant.",
      "The contributions of Norman Manley to Jamaica\'s democracy was significant.",
      "The contributions of Norman Manley to Jamaica\'s democracy were significant.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'contributions,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Petra finished, the neighbours arrive to help.",
      "By the time Petra finished, the neighbours had arrived to help.",
      "By the time Petra finished, the neighbours were arriving to help.",
      "By the time Petra finished, the neighbours have arrived to help.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had\' + past participle) shows an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although Bustamante became Jamaica\'s first Prime Minister, Manley\'s groundwork was essential.\'",
    options: [
      "Manley\'s groundwork was essential",
      "Although Bustamante became Jamaica\'s first Prime Minister",
      "Bustamante became Jamaica\'s first Prime Minister",
      "was essential",
    ],
    correctAnswer: 1,
    explanation: "A subordinate clause cannot stand alone. \'Although Bustamante became Jamaica\'s first Prime Minister\' is dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Norman Manley, who founded the PNP in 1938 is celebrated as a National Hero.",
      "Norman Manley who founded the PNP in 1938, is celebrated as a National Hero.",
      "Norman Manley, who founded the PNP in 1938, is celebrated as a National Hero.",
      "Norman Manley who founded the PNP in 1938 is celebrated as a National Hero.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'who founded the PNP in 1938\' must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Manley founded the People\'s National Party in 1938.",
      "The People\'s National Party was founded by Manley in 1938.",
      "Manley returned to Jamaica after studying at Oxford.",
      "Petra began clearing the empty lot on Acacia Drive.",
    ],
    correctAnswer: 1,
    explanation: "In the passive voice, the subject receives the action. \'The People\'s National Party\' receives the action \'was founded.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the word that correctly completes: \'Neither the residents nor Petra ___ expected such a large turnout.\'",
    options: [
      "have",
      "were",
      "had",
      "has",
    ],
    correctAnswer: 2,
    explanation: "With \'neither...nor,\' the verb agrees with the closest subject. \'Petra\' is singular, so \'had expected\' is correct."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Manley believed in justice, education, and that workers deserved fair wages.",
      "Manley believed in justice, education, and fair wages for workers.",
      "Manley believed in justice, education, and to give workers fair wages.",
      "Manley believed in justice, workers\' fair wages, and education.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a list to use the same grammatical form. Option B uses three nouns: justice, education, and fair wages."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the ERROR: \'Petra and her neighbours has transformed the empty lot into a beautiful community garden.\'",
    options: [
      "has should be have",
      "Petra should be She",
      "into should be to",
      "transformed should be transform",
    ],
    correctAnswer: 0,
    explanation: "\'Petra and her neighbours\' is a plural subject. The correct verb is \'have transformed.\'"
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses a SEMICOLON correctly:",
    options: [
      "Manley was a brilliant lawyer; who also founded a political party.",
      "Manley was a brilliant lawyer; and he also founded a political party.",
      "Manley was a brilliant lawyer; he also founded a political party.",
      "Manley was a brilliant lawyer; but politics changed his life.",
    ],
    correctAnswer: 2,
    explanation: "A semicolon correctly joins two independent clauses without a conjunction."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence maintains CONSISTENT tense?",
    options: [
      "Petra borrowed a cutlass and starts clearing the lot.",
      "Petra borrowed a cutlass and started clearing the lot.",
      "Petra borrows a cutlass and started clearing the lot.",
      "Petra had borrowed a cutlass and starts clearing the lot.",
    ],
    correctAnswer: 1,
    explanation: "Option B consistently uses the simple past: \'borrowed\' and \'started.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence uses DIRECT SPEECH correctly?",
    options: [
      "Mr. Thompson said, \"This was your doing.\"",
      "Mr. Thompson said This was your doing.",
      "Mr. Thompson said, this was your doing.",
      "Mr. Thompson said: This was your doing.",
    ],
    correctAnswer: 0,
    explanation: "Direct speech places quotation marks around the exact words and uses a comma before the opening quotation mark."
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses REPORTED SPEECH correctly?",
    options: [
      "Petra said that this is everyone\'s doing.",
      "Petra said that this would be everyone\'s doing.",
      "Petra said that this was everyone\'s doing.",
      "Petra said that this has been everyone\'s doing.",
    ],
    correctAnswer: 2,
    explanation: "In reported speech, \'this is\' becomes \'this was.\' Option C is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that community gardens improve neighbourhoods?",
    options: [
      "Community gardens have flowers, vegetables, and benches.",
      "Some people prefer to buy their vegetables at the supermarket.",
      "Community gardens transform neglected spaces into productive, beautiful places that strengthen social bonds and improve quality of life.",
      "It takes a lot of hard work to build a community garden.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, multi-dimensional claim about the benefits of community gardens."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'Norman Manley was born in Manchester, Jamaica, in 1893. He won a scholarship to Oxford University. He became a leading barrister. Manley loved cricket and played it often as a young man. He founded the People\'s National Party in 1938.\'",
    options: [
      "He won a scholarship to Oxford University.",
      "He became a leading barrister.",
      "Manley loved cricket and played it often as a young man.",
      "He founded the People\'s National Party in 1938.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph focuses on Manley\'s academic and political achievements. The sentence about cricket is off-topic."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The lot was very bad and nobody did anything about it for a long time.\'",
    options: [
      "The lot was very, very bad and nobody did anything about it at all.",
      "For years, the overgrown and hazardous lot on Acacia Drive went unaddressed, a silent symbol of community inaction.",
      "The lot was bad and it was there for a long time and nobody fixed it.",
      "Nobody did anything about the very bad lot for a very long time.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise language — \'overgrown,\' \'hazardous,\' \'unaddressed,\' \'silent symbol of community inaction\' — to paint a vivid, meaningful picture."
  },
  {
    id: 36,
    type: "writing",
    question: "A student wrote: \'Manley were a important lawyer and he founded the PNP in 1938 which is one of Jamaica\'s two main partys.\' Choose the MOST COMPLETE correction:",
    options: [
      "Manley was an important lawyer, and he founded the PNP in 1938, which is one of Jamaica\'s two main parties.",
      "Manley were an important lawyer, and he founded the PNP in 1938, which is one of Jamaica\'s two main parties.",
      "Manley was a important lawyer, and he founded the PNP in 1938, which is one of Jamaica\'s two main partys.",
      "Manley was an important lawyer and he founded the PNP in 1938 which is one of Jamaica\'s two main parties.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects all errors: \'were\' to \'was,\' \'a\' to \'an,\' \'partys\' to \'parties,\' and adds correct commas."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence uses the MOST PRECISE and FORMAL language for a biography?",
    options: [
      "Manley was a really smart lawyer who helped Jamaica a lot.",
      "Norman Washington Manley made significant contributions to Jamaica\'s legal, political, and democratic development.",
      "Manley worked hard and did important things for Jamaica.",
      "People think Manley was one of the best leaders Jamaica ever had.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses formal vocabulary and is specific, professional, and precise."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about Norman Manley\'s legacy?",
    options: [
      "Manley\'s portrait appears on the five-hundred-dollar bill.",
      "The Norman Manley International Airport is named after him.",
      "In a nation that continues to define itself, Norman Manley\'s legacy reminds us that the most enduring structures are built not with stone, but with justice, vision, and quiet determination.",
      "Norman Manley died before he could see Jamaica fully realise its potential.",
    ],
    correctAnswer: 2,
    explanation: "Option C is powerful and metaphorical — connecting Manley\'s legacy to the ongoing story of Jamaica."
  },
  {
    id: 39,
    type: "writing",
    question: "A student is writing a speech about community action inspired by Petra\'s story. Which opening BEST captures the audience\'s attention?",
    options: [
      "Today I am going to talk about a girl named Petra who cleaned up a lot.",
      "A community garden was made by some neighbours on Acacia Drive.",
      "What would happen if, instead of waiting for someone else to act, each of us decided — right now — that we were that someone?",
      "Communities should work together to improve their neighbourhoods.",
    ],
    correctAnswer: 2,
    explanation: "Option C opens with a powerful rhetorical question that immediately engages the audience and introduces the theme of personal initiative."
  },
  {
    id: 40,
    type: "writing",
    question: "Which BEST describes what makes writing persuasive?",
    options: [
      "Using the longest and most difficult words possible",
      "Writing only about things that are personally interesting",
      "Making a clear claim, supporting it with specific evidence, and addressing the reader\'s concerns directly",
      "Including as many examples as possible without explaining them",
    ],
    correctAnswer: 2,
    explanation: "Effective persuasive writing combines a clear claim, strong evidence, and direct engagement with the reader\'s perspective."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate8MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate8Questions : literacyModerate8Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 8</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 8</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 8 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 8</h1>
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
