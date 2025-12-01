"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, DollarSign, Calendar, UserCog } from "lucide-react"
import type { Activity } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityProps {
  activities: Activity[]
}

const activityIcons = {
  member_joined: UserPlus,
  payment_received: DollarSign,
  event_created: Calendar,
  member_updated: UserCog,
}

const activityColors = {
  member_joined: "bg-green-500/10 text-green-500",
  payment_received: "bg-blue-500/10 text-blue-500",
  event_created: "bg-purple-500/10 text-purple-500",
  member_updated: "bg-orange-500/10 text-orange-500",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  // Mock data if no activities provided
  const displayActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            type: "member_joined" as const,
            description: "John Doe joined as a new member",
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
          {
            id: "2",
            type: "payment_received" as const,
            description: "Payment of $150 received from Jane Smith",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            id: "3",
            type: "event_created" as const,
            description: "Annual General Meeting scheduled for next month",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          },
          {
            id: "4",
            type: "member_updated" as const,
            description: "Sarah Johnson updated her profile information",
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          },
          {
            id: "5",
            type: "payment_received" as const,
            description: "Membership fee of $200 received from Mike Brown",
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          },
        ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your associations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 5).map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
