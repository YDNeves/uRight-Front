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
import { associationsApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export default function AssociationDetailPage() {
  const params = useParams()
  const { hasPermission } = useAuth()
  const associationId = params.id as string
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    data: association,
    isLoading,
    error,
  } = useSWR(`/associacoes/${associationId}`, async () => {
    const response = await associationsApi.getById(associationId)
    return response.data
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !association) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link href="/associations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Associação não encontrada</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/associations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{association.name}</h1>
            <p className="text-muted-foreground">{association.description}</p>
          </div>
        </div>
        {hasPermission("manage_associations") && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button>
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Editar Associação</DrawerTitle>
                <DrawerDescription>Atualize as informações da associação</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 text-muted-foreground">Formulário de edição em drawer</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{association.memberCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipo</CardTitle>
            <Badge variant="outline" className="capitalize">
              {association.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground capitalize">{association.type}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fundada</CardTitle>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              {format(new Date(association.foundedDate), "PPP", { locale: pt })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Detalhes completos da associação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Localização</label>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {association.location || "Não especificada"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Badge variant={association.status === "active" ? "default" : "secondary"} className="mt-1">
              {association.status === "active" ? "Ativa" : "Inativa"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
