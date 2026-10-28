import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useScreens } from '../contexts/ScreensContext'
import { dashboardWidgets, type DashboardWidget } from '../data/dashboardWidgets'
import WidgetCard from '../components/widgets/WidgetCard'
import WidgetChart from '../components/widgets/WidgetChart'
import ExpandedWidget from '../components/widgets/ExpandedWidget'

export default function ScreenDisplay() {
  const { screenId = '' } = useParams()
  const navigate = useNavigate()
  const { getScreen, loading } = useScreens()
  const [expandedWidget, setExpandedWidget] = useState<DashboardWidget | null>(null)
  const screen = getScreen(screenId)

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-98px)] p-4 pb-16">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cargando pantalla…
          </p>
        </section>
      </main>
    )
  }

  if (!screen) {
    return (
      <main className="min-h-[calc(100vh-98px)] p-4 pb-16">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold">Pantalla no encontrada</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Puede que haya sido eliminada o que ya no esté guardada en este navegador.
          </p>
          <button onClick={() => navigate('/pantallas')} className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
            <ArrowLeft size={16} /> Ir al creador de pantallas
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-98px)] bg-slate-100 px-2 py-2 pb-16 dark:bg-slate-950 sm:px-3">
        <div className="space-y-2">
          {screen.rows.map((row) => {
            const widgets = row.widgetIds
              .filter((id): id is string => id !== null)
              .map((id) => dashboardWidgets.find((widget) => widget.id === id))
              .filter((widget): widget is DashboardWidget => widget !== undefined)

            if (!widgets.length) return null
            return (
              <div key={row.id} className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="min-w-0">
                    <WidgetCard title={widget.title} period={widget.period} source={widget.source} updated={widget.updated} onExpand={() => setExpandedWidget(widget)}>
                      <div className="flex min-h-[230px] items-center justify-center">
                        <WidgetChart widget={widget} />
                      </div>
                    </WidgetCard>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        {expandedWidget && <ExpandedWidget widget={expandedWidget} onClose={() => setExpandedWidget(null)} />}
    </main>
  )
}
