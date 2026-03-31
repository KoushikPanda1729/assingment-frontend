import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, Library, Users, LogOut } from 'lucide-react'
import { Logo } from '../ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector as useSelector } from '../../hooks/useAppSelector'
import { logout } from '../../store/slices/authSlice'
import { Avatar } from '../ui'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'

const navItems = [
  { to: routes.dashboard, icon: LayoutDashboard, label: text.nav.dashboard },
  { to: routes.upload, icon: Upload, label: text.nav.upload },
  { to: routes.library, icon: Library, label: text.nav.library },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] bg-white dark:bg-[#111118] border-r border-gray-200 dark:border-[#2a2a3a] flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 dark:border-[#2a2a3a]">
        <Logo size={32} />
        <span className="text-base font-bold text-gray-900 dark:text-[#f1f1f5]">VidSense</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === routes.dashboard}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'text-gray-500 dark:text-[#a0a0b0] hover:text-gray-900 dark:hover:text-[#f1f1f5] hover:bg-gray-100 dark:hover:bg-white/5',
              ].join(' ')
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to={routes.users}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'text-gray-500 dark:text-[#a0a0b0] hover:text-gray-900 dark:hover:text-[#f1f1f5] hover:bg-gray-100 dark:hover:bg-white/5',
              ].join(' ')
            }
          >
            <Users size={17} />
            {text.nav.users}
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-gray-100 dark:border-[#2a2a3a] pt-3">
        <button
          onClick={() => navigate(routes.profile)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
        >
          <Avatar name={user?.name ?? 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-[#f1f1f5] truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-[#60607a] truncate capitalize">
              {user?.role}
            </p>
          </div>
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-[#a0a0b0] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-150 mt-1"
        >
          <LogOut size={17} />
          {text.nav.logout}
        </button>
      </div>
    </aside>
  )
}
