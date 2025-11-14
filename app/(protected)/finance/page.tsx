'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Download, TrendingUp, TrendingDown } from 'lucide-react'

const initialTransactions = [
  { id: 1, date: '2024-01-15', description: 'Contribuição - João Silva', type: 'entrada', amount: 150.00, category: 'Contribuição', status: 'Confirmada' },
  { id: 2, date: '2024-01-16', description: 'Aluguel Sala Reunião', type: 'saída', amount: 500.00, category: 'Despesa Operacional', status: 'Confirmada' },
  { id: 3, date: '2024-01-17', description: 'Contribuição - Maria Santos', type: 'entrada', amount: 150.00, category: 'Contribuição', status: 'Confirmada' },
  { id: 4, date: '2024-01-18', description: 'Material de Escritório', type: 'saída', amount: 250.00, category: 'Suprimentos', status: 'Pendente' },
  { id: 5, date: '2024-01-19', description: 'Evento Cultural', type: 'saída', amount: 1200.00, category: 'Evento', status: 'Confirmada' },
  { id: 6, date: '2024-01-20', description: 'Doação Anonimato', type: 'entrada', amount: 500.00, category: 'Doação', status: 'Confirmada' },
]

const chartData = [
  { month: 'Jan', entrada: 2400, saída: 1800 },
  { month: 'Fev', entrada: 2800, saída: 2100 },
  { month: 'Mar', entrada: 3200, saída: 2400 },
  { month: 'Abr', entrada: 2900, saída: 2300 },
  { month: 'Mai', entrada: 3500, saída: 2800 },
  { month: 'Jun', entrada: 4200, saída: 3100 },
]

export default function FinancePage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const itemsPerPage = 5

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase())
      const matchType = !typeFilter || tx.type === typeFilter
      const matchStatus = !statusFilter || tx.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [transactions, search, typeFilter, statusFilter])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totals = useMemo(() => {
    const entradas = transactions.reduce((sum, tx) => tx.type === 'entrada' ? sum + tx.amount : sum, 0)
    const saidas = transactions.reduce((sum, tx) => tx.type === 'saída' ? sum + tx.amount : sum, 0)
    return { entradas, saidas, saldo: entradas - saidas }
  }, [transactions])

  const handleSaveTransaction = (data) => {
    if (editingTx) {
      setTransactions(transactions.map(t => t.id === editingTx.id ? { ...t, ...data } : t))
    } else {
      setTransactions([...transactions, { ...data, id: Math.max(...transactions.map(t => t.id)) + 1, date: new Date().toISOString().split('T')[0] }])
    }
    setOpenDialog(false)
  }

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Tipo', 'Valor', 'Categoria', 'Status']
    const rows = transactions.map(t => [t.date, t.description, t.type, t.amount, t.category, t.status])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financas_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-muted-foreground mt-2">Gerencie receitas, despesas e transações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download size={18} className="mr-2" /> Exportar CSV
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => {
            setEditingTx(null)
            setOpenDialog(true)
          }}>
            <Plus size={18} className="mr-2" /> Nova Transação
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total de Entradas</p>
                <p className="text-2xl font-bold text-green-600">${totals.entradas.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-2">
                  <TrendingUp className="inline mr-1" size={14} /> +12% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total de Saídas</p>
                <p className="text-2xl font-bold text-red-600">${totals.saidas.toFixed(2)}</p>
                <p className="text-xs text-red-600 mt-2">
                  <TrendingDown className="inline mr-1" size={14} /> +8% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Saldo Disponível</p>
                <p className="text-2xl font-bold text-primary">${totals.saldo.toFixed(2)}</p>
                <p className="text-xs text-primary mt-2">Saldo positivo</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp size={24} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo Mensal</CardTitle>
            <CardDescription>Entradas vs Saídas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entrada" fill="var(--color-primary)" />
                <Bar dataKey="saída" fill="var(--color-destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de Saldo</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entrada" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="saída" stroke="var(--color-destructive)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Total de {filteredTransactions.length} transação(ões)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                placeholder="Buscar descrição..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="">Todos os Tipos</option>
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
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
              <option value="Confirmada">Confirmada</option>
              <option value="Pendente">Pendente</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setTypeFilter('')
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
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tx.type === 'entrada'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type === 'entrada' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{tx.category}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tx.status === 'Confirmada'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTx(tx)
                            setOpenDialog(true)
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteTransaction(tx.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação encontrada
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

      <TransactionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        transaction={editingTx}
        onSave={handleSaveTransaction}
      />
    </div>
  )
}

function TransactionDialog({ open, onOpenChange, transaction, onSave }) {
  const [formData, setFormData] = useState(transaction || { description: '', type: 'entrada', amount: 0, category: 'Contribuição', status: 'Confirmada' })

  const handleSave = () => {
    onSave(formData)
    setFormData({ description: '', type: 'entrada', amount: 0, category: 'Contribuição', status: 'Confirmada' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Atualize os dados da transação' : 'Registre uma nova transação financeira'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da transação"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="entrada">Entrada</option>
                <option value="saída">Saída</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Valor</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Contribuição">Contribuição</option>
              <option value="Doação">Doação</option>
              <option value="Despesa Operacional">Despesa Operacional</option>
              <option value="Suprimentos">Suprimentos</option>
              <option value="Evento">Evento</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="Confirmada">Confirmada</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              {transaction ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
