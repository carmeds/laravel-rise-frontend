import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export type DonutDatum = {
  name: string
  value: number
}

export type DonutWidgetProps = {
  data: DonutDatum[]
  colors: string[]
  height?: number
  centerValue?: string
  centerLabel?: string
  showLegend?: boolean
}

export default function DonutWidget({
  data,
  colors,
  height = 174,
  centerValue,
  centerLabel,
  showLegend = true,
}: DonutWidgetProps) {
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const displayedValue = centerValue ?? `${total}%`

  return (
    <div className="w-full" style={{ height }}>
      <div className="relative h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy={showLegend ? '43%' : '50%'}
              innerRadius="48%"
              outerRadius="70%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell
                  key={`${item.name}-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${darkMode ? '#334155' : '#dfe3e8'}`,
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                color: darkMode ? '#e2e8f0' : '#334155',
                fontSize: 11,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-slate-700 dark:text-slate-100 ${centerLabel ? 'text-lg' : 'text-xl'}`}>
            {displayedValue}
          </span>
          {centerLabel && (
            <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{centerLabel}</span>
          )}
        </div>

        {showLegend && (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-[9px] text-slate-500 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}