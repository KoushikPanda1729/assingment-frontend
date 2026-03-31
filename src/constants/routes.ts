export const routes = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  upload: '/upload',
  library: '/library',
  videoPlayer: '/video/:id',
  users: '/users',
  profile: '/profile',
  videoPlayerPath: (id: string) => `/video/${id}`,
}
