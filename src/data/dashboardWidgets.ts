export type WidgetKind = 'gauge' | 'empty' | 'stacked' | 'donut' | 'line' | 'combo'

export type DashboardWidget = {
  id: string
  title: string
  period: string
  kind: WidgetKind
  source?: string
  updated: string
}

export const dashboardWidgets: DashboardWidget[] = [
  { id: 'budget', title: 'Avance de Presupuesto(Mill.)', period: '2025 (Ene-Abr)', kind: 'gauge', source: 'Consulta Amigable', updated: '22/10/2026' },
  { id: 'goals', title: 'Avance de Metas no penal', period: '2025 (Ene-Mar)', kind: 'gauge', source: 'SIE-PJ', updated: '14/04/2025' },
  { id: 'flagrancia', title: 'Unidad de Flagrancia', period: '2022-2025', kind: 'gauge', source: 'SIE-PJ', updated: '14/04/2025' },
  { id: 'panic', title: 'Botón de Pánico', period: '2025', kind: 'gauge', source: 'SIE-PJ', updated: '16/04/2025' },
  { id: 'tramite', title: 'Resueltos Trámite', period: '2025', kind: 'combo', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'ejecucion', title: 'Resueltos Ejecución', period: '2025', kind: 'combo', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'pendientes', title: 'Pendientes', period: '2025', kind: 'stacked', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'rrhh', title: 'Recursos Humanos', period: '2025', kind: 'stacked', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'inventario', title: 'Avance de Inventario', period: '2025', kind: 'donut', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'reaperturado', title: 'Avance de Inventario reaperturado', period: '2024', kind: 'line', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'jornada', title: 'Jornada Extraordinaria', period: '2024', kind: 'gauge', source: 'SIE-PJ', updated: '14/03/2025' },
  { id: 'proteccion', title: 'Medidas de Protección', period: '2025', kind: 'stacked', source: 'SIE-PJ', updated: '14/03/2025' },
]