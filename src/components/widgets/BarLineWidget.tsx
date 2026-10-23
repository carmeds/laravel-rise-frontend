import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type BarLineDatum = {
  name: string
  bars: number
  trend: number
}

export type BarLineWidgetProps = {
  data: BarLineDatum[]
  currentSummary: string
  previousSummary: string
  barLabel?: string
  lineLabel?: string
  barColor?: string
  lineColor?: string
  height?: number
  barSize?: number
}

export default function BarLineWidget({
  data,
  currentSummary,
  previousSummary,
  barLabel = 'Resueltos',
  lineLabel = 'Tendencia',
  barColor = '#a91f23',
  lineColor = '#657180',
  height = 202,
  barSize = 21,
}: BarLineWidgetProps) {
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const axisColor = darkMode ? '#94a3b8' : '#737373'
  const gridColor = darkMode ? '#334155' : '#edf0f3'
  return (
    <div className="relative w-full min-w-0 pt-4" style={{ height }}>
      <div className="absolute left-0 right-0 top-1 z-10 flex justify-center gap-2 text-[8px] text-slate-500 dark:text-slate-400">
        <span>{currentSummary}</span>
        <span>{previousSummary}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 6, right: 6, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#dfe3e8'}`, borderRadius: 8, color: darkMode ? '#e2e8f0' : '#334155', fontSize: 11 }} />
          <Bar
            dataKey="bars"
            name={barLabel}
            fill={barColor}
            barSize={barSize}
          />
          <Line
            type="monotone"
            dataKey="trend"
            name={lineLabel}
            stroke={lineColor}
            strokeWidth={1}
            dot={{ r: 1.5, fill: darkMode ? '#0f172a' : '#ffffff', strokeWidth: 1 }}
            activeDot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
