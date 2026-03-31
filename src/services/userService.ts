import api from './api'
import type { User, UserRole } from '../types'

interface UsersResponse {
  success: boolean
  data: { users: User[]; count: number }
}
interface UserResponse {
  success: boolean
  data: { user: User }
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<UsersResponse>('/users')
    return data.data.users
  },

  updateRole: async (id: string, role: UserRole): Promise<User> => {
    const { data } = await api.patch<UserResponse>(`/users/${id}/role`, { role })
    return data.data.user
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
