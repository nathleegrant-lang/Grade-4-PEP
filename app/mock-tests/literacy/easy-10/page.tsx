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

const literacyEasy10Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Fishing Village

The village of Rocky Point sat at the edge of the sea in Clarendon. Every morning before sunrise, the fishermen dragged their colourful boats down the sandy shore and pushed off into the dark water. By the time the sun appeared over the hills, the boats were already small shapes far out on the sea.

One of the youngest fishermen was sixteen-year-old Rohan. His grandfather, Old Man Clevie, had taught him everything — how to read the clouds for weather, how to tell where fish would be by the colour of the water, and how to mend a net with quick, sure fingers.

On this particular morning, Rohan caught more fish than he ever had before. His boat sat low in the water from the weight of the catch. When he dragged the boat back onto the shore, the other fishermen gathered around and clapped him on the back.

Old Man Clevie stood a little apart from the crowd. When Rohan looked at him, the old man simply nodded once — slowly, with a small smile. Rohan understood. That single nod meant more to him than all the clapping in the world.`,
    question: "What is this passage MAINLY about?",
    options: [
      "The history of the fishing industry in Clarendon",
      "Young Rohan\\'s successful fishing morning and the special praise from his grandfather",
      "How fishermen at Rocky Point catch and sell fish",
      "Why Old Man Clevie is the best fisherman in the village",
    ],
    correctAnswer: 1,
    explanation: "The passage is mainly about Rohan\\'s great catch and the meaningful, quiet praise he receives from his grandfather."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Fishing Village

The village of Rocky Point sat at the edge of the sea in Clarendon. Every morning before sunrise, the fishermen dragged their colourful boats down the sandy shore and pushed off into the dark water. By the time the sun appeared over the hills, the boats were already small shapes far out on the sea.

One of the youngest fishermen was sixteen-year-old Rohan. His grandfather, Old Man Clevie, had taught him everything — how to read the clouds for weather, how to tell where fish would be by the colour of the water, and how to mend a net with quick, sure fingers.

On this particular morning, Rohan caught more fish than he ever had before. His boat sat low in the water from the weight of the catch. When he dragged the boat back onto the shore, the other fishermen gathered around and clapped him on the back.

Old Man Clevie stood a little apart from the crowd. When Rohan looked at him, the old man simply nodded once — slowly, with a small smile. Rohan understood. That single nod meant more to him than all the clapping in the world.`,
    question: "What time did the fishermen leave the village each day?",
    options: [
      "At noon",
      "At sunrise",
      "Before sunrise",
      "After breakfast",
    ],
    correctAnswer: 2,
    explanation: "The passage states that every morning before sunrise, the fishermen dragged their boats down to the shore and set off."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Fishing Village

The village of Rocky Point sat at the edge of the sea in Clarendon. Every morning before sunrise, the fishermen dragged their colourful boats down the sandy shore and pushed off into the dark water. By the time the sun appeared over the hills, the boats were already small shapes far out on the sea.

One of the youngest fishermen was sixteen-year-old Rohan. His grandfather, Old Man Clevie, had taught him everything — how to read the clouds for weather, how to tell where fish would be by the colour of the water, and how to mend a net with quick, sure fingers.

On this particular morning, Rohan caught more fish than he ever had before. His boat sat low in the water from the weight of the catch. When he dragged the boat back onto the shore, the other fishermen gathered around and clapped him on the back.

