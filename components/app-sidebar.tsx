"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, CreditCard, Calendar, Settings, LogOut, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import type { Permission } from "@/lib/types"
import { translations } from "@/lib/pt-BR"

const t = translations.nav

const navigationItems = [
  { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard, permission: "view_dashboard" as Permission },
  { name: t.associations, href: "/associations", icon: Building2, permission: "manage_associations" as Permission },
  { name: t.members, href: "/members", icon: Users, permission: "manage_members" as Permission },
  { name: t.payments, href: "/payments", icon: CreditCard, permission: "manage_payments" as Permission },
  { name: t.events, href: "/events", icon: Calendar, permission: "manage_events" as Permission },
  { name: t.reports, href: "/reports", icon: BarChart3, permission: "view_reports" as Permission },
  { name: t.settings, href: "/settings", icon: Settings, permission: "manage_settings" as Permission },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  const visibleNavigation = navigationItems.filter((item) => hasPermission(item.permission))

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-sm font-bold text-white">AG</span>
          </div>
          <span className="text-lg font-semibold">AssoGest</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          {t.logout}
        </button>
      </div>
    </div>
  )
}
