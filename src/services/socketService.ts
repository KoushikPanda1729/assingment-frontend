import { io, Socket } from 'socket.io-client'
import config from '../config'

let socket: Socket | null = null

export const socketService = {
  connect: (token: string): Socket => {
    socket = io(config.socketUrl, {
      auth: { token },
      transports: ['websocket'],
    })
    return socket
  },

  disconnect: (): void => {
    socket?.disconnect()
    socket = null
  },

  onProcessingProgress: (cb: (data: { videoId: string; progress: number }) => void) => {
    socket?.on('processing:progress', cb)
  },

  onProcessingComplete: (cb: (data: { videoId: string; status: 'safe' | 'flagged' }) => void) => {
    socket?.on('processing:complete', cb)
  },

  offAll: () => {
    socket?.off('processing:progress')
    socket?.off('processing:complete')
  },
}
