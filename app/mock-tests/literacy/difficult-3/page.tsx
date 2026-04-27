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

const literacyDifficult3Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The Photograph

The photograph sat in a cracked frame on the dresser in Mama Vie's room. It showed a young woman standing in front of what appeared to be a wooden house, her hand shading her eyes from the sun. For years, Joanna had walked past it without giving it much thought. Old photographs belonged to the past, and the past felt like another country.

It was only after Mama Vie died that Joanna lifted the frame and looked properly. The woman in the photograph wore a serious expression — not unhappy, just focused, as if she were measuring something beyond the camera's reach. She was standing on ground that had been swept clean. A broom handle was visible at the edge of the frame.

Joanna turned the photograph over. On the back, in handwriting she did not recognise, were five words: "Before the hurricane took everything."

She sat with it for a long time. She had thought the photograph was simply of a person. Now she understood it was of a moment that had survived when everything around it had not. The woman in the picture was gone. The house was gone. The ground was probably gone too, replaced by whatever grew after such losses. But the image remained, holding its breath.

Joanna placed it back on the dresser. She did not put it face down. She wanted it looking outward, into whatever room came next.`,
    question: "What does the detail of the \'broom handle visible at the edge of the frame\' MOST LIKELY suggest?",
    options: [
      "The photograph was taken in a hurry without careful framing.",
      "The woman in the photograph was preparing to leave the house.",
      "The woman had been working — sweeping — before the photograph was taken, suggesting ordinary daily life.",
      "The broom handle proves the house belonged to a wealthy family.",
    ],
    correctAnswer: 2,
    explanation: "The broom handle and the swept ground together suggest the woman was engaged in everyday domestic work. This gives the photograph a quality of ordinary life caught in an unguarded moment."
  },
  {
    id: 2,
    type: "reading",
    passage: `The Photograph

The photograph sat in a cracked frame on the dresser in Mama Vie's room. It showed a young woman standing in front of what appeared to be a wooden house, her hand shading her eyes from the sun. For years, Joanna had walked past it without giving it much thought. Old photographs belonged to the past, and the past felt like another country.

It was only after Mama Vie died that Joanna lifted the frame and looked properly. The woman in the photograph wore a serious expression — not unhappy, just focused, as if she were measuring something beyond the camera's reach. She was standing on ground that had been swept clean. A broom handle was visible at the edge of the frame.

Joanna turned the photograph over. On the back, in handwriting she did not recognise, were five words: "Before the hurricane took everything."

She sat with it for a long time. She had thought the photograph was simply of a person. Now she understood it was of a moment that had survived when everything around it had not. The woman in the picture was gone. The house was gone. The ground was probably gone too, replaced by whatever grew after such losses. But the image remained, holding its breath.

Joanna placed it back on the dresser. She did not put it face down. She wanted it looking outward, into whatever room came next.`,
    question: "What does the phrase \'the past felt like another country\' suggest about Joanna at the beginning of the passage?",
    options: [
      "Joanna had actually lived in a different country before moving to Jamaica.",
      "Joanna felt emotionally distant from her family\'s history and saw it as separate from her own life.",
      "Joanna did not believe that the photograph was real.",
      "Joanna was planning to travel abroad to research her family history.",
    ],
    correctAnswer: 1,
    explanation: "\'Another country\' is a metaphor for distance — not geographical, but emotional. Joanna felt the past was remote and irrelevant to her, which is why she had walked past the photograph without curiosity."
  },
  {
    id: 3,
    type: "reading",
    passage: `The Photograph

The photograph sat in a cracked frame on the dresser in Mama Vie's room. It showed a young woman standing in front of what appeared to be a wooden house, her hand shading her eyes from the sun. For years, Joanna had walked past it without giving it much thought. Old photographs belonged to the past, and the past felt like another country.

It was only after Mama Vie died that Joanna lifted the frame and looked properly. The woman in the photograph wore a serious expression — not unhappy, just focused, as if she were measuring something beyond the camera's reach. She was standing on ground that had been swept clean. A broom handle was visible at the edge of the frame.

Joanna turned the photograph over. On the back, in handwriting she did not recognise, were five words: "Before the hurricane took everything."

