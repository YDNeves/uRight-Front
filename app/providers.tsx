'use client'

import { AuthProvider, useAuth } from '../lib/auth-context'
import { NotificationProvider } from '../lib/notifications-context'

export { useAuth }
export { AuthProvider }

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  )
}
