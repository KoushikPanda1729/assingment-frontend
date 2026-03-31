import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#60607a]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full bg-gray-50 dark:bg-[#13131c] border rounded-lg',
              'text-gray-900 dark:text-[#f1f1f5] placeholder-gray-400 dark:placeholder-[#60607a]',
              'text-sm px-3 py-2.5 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 dark:border-red-500/60'
                : 'border-gray-200 dark:border-[#2a2a3a] hover:border-gray-300 dark:hover:border-[#3a3a4a]',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#60607a]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400 dark:text-[#60607a]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
