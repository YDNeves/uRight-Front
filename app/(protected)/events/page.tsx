'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, Users, MapPin, Clock } from 'lucide-react'

const initialEvents = [
  { id: 1, name: 'Assembléia Geral', date: '2024-02-15', time: '19:00', location: 'Sala Principal', category: 'Administrativa', attendees: 45, capacity: 100, status: 'Agendado' },
  { id: 2, name: 'Workshop de Tecnologia', date: '2024-02-20', time: '14:00', location: 'Auditório', category: 'Educação', attendees: 32, capacity: 50, status: 'Agendado' },
  { id: 3, name: 'Evento Esportivo', date: '2024-02-25', time: '09:00', location: 'Quadra', category: 'Esporte', attendees: 78, capacity: 80, status: 'Agendado' },
  { id: 4, name: 'Café da Manhã de Boas-vindas', date: '2024-01-30', time: '08:00', location: 'Cafeteria', category: 'Social', attendees: 62, capacity: 100, status: 'Realizado' },
  { id: 5, name: 'Reunião de Diretoria', date: '2024-02-10', time: '15:00', location: 'Sala Executiva', category: 'Administrativa', attendees: 12, capacity: 20, status: 'Agendado' },
]

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const itemsPerPage = 5

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
                         event.location.toLowerCase().includes(search.toLowerCase())
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
    const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0)
    return { upcoming, totalAttendees }
  }, [events])

  const handleSaveEvent = (data) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...data } : e))
    } else {
      setEvents([...events, { ...data, id: Math.max(...events.map(e => e.id)) + 1 }])
    }
    setOpenDialog(false)
  }

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
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

      {/* Statistics */}
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
                <p className="text-2xl font-bold">72%</p>
              </div>
              <MapPin size={24} className="text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
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
                        {event.date} {event.time}
                      </TableCell>
                      <TableCell className="text-sm">{event.location}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {event.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {event.attendees}/{event.capacity}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          event.status === 'Agendado'
                            ? 'bg-blue-100 text-blue-700'
                            : event.status === 'Realizado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
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

function EventDialog({ open, onOpenChange, event, onSave }) {
  const [formData, setFormData] = useState(event || { name: '', date: '', time: '10:00', location: '', category: 'Social', capacity: 50, status: 'Agendado', attendees: 0 })

  const handleSave = () => {
    onSave(formData)
    setFormData({ name: '', date: '', time: '10:00', location: '', category: 'Social', capacity: 50, status: 'Agendado', attendees: 0 })
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
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              {event ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
