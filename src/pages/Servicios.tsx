import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Grid2X2,
  Search,
  X,
} from 'lucide-react'

type ServiceLink = {
  title: string
  href: string
  type: 'internal' | 'external'
}

type ServiceCategory = {
  title: string
  icon: typeof Grid2X2
  links: ServiceLink[]
}

const serviceCategories: ServiceCategory[] = [
  {
    title: 'Internos',
    icon: CheckCircle2,
    links: [
      // Reemplazar las rutas de ejemplo por las páginas internas definitivas.
      { title: 'Portal Estadístico', href: '/dashboard', type: 'internal' },
      { title: 'Portal de Informes', href: '/dashboard', type: 'internal' },
    ],
  },
  {
    title: 'Enlaces de Interés',
    icon: Grid2X2,
    links: [
      // Estas URL son ejemplos; confirmar las direcciones institucionales antes de publicar.
      { title: 'CSJ de Lima', href: 'https://www.pj.gob.pe/', type: 'external' },
      { title: 'Servicio de Justicia en tus manos - SERJUS', href: 'https://www.pj.gob.pe/', type: 'external' },
      { title: 'Casillero Judicial', href: 'https://www.pj.gob.pe/', type: 'external' },
      { title: 'Consulta de Expedientes', href: 'https://cej.pj.gob.pe/cej/forms/busquedaform.html', type: 'external' },
      { title: 'Unidad de Gestión de Despacho Judicial', href: 'https://www.pj.gob.pe/', type: 'external' },
      { title: 'Centro de Investigaciones Judiciales', href: 'https://www.pj.gob.pe/', type: 'external' },
      { title: 'PPR Civil Comercial 0119 y PPR Tributario 0143', href: 'https://www.pj.gob.pe/', type: 'external' },
    ],
  },
]

export default function Servicios() {
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es-PE')
    if (!query) return serviceCategories

    return serviceCategories
      .map((category) => ({
        ...category,
        links: category.links.filter((link) =>
          `${category.title} ${link.title}`.toLocaleLowerCase('es-PE').includes(query),
        ),
      }))
      .filter(
        (category) =>
          category.title.toLocaleLowerCase('es-PE').includes(query) ||
          category.links.length > 0,
      )
  }, [search])

  const totalLinks = filteredCategories.reduce((total, category) => total + category.links.length, 0)

  return (
    <main className="min-h-[calc(100vh-58px)] bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
            <Grid2X2 size={17} />
            Catálogo institucional
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Servicios
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Seleccione un servicio para acceder a las herramientas y enlaces institucionales. Si no lo encuentra, utilice el campo de búsqueda.
          </p>
        </header>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <label htmlFor="service-search" className="sr-only">Buscar servicios</label>
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="service-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar"
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredCategories.length} categorías · {totalLinks} servicios
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <Search size={25} className="mx-auto mb-3 text-slate-400" />
            <h2 className="font-medium text-slate-800 dark:text-slate-100">No se encontraron servicios</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Prueba con otro término de búsqueda.</p>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              return (
                <section
                  key={category.title}
                  className="min-w-0 rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                >
                  <header className="mb-4 flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-100">{category.title}</h2>
                    <span className="ml-auto text-xs text-slate-400">{category.links.length}</span>
                  </header>

                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {category.links.map((link) => {
                      const isExternal = link.type === 'external'
                      return (
                        <li key={`${category.title}-${link.title}`}>
                          <a
                            href={link.href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="group flex min-h-10 items-center gap-2 rounded-sm px-2 py-2 text-sm text-blue-700 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:bg-slate-800 dark:hover:text-blue-200"
                          >
                            {isExternal ? <ExternalLink size={15} className="shrink-0" /> : <CheckCircle2 size={15} className="shrink-0" />}
                            <span className="min-w-0 flex-1">{link.title}</span>
                            {isExternal && <ArrowUpRight size={14} className="shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}