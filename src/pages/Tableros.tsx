import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Blocks,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ExternalLink,
  FileBarChart,
  Gavel,
  Grid2X2,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

type BoardLink = {
  title: string
  description?: string
  href: string
  type: 'internal' | 'external'
}

type BoardCategory = {
  title: string
  description: string
  icon: typeof Grid2X2
  links: BoardLink[]
}

const categories: BoardCategory[] = [
  {
    title: 'Procesos Judiciales',
    description: 'Indicadores de carga, producción y avance procesal.',
    icon: Gavel,
    links: [
      { title: 'Carga procesal', href: '/pantallas', type: 'internal' },
      { title: 'Procesos Resueltos', href: '/pantallas', type: 'internal' },
      { title: 'Procesos Judiciales Pendientes, Ingresados y Resueltos', href: '/pantallas', type: 'internal' },
      { title: 'Procesos Judiciales Principales', href: '/pantallas', type: 'internal' },
      { title: 'Poder Judicial en Cifras', href: '/pantallas', type: 'internal' },
      { title: 'Avance de Inventario', href: '/pantallas', type: 'internal' },
    ],
  },
  {
    title: 'Ley 30364',
    description: 'Información relacionada con medidas de protección y módulos.',
    icon: ShieldCheck,
    links: [
      { title: 'Botón de Pánico', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Medidas de Protección', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Módulos Penales', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Ley 30364', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Delitos',
    description: 'Tableros temáticos de seguimiento de delitos.',
    icon: CircleDot,
    links: [
      { title: 'Feminicidio', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Lesiones', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Violación Sexual', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Trata de Personas', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Corrupción de Funcionarios', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Patrimonio Cultural', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Delitos Ambientales', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Omisión de Prestación de Alimentos', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Delito de Hurto', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Indicadores',
    description: 'Indicadores de gestión y desempeño jurisdiccional.',
    icon: BarChart3,
    links: [
      { title: 'Indicadores Jurisdiccionales', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Estadística el Juez te escucha', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Dependencias',
    description: 'Información de dependencias y despliegue institucional.',
    icon: Building2,
    links: [
      { title: 'Dependencias Implementadas', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Perú Dependencias Implementadas', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Temáticos', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Personal y Bienes',
    description: 'Tableros administrativos y de recursos institucionales.',
    icon: Users,
    links: [
      { title: 'Personal del Poder Judicial', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Estadísticas Administrativas', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Panel de Indicadores',
    description: 'Accesos rápidos a indicadores de gestión.',
    icon: FileBarChart,
    links: [
      { title: 'Tasa de Congestión', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Tasa de Resolución', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Tasa de Apelación', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Tasa de Calidad', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Ejecución Presupuestal', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Metas Productividad', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Jornada Extraordinaria', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Pendientes', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Resueltos Trámite', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Descarga Ejecución', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Régimen Laboral', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Unidad de Flagrancia', href: 'https://app.powerbi.com/', type: 'external' },
      { title: 'Módulos de Ejecución', href: 'https://app.powerbi.com/', type: 'external' },
    ],
  },
  {
    title: 'Otros servicios',
    description: 'Accesos a herramientas y servicios institucionales.',
    icon: BriefcaseBusiness,
    links: [
      { title: 'Pantallas personalizadas', href: '/pantallas', type: 'internal' },
    ],
  },
]

export default function Tableros() {
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es-PE')
    if (!query) return categories

    return categories
      .map((category) => ({
        ...category,
        links: category.links.filter((link) =>
          `${link.title} ${link.description ?? ''} ${category.title}`
            .toLocaleLowerCase('es-PE')
            .includes(query),
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
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
              <Grid2X2 size={17} />
              Catálogo institucional
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Tableros
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Accede a tableros de gestión, indicadores institucionales y servicios internos o externos desde un solo lugar.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label htmlFor="board-search" className="sr-only">Buscar tableros</label>
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="board-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar tablero o categoría…"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredCategories.length} categorías · {totalLinks} accesos
          </p>
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400">
              Limpiar búsqueda
            </button>
          )}
        </div>

        {filteredCategories.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <Search className="mx-auto mb-3 text-slate-400" size={28} />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">No se encontraron tableros</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Prueba con otro nombre o categoría.</p>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              return (
                <section key={category.title} className="flex min-w-0 flex-col rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                  <header className="mb-3 flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100">{category.title}</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{category.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {category.links.length}
                    </span>
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
                            className="group flex min-h-10 items-center gap-2 rounded-md px-2 py-2 text-sm text-blue-700 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:bg-slate-800 dark:hover:text-blue-200"
                          >
                            {isExternal ? <ExternalLink size={15} className="shrink-0 opacity-80" /> : <CheckCircle2 size={15} className="shrink-0 opacity-80" />}
                            <span className="min-w-0 flex-1">{link.title}</span>
                            {isExternal ? <ArrowUpRight size={14} className="shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> : <ChevronRight size={14} className="shrink-0 opacity-50" />}
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

        <footer className="mt-6 flex items-start gap-2 rounded-lg border border-slate-200 bg-white/70 p-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <Blocks size={16} className="mt-0.5 shrink-0" />
          <p>
            Los enlaces mostrados son datos iniciales de demostración. Reemplaza las direcciones de ejemplo por las URL reales de Power BI y por las rutas internas correspondientes antes de publicar.
          </p>
        </footer>
      </div>
    </main>
  )
}