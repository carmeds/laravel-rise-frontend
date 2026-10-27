import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiRequest } from '../lib/api'
import { useAuth } from './AuthContext'

export type ScreenRow = {
  id: string
  columns: number
  widgetIds: (string | null)[]
}

export type SavedScreen = {
  id: string
  title: string
  color: string
  district: string
  rows: ScreenRow[]
}

type NewScreen = Omit<SavedScreen, 'id'>

type ApiScreen = {
  id: number | string
  title: string
  color: string
  district: string
  rows: ScreenRow[]
}

type ScreensContextValue = {
  screens: SavedScreen[]
  loading: boolean
  error: string | null
  addScreen: (screen: NewScreen) => Promise<SavedScreen>
  updateScreen: (screen: SavedScreen) => Promise<void>
  deleteScreen: (id: string) => Promise<void>
  getScreen: (id: string) => SavedScreen | undefined
}

const STORAGE_KEY = 'laravel-rise-custom-screens'
const ScreensContext = createContext<ScreensContextValue | null>(null)

function readStoredScreens(): SavedScreen[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is SavedScreen =>
      item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.color === 'string' &&
      typeof item.district === 'string' &&
      Array.isArray(item.rows)
    )
  } catch {
    return []
  }
}

function normalizeScreen(screen: ApiScreen): SavedScreen {
  return {
    id: String(screen.id),
    title: screen.title,
    color: screen.color,
    district: screen.district,
    rows: screen.rows,
  }
}

// Evita que cargas simultáneas migren la misma pantalla dos veces.
const migrationInFlight = new Map<
  string,
  Promise<{ failed: boolean }>
>()

function migrateLegacyScreens(
  legacyScreens: SavedScreen[],
  markerKey: string,
): Promise<{ failed: boolean }> {
  const existingTask = migrationInFlight.get(markerKey)
  if (existingTask) return existingTask

  const task = (async () => {
    let migrated: Record<string, string> = {}

    try {
      migrated = JSON.parse(localStorage.getItem(markerKey) ?? '{}')
    } catch {
      migrated = {}
    }

    let failed = false

    for (const legacy of legacyScreens) {
      // Volvemos a consultar el registro para evitar duplicados.
      if (migrated[legacy.id]) continue

      try {
        const created = await apiRequest<ApiScreen>('/screens', {
          method: 'POST',
          body: {
            title: legacy.title,
            color: legacy.color,
            district: legacy.district,
            rows: legacy.rows,
          },
        })

        migrated[legacy.id] = String(created.id)
        localStorage.setItem(markerKey, JSON.stringify(migrated))
      } catch (error) {
        failed = true
        console.error(
          `No se pudo migrar la pantalla "${legacy.title}":`,
          error,
        )
      }
    }

    return { failed }
  })()

  migrationInFlight.set(markerKey, task)

  void task.finally(() => {
    if (migrationInFlight.get(markerKey) === task) {
      migrationInFlight.delete(markerKey)
    }
  })

  return task
}

export function ScreensProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [screens, setScreens] = useState<SavedScreen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadScreens = useCallback(async () => {
    if (!user) {
      setScreens([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let remote = await apiRequest<ApiScreen[]>('/screens')
      let normalized = remote.map(normalizeScreen)

      const markerKey = `laravel-rise-migrated-screens:${user.id}`
      const legacyScreens = readStoredScreens().filter(
        (screen) => !/^\d+$/.test(screen.id),
      )

      const { failed: migrationFailed } = await migrateLegacyScreens(
        legacyScreens,
        markerKey,
      )

      if (legacyScreens.length > 0) {
        remote = await apiRequest<ApiScreen[]>('/screens')
        normalized = remote.map(normalizeScreen)
      }

      setScreens(normalized)

      // Solo reemplazamos la copia local cuando todas las pantallas
      // antiguas se han migrado correctamente.
      if (!migrationFailed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      } else {
        setError(
          'Algunas pantallas antiguas no pudieron migrarse. Sus datos locales se han conservado.',
        )
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar las pantallas desde el servidor.',
      )
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    void loadScreens()
  }, [authLoading, loadScreens])

  const addScreen = useCallback(async (screen: NewScreen) => {
    const created = await apiRequest<ApiScreen>('/screens', {
      method: 'POST',
      body: screen,
    })

    const saved = normalizeScreen(created)
    setScreens((current) => [...current, saved])
    setError(null)
    return saved
  }, [])

  const updateScreen = useCallback(async (screen: SavedScreen) => {
    const updated = await apiRequest<ApiScreen>(
      `/screens/${encodeURIComponent(screen.id)}`,
      {
        method: 'PATCH',
        body: {
          title: screen.title,
          color: screen.color,
          district: screen.district,
          rows: screen.rows,
        },
      },
    )

    const saved = normalizeScreen(updated)
    setScreens((current) =>
      current.map((item) => item.id === saved.id ? saved : item),
    )
  }, [])

  const deleteScreen = useCallback(async (id: string) => {
    await apiRequest(`/screens/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })

    setScreens((current) => current.filter((item) => item.id !== id))
  }, [])

  const getScreen = useCallback(
    (id: string) => screens.find((screen) => screen.id === id),
    [screens],
  )

  const value = useMemo(
    () => ({
      screens,
      loading,
      error,
      addScreen,
      updateScreen,
      deleteScreen,
      getScreen,
    }),
    [screens, loading, error, addScreen, updateScreen, deleteScreen, getScreen],
  )

  return (
    <ScreensContext.Provider value={value}>
      {children}
    </ScreensContext.Provider>
  )
}

export function useScreens() {
  const context = useContext(ScreensContext)
  if (!context) {
    throw new Error('useScreens debe usarse dentro de ScreensProvider')
  }
  return context
}
