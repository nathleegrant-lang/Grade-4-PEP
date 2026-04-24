import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, ArrowLeft, Hash, Ruler, Shapes, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const topics = [
  {
    title: "Number Operations",
    description: "Practice addition, subtraction, multiplication, and division with whole numbers and fractions.",
    icon: Hash,
    href: "/mathematics/number-operations",
  },
  {
    title: "Measurement",
    description: "Learn about length, mass, capacity, time, and temperature measurements.",
    icon: Ruler,
    href: "/mathematics/measurement",
  },
  {
    title: "Geometry & Shapes",
    description: "Explore 2D and 3D shapes, angles, lines, and spatial reasoning.",
    icon: Shapes,
    href: "/mathematics/geometry",
  },
  {
    title: "Data & Statistics",
    description: "Practice reading graphs, charts, and tables. Learn to organize and analyze data.",
    icon: BarChart3,
    href: "/mathematics/data-statistics",
  },
]

export default function MathematicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/30 to-gold-light/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-navy-light text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Mathematics (Numeracy)</h2>
              <p className="text-sky-light">Strengthen your number sense and problem-solving skills</p>
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
        <Card className="mb-8 border-navy/20 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-navy">About Mathematics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              The Mathematics (Numeracy) component of the PEP examination tests your ability to understand numbers, 
              solve problems, and apply mathematical concepts to real-world situations. In Grade 4, you will practice 
              number operations, measurement, geometry, and data analysis. These activities will help you prepare 
              for the Numeracy Test and Mathematics Performance Task.
            </p>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <h3 className="text-xl font-semibold text-navy mb-6">Topics to Practice</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card key={topic.title} className="hover:shadow-md transition-shadow border-navy/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-navy/10 text-navy flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-navy">{topic.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{topic.description}</CardDescription>
                  <Link href={topic.href}>
                    <Button className="mt-4 bg-navy hover:bg-navy-light">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Practice Test Section */}
        <Card className="bg-navy/5 border-navy/20">
          <CardHeader>
            <CardTitle className="text-navy">Ready for a Mock Test?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">
              Test your knowledge with a full practice examination that covers all Mathematics topics.
            </p>
            <Link href="/mock-tests/numeracy">
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
