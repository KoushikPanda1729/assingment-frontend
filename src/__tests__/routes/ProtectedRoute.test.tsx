import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ProtectedRoute } from '../../routes/ProtectedRoute'
import authReducer from '../../store/slices/authSlice'
import type { User, AuthState } from '../../types'

const mockUser: User = {
  id: 'u1',
  name: 'Test',
  email: 'test@test.com',
  role: 'editor',
  createdAt: '',
}
const adminUser: User = {
  id: 'u2',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
  createdAt: '',
}

function renderWithUser(user: User | null, requiredRole?: string[]) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, token: null, loading: false, error: null } as AuthState },
  })
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute roles={requiredRole as never}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('ProtectedRoute', () => {
  it('renders content when user is authenticated', () => {
    renderWithUser(mockUser)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is null', () => {
    renderWithUser(null)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders content when user has required role', () => {
    renderWithUser(adminUser, ['admin'])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects when user does not have required role', () => {
    renderWithUser(mockUser, ['admin'])
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('allows access when no role restriction', () => {
    renderWithUser(mockUser)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
