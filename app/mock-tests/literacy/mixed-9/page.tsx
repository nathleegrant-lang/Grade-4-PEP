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

const literacyMixed9Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Mango Season

Every June, the mangoes came. Not just to Miss Eunice's yard, but to every yard in the district — yellow and orange and green and pink, swelling on branches, dropping into the grass, perfuming the hot air with something that Javon, who was eleven, thought was the best smell in the world.

Miss Eunice had a Julie mango tree that was, by general agreement, the finest in the village. When it fruited, she did not lock her gate. She put a basket under the tree and let the neighbours come. This had been her practice for so long that it had become simply a fact of the district, like the church bell on Sundays.

One year, Javon noticed that Miss Eunice herself rarely ate any. She picked up the fallen ones, gave most away, and stood sometimes under the tree in the evenings looking up at the fruit.

"Miss Eunice," he asked one evening, "why you don't eat more of the mangoes?"

She considered this. "I eat enough," she said. "But I'm not keeping them for eating. I'm keeping the tree."

Javon did not understand this fully at the time. But the following year, when a storm took three of the district's mango trees and Miss Eunice's still stood, he thought he understood a little better.`,
    question: "What is the SIGNIFICANCE of Miss Eunice leaving her gate unlocked during mango season?",
    options: [
      "She forgets to lock it each morning when she wakes up.",
      "She is not worried about security in the village.",
      "It is a deliberate act of communal generosity that has become a recognised village tradition.",
      "She wants people to help her pick the mangoes from the tree.",
    ],
    correctAnswer: 2,
    explanation: "The passage says this practice \'had become simply a fact of the district, like the church bell on Sundays\' — it is a deliberate, long-standing act of communal generosity, not an oversight."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Mango Season

Every June, the mangoes came. Not just to Miss Eunice's yard, but to every yard in the district — yellow and orange and green and pink, swelling on branches, dropping into the grass, perfuming the hot air with something that Javon, who was eleven, thought was the best smell in the world.

Miss Eunice had a Julie mango tree that was, by general agreement, the finest in the village. When it fruited, she did not lock her gate. She put a basket under the tree and let the neighbours come. This had been her practice for so long that it had become simply a fact of the district, like the church bell on Sundays.

One year, Javon noticed that Miss Eunice herself rarely ate any. She picked up the fallen ones, gave most away, and stood sometimes under the tree in the evenings looking up at the fruit.

"Miss Eunice," he asked one evening, "why you don't eat more of the mangoes?"

She considered this. "I eat enough," she said. "But I'm not keeping them for eating. I'm keeping the tree."

Javon did not understand this fully at the time. But the following year, when a storm took three of the district's mango trees and Miss Eunice's still stood, he thought he understood a little better.`,
    question: "What does Miss Eunice mean when she says \'I\'m not keeping them for eating. I\'m keeping the tree\'?",
    options: [
      "She wants to save the mangoes to sell them later.",
      "She values the continuity and health of the tree over consuming its fruit — she thinks long-term rather than short-term.",
      "She is too old to climb the tree and pick the mangoes.",
      "She does not like the taste of Julie mangoes.",
    ],
    correctAnswer: 1,
    explanation: "Miss Eunice\'s distinction between \'keeping for eating\' and \'keeping the tree\' expresses a long-term, stewardship view — she values the tree\'s ongoing life more than the immediate pleasure of the fruit."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Mango Season

Every June, the mangoes came. Not just to Miss Eunice's yard, but to every yard in the district — yellow and orange and green and pink, swelling on branches, dropping into the grass, perfuming the hot air with something that Javon, who was eleven, thought was the best smell in the world.

Miss Eunice had a Julie mango tree that was, by general agreement, the finest in the village. When it fruited, she did not lock her gate. She put a basket under the tree and let the neighbours come. This had been her practice for so long that it had become simply a fact of the district, like the church bell on Sundays.

One year, Javon noticed that Miss Eunice herself rarely ate any. She picked up the fallen ones, gave most away, and stood sometimes under the tree in the evenings looking up at the fruit.

"Miss Eunice," he asked one evening, "why you don't eat more of the mangoes?"

She considered this. "I eat enough," she said. "But I'm not keeping them for eating. I'm keeping the tree."

