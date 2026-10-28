import { X } from 'lucide-react'
import type { DashboardWidget } from '../../data/dashboardWidgets'
import WidgetChart from './WidgetChart'

export default function ExpandedWidget({
  widget,
  onClose,
}: {
  widget: DashboardWidget
  onClose: () => void
}) {
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
          <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Fuente: {widget.source ?? 'SIE-PJ'}</span>
            <span>Actualizado: {widget.updated}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
