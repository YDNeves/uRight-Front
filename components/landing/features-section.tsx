"use client"

import { Card } from "@/components/ui/card"
import { Users, BarChart3, Calendar, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Controle permissões, acessos e informações de todos os membros da sua associação",
  },
  {
    icon: BarChart3,
    title: "Análise Financeira",
    description: "Monitore receitas, despesas e gere relatórios detalhados de forma automática",
  },
  {
    icon: Calendar,
    title: "Eventos & Calendário",
    description: "Organize eventos, envie convites e gerencie RSVPs com facilidade",
  },
  {
    icon: MessageSquare,
    title: "Comunicações",
    description: "Envie mensagens em massa, notificações e mantenha todos informados",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 organic-blob"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nossas Funcionalidades</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar sua associação em um só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-8 hover:shadow-lg smooth-transition border-border hover:border-primary/30">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
