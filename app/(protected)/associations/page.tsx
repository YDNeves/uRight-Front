'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const initialAssociations = [
  { id: 1, name: 'Associação Cultural', cnpj: '12.345.678/0001-90', members: 245, status: 'Ativa', founded: '2020-03-15' },
  { id: 2, name: 'Associação Comunitária', cnpj: '98.765.432/0001-10', members: 180, status: 'Ativa', founded: '2019-07-22' },
  { id: 3, name: 'Associação Esportiva', cnpj: '11.222.333/0001-44', members: 320, status: 'Ativa', founded: '2021-01-10' },
  { id: 4, name: 'Associação Ambiental', cnpj: '55.666.777/0001-88', members: 95, status: 'Inativa', founded: '2018-11-05' },
  { id: 5, name: 'Associação Profissional', cnpj: '44.555.666/0001-99', members: 420, status: 'Ativa', founded: '2017-05-20' },
]

export default function AssociationsPage() {
  const [associations, setAssociations] = useState(initialAssociations)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAssoc, setEditingAssoc] = useState(null)
  const itemsPerPage = 5

  const filteredAssociations = useMemo(() => {
    return associations.filter(assoc => {
      const matchSearch = assoc.name.toLowerCase().includes(search.toLowerCase()) ||
                         assoc.cnpj.includes(search)
      const matchStatus = !statusFilter || assoc.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [associations, search, statusFilter])

  const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage)
  const paginatedAssociations = filteredAssociations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSaveAssoc = (data) => {
    if (editingAssoc) {
      setAssociations(associations.map(a => a.id === editingAssoc.id ? { ...a, ...data } : a))
    } else {
      setAssociations([...associations, { ...data, id: Math.max(...associations.map(a => a.id)) + 1, founded: new Date().toISOString().split('T')[0] }])
    }
    setOpenDialog(false)
  }

  const handleDeleteAssoc = (id) => {
    setAssociations(associations.filter(a => a.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Associações</h1>
          <p className="text-muted-foreground mt-2">Gerencie as associações cadastradas</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
          setEditingAssoc(null)
          setOpenDialog(true)
        }}>
          <Plus size={18} className="mr-2" /> Nova Associação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Associações</CardTitle>
          <CardDescription>Total de {filteredAssociations.length} associação(ões)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CNPJ..."
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
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
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
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fundada em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssociations.length > 0 ? (
                  paginatedAssociations.map((assoc) => (
                    <TableRow key={assoc.id}>
                      <TableCell className="font-medium">{assoc.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{assoc.cnpj}</TableCell>
                      <TableCell>{assoc.members}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          assoc.status === 'Ativa'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {assoc.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{assoc.founded}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAssoc(assoc)
                            setOpenDialog(true)
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteAssoc(assoc.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma associação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

      <AssocDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        assoc={editingAssoc}
        onSave={handleSaveAssoc}
      />
    </div>
  )
}

function AssocDialog({ open, onOpenChange, assoc, onSave }) {
  const [formData, setFormData] = useState(assoc || { name: '', cnpj: '', members: 0, status: 'Ativa' })

  const handleSave = () => {
    onSave(formData)
    setFormData({ name: '', cnpj: '', members: 0, status: 'Ativa' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assoc ? 'Editar Associação' : 'Nova Associação'}</DialogTitle>
          <DialogDescription>
            {assoc ? 'Atualize os dados da associação' : 'Cadastre uma nova associação'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da Associação"
            />
          </div>
          <div>
            <label className="text-sm font-medium">CNPJ</label>
            <Input
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              placeholder="12.345.678/0001-90"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Número de Membros</label>
            <Input
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              {assoc ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
