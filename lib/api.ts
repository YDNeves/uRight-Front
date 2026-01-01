const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

import { parseCookies } from "nookies"

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const cookies = parseCookies()
    const token = cookies.auth_token

    const headers = new Headers(options.headers)

    // 🔐 Authorization
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    // 🧠 Detecta FormData
    const isFormData = options.body instanceof FormData

    // 📦 Só define Content-Type se NÃO for FormData
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // seguro se usares cookie também
    })

    const contentType = response.headers.get("content-type")

    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text()

    if (!response.ok) {
      return {
        error: data?.message || "Erro ao processar a requisição",
      }
    }

    return { data }
  } catch (error) {
    return { error: "Erro de conexão. Tente novamente." }
  }
}



export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, entityType: string) =>
    fetchApi<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, entityType }),
    }),

  verifyEmail: (token: string) =>
    fetchApi("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  requestPasswordReset: (email: string) =>
    fetchApi("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    fetchApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),

  logout: () => fetchApi("/auth/logout", { method: "POST" }),

  getCurrentUser: () => fetchApi<any>("/auth/me"),
}

export const dashboardApi = {
  getStats: () => fetchApi<any>("/relatorios/geral"),
}

export const associationsApi = {
  getAll: () => fetchApi<any[]>("/associations"),
  getById: (id: string) => fetchApi<any>(`/associations/${id}`),
  getRandom: (limit: number) => fetchApi<any[]>(`/associations/random?limit=${limit}`),
  create: (data: FormData | object) =>
    fetchApi<{ id: string; name: string }>("/associations", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    update: (
      id: string,
      data: Partial<{ name: string; province: string; imageUrl: string }>
    ) =>
      fetchApi<any>(`/associations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  delete: (id: string) => fetchApi(`/associations/${id}`, { method: "DELETE" }),

  // Upload de imagem
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return fetchApi<{ imageUrl: string }>("/associations/upload-image", {
      method: "POST",
      body: formData,
    })
  },

  // Atualiza URL da imagem da associação
  updateImageUrl: (id: string, imageUrl: string) =>
    fetchApi(`/associations/${id}/image`, {
      method: "PATCH",
      body: JSON.stringify({ imageUrl }),
    }),
}
export const membersApi = {
  getAll: () => fetchApi<any[]>("/membros"),
  getById: (id: string) => fetchApi<any>(`/membros/${id}`),
  create: (data: any) =>
    fetchApi<any>("/membros", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/membros/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/membros/${id}`, { method: "DELETE" }),
}

export const contributionsApi = {
  getAll: () => fetchApi<any[]>("/contribuicoes"),
  getById: (id: string) => fetchApi<any>(`/contribuicoes/${id}`),
  create: (data: any) =>
    fetchApi<any>("/contribuicoes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/contribuicoes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/contribuicoes/${id}`, { method: "DELETE" }),
  getByAssociation: (associationId: string) => fetchApi<any[]>(`/contribuicoes/associacao/${associationId}`),
}

export const paymentsApi = contributionsApi

export const eventsApi = {
  getAll: () => fetchApi<any[]>("/eventos"),
  getById: (id: string) => fetchApi<any>(`/eventos/${id}`),
  create: (data: any) =>
    fetchApi<any>("/eventos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/eventos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/eventos/${id}`, { method: "DELETE" }),
}

export const usersApi = {
  getAll: () => fetchApi<any[]>("/users"),
  getById: (id: string) => fetchApi<any>(`/users/${id}`),
  create: (data: any) =>
    fetchApi<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/users/${id}`, { method: "DELETE" }),
}

export const reportsApi = {
  getGeneral: () => fetchApi<any>("/relatorios/geral"),
  getFinancial: () => fetchApi<any>("/relatorios/financeiro"),
  getByAssociation: (associationId: string) => fetchApi<any>(`/relatorios/associacao/${associationId}`),
}

export const financeApi = {
  getSummary: () => fetchApi<any>("/finance/summary"),
  getByAssociation: (associationId: string) => fetchApi<any>(`/finance/association/${associationId}`),
  exportData: (format: "CSV" | "JSON") =>
    fetchApi<any>("/finance/export", {
      method: "POST",
      body: JSON.stringify({ format }),
    }),
}

export const communicationsApi = {
  getAll: () => fetchApi<any[]>("/comunicacoes"),
  getById: (id: string) => fetchApi<any>(`/comunicacoes/${id}`),
  create: (data: any) =>
    fetchApi<any>("/comunicacoes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/comunicacoes/${id}`, { method: "DELETE" }),
}

export const notificationsApi = {
  getAll: () => fetchApi<any[]>("/notificacoes"),
  getById: (id: string) => fetchApi<any>(`/notificacoes/${id}`),
  markAsRead: (id: string) => fetchApi<any>(`/notificacoes/${id}/read`, { method: "PUT" }),
  delete: (id: string) => fetchApi(`/notificacoes/${id}`, { method: "DELETE" }),
}
