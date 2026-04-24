"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/contexts/progress-context"
import { 
  Award, 
  Crown, 
  Download, 
  ArrowLeft,
  Star,
  BookOpen,
  Calculator,
  FileText,
  Lock
} from "lucide-react"

export default function CertificatesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, isPremium } = useAuth()
  const { getCertificates } = useProgress()

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

  const certificates = getCertificates()

  const getIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return BookOpen
      case "mock-test":
        return FileText
      case "achievement":
        return Star
      default:
        return Award
    }
  }

  const printCertificate = (cert: typeof certificates[0]) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .certificate {
            width: 800px;
            height: 600px;
            border: 8px solid #1e3a5f;
            padding: 40px;
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            position: relative;
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 2px solid #d4af37;
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 10px;
          }
          
          .title {
            font-family: 'Great Vibes', cursive;
            font-size: 56px;
            color: #1e3a5f;
            margin: 20px 0;
          }
          
          .subtitle {
            font-size: 14px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          
          .content {
            text-align: center;
            margin: 40px 0;
          }
          
          .presented {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 15px;
          }
          
          .name {
            font-size: 36px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 20px;
            border-bottom: 2px solid #d4af37;
            display: inline-block;
            padding-bottom: 10px;
          }
          
          .achievement {
            font-size: 18px;
            color: #334155;
            margin-bottom: 15px;
          }
          
          .score {
            font-size: 48px;
            font-weight: 700;
            color: #d4af37;
            margin: 20px 0;
          }
          
          .description {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 30px;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
            padding-top: 40px;
          }
          
          .date {
            text-align: left;
          }
          
          .date-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
          }
          
          .date-value {
            font-size: 14px;
            color: #1e3a5f;
            font-weight: 600;
            border-top: 1px solid #1e3a5f;
            padding-top: 5px;
            margin-top: 5px;
          }
          
          .seal {
            text-align: center;
          }
          
          .seal-circle {
            width: 80px;
            height: 80px;
            border: 3px solid #d4af37;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            background: linear-gradient(135deg, #fbbf24 0%, #d4af37 100%);
          }
          
          .seal-text {
            font-size: 10px;
            color: white;
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .signature {
            text-align: right;
          }
          
          .sig-line {
            width: 150px;
            border-top: 1px solid #1e3a5f;
            margin-bottom: 5px;
            margin-left: auto;
          }
          
          .sig-label {
            font-size: 12px;
            color: #64748b;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo-text">Grade 4 PEP</div>
            <div class="subtitle">Jamaica Primary Exit Profile Preparation</div>
            <div class="title">Certificate of Achievement</div>
          </div>
          
          <div class="content">
            <div class="presented">This certificate is proudly presented to</div>
            <div class="name">${user.childName}</div>
            <div class="achievement">${cert.title}</div>
            <div class="score">${cert.score}%</div>
            <div class="description">${cert.description}</div>
          </div>
          
          <div class="footer">
            <div class="date">
              <div class="date-label">Date Earned</div>
              <div class="date-value">${new Date(cert.earnedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            <div class="seal">
              <div class="seal-circle">
                <div class="seal-text">Grade 4<br/>PEP</div>
              </div>
            </div>
            
            <div class="signature">
              <div class="sig-line"></div>
              <div class="sig-label">Grade 4 PEP Team</div>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Certificates</h1>
            <p className="text-gray-600">View and print your achievement certificates</p>
          </div>
        </div>

        {!isPremium ? (
          <Card className="border-sky-200 max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Certificates are a Premium Feature
              </h2>
              <p className="text-slate-600 mb-6">
                Upgrade to Premium to earn and print beautiful certificates when you score 80% or higher on quizzes!
              </p>
              <Link href="/pricing">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : certificates.length === 0 ? (
          <Card className="border-sky-200 max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                No Certificates Yet
              </h2>
              <p className="text-slate-600 mb-6">
                Score 80% or higher on any quiz to earn your first certificate!
              </p>
              <Link href="/language-arts">
                <Button className="bg-sky-600 hover:bg-sky-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start a Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => {
              const Icon = getIcon(cert.type)
              return (
                <Card key={cert.id} className="border-sky-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-amber-600" />
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">
                        {cert.score}%
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-slate-800 mt-3">
                      {cert.title}
                    </CardTitle>
                    <CardDescription>
                      {cert.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {new Date(cert.earnedAt).toLocaleDateString()}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => printCertificate(cert)}
                        className="text-sky-600 border-sky-200 hover:bg-sky-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
