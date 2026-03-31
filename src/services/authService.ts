import api from './api'
import type { User, LoginPayload, RegisterPayload } from '../types'

interface UserResponse {
  success: boolean
  data: { user: User }
}

interface MeResponse {
  success: boolean
  data: { id: string; name: string; email: string; role: string; createdAt: string }
}

export const authService = {
  login: async (payload: LoginPayload): Promise<User> => {
    const { data } = await api.post<UserResponse>('/auth/login', payload)
    return data.data.user
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post<UserResponse>('/auth/register', payload)
    return data.data.user
  },

  me: async (): Promise<{ id: string; role: string }> => {
    const { data } = await api.get<MeResponse>('/auth/me')
    return data.data
  },

  updateProfile: async (payload: { name: string }): Promise<User> => {
    const { data } = await api.patch<UserResponse>('/auth/me', payload)
    return data.data.user
  },

  changePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<void> => {
    await api.post('/auth/change-password', payload)
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  refresh: async (): Promise<void> => {
    await api.post('/auth/refresh')
  },
}
