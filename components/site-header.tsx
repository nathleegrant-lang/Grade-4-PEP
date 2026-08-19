"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Crown, LayoutDashboard, LogOut, ShieldCheck, User } from "lucide-react"
import { getPlanLabel } from "@/lib/subscriptions"
import { PepPracticeLogo } from "@/components/pep-practice-logo"

const navItems = [
  { href: "/", label: "Home" }, { href: "/language-arts", label: "Language Arts" }, { href: "/mathematics", label: "Mathematics" }, { href: "/performance-tasks", label: "Performance Tasks" }, { href: "/mock-tests", label: "Mock Tests" }, { href: "/pricing", label: "Pricing" }, { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname(); const { user, isAuthenticated, isPremium, isAdmin, logout } = useAuth(); const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href)
  return <><header className="bg-blue-950 text-white"><div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4"><Link href="/" aria-label="PEP PRACTICE Grade 4 home" className="min-w-0"><span className="sm:hidden"><PepPracticeLogo variant="compact" grade={4} /></span><span className="hidden sm:block"><PepPracticeLogo variant="primary" grade={4} /></span></Link><div className="flex shrink-0 items-center gap-1 sm:gap-2">{isAuthenticated && user ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="text-white hover:bg-white/10"><span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">{isPremium ? <Crown className="h-4 w-4 text-amber-300" /> : <User className="h-4 w-4" />}</span><span className="hidden sm:inline">{user.childName}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64"><div className="px-2 py-1.5"><p className="text-sm font-medium">{user.parentName}</p><p className="text-xs text-slate-500">{user.email}</p><p className="mt-1 text-xs text-slate-600">{getPlanLabel(user.subscriptionTier)}</p></div><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>{isAdmin && <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Dashboard</Link></DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => void logout()} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <><Link href="/login"><Button variant="ghost" size="sm" className="hidden text-white hover:bg-white/10 sm:inline-flex">Sign In</Button></Link><Link href="/register"><Button size="sm" className="bg-pink-500 px-2.5 font-bold text-white hover:bg-pink-600 sm:px-3">Create Account</Button></Link></>}</div></div></header><nav className="border-b border-blue-800 bg-blue-900 text-white"><div className="container mx-auto overflow-x-auto px-4"><ul className="flex min-w-max gap-1 py-1.5">{navItems.map((item) => <li key={item.href}><Link href={item.href} className={cn("inline-block rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-blue-700", isActive(item.href) && "bg-blue-700")}>{item.label}</Link></li>)}</ul></div></nav></>
}
