import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'mock-1',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Sarah Editor',
    email: 'sarah@demo.com',
    role: 'editor',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    name: 'John Viewer',
    email: 'john@demo.com',
    role: 'viewer',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4',
    name: 'Emily Chen',
    email: 'emily@demo.com',
    role: 'editor',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-5',
    name: 'Marcus Lee',
    email: 'marcus@demo.com',
    role: 'viewer',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
