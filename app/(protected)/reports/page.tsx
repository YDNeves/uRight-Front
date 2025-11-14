'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download, Filter } from 'lucide-react'

const membershipData = [
  { month: 'Jan', ativo: 200, inativo: 30 },
  { month: 'Fev', ativo: 220, inativo: 25 },
  { month: 'Mar', ativo: 245, inativo: 20 },
  { month: 'Abr', ativo: 260, inativo: 18 },
  { month: 'Mai', ativo: 280, inativo: 15 },
  { month: 'Jun', ativo: 300, inativo: 12 },
]

const categoryData = [
  { name: 'Contribuições', value: 35 },
  { name: 'Eventos', value: 25 },
  { name: 'Despesas', value: 20 },
  { name: 'Doações', value: 20 },
]

const COLORS = ['#0EA5E9', '#06B6D4', '#0891B2', '#5EEAD4']

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('6months')

  const handleExportPDF = () => {
    alert('Exportando relatório em PDF...')
  }

  const handleExportExcel = () => {
    alert('Exportando relatório em Excel...')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground mt-2">Análises e insights sobre a associação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download size={18} className="mr-2" /> PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleExportExcel}>
            <Download size={18} className="mr-2" /> Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="30days">Últimos 30 dias</option>
              <option value="3months">Últimos 3 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="1year">Último ano</option>
              <option value="all">Período completo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Membros</CardTitle>
            <CardDescription>Crescimento da associação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ativo" stroke="var(--color-primary)" strokeWidth={2} name="Ativos" />
                <Line type="monotone" dataKey="inativo" stroke="var(--color-destructive)" strokeWidth={2} name="Inativos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Receitas</CardTitle>
            <CardDescription>Por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Taxa de Retenção</p>
            <p className="text-2xl font-bold">94%</p>
            <p className="text-xs text-green-600 mt-2">+2% vs período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Receita Total</p>
            <p className="text-2xl font-bold">$12,450</p>
            <p className="text-xs text-green-600 mt-2">+18% vs período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Eventos Realizados</p>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-blue-600 mt-2">Taxa de ocupação: 85%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado</CardTitle>
          <CardDescription>Resumo executivo do período selecionado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm">Total de Membros Ativos</span>
              <span className="font-bold">300</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm">Novos Membros</span>
              <span className="font-bold">20</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm">Membros Inativos</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm">Contribuição Total Esperada</span>
              <span className="font-bold">$2,850</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm">Contribuição Recebida</span>
              <span className="font-bold text-green-600">$2,680</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm">Taxa de Arrecadação</span>
              <span className="font-bold">94%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
