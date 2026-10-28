import type { ReactNode } from 'react'
import { Expand } from 'lucide-react'

export type WidgetCardProps = {
  title: string
  period: string
  source?: string
  updated: string
  children: ReactNode
  onExpand?: () => void
  statusLabel?: string
}

export default function WidgetCard({
  title,
  period,
  source = 'SIE-PJ',
  updated,
  children,
  onExpand,
  statusLabel = 'DEMO',
}: WidgetCardProps) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex min-h-[43px] items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3">
        <div className="min-w-0">
          <h2 className="truncate text-[12px] font-semibold text-slate-700 dark:text-slate-100">
            {title}
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Periodo: {period}</p>
        </div>

        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            title="Ampliar indicador"
            aria-label={`Ampliar ${title}`}
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          >
            <Expand size={14} />
          </button>
        )}
      </header>

      <div className="min-w-0 px-2 pt-1">{children}</div>

      <footer className="mt-auto flex min-h-[43px] items-center justify-between gap-2 border-t border-slate-100 px-3 dark:border-slate-800 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/images/avatar-g.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Fuente: {source}</p>
            <p className="text-[9px] text-slate-400">Actualizado: {updated}</p>
          </div>
        </div>

        {statusLabel && (
          <span className="shrink-0 rounded bg-red-50 px-1.5 py-1 text-[9px] font-medium text-[#a91f23] dark:bg-red-950/50 dark:text-red-300">
            {statusLabel}
          </span>
        )}
      </footer>
    </article>
  )
}
