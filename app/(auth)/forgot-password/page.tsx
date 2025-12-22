"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { requestPasswordReset } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await requestPasswordReset(email)

    if (result.success) {
      setSent(true)
      toast({
        title: "Email enviado",
        description: "Verifique seu email para instruções de recuperação",
      })
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">uRight</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {!sent ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Recuperar acesso</h2>
                <p className="text-sm text-muted-foreground">Insira seu email para receber um link de recuperação</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
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

                <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Email enviado</h2>
              <p className="text-sm text-muted-foreground">
                Verifique seu email para instruções de recuperação de acesso.
              </p>
            </div>
          )}

          <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <ChevronLeft className="h-4 w-4" /> Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
