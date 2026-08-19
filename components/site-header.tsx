"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, Crown, Laptop, LayoutDashboard, LogOut, ShieldCheck, Star, User } from "lucide-react"
import { getPlanLabel } from "@/lib/subscriptions"

const navItems = [
  { href: "/", label: "Home" }, { href: "/language-arts", label: "Language Arts" }, { href: "/mathematics", label: "Mathematics" }, { href: "/performance-tasks", label: "Performance Tasks" }, { href: "/mock-tests", label: "Mock Tests" }, { href: "/pricing", label: "Pricing" }, { href: "/about", label: "About" },
]

function PepPracticeMark() {
  return <div className="flex items-center gap-3"><div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow"><Laptop className="h-7 w-7" /><BookOpen className="absolute -bottom-1 -right-1 h-5 w-5 rounded bg-amber-400 p-0.5 text-blue-950" /><Star className="absolute -right-2 -top-2 h-4 w-4 fill-pink-400 text-pink-400" /></div><div><div className="flex items-center gap-2"><span className="text-xl font-black tracking-tight md:text-2xl">PEP PRACTICE</span><span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink-500 text-center text-[10px] font-black leading-tight text-white ring-2 ring-white/20">GRADE<br />4</span></div><p className="text-xs font-semibold text-blue-100">Practice • Review • Confidence</p></div></div>
}

export function SiteHeader() {
  const pathname = usePathname(); const { user, isAuthenticated, isPremium, isAdmin, logout } = useAuth(); const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href)
  return <><header className="bg-blue-950 text-white"><div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4"><Link href="/" aria-label="PEP PRACTICE Grade 4 home"><PepPracticeMark /></Link><div className="flex items-center gap-2">{isAuthenticated && user ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="text-white hover:bg-white/10"><span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">{isPremium ? <Crown className="h-4 w-4 text-amber-300" /> : <User className="h-4 w-4" />}</span><span className="hidden sm:inline">{user.childName}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64"><div className="px-2 py-1.5"><p className="text-sm font-medium">{user.parentName}</p><p className="text-xs text-slate-500">{user.email}</p><p className="mt-1 text-xs text-slate-600">{getPlanLabel(user.subscriptionTier)}</p></div><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>{isAdmin && <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Dashboard</Link></DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => void logout()} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <><Link href="/login"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Sign In</Button></Link><Link href="/register"><Button size="sm" className="bg-pink-500 font-bold text-white hover:bg-pink-600">Create Account</Button></Link></>}</div></div></header><nav className="border-b border-blue-800 bg-blue-900 text-white"><div className="container mx-auto overflow-x-auto px-4"><ul className="flex min-w-max gap-1 py-2">{navItems.map((item) => <li key={item.href}><Link href={item.href} className={cn("inline-block rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-blue-700", isActive(item.href) && "bg-blue-700")}>{item.label}</Link></li>)}</ul></div></nav></>
}
