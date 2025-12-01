"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ChevronRight, CheckCircle2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    create_association: false,
    invite_members: false,
    setup_payments: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    if (!loading && user?.hasCompletedOnboarding) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const steps = [
    {
      id: "create_association",
      title: "Criar Associação",
      description: "Configure sua associação, cooperativa ou união.",
      icon: "🏢",
    },
    {
      id: "invite_members",
      title: "Convidar Membros",
      description: "Adicione os primeiros membros à sua associação.",
      icon: "👥",
    },
    {
      id: "setup_payments",
      title: "Configurar Pagamentos",
      description: "Defina as formas de pagamento e taxas de membros.",
      icon: "💳",
    },
  ]

  const handleStepComplete = async (stepId: string) => {
    setCompleted((prev) => ({ ...prev, [stepId]: true }))
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleFinish = () => {
    // API call para marcar onboarding como concluído
    router.push("/dashboard")
  }

  const allCompleted = Object.values(completed).every((v) => v)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Bem-vindo ao AssoGest</h1>
          <p className="text-lg text-muted-foreground">Vamos configurar sua associação em 3 passos rápidos</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg ${
                    completed[step.id]
                      ? "border-emerald-500 bg-emerald-500/10"
                      : index === currentStep
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-muted bg-muted/50"
                  }`}
                >
                  {completed[step.id] ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : step.icon}
                </div>
                <p className="mt-2 text-sm font-medium">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 flex-1 border-t-2 ${completed[step.id] ? "border-emerald-500" : "border-muted"}`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          <div className="mb-8 min-h-32 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-6">
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-muted-foreground">Conteúdo do passo será expandido aqui</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={handleSkip} className="flex-1 bg-transparent">
              Pular por agora
            </Button>
            <Button
              onClick={() => {
                handleStepComplete(steps[currentStep].id)
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1)
                } else {
                  handleFinish()
                }
              }}
              className="flex-1 gap-2"
            >
              {currentStep === steps.length - 1 ? "Terminar" : "Próximo"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>
    </div>
  )
}
