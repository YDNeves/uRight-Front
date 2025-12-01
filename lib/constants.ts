// Configurações globais da aplicação
export const CURRENCY = {
  symbol: "KZ",
  code: "AOA",
  name: "Kwanzas",
} as const

export const NAVIGATION_LINKS = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Razões", href: "#why" },
  { label: "Planos", href: "#pricing" },
  { label: "Testemunhos", href: "#testimonials" },
] as const

export const DASHBOARD_MENU = [
  { label: "Painel", icon: "📊", href: "/dashboard" },
  { label: "Membros", icon: "👥", href: "/dashboard/members" },
  { label: "Eventos", icon: "📅", href: "/dashboard/events" },
  { label: "Finanças", icon: "💰", href: "/dashboard/finances" },
  { label: "Relatórios", icon: "📈", href: "/dashboard/reports" },
  { label: "Definições", icon: "⚙️", href: "/dashboard/settings" },
] as const
