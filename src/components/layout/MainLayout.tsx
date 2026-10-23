
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, House } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('laravel-rise-theme') === 'dark'
  })

  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', darkMode)
    root.style.colorScheme = darkMode ? 'dark' : 'light'

    localStorage.setItem(
      'laravel-rise-theme',
      darkMode ? 'dark' : 'light',
    )
  }, [darkMode])

  const pageTitle =
    location.pathname === '/dashboard' || location.pathname === '/'
      ? 'Escritorio'
      : location.pathname === '/dashboards'
        ? 'Dashboards'
        : location.pathname === '/pantallas'
          ? 'Pantallas'
          : location.pathname === '/mensajes'
            ? 'Mensajes'
            : location.pathname === '/usuarios'
              ? 'Usuarios'
              : location.pathname === '/configuracion'
                ? 'Configuración'
                : 'Página'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header
        onToggleSidebar={() => setSidebarExpanded((value) => !value)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
      />

      {/* El menú lateral se superpone al contenido. */}
      <Sidebar
        expanded={sidebarExpanded}
        onClose={() => setSidebarExpanded(false)}
      />

      <div className="min-h-[calc(100vh-58px)] w-full pb-12">
        <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <House size={15} />
          <span>{pageTitle}</span>
        </div>

        <Outlet />
      </div>

      {/* Selector visual de pantallas: navegación pendiente de implementar. */}
      <nav
        aria-label="Selector de pantallas"
        className="fixed bottom-0 left-1/2 z-40 flex max-w-[calc(100vw-16px)] -translate-x-1/2 items-center gap-1 rounded-t-md border border-slate-200 bg-slate-200/95 px-1.5 py-1.5 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95 sm:bottom-2 sm:rounded-md sm:px-2"
      >
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center text-red-700 dark:text-red-400"
        >
          <ChevronLeft size={19} />
        </span>

        <div className="flex items-center gap-0.5">
          <span
            aria-current="page"
            title="Inicio"
            className="flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-semibold text-red-700 dark:text-red-400"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-white dark:bg-red-500">
              <House size={14} fill="currentColor" />
            </span>
          </span>

          {[1,2, 3, 4].map((number) => (
            <span
              key={number}
              title={`Pantalla ${number}`}
              className="flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              {number}
            </span>
          ))}
        </div>

        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center text-red-700 dark:text-red-400"
        >
          <ChevronRight size={19} />
        </span>
      </nav>
    </div>
  )
}
