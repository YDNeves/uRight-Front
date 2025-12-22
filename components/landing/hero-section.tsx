"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 organic-blob animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 organic-blob animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                Gestão Simplificada
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Gerencie sua associação com <span className="text-primary">precisão</span>
              </h1>
              <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
                Plataforma integrada que centraliza gestão de membros, finanças, eventos e comunicações. Otimize
                operações e aumente a produtividade.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white hover:bg-secondary/90 w-full sm:w-auto">
                  Começar Agora <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Saiba Mais
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">2.8K+</p>
                <p className="text-sm text-foreground/60">Associações ativas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">84.5K</p>
                <p className="text-sm text-foreground/60">Membros registados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">99.2%</p>
                <p className="text-sm text-foreground/60">Disponibilidade</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl"></div>
            <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl border border-border flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="200" cy="200" r="150" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="url(#gradient)" strokeWidth="2" opacity="0.3" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#17B8A8" />
                    <stop offset="100%" stopColor="#003B8B" />
                  </linearGradient>
                </defs>
                <g opacity="0.8">
                  <rect x="150" y="160" width="100" height="80" fill="#17B8A8" rx="8" />
                  <circle cx="180" cy="150" r="12" fill="#003B8B" />
                  <circle cx="220" cy="150" r="12" fill="#003B8B" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
