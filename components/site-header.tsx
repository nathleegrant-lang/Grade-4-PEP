"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Crown, LayoutDashboard, LogOut, ShieldCheck, User } from "lucide-react"
import { getPlanLabel } from "@/lib/subscriptions"

const navItems = [
  { href: "/", label: "Home" }, { href: "/language-arts", label: "Language Arts" }, { href: "/mathematics", label: "Mathematics" }, { href: "/performance-tasks", label: "Performance Tasks" }, { href: "/mock-tests", label: "Mock Tests" }, { href: "/pricing", label: "Pricing" }, { href: "/about", label: "About" },
]

function BrandSymbol() {
  return <svg viewBox="0 0 116 96" className="h-[58px] w-[70px] sm:h-[66px] sm:w-[80px]" aria-hidden="true">
    <path d="M15 62A44 44 0 0 1 48 12" fill="none" stroke="#1557e8" strokeWidth="4" strokeLinecap="round" />
    <path d="M84 21a43 43 0 0 1 13 42" fill="none" stroke="#169b45" strokeWidth="4" strokeLinecap="round" />
    <path d="M58 4l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1 4-9Z" fill="#fbb400" />
    <path d="M90 22l2 5 6 .5-4.5 4 1.5 6-5-3-5 3 1.5-6-4.5-4 6-.5 2-5Z" fill="#169b45" />
    <rect x="27" y="27" width="54" height="39" rx="5" fill="#081a55" />
    <rect x="32" y="32" width="44" height="27" rx="2" fill="#fff" />
    <rect x="35" y="36" width="11" height="11" rx="2" fill="#ef1870" /><path d="m38 41 3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" />
    <path d="M50 38h15M50 44h12M36 52h16" stroke="#78b4ff" strokeWidth="3" strokeLinecap="round" />
    <rect x="57" y="49" width="5" height="8" rx="1" fill="#16a34a" /><rect x="65" y="44" width="5" height="13" rx="1" fill="#16a34a" /><rect x="73" y="38" width="5" height="19" rx="1" fill="#16a34a" />
    <path d="M20 69c15-8 29-7 39 1v18c-12-8-25-9-39-2V69Zm39 1c11-8 24-9 39-1v17c-14-7-27-6-39 2V70Z" fill="#fff" stroke="#0a2b78" strokeWidth="3" />
    <path d="M20 75c15-6 28-5 39 2M59 77c11-7 24-8 39-2" fill="none" stroke="#ef1870" strokeWidth="3" />
    <path d="M22 82c14-5 26-4 37 2M59 84c11-6 23-7 37-2" fill="none" stroke="#1557e8" strokeWidth="3" />
    <circle cx="59" cy="88" r="4" fill="#081a55" />
    <path d="m78 58 16 8-7 4 5 10-5 2-5-10-6 5 2-19Z" fill="#fbb400" stroke="#fff" strokeWidth="2" />
    <path d="M36 92c14 7 31 7 45 0" fill="none" stroke="#169b45" strokeWidth="4" strokeLinecap="round" />
  </svg>
}

function GradeBadge() {
  return <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm ring-[3px] ring-amber-400 sm:h-[66px] sm:w-[66px]">
    <span className="absolute -inset-[6px] rounded-full border-[3px] border-blue-600 border-l-transparent border-b-green-600" />
    <span className="text-center text-[9px] font-black leading-[.9] sm:text-[10px]">GRADE<br /><span className="text-[30px] leading-none sm:text-[34px]">4</span></span>
  </div>
}

function PepPracticeMark() {
  return <div className="flex items-center gap-1.5 sm:gap-3">
    <BrandSymbol />
    <div className="min-w-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="leading-none"><div className="text-[25px] font-black tracking-[.06em] text-white sm:text-[34px]">PEP</div><div className="mt-1 text-[13px] font-black tracking-[.12em] text-blue-400 sm:text-[17px]">PRACTICE</div></div>
        <span className="h-12 w-px bg-white/50 sm:h-14" />
        <GradeBadge />
      </div>
      <p className="mt-1 hidden text-[9px] font-black uppercase tracking-[.08em] sm:block"><span className="text-blue-300">Practice</span><span className="text-white"> • </span><span className="text-green-400">Review</span><span className="text-white"> • </span><span className="text-pink-400">Confidence</span></p>
    </div>
  </div>
}

export function SiteHeader() {
  const pathname = usePathname(); const { user, isAuthenticated, isPremium, isAdmin, logout } = useAuth(); const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href)
  return <><header className="bg-blue-950 text-white"><div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4"><Link href="/" aria-label="PEP PRACTICE Grade 4 home" className="min-w-0"><PepPracticeMark /></Link><div className="flex shrink-0 items-center gap-1 sm:gap-2">{isAuthenticated && user ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="text-white hover:bg-white/10"><span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">{isPremium ? <Crown className="h-4 w-4 text-amber-300" /> : <User className="h-4 w-4" />}</span><span className="hidden sm:inline">{user.childName}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64"><div className="px-2 py-1.5"><p className="text-sm font-medium">{user.parentName}</p><p className="text-xs text-slate-500">{user.email}</p><p className="mt-1 text-xs text-slate-600">{getPlanLabel(user.subscriptionTier)}</p></div><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>{isAdmin && <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Dashboard</Link></DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => void logout()} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <><Link href="/login"><Button variant="ghost" size="sm" className="hidden text-white hover:bg-white/10 sm:inline-flex">Sign In</Button></Link><Link href="/register"><Button size="sm" className="bg-pink-500 px-2.5 font-bold text-white hover:bg-pink-600 sm:px-3">Create Account</Button></Link></>}</div></div></header><nav className="border-b border-blue-800 bg-blue-900 text-white"><div className="container mx-auto overflow-x-auto px-4"><ul className="flex min-w-max gap-1 py-1.5">{navItems.map((item) => <li key={item.href}><Link href={item.href} className={cn("inline-block rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-blue-700", isActive(item.href) && "bg-blue-700")}>{item.label}</Link></li>)}</ul></div></nav></>
}
