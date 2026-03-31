interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

const trackColors: Record<string, string> = {
  primary: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  variant = 'primary',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className="w-full">
      {(label ?? showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-gray-500 dark:text-[#a0a0b0]">{label}</span>}
          {showPercent && (
            <span className="text-xs font-medium text-gray-700 dark:text-[#f1f1f5]">{pct}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-100 dark:bg-[#2a2a3a] rounded-full overflow-hidden ${size === 'sm' ? 'h-1' : 'h-2'}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${trackColors[variant]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
