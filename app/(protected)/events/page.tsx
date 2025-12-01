"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { eventsApi } from "@/lib/api"
import type { Event } from "@/lib/types"
import { EventDialog } from "@/components/events/event-dialog"
import { DeleteEventDialog } from "@/components/events/delete-event-dialog"
import { format } from "date-fns"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchQuery, statusFilter])

  async function fetchEvents() {
    setLoading(true)
    const response = await eventsApi.getAll()
    if (response.data) {
      setEvents(response.data)
    }
    setLoading(false)
  }

  function filterEvents() {
    let filtered = [...events]

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }

  function handleCreate() {
    setSelectedEvent(null)
    setDialogOpen(true)
  }

  function handleEdit(event: Event) {
    setSelectedEvent(event)
    setDialogOpen(true)
  }

  function handleDelete(event: Event) {
    setSelectedEvent(event)
    setDeleteDialogOpen(true)
  }

  function handleDialogClose() {
    setDialogOpen(false)
    setSelectedEvent(null)
    fetchEvents()
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false)
    setSelectedEvent(null)
    fetchEvents()
  }

  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming").length
  const ongoingEvents = filteredEvents.filter((e) => e.status === "ongoing").length
  const completedEvents = filteredEvents.filter((e) => e.status === "completed").length

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Organize and manage association events</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingEvents}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents}</div>
            <p className="text-xs text-muted-foreground">Past events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <CardTitle>All Events</CardTitle>
              <CardDescription>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar />
                </EmptyMedia>
                <EmptyTitle>No events found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters to find what you're looking for."
                    : "Get started by creating your first event."}
                </EmptyDescription>
              </EmptyHeader>
              {!searchQuery && statusFilter === "all" && (
                <EmptyContent>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Location</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const attendancePercentage = (event.attendees / event.capacity) * 100

                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-xs text-muted-foreground">{event.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(new Date(event.date), "MMM dd, yyyy 'at' h:mm a")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {event.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {event.attendees} / {event.capacity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(attendancePercentage)}% full
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.status === "upcoming"
                              ? "default"
                              : event.status === "ongoing"
                                ? "default"
                                : event.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(event)}>
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(event)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} event={selectedEvent} onSuccess={handleDialogClose} />

      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        event={selectedEvent}
        onSuccess={handleDeleteDialogClose}
      />
    </div>
  )
}
