"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit2, Mail, Phone, Calendar } from "lucide-react"
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
import { membersApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export default function MemberDetailPage() {
  const params = useParams()
  const { hasPermission } = useAuth()
  const memberId = params.id as string
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    data: member,
    isLoading,
    error,
  } = useSWR(`/membros/${memberId}`, async () => {
    const response = await membersApi.getById(memberId)
    return response.data
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link href="/members">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Membro não encontrado</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/members">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <Badge className="mt-2">{member.status}</Badge>
          </div>
        </div>
        {hasPermission("manage_members") && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button>
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Editar Membro</DrawerTitle>
                <DrawerDescription>Atualize as informações do membro</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 text-muted-foreground">Formulário de edição em drawer</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{member.email}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telefone</CardTitle>
            <Phone className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{member.phone || "Não especificado"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membro desde</CardTitle>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{format(new Date(member.joinedDate), "PPP", { locale: pt })}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Atividades recentes deste membro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Histórico de atividades</div>
        </CardContent>
      </Card>
    </div>
  )
}
