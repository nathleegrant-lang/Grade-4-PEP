import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, ClipboardList } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

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
]

const steps = [
  { number: 1, text: "Choose a subject" },
  { number: 2, text: "Review a topic" },
  { number: 3, text: "Complete practice activities" },
  { number: 4, text: "Try a mock test" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/30 to-gold-light/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-sky text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Welcome to Grade 4 PEP Practice</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-sky-light text-pretty">
            Practice, review, and build confidence for the PEP examination through guided online learning activities and mock tests.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <section className="mb-12">
          <Card className="border-sky/30 bg-white/90 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-navy">Welcome to Grade 4 PEP!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                This website is designed to support students and parents with engaging practice activities in 
                <strong className="text-navy"> Language Arts (Literacy)</strong> and <strong className="text-navy">Mathematics (Numeracy)</strong>. 
                Grade 4 students will also practice <strong className="text-navy">Performance Tasks</strong> that assess reading, writing, and research skills. 
                Each section offers opportunities to review concepts, strengthen skills, and prepare with confidence for the PEP examination.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How to Use Section */}
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

        {/* Subject Cards Section */}
        <section>
          <h3 className="text-xl font-semibold text-navy mb-6 text-center">Start Practicing</h3>
          <p className="text-center text-muted-foreground mb-8">Choose a subject below to begin your review and online practice.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
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
                      <CardDescription className="text-muted-foreground">
                        {subject.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
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
