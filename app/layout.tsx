import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationsProvider } from "@/lib/notifications-context"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsToast } from "@/components/notifications-toast"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "uRight - Sonhos & Realizações",
  description: "Sistema completo de gestão para associações e cooperativas",
    generator: 'v0.app',
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16" },
        { url: "/favicon-32x32.png", sizes: "32x32" },
      ],
      apple: "/apple-touch-icon.png",
    }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationsProvider>
            {children}
            <NotificationsToast />
            <Toaster />
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
