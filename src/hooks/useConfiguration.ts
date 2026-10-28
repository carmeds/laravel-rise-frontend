
import { useEffect, useState } from 'react'
import { getConfiguration } from '../services/configurationService'
import type { ScreenColorOption } from '../types/configuration'

const FALLBACK_COLOR = '#4f83f1'

export function useConfiguration() {
  const [colors, setColors] = useState<ScreenColorOption[]>([])
  const [defaultColor, setDefaultColor] = useState(FALLBACK_COLOR)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadConfiguration() {
      try {
        const configuration = await getConfiguration()

        if (!active) return

        setColors(configuration.colors)
        setDefaultColor(configuration.default_color || FALLBACK_COLOR)
        setError(null)
      } catch (err) {
        if (!active) return

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la configuración.',
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadConfiguration()

    return () => {
      active = false
    }
  }, [])

  return {
    colors,
    defaultColor,
    loading,
    error,
  }
}
