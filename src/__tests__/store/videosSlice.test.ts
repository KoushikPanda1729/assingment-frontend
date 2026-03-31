import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import type { Video } from '../../types'

const mocks = vi.hoisted(() => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  deleteV: vi.fn(),
  getStats: vi.fn(),
}))

vi.mock('../../services/videoService', () => ({
  videoService: {
    getAll: mocks.getAll,
    getById: mocks.getById,
    delete: mocks.deleteV,
    getStats: mocks.getStats,
    update: vi.fn(),
    upload: vi.fn(),
    getStreamUrl: vi.fn(),
    getThumbnailUrl: vi.fn(),
  },
}))

import videosReducer, {
  setFilter,
  clearError,
  updateVideoProgress,
  updateVideoStatus,
  fetchVideos,
  fetchVideoById,
  deleteVideo,
  fetchStats,
} from '../../store/slices/videosSlice'

const mockVideo: Video = {
  id: 'vid123',
  title: 'Test Video',
  originalName: 'test.mp4',
  mimetype: 'video/mp4',
  size: 1024,
  status: 'safe',
  processingProgress: 100,
  thumbnail: false,
  owner: 'mock-user-1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

const videosState = {
  videos: [mockVideo],
  selectedVideo: null,
  loading: false,
  error: null,
  filter: 'all' as const,
  stats: null,
}

function makeStore(preloaded?: object) {
  return configureStore({
    reducer: { videos: videosReducer },
    ...(preloaded ? { preloadedState: preloaded } : {}),
  })
}

describe('videosSlice reducers', () => {
  it('setFilter updates filter', () => {
    const store = makeStore()
    store.dispatch(setFilter('safe'))
    expect(store.getState().videos.filter).toBe('safe')
  })

  it('clearError resets error', () => {
    const store = makeStore()
    store.dispatch(clearError())
    expect(store.getState().videos.error).toBeNull()
  })

  it('updateVideoProgress updates progress', () => {
    const store = makeStore({ videos: videosState })
    store.dispatch(updateVideoProgress({ id: 'vid123', progress: 60 }))
    expect(store.getState().videos.videos[0]?.processingProgress).toBe(60)
  })

  it('updateVideoStatus updates status and score', () => {
    const store = makeStore({ videos: videosState })
    store.dispatch(
      updateVideoStatus({ id: 'vid123', status: 'flagged', sensitivityScore: 85, progress: 100 })
    )
    expect(store.getState().videos.videos[0]?.status).toBe('flagged')
    expect(store.getState().videos.videos[0]?.sensitivityScore).toBe(85)
  })
})

describe('videosSlice thunks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetchVideos fulfilled populates videos', async () => {
    mocks.getAll.mockResolvedValue([mockVideo])
    const store = makeStore()
    await store.dispatch(fetchVideos({}))
    expect(store.getState().videos.videos).toHaveLength(1)
  })

  it('fetchVideos rejected sets error', async () => {
    mocks.getAll.mockRejectedValue(new Error('Network error'))
    const store = makeStore()
    await store.dispatch(fetchVideos({}))
    expect(store.getState().videos.error).toBeTruthy()
  })

  it('fetchVideoById sets selectedVideo', async () => {
    mocks.getById.mockResolvedValue(mockVideo)
    const store = makeStore()
    await store.dispatch(fetchVideoById('vid123'))
    expect(store.getState().videos.selectedVideo).toEqual(mockVideo)
  })

  it('deleteVideo removes video from list', async () => {
    mocks.deleteV.mockResolvedValue(undefined)
    const store = makeStore({ videos: videosState })
    await store.dispatch(deleteVideo('vid123'))
    expect(store.getState().videos.videos).toHaveLength(0)
  })

  it('fetchStats sets stats', async () => {
    const stats = { total: 10, safe: 7, flagged: 2, processing: 1 }
    mocks.getStats.mockResolvedValue(stats)
    const store = makeStore()
    await store.dispatch(fetchStats())
    expect(store.getState().videos.stats).toEqual(stats)
  })
})
