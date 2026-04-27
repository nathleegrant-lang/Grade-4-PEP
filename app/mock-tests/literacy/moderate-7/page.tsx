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

const literacyModerate7Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Coral Reef: Rainforests of the Sea

Coral reefs are sometimes called the rainforests of the sea. Like tropical rainforests on land, they are home to an extraordinary diversity of life. Although coral reefs cover less than one percent of the ocean floor, they support approximately twenty-five percent of all marine species. The reefs of Jamaica and the wider Caribbean are among the most biodiverse marine environments on earth.

A coral reef is not a rock — it is a living structure. Coral is made up of tiny animals called polyps, which secrete hard calcium carbonate skeletons. Over thousands of years, these skeletons accumulate and form the structures we call reefs. The Great Barrier Reef in Australia, the largest reef system in the world, has been growing for more than twenty thousand years.

Despite their importance, coral reefs are under severe threat. Rising ocean temperatures caused by climate change lead to a phenomenon called coral bleaching, in which corals expel the algae living in their tissues and turn white. Without the algae, the coral cannot survive. Pollution, overfishing, and coastal development further damage these fragile ecosystems.

Jamaica has lost more than eighty percent of its coral reefs in the past fifty years. This loss has serious consequences — not only for marine life, but also for the fishing communities that depend on healthy reefs, and for coastlines that rely on reefs for protection against storm waves. Scientists, governments, and local communities are working together to restore damaged reefs and protect what remains.`,
    question: "What is the MAIN IDEA of the coral reef passage?",
    options: [
      "Coral reefs are only found in Australia and Jamaica.",
      "Coral reefs are diverse and vital marine ecosystems that are now severely threatened.",
      "Overfishing is the only major threat to coral reefs.",
      "The Great Barrier Reef is the most important reef in the world.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers what reefs are, their importance, the threats they face, and Jamaica\'s reef loss. Option B captures all of this."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Coral Reef: Rainforests of the Sea

Coral reefs are sometimes called the rainforests of the sea. Like tropical rainforests on land, they are home to an extraordinary diversity of life. Although coral reefs cover less than one percent of the ocean floor, they support approximately twenty-five percent of all marine species. The reefs of Jamaica and the wider Caribbean are among the most biodiverse marine environments on earth.

A coral reef is not a rock — it is a living structure. Coral is made up of tiny animals called polyps, which secrete hard calcium carbonate skeletons. Over thousands of years, these skeletons accumulate and form the structures we call reefs. The Great Barrier Reef in Australia, the largest reef system in the world, has been growing for more than twenty thousand years.

Despite their importance, coral reefs are under severe threat. Rising ocean temperatures caused by climate change lead to a phenomenon called coral bleaching, in which corals expel the algae living in their tissues and turn white. Without the algae, the coral cannot survive. Pollution, overfishing, and coastal development further damage these fragile ecosystems.

Jamaica has lost more than eighty percent of its coral reefs in the past fifty years. This loss has serious consequences — not only for marine life, but also for the fishing communities that depend on healthy reefs, and for coastlines that rely on reefs for protection against storm waves. Scientists, governments, and local communities are working together to restore damaged reefs and protect what remains.`,
    question: "Why are coral reefs called \'the rainforests of the sea\'?",
    options: [
      "Because they are found in tropical areas near rainforests",
      "Because they are green and full of plants",
      "Because they support extraordinary diversity of life despite covering a small area",
      "Because they produce oxygen like rainforest trees",
    ],
    correctAnswer: 2,
    explanation: "Like rainforests, coral reefs support extraordinary biodiversity despite covering less than one percent of the ocean floor."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Coral Reef: Rainforests of the Sea

Coral reefs are sometimes called the rainforests of the sea. Like tropical rainforests on land, they are home to an extraordinary diversity of life. Although coral reefs cover less than one percent of the ocean floor, they support approximately twenty-five percent of all marine species. The reefs of Jamaica and the wider Caribbean are among the most biodiverse marine environments on earth.

