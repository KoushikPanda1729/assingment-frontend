import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AuthState, LoginPayload, RegisterPayload, User } from '../../types'
import { authService } from '../../services/authService'

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user')
    if (!raw || raw === 'undefined' || raw === 'null') return null
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const initialState: AuthState = {
  user: getStoredUser(),
  token: null, // token lives in HTTP-only cookie, not in state
  loading: false,
  error: null,
}

// ── Thunks ─────────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Registration failed')
    }
  }
)

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authService.me()
  } catch {
    return rejectWithValue(null) // silently fail — user just stays logged out
  }
})

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(payload)
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message ?? 'Failed to update profile')
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } catch {
    // ignore — clear local state regardless
  }
})

// ── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
    // Demo login — bypasses backend
    setMockUser(state, action: { payload: 'admin' | 'editor' | 'viewer' }) {
      const mockUser: User = {
        id: 'mock-1',
        name:
          action.payload === 'admin'
            ? 'Admin User'
            : action.payload === 'editor'
              ? 'Editor User'
              : 'Viewer User',
        email: `${action.payload}@demo.com`,
        role: action.payload,
        createdAt: new Date().toISOString(),
      }
      state.user = mockUser
      state.token = 'mock-token'
      localStorage.setItem('user', JSON.stringify(mockUser))
    },
    // Google OAuth — user info comes from redirect params (cookie already set by backend)
    setGoogleUser(
      state,
      action: {
        payload: {
          id: string
          name: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          createdAt: string
        }
      }
    ) {
      const user: User = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        createdAt: action.payload.createdAt,
      }
      state.user = user
      state.token = null // cookie handles auth
      localStorage.setItem('user', JSON.stringify(user))
    },
  },
  extraReducers: (builder) => {
    builder
      // ── login ──
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = null // cookie handles auth
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ── register ──
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = null
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ── fetchMe (on app load to verify session) ──
      .addCase(fetchMe.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.user.role = action.payload.role as User['role']
          if (action.payload.name) state.user.name = action.payload.name
          if (action.payload.email) state.user.email = action.payload.email
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      })
      .addCase(fetchMe.rejected, (state) => {
        // cookie expired/invalid — clear everything
        state.user = null
        state.token = null
        localStorage.removeItem('user')
      })

      // ── updateProfile ──
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })

      // ── logout ──
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.error = null
        localStorage.removeItem('user')
      })
  },
})

export const { clearError, setMockUser, setGoogleUser } = authSlice.actions

// Keep logout as a named export that dispatches the thunk
export const logout = logoutThunk

export default authSlice.reducer
