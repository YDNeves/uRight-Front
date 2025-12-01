"use client"

import { Card } from "@/components/ui/card"
import { Users, BarChart3, Calendar, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Gestão de Membros",
    description:
      "Sistema centralizado para controle de informações, permissões e acessos de membros com interface intuitiva.",
  },
  {
    icon: BarChart3,
    title: "Análise Financeira",
    description: "Relatórios detalhados de receitas, despesas e fluxo de caixa com geração automática de documentos.",
  },
  {
    icon: Calendar,
    title: "Calendário e Eventos",
    description: "Agenda integrada para coordenação de eventos, confirmações e notificações automáticas a membros.",
  },
  {
    icon: MessageSquare,
    title: "Comunicações",
    description: "Envio em massa de notificações, mensagens e relatórios para manter todos informados em tempo real.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8  relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 organic-blob"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Funcionalidades Principais</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Ferramentas essenciais para gerir sua associação de forma eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow border-border hover:border-primary/30">
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
