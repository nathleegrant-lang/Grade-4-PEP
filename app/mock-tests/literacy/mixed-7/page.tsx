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

const literacyMixed7Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Painter's Studio

Miss Tanya's studio was the smallest room in the house, but it contained what seemed to Nia like the whole world in miniature. Canvases leaned against every wall. Brushes stood in glass jars like strange tropical flowers. The air smelled of turpentine and something sweeter that Nia could never identify.

Miss Tanya had been painting for fifty years, and she painted the same thing: Jamaica. Not tourist-Jamaica — not the beaches and the sunsets — but the Jamaica of market stalls piled high with dasheen and cho-cho, of women balancing baskets on their heads, of zinc fences and breadfruit trees and the particular quality of afternoon light on red-dirt roads.

One Saturday, Nia asked Miss Tanya why she never painted anything else.

"Because I have not finished seeing it yet," Miss Tanya said, turning a small brush slowly in her fingers. "Each time I look, there is something I missed before."

Nia looked at a painting on the wall — a woman walking up a hill with a load on her head, light breaking through the trees at an angle. She had passed scenes like it a hundred times without stopping.

She did not say anything to Miss Tanya. But on her way home, she stopped three times.`,
    question: "What makes Miss Tanya\'s studio seem to contain \'the whole world in miniature\'?",
    options: [
      "It is a very large room with many windows.",
      "It holds canvases, brushes, and art materials — the tools of a world she has spent fifty years capturing.",
      "Miss Tanya travels the world and brings back objects from every country.",
      "The studio contains a miniature model of Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "The studio\'s contents — canvases, brushes, the smell of art materials — represent the whole world of Miss Tanya\'s artistic practice, which is itself a representation of Jamaica."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Painter's Studio

Miss Tanya's studio was the smallest room in the house, but it contained what seemed to Nia like the whole world in miniature. Canvases leaned against every wall. Brushes stood in glass jars like strange tropical flowers. The air smelled of turpentine and something sweeter that Nia could never identify.

Miss Tanya had been painting for fifty years, and she painted the same thing: Jamaica. Not tourist-Jamaica — not the beaches and the sunsets — but the Jamaica of market stalls piled high with dasheen and cho-cho, of women balancing baskets on their heads, of zinc fences and breadfruit trees and the particular quality of afternoon light on red-dirt roads.

One Saturday, Nia asked Miss Tanya why she never painted anything else.

"Because I have not finished seeing it yet," Miss Tanya said, turning a small brush slowly in her fingers. "Each time I look, there is something I missed before."

Nia looked at a painting on the wall — a woman walking up a hill with a load on her head, light breaking through the trees at an angle. She had passed scenes like it a hundred times without stopping.

She did not say anything to Miss Tanya. But on her way home, she stopped three times.`,
    question: "What kind of Jamaica does Miss Tanya paint, and why is this significant?",
    options: [
      "She paints tourist Jamaica — beaches, sunsets, and luxury resorts.",
      "She paints the everyday, working Jamaica of markets, ordinary people, and real landscapes — the Jamaica often overlooked.",
      "She only paints portraits of famous Jamaicans.",
      "She paints imaginary scenes from Jamaican history.",
    ],
    correctAnswer: 1,
    explanation: "The passage contrasts \'tourist-Jamaica\' with Miss Tanya\'s subject: \'market stalls, women balancing baskets, zinc fences, red-dirt roads.\' She records ordinary Jamaican life, not the version packaged for visitors."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Painter's Studio

Miss Tanya's studio was the smallest room in the house, but it contained what seemed to Nia like the whole world in miniature. Canvases leaned against every wall. Brushes stood in glass jars like strange tropical flowers. The air smelled of turpentine and something sweeter that Nia could never identify.

Miss Tanya had been painting for fifty years, and she painted the same thing: Jamaica. Not tourist-Jamaica — not the beaches and the sunsets — but the Jamaica of market stalls piled high with dasheen and cho-cho, of women balancing baskets on their heads, of zinc fences and breadfruit trees and the particular quality of afternoon light on red-dirt roads.

One Saturday, Nia asked Miss Tanya why she never painted anything else.

"Because I have not finished seeing it yet," Miss Tanya said, turning a small brush slowly in her fingers. "Each time I look, there is something I missed before."

Nia looked at a painting on the wall — a woman walking up a hill with a load on her head, light breaking through the trees at an angle. She had passed scenes like it a hundred times without stopping.

