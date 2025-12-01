"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, DollarSign, Clock, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { dashboardApi } from "@/lib/api"
import type { DashboardStats } from "@/lib/types"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { MemberActivityChart } from "@/components/dashboard/member-activity-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { translations } from "@/lib/pt-BR"
const t = translations.dashboard
const tCommon = translations.common

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const response = await dashboardApi.getStats()
      if (response.data) {
        setStats(response.data)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">{t.loading}</div>
      </div>
    )
  }

  const statCards = [
    {
      title: t.totalMembers,
      value: stats?.totalMembers || 0,
      icon: Users,
      description: t.allRegistered,
      trend: "+12%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
    },
    {
      title: t.activeMembers,
      value: stats?.activeMembers || 0,
      icon: UserCheck,
      description: t.currentlyActive,
      trend: "+8%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
    },
    {
      title: t.totalRevenue,
      value: `${(stats?.totalRevenue || 0).toLocaleString()} €`,
      icon: DollarSign,
      description: t.thisMonth,
      trend: "+23%",
      trendLabel: t.fromLastMonth,
      trendUp: true,
    },
    {
      title: t.pendingPayments,
      value: stats?.pendingPayments || 0,
      icon: Clock,
      description: t.awaitingPayment,
      trend: "-5%",
      trendLabel: t.fromLastMonth,
      trendUp: false,
    },
    {
      title: t.upcomingEvents,
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      description: t.next30Days,
      trend: "+3",
      trendLabel: t.newEvents,
      trendUp: true,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.welcome}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>
                  {stat.trend} {stat.trendLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">{t.revenue}</TabsTrigger>
          <TabsTrigger value="members">{t.members}</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart />
        </TabsContent>
        <TabsContent value="members" className="space-y-4">
          <MemberActivityChart />
        </TabsContent>
      </Tabs>

      {/* Activity and Events */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity activities={stats?.recentActivity || []} />
        <UpcomingEvents />
      </div>
    </div>
  )
}
