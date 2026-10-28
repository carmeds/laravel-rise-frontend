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

type WidgetChartProps = {
  widget: DashboardWidget
}

/**
 * Renderizador compartido de gráficos. Dashboard y pantallas personalizadas
 * usan exactamente la misma implementación y los mismos datos de demostración.
 */
export default function WidgetChart({ widget }: WidgetChartProps) {
  switch (widget.kind) {
    case 'gauge': {
      const data = semiDonutData[widget.id] ?? semiDonutData.jornada
      return (
        <SemiDonutWidget
          percentage={data.percentage}
          centerValue={data.centerValue}
          centerLabel={data.centerLabel}
          leftValue={data.leftValue}
          leftLabel={data.leftLabel}
          rightValue={data.rightValue}
          rightLabel={data.rightLabel}
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
          colors={[theme.chart.red, theme.chart.lightBlue, theme.chart.gray]}
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
            { dataKey: 'value', label: 'Periodo actual', color: theme.chart.red },
            { dataKey: 'previous', label: 'Periodo anterior', color: theme.chart.slate, dashed: true },
          ]}
          height={174}
          showGrid
          showLegend
        />
      )

    case 'combo': {
      const isTramite = widget.id === 'tramite'
      const data = isTramite ? tramiteData : ejecucionData
      const summary = isTramite
        ? { current: '2025: 4977', previous: '2024: 6857' }
        : { current: '2025: 5536', previous: '2024: 8153' }

      return (
        <BarLineWidget
          data={data}
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
