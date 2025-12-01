"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { associationsApi } from "@/lib/api"
import type { Association } from "@/lib/types"
import { AssociationDialog } from "@/components/associations/association-dialog"
import { DeleteAssociationDialog } from "@/components/associations/delete-association-dialog"
import { format } from "date-fns"

export default function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [filteredAssociations, setFilteredAssociations] = useState<Association[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null)

  useEffect(() => {
    fetchAssociations()
  }, [])

  useEffect(() => {
    filterAssociations()
  }, [associations, searchQuery, statusFilter, typeFilter])

  async function fetchAssociations() {
    setLoading(true)
    const response = await associationsApi.getAll()
    if (response.data) {
      setAssociations(response.data)
    }
    setLoading(false)
  }

  function filterAssociations() {
    let filtered = [...associations]

    if (searchQuery) {
      filtered = filtered.filter(
        (assoc) =>
          assoc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assoc.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((assoc) => assoc.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((assoc) => assoc.type === typeFilter)
    }

    setFilteredAssociations(filtered)
  }

  function handleCreate() {
    setSelectedAssociation(null)
    setDialogOpen(true)
  }

  function handleEdit(association: Association) {
    setSelectedAssociation(association)
    setDialogOpen(true)
  }

  function handleDelete(association: Association) {
    setSelectedAssociation(association)
    setDeleteDialogOpen(true)
  }

  function handleDialogClose() {
    setDialogOpen(false)
    setSelectedAssociation(null)
    fetchAssociations()
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false)
    setSelectedAssociation(null)
    fetchAssociations()
  }

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
          <h1 className="text-3xl font-bold">Associações</h1>
          <p className="text-muted-foreground">Gerencie suas cooperativas, associações e sindicatos</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Criar Associação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <CardTitle>Todas as Associações</CardTitle>
              <CardDescription>
                {filteredAssociations.length} associação{filteredAssociations.length !== 1 ? "s" : ""} encontrada(s)
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar associações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="cooperative">Cooperativa</SelectItem>
                  <SelectItem value="association">Associação</SelectItem>
                  <SelectItem value="union">Sindicato</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAssociations.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2 />
                </EmptyMedia>
                <EmptyTitle>Nenhuma associação encontrada</EmptyTitle>
                <EmptyDescription>
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Tente ajustar seus filtros para encontrar o que está procurando."
                    : "Comece criando sua primeira associação."}
                </EmptyDescription>
              </EmptyHeader>
              {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
                <EmptyContent>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4" />
                    Criar Associação
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fundada</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssociations.map((association) => (
                  <TableRow key={association.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{association.name}</span>
                        <span className="text-xs text-muted-foreground">{association.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {association.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(association.foundedDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{association.memberCount}</TableCell>
                    <TableCell>
                      <Badge variant={association.status === "active" ? "default" : "secondary"}>
                        {association.status}
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
                          <DropdownMenuItem onClick={() => handleEdit(association)}>
                            <Pencil className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(association)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Excluir
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

      <AssociationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        association={selectedAssociation}
        onSuccess={handleDialogClose}
      />

      <DeleteAssociationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        association={selectedAssociation}
        onSuccess={handleDeleteDialogClose}
      />
    </div>
  )
}
