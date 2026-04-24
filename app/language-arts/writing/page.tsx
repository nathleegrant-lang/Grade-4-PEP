"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Pencil, CheckCircle, Lightbulb, ArrowRight, RotateCcw, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type WritingType = "paragraph" | "letter" | "story" | "description"

interface WritingPrompt {
  id: number
  title: string
  prompt: string
  hints: string[]
  checklist: string[]
  wordGoal: number
  exampleStart?: string
}

const paragraphPrompts: WritingPrompt[] = [
  {
    id: 1,
    title: "My Favourite Food",
    prompt: "Write a paragraph about your favourite Jamaican food. Describe how it looks, smells, and tastes. Tell why you love it.",
    hints: [
      "Start with a topic sentence that tells what your favourite food is",
      "Use describing words (adjectives) to paint a picture",
      "Include why this food is special to you"
    ],
    checklist: ["Topic sentence", "At least 3 describing words", "A closing sentence", "Correct punctuation"],
    wordGoal: 50,
    exampleStart: "My favourite Jamaican food is..."
  },
  {
    id: 2,
    title: "A Special Place",
    prompt: "Write a paragraph about a special place in Jamaica that you have visited or would like to visit. Describe what makes it special.",
    hints: [
      "Name the place in your first sentence",
      "Describe what you can see, hear, and feel there",
      "Explain why this place is important to you"
    ],
    checklist: ["Clear topic sentence", "Sensory details (see, hear, feel)", "Personal connection", "Proper capitalization"],
    wordGoal: 60
  }
]

const letterPrompts: WritingPrompt[] = [
  {
    id: 1,
    title: "Thank You Letter",
    prompt: "Write a letter to someone who helped you. It could be a teacher, family member, or friend. Thank them and tell them why their help was important.",
    hints: [
      "Start with a greeting (Dear ____,)",
      "Say thank you in the first paragraph",
      "Explain what they did to help you",
      "End with a proper closing (Yours sincerely,)"
    ],
    checklist: ["Proper greeting", "Date at the top", "Clear message of thanks", "Proper closing and signature"],
    wordGoal: 70,
    exampleStart: "Dear ____,\n\nI am writing to thank you for..."
  },
  {
    id: 2,
    title: "Letter to a Friend",
    prompt: "Write a letter to a friend telling them about something exciting that happened to you recently. It could be a trip, a celebration, or a new experience.",
    hints: [
      "Use a friendly greeting",
      "Share your exciting news in detail",
      "Ask your friend a question about their life",
      "End by saying you hope to hear from them"
    ],
    checklist: ["Friendly greeting", "Details about your experience", "Question for your friend", "Proper closing"],
    wordGoal: 80
  }
]

const storyPrompts: WritingPrompt[] = [
  {
    id: 1,
    title: "The Mysterious Sound",
    prompt: "One night, you heard a strange sound coming from your backyard. Write a story about what happened when you went to investigate.",
    hints: [
      "Set the scene - describe the night",
      "Build suspense - what did the sound seem like?",
      "Include a character (you or someone else)",
      "Have a beginning, middle, and end"
    ],
    checklist: ["Interesting beginning", "Description of the setting", "Clear sequence of events", "Satisfying ending"],
    wordGoal: 100,
    exampleStart: "It was a dark and quiet night when I suddenly heard..."
  },
  {
    id: 2,
    title: "An Anansi Adventure",
    prompt: "Write a story about Anansi the Spider learning an important lesson. What trick does Anansi try, and what does he learn?",
    hints: [
      "Introduce Anansi and his personality",
      "Describe the trick he wants to play",
      "Show what happens because of the trick",
      "End with the lesson Anansi learns"
    ],
    checklist: ["Character introduction", "Problem or conflict", "Events in order", "Lesson or moral"],
    wordGoal: 100
  }
]

const descriptionPrompts: WritingPrompt[] = [
  {
    id: 1,
    title: "A Person I Admire",
    prompt: "Write a description of someone you admire. Describe how they look, but also describe their personality and why you look up to them.",
    hints: [
      "Start by telling who the person is",
      "Describe their physical appearance",
      "Describe their personality traits",
      "Explain why you admire them"
    ],
    checklist: ["Introduction of the person", "Physical description", "Personality description", "Reason for admiration"],
    wordGoal: 70
  },
  {
    id: 2,
    title: "A Rainy Day",
    prompt: "Describe a rainy day in Jamaica. Use all your senses to bring the scene to life - what do you see, hear, smell, and feel?",
    hints: [
      "Describe the sky and clouds",
      "Include the sounds of rain",
      "Mention the smell of rain on the earth",
      "Tell how the rain makes you feel"
    ],
    checklist: ["Visual details", "Sound descriptions", "Other senses (smell, feel)", "Mood or atmosphere"],
    wordGoal: 60
  }
]

const writingTypes = [
  { id: "paragraph" as WritingType, title: "Paragraph Writing", description: "Write clear, organized paragraphs", color: "bg-sky-500", icon: "P" },
  { id: "letter" as WritingType, title: "Letter Writing", description: "Write formal and informal letters", color: "bg-blue-500", icon: "L" },
  { id: "story" as WritingType, title: "Creative Stories", description: "Write imaginative narratives", color: "bg-purple-500", icon: "S" },
  { id: "description" as WritingType, title: "Descriptive Writing", description: "Paint pictures with words", color: "bg-amber-500", icon: "D" },
]

