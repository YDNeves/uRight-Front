"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Users, Mail, Phone, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { membersApi } from "@/lib/api"
import type { Member } from "@/lib/types"
import { MemberDialog } from "@/components/members/member-dialog"
import { DeleteMemberDialog } from "@/components/members/delete-member-dialog"
import { format } from "date-fns"
import Link from "next/link"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchQuery, statusFilter, typeFilter])

  async function fetchMembers() {
    setLoading(true)
    const response = await membersApi.getAll()
    if (response.data) {
      setMembers(response.data)
    }
    setLoading(false)
  }

  function filterMembers() {
    let filtered = [...members]

    if (searchQuery) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.phone.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((member) => member.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((member) => member.membershipType === typeFilter)
    }

    setFilteredMembers(filtered)
  }

  function handleCreate() {
    setSelectedMember(null)
    setDialogOpen(true)
  }

  function handleEdit(member: Member) {
    setSelectedMember(member)
    setDialogOpen(true)
  }

  function handleDelete(member: Member) {
    setSelectedMember(member)
    setDeleteDialogOpen(true)
  }

  function handleDialogClose() {
    setDialogOpen(false)
    setSelectedMember(null)
    fetchMembers()
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false)
    setSelectedMember(null)
    fetchMembers()
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membros</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os membros das suas associações</p>
        </div>
        <div className="flex gap-2">
          <Link href="/members/requests">
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Pedidos Pendentes
            </Button>
          </Link>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <CardTitle>Todos os Membros</CardTitle>
              <CardDescription>
                {filteredMembers.length} membro{filteredMembers.length !== 1 ? "s" : ""} encontrado
                {filteredMembers.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar membros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="honorary">Honorário</SelectItem>
                  <SelectItem value="associate">Associado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>Nenhum membro encontrado</EmptyTitle>
                <EmptyDescription>
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Tente ajustar seus filtros"
                    : "Comece adicionando seu primeiro membro"}
                </EmptyDescription>
              </EmptyHeader>
              {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
                <EmptyContent>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Membro
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {member.membershipType === "regular"
                          ? "Regular"
                          : member.membershipType === "honorary"
                            ? "Honorário"
                            : "Associado"}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(member.joinDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "active"
                            ? "default"
                            : member.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {member.status === "active" ? "Ativo" : member.status === "suspended" ? "Suspenso" : "Inativo"}
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
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(member)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={selectedMember}
        onSuccess={handleDialogClose}
      />

      <DeleteMemberDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        member={selectedMember}
        onSuccess={handleDeleteDialogClose}
      />
    </div>
  )
}
