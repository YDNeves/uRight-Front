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
import { Chrome, Mail, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const t = translations.auth

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [entityType, setEntityType] = useState("member")
  const [loading, setLoading] = useState(false)

  const { register, loginWithOAuth } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await register(name, email, password, entityType)

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">uRight</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {step === 1 ? (
            <>
              {/* Step 1: Entity Type Selection */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{t.createAccount}</h2>
                <p className="text-sm text-muted-foreground">O que deseja criar?</p>
              </div>

              <div className="space-y-3">
                <RadioGroup value={entityType} onValueChange={setEntityType}>
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <RadioGroupItem value="member" id="member" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="member" className="text-sm font-medium cursor-pointer">
                        Conta de Membro
                      </Label>
                      <p className="text-xs text-muted-foreground">Junte-se a uma associação</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <RadioGroupItem value="association" id="association" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="association" className="text-sm font-medium cursor-pointer">
                        Associação
                      </Label>
                      <p className="text-xs text-muted-foreground">Gerir uma associação</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <RadioGroupItem value="company" id="company" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="company" className="text-sm font-medium cursor-pointer">
                        Empresa
                      </Label>
                      <p className="text-xs text-muted-foreground">Conta empresarial</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={() => setStep(2)} className="w-full h-10 font-medium">
                Continuar <ChevronRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t.alreadyHaveAccount}{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  {t.signInButton}
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Step 2: Account Details */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Seus dados</h2>
                <p className="text-sm text-muted-foreground">Crie sua conta no uRight</p>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t.fullName}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.password}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                </div>

                <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                  {loading ? t.creatingAccount : t.createAccountButton}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                {t.alreadyHaveAccount}{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  {t.signInButton}
                </Link>
              </p>

              <Button variant="ghost" onClick={() => setStep(1)} className="w-full h-10">
                Voltar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
