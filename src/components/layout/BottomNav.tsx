import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, Upload, Library, Compass } from 'lucide-react'
import { useAppSelector } from '../../hooks/useAppSelector'
import { Avatar } from '../ui'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'

const viewerNavItems = [
  { to: routes.dashboard, icon: Home, label: 'Home' },
  { to: routes.library, icon: Compass, label: 'Browse' },
]

const editorNavItems = [
  { to: routes.dashboard, icon: LayoutDashboard, label: 'Home' },
  { to: routes.upload, icon: Upload, label: text.nav.upload },
  { to: routes.library, icon: Library, label: text.nav.library },
]

export function BottomNav() {
  const user = useAppSelector((s) => s.auth.user)
  const navItems = user?.role === 'viewer' ? viewerNavItems : editorNavItems

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white dark:bg-[#111118] border-t border-gray-200 dark:border-[#2a2a3a]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === routes.dashboard}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-150 min-w-[60px]',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-400 dark:text-[#60607a]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={[
                    'p-1.5 rounded-xl transition-all',
                    isActive ? 'bg-indigo-50 dark:bg-indigo-500/10' : '',
                  ].join(' ')}
                >
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to={routes.profile}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[60px] transition-all duration-150',
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 dark:text-[#60607a]',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={[
                  'p-0.5 rounded-full transition-all',
                  isActive ? 'ring-2 ring-indigo-500 ring-offset-1' : '',
                ].join(' ')}
              >
                <Avatar name={user?.name ?? 'U'} size="sm" />
              </div>
              <span className="text-[10px] font-medium">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
