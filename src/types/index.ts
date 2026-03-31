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
  filename: string
  size: number
  duration?: number
  status: VideoStatus
  uploadedBy: string
  processingProgress?: number
  thumbnailUrl?: string
  streamUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface VideosState {
  videos: Video[]
  selectedVideo: Video | null
  loading: boolean
  error: string | null
  filter: 'all' | VideoStatus
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
