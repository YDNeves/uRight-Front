"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { initializeSocket } from "./socket"
import type { Notification } from "./types"

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const socket = initializeSocket(user.id)

    socket.on("alert:received", (data: Notification) => {
      setNotifications((prev) => [data, ...prev].slice(0, 50))
    })

    socket.on("message:received", (data: Notification) => {
      setNotifications((prev) => [data, ...prev].slice(0, 50))
    })

    return () => {
      socket.off("alert:received")
      socket.off("message:received")
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification: (notification) => setNotifications((prev) => [notification, ...prev]),
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications deve ser usado dentro de NotificationsProvider")
  }
  return context
}