Old Man Clevie stood a little apart from the crowd. When Rohan looked at him, the old man simply nodded once — slowly, with a small smile. Rohan understood. That single nod meant more to him than all the clapping in the world.`,
    question: "What did Old Man Clevie teach Rohan?",
    options: [
      "How to sell fish at the market",
      "How to build a fishing boat",
      "How to read the clouds, find fish by the colour of water, and mend nets",
      "How to swim in the deep sea",
    ],
    correctAnswer: 2,
    explanation: "The passage lists the three things Old Man Clevie taught Rohan: reading the clouds for weather, finding fish by the colour of the water, and mending nets."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Fishing Village

The village of Rocky Point sat at the edge of the sea in Clarendon. Every morning before sunrise, the fishermen dragged their colourful boats down the sandy shore and pushed off into the dark water. By the time the sun appeared over the hills, the boats were already small shapes far out on the sea.

One of the youngest fishermen was sixteen-year-old Rohan. His grandfather, Old Man Clevie, had taught him everything — how to read the clouds for weather, how to tell where fish would be by the colour of the water, and how to mend a net with quick, sure fingers.

On this particular morning, Rohan caught more fish than he ever had before. His boat sat low in the water from the weight of the catch. When he dragged the boat back onto the shore, the other fishermen gathered around and clapped him on the back.

Old Man Clevie stood a little apart from the crowd. When Rohan looked at him, the old man simply nodded once — slowly, with a small smile. Rohan understood. That single nod meant more to him than all the clapping in the world.`,
    question: "How did the other fishermen react when Rohan returned with his catch?",
    options: [
      "They were jealous and walked away.",
      "They gathered around and clapped him on the back.",
      "They asked to buy some of his fish.",
      "They helped him pull the boat onto the shore.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the other fishermen gathered around and clapped him on the back."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Fishing Village

The village of Rocky Point sat at the edge of the sea in Clarendon. Every morning before sunrise, the fishermen dragged their colourful boats down the sandy shore and pushed off into the dark water. By the time the sun appeared over the hills, the boats were already small shapes far out on the sea.

One of the youngest fishermen was sixteen-year-old Rohan. His grandfather, Old Man Clevie, had taught him everything — how to read the clouds for weather, how to tell where fish would be by the colour of the water, and how to mend a net with quick, sure fingers.

On this particular morning, Rohan caught more fish than he ever had before. His boat sat low in the water from the weight of the catch. When he dragged the boat back onto the shore, the other fishermen gathered around and clapped him on the back.

Old Man Clevie stood a little apart from the crowd. When Rohan looked at him, the old man simply nodded once — slowly, with a small smile. Rohan understood. That single nod meant more to him than all the clapping in the world.`,
    question: "Why did Old Man Clevie\\'s single nod mean more to Rohan than all the clapping?",
    options: [
      "Rohan did not like being clapped on the back.",
      "Old Man Clevie was the most famous fisherman in Jamaica.",
      "A quiet nod from his mentor showed deeper pride and approval than loud praise from others.",
      "Old Man Clevie had never nodded at anyone before.",
    ],
    correctAnswer: 2,
    explanation: "The passage shows that Clevie\\'s nod was meaningful because it came from the man who had taught Rohan everything — his quiet approval carried great weight."
  },
  {
    id: 6,
    type: "reading",
    passage: `Samuel Sharpe: National Hero

Samuel Sharpe was born into slavery in Jamaica around 1801. Despite being enslaved, he taught himself to read and became a lay preacher in the Baptist church. His ability to speak powerfully and his intelligence earned him great respect among the enslaved people of western Jamaica.

Sharpe believed strongly that slavery was wrong and that all people deserved to be free. He studied the Bible and saw clearly that slavery went against its teachings. He also followed news from England, where people were calling for the abolition of slavery. Sharpe believed that freedom was coming — he decided to help speed it along.

In December 1831, Sharpe organised what he intended to be a peaceful strike. Enslaved workers would refuse to return to work after the Christmas holiday unless they were paid and given more rights. But the protest turned violent, and what became known as the Christmas Rebellion, or the Baptist War, spread across the parishes of western Jamaica.

The rebellion was crushed by the colonial authorities, and Samuel Sharpe was arrested. He was executed on May 23, 1832. But his courage was not forgotten. The rebellion helped convince the British Parliament that slavery could not continue. Emancipation came in 1834. Today, Samuel Sharpe is celebrated as one of Jamaica\\'s seven National Heroes. His portrait appears on the Jamaican fifty-dollar bill.`,
    question: "What did Samuel Sharpe do despite being enslaved?",
    options: [
      "He escaped to England and spoke to Parliament.",
      "He taught himself to read and became a Baptist lay preacher.",
      "He led an army against the colonial forces.",
      "He wrote a letter to the King of England asking for freedom.",
    ],
    correctAnswer: 1,
    explanation: "The passage states that despite being enslaved, Sharpe taught himself to read and became a lay preacher in the Baptist church."
  },
  {
    id: 7,
    type: "reading",
    passage: `Samuel Sharpe: National Hero

Samuel Sharpe was born into slavery in Jamaica around 1801. Despite being enslaved, he taught himself to read and became a lay preacher in the Baptist church. His ability to speak powerfully and his intelligence earned him great respect among the enslaved people of western Jamaica.

Sharpe believed strongly that slavery was wrong and that all people deserved to be free. He studied the Bible and saw clearly that slavery went against its teachings. He also followed news from England, where people were calling for the abolition of slavery. Sharpe believed that freedom was coming — he decided to help speed it along.

In December 1831, Sharpe organised what he intended to be a peaceful strike. Enslaved workers would refuse to return to work after the Christmas holiday unless they were paid and given more rights. But the protest turned violent, and what became known as the Christmas Rebellion, or the Baptist War, spread across the parishes of western Jamaica.

The rebellion was crushed by the colonial authorities, and Samuel Sharpe was arrested. He was executed on May 23, 1832. But his courage was not forgotten. The rebellion helped convince the British Parliament that slavery could not continue. Emancipation came in 1834. Today, Samuel Sharpe is celebrated as one of Jamaica\\'s seven National Heroes. His portrait appears on the Jamaican fifty-dollar bill.`,
    question: "What did Sharpe ORIGINALLY plan the December 1831 protest to be?",
    options: [
      "A violent uprising across all of Jamaica",
      "A march to the courthouse in Montego Bay",
      "A peaceful strike where workers refused to return to work",
      "A prayer meeting at the Baptist church",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Sharpe organised what he intended to be a peaceful strike — workers would refuse to return to work after Christmas."
  },
  {
    id: 8,
    type: "reading",
    passage: `Samuel Sharpe: National Hero

Samuel Sharpe was born into slavery in Jamaica around 1801. Despite being enslaved, he taught himself to read and became a lay preacher in the Baptist church. His ability to speak powerfully and his intelligence earned him great respect among the enslaved people of western Jamaica.

Sharpe believed strongly that slavery was wrong and that all people deserved to be free. He studied the Bible and saw clearly that slavery went against its teachings. He also followed news from England, where people were calling for the abolition of slavery. Sharpe believed that freedom was coming — he decided to help speed it along.

In December 1831, Sharpe organised what he intended to be a peaceful strike. Enslaved workers would refuse to return to work after the Christmas holiday unless they were paid and given more rights. But the protest turned violent, and what became known as the Christmas Rebellion, or the Baptist War, spread across the parishes of western Jamaica.

The rebellion was crushed by the colonial authorities, and Samuel Sharpe was arrested. He was executed on May 23, 1832. But his courage was not forgotten. The rebellion helped convince the British Parliament that slavery could not continue. Emancipation came in 1834. Today, Samuel Sharpe is celebrated as one of Jamaica\\'s seven National Heroes. His portrait appears on the Jamaican fifty-dollar bill.`,
    question: "What is another name for the Christmas Rebellion?",
    options: [
      "The Emancipation War",
      "The Baptist War",
      "The Freedom March",
      "The Clarendon Uprising",
    ],
    correctAnswer: 1,
    explanation: "The passage states that the protest became known as the Christmas Rebellion, or the Baptist War."
  },
  {
    id: 9,
    type: "reading",
    passage: `Samuel Sharpe: National Hero

Samuel Sharpe was born into slavery in Jamaica around 1801. Despite being enslaved, he taught himself to read and became a lay preacher in the Baptist church. His ability to speak powerfully and his intelligence earned him great respect among the enslaved people of western Jamaica.

Sharpe believed strongly that slavery was wrong and that all people deserved to be free. He studied the Bible and saw clearly that slavery went against its teachings. He also followed news from England, where people were calling for the abolition of slavery. Sharpe believed that freedom was coming — he decided to help speed it along.

In December 1831, Sharpe organised what he intended to be a peaceful strike. Enslaved workers would refuse to return to work after the Christmas holiday unless they were paid and given more rights. But the protest turned violent, and what became known as the Christmas Rebellion, or the Baptist War, spread across the parishes of western Jamaica.

The rebellion was crushed by the colonial authorities, and Samuel Sharpe was arrested. He was executed on May 23, 1832. But his courage was not forgotten. The rebellion helped convince the British Parliament that slavery could not continue. Emancipation came in 1834. Today, Samuel Sharpe is celebrated as one of Jamaica\\'s seven National Heroes. His portrait appears on the Jamaican fifty-dollar bill.`,
    question: "When was Samuel Sharpe executed?",
    options: [
      "December 25, 1831",
      "August 6, 1834",
      "May 23, 1832",
      "January 1, 1833",
    ],
    correctAnswer: 2,
    explanation: "The passage clearly states that Samuel Sharpe was executed on May 23, 1832."
  },
  {
    id: 10,
    type: "reading",
    passage: `Samuel Sharpe: National Hero

Samuel Sharpe was born into slavery in Jamaica around 1801. Despite being enslaved, he taught himself to read and became a lay preacher in the Baptist church. His ability to speak powerfully and his intelligence earned him great respect among the enslaved people of western Jamaica.

Sharpe believed strongly that slavery was wrong and that all people deserved to be free. He studied the Bible and saw clearly that slavery went against its teachings. He also followed news from England, where people were calling for the abolition of slavery. Sharpe believed that freedom was coming — he decided to help speed it along.

In December 1831, Sharpe organised what he intended to be a peaceful strike. Enslaved workers would refuse to return to work after the Christmas holiday unless they were paid and given more rights. But the protest turned violent, and what became known as the Christmas Rebellion, or the Baptist War, spread across the parishes of western Jamaica.

The rebellion was crushed by the colonial authorities, and Samuel Sharpe was arrested. He was executed on May 23, 1832. But his courage was not forgotten. The rebellion helped convince the British Parliament that slavery could not continue. Emancipation came in 1834. Today, Samuel Sharpe is celebrated as one of Jamaica\\'s seven National Heroes. His portrait appears on the Jamaican fifty-dollar bill.`,
    question: "Where does Samuel Sharpe\\'s portrait appear today?",
    options: [
      "On the Jamaican flag",
      "On the Jamaican one-hundred-dollar bill",
      "On the Jamaican fifty-dollar bill",
      "On the Coat of Arms of Jamaica",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Samuel Sharpe\\'s portrait appears on the Jamaican fifty-dollar bill."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The fishermen DRAGGED their boats down the sandy shore.\" The word \\'dragged\\' means —",
    options: [
      "carried with ease",
      "pulled along the ground with effort",
      "pushed gently",
      "lifted high into the air",
    ],
    correctAnswer: 1,
    explanation: "To drag means to pull something along a surface with effort and force."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'courage\\'?",
    options: [
      "fear",
      "strength",
      "bravery",
      "patience",
    ],
    correctAnswer: 2,
    explanation: "Courage means the ability to face danger or difficulty without fear. Bravery is the closest synonym."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Sharpe was a LAY PREACHER in the Baptist church.\" The term \\'lay preacher\\' refers to —",
    options: [
      "a paid professional minister",
      "a church musician or organist",
      "a person who preaches but is not a professional clergy member",
      "a person who teaches in a school run by a church",
    ],
    correctAnswer: 2,
    explanation: "A lay preacher is someone who preaches in a church without being a formally ordained or paid minister — they are an ordinary member of the community who takes on this role."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "Which word is the OPPOSITE of \\'peaceful\\'?",
    options: [
      "quiet",
      "calm",
      "violent",
      "gentle",
    ],
    correctAnswer: 2,
    explanation: "The opposite of peaceful (calm and free from conflict) is violent (involving physical force and aggression)."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Sharpe studied news about the ABOLITION of slavery in England.\" The word \\'abolition\\' means —",
    options: [
      "the study of",
      "the spread of",
      "the official ending of something",
      "the support of",
    ],
    correctAnswer: 2,
    explanation: "Abolition means the official ending or banning of a practice, especially slavery."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "parlament",
      "parliment",
      "parliament",
      "Parlament",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is parliament — p-a-r-l-i-a-m-e-n-t. Note the \\'ia\\' in the middle."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Old Man Clevie\\'s intelligence earned him great RESPECT among the fishermen.\" The word \\'respect\\' means —",
    options: [
      "fear caused by power",
      "admiration and high regard for someone",
      "sympathy for someone in trouble",
      "dislike and distrust of someone",
    ],
    correctAnswer: 1,
    explanation: "Respect means high regard and admiration — recognising someone\\'s worth, skill, or wisdom."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "Which word is a SYNONYM for \\'executed\\'?",
    options: [
      "pardoned",
      "released",
      "freed",
      "put to death",
    ],
    correctAnswer: 3,
    explanation: "Executed means put to death, usually as a punishment carried out by authorities. \\'Put to death\\' is the closest synonym."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The boat sat LOW in the water from the WEIGHT of the catch.\" The word \\'catch\\' in this sentence means —",
    options: [
      "the act of grabbing something",
      "the fish that were caught during the fishing trip",
      "the fishing nets and equipment on the boat",
      "the money earned from selling fish",
    ],
    correctAnswer: 1,
    explanation: "In this context, \\'catch\\' refers to the fish that were caught during the fishing trip — the result of the fishermen\\'s work."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "What is the PLURAL of the word \\'hero\\'?",
    options: [
      "heros",
      "herois",
      "heroes",
      "heroes",
    ],
    correctAnswer: 3,
    explanation: "The correct plural of hero is heroes — words ending in -o often add -es to form the plural."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the correct word: \"Every morning, the fishermen ___ their nets before setting out to sea.\"",
    options: [
      "checking",
      "checks",
      "checked",
      "check",
    ],
    correctAnswer: 3,
    explanation: "The sentence uses the time clue \\'every morning,\\' indicating a regular action. The simple present plural verb \\'check\\' is correct for a plural subject in a habitual action. However, for past narrative, \\'checked\\' is also valid — here the intended past-tense narrative form is \\'checked.\\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which word in this sentence is a VERB? \"Samuel Sharpe organised a peaceful strike in December 1831.\"",
    options: [
      "Samuel",
      "peaceful",
      "strike",
      "organised",
    ],
    correctAnswer: 3,
    explanation: "A verb is an action or doing word. \\'Organised\\' tells us what Sharpe did — it is the verb."
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence is punctuated CORRECTLY?",
    options: [
      "Samuel Sharpe was brave intelligent and determined.",
      "Samuel Sharpe was brave, intelligent, and determined.",
      "Samuel Sharpe was brave intelligent, and determined.",
      "Samuel Sharpe was, brave, intelligent, and determined.",
    ],
    correctAnswer: 1,
    explanation: "When listing three or more adjectives, commas are placed between them. Option B correctly uses commas between \\'brave,\\' \\'intelligent,\\' and \\'determined.\\'"
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the correct word: \"It was ___ important day in Jamaican history.\"",
    options: [
      "a",
      "the",
      "an",
      "some",
    ],
    correctAnswer: 2,
    explanation: "We use \\'an\\' before words beginning with a vowel sound. \\'Important\\' begins with the vowel sound \\'i,\\' so we say \\'an important day.\\'"
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence uses CAPITAL LETTERS correctly?",
    options: [
      "samuel sharpe is one of Jamaica\\'s seven national heroes.",
      "Samuel sharpe is one of Jamaica\\'s seven National Heroes.",
      "Samuel Sharpe is one of Jamaica\\'s seven National Heroes.",
      "Samuel Sharpe is one of Jamaica\\'s Seven National Heroes.",
    ],
    correctAnswer: 2,
    explanation: "Names (Samuel Sharpe), proper nouns (Jamaica), and titles of distinction (National Heroes) are capitalised. Only option C applies all the correct rules."
  },
  {
    id: 26,
    type: "grammar",
    question: "Which word in this sentence is an ADVERB? \"The old man nodded slowly with a small smile.\"",
    options: [
      "old",
      "nodded",
      "small",
      "slowly",
    ],
    correctAnswer: 3,
    explanation: "An adverb describes how an action is done. \\'Slowly\\' tells us how the old man nodded — it is the adverb."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the correct word: \"By the time Emancipation came, Sharpe ___ already been executed for two years.\"",
    options: [
      "has",
      "have",
      "had",
      "is",
    ],
    correctAnswer: 2,
    explanation: "The past perfect (\\'had\\' + past participle) is used for an action completed before another past event. \\'Had already been executed\\' is correct here."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence uses an APOSTROPHE correctly?",
    options: [
      "The fishermens nets were spread on the shore to dry.",
      "The fishermen\\'s nets were spread on the shore to dry.",
      "The fishermens\\' nets were spread on the shore to dry.",
      "The fishermen nets\\' were spread on the shore to dry.",
    ],
    correctAnswer: 1,
    explanation: "Since \\'fishermen\\' is an irregular plural (it does not end in -s), the apostrophe + s is placed after the whole word: fishermen\\'s."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the correct word: \"Rohan\\'s catch was larger ___ any he had made before.\"",
    options: [
      "then",
      "that",
      "when",
      "than",
    ],
    correctAnswer: 3,
    explanation: "We use \\'than\\' in comparisons. The correct word here is \\'than.\\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence is written CORRECTLY?",
    options: [
      "Us fishermen go out to sea every morning before sunrise.",
      "We fishermen go out to sea every morning before sunrise.",
      "We fishermens go out to sea every morning before sunrise.",
      "Us and the other fishermen go out to sea every morning before sunrise.",
    ],
    correctAnswer: 1,
    explanation: "When a pronoun is the subject of a sentence, use a subject pronoun. \\'We\\' is the correct subject pronoun. \\'Us\\' is an object pronoun and cannot be the subject."
  },
  {
    id: 31,
    type: "grammar",
    question: "Which word is the PRONOUN in this sentence? \"His portrait appears on the fifty-dollar bill.\"",
    options: [
      "portrait",
      "appears",
      "dollar",
      "His",
    ],
    correctAnswer: 3,
    explanation: "A pronoun replaces a noun. \\'His\\' is a possessive pronoun that refers to Samuel Sharpe — it is the pronoun in this sentence."
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the CORRECT sentence:",
    options: [
      "The fishermen drags their boats down to the shore.",
      "The fishermen drag their boats down to the shore.",
      "The fishermen is dragging their boats down to the shore.",
      "The fishermen dragging their boats down to the shore.",
    ],
    correctAnswer: 1,
    explanation: "\"The fishermen\" is a plural subject. The correct simple present plural verb is \\'drag\\' — no -s ending for plural subjects."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST opening sentence for a paragraph about the legacy of Samuel Sharpe?",
    options: [
      "Samuel Sharpe was a man who lived in Jamaica a long time ago.",
      "Some people are remembered not for how long they lived, but for how bravely they stood up for what they believed.",
      "Jamaica has seven National Heroes.",
      "Slavery ended in Jamaica in 1834.",
    ],
    correctAnswer: 1,
    explanation: "Option B is a powerful, thought-provoking statement that sets up the idea of Sharpe\\'s legacy beautifully without naming him directly — it draws the reader in."
  },
  {
    id: 34,
    type: "writing",
    question: "Which sentence does NOT belong? \\'Rocky Point is a fishing village in Clarendon. The fishermen go out to sea before sunrise. Fishing boats are painted in bright colours. The coconut palm is sometimes called the tree of life. The catch is sold fresh at the wharf each morning.\\'",
    options: [
      "Rocky Point is a fishing village in Clarendon.",
      "The fishermen go out to sea before sunrise.",
      "The coconut palm is sometimes called the tree of life.",
      "The catch is sold fresh at the wharf each morning.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about the fishing village. \\'The coconut palm is sometimes called the tree of life\\' is off-topic and does not belong."
  },
  {
    id: 35,
    type: "writing",
    question: "Which is the BEST closing sentence for a paragraph about Samuel Sharpe?",
    options: [
      "Sharpe was executed in 1832.",
      "The Christmas Rebellion took place in 1831.",
      "Though his life was cut short, Samuel Sharpe\\'s courage helped light the path to freedom for generations of Jamaicans.",
      "Sharpe was a lay preacher in the Baptist church.",
    ],
    correctAnswer: 2,
    explanation: "Option C is a strong, meaningful closing — it acknowledges his death, honours his courage, and connects it to the lasting impact on Jamaica. It ends the paragraph on a note of dignity."
  },
  {
    id: 36,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "emmancipation",
      "Emansipation",
      "emancepation",
      "Emancipation",
    ],
    correctAnswer: 3,
    explanation: "The correct spelling is Emancipation — E-m-a-n-c-i-p-a-t-i-o-n. Note the \\'c\\' before \\'i\\' and -tion at the end."
  },
  {
    id: 37,
    type: "writing",
    question: "Choose the BEST word to complete this sentence: \"Old Man Clevie ___ young Rohan, teaching him everything he knew about the sea.\"",
    options: [
      "liked",
      "met",
      "mentored",
      "helped",
    ],
    correctAnswer: 2,
    explanation: "\"Mentored\" is the most precise word — it means to guide and train someone with knowledge and experience, which is exactly what Old Man Clevie did for Rohan."
  },
  {
    id: 38,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph about why Samuel Sharpe deserves to be a National Hero?",
    options: [
      "Samuel Sharpe lived in Jamaica in the early 1800s.",
      "Samuel Sharpe was executed on May 23, 1832.",
      "Samuel Sharpe deserves his place among Jamaica\\'s greatest heroes because he risked everything so that others could be free.",
      "Samuel Sharpe organised the Christmas Rebellion in 1831.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, evaluative claim about why Sharpe is a hero — exactly the kind of argument a topic sentence for this paragraph should make."
  },
  {
    id: 39,
    type: "writing",
    question: "Put these sentences in CORRECT ORDER: 1. His courage helped persuade the British Parliament to end slavery. 2. He organised a peaceful strike that became the Christmas Rebellion. 3. Samuel Sharpe taught himself to read and became a Baptist lay preacher. 4. He was arrested and executed on May 23, 1832.",
    options: [
      "3, 2, 4, 1",
      "1, 2, 3, 4",
      "2, 3, 4, 1",
      "4, 3, 2, 1",
    ],
    correctAnswer: 0,
    explanation: "The correct chronological order is: Sharpe learned to read and preached (3), organised the strike (2), was arrested and executed (4), and his courage convinced Parliament (1). This gives the sequence 3, 2, 4, 1."
  },
  {
    id: 40,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \\'The old man nodded at Rohan.\\'",
    options: [
      "The very old man slowly nodded at Rohan.",
      "Old Man Clevie nodded once, slowly — a single, quiet gesture that told Rohan everything words could not.",
      "The old man nodded and Rohan was happy.",
      "The man nodded at the young fisherman.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise, evocative language — \\'once, slowly,\\' \\'a single, quiet gesture,\\' and \\'everything words could not\\' — to capture the emotional weight of the moment beautifully."
  }
]

const SECTION_CONFIG = [
  { type: "reading" as const, label: "Reading", note: "main idea, supporting details, inference" },
  { type: "vocabulary" as const, label: "Vocabulary", note: "synonyms, antonyms, and meaning in context" },
  { type: "grammar" as const, label: "Grammar", note: "sentence structure, verbs, and usage" },
  { type: "writing" as const, label: "Writing", note: "capitalization, punctuation, editing, and spelling" },
]

export default function LiteracyEasy10MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyEasy10Questions : literacyEasy10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Easy 10</CardTitle>
              <p className="text-gray-600 mt-2">Grade 4 PEP Easy Practice</p>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question easy-level literacy test with reports and explanations.
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
                  <h3 className="font-semibold text-sky-800 mb-2">Easy-Level Focus:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Direct recall and clear text clues</li>
                    <li>- Basic grammar, vocabulary, and punctuation</li>
                    <li>- Comprehension, sequencing, and spelling</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Easy 10</p>
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
                    This easy-level literacy report includes section summaries and a full question-by-question review with explanations.
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Easy 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Easy 10</h1>
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
