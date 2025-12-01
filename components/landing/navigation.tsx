"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { NAVIGATION_LINKS } from "@/lib/constants"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
  {/* O contêiner PAI define o tamanho real desejado e a posição relativa */}
      <div className="w-25 h-10 relative"> 
        <Image 
          src="/logo.png" 
          alt="uRight" 
          fill // Faz a imagem preencher o div 10x10
          className="object-contain" // Garante que o logo caiba sem cortar, mantendo proporção
          sizes="(max-width: 100px) 10vw, 5vw" // Adicione 'sizes' para otimização do Next.js
        />
      </div>
</Link>

          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Registar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
