import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import uploadReducer, {
  setUploadProgress,
  setProcessingProgress,
  setStatus,
  setCurrentVideoId,
  setError,
  resetUpload,
} from '../../store/slices/uploadSlice'

function makeStore() {
  return configureStore({ reducer: { upload: uploadReducer } })
}

describe('uploadSlice', () => {
  it('initial state should be idle with zero progress', () => {
    const store = makeStore()
    const state = store.getState().upload
    expect(state.status).toBe('idle')
    expect(state.uploadProgress).toBe(0)
    expect(state.processingProgress).toBe(0)
    expect(state.currentVideoId).toBeNull()
    expect(state.error).toBeNull()
  })

  it('setUploadProgress should update uploadProgress', () => {
    const store = makeStore()
    store.dispatch(setUploadProgress(75))
    expect(store.getState().upload.uploadProgress).toBe(75)
  })

  it('setProcessingProgress should update processingProgress', () => {
    const store = makeStore()
    store.dispatch(setProcessingProgress(50))
    expect(store.getState().upload.processingProgress).toBe(50)
  })

  it('setStatus should update status', () => {
    const store = makeStore()
    store.dispatch(setStatus('uploading'))
    expect(store.getState().upload.status).toBe('uploading')
  })

  it('setCurrentVideoId should set currentVideoId', () => {
    const store = makeStore()
    store.dispatch(setCurrentVideoId('vid123'))
    expect(store.getState().upload.currentVideoId).toBe('vid123')
  })

  it('setError should set error message', () => {
    const store = makeStore()
    store.dispatch(setError('Upload failed'))
    expect(store.getState().upload.error).toBe('Upload failed')
    expect(store.getState().upload.status).toBe('error')
  })

  it('resetUpload should return to initial state', () => {
    const store = makeStore()
    store.dispatch(setStatus('done'))
    store.dispatch(setUploadProgress(100))
    store.dispatch(setCurrentVideoId('vid123'))
    store.dispatch(resetUpload())
    const state = store.getState().upload
    expect(state.status).toBe('idle')
    expect(state.uploadProgress).toBe(0)
    expect(state.currentVideoId).toBeNull()
  })
})
