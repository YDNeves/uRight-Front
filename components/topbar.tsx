'use client'

import { useAuth } from '@/app/providers'
import { Bell, Search, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TopBar() {
  const { user } = useAuth()

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
          <Search size={18} className="text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="border-0 bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-all">
          <Bell size={20} className="text-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-all">
          <Settings size={20} className="text-foreground" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
