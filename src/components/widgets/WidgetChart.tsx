
import { dashboardTheme as theme } from '../../lib/theme'
import BarLineWidget from './BarLineWidget'
import DonutWidget from './DonutWidget'
import LineWidget from './LineWidget'
import SemiDonutWidget from './SemiDonutWidget'
import StackedBarWidget from './StackedBarWidget'
import type { DashboardWidget } from '../../data/dashboardWidgets'
import {
  donutData,
  ejecucionData,
  monthlyData,
  semiDonutData,
  stackedData,
  tramiteData,
} from '../../data/dashboardDemoData'
import useWidgetIndicators from '../../hooks/useWidgetIndicators'
import type { WidgetIndicator } from '../../services/widgetsApi'

const API_WIDGETS: Record<string, string> = {
  goals: 'Avance de Metas no penal',
  flagrancia: 'Unidad de Flagrancia',
  panic: 'Botón de Pánico',
  inventario: 'Avance de Inventario',
  reaperturado: 'Avance de Inventario reaperturado',
  jornada: 'Jornada Extraordinaria',
}

type WidgetChartProps = {
  widget: DashboardWidget
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 2,
  }).format(value)
}

function getPercentage(description: string): number | null {
  const match = description.match(/(\d+(?:[.,]\d+)?)\s*%/)

  if (!match) return null

  const percentage = Number(match[1].replace(',', '.'))

  return Number.isFinite(percentage) ? percentage : null
}

function ApiGauge({
  indicator,
}: {
  indicator: WidgetIndicator
}) {
  const percentage = getPercentage(indicator.description)

  if (percentage === null) {
    return (
      <div className="flex h-[174px] items-center justify-center px-4 text-center text-xs text-amber-600 dark:text-amber-400">
        El indicador no contiene un porcentaje reconocible en su descripción.
      </div>
    )
  }

  return (
    <SemiDonutWidget
      percentage={percentage}
      centerValue={`${percentage.toLocaleString('es-PE', {
        maximumFractionDigits: 1,
      })}%`}
      centerLabel="Avance"
      leftValue={formatNumber(indicator.value1)}
      leftLabel="Valor 1"
      rightValue={formatNumber(indicator.value2)}
      rightLabel="Valor 2"
      height={190}
      color={theme.chart.red}
      remainingColor={theme.chart.gray}
      showPercentages
    />
  )
}

function LoadingMessage() {
  return (
    <div
      className="flex h-[174px] items-center justify-center text-xs text-slate-400"
      role="status"
    >
      Cargando indicador…
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="flex h-[174px] flex-col items-center justify-center gap-2 px-4 text-center text-xs text-rose-500"
      role="alert"
    >
      <span>No se pudo cargar el indicador.</span>
      <span className="break-words">{message}</span>
    </div>
  )
}

export default function WidgetChart({ widget }: WidgetChartProps) {
  const apiTitle = API_WIDGETS[widget.id]
  const usesApi = Boolean(apiTitle)
  const { data, loading, error } = useWidgetIndicators(usesApi)

  if (usesApi) {
    if (loading) return <LoadingMessage />

    if (error) return <ErrorMessage message={error} />

    const indicator = data.find((item) => item.title === apiTitle)

    if (!indicator) {
      return (
        <ErrorMessage
          message={`No se encontró el indicador "${apiTitle}" en la respuesta de la API.`}
        />
      )
    }

    return <ApiGauge indicator={indicator} />
  }

  switch (widget.kind) {
    case 'gauge': {
      const gaugeData = semiDonutData[widget.id] ?? semiDonutData.jornada

      return (
        <SemiDonutWidget
          percentage={gaugeData.percentage}
          centerValue={gaugeData.centerValue}
          centerLabel={gaugeData.centerLabel}
          leftValue={gaugeData.leftValue}
          leftLabel={gaugeData.leftLabel}
          rightValue={gaugeData.rightValue}
          rightLabel={gaugeData.rightLabel}
          height={190}
          color={theme.chart.red}
          remainingColor={theme.chart.gray}
          showPercentages
        />
      )
    }

    case 'empty':
      return (
        <div className="flex h-[174px] flex-col items-center justify-center gap-2 text-slate-400">
          <span className="text-xs">Sin información disponible</span>
        </div>
      )

    case 'stacked':
      return (
        <StackedBarWidget
          data={stackedData}
          series={[
            { dataKey: 'completed', label: 'Atendidos', color: theme.chart.red },
            { dataKey: 'pending', label: 'Pendientes', color: theme.chart.gray },
          ]}
          height={174}
        />
      )

    case 'donut':
      return (
        <DonutWidget
          data={donutData}
          colors={[
            theme.chart.red,
            theme.chart.lightBlue,
            theme.chart.gray,
          ]}
          height={200}
          centerValue="100%"
          showLegend
        />
      )

    case 'line':
      return (
        <LineWidget
          data={monthlyData}
          series={[
            {
              dataKey: 'value',
              label: 'Periodo actual',
              color: theme.chart.red,
            },
            {
              dataKey: 'previous',
              label: 'Periodo anterior',
              color: theme.chart.slate,
              dashed: true,
            },
          ]}
          height={174}
          showGrid
          showLegend
        />
      )

    case 'combo': {
      const isTramite = widget.id === 'tramite'
      const chartData = isTramite ? tramiteData : ejecucionData
      const summary = isTramite
        ? { current: '2025: 4977', previous: '2024: 6857' }
        : { current: '2025: 5536', previous: '2024: 8153' }

      return (
        <BarLineWidget
          data={chartData}
          currentSummary={summary.current}
          previousSummary={summary.previous}
          barLabel="Resueltos"
          lineLabel="Tendencia"
        />
      )
    }

    default:
      return (
        <div className="flex h-[174px] flex-col items-center justify-center gap-2 text-slate-400">
          <span className="text-xs">Sin información disponible</span>
        </div>
      )
  }
}
