"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    associationName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 organic-blob animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 organic-blob animate-blob animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-lg border-border/50">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 relative">
              <Image
                src="/logo.png"
                alt="uRight Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-foreground/60 mt-2">Comece seu jornada com uRight</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
            <Input
              type="text"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Associação</label>
            <Input
              type="text"
              name="associationName"
              placeholder="Nome da Associação"
              value={formData.associationName}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <Link href="/dashboard" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">Criar Conta</Button>
          </Link>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  )
}
