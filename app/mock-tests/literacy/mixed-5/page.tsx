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

const literacyMixed5Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `Marcus Garvey: Voice of a People

Marcus Mosiah Garvey was born on August 17, 1887, in St. Ann's Bay, Jamaica. From an early age, he was an avid reader who was drawn to questions of justice and equality. By the time he was a young man, Garvey had become deeply troubled by the way people of African descent were treated around the world.

In 1914, Garvey founded the Universal Negro Improvement Association, an organisation dedicated to uniting people of African heritage and promoting pride in African culture and history. His motto, "One God, One Aim, One Destiny," reflected his belief that all people of African descent shared a common bond. The organisation grew rapidly, attracting millions of supporters across the Americas, the Caribbean, and Africa.

Garvey's message was bold and powerful: he believed that Black people should be proud of who they were, celebrate their history, and build independent communities. He established the Black Star Line, a shipping company owned and operated by Black people, to strengthen economic ties within the African diaspora.

Although Garvey faced opposition and was eventually imprisoned on disputed charges in the United States, his legacy endures. He was declared Jamaica's first National Hero in 1964. His ideas inspired generations of leaders across Africa and the Caribbean, and his message of dignity, pride, and self-determination continues to resonate today.`,
    question: "What is the MAIN IDEA of the Marcus Garvey passage?",
    options: [
      "Marcus Garvey was born in St. Ann\'s Bay, Jamaica.",
      "Marcus Garvey was a powerful leader who dedicated his life to promoting unity and dignity among people of African descent.",
      "The UNIA was the most important organisation in Jamaican history.",
      "Garvey was imprisoned in the United States.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers Garvey\'s origins, philosophy, organisations, and legacy. Option B captures all these dimensions."
  },
  {
    id: 2,
    type: "reading",
    passage: `Marcus Garvey: Voice of a People

Marcus Mosiah Garvey was born on August 17, 1887, in St. Ann's Bay, Jamaica. From an early age, he was an avid reader who was drawn to questions of justice and equality. By the time he was a young man, Garvey had become deeply troubled by the way people of African descent were treated around the world.

In 1914, Garvey founded the Universal Negro Improvement Association, an organisation dedicated to uniting people of African heritage and promoting pride in African culture and history. His motto, "One God, One Aim, One Destiny," reflected his belief that all people of African descent shared a common bond. The organisation grew rapidly, attracting millions of supporters across the Americas, the Caribbean, and Africa.

Garvey's message was bold and powerful: he believed that Black people should be proud of who they were, celebrate their history, and build independent communities. He established the Black Star Line, a shipping company owned and operated by Black people, to strengthen economic ties within the African diaspora.

Although Garvey faced opposition and was eventually imprisoned on disputed charges in the United States, his legacy endures. He was declared Jamaica's first National Hero in 1964. His ideas inspired generations of leaders across Africa and the Caribbean, and his message of dignity, pride, and self-determination continues to resonate today.`,
    question: "Why did Garvey found the Universal Negro Improvement Association?",
    options: [
      "To start a political party in Jamaica",
      "To build a shipping company to earn money",
      "To unite people of African descent and promote pride in African culture and history",
      "To fight for Jamaican independence from Britain",
    ],
    correctAnswer: 2,
    explanation: "The passage states the UNIA was \'dedicated to uniting people of African heritage and promoting pride in African culture and history.\'"
  },
  {
    id: 3,
    type: "reading",
    passage: `Marcus Garvey: Voice of a People

Marcus Mosiah Garvey was born on August 17, 1887, in St. Ann's Bay, Jamaica. From an early age, he was an avid reader who was drawn to questions of justice and equality. By the time he was a young man, Garvey had become deeply troubled by the way people of African descent were treated around the world.

In 1914, Garvey founded the Universal Negro Improvement Association, an organisation dedicated to uniting people of African heritage and promoting pride in African culture and history. His motto, "One God, One Aim, One Destiny," reflected his belief that all people of African descent shared a common bond. The organisation grew rapidly, attracting millions of supporters across the Americas, the Caribbean, and Africa.

Garvey's message was bold and powerful: he believed that Black people should be proud of who they were, celebrate their history, and build independent communities. He established the Black Star Line, a shipping company owned and operated by Black people, to strengthen economic ties within the African diaspora.

Although Garvey faced opposition and was eventually imprisoned on disputed charges in the United States, his legacy endures. He was declared Jamaica's first National Hero in 1964. His ideas inspired generations of leaders across Africa and the Caribbean, and his message of dignity, pride, and self-determination continues to resonate today.`,
    question: "What does the word \'AVID\' mean in the phrase \'he was an avid reader\'?",
    options: [
      "Slow and reluctant",
      "Eager and enthusiastic",
      "Careful and methodical",
      "Young and curious",
    ],
    correctAnswer: 1,
    explanation: "Avid means having a keen, enthusiastic interest in something — an avid reader is one who reads eagerly and frequently."
  },
  {
    id: 4,
    type: "reading",
    passage: `Marcus Garvey: Voice of a People

Marcus Mosiah Garvey was born on August 17, 1887, in St. Ann's Bay, Jamaica. From an early age, he was an avid reader who was drawn to questions of justice and equality. By the time he was a young man, Garvey had become deeply troubled by the way people of African descent were treated around the world.

In 1914, Garvey founded the Universal Negro Improvement Association, an organisation dedicated to uniting people of African heritage and promoting pride in African culture and history. His motto, "One God, One Aim, One Destiny," reflected his belief that all people of African descent shared a common bond. The organisation grew rapidly, attracting millions of supporters across the Americas, the Caribbean, and Africa.

Garvey's message was bold and powerful: he believed that Black people should be proud of who they were, celebrate their history, and build independent communities. He established the Black Star Line, a shipping company owned and operated by Black people, to strengthen economic ties within the African diaspora.

Although Garvey faced opposition and was eventually imprisoned on disputed charges in the United States, his legacy endures. He was declared Jamaica's first National Hero in 1964. His ideas inspired generations of leaders across Africa and the Caribbean, and his message of dignity, pride, and self-determination continues to resonate today.`,
    question: "Why was the Black Star Line significant?",
    options: [
      "It was the fastest shipping company in the world.",
      "It represented economic independence and self-determination for Black people.",
      "It was the reason Garvey was arrested.",
      "It was founded by the Jamaican government.",
    ],
    correctAnswer: 1,
    explanation: "The passage says Garvey established the Black Star Line \'to strengthen economic ties within the African diaspora\' — it was an example of economic self-determination."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the Marcus Garvey passage?",
    options: [
      "Critical and questioning",
      "Informative and respectful",
      "Angry and confrontational",
      "Humorous and light",
    ],
    correctAnswer: 1,
    explanation: "The passage presents Garvey\'s life and legacy with clear respect — describing his ideas as \'bold and powerful\' and his legacy as enduring. The tone is informative and respectful."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Coconut Palm: The Tree of Life

The coconut palm is one of the most useful trees in the world. In Jamaica, it grows all along the coastline, standing tall with its long, feathery leaves swaying in the sea breeze. Farmers and coastal communities have depended on the coconut tree for hundreds of years.

Every part of the coconut tree can be used. The coconut itself provides fresh water and a sweet white flesh that can be eaten raw or used in cooking. Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down. The dried flesh, called copra, is used to make coconut oil, which has uses in cooking, beauty products, and medicine.

The leaves of the coconut palm are used to make baskets, brooms, and thatch for roofing. The trunk of the tree is used for building. Even the shells and husks of the coconut can be burned as fuel or turned into handicrafts. Because of this, the coconut palm is sometimes called the tree of life.

Jamaica has a long tradition of coconut farming. Coconut water is sold fresh on roadsides, and coconut-based sweets and snacks are popular across the island. The coconut palm is not just a tree — it is a part of Jamaican life and culture.`,
    question: "What is the BEST summary of the coconut palm passage?",
    options: [
      "Coconuts are used to make rice and peas in Jamaica.",
      "The coconut palm is a highly useful tree that provides food, materials, and other resources — making it central to Jamaican life and culture.",
      "Coconut trees grow best near the sea in warm climates.",
      "Jamaica produces more coconuts than any other country.",
    ],
    correctAnswer: 1,
    explanation: "The passage describes the many uses of the coconut palm — food, cooking, building, crafts — and its cultural significance. Option B captures this broad usefulness."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Coconut Palm: The Tree of Life

The coconut palm is one of the most useful trees in the world. In Jamaica, it grows all along the coastline, standing tall with its long, feathery leaves swaying in the sea breeze. Farmers and coastal communities have depended on the coconut tree for hundreds of years.

Every part of the coconut tree can be used. The coconut itself provides fresh water and a sweet white flesh that can be eaten raw or used in cooking. Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down. The dried flesh, called copra, is used to make coconut oil, which has uses in cooking, beauty products, and medicine.

The leaves of the coconut palm are used to make baskets, brooms, and thatch for roofing. The trunk of the tree is used for building. Even the shells and husks of the coconut can be burned as fuel or turned into handicrafts. Because of this, the coconut palm is sometimes called the tree of life.

Jamaica has a long tradition of coconut farming. Coconut water is sold fresh on roadsides, and coconut-based sweets and snacks are popular across the island. The coconut palm is not just a tree — it is a part of Jamaican life and culture.`,
    question: "What is \'COPRA\', as described in the passage?",
    options: [
      "A type of coconut shell",
      "A coconut palm leaf",
      "The dried flesh of the coconut",
      "A Jamaican dish made with coconut milk",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly defines copra: \'The dried flesh, called copra, is used to make coconut oil.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `The Coconut Palm: The Tree of Life

The coconut palm is one of the most useful trees in the world. In Jamaica, it grows all along the coastline, standing tall with its long, feathery leaves swaying in the sea breeze. Farmers and coastal communities have depended on the coconut tree for hundreds of years.

Every part of the coconut tree can be used. The coconut itself provides fresh water and a sweet white flesh that can be eaten raw or used in cooking. Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down. The dried flesh, called copra, is used to make coconut oil, which has uses in cooking, beauty products, and medicine.

The leaves of the coconut palm are used to make baskets, brooms, and thatch for roofing. The trunk of the tree is used for building. Even the shells and husks of the coconut can be burned as fuel or turned into handicrafts. Because of this, the coconut palm is sometimes called the tree of life.

Jamaica has a long tradition of coconut farming. Coconut water is sold fresh on roadsides, and coconut-based sweets and snacks are popular across the island. The coconut palm is not just a tree — it is a part of Jamaican life and culture.`,
    question: "Why is the coconut palm sometimes called \'the tree of life\'?",
    options: [
      "It grows very tall and lives for many years.",
      "Almost every part of it can be used, making it extremely valuable to communities.",
      "It is found only in Jamaica.",
      "It provides fresh water to people in dry areas.",
    ],
    correctAnswer: 1,
    explanation: "The passage explains that every part — fruit, leaves, trunk, shells, and husks — can be used, earning it the name \'tree of life.\'"
  },
  {
    id: 9,
    type: "reading",
    passage: `The Coconut Palm: The Tree of Life

The coconut palm is one of the most useful trees in the world. In Jamaica, it grows all along the coastline, standing tall with its long, feathery leaves swaying in the sea breeze. Farmers and coastal communities have depended on the coconut tree for hundreds of years.

Every part of the coconut tree can be used. The coconut itself provides fresh water and a sweet white flesh that can be eaten raw or used in cooking. Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down. The dried flesh, called copra, is used to make coconut oil, which has uses in cooking, beauty products, and medicine.

The leaves of the coconut palm are used to make baskets, brooms, and thatch for roofing. The trunk of the tree is used for building. Even the shells and husks of the coconut can be burned as fuel or turned into handicrafts. Because of this, the coconut palm is sometimes called the tree of life.

Jamaica has a long tradition of coconut farming. Coconut water is sold fresh on roadsides, and coconut-based sweets and snacks are popular across the island. The coconut palm is not just a tree — it is a part of Jamaican life and culture.`,
    question: "Which detail from the coconut passage BEST supports the idea that the tree is useful for building?",
    options: [
      "The coconut itself provides fresh water and sweet white flesh.",
      "Coconut milk is used in many traditional Jamaican dishes.",
      "The trunk of the tree is used for building.",
      "The leaves are used to make baskets and brooms.",
    ],
    correctAnswer: 2,
    explanation: "Option C directly states that the trunk is used for building — the clearest evidence of the tree\'s building utility."
  },
  {
    id: 10,
    type: "reading",
    passage: `The Coconut Palm: The Tree of Life

The coconut palm is one of the most useful trees in the world. In Jamaica, it grows all along the coastline, standing tall with its long, feathery leaves swaying in the sea breeze. Farmers and coastal communities have depended on the coconut tree for hundreds of years.

Every part of the coconut tree can be used. The coconut itself provides fresh water and a sweet white flesh that can be eaten raw or used in cooking. Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down. The dried flesh, called copra, is used to make coconut oil, which has uses in cooking, beauty products, and medicine.

The leaves of the coconut palm are used to make baskets, brooms, and thatch for roofing. The trunk of the tree is used for building. Even the shells and husks of the coconut can be burned as fuel or turned into handicrafts. Because of this, the coconut palm is sometimes called the tree of life.

Jamaica has a long tradition of coconut farming. Coconut water is sold fresh on roadsides, and coconut-based sweets and snacks are popular across the island. The coconut palm is not just a tree — it is a part of Jamaican life and culture.`,
    question: "In which PARAGRAPH of the coconut palm passage does the author FIRST mention its role in Jamaican cooking?",
    options: [
      "Paragraph 1",
      "Paragraph 2",
      "Paragraph 3",
      "Paragraph 4",
    ],
    correctAnswer: 1,
    explanation: "Paragraph 2 first mentions cooking: \'Coconut milk is used in many traditional Jamaican dishes, including rice and peas and run-down.\'"
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The puppy TREMBLED in the cold rain.\" The word \'trembled\' means —",
    options: [
      "played happily",
      "shook involuntarily",
      "barked loudly",
      "ran quickly",
    ],
    correctAnswer: 1,
    explanation: "Trembled means shook involuntarily, usually because of cold, fear, or weakness."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The politician\'s speech was INFLAMMATORY, stirring up anger among the crowd.\" The word \'inflammatory\' means —",
    options: [
      "calming and soothing",
      "likely to provoke or stir up strong, angry feelings",
      "well-organised and logical",
      "long and boring",
    ],
    correctAnswer: 1,
    explanation: "Inflammatory means tending to arouse strong, angry emotions — stirring up rather than settling down."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \'generous\'?",
    options: [
      "kind",
      "giving",
      "selfish",
      "humble",
    ],
    correctAnswer: 2,
    explanation: "The opposite of generous (willing to give freely) is selfish (concerned only with oneself and unwilling to share)."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"She SCRUTINISED the document carefully before signing.\" The word \'scrutinised\' means —",
    options: [
      "ignored completely",
      "signed quickly",
      "examined very closely",
      "copied word for word",
    ],
    correctAnswer: 2,
    explanation: "To scrutinise means to examine or inspect something very carefully and in detail."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"The athlete trained DILIGENTLY every day for the upcoming championship.\" The word \'diligently\' means —",
    options: [
      "lazily and without effort",
      "with careful, persistent effort",
      "carelessly and quickly",
      "occasionally and without routine",
    ],
    correctAnswer: 1,
    explanation: "Diligently means with careful and persistent effort — working hard consistently and thoroughly."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The path through the forest was TREACHEROUS.\" The word \'treacherous\' means —",
    options: [
      "beautiful and scenic",
      "long and winding",
      "very dangerous, especially in a hidden way",
      "dark and cold",
    ],
    correctAnswer: 2,
    explanation: "Treacherous means very dangerous, particularly in a way that is hidden or unpredictable."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "Which pair of words are SYNONYMS?",
    options: [
      "depart / arrive",
      "cheerful / gloomy",
      "assist / help",
      "victory / defeat",
    ],
    correctAnswer: 2,
    explanation: "Synonyms have the same or similar meanings. Assist and help both mean to give support or aid."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"The teacher\'s STERN expression silenced the class immediately.\" The word \'stern\' means —",
    options: [
      "joyful and welcoming",
      "strict and serious",
      "confused and uncertain",
      "gentle and kind",
    ],
    correctAnswer: 1,
    explanation: "Stern means serious and unyielding — a stern expression is firm and unsmiling."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"She PERSISTED until she found the answer.\" The word \'persisted\' means —",
    options: [
      "gave up quickly",
      "asked someone for help",
      "kept trying without giving up",
      "made a lucky guess",
    ],
    correctAnswer: 2,
    explanation: "To persist means to continue doing something despite difficulty or opposition."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"The RESILIENT community rebuilt their homes after the hurricane.\" The word \'resilient\' means —",
    options: [
      "wealthy",
      "able to recover quickly from hardship",
      "careless and unprepared",
      "small and isolated",
    ],
    correctAnswer: 1,
    explanation: "Resilient means able to withstand or recover quickly from difficult conditions."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct verb: \'There _____ many students waiting outside the hall.\'",
    options: [
      "is",
      "was",
      "are",
      "am",
    ],
    correctAnswer: 2,
    explanation: "\'Many students\' is plural, so the correct plural verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Identify the ERROR in this sentence: \'She said that she don\'t understand the question.\'",
    options: [
      "\'said\' should be \'says\'",
      "\'don\'t\' should be \'didn\'t\'",
      "\'understand\' should be \'understood\'",
      "\'that\' should be removed",
    ],
    correctAnswer: 1,
    explanation: "The sentence is in the past tense (\'said\'), so the reported speech should also use the past tense: \'didn\'t understand.\' \'Don\'t\' is present tense and incorrect here."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The student\'s book was left on the desk.",
      "The students books were left on the desk.",
      "The student\'s books was left on the desk.",
      "The students\' book were left on the desk.",
    ],
    correctAnswer: 0,
    explanation: "\'The student\'s book\' correctly uses an apostrophe to show that the book belongs to the student. The verb \'was\' also correctly agrees with the singular \'book.\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the CORRECT sentence:",
    options: [
      "Neither the teacher nor the students was ready.",
      "Neither the teacher nor the students were ready.",
      "Neither the teacher nor the students are ready.",
      "Neither the teacher nor the students has been ready.",
    ],
    correctAnswer: 1,
    explanation: "With \'neither...nor,\' the verb agrees with the subject closest to it. \'The students\' is plural, so \'were\' is correct."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which word correctly fills the blank? \'She runs faster _____ her sister.\'",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "\'Than\' is used in comparisons. \'Then\' refers to time or sequence. The correct word here is \'than.\'"
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that is in the PAST TENSE:",
    options: [
      "The children are playing in the yard.",
      "The children played in the yard.",
      "The children will play in the yard.",
      "The children have been playing in the yard.",
    ],
    correctAnswer: 1,
    explanation: "\'Played\' is the simple past tense. The other options use present, future, and present perfect tenses."
  },
  {
    id: 27,
    type: "grammar",
    question: "Which sentence contains a RELATIVE CLAUSE?",
    options: [
      "The dog barked loudly.",
      "She studied, and she passed the exam.",
      "The book that she borrowed was very interesting.",
      "Although it rained, they continued playing.",
    ],
    correctAnswer: 2,
    explanation: "A relative clause provides extra information about a noun. \'That she borrowed\' is the relative clause describing \'the book.\'"
  },
  {
    id: 28,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The group of tourists were very loud.",
      "The group of tourists was very loud.",
      "The group of tourists have been very loud.",
      "The group of tourists are very loud.",
    ],
    correctAnswer: 1,
    explanation: "\'Group\' is a collective noun treated as singular. The correct verb is \'was.\'"
  },
  {
    id: 29,
    type: "grammar",
    question: "Which sentence uses DIRECT SPEECH correctly?",
    options: [
      "She said, \"I will return tomorrow\" with no closing mark.",
      "She said \"I will return tomorrow.\"",
      "She said \'I will return tomorrow.\'",
      "She said, \"I will return tomorrow.\"",
    ],
    correctAnswer: 3,
    explanation: "Direct speech uses quotation marks around the exact words spoken, introduced by a comma. Option D correctly formats the quotation."
  },
  {
    id: 30,
    type: "grammar",
    question: "Identify the ADVERB in this sentence: \'The students worked quietly during the exam.\'",
    options: [
      "students",
      "worked",
      "quietly",
      "exam",
    ],
    correctAnswer: 2,
    explanation: "An adverb modifies a verb, adjective, or another adverb. \'Quietly\' describes how the students worked — it is the adverb."
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that shows CORRECT use of the COLON:",
    options: [
      "She had only one wish: to see her family again.",
      "She: had only one wish to see her family again.",
      "She had only one: wish to see her family again.",
      "She had only one wish to see: her family again.",
    ],
    correctAnswer: 0,
    explanation: "A colon is placed after a complete clause to introduce what follows. \'She had only one wish\' is complete, and the colon correctly introduces \'to see her family again.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence is grammatically CORRECT?",
    options: [
      "Between you and I, the answer is obvious.",
      "Between you and me, the answer is obvious.",
      "Between you and myself, the answer is obvious.",
      "Between I and you, the answer is obvious.",
    ],
    correctAnswer: 1,
    explanation: "\'Between\' is a preposition and must be followed by object pronouns. \'Me\' is the correct object pronoun — not \'I\' or \'myself.\'"
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why Marcus Garvey deserves to be remembered as a National Hero?",
    options: [
      "Marcus Garvey was born in St. Ann\'s Bay in 1887.",
      "Marcus Garvey founded the Universal Negro Improvement Association.",
      "Marcus Garvey deserves his place among Jamaica\'s greatest heroes because, at a time when dignity was denied to millions, he dared to insist that it could not be taken — and inspired generations to believe the same.",
      "Many people around the world have heard of Marcus Garvey.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear evaluative claim, is specific about the historical context (\'dignity was denied to millions\'), and frames the legacy precisely — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong in a paragraph about the benefits of reading?",
    options: [
      "Reading improves vocabulary and communication skills.",
      "Regular reading has been shown to improve concentration and reduce stress.",
      "The school library was repainted last year.",
      "Books can take you to places you have never been before.",
    ],
    correctAnswer: 2,
    explanation: "All sentences are about the benefits of reading except \'The school library was repainted last year\' — which is about the library building, not about reading itself."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'She was very very happy when she got the good news.\'",
    options: [
      "She was very very extremely happy when she got the good news.",
      "She was absolutely overjoyed when she received the wonderful news.",
      "She was happy when she got news.",
      "When she got the news she was very happy.",
    ],
    correctAnswer: 1,
    explanation: "Option B replaces the repetitive \'very very happy\' with the precise word \'overjoyed\' and upgrades \'got the good news\' to \'received the wonderful news\' — making both the emotion and the action more vivid."
  },
  {
    id: 36,
    type: "writing",
    question: "Choose the word that BEST completes this sentence: \'The documentary _____ the issue of climate change in a clear and accessible way.\'",
    options: [
      "shouted",
      "ignored",
      "addressed",
      "avoided",
    ],
    correctAnswer: 2,
    explanation: "\'Addressed\' means dealt with or discussed a topic. It is the most precise and appropriate word for describing how a documentary handles an issue."
  },
  {
    id: 37,
    type: "writing",
    question: "A student wrote: \'Technology are changing education. Students uses tablets and online resources.\' What is the MOST COMPLETE and ACCURATE revision?",
    options: [
      "Technology is changing education. Students use tablets and online resources.",
      "Technology are changing education. Students use tablets and online resources.",
      "Technology is changing education. Students uses tablets and online resources.",
      "Technologies are changing education. Students use tablets and online resources.",
    ],
    correctAnswer: 0,
    explanation: "Option A corrects both subject-verb agreement errors: \'Technology\' is singular (\'is\'), and \'students\' is plural (\'use\')."
  },
  {
    id: 38,
    type: "writing",
    question: "Which closing sentence BEST concludes a paragraph about the importance of sport in schools?",
    options: [
      "Many schools in Jamaica have football and netball teams.",
      "Therefore, sport should remain a central part of school life, as it builds not only strong bodies but also strong character.",
      "Students should go to sports practice every afternoon.",
      "The government should give schools more funding for sports.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses a transition word (\'therefore\'), restates the main idea, and adds a memorable insight (\'not only strong bodies but also strong character\') — qualities of a strong closing sentence."
  },
  {
    id: 39,
    type: "writing",
    question: "Which BEST describes the purpose of a HOOK in an introductory paragraph?",
    options: [
      "To summarise the main points of the essay",
      "To capture the reader\'s attention and make them want to keep reading",
      "To state the evidence that supports the argument",
      "To provide a definition of the topic",
    ],
    correctAnswer: 1,
    explanation: "A hook is the opening element of an introduction designed to grab the reader\'s attention and draw them into the writing."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following sentences uses the MOST PRECISE and EFFECTIVE language?",
    options: [
      "The old building was not in good shape.",
      "The building was really old and messy.",
      "The derelict building stood in crumbling disrepair, its windows shattered and its roof caved in.",
      "The building was very old and looked bad.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific, vivid words (\'derelict,\' \'crumbling disrepair,\' \'shattered,\' \'caved in\') that create a precise and powerful image."
  }
]

export default function LiteracyMixed5MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed5Questions : literacyMixed5Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 5</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 5</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 5 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 5</h1>
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
