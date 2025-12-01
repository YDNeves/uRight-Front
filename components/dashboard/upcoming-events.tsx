"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

const upcomingEvents = [
  {
    id: "1",
    title: "Annual General Meeting",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    location: "Main Conference Hall",
    attendees: 45,
    capacity: 100,
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "Community Fundraiser",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    location: "City Park",
    attendees: 78,
    capacity: 150,
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "Member Training Workshop",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
    location: "Training Center",
    attendees: 23,
    capacity: 50,
    status: "upcoming" as const,
  },
  {
    id: "4",
    title: "Quarterly Review Meeting",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
    location: "Board Room",
    attendees: 12,
    capacity: 20,
    status: "upcoming" as const,
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events scheduled for the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const attendancePercentage = (event.attendees / event.capacity) * 100

            return (
              <div key={event.id} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(event.date, "MMM dd, yyyy 'at' h:mm a")}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees} / {event.capacity} attendees
                      </div>
                    </div>
                  </div>
                  <Badge variant={attendancePercentage > 80 ? "default" : "secondary"}>
                    {Math.round(attendancePercentage)}% full
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
