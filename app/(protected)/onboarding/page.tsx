"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/lib/notifications-context"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { showNotification } = useNotification()
  const [step, setStep] = useState(1)
  const [organizationName, setOrganizationName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleNext = async () => {
    if (step === 1 && !organizationName.trim()) {
      showNotification("Por favor preencha o nome da organização", "error")
      return
    }

    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      try {
        showNotification("Onboarding concluído com sucesso!", "success")
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push("/dashboard")
      } catch (error) {
        showNotification("Erro ao concluir onboarding", "error")
        setIsLoading(false)
      }
    }
  }

  const handleSkip = async () => {
    showNotification("Onboarding pulado", "info")
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl">Bem-vindo ao URight</CardTitle>
          <CardDescription>Passo {step} de 3 - Configuração Inicial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Vamos começar configurando sua organização</p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Organização</label>
                  <Input
                    placeholder="Ex: Associação de Comerciantes"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Suas informações foram salvas com sucesso</p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium">{organizationName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Você está pronto para começar</p>
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-primary">Acesso completo desbloqueado</p>
                  <p className="text-xs text-muted-foreground mt-1">Você agora pode acessar todos os módulos do URight</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1"
              >
                Pular
              </Button>
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {step === 3 ? "Começar" : "Próximo"}
              </Button>
            </div>

            <div className="flex gap-1 justify-center">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? "bg-primary w-8" : s < step ? "bg-primary/50 w-4" : "bg-border w-4"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
