import Link from "next/link"
import { BookOpen, Calculator, ClipboardList, FileCheck2, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HERO_IMAGE = "https://images.pexels.com/photos/6437834/pexels-photo-6437834.jpeg?auto=compress&dpr=1&h=900&w=1400"
const STUDENT_IMAGE = "https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&dpr=1&h=900&w=1400"
const PARENT_IMAGE = "https://images.pexels.com/photos/4260325/pexels-photo-4260325.jpeg?auto=compress&dpr=1&h=900&w=1400"

const subjects = [
  { title: "Language Arts", description: "Reading comprehension, vocabulary, grammar, and writing skills practice.", href: "/language-arts", icon: BookOpen, accent: "bg-blue-600" },
  { title: "Mathematics", description: "Number operations, problem solving, measurement, and geometry practice.", href: "/mathematics", icon: Calculator, accent: "bg-pink-500" },
  { title: "Performance Tasks", description: "Practise real-world tasks that combine reading, writing, and research skills.", href: "/performance-tasks", icon: ClipboardList, accent: "bg-amber-500" },
  { title: "Mock Tests", description: "Try mock-style activities to build confidence before formal assessment.", href: "/mock-tests", icon: FileCheck2, accent: "bg-emerald-600" },
]

const steps = ["Choose a subject", "Review a topic", "Complete practice activities", "Move on to mock tests"]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/30 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-amber-400/25 blur-2xl" />
        <div className="container relative mx-auto grid gap-7 px-4 py-8 md:grid-cols-2 md:items-center md:py-10 lg:gap-10">
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-[1.05] md:text-5xl lg:text-6xl">Practice today.<br /><span className="text-amber-300">Succeed tomorrow.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-50 md:text-lg">Grade 4 practice that helps learners strengthen key skills, practise with purpose and build confidence for the PEP journey.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/language-arts"><Button size="lg" className="w-full bg-amber-400 px-8 font-bold text-blue-950 hover:bg-amber-300 sm:w-auto">Start Free Practice</Button></Link>
              <Link href="/pricing"><Button size="lg" variant="outline" className="w-full border-white bg-white/10 px-8 text-white hover:bg-white hover:text-blue-950 sm:w-auto">View Pricing</Button></Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="overflow-hidden rounded-[1.75rem] border-4 border-white/20 bg-white/10 shadow-2xl">
              <img src={HERO_IMAGE} alt="Grade 4-aged learner independently using a laptop while completing school practice" className="h-[260px] w-full object-cover sm:h-[300px] md:h-[330px] lg:h-[350px]" />
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="bg-white py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div className="overflow-hidden rounded-3xl shadow-xl"><img src={STUDENT_IMAGE} alt="Grade 4 learner engaged with digital practice on a laptop" className="h-[320px] w-full object-cover md:h-[420px]" loading="lazy" /></div>
              <div>
                <p className="font-bold uppercase tracking-[0.18em] text-pink-600">For Students • Grade 4</p>
                <h2 className="mt-2 text-3xl font-black text-blue-950 md:text-4xl">Practise. Learn. Build confidence.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">Work through Grade 4 Language Arts, Mathematics, Performance Tasks and mock-style practice. Review what you know, keep practising, and build confidence one step at a time.</p>
                <div className="mt-6"><Link href="/language-arts"><Button size="lg" className="bg-blue-700 font-bold hover:bg-blue-800">Start Free Practice</Button></Link></div>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{subjects.map((subject) => { const Icon = subject.icon; return <Link key={subject.title} href={subject.href} className="group"><Card className="h-full border-0 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"><CardHeader><div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${subject.accent} text-white`}><Icon className="h-6 w-6" /></div><CardTitle className="text-xl text-blue-950">{subject.title}</CardTitle></CardHeader><CardContent><CardDescription className="leading-relaxed text-slate-600">{subject.description}</CardDescription></CardContent></Card></Link> })}</div>
          </div>
        </section>

        <section className="bg-blue-50 py-14 md:py-16">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <p className="font-bold uppercase tracking-[0.18em] text-emerald-700">For Parents • Grade 4</p>
              <h2 className="mt-2 text-3xl font-black text-blue-950 md:text-4xl">See where more practice may help.</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">Support your child’s Grade 4 learning with focused practice. Use the progress information already available in the platform to see what has been completed and encourage additional practice where it may be useful.</p>
              <div className="mt-5 space-y-3">{["Support a regular practice routine", "Review completed learning activity", "Encourage more practice in selected areas"].map((item) => <div key={item} className="flex items-center gap-3 font-medium text-slate-700"><CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" />{item}</div>)}</div>
              <div className="mt-7"><Link href="/dashboard"><Button size="lg" className="bg-emerald-600 font-bold hover:bg-emerald-700">View Progress</Button></Link></div>
            </div>
            <div className="order-1 overflow-hidden rounded-3xl shadow-xl lg:order-2"><img src={PARENT_IMAGE} alt="Parent supporting a child using a laptop for digital learning" className="h-[320px] w-full object-cover md:h-[430px]" loading="lazy" /></div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center"><p className="font-bold uppercase tracking-[0.18em] text-blue-700">PEP PRACTICE — GRADE 4</p><h2 className="mt-2 text-3xl font-black text-blue-950">How to Use This Site</h2><p className="mt-3 text-slate-600">A simple path to purposeful practice.</p></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{steps.map((text, index) => <div key={text} className="rounded-2xl border border-blue-100 bg-slate-50 p-5 text-center shadow-sm"><div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full font-black text-white ${index === 0 ? "bg-pink-500" : index === 1 ? "bg-blue-700" : index === 2 ? "bg-emerald-600" : "bg-amber-500"}`}>{index + 1}</div><p className="font-bold text-blue-950">{text}</p></div>)}</div>
          </div>
        </section>

        <section className="bg-blue-950 py-12 text-white"><div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-300">PEP PRACTICE — GRADE 4</p><h2 className="mt-2 text-3xl font-black">Ready for the next practice session?</h2><p className="mt-2 text-blue-100">Practice • Review • Confidence</p></div><Link href="/language-arts"><Button size="lg" className="bg-amber-400 font-bold text-blue-950 hover:bg-amber-300">Start Free Practice</Button></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  )
}
