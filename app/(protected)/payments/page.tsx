"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, DollarSign, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { paymentsApi } from "@/lib/api"
import type { Payment } from "@/lib/types"
import { PaymentDialog } from "@/components/payments/payment-dialog"
import { DeletePaymentDialog } from "@/components/payments/delete-payment-dialog"
import { format } from "date-fns"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchQuery, statusFilter, typeFilter])

  async function fetchPayments() {
    setLoading(true)
    const response = await paymentsApi.getAll()
    if (response.data) {
      setPayments(response.data)
    }
    setLoading(false)
  }

  function filterPayments() {
    let filtered = [...payments]

    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.amount.toString().includes(searchQuery),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((payment) => payment.type === typeFilter)
    }

    setFilteredPayments(filtered)
  }

  function handleCreate() {
    setSelectedPayment(null)
    setDialogOpen(true)
  }

  function handleEdit(payment: Payment) {
    setSelectedPayment(payment)
    setDialogOpen(true)
  }

  function handleDelete(payment: Payment) {
    setSelectedPayment(payment)
    setDeleteDialogOpen(true)
  }

  function handleDialogClose() {
    setDialogOpen(false)
    setSelectedPayment(null)
    fetchPayments()
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false)
    setSelectedPayment(null)
    fetchPayments()
  }

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = filteredPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0)

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
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${completedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <CardTitle>All Payments</CardTitle>
              <CardDescription>
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <DollarSign />
                </EmptyMedia>
                <EmptyTitle>No payments found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters to find what you're looking for."
                    : "Get started by recording your first payment."}
                </EmptyDescription>
              </EmptyHeader>
              {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
                <EmptyContent>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4" />
                    Record Payment
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>{format(new Date(payment.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : payment.status === "failed"
                              ? "destructive"
                              : payment.status === "refunded"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {payment.status}
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
                          <DropdownMenuItem onClick={() => handleEdit(payment)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(payment)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
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

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payment={selectedPayment}
        onSuccess={handleDialogClose}
      />

      <DeletePaymentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        payment={selectedPayment}
        onSuccess={handleDeleteDialogClose}
      />
    </div>
  )
}
