
import { ArrowLeft } from 'lucide-react'
import type { SavedScreen } from '../../contexts/ScreensContext'
import {
  dashboardWidgets,
  type DashboardWidget,
} from '../../data/dashboardWidgets'
import WidgetCard from '../widgets/WidgetCard'
import WidgetChart from '../widgets/WidgetChart'

type ScreenPreviewProps = {
  screen: SavedScreen
  onBack: () => void
}

export default function ScreenPreview({
  screen,
  onBack,
}: ScreenPreviewProps) {
  function getWidget(id: string): DashboardWidget | undefined {
    return dashboardWidgets.find((widget) => widget.id === id)
  }

  const columnWidthClass =
    'w-full sm:w-[calc(50%-0.375rem)] xl:w-[calc(25%-0.75rem)]'

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span
            className="h-9 w-1.5 rounded-full"
            style={{ backgroundColor: screen.color }}
          />

          <div>
            <h1 className="text-lg font-semibold">{screen.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {screen.district} · Vista previa
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Volver al editor
        </button>
      </header>

      <div className="space-y-4 p-4">
        {screen.rows.map((row) => {
          const widgets = row.widgetIds
            .filter((id): id is string => id !== null)
            .map((id) => getWidget(id))
            .filter(
              (widget): widget is DashboardWidget =>
                widget !== undefined,
            )

          if (widgets.length === 0) return null

          return (
            <div
              key={row.id}
              className="flex flex-wrap items-stretch justify-center gap-3"
            >
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`min-w-0 ${columnWidthClass}`}
                >
                  <WidgetCard
                    title={widget.title}
                    period={widget.period}
                    source={widget.source}
                    updated={widget.updated}
                  >
                    <div className="min-h-[190px]">
                      <WidgetChart widget={widget} />
                    </div>
                  </WidgetCard>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
