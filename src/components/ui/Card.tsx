import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-xl shadow-sm dark:shadow-none',
        hover
          ? 'hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md dark:hover:bg-[#1e1e2e] transition-all duration-200 cursor-pointer'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3a]">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 dark:text-[#60607a] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
