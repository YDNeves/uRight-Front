"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

interface UserData {
  id: string
  email: string
  name: string
  role: "superadmin" | "admin" | "treasurer" | "member"
  createdAt: string
  status: "active" | "inactive"
}

export default function UsersPage() {
  const { hasPermission, user: currentUser } = useAuth()

  // Placeholder until backend users API is ready
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  const canManage = hasPermission("manage_users")

  useEffect(() => {
    // const { data } = await usersApi.getAll()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Você não tem permissão para gerenciar utilizadores.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "destructive"
      case "admin":
        return "default"
      case "treasurer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      superadmin: "Super Admin",
      admin: "Administrador",
      treasurer: "Tesoureiro",
      member: "Membro",
    }
    return roleLabels[role] || role
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Utilizadores</h1>
          <p className="text-muted-foreground">Gerencie utilizadores e atribua roles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Novo Utilizador
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum utilizador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhum utilizador encontrado. Comece a adicionar utilizadores.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Utilizadores</CardTitle>
            <CardDescription>Lista de todos os utilizadores do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-PT")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
