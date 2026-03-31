import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { VideosState, VideoStatus } from '../../types'
import { videoService } from '../../services/videoService'
import { mockVideos } from '../../mocks/videos'

const initialState: VideosState = {
  videos: [],
  selectedVideo: null,
  loading: false,
  error: null,
  filter: 'all',
}

export const fetchVideos = createAsyncThunk('videos/fetchAll', async () => {
  try {
    return await videoService.getAll()
  } catch {
    return mockVideos
  }
})

export const fetchVideoById = createAsyncThunk('videos/fetchById', async (id: string) => {
  try {
    return await videoService.getById(id)
  } catch {
    return mockVideos.find((v) => v.id === id) ?? mockVideos[0]
  }
})

export const deleteVideo = createAsyncThunk(
  'videos/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await videoService.delete(id)
      return id
    } catch (err: unknown) {
      const error = err as { message?: string }
      return rejectWithValue(error.message ?? 'Failed to delete video')
    }
  }
)

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
    updateVideoStatus(
      state,
      action: { payload: { id: string; status: VideoStatus; progress?: number } }
    ) {
      const video = state.videos.find((v) => v.id === action.payload.id)
      if (video) {
        video.status = action.payload.status
        if (action.payload.progress !== undefined) {
          video.processingProgress = action.payload.progress
        }
      }
    },
    addVideo(state, action) {
      state.videos.unshift(action.payload)
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
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v.id !== action.payload)
      })
  },
})

export const { setFilter, setSelectedVideo, updateVideoStatus, addVideo, clearError } =
  videosSlice.actions
export default videosSlice.reducer
