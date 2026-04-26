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

const literacyQuestions: Question[] = [
  // Reading Comprehension Questions (1-10)
  {
    id: 1,
    type: "reading",
    passage: `The Surprise Jar

On Friday afternoons, Mrs. Campbell always placed a glass jar on the front table before the class packed their bags. Inside the jar, she put folded slips of paper with little challenges written on them. Some slips said, “Read to someone at home.” Others said, “Write three kind words about a friend.” The children called it the Surprise Jar, and they waited for it all week.

One rainy Friday, the class had been restless. The drizzle tapped the windows, and even the usually cheerful room felt dull. When Mrs. Campbell lifted the jar, every head turned. Kareem, who had spent most of the day staring at the grey sky, sat up straight. He hoped to pull a slip that said, “Draw a picture,” because drawing made rainy days feel shorter.

Instead, Kareem pulled a slip that read, “Notice something beautiful on your way home.” At first he felt disappointed. The road home was muddy, and the sky still looked heavy. What beauty could possibly be hiding there?

But as Kareem walked home, he began to pay attention. Raindrops clung to the fence like tiny beads of glass. A yellow mango leaf floated in a puddle like a little boat. Near the gate, a snail stretched its silver trail across a stone. By the time Kareem reached his yard, he was smiling. The day had not changed, but the way he looked at it had.`,
    question: "Why did Kareem first feel disappointed after choosing his slip?",
    options: [
      "He wanted a challenge that matched what he enjoyed doing.",
      "He thought Mrs. Campbell had made a mistake.",
      "He was upset that the class had been restless.",
      "He did not understand what the word 'beautiful' meant."
    ],
    correctAnswer: 0,
    explanation: "The passage says Kareem hoped to pull a slip that said, 'Draw a picture,' because drawing made rainy days feel shorter. He felt disappointed because the challenge was different from what he wanted."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Surprise Jar

On Friday afternoons, Mrs. Campbell always placed a glass jar on the front table before the class packed their bags. Inside the jar, she put folded slips of paper with little challenges written on them. Some slips said, “Read to someone at home.” Others said, “Write three kind words about a friend.” The children called it the Surprise Jar, and they waited for it all week.

One rainy Friday, the class had been restless. The drizzle tapped the windows, and even the usually cheerful room felt dull. When Mrs. Campbell lifted the jar, every head turned. Kareem, who had spent most of the day staring at the grey sky, sat up straight. He hoped to pull a slip that said, “Draw a picture,” because drawing made rainy days feel shorter.

Instead, Kareem pulled a slip that read, “Notice something beautiful on your way home.” At first he felt disappointed. The road home was muddy, and the sky still looked heavy. What beauty could possibly be hiding there?

But as Kareem walked home, he began to pay attention. Raindrops clung to the fence like tiny beads of glass. A yellow mango leaf floated in a puddle like a little boat. Near the gate, a snail stretched its silver trail across a stone. By the time Kareem reached his yard, he was smiling. The day had not changed, but the way he looked at it had.`,
    question: "Which sentence from the passage best shows that Kareem's feelings changed by the end?",
    options: [
      "The children called it the Surprise Jar, and they waited for it all week.",
      "The road home was muddy, and the sky still looked heavy.",
      "By the time Kareem reached his yard, he was smiling.",
      "The drizzle tapped the windows, and even the usually cheerful room felt dull."
    ],
    correctAnswer: 2,
    explanation: "The sentence 'By the time Kareem reached his yard, he was smiling' directly shows his mood changed from disappointment to happiness."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Surprise Jar

On Friday afternoons, Mrs. Campbell always placed a glass jar on the front table before the class packed their bags. Inside the jar, she put folded slips of paper with little challenges written on them. Some slips said, “Read to someone at home.” Others said, “Write three kind words about a friend.” The children called it the Surprise Jar, and they waited for it all week.

One rainy Friday, the class had been restless. The drizzle tapped the windows, and even the usually cheerful room felt dull. When Mrs. Campbell lifted the jar, every head turned. Kareem, who had spent most of the day staring at the grey sky, sat up straight. He hoped to pull a slip that said, “Draw a picture,” because drawing made rainy days feel shorter.

Instead, Kareem pulled a slip that read, “Notice something beautiful on your way home.” At first he felt disappointed. The road home was muddy, and the sky still looked heavy. What beauty could possibly be hiding there?

But as Kareem walked home, he began to pay attention. Raindrops clung to the fence like tiny beads of glass. A yellow mango leaf floated in a puddle like a little boat. Near the gate, a snail stretched its silver trail across a stone. By the time Kareem reached his yard, he was smiling. The day had not changed, but the way he looked at it had.`,
    question: "Why does the writer compare the raindrops to 'tiny beads of glass'?",
    options: [
      "To show that the fence was broken and dangerous",
      "To help the reader picture how bright and delicate the raindrops looked",
      "To explain that Kareem wanted to collect the raindrops",
      "To prove that the raindrops were hard like stones"
    ],
    correctAnswer: 1,
    explanation: "This comparison helps the reader imagine the raindrops as shiny and delicate. It is an example of descriptive writing that makes the image clearer."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Surprise Jar

On Friday afternoons, Mrs. Campbell always placed a glass jar on the front table before the class packed their bags. Inside the jar, she put folded slips of paper with little challenges written on them. Some slips said, “Read to someone at home.” Others said, “Write three kind words about a friend.” The children called it the Surprise Jar, and they waited for it all week.

One rainy Friday, the class had been restless. The drizzle tapped the windows, and even the usually cheerful room felt dull. When Mrs. Campbell lifted the jar, every head turned. Kareem, who had spent most of the day staring at the grey sky, sat up straight. He hoped to pull a slip that said, “Draw a picture,” because drawing made rainy days feel shorter.

Instead, Kareem pulled a slip that read, “Notice something beautiful on your way home.” At first he felt disappointed. The road home was muddy, and the sky still looked heavy. What beauty could possibly be hiding there?

But as Kareem walked home, he began to pay attention. Raindrops clung to the fence like tiny beads of glass. A yellow mango leaf floated in a puddle like a little boat. Near the gate, a snail stretched its silver trail across a stone. By the time Kareem reached his yard, he was smiling. The day had not changed, but the way he looked at it had.`,
    question: "Which statement best gives the main message of the passage?",
    options: [
      "Rainy days should always be spent indoors.",
      "Teachers should only give students easy tasks.",
      "Looking carefully can help people notice beauty they might miss at first.",
      "Drawing is the best way to make any day better."
    ],
    correctAnswer: 2,
    explanation: "The passage shows that Kareem did not think anything beautiful could be found, but once he looked carefully, he discovered many beautiful details."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Surprise Jar

On Friday afternoons, Mrs. Campbell always placed a glass jar on the front table before the class packed their bags. Inside the jar, she put folded slips of paper with little challenges written on them. Some slips said, “Read to someone at home.” Others said, “Write three kind words about a friend.” The children called it the Surprise Jar, and they waited for it all week.

One rainy Friday, the class had been restless. The drizzle tapped the windows, and even the usually cheerful room felt dull. When Mrs. Campbell lifted the jar, every head turned. Kareem, who had spent most of the day staring at the grey sky, sat up straight. He hoped to pull a slip that said, “Draw a picture,” because drawing made rainy days feel shorter.

Instead, Kareem pulled a slip that read, “Notice something beautiful on your way home.” At first he felt disappointed. The road home was muddy, and the sky still looked heavy. What beauty could possibly be hiding there?

But as Kareem walked home, he began to pay attention. Raindrops clung to the fence like tiny beads of glass. A yellow mango leaf floated in a puddle like a little boat. Near the gate, a snail stretched its silver trail across a stone. By the time Kareem reached his yard, he was smiling. The day had not changed, but the way he looked at it had.`,
    question: "Which word best describes the tone of the ending of the passage?",
    options: [
      "Hopeful",
      "Angry",
      "Confused",
      "Fearful"
    ],
    correctAnswer: 0,
    explanation: "The ending feels hopeful because Kareem is smiling and has learned to see the day differently in a positive way."
  },
  {
    id: 6,
    type: "reading",
    passage: `Saving the Sea Turtles

Every year along parts of Jamaica's coastline, female sea turtles return to the same beaches where they were born. They come ashore at night, dig deep holes in the sand, and lay their eggs before slipping quietly back into the sea. For many years, this ancient journey happened with little interruption. Today, however, the turtles face many dangers.

Bright lights from houses and hotels near the beach can confuse both nesting turtles and hatchlings. Instead of moving toward the sea, baby turtles may crawl toward the lights and become too tired or too weak to survive. Plastic waste also causes harm. Turtles sometimes mistake floating plastic bags for jellyfish, one of their natural foods.

In some communities, groups of volunteers now patrol nesting beaches. They cover nests with protective screens, record when eggs are laid, and teach residents how to keep beaches dark and clean during nesting season. Students often join these projects by creating posters, helping with beach clean-ups, and sharing what they have learned with their families.

Protecting sea turtles is not only about saving one animal. Healthy turtle populations help keep the ocean balanced. For example, some turtles eat seagrass and keep it from growing too thick. Seagrass beds are important homes for fish and other sea creatures. When turtles are protected, many other parts of the marine environment benefit too.`,
    question: "Why does the writer include the detail that turtles may mistake plastic bags for jellyfish?",
    options: [
      "To explain one specific way human rubbish can harm turtles",
      "To show that jellyfish are the turtles' only food",
      "To prove that plastic bags belong in the sea",
      "To describe how volunteers study jellyfish at night"
    ],
    correctAnswer: 0,
    explanation: "The detail gives a clear example of how plastic pollution hurts turtles. It helps the reader understand the danger in a specific way."
  },
  {
    id: 7,
    type: "reading",
    passage: `Saving the Sea Turtles

Every year along parts of Jamaica's coastline, female sea turtles return to the same beaches where they were born. They come ashore at night, dig deep holes in the sand, and lay their eggs before slipping quietly back into the sea. For many years, this ancient journey happened with little interruption. Today, however, the turtles face many dangers.

Bright lights from houses and hotels near the beach can confuse both nesting turtles and hatchlings. Instead of moving toward the sea, baby turtles may crawl toward the lights and become too tired or too weak to survive. Plastic waste also causes harm. Turtles sometimes mistake floating plastic bags for jellyfish, one of their natural foods.

In some communities, groups of volunteers now patrol nesting beaches. They cover nests with protective screens, record when eggs are laid, and teach residents how to keep beaches dark and clean during nesting season. Students often join these projects by creating posters, helping with beach clean-ups, and sharing what they have learned with their families.

Protecting sea turtles is not only about saving one animal. Healthy turtle populations help keep the ocean balanced. For example, some turtles eat seagrass and keep it from growing too thick. Seagrass beds are important homes for fish and other sea creatures. When turtles are protected, many other parts of the marine environment benefit too.`,
    question: "What is the main idea of the third paragraph?",
    options: [
      "Hotels are being built too close to some beaches.",
      "Volunteers and students can take actions that help protect nesting turtles.",
      "Sea turtles only come ashore at night when beaches are empty.",
      "Students prefer making posters to cleaning beaches."
    ],
    correctAnswer: 1,
    explanation: "The third paragraph focuses on the actions volunteers and students take to protect turtle nests and nesting beaches."
  },
  {
    id: 8,
    type: "reading",
    passage: `Saving the Sea Turtles

Every year along parts of Jamaica's coastline, female sea turtles return to the same beaches where they were born. They come ashore at night, dig deep holes in the sand, and lay their eggs before slipping quietly back into the sea. For many years, this ancient journey happened with little interruption. Today, however, the turtles face many dangers.

Bright lights from houses and hotels near the beach can confuse both nesting turtles and hatchlings. Instead of moving toward the sea, baby turtles may crawl toward the lights and become too tired or too weak to survive. Plastic waste also causes harm. Turtles sometimes mistake floating plastic bags for jellyfish, one of their natural foods.

In some communities, groups of volunteers now patrol nesting beaches. They cover nests with protective screens, record when eggs are laid, and teach residents how to keep beaches dark and clean during nesting season. Students often join these projects by creating posters, helping with beach clean-ups, and sharing what they have learned with their families.

Protecting sea turtles is not only about saving one animal. Healthy turtle populations help keep the ocean balanced. For example, some turtles eat seagrass and keep it from growing too thick. Seagrass beds are important homes for fish and other sea creatures. When turtles are protected, many other parts of the marine environment benefit too.`,
    question: "What can the reader infer about the writer's purpose in this passage?",
    options: [
      "To entertain readers with an imaginary story about turtles",
      "To persuade readers that sea turtles should be kept in homes",
      "To inform readers about threats to sea turtles and why protecting them matters",
      "To compare beaches in Jamaica with beaches in other countries"
    ],
    correctAnswer: 2,
    explanation: "The passage gives facts about turtles, the dangers they face, and why protection matters. This shows the writer's purpose is mainly to inform."
  },
  {
    id: 9,
    type: "reading",
    passage: `Saving the Sea Turtles

Every year along parts of Jamaica's coastline, female sea turtles return to the same beaches where they were born. They come ashore at night, dig deep holes in the sand, and lay their eggs before slipping quietly back into the sea. For many years, this ancient journey happened with little interruption. Today, however, the turtles face many dangers.

Bright lights from houses and hotels near the beach can confuse both nesting turtles and hatchlings. Instead of moving toward the sea, baby turtles may crawl toward the lights and become too tired or too weak to survive. Plastic waste also causes harm. Turtles sometimes mistake floating plastic bags for jellyfish, one of their natural foods.

In some communities, groups of volunteers now patrol nesting beaches. They cover nests with protective screens, record when eggs are laid, and teach residents how to keep beaches dark and clean during nesting season. Students often join these projects by creating posters, helping with beach clean-ups, and sharing what they have learned with their families.

Protecting sea turtles is not only about saving one animal. Healthy turtle populations help keep the ocean balanced. For example, some turtles eat seagrass and keep it from growing too thick. Seagrass beds are important homes for fish and other sea creatures. When turtles are protected, many other parts of the marine environment benefit too.`,
    question: "Why is the fourth paragraph important to the passage as a whole?",
    options: [
      "It explains that turtles are not really in danger.",
      "It shows that protecting turtles also helps the wider marine environment.",
      "It repeats information from the first paragraph without adding anything new.",
      "It tells readers where volunteers buy protective screens."
    ],
    correctAnswer: 1,
    explanation: "The fourth paragraph widens the reader's understanding by showing that protecting turtles helps seagrass beds, fish, and the balance of the ocean."
  },
  {
    id: 10,
    type: "reading",
    passage: `Saving the Sea Turtles

Every year along parts of Jamaica's coastline, female sea turtles return to the same beaches where they were born. They come ashore at night, dig deep holes in the sand, and lay their eggs before slipping quietly back into the sea. For many years, this ancient journey happened with little interruption. Today, however, the turtles face many dangers.

Bright lights from houses and hotels near the beach can confuse both nesting turtles and hatchlings. Instead of moving toward the sea, baby turtles may crawl toward the lights and become too tired or too weak to survive. Plastic waste also causes harm. Turtles sometimes mistake floating plastic bags for jellyfish, one of their natural foods.

In some communities, groups of volunteers now patrol nesting beaches. They cover nests with protective screens, record when eggs are laid, and teach residents how to keep beaches dark and clean during nesting season. Students often join these projects by creating posters, helping with beach clean-ups, and sharing what they have learned with their families.

Protecting sea turtles is not only about saving one animal. Healthy turtle populations help keep the ocean balanced. For example, some turtles eat seagrass and keep it from growing too thick. Seagrass beds are important homes for fish and other sea creatures. When turtles are protected, many other parts of the marine environment benefit too.`,
    question: "Which title best fits this passage?",
    options: [
      "How to Build a Hotel on the Beach",
      "Why Sea Turtles Matter and How People Can Help",
      "The Many Foods Sea Turtles Eat",
      "Why Students Should Avoid the Sea"
    ],
    correctAnswer: 1,
    explanation: "This title matches both main ideas in the passage: sea turtles are important, and people can take steps to protect them."
  },

  // Vocabulary Questions (11-20)
  {
    id: 11,
    type: "vocabulary",
    question: "In the sentence 'The teacher's remarks were brief but thoughtful,' what does 'brief' mean?",
    options: ["careless", "short", "angry", "unclear"],
    correctAnswer: 1,
    explanation: "'Brief' means short in length or time. The sentence shows the remarks were not long, but they were thoughtful."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Choose the word that is closest in meaning to 'observe'.",
    options: ["ignore", "notice", "forget", "borrow"],
    correctAnswer: 1,
    explanation: "'Observe' means to notice or watch carefully."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "Which word is the best opposite of 'scarce'?",
    options: ["rare", "plentiful", "costly", "hidden"],
    correctAnswer: 1,
    explanation: "'Scarce' means not enough or hard to find. Its opposite is 'plentiful,' which means there is a lot of it."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "In the sentence 'The explorer was eager to begin the climb,' what does 'eager' mean?",
    options: ["ready and excited", "afraid and nervous", "slow and tired", "quiet and polite"],
    correctAnswer: 0,
    explanation: "'Eager' means very ready and excited to do something."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "Which sentence uses the word 'current' to mean 'happening now'?",
    options: [
      "The river's current pushed the boat downstream.",
      "Our current project is about Jamaican heroes.",
      "The electric current was switched off.",
      "The fish swam against the current."
    ],
    correctAnswer: 1,
    explanation: "In this sentence, 'current' means present or happening now. In the other sentences, it refers to flowing water or electricity."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "The word 'delicate' most nearly means:",
    options: ["strong and heavy", "small and rough", "easily damaged or fine", "loud and sudden"],
    correctAnswer: 2,
    explanation: "'Delicate' means fine, gentle, or easily damaged."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "If a plan is 'practical,' it is:",
    options: ["easy to use or sensible", "funny and unusual", "secret and hidden", "messy and confusing"],
    correctAnswer: 0,
    explanation: "A practical plan is sensible and likely to work in real life."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word best replaces 'murmured' in this sentence: 'She murmured a thank-you before leaving.'",
    options: ["shouted", "whispered", "sang", "laughed"],
    correctAnswer: 1,
    explanation: "'Murmured' means spoke quietly or softly, so 'whispered' is the best replacement."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "What does 'conclude' mean in the sentence 'The writer concludes by reminding readers to recycle'?",
    options: ["to begin", "to repeat", "to end", "to forget"],
    correctAnswer: 2,
    explanation: "'Conclude' means to end or finish."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "Which phrase best explains the word 'hesitated'?",
    options: ["moved quickly without thinking", "paused because of uncertainty", "laughed loudly with joy", "spoke to the whole crowd"],
    correctAnswer: 1,
    explanation: "'Hesitated' means to pause because you are unsure or uncertain."
  },

  // Grammar Questions (21-32)
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with the correct subject-verb agreement.",
    options: [
      "The basket of mangoes were on the table.",
      "The basket of mangoes is on the table.",
      "The basket of mangoes are on the table.",
      "The basket of mangoes be on the table."
    ],
    correctAnswer: 1,
    explanation: "The subject is 'basket,' which is singular, so the correct verb is 'is.'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence is written correctly?",
    options: [
      "Neither the boys nor Alicia knowed the answer.",
      "Neither the boys nor Alicia knew the answer.",
      "Neither the boys nor Alicia know the answer yesterday.",
      "Neither the boys nor Alicia knowing the answer."
    ],
    correctAnswer: 1,
    explanation: "'Knew' is the correct past-tense verb. The other choices use incorrect verb forms."
  },
  {
    id: 23,
    type: "grammar",
    question: "Choose the best revision: 'My sister, she likes to read before bed.'",
    options: [
      "My sister she likes to read before bed.",
      "My sister likes to read before bed.",
      "My sister, likes to read before bed.",
      "My sister likes to read, before bed."
    ],
    correctAnswer: 1,
    explanation: "The original sentence repeats the subject. 'My sister likes to read before bed' is clear and correct."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which word correctly completes the sentence? 'Each of the players brought _____ own water bottle.'",
    options: ["their", "his or her", "our", "your"],
    correctAnswer: 1,
    explanation: "'Each' is singular, so 'his or her' is the best formal match."
  },
  {
    id: 25,
    type: "grammar",
    question: "Choose the sentence with the correct use of adjectives and adverbs.",
    options: [
      "The choir sang beautiful at the concert.",
      "The choir sang beautifully at the concert.",
      "The choir beautiful sang at the concert.",
      "The choir sang more beautiful at the concert."
    ],
    correctAnswer: 1,
    explanation: "The verb 'sang' needs an adverb describing how the choir sang. 'Beautifully' is the correct adverb."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which sentence uses commas correctly?",
    options: [
      "After lunch we planted tomatoes peppers and thyme.",
      "After lunch, we planted tomatoes, peppers, and thyme.",
      "After lunch we planted, tomatoes peppers and thyme.",
      "After lunch, we planted tomatoes peppers and thyme."
    ],
    correctAnswer: 1,
    explanation: "A comma is needed after the introductory phrase 'After lunch,' and commas separate items in the list."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the best way to combine these ideas: 'The storm ended. The children ran outside.'",
    options: [
      "The storm ended, the children ran outside.",
      "When the storm ended, the children ran outside.",
      "The storm ended and the children ran outside because.",
      "The storm ended. Because the children ran outside."
    ],
    correctAnswer: 1,
    explanation: "This version combines the ideas clearly using a time clause and correct punctuation."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which word correctly completes the sentence? 'The puppy hid _____ the chair during the thunder.'",
    options: ["between", "beneath", "across", "toward"],
    correctAnswer: 1,
    explanation: "'Beneath' means under, which fits the sentence best."
  },
  {
    id: 29,
    type: "grammar",
    question: "Which sentence has the correct verb tense throughout?",
    options: [
      "Yesterday, we visited the museum and learn many facts.",
      "Yesterday, we visit the museum and learned many facts.",
      "Yesterday, we visited the museum and learned many facts.",
      "Yesterday, we were visit the museum and learned many facts."
    ],
    correctAnswer: 2,
    explanation: "Both verbs should be in the past tense because the action happened yesterday: 'visited' and 'learned.'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Choose the sentence that is a complete sentence.",
    options: [
      "Although the rain fell heavily.",
      "Because the bus arrived late.",
      "The players cheered after the final whistle.",
      "When the teacher entered the room."
    ],
    correctAnswer: 2,
    explanation: "This sentence has a complete subject and predicate and expresses a complete thought."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which pronoun correctly replaces the underlined words? 'Mia and Jordan carried Mia and Jordan's project carefully.'",
    options: ["they", "them", "their", "theirs"],
    correctAnswer: 2,
    explanation: "The sentence needs a possessive pronoun showing the project belongs to Mia and Jordan. 'Their' is correct."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence written correctly.",
    options: [
      "There is many reasons to protect the reef.",
      "There are many reasons to protect the reef.",
      "There be many reasons to protect the reef.",
      "There was many reasons to protect the reef."
    ],
    correctAnswer: 1,
    explanation: "'Reasons' is plural, so the correct verb is 'are.'"
  },

  // Writing Conventions Questions (33-40)
  {
    id: 33,
    type: "writing",
    question: "Which sentence uses capitals correctly?",
    options: [
      "we visited the black river in St. Elizabeth.",
      "We visited the Black River in St. Elizabeth.",
      "We visited the black river in st. elizabeth.",
      "we visited the Black river in St. Elizabeth."
    ],
    correctAnswer: 1,
    explanation: "'We' begins the sentence, and 'Black River' and 'St. Elizabeth' are proper nouns, so they should be capitalized."
  },
  {
    id: 34,
    type: "writing",
    question: "Choose the sentence with punctuation used correctly.",
    options: [
      "'Please line up quietly,' said Mr. Brown.",
      "'Please line up quietly' said Mr. Brown.",
      "Please line up quietly,' said Mr. Brown.",
      "'Please line up quietly,' said mr. Brown."
    ],
    correctAnswer: 0,
    explanation: "The quotation marks, comma, and capital letters are all used correctly in this sentence."
  },
  {
    id: 35,
    type: "writing",
    question: "Which word is spelled correctly?",
    options: ["seperate", "separrate", "separate", "seperete"],
    correctAnswer: 2,
    explanation: "The correct spelling is 'separate.'"
  },
  {
    id: 36,
    type: "writing",
    question: "Choose the best revision for clarity: 'The boy put the bat on the bench and it was broken.'",
    options: [
      "The boy put the bat on the bench, and it was broken.",
      "The broken bench was put by the boy and the bat.",
      "The boy put the broken bat on the bench.",
      "The boy on the bench put it was broken."
    ],
    correctAnswer: 2,
    explanation: "This revision removes the confusing pronoun 'it' and clearly explains what was broken."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence should end with an exclamation mark?",
    options: [
      "What a beautiful sunset",
      "Please pass the notebook",
      "I went to the market",
      "She likes mango juice"
    ],
    correctAnswer: 0,
    explanation: "An exclamation mark is used to show strong feeling or excitement. 'What a beautiful sunset' expresses strong feeling."
  },
  {
    id: 38,
    type: "writing",
    question: "Choose the sentence with quotation marks placed correctly.",
    options: [
      '"We should begin now," whispered Asha.',
      'We should begin now", whispered Asha."',
      '"We should begin now" whispered, Asha.',
      '"We should begin now, whispered Asha."',
    ],
    correctAnswer: 0,
    explanation: "In direct speech, the spoken words go inside quotation marks, and the comma is placed before the closing quotation marks."
  },
  {
    id: 39,
    type: "writing",
    question: "Which sentence is written as a complete paragraph sentence with correct punctuation?",
    options: [
      "First we mixed the flour then we added water.",
      "First, we mixed the flour. Then, we added water.",
      "First we mixed, the flour then we added water.",
      "First. we mixed the flour then, we added water."
    ],
    correctAnswer: 1,
    explanation: "This choice uses commas and periods correctly to separate the ideas clearly."
  },
  {
    id: 40,
    type: "writing",
    question: "Which sentence would be the best concluding sentence for a paragraph about planting a tree?",
    options: [
      "Trees need soil, water, and sunlight.",
      "Planting a tree is a simple way to help keep our community green and healthy.",
      "My class planted one tree behind the library.",
      "A spade is useful when digging a hole."
    ],
    correctAnswer: 1,
    explanation: "A concluding sentence should wrap up the paragraph's main idea. This sentence sums up why planting a tree matters."
  },
]

