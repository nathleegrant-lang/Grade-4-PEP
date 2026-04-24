import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, FileText, Pencil, BookMarked, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const topics = [
  {
    title: "Reading Comprehension",
    description: "Practice reading passages and answering questions to improve understanding.",
    icon: BookMarked,
    href: "/language-arts/reading-comprehension",
  },
  {
    title: "Vocabulary Building",
    description: "Learn new words, synonyms, antonyms, and context clues.",
    icon: MessageSquare,
    href: "/language-arts/vocabulary",
  },
  {
    title: "Grammar & Punctuation",
    description: "Master parts of speech, sentence structure, and punctuation rules.",
    icon: FileText,
    href: "/language-arts/grammar",
  },
  {
    title: "Writing Skills",
    description: "Practice writing paragraphs, letters, and creative stories.",
    icon: Pencil,
    href: "/language-arts/writing",
  },
]

export default function LanguageArtsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/30 to-gold-light/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky to-sky-light text-navy py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Language Arts (Literacy)</h2>
              <p className="text-navy/70">Build your reading and writing skills</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-navy hover:text-navy-light hover:bg-sky-light/30">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Introduction */}
        <Card className="mb-8 border-sky/30 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-navy">About Language Arts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              The Language Arts (Literacy) component of the PEP examination tests your ability to read, understand, 
              and communicate effectively. In Grade 4, you will practice reading comprehension, vocabulary, grammar, 
              and writing skills. These activities will help you prepare for the Literacy Test and Language Arts 
              Performance Task.
            </p>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <h3 className="text-xl font-semibold text-navy mb-6">Topics to Practice</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card key={topic.title} className="hover:shadow-md transition-shadow border-sky/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sky-light text-navy flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-navy">{topic.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{topic.description}</CardDescription>
                  <Link href={topic.href}>
                    <Button className="mt-4 bg-sky hover:bg-sky/80 text-navy">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Practice Test Section */}
        <Card className="bg-sky-light/30 border-sky/30">
          <CardHeader>
            <CardTitle className="text-navy">Ready for a Mock Test?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">
              Test your knowledge with a full practice examination that covers all Language Arts topics.
            </p>
            <Link href="/mock-tests/literacy">
              <Button className="bg-navy hover:bg-navy-light">
                Take Mock Test
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  )
}
