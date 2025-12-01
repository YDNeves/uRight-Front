"use client"

import { useState } from "react"
import { Download, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import useSWR from "swr"
import { financeApi } from "@/lib/api"
import { toast } from "sonner"

interface FinanceSummaryData {
  totalRevenue: number
  totalExpenses: number
  balance: number
  monthlyRevenue: number
  quarterlyRevenue: number
  annualRevenue: number
  pendingPayments: number
  overduePayments: number
  overdueMembers: Array<{
    memberId: string
    memberName: string
    amount: number
    daysOverdue: number
  }>
}

export default function FinancePage() {
  const { hasPermission, associationId } = useAuth()
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "annual">("monthly")

  const {
    data: financeSummary,
    isLoading,
    error,
  } = useSWR<FinanceSummaryData>("/finance/summary", async () => {
    const response = await financeApi.getSummary()
    return response.data || ({} as FinanceSummaryData)
  })

  const canView = hasPermission("view_reports")

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Você não tem permissão para visualizar relatórios financeiros.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleExport = async (format: "CSV" | "JSON") => {
    try {
      const response = await financeApi.exportData(format)
      if (response.data) {
        const blob = response.data as Blob
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `financeiro.${format.toLowerCase()}`
        a.click()
        toast.success(`Ficheiro exportado com sucesso`)
      }
    } catch (error) {
      toast.error("Erro ao exportar ficheiro")
    }
  }

  const getPeriodRevenue = () => {
    switch (period) {
      case "monthly":
        return financeSummary?.monthlyRevenue || 0
      case "quarterly":
        return financeSummary?.quarterlyRevenue || 0
      case "annual":
        return financeSummary?.annualRevenue || 0
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Financeiro</h1>
          <p className="text-muted-foreground">Visão geral financeira e análise de dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("CSV")}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button onClick={() => handleExport("JSON")}>
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita {period === "monthly" ? "Mensal" : period === "quarterly" ? "Trimestral" : "Anual"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{getPeriodRevenue()?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Receita total do período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financeSummary?.totalExpenses?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Despesas totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financeSummary?.balance?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Saldo disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financeSummary?.overduePayments?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {financeSummary?.overdueMembers?.length || 0} membros atrasados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="quarterly">Trimestral</TabsTrigger>
          <TabsTrigger value="annual">Anual</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-4">
          {financeSummary?.overdueMembers && financeSummary.overdueMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Membros com Pagamentos Atrasados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financeSummary.overdueMembers.map((member) => (
                    <div key={member.memberId} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{member.memberName}</p>
                        <p className="text-sm text-muted-foreground">{member.daysOverdue} dias atrasado</p>
                      </div>
                      <Badge variant="destructive">€{member.amount.toFixed(2)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>Dados detalhados do período selecionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Receita Pendente</p>
                  <p className="text-2xl font-bold">€{financeSummary?.pendingPayments?.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Pagamentos Atrasados</p>
                  <p className="text-2xl font-bold">€{financeSummary?.overduePayments?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
