import Link from "next/link"
import { BookOpen, Calculator, ClipboardList, FileCheck2, Laptop, Users, CheckCircle2, Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/30 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-amber-400/25 blur-2xl" />
        <div className="container relative mx-auto grid gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-300">PEP PRACTICE</span>
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-center text-sm font-black leading-tight text-white shadow-lg ring-4 ring-white/20">GRADE<br />4</span>
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">Practice today.<br /><span className="text-amber-300">Succeed tomorrow.</span></h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-50">Online Grade 4 practice designed to help learners review key skills, practise with purpose, and build confidence for the PEP journey.</p>
            <p className="mt-3 font-semibold text-white">Practice • Review • Confidence</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/language-arts"><Button size="lg" className="w-full bg-amber-400 px-8 font-bold text-blue-950 hover:bg-amber-300 sm:w-auto">Start Free Practice</Button></Link>
              <Link href="/pricing"><Button size="lg" variant="outline" className="w-full border-white bg-white/10 px-8 text-white hover:bg-white hover:text-blue-950 sm:w-auto">View Pricing</Button></Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
                <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Online Practice</p><p className="font-bold">Language Arts Review</p></div><Laptop className="h-9 w-9 text-blue-700" /></div>
                <div className="space-y-3"><div className="h-3 w-4/5 rounded bg-slate-200" /><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3 text-sm font-semibold">A. Main idea</div><div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 text-sm font-semibold">B. Supporting detail ✓</div></div><div className="flex items-center justify-between rounded-xl bg-blue-950 p-4 text-white"><span className="text-sm font-semibold">Practice progress</span><span className="font-black text-amber-300">8 / 10</span></div></div>
              </div>
              <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-3 font-bold text-white shadow-lg"><Star className="h-5 w-5 fill-current" /> Keep going!</div>
            </div>
            <p className="mt-9 text-center text-sm text-blue-100">Digital practice that feels clear, focused, and encouraging.</p>
          </div>
        </div>
      </section>

      <main>
        <section className="bg-white py-14 md:py-18">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-9 max-w-2xl text-center"><p className="font-bold uppercase tracking-[0.18em] text-pink-600">For Students</p><h2 className="mt-2 text-3xl font-black text-blue-950 md:text-4xl">Practise. Learn. Build confidence.</h2><p className="mt-3 text-slate-600">Choose an area, review what you know, and keep practising as your skills grow.</p></div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{subjects.map((subject) => { const Icon = subject.icon; return <Link key={subject.title} href={subject.href} className="group"><Card className="h-full border-0 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"><CardHeader><div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${subject.accent} text-white`}><Icon className="h-6 w-6" /></div><CardTitle className="text-xl text-blue-950">{subject.title}</CardTitle></CardHeader><CardContent><CardDescription className="leading-relaxed text-slate-600">{subject.description}</CardDescription></CardContent></Card></Link> })}</div>
            <div className="mt-8 text-center"><Link href="/language-arts"><Button size="lg" className="bg-blue-700 font-bold hover:bg-blue-800">Start Free Practice</Button></Link></div>
          </div>
        </section>

        <section className="bg-blue-50 py-14">
          <div className="container mx-auto grid gap-8 px-4 md:grid-cols-[1.05fr_.95fr] md:items-center">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-700 p-7 text-white shadow-xl"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20"><Users className="h-8 w-8" /></div><p className="font-bold uppercase tracking-[0.18em] text-amber-200">For Parents</p><h2 className="mt-2 text-3xl font-black">See where more practice may help.</h2><p className="mt-4 max-w-xl leading-relaxed text-blue-50">Support your child’s Grade 4 learning with focused online practice. Use existing progress information to notice what has been completed and encourage more practice where it may be useful.</p><div className="mt-6"><Link href="/dashboard"><Button className="bg-white font-bold text-blue-800 hover:bg-blue-50">View Progress</Button></Link></div></div>
            <div className="rounded-3xl bg-white p-7 shadow-lg ring-1 ring-blue-100"><p className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-700">Online learning at home</p><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-4 flex items-center gap-3"><Laptop className="h-9 w-9 text-pink-500" /><div><p className="font-bold text-blue-950">Practice together</p><p className="text-sm text-slate-600">A parent can encourage, review progress, and help establish a regular practice routine.</p></div></div>{["Focused Grade 4 practice", "Clear learning areas", "Progress support where available"].map((item) => <div key={item} className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700"><CheckCircle2 className="h-5 w-5 text-emerald-600" />{item}</div>)}</div></div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container mx-auto px-4"><div className="mx-auto mb-8 max-w-2xl text-center"><p className="font-bold uppercase tracking-[0.18em] text-blue-700">How to Use This Site</p><h2 className="mt-2 text-3xl font-black text-blue-950">A simple path to purposeful practice</h2></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{steps.map((text, index) => <div key={text} className="rounded-2xl border border-blue-100 bg-slate-50 p-5 text-center shadow-sm"><div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full font-black text-white ${index === 0 ? "bg-pink-500" : index === 1 ? "bg-blue-700" : index === 2 ? "bg-emerald-600" : "bg-amber-500"}`}>{index + 1}</div><p className="font-bold text-blue-950">{text}</p></div>)}</div></div>
        </section>

        <section className="bg-blue-950 py-12 text-white"><div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-300">PEP PRACTICE — GRADE 4</p><h2 className="mt-2 text-3xl font-black">Ready for the next practice session?</h2><p className="mt-2 text-blue-100">Practice • Review • Confidence</p></div><Link href="/language-arts"><Button size="lg" className="bg-amber-400 font-bold text-blue-950 hover:bg-amber-300">Start Free Practice</Button></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  )
}
