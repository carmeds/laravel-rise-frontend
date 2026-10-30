
import { useEffect, useState } from 'react'
import {
  getWidgetIndicators,
  type WidgetIndicator,
} from '../services/widgetsApi'

type WidgetIndicatorsState = {
  data: WidgetIndicator[]
  loading: boolean
  error: string | null
}

const initialState: WidgetIndicatorsState = {
  data: [],
  loading: false,
  error: null,
}

export default function useWidgetIndicators(enabled: boolean) {
  const [state, setState] = useState<WidgetIndicatorsState>(initialState)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let active = true

    setState({
      data: [],
      loading: true,
      error: null,
    })

    getWidgetIndicators()
      .then((data) => {
        if (!active) return

        setState({
          data,
          loading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!active) return

        setState({
          data: [],
          loading: false,
          error: error instanceof Error
            ? error.message
            : 'No se pudieron cargar los indicadores.',
        })
      })

    return () => {
      active = false
    }
  }, [enabled])

  return state
}
