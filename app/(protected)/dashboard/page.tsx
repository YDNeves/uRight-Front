"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, Calendar, TrendingUp, LogOut, Menu, X } from "lucide-react"
import { DASHBOARD_MENU, CURRENCY } from "@/lib/constants"

const stats = [
  { title: "Membros Ativos", value: "1.245", change: "+12%", icon: Users },
  { title: `Receita Mês`, value: `${CURRENCY.symbol} 125.800`, change: "+8%", icon: BarChart3 },
  { title: "Eventos", value: "8", change: "+2", icon: Calendar },
  { title: "Crescimento", value: "24%", change: "Este mês", icon: TrendingUp },
]

const recentActivities = [
  { label: "Novo membro registado", time: "2 horas atrás" },
  { label: "Assembleia Geral agendada", time: "5 horas atrás" },
  { label: "Pagamento recebido KZ 45.000", time: "1 dia atrás" },
  { label: "Relatório mensal gerado", time: "2 dias atrás" },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="uRight" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="hidden sm:inline font-bold text-secondary">uRight</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              JC
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed left-0 top-16 lg:top-0 w-64 h-screen bg-white border-r border-border transition-transform duration-300 z-30`}
        >
          <div className="p-6 space-y-8">
            <nav className="space-y-2">
              {DASHBOARD_MENU.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground/70 hover:text-primary transition-colors flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Painel de Controlo</h1>
              <p className="text-foreground/60 mt-2">Resumo geral da sua associação</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground/60">{stat.title}</CardTitle>
                      <Icon className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-xs text-primary mt-2">{stat.change}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Receita Este Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-full h-full p-4" viewBox="0 0 300 150">
                      <polyline
                        points="10,120 50,80 90,100 130,40 170,70 210,30 250,60 290,20"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#17B8A8" />
                          <stop offset="100%" stopColor="#003B8B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-foreground font-medium text-sm">{activity.label}</p>
                          <p className="text-xs text-foreground/60">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button className="bg-secondary hover:bg-secondary/90">Novo Membro</Button>
                  <Button variant="outline">Criar Evento</Button>
                  <Button variant="outline">Nova Receita</Button>
                  <Button variant="outline">Gerar Relatório</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-20" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  )
}
