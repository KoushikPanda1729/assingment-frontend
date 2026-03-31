import axios from 'axios'
import config from '../config'

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies with every request
})

let isRefreshing = false
let failedQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    // If 401 and not the refresh endpoint itself, try to refresh
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(original)),
            reject,
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        processQueue(null)
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr)
        // Refresh failed — clear user state
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    const message = err.response?.data?.message ?? 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export default api
