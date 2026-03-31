import { useEffect } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store'
import { AppRouter } from './routes/AppRouter'
import type { RootState, AppDispatch } from './store'
import { fetchMe } from './store/slices/authSlice'

function ThemeApplier() {
  const mode = useSelector((s: RootState) => s.theme.mode)
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [mode])
  return null
}

function SessionVerifier() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    // If we have a user in localStorage, verify the cookie session is still valid
    if (user) {
      dispatch(fetchMe())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeApplier />
      <SessionVerifier />
      <AppRouter />
    </Provider>
  )
}
