import { createSlice } from '@reduxjs/toolkit'

const stored = localStorage.getItem('theme')

interface ThemeState {
  mode: 'light' | 'dark'
}

const initialState: ThemeState = {
  mode: (stored as 'light' | 'dark') ?? 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.mode)
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
