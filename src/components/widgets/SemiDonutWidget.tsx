import { useId } from 'react'

export type SemiDonutWidgetProps = {
  percentage: number
  centerValue: string
  centerLabel: string
  leftValue: string
  leftLabel: string
  rightValue: string
  rightLabel: string
  height?: number
  color?: string
  remainingColor?: string
  showPercentages?: boolean
  percentageDecimals?: number
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDegrees: number,
) {
  const angle = (angleDegrees * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

function arcPath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle)
  const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle)
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle)
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle)
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ')
}

export default function SemiDonutWidget({
  percentage,
  centerValue,
  centerLabel,
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
  height = 220,
  color = '#a91f23',
  remainingColor = '#c9c9c9',
  showPercentages = true,
  percentageDecimals = 1,
}: SemiDonutWidgetProps) {
  const clipId = useId().replace(/:/g, '')
  const value = Number.isFinite(percentage)
    ? Math.min(100, Math.max(0, percentage))
    : 0
  const remainder = 100 - value

  // A custom SVG keeps the semicircle large and correctly positioned.
  // The center is deliberately near the bottom so the upper half fills the card.
  const cx = 160
  const cy = 151
  const outerRadius = 132
  const innerRadius = 88
  const startAngle = 180
  const advanceEndAngle = 180 - (value / 100) * 180
  const showAdvanceLabel = value >= 4.5
  const showRemainderLabel = remainder >= 4.5

  const advanceLabelPoint = polarToCartesian(
    cx,
    cy,
    (outerRadius + innerRadius) / 2,
    (startAngle + advanceEndAngle) / 2,
  )
  const remainderLabelPoint = polarToCartesian(
    cx,
    cy,
    (outerRadius + innerRadius) / 2,
    (advanceEndAngle + 0) / 2,
  )

  return (
    <div className="w-full min-w-0">
      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox="0 0 320 166"
          role="img"
          aria-label={`${centerLabel}: ${centerValue}; avance ${value.toFixed(percentageDecimals)} por ciento`}
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width="320" height="166" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {/* Track / remaining segment */}
            <path
              d={arcPath(cx, cy, outerRadius, innerRadius, 180, 0)}
              fill={remainingColor}
            />
            {/* Progress segment */}
            {value > 0 && (
              <path
                d={arcPath(cx, cy, outerRadius, innerRadius, 180, advanceEndAngle)}
                fill={color}
              />
            )}

            {showPercentages && showAdvanceLabel && (
              <text
                x={advanceLabelPoint.x}
                y={advanceLabelPoint.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="600"
                fill="#ffffff"
              >
                {value.toFixed(percentageDecimals)}%
              </text>
            )}
            {showPercentages && showRemainderLabel && (
              <text
                x={remainderLabelPoint.x}
                y={remainderLabelPoint.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="600"
                fill="#ffffff"
              >
                {remainder.toFixed(percentageDecimals)}%
              </text>
            )}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[65%] flex -translate-y-1/2 flex-col items-center px-2 text-center">
          <span className="max-w-full break-words text-[15px] font-medium italic leading-tight text-slate-900 dark:text-slate-100 sm:text-base">
            {centerValue}
          </span>
          <span className="max-w-full break-words text-[13px] italic leading-tight text-slate-900 dark:text-slate-100">
            {centerLabel}
          </span>
        </div>
      </div>

      <div className="-mt-1 flex items-start justify-between gap-3 px-[15%] pb-2">
        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-[12px] font-medium leading-tight text-slate-700 dark:text-slate-200">
            {leftValue}
          </div>
          <div className="break-words text-[12px] leading-tight text-slate-500 dark:text-slate-400">
            {leftLabel}
          </div>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-[12px] font-medium leading-tight text-slate-700 dark:text-slate-200">
            {rightValue}
          </div>
          <div className="break-words text-[12px] leading-tight text-slate-500 dark:text-slate-400">
            {rightLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
