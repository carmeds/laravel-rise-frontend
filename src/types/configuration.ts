
export type ScreenColorOption = {
  id: number
  name: string
  hex_color: string
  is_default: boolean
  sort_order: number
}

export type ConfigurationResponse = {
  colors: ScreenColorOption[]
  default_color: string
}
