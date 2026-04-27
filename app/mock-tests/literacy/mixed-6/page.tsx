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

const literacyMixed6Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The River and the Road

The road and the river ran side by side for seven miles through the parish of Portland. The river was older, wider, and louder. The road, built only forty years ago, ran straighter and arrived at the town in half the time. For most people, the road had long since replaced the river as the way from the hills to the market.

But old Mr. Vernon still went by river on Saturdays. He had a small wooden canoe that he kept under a silk cotton tree at the water's edge. He said the river took him through the part of Portland that the road did not know existed: the part where the trees grew into the water, where kingfishers sat on low branches, where the current made a sound he could only describe as "the river talking."

His nephew Callum came to visit one August and spent a Saturday morning in the canoe. Callum was eighteen and had never been in a canoe before. At first he gripped the sides and said nothing. Then, after about twenty minutes, he put his hands in the water and let it run through his fingers.

"You could have told me about this," he said to his uncle.

Mr. Vernon kept paddling. "You wouldn't have believed me," he said.`,
    question: "Why did most people stop using the river to travel?",
    options: [
      "The river became too dangerous after storms.",
      "The road was built and reached town faster.",
      "The government closed the river to boats.",
      "The river dried up during the dry season.",
    ],
    correctAnswer: 1,
    explanation: "The passage states the road \'arrived at the town in half the time\' and \'had long since replaced the river\' for most people."
  },
  {
    id: 2,
    type: "reading",
    passage: `The River and the Road

The road and the river ran side by side for seven miles through the parish of Portland. The river was older, wider, and louder. The road, built only forty years ago, ran straighter and arrived at the town in half the time. For most people, the road had long since replaced the river as the way from the hills to the market.

But old Mr. Vernon still went by river on Saturdays. He had a small wooden canoe that he kept under a silk cotton tree at the water's edge. He said the river took him through the part of Portland that the road did not know existed: the part where the trees grew into the water, where kingfishers sat on low branches, where the current made a sound he could only describe as "the river talking."

His nephew Callum came to visit one August and spent a Saturday morning in the canoe. Callum was eighteen and had never been in a canoe before. At first he gripped the sides and said nothing. Then, after about twenty minutes, he put his hands in the water and let it run through his fingers.

"You could have told me about this," he said to his uncle.

Mr. Vernon kept paddling. "You wouldn't have believed me," he said.`,
    question: "What does Mr. Vernon mean when he says the river makes \'the river talking\'?",
    options: [
      "The river makes a sound that Mr. Vernon has given a poetic name — suggesting the current has a living quality.",
      "Mr. Vernon believes the river is actually speaking to him.",
      "The river makes no sound and Mr. Vernon is confused.",
      "Local people hold meetings beside the river every Saturday.",
    ],
    correctAnswer: 0,
    explanation: "\'The river talking\' is Mr. Vernon\'s poetic description of the sound the current makes — he gives the natural sound a human quality, personifying the river."
  },
  {
    id: 3,
    type: "reading",
    passage: `The River and the Road

The road and the river ran side by side for seven miles through the parish of Portland. The river was older, wider, and louder. The road, built only forty years ago, ran straighter and arrived at the town in half the time. For most people, the road had long since replaced the river as the way from the hills to the market.

But old Mr. Vernon still went by river on Saturdays. He had a small wooden canoe that he kept under a silk cotton tree at the water's edge. He said the river took him through the part of Portland that the road did not know existed: the part where the trees grew into the water, where kingfishers sat on low branches, where the current made a sound he could only describe as "the river talking."

His nephew Callum came to visit one August and spent a Saturday morning in the canoe. Callum was eighteen and had never been in a canoe before. At first he gripped the sides and said nothing. Then, after about twenty minutes, he put his hands in the water and let it run through his fingers.

"You could have told me about this," he said to his uncle.

Mr. Vernon kept paddling. "You wouldn't have believed me," he said.`,
    question: "What does Callum\'s action of putting his hands in the water suggest?",
    options: [
      "He is testing whether the water is safe to drink.",
      "He has overcome his initial nervousness and begun to experience the river directly and openly.",
      "He is trying to slow the canoe down.",
      "He wants to catch a fish with his hands.",
    ],
    correctAnswer: 1,
    explanation: "Callum begins by gripping the sides in fear. Putting his hands in the water — letting it run through his fingers — is a sign he has relaxed and opened himself to the experience."
  },
  {
    id: 4,
    type: "reading",
    passage: `The River and the Road

