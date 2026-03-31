import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Upload, Library, Users, LogOut, X, Sun, Moon } from 'lucide-react'
import { Logo } from '../ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import { Avatar, Badge } from '../ui'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: routes.dashboard, icon: LayoutDashboard, label: text.nav.dashboard },
  { to: routes.upload, icon: Upload, label: text.nav.upload },
  { to: routes.library, icon: Library, label: text.nav.library },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const mode = useAppSelector((s) => s.theme.mode)

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Drawer */}
      <div
        className={[
          'fixed top-0 left-0 h-full w-72 z-50 lg:hidden flex flex-col',
          'bg-white dark:bg-[#111118] border-r border-gray-200 dark:border-[#2a2a3a]',
          'transition-transform duration-300 ease-out shadow-2xl',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-[#2a2a3a]">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="text-base font-bold text-gray-900 dark:text-[#f1f1f5]">VidSense</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-[#60607a] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* User card */}
        <div className="mx-3 mt-4 mb-2 p-3 bg-gray-50 dark:bg-[#1a1a24] border border-gray-100 dark:border-[#2a2a3a] rounded-xl flex items-center gap-3">
          <Avatar name={user?.name ?? 'User'} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-[#60607a] truncate">{user?.email}</p>
          </div>
          {user?.role && <Badge variant={user.role} />}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-[#3a3a4a] px-3 mt-2 mb-1">
            Navigation
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === routes.dashboard}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
                    : 'text-gray-600 dark:text-[#a0a0b0] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-[#f1f1f5]',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-[#3a3a4a] px-3 mt-4 mb-1">
                Admin
              </p>
              <NavLink
                to={routes.users}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
                      : 'text-gray-600 dark:text-[#a0a0b0] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-[#f1f1f5]',
                  ].join(' ')
                }
              >
                <Users size={18} />
                {text.nav.users}
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6 border-t border-gray-100 dark:border-[#2a2a3a] pt-3 flex flex-col gap-1">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-[#a0a0b0] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {mode === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={() => {
              dispatch(logout())
              onClose()
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            {text.nav.logout}
          </button>
        </div>
      </div>
    </>
  )
}
