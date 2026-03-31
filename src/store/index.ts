import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import videosReducer from './slices/videosSlice'
import uploadReducer from './slices/uploadSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    upload: uploadReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
