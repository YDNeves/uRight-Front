"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { translations } from "@/lib/pt-BR"
import { Chrome, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const t = translations.auth

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, loginWithOAuth } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password)

    if (!result.success) {
      toast({
        title: t.loginFailed,
        description: result.error,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">uRight</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{t.welcomeBack}</h2>
            <p className="text-sm text-muted-foreground">{t.signIn}</p>
          </div>

          {/* OAuth Options */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => loginWithOAuth("google")}
              className="h-10"
              title="Google"
            >
              <Chrome className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => loginWithOAuth("microsoft")}
              className="h-10"
              title="Microsoft"
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => loginWithOAuth("linkedin")}
              className="h-10"
              title="LinkedIn"
            >
              <Chrome className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t.password}
                </Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Recuperar acesso?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
              {loading ? t.signingIn : t.signInButton}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-muted-foreground">
            {t.dontHaveAccount}{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
