import { parseCookies,destroyCookie } from "nookies"
import axios, { AxiosInstance, AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add interceptor to include token in all requests
axiosInstance.interceptors.request.use((config) => {
  const cookies = parseCookies()
  const token = cookies.auth_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    // If token is invalid or expired
    if (status === 401) {

      // Remove token immediately
      if (typeof window !== "undefined") {
        destroyCookie(null, "auth_token")
      }

      // Only redirect on client
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname

        // Prevent redirect loop to /login
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    axiosInstance.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    axiosInstance.post("/auth/register", { name, email, password }),
  logout: () => axiosInstance.post("/auth/logout"),
  getCurrentUser: () => axiosInstance.get("/auth/me"),
}

// Users endpoints
export const usersApi = {
  getAll: (page?: number, limit?: number, search?: string) =>
    axiosInstance.get("/users", { params: { page, limit, search } }),
  getById: (id: string) => axiosInstance.get(`/users/${id}`),
  create: (data: any) => axiosInstance.post("/users", data),
  update: (id: string, data: any) => axiosInstance.put(`/users/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/users/${id}`),
}

// Associations endpoints
export const associationsApi = {
  getAll: (page?: number, limit?: number, search?: string) =>
    axiosInstance.get("/associations", { params: { page, limit, search } }),
  getById: (id: string) => axiosInstance.get(`/associations/${id}`),
  create: (data: any) => axiosInstance.post("/associations", data),
  update: (id: string, data: any) => axiosInstance.put(`/associations/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/associations/${id}`),
}

// Members endpoints
export const membersApi = {
  getAll: (page?: number, limit?: number, search?: string) =>
    axiosInstance.get("/members", { params: { page, limit, search } }),
  getById: (id: string) => axiosInstance.get(`/members/${id}`),
  create: (data: any) => axiosInstance.post("/members", data),
  update: (id: string, data: any) => axiosInstance.put(`/members/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/members/${id}`),
  getByAssociation: (associationId: string, page?: number, limit?: number) =>
    axiosInstance.get(`/members/association/${associationId}`, { params: { page, limit } }),
}

// Contributions endpoints
export const contributionsApi = {
  getAll: (page?: number, limit?: number, status?: string) =>
    axiosInstance.get("/contributions", { params: { page, limit, status } }),
  getById: (id: string) => axiosInstance.get(`/contributions/${id}`),
  create: (data: any) => axiosInstance.post("/contributions", data),
  update: (id: string, data: any) => axiosInstance.put(`/contributions/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/contributions/${id}`),
  getByAssociation: (associationId: string, page?: number, limit?: number) =>
    axiosInstance.get(`/contributions/association/${associationId}`, { params: { page, limit } }),
  getByMember: (memberId: string) => axiosInstance.get(`/contributions/member/${memberId}`),
}

// Events endpoints
export const eventsApi = {
  getAll: (page?: number, limit?: number, status?: string) =>
    axiosInstance.get("/events", { params: { page, limit, status } }),
  getById: (id: string) => axiosInstance.get(`/events/${id}`),
  create: (data: any) => axiosInstance.post("/events", data),
  update: (id: string, data: any) => axiosInstance.put(`/events/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/events/${id}`),
  getByAssociation: (associationId: string) => axiosInstance.get(`/events/association/${associationId}`),
}

// Reports endpoints
export const reportsApi = {
  getGeneral: () => axiosInstance.get("/reports/general"),
  getFinancial: () => axiosInstance.get("/reports/financial"),
  getByAssociation: (associationId: string) => axiosInstance.get(`/reports/association/${associationId}`),
  exportFinance: (format: "csv" | "pdf" | "excel") =>
    axiosInstance.get(`/reports/finance/export`, { params: { format }, responseType: "blob" }),
}

// Finance endpoints
export const financeApi = {
  getSummary: () => axiosInstance.get("/finance/summary"),
  getTransactions: (page?: number, limit?: number, type?: string) =>
    axiosInstance.get("/finance/transactions", { params: { page, limit, type } }),
  getByAssociation: (associationId: string) =>
    axiosInstance.get(`/finance/association/${associationId}`),
  createTransaction: (data: any) => axiosInstance.post("/finance/transactions", data),
  exportData: (format: "csv" | "pdf" | "excel") =>
    axiosInstance.post("/finance/export", { format }, { responseType: "blob" }),
}

// Communications endpoints
export const communicationsApi = {
  getAll: (page?: number, limit?: number) =>
    axiosInstance.get("/communications", { params: { page, limit } }),
  getById: (id: string) => axiosInstance.get(`/communications/${id}`),
  create: (data: any) => axiosInstance.post("/communications", data),
  delete: (id: string) => axiosInstance.delete(`/communications/${id}`),
}

// Notifications endpoints
export const notificationsApi = {
  getAll: (page?: number, limit?: number) =>
    axiosInstance.get("/notifications", { params: { page, limit } }),
  getById: (id: string) => axiosInstance.get(`/notifications/${id}`),
  markAsRead: (id: string) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put("/notifications/read-all"),
  delete: (id: string) => axiosInstance.delete(`/notifications/${id}`),
  deleteAll: () => axiosInstance.delete("/notifications"),
}

// Dashboard endpoints
export const dashboardApi = {
  getStats: () => axiosInstance.get("/dashboard/stats"),
  getRecentActivity: (limit?: number) =>
    axiosInstance.get("/dashboard/activity", { params: { limit } }),
}

export default axiosInstance
