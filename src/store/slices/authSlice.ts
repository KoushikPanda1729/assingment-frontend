import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AuthState, LoginPayload, RegisterPayload } from '../../types'
import { authService } from '../../services/authService'

const storedToken = localStorage.getItem('token')
const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload)
    } catch (err: unknown) {
      const error = err as { message?: string }
      return rejectWithValue(error.message ?? 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload)
    } catch (err: unknown) {
      const error = err as { message?: string }
      return rejectWithValue(error.message ?? 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = null
    },
    setMockUser(state, action: { payload: 'admin' | 'editor' | 'viewer' }) {
      const mockUser = {
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
      } as const
      state.user = mockUser
      state.token = 'mock-token'
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, setMockUser } = authSlice.actions
export default authSlice.reducer