A coral reef is not a rock — it is a living structure. Coral is made up of tiny animals called polyps, which secrete hard calcium carbonate skeletons. Over thousands of years, these skeletons accumulate and form the structures we call reefs. The Great Barrier Reef in Australia, the largest reef system in the world, has been growing for more than twenty thousand years.

Despite their importance, coral reefs are under severe threat. Rising ocean temperatures caused by climate change lead to a phenomenon called coral bleaching, in which corals expel the algae living in their tissues and turn white. Without the algae, the coral cannot survive. Pollution, overfishing, and coastal development further damage these fragile ecosystems.

Jamaica has lost more than eighty percent of its coral reefs in the past fifty years. This loss has serious consequences — not only for marine life, but also for the fishing communities that depend on healthy reefs, and for coastlines that rely on reefs for protection against storm waves. Scientists, governments, and local communities are working together to restore damaged reefs and protect what remains.`,
    question: "What is CORAL BLEACHING?",
    options: [
      "When coral turns bright colours due to pollution",
      "When corals expel the algae in their tissues and turn white, leading to their death",
      "When sunlight bleaches the surface of coral",
      "When fishing nets scrape the colour off coral",
    ],
    correctAnswer: 1,
    explanation: "The passage defines coral bleaching as the phenomenon in which corals expel the algae in their tissues and turn white — without the algae, they cannot survive."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Coral Reef: Rainforests of the Sea

Coral reefs are sometimes called the rainforests of the sea. Like tropical rainforests on land, they are home to an extraordinary diversity of life. Although coral reefs cover less than one percent of the ocean floor, they support approximately twenty-five percent of all marine species. The reefs of Jamaica and the wider Caribbean are among the most biodiverse marine environments on earth.

A coral reef is not a rock — it is a living structure. Coral is made up of tiny animals called polyps, which secrete hard calcium carbonate skeletons. Over thousands of years, these skeletons accumulate and form the structures we call reefs. The Great Barrier Reef in Australia, the largest reef system in the world, has been growing for more than twenty thousand years.

Despite their importance, coral reefs are under severe threat. Rising ocean temperatures caused by climate change lead to a phenomenon called coral bleaching, in which corals expel the algae living in their tissues and turn white. Without the algae, the coral cannot survive. Pollution, overfishing, and coastal development further damage these fragile ecosystems.

Jamaica has lost more than eighty percent of its coral reefs in the past fifty years. This loss has serious consequences — not only for marine life, but also for the fishing communities that depend on healthy reefs, and for coastlines that rely on reefs for protection against storm waves. Scientists, governments, and local communities are working together to restore damaged reefs and protect what remains.`,
    question: "What can be INFERRED about Jamaica\'s fishing communities from this passage?",
    options: [
      "They have already moved away from coastal areas.",
      "They are largely unaffected by the loss of coral reefs.",
      "They depend on healthy coral reefs for their livelihoods.",
      "They are the main cause of reef destruction in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "The passage states the loss of reefs has consequences for \'fishing communities that depend on healthy reefs\' — implying they rely on reefs to survive."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Coral Reef: Rainforests of the Sea

Coral reefs are sometimes called the rainforests of the sea. Like tropical rainforests on land, they are home to an extraordinary diversity of life. Although coral reefs cover less than one percent of the ocean floor, they support approximately twenty-five percent of all marine species. The reefs of Jamaica and the wider Caribbean are among the most biodiverse marine environments on earth.

A coral reef is not a rock — it is a living structure. Coral is made up of tiny animals called polyps, which secrete hard calcium carbonate skeletons. Over thousands of years, these skeletons accumulate and form the structures we call reefs. The Great Barrier Reef in Australia, the largest reef system in the world, has been growing for more than twenty thousand years.

Despite their importance, coral reefs are under severe threat. Rising ocean temperatures caused by climate change lead to a phenomenon called coral bleaching, in which corals expel the algae living in their tissues and turn white. Without the algae, the coral cannot survive. Pollution, overfishing, and coastal development further damage these fragile ecosystems.

Jamaica has lost more than eighty percent of its coral reefs in the past fifty years. This loss has serious consequences — not only for marine life, but also for the fishing communities that depend on healthy reefs, and for coastlines that rely on reefs for protection against storm waves. Scientists, governments, and local communities are working together to restore damaged reefs and protect what remains.`,
    question: "What does the passage suggest about coral reefs and coastlines?",
    options: [
      "Coastlines damage coral reefs through pollution.",
      "Coral reefs protect coastlines from the full force of storm waves.",
      "Coastlines are not affected by the loss of coral reefs.",
      "Coral reefs only benefit coastlines in Australia.",
    ],
    correctAnswer: 1,
    explanation: "The passage states coastlines \'rely on reefs for protection against storm waves,\' showing reefs act as natural barriers."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Examination

The night before her PEP examination, Camille could not sleep. She lay on her back staring at the ceiling, listening to the tree frogs calling outside. Her pencils were already sharpened and lined up in her pencil case. Her school uniform was pressed and hanging on the door. Everything that could be done had been done.

Her mother appeared in the doorway. "Still awake?" she said softly.

Camille nodded. "What if I forget everything?"

Her mother came and sat on the edge of the bed. "You won't," she said. "You've worked for this. The studying is done. Tonight, your only job is to rest."

Camille turned the words over in her mind. The studying is done. She realised her mother was right — there was nothing more to add. Worrying was not preparation. It was only noise.

She closed her eyes. She did not sleep immediately, but she stopped fighting the wakefulness, and gradually the tree frogs sounded quieter, and the ceiling felt farther away, and her breath came slower and easier.

In the morning, she ate breakfast, picked up her pencil case, and walked out the door with steady feet.`,
    question: "What does Camille\'s preparation — sharpened pencils, pressed uniform — reveal about her character?",
    options: [
      "She is trying to show off to her classmates.",
      "She is a careful, organised person who prepares thoroughly.",
      "She is worried she will forget her pencils.",
      "She does not trust herself to prepare in the morning.",
    ],
    correctAnswer: 1,
    explanation: "Every detail prepared in advance shows Camille is careful, thorough, and organised."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Examination

The night before her PEP examination, Camille could not sleep. She lay on her back staring at the ceiling, listening to the tree frogs calling outside. Her pencils were already sharpened and lined up in her pencil case. Her school uniform was pressed and hanging on the door. Everything that could be done had been done.

Her mother appeared in the doorway. "Still awake?" she said softly.

Camille nodded. "What if I forget everything?"

Her mother came and sat on the edge of the bed. "You won't," she said. "You've worked for this. The studying is done. Tonight, your only job is to rest."

Camille turned the words over in her mind. The studying is done. She realised her mother was right — there was nothing more to add. Worrying was not preparation. It was only noise.

She closed her eyes. She did not sleep immediately, but she stopped fighting the wakefulness, and gradually the tree frogs sounded quieter, and the ceiling felt farther away, and her breath came slower and easier.

In the morning, she ate breakfast, picked up her pencil case, and walked out the door with steady feet.`,
    question: "What does Camille\'s mother mean by \'The studying is done. Tonight, your only job is to rest.\'?",
    options: [
      "Camille has studied too much and needs to forget some of what she learned.",
      "Camille has done all she can to prepare, and further worry will not help.",
      "Camille should go back and study one more time before sleeping.",
      "The examination has been cancelled.",
    ],
    correctAnswer: 1,
    explanation: "The mother is telling Camille that all preparation is complete — resting is now more useful than worrying."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Examination

The night before her PEP examination, Camille could not sleep. She lay on her back staring at the ceiling, listening to the tree frogs calling outside. Her pencils were already sharpened and lined up in her pencil case. Her school uniform was pressed and hanging on the door. Everything that could be done had been done.

Her mother appeared in the doorway. "Still awake?" she said softly.

Camille nodded. "What if I forget everything?"

Her mother came and sat on the edge of the bed. "You won't," she said. "You've worked for this. The studying is done. Tonight, your only job is to rest."

Camille turned the words over in her mind. The studying is done. She realised her mother was right — there was nothing more to add. Worrying was not preparation. It was only noise.

She closed her eyes. She did not sleep immediately, but she stopped fighting the wakefulness, and gradually the tree frogs sounded quieter, and the ceiling felt farther away, and her breath came slower and easier.

In the morning, she ate breakfast, picked up her pencil case, and walked out the door with steady feet.`,
    question: "What does \'Worrying was not preparation. It was only noise.\' mean?",
    options: [
      "The tree frogs were making too much noise outside.",
      "Camille\'s pencils made noise when she sharpened them.",
      "Anxiety and worry do not help you prepare — they just distract you.",
      "Camille\'s mother was speaking too loudly.",
    ],
    correctAnswer: 2,
    explanation: "This figurative statement means worrying accomplishes nothing — it does not add to preparation, it just fills the mind with unhelpful distraction."
  },
  {
    id: 9,
    type: "reading",
    passage: `The Examination

The night before her PEP examination, Camille could not sleep. She lay on her back staring at the ceiling, listening to the tree frogs calling outside. Her pencils were already sharpened and lined up in her pencil case. Her school uniform was pressed and hanging on the door. Everything that could be done had been done.

Her mother appeared in the doorway. "Still awake?" she said softly.

Camille nodded. "What if I forget everything?"

Her mother came and sat on the edge of the bed. "You won't," she said. "You've worked for this. The studying is done. Tonight, your only job is to rest."

Camille turned the words over in her mind. The studying is done. She realised her mother was right — there was nothing more to add. Worrying was not preparation. It was only noise.

She closed her eyes. She did not sleep immediately, but she stopped fighting the wakefulness, and gradually the tree frogs sounded quieter, and the ceiling felt farther away, and her breath came slower and easier.

In the morning, she ate breakfast, picked up her pencil case, and walked out the door with steady feet.`,
    question: "What is the MOOD of the passage about Camille?",
    options: [
      "Exciting and adventurous",
      "Tense but ultimately calm and hopeful",
      "Sad and regretful",
      "Angry and frustrated",
    ],
    correctAnswer: 1,
    explanation: "The passage begins with tension but moves toward calm and hope as Camille accepts her mother\'s advice and gradually relaxes."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Examination

The night before her PEP examination, Camille could not sleep. She lay on her back staring at the ceiling, listening to the tree frogs calling outside. Her pencils were already sharpened and lined up in her pencil case. Her school uniform was pressed and hanging on the door. Everything that could be done had been done.

Her mother appeared in the doorway. "Still awake?" she said softly.

Camille nodded. "What if I forget everything?"

Her mother came and sat on the edge of the bed. "You won't," she said. "You've worked for this. The studying is done. Tonight, your only job is to rest."

Camille turned the words over in her mind. The studying is done. She realised her mother was right — there was nothing more to add. Worrying was not preparation. It was only noise.

She closed her eyes. She did not sleep immediately, but she stopped fighting the wakefulness, and gradually the tree frogs sounded quieter, and the ceiling felt farther away, and her breath came slower and easier.

In the morning, she ate breakfast, picked up her pencil case, and walked out the door with steady feet.`,
    question: "Which phrase BEST shows that Camille feels calmer by the end?",
    options: [
      "\'She could not sleep\'",
      "\'What if I forget everything?\'",
      "\'she walked out the door with steady feet\'",
      "\'the tree frogs calling outside\'",
    ],
    correctAnswer: 2,
    explanation: "\'Walked out the door with steady feet\' shows Camille is calm and confident the next morning — the word \'steady\' is key."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Coral reefs support an extraordinary DIVERSITY of life.\" The word \'diversity\' means —",
    options: [
      "a large number of the same species",
      "a wide variety of different types",
      "a very small number of species",
      "a dangerous mixture",
    ],
    correctAnswer: 1,
    explanation: "Diversity means a wide variety or range of different things."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"Polyps SECRETE hard calcium carbonate skeletons.\" The word \'secrete\' means —",
    options: [
      "to hide something carefully",
      "to produce and release a substance",
      "to eat and digest something",
      "to absorb water from the sea",
    ],
    correctAnswer: 1,
    explanation: "To secrete means to produce and release a substance from a living organism."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Climate change leads to a PHENOMENON called coral bleaching.\" The word \'phenomenon\' means —",
    options: [
      "a type of pollution",
      "a scientific experiment",
      "an observable fact or event, especially one that is remarkable",
      "a government policy",
    ],
    correctAnswer: 2,
    explanation: "A phenomenon is an observable fact or event, especially one that is remarkable or not yet fully explained."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Coral reefs are FRAGILE ecosystems.\" The word \'fragile\' means —",
    options: [
      "powerful and difficult to damage",
      "easily damaged or destroyed",
      "very old and ancient",
      "large and complex",
    ],
    correctAnswer: 1,
    explanation: "Fragile means easily damaged or broken."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Camille turned the words OVER IN HER MIND.\" This phrase means —",
    options: [
      "She wrote the words down in her notebook.",
      "She thought carefully and repeatedly about what her mother had said.",
      "She ignored what her mother told her.",
      "She repeated the words aloud to herself.",
    ],
    correctAnswer: 1,
    explanation: "To turn something over in your mind means to think about it carefully and repeatedly."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"She stopped FIGHTING the wakefulness.\" What does this suggest?",
    options: [
      "Camille got up and started doing something active.",
      "Camille accepted that she was awake and stopped trying to force herself to sleep.",
      "Camille called out to her mother for help.",
      "Camille fell deeply asleep right away.",
    ],
    correctAnswer: 1,
    explanation: "Stopping the fight means she relaxed and let sleep come naturally — she accepted her wakefulness."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"The skeletons ACCUMULATE over thousands of years.\" The word \'accumulate\' means —",
    options: [
      "break down and dissolve",
      "spread out evenly",
      "build up gradually over time",
      "change colour with age",
    ],
    correctAnswer: 2,
    explanation: "To accumulate means to gather or build up gradually over a period of time."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \'severe\'?",
    options: [
      "mild",
      "gentle",
      "serious and extreme",
      "occasional",
    ],
    correctAnswer: 2,
    explanation: "Severe means very serious, extreme, or harsh. Serious and extreme is the closest synonym."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Her breath came SLOWER and EASIER.\" What does this tell us about Camille?",
    options: [
      "She was becoming more anxious as the night went on.",
      "She was physically ill and struggling to breathe.",
      "She was relaxing and moving toward sleep.",
      "She was excited about the examination.",
    ],
    correctAnswer: 2,
    explanation: "Slower and easier breathing is a sign of physical relaxation — Camille\'s body was calming down."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \'tiny\'?",
    options: [
      "enormous",
      "massive",
      "microscopic",
      "distant",
    ],
    correctAnswer: 2,
    explanation: "Tiny means very small. Microscopic means extremely small — it is the closest synonym."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The loss of coral reefs have serious consequences for fishing communities.",
      "The loss of coral reefs has serious consequences for fishing communities.",
      "The loss of coral reefs are having serious consequences.",
      "The loss of coral reefs were having serious consequences.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the loss,\' which is singular. The correct verb is \'has.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PRESENT PERFECT correctly?",
    options: [
      "Jamaica lost more than eighty percent of its coral reefs.",
      "Jamaica has lost more than eighty percent of its coral reefs.",
      "Jamaica is losing more than eighty percent of its coral reefs.",
      "Jamaica had lost more than eighty percent of its coral reefs.",
    ],
    correctAnswer: 1,
    explanation: "The present perfect (\'has\' + past participle) is used when a past action has a present result. Jamaica\'s reef loss is ongoing and relevant now."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the ERROR: \'Scientists, governments, and communities is working together to restore the reefs.\'",
    options: [
      "Scientists should be Scientist",
      "communities should be community",
      "is should be are",
      "restore should be restoring",
    ],
    correctAnswer: 2,
    explanation: "The subject \'scientists, governments, and communities\' is plural. The correct verb is \'are working.\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Camille, who had studied for months was ready for the examination.",
      "Camille who had studied for months, was ready for the examination.",
      "Camille, who had studied for months, was ready for the examination.",
      "Camille who had studied for months was ready for the examination.",
    ],
    correctAnswer: 2,
    explanation: "The non-restrictive relative clause \'who had studied for months\' must be enclosed by commas on both sides."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Camille sharpened her pencils the night before.",
      "Her mother sat on the edge of the bed.",
      "The examination was taken by hundreds of Grade 4 students.",
      "Camille walked out the door with steady feet.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. \'The examination\' receives the action \'was taken.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the word that correctly completes: \'Either the students or the teacher ___ responsible for setting up the classroom.\'",
    options: [
      "are",
      "were",
      "is",
      "have been",
    ],
    correctAnswer: 2,
    explanation: "With \'either...or,\' the verb agrees with the closest subject. \'The teacher\' is singular, so \'is\' is correct."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence uses a SUBORDINATE CLAUSE correctly?",
    options: [
      "Although the reef was damaged, but scientists were working to restore it.",
      "Although the reef was damaged, scientists were working to restore it.",
      "Although the reef was damaged; scientists were working to restore it.",
      "Although the reef was damaged, and scientists were working to restore it.",
    ],
    correctAnswer: 1,
    explanation: "A subordinate clause introduced by \'although\' is followed by the main clause without an additional conjunction."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence maintains CONSISTENT tense?",
    options: [
      "Camille lay awake and thinks about the examination.",
      "Camille lay awake and thought about the examination.",
      "Camille lies awake and thought about the examination.",
      "Camille lay awake and was thinking about it all night.",
    ],
    correctAnswer: 1,
    explanation: "Option B consistently uses the simple past: \'lay\' and \'thought.\'"
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses DIRECT SPEECH correctly:",
    options: [
      "Her mother said, \'you won\'t forget everything.\'",
      "Her mother said You won\'t forget everything.",
      "Her mother said, \"You won\'t forget everything.\"",
      "Her mother said that, \'You won\'t forget everything.\'",
    ],
    correctAnswer: 2,
    explanation: "Direct speech uses quotation marks around the exact words and a comma before the opening quotation mark. Option C is correct."
  },
  {
    id: 30,
    type: "grammar",
    question: "Choose the sentence with CORRECT apostrophe use:",
    options: [
      "The reefs importance to Jamaican fishermen cannot be overstated.",
      "The reef\'s importance to Jamaican fishermen cannot be overstated.",
      "The reefs\' importance to Jamaican fishermen cannot be overstated.",
      "The reefs importance\' to Jamaican fishermen cannot be overstated.",
    ],
    correctAnswer: 1,
    explanation: "An apostrophe + s shows possession for a singular noun. \'The reef\'s importance\' is correct."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which sentence uses REPORTED SPEECH correctly?",
    options: [
      "Her mother said that the studying is done.",
      "Her mother said that the studying was done.",
      "Her mother said that the studying has been done.",
      "Her mother said that the studying will be done.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, \'is done\' shifts back to \'was done.\' Option B is correct."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the CORRECTLY punctuated sentence:",
    options: [
      "Coral reefs, which cover less than one percent of the ocean floor support twenty-five percent of marine species.",
      "Coral reefs, which cover less than one percent of the ocean floor, support twenty-five percent of marine species.",
      "Coral reefs which cover less than one percent of the ocean floor, support twenty-five percent of marine species.",
      "Coral reefs which cover less than one percent of the ocean floor support twenty-five percent of marine species.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive clause must be enclosed by commas on both sides. Option B is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about the importance of protecting coral reefs?",
    options: [
      "Coral reefs are found in tropical oceans around the world.",
      "Many types of fish live in and around coral reefs.",
      "Protecting coral reefs is not only an environmental concern — it is an economic and humanitarian necessity.",
      "Scientists are studying how to restore damaged coral reefs.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, strong argument that frames reef protection as urgent and multidimensional."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED for paragraph unity? \'Camille prepared carefully for her examination. She sharpened her pencils and pressed her uniform. She also made sure her school bag was packed. Camille\'s favourite colour is blue. She went to bed early to get enough rest.\'",
    options: [
      "She sharpened her pencils and pressed her uniform.",
      "She also made sure her school bag was packed.",
      "Camille\'s favourite colour is blue.",
      "She went to bed early to get enough rest.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Camille\'s exam preparation. \'Camille\'s favourite colour is blue\' is completely off-topic."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The coral reef is important and we should not damage it.\'",
    options: [
      "The coral reef is very important and we really should not damage it.",
      "Coral reefs, which support twenty-five percent of all marine species, are irreplaceable ecosystems that must be protected from further damage.",
      "We should not damage the coral reef because it is important.",
      "The coral reef matters and should not be harmed by us.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses specific facts, precise vocabulary, and a stronger call to action."
  },
  {
    id: 36,
    type: "writing",
    question: "A student wrote: \'Camille was nervouse and she dont sleep well the night before her exam.\' Choose the MOST COMPLETE correction:",
    options: [
      "Camille was nervous and she didn\'t sleep well the night before her examination.",
      "Camille was nervouse and she didn\'t sleep well the night before her examination.",
      "Camille was nervous and she don\'t sleep well the night before her examination.",
      "Camille was nervous and she didn\'t slept well the night before her examination.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects all errors: \'nervouse\' to \'nervous,\' \'don\'t\' to \'didn\'t\' (past tense), and \'exam\' to \'examination\' (formal)."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence uses the MOST PRECISE and FORMAL language for a science report?",
    options: [
      "Coral bleaching happens when the coral gets too warm and turns white.",
      "Climate change makes the water too hot for coral and it dies.",
      "Coral bleaching occurs when elevated ocean temperatures cause polyps to expel the photosynthetic algae essential to their survival.",
      "When the water is too warm, coral bleaches and can die.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise scientific vocabulary appropriate for a formal report."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about Jamaica\'s coral reef loss?",
    options: [
      "Jamaica has beautiful beaches and clear water.",
      "Scientists are working hard to restore the reefs.",
      "The loss of over eighty percent of Jamaica\'s reefs in just fifty years is a stark reminder that without urgent action, these irreplaceable ecosystems may be lost forever.",
      "Coral reefs are very important to marine life.",
    ],
    correctAnswer: 2,
    explanation: "Option C is specific, uses powerful language, and ends with urgency — qualities of a strong closing sentence."
  },
  {
    id: 39,
    type: "writing",
    question: "A student wants to write about Camille\'s mother as a supporting character. Which sentence BEST captures her role?",
    options: [
      "Camille\'s mother came to check on her daughter before the examination.",
      "Camille\'s mother sat on the bed and told her not to worry.",
      "With quiet wisdom and a few steady words, Camille\'s mother gave her daughter the one thing no more studying could — the permission to rest.",
      "Camille\'s mother appeared in the doorway and spoke to her.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses vivid, specific language to capture the mother\'s role meaningfully and memorably."
  },
  {
    id: 40,
    type: "writing",
    question: "Which BEST describes the purpose of a concluding paragraph in a persuasive essay?",
    options: [
      "To introduce new arguments not covered in the essay",
      "To summarise the main points and restate the thesis in a new and memorable way",
      "To list the sources used in the essay",
      "To ask the reader a series of questions",
    ],
    correctAnswer: 1,
    explanation: "A concluding paragraph restates the thesis, summarises the key arguments, and leaves a memorable final impression."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate7MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate7Questions : literacyModerate7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 7</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 7</h1>
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