She sat with it for a long time. She had thought the photograph was simply of a person. Now she understood it was of a moment that had survived when everything around it had not. The woman in the picture was gone. The house was gone. The ground was probably gone too, replaced by whatever grew after such losses. But the image remained, holding its breath.

Joanna placed it back on the dresser. She did not put it face down. She wanted it looking outward, into whatever room came next.`,
    question: "What is the EFFECT of the five words on the back of the photograph — \'Before the hurricane took everything\'?",
    options: [
      "They confirm that the woman in the photograph survived the hurricane.",
      "They transform the photograph from a simple portrait into a document of loss, giving it historical and emotional weight.",
      "They explain why Mama Vie kept the photograph hidden on the dresser.",
      "They suggest that the woman in the photograph was a famous historical figure.",
    ],
    correctAnswer: 1,
    explanation: "The five words radically shift the meaning of the photograph. What seemed like an ordinary portrait becomes a record of survival — the last image before devastation. This gives the photograph its emotional power."
  },
  {
    id: 4,
    type: "reading",
    passage: `The Photograph

The photograph sat in a cracked frame on the dresser in Mama Vie's room. It showed a young woman standing in front of what appeared to be a wooden house, her hand shading her eyes from the sun. For years, Joanna had walked past it without giving it much thought. Old photographs belonged to the past, and the past felt like another country.

It was only after Mama Vie died that Joanna lifted the frame and looked properly. The woman in the photograph wore a serious expression — not unhappy, just focused, as if she were measuring something beyond the camera's reach. She was standing on ground that had been swept clean. A broom handle was visible at the edge of the frame.

Joanna turned the photograph over. On the back, in handwriting she did not recognise, were five words: "Before the hurricane took everything."

She sat with it for a long time. She had thought the photograph was simply of a person. Now she understood it was of a moment that had survived when everything around it had not. The woman in the picture was gone. The house was gone. The ground was probably gone too, replaced by whatever grew after such losses. But the image remained, holding its breath.

Joanna placed it back on the dresser. She did not put it face down. She wanted it looking outward, into whatever room came next.`,
    question: "The phrase \'holding its breath\' in the final paragraph of the passage is an example of —",
    options: [
      "a simile comparing the photograph to a living person",
      "personification, giving the image a human quality to suggest it is frozen in suspended time",
      "alliteration used to create a rhythmic effect",
      "hyperbole used to exaggerate the age of the photograph",
    ],
    correctAnswer: 1,
    explanation: "Personification gives human qualities to non-human things. \'Holding its breath\' gives the photograph the quality of a person suspended in anticipation — beautifully suggesting the image is frozen at a threshold moment."
  },
  {
    id: 5,
    type: "reading",
    passage: `The Photograph

The photograph sat in a cracked frame on the dresser in Mama Vie's room. It showed a young woman standing in front of what appeared to be a wooden house, her hand shading her eyes from the sun. For years, Joanna had walked past it without giving it much thought. Old photographs belonged to the past, and the past felt like another country.

It was only after Mama Vie died that Joanna lifted the frame and looked properly. The woman in the photograph wore a serious expression — not unhappy, just focused, as if she were measuring something beyond the camera's reach. She was standing on ground that had been swept clean. A broom handle was visible at the edge of the frame.

Joanna turned the photograph over. On the back, in handwriting she did not recognise, were five words: "Before the hurricane took everything."

She sat with it for a long time. She had thought the photograph was simply of a person. Now she understood it was of a moment that had survived when everything around it had not. The woman in the picture was gone. The house was gone. The ground was probably gone too, replaced by whatever grew after such losses. But the image remained, holding its breath.

Joanna placed it back on the dresser. She did not put it face down. She wanted it looking outward, into whatever room came next.`,
    question: "Why does Joanna choose to leave the photograph \'looking outward, into whatever room came next\'?",
    options: [
      "She wants visitors to be able to see it more easily.",
      "She feels the woman in the photograph would have preferred it that way.",
      "She wants to honour the image by letting it face forward — acknowledging its survival and continuing presence.",
      "She is afraid of what will happen if she puts it face down again.",
    ],
    correctAnswer: 2,
    explanation: "Joanna\'s decision is a small act of recognition. By letting the photograph \'look outward,\' she is acknowledging the image\'s survival and refusing to let it remain hidden or dismissed — as she herself had once dismissed it."
  },
  {
    id: 6,
    type: "reading",
    passage: `Should the School Day Start Later?

