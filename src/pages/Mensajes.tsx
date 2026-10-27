
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Inbox,
  Info,
  LoaderCircle,
  Mail,
  MailOpen,
  RefreshCw,
  X,
} from 'lucide-react'
import {
  getMessages,
  markMessageRead,
  markMessageUnread,
  type Message,
  type MessageType,
} from '../services/messagesApi'

type Filter = 'all' | 'unread' | 'read'

const messageStyles: Record<MessageType, {
  label: string
  className: string
}> = {
  info: {
    label: 'Información',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  success: {
    label: 'Éxito',
    className: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  },
  warning: {
    label: 'Advertencia',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  urgent: {
    label: 'Urgente',
    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
}

function formatDate(value: string | null): string {
  if (!value) return 'Sin fecha'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Sin fecha'
    : new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

function TypeIcon({ type }: { type: MessageType }) {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={17} />
    case 'warning':
      return <AlertTriangle size={17} />
    case 'urgent':
      return <CircleAlert size={17} />
    default:
      return <Info size={17} />
  }
}

export default function Mensajes() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getMessages()
      setMessages(data)

      setSelectedMessage((current) =>
        current
          ? data.find((message) => message.id === current.id) ?? null
          : null,
      )
    } catch {
      setError('No se pudieron cargar los mensajes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  const openMessage = async (message: Message) => {
    setSelectedMessage(message)
    setError(null)

    if (message.is_read || updatingId !== null) return

    setUpdatingId(message.id)

    try {
      await markMessageRead(message.id)

      const readAt = new Date().toISOString()

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, is_read: true, read_at: readAt }
            : item,
        ),
      )

      setSelectedMessage((current) =>
        current?.id === message.id
          ? { ...current, is_read: true, read_at: readAt }
          : current,
      )
    } catch {
      setError('No se pudo registrar la lectura. Inténtalo nuevamente.')
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleRead = async (message: Message) => {
    if (updatingId !== null) return

    setUpdatingId(message.id)
    setError(null)

    try {
      if (message.is_read) {
        await markMessageUnread(message.id)
      } else {
        await markMessageRead(message.id)
      }

      const isRead = !message.is_read
      const readAt = isRead ? new Date().toISOString() : null

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, is_read: isRead, read_at: readAt }
            : item,
        ),
      )

      setSelectedMessage((current) =>
        current?.id === message.id
          ? { ...current, is_read: isRead, read_at: readAt }
          : current,
      )
    } catch {
      setError('No se pudo actualizar el estado del mensaje.')
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    if (!selectedMessage) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && updatingId === null) {
        setSelectedMessage(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedMessage, updatingId])

  const unreadCount = messages.filter((message) => !message.is_read).length

  const filteredMessages = messages.filter((message) => {
    if (filter === 'unread') return !message.is_read
    if (filter === 'read') return message.is_read
    return true
  })

  return (
    <main className="min-h-[calc(100vh-98px)] bg-slate-100 px-3 py-4 pb-20 dark:bg-slate-950 sm:px-5">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Mis mensajes
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Avisos y comunicaciones asignados a tu cuenta.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadMessages()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryCard title="Total" value={messages.length} icon={<Inbox size={19} />} />
          <SummaryCard title="No leídos" value={unreadCount} icon={<Mail size={19} />} />
          <SummaryCard title="Leídos" value={messages.length - unreadCount} icon={<MailOpen size={19} />} />
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
            {([
              ['all', 'Todos'],
              ['unread', 'No leídos'],
              ['read', 'Leídos'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  filter === value
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
              <LoaderCircle size={19} className="animate-spin" />
              Cargando mensajes...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center text-slate-500 dark:text-slate-400">
              <Inbox size={34} />
              <p className="text-sm">
                {filter === 'all'
                  ? 'No tienes mensajes disponibles.'
                  : 'No hay mensajes en esta categoría.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMessages.map((message) => {
                const style = messageStyles[message.type] ?? messageStyles.info

                return (
                  <article
                    key={message.id}
                    className={`p-4 transition sm:p-5 ${
                      !message.is_read ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => void openMessage(message)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          {!message.is_read && (
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                          )}

                          <span className="text-base font-semibold text-slate-900 hover:text-red-700 dark:text-white dark:hover:text-red-400">
                            {message.title}
                          </span>

                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${style.className}`}>
                            <TypeIcon type={message.type} />
                            {style.label}
                          </span>
                        </span>

                        <span className="mt-2 block text-sm text-slate-500 dark:text-slate-400">
                          {message.body.length > 120
                            ? `${message.body.slice(0, 120)}…`
                            : message.body}
                        </span>

                        <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Publicado: {formatDate(message.published_at)}</span>
                          <span>Por: {message.created_by ?? 'Administración'}</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void openMessage(message)}
                        disabled={updatingId !== null}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {updatingId === message.id
                          ? <LoaderCircle size={15} className="animate-spin" />
                          : <MailOpen size={15} />}
                        Ver mensaje
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {selectedMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && updatingId === null) {
              setSelectedMessage(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-700">
              <div className="min-w-0">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${messageStyles[selectedMessage.type]?.className ?? messageStyles.info.className}`}>
                  <TypeIcon type={selectedMessage.type} />
                  {messageStyles[selectedMessage.type]?.label ?? 'Información'}
                </span>

                <h2
                  id="message-modal-title"
                  className="mt-3 text-lg font-bold text-slate-900 dark:text-white"
                >
                  {selectedMessage.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar mensaje"
                disabled={updatingId !== null}
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </header>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-slate-200">
                {selectedMessage.body}
              </p>

              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <p>Publicado: {formatDate(selectedMessage.published_at)}</p>
                <p>Por: {selectedMessage.created_by ?? 'Administración'}</p>
                {selectedMessage.expires_at && (
                  <p>Válido hasta: {formatDate(selectedMessage.expires_at)}</p>
                )}
                {selectedMessage.is_read && selectedMessage.read_at && (
                  <p>Leído: {formatDate(selectedMessage.read_at)}</p>
                )}
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </p>
              )}
            </div>

            <footer className="flex flex-wrap justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
              <button
                type="button"
                disabled={updatingId !== null}
                onClick={() => void toggleRead(selectedMessage)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {updatingId === selectedMessage.id
                  ? <LoaderCircle size={16} className="animate-spin" />
                  : selectedMessage.is_read
                    ? <Mail size={16} />
                    : <MailOpen size={16} />}
                {selectedMessage.is_read ? 'Marcar no leído' : 'Marcar leído'}
              </button>

              <button
                type="button"
                disabled={updatingId !== null}
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
              >
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
      <span className="text-slate-400">{icon}</span>
    </div>
  )
}
