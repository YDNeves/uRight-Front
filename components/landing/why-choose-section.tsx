"use client"
import { CheckCircle2 } from "lucide-react"

const benefits = [
  "Interface moderna e intuitiva",
  "Suporte 24/7 dedicado",
  "Segurança de dados garantida",
  "Integração com múltiplos canais",
  "Relatórios automáticos",
  "Sem contratos longos",
]

export function WhyChooseSection() {
  return (
    <section id="why" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 organic-blob">
              <div className="w-full h-64 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-center p-6">
                <div>
                  <p className="text-4xl font-bold">+500</p>
                  <p className="text-primary-foreground/80">Associações Confiando em Nós</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-8">Por Que Escolher uRight?</h2>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg text-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
