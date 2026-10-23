import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  RefreshCw,
  KeyRound,
  LogOut,
  Menu,
  Monitor,
  Sun,
  Moon,
  UserRound,
} from 'lucide-react'

type HeaderProps = {
  onToggleSidebar: () => void
  darkMode: boolean
  onToggleTheme: () => void
}

export default function Header({ onToggleSidebar, darkMode, onToggleTheme }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-[58px] items-center justify-between border-b border-slate-200 bg-white px-3 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menú lateral"
          onClick={onToggleSidebar}
          className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-50 text-[#a91f23] dark:bg-red-950 dark:text-red-300">
          <Monitor size={19} />
        </div>
        <h1 className="truncate text-sm font-bold tracking-wide text-slate-700 dark:text-slate-100 sm:text-base">
          Centro de Comando y Monitoreo Jurisdiccional
        </h1>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          title="Vista de pantalla"
          aria-label="Vista de pantalla"
          onClick={() => document.documentElement.requestFullscreen?.()}
          className="hidden rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 sm:block"
        >
          <Monitor size={18} />
        </button>
        <button
          type="button"
          title="Actualizar vista"
          aria-label="Actualizar vista"
          onClick={() => window.location.reload()}
          className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw size={18} />
        </button>
        <button
          type="button"
          title="Notificaciones"
          aria-label="Notificaciones"
          className="hidden rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 sm:block"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={onToggleTheme}
          className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-label="Abrir menú de usuario"
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-1 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-200">
              <UserRound size={21} />
            </span>
            <ChevronDown size={14} className="hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              aria-label="Menú de usuario"
              className="absolute right-0 top-[calc(100%+12px)] z-[70] w-64 overflow-hidden rounded-md border border-slate-200 bg-white text-slate-600 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <div className="flex flex-col items-center border-b border-slate-100 px-4 py-5 text-center dark:border-slate-700">
                <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-300">
                  <UserRound size={25} />
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">Santiago Medina</span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">cmedinasa@pj.gob.pe</span>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <UserRound size={16} /> Mi Perfil
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <KeyRound size={16} /> Cambiar Contraseña
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
