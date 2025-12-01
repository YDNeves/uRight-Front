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
    association_choice: false,
    invite_members: false,
    setup_payments: false,
  })
  const [requestedAccess, setRequestedAccess] = useState(false)
  const [selectedAssociation, setSelectedAssociation] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    if (!loading && user?.hasCompletedOnboarding) {
      router.push("/dashboard")
    }
    if (!loading && user?.hasCompletedOnboarding ) {
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
      id: "association_choice",
      title: "Escolher Associação",
      description: "Crie uma nova associação ou peça acesso a uma existente.",
      icon: "🏢",
    },
    {
      id: "invite_members",
      title: "Convidar Membros",
      description: "Adicione os primeiros membros à sua associação (somente para quem criou).",
      icon: "👥",
    },
    {
      id: "setup_payments",
      title: "Configurar Pagamentos",
      description: "Defina as formas de pagamento e taxas (somente para quem criou).",
      icon: "💳",
    },
  ]

  const handleStepComplete = (stepId: string) => {
    setCompleted((prev) => ({ ...prev, [stepId]: true }))
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleFinish = async () => {
    // API call para marcar onboarding como concluído
    // Se requestedAccess = true, backend cria solicitação pendente
    if (requestedAccess && selectedAssociation) {
      await fetch("/api/associations/request-access", {
        method: "POST",
        body: JSON.stringify({ associationId: selectedAssociation }),
        headers: { "Content-Type": "application/json" },
      })
    }
    router.push(requestedAccess ? "/dashboard" : "/dashboard")
  }

  const allCompleted = Object.values(completed).every((v) => v)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Bem-vindo ao uRight</h1>
          <p className="text-lg text-muted-foreground">
            Vamos configurar sua associação em alguns passos rápidos
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, index) => {
            const isDisabled =
              step.id !== "association_choice" && requestedAccess // passos após o primeiro desabilitados se solicitou acesso
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg ${
                      completed[step.id]
                        ? "border-emerald-500 bg-emerald-500/10"
                        : index === currentStep && !isDisabled
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
                    className={`mx-2 flex-1 border-t-2 ${
                      completed[step.id] ? "border-emerald-500" : "border-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {/* Step body */}
          {steps[currentStep].id === "association_choice" && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  handleStepComplete("association_choice")
                  setRequestedAccess(false)
                  setCurrentStep(currentStep + 1)
                }}
              >
                Criar nova associação
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleStepComplete("association_choice")
                  setRequestedAccess(true)
                }}
              >
                Solicitar acesso a uma associação existente
              </Button>
            </div>
          )}

          {steps[currentStep].id !== "association_choice" && !requestedAccess && (
            <div className="mb-8 min-h-32 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-6">
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-muted-foreground">Conteúdo do passo será expandido aqui</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={handleSkip} className="flex-1 bg-transparent">
              Pular por agora
            </Button>
            <Button
              onClick={() => {
                if (steps[currentStep].id === "association_choice" && requestedAccess) {
                  handleFinish()
                  return
                }
                handleStepComplete(steps[currentStep].id)
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1)
                } else {
                  handleFinish()
                }
              }}
              className="flex-1 gap-2"
            >
              {currentStep === steps.length - 1 || (steps[currentStep].id === "association_choice" && requestedAccess)
                ? "Terminar"
                : "Próximo"}
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
