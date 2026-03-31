import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { ProtectedRoute } from './ProtectedRoute'
import { Login } from '../pages/Login/Login'
import { Register } from '../pages/Register/Register'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Upload } from '../pages/Upload/Upload'
import { Library } from '../pages/Library/Library'
import { VideoPlayer } from '../pages/VideoPlayer/VideoPlayer'
import { Users } from '../pages/Users/Users'
import { Profile } from '../pages/Profile/Profile'
import { AuthCallback } from '../pages/AuthCallback/AuthCallback'
import { routes } from '../constants/routes'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((s) => s.auth)
  return token ? <Navigate to={routes.dashboard} replace /> : <>{children}</>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.login}
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path={routes.register}
          element={
            <AuthGuard>
              <Register />
            </AuthGuard>
          }
        />

        <Route
          path={routes.dashboard}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.upload}
          element={
            <ProtectedRoute roles={['editor', 'admin']}>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.library}
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.videoPlayer}
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.users}
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.profile}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path={routes.authCallback} element={<AuthCallback />} />
        <Route path="*" element={<Navigate to={routes.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
