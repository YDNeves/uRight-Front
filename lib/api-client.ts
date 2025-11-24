// Cliente API centralizado para requisições
interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
}

const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  config: ApiConfig = defaultConfig,
): Promise<T> {
  const url = `${config.baseUrl}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...config.headers,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
