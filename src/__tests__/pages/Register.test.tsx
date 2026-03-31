import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Register } from '../../pages/Register/Register'
import authReducer from '../../store/slices/authSlice'
import themeReducer from '../../store/slices/themeSlice'

const mocks = vi.hoisted(() => ({ register: vi.fn() }))

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: mocks.register,
    me: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    refresh: vi.fn(),
  },
}))

function renderRegister() {
  const store = configureStore({ reducer: { auth: authReducer, theme: themeReducer } })
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>
  )
}

describe('Register page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all form fields', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows required errors on empty submit', async () => {
    renderRegister()
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0))
  })

  it('shows password too short error', async () => {
    renderRegister()
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0]!, { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText(/8 characters/i)).toBeInTheDocument())
  })

  it('shows password mismatch error', async () => {
    renderRegister()
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    const pw = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(pw[0]!, { target: { value: 'password123' } })
    fireEvent.change(pw[1]!, { target: { value: 'different456' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText(/do not match/i)).toBeInTheDocument())
  })

  it('calls register service on valid submit', async () => {
    mocks.register.mockResolvedValue({
      id: 'u1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'viewer',
      createdAt: '',
    })
    renderRegister()
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    const pw = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(pw[0]!, { target: { value: 'password123' } })
    fireEvent.change(pw[1]!, { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() =>
      expect(mocks.register).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'password123' })
      )
    )
  })

  it('shows role selector', () => {
    renderRegister()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows sign in link', () => {
    renderRegister()
    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })
})
