import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type LineDatum = {
  name: string
  [key: string]: string | number
}

export type LineSeries = {
  dataKey: string
  label: string
  color: string
  dashed?: boolean
}

export type LineWidgetProps = {
  data: LineDatum[]
  series: LineSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export default function LineWidget({
  data,
  series,
  height = 174,
  showGrid = true,
  showLegend = true,
}: LineWidgetProps) {
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const axisColor = darkMode ? '#94a3b8' : '#8b95a4'
  const gridColor = darkMode ? '#334155' : '#edf0f3'
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, left: -25, bottom: showLegend ? 18 : 0 }}>
          {showGrid && (
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${darkMode ? '#334155' : '#dfe3e8'}`,
              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
              color: darkMode ? '#e2e8f0' : '#334155',
              fontSize: 11,
            }}
          />
          {series.map((item) => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.label}
              stroke={item.color}
              strokeWidth={item.dashed ? 1.5 : 2}
              strokeDasharray={item.dashed ? '4 4' : undefined}
              dot={false}
              activeDot={{ r: 3 }}
            />
          ))}
          {showLegend && (
            <></>
          )}
        </LineChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="-mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {series.map((item) => (
            <div key={item.dataKey} className="flex items-center gap-1">
              <span
                className="h-0.5 w-3"
                style={{
                  backgroundColor: item.color,
                  borderTop: item.dashed ? `1px dashed ${item.color}` : undefined,
                }}
              />
              <span className="text-[9px] text-slate-500 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}