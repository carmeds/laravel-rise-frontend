
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, House, Monitor, Pencil } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useScreens } from '../../contexts/ScreensContext'

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('laravel-rise-theme') === 'dark'
  })

  const location = useLocation()
  const navigate = useNavigate()
  const { screens } = useScreens()
  const screenMatch = location.pathname.match(/^\/pantalla\/([^/]+)$/)
  const activeScreen = screenMatch
    ? screens.find((screen) => screen.id === decodeURIComponent(screenMatch[1]))
    : undefined

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
        <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {activeScreen ? (
            <div className="flex min-w-0 items-center gap-2">
              <Monitor size={16} className="shrink-0" style={{ color: activeScreen.color }} />
              <h1 className="truncate font-semibold text-slate-700 dark:text-slate-100">{activeScreen.title}</h1>
              <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{activeScreen.district}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <House size={15} />
              <span>{pageTitle}</span>
            </div>
          )}
          {activeScreen && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" onClick={() => navigate(`/pantallas/${activeScreen.id}/editar`)} className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                <Pencil size={13} /> Editar pantalla
              </button>
              <button type="button" onClick={() => navigate('/pantallas')} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                Crear otra pantalla
              </button>
            </div>
          )}
        </div>

        <Outlet />
      </div>

      {/* Selector dinámico: dashboard predeterminado y pantallas guardadas. */}
      <nav
        aria-label="Selector de pantallas"
        className="fixed bottom-0 left-1/2 z-40 flex max-w-[calc(100vw-16px)] -translate-x-1/2 items-center gap-1 rounded-t-md border border-slate-200 bg-slate-200/95 px-1.5 py-1.5 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95 sm:bottom-2 sm:rounded-md sm:px-2"
      >
        <button type="button" onClick={() => {
          const currentIndex = screens.findIndex((screen) => location.pathname === `/pantalla/${screen.id}`)
          if (currentIndex > 0) navigate(`/pantalla/${screens[currentIndex - 1].id}`)
          else navigate('/dashboard')
        }} aria-label="Pantalla anterior" className="flex h-7 w-7 shrink-0 items-center justify-center text-red-700 dark:text-red-400">
          <ChevronLeft size={19} />
        </button>

        <div className="flex max-w-[calc(100vw-112px)] items-center gap-0.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-current={location.pathname === '/dashboard' || location.pathname === '/' ? 'page' : undefined}
            title="Inicio"
            className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-semibold ${
              location.pathname === '/dashboard' || location.pathname === '/'
                ? 'text-red-700 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${
              location.pathname === '/dashboard' || location.pathname === '/' ? 'bg-red-700 text-white dark:bg-red-500' : ''
            }`}>
              <House size={14} fill="currentColor" />
            </span>
          </button>

          {screens.map((screen, index) => {
            const active = location.pathname === `/pantalla/${screen.id}`
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => navigate(`/pantalla/${screen.id}`)}
                title={screen.title}
                aria-label={`Abrir pantalla ${screen.title}`}
                aria-current={active ? 'page' : undefined}
                className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-semibold ${
                  active ? 'bg-white text-red-700 shadow-sm dark:bg-slate-700 dark:text-red-300' : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        <button type="button" onClick={() => {
          const currentIndex = screens.findIndex((screen) => location.pathname === `/pantalla/${screen.id}`)
          if (currentIndex >= 0 && currentIndex < screens.length - 1) navigate(`/pantalla/${screens[currentIndex + 1].id}`)
          else if (screens.length > 0) navigate(`/pantalla/${screens[0].id}`)
          else navigate('/pantallas')
        }} aria-label="Pantalla siguiente" className="flex h-7 w-7 shrink-0 items-center justify-center text-red-700 dark:text-red-400">
          <ChevronRight size={19} />
        </button>
      </nav>
    </div>
  )
}
