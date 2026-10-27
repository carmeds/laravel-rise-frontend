import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Activity,
  ChartNoAxesCombined,
  ChevronRight,
  House,
  Mail,
  Monitor,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react'

type SidebarProps = {
  expanded: boolean
  onClose: () => void
}

const navigation = [
  { label: 'Escritorio', path: '/dashboard', icon: House },
  { label: 'Tableros', path: '/tableros', icon: ChartNoAxesCombined },
  { label: 'Servicios', path: '/servicios', icon: Wrench },
  { label: 'Pantallas', path: '/pantallas', icon: Monitor },
  { label: 'Mensajes', path: '/mensajes', icon: Mail },
  { label: 'Usuarios', path: '/usuarios', icon: Users },
  { label: 'Configuración', path: '/configuracion', icon: Settings },
]

export default function Sidebar({ expanded, onClose }: SidebarProps) {
  useEffect(() => {
    if (!expanded) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded, onClose])

  return (
    <>
      {expanded && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-black/20"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-[58px] z-50 flex w-60 flex-col bg-[#a93226] text-white shadow-xl transition-transform duration-200 dark:border-r dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
          expanded ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!expanded}
      >
        <div className="flex h-12 items-center justify-between border-b border-white/15 px-4 dark:border-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider">Menú principal</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            tabIndex={expanded ? 0 : -1}
            className="rounded p-1.5 hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              tabIndex={expanded ? 0 : -1}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 font-semibold text-white'
                    : 'text-white/90 hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={15} className="opacity-60" />
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/15 p-3 dark:border-slate-700">
          <div className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-3">
            <Activity size={18} />
            <span className="text-xs">Sistema de monitoreo</span>
          </div>
        </div>
      </aside>
    </>
  )
}