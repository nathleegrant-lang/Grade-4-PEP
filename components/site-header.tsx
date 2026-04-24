"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, User, LogOut, LayoutDashboard } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/language-arts", label: "Language Arts" },
  { href: "/mathematics", label: "Mathematics" },
  { href: "/performance-tasks", label: "Performance Tasks" },
  { href: "/mock-tests", label: "Mock Tests" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { user, isAuthenticated, isPremium, logout, isLoading } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="block bg-white rounded-lg p-1">
                <Image 
                  src="/images/logo.png" 
                  alt="Grade 4 PEP Logo" 
                  width={80} 
                  height={80}
                  className="h-14 w-auto md:h-16"
                  priority
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Grade 4 PEP</h1>
                <p className="text-sky-light text-sm">Jamaica Primary Exit Profile</p>
              </div>
            </div>

            {/* Auth Controls */}
            <div className="flex items-center gap-3">
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-2 text-white hover:bg-white/10"
                        >
                          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
                            {isPremium ? (
                              <Crown className="h-4 w-4 text-amber-300" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <span className="hidden sm:inline">{user.childName}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user.childName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          {isPremium && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-1">
                              <Crown className="h-3 w-3" />
                              Premium Member
                            </span>
                          )}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {!isPremium && (
                          <DropdownMenuItem asChild>
                            <Link href="/pricing" className="cursor-pointer text-amber-600">
                              <Crown className="mr-2 h-4 w-4" />
                              Upgrade to Premium
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={logout}
                          className="cursor-pointer text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href="/login">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white hover:bg-white/10"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button 
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-navy-light text-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "inline-block px-4 py-2 hover:bg-sky/30 rounded-t transition-colors font-medium text-sm",
                    isActive(item.href) && "bg-sky/30"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
