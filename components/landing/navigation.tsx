"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="uRight Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline text-xl font-bold text-secondary">uRight</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground/70 hover:text-foreground smooth-transition">
              Funcionalidades
            </a>
            <a href="#why" className="text-sm text-foreground/70 hover:text-foreground smooth-transition">
              Por Que Escolher
            </a>
            <a href="#programs" className="text-sm text-foreground/70 hover:text-foreground smooth-transition">
              Planos
            </a>
            <a href="#testimonials" className="text-sm text-foreground/70 hover:text-foreground smooth-transition">
              Depoimentos
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
