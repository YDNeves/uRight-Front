const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || "An error occurred" }
    }

    return { data }
  } catch (error) {
    return { error: "Network error. Please try again." }
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    fetchApi<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () => fetchApi("/auth/logout", { method: "POST" }),

  getCurrentUser: () => fetchApi<any>("/auth/me"),
}

// Dashboard API
export const dashboardApi = {
  getStats: () => fetchApi<any>("/dashboard/stats"),
}

// Associations API
export const associationsApi = {
  getAll: () => fetchApi<any[]>("/associations"),
  getById: (id: string) => fetchApi<any>(`/associations/${id}`),
  create: (data: any) =>
    fetchApi<any>("/associations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/associations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/associations/${id}`, { method: "DELETE" }),
}

// Members API
export const membersApi = {
  getAll: () => fetchApi<any[]>("/members"),
  getById: (id: string) => fetchApi<any>(`/members/${id}`),
  create: (data: any) =>
    fetchApi<any>("/members", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/members/${id}`, { method: "DELETE" }),
}

// Payments API
export const paymentsApi = {
  getAll: () => fetchApi<any[]>("/payments"),
  getById: (id: string) => fetchApi<any>(`/payments/${id}`),
  create: (data: any) =>
    fetchApi<any>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/payments/${id}`, { method: "DELETE" }),
}

// Events API
export const eventsApi = {
  getAll: () => fetchApi<any[]>("/events"),
  getById: (id: string) => fetchApi<any>(`/events/${id}`),
  create: (data: any) =>
    fetchApi<any>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => fetchApi(`/events/${id}`, { method: "DELETE" }),
}
