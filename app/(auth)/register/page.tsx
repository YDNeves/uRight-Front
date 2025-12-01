"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { translations } from "@/lib/pt-BR"

const t = translations.auth

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await register(name, email, password)

    if (!result.success) {
      toast({
        title: t.registrationFailed,
        description: result.error,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-cyan-950/10 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-16 w-32 mb-4">
            <Image
              src="/logo.png"
              alt="uRight - Sonhos & Realizações"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-cyan-400">{t.createAccount}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.getStarted}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.fullName}</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-cyan-700/30 bg-cyan-950/20 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-cyan-700/30 bg-cyan-950/20 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-cyan-700/30 bg-cyan-950/20 focus:border-cyan-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            disabled={loading}
          >
            {loading ? t.creatingAccount : t.createAccountButton}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 underline">
            {t.signInButton}
          </Link>
        </p>
      </div>
    </div>
  )
}
