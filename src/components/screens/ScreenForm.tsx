
import { ChevronDown } from 'lucide-react'
import type { ScreenColorOption } from '../../types/configuration'

type ScreenFormProps = {
  title: string
  color: string
  district: string
  colors: ScreenColorOption[]
  colorsLoading: boolean
  colorsError: string | null
  onTitleChange: (value: string) => void
  onColorChange: (value: string) => void
  onDistrictChange: (value: string) => void
}

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
  colors,
  colorsLoading,
  colorsError,
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

        {colorsLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cargando colores...
          </p>
        )}

        {colorsError && (
          <p role="status" className="mb-2 text-sm text-amber-700 dark:text-amber-300">
            No se pudo cargar la paleta desde el servidor. {colorsError}
          </p>
        )}

        {!colorsLoading && !colorsError && colors.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay colores activos configurados en el servidor.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {colors.map((item) => (
            <button
              key={item.id}
              type="button"
              title={`${item.name} (${item.hex_color})`}
              aria-label={`Seleccionar color ${item.name}`}
              aria-pressed={color.toLowerCase() === item.hex_color.toLowerCase()}
              onClick={() => onColorChange(item.hex_color)}
              className={`h-7 w-7 rounded-md transition ${
                color.toLowerCase() === item.hex_color.toLowerCase()
                  ? 'ring-2 ring-slate-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: item.hex_color }}
            />
          ))}

          <span
            className="ml-1 h-7 w-12 rounded-full border border-slate-200 dark:border-slate-700"
            title={`Color seleccionado: ${color}`}
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </section>
  )
}