The road and the river ran side by side for seven miles through the parish of Portland. The river was older, wider, and louder. The road, built only forty years ago, ran straighter and arrived at the town in half the time. For most people, the road had long since replaced the river as the way from the hills to the market.

But old Mr. Vernon still went by river on Saturdays. He had a small wooden canoe that he kept under a silk cotton tree at the water's edge. He said the river took him through the part of Portland that the road did not know existed: the part where the trees grew into the water, where kingfishers sat on low branches, where the current made a sound he could only describe as "the river talking."

His nephew Callum came to visit one August and spent a Saturday morning in the canoe. Callum was eighteen and had never been in a canoe before. At first he gripped the sides and said nothing. Then, after about twenty minutes, he put his hands in the water and let it run through his fingers.

"You could have told me about this," he said to his uncle.

Mr. Vernon kept paddling. "You wouldn't have believed me," he said.`,
    question: "What does Mr. Vernon mean when he says \'You wouldn\'t have believed me\'?",
    options: [
      "He thinks Callum is dishonest and untrustworthy.",
      "Some experiences cannot be communicated with words — they must be lived to be understood.",
      "Mr. Vernon did not want to invite Callum on the river.",
      "Callum had previously refused to visit his uncle.",
    ],
    correctAnswer: 1,
    explanation: "Mr. Vernon\'s reply suggests that describing the river journey would not have conveyed its reality. The experience had to be lived — words alone could not transmit it."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the river passage?",
    options: [
      "Tense and alarming",
      "Quiet, reflective, and gently wondrous",
      "Comic and playful",
      "Sad and mournful",
    ],
    correctAnswer: 1,
    explanation: "The passage is written with quiet attention to the beauty of the river journey and the relationship between uncle and nephew. The tone is reflective and gently full of wonder."
  },
  {
    id: 6,
    type: "reading",
    passage: `Tourism in Jamaica: Balancing Benefit and Cost

Tourism is one of Jamaica's most important economic sectors, generating billions of dollars in revenue and employing hundreds of thousands of Jamaicans directly and indirectly. Visitors come from around the world to experience the island's beaches, culture, cuisine, and natural beauty. Without this industry, many communities would face severe economic hardship.

Yet tourism is not without its costs. Critics point to the concentration of tourist development in resort enclaves — areas where international visitors live largely separate from the Jamaican population, with profits flowing to foreign-owned hotel chains rather than local businesses. Environmental concerns are also significant: coral reef damage from boat traffic and sunscreen chemicals, pressure on coastal ecosystems, and increased waste generation in areas with limited disposal infrastructure.

There is growing support for a model of tourism that directs more benefits to local communities — what is often called community-based tourism. This approach invites visitors to stay in local guesthouses, eat at family-run restaurants, participate in cultural experiences hosted by community members, and spend their money in ways that circulate within the local economy.

The challenge is that community-based tourism requires significant investment in training, quality standards, and marketing before it can compete with the convenience and comfort of large resorts. But for a country whose culture and natural environment are its greatest assets, finding ways to share those assets equitably may be the most sustainable path forward.`,
    question: "What is the MAIN IDEA of the tourism passage?",
    options: [
      "Jamaica should stop building large resort hotels immediately.",
      "Tourism brings significant economic benefits to Jamaica but also carries real costs, and community-based models offer a more equitable path forward.",
      "Foreign-owned hotels are better for Jamaica than local guesthouses.",
      "Most Jamaicans do not benefit from tourism at all.",
    ],
    correctAnswer: 1,
    explanation: "The passage covers both the benefits and costs of tourism, then proposes community-based tourism as a more equitable alternative. Option B captures this arc."
  },
  {
    id: 7,
    type: "reading",
    passage: `Tourism in Jamaica: Balancing Benefit and Cost

Tourism is one of Jamaica's most important economic sectors, generating billions of dollars in revenue and employing hundreds of thousands of Jamaicans directly and indirectly. Visitors come from around the world to experience the island's beaches, culture, cuisine, and natural beauty. Without this industry, many communities would face severe economic hardship.

Yet tourism is not without its costs. Critics point to the concentration of tourist development in resort enclaves — areas where international visitors live largely separate from the Jamaican population, with profits flowing to foreign-owned hotel chains rather than local businesses. Environmental concerns are also significant: coral reef damage from boat traffic and sunscreen chemicals, pressure on coastal ecosystems, and increased waste generation in areas with limited disposal infrastructure.

There is growing support for a model of tourism that directs more benefits to local communities — what is often called community-based tourism. This approach invites visitors to stay in local guesthouses, eat at family-run restaurants, participate in cultural experiences hosted by community members, and spend their money in ways that circulate within the local economy.

The challenge is that community-based tourism requires significant investment in training, quality standards, and marketing before it can compete with the convenience and comfort of large resorts. But for a country whose culture and natural environment are its greatest assets, finding ways to share those assets equitably may be the most sustainable path forward.`,
    question: "What is a \'resort enclave\' as described in the passage?",
    options: [
      "A small local restaurant that caters to tourists",
      "A government programme to develop coastal areas",
      "A tourist development where visitors live largely separately from the local population",
      "A community-based tourism initiative",
    ],
    correctAnswer: 2,
    explanation: "The passage describes resort enclaves as areas where \'international visitors live largely separate from the Jamaican population.\'"
  },
  {
    id: 8,
    type: "reading",
    passage: `Tourism in Jamaica: Balancing Benefit and Cost

Tourism is one of Jamaica's most important economic sectors, generating billions of dollars in revenue and employing hundreds of thousands of Jamaicans directly and indirectly. Visitors come from around the world to experience the island's beaches, culture, cuisine, and natural beauty. Without this industry, many communities would face severe economic hardship.

Yet tourism is not without its costs. Critics point to the concentration of tourist development in resort enclaves — areas where international visitors live largely separate from the Jamaican population, with profits flowing to foreign-owned hotel chains rather than local businesses. Environmental concerns are also significant: coral reef damage from boat traffic and sunscreen chemicals, pressure on coastal ecosystems, and increased waste generation in areas with limited disposal infrastructure.

There is growing support for a model of tourism that directs more benefits to local communities — what is often called community-based tourism. This approach invites visitors to stay in local guesthouses, eat at family-run restaurants, participate in cultural experiences hosted by community members, and spend their money in ways that circulate within the local economy.

The challenge is that community-based tourism requires significant investment in training, quality standards, and marketing before it can compete with the convenience and comfort of large resorts. But for a country whose culture and natural environment are its greatest assets, finding ways to share those assets equitably may be the most sustainable path forward.`,
    question: "According to the passage, what is ONE environmental concern linked to tourism?",
    options: [
      "Tourists bring diseases from other countries.",
      "Coral reef damage from boat traffic and sunscreen chemicals.",
      "Tourism causes too much noise in coastal areas.",
      "Hotels use too much electricity from the national grid.",
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly mentions \'coral reef damage from boat traffic and sunscreen chemicals\' as one of the environmental concerns."
  },
  {
    id: 9,
    type: "reading",
    passage: `Tourism in Jamaica: Balancing Benefit and Cost

Tourism is one of Jamaica's most important economic sectors, generating billions of dollars in revenue and employing hundreds of thousands of Jamaicans directly and indirectly. Visitors come from around the world to experience the island's beaches, culture, cuisine, and natural beauty. Without this industry, many communities would face severe economic hardship.

Yet tourism is not without its costs. Critics point to the concentration of tourist development in resort enclaves — areas where international visitors live largely separate from the Jamaican population, with profits flowing to foreign-owned hotel chains rather than local businesses. Environmental concerns are also significant: coral reef damage from boat traffic and sunscreen chemicals, pressure on coastal ecosystems, and increased waste generation in areas with limited disposal infrastructure.

There is growing support for a model of tourism that directs more benefits to local communities — what is often called community-based tourism. This approach invites visitors to stay in local guesthouses, eat at family-run restaurants, participate in cultural experiences hosted by community members, and spend their money in ways that circulate within the local economy.

