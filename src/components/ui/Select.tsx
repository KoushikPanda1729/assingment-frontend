import { type SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          'w-full bg-gray-50 dark:bg-[#13131c] border rounded-lg',
          'text-gray-900 dark:text-[#f1f1f5] text-sm px-3 py-2.5',
          'transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 dark:border-red-500/60'
            : 'border-gray-200 dark:border-[#2a2a3a] hover:border-gray-300 dark:hover:border-[#3a3a4a]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1a1a24]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}