Javon did not understand this fully at the time. But the following year, when a storm took three of the district's mango trees and Miss Eunice's still stood, he thought he understood a little better.`,
    question: "What does Javon understand \'a little better\' after the storm?",
    options: [
      "He understands why storms are dangerous for fruit trees.",
      "He understands that Miss Eunice knew other trees would fall and kept her tree strong through care and commitment.",
      "He understands that Julie mangoes are the best variety.",
      "He understands that Miss Eunice was a better gardener than the other villagers.",
    ],
    correctAnswer: 1,
    explanation: "After the storm takes three trees but not Miss Eunice\'s, Javon begins to understand that her way of \'keeping the tree\' — caring for it long-term rather than just harvesting — had made it resilient."
  },
  {
    id: 4,
    type: "reading",
    question: "What is the CENTRAL THEME of the mango passage?",
    options: [
      "The dangers of tropical storms in Jamaica",
      "Stewardship, generosity, and taking care of something for its long-term health rather than short-term gain",
      "How to grow a healthy mango tree",
      "Why Julie mangoes are the best variety in Jamaica",
    ],
    correctAnswer: 1,
    explanation: "The passage is about Miss Eunice\'s approach to the tree — caring for it as a living thing to be stewarded and shared rather than simply harvested. The storm at the end confirms the wisdom of this approach."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the mango passage?",
    options: [
      "Urgent and alarming",
      "Warm, reflective, and gently wise",
      "Humorous and playful",
      "Critical of village life",
    ],
    correctAnswer: 1,
    explanation: "The passage is written with warmth and care — the sensory detail of mango season, Miss Eunice\'s quiet generosity, Javon\'s gradual understanding. The tone is warm, reflective, and gently wise."
  },
  {
    id: 6,
    type: "reading",
    passage: `The Gig Economy and Jamaican Workers

In recent years, the 'gig economy' — characterised by short-term, flexible, and often digital work arrangements — has expanded significantly in Jamaica. Ride-hailing drivers, food delivery couriers, freelance designers, and online tutors are among the thousands of Jamaicans who earn income outside traditional employment structures. For many, the appeal is clear: flexible hours, the ability to set one's own pace, and freedom from the formalities of nine-to-five employment.

However, this flexibility comes with significant trade-offs. Gig workers typically have no access to employer-provided benefits such as health insurance, paid leave, or pension contributions. Income is often unpredictable — surging during peak demand and falling sharply during slow periods. Workers bear all the risk that in traditional employment would be shared between employer and employee.

Jamaica's labour laws were largely designed for traditional employment relationships and do not clearly protect gig workers. This legal gap leaves many workers without recourse when platforms change their pay structures, deactivate accounts without explanation, or introduce new conditions without negotiation. In the United Kingdom, court rulings have established that some gig workers deserve basic employment protections; Jamaica has not yet reached a similar legal clarity.

The gig economy is neither simply good nor simply bad. It provides income opportunities that did not exist before, including for people who could not enter traditional employment due to disability, caregiving responsibilities, or geographic isolation. But without regulatory frameworks that protect workers while preserving flexibility, the gig economy risks becoming a system that transfers the insecurities of capitalism primarily onto those least equipped to absorb them.`,
    question: "What is the MAIN ARGUMENT of the gig economy passage?",
    options: [
      "The gig economy is entirely bad and should be banned in Jamaica.",
      "Jamaican workers should avoid gig work and seek traditional employment.",
      "The gig economy offers real benefits but also serious risks to workers, and without regulatory frameworks, it may harm those least equipped to absorb insecurity.",
      "Jamaica\'s gig economy is more developed than the United Kingdom\'s.",
    ],
    correctAnswer: 2,
    explanation: "The passage presents both benefits and risks, then argues that without regulation, the gig economy\'s risks fall most heavily on vulnerable workers. Option C captures this balanced but ultimately cautionary position."
  },
  {
    id: 7,
    type: "reading",
    passage: `The Gig Economy and Jamaican Workers

In recent years, the 'gig economy' — characterised by short-term, flexible, and often digital work arrangements — has expanded significantly in Jamaica. Ride-hailing drivers, food delivery couriers, freelance designers, and online tutors are among the thousands of Jamaicans who earn income outside traditional employment structures. For many, the appeal is clear: flexible hours, the ability to set one's own pace, and freedom from the formalities of nine-to-five employment.

However, this flexibility comes with significant trade-offs. Gig workers typically have no access to employer-provided benefits such as health insurance, paid leave, or pension contributions. Income is often unpredictable — surging during peak demand and falling sharply during slow periods. Workers bear all the risk that in traditional employment would be shared between employer and employee.

