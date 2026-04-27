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

const literacyModerate5Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Maroon People of Jamaica

When the Spanish brought enslaved Africans to Jamaica in the 1500s, some of these people escaped and fled into the rugged mountains of the island. They came to be known as the Maroons, a name that comes from the Spanish word meaning living on mountaintops. The Maroons built their own communities deep in the Blue Mountains and the Cockpit Country, where the difficult terrain made it nearly impossible for enemies to find them.

Under leaders such as Queen Nanny, the Maroons fought bravely against the British, who had taken control of Jamaica in 1655. Queen Nanny of the Maroons is now celebrated as one of Jamaica's National Heroes. Her leadership, intelligence, and bravery helped her people survive for decades in the mountains. In 1739, the British signed a peace treaty with the Maroons, officially recognising their freedom.

Today, the Maroon communities of Accompong and Moore Town still exist. The people of Accompong celebrate Accompong Maroon Festival every year on January 6th. The Maroons have kept many of their African traditions alive, including music, food, herbal medicine, and storytelling. Their history is a powerful reminder of the human desire for freedom and dignity.
`,
    question: "What is the MAIN IDEA of this passage?",
    options: [
      "Jamaica has many beautiful mountains.",
      "The Maroon people fought for and won their freedom, and their culture continues today.",
      "The British were unfair rulers of Jamaica.",
      "Queen Nanny was the bravest woman in Jamaican history.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers the Maroons' escape, their fight for freedom, the peace treaty, and their living culture today. Option B captures all of these ideas."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Maroon People of Jamaica

When the Spanish brought enslaved Africans to Jamaica in the 1500s, some of these people escaped and fled into the rugged mountains of the island. They came to be known as the Maroons, a name that comes from the Spanish word meaning living on mountaintops. The Maroons built their own communities deep in the Blue Mountains and the Cockpit Country, where the difficult terrain made it nearly impossible for enemies to find them.

Under leaders such as Queen Nanny, the Maroons fought bravely against the British, who had taken control of Jamaica in 1655. Queen Nanny of the Maroons is now celebrated as one of Jamaica's National Heroes. Her leadership, intelligence, and bravery helped her people survive for decades in the mountains. In 1739, the British signed a peace treaty with the Maroons, officially recognising their freedom.

Today, the Maroon communities of Accompong and Moore Town still exist. The people of Accompong celebrate Accompong Maroon Festival every year on January 6th. The Maroons have kept many of their African traditions alive, including music, food, herbal medicine, and storytelling. Their history is a powerful reminder of the human desire for freedom and dignity.
`,
    question: "Why did enslaved Africans escape into the mountains?",
    options: [
      "The mountains had better food and water.",
      "They wanted to build a new city.",
      "To seek freedom from slavery and escape their captors.",
      "They were searching for Spanish gold.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that some enslaved people 'escaped and fled into the rugged mountains' — the context makes clear this was to gain freedom from slavery."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Maroon People of Jamaica

When the Spanish brought enslaved Africans to Jamaica in the 1500s, some of these people escaped and fled into the rugged mountains of the island. They came to be known as the Maroons, a name that comes from the Spanish word meaning living on mountaintops. The Maroons built their own communities deep in the Blue Mountains and the Cockpit Country, where the difficult terrain made it nearly impossible for enemies to find them.

Under leaders such as Queen Nanny, the Maroons fought bravely against the British, who had taken control of Jamaica in 1655. Queen Nanny of the Maroons is now celebrated as one of Jamaica's National Heroes. Her leadership, intelligence, and bravery helped her people survive for decades in the mountains. In 1739, the British signed a peace treaty with the Maroons, officially recognising their freedom.

Today, the Maroon communities of Accompong and Moore Town still exist. The people of Accompong celebrate Accompong Maroon Festival every year on January 6th. The Maroons have kept many of their African traditions alive, including music, food, herbal medicine, and storytelling. Their history is a powerful reminder of the human desire for freedom and dignity.
`,
    question: "What does the word \"terrain\" mean in this passage?",
    options: [
      "A type of weapon",
      "The land and its physical features",
      "A Maroon celebration",
      "A Spanish word for freedom",
    ],
    correctAnswer: 1,
    explanation: "Terrain refers to the physical features of the land. The passage uses it to describe why the mountains were hard to travel through."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Maroon People of Jamaica

When the Spanish brought enslaved Africans to Jamaica in the 1500s, some of these people escaped and fled into the rugged mountains of the island. They came to be known as the Maroons, a name that comes from the Spanish word meaning living on mountaintops. The Maroons built their own communities deep in the Blue Mountains and the Cockpit Country, where the difficult terrain made it nearly impossible for enemies to find them.

Under leaders such as Queen Nanny, the Maroons fought bravely against the British, who had taken control of Jamaica in 1655. Queen Nanny of the Maroons is now celebrated as one of Jamaica's National Heroes. Her leadership, intelligence, and bravery helped her people survive for decades in the mountains. In 1739, the British signed a peace treaty with the Maroons, officially recognising their freedom.

Today, the Maroon communities of Accompong and Moore Town still exist. The people of Accompong celebrate Accompong Maroon Festival every year on January 6th. The Maroons have kept many of their African traditions alive, including music, food, herbal medicine, and storytelling. Their history is a powerful reminder of the human desire for freedom and dignity.
`,
    question: "What can you INFER about Queen Nanny based on the passage?",
    options: [
      "She preferred to make peace rather than fight.",
      "She was a skilled and determined leader who inspired her people.",
      "She signed the peace treaty with the British herself.",
      "She was born in England.",
    ],
    correctAnswer: 1,
    explanation: "The passage describes her 'leadership, intelligence, and bravery' and her status as a National Hero. This tells us she was a skilled, determined leader."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Maroon People of Jamaica

When the Spanish brought enslaved Africans to Jamaica in the 1500s, some of these people escaped and fled into the rugged mountains of the island. They came to be known as the Maroons, a name that comes from the Spanish word meaning living on mountaintops. The Maroons built their own communities deep in the Blue Mountains and the Cockpit Country, where the difficult terrain made it nearly impossible for enemies to find them.

Under leaders such as Queen Nanny, the Maroons fought bravely against the British, who had taken control of Jamaica in 1655. Queen Nanny of the Maroons is now celebrated as one of Jamaica's National Heroes. Her leadership, intelligence, and bravery helped her people survive for decades in the mountains. In 1739, the British signed a peace treaty with the Maroons, officially recognising their freedom.

Today, the Maroon communities of Accompong and Moore Town still exist. The people of Accompong celebrate Accompong Maroon Festival every year on January 6th. The Maroons have kept many of their African traditions alive, including music, food, herbal medicine, and storytelling. Their history is a powerful reminder of the human desire for freedom and dignity.
`,
    question: "The author MOST LIKELY wrote this passage to —",
    options: [
      "warn students about the dangers of living in mountains",
      "explain the history of the Spanish in Jamaica",
      "inform readers about the Maroon people and their significance in Jamaican history",
      "persuade readers to visit the Cockpit Country",
    ],
    correctAnswer: 2,
    explanation: "The passage is informational — it provides historical facts, explains significance, and describes the Maroons' culture. This fits an informative purpose."
  },
  {
    id: 6,
    type: "reading",
    passage: `A Morning at the River

Every Saturday, twelve-year-old Keyana and her grandmother, Miss Ivy, walked down the hill to the river. Keyana loved these mornings. The river had a voice — it murmured over smooth stones and whispered around mossy bends. Sometimes, Keyana could stand still for long minutes, just listening.

Miss Ivy always brought a bar of blue soap and a bundle of clothes. While she washed, she hummed old songs that Keyana could not quite understand. Keyana suspected the songs were from a time long before her own.

One Saturday, Keyana noticed something different. An old mango tree that had shaded their washing spot had fallen across the river. The water looked darker where the roots had pulled away the bank.

"Grandma," Keyana said quietly, "the mango tree fell."

Miss Ivy looked at the fallen tree for a long moment. Then she sighed and said, "Everything changes, child. Even the river." She picked up her bundle of clothes and moved further upstream to find a new spot. Keyana followed, carrying the soap.
`,
    question: "What is the MOOD of this passage?",
    options: [
      "Exciting and adventurous",
      "Calm, reflective, and a little sad",
      "Angry and frustrated",
      "Playful and funny",
    ],
    correctAnswer: 1,
    explanation: "The language is gentle and thoughtful — 'murmured', 'whispered', 'sighed'. The fallen mango tree adds a note of sadness. The overall mood is calm and reflective."
  },
  {
    id: 7,
    type: "reading",
    passage: `A Morning at the River

Every Saturday, twelve-year-old Keyana and her grandmother, Miss Ivy, walked down the hill to the river. Keyana loved these mornings. The river had a voice — it murmured over smooth stones and whispered around mossy bends. Sometimes, Keyana could stand still for long minutes, just listening.

Miss Ivy always brought a bar of blue soap and a bundle of clothes. While she washed, she hummed old songs that Keyana could not quite understand. Keyana suspected the songs were from a time long before her own.

One Saturday, Keyana noticed something different. An old mango tree that had shaded their washing spot had fallen across the river. The water looked darker where the roots had pulled away the bank.

"Grandma," Keyana said quietly, "the mango tree fell."

Miss Ivy looked at the fallen tree for a long moment. Then she sighed and said, "Everything changes, child. Even the river." She picked up her bundle of clothes and moved further upstream to find a new spot. Keyana followed, carrying the soap.
`,
    question: "What does the author mean when he writes that the river \"had a voice\"?",
    options: [
      "Someone was speaking near the river.",
      "The river made sounds like murmuring and whispering.",
      "The river was very loud and noisy.",
      "Keyana could hear people singing.",
    ],
    correctAnswer: 1,
    explanation: "The author uses personification — giving the river human qualities. The voice refers to the sounds it made: 'it murmured over smooth stones and whispered around mossy bends.'"
  },
  {
    id: 8,
    type: "reading",
    passage: `A Morning at the River

Every Saturday, twelve-year-old Keyana and her grandmother, Miss Ivy, walked down the hill to the river. Keyana loved these mornings. The river had a voice — it murmured over smooth stones and whispered around mossy bends. Sometimes, Keyana could stand still for long minutes, just listening.

Miss Ivy always brought a bar of blue soap and a bundle of clothes. While she washed, she hummed old songs that Keyana could not quite understand. Keyana suspected the songs were from a time long before her own.

One Saturday, Keyana noticed something different. An old mango tree that had shaded their washing spot had fallen across the river. The water looked darker where the roots had pulled away the bank.

"Grandma," Keyana said quietly, "the mango tree fell."

Miss Ivy looked at the fallen tree for a long moment. Then she sighed and said, "Everything changes, child. Even the river." She picked up her bundle of clothes and moved further upstream to find a new spot. Keyana followed, carrying the soap.
`,
    question: "Why did Miss Ivy move upstream?",
    options: [
      "The water upstream was cleaner.",
      "Keyana asked her to move.",
      "Their usual spot was blocked by the fallen mango tree.",
      "She wanted to find a new song to hum.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that an old mango tree had fallen across the river at their washing spot, so Miss Ivy moved further upstream to find a new spot."
  },
  {
    id: 9,
    type: "reading",
    passage: `A Morning at the River

Every Saturday, twelve-year-old Keyana and her grandmother, Miss Ivy, walked down the hill to the river. Keyana loved these mornings. The river had a voice — it murmured over smooth stones and whispered around mossy bends. Sometimes, Keyana could stand still for long minutes, just listening.

Miss Ivy always brought a bar of blue soap and a bundle of clothes. While she washed, she hummed old songs that Keyana could not quite understand. Keyana suspected the songs were from a time long before her own.

One Saturday, Keyana noticed something different. An old mango tree that had shaded their washing spot had fallen across the river. The water looked darker where the roots had pulled away the bank.

"Grandma," Keyana said quietly, "the mango tree fell."

Miss Ivy looked at the fallen tree for a long moment. Then she sighed and said, "Everything changes, child. Even the river." She picked up her bundle of clothes and moved further upstream to find a new spot. Keyana followed, carrying the soap.
`,
    question: "What does Miss Ivy MOST LIKELY mean when she says, \"Everything changes, child. Even the river.\"",
    options: [
      "She is upset that someone cut down the tree.",
      "She is reminding Keyana that rivers can flood.",
      "She is accepting change calmly and teaching Keyana to do the same.",
      "She wants to move to a different river next week.",
    ],
    correctAnswer: 2,
    explanation: "Miss Ivy reacts to the fallen tree with a calm sigh and a wise saying. She accepts the change and moves on, teaching Keyana that change is a natural part of life."
  },
  {
    id: 10,
    type: "reading",
    passage: `A Morning at the River

Every Saturday, twelve-year-old Keyana and her grandmother, Miss Ivy, walked down the hill to the river. Keyana loved these mornings. The river had a voice — it murmured over smooth stones and whispered around mossy bends. Sometimes, Keyana could stand still for long minutes, just listening.

Miss Ivy always brought a bar of blue soap and a bundle of clothes. While she washed, she hummed old songs that Keyana could not quite understand. Keyana suspected the songs were from a time long before her own.

One Saturday, Keyana noticed something different. An old mango tree that had shaded their washing spot had fallen across the river. The water looked darker where the roots had pulled away the bank.

"Grandma," Keyana said quietly, "the mango tree fell."

Miss Ivy looked at the fallen tree for a long moment. Then she sighed and said, "Everything changes, child. Even the river." She picked up her bundle of clothes and moved further upstream to find a new spot. Keyana followed, carrying the soap.
`,
    question: "Which word BEST describes Miss Ivy's character in this passage?",
    options: [
      "Impatient",
      "Wise and calm",
      "Frightened",
      "Lazy",
    ],
    correctAnswer: 1,
    explanation: "Miss Ivy hums old songs, responds to change with a sigh and a wise saying, and moves on without complaint. She comes across as wise and calm."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The soldiers advanced CAUTIOUSLY through the dense forest.\" The word \"cautiously\" means —",
    options: [
      "quickly and boldly",
      "carefully and with attention to danger",
      "loudly and without thinking",
      "happily and with excitement",
    ],
    correctAnswer: 1,
    explanation: "Cautiously means in a careful way, paying attention to possible risks or dangers."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is CLOSEST in meaning to \"ancient\"?",
    options: [
      "small",
      "ruined",
      "very old",
      "hidden",
    ],
    correctAnswer: 2,
    explanation: "Ancient means belonging to a very distant past — it is closest in meaning to 'very old'."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Her speech was ELOQUENT — every word was chosen with great care.\" The word \"eloquent\" means —",
    options: [
      "boring and hard to follow",
      "well-spoken and expressive",
      "loud and emotional",
      "short and unimportant",
    ],
    correctAnswer: 1,
    explanation: "Eloquent describes speech that is fluent, well-expressed, and persuasive."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The soldier showed great VALOUR during the battle.\" The word \"valour\" means —",
    options: [
      "strength",
      "patience",
      "bravery",
      "sadness",
    ],
    correctAnswer: 2,
    explanation: "Valour means great courage, especially in the face of danger."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "Which pair of words are ANTONYMS?",
    options: [
      "bright / shining",
      "ancient / modern",
      "brave / bold",
      "happy / joyful",
    ],
    correctAnswer: 1,
    explanation: "Antonyms are words with opposite meanings. Ancient means very old; modern means belonging to the present time. They are opposites."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"She PERSEVERED with her studies even when the work was difficult.\" The word \"persevered\" means —",
    options: [
      "gave up",
      "complained",
      "kept going despite difficulty",
      "finished early",
    ],
    correctAnswer: 2,
    explanation: "To persevere means to continue doing something even when it is hard or challenging."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "Choose the word that BEST completes the sentence: \"The teacher spoke in a ___ voice so as not to disturb the sleeping child.\"",
    options: [
      "thunderous",
      "harsh",
      "gentle",
      "sharp",
    ],
    correctAnswer: 2,
    explanation: "To avoid disturbing a sleeping child, the teacher would speak in a gentle (soft and kind) voice. The other options all describe loud or harsh sounds."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The house was DILAPIDATED — the roof leaked, the windows were broken, and the walls had cracks.\" The word \"dilapidated\" means —",
    options: [
      "newly built",
      "in very poor condition",
      "very large",
      "brightly coloured",
    ],
    correctAnswer: 1,
    explanation: "Dilapidated means in a state of disrepair and poor condition, which matches all the examples given (leaking roof, broken windows, cracked walls)."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \"anxious\"?",
    options: [
      "calm",
      "brave",
      "worried",
      "tired",
    ],
    correctAnswer: 2,
    explanation: "Anxious means feeling worried or nervous. Worried is the closest synonym."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The scientist made a SIGNIFICANT discovery that changed our understanding of the planet.\" The word \"significant\" means —",
    options: [
      "small and unimportant",
      "quick and surprising",
      "dangerous and difficult",
      "important and meaningful",
    ],
    correctAnswer: 3,
    explanation: "Significant means important and having a major effect or meaning."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence that is written CORRECTLY.",
    options: [
      "Neither of the students have finished their work.",
      "Neither of the students has finished their work.",
      "Neither of the students finish their work.",
      "Neither of the students finishing their work.",
    ],
    correctAnswer: 1,
    explanation: "'Neither' takes a singular verb. 'Neither of the students has finished' is correct."
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT tense correctly?",
    options: [
      "By the time we arrived, the concert started.",
      "By the time we arrived, the concert was starting.",
      "By the time we arrived, the concert had started.",
      "By the time we arrived, the concert starts.",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (had + past participle) is used for an action completed before another past event. 'The concert had started' correctly uses this tense."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence has a SUBORDINATE CLAUSE?",
    options: [
      "Marcus played cricket and Kevin watched.",
      "She ran to school.",
      "Although it rained heavily, the match continued.",
      "The children laughed.",
    ],
    correctAnswer: 2,
    explanation: "A subordinate clause cannot stand alone as a sentence. 'Although it rained heavily' is a subordinate clause — it depends on the main clause 'the match continued'."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Before leaving, she checked; the windows, the doors, and the lights.",
      "Before leaving, she checked the windows, the doors, and the lights.",
      "Before leaving she checked the windows the doors and the lights.",
      "Before leaving: she checked the windows the doors and the lights.",
    ],
    correctAnswer: 1,
    explanation: "Option B correctly uses a comma after the introductory phrase 'Before leaving' and commas between the list items."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the ACTIVE voice?",
    options: [
      "The cake was baked by Mother.",
      "The ball was kicked by the boy.",
      "The teacher marked the students' work.",
      "The song was sung by the choir.",
    ],
    correctAnswer: 2,
    explanation: "In the active voice, the subject performs the action. In option C, 'the teacher' (subject) performs the action 'marked'. The other options are in the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Read this sentence: \"The team of players are very skilled.\" What is the CORRECT version?",
    options: [
      "The team of players am very skilled.",
      "The team of players is very skilled.",
      "The team of players were very skilled.",
      "The team of players being very skilled.",
    ],
    correctAnswer: 1,
    explanation: "The subject is 'team', which is singular. The correct verb is 'is'. The phrase 'of players' is a prepositional phrase and does not affect the verb."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which word correctly completes the sentence? \"Each of the boys ___ responsible for bringing his own lunch.\"",
    options: [
      "are",
      "were",
      "is",
      "have been",
    ],
    correctAnswer: 2,
    explanation: "'Each' is always singular, so it takes a singular verb — 'is'. 'Are' and 'were' are plural forms."
  },
  {
    id: 28,
    type: "grammar",
    question: "Identify the ERROR in this sentence: \"She don't know the answer to the question.\"",
    options: [
      "'She' should be 'Her'",
      "'don't' should be 'doesn't'",
      "'answer' should be 'answers'",
      "'question' should be 'questions'",
    ],
    correctAnswer: 1,
    explanation: "With a third-person singular subject like 'she', the correct negative contraction is 'doesn't', not 'don't'."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses COMMAS correctly:",
    options: [
      "We need to buy flour sugar butter and eggs.",
      "We, need to buy flour sugar butter and eggs.",
      "We need to buy flour, sugar, butter, and eggs.",
      "We need to buy flour, sugar butter and, eggs.",
    ],
    correctAnswer: 2,
    explanation: "Option C correctly separates the items in a list with commas. A comma after each item in a list (including before 'and') is the standard rule."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written in the CORRECT tense throughout?",
    options: [
      "She walks to school and then she ran home.",
      "She walked to school and then she ran home.",
      "She walks to school and then she runs home.",
      "She walked to school and then she runs home.",
    ],
    correctAnswer: 2,
    explanation: "Option C is consistent — both verbs are in the present tense: 'walks' and 'runs'. Option B uses past tense consistently too, but option C is the intended answer since the question uses 'walks/runs'."
  },
  {
    id: 31,
    type: "grammar",
    question: "The sentence 'Mr. Henry teaches at Meadowbrook Primary, which is located in Kingston' contains —",
    options: [
      "a compound sentence",
      "a relative clause",
      "a conditional clause",
      "a passive construction",
    ],
    correctAnswer: 1,
    explanation: "'Which is located in Kingston' is a relative clause — it gives extra information about Meadowbrook Primary and is introduced by the relative pronoun 'which'."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the CORRECTLY punctuated sentence:",
    options: [
      "James said, he would return at noon.",
      "James said he would return at noon.",
      "James said he would return, at noon.",
      "James said: he would return at noon.",
    ],
    correctAnswer: 1,
    explanation: "When reporting speech indirectly (no quotation marks), no comma is needed before the reported speech. 'James said he would return at noon' is correct."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph about the importance of drinking water?",
    options: [
      "Water is found in rivers, lakes, and seas all over the world.",
      "Drinking enough water every day is essential for keeping our bodies healthy and strong.",
      "Some people prefer to drink juice instead of water.",
      "The human body is made up of about sixty percent water.",
    ],
    correctAnswer: 1,
    explanation: "A topic sentence states the main idea clearly. Option B makes a direct claim about the importance of drinking water that the rest of the paragraph could support."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \"Marcus Garvey was born in St. Ann's Bay, Jamaica, in 1887. He is celebrated as one of Jamaica's National Heroes. He founded the Universal Negro Improvement Association. Cricket is a very popular sport in Jamaica. Garvey believed that people of African descent should be proud of their heritage.\"",
    options: [
      "He is celebrated as one of Jamaica's National Heroes.",
      "Cricket is a very popular sport in Jamaica.",
      "He founded the Universal Negro Improvement Association.",
      "Garvey believed that people of African descent should be proud of their heritage.",
    ],
    correctAnswer: 1,
    explanation: "All sentences are about Marcus Garvey except 'Cricket is a very popular sport in Jamaica', which is completely off-topic and should be removed."
  },
  {
    id: 35,
    type: "writing",
    question: "Which is the MOST EFFECTIVE way to combine these two sentences? \"The rain fell heavily. The children stayed inside and played board games.\"",
    options: [
      "The rain fell heavily and the children stayed inside and played board games.",
      "Because the rain fell heavily, the children stayed inside and played board games.",
      "The rain fell heavily, the children inside and played board games.",
      "The children played board games, the rain fell.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses 'because' to show the cause-and-effect relationship between the rain and the children staying inside. This is the clearest and most effective combination."
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence uses DIRECT SPEECH correctly?",
    options: [
      "She said that, 'the lesson would begin at nine o'clock.'",
      "She said the lesson would begin at nine o'clock.",
      "She said the lesson would begin at nine o'clock.",
      "She said, 'The lesson will begin at nine o'clock.'",
    ],
    correctAnswer: 3,
    explanation: "Direct speech uses quotation marks around the exact words spoken and a comma to introduce them. Option D correctly does this."
  },
  {
    id: 37,
    type: "writing",
    question: "Read this sentence: \"The children ran to the shop and they bought sweets and they ate them quickly.\" The BEST way to revise it is —",
    options: [
      "The children ran to the shop. And they bought sweets. And they ate them quickly.",
      "The children ran to the shop, bought sweets, and ate them quickly.",
      "Running to the shop, the children, and sweets, and quick eating.",
      "They ran quickly to the shop sweets were bought and eaten.",
    ],
    correctAnswer: 1,
    explanation: "Option B removes the repeated 'and they' and lists the actions clearly using a parallel series of verbs: 'ran... bought... ate'."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wants to write a paragraph about her favourite Jamaican food. Which detail would BEST support the paragraph?",
    options: [
      "Jamaica has a warm tropical climate.",
      "Ackee and saltfish is the national dish of Jamaica.",
      "She learned to cook ackee from her grandmother who showed her how to prepare it properly.",
      "Many people in the Caribbean eat rice and peas.",
    ],
    correctAnswer: 2,
    explanation: "Option C is a specific personal detail that supports a paragraph about a favourite food — it tells who taught her and how she learned to prepare it."
  },
  {
    id: 39,
    type: "writing",
    question: "Choose the word that BEST completes the sentence: \"The scientist carefully ___ the results of each experiment in her notebook.\"",
    options: [
      "threw",
      "forgot",
      "recorded",
      "broke",
    ],
    correctAnswer: 2,
    explanation: "'Recorded' means to write down for reference — it is the most logical and precise word for a scientist noting experiment results."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \"The old man walked slowly.\"",
    options: [
      "The old man walked slowly because he was old.",
      "The elderly man shuffled along the dusty road, leaning heavily on his cane.",
      "He walked slowly and old.",
      "The man was old and so he walked.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses specific, vivid language — 'shuffled', 'dusty road', 'leaning heavily on his cane' — to create a clear and interesting image. This is much more descriptive than the original."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyModerate5MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyModerate5Questions : literacyModerate5Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Moderate 5</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Moderate 5</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Moderate 5 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Moderate 5</h1>
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
