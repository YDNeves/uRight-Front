"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit2, MapPin, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import useSWR from "swr"
import { eventsApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export default function EventDetailPage() {
  const params = useParams()
  const { hasPermission } = useAuth()
  const eventId = params.id as string
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    data: event,
    isLoading,
    error,
  } = useSWR(`/eventos/${eventId}`, async () => {
    const response = await eventsApi.getById(eventId)
    return response.data
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Evento não encontrado</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </div>
        {hasPermission("manage_events") && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button>
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Editar Evento</DrawerTitle>
                <DrawerDescription>Atualize as informações do evento</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 text-muted-foreground">Formulário de edição em drawer</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data</CardTitle>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{format(new Date(event.eventDate), "PPP p", { locale: pt })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Localização</CardTitle>
            <MapPin className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{event.location}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmações</CardTitle>
            <Users className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.attendanceCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Evento</CardTitle>
          <CardDescription>Informações completas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Descrição</label>
            <p>{event.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Badge className="mt-1">{event.status || "Ativo"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
