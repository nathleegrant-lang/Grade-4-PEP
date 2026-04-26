import Link from "next/link"
import { BookOpen, Calculator, ClipboardList } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MockTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Mock Tests</h1>
            <p className="text-slate-600 mt-2">
              Choose a subject, then select Easy, Moderate, Difficult, or Mixed practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-sky-50 border-b rounded-t-lg">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3">
                  <BookOpen className="h-7 w-7 text-sky-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Literacy</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-700">
                  Reading, vocabulary, grammar, writing conventions, and full review reports.
                </p>
                <Link href="/mock-tests/literacy">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    Open Literacy Tests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-blue-50 border-b rounded-t-lg">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3">
                  <Calculator className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Numeracy</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-700">
                  Number work, measurement, geometry, data, and section-by-section reporting.
                </p>
                <Link href="/mock-tests/numeracy">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Open Numeracy Tests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-amber-50 border-b rounded-t-lg">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3">
                  <ClipboardList className="h-7 w-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl text-slate-800">Performance Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-700">
                  Source-based tasks, short responses, extended writing, and printable reports.
                </p>
                <Link href="/mock-tests/performance">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Open Performance Tasks
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
