"use client"

import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <ul className="space-y-4">
          <li className="hover:text-primary cursor-pointer">Dashboard</li>
          <li className="hover:text-primary cursor-pointer">Membros</li>
          <li className="hover:text-primary cursor-pointer">Financeiro</li>
          <li className="hover:text-primary cursor-pointer">Eventos</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
