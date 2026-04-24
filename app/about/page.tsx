import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Lightbulb, Target, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About the Creator</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              The story behind this learning platform
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-sky-400 border-t-4 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center">
                  {/* Creator Photo */}
                  <div className="mb-8">
                    <div className="relative w-full max-w-xl h-72 md:h-80 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/creator.jpg"
                        alt="Nathlee R. Grant - Creator of Grade 4 PEP"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    <p className="text-center mt-4 text-slate-700 font-medium">Nathlee R. Grant</p>
                    <p className="text-center text-sm text-slate-500 italic max-w-sm md:max-w-md">&quot;Circumstances dictate the narrative, but choices determine the Outcome.&quot;</p>
                  </div>
                  
                  {/* Bio Text */}
                  <div className="prose prose-lg max-w-none text-center">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      This AI-powered platform was created by <strong className="text-slate-800">Nathlee R. Grant</strong>, 
                      inspired by the message of encouragement and motivation shared through{" "}
                      <strong className="text-slate-800">Shazonique&apos;s Inspirations</strong>. The vision behind this 
                      space is to uplift and empower young learners by providing resources that help them grow 
                      academically and confidently.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Through this AI-powered learning platform, students preparing for the{" "}
                      <strong className="text-slate-800">Grade 4 PEP examination</strong> can practice, explore, 
                      and strengthen their skills in an interactive and supportive environment.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      The goal is simple: <em className="text-slate-800 font-medium">to inspire learning, build confidence, 
                      and help every student reach their full potential.</em>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Uplift & Empower</h3>
                      <p className="text-gray-600">
                        Providing resources that help young learners grow academically and build confidence in their abilities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Inspire Learning</h3>
                      <p className="text-gray-600">
                        Creating an interactive and supportive environment where students can explore and discover.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Build Confidence</h3>
                      <p className="text-gray-600">
                        Helping students practice and strengthen their skills to feel prepared for the PEP examination.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2">Reach Full Potential</h3>
                      <p className="text-gray-600">
                        Supporting every student on their journey to academic success and personal growth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
