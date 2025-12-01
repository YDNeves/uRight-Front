export interface User {
  id: string
  email: string
  name: string
  role: "superadmin" | "admin" | "treasurer" | "member"
  associationId: string | null
  permissions: Permission[]
  hasCompletedOnboarding: boolean
  //hasApprovedAccess:boolean
  createdAt: string
}

export type Permission =
  | "view_dashboard"
  | "manage_associations"
  | "manage_members"
  | "manage_payments"
  | "manage_events"
  | "view_reports"
  | "manage_settings"
  | "manage_users"

export const ROLE_PERMISSIONS: Record<User["role"], Permission[]> = {
  superadmin: [
    "view_dashboard",
    "manage_associations",
    "manage_members",
    "manage_payments",
    "manage_events",
    "view_reports",
    "manage_settings",
    "manage_users",
  ],
  admin: [
    "view_dashboard",
    "manage_associations",
    "manage_members",
    "manage_payments",
    "manage_events",
    "view_reports",
    "manage_settings",
  ],
  treasurer: ["view_dashboard", "manage_payments", "manage_members", "view_reports"],
  member: ["view_dashboard"],
}

export interface Association {
  id: string
  name: string
  description: string
  type: "cooperativa" | "associacao" | "uniao"
  foundedDate: string
  memberCount: number
  status: "ativa" | "inativa"
  adminId: string
}

export interface Member {
  id: string
  associationId: string
  name: string
  email: string
  phone: string
  joinDate: string
  status: "ativo" | "inativo" | "suspenso"
  membershipType: "regular" | "honorario" | "associado"
}

export interface Contribution {
  id: string
  memberId: string
  amount: number
  type: "mensalidade" | "doacao" | "evento" | "outra"
  status: "pendente" | "concluida" | "falhou" | "reembolsada"
  date: string
  description: string
}

export interface Event {
  id: string
  associationId: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  attendees: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
}

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  pendingPayments: number
  upcomingEvents: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: "member_joined" | "payment_received" | "event_created" | "member_updated"
  description: string
  timestamp: string
}

export interface OnboardingStep {
  id: "create_association" | "invite_members" | "setup_payments"
  label: string
  description: string
  completed: boolean
}

export interface OnboardingState {
  currentStep: number
  steps: OnboardingStep[]
  completed: boolean
}

export type AlertType = "system" | "manual" | "automatic"
export type AlertSeverity = "info" | "warning" | "error" | "success"

export interface Communication {
  id: string
  associationId: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  content?: string
  senderId: string
  recipients: string[]
  createdAt: string
  readAt?: string
  archived: boolean
}

export interface FinanceSummary {
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

export interface FinanceTransaction {
  id: string
  associationId: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  paymentMethod: string
  reference?: string
  createdById: string
  createdAt: string
}

export interface HistoryEntry {
  id: string
  entityId: string
  entityType: "member" | "payment" | "event" | "communication"
  action: "created" | "updated" | "deleted" | "status_changed"
  description: string
  changedBy: string
  timestamp: string
  details?: Record<string, any>
}

export interface EventRSVP {
  id: string
  eventId: string
  memberId: string
  status: "confirmed" | "declined" | "pending"
  responseDate: string
}

export interface EventAttendance {
  id: string
  eventId: string
  memberId: string
  status: "present" | "absent" | "pending"
  markedAt: string
}
