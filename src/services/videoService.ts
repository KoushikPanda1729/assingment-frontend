import api from './api'
import config from '../config'
import type { Video, DashboardStats, VideoStatus } from '../types'

interface VideoResponse {
  success: boolean
  data: { video: Video }
}
interface VideosResponse {
  success: boolean
  data: { videos: Video[]; count: number }
}
interface StatsResponse {
  success: boolean
  data: DashboardStats
}

export const videoService = {
  getAll: async (params?: { status?: VideoStatus | 'all'; search?: string }): Promise<Video[]> => {
    const { data } = await api.get<VideosResponse>('/videos', { params })
    return data.data.videos
  },

  getById: async (id: string): Promise<Video> => {
    const { data } = await api.get<VideoResponse>(`/videos/${id}`)
    return data.data.video
  },

  upload: async (formData: FormData, onProgress?: (pct: number) => void): Promise<Video> => {
    const { data } = await api.post<VideoResponse>('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data.data.video
  },

  update: async (id: string, data: { title: string; description?: string }): Promise<Video> => {
    const { data: res } = await api.patch<VideoResponse>(`/videos/${id}`, data)
    return res.data.video
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`)
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<StatsResponse>('/videos/stats')
    return data.data
  },

  // Stream via backend — never exposes direct file path
  getStreamUrl: (id: string): string => `${config.apiUrl}/videos/${id}/stream`,

  // Thumbnail via backend — authenticated
  getThumbnailUrl: (id: string): string => `${config.apiUrl}/videos/${id}/thumbnail`,
}
