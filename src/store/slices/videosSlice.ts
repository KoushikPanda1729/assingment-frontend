import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { VideosState, VideoStatus, DashboardStats } from '../../types'
import { videoService } from '../../services/videoService'

const initialState: VideosState & { stats: DashboardStats | null } = {
  videos: [],
  selectedVideo: null,
  loading: false,
  error: null,
  filter: 'all',
  stats: null,
}

export const fetchVideos = createAsyncThunk(
  'videos/fetchAll',
  async (params: { status?: VideoStatus | 'all'; search?: string } = {}, { rejectWithValue }) => {
    try {
      return await videoService.getAll(params)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Failed to fetch videos')
    }
  }
)

export const fetchVideoById = createAsyncThunk(
  'videos/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await videoService.getById(id)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Failed to fetch video')
    }
  }
)

export const updateVideo = createAsyncThunk(
  'videos/update',
  async (
    { id, title, description }: { id: string; title: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      return await videoService.update(id, { title, description })
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Failed to update video')
    }
  }
)

export const deleteVideo = createAsyncThunk(
  'videos/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await videoService.delete(id)
      return id
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Failed to delete video')
    }
  }
)

export const fetchStats = createAsyncThunk('videos/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await videoService.getStats()
  } catch (err: unknown) {
    return rejectWithValue((err as Error).message ?? 'Failed to fetch stats')
  }
})

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setFilter(state, action: { payload: 'all' | VideoStatus }) {
      state.filter = action.payload
    },
    setSelectedVideo(state, action) {
      state.selectedVideo = action.payload
    },
    // Called by Socket.io events
    updateVideoProgress(state, action: { payload: { id: string; progress: number } }) {
      const video = state.videos.find((v) => v.id === action.payload.id)
      if (video) video.processingProgress = action.payload.progress
      if (state.selectedVideo?.id === action.payload.id)
        state.selectedVideo.processingProgress = action.payload.progress
    },
    updateVideoStatus(
      state,
      action: {
        payload: { id: string; status: VideoStatus; progress?: number; sensitivityScore?: number }
      }
    ) {
      const video = state.videos.find((v) => v.id === action.payload.id)
      if (video) {
        video.status = action.payload.status
        if (action.payload.progress !== undefined)
          video.processingProgress = action.payload.progress
        if (action.payload.sensitivityScore !== undefined)
          video.sensitivityScore = action.payload.sensitivityScore
      }
      if (state.selectedVideo?.id === action.payload.id) {
        state.selectedVideo.status = action.payload.status
        if (action.payload.progress !== undefined)
          state.selectedVideo.processingProgress = action.payload.progress
        if (action.payload.sensitivityScore !== undefined)
          state.selectedVideo.sensitivityScore = action.payload.sensitivityScore
      }
      // Update stats
      if (state.stats) {
        if (action.payload.status === 'safe') state.stats.safe += 1
        if (action.payload.status === 'flagged') state.stats.flagged += 1
        if (state.stats.processing > 0) state.stats.processing -= 1
      }
    },
    addVideo(state, action) {
      state.videos.unshift(action.payload)
      if (state.stats) {
        state.stats.total += 1
        state.stats.processing += 1
      }
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.selectedVideo = action.payload
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        const idx = state.videos.findIndex((v) => v.id === action.payload.id)
        if (idx !== -1) state.videos[idx] = action.payload
        if (state.selectedVideo?.id === action.payload.id) state.selectedVideo = action.payload
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v.id !== action.payload)
        if (state.stats && state.stats.total > 0) state.stats.total -= 1
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const {
  setFilter,
  setSelectedVideo,
  updateVideoProgress,
  updateVideoStatus,
  addVideo,
  clearError,
} = videosSlice.actions
export default videosSlice.reducer
