"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [path, setPath] = useState<"create" | "request" | null>(null)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const [assocName, setAssocName] = useState("")
  const [assocPhoto, setAssocPhoto] = useState<File | null>(null)
  const [assocPreview, setAssocPreview] = useState<string | null>(null)
  const [associations, setAssociations] = useState<Array<{ id: string; name: string }>>([])
  const [selectedAssociation, setSelectedAssociation] = useState<string | null>(null)
  const [requestedAccess, setRequestedAccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
    if (!loading && user?.hasCompletedOnboarding) router.push("/dashboard")
  }, [user, loading, router])

  useEffect(() => {
    if (path === "request") {
      // carregar associações aleatórias
      fetch("/api/associations/random?limit=10")
        .then((res) => res.json())
        .then((data) => setAssociations(data.associations || []))
    }
  }, [path])

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const steps = path === "create"
    ? [
        { id: "choose_path", title: "Escolher caminho", description: "Criar ou se juntar a uma associação", icon: "🏢" },
        { id: "create_association", title: "Criar Associação", description: "Preencha os dados da associação", icon: "📝" },
        { id: "invite_members", title: "Convidar Membros", description: "Adicione os primeiros membros", icon: "👥" },
        { id: "setup_payments", title: "Configurar Pagamentos", description: "Defina pagamentos e taxas", icon: "💳" },
      ]
    : path === "request"
    ? [
        { id: "choose_path", title: "Escolher caminho", description: "Criar ou se juntar a uma associação", icon: "🏢" },
        { id: "request_access", title: "Solicitar Acesso", description: "Escolha a associação que deseja entrar", icon: "🔑" },
      ]
    : [
        { id: "choose_path", title: "Escolher caminho", description: "Criar ou se juntar a uma associação", icon: "🏢" },
      ]

  const handleStepComplete = (stepId: string) => {
    setCompleted((prev) => ({ ...prev, [stepId]: true }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssocPhoto(e.target.files[0])
      setAssocPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleNext = async () => {
    const step = steps[currentStep]

    // Validações do passo atual
    if (step.id === "choose_path" && !path) return alert("Escolha criar ou solicitar acesso")
    if (step.id === "create_association" && (!assocName || !assocPhoto))
      return alert("Preencha nome e foto da associação")
    if (step.id === "request_access" && !selectedAssociation)
      return alert("Selecione a associação")

    handleStepComplete(step.id)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Finaliza onboarding
      if (path === "create") {
        const formData = new FormData()
        formData.append("name", assocName)
        formData.append("photo", assocPhoto!)
        await fetch("/api/associations/create", { method: "POST", body: formData })
      } else if (path === "request" && selectedAssociation) {
        await fetch("/api/associations/request-access", {
          method: "POST",
          body: JSON.stringify({ associationId: selectedAssociation }),
          headers: { "Content-Type": "application/json" },
        })
      }
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Bem-vindo ao uRight</h1>
          <p className="text-lg text-muted-foreground">Vamos configurar sua associação</p>
        </div>

        {/* Passo indicativo */}
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
              {index < steps.length - 1 && <div className="mx-2 flex-1 border-t-2 border-muted" />}
            </div>
          ))}
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {/* Conteúdo do passo */}
          {steps[currentStep].id === "choose_path" && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  setPath("create")
                  handleStepComplete("choose_path")
                  setCurrentStep(currentStep + 1)
                }}
              >
                Criar nova associação
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPath("request")
                  handleStepComplete("choose_path")
                  setCurrentStep(currentStep + 1)
                }}
              >
                Solicitar acesso a uma associação existente
              </Button>
            </div>
          )}

          {steps[currentStep].id === "create_association" && (
            <div className="flex flex-col gap-4">
              <Label>Nome da Associação</Label>
              <Input placeholder="Ex: Associação ABC" value={assocName} onChange={(e) => setAssocName(e.target.value)} />
              <Label>Foto da Associação (obrigatório)</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoChange} />
              {assocPreview && <div className="relative h-32 w-32 mt-2"><Image src={assocPreview} alt="Prévia" fill className="object-cover rounded-lg" /></div>}
            </div>
          )}

          {steps[currentStep].id === "request_access" && (
            <div className="flex flex-col gap-2">
              {associations.map((a) => (
                <Card key={a.id} className="p-4 flex justify-between items-center">
                  <span>{a.name}</span>
                  <Button onClick={() => setSelectedAssociation(a.id)} variant={selectedAssociation === a.id ? "default" : "outline"}>
                    {selectedAssociation === a.id ? "Selecionada" : "Solicitar Acesso"}
                  </Button>
                </Card>
              ))}
              <Button variant="link">Ver mais</Button>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={handleSkip} className="flex-1 bg-transparent">Pular por agora</Button>
            <Button onClick={handleNext} className="flex-1 gap-2">
              {currentStep === steps.length - 1 ? "Terminar" : "Próximo"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
