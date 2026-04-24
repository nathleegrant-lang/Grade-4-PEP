"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User, SubscriptionTier, AuthState } from "@/lib/types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  upgradeSubscription: (tier: SubscriptionTier) => void
}

interface RegisterData {
  parentName: string
  childName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "pep_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        if (parsed.subscriptionExpiry) {
          parsed.subscriptionExpiry = new Date(parsed.subscriptionExpiry)
        }
        parsed.createdAt = new Date(parsed.createdAt)
        setUser(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const saveUser = (userData: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get all registered users from localStorage
    const usersData = localStorage.getItem("pep_users")
    if (!usersData) return false

    try {
      const users = JSON.parse(usersData)
      const foundUser = users.find((u: User & { password: string }) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userData } = foundUser
        userData.createdAt = new Date(userData.createdAt)
        if (userData.subscriptionExpiry) {
          userData.subscriptionExpiry = new Date(userData.subscriptionExpiry)
        }
        saveUser(userData)
        return true
      }
    } catch {
      return false
    }
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    // Check if email already exists
    const usersData = localStorage.getItem("pep_users")
    const users = usersData ? JSON.parse(usersData) : []
    
    const emailExists = users.some((u: User) => 
      u.email.toLowerCase() === data.email.toLowerCase()
    )
    
    if (emailExists) return false

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      parentName: data.parentName,
      childName: data.childName,
      email: data.email,
      password: data.password,
      subscriptionTier: "free",
      createdAt: new Date(),
    }

    users.push(newUser)
    localStorage.setItem("pep_users", JSON.stringify(users))

    const { password: _, ...userData } = newUser
    saveUser(userData)
    return true
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const upgradeSubscription = (tier: SubscriptionTier) => {
    if (!user) return

    const expiry = new Date()
    if (tier === "monthly") {
      expiry.setMonth(expiry.getMonth() + 1)
    } else if (tier === "yearly") {
      expiry.setFullYear(expiry.getFullYear() + 1)
    }

    const updatedUser: User = {
      ...user,
      subscriptionTier: tier,
      subscriptionExpiry: tier !== "free" ? expiry : undefined,
    }

    // Update in users array too
    const usersData = localStorage.getItem("pep_users")
    if (usersData) {
      const users = JSON.parse(usersData)
      const userIndex = users.findIndex((u: User) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser }
        localStorage.setItem("pep_users", JSON.stringify(users))
      }
    }

    saveUser(updatedUser)
  }

  const isPremium = user?.subscriptionTier === "monthly" || user?.subscriptionTier === "yearly"

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isPremium,
        login,
        register,
        logout,
        upgradeSubscription,
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
