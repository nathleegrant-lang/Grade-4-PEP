import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, ClipboardList, Clock, FileText, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const mockTests = [
  {
    title: "Literacy Mock Test",
    description: "40 questions covering reading comprehension, vocabulary, grammar, and writing conventions.",
    href: "/mock-tests/literacy",
    icon: BookOpen,
    color: "bg-sky",
    duration: "60 minutes",
    questions: 40,
  },
  {
    title: "Numeracy Mock Test",
    description: "40 questions covering number operations, measurement, geometry, and data analysis.",
    href: "/mock-tests/numeracy",
    icon: Calculator,
    color: "bg-navy",
    duration: "60 minutes",
    questions: 40,
  },
  {
    title: "Performance Task Mock Test",
    description: "Complete a multi-part task combining reading, research, and writing skills.",
    href: "/mock-tests/performance-task",
    icon: ClipboardList,
    color: "bg-gold",
    duration: "90 minutes",
    questions: 1,
  },
]

const testTips = [
  "Read each question carefully before answering.",
  "Manage your time wisely - don't spend too long on one question.",
  "If you're unsure, make your best guess and move on.",
  "Check your answers if you have time at the end.",
  "Stay calm and focused throughout the test.",
]

export default function MockTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/30 to-gold-light/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-sky text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">PEP Mock Tests</h2>
          <p className="text-lg max-w-2xl mx-auto text-sky-light">
            Practice under real exam conditions with our timed mock tests designed to match the Grade 4 PEP assessment format.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* About Section */}
        <section className="mb-10">
          <Card className="border-sky/20 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                About These Mock Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground leading-relaxed">
              <p className="mb-4">
                These mock tests are designed to simulate the actual Grade 4 PEP assessment experience. 
                The tests follow the same format and question types used in the real examination, helping 
                students become familiar with the testing environment and build confidence.
              </p>
              <p>
                Each test is timed to match the actual exam duration. We recommend completing these tests 
                in a quiet environment without distractions, just like you would during the real PEP assessment.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Test Tips Section */}
        <section className="mb-10">
          <Card className="border-gold/30 bg-gold-light/20">
            <CardHeader>
              <CardTitle className="text-xl text-navy">Test-Taking Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                {testTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Mock Tests Grid */}
        <section>
          <h3 className="text-xl font-semibold text-navy mb-6 text-center">Choose a Mock Test</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {mockTests.map((test) => {
              const Icon = test.icon
              return (
                <Card key={test.title} className="h-full border-2 border-transparent hover:border-sky/50 transition-all hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className={`w-14 h-14 rounded-full ${test.color} text-white flex items-center justify-center mb-3`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-lg text-navy">{test.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {test.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {test.questions} {test.questions === 1 ? 'task' : 'questions'}
                      </div>
                    </div>
                    
                    <Link href={test.href}>
                      <Button className={`w-full ${test.color} hover:opacity-90 ${test.color === 'bg-gold' ? 'text-navy' : ''}`}>
                        Start Test
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Instructions Section */}
        <section className="mt-10">
          <Card className="border-navy/20 bg-navy/5">
            <CardHeader>
              <CardTitle className="text-xl text-navy">Test Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-navy mb-2">Before Starting:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Find a quiet place to work</li>
                    <li>Have pencils and paper ready for rough work</li>
                    <li>Make sure you have enough time to complete the test</li>
                    <li>Turn off distractions (TV, games, etc.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">During the Test:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Read all instructions carefully</li>
                    <li>Answer every question</li>
                    <li>Keep track of the time remaining</li>
                    <li>Review your answers before submitting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Colors Banner */}
        <section className="mt-12">
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-navy"></div>
            <div className="flex-1 bg-sky"></div>
            <div className="flex-1 bg-gold"></div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
