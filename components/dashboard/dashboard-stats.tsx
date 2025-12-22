"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description: string
  trend: string
  trendLabel: string
  trendUp: boolean
}

export function StatCard({ title, value, icon: Icon, description, trend, trendLabel, trendUp }: StatCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
          {trendUp ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span className={trendUp ? "text-green-600" : "text-red-600"}>
            {trend} {trendLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
