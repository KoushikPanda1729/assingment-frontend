const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5001/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5001',
  appName: import.meta.env.VITE_APP_NAME ?? 'VidSense',
  env: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export default config
