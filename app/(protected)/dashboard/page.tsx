"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import {
  Users,
  UserCheck,
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react"
import { dashboardApi } from "@/lib/api"
import type { DashboardStats } from "@/lib/types"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { MemberActivityChart } from "@/components/dashboard/member-activity-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { translations } from "@/lib/pt-BR"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const t = translations.dashboard
const tCommon = translations.common

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const response = await dashboardApi.getStats()
      if (response.data) setStats(response.data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const isMember = user?.role === "member"
  const isTreasurer = user?.role === "treasurer"
  const isAdmin = user?.role === "admin" || user?.role === "superadmin"

  const statCards = [
    {
      title: t.totalMembers,
      value: stats?.totalMembers || 0,
      icon: Users,
      description: t.allRegistered,
      trend: "+12%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
      show: !isMember,
    },
    {
      title: t.activeMembers,
      value: stats?.activeMembers || 0,
      icon: UserCheck,
      description: t.currentlyActive,
      trend: "+8%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
      show: !isMember,
    },
    {
      title: t.totalRevenue,
      value: `${(stats?.totalRevenue || 0).toLocaleString()} €`,
      icon: DollarSign,
      description: t.thisMonth,
      trend: "+23%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
      show: isTreasurer || isAdmin,
    },
    {
      title: t.pendingPayments,
      value: stats?.pendingPayments || 0,
      icon: Clock,
      description: t.awaitingPayment,
      trend: "-5%",
      trendLabel: t.fromLastMonth,
      trendUp: false,
      show: isTreasurer || isAdmin,
    },
    {
      title: t.upcomingEvents,
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      description: t.next30Days,
      trend: "+3",
      trendLabel: t.newEvents,
      trendUp: true,
      show: true,
    },
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground mt-1">{t.welcome}</p>
          </div>
          <Badge variant="outline" className="h-fit">
            <Eye className="h-3 w-3 mr-1" />
            {user?.role.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards
          .filter((stat) => stat.show)
          .map((stat) => (
            <Card key={stat.title} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trendUp ? "text-green-600" : "text-red-600"}>
                    {stat.trend} {stat.trendLabel}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {(isAdmin || isTreasurer) && (
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="members">Membros</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue">
                <RevenueChart />
              </TabsContent>
              <TabsContent value="members">
                <MemberActivityChart />
              </TabsContent>
            </Tabs>
          )}

          {/* Member Status Card (for members) */}
          {isMember && (
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Status da sua Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Verificação de Email</p>
                    <p className="text-xs text-muted-foreground">Confirmado</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Perfil Completo</p>
                    <p className="text-xs text-muted-foreground">75% completo</p>
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Activity & Events (1/3 width) */}
        <div className="space-y-6">
          <RecentActivity activities={stats?.recentActivity || []} />
          <UpcomingEvents />
        </div>
      </div>

      {/* Pending Actions Section */}
      {(isAdmin || user?.role === "secretary") && (
        <Card className="border-l-4 border-l-amber-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Ações Pendentes
            </CardTitle>
            <CardDescription>Tarefas que requerem sua atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">3 pedidos de acesso pendentes</p>
                  <p className="text-xs text-muted-foreground">Membros aguardando aprovação</p>
                </div>
                <Button variant="outline" size="sm">
                  Revisar
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">5 pagamentos atrasados</p>
                  <p className="text-xs text-muted-foreground">Membros com contribuições vencidas</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Lista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
