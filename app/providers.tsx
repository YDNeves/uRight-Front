'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { authApi } from '@/lib/api'
import type { User, Permission } from '@/lib/types'

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
      setLoading(false)
      return
    }

    try {
      const response = await authApi.getCurrentUser()
      if (response.data) {
        setUser(response.data)
      } else {
        destroyCookie(null, 'auth_token')
      }
    } catch (error) {
      console.error('[v0] Auth check failed:', error)
      destroyCookie(null, 'auth_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)

      if (response.data?.token && response.data?.user) {
        setCookie(null, 'auth_token', response.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          sameSite: 'lax',
        })

        setUser(response.data.user)
        const redirectPath = response.data.user.hasCompletedOnboarding ? '/dashboard' : '/onboarding'
        router.push(redirectPath)
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error?.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password)

      if (response.data?.token && response.data?.user) {
        setCookie(null, 'auth_token', response.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          sameSite: 'lax',
        })

        setUser(response.data.user)
        router.push('/onboarding')
        return { success: true }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      return { success: false, error: error?.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    destroyCookie(null, 'auth_token')
    setUser(null)
    router.push('/login')
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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