Jamaica's labour laws were largely designed for traditional employment relationships and do not clearly protect gig workers. This legal gap leaves many workers without recourse when platforms change their pay structures, deactivate accounts without explanation, or introduce new conditions without negotiation. In the United Kingdom, court rulings have established that some gig workers deserve basic employment protections; Jamaica has not yet reached a similar legal clarity.

The gig economy is neither simply good nor simply bad. It provides income opportunities that did not exist before, including for people who could not enter traditional employment due to disability, caregiving responsibilities, or geographic isolation. But without regulatory frameworks that protect workers while preserving flexibility, the gig economy risks becoming a system that transfers the insecurities of capitalism primarily onto those least equipped to absorb them.`,
    question: "What TRADE-OFFS do gig workers face, according to the passage?",
    options: [
      "They earn more money but work longer hours.",
      "They have flexible hours but no employment benefits, unpredictable income, and bear all the employment risk themselves.",
      "They can work from home but must own their own equipment.",
      "They are not required to pay taxes on their earnings.",
    ],
    correctAnswer: 1,
    explanation: "The passage lists specific trade-offs: no health insurance, paid leave, or pension; unpredictable income; workers bear all the risk that traditional employment would share."
  },
  {
    id: 8,
    type: "reading",
    passage: `The Gig Economy and Jamaican Workers

In recent years, the 'gig economy' — characterised by short-term, flexible, and often digital work arrangements — has expanded significantly in Jamaica. Ride-hailing drivers, food delivery couriers, freelance designers, and online tutors are among the thousands of Jamaicans who earn income outside traditional employment structures. For many, the appeal is clear: flexible hours, the ability to set one's own pace, and freedom from the formalities of nine-to-five employment.

However, this flexibility comes with significant trade-offs. Gig workers typically have no access to employer-provided benefits such as health insurance, paid leave, or pension contributions. Income is often unpredictable — surging during peak demand and falling sharply during slow periods. Workers bear all the risk that in traditional employment would be shared between employer and employee.

Jamaica's labour laws were largely designed for traditional employment relationships and do not clearly protect gig workers. This legal gap leaves many workers without recourse when platforms change their pay structures, deactivate accounts without explanation, or introduce new conditions without negotiation. In the United Kingdom, court rulings have established that some gig workers deserve basic employment protections; Jamaica has not yet reached a similar legal clarity.

