"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
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
  loginWithOAuth: (provider: "google" | "microsoft" | "linkedin") => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    entityType: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
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
      setLoading(false)
      return
    }

    const response = await authApi.getCurrentUser()
    if (response.data) {
      setUser(response.data)
    } else {
      destroyCookie(null, "auth_token")
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)

    if (response.data) {
      setCookie(null, "auth_token", response.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      })

      setUser(response.data.user)
      const redirectPath = response.data.user.hasCompletedOnboarding ? "/dashboard" : "/onboarding"
      router.push(redirectPath)
      return { success: true }
    }

    return { success: false, error: response.error || "Login failed" }
  }

  const loginWithOAuth = async (provider: "google" | "microsoft" | "linkedin") => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`
  }

  const register = async (name: string, email: string, password: string, entityType: string) => {
    const response = await authApi.register(name, email, password, entityType)

    if (response.data) {
      setCookie(null, "auth_token", response.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      })

      setUser(response.data.user)
      router.push("/onboarding")
      //router.push("/verify-email")
      return { success: true }
    }

    return { success: false, error: response.error || "Registration failed" }
  }

  const verifyEmail = async (token: string) => {
    const response = await authApi.verifyEmail(token)
    if (response.data) {
      return { success: true }
    }
    return { success: false, error: response.error || "Email verification failed" }
  }

  const requestPasswordReset = async (email: string) => {
    const response = await authApi.requestPasswordReset(email)
    if (response.data) {
      return { success: true }
    }
    return { success: false, error: response.error || "Request failed" }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    const response = await authApi.resetPassword(token, newPassword)
    if (response.data) {
      return { success: true }
    }
    return { success: false, error: response.error || "Reset failed" }
  }

  const logout = () => {
    destroyCookie(null, "auth_token")
    setUser(null)
    router.push("/login")
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user?.permissions?.includes(permission)??false
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
        loginWithOAuth,
        register,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
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
