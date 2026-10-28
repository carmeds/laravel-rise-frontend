
import { apiRequest } from '../lib/api'
import type { ConfigurationResponse } from '../types/configuration'

export function getConfiguration(): Promise<ConfigurationResponse> {
  return apiRequest<ConfigurationResponse>('/configuration')
}
