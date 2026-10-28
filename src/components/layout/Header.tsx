
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  RefreshCw,
  KeyRound,
  LogOut,
  MailOpen,
  Menu,
  Monitor,
  Sun,
  Moon,
  UserRound,
  Plus,
  X,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useScreens } from '../../contexts/ScreensContext'
import { useAuth } from '../../contexts/AuthContext'
import { getMessages, type Message } from '../../services/messagesApi'

type HeaderProps = {
  onToggleSidebar: () => void
  darkMode: boolean
  onToggleTheme: () => void
}

export default function Header({
  onToggleSidebar,
  darkMode,
  onToggleTheme,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [screensMenuOpen, setScreensMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)
  const screensMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const { screens } = useScreens()
  const navigate = useNavigate()
  const location = useLocation()

  const loadUnreadMessages = useCallback(async () => {
    try {
      const messages = await getMessages()
      setUnreadMessages(messages.filter((message) => !message.is_read))
    } catch (error) {
      console.error('No se pudieron cargar las notificaciones:', error)
    }
  }, [])

  // Cargar mensajes pendientes y actualizar cada minuto.
  useEffect(() => {
    void loadUnreadMessages()

    const intervalId = window.setInterval(() => {
      void loadUnreadMessages()
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [loadUnreadMessages])

  // Cerrar los menús al hacer clic fuera o pulsar Escape.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false)
      }

      if (
        screensMenuRef.current &&
        !screensMenuRef.current.contains(target)
      ) {
        setScreensMenuOpen(false)
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
        setScreensMenuOpen(false)
        setNotificationOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Al volver desde Mensajes, actualizar el contador.
  useEffect(() => {
    void loadUnreadMessages()
  }, [location.pathname, loadUnreadMessages])

  return (
    <header className="sticky top-0 z-50 flex h-[58px] items-center justify-between border-b border-slate-100 bg-white px-3 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menú lateral"
          onClick={onToggleSidebar}
          className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          aria-label="Ir al inicio"
          title="Ir al inicio"
          onClick={() => navigate('/dashboard')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-slate-800"
        >
          <img src="/images/logo.png" alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
        </button>

        <h1 className="truncate text-sm font-bold tracking-wide text-slate-700 dark:text-slate-100 sm:text-base">
          Centro de Comando y Monitoreo Jurisdiccional
        </h1>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Desplegable de pantallas */}
        <div className="relative" ref={screensMenuRef}>
          <button
            type="button"
            title="Pantallas disponibles"
            aria-label="Pantallas disponibles"
            aria-haspopup="menu"
            aria-expanded={screensMenuOpen}
            onClick={() => setScreensMenuOpen((open) => !open)}
            className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Monitor size={18} />
          </button>

          {screensMenuOpen && (
            <div
              role="menu"
              aria-label="Pantallas disponibles"
              className="absolute right-0 top-[calc(100%+12px)] z-[70] w-72 max-w-[calc(100vw-24px)] overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-slate-600 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {screens.length > 0 ? (
                <div className="max-h-[60vh] overflow-y-auto">
                  {screens.map((screen) => {
                    const active =
                      location.pathname === `/pantalla/${screen.id}`

                    return (
                      <button
                        key={screen.id}
                        type="button"
                        role="menuitem"
                        title={screen.title}
                        onClick={() => {
                          navigate(`/pantalla/${screen.id}`)
                          setScreensMenuOpen(false)
                        }}
                        className={`flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          active
                            ? 'text-blue-600 dark:text-blue-400'
                            : ''
                        }`}
                      >
                        <Monitor size={16} className="shrink-0" />
                        <span className="min-w-0 flex-1 truncate">
                          {screen.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                  No hay pantallas creadas.
                </p>
              )}

              <div className="border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate('/pantallas')
                    setScreensMenuOpen(false)
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Añadir un nuevo Panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actualizar vista */}
        <button
          type="button"
          title="Actualizar vista"
          aria-label="Actualizar vista"
          onClick={() => window.location.reload()}
          className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw size={18} />
        </button>

        {/* Notificaciones de mensajes pendientes */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            title={
              unreadMessages.length > 0
                ? `${unreadMessages.length} mensajes sin leer`
                : 'No tienes mensajes pendientes'
            }
            aria-label="Notificaciones de mensajes"
            aria-haspopup="dialog"
            aria-expanded={notificationOpen}
            onClick={async () => {
              const opening = !notificationOpen
              setNotificationOpen(opening)

              if (opening) {
                setNotificationsLoading(true)
                try {
                  await loadUnreadMessages()
                } finally {
                  setNotificationsLoading(false)
                }
              }
            }}
            className="relative rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={18} />

            {unreadMessages.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadMessages.length > 99 ? '99+' : unreadMessages.length}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div
              role="dialog"
              aria-label="Mensajes pendientes de leer"
              className="absolute right-0 top-[calc(100%+12px)] z-[80] w-80 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:w-96"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <div>
                  <h2 className="text-sm font-semibold">Notificaciones</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unreadMessages.length === 0
                      ? 'No tienes mensajes pendientes'
                      : `${unreadMessages.length} mensajes sin leer`}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Cerrar notificaciones"
                  onClick={() => setNotificationOpen(false)}
                  className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={17} />
                </button>
              </div>

              {notificationsLoading ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  Cargando notificaciones...
                </p>
              ) : unreadMessages.length === 0 ? (
                <div className="flex flex-col items-center gap-2 p-7 text-center">
                  <MailOpen size={28} className="text-slate-400" />
                  <p className="text-sm">¡Todo al día!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Has leído todos tus mensajes.
                  </p>
                </div>
              ) : (
                <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                  {unreadMessages.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => {
                        setNotificationOpen(false)
                        navigate('/mensajes')
                      }}
                      className="flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {message.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                          {message.body.length > 85
                            ? `${message.body.slice(0, 85)}…`
                            : message.body}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationOpen(false)
                    navigate('/mensajes')
                  }}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-red-700 hover:bg-slate-50 dark:text-red-400 dark:hover:bg-slate-800"
                >
                  Ver todos los mensajes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tema claro/oscuro */}
        <button
          type="button"
          title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          onClick={onToggleTheme}
          className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Menú de usuario */}
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
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                  {user?.name ?? 'Usuario'}
                </span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {user?.email ?? ''}
                </span>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <UserRound size={16} />
                Mi Perfil
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2.5 border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <KeyRound size={16} />
                Cambiar Contraseña
              </button>

              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true)
                  setUserMenuOpen(false)

                  try {
                    await logout()
                  } catch (error) {
                    console.error('Error al cerrar sesión:', error)
                  } finally {
                    navigate('/login', { replace: true })
                  }
                }}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <LogOut size={16} />
                {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
