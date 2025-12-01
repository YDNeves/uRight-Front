"use client"

import { useState } from "react"
import { Plus, AlertCircle, MessageSquare, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import useSWR from "swr"
import { communicationsApi } from "@/lib/api"

interface CommunicationData {
  id: string
  type: "system" | "manual" | "automatic"
  severity: "info" | "warning" | "error" | "success"
  title: string
  message: string
  senderId: string
  createdAt: string
  readAt?: string
}

export default function CommunicationsPage() {
  const { hasPermission, user } = useAuth()
  const [selectedType, setSelectedType] = useState<string>("all")

  const {
    data: communications,
    isLoading,
    error,
  } = useSWR<CommunicationData[]>("/communications", async () => {
    const response = await communicationsApi.getAll()
    return response.data || []
  })

  const canSend = hasPermission("manage_communications")

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!canSend) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Você não tem permissão para acessar comunicações.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredCommunications =
    selectedType === "all" ? communications : communications?.filter((c) => c.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <AlertCircle className="h-4 w-4" />
      case "manual":
        return <MessageSquare className="h-4 w-4" />
      case "automatic":
        return <Zap className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comunicações & Alertas</h1>
          <p className="text-muted-foreground">Gerencie avisos do sistema e envie mensagens aos membros</p>
        </div>
        {canSend && (
          <Button>
            <Plus className="h-4 w-4" />
            Novo Alerta
          </Button>
        )}
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({communications?.length || 0})</TabsTrigger>
          <TabsTrigger value="system">
            Avisos do Sistema ({communications?.filter((c) => c.type === "system").length || 0})
          </TabsTrigger>
          <TabsTrigger value="manual">
            Mensagens Manuais ({communications?.filter((c) => c.type === "manual").length || 0})
          </TabsTrigger>
          <TabsTrigger value="automatic">
            Alertas Automáticos ({communications?.filter((c) => c.type === "automatic").length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4">
          {!filteredCommunications || filteredCommunications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma comunicação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma comunicação encontrada para este filtro.</p>
              </CardContent>
            </Card>
          ) : (
            filteredCommunications.map((comm) => (
              <Card key={comm.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <div>
                        <CardTitle className="text-lg">{comm.title}</CardTitle>
                        <CardDescription>{new Date(comm.createdAt).toLocaleDateString("pt-PT")}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(comm.severity)}>{comm.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{comm.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
