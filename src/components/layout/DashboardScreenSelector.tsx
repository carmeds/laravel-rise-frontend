
import {
  ChevronLeft,
  ChevronRight,
  House,
} from 'lucide-react'

export interface DashboardScreen {
  id: string
  label: string
}

interface DashboardScreenSelectorProps {
  screens: DashboardScreen[]
  activeScreen: string
  onSelect: (screenId: string) => void
}

export default function DashboardScreenSelector({
  screens,
  activeScreen,
  onSelect,
}: DashboardScreenSelectorProps) {
  const activeIndex = screens.findIndex(
    (screen) => screen.id === activeScreen,
  )

  const selectRelative = (direction: number) => {
    if (activeIndex < 0) return

    const nextIndex = activeIndex + direction

    if (nextIndex >= 0 && nextIndex < screens.length) {
      onSelect(screens[nextIndex].id)
    }
  }

  return (
    <nav
      aria-label="Navegación entre pantallas"
      className="fixed bottom-0 left-1/2 z-40 flex max-w-[calc(100vw-16px)] -translate-x-1/2 items-center gap-1 rounded-t-md border border-slate-200 bg-slate-200/95 px-1.5 py-1.5 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95 sm:bottom-2 sm:rounded-md sm:px-2"
    >
      <button
        type="button"
        onClick={() => selectRelative(-1)}
        disabled={activeIndex <= 0}
        aria-label="Pantalla anterior"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-red-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-slate-700"
      >
        <ChevronLeft size={19} />
      </button>

      <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
        {screens.map((screen, index) => {
          const isActive = screen.id === activeScreen
          const isHome = index === 0

          return (
            <button
              key={screen.id}
              type="button"
              onClick={() => onSelect(screen.id)}
              aria-label={`Ir a pantalla ${screen.label}`}
              aria-current={isActive ? 'page' : undefined}
              title={screen.label}
              className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded px-1.5 text-xs font-semibold transition ${
                isActive
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              {isHome ? (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-red-700 text-white dark:bg-red-500'
                      : ''
                  }`}
                >
                  <House size={14} fill={isActive ? 'currentColor' : 'none'} />
                </span>
              ) : (
                index
              )}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => selectRelative(1)}
        disabled={activeIndex < 0 || activeIndex >= screens.length - 1}
        aria-label="Pantalla siguiente"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-red-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-slate-700"
      >
        <ChevronRight size={19} />
      </button>
    </nav>
  )
}
