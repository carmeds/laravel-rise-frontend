import {
  Grip,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import type { ScreenRow } from '../../contexts/ScreensContext'
import type { DashboardWidget } from '../../data/dashboardWidgets'

type ScreenRowsEditorProps = {
  rows: ScreenRow[]
  title: string
  color: string
  district: string
  draggedWidget: string | null
  getWidget: (id: string | null) => DashboardWidget | undefined
  onAddRow: () => void
  onDeleteRow: (rowId: string) => void
  onUpdateColumns: (rowId: string, columns: number) => void
  onRemoveWidget: (widgetId: string) => void
  onPlaceWidget: (
    widgetId: string,
    rowId: string,
    slotIndex: number,
  ) => void
  onDragStart: (widgetId: string) => void
  onDragEnd: () => void
}

export default function ScreenRowsEditor({
  rows,
  title,
  color,
  district,
  draggedWidget,
  getWidget,
  onAddRow,
  onDeleteRow,
  onUpdateColumns,
  onRemoveWidget,
  onPlaceWidget,
  onDragStart,
  onDragEnd,
}: ScreenRowsEditorProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <span className="text-lg font-semibold">▦</span>
          </span>

          <div>
            <h2 className="font-semibold">
              {title.trim() || 'Nueva pantalla'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {district} · {rows.length} filas
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Plus size={16} />
          Añadir fila
        </button>
      </header>

      <div className="space-y-4 bg-slate-100/70 p-3 dark:bg-slate-950/50 sm:p-4">
        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                Fila {rowIndex + 1}
              </span>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  Widgets por fila
                  <select
                    value={row.columns}
                    onChange={(event) =>
                      onUpdateColumns(row.id, Number(event.target.value))
                    }
                    className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    {[1, 2, 3, 4].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => onDeleteRow(row.id)}
                  title="Eliminar fila"
                  aria-label={`Eliminar fila ${rowIndex + 1}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-3 ${
                row.columns >= 2 ? 'sm:grid-cols-2' : ''
              } ${row.columns >= 3 ? 'lg:grid-cols-3' : ''} ${
                row.columns >= 4 ? 'xl:grid-cols-4' : ''
              }`}
            >
              {row.widgetIds.map((widgetId, slotIndex) => {
                const widget = getWidget(widgetId)

                return (
                  <div
                    key={`${row.id}-${slotIndex}`}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'move'
                    }}
                    onDrop={(event) => {
                      event.preventDefault()

                      const id =
                        event.dataTransfer.getData('text/plain') ||
                        draggedWidget

                      if (id) {
                        onPlaceWidget(id, row.id, slotIndex)
                      }

                      onDragEnd()
                    }}
                    className={`flex min-h-32 min-w-0 flex-col rounded-lg border-2 border-dashed p-2 transition ${
                      widget
                        ? 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                        : 'border-blue-300 bg-blue-50/70 hover:border-blue-500 dark:border-blue-900 dark:bg-blue-950/20'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Espacio {slotIndex + 1}</span>

                      {widget && (
                        <button
                          type="button"
                          onClick={() => onRemoveWidget(widget.id)}
                          aria-label={`Retirar ${widget.title}`}
                          title="Retirar widget"
                          className="rounded p-1 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>

                    {widget ? (
                      <div
                        draggable
                        onDragStart={(event) => {
                          onDragStart(widget.id)
                          event.dataTransfer.setData(
                            'text/plain',
                            widget.id,
                          )
                          event.dataTransfer.effectAllowed = 'move'
                        }}
                        onDragEnd={onDragEnd}
                        className={`flex flex-1 cursor-grab items-center gap-2 rounded-md border border-slate-200 bg-white p-3 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-950 ${
                          draggedWidget === widget.id ? 'opacity-40' : ''
                        }`}
                      >
                        <Grip
                          size={16}
                          className="shrink-0 text-slate-400"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-medium">
                            {widget.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {widget.period}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2 py-4 text-center text-sm text-blue-700 dark:text-blue-300">
                        <Plus size={20} />
                        <span>Arrastra y suelta un widget aquí</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
