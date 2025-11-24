"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Iniciante",
    description: "Para pequenas associações",
    price: "Grátis",
    features: ["Até 50 membros", "Gestão básica", "Suporte por email"],
  },
  {
    name: "Profissional",
    description: "Para crescimento",
    price: "KZ 8.500",
    period: "/mês",
    features: ["Até 500 membros", "Análise avançada", "Suporte prioritário", "Relatórios customizados"],
    highlighted: true,
  },
  {
    name: "Empresarial",
    description: "Solução completa",
    price: "Sob consulta",
    features: ["Membros ilimitados", "API customizada", "Suporte dedicado", "Integrações"],
  },
]

export function ProgramsSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Planos Disponíveis</h2>
          <p className="text-lg text-foreground/60">Comece grátis e suba de plano conforme sua associação crescer</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`p-8 flex flex-col transition-shadow ${
                plan.highlighted
                  ? "border-2 border-primary shadow-xl md:scale-105"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
                  MAIS POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-foreground/60 mb-6">{plan.description}</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-foreground">
                  {plan.price}
                  {plan.period && <span className="text-lg text-foreground/60 ml-1">{plan.period}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-foreground/80">
                    <Check className="w-5 h-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="w-full">
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  Começar
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