export default function WritingPage() {
  const [selectedType, setSelectedType] = useState<WritingType | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [userWriting, setUserWriting] = useState("")
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState<boolean[]>([])
  const [submitted, setSubmitted] = useState(false)

  const getPrompts = (type: WritingType): WritingPrompt[] => {
    switch (type) {
      case "paragraph": return paragraphPrompts
      case "letter": return letterPrompts
      case "story": return storyPrompts
      case "description": return descriptionPrompts
    }
  }

  const prompts = selectedType ? getPrompts(selectedType) : []
  const currentPrompt = prompts[currentPromptIndex]

  const wordCount = userWriting.trim() ? userWriting.trim().split(/\s+/).length : 0

  const handleStartWriting = (type: WritingType) => {
    setSelectedType(type)
    setCurrentPromptIndex(0)
    setUserWriting("")
    setShowChecklist(false)
    setChecklistItems([])
    setSubmitted(false)
  }

  const handleSubmit = () => {
    setShowChecklist(true)
    setChecklistItems(new Array(currentPrompt.checklist.length).fill(false))
    setSubmitted(true)
  }

  const toggleChecklistItem = (index: number) => {
    const newItems = [...checklistItems]
    newItems[index] = !newItems[index]
    setChecklistItems(newItems)
  }

  const handleNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
      setUserWriting("")
      setShowChecklist(false)
      setChecklistItems([])
      setSubmitted(false)
    }
  }

  const handleReset = () => {
    setUserWriting("")
    setShowChecklist(false)
    setChecklistItems([])
    setSubmitted(false)
  }

  const goToTypeSelection = () => {
    setSelectedType(null)
    handleReset()
    setCurrentPromptIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/language-arts">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Language Arts
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Pencil className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Writing Skills</h2>
            <p className="text-gray-600">Practice different types of writing</p>
          </div>
        </div>

        {/* Type Selection */}
        {!selectedType && (
          <div className="space-y-6">
            <Card className="border-purple-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-slate-800">Choose a Writing Activity</CardTitle>
                <CardDescription>Select the type of writing you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {writingTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleStartWriting(type.id)}
                      className={`p-6 rounded-lg text-white text-left transition-transform hover:scale-105 ${type.color}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                          {type.icon}
                        </span>
                        <h3 className="text-xl font-bold">{type.title}</h3>
                      </div>
                      <p className="text-white/90">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Writing Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Plan before you write - think about what you want to say.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Use interesting words to make your writing come alive.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Read your work aloud to catch mistakes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>Check your spelling and punctuation before finishing.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Writing Activity */}
        {selectedType && currentPrompt && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge className={writingTypes.find(t => t.id === selectedType)?.color}>
                {writingTypes.find(t => t.id === selectedType)?.title}
              </Badge>
              <span className="text-gray-600">
                Prompt {currentPromptIndex + 1} of {prompts.length}
              </span>
            </div>

            {/* Writing Prompt */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-slate-800">{currentPrompt.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700">{currentPrompt.prompt}</p>

                {/* Hints */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                    <Lightbulb className="h-5 w-5" />
                    Writing Hints
                  </div>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    {currentPrompt.hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>

                {currentPrompt.exampleStart && !userWriting && (
                  <p className="text-gray-500 italic">Example start: &quot;{currentPrompt.exampleStart}&quot;</p>
                )}
              </CardContent>
            </Card>

            {/* Writing Area */}
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">Your Writing</CardTitle>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${wordCount >= currentPrompt.wordGoal ? "text-sky-600" : "text-gray-500"}`}>
                      {wordCount} / {currentPrompt.wordGoal} words
                    </span>
                    <Progress 
                      value={Math.min((wordCount / currentPrompt.wordGoal) * 100, 100)} 
                      className="w-24 h-2"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={userWriting}
                  onChange={(e) => setUserWriting(e.target.value)}
                  placeholder="Start writing here..."
                  className="min-h-[200px] text-lg leading-relaxed"
                  disabled={submitted}
                />

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goToTypeSelection}>
                    Change Activity
                  </Button>
                  {!submitted ? (
                    <Button 
                      onClick={handleSubmit} 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={wordCount < 10}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Writing
                    </Button>
                  ) : (
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Write Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Self-Check Checklist */}
            {showChecklist && (
              <Card className="border-sky-200 bg-sky-50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Self-Check: Review Your Writing
                  </CardTitle>
                  <CardDescription>
                    Check each item that you included in your writing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPrompt.checklist.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleChecklistItem(index)}
                      className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                        checklistItems[index]
                          ? "border-sky-500 bg-sky-100"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        checklistItems[index]
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-gray-300"
                      }`}>
                        {checklistItems[index] && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <span className={checklistItems[index] ? "text-sky-800" : "text-gray-700"}>
                        {item}
                      </span>
                    </button>
                  ))}

                  <div className="pt-4 border-t border-sky-200">
                    <p className="text-sky-800 font-medium">
                      {checklistItems.filter(Boolean).length === currentPrompt.checklist.length
                        ? "Excellent! You included all the important parts!"
                        : `You checked ${checklistItems.filter(Boolean).length} of ${currentPrompt.checklist.length} items. Look at the unchecked items to improve your writing.`}
                    </p>
                  </div>

                  {currentPromptIndex < prompts.length - 1 && (
                    <Button onClick={handleNextPrompt} className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
                      Try Next Prompt
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
