import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import type { User } from '../../types'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  me: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock('../../services/authService', () => ({
  authService: { ...mocks, changePassword: vi.fn(), refresh: vi.fn() },
}))

import authReducer, {
  clearError,
  setGoogleUser,
  login,
  register,
  fetchMe,
  logoutThunk,
  updateProfile,
} from '../../store/slices/authSlice'

const mockUser: User = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'viewer',
  createdAt: '2024-01-01',
}

function makeStore(preloaded?: object) {
  return configureStore({
    reducer: { auth: authReducer },
    ...(preloaded ? { preloadedState: preloaded } : {}),
  })
}

describe('authSlice reducers', () => {
  it('clearError resets error', () => {
    const store = makeStore()
    store.dispatch(clearError())
    expect(store.getState().auth.error).toBeNull()
  })

  it('setGoogleUser sets user', () => {
    const store = makeStore()
    store.dispatch(setGoogleUser(mockUser))
    expect(store.getState().auth.user).toEqual(mockUser)
  })

  it('initial state has no loading and no error', () => {
    const store = makeStore()
    expect(store.getState().auth.loading).toBe(false)
    expect(store.getState().auth.error).toBeNull()
  })
})

describe('authSlice thunks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login fulfilled sets user', async () => {
    mocks.login.mockResolvedValue(mockUser)
    const store = makeStore()
    await store.dispatch(login({ email: 'test@example.com', password: 'pass' }))
    expect(store.getState().auth.user).toEqual(mockUser)
  })

  it('login rejected sets error', async () => {
    mocks.login.mockRejectedValue(new Error('Invalid credentials'))
    const store = makeStore()
    await store.dispatch(login({ email: 'bad@example.com', password: 'wrong' }))
    expect(store.getState().auth.error).toBeTruthy()
  })

  it('login pending sets loading true', () => {
    mocks.login.mockImplementation(() => new Promise(() => {}))
    const store = makeStore()
    store.dispatch(login({ email: 'test@example.com', password: 'pass' }))
    expect(store.getState().auth.loading).toBe(true)
  })

  it('register fulfilled sets user', async () => {
    mocks.register.mockResolvedValue(mockUser)
    const store = makeStore()
    await store.dispatch(
      register({ name: 'T', email: 'test@example.com', password: 'pass', role: 'viewer' })
    )
    expect(store.getState().auth.user).toEqual(mockUser)
  })

  it('register rejected sets error', async () => {
    mocks.register.mockRejectedValue(new Error('Email taken'))
    const store = makeStore()
    await store.dispatch(
      register({ name: 'T', email: 'taken@example.com', password: 'pass', role: 'viewer' })
    )
    expect(store.getState().auth.error).toBeTruthy()
  })

  it('fetchMe fulfilled updates existing user role', async () => {
    const initialUser = { ...mockUser, role: 'viewer' as const }
    const updatedUser = { ...mockUser, role: 'editor' as const }
    mocks.me.mockResolvedValue(updatedUser)
    const store = makeStore({
      auth: { user: initialUser, token: null, loading: false, error: null },
    })
    await store.dispatch(fetchMe())
    expect(store.getState().auth.user?.role).toBe('editor')
  })

  it('fetchMe rejected clears user', async () => {
    mocks.me.mockRejectedValue(new Error('Unauthorized'))
    const store = makeStore({ auth: { user: mockUser, loading: false, error: null } })
    await store.dispatch(fetchMe())
    expect(store.getState().auth.user).toBeNull()
  })

  it('logoutThunk clears user', async () => {
    mocks.logout.mockResolvedValue(undefined)
    const store = makeStore({ auth: { user: mockUser, loading: false, error: null } })
    await store.dispatch(logoutThunk())
    expect(store.getState().auth.user).toBeNull()
  })

  it('updateProfile updates user name', async () => {
    mocks.updateProfile.mockResolvedValue({ ...mockUser, name: 'New Name' })
    const store = makeStore({ auth: { user: mockUser, loading: false, error: null } })
    await store.dispatch(updateProfile({ name: 'New Name' }))
    expect(store.getState().auth.user?.name).toBe('New Name')
  })
})
