import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Login } from '../../pages/Login/Login'
import authReducer from '../../store/slices/authSlice'
import themeReducer from '../../store/slices/themeSlice'

const mocks = vi.hoisted(() => ({ login: vi.fn() }))

vi.mock('../../services/authService', () => ({
  authService: {
    login: mocks.login,
    register: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    refresh: vi.fn(),
  },
}))

function renderLogin() {
  const store = configureStore({ reducer: { auth: authReducer, theme: themeReducer } })
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  )
}

describe('Login page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders email field and sign in button', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows required errors on empty submit', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0))
  })

  it('shows invalid email error', async () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@test' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/valid email/i)).toBeInTheDocument())
  })

  it('calls login service on valid submit', async () => {
    mocks.login.mockResolvedValue({
      id: 'u1',
      name: 'T',
      email: 'test@example.com',
      role: 'viewer',
      createdAt: '',
    })
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    )
  })

  it('toggles password visibility', () => {
    renderLogin()
    const passwordInput = screen.getByPlaceholderText('••••••••')
    expect(passwordInput).toHaveAttribute('type', 'password')
    const toggleBtn = passwordInput.closest('div')?.querySelector('button[tabindex="-1"]')
    if (toggleBtn) fireEvent.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('shows sign up link', () => {
    renderLogin()
    expect(screen.getByText(/sign up/i)).toBeInTheDocument()
  })

  it('shows Continue with Google button', () => {
    renderLogin()
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument()
  })
})
