import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { routes } from '../constants/routes'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAppSelector((s) => s.auth)

  // user is set from localStorage on load, then verified via /auth/me in App.tsx
  if (!user) return <Navigate to={routes.login} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={routes.dashboard} replace />

  return <>{children}</>
}
