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

const literacyMixed10Questions: Question[] = [
  {
    id: 1,
    type: "reading",
    passage: `The First Lesson

When Miss Johnson walked into the classroom on her first day of teaching, she was twenty-three years old and she was afraid. She had told no one this. She had spent the previous evening arranging and rearranging her lesson plan until it was correct by every measure she had been taught. She had prepared her opening question and her closing question and four activities in between. She had even prepared what she would say if no one raised a hand.

What she had not prepared for was how it would feel to stand at the front of a room of thirty children and understand, all at once, that they were real. Not students in a textbook. Real children, with their own concerns, their own mornings, their own ways of sitting in a chair.

The lesson did not go as planned. She asked her opening question and no one answered. Then a boy in the third row answered with a question of his own, and the class argued about it for twenty minutes, and by the end of this she had barely started the first activity.

But something else had happened. The class had woken up. They were arguing, leaning forward, pointing at each other's ideas. Miss Johnson looked at them and understood, with a certainty she had not found in any lesson plan, that this was what it was supposed to feel like.

She did not rearrange her lesson plan that evening. She added something new: "Leave room for what the class brings." `,
    question: "What had Miss Johnson prepared for her first lesson, and what had she NOT prepared for?",
    options: [
      "She had not prepared her lesson plan, but she had prepared emotionally.",
      "She had prepared everything logically and technically, but had not prepared for the emotional reality of facing thirty real children.",
      "She had prepared her emotional response but forgotten her lesson activities.",
      "She had not prepared anything and was completely surprised by the lesson.",
    ],
    correctAnswer: 1,
    explanation: "The passage contrasts her detailed logical preparation (lesson plan, opening question, activities) with what she had not prepared for: \'how it would feel to stand at the front of a room of thirty children and understand that they were real.\'"
  },
  {
    id: 2,
    type: "reading",
    passage: `The First Lesson

When Miss Johnson walked into the classroom on her first day of teaching, she was twenty-three years old and she was afraid. She had told no one this. She had spent the previous evening arranging and rearranging her lesson plan until it was correct by every measure she had been taught. She had prepared her opening question and her closing question and four activities in between. She had even prepared what she would say if no one raised a hand.

What she had not prepared for was how it would feel to stand at the front of a room of thirty children and understand, all at once, that they were real. Not students in a textbook. Real children, with their own concerns, their own mornings, their own ways of sitting in a chair.

The lesson did not go as planned. She asked her opening question and no one answered. Then a boy in the third row answered with a question of his own, and the class argued about it for twenty minutes, and by the end of this she had barely started the first activity.

But something else had happened. The class had woken up. They were arguing, leaning forward, pointing at each other's ideas. Miss Johnson looked at them and understood, with a certainty she had not found in any lesson plan, that this was what it was supposed to feel like.

She did not rearrange her lesson plan that evening. She added something new: "Leave room for what the class brings." `,
    question: "What does the phrase \'the class had woken up\' mean?",
    options: [
      "The students had been asleep and literally woke up.",
      "The students came in late and arrived during the lesson.",
      "The students became genuinely alert, engaged, and intellectually alive in the argument.",
      "The bell rang and class began properly.",
    ],
    correctAnswer: 2,
    explanation: "\'Woken up\' is figurative — it describes the class becoming genuinely alive with intellectual engagement: arguing, leaning forward, pointing at ideas. The class had moved from passive to active."
  },
  {
    id: 3,
    type: "reading",
    passage: `The First Lesson

When Miss Johnson walked into the classroom on her first day of teaching, she was twenty-three years old and she was afraid. She had told no one this. She had spent the previous evening arranging and rearranging her lesson plan until it was correct by every measure she had been taught. She had prepared her opening question and her closing question and four activities in between. She had even prepared what she would say if no one raised a hand.

What she had not prepared for was how it would feel to stand at the front of a room of thirty children and understand, all at once, that they were real. Not students in a textbook. Real children, with their own concerns, their own mornings, their own ways of sitting in a chair.

The lesson did not go as planned. She asked her opening question and no one answered. Then a boy in the third row answered with a question of his own, and the class argued about it for twenty minutes, and by the end of this she had barely started the first activity.

But something else had happened. The class had woken up. They were arguing, leaning forward, pointing at each other's ideas. Miss Johnson looked at them and understood, with a certainty she had not found in any lesson plan, that this was what it was supposed to feel like.

She did not rearrange her lesson plan that evening. She added something new: "Leave room for what the class brings." `,
    question: "What does Miss Johnson\'s note — \'Leave room for what the class brings\' — suggest about her learning?",
    options: [
      "She plans to give students more free time in future lessons.",
      "She realises that the best teaching makes space for students\' own contributions and energy, not just the teacher\'s prepared content.",
      "She wants to give the class more questions to argue about.",
      "She plans to stop preparing lesson plans entirely.",
    ],
    correctAnswer: 1,
    explanation: "The note represents a philosophical shift — from a model where the teacher controls everything to one where the teacher makes space for what students bring to the lesson. It is a fundamental insight about teaching."
  },
  {
    id: 4,
    type: "reading",
    passage: `The First Lesson

When Miss Johnson walked into the classroom on her first day of teaching, she was twenty-three years old and she was afraid. She had told no one this. She had spent the previous evening arranging and rearranging her lesson plan until it was correct by every measure she had been taught. She had prepared her opening question and her closing question and four activities in between. She had even prepared what she would say if no one raised a hand.

What she had not prepared for was how it would feel to stand at the front of a room of thirty children and understand, all at once, that they were real. Not students in a textbook. Real children, with their own concerns, their own mornings, their own ways of sitting in a chair.

The lesson did not go as planned. She asked her opening question and no one answered. Then a boy in the third row answered with a question of his own, and the class argued about it for twenty minutes, and by the end of this she had barely started the first activity.

But something else had happened. The class had woken up. They were arguing, leaning forward, pointing at each other's ideas. Miss Johnson looked at them and understood, with a certainty she had not found in any lesson plan, that this was what it was supposed to feel like.

She did not rearrange her lesson plan that evening. She added something new: "Leave room for what the class brings." `,
    question: "What does the phrase \'this was what it was supposed to feel like\' suggest?",
    options: [
      "Miss Johnson had imagined teaching incorrectly and was now disappointed.",
      "Miss Johnson understood, through direct experience, something about good teaching that her training had not been able to give her.",
      "Miss Johnson decided to change careers after this lesson.",
      "Miss Johnson wanted all her future lessons to follow exactly this format.",
    ],
    correctAnswer: 1,
    explanation: "The phrase suggests an experiential insight — something that cannot be taught theoretically. The engaged, arguing class gave Miss Johnson a felt understanding of what good teaching aims for."
  },
  {
    id: 5,
    type: "reading",
    question: "What is the TONE of the first lesson passage?",
    options: [
      "Frightening and alarming",
      "Gently honest, reflective, and hopeful",
      "Critical of teacher training programmes",
      "Comedic and ironic",
    ],
    correctAnswer: 1,
    explanation: "The passage is written with honesty (Miss Johnson\'s fear), careful observation, and a hopeful note at the end. The tone is gently honest, reflective, and hopeful."
  },
  {
    id: 6,
    type: "reading",
    passage: `Technology in the Classroom: Tool or Distraction?

The widespread introduction of digital technology into Jamaican classrooms — tablets, laptops, interactive whiteboards, and internet connectivity — has generated considerable excitement and not a little controversy. Advocates argue that technology makes learning more engaging, provides access to vast educational resources, and prepares students for a digital economy. Sceptics worry that screens distract students, widen the gap between schools with good technology and those without, and may reduce the quality of deep thinking that difficult reading and writing develop.

The research on technology's impact on learning outcomes is more equivocal than either side acknowledges. Some studies show clear benefits: interactive content increases engagement, and students who access well-designed educational programmes show measurable gains in literacy and numeracy. Other studies find that devices in classrooms, when unguided, lead to more time on social media and games than on educational content.

The crucial variable, most researchers agree, is not the technology itself but the quality of teaching that surrounds it. A tablet in the hands of a skilled teacher becomes a powerful tool. The same tablet in an overcrowded classroom with an untrained or overstretched teacher is more likely to become a source of distraction. Technology amplifies teaching, for good or ill.

Jamaica's challenge is therefore not primarily technological. It is pedagogical — and it requires sustained investment not in devices, but in the teachers who use them.`,
    question: "What is the CENTRAL ARGUMENT of the technology in education passage?",
    options: [
      "Technology should be removed from Jamaican classrooms immediately.",
      "Technology alone determines how well students learn in school.",
      "The impact of technology on learning depends primarily on teaching quality — technology amplifies whatever is already happening in the classroom.",
      "Jamaican schools do not have enough technology to make a difference.",
    ],
    correctAnswer: 2,
    explanation: "The passage presents both sides, then concludes: \'The crucial variable is not the technology itself but the quality of teaching.\' The final paragraph confirms this — the challenge is pedagogical, not technological."
  },
  {
    id: 7,
    type: "reading",
    passage: `Technology in the Classroom: Tool or Distraction?

The widespread introduction of digital technology into Jamaican classrooms — tablets, laptops, interactive whiteboards, and internet connectivity — has generated considerable excitement and not a little controversy. Advocates argue that technology makes learning more engaging, provides access to vast educational resources, and prepares students for a digital economy. Sceptics worry that screens distract students, widen the gap between schools with good technology and those without, and may reduce the quality of deep thinking that difficult reading and writing develop.

The research on technology's impact on learning outcomes is more equivocal than either side acknowledges. Some studies show clear benefits: interactive content increases engagement, and students who access well-designed educational programmes show measurable gains in literacy and numeracy. Other studies find that devices in classrooms, when unguided, lead to more time on social media and games than on educational content.

The crucial variable, most researchers agree, is not the technology itself but the quality of teaching that surrounds it. A tablet in the hands of a skilled teacher becomes a powerful tool. The same tablet in an overcrowded classroom with an untrained or overstretched teacher is more likely to become a source of distraction. Technology amplifies teaching, for good or ill.

Jamaica's challenge is therefore not primarily technological. It is pedagogical — and it requires sustained investment not in devices, but in the teachers who use them.`,
    question: "What does \'EQUIVOCAL\' mean in the phrase \'the research on technology\'s impact is more equivocal than either side acknowledges\'?",
    options: [
      "Completely clear and one-sided",
      "Suggesting both positive and negative outcomes — not clearly pointing in one direction",
      "Entirely negative and discouraging",
      "Based on very limited data",
    ],
    correctAnswer: 1,
    explanation: "Equivocal means open to more than one interpretation — ambiguous or mixed. The research shows both benefits and harms, so it cannot be used to support either side\'s position completely."
  },
  {
    id: 8,
    type: "reading",
    passage: `Technology in the Classroom: Tool or Distraction?

The widespread introduction of digital technology into Jamaican classrooms — tablets, laptops, interactive whiteboards, and internet connectivity — has generated considerable excitement and not a little controversy. Advocates argue that technology makes learning more engaging, provides access to vast educational resources, and prepares students for a digital economy. Sceptics worry that screens distract students, widen the gap between schools with good technology and those without, and may reduce the quality of deep thinking that difficult reading and writing develop.

The research on technology's impact on learning outcomes is more equivocal than either side acknowledges. Some studies show clear benefits: interactive content increases engagement, and students who access well-designed educational programmes show measurable gains in literacy and numeracy. Other studies find that devices in classrooms, when unguided, lead to more time on social media and games than on educational content.

The crucial variable, most researchers agree, is not the technology itself but the quality of teaching that surrounds it. A tablet in the hands of a skilled teacher becomes a powerful tool. The same tablet in an overcrowded classroom with an untrained or overstretched teacher is more likely to become a source of distraction. Technology amplifies teaching, for good or ill.

Jamaica's challenge is therefore not primarily technological. It is pedagogical — and it requires sustained investment not in devices, but in the teachers who use them.`,
    question: "What does the passage mean when it says \'technology amplifies teaching, for good or ill\'?",
    options: [
      "Technology makes teaching louder and easier to hear.",
      "Technology makes both good and bad teaching more visible to students.",
      "Technology magnifies the effect of teaching — making good teaching better and poor teaching more problematic.",
      "Technology replaces teaching in some circumstances.",
    ],
    correctAnswer: 2,
    explanation: "Amplifies means magnifies or intensifies. If the teaching is good, technology makes it better; if the teaching is poor or unsupported, technology intensifies the problems. The phrase \'for good or ill\' signals both directions."
  },
  {
    id: 9,
    type: "reading",
    question: "What does \'PEDAGOGICAL\' mean in the final paragraph?",
    options: [
      "Related to financial investment in education",
      "Related to the physical buildings and infrastructure of schools",
      "Related to the science and practice of teaching",
      "Related to the technology and devices used in schools",
    ],
    correctAnswer: 2,
    explanation: "Pedagogical relates to pedagogy — the science, methods, and practice of teaching. The passage argues the challenge is about teaching quality, not technology."
  },
  {
    id: 10,
    type: "reading",
    question: "What concern do SCEPTICS of classroom technology raise, according to the passage?",
    options: [
      "They believe technology is too expensive for Jamaican schools.",
      "They worry about distractions, widening inequality between schools, and the risk of reducing deep thinking.",
      "They argue that teachers have not been trained to use new devices.",
      "They believe technology should only be used in secondary schools.",
    ],
    correctAnswer: 1,
    explanation: "The passage lists three sceptical concerns: \'screens distract students, widen the gap between schools, and may reduce the quality of deep thinking that difficult reading and writing develop.\'"
  },
  {
    id: 11,
    type: "vocabulary",
    question: "\"Miss Johnson was AFRAID but she had told no one this.\" What does this detail reveal about her?",
    options: [
      "She was dishonest and deceptive with her colleagues.",
      "She maintained a composed exterior while experiencing genuine internal vulnerability — a sign of professional courage.",
      "She had no friends she could confide in.",
      "She did not think fear was a normal response for teachers.",
    ],
    correctAnswer: 1,
    explanation: "Hiding her fear while proceeding confidently reveals professional courage — the ability to act despite internal vulnerability. This is different from dishonesty."
  },
  {
    id: 12,
    type: "vocabulary",
    question: "\"The research is more EQUIVOCAL than either side acknowledges.\" The word \'equivocal\' means —",
    options: [
      "entirely clear and unambiguous",
      "supporting only one conclusion",
      "mixed and open to more than one interpretation",
      "based on insufficient evidence",
    ],
    correctAnswer: 2,
    explanation: "Equivocal means ambiguous — open to more than one interpretation or pointing in more than one direction. The research shows both benefits and problems."
  },
  {
    id: 13,
    type: "vocabulary",
    question: "\"Technology AMPLIFIES teaching, for good or ill.\" The word \'amplifies\' means —",
    options: [
      "replaces and eliminates",
      "complicates and confuses",
      "makes more powerful or intense — magnifies the effect",
      "reduces and minimises",
    ],
    correctAnswer: 2,
    explanation: "To amplify means to make louder, more powerful, or more intense. Technology amplifies whatever teaching is already present."
  },
  {
    id: 14,
    type: "vocabulary",
    question: "\"The widespread introduction of technology has generated considerable CONTROVERSY.\" The word \'controversy\' means —",
    options: [
      "widespread agreement and enthusiasm",
      "a scientific experiment with inconclusive results",
      "public disagreement or debate about an issue",
      "a government programme to introduce new policies",
    ],
    correctAnswer: 2,
    explanation: "Controversy means public disagreement or debate — a situation where people hold strongly opposing views."
  },
  {
    id: 15,
    type: "vocabulary",
    question: "\"A tablet in the hands of a skilled teacher becomes a POWERFUL TOOL.\" The word \'tool\' is used here to mean —",
    options: [
      "a physical object used for construction work",
      "something used to achieve a purpose effectively",
      "a device manufactured in another country",
      "a toy designed for recreational use",
    ],
    correctAnswer: 1,
    explanation: "Tool in this context means something used as a means to achieve a purpose — here, effective teaching. It is a metaphor extending the physical meaning of \'tool\' to educational technology."
  },
  {
    id: 16,
    type: "vocabulary",
    question: "\"She had BARELY started the first activity.\" The word \'barely\' means —",
    options: [
      "confidently and successfully",
      "almost not at all — only just",
      "quickly and efficiently",
      "enthusiastically and completely",
    ],
    correctAnswer: 1,
    explanation: "Barely means only just — almost not. She had almost not started the first activity, having spent twenty minutes on the unexpected argument."
  },
  {
    id: 17,
    type: "vocabulary",
    question: "\"Leave room for WHAT THE CLASS BRINGS.\" What does this phrase mean?",
    options: [
      "The students should bring more stationery and equipment to class.",
      "The teacher should allow space in lessons for the students\' own questions, ideas, and energy.",
      "The teacher should give students more homework to bring back.",
      "Students should bring their own technology to school.",
    ],
    correctAnswer: 1,
    explanation: "\'What the class brings\' refers to the students\' own intellectual contributions — their questions, arguments, and energy — that the teacher had not planned for but which proved most valuable."
  },
  {
    id: 18,
    type: "vocabulary",
    question: "\"Students who access WELL-DESIGNED educational programmes show measurable gains.\" The phrase \'well-designed\' means —",
    options: [
      "expensive and recently purchased",
      "carefully planned to achieve specific educational objectives",
      "made by a famous technology company",
      "visually attractive and colourful",
    ],
    correctAnswer: 1,
    explanation: "Well-designed means carefully and thoughtfully planned — educational programmes that have been created with specific learning outcomes in mind."
  },
  {
    id: 19,
    type: "vocabulary",
    question: "\"Jamaica\'s challenge is PEDAGOGICAL — and requires investment in teachers.\" The word \'pedagogical\' relates to —",
    options: [
      "the purchase and installation of technology devices",
      "the financial management of school budgets",
      "the science and practice of teaching",
      "the construction and maintenance of school buildings",
    ],
    correctAnswer: 2,
    explanation: "Pedagogical relates to pedagogy — the art, science, and practice of teaching. The passage argues the real challenge is teaching quality, not technology."
  },
  {
    id: 20,
    type: "vocabulary",
    question: "\"By the end of this, she had BARELY started the first activity.\" What does this suggest about the lesson?",
    options: [
      "The lesson was a complete failure.",
      "Miss Johnson was not a good teacher.",
      "The unexpected discussion was so engaging and valuable that it consumed the planned time — suggesting it was more important than the activity.",
      "The students did not want to do the activities Miss Johnson had planned.",
    ],
    correctAnswer: 2,
    explanation: "The implication is not failure but unexpected success — the organic discussion was so valuable that it took all the planned time. The lesson exceeded its plan in a meaningful way."
  },
  {
    id: 21,
    type: "grammar",
    question: "Choose the sentence with CORRECT subject-verb agreement:",
    options: [
      "The quality of teaching in Jamaica\'s classrooms have improved significantly.",
      "The quality of teaching in Jamaica\'s classrooms has improved significantly.",
      "The quality of teaching in Jamaica\'s classrooms were improved significantly.",
      "The quality of teaching in Jamaica\'s classrooms are improved significantly.",
    ],
    correctAnswer: 1,
    explanation: "The subject is \'the quality,\' which is singular. The correct verb is \'has.\'"
  },
  {
    id: 22,
    type: "grammar",
    question: "Which sentence uses the PAST PERFECT correctly?",
    options: [
      "By the time the students began arguing, Miss Johnson already introduced her opening question.",
      "By the time the students began arguing, Miss Johnson had already introduced her opening question.",
      "By the time the students began arguing, Miss Johnson has already introduced her opening question.",
      "By the time the students began arguing, Miss Johnson was already introducing her opening question.",
    ],
    correctAnswer: 1,
    explanation: "The past perfect (\'had already introduced\') is required for an action completed before another past event."
  },
  {
    id: 23,
    type: "grammar",
    question: "Identify the SUBORDINATE CLAUSE: \'Although technology offers clear benefits, its impact depends on teaching quality.\'",
    options: [
      "its impact depends on teaching quality",
      "Although technology offers clear benefits",
      "technology offers clear benefits",
      "depends on teaching quality",
    ],
    correctAnswer: 1,
    explanation: "\'Although technology offers clear benefits\' is the subordinate clause — introduced by \'although\' and dependent on the main clause."
  },
  {
    id: 24,
    type: "grammar",
    question: "Which sentence demonstrates PARALLEL STRUCTURE?",
    options: [
      "Miss Johnson had prepared her opening question, a closing question, and she planned four activities.",
      "Miss Johnson had prepared her opening question, her closing question, and four activities.",
      "Miss Johnson had prepared her opening question, closing question that she had prepared, and to plan four activities.",
      "Miss Johnson had prepared her opening question, prepared a closing question, and four activities were planned.",
    ],
    correctAnswer: 1,
    explanation: "Parallel structure requires all items to use the same form. Option B uses three noun phrases: her opening question, her closing question, and four activities."
  },
  {
    id: 25,
    type: "grammar",
    question: "Which sentence is in the PASSIVE voice?",
    options: [
      "Miss Johnson had prepared her lesson plan carefully the night before.",
      "The boy in the third row answered with a question of his own.",
      "The lesson plan had been prepared carefully by Miss Johnson the night before.",
      "The class argued about the question for twenty minutes.",
    ],
    correctAnswer: 2,
    explanation: "In option C, \'the lesson plan\' (subject) receives the action \'had been prepared.\' This is the passive voice."
  },
  {
    id: 26,
    type: "grammar",
    question: "Choose the sentence that uses a RELATIVE CLAUSE correctly:",
    options: [
      "Technology in classrooms, which can be both a tool and a distraction requires careful management.",
      "Technology in classrooms, which can be both a tool and a distraction, requires careful management.",
      "Technology in classrooms which can be both a tool and a distraction, requires careful management.",
      "Technology in classrooms which can be both a tool and a distraction requires careful management.",
    ],
    correctAnswer: 1,
    explanation: "The non-restrictive relative clause \'which can be both a tool and a distraction\' must be enclosed by commas on both sides."
  },
  {
    id: 27,
    type: "grammar",
    question: "Choose the sentence that uses REPORTED SPEECH correctly:",
    options: [
      "Miss Johnson said that this is what it is supposed to feel like.",
      "Miss Johnson said that this was what it was supposed to feel like.",
      "Miss Johnson said that this had been what it had been supposed to feel like.",
      "Miss Johnson said that this will be what it is supposed to feel like.",
    ],
    correctAnswer: 1,
    explanation: "In reported speech, \'is\' (present) shifts back to \'was\' (past). Option B applies this correctly to both verbs."
  },
  {
    id: 28,
    type: "grammar",
    question: "Which sentence contains a MISPLACED MODIFIER?",
    options: [
      "Standing at the front of the classroom, Miss Johnson understood something new.",
      "Having prepared carefully the night before, the lesson still did not go as planned.",
      "Leaning forward eagerly, the students argued about the boy\'s question.",
      "Carefully prepared by Miss Johnson, the classroom was surprised by what the lesson became.",
    ],
    correctAnswer: 3,
    explanation: "In option D, \'carefully prepared by Miss Johnson\' should describe the lesson plan, but the sentence\'s subject is \'the classroom.\' The modifier is misplaced."
  },
  {
    id: 29,
    type: "grammar",
    question: "Choose the sentence that uses the SEMICOLON correctly:",
    options: [
      "Technology is a tool; but it is not a substitute for teaching.",
      "Technology is a tool; however, it is not a substitute for teaching.",
      "Technology is a tool; and skilled teachers use it well.",
      "Technology is a tool; therefore requiring skilled teachers to use it effectively.",
    ],
    correctAnswer: 1,
    explanation: "A semicolon followed by \'however\' and a comma is correct. Semicolons should not precede coordinating conjunctions like \'but\' or \'and.\'"
  },
  {
    id: 30,
    type: "grammar",
    question: "Which sentence has CORRECT subject-verb agreement?",
    options: [
      "Each of the students in Miss Johnson\'s class have their own way of learning.",
      "Each of the students in Miss Johnson\'s class has his or her own way of learning.",
      "Each of the students in Miss Johnson\'s class have his or her own way of learning.",
      "Each of the students in Miss Johnson\'s class are having their own way of learning.",
    ],
    correctAnswer: 1,
    explanation: "\'Each\' is always singular. The most formally precise option is \'has his or her own way.\'"
  },
  {
    id: 31,
    type: "grammar",
    question: "Choose the sentence that uses the SUBJUNCTIVE MOOD correctly:",
    options: [
      "It is essential that every teacher understands the needs of her students.",
      "It is essential that every teacher understand the needs of her students.",
      "It is essential that every teacher understood the needs of her students.",
      "It is essential that every teacher will understand the needs of her students.",
    ],
    correctAnswer: 1,
    explanation: "After \'it is essential that,\' the subjunctive requires the base form — \'understand,\' not \'understands,\' \'understood,\' or \'will understand.\'"
  },
  {
    id: 32,
    type: "grammar",
    question: "Choose the sentence with CORRECT punctuation:",
    options: [
      "The class argued leaned forward and pointed at each other\'s ideas.",
      "The class argued, leaned forward, and pointed at each other\'s ideas.",
      "The class argued, leaned forward and pointed at each other\'s ideas.",
      "The class, argued, leaned forward, and pointed at each other\'s ideas.",
    ],
    correctAnswer: 1,
    explanation: "Items in a list of three or more must be separated by commas. Option B correctly places a comma after each item."
  },
  {
    id: 33,
    type: "writing",
    question: "Which is the BEST topic sentence for a paragraph arguing that investment in teacher training matters more than investment in devices?",
    options: [
      "Jamaica has many schools that need better technology.",
      "Many studies have been done on the effects of technology in classrooms.",
      "No tablet, however sophisticated, can substitute for the judgement of a skilled teacher — and until Jamaica invests as seriously in developing teaching quality as it does in purchasing devices, technology will amplify existing inequalities rather than reduce them.",
      "Teacher training is important in Jamaica.",
    ],
    correctAnswer: 2,
    explanation: "Option C makes a clear, specific argument, uses a precise contrast (\'tablet vs. skilled teacher\'), and frames the stakes clearly (\'amplify existing inequalities\') — ideal for a persuasive topic sentence."
  },
  {
    id: 34,
    type: "writing",
    question: "Which word is spelled CORRECTLY?",
    options: [
      "reccomend",
      "recomend",
      "recommend",
      "recommand",
    ],
    correctAnswer: 2,
    explanation: "The correct spelling is recommend — r-e-c-o-m-m-e-n-d. One \'c\' and double \'m.\'"
  },
  {
    id: 35,
    type: "writing",
    question: "Which sentence should be REMOVED from this paragraph? \'Miss Johnson learned her most important lesson not from her training but from her first class. When the students began arguing about an unexpected question, she realised that engagement cannot always be planned. The population of Kingston is approximately one million people. The note she added to her plan — leave room for what the class brings — was the best teaching advice she ever gave herself.\'",
    options: [
      "When the students began arguing about an unexpected question, she realised that engagement cannot always be planned.",
      "The note she added to her plan — leave room for what the class brings — was the best teaching advice she ever gave herself.",
      "The population of Kingston is approximately one million people.",
      "Miss Johnson learned her most important lesson not from her training but from her first class.",
    ],
    correctAnswer: 2,
    explanation: "The paragraph is about Miss Johnson\'s teaching insight. The sentence about Kingston\'s population is completely off-topic."
  },
  {
    id: 36,
    type: "writing",
    question: "Which revision BEST improves this sentence? Original: \'Technology in schools can be good or bad depending on how it is used.\'",
    options: [
      "Technology in schools can be good or bad and it really depends on how people use it.",
      "Technology in schools is sometimes good and sometimes bad.",
      "Technology in the classroom is neither inherently good nor inherently bad — it is a multiplier that makes skilled teaching more powerful and poor teaching more problematic, reflecting whatever is already happening in the room.",
      "Technology can help students learn or distract them, depending on how it is used.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses precise vocabulary (\'inherently,\' \'multiplier\'), makes the mechanism specific (\'makes skilled teaching more powerful and poor teaching more problematic\'), and ends with a memorable, accurate image."
  },
  {
    id: 37,
    type: "writing",
    question: "Which sentence demonstrates the MOST EFFECTIVE use of a CONCESSION in a discussion of technology in education?",
    options: [
      "Some people think technology is good for schools, but they don\'t know about the problems.",
      "Technology has benefits but also many serious problems that outweigh the benefits.",
      "While research clearly shows that well-designed educational technology can improve literacy and numeracy outcomes, these gains are contingent on skilled pedagogical guidance — without which, the same devices become vectors for distraction rather than learning.",
      "Technology can help students, but teachers need training to use it properly.",
    ],
    correctAnswer: 2,
    explanation: "Option C concedes the genuine benefit (\'research clearly shows... improve literacy and numeracy\'), then presents a precise condition (\'contingent on skilled pedagogical guidance\') and a specific consequence of failure (\'vectors for distraction\') — the structure of effective academic concession."
  },
  {
    id: 38,
    type: "writing",
    question: "A student wrote: \'Miss Johnson\'s first lesson did not go as planned but she learned a lot.\' What is the MOST EFFECTIVE revision?",
    options: [
      "Miss Johnson\'s first lesson did not go as planned, but she still learned many important things from it.",
      "Even though the lesson did not go as planned, Miss Johnson learned a lot from the experience.",
      "When the lesson broke free from Miss Johnson\'s plan — when the class woke up and began arguing with genuine conviction — she learned something no lesson plan could have taught her: that the best teaching leaves room for what the students themselves bring.",
      "The lesson was not what Miss Johnson planned but it was still a good learning experience for her.",
    ],
    correctAnswer: 2,
    explanation: "Option C uses the passage\'s own language (\'broke free,\' \'woke up\'), is specific about what she learned (\'leaves room for what the students themselves bring\'), and frames it as an insight beyond planning — far superior to the flat original."
  },
  {
    id: 39,
    type: "writing",
    question: "Which is the MOST EFFECTIVE closing sentence for a paragraph about what teaching requires beyond technical preparation?",
    options: [
      "Teachers need to be well prepared for their lessons.",
      "Good teacher training programmes are important for all new teachers.",
      "The most important lesson a teacher can ever learn is that a classroom is not a document to be executed — it is a room full of real people who will bring things you could not have planned for, and your greatest skill is learning to welcome them.",
      "Miss Johnson became a better teacher after her first lesson.",
    ],
    correctAnswer: 2,
    explanation: "Option C is philosophically rich, distinguishes between \'a document\' and \'real people,\' and ends with a memorable, actionable insight (\'your greatest skill is learning to welcome them\') — ideal for a closing sentence."
  },
  {
    id: 40,
    type: "writing",
    question: "Which of the following BEST describes the difference between ANALYSIS and DESCRIPTION in writing?",
    options: [
      "Description uses longer sentences; analysis uses shorter ones.",
      "Description tells what something looks like; analysis is used only in science essays.",
      "Description records what something is; analysis explains what it means, why it matters, or how it works.",
      "Description is used in creative writing; analysis is used only in persuasive essays.",
    ],
    correctAnswer: 2,
    explanation: "Description records observable details — what something is or looks like. Analysis goes further: it explains significance, meaning, and causality. Option C correctly captures this distinction."
  }
]

export default function LiteracyMixed10MockTest() {
  const { isPremium, user } = useAuth()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(60 * 60)
  const [showReview, setShowReview] = useState(false)
  const [completedAt, setCompletedAt] = useState("")

  const availableQuestions = isPremium ? literacyMixed10Questions : literacyMixed10Questions.slice(0, FREE_QUESTION_LIMIT)
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
              <CardTitle className="text-2xl text-sky-800">Literacy Mixed 10</CardTitle>
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
              <p className="text-gray-600 mt-2">Grade 4 PEP Literacy Mixed 10</p>
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
                    <CardTitle className="text-2xl text-sky-800 mt-1">Grade 4 PEP Literacy Mixed 10 Report</CardTitle>
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
                <h1 className="text-lg font-bold">Literacy Mixed 10</h1>
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
