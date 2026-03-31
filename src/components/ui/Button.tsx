import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 border border-indigo-500/20',
  secondary:
    'bg-violet-500 hover:bg-violet-600 text-white shadow-sm shadow-violet-500/20 border border-violet-500/20',
  ghost:
    'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-[#a0a0b0] hover:text-gray-800 dark:hover:text-[#f1f1f5] border border-transparent',
  danger:
    'bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20',
  outline:
    'bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-[#f1f1f5] border border-gray-200 dark:border-[#2a2a3a] hover:border-indigo-400 dark:hover:border-indigo-500/50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
