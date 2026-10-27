import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import WidgetCard from '../components/widgets/WidgetCard'
import WidgetChart from '../components/widgets/WidgetChart'
import { dashboardWidgets, type DashboardWidget } from '../data/dashboardWidgets'

function ExpandedWidget({ widget, onClose }: { widget: DashboardWidget; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label={widget.title} className="w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{widget.title}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Periodo: {widget.period}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar indicador" className="rounded p-2 text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"><X size={20} /></button>
        </header>
        <div className="p-5">
          <div className="h-[320px]"><WidgetChart widget={widget} /></div>
          <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 dark:text-slate-400">
            <span>Fuente: {widget.source ?? 'SIE-PJ'}</span>
            <span>Actualizado: {widget.updated}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Dashboard() {
  const [expandedWidget, setExpandedWidget] = useState<DashboardWidget | null>(null)
  const [page, setPage] = useState(0)
  const pageSize = 12
  const totalPages = Math.ceil(dashboardWidgets.length / pageSize)
  const visibleWidgets = dashboardWidgets.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <main className="min-h-[calc(100vh-98px)] bg-slate-100 px-2 py-2 transition-colors dark:bg-slate-950 sm:px-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {visibleWidgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            title={widget.title}
            period={widget.period}
            source={widget.source}
            updated={widget.updated}
            onExpand={() => setExpandedWidget(widget)}
          >
            <WidgetChart widget={widget} />
          </WidgetCard>
        ))}
      </div>
      {totalPages > 1 && (
        <nav aria-label="Páginas de indicadores" className="mt-3 flex items-center justify-end gap-2">
          <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Página anterior"><ChevronLeft size={16} /></button>
          <span className="text-xs text-slate-500 dark:text-slate-400">Página {page + 1} de {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))} className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Página siguiente"><ChevronRight size={16} /></button>
        </nav>
      )}
      {expandedWidget && <ExpandedWidget widget={expandedWidget} onClose={() => setExpandedWidget(null)} />}
    </main>
  )
}