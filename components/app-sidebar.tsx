"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  BarChart3,
  Bell,
  DollarSign,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import type { Permission } from "@/lib/types"
import { translations } from "@/lib/pt-BR"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const t = translations.nav

const navigationItems = [
  { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard, permission: "view_dashboard" as Permission },
  {
    name: "Associações",
    href: "/associations",
    icon: Building2,
    permission: "manage_associations" as Permission,
  },
  { name: t.members, href: "/members", icon: Users, permission: "manage_members" as Permission },
  { name: "Contribuições", href: "/payments", icon: CreditCard, permission: "manage_payments" as Permission },
  { name: t.events, href: "/events", icon: Calendar, permission: "manage_events" as Permission },
  { name: t.communications, href: "/communications", icon: Bell, permission: "send_communications" as Permission },
  { name: t.finance, href: "/finance", icon: DollarSign, permission: "view_reports" as Permission },
  { name: t.reports, href: "/reports", icon: BarChart3, permission: "view_reports" as Permission },
  { name: t.settings, href: "/settings", icon: Settings, permission: "manage_settings" as Permission },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const visibleNavigation = navigationItems.filter((item) => hasPermission(item.permission))

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              U
            </div>
            <span className="text-lg font-semibold truncate">uRight</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
          <ChevronDown className={cn("h-4 w-4 transition-transform", !isOpen && "-rotate-90")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground mt-2",
            !isOpen && "p-0 justify-center",
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {isOpen && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  )
}
