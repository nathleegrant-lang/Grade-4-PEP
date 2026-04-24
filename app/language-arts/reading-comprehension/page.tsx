"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Trophy,
  Star,
  BookMarked
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Passage {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Challenging"
  content: string
  questions: Question[]
}

const passages: Passage[] = [
  {
    id: 1,
    title: "The Hummingbird of Jamaica",
    difficulty: "Easy",
    content: `The Doctor Bird is Jamaica's national bird. It is a type of hummingbird with beautiful long tail feathers that stream behind it when it flies. The Doctor Bird got its name because its long black tail looks like a doctor's coat from long ago.

This tiny bird is very special. It can fly forwards, backwards, and even hover in one spot! The Doctor Bird drinks nectar from flowers using its long, curved beak. It visits many flowers each day to find food.

You can find Doctor Birds in gardens and forests all over Jamaica. They build tiny nests using soft materials like spider webs and plant fibers. The mother bird lays two small white eggs and keeps them warm until they hatch.

Jamaicans are very proud of their national bird. You can see the Doctor Bird on Jamaica's coat of arms and on the country's currency. It reminds us of the beauty of our island home.`,
    questions: [
      {
        id: 1,
        question: "What is the Doctor Bird?",
        options: [
          "A type of parrot",
          "Jamaica's national bird",
          "A doctor who studies birds",
          "A large eagle"
        ],
        correctAnswer: 1,
        explanation: "The passage states that 'The Doctor Bird is Jamaica's national bird.'"
      },
      {
        id: 2,
        question: "Why is the hummingbird called the Doctor Bird?",
        options: [
          "Because it helps sick birds",
          "Because it was discovered by a doctor",
          "Because its long tail looks like a doctor's coat",
          "Because it lives near hospitals"
        ],
        correctAnswer: 2,
        explanation: "The passage explains that 'The Doctor Bird got its name because its long black tail looks like a doctor's coat from long ago.'"
      },
      {
        id: 3,
        question: "What does the Doctor Bird eat?",
        options: [
          "Small insects only",
          "Seeds from trees",
          "Nectar from flowers",
          "Fish from rivers"
        ],
        correctAnswer: 2,
        explanation: "According to the passage, 'The Doctor Bird drinks nectar from flowers using its long, curved beak.'"
      },
      {
        id: 4,
        question: "What special ability does the Doctor Bird have?",
        options: [
          "It can swim underwater",
          "It can fly backwards and hover",
          "It can change colors",
          "It can talk like a parrot"
        ],
        correctAnswer: 1,
        explanation: "The passage tells us that 'It can fly forwards, backwards, and even hover in one spot!'"
      },
      {
        id: 5,
        question: "Where can you see the Doctor Bird symbol?",
        options: [
          "Only in museums",
          "On Jamaica's coat of arms and currency",
          "Only in schools",
          "Only in hospitals"
        ],
        correctAnswer: 1,
        explanation: "The passage states that 'You can see the Doctor Bird on Jamaica's coat of arms and on the country's currency.'"
      }
    ]
  },
  {
    id: 2,
    title: "A Day at the Market",
    difficulty: "Easy",
    content: `Every Saturday morning, Keisha and her grandmother visit the market in their town. The market is a busy, exciting place filled with colors, sounds, and delicious smells.

As they walk through the market, Keisha sees tables piled high with fruits. There are yellow bananas, green june plums, and sweet oranges. Her grandmother stops to buy ackee, Jamaica's national fruit, which they will cook for breakfast.

The market is very noisy. Vendors call out to shoppers, trying to sell their goods. "Fresh fish! Get your fresh fish here!" shouts one man. A woman selling spices waves to Grandmother and says, "Miss Ivy, I have the best scotch bonnet peppers today!"

Keisha's favorite part is the craft section where people sell handmade items. She loves looking at the colorful baskets woven from straw and the wooden carvings of animals. Her grandmother buys her a small wooden turtle as a special treat.

By noon, their bags are full of good things. Keisha helps carry the lighter bags as they walk home. She looks forward to next Saturday when they can visit the market again.`,
    questions: [
      {
        id: 1,
        question: "When do Keisha and her grandmother visit the market?",
        options: [
          "Every Sunday afternoon",
          "Every Saturday morning",
          "Once a month",
          "Every day after school"
        ],
        correctAnswer: 1,
        explanation: "The passage begins with 'Every Saturday morning, Keisha and her grandmother visit the market.'"
      },
      {
        id: 2,
        question: "What is Jamaica's national fruit mentioned in the story?",
        options: [
          "Banana",
          "Orange",
          "Ackee",
          "June plum"
        ],
        correctAnswer: 2,
        explanation: "The passage states that grandmother buys 'ackee, Jamaica's national fruit.'"
      },
      {
        id: 3,
        question: "What does the woman selling spices call Keisha's grandmother?",
        options: [
          "Mrs. Brown",
          "Miss Ivy",
          "Grandma",
          "Aunty"
        ],
        correctAnswer: 1,
        explanation: "The vendor calls out 'Miss Ivy, I have the best scotch bonnet peppers today!'"
      },
      {
        id: 4,
        question: "What does Keisha's grandmother buy her as a special treat?",
        options: [
          "A colorful basket",
          "Fresh fish",
          "A small wooden turtle",
          "Scotch bonnet peppers"
        ],
        correctAnswer: 2,
        explanation: "The passage says 'Her grandmother buys her a small wooden turtle as a special treat.'"
      },
      {
        id: 5,
        question: "Which word best describes how the market is presented in the story?",
        options: [
          "Quiet and empty",
          "Dark and scary",
          "Busy and exciting",
          "Small and boring"
        ],
        correctAnswer: 2,
        explanation: "The passage describes the market as 'a busy, exciting place filled with colors, sounds, and delicious smells.'"
      }
    ]
  },
  {
    id: 3,
    title: "The Great Earthquake of 1692",
    difficulty: "Medium",
    content: `Long ago, Port Royal was one of the richest cities in the world. Located at the tip of a peninsula in Jamaica, it was home to merchants, sailors, and people from many countries. Ships from around the world would stop there to trade goods like sugar, spices, and precious metals.

On June 7, 1692, disaster struck. At about noon, a powerful earthquake shook the city. The ground cracked open, and buildings tumbled down. But the worst was yet to come. Because Port Royal was built on sandy ground near the sea, much of the city began to sink into the water.

Within minutes, two-thirds of the city had disappeared beneath the waves. Ships in the harbor were tossed about like toys. Thousands of people lost their lives that day. Those who survived described seeing streets and buildings slide into the sea.

After the earthquake, people tried to rebuild Port Royal, but it was never the same. Another earthquake in 1907 caused more damage. Today, the old city lies beneath the sea, and divers sometimes explore its ruins.

Scientists have learned much from studying what happened at Port Royal. The disaster teaches us about the power of nature and how quickly things can change. It also reminds us to build carefully and be prepared for emergencies.`,
    questions: [
      {
        id: 1,
        question: "What made Port Royal special before the earthquake?",
        options: [
          "It had the best beaches",
          "It was one of the richest cities in the world",
          "It was the capital of Jamaica",
          "It had the largest population"
        ],
        correctAnswer: 1,
        explanation: "The passage states that 'Port Royal was one of the richest cities in the world.'"
      },
      {
        id: 2,
        question: "When did the great earthquake happen?",
        options: [
          "June 7, 1907",
          "June 7, 1692",
          "July 6, 1692",
          "June 17, 1692"
        ],
        correctAnswer: 1,
        explanation: "The passage clearly states 'On June 7, 1692, disaster struck.'"
      },
      {
        id: 3,
        question: "Why did so much of Port Royal sink into the sea?",
        options: [
          "Because of a big wave",
          "Because it was built on sandy ground near the sea",
          "Because the buildings were too heavy",
          "Because of heavy rain"
        ],
        correctAnswer: 1,
        explanation: "The passage explains that 'Because Port Royal was built on sandy ground near the sea, much of the city began to sink into the water.'"
      },
      {
        id: 4,
        question: "How much of the city disappeared?",
        options: [
          "One-third",
          "Half",
          "Two-thirds",
          "All of it"
        ],
        correctAnswer: 2,
        explanation: "According to the passage, 'two-thirds of the city had disappeared beneath the waves.'"
      },
      {
        id: 5,
        question: "What is one lesson the passage says we can learn from Port Royal?",
        options: [
          "Never live near the ocean",
          "Earthquakes only happen once",
          "To build carefully and be prepared for emergencies",
          "Port Royal will be rebuilt soon"
        ],
        correctAnswer: 2,
        explanation: "The passage concludes that the disaster 'reminds us to build carefully and be prepared for emergencies.'"
      }
    ]
  },
  {
    id: 4,
    title: "How Anansi Got His Stories",
    difficulty: "Medium",
    content: `Long ago, all the stories in the world belonged to Nyame, the Sky God. People had no stories to tell at night, and children had no tales to hear before bed. Anansi the Spider thought this was very unfair.

One day, Anansi climbed up to the sky to visit Nyame. "Please," said Anansi, "will you give me your stories to share with the people of Earth?"

Nyame laughed. "Many have asked for my stories, but the price is very high. You must bring me three things: Onini the python, Osebo the leopard, and Mmoboro the hornets. If you can capture all three, the stories will be yours."

Anansi was small, but he was very clever. First, he cut a long bamboo pole and some vines. He walked to where Onini lived, pretending to argue with himself about whether the python was longer than the pole. Curious, Onini stretched out beside the pole to prove his length. Quick as a flash, Anansi tied him to the pole!

Next, Anansi dug a deep pit and covered it with branches. Osebo the leopard fell right in! Anansi offered to help him out with a bent tree branch, but when Osebo grabbed it, the branch snapped up and trapped him in its vines.

Finally, Anansi filled a gourd with water and poured it over the hornets' nest, holding a calabash over his head. "Quick, fly into my calabash to escape the rain!" he called. When all the hornets were inside, he sealed it shut.

Anansi brought all three to Nyame, who was amazed. "From this day forward," declared Nyame, "all stories will be called Anansi Stories." And that is why, to this day, we tell Anansi tales.`,
    questions: [
      {
        id: 1,
        question: "Who owned all the stories at the beginning?",
        options: [
          "Anansi the Spider",
          "The people of Earth",
          "Nyame, the Sky God",
          "Onini the python"
        ],
        correctAnswer: 2,
        explanation: "The passage states that 'all the stories in the world belonged to Nyame, the Sky God.'"
      },
      {
        id: 2,
        question: "What three things did Anansi need to bring to Nyame?",
        options: [
          "Gold, silver, and diamonds",
          "A python, a leopard, and hornets",
          "Three magic stones",
          "Food, water, and fire"
        ],
        correctAnswer: 1,
        explanation: "Nyame asked for 'Onini the python, Osebo the leopard, and Mmoboro the hornets.'"
      },
      {
        id: 3,
        question: "How did Anansi trick the python?",
        options: [
          "By offering him food",
          "By challenging him to a race",
          "By making him curious about whether he was longer than a pole",
          "By pretending to be his friend"
        ],
        correctAnswer: 2,
        explanation: "Anansi pretended to argue about 'whether the python was longer than the pole,' making Onini curious enough to stretch out beside it."
      },
      {
        id: 4,
        question: "What quality helped Anansi succeed?",
        options: [
          "His great strength",
          "His cleverness",
          "His speed",
          "His size"
        ],
        correctAnswer: 1,
        explanation: "The passage states that 'Anansi was small, but he was very clever' and describes how he used tricks to capture each creature."
      },
      {
        id: 5,
        question: "Why are folk tales called 'Anansi Stories'?",
        options: [
          "Because Anansi wrote them all",
          "Because Anansi earned the right to own all stories",
          "Because Anansi is the most popular character",
          "Because Anansi lived the longest"
        ],
        correctAnswer: 1,
        explanation: "Nyame declared that all stories would be called Anansi Stories because Anansi successfully completed the challenge to earn them."
      }
    ]
  },
  {
    id: 5,
    title: "Protecting Our Coral Reefs",
    difficulty: "Challenging",
    content: `Jamaica is surrounded by beautiful coral reefs that stretch along our coastline. These underwater structures may look like colorful rocks or plants, but they are actually built by tiny animals called coral polyps. Over thousands of years, these creatures have created massive reef systems that are home to countless sea creatures.

Coral reefs are sometimes called the "rainforests of the sea" because they support so much life. Fish of every color swim among the coral branches. Sea turtles glide by, while spiny lobsters hide in rocky crevices. Scientists estimate that coral reefs provide homes for about one-quarter of all ocean species, even though they cover less than one percent of the ocean floor.

Unfortunately, Jamaica's coral reefs are in danger. Pollution from the land washes into the sea, making the water dirty and harmful to coral. When the ocean gets too warm due to climate change, coral can become stressed and turn white—a process called bleaching. Overfishing removes important species that help keep the reef healthy.

There is hope, however. Marine protected areas have been established where fishing is limited and reefs can recover. Scientists are growing coral in nurseries and transplanting them to damaged areas. Schools across Jamaica are teaching students about reef conservation.

Everyone can help protect our coral reefs. We can reduce pollution by properly disposing of trash and chemicals. When swimming near reefs, we should never touch or stand on coral. By making small changes in our daily lives, we can help ensure that Jamaica's beautiful coral reefs survive for future generations to enjoy.`,
    questions: [
      {
        id: 1,
        question: "What are coral reefs actually built by?",
        options: [
          "Underwater plants",
          "Tiny animals called coral polyps",
          "Volcanic rocks",
          "Sand and shells"
        ],
        correctAnswer: 1,
        explanation: "The passage explains that coral reefs 'are actually built by tiny animals called coral polyps.'"
      },
      {
        id: 2,
        question: "Why are coral reefs called the 'rainforests of the sea'?",
        options: [
          "Because they have lots of rain",
          "Because they are very tall",
          "Because they support so much life",
          "Because they have many trees"
        ],
        correctAnswer: 2,
        explanation: "The passage states they are called this 'because they support so much life.'"
      },
      {
        id: 3,
        question: "What is coral bleaching?",
        options: [
          "When people clean the coral",
          "When coral turns white due to warm water stress",
          "When coral grows new colors",
          "When coral moves to a new location"
        ],
        correctAnswer: 1,
        explanation: "The passage explains that 'When the ocean gets too warm due to climate change, coral can become stressed and turn white—a process called bleaching.'"
      },
      {
        id: 4,
        question: "What percentage of ocean species do coral reefs support?",
        options: [
          "One percent",
          "Ten percent",
          "About one-quarter (25%)",
          "Half (50%)"
        ],
        correctAnswer: 2,
        explanation: "The passage states that 'coral reefs provide homes for about one-quarter of all ocean species.'"
      },
      {
        id: 5,
        question: "Based on the passage, which action would NOT help protect coral reefs?",
        options: [
          "Properly disposing of trash",
          "Never touching or standing on coral",
          "Supporting marine protected areas",
          "Collecting coral pieces as souvenirs"
        ],
        correctAnswer: 3,
        explanation: "The passage says we should 'never touch or stand on coral,' so collecting coral pieces would harm the reefs. All other options are ways to help protect reefs mentioned in the passage."
      }
    ]
  }
]

