import { useEffect } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store'
import { AppRouter } from './routes/AppRouter'
import type { RootState, AppDispatch } from './store'
import { fetchMe, logout } from './store/slices/authSlice'
import { updateVideoProgress, updateVideoStatus } from './store/slices/videosSlice'
import { socketService } from './services/socketService'

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
    if (user) dispatch(fetchMe())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function SocketManager() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    if (!user) {
      socketService.disconnect()
      return
    }

    // Connect and join personal room
    socketService.connect(user.id)

    // Listen for processing events
    socketService.onProcessingStart(({ videoId, progress }) => {
      dispatch(updateVideoProgress({ id: videoId, progress }))
    })

    socketService.onProgress(({ videoId, progress }) => {
      dispatch(updateVideoProgress({ id: videoId, progress }))
    })

    socketService.onProcessingDone(({ videoId, status, sensitivityScore, progress }) => {
      dispatch(updateVideoStatus({ id: videoId, status, sensitivityScore, progress }))
    })

    socketService.onProcessingError(({ videoId }) => {
      dispatch(updateVideoStatus({ id: videoId, status: 'pending', progress: 0 }))
    })

    // Role change / account deletion by admin
    socketService.onRoleChanged(() => {
      dispatch(fetchMe())
    })

    socketService.onDeleted(() => {
      dispatch(logout())
    })

    return () => {
      socketService.off(
        'video:processing-start',
        'video:progress',
        'video:processing-done',
        'video:processing-error',
        'user:role-changed',
        'user:deleted'
      )
    }
  }, [user, dispatch])

  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeApplier />
      <SessionVerifier />
      <SocketManager />
      <AppRouter />
    </Provider>
  )
}
