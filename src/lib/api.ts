const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const TOKEN_KEY = 'laravel-rise-token'

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

type ApiOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined
      ? undefined
      : JSON.stringify(options.body),
  })

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const result = data as {
      message?: string
      errors?: Record<string, string[]>
    } | null

    const validationMessage = result?.errors
      ? Object.values(result.errors).flat().join(' ')
      : ''

    throw new Error(
      validationMessage ||
      result?.message ||
      `Error HTTP ${response.status}`,
    )
  }

  return data as T
}
