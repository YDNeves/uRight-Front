"use client"

import { useEffect, useState } from "react"
import { Search, MoreHorizontal, CheckCircle, XCircle, Clock, Mail, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MemberRequest {
  id: string
  userId: string
  email: string
  name: string
  associationId: string
  associationName: string
  status: "pending" | "approved" | "rejected"
  requestedAt: string
  respondedAt?: string
  respondedBy?: string
}

export default function MemberRequestsPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<MemberRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<MemberRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const canApproveMembers = hasPermission("manage_members") && (user?.role === "admin" || user?.role === "secretary")

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchQuery, statusFilter])

  async function fetchRequests() {
    setLoading(true)
    // Mock data - replace with API call
    const mockRequests: MemberRequest[] = [
      {
        id: "1",
        userId: "user1",
        email: "joao@example.com",
        name: "João Silva",
        associationId: "assoc1",
        associationName: "Associação ABC",
        status: "pending",
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        userId: "user2",
        email: "maria@example.com",
        name: "Maria Santos",
        associationId: "assoc1",
        associationName: "Associação ABC",
        status: "pending",
        requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        userId: "user3",
        email: "pedro@example.com",
        name: "Pedro Costa",
        associationId: "assoc2",
        associationName: "Cooperativa XYZ",
        status: "approved",
        requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        respondedBy: user?.name || "Admin",
      },
    ]
    setRequests(mockRequests)
    setLoading(false)
  }

  function filterRequests() {
    let filtered = [...requests]

    if (searchQuery) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.associationName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }

  async function handleApprove(request: MemberRequest) {
    // API call to approve
    toast({
      title: "Membro Aprovado",
      description: `${request.name} foi aprovado com sucesso.`,
    })
    // Refetch or update state
    setDialogOpen(false)
  }

  async function handleReject(request: MemberRequest) {
    // API call to reject
    toast({
      title: "Pedido Rejeitado",
      description: `O pedido de ${request.name} foi rejeitado.`,
      variant: "destructive",
    })
    setDialogOpen(false)
  }

  if (!canApproveMembers) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Você não tem permissão para gerir pedidos de acesso.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Pedidos de Acesso a Membros</h1>
        <p className="text-muted-foreground mt-1">Gerencie e aprove pedidos de novos membros</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" /> Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Requerem ação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" /> Aprovados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Membros ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" /> Rejeitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Pedidos recusados</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <CardTitle>Todos os Pedidos</CardTitle>
              <CardDescription>
                {filteredRequests.length} pedido{filteredRequests.length !== 1 ? "s" : ""} encontrado
                {filteredRequests.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar pedidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Clock />
                </EmptyMedia>
                <EmptyTitle>Nenhum pedido encontrado</EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? "Tente ajustar sua pesquisa" : "Não há pedidos de acesso pendentes"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Associação</TableHead>
                  <TableHead>Data do Pedido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Mail className="h-3 w-3" />
                        {request.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{request.associationName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(request.requestedAt), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "outline"
                            : request.status === "approved"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {request.status === "pending"
                          ? "Pendente"
                          : request.status === "approved"
                            ? "Aprovado"
                            : "Rejeitado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(request)
                                setAction("approve")
                                setDialogOpen(true)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(request)
                                setAction("reject")
                                setDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{action === "approve" ? "Aprovar Membro" : "Rejeitar Pedido"}</AlertDialogTitle>
            <AlertDialogDescription>
              {action === "approve"
                ? `Tem a certeza que deseja aprovar ${selectedRequest?.name} como membro de ${selectedRequest?.associationName}?`
                : `Tem a certeza que deseja rejeitar o pedido de ${selectedRequest?.name}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => {
              if (selectedRequest) {
                if (action === "approve") {
                  handleApprove(selectedRequest)
                } else {
                  handleReject(selectedRequest)
                }
              }
            }}
            className={action === "reject" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {action === "approve" ? "Aprovar" : "Rejeitar"}
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
