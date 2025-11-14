'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Archive, Trash2, Check } from 'lucide-react'

const initialNotifications = [
  { id: 1, title: 'Novo Membro Registrado', message: 'João Silva se inscreveu na associação', time: '2 minutos atrás', type: 'info', read: false },
  { id: 2, title: 'Pagamento Recebido', message: 'Contribuição de Maria Santos foi confirmada', time: '1 hora atrás', type: 'success', read: false },
  { id: 3, title: 'Evento Próximo', message: 'Assembléia Geral será em 3 dias', time: '5 horas atrás', type: 'warning', read: false },
  { id: 4, title: 'Relatório Gerado', message: 'Relatório mensal foi gerado com sucesso', time: '1 dia atrás', type: 'success', read: true },
  { id: 5, title: 'Pagamento Pendente', message: 'Contribuição de Pedro Oliveira está pendente', time: '2 dias atrás', type: 'error', read: true },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'error':
        return 'bg-red-100 text-red-700'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground mt-2">
            Você tem {unreadCount} notificação{unreadCount !== 1 ? 's' : ''} não lida{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check size={18} className="mr-2" /> Marcar Todas como Lidas
          </Button>
          <Button variant="outline" className="text-destructive" onClick={handleDeleteAll} disabled={notifications.length === 0}>
            <Trash2 size={18} className="mr-2" /> Limpar Tudo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Não Lidas ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
        >
          Lidas ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={!notification.read ? 'border-primary bg-primary/5' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
                      <Bell size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Bell size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