For decades, schools in many countries have begun their day between seven and eight in the morning. This schedule was designed around agricultural and industrial patterns that no longer reflect modern life. Increasingly, health researchers and educators are arguing that early start times conflict with the biological needs of adolescents and even primary school children — with measurable consequences for learning, wellbeing, and safety.

The science is clear. During adolescence, the body's internal clock — called the circadian rhythm — shifts naturally, causing young people to feel alert later in the evening and struggle to wake early. This is not laziness or poor discipline; it is biology. Studies from the United States, the United Kingdom, and several Caribbean nations have found that schools starting after 8:30 am record higher attendance rates, improved academic performance, and fewer incidents of depression and anxiety among students.

Critics of later start times raise practical concerns. Parents who must commute to work early cannot wait for later school dismissal times. After-school programmes, sports fixtures, and transport routes would all require expensive restructuring. These concerns are legitimate and should not be dismissed.

However, they should be weighed against the cost of the current system. A student who is chronically sleep-deprived is not a student learning effectively — she is a student present in body but largely absent in mind. The question is not whether we can afford to change the school day. It is whether we can afford not to.`,
    question: "What is the CENTRAL ARGUMENT of the passage about school start times?",
    options: [
      "Schools should remain on their current timetable because change is too expensive.",
      "Adolescents are lazy and use biology as an excuse to avoid early mornings.",
      "Early school start times contradict the biological needs of young people and have measurable negative consequences that outweigh the practical difficulties of change.",
      "Schools in the Caribbean do not need to follow advice from the United States or the United Kingdom.",
    ],
    correctAnswer: 2,
    explanation: "The passage argues that biology makes early starts harmful and that the practical difficulties of change, while real, are outweighed by the costs of the current system. Option C correctly captures both parts of the argument."
  },
  {
    id: 7,
    type: "reading",
    passage: `Should the School Day Start Later?

For decades, schools in many countries have begun their day between seven and eight in the morning. This schedule was designed around agricultural and industrial patterns that no longer reflect modern life. Increasingly, health researchers and educators are arguing that early start times conflict with the biological needs of adolescents and even primary school children — with measurable consequences for learning, wellbeing, and safety.

The science is clear. During adolescence, the body's internal clock — called the circadian rhythm — shifts naturally, causing young people to feel alert later in the evening and struggle to wake early. This is not laziness or poor discipline; it is biology. Studies from the United States, the United Kingdom, and several Caribbean nations have found that schools starting after 8:30 am record higher attendance rates, improved academic performance, and fewer incidents of depression and anxiety among students.

Critics of later start times raise practical concerns. Parents who must commute to work early cannot wait for later school dismissal times. After-school programmes, sports fixtures, and transport routes would all require expensive restructuring. These concerns are legitimate and should not be dismissed.

However, they should be weighed against the cost of the current system. A student who is chronically sleep-deprived is not a student learning effectively — she is a student present in body but largely absent in mind. The question is not whether we can afford to change the school day. It is whether we can afford not to.`,
    question: "What does the passage mean by \'chronically sleep-deprived\'?",
    options: [
      "Occasionally tired on Monday mornings",
      "Consistently and regularly lacking sufficient sleep over a long period",
      "Suffering from a rare medical sleep disorder",
      "Too tired to participate in after-school sports",
    ],
    correctAnswer: 1,
    explanation: "Chronically means over a long period and repeatedly. Chronically sleep-deprived means the student is regularly and persistently not getting enough sleep — not occasionally tired."
  },
  {
    id: 8,
    type: "reading",
    passage: `Should the School Day Start Later?

For decades, schools in many countries have begun their day between seven and eight in the morning. This schedule was designed around agricultural and industrial patterns that no longer reflect modern life. Increasingly, health researchers and educators are arguing that early start times conflict with the biological needs of adolescents and even primary school children — with measurable consequences for learning, wellbeing, and safety.

