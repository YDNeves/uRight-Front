'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const initialContributions = [
  { id: 1, member: 'João Silva', amount: 150.00, frequency: 'Mensal', startDate: '2023-01-10', status: 'Ativa', nextPayment: '2024-02-15' },
  { id: 2, member: 'Maria Santos', amount: 200.00, frequency: 'Mensal', startDate: '2023-02-15', status: 'Ativa', nextPayment: '2024-02-15' },
  { id: 3, member: 'Pedro Oliveira', amount: 100.00, frequency: 'Trimestral', startDate: '2023-03-20', status: 'Inativa', nextPayment: 'N/A' },
  { id: 4, member: 'Ana Costa', amount: 150.00, frequency: 'Mensal', startDate: '2023-04-05', status: 'Ativa', nextPayment: '2024-02-05' },
  { id: 5, member: 'Carlos Mendes', amount: 300.00, frequency: 'Mensal', startDate: '2023-05-12', status: 'Ativa', nextPayment: '2024-02-12' },
]

export default function ContributionsPage() {
  const [contributions, setContributions] = useState(initialContributions)
  const [search, setSearch] = useState('')
  const [frequencyFilter, setFrequencyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingContrib, setEditingContrib] = useState(null)
  const itemsPerPage = 5

  const filteredContributions = useMemo(() => {
    return contributions.filter(contrib => {
      const matchSearch = contrib.member.toLowerCase().includes(search.toLowerCase())
      const matchFrequency = !frequencyFilter || contrib.frequency === frequencyFilter
      const matchStatus = !statusFilter || contrib.status === statusFilter
      return matchSearch && matchFrequency && matchStatus
    })
  }, [contributions, search, frequencyFilter, statusFilter])

  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage)
  const paginatedContributions = filteredContributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalContributions = useMemo(() => {
    return contributions.reduce((sum, c) => c.status === 'Ativa' ? sum + c.amount : sum, 0)
  }, [contributions])

  const handleSaveContribution = (data) => {
    if (editingContrib) {
      setContributions(contributions.map(c => c.id === editingContrib.id ? { ...c, ...data } : c))
    } else {
      setContributions([...contributions, { ...data, id: Math.max(...contributions.map(c => c.id)) + 1, startDate: new Date().toISOString().split('T')[0] }])
    }
    setOpenDialog(false)
  }

  const handleDeleteContribution = (id) => {
    setContributions(contributions.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Contribuições</h1>
          <p className="text-muted-foreground mt-2">Gerencie as contribuições dos membros</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
          setEditingContrib(null)
          setOpenDialog(true)
        }}>
          <Plus size={18} className="mr-2" /> Nova Contribuição
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total de Membros</p>
            <p className="text-2xl font-bold">{contributions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Contribuições Ativas</p>
            <p className="text-2xl font-bold">{contributions.filter(c => c.status === 'Ativa').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Mensal Esperado</p>
            <p className="text-2xl font-bold">${totalContributions.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contribuições</CardTitle>
          <CardDescription>Total de {filteredContributions.length} contribuição(ões)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                placeholder="Buscar por membro..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <select
              value={frequencyFilter}
              onChange={(e) => {
                setFrequencyFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="">Todas as Frequências</option>
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
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
                setFrequencyFilter('')
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
                  <TableHead>Membro</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Próximo Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContributions.length > 0 ? (
                  paginatedContributions.map((contrib) => (
                    <TableRow key={contrib.id}>
                      <TableCell className="font-medium">{contrib.member}</TableCell>
                      <TableCell>${contrib.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{contrib.frequency}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contrib.startDate}</TableCell>
                      <TableCell className="text-sm">{contrib.nextPayment}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          contrib.status === 'Ativa'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {contrib.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingContrib(contrib)
                            setOpenDialog(true)
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteContribution(contrib.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma contribuição encontrada
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

      <ContributionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        contribution={editingContrib}
        onSave={handleSaveContribution}
      />
    </div>
  )
}

function ContributionDialog({ open, onOpenChange, contribution, onSave }) {
  const [formData, setFormData] = useState(contribution || { member: '', amount: 0, frequency: 'Mensal', status: 'Ativa' })

  const handleSave = () => {
    onSave(formData)
    setFormData({ member: '', amount: 0, frequency: 'Mensal', status: 'Ativa' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contribution ? 'Editar Contribuição' : 'Nova Contribuição'}</DialogTitle>
          <DialogDescription>
            {contribution ? 'Atualize os dados da contribuição' : 'Configure uma nova contribuição'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Membro</label>
            <Input
              value={formData.member}
              onChange={(e) => setFormData({ ...formData, member: e.target.value })}
              placeholder="Nome do membro"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Valor (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Frequência</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
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
              {contribution ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
