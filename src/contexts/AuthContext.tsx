import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  apiRequest,
  clearToken,
  getToken,
  saveToken,
} from '../lib/api'

export type AuthUser = {
  id: number
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await apiRequest('/logout', { method: 'POST' })
      }
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{
      user: AuthUser
      token: string
      token_type: string
    }>('/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    })

    saveToken(result.token)
    setUser(result.user)
  }, [])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      try {
        if (getToken()) {
          const currentUser = await apiRequest<AuthUser>('/user')
          if (active) setUser(currentUser)
        }
      } catch {
        clearToken()
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
