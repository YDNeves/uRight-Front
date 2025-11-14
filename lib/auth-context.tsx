"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from 'next/navigation'
import { parseCookies, setCookie, destroyCookie } from "nookies"
import { authApi } from "./api"
import type { User, Permission } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  hasPermission: (permission: Permission) => boolean
  hasAssociation: () => boolean
  associationId: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const cookies = parseCookies()
    const token = cookies.auth_token
  
    if (!token) {
      setUser(null)  // Garante que user seja null
      setLoading(false)
      return
    }
  
    try {
      const response = await authApi.getCurrentUser()
  
      if (response.data) {
        setUser(response.data)
      } else {
        destroyCookie(null, "auth_token", { path: "/" })
        setUser(null)
      }
    } catch (error) {
      console.error('[v0] checkAuth error:', error)
      destroyCookie(null, "auth_token", { path: "/" })
      setUser(null)
    }
  
    setLoading(false)
  }
  
  

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
  
      if (response.data) {
        setCookie(null, "auth_token", response.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        })
  
        await checkAuth() 
  
        router.push("/dashboard")
        return { success: true }
      }
  
      return { success: false, error: response.data?.error || "Login failed" }
    } catch (error) {
      console.error('[v0] login error:', error)
      return { success: false, error: "Erro ao fazer login" }
    }
  }
  

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password)

      if (response.data) {
        setCookie(null, "auth_token", response.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        })

        setUser(response.data.user)
        
        // Wait for cookie and state to be set
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirect to onboarding for new users
        router.push("/onboarding")
        return { success: true }
      }

      return { success: false, error: response.data?.error || "Registration failed" }
    } catch (error) {
      console.error('[v0] register error:', error)
      return { success: false, error: "Erro ao registrar" }
    }
  }

  const logout = async () => {
    destroyCookie(null, "auth_token", { path: "/" })
    setUser(null)
  
    // Aguarda o cookie realmente remover (evita conflito com middleware)
    await new Promise(resolve => setTimeout(resolve, 50))
  
    router.push("/login")
  }
  

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const hasAssociation = (): boolean => {
    return user?.associationId !== null && user?.associationId !== undefined
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasPermission,
        hasAssociation,
        associationId: user?.associationId || null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