The gig economy is neither simply good nor simply bad. It provides income opportunities that did not exist before, including for people who could not enter traditional employment due to disability, caregiving responsibilities, or geographic isolation. But without regulatory frameworks that protect workers while preserving flexibility, the gig economy risks becoming a system that transfers the insecurities of capitalism primarily onto those least equipped to absorb them.`,
    question: "What does the passage mean by \'a legal gap\' regarding gig workers in Jamaica?",
    options: [
      "There is no law allowing gig work in Jamaica.",
      "Gig workers are not required to register with the government.",
      "Jamaica\'s labour laws, designed for traditional employment, do not clearly protect gig workers — leaving a zone of legal uncertainty.",
      "Gig workers are exempt from Jamaica\'s minimum wage laws.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that Jamaica\'s labour laws \'were largely designed for traditional employment relationships and do not clearly protect gig workers\' — this is the legal gap."
  },
  {
    id: 9,
    type: "reading",
    question: "What does the author mean by \'transferring the insecurities of capitalism primarily onto those least equipped to absorb them\'?",
    options: [
      "The gig economy creates wealth for everyone equally.",
      "Capitalism is an unfair system that should be replaced.",
      "Without regulation, the gig economy places the greatest financial risk and instability on workers who have the fewest resources to manage it.",
      "The gig economy creates insecurity for technology companies.",
    ],
    correctAnswer: 2,
    explanation: "The phrase is an analytically precise critique: in unregulated gig work, the risks — unstable income, no benefits — fall on workers who typically have the least savings or safety net to manage those risks."
  },
  {
    id: 10,
    type: "reading",
    question: "What does the AUTHOR\'S TONE suggest about their position on the gig economy?",
    options: [
      "They believe the gig economy is a complete failure.",
      "They enthusiastically support the gig economy as a model for Jamaica\'s future.",
      "They take a balanced, analytical view — acknowledging benefits while warning that without regulation, the harm will fall on the most vulnerable.",
      "They are neutral and take no position on the gig economy.",
    ],
    correctAnswer: 2,
    explanation: "The passage acknowledges benefits (\'income opportunities that did not exist before\') but ends with a clear warning about unregulated risk falling on the most vulnerable. The author is balanced but ultimately cautionary."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"The mangoes came to every yard, SWELLING on branches.\" The word \'swelling\' means —",
    options: [
      "falling to the ground",
      "growing larger and rounder",
      "turning from green to yellow",
      "smelling sweet in the heat",
    ],
    correctAnswer: 1,
    explanation: "Swelling means growing larger — the mangoes expanding and ripening on the branches."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"This had BECOME simply a fact of the district, like the church bell.\" What does \'fact of the district\' mean?",
    options: [
      "Something recorded in official documents",
      "Something so established that it is accepted as natural and inevitable",
      "Something that happens only once a year",
      "Something that is written about in the local newspaper",
    ],
    correctAnswer: 1,
    explanation: "A \'fact of the district\' means something so established and expected that it is accepted as a natural, inevitable feature of the community — like the church bell."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"The \'gig economy\' is CHARACTERISED by short-term, flexible arrangements.\" The word \'characterised\' means —",
    options: [
      "criticised for its negative qualities",
      "defined or distinguished by particular features",
      "controlled and regulated by specific laws",
      "studied and documented by researchers",
    ],
    correctAnswer: 1,
    explanation: "Characterised means defined or distinguished by particular qualities — the gig economy is identified by flexibility, short-term work, and digital arrangements."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Income is often UNPREDICTABLE — surging during peak demand.\" The word \'unpredictable\' means —",
    options: [
      "reliably consistent from week to week",
      "impossible to forecast or know in advance",
      "lower than average wages",
      "subject to government taxation",
    ],
    correctAnswer: 1,
    explanation: "Unpredictable means impossible to reliably forecast — gig income can rise and fall without reliable pattern."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Workers bear all the RISK that in traditional employment would be shared.\" The word \'risk\' means —",
    options: [
      "the financial benefit of working independently",
      "the legal requirements of employment",
      "the possibility of negative outcomes or losses",
      "the hours required to complete a job",
    ],
    correctAnswer: 2,
    explanation: "Risk means the possibility of negative outcomes — in this context, the possibility of earning little, having no benefits, or losing income unexpectedly."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Court rulings have ESTABLISHED that some gig workers deserve basic protections.\" The word \'established\' means —",
    options: [
      "suggested informally",
      "officially decided and set as legal fact",
      "proposed for future consideration",
      "overturned and cancelled",
    ],
    correctAnswer: 1,
    explanation: "Established in this legal context means officially decided and set as fact through a court ruling — creating a legal precedent."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Including for people who could not enter TRADITIONAL employment.\" The word \'traditional\' means —",
    options: [
      "old-fashioned and outdated",
      "belonging to the established, conventional norm — standard nine-to-five work with an employer",
      "related to cultural practices",
      "recently introduced and modern",
    ],
    correctAnswer: 1,
    explanation: "Traditional employment refers to conventional employment arrangements — a fixed employer, regular hours, an employment contract, and accompanying benefits."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"I\'m KEEPING the tree.\" Miss Eunice uses \'keeping\' to mean —",
    options: [
      "locking it behind a gate to prevent access",
      "storing the fruit for winter",
      "tending, maintaining, and preserving the tree\'s health and life",
      "counting the number of mangoes it produces",
    ],
    correctAnswer: 2,
    explanation: "\'Keeping\' here means tending and maintaining — the same sense as \'keeping a promise\' or \'keeping watch.\' Miss Eunice is a steward of the tree, not just a consumer of its fruit."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Miss Eunice PERFUMING the hot air\" — wait, the passage says \'perfuming the hot air.\' The word \'perfuming\' means —",
    options: [
      "polluting with a strong chemical smell",
      "filling with a pleasant, sweet fragrance",
      "cooling with a gentle breeze",
      "covering with a thick cloud of pollen",
    ],
    correctAnswer: 1,
    explanation: "Perfuming means filling with a pleasant fragrance — the mangoes releasing their sweet scent into the air."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"A system that TRANSFERS the insecurities of capitalism onto workers.\" The word \'transfers\' means —",
    options: [
      "eliminates and removes entirely",
      "moves something from one place or party to another",
      "studies and documents carefully",
      "increases and intensifies",
    ],
    correctAnswer: 1,
    explanation: "Transfers means moves something from one party to another — in this context, the insecurities that were once shared between employers and employees are moved entirely onto workers."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The appeal of flexible work arrangements for many Jamaicans have been significant.",
      "The appeal of flexible work arrangements for many Jamaicans has been significant.",
      "The appeal of flexible work arrangements for many Jamaicans were significant.",
      "The appeal of flexible work arrangements for many Jamaicans are significant.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the appeal,\' which is singular. The correct verb is \'has been.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time the storm passed, three mango trees already fell.",
      "By the time the storm passed, three mango trees had already fallen.",
      "By the time the storm passed, three mango trees have already fallen.",
      "By the time the storm passed, three mango trees was already falling.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already fallen\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although gig work offers flexibility, it provides none of the security of traditional employment.\'",
    options: [
      "it provides none of the security of traditional employment",
      "Although gig work offers flexibility",
      "gig work offers flexibility",
      "none of the security of traditional employment",
    ],
    correctAnswer: 1,
    explanation: "\'Although gig work offers flexibility\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Gig workers face unpredictable income, no benefits, and they must bear all the employment risk.",
      "Gig workers face unpredictable income, no benefits, and full employment risk.",
      "Gig workers face unpredictable income, no benefits, and bearing all the employment risk.",
      "Gig workers face unpredictable income, to have no benefits, and full employment risk.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three noun phrases: unpredictable income, no benefits, and full employment risk."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Miss Eunice put a basket under the Julie mango tree each season.",
      "Javon asked Miss Eunice about the mangoes one evening in June.",
      "The three mango trees were taken by the storm that June.",
      "The storm took three mango trees in the district that June.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the three mango trees\' (subject) receives the action \'were taken.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The Julie mango tree, which was considered the finest in the village stood in Miss Eunice\'s yard.",
      "The Julie mango tree, which was considered the finest in the village, stood in Miss Eunice\'s yard.",
      "The Julie mango tree which was considered the finest in the village, stood in Miss Eunice\'s yard.",
      "The Julie mango tree which was considered the finest in the village stood in Miss Eunice\'s yard.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which was considered the finest in the village\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Miss Eunice said that she is not keeping the mangoes for eating.",
      "Miss Eunice said that she was not keeping the mangoes for eating.",
      "Miss Eunice said that she had not been keeping the mangoes for eating.",
      "Miss Eunice said that she will not be keeping the mangoes for eating.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, \'is not keeping\' (present continuous) shifts back to \'was not keeping\' (past continuous). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Fruiting heavily every June, the Julie mango tree drew neighbours from across the district.",
      "Standing under the tree in the evenings, Miss Eunice looked up at the ripening fruit.",
      "Designed for traditional employment, gig workers are not protected by Jamaica\'s labour laws.",
      "Working independently, the gig worker bears all the risks of employment.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'designed for traditional employment\' should describe Jamaica\'s labour laws, but the sentence\'s subject is \'gig workers\' — implying the workers were designed for traditional employment. The modifier is misplaced."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "The gig economy offers flexibility; but it removes employment security.",
      "The gig economy offers flexibility; however, it removes employment security.",
      "The gig economy offers flexibility; and this is why many workers prefer it.",
      "The gig economy; offers flexibility but removes employment security.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the workers in the gig economy have different challenges.",
      "Each of the workers in the gig economy has different challenges.",
      "Each of the workers in the gig economy are facing different challenges.",
      "Each of the workers in the gig economy have been facing different challenges.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The correct verb is \'has.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is vital that Jamaica creates a regulatory framework for gig workers.",
      "It is vital that Jamaica create a regulatory framework for gig workers.",
      "It is vital that Jamaica created a regulatory framework for gig workers.",
      "It is vital that Jamaica will create a regulatory framework for gig workers.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is vital that,\' the subjunctive requires the base form — \'create,\' not \'creates,\' \'created,\' or \'will create.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The gig economy offers flexibility income and freedom from formal employment.",
      "The gig economy offers flexibility, income, and freedom from formal employment.",
      "The gig economy offers flexibility, income and freedom from formal employment.",
      "The gig economy, offers flexibility, income, and freedom from formal employment.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica must create regulations to protect gig workers?",
    options: [
      "Many Jamaicans now work in the gig economy.",
      "Gig workers do not have access to the benefits that traditional employees receive.",
      "Without a regulatory framework that guarantees gig workers basic protections — fair payment, appeal processes, and freedom from arbitrary deactivation — Jamaica risks creating a two-tier labour market in which the most flexible workers are also the most exploited.",
      "Jamaica should follow the example of the United Kingdom in dealing with gig workers.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a specific, multi-part claim with concrete examples (\'fair payment, appeal processes, freedom from arbitrary deactivation\') and frames the stakes clearly — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "goverment",
      "govenment",
      "government",
      "governement",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is government — g-o-v-e-r-n-m-e-n-t. Note the \'n\' before \'ment.\'"
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Miss Eunice\'s mango tree was the finest in the village and she shared its fruit freely. Her generosity was an expression of how she understood the tree — as something to be kept, not merely consumed. The Jamaican flag was first raised on August 6, 1962. Javon began to understand this only after the storm.\'",
    options: [
      "Her generosity was an expression of how she understood the tree — as something to be kept, not merely consumed.",
      "The Jamaican flag was first raised on August 6, 1962.",
      "Javon began to understand this only after the storm.",
      "Miss Eunice\'s mango tree was the finest in the village and she shared its fruit freely.",
    ],
    correctAnswer: 1,
    explanation: "The paragraph is about Miss Eunice\'s approach to the mango tree and Javon\'s learning. The sentence about the Jamaican flag is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'The gig economy has good and bad sides.\'",
    options: [
      "The gig economy has both good sides and bad sides and it depends on the person.",
      "Like most economic systems, the gig economy has both advantages and disadvantages that affect different workers differently.",
      "The gig economy creates flexible income opportunities for workers who cannot enter traditional employment, while simultaneously placing unprotected workers at the mercy of platform decisions they have no power to contest.",
      "The gig economy is not all good and not all bad.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'unprotected workers,\' \'platform decisions\'), identifies both sides specifically, and frames them in a way that captures the structural tension — far superior to the vague original."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about gig work?",
    options: [
      "Gig work is bad but some people think it is good.",
      "While some say gig work gives people freedom, this is not always true.",
      "While the flexibility of gig work genuinely benefits those who cannot access traditional employment — including caregivers, people with disabilities, and those in remote areas — this benefit cannot justify the absence of basic protections against arbitrary income loss.",
      "The gig economy is flexible but workers need protection.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the genuine benefit (\'genuinely benefits those who cannot access traditional employment\') with specific examples, before presenting a clear, principled counter — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Miss Eunice was kind and shared her mangoes with everyone.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Miss Eunice was a very kind woman who always shared her mangoes with all her neighbours and friends.",
      "Miss Eunice shared her mangoes with everyone because she was a kind person.",
      "Every June, Miss Eunice left her gate unlocked and placed a basket under the Julie mango tree — a simple, quiet act of generosity that had become, over years, as much a part of the district as the church bell itself.",
      "Miss Eunice shared her mangoes and the neighbours appreciated her kindness.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses specific detail from the passage (unlocked gate, basket, Julie mango tree), echoes the passage\'s simile (\'church bell\'), and transforms a flat statement into a vivid, textually rooted description."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about stewardship and long-term care?",
    options: [
      "It is important to take care of the things you own.",
      "Miss Eunice looked after her mango tree for many years.",
      "The tree that survives the storm is rarely the one that gave the most fruit in the easiest season — it is the one that was tended when tending mattered, through the quiet years when no one was watching.",
      "Stewardship is important and people should practise it more often.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically rich, uses a contrast (\'most fruit in the easiest season\' vs \'tended when tending mattered\'), and ends with a resonant image (\'the quiet years when no one was watching\') — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes what makes EVIDENCE effective in a persuasive essay?",
    options: [
      "Effective evidence is any quotation from a famous person.",
      "Effective evidence is the longest and most detailed information available.",
      "Effective evidence is specific, relevant, and directly supports the claim being made — making it harder for a reader to dismiss the argument.",
      "Effective evidence is always a statistic from a scientific study.",
    ],
    correctAnswer: 2,
    explanation: "Effective evidence is specific (not vague), relevant (connected to the claim), and directly supportive — it makes the argument concrete and harder to reject. Option C correctly identifies these qualities."
  }
]

export default function LiteracyMixed9MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed9Questions : literacyMixed9Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 9</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 9</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 9 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 9</h1>
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
