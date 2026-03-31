import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

import api from '../../services/api'
import { videoService } from '../../services/videoService'

const mockVideo = {
  id: 'vid123',
  title: 'Test',
  originalName: 'test.mp4',
  mimetype: 'video/mp4',
  size: 1024,
  status: 'safe',
  processingProgress: 100,
  thumbnail: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('videoService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('getAll returns video list', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: { videos: [mockVideo], count: 1 } },
    })
    const result = await videoService.getAll({})
    expect(result).toEqual([mockVideo])
    expect(api.get).toHaveBeenCalledWith('/videos', expect.any(Object))
  })

  it('getAll passes status filter in params', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: { videos: [], count: 0 } },
    })
    await videoService.getAll({ status: 'safe' })
    expect(api.get).toHaveBeenCalledWith('/videos', { params: { status: 'safe' } })
  })

  it('getById returns single video', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { video: mockVideo } } })
    const result = await videoService.getById('vid123')
    expect(result).toEqual(mockVideo)
    expect(api.get).toHaveBeenCalledWith('/videos/vid123')
  })

  it('delete calls delete endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } })
    await videoService.delete('vid123')
    expect(api.delete).toHaveBeenCalledWith('/videos/vid123')
  })

  it('getStats returns stats', async () => {
    const stats = { total: 10, safe: 7, flagged: 2, processing: 1 }
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: stats } })
    const result = await videoService.getStats()
    expect(result).toEqual(stats)
    expect(api.get).toHaveBeenCalledWith('/videos/stats')
  })

  it('getStreamUrl returns URL containing video id and stream', () => {
    const url = videoService.getStreamUrl('vid123')
    expect(url).toContain('vid123')
    expect(url).toContain('stream')
  })

  it('getThumbnailUrl returns URL containing video id and thumbnail', () => {
    const url = videoService.getThumbnailUrl('vid123')
    expect(url).toContain('vid123')
    expect(url).toContain('thumbnail')
  })

  it('update sends PATCH and returns video', async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: { success: true, data: { video: mockVideo } } })
    const result = await videoService.update('vid123', { title: 'New Title' })
    expect(result).toEqual(mockVideo)
    expect(api.patch).toHaveBeenCalledWith('/videos/vid123', { title: 'New Title' })
  })
})
