export type SubscriptionTier = "free" | "monthly" | "yearly"

export interface User {
  id: string
  parentName: string
  childName: string
  email: string
  subscriptionTier: SubscriptionTier
  subscriptionExpiry?: Date
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isPremium: boolean
}

export interface PricingTier {
  id: SubscriptionTier
  name: string
  priceJMD: number
  priceUSD: number
  period: string
  description: string
  features: string[]
  popular?: boolean
}

export interface FeatureItem {
  text: string
  included: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    priceJMD: 0,
    priceUSD: 0,
    period: "forever",
    description: "Get started with basic learning",
    features: [
      "Access to all topic lessons",
      "1 quiz per topic",
      "Limited mock test questions",
      "Basic progress tracking",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    priceJMD: 1000,
    priceUSD: 6.50,
    period: "per month",
    description: "Full access for one month",
    features: [
      "Everything in Free, plus:",
      "Unlimited quizzes",
      "Full mock exams with analytics",
      "Printable worksheets (PDF)",
      "Writing practice with rubrics",
      "Detailed progress reports",
      "Achievement certificates",
    ],
    popular: true,
  },
  {
    id: "yearly",
    name: "Yearly",
    priceJMD: 10000,
    priceUSD: 65,
    period: "per year",
    description: "Best value - 2 months FREE!",
    features: [
      "Everything in Monthly, plus:",
      "2 months FREE (save $2,000 JMD)",
      "Family account (up to 3 children)",
      "Exclusive bonus content",
      "Priority email support",
      "Early access to new features",
      "Downloadable study guides",
    ],
  },
]

export const FREE_EXCLUDED_FEATURES = [
  "Full mock exams",
  "Printable worksheets",
  "Writing practice with rubrics",
  "Certificates",
  "Priority support",
]

// Progress Tracking Types
export interface QuizAttempt {
  id: string
  userId: string
  quizId: string // e.g., "grammar-nouns", "math-geometry"
  category: "language-arts" | "mathematics" | "mock-test"
  topic: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: Date
  timeSpent?: number // in seconds
}

export interface Certificate {
  id: string
  userId: string
  type: "quiz" | "mock-test" | "achievement"
  title: string
  description: string
  score: number
  earnedAt: Date
  quizId?: string
}

export interface UserProgress {
  userId: string
  totalQuizzesTaken: number
  totalMockTestsTaken: number
  averageScore: number
  quizAttempts: QuizAttempt[]
  certificates: Certificate[]
  streakDays: number
  lastActivityDate: Date
}

export interface TopicProgress {
  topic: string
  category: string
  attempts: number
  bestScore: number
  lastAttempt?: Date
}