She did not say anything to Miss Tanya. But on her way home, she stopped three times.`,
    question: "What does Miss Tanya mean when she says \'I have not finished seeing it yet\'?",
    options: [
      "She has run out of canvases and cannot paint any more.",
      "She plans to travel to other parts of Jamaica she has not visited.",
      "Jamaica continues to reveal new details to her careful attention — it is inexhaustible as a subject.",
      "She thinks Jamaica is not beautiful enough to paint.",
    ],
    correctAnswer: 2,
    explanation: "Miss Tanya\'s reply suggests that Jamaica — ordinary, everyday Jamaica — is infinitely rich and that each look reveals something new. Her subject is inexhaustible because attention always finds more."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Painter's Studio

Miss Tanya's studio was the smallest room in the house, but it contained what seemed to Nia like the whole world in miniature. Canvases leaned against every wall. Brushes stood in glass jars like strange tropical flowers. The air smelled of turpentine and something sweeter that Nia could never identify.

Miss Tanya had been painting for fifty years, and she painted the same thing: Jamaica. Not tourist-Jamaica — not the beaches and the sunsets — but the Jamaica of market stalls piled high with dasheen and cho-cho, of women balancing baskets on their heads, of zinc fences and breadfruit trees and the particular quality of afternoon light on red-dirt roads.

One Saturday, Nia asked Miss Tanya why she never painted anything else.

"Because I have not finished seeing it yet," Miss Tanya said, turning a small brush slowly in her fingers. "Each time I look, there is something I missed before."

Nia looked at a painting on the wall — a woman walking up a hill with a load on her head, light breaking through the trees at an angle. She had passed scenes like it a hundred times without stopping.

She did not say anything to Miss Tanya. But on her way home, she stopped three times.`,
    question: "What change happens in Nia at the end of the passage?",
    options: [
      "She decides to become a painter like Miss Tanya.",
      "She buys one of Miss Tanya\'s paintings to hang at home.",
      "She begins to see the world around her more attentively — stopping three times on her way home.",
      "She realises she prefers photography to painting.",
    ],
    correctAnswer: 2,
    explanation: "Nia says nothing to Miss Tanya, but her actions speak: she stops three times on the way home. The visit has changed the way she observes the world."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the studio passage?",
    options: [
      "Excited and fast-paced",
      "Quiet, attentive, and gently inspiring",
      "Sad and regretful",
      "Critical of Jamaica\'s art scene",
    ],
    correctAnswer: 1,
    explanation: "The passage is written with quiet care — describing the studio\'s details, Miss Tanya\'s craft, and Nia\'s gradual transformation. The tone is quiet, attentive, and gently inspiring."
  },
  {
    id: 6,
    type: "reading",
    passage: `Water Scarcity in Jamaica: A Hidden Crisis

Jamaica is a tropical island surrounded by water, yet water scarcity is an increasingly serious problem for communities across the island. This apparent paradox — an island nation struggling with water supply — has its roots in geography, infrastructure, governance, and the growing impacts of climate change.

Jamaica receives significant rainfall, but this rainfall is unevenly distributed. The eastern and northern slopes of the Blue Mountains receive abundant rain, while parts of the south and west — including areas of St. Elizabeth and Clarendon — experience prolonged dry spells. This uneven distribution means that agricultural communities in drier areas are particularly vulnerable to drought.

Beyond geography, Jamaica's water distribution infrastructure is aging and in need of significant investment. Leaking pipes waste millions of gallons of treated water daily, before it ever reaches a tap. Many rural communities still rely on water trucks — an expensive, unreliable, and environmentally costly solution. The National Water Commission estimates that non-revenue water loss — water produced but never sold because of leaks and theft — accounts for a significant proportion of total output.

Climate change is compounding these existing problems. More intense drought periods, unpredictable rainfall patterns, and the degradation of watershed forests are reducing the reliability of water sources that communities have depended on for generations. Without significant investment in infrastructure, watershed protection, and demand management, Jamaica's water insecurity will deepen in the decades ahead.`,
    question: "What is the CENTRAL PARADOX described in the water scarcity passage?",
    options: [
      "Jamaica has too much rainfall to manage its water supply.",
      "Jamaica is a tropical island surrounded by ocean yet faces serious water scarcity problems.",
      "The National Water Commission has too many employees.",
      "Water is cheaper in Jamaica than in most other countries.",
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly calls this \'an apparent paradox — an island nation struggling with water supply\' — surrounded by water yet facing scarcity."
  },
  {
    id: 7,
    type: "reading",
    passage: `Water Scarcity in Jamaica: A Hidden Crisis

Jamaica is a tropical island surrounded by water, yet water scarcity is an increasingly serious problem for communities across the island. This apparent paradox — an island nation struggling with water supply — has its roots in geography, infrastructure, governance, and the growing impacts of climate change.

Jamaica receives significant rainfall, but this rainfall is unevenly distributed. The eastern and northern slopes of the Blue Mountains receive abundant rain, while parts of the south and west — including areas of St. Elizabeth and Clarendon — experience prolonged dry spells. This uneven distribution means that agricultural communities in drier areas are particularly vulnerable to drought.

Beyond geography, Jamaica's water distribution infrastructure is aging and in need of significant investment. Leaking pipes waste millions of gallons of treated water daily, before it ever reaches a tap. Many rural communities still rely on water trucks — an expensive, unreliable, and environmentally costly solution. The National Water Commission estimates that non-revenue water loss — water produced but never sold because of leaks and theft — accounts for a significant proportion of total output.

Climate change is compounding these existing problems. More intense drought periods, unpredictable rainfall patterns, and the degradation of watershed forests are reducing the reliability of water sources that communities have depended on for generations. Without significant investment in infrastructure, watershed protection, and demand management, Jamaica's water insecurity will deepen in the decades ahead.`,
    question: "What does \'non-revenue water loss\' mean in the passage?",
    options: [
      "Water that is sold at a profit by the National Water Commission.",
      "Rainfall that is collected but never treated.",
      "Water that is produced and treated but never sold, due to leaks and theft.",
      "Water purchased from international suppliers.",
    ],
    correctAnswer: 2,
    explanation: "The passage defines it explicitly: \'water produced but never sold because of leaks and theft.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Water Scarcity in Jamaica: A Hidden Crisis

Jamaica is a tropical island surrounded by water, yet water scarcity is an increasingly serious problem for communities across the island. This apparent paradox — an island nation struggling with water supply — has its roots in geography, infrastructure, governance, and the growing impacts of climate change.

Jamaica receives significant rainfall, but this rainfall is unevenly distributed. The eastern and northern slopes of the Blue Mountains receive abundant rain, while parts of the south and west — including areas of St. Elizabeth and Clarendon — experience prolonged dry spells. This uneven distribution means that agricultural communities in drier areas are particularly vulnerable to drought.

Beyond geography, Jamaica's water distribution infrastructure is aging and in need of significant investment. Leaking pipes waste millions of gallons of treated water daily, before it ever reaches a tap. Many rural communities still rely on water trucks — an expensive, unreliable, and environmentally costly solution. The National Water Commission estimates that non-revenue water loss — water produced but never sold because of leaks and theft — accounts for a significant proportion of total output.

Climate change is compounding these existing problems. More intense drought periods, unpredictable rainfall patterns, and the degradation of watershed forests are reducing the reliability of water sources that communities have depended on for generations. Without significant investment in infrastructure, watershed protection, and demand management, Jamaica's water insecurity will deepen in the decades ahead.`,
    question: "Which areas of Jamaica are MOST vulnerable to drought, according to the passage?",
    options: [
      "The eastern and northern slopes of the Blue Mountains.",
      "Coastal areas near Kingston Harbour.",
      "Agricultural communities in the drier south and west — including St. Elizabeth and Clarendon.",
      "Urban areas with the highest population density.",
    ],
    correctAnswer: 2,
    explanation: "The passage states that \'parts of the south and west — including areas of St. Elizabeth and Clarendon — experience prolonged dry spells,\' making agricultural communities there \'particularly vulnerable.\'"
  },
  {
    id: 9,
    type: "reading",
    question: "How is climate change making Jamaica\'s water problem WORSE?",
    options: [
      "It is causing flooding in areas that previously had good water supply.",
      "It is making more intense droughts, unpredictable rainfall, and degrading watershed forests.",
      "It is reducing the amount of rainfall across the entire island.",
      "It is causing sea levels to rise and contaminate underground water.",
    ],
    correctAnswer: 1,
    explanation: "The passage lists three climate change effects: more intense drought periods, unpredictable rainfall patterns, and degradation of watershed forests."
  },
  {
    id: 10,
    type: "reading",
    question: "What is the AUTHOR\'S MAIN PURPOSE in writing the water scarcity passage?",
    options: [
      "To criticise the National Water Commission for poor management.",
      "To inform readers about the causes of Jamaica\'s water scarcity and warn of deepening problems without investment.",
      "To persuade readers to use less water at home.",
      "To compare Jamaica\'s water supply with other Caribbean nations.",
    ],
    correctAnswer: 1,
    explanation: "The passage explains causes (geography, infrastructure, climate), describes the current situation, and ends with a warning about the future — primarily informative with an urgent, cautionary tone."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Brushes stood in glass jars like STRANGE TROPICAL FLOWERS.\" This is an example of —",
    options: [
      "a metaphor comparing brushes directly to flowers",
      "personification giving brushes human qualities",
      "a simile comparing the brushes to flowers using \'like\'",
      "alliteration creating a rhythmic sound",
    ],
    correctAnswer: 2,
    explanation: "A simile makes a comparison using \'like\' or \'as.\' The brushes are compared to tropical flowers using the word \'like.\'"
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The rainfall is UNEVENLY DISTRIBUTED.\" The word \'distributed\' means —",
    options: [
      "collected and stored for later use",
      "measured and recorded scientifically",
      "spread or divided among different areas",
      "sold to communities for a fee",
    ],
    correctAnswer: 2,
    explanation: "Distributed means spread out or divided among areas or people. Rainfall that is unevenly distributed falls in large amounts in some places and little in others."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Leaking pipes WASTE millions of gallons of treated water daily.\" The word \'waste\' means —",
    options: [
      "to purify and clean for use",
      "to lose through carelessness or inefficiency",
      "to measure and record precisely",
      "to store for emergency use",
    ],
    correctAnswer: 1,
    explanation: "To waste means to use or lose something carelessly and inefficiently — the leaking pipes allow treated water to escape before reaching its destination."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Many rural communities rely on water trucks — an EXPENSIVE, UNRELIABLE solution.\" The word \'unreliable\' means —",
    options: [
      "very affordable and widely available",
      "consistent and dependable",
      "not consistently dependable or trustworthy",
      "recently introduced and untested",
    ],
    correctAnswer: 2,
    explanation: "Unreliable means not consistently dependable — water trucks that cannot be counted on to deliver water at the right time and in the right quantities."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Miss Tanya IDENTIFIED the sweeter smell but Nia could not.\" Wait — re-reading: \'something sweeter that Nia could never identify.\' The word \'identify\' means —",
    options: [
      "to paint or draw",
      "to name, recognise, or determine what something is",
      "to smell very strongly",
      "to find and remove",
    ],
    correctAnswer: 1,
    explanation: "To identify means to recognise and name what something is. Nia could not determine what the sweet smell was."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"Climate change is COMPOUNDING these existing problems.\" The word \'compounding\' means —",
    options: [
      "reducing and solving",
      "making more complicated or serious by adding to existing difficulties",
      "studying and documenting",
      "replacing with newer problems",
    ],
    correctAnswer: 1,
    explanation: "To compound problems means to make them worse or more serious by adding new factors on top of existing ones."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Watershed forests are DEGRADING.\" The word \'degrading\' means —",
    options: [
      "growing larger and stronger",
      "deteriorating in quality or condition",
      "being protected by government law",
      "being replanted by conservation groups",
    ],
    correctAnswer: 1,
    explanation: "Degrading means deteriorating — becoming worse in quality or condition. Watershed forests that are degrading are being damaged and are losing their ability to regulate water supply."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Each time I look, there is something I MISSED before.\" What does this reveal about Miss Tanya?",
    options: [
      "She has a poor memory and often forgets what she has seen.",
      "She paints so many things that she cannot keep track of them all.",
      "She approaches her subject with the belief that careful attention always reveals more than a previous look.",
      "She is disappointed with her paintings and always sees flaws.",
    ],
    correctAnswer: 2,
    explanation: "Miss Tanya\'s statement reflects an attitude of deep, humble attention — the belief that her subject is richer than any single look can capture, so she keeps returning."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The PARTICULAR QUALITY of afternoon light on red-dirt roads.\" What does \'particular\' mean here?",
    options: [
      "strange and unusual",
      "especially significant and specific",
      "general and widespread",
      "bright and colourful",
    ],
    correctAnswer: 1,
    explanation: "Particular here means specific and distinct — the exact, distinctive quality of afternoon light that Miss Tanya captures in her paintings."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"Jamaica\'s water INSECURITY will deepen in the decades ahead.\" The word \'insecurity\' means —",
    options: [
      "a feeling of personal worry or anxiety",
      "a lack of safety or reliable supply",
      "the absence of government investment",
      "a crisis caused by too much rainfall",
    ],
    correctAnswer: 1,
    explanation: "Insecurity means a lack of reliable supply or safety — water insecurity refers to the unreliable availability of water for communities."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The causes of water scarcity in Jamaica is complex and varied.",
      "The causes of water scarcity in Jamaica are complex and varied.",
      "The causes of water scarcity in Jamaica was complex and varied.",
      "The causes of water scarcity in Jamaica has been complex and varied.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'causes,\' which is plural. The correct verb is \'are.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Nia left the studio, she already understood what Miss Tanya meant.",
      "By the time Nia left the studio, she had already understood what Miss Tanya meant.",
      "By the time Nia left the studio, she has already understood what Miss Tanya meant.",
      "By the time Nia left the studio, she was already understanding what Miss Tanya meant.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already understood\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although Jamaica receives significant rainfall, water scarcity remains a serious problem.\'",
    options: [
      "water scarcity remains a serious problem",
      "Although Jamaica receives significant rainfall",
      "Jamaica receives significant rainfall",
      "remains a serious problem",
    ],
    correctAnswer: 1,
    explanation: "\'Although Jamaica receives significant rainfall\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Miss Tanya painted markets, she also painted women, and the light on roads was her subject too.",
      "Miss Tanya painted markets, women, and the light on red-dirt roads.",
      "Miss Tanya painted markets and women and also the light on the roads.",
      "Miss Tanya painted markets, the women she saw, and light on roads.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same grammatical form. Option B uses three noun phrases: markets, women, and the light on red-dirt roads."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Miss Tanya painted Jamaican market scenes for fifty years.",
      "Nia visited the studio every Saturday morning.",
      "The paintings were created by Miss Tanya over fifty years.",
      "Nia stopped three times on her way home from the studio.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the paintings\' (subject) receives the action \'were created.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Water distribution infrastructure, which is aging and inadequate needs significant investment.",
      "Water distribution infrastructure, which is aging and inadequate, needs significant investment.",
      "Water distribution infrastructure which is aging and inadequate, needs significant investment.",
      "Water distribution infrastructure which is aging and inadequate needs significant investment.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which is aging and inadequate\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Miss Tanya said that she has not finished seeing Jamaica yet.",
      "Miss Tanya said that she had not finished seeing Jamaica yet.",
      "Miss Tanya said that she have not finished seeing Jamaica yet.",
      "Miss Tanya said that she will not finish seeing Jamaica yet.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, \'have not finished\' (present perfect) shifts back to \'had not finished\' (past perfect). Option B is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Leaning against every wall, the canvases filled Miss Tanya\'s small studio.",
      "Standing in glass jars, the brushes looked like strange tropical flowers.",
      "Painted with extraordinary care, Nia studied the canvas of the woman on the hill.",
      "Turning a small brush slowly in her fingers, Miss Tanya considered her answer.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'painted with extraordinary care\' should describe the canvas, but the sentence\'s subject is \'Nia\' — implying Nia was painted with extraordinary care. The modifier is misplaced."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Jamaica receives significant rainfall; but water scarcity is still a problem.",
      "Jamaica receives significant rainfall; however, water scarcity is still a problem.",
      "Jamaica receives significant rainfall; and water distribution remains a challenge.",
      "Jamaica receives significant rainfall; water scarcity, still a problem.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the paintings on Miss Tanya\'s walls show a different aspect of Jamaica.",
      "Each of the paintings on Miss Tanya\'s walls shows a different aspect of Jamaica.",
      "Each of the paintings on Miss Tanya\'s walls have shown a different aspect of Jamaica.",
      "Each of the paintings on Miss Tanya\'s walls are showing a different aspect of Jamaica.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The correct verb is \'shows.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is critical that the government invests in aging water infrastructure.",
      "It is critical that the government invest in aging water infrastructure.",
      "It is critical that the government invested in aging water infrastructure.",
      "It is critical that the government will invest in aging water infrastructure.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is critical that,\' the subjunctive requires the base form — \'invest,\' not \'invests,\' \'invested,\' or \'will invest.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The studio contained canvases brushes jars and the smell of turpentine.",
      "The studio contained canvases, brushes, jars, and the smell of turpentine.",
      "The studio contained canvases, brushes jars and the smell of turpentine.",
      "The studio contained, canvases, brushes, jars and the smell of turpentine.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that Jamaica must invest urgently in water infrastructure?",
    options: [
      "Jamaica has a problem with its water pipes.",
      "Some communities in Jamaica rely on water trucks.",
      "Every day that Jamaica delays investment in its aging water infrastructure, millions of gallons of treated water are lost to leaks — a waste the island\'s increasingly water-stressed communities can no longer afford.",
      "Water is important for communities across Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C leads with a specific consequence (\'millions of gallons lost daily\'), uses precise vocabulary (\'water-stressed\'), and creates urgency — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "accomodation",
      "accomadation",
      "accommodation",
      "acommodation",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is accommodation — a-c-c-o-m-m-o-d-a-t-i-o-n. Double \'c\' and double \'m.\'"
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Miss Tanya\'s paintings document the everyday Jamaica that tourism often overlooks. Her subjects include market women, breadfruit trees, and the quality of light on country roads. Blue Mountain Coffee is among the most expensive coffees in the world. Her work argues, through image rather than word, that ordinary life deserves our most careful attention.\'",
    options: [
      "Her subjects include market women, breadfruit trees, and the quality of light on country roads.",
      "Her work argues, through image rather than word, that ordinary life deserves our most careful attention.",
      "Blue Mountain Coffee is among the most expensive coffees in the world.",
      "Miss Tanya\'s paintings document the everyday Jamaica that tourism often overlooks.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Miss Tanya\'s paintings and their subject matter. The sentence about Blue Mountain Coffee is irrelevant and off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Water scarcity is a problem in Jamaica.\'",
    options: [
      "Water scarcity is a very big and serious problem in Jamaica today.",
      "In Jamaica, water scarcity — driven by aging infrastructure, uneven rainfall distribution, and intensifying climate pressures — threatens the livelihoods of agricultural communities and the basic daily needs of thousands of households.",
      "Jamaica has a water problem and it affects many people.",
      "Water scarcity is a serious problem that affects Jamaica\'s people.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise causes (\'aging infrastructure,\' \'uneven rainfall,\' \'climate pressures\'), identifies who is affected (\'agricultural communities,\' \'households\'), and transforms a vague claim into an analytically rich statement."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in a discussion of water policy?",
    options: [
      "Some people think Jamaica\'s water problem is not serious, but they are wrong.",
      "Water scarcity is a problem but the government is working on it.",
      "While water truck delivery provides an immediate solution for communities without piped supply, it is expensive, environmentally costly, and treats the symptom rather than the underlying infrastructure failure.",
      "Water trucks are used in Jamaica but they are not always reliable.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the function of water trucks (\'provides an immediate solution\') before demonstrating their limitations with specific, precise language — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Miss Tanya paints Jamaica and her paintings are good.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Miss Tanya paints Jamaica and all her paintings are very good and beautiful.",
      "Miss Tanya\'s paintings of Jamaica are good and show many different things.",
      "For fifty years, Miss Tanya has painted not the Jamaica of brochures, but the Jamaica of markets and dust and afternoon light — insisting, canvas by canvas, that ordinary life is the worthiest subject of all.",
      "Miss Tanya is a Jamaican painter who paints Jamaica and is very good at it.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise contrasting detail (\'not the Jamaica of brochures, but the Jamaica of markets and dust\'), the passage\'s imagery (\'afternoon light\'), and a powerful closing claim — transforming a flat statement into a rich one."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of paying attention to ordinary life?",
    options: [
      "Ordinary life is important and worth paying attention to.",
      "Many artists paint everyday scenes and they are well respected.",
      "To look carefully at the ordinary is not to settle for less — it is to discover that the everyday world, when given proper attention, turns out to be inexhaustible.",
      "People should try to notice the things around them more often.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a philosophical argument (\'to look carefully is not to settle for less\'), builds to a resonant insight (\'the everyday world is inexhaustible\'), and ends with a memorable, precise claim — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes what makes a PARAGRAPH COHERENT?",
    options: [
      "It contains at least five sentences on different topics.",
      "All sentences in the paragraph relate to and develop the same central idea, with clear connections between them.",
      "It begins with a question and ends with an answer.",
      "It uses as many adjectives and adverbs as possible.",
    ],
    correctAnswer: 1,
    explanation: "Coherence means all sentences are logically connected and develop the same central idea. A coherent paragraph stays focused and guides the reader clearly from one idea to the next."
  }
]

export default function LiteracyMixed7MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed7Questions : literacyMixed7Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 7</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 7</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 7 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 7</h1>
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