const sectionOrder = ["reading", "vocabulary", "grammar", "writing"] as const

type SectionType = (typeof sectionOrder)[number]

const sectionMeta: Record<SectionType, { label: string; description: string }> = {
  reading: {
    label: "Reading",
    description: "Inference, tone, main idea, and close reading of longer passages.",
  },
  vocabulary: {
    label: "Vocabulary",
    description: "Word meaning in context, synonyms, antonyms, and precise word choice.",
  },
  grammar: {
    label: "Grammar",
    description: "Editing in context, sentence structure, and more careful language use.",
  },
  writing: {
    label: "Writing",
    description: "Punctuation, spelling, paragraph clarity, and writing conventions.",
  },
}

function getPerformanceNote(percentage: number) {
  if (percentage >= 85) return "Excellent"
  if (percentage >= 70) return "Good"
  if (percentage >= 50) return "Fair"
  return "Needs Improvement"
}

export default function LiteracyDifficult1Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyQuestions : literacyQuestions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 1</CardTitle>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question test with the full report and detailed explanations.
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
                    <li>- Main idea, tone, and writer's craft</li>
                    <li>- Editing in context and paragraph clarity</li>
                    <li>- More challenging distractors</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 1</p>
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
                      <p className="text-sm text-slate-700 mt-1">{section.correct}/{section.total} correct • {section.percentage}%</p>
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
                    Review Answers &amp; Report & Report
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 1 Report</CardTitle>
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
                  This report shows the student's overall result, section-by-section performance, and a full review of each question with explanations.
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
                <h1 className="text-lg font-bold">Literacy Difficult 1</h1>
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
