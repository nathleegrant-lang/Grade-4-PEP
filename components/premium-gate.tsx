"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Crown, Lock, Sparkles } from "lucide-react"

interface PremiumGateProps {
  children: React.ReactNode
  feature?: string
  previewContent?: React.ReactNode
  showPreview?: boolean
}

export function PremiumGate({ children, feature = "this feature", previewContent, showPreview = false }: PremiumGateProps) {
  const { isPremium, isAuthenticated } = useAuth()
  if (isPremium) return <>{children}</>
  return (
    <div className="relative">
      {showPreview && previewContent && <div className="relative"><div className="blur-sm pointer-events-none select-none">{previewContent}</div><div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" /></div>}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white mx-auto max-w-lg mt-4"><CardHeader className="text-center"><div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4"><Lock className="h-8 w-8 text-amber-600" /></div><CardTitle className="text-xl text-slate-800">Paid Grade 4 Feature</CardTitle><CardDescription>Upgrade to access {feature}</CardDescription></CardHeader><CardContent className="text-center space-y-4"><ul className="text-sm text-slate-600 space-y-2"><li className="flex items-center justify-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Weekly, monthly, and family access options</li><li className="flex items-center justify-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Full mock tests, worksheets, and study guides</li><li className="flex items-center justify-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Payment approval activates access automatically</li></ul><div className="flex flex-col gap-2"><Link href="/pricing"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-white"><Crown className="h-4 w-4 mr-2" />View Grade 4 Plans</Button></Link>{!isAuthenticated && <Link href="/register"><Button variant="outline" className="w-full">Create Free Account</Button></Link>}</div><p className="text-xs text-slate-500">Plans start at JMD $1,000 weekly.</p></CardContent></Card>
    </div>
  )
}

export function UpgradePrompt({ className = "" }: { className?: string }) {
  const { isPremium, isAuthenticated } = useAuth()
  if (isPremium) return null
  return <div className={`bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 ${className}`}><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0"><Crown className="h-5 w-5 text-amber-600" /></div><div className="flex-1"><p className="font-medium text-slate-800">Want full Grade 4 access?</p><p className="text-sm text-slate-600">Upgrade to a paid plan for full mock tests, worksheets, and more.</p></div><Link href={isAuthenticated ? "/pricing" : "/register"}><Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">{isAuthenticated ? "Upgrade" : "Sign Up"}</Button></Link></div></div>
}
