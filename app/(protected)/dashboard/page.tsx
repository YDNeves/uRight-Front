'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { useEffect } from 'react'
import { dashboardApi } from '@/lib/api'

const COLORS = ['#0EA5E9', '#06B6D4', '#0891B2']

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    stats: [
      { label: 'Total de Membros', value: '2,345', change: '+12%', icon: Users, color: 'primary' },
      { label: 'Contribuições', value: '$45,230', change: '+8%', icon: DollarSign, color: 'secondary' },
      { label: 'Eventos Próximos', value: '8', change: '+4', icon: Calendar, color: 'accent' },
      { label: 'Crescimento', value: '23%', change: '+5%', icon: TrendingUp, color: 'primary' },
    ],
    chartData: [
      { month: 'Jan', usuarios: 400, contribuicoes: 2400 },
      { month: 'Fev', usuarios: 480, contribuicoes: 2210 },
      { month: 'Mar', usuarios: 520, contribuicoes: 2290 },
      { month: 'Abr', usuarios: 590, contribuicoes: 2000 },
      { month: 'Mai', usuarios: 620, contribuicoes: 2181 },
      { month: 'Jun', usuarios: 750, contribuicoes: 2500 },
    ],
    pieData: [
      { name: 'Ativos', value: 65 },
      { name: 'Inativos', value: 20 },
      { name: 'Novos', value: 15 },
    ],
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardApi.getStats()
        console.log('[v0] Dashboard stats loaded:', response.data)
        setDashboardData(response.data)
      } catch (error) {
        console.error('[v0] Error loading dashboard stats:', error)
      }
    }
    
    loadStats()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Bem-vindo ao URight - Gestão de Associações</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Gerar Relatório</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2">{stat.change} vs mês anterior</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Usuários e Contribuições</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usuarios" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="contribuicoes" stroke="var(--color-secondary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Membros</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {dashboardData.pieData.map((item, idx) => (
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10" />
                  <div>
                    <p className="text-sm font-medium">Novo membro adicionado</p>
                    <p className="text-xs text-muted-foreground">Há {item * 2} minutos</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Ver</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
