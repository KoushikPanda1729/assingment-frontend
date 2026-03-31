export const routes = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  upload: '/upload',
  library: '/library',
  videoPlayer: '/video/:id',
  users: '/users',
  profile: '/profile',
  authCallback: '/auth/callback',
  videoPlayerPath: (id: string) => `/video/${id}`,
}
