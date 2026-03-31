import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Calendar,
  HardDrive,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Film,
} from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Button, PageSpinner, Modal, Input } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchVideoById, deleteVideo, updateVideo } from '../../store/slices/videosSlice'
import { videoService } from '../../services/videoService'
import { routes } from '../../constants/routes'

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}
function formatDuration(s?: number) {
  if (!s) return null
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export function VideoPlayer() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { selectedVideo: video, loading } = useAppSelector((s) => s.videos)
  const role = useAppSelector((s) => s.auth.user?.role)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [titleError, setTitleError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) dispatch(fetchVideoById(id))
  }, [id, dispatch])

  function openEdit() {
    setEditTitle(video?.title ?? '')
    setEditDesc(video?.description ?? '')
    setTitleError('')
    setShowEdit(true)
  }

  async function handleEditSave() {
    if (!editTitle.trim()) {
      setTitleError('Title is required')
      return
    }
    if (!id) return
    setTitleError('')
    setSaving(true)
    try {
      await dispatch(
        updateVideo({ id, title: editTitle.trim(), description: editDesc.trim() || undefined })
      )
      setShowEdit(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    await dispatch(deleteVideo(id))
    navigate(routes.library)
  }

  if (loading || !video)
    return (
      <MainLayout title="Video Player">
        <PageSpinner />
      </MainLayout>
    )

  const statusColor = {
    safe: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    flagged:
      'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
    processing:
      'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    pending:
      'bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/20',
  }

  return (
    <MainLayout title={video.title}>
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={15} />}
          onClick={() => navigate(routes.library)}
          className="mb-6"
        >
          Back to Library
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Video player */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden bg-black shadow-xl">
              {video.status === 'safe' ? (
                <video
                  ref={videoRef}
                  controls
                  crossOrigin="use-credentials"
                  className="w-full aspect-video"
                  src={videoService.getStreamUrl(video.id)}
                />
              ) : video.status === 'flagged' ? (
                <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center">
                    <AlertTriangle size={28} className="text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-red-400 mb-1">Content Flagged</p>
                    <p className="text-xs text-gray-500 max-w-xs">
                      This video has been flagged for sensitive content and is restricted.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-2 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
                  <p className="text-xs text-amber-400">Processing video...</p>
                </div>
              )}
            </div>

            {/* Title + description below player */}
            <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-[#f1f1f5] leading-snug">
                  {video.title}
                </h1>
                <span
                  className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[video.status]}`}
                >
                  {video.status === 'safe' && <ShieldCheck size={11} />}
                  {video.status === 'flagged' && <AlertTriangle size={11} />}
                  {video.status === 'processing' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  )}
                  {video.status === 'pending' && <Film size={11} />}
                  <span className="capitalize">{video.status}</span>
                </span>
              </div>
              {video.description && (
                <p className="text-sm text-gray-500 dark:text-[#a0a0b0] leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Meta info */}
            <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider mb-4">
                Video Info
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-[#13131c] rounded-lg flex items-center justify-center shrink-0">
                    <Calendar size={13} className="text-gray-400 dark:text-[#60607a]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 dark:text-[#60607a]">Uploaded</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                      {formatDate(video.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-[#13131c] rounded-lg flex items-center justify-center shrink-0">
                    <HardDrive size={13} className="text-gray-400 dark:text-[#60607a]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 dark:text-[#60607a]">File size</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                      {formatSize(video.size)}
                    </p>
                  </div>
                </div>
                {formatDuration(video.duration) && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#13131c] rounded-lg flex items-center justify-center shrink-0">
                      <Clock size={13} className="text-gray-400 dark:text-[#60607a]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 dark:text-[#60607a]">Duration</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                        {formatDuration(video.duration)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {role !== 'viewer' && (
              <div className="flex flex-col gap-2">
                <Button variant="outline" icon={<Pencil size={14} />} fullWidth onClick={openEdit}>
                  Edit Details
                </Button>
                <Button
                  variant="danger"
                  icon={<Trash2 size={14} />}
                  fullWidth
                  onClick={() => setShowDelete(true)}
                >
                  Delete Video
                </Button>
              </div>
            )}
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
              className="w-full bg-gray-50 dark:bg-[#13131c] border border-gray-200 dark:border-[#2a2a3a] rounded-lg text-gray-800 dark:text-[#f1f1f5] text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
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
            <Button variant="danger" onClick={handleDelete}>
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
    </MainLayout>
  )
}
