import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Trash2, Calendar, HardDrive, Clock } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Badge, Button, Card, PageSpinner } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchVideoById, deleteVideo } from '../../store/slices/videosSlice'
import { videoService } from '../../services/videoService'
import { routes } from '../../constants/routes'

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}
function formatDuration(s?: number) {
  if (!s) return 'Unknown'
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export function VideoPlayer() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { selectedVideo: video, loading } = useAppSelector((s) => s.videos)

  useEffect(() => {
    if (id) dispatch(fetchVideoById(id))
  }, [id, dispatch])

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

  return (
    <MainLayout title={video.title}>
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={15} />}
          onClick={() => navigate(routes.library)}
          className="mb-5"
        >
          Back to Library
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {video.status === 'safe' ? (
                <video
                  ref={videoRef}
                  controls
                  className="w-full aspect-video bg-black"
                  src={videoService.getStreamUrl(video.id)}
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 dark:bg-[#13131c] flex flex-col items-center justify-center gap-3">
                  {video.status === 'flagged' ? (
                    <>
                      <span className="text-4xl">🚩</span>
                      <p className="text-sm font-medium text-red-500 dark:text-red-400">
                        Content Flagged
                      </p>
                      <p className="text-xs text-gray-400 dark:text-[#60607a] text-center max-w-xs">
                        This video has been flagged for sensitive content and is restricted.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 border-2 border-amber-300 dark:border-amber-500/50 border-t-amber-400 rounded-full animate-spin" />
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Processing video...
                      </p>
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-800 dark:text-[#f1f1f5] leading-tight">
                  {video.title}
                </h2>
                <Badge variant={video.status} />
              </div>
              {video.description && (
                <p className="text-sm text-gray-500 dark:text-[#a0a0b0] mb-4 leading-relaxed">
                  {video.description}
                </p>
              )}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3 text-gray-500 dark:text-[#a0a0b0]">
                  <Calendar size={14} className="text-gray-400 dark:text-[#60607a]" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-[#a0a0b0]">
                  <HardDrive size={14} className="text-gray-400 dark:text-[#60607a]" />
                  <span>{formatSize(video.size)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-[#a0a0b0]">
                  <Clock size={14} className="text-gray-400 dark:text-[#60607a]" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                icon={<Download size={15} />}
                fullWidth
                onClick={() => window.open(videoService.getStreamUrl(video.id), '_blank')}
              >
                Download
              </Button>
              <Button variant="danger" icon={<Trash2 size={15} />} fullWidth onClick={handleDelete}>
                Delete Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
