"use client"

import { useEffect } from "react"
import { useNotifications } from "@/lib/notifications-context"
import { toast } from "sonner"
import { Bell } from "lucide-react"

export function NotificationsToast() {
  const { notifications } = useNotifications()

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      toast.message(latestNotification.title, {
        description: latestNotification.message,
        icon: <Bell className="h-4 w-4" />,
      })
    }
  }, [notifications])

  return null
}
