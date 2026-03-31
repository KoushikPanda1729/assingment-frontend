import api from './api'
import config from '../config'
import type { Video } from '../types'

export const videoService = {
  getAll: async (): Promise<Video[]> => {
    const { data } = await api.get<Video[]>('/videos')
    return data
  },

  getById: async (id: string): Promise<Video> => {
    const { data } = await api.get<Video>(`/videos/${id}`)
    return data
  },

  upload: async (
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ): Promise<Video> => {
    const { data } = await api.post<Video>('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onUploadProgress && e.total) {
          onUploadProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`)
  },

  getStreamUrl: (id: string): string => `${config.apiUrl}/videos/${id}/stream`,
}
