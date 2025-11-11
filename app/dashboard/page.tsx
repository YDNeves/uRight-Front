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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const t = translations.dashboard
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
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: Users,
      description: "All registered members",
      trend: "+12% from last month",
      trendUp: true,
    },
    {
      title: "Active Members",
      value: stats?.activeMembers || 0,
      icon: UserCheck,
      description: "Currently active",
      trend: "+8% from last month",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "This month",
      trend: "+23% from last month",
      trendUp: true,
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments || 0,
      icon: Clock,
      description: "Awaiting payment",
      trend: "-5% from last month",
      trendUp: false,
    },
    {
      title: "Upcoming Events",
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      description: "Next 30 days",
      trend: "+3 new events",
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
                <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
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
