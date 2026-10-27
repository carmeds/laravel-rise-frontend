
import { ChevronDown } from 'lucide-react'

type ScreenFormProps = {
  title: string
  color: string
  district: string
  onTitleChange: (value: string) => void
  onColorChange: (value: string) => void
  onDistrictChange: (value: string) => void
}

const colors = [
  '#84cc16',
  '#22c1c3',
  '#3098db',
  '#a3b2b2',
  '#eab308',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#a21caf',
  '#38bdf8',
  '#334155',
  '#d8b4fe',
  '#4f83f1',
]

const districts = [
  'PODER JUDICIAL',
  'CUSCO',
  'LIMA',
  'LIMA NORTE',
  'CALLAO',
  'LAMBAYEQUE',
  'AYACUCHO',
  'CAÑETE',
]

export default function ScreenForm({
  title,
  color,
  district,
  onTitleChange,
  onColorChange,
  onDistrictChange,
}: ScreenFormProps) {
  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold">
        Datos de la pantalla
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-slate-600 dark:text-slate-300">
            Título
          </span>

          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Ej. Pantalla Cusco"
            maxLength={80}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-slate-600 dark:text-slate-300">
            Distrito judicial
          </span>

          <span className="relative block">
            <select
              value={district}
              onChange={(event) => onDistrictChange(event.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-9 dark:border-slate-700 dark:bg-slate-950"
            >
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-3"
            />
          </span>
        </label>
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-sm text-slate-600 dark:text-slate-300">
          Color identificativo
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {colors.map((item) => (
            <button
              key={item}
              type="button"
              title={`Seleccionar color ${item}`}
              aria-label={`Seleccionar color ${item}`}
              aria-pressed={color === item}
              onClick={() => onColorChange(item)}
              className={`h-7 w-7 rounded-md transition ${
                color === item
                  ? 'ring-2 ring-slate-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: item }}
            />
          ))}

          <span
            className="ml-1 h-7 w-12 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </section>
  )
}
