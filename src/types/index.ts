export type UserRole = 'admin' | 'editor' | 'viewer'

export type VideoStatus = 'pending' | 'processing' | 'safe' | 'flagged'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface Video {
  id: string
  title: string
  description?: string
  originalName: string
  mimetype: string
  size: number
  duration?: number
  resolution?: string
  thumbnail?: boolean
  status: VideoStatus
  sensitivityScore?: number
  processingProgress: number
  owner: string | { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null // only used for mock/demo login, real auth uses HTTP-only cookie
  loading: boolean
  error: string | null
}

export interface VideosState {
  videos: Video[]
  selectedVideo: Video | null
  loading: boolean
  error: string | null
  filter: 'all' | VideoStatus
  stats: DashboardStats | null
}

export interface UploadState {
  uploadProgress: number
  processingProgress: number
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  error: string | null
  currentVideoId: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  status: number
}

export interface DashboardStats {
  total: number
  safe: number
  flagged: number
  processing: number
}
