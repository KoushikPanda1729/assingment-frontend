import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./api', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }))
vi.mock('../services/api', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }))
vi.mock('../../services/api', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }))

import api from '../../services/api'
import { authService } from '../../services/authService'

const mockUser = { id: 'u1', name: 'Test', email: 'test@test.com', role: 'viewer', createdAt: '' }

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login returns user data', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: { user: mockUser } } })
    const result = await authService.login({ email: 'test@test.com', password: 'pass' })
    expect(result).toEqual(mockUser)
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: 'pass',
    })
  })

  it('register returns user data', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: { user: mockUser } } })
    const result = await authService.register({
      name: 'Test',
      email: 'test@test.com',
      password: 'pass',
      role: 'viewer',
    })
    expect(result).toEqual(mockUser)
    expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object))
  })

  it('me returns current user', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: mockUser } })
    const result = await authService.me()
    expect(result).toEqual(mockUser)
    expect(api.get).toHaveBeenCalledWith('/auth/me')
  })

  it('logout calls logout endpoint', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { success: true } })
    await authService.logout()
    expect(api.post).toHaveBeenCalledWith('/auth/logout')
  })

  it('updateProfile sends PATCH and returns updated user', async () => {
    const updated = { ...mockUser, name: 'New Name' }
    vi.mocked(api.patch).mockResolvedValue({ data: { success: true, data: { user: updated } } })
    const result = await authService.updateProfile({ name: 'New Name' })
    expect(result).toEqual(updated)
    expect(api.patch).toHaveBeenCalledWith('/auth/me', { name: 'New Name' })
  })
})
