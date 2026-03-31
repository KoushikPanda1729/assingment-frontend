import { io, type Socket } from 'socket.io-client'
import config from '../config'

let socket: Socket | null = null

export const socketService = {
  connect: (userId: string): void => {
    if (socket?.connected) return

    socket = io(config.socketUrl, {
      withCredentials: true, // send cookies
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      // Join personal room so backend can emit to this user only
      socket?.emit('join:room', userId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
  },

  disconnect: (): void => {
    socket?.disconnect()
    socket = null
  },

  // video:processing-start
  onProcessingStart: (cb: (data: { videoId: string; progress: number }) => void): void => {
    socket?.on('video:processing-start', cb)
  },

  // video:progress
  onProgress: (cb: (data: { videoId: string; progress: number }) => void): void => {
    socket?.on('video:progress', cb)
  },

  // video:processing-done
  onProcessingDone: (
    cb: (data: {
      videoId: string
      status: 'safe' | 'flagged'
      sensitivityScore: number
      progress: number
    }) => void
  ): void => {
    socket?.on('video:processing-done', cb)
  },

  // video:processing-error
  onProcessingError: (cb: (data: { videoId: string; message: string }) => void): void => {
    socket?.on('video:processing-error', cb)
  },

  // user:role-changed — emitted when an admin changes this user's role
  onRoleChanged: (cb: (data: { role: string }) => void): void => {
    socket?.on('user:role-changed', cb)
  },

  // user:deleted — emitted when an admin deletes this user's account
  onDeleted: (cb: () => void): void => {
    socket?.on('user:deleted', cb)
  },

  off: (...events: string[]): void => {
    events.forEach((e) => socket?.off(e))
  },

  isConnected: (): boolean => socket?.connected ?? false,
}
