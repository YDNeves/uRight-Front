"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "João Silva",
    role: "Presidente da Associação Comunitária",
    content: "uRight transformou a forma como gerenciamos nossa associação. Muito intuitivo!",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Tesoureira",
    content: "Os relatórios financeiros agora saem em segundos. Economizamos horas de trabalho.",
    rating: 5,
  },
  {
    name: "Carlos Oliveira",
    role: "Secretário",
    content: "A comunicação com os membros ficou muito mais fácil e organizada.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">O Que Nossos Clientes Dizem</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-8 border-border">
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
              </div>
              <p className="text-foreground/80 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
