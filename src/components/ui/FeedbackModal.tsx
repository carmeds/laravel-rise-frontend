import { Check, CircleAlert, Info, X } from 'lucide-react'

type FeedbackModalProps = {
  open: boolean
  message: string
  title?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  closeLabel?: string
}

const variantStyles = {
  success: {
    icon: 'border-emerald-500 text-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
    title: '¡Correcto!',
  },
  error: {
    icon: 'border-red-500 text-red-500',
    button: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    title: 'Ocurrió un error',
  },
  warning: {
    icon: 'border-amber-500 text-amber-500',
    button: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500',
    title: 'Revisa la información',
  },
  info: {
    icon: 'border-blue-500 text-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    title: 'Información',
  },
} as const

export default function FeedbackModal({
  open,
  message,
  title,
  variant = 'info',
  onClose,
  closeLabel = 'Aceptar',
}: FeedbackModalProps) {
  if (!open) return null

  const styles = variantStyles[variant]
  const Icon = variant === 'success' ? Check : variant === 'info' ? Info : CircleAlert

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
        className="relative w-full max-w-sm rounded-xl bg-white px-6 py-7 text-center shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10"
      >
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X size={17} />
        </button>

        <div className={`mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-[3px] ${styles.icon}`}>
          <Icon size={variant === 'success' ? 34 : 30} strokeWidth={variant === 'success' ? 2.5 : 1.8} />
        </div>

        <h2 id="feedback-modal-title" className="mt-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title ?? styles.title}
        </h2>
        <p id="feedback-modal-description" className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
          {message}
        </p>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className={`min-w-24 rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${styles.button}`}
          >
            {closeLabel}
          </button>
        </div>
      </section>
    </div>
  )
}