"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { RegisterResult, StudentRecord, SubscriptionRecord, User, PlanCode, AuthState } from "@/lib/types"
import { isSubscriptionActive } from "@/lib/subscriptions"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<RegisterResult>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  addStudent: (childName: string) => Promise<{ success: boolean; error?: string }>
}

interface RegisterData {
  parentName: string
  childName: string
  email: string
  phone?: string
  password: string
}

interface SupabaseProfileRow {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  role: "admin" | "parent"
  created_at: string
}

interface SupabaseStudentRow {
  id: string
  full_name: string
  grade_level: number
  subscription_id: string | null
  created_at: string
}

interface SupabaseSubscriptionRow {
  id: string
  parent_id: string
  grade: "grade4" | "grade5"
  plan_code: PlanCode
  status: "pending" | "active" | "expired" | "cancelled" | "suspended"
  starts_at: string | null
  expires_at: string | null
  max_students: number
  payment_id: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const PENDING_CHILD_PREFIX = "grade4_pending_child_"

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mapStudent = (row: SupabaseStudentRow): StudentRecord => ({
    id: row.id,
    fullName: row.full_name,
    gradeLevel: row.grade_level,
    subscriptionId: row.subscription_id,
    createdAt: row.created_at,
  })

  const mapSubscription = (row: SupabaseSubscriptionRow | null): SubscriptionRecord | null => {
    if (!row) return null
    return {
      id: row.id,
      parentId: row.parent_id,
      grade: row.grade,
      planCode: row.plan_code,
      status: row.status,
      startsAt: row.starts_at,
      expiresAt: row.expires_at,
      maxStudents: row.max_students,
      paymentId: row.payment_id,
    }
  }

  const persistPendingChild = (email: string, childName: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(`${PENDING_CHILD_PREFIX}${email.toLowerCase()}`, childName)
  }

  const readPendingChild = (email: string) => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(`${PENDING_CHILD_PREFIX}${email.toLowerCase()}`)
  }

  const clearPendingChild = (email: string) => {
    if (typeof window === "undefined") return
    localStorage.removeItem(`${PENDING_CHILD_PREFIX}${email.toLowerCase()}`)
  }

  const loadUser = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null)
      setStudents([])
      setActiveSubscription(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const authUser = session.user

    const [{ data: profile }, { data: subscriptionRows }, { data: studentRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, phone, role, created_at")
        .eq("id", authUser.id)
        .single<SupabaseProfileRow>(),

      supabase
        .from("subscriptions")
        .select("id, parent_id, grade, plan_code, status, starts_at, expires_at, max_students, payment_id")
        .eq("parent_id", authUser.id)
        .eq("grade", "grade4")
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(1),

      supabase
        .from("students")
        .select("id, full_name, grade_level, subscription_id, created_at")
        .eq("parent_id", authUser.id)
        .order("created_at", { ascending: true }),
    ])

    let resolvedStudents = (studentRows ?? []).map((row) => mapStudent(row as SupabaseStudentRow))

    const pendingChild = authUser.email ? readPendingChild(authUser.email) : null
    if (resolvedStudents.length === 0 && pendingChild) {
      const { data: insertedStudent } = await supabase
        .from("students")
        .insert({ parent_id: authUser.id, full_name: pendingChild, grade_level: 4 })
        .select("id, full_name, grade_level, subscription_id, created_at")
        .single<SupabaseStudentRow>()

      if (insertedStudent) {
        resolvedStudents = [mapStudent(insertedStudent)]
        if (authUser.email) clearPendingChild(authUser.email)
      }
    }

    const subscription = mapSubscription((subscriptionRows?.[0] as SupabaseSubscriptionRow | undefined) ?? null)
    const active = isSubscriptionActive(subscription)

    setStudents(resolvedStudents)
    setActiveSubscription(subscription)
    setUser({
      id: authUser.id,
      parentName: profile?.full_name ?? authUser.user_metadata?.full_name ?? "Parent",
      childName: resolvedStudents[0]?.fullName ?? "Student",
      email: profile?.email ?? authUser.email ?? "",
      role: profile?.role ?? "parent",
      subscriptionTier: active ? subscription?.planCode ?? "free" : "free",
      subscriptionExpiry: active && subscription?.expiresAt ? new Date(subscription.expiresAt) : undefined,
      createdAt: profile?.created_at ? new Date(profile.created_at) : undefined,
      maxStudents: subscription?.maxStudents ?? 1,
    })
    setIsLoading(false)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      void loadUser(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session) => {
      void loadUser(session)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  const register = async (data: RegisterData): Promise<RegisterResult> => {
    persistPendingChild(data.email, data.childName)

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || window.location.origin

    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${siteUrl}/login`,
        data: {
          full_name: data.parentName,
          phone: data.phone ?? null,
          role: "parent",
        },
      },
    })

    if (error) {
      const rawError = error.message?.toLowerCase() || ""

      if (rawError.includes("email rate limit exceeded")) {
        return {
          success: false,
          error: "We couldn’t send another confirmation email right now. Please wait a few minutes and try again.",
        }
      }

      if (rawError.includes("user already registered")) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        }
      }

      if (rawError.includes("invalid email")) {
        return {
          success: false,
          error: "Please enter a valid email address.",
        }
      }

      if (rawError.includes("password")) {
        return {
          success: false,
          error: "Please use a stronger password and try again.",
        }
      }

      return {
        success: false,
        error: "We couldn’t create your account right now. Please try again.",
      }
    }

    if (result.session) {
      await loadUser(result.session)
    }

    return {
      success: true,
      needsEmailConfirmation: !result.session,
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setStudents([])
    setActiveSubscription(null)
  }

  const refreshUser = async () => {
    const { data } = await supabase.auth.getSession()
    await loadUser(data.session)
  }

  const addStudent = async (childName: string) => {
    if (!user) return { success: false, error: "Please sign in first." }
    if (!childName.trim()) return { success: false, error: "Enter a student name." }

    const allowed = activeSubscription?.maxStudents ?? 1
    if (students.length >= allowed) {
      return {
        success: false,
        error: `This plan allows up to ${allowed} student${allowed === 1 ? "" : "s"}.`,
      }
    }

    const { error } = await supabase.from("students").insert({
      parent_id: user.id,
      subscription_id: activeSubscription?.id ?? null,
      full_name: childName.trim(),
      grade_level: 4,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    await refreshUser()
    return { success: true }
  }

  const isPremium = isSubscriptionActive(activeSubscription)
  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        students,
        activeSubscription,
        isLoading,
        isAuthenticated: !!user,
        isPremium,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        addStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
