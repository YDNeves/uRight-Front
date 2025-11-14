'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, AlertCircle, Loader } from 'lucide-react'
import { membersApi } from '@/lib/api'
import { Member } from '@/lib/types'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    loadMembers()
  }, [currentPage, search, statusFilter])

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await membersApi.getAll(currentPage, itemsPerPage, search || undefined)
      console.log('[v0] Members loaded:', response.data)
      setMembers(response.data.data || response.data || [])
    } catch (err: any) {
      console.error('[v0] Error loading members:', err)
      setError(err.message || 'Erro ao carregar membros')
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchStatus = !statusFilter || member.status === statusFilter
      return matchStatus
    })
  }, [members, statusFilter])

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSaveMember = async (data: Partial<Member>) => {
    try {
      if (editingMember) {
        await membersApi.update(editingMember.id, data)
        console.log('[v0] Member updated successfully')
      } else {
        await membersApi.create(data)
        console.log('[v0] Member created successfully')
      }
      setOpenDialog(false)
      loadMembers()
    } catch (error) {
      console.error('[v0] Error saving member:', error)
      setError('Erro ao salvar membro')
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este membro?')) return
    try {
      await membersApi.delete(id)
      console.log('[v0] Member deleted successfully')
      loadMembers()
    } catch (error) {
      console.error('[v0] Error deleting member:', error)
      setError('Erro ao eliminar membro')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Membros</h1>
          <p className="text-muted-foreground mt-2">Gerencie os membros das associações</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
          setEditingMember(null)
          setOpenDialog(true)
        }}>
          <Plus size={18} className="mr-2" /> Novo Membro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>Total de {filteredMembers.length} membro(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setStatusFilter('')
                setCurrentPage(1)
              }}
            >
              Limpar Filtros
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-8 flex items-center justify-center gap-2">
                <Loader className="animate-spin" size={18} />
                <span>Carregando membros...</span>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.length > 0 ? (
                    paginatedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                        <TableCell className="text-sm">{member.phone || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{member.joinDate || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            member.status === 'ativo'
                              ? 'bg-green-100 text-green-700'
                              : member.status === 'inativo'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMember(member)
                              setOpenDialog(true)
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum membro encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MemberDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        member={editingMember}
        onSave={handleSaveMember}
      />
    </div>
  )
}

function MemberDialog({ open, onOpenChange, member, onSave }: any) {
  const [formData, setFormData] = useState(member || { name: '', email: '', phone: '', status: 'ativo' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(member || { name: '', email: '', phone: '', status: 'ativo' })
  }, [member, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(formData)
      setFormData({ name: '', email: '', phone: '', status: 'ativo' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
          <DialogDescription>
            {member ? 'Atualize os dados do membro' : 'Adicione um novo membro à associação'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome Completo</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="João Silva"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="joao@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(244) 923-123-456"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : member ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
