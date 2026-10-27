
import { Grip } from 'lucide-react'
import type { DashboardWidget } from '../../data/dashboardWidgets'

type WidgetCatalogProps = {
  widgets: DashboardWidget[]
  draggedWidget: string | null
  onDragStart: (widgetId: string) => void
  onDragEnd: () => void
}

export default function WidgetCatalog({
  widgets,
  draggedWidget,
  onDragStart,
  onDragEnd,
}: WidgetCatalogProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Widgets disponibles</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {widgets.length}
        </span>
      </div>

      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Arrastra un indicador hacia un espacio de la derecha.
      </p>

      <div className="space-y-2">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(event) => {
              onDragStart(widget.id)
              event.dataTransfer.setData('text/plain', widget.id)
              event.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnd={onDragEnd}
            className={`flex cursor-grab items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm transition hover:border-blue-400 hover:shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-950 ${
              draggedWidget === widget.id ? 'opacity-40' : ''
            }`}
          >
            <Grip size={17} className="shrink-0 text-slate-400" />
            <span className="min-w-0 flex-1">{widget.title}</span>
          </div>
        ))}

        {widgets.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
            Todos los widgets están colocados.
          </p>
        )}
      </div>
    </aside>
  )
}
