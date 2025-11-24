"use client"

// Hook reutilizável para autenticação
import { useState } from "react"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  associationName: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // API call será implementada aqui
      console.log("Login attempt:", email)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de autenticação")
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: Omit<AuthUser, "id"> & { password: string }) => {
    setLoading(true)
    setError(null)
    try {
      // API call será implementada aqui
      console.log("Register attempt:", data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registar")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return { user, loading, error, login, register, logout }
}
