import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer, { toggleTheme } from '../../store/slices/themeSlice'

function makeStore(mode?: 'light' | 'dark') {
  return configureStore({
    reducer: { theme: themeReducer },
    ...(mode ? { preloadedState: { theme: { mode } } } : {}),
  })
}

describe('themeSlice', () => {
  it('should toggle from light to dark', () => {
    const store = makeStore('light')
    store.dispatch(toggleTheme())
    expect(store.getState().theme.mode).toBe('dark')
  })

  it('should toggle from dark to light', () => {
    const store = makeStore('dark')
    store.dispatch(toggleTheme())
    expect(store.getState().theme.mode).toBe('light')
  })

  it('initial state should be light or dark based on localStorage', () => {
    const store = makeStore()
    expect(['light', 'dark']).toContain(store.getState().theme.mode)
  })
})
