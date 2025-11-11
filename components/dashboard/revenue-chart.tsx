"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 12500, payments: 45 },
  { month: "Feb", revenue: 15200, payments: 52 },
  { month: "Mar", revenue: 14800, payments: 48 },
  { month: "Apr", revenue: 18900, payments: 61 },
  { month: "May", revenue: 21300, payments: 68 },
  { month: "Jun", revenue: 19800, payments: 59 },
  { month: "Jul", revenue: 23400, payments: 74 },
  { month: "Aug", revenue: 25100, payments: 79 },
  { month: "Sep", revenue: 22700, payments: 71 },
  { month: "Oct", revenue: 26800, payments: 83 },
  { month: "Nov", revenue: 28500, payments: 88 },
  { month: "Dec", revenue: 31200, payments: 95 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  payments: {
    label: "Payments",
    color: "hsl(var(--chart-2))",
  },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and payment trends for the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
