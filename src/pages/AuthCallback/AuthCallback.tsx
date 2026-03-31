import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { setGoogleUser } from '../../store/slices/authSlice'
import { routes } from '../../constants/routes'
import { Spinner } from '../../components/ui'
import type { UserRole } from '../../types'

export function AuthCallback() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const name = params.get('name')
    const email = params.get('email')
    const role = params.get('role') as UserRole | null
    const error = params.get('error')

    if (error || !id || !name || !email || !role) {
      navigate(routes.login + '?error=google_failed', { replace: true })
      return
    }

    // Cookie is already set by backend — just store user info in Redux
    dispatch(setGoogleUser({ id, name, email, role, createdAt: new Date().toISOString() }))
    navigate(routes.dashboard, { replace: true })
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-[#0e0e17]">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-[#a0a0b0]">Signing you in with Google…</p>
    </div>
  )
}
