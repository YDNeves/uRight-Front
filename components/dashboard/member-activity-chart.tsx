"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const memberData = [
  { month: "Jan", new: 12, active: 145, inactive: 8 },
  { month: "Feb", new: 15, active: 152, inactive: 6 },
  { month: "Mar", new: 10, active: 156, inactive: 7 },
  { month: "Apr", new: 18, active: 167, inactive: 5 },
  { month: "May", new: 22, active: 184, inactive: 4 },
  { month: "Jun", new: 16, active: 195, inactive: 6 },
  { month: "Jul", new: 25, active: 214, inactive: 5 },
  { month: "Aug", new: 20, active: 229, inactive: 7 },
  { month: "Sep", new: 19, active: 241, inactive: 6 },
  { month: "Oct", new: 28, active: 263, inactive: 4 },
  { month: "Nov", new: 24, active: 283, inactive: 5 },
  { month: "Dec", new: 31, active: 309, inactive: 3 },
]

const chartConfig = {
  new: {
    label: "New Members",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Active Members",
    color: "hsl(var(--chart-2))",
  },
  inactive: {
    label: "Inactive Members",
    color: "hsl(var(--chart-3))",
  },
}

export function MemberActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Activity</CardTitle>
        <CardDescription>New, active, and inactive members over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={memberData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="new" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="active" fill="var(--color-active)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
