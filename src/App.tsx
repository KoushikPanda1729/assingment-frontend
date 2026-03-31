import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { store } from './store'
import { AppRouter } from './routes/AppRouter'
import type { RootState } from './store'

function ThemeApplier() {
  const mode = useSelector((s: RootState) => s.theme.mode)
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [mode])
  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeApplier />
      <AppRouter />
    </Provider>
  )
}