export default function ReadingComprehensionPage() {
  const [selectedPassage, setSelectedPassage] = useState<Passage | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])
  const [showResults, setShowResults] = useState(false)

  const startPassage = (passage: Passage) => {
    setSelectedPassage(passage)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setAnsweredQuestions(new Array(passage.questions.length).fill(false))
    setShowResults(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !selectedPassage) return
    setIsAnswered(true)
    
    const isCorrect = selectedAnswer === selectedPassage.questions[currentQuestionIndex].correctAnswer
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    const newAnswered = [...answeredQuestions]
    newAnswered[currentQuestionIndex] = isCorrect
    setAnsweredQuestions(newAnswered)
  }

  const handleNextQuestion = () => {
    if (!selectedPassage) return
    
    if (currentQuestionIndex < selectedPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestartPassage = () => {
    if (selectedPassage) {
      startPassage(selectedPassage)
    }
  }

  const handleBackToPassages = () => {
    setSelectedPassage(null)
    setShowResults(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-slate-800 border-green-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Challenging": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreMessage = () => {
    if (!selectedPassage) return ""
    const percentage = (score / selectedPassage.questions.length) * 100
    if (percentage === 100) return "Perfect Score! You are a reading superstar!"
    if (percentage >= 80) return "Excellent work! You understood the passage very well!"
    if (percentage >= 60) return "Good job! Keep practicing to improve!"
    if (percentage >= 40) return "Nice try! Read the passage again for better understanding."
    return "Keep practicing! Reading gets easier with more practice."
  }

  const currentQuestion = selectedPassage?.questions[currentQuestionIndex]
  const progress = selectedPassage 
    ? ((currentQuestionIndex + (isAnswered ? 1 : 0)) / selectedPassage.questions.length) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <BookMarked className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Reading Comprehension</h2>
              <p className="text-emerald-100">Practice reading passages and answering questions</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/language-arts">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Language Arts
          </Button>
        </Link>

        {!selectedPassage ? (
          <>
            {/* Instructions */}
            <Card className="mb-8 border-sky-200 bg-white/90">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  How to Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p><span className="font-semibold text-slate-700">1.</span> Choose a passage below to read.</p>
                <p><span className="font-semibold text-slate-700">2.</span> Read the passage carefully - you can read it as many times as you need.</p>
                <p><span className="font-semibold text-slate-700">3.</span> Answer the questions about what you read.</p>
                <p><span className="font-semibold text-slate-700">4.</span> Check your answers and learn from the explanations.</p>
              </CardContent>
            </Card>

            {/* Passages Grid */}
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Choose a Passage to Read</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {passages.map((passage) => (
                <Card 
                  key={passage.id} 
                  className="hover:shadow-lg transition-all duration-200 border-sky-100 cursor-pointer group"
                  onClick={() => startPassage(passage)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-slate-800 group-hover:text-sky-600 transition-colors">
                        {passage.title}
                      </CardTitle>
                      <Badge className={cn("text-xs", getDifficultyColor(passage.difficulty))}>
                        {passage.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 line-clamp-3">
                      {passage.content.substring(0, 150)}...
                    </CardDescription>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {passage.questions.length} questions
                      </span>
                      <Button size="sm" className="bg-slate-700 hover:bg-slate-800">
                        Start Reading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : showResults ? (
          /* Results Screen */
          <Card className="max-w-2xl mx-auto border-sky-200 bg-white">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-sky-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Great Job!</CardTitle>
              <CardDescription className="text-lg">
                You completed &ldquo;{selectedPassage.title}&rdquo;
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center py-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                <div className="text-5xl font-bold text-sky-600 mb-2">
                  {score}/{selectedPassage.questions.length}
                </div>
                <p className="text-gray-600">Questions Correct</p>
                <div className="flex justify-center gap-1 mt-3">
                  {answeredQuestions.map((correct, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        correct ? "bg-sky-500" : "bg-red-400"
                      )}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <p className="text-gray-700">{getScoreMessage()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleRestartPassage}
                  variant="outline"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-sky-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={handleBackToPassages}
                  className="flex-1 bg-slate-700 hover:bg-slate-800"
                >
                  Choose Another Passage
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Reading and Questions */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Passage Card */}
            <Card className="border-sky-200 bg-white h-fit lg:sticky lg:top-4">
              <CardHeader className="pb-3 border-b border-sky-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-slate-800">{selectedPassage.title}</CardTitle>
                  <Badge className={cn("text-xs", getDifficultyColor(selectedPassage.difficulty))}>
                    {selectedPassage.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm max-w-none">
                  {selectedPassage.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Questions Card */}
            <div className="space-y-4">
              {/* Progress */}
              <Card className="border-sky-200 bg-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {selectedPassage.questions.length}</span>
                    <span>Score: {score}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              {/* Current Question */}
              {currentQuestion && (
                <Card className="border-sky-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx
                      const isCorrect = idx === currentQuestion.correctAnswer
                      const showCorrect = isAnswered && isCorrect
                      const showWrong = isAnswered && isSelected && !isCorrect

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          disabled={isAnswered}
                          className={cn(
                            "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3",
                            !isAnswered && !isSelected && "border-gray-200 hover:border-emerald-300 hover:bg-sky-50",
                            !isAnswered && isSelected && "border-sky-500 bg-sky-50",
                            showCorrect && "border-green-500 bg-green-50",
                            showWrong && "border-red-400 bg-red-50",
                            isAnswered && !showCorrect && !showWrong && "border-gray-200 opacity-60"
                          )}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                            !isAnswered && !isSelected && "bg-gray-100 text-gray-600",
                            !isAnswered && isSelected && "bg-sky-500 text-white",
                            showCorrect && "bg-sky-600/30 text-white",
                            showWrong && "bg-red-400 text-white",
                            isAnswered && !showCorrect && !showWrong && "bg-gray-100 text-gray-400"
                          )}>
                            {showCorrect ? <CheckCircle2 className="h-5 w-5" /> : 
                             showWrong ? <XCircle className="h-5 w-5" /> : 
                             String.fromCharCode(65 + idx)}
                          </span>
                          <span className={cn(
                            "text-gray-700",
                            showCorrect && "text-slate-800 font-medium",
                            showWrong && "text-red-700"
                          )}>
                            {option}
                          </span>
                        </button>
                      )
                    })}

                    {/* Explanation */}
                    {isAnswered && (
                      <div className={cn(
                        "p-4 rounded-lg mt-4",
                        selectedAnswer === currentQuestion.correctAnswer 
                          ? "bg-green-50 border border-green-200" 
                          : "bg-yellow-50 border border-yellow-200"
                      )}>
                        <p className="font-medium text-gray-800 mb-1">
                          {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite right."}
                        </p>
                        <p className="text-gray-600 text-sm">{currentQuestion.explanation}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      {!isAnswered ? (
                        <Button 
                          onClick={handleCheckAnswer}
                          disabled={selectedAnswer === null}
                          className="flex-1 bg-slate-700 hover:bg-slate-800 disabled:opacity-50"
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNextQuestion}
                          className="flex-1 bg-slate-700 hover:bg-slate-800"
                        >
                          {currentQuestionIndex < selectedPassage.questions.length - 1 ? (
                            <>
                              Next Question
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              See Results
                              <Trophy className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Back to Passages Button */}
              <Button 
                variant="ghost" 
                onClick={handleBackToPassages}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Choose Different Passage
              </Button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
