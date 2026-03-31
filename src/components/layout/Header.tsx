import { Sun, Moon, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../ui'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { toggleTheme } from '../../store/slices/themeSlice'
import { Avatar, Badge } from '../ui'
import { routes } from '../../constants/routes'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const user = useAppSelector((s) => s.auth.user)
  const mode = useAppSelector((s) => s.theme.mode)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <>
      {/* ── Mobile header ── */}
      <header className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-[#111118]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#2a2a3a]">
        {/* Top row */}
        <div className="flex items-center justify-between px-4 h-14">
          {/* Hamburger + Logo */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onMenuClick}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-[#a0a0b0] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors -ml-1"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <Logo size={30} />
              <span className="text-sm font-bold text-gray-900 dark:text-[#f1f1f5] tracking-tight">
                VidSense
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            <div className="ml-1">
              <Avatar name={user?.name ?? 'User'} size="sm" />
            </div>
          </div>
        </div>

        {/* Page title row */}
        <div className="px-4 pb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f5] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-[#60607a] mt-0.5">{subtitle}</p>
          )}
        </div>
      </header>

      {/* ── Desktop header ── */}
      <header className="hidden lg:flex h-16 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-sm border-b border-gray-200 dark:border-[#2a2a3a] items-center justify-between px-6 sticky top-0 z-20">
        <div>
          <h1 className="text-base font-semibold text-gray-800 dark:text-[#f1f1f5]">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 dark:text-[#60607a]">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-gray-700 dark:hover:text-[#f1f1f5] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {mode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => navigate(routes.profile)}
            className="flex items-center gap-2.5 ml-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Avatar name={user?.name ?? 'User'} size="sm" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-[#f1f1f5] leading-tight">
                {user?.name}
              </p>
              {user?.role && <Badge variant={user.role} />}
            </div>
          </button>
        </div>
      </header>
    </>
  )
}