The challenge is that community-based tourism requires significant investment in training, quality standards, and marketing before it can compete with the convenience and comfort of large resorts. But for a country whose culture and natural environment are its greatest assets, finding ways to share those assets equitably may be the most sustainable path forward.`,
    question: "What CHALLENGE does community-based tourism face, according to the passage?",
    options: [
      "Local communities do not want to welcome tourists.",
      "The government opposes community-based tourism models.",
      "It requires significant investment in training, quality, and marketing before it can compete with large resorts.",
      "Community guesthouses are too expensive for most tourists.",
    ],
    correctAnswer: 2,
    explanation: "The passage states: \'community-based tourism requires significant investment in training, quality standards, and marketing before it can compete with the convenience and comfort of large resorts.\'"
  },
  {
    id: 10,
    type: "reading",
    question: "What does the author mean by \'sharing those assets equitably\'?",
    options: [
      "Selling Jamaica\'s beaches and cultural sites to foreign investors.",
      "Distributing the benefits of tourism more fairly among Jamaican communities.",
      "Making Jamaica\'s natural resources available to all countries.",
      "Reducing the number of tourists allowed to visit Jamaica each year.",
    ],
    correctAnswer: 1,
    explanation: "Equitably means fairly. \'Sharing assets equitably\' means ensuring that the benefits of Jamaica\'s natural and cultural assets are distributed fairly, including to local communities."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Old Mr. Vernon still WENT BY RIVER on Saturdays.\" The phrase \'went by river\' means —",
    options: [
      "swam across the river each Saturday",
      "travelled using the river as his route",
      "visited the river to fish on weekends",
      "studied the river for scientific research",
    ],
    correctAnswer: 1,
    explanation: "\'Went by river\' means travelled using the river as his mode of transport — the river as route rather than road."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The current made a sound he could only DESCRIBE AS \'the river talking.\'\" The word \'describe\' means —",
    options: [
      "to ignore or dismiss",
      "to write down in a notebook",
      "to explain or express in words",
      "to compare to something larger",
    ],
    correctAnswer: 2,
    explanation: "To describe means to express or convey in words — Mr. Vernon tries to put into language something he finds difficult to capture verbally."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Tourism generates BILLIONS of dollars in revenue.\" The word \'revenue\' means —",
    options: [
      "money spent by the government",
      "income earned from an activity",
      "the number of tourists visiting",
      "the cost of building hotels",
    ],
    correctAnswer: 1,
    explanation: "Revenue means income or earnings — money received as a result of business activity."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"Profits flowing to FOREIGN-OWNED hotel chains.\" The word \'foreign\' means —",
    options: [
      "owned by the Jamaican government",
      "belonging to or coming from another country",
      "located outside the tourist resort",
      "recently built and newly opened",
    ],
    correctAnswer: 1,
    explanation: "Foreign means belonging to or coming from another country — hotels not owned by Jamaican businesses or citizens."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"There is growing SUPPORT for community-based tourism.\" The word \'support\' means —",
    options: [
      "financial investment from the government",
      "agreement with and encouragement of an idea or approach",
      "criticism and opposition to a policy",
      "scientific evidence proving something is true",
    ],
    correctAnswer: 1,
    explanation: "Support in this context means agreement with and active encouragement of an idea or approach."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The approach INVITES visitors to stay in local guesthouses.\" The word \'invites\' means —",
    options: [
      "forces or requires",
      "forbids or prevents",
      "encourages or welcomes",
      "trains or educates",
    ],
    correctAnswer: 2,
    explanation: "Invites means encourages or welcomes — it is a gentle rather than compulsory encouragement."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Finding ways to share those assets EQUITABLY.\" The word \'equitably\' means —",
    options: [
      "completely and without any remaining",
      "in a way that is profitable for investors",
      "in a fair and just way",
      "as quickly as possible",
    ],
    correctAnswer: 2,
    explanation: "Equitably means in a fair and just manner — ensuring everyone receives an appropriate share."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Kingfishers SAT on low branches.\" What does this detail suggest about the river?",
    options: [
      "The river is polluted and unsafe for wildlife.",
      "The river is quiet, undisturbed, and rich with wildlife — a world apart from the road.",
      "Kingfishers are the only birds found in Portland.",
      "Mr. Vernon catches kingfishers to sell at the market.",
    ],
    correctAnswer: 1,
    explanation: "The detail of kingfishers sitting on low branches creates an image of calm, undisturbed natural beauty — emphasising the river\'s difference from the busy road."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Callum GRIPPED the sides\" of the canoe. The word \'gripped\' means —",
    options: [
      "pushed away firmly",
      "held tightly with the hands",
      "touched lightly with the fingers",
      "balanced carefully on both sides",
    ],
    correctAnswer: 1,
    explanation: "To grip means to hold something tightly, usually because of nervousness or need for support."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"A model of tourism that directs more benefits to LOCAL communities.\" The word \'local\' means —",
    options: [
      "belonging to the government",
      "relating to the particular area or community rather than somewhere distant",
      "international and world-famous",
      "recently established and new",
    ],
    correctAnswer: 1,
    explanation: "Local means relating to a particular area or the people who live there — in this context, the Jamaican communities closest to tourist sites."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The benefits of community-based tourism has not been fully realised.",
      "The benefits of community-based tourism have not been fully realised.",
      "The benefits of community-based tourism is not fully realised.",
      "The benefits of community-based tourism was not fully realised.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'benefits,\' which is plural. The correct verb is \'have not been.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time Callum put his hands in the water, he already relaxed.",
      "By the time Callum put his hands in the water, he had already relaxed.",
      "By the time Callum put his hands in the water, he has already relaxed.",
      "By the time Callum put his hands in the water, he was already relaxing.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already relaxed\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE in: \'Although the road is faster, Mr. Vernon still travels by river.\'",
    options: [
      "Mr. Vernon still travels by river",
      "Although the road is faster",
      "the road is faster",
      "still travels by river",
    ],
    correctAnswer: 1,
    explanation: "\'Although the road is faster\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence that demonstrates PARALLEL STRUCTURE:",
    options: [
      "Community tourism invites visitors to stay locally, eating family food, and for cultural experiences.",
      "Community tourism invites visitors to stay locally, eat family food, and participate in cultural experiences.",
      "Community tourism invites visitors to stay locally, to eat family food, and cultural experiences.",
      "Community tourism invites visitors staying locally, eating family food, and participating in cultural experiences.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three bare infinitives: stay, eat, and participate."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Mr. Vernon paddled the canoe silently through the green water.",
      "Callum gripped the sides of the canoe with both hands.",
      "The canoe was paddled silently through the green water by Mr. Vernon.",
      "The river made a sound that Mr. Vernon could only describe as talking.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the canoe\' (subject) receives the action \'was paddled.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Community-based tourism, which directs benefits to local communities has been growing.",
      "Community-based tourism, which directs benefits to local communities, has been growing.",
      "Community-based tourism which directs benefits to local communities, has been growing.",
      "Community-based tourism which directs benefits to local communities has been growing.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which directs benefits to local communities\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Callum said that he could have been told about this.",
      "Callum told his uncle that he could have been told about this.",
      "Callum said that he could have told about this.",
      "Callum said he could have been told about this.",
    ],
    correctAnswer: 3,
    explanation: "In reported speech, the direct statement \'You could have told me about this\' becomes \'he could have been told about this\' in the third person, past tense. Option D is correct."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Paddling quietly through the green water, Mr. Vernon pointed out the kingfishers.",
      "Gripping the sides tightly, Callum stared at the water below.",
      "Sitting on a low branch, the kingfisher watched the canoe pass.",
      "Sitting on low branches, Callum noticed the kingfishers for the first time.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'sitting on low branches\' should describe the kingfishers, but the sentence\'s subject is \'Callum\' — Callum is not sitting on the branches. The modifier is misplaced."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "The river is older than the road; but it is no longer the main route to town.",
      "The river is older than the road; however, it is no longer the main route to town.",
      "The river is older than the road; and many people still prefer it.",
      "The river; is older than the road and no longer the main route to town.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by a conjunctive adverb (\'however\') and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the fishing boats were safely guided by the lighthouse beam.",
      "Each of the fishing boats was safely guided by the lighthouse beam.",
      "Each of the fishing boats have been safely guided by the lighthouse beam.",
      "Each of the fishing boats are safely guided by the lighthouse beam.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The correct verb is \'was.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is important that Jamaica develops a sustainable tourism model.",
      "It is important that Jamaica develop a sustainable tourism model.",
      "It is important that Jamaica developed a sustainable tourism model.",
      "It is important that Jamaica will develop a sustainable tourism model.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is important that,\' the subjunctive requires the base form — \'develop,\' not \'develops,\' \'developed,\' or \'will develop.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "Tourism generates revenue employs workers and promotes Jamaica\'s culture.",
      "Tourism generates revenue, employs workers, and promotes Jamaica\'s culture.",
      "Tourism generates revenue, employs workers and promotes Jamaica\'s culture.",
      "Tourism, generates revenue employs workers and promotes Jamaica\'s culture.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that community-based tourism benefits Jamaica more than resort tourism?",
    options: [
      "Jamaica has many beautiful beaches and cultural attractions.",
      "Some visitors prefer to stay in smaller guesthouses.",
      "Unlike resort tourism — where profits flow to foreign corporations — community-based tourism ensures that visitor spending circulates within local economies, strengthening the communities whose culture and landscape attract visitors in the first place.",
      "Community tourism is a good idea for Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a direct contrast (\'unlike resort tourism\'), specifies the mechanism (\'spending circulates within local economies\'), and connects back to the underlying value — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "enviroment",
      "envirenment",
      "environment",
      "enviornment",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is environment — e-n-v-i-r-o-n-m-e-n-t."
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Mr. Vernon valued the river journey because it revealed a part of Portland invisible from the road. Kingfishers, overhanging trees, and the sound of the current created a world apart. Jamaica produces some of the finest coffee in the world. Callum understood this only after experiencing it himself.\'",
    options: [
      "Kingfishers, overhanging trees, and the sound of the current created a world apart.",
      "Callum understood this only after experiencing it himself.",
      "Jamaica produces some of the finest coffee in the world.",
      "Mr. Vernon valued the river journey because it revealed a part of Portland invisible from the road.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Mr. Vernon\'s river journey and what Callum learned from it. The sentence about Jamaican coffee is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Tourism is important to Jamaica\'s economy.\'",
    options: [
      "Tourism is very important and really helps Jamaica\'s economy in many ways.",
      "Tourism generates billions of dollars in revenue, supports hundreds of thousands of jobs, and is one of the primary economic engines sustaining Jamaican communities across the island.",
      "Jamaica\'s economy is helped a lot by tourism.",
      "Tourism matters to Jamaica because it is important to the economy.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses specific facts (\'billions of dollars,\' \'hundreds of thousands of jobs\'), precise vocabulary (\'primary economic engines\'), and lists concrete outcomes — far superior to the vague original."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in an argument about tourism?",
    options: [
      "Tourism is good for Jamaica but also bad in some ways.",
      "Some people think tourism has problems but they don\'t understand economics.",
      "While large resort tourism undeniably generates significant revenue for Jamaica, the concentration of profits in foreign-owned corporations means that the communities most affected by tourism\'s environmental footprint receive the least of its economic reward.",
      "Tourism has good and bad sides and Jamaica should think about this carefully.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the benefit honestly (\'undeniably generates significant revenue\'), then presents a specific, analytically precise counterpoint — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Callum went on the river with his uncle and liked it.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Callum went on the river with his uncle Mr. Vernon and really liked the experience very much.",
      "On the river with his uncle, Callum learned that some places reveal themselves only to those willing to slow down and let the current run through their fingers.",
      "Callum liked going on the river with his uncle and it was a good experience for him.",
      "When Callum went on the river he liked it and his uncle was happy.",
    ],
    correctAnswer: 1,
    explanation: "Option B transforms a flat statement into a resonant insight (\'places reveal themselves only to those willing to slow down\'), uses the passage\'s own imagery (\'let the current run through their fingers\'), and captures the deeper meaning of the experience."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the value of slow, unhurried experiences in nature?",
    options: [
      "Nature is beautiful and people should spend time in it.",
      "There are many places in Jamaica where people can go to experience nature.",
      "In a world that rewards speed, the river journey offers something rarer — the chance to discover what lies just beyond the edge of the road, in the quiet that only patience can reach.",
      "Mr. Vernon enjoyed the river more than the road.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a philosophical observation about speed and patience, uses evocative language (\'the quiet that only patience can reach\'), and ends with a resonant, memorable insight — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines TONE in a piece of writing?",
    options: [
      "The main character in a story",
      "The number of paragraphs in an essay",
      "The writer\'s attitude or feeling toward the subject, conveyed through word choice and style",
      "The facts and evidence used to support an argument",
    ],
    correctAnswer: 2,
    explanation: "Tone is the writer\'s attitude or emotional stance toward the subject, communicated through the language, style, and word choices made throughout the piece."
  }
]

export default function LiteracyMixed6MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed6Questions : literacyMixed6Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 6</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 6</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 6 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 6</h1>
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
