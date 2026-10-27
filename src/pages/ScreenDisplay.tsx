import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Monitor, Pencil } from 'lucide-react'
import { useScreens } from '../contexts/ScreensContext'
import { dashboardWidgets, type DashboardWidget } from '../data/dashboardWidgets'
import WidgetCard from '../components/widgets/WidgetCard'
import WidgetChart from '../components/widgets/WidgetChart'

export default function ScreenDisplay() {
  const { screenId = '' } = useParams()
  const navigate = useNavigate()
  const { getScreen, loading } = useScreens()
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
    <main className="min-h-[calc(100vh-98px)] bg-slate-100 p-3 pb-16 dark:bg-slate-950 sm:p-5">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${screen.color}20`, color: screen.color }}>
              <Monitor size={20} />
            </span>
            <div>
              <h1 className="text-lg font-semibold">{screen.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{screen.district}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(`/pantallas/${screen.id}/editar`)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Pencil size={16} /> Editar pantalla
            </button>
            <button
              type="button"
              onClick={() => navigate('/pantallas')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Crear otra pantalla
            </button>
          </div>
        </header>

        <div className="space-y-4 p-4">
          {screen.rows.map((row) => {
            const widgets = row.widgetIds
              .filter((id): id is string => id !== null)
              .map((id) => dashboardWidgets.find((widget) => widget.id === id))
              .filter((widget): widget is DashboardWidget => widget !== undefined)

            if (!widgets.length) return null
            const widthClass = 'w-full sm:w-[calc(50%-0.375rem)] xl:w-[calc(25%-0.75rem)]'

            return (
              <div key={row.id} className="flex flex-wrap items-stretch justify-center gap-3">
                {widgets.map((widget) => (
                  <div key={widget.id} className={`min-w-0 ${widthClass}`}>
                    <WidgetCard title={widget.title} period={widget.period} source={widget.source} updated={widget.updated}>
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
    </main>
  )
}