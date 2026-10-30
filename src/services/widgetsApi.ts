
import { apiRequest } from '../lib/api'

export type WidgetIndicator = {
  id: number
  title: string
  period: string
  value1: number
  value2: number
  fecha: string
  route: string
  description: string
}

type WidgetIndicatorsResponse = {
  success: boolean
  data: WidgetIndicator[]
}

let indicatorsPromise: Promise<WidgetIndicator[]> | null = null

export function getWidgetIndicators(): Promise<WidgetIndicator[]> {
  if (!indicatorsPromise) {
    indicatorsPromise = apiRequest<WidgetIndicatorsResponse>(
      '/widgets/donnuts',
    )
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error('La API devolvió una respuesta de widgets inválida.')
        }

        return response.data
      })
      .catch((error: unknown) => {
        indicatorsPromise = null
        throw error
      })
  }

  return indicatorsPromise
}
