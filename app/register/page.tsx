"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { UserPlus, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validation
    if (!formData.parentName || !formData.childName || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const success = await register({
      parentName: formData.parentName,
      childName: formData.childName,
      email: formData.email,
      password: formData.password,
    })

    if (success) {
      router.push("/dashboard")
    } else {
      setError("An account with this email already exists")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="border-sky-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-sky-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Create Account</CardTitle>
              <CardDescription>
                Start your child&apos;s learning journey today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childName">Child&apos;s Name</Label>
                  <Input
                    id="childName"
                    name="childName"
                    type="text"
                    placeholder="Enter your child's name"
                    value={formData.childName}
                    onChange={handleChange}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="parent@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-slate-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-slate-300"
                  />
                </div>

                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Free account includes:</p>
                  <ul className="space-y-1">
                    {["1 quiz per topic", "5 questions preview on mock tests", "Basic progress tracking"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-700 hover:bg-slate-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Free Account"}
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                    Sign in here
                  </Link>
                </div>

                <div className="text-center">
                  <Link href="/pricing" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                    Want full access? View our pricing plans
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
