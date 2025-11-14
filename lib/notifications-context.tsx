'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (message: string, type: NotificationType, duration?: number) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration: number = 3000) => {
      const id = `notification-${Date.now()}-${Math.random()}`
      
      setNotifications((prev) => [...prev, { id, message, type, duration }])

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
