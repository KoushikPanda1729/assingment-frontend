import { useState } from 'react'
import {
  Play,
  Trash2,
  Clock,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  Film,
  Pencil,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Video } from '../../types'
import { ProgressBar, Modal, Button, Input } from '../ui'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { updateVideo } from '../../store/slices/videosSlice'
import { videoService } from '../../services/videoService'
import { routes } from '../../constants/routes'

interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void
}

const gradients = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-sky-500 to-cyan-600',
  'from-purple-500 to-indigo-600',
]

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDuration(seconds?: number) {
  if (!seconds) return null
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
  const dispatch = useAppDispatch()
  const role = useAppSelector((s) => s.auth.user?.role)
  const gradient = gradients[video.id.charCodeAt(0) % gradients.length]
  const canPlay = video.status === 'safe'
  const duration = formatDuration(video.duration)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editTitle, setEditTitle] = useState(video.title)
  const [editDesc, setEditDesc] = useState(video.description ?? '')
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState('')

  async function handleEditSave() {
    if (!editTitle.trim()) {
      setTitleError('Title is required')
      return
    }
    setTitleError('')
    setSaving(true)
    try {
      await dispatch(
        updateVideo({
          id: video.id,
          title: editTitle.trim(),
          description: editDesc.trim() || undefined,
        })
      )
      setShowEdit(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/30 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
        {/* Thumbnail */}
        <div
          className="relative h-48 cursor-pointer overflow-hidden bg-gray-100 dark:bg-[#13131c] shrink-0"
          onClick={() => canPlay && navigate(routes.videoPlayerPath(video.id))}
        >
          {/* Thumbnail or gradient */}
          {video.thumbnail ? (
            <img
              src={videoService.getThumbnailUrl(video.id)}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="use-credentials"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                if (t.parentElement)
                  t.parentElement.classList.add('bg-gradient-to-br', ...gradient.split(' '))
              }}
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`}
            />
          )}

          {/* Dark gradient overlay at bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Flagged overlay */}
          {video.status === 'flagged' && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 bg-red-500/25 border border-red-400/50 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <span className="text-xs font-semibold text-white/90 tracking-wide">
                  Restricted
                </span>
              </div>
            </div>
          )}

          {/* Processing overlay */}
          {video.status === 'processing' && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                <span className="text-xs font-medium text-white/80">Analyzing...</span>
              </div>
            </div>
          )}

          {/* Pending with no thumbnail */}
          {video.status === 'pending' && !video.thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film size={26} className="text-white/30" />
            </div>
          )}

          {/* Play button */}
          {canPlay && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-13 h-13 w-[52px] h-[52px] bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 border border-white/30 shadow-2xl">
                <Play size={20} className="text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Status badge — top left */}
          <div className="absolute top-2.5 left-2.5">
            {video.status === 'safe' && (
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow">
                <ShieldCheck size={10} /> Safe
              </span>
            )}
            {video.status === 'flagged' && (
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full shadow">
                <AlertTriangle size={10} /> Flagged
              </span>
            )}
            {video.status === 'processing' && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Processing
              </span>
            )}
            {video.status === 'pending' && (
              <span className="text-[11px] font-semibold bg-gray-500/80 text-white px-2 py-0.5 rounded-full shadow">
                Pending
              </span>
            )}
          </div>

          {/* Duration — bottom right */}
          {duration && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-[11px] text-white px-1.5 py-0.5 rounded font-mono">
              {duration}
            </div>
          )}
        </div>

        {/* Processing progress */}
        {video.status === 'processing' && (
          <div className="px-4 pt-3">
            <ProgressBar
              value={video.processingProgress ?? 0}
              variant="warning"
              size="sm"
              showPercent
            />
          </div>
        )}

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Title row with actions */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] leading-snug line-clamp-1 flex-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => canPlay && navigate(routes.videoPlayerPath(video.id))}
            >
              {video.title}
            </h3>
            {role !== 'viewer' && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditTitle(video.title)
                    setEditDesc(video.description ?? '')
                    setShowEdit(true)
                  }}
                  className="p-1.5 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDelete(true)
                    }}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {video.description && (
            <p className="text-xs text-gray-400 dark:text-[#60607a] line-clamp-1">
              {video.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#60607a] mt-auto pt-1 border-t border-gray-100 dark:border-[#2a2a3a]">
            <span className="flex items-center gap-1">
              <HardDrive size={10} />
              {formatSize(video.size)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatDate(video.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Video"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} loading={saving}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            error={titleError}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
              Description
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 dark:bg-[#13131c] border border-gray-200 dark:border-[#2a2a3a] rounded-lg text-gray-800 dark:text-[#f1f1f5] placeholder-gray-400 dark:placeholder-[#60607a] text-sm px-3 py-2.5 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
            />
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Video"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete?.(video.id)
                setShowDelete(false)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-[#a0a0b0]">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800 dark:text-[#f1f1f5]">{video.title}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