The science is clear. During adolescence, the body's internal clock — called the circadian rhythm — shifts naturally, causing young people to feel alert later in the evening and struggle to wake early. This is not laziness or poor discipline; it is biology. Studies from the United States, the United Kingdom, and several Caribbean nations have found that schools starting after 8:30 am record higher attendance rates, improved academic performance, and fewer incidents of depression and anxiety among students.

Critics of later start times raise practical concerns. Parents who must commute to work early cannot wait for later school dismissal times. After-school programmes, sports fixtures, and transport routes would all require expensive restructuring. These concerns are legitimate and should not be dismissed.

However, they should be weighed against the cost of the current system. A student who is chronically sleep-deprived is not a student learning effectively — she is a student present in body but largely absent in mind. The question is not whether we can afford to change the school day. It is whether we can afford not to.`,
    question: "What is the PURPOSE of the third paragraph, which raises practical concerns about later start times?",
    options: [
      "To prove that the argument for later start times is completely wrong.",
      "To acknowledge legitimate counterarguments before returning to the main claim — a technique that strengthens the overall argument.",
      "To suggest that parents are more important than students in this debate.",
      "To end the essay with a balanced conclusion that takes no final position.",
    ],
    correctAnswer: 1,
    explanation: "A strong persuasive argument acknowledges opposing views honestly before refuting or outweighing them. The third paragraph does this — it concedes the concerns are \'legitimate\' before the final paragraph rebalances the argument."
  },
  {
    id: 9,
    type: "reading",
    passage: `Should the School Day Start Later?

For decades, schools in many countries have begun their day between seven and eight in the morning. This schedule was designed around agricultural and industrial patterns that no longer reflect modern life. Increasingly, health researchers and educators are arguing that early start times conflict with the biological needs of adolescents and even primary school children — with measurable consequences for learning, wellbeing, and safety.

The science is clear. During adolescence, the body's internal clock — called the circadian rhythm — shifts naturally, causing young people to feel alert later in the evening and struggle to wake early. This is not laziness or poor discipline; it is biology. Studies from the United States, the United Kingdom, and several Caribbean nations have found that schools starting after 8:30 am record higher attendance rates, improved academic performance, and fewer incidents of depression and anxiety among students.

Critics of later start times raise practical concerns. Parents who must commute to work early cannot wait for later school dismissal times. After-school programmes, sports fixtures, and transport routes would all require expensive restructuring. These concerns are legitimate and should not be dismissed.

