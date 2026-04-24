"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/contexts/progress-context"
import { 
  User, 
  Crown, 
  BookOpen, 
  Calculator, 
  ClipboardList, 
  FileText,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Lock
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, isPremium } = useAuth()
  const { progress, getTopicProgress, getCertificates } = useProgress()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickLinks = [
    { href: "/language-arts", icon: BookOpen, label: "Language Arts", color: "bg-sky-100 text-sky-600" },
    { href: "/mathematics", icon: Calculator, label: "Mathematics", color: "bg-amber-100 text-amber-600" },
    { href: "/performance-tasks", icon: ClipboardList, label: "Performance Tasks", color: "bg-green-100 text-green-600" },
    { href: "/mock-tests", icon: FileText, label: "Mock Tests", color: "bg-purple-100 text-purple-600" },
  ]

  const premiumLinks = [
    { href: "/worksheets", icon: FileText, label: "Worksheets", color: "bg-sky-100 text-sky-600", requiresPremium: true },
    { href: "/certificates", icon: Award, label: "Certificates", color: "bg-amber-100 text-amber-600", requiresPremium: true },
    { href: "/study-guides", icon: BookOpen, label: "Study Guides", color: "bg-purple-100 text-purple-600", requiresYearly: true },
  ]

  const languageArtsProgress = getTopicProgress("language-arts")
  const mathematicsProgress = getTopicProgress("mathematics")
  const certificates = getCertificates()

  // Calculate overall stats
  const totalQuizzes = progress?.totalQuizzesTaken || 0
  const totalMockTests = progress?.totalMockTestsTaken || 0
  const averageScore = progress?.averageScore || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
              <User className="h-8 w-8 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Welcome back, {user.childName}!
              </h1>
              <p className="text-slate-600">
                Parent: {user.parentName}
              </p>
            </div>
            {isPremium && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-300 ml-auto">
                <Crown className="h-4 w-4 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalQuizzes}</p>
                  <p className="text-xs text-slate-500">Quizzes Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalMockTests}</p>
                  <p className="text-xs text-slate-500">Mock Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{averageScore}%</p>
                  <p className="text-xs text-slate-500">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{certificates.length}</p>
                  <p className="text-xs text-slate-500">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progress Reports - Premium Feature */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-sky-600" />
                  Language Arts Progress
                  {!isPremium && <Lock className="h-4 w-4 text-slate-400" />}
                </CardTitle>
                <CardDescription>
                  {isPremium ? "Your detailed progress across all topics" : "Upgrade to see detailed reports"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  languageArtsProgress.length > 0 ? (
                    <div className="space-y-4">
                      {languageArtsProgress.map((topic) => (
                        <div key={topic.topic} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{topic.topic}</span>
                            <span className="text-slate-500">Best: {topic.bestScore}%</span>
                          </div>
                          <Progress value={topic.bestScore} className="h-2" />
                          <p className="text-xs text-slate-400">
                            {topic.attempts} attempt{topic.attempts !== 1 ? "s" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      Start taking quizzes to see your progress!
                    </p>
                  )
                ) : (
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 mb-4">
                      Detailed progress reports are a premium feature
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-amber-500 hover:bg-amber-600">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-600" />
                  Mathematics Progress
                  {!isPremium && <Lock className="h-4 w-4 text-slate-400" />}
                </CardTitle>
                <CardDescription>
                  {isPremium ? "Your detailed progress across all topics" : "Upgrade to see detailed reports"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  mathematicsProgress.length > 0 ? (
                    <div className="space-y-4">
                      {mathematicsProgress.map((topic) => (
                        <div key={topic.topic} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{topic.topic}</span>
                            <span className="text-slate-500">Best: {topic.bestScore}%</span>
                          </div>
                          <Progress value={topic.bestScore} className="h-2" />
                          <p className="text-xs text-slate-400">
                            {topic.attempts} attempt{topic.attempts !== 1 ? "s" : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      Start taking quizzes to see your progress!
                    </p>
                  )
                ) : (
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 mb-4">
                      Detailed progress reports are a premium feature
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-amber-500 hover:bg-amber-600">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Plan</span>
                    <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-amber-500" : ""}>
                      {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                    </Badge>
                  </div>
                  {user.subscriptionExpiry && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Expires</span>
                      <span className="text-sm text-slate-700">
                        {new Date(user.subscriptionExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {!isPremium && (
                    <Link href="/pricing" className="block mt-4">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Certificates
                  {!isPremium && <Lock className="h-4 w-4 text-slate-400" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  certificates.length > 0 ? (
                    <div className="space-y-3">
                      {certificates.slice(0, 3).map((cert) => (
                        <div key={cert.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                          <Award className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-slate-800">{cert.title}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(cert.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {certificates.length > 3 && (
                        <Link href="/certificates">
                          <Button variant="ghost" className="w-full text-sky-600">
                            View All ({certificates.length})
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4 text-sm">
                      Score 80%+ on quizzes to earn certificates!
                    </p>
                  )
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <p className="text-slate-600 text-sm mb-3">
                      Certificates are a premium feature
                    </p>
                    <Link href="/pricing">
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                        Upgrade
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress && progress.quizAttempts.length > 0 ? (
                  <div className="space-y-3">
                    {progress.quizAttempts.slice(-5).reverse().map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${
                            attempt.percentage >= 80 ? "text-green-500" : 
                            attempt.percentage >= 60 ? "text-amber-500" : "text-red-500"
                          }`} />
                          <span className="text-slate-700">{attempt.topic}</span>
                        </div>
                        <span className="text-slate-500">{attempt.percentage}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4 text-sm">
                    No activity yet. Start a quiz!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-xl font-semibold text-slate-800 mt-10 mb-4">
          Continue Learning
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="border-sky-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center`}>
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{link.label}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Premium Resources */}
        <h2 className="text-xl font-semibold text-slate-800 mt-10 mb-4 flex items-center gap-2">
          Premium Resources
          {!isPremium && <Lock className="h-4 w-4 text-slate-400" />}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premiumLinks.map((link) => {
            const isAvailable = link.requiresYearly 
              ? user.subscriptionTier === "yearly" 
              : isPremium

            return (
              <Link key={link.href} href={link.href}>
                <Card className={`border-sky-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer h-full ${!isAvailable ? "opacity-75" : ""}`}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{link.label}</p>
                      {link.requiresYearly && (
                        <p className="text-xs text-amber-600">Yearly only</p>
                      )}
                    </div>
                    {isAvailable ? (
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-400" />
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
