import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type StackedBarDatum = {
  name: string
  [key: string]: string | number
}

export type StackedBarSeries = {
  dataKey: string
  label: string
  color: string
}

export type StackedBarWidgetProps = {
  data: StackedBarDatum[]
  series: StackedBarSeries[]
  height?: number
  stacked?: boolean
  showGrid?: boolean
  showLegend?: boolean
  yAxisHidden?: boolean
}

export default function StackedBarWidget({
  data,
  series,
  height = 174,
  stacked = true,
  showGrid = true,
  showLegend = false,
  yAxisHidden = false,
}: StackedBarWidgetProps) {
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const axisColor = darkMode ? '#94a3b8' : '#8b95a4'
  const gridColor = darkMode ? '#334155' : '#edf0f3'
  return (
    <div className="w-full">
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 12, right: 4, left: -25, bottom: 0 }}
      >
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
          hide={yAxisHidden}
          tick={{ fontSize: 9, fill: axisColor }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#dfe3e8'}`, borderRadius: 8, color: darkMode ? '#e2e8f0' : '#334155', fontSize: 11 }} />
        {series.map((item) => (
          <Bar
            key={item.dataKey}
            dataKey={item.dataKey}
            name={item.label}
            fill={item.color}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
    {showLegend && (
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {series.map((item) => (
          <div key={item.dataKey} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    )}
    </div>
  )
}
