'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, Users, MapPin, Clock, AlertCircle, Loader } from 'lucide-react'
import { eventsApi } from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    loadEvents()
  }, [currentPage, search])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventsApi.getAll(currentPage, itemsPerPage)
      console.log('[v0] Events loaded:', response.data)
      setEvents(response.data.data || response.data || [])
    } catch (err: any) {
      console.error('[v0] Error loading events:', err)
      setError(err.message || 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchSearch = event.name?.toLowerCase().includes(search.toLowerCase()) ||
                         event.location?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !categoryFilter || event.category === categoryFilter
      const matchStatus = !statusFilter || event.status === statusFilter
      return matchSearch && matchCategory && matchStatus
    })
  }, [events, search, categoryFilter, statusFilter])

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => {
    const upcoming = events.filter(e => e.status === 'Agendado').length
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0)
    return { upcoming, totalAttendees }
  }, [events])

  const handleSaveEvent = async (data: any) => {
    try {
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, data)
        console.log('[v0] Event updated')
      } else {
        await eventsApi.create(data)
        console.log('[v0] Event created')
      }
      setOpenDialog(false)
      loadEvents()
    } catch (error) {
      console.error('[v0] Error saving event:', error)
      setError('Erro ao salvar evento')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este evento?')) return
    try {
      await eventsApi.delete(id)
      console.log('[v0] Event deleted')
      loadEvents()
    } catch (error) {
      console.error('[v0] Error deleting event:', error)
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
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground mt-2">Gerencie eventos e atividades da associação</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
          setEditingEvent(null)
          setOpenDialog(true)
        }}>
          <Plus size={18} className="mr-2" /> Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total de Eventos</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar size={24} className="text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Próximos Eventos</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
              <Clock size={24} className="text-secondary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total de Participantes</p>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
              </div>
              <Users size={24} className="text-accent/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Taxa de Ocupação</p>
                <p className="text-2xl font-bold">
                  {events.length > 0 
                    ? Math.round((stats.totalAttendees / (events.reduce((sum, e) => sum + (e.capacity || 1), 0))) * 100) 
                    : 0}%
                </p>
              </div>
              <MapPin size={24} className="text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>Total de {filteredEvents.length} evento(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou local..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="">Todas as Categorias</option>
              <option value="Administrativa">Administrativa</option>
              <option value="Educação">Educação</option>
              <option value="Esporte">Esporte</option>
              <option value="Social">Social</option>
              <option value="Cultural">Cultural</option>
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
              <option value="Agendado">Agendado</option>
              <option value="Realizado">Realizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setCategoryFilter('')
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
                <span>Carregando eventos...</span>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Nome do Evento</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell className="text-sm">
                          {event.date} {event.time || ''}
                        </TableCell>
                        <TableCell className="text-sm">{event.location || '-'}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {event.category || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {event.attendees || 0}/{event.capacity || 0}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            event.status === 'Agendado'
                              ? 'bg-blue-100 text-blue-700'
                              : event.status === 'Realizado'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {event.status || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingEvent(event)
                              setOpenDialog(true)
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum evento encontrado
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

      <EventDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  )
}

function EventDialog({ open, onOpenChange, event, onSave }: any) {
  const [formData, setFormData] = useState(event || { name: '', date: '', time: '10:00', location: '', category: 'Social', capacity: 50, status: 'Agendado', attendees: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(event || { name: '', date: '', time: '10:00', location: '', category: 'Social', capacity: 50, status: 'Agendado', attendees: 0 })
  }, [event, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(formData)
      setFormData({ name: '', date: '', time: '10:00', location: '', category: 'Social', capacity: 50, status: 'Agendado', attendees: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
          <DialogDescription>
            {event ? 'Atualize os dados do evento' : 'Crie um novo evento para a associação'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome do Evento</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Assembleia Geral"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hora</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Local</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Sala Principal"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="Administrativa">Administrativa</option>
                <option value="Educação">Educação</option>
                <option value="Esporte">Esporte</option>
                <option value="Social">Social</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Capacidade</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Participantes</label>
              <Input
                type="number"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) })}
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
                <option value="Agendado">Agendado</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : event ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
