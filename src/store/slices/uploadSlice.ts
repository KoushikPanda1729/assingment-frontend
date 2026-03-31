import { createSlice } from '@reduxjs/toolkit'
import type { UploadState } from '../../types'

const initialState: UploadState = {
  uploadProgress: 0,
  processingProgress: 0,
  status: 'idle',
  error: null,
  currentVideoId: null,
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadProgress(state, action: { payload: number }) {
      state.uploadProgress = action.payload
    },
    setProcessingProgress(state, action: { payload: number }) {
      state.processingProgress = action.payload
    },
    setStatus(state, action: { payload: UploadState['status'] }) {
      state.status = action.payload
    },
    setCurrentVideoId(state, action: { payload: string }) {
      state.currentVideoId = action.payload
    },
    setError(state, action: { payload: string }) {
      state.status = 'error'
      state.error = action.payload
    },
    resetUpload(state) {
      state.uploadProgress = 0
      state.processingProgress = 0
      state.status = 'idle'
      state.error = null
      state.currentVideoId = null
    },
  },
})

export const {
  setUploadProgress,
  setProcessingProgress,
  setStatus,
  setCurrentVideoId,
  setError,
  resetUpload,
} = uploadSlice.actions
export default uploadSlice.reducer