However, they should be weighed against the cost of the current system. A student who is chronically sleep-deprived is not a student learning effectively — she is a student present in body but largely absent in mind. The question is not whether we can afford to change the school day. It is whether we can afford not to.`,
    question: "The final rhetorical question — \'whether we can afford not to\' — is most effective because it —",
    options: [
      "shows the writer is uncertain about the argument",
      "forces the reader to consider the hidden cost of inaction, reframing the debate",
      "asks the reader to calculate the financial cost of school restructuring",
      "suggests that the writer has no more evidence to offer",
    ],
    correctAnswer: 1,
    explanation: "Rhetorical questions are used not to seek answers but to make a point. \'Can we afford not to?\' reframes the debate: the cost of inaction — impaired learning — is greater than the cost of change."
  },
  {
    id: 10,
    type: "reading",
    question: "Which word BEST describes the TONE of the school start times passage?",
    options: [
      "Angry and dismissive",
      "Measured, reasoned, and persuasive",
      "Confused and uncertain",
      "Light and humorous",
    ],
    correctAnswer: 1,
    explanation: "The passage presents evidence, acknowledges opposing views, and uses careful logic throughout. The tone is measured and reasoned — it seeks to persuade through argument rather than emotion."
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Joanna sat with it for a LONG TIME.\" In the context of the passage, this phrase suggests —",
    options: [
      "She was bored and had nothing else to do.",
      "She was deeply affected by what she had read and needed time to process it.",
      "She was trying to remember where she had seen the photograph before.",
      "She was waiting for someone else to come and explain it to her.",
    ],
    correctAnswer: 1,
    explanation: "After reading the five words on the back, Joanna\'s extended stillness suggests she was processing something emotionally significant — not bored or waiting."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The body\'s CIRCADIAN RHYTHM shifts naturally during adolescence.\" The term \'circadian rhythm\' refers to —",
    options: [
      "the pattern of homework and study habits in young people",
      "the body\'s natural internal clock that regulates sleep and wakefulness",
      "a medical condition that causes extreme tiredness in teenagers",
      "the timetable used by schools to schedule lessons",
    ],
    correctAnswer: 1,
    explanation: "The passage defines it: the circadian rhythm is \'the body\'s internal clock\' that controls when people feel alert or sleepy."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"These concerns are LEGITIMATE and should not be dismissed.\" The word \'legitimate\' means —",
    options: [
      "exaggerated and overblown",
      "valid, reasonable, and deserving serious consideration",
      "extremely difficult to solve",
      "popular among a large group of people",
    ],
    correctAnswer: 1,
    explanation: "Legitimate means having a sound basis in law, logic, or fact — the concerns are real and reasonable, even if the author ultimately disagrees with them."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The image remained, HOLDING ITS BREATH.\" This phrase is best interpreted to mean —",
    options: [
      "The image was fading and becoming hard to see.",
      "The image was suspended in a state of quiet, frozen anticipation — surviving when everything else had not.",
      "The image was so old it had become damaged.",
      "The image showed a woman who was holding her breath in the photograph.",
    ],
    correctAnswer: 1,
    explanation: "\'Holding its breath\' is personification — it describes the image as frozen in suspended time, poised between past and present, surviving when everything around it was destroyed."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"Early start times CONFLICT with the biological needs of adolescents.\" The word \'conflict\' means —",
    options: [
      "to support and reinforce",
      "to be in opposition or disagreement with",
      "to gradually improve over time",
      "to replace something with something better",
    ],
    correctAnswer: 1,
    explanation: "To conflict means to be in opposition or contradiction. Early start times work against — not with — the body\'s biological patterns."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"The photograph was of a MOMENT that had survived.\" In this context, \'moment\' most closely means —",
    options: [
      "a brief, unimportant instant",
      "a significant, unrepeatable point in time that has been preserved",
      "a long and comfortable period of happiness",
      "an event that lasted for several hours",
    ],
    correctAnswer: 1,
    explanation: "Here, \'moment\' is used to mean a specific, meaningful point in time — one made significant by the fact that everything around it was later destroyed."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Studies have found IMPROVED academic performance\" at later-starting schools. The word \'improved\' means —",
    options: [
      "briefly better before returning to the same level",
      "made better in a lasting and measurable way",
      "slightly different but not necessarily better",
      "completely transformed beyond recognition",
    ],
    correctAnswer: 1,
    explanation: "Improved means made better in a meaningful way — enhanced or upgraded from a previous state."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"She was measuring something BEYOND the camera\'s reach.\" The phrase \'beyond the camera\'s reach\' suggests —",
    options: [
      "The camera was not powerful enough to photograph the woman.",
      "The woman was looking at or thinking about something the camera could not capture — something internal or distant.",
      "The camera was positioned too far away from the woman.",
      "The woman did not want to be photographed.",
    ],
    correctAnswer: 1,
    explanation: "\'Beyond the camera\'s reach\' is figurative — it suggests the woman\'s gaze or thoughts extended to something the photograph could not record, perhaps something private or far away."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"The ground was probably GONE TOO, replaced by whatever grew after such losses.\" What does \'whatever grew after such losses\' suggest?",
    options: [
      "That plants grew back quickly after the hurricane.",
      "That life continued and changed after destruction, but the original was permanently altered.",
      "That the woman in the photograph planted a new garden.",
      "That hurricanes always improve the quality of the soil.",
    ],
    correctAnswer: 1,
    explanation: "The phrase suggests that after loss comes change — not restoration of what was, but something new growing in its place. It reflects on how both land and lives transform after devastation."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"A student CHRONICALLY sleep-deprived is present in body but absent in mind.\" Which word is a SYNONYM for \'chronically\'?",
    options: [
      "occasionally",
      "persistently",
      "temporarily",
      "suddenly",
    ],
    correctAnswer: 1,
    explanation: "Chronically means persistently and over a long period of time. Persistently is the closest synonym."
  },
  {
    id: 21,
    type: "grammar",
    question: "Which sentence correctly uses the PAST PERFECT tense?",
    options: [
      "By the time Joanna opened the frame, she already forgot the photograph existed.",
      "By the time Joanna opened the frame, she had already forgotten the photograph existed.",
      "By the time Joanna opened the frame, she has already forgotten the photograph existed.",
      "By the time Joanna opened the frame, she was already forgetting the photograph existed.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had\' + past participle) is required for an action completed before another past event. \'Had already forgotten\' is correct."
  },
  {
    id: 22,
    type: "grammar",
    question: "Identify the ERROR: \'Neither the researchers nor the school principal have agreed to change the start time.\'",
    options: [
      "researchers should be research",
      "have should be has",
      "the should be a",
      "change should be changed",
    ],
    correctAnswer: 1,
    explanation: "With \'neither...nor,\' the verb agrees with the subject closest to it. \'The school principal\' is singular, so \'has\' is correct, not \'have.\'"
  },
  {
    id: 23,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "The photograph showed a woman standing, her hand shading, and she looked focused.",
      "The photograph showed a woman standing, shading her eyes, and looking focused.",
      "The photograph showed a woman who stood, shading her eyes, and looked focused.",
      "The photograph showed a woman standing, who shaded her eyes, and looking focused.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items in a series to use the same grammatical form. Option B uses three -ing participles: standing, shading, looking."
  },
  {
    id: 24,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The science is clear early start times harm young people\'s learning.",
      "The science is clear; early start times harm young people\'s learning.",
      "The science is clear, early start times harm young people\'s learning.",
      "The science is clear: early start times harm young people\'s learning.",
    ],
    correctAnswer: 3,
    explanation: "A colon can introduce an elaboration or explanation after a complete clause. \'The science is clear\' is a complete clause, and \'early start times harm young people\'s learning\' explains that claim. Both B and D are technically defensible, but the colon is the strongest choice here because what follows is a direct explanation."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Joanna lifted the frame and looked at the photograph carefully.",
      "Mama Vie had kept the photograph on the dresser for years.",
      "The photograph was placed back on the dresser by Joanna.",
      "The five words on the back changed the way Joanna saw the image.",
    ],
    correctAnswer: 2,
    explanation: "In the passive voice, the subject receives the action. In option C, \'the photograph\' (subject) receives the action \'was placed,\' with the agent (\'by Joanna\') at the end."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "The circadian rhythm, which controls sleep patterns has been studied extensively.",
      "The circadian rhythm, which controls sleep patterns, has been studied extensively.",
      "The circadian rhythm which controls sleep patterns, has been studied extensively.",
      "The circadian rhythm which, controls sleep patterns has been studied extensively.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which controls sleep patterns\' must be enclosed by commas on both sides since it adds information without defining which circadian rhythm is meant."
  },
  {
    id: 27,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although the concerns about cost are valid, the benefits of later start times outweigh them.\'",
    options: [
      "the benefits of later start times outweigh them",
      "Although the concerns about cost are valid",
      "the concerns about cost are valid",
      "outweigh them",
    ],
    correctAnswer: 1,
    explanation: "\'Although the concerns about cost are valid\' is the subordinate clause — it is introduced by the subordinating conjunction \'although\' and cannot stand alone as a complete sentence."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Running quickly through the corridor, the bell rang before she reached the classroom.",
      "Running quickly through the corridor, she heard the bell ring.",
      "She ran quickly through the corridor when she heard the bell ring.",
      "She heard the bell and ran quickly through the corridor.",
    ],
    correctAnswer: 0,
    explanation: "In option A, \'running quickly through the corridor\' should describe a person, but the sentence says the bell ran — this is a misplaced (dangling) modifier."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "The researcher said that early start times are harmful to students.",
      "The researcher said that early start times were harmful to students.",
      "The researcher said early start times will be harmful to students.",
      "The researcher said that early start times had been harmful to students always.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, the present tense (\'are\') shifts back to past (\'were\'). Option B correctly applies this backshift."
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "The evidence from multiple studies show that later start times help.",
      "The evidence from multiple studies shows that later start times help.",
      "The evidence from multiple studies are showing that later start times help.",
      "The evidence from multiple studies have shown that later start times help.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the evidence,\' which is singular. The prepositional phrase \'from multiple studies\' does not change the subject. The correct verb is \'shows.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is essential that every student gets enough sleep.",
      "It is essential that every student get enough sleep.",
      "It is essential that every student got enough sleep.",
      "It is essential that every student will get enough sleep.",
    ],
    correctAnswer: 1,
    explanation: "After expressions like \'it is essential that,\' the subjunctive is used. The subjunctive uses the base form of the verb — \'get,\' not \'gets,\' \'got,\' or \'will get.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Which sentence uses the COLON correctly?",
    options: [
      "She found three things: useful inside the frame, a name, and a date.",
      "She found three things inside the frame: a photograph, a name, and a date.",
      "She found: three things inside the frame a photograph, a name, and a date.",
      "She found three things inside the frame a photograph: a name, and a date.",
    ],
    correctAnswer: 1,
    explanation: "A colon follows a complete clause and introduces a list or elaboration. \'She found three things inside the frame\' is a complete clause, so option B correctly places the colon before the list."
  },
  {
    id: 33,
    type: "writing",
    question: "Which sentence is the BEST topic sentence for a paragraph arguing that Jamaica should shift school start times?",
    options: [
      "Jamaica\'s schools currently start very early in the morning.",
      "Many students in Jamaica feel tired during the school day.",
      "Shifting Jamaica\'s school start times to 8:30 am or later is not only a health imperative — it is an investment in the quality of learning across the entire system.",
      "Other countries have already changed their school start times.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, specific claim, frames the issue in two compelling ways (\'health imperative\' and \'investment in learning\'), and uses formal vocabulary — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "A student wrote: \'The photo was old and Joanna looked at it and she felt sad and she thought about Mama Vie.\' What is the MOST EFFECTIVE revision?",
    options: [
      "The photo was old, Joanna looked at it and felt sad thinking about Mama Vie.",
      "Holding the old photograph, Joanna was overcome with grief as memories of Mama Vie returned with sudden clarity.",
      "Joanna felt sad because the photograph was old and it made her think about Mama Vie.",
      "The old photograph made Joanna sad because she thought about Mama Vie and felt grief.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses a participial phrase (\'Holding the old photograph\'), precise vocabulary (\'overcome with grief,\' \'sudden clarity\'), and vivid imagery to transform the flat original into effective narrative prose."
  },
  {
    id: 35,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Early start times are bad for students.\'",
    options: [
      "Early start times are very bad for many students everywhere.",
      "Chronic early start times deprive students of biologically necessary sleep, impairing concentration, emotional regulation, and long-term academic achievement.",
      "Students do not like early start times because they are bad.",
      "It is bad when students have to start school early because they are tired.",
    ],
    correctAnswer: 1,
    explanation: "Option B uses precise academic vocabulary — \'chronic,\' \'biologically necessary,\' \'emotional regulation,\' \'long-term academic achievement\' — and explains the specific mechanisms of harm rather than simply asserting that something is \'bad.\'"
  },
  {
    id: 36,
    type: "writing",
    question: "Which sentence should be REMOVED to improve paragraph unity? \'The photograph had sat unnoticed on Mama Vie\'s dresser for years. Joanna had passed it every day without curiosity. After her grandmother died, Joanna finally looked at it properly. Jamaica has many talented photographers who document local life. The five words on the back changed everything.\'",
    options: [
      "The photograph had sat unnoticed on Mama Vie\'s dresser for years.",
      "Joanna had passed it every day without curiosity.",
      "Jamaica has many talented photographers who document local life.",
      "The five words on the back changed everything.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Joanna\'s experience with a specific photograph. The sentence about Jamaican photographers in general is completely off-topic and breaks the paragraph\'s focus."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in a persuasive argument about school start times?",
    options: [
      "Some parents disagree with later school start times, but they are wrong.",
      "People think changing start times is expensive, but money should not matter.",
      "While restructuring transport routes and after-school programmes would require significant investment, the academic and health returns of a well-rested student population make this a sound long-term commitment.",
      "Later start times are better and the concerns people have are not that important.",
    ],
    correctAnswer: 2,
    explanation: "Option C acknowledges the counterargument honestly (\'would require significant investment\') before presenting a clear, reasoned counter — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'The photograph was important because it showed a person.\' What is the MOST COMPLETE and PRECISE revision?",
    options: [
      "The photograph was very important because it showed an important person.",
      "The photograph mattered because it was old and showed someone from the past.",
      "The photograph was significant not merely as a portrait of a person, but as evidence that a life — and a moment — had existed before the hurricane erased everything around it.",
      "The photograph was important because it showed a person that Joanna cared about.",
    ],
    correctAnswer: 2,
    explanation: "Option C distinguishes between what the photograph shows on the surface (\'a portrait\') and what it represents (\'evidence of a life\') — a crucial analytical distinction that elevates the writing significantly."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about the importance of family photographs?",
    options: [
      "Family photographs come in all sizes and can be kept in albums or frames.",
      "Many people have photographs on their walls and dressers.",
      "A photograph does not only preserve a face — it preserves the proof that someone lived, that a moment mattered, and that the world they knew was real.",
      "Photographs are nice to have and make good memories.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically rich, uses three parallel clauses for rhetorical effect, and ends with a powerful, memorable idea. It elevates the paragraph\'s conclusion from description to meaning."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST defines the difference between a FACT and an OPINION in a persuasive essay?",
    options: [
      "A fact is something a writer believes strongly; an opinion is something everyone agrees on.",
      "A fact can be verified or proven; an opinion is a personal interpretation or judgement that cannot be proven.",
      "A fact is found in books; an opinion is found in newspapers.",
      "A fact is long and detailed; an opinion is short and simple.",
    ],
    correctAnswer: 1,
    explanation: "A fact is verifiable through evidence or measurement. An opinion is a judgement, interpretation, or belief that cannot be proven — even if it is well-reasoned. Option B correctly captures this distinction."
  }
]

const sectionOrder = ["reading", "vocabulary", "grammar", "writing"] as const

type SectionType = (typeof sectionOrder)[number]

const sectionMeta: Record<SectionType, { label: string; description: string }> = {
  reading: {
    label: "Reading",
    description: "Inference, tone, writer's craft, and close reading of longer passages.",
  },
  vocabulary: {
    label: "Vocabulary",
    description: "Word meaning in context, figurative language, and precise word choice.",
  },
  grammar: {
    label: "Grammar",
    description: "Editing in context, complex sentence structure, and advanced language use.",
  },
  writing: {
    label: "Writing",
    description: "Paragraph coherence, persuasive technique, evidence, and writing conventions.",
  },
}

function getPerformanceNote(percentage: number) {
  if (percentage >= 85) return "Excellent"
  if (percentage >= 70) return "Good"
  if (percentage >= 50) return "Fair"
  return "Needs Improvement"
}

export default function LiteracyDifficult3Test() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyDifficult3Questions : literacyDifficult3Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Difficult 3</CardTitle>
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
                          You can try {FREE_QUESTION_LIMIT} questions for free. Upgrade to Premium for the full 40-question difficult-level literacy test with reports and explanations.
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
                    <li>- Tone, writer&apos;s craft, and figurative language</li>
                    <li>- Editing in context and paragraph coherence</li>
                    <li>- More challenging distractors throughout</li>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Difficult 3</p>
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
                      <p className="text-sm text-slate-700 mt-1">{section.correct}/{section.total} correct · {section.percentage}%</p>
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
                    Review Answers &amp; Report
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
            header, footer, .no-print { display: none !important; }
            body { background: #ffffff !important; }
            .report-sheet { box-shadow: none !important; border: none !important; }
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Difficult 3 Report</CardTitle>
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
                  This report shows the student&apos;s overall result, section-by-section performance, and a full review of each question with explanations.
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
                <h1 className="text-lg font-bold">Literacy Difficult 3</h1>
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
