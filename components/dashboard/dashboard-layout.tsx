// components/DashboardLayout.tsx
"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" 
import { LayoutDashboard, Users, DollarSign, Calendar, LogOut } from "lucide-react"

// --- 1. Definição da Estrutura de Navegação ---

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Membros", href: "/dashboard/membros", icon: Users },
  { name: "Financeiro", href: "/dashboard/financeiro", icon: DollarSign },
  { name: "Eventos", href: "/dashboard/eventos", icon: Calendar },
]

// --- 2. Interface de Props do Componente ---

interface DashboardLayoutProps {
  children: ReactNode
}

// --- 3. Componente Principal com Cores do Design System ---

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const currentPath = usePathname() 

  return (
    // Usa as variáveis globais --background e --foreground
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* 🚀 Sidebar: Usa --sidebar e --sidebar-foreground */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground shadow-xl p-4 flex-shrink-0 border-r border-border">
        {/* Título/Logo: Usa --primary para destaque */}
        <h1 className="text-2xl font-extrabold mb-10 text-primary">
          <Link href="/dashboard">Meu App</Link>
        </h1>
        
        <nav className="flex flex-col h-[calc(100vh-6rem)] justify-between">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.href 
              const Icon = item.icon
              
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    // Aplicação das cores do padrão:
                    // 1. Hover/Padrão
                    // 2. Estado Ativo: usa --primary e bg-primary/10 para um fundo suave
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
                      ${isActive 
                        // Estado Ativo: Fundo mais suave e texto da cor primária
                        ? 'bg-primary/10 text-primary font-semibold' 
                        // Estado Padrão: Cor do texto da sidebar e hover sutil
                        : 'text-sidebar-foreground hover:bg-muted/50 hover:text-primary'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          
          {/* Rodapé da Sidebar (Exemplo: Logout) */}
          <div className="pt-4 border-t border-border">
            <button
              // Aqui, vamos simular uma ação destrutiva usando a cor 'destructive'
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* 💻 Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
