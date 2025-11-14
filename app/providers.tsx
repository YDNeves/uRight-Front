'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import {parseCookies as getCookie, setCookie, destroyCookie as deleteCookie } from 'nookies'
import { authApi } from '@/lib/api'
import type { User } from '@/lib/types'

interface AuthContextType {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cookies = getCookie(undefined)
    const storedToken = cookies['auth_token']
    const storedUser = cookies['uright_user']
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
      const newToken = response.data.token
      const userData = response.data.user
      
      setToken(newToken)
      setUser(userData)
      
      setCookie(undefined, 'auth_token', newToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      setCookie(undefined, 'uright_user', JSON.stringify(userData), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    } catch (error) {
      console.error('[v0] Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register(name, email, password)
      const newToken = response.data.token
      const userData = response.data.user
      
      setToken(newToken)
      setUser(userData)
      
      setCookie(undefined, 'auth_token', newToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      setCookie(undefined, 'uright_user', JSON.stringify(userData), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    } catch (error) {
      console.error('[v0] Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    deleteCookie(undefined, 'auth_token', { path: '/' })
    deleteCookie(undefined, 'uright_user', { path: '/' })
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
