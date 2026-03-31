import { Play, Trash2, Clock, HardDrive } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Video } from '../../types'
import { Badge, ProgressBar } from '../ui'
import { routes } from '../../constants/routes'

interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void
}

const gradients = [
  'from-indigo-400/20 to-violet-400/20',
  'from-emerald-400/20 to-teal-400/20',
  'from-amber-400/20 to-orange-400/20',
  'from-rose-400/20 to-pink-400/20',
  'from-sky-400/20 to-cyan-400/20',
]

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDuration(seconds?: number) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const navigate = useNavigate()
  const gradient = gradients[video.id.charCodeAt(0) % gradients.length]

  return (
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md dark:hover:shadow-none transition-all duration-200 group">
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${gradient} cursor-pointer`}
        onClick={() => video.status === 'safe' && navigate(routes.videoPlayerPath(video.id))}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {video.status === 'safe' ? (
            <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
              <Play size={20} className="text-white fill-white ml-0.5" />
            </div>
          ) : video.status === 'processing' ? (
            <div className="text-center px-4">
              <div className="w-8 h-8 border-2 border-amber-400/50 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Analyzing...</p>
            </div>
          ) : (
            <span className="text-3xl">🎬</span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant={video.status} pulse={video.status === 'processing'} />
        </div>
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-white px-1.5 py-0.5 rounded font-mono">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Processing progress */}
      {video.status === 'processing' && video.processingProgress !== undefined && (
        <div className="px-4 pt-3">
          <ProgressBar value={video.processingProgress} variant="warning" size="sm" showPercent />
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] truncate mb-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-gray-400 dark:text-[#60607a] line-clamp-1 mb-3">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#60607a]">
            <span className="flex items-center gap-1">
              <HardDrive size={11} />
              {formatSize(video.size)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(video.createdAt)}
            </span>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(video.id)}
              className="p-1.5 rounded-lg text-gray-300 dark:text-[#60607a] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
