import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, ClipboardList, FileCheck2, MessageCircleMore } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

const subjects = [
  {
    title: "Language Arts (Literacy)",
    description: "Reading comprehension, vocabulary, grammar, and writing skills practice.",
    href: "/language-arts",
    icon: BookOpen,
    color: "bg-sky",
  },
  {
    title: "Mathematics (Numeracy)",
    description: "Number operations, problem solving, measurement, and geometry practice.",
    href: "/mathematics",
    icon: Calculator,
    color: "bg-navy",
  },
  {
    title: "Performance Tasks",
    description: "Practice real-world tasks that combine reading, writing, and research skills.",
    href: "/performance-tasks",
    icon: ClipboardList,
    color: "bg-gold",
  },
  {
    title: "Mock Tests",
    description: "Try mock-style activities to build confidence before formal assessment.",
    href: "/mock-tests",
    icon: FileCheck2,
    color: "bg-emerald-600",
  },
]

const steps = [
  { number: 1, text: "Choose a subject" },
  { number: 2, text: "Review a topic" },
  { number: 3, text: "Complete practice activities" },
  { number: 4, text: "Move on to mock tests" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/30 to-gold-light/20">
      <SiteHeader />

      <section className="bg-gradient-to-r from-navy to-sky text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-light mb-3">Grade 4 only</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Welcome to Grade 4 PEP Practice</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-sky-light text-pretty">
            Practice, review, and build confidence through guided online learning activities, performance tasks, and mock-style assessments created for Grade 4 learners in Jamaica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/language-arts">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8">
                Start Free Practice
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy px-8 bg-transparent">
                View Grade 4 Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8">
          <Card className="border-amber-300 bg-amber-50 shadow-sm">
            <CardContent className="p-5 text-center">
              <p className="text-slate-700 font-medium">
                Grade 4 access is a separate product. Payment for this site does not include Grade 5 PEP or other LearnJA programmes.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="border-sky/30 bg-white/90 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-navy">Welcome to Grade 4 PEP!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                This website is designed to support students and parents with engaging practice activities in
                <strong className="text-navy"> Language Arts (Literacy)</strong> and <strong className="text-navy">Mathematics (Numeracy)</strong>.
                Grade 4 students will also practise <strong className="text-navy">Performance Tasks</strong> that assess reading, writing, and research skills.
                Each section offers opportunities to review concepts, strengthen skills, and prepare with confidence for the PEP examination pathway.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-semibold text-navy mb-6 text-center">How to Use This Site</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-sky/20">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center text-xl font-bold mb-3">
                  {step.number}
                </div>
                <p className="text-foreground font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-sky/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-navy text-xl">For Students</CardTitle>
                <CardDescription>Build confidence one topic at a time.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Start with a topic, answer the activities carefully, and revisit weak areas before moving on to mock tests.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-300 shadow-sm bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-navy text-xl">For Parents</CardTitle>
                <CardDescription>Support learning without confusion.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Use this site for Grade 4 practice only. When your child is ready, Grade 5 PEP will be purchased separately as its own programme.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <Card className="border-sky-200 bg-sky-50/80 shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircleMore className="h-5 w-5 text-sky-700" />
                  <p className="font-semibold text-slate-800">Need help with payment or access?</p>
                </div>
                <p className="text-slate-600 text-sm md:text-base">
                  After completing your Grade 4 payment, please email your receipt along with your child’s name to shazincorps@gmail.com
 to confirm your payment and activate access.
                </p>
              </div>
              
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-navy mb-6 text-center">Start Practicing</h3>
          <p className="text-center text-muted-foreground mb-8">Choose a section below to begin your review and online practice.</p>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <Link key={subject.title} href={subject.href} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-sky/50">
                    <CardHeader className="pb-3">
                      <div className={`w-14 h-14 rounded-full ${subject.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-lg text-navy">{subject.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">{subject.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

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
