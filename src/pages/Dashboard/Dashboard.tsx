import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Film,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Upload,
  Search,
  TrendingUp,
  Play,
} from 'lucide-react'
import { videoService } from '../../services/videoService'
import { MainLayout } from '../../components/layout/MainLayout'
import {
  Card,
  CardHeader,
  Badge,
  Button,
  ProgressBar,
  PageSpinner,
  Input,
} from '../../components/ui'
import { VideoCard } from '../../components/video/VideoCard'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchVideos, fetchStats, deleteVideo, setFilter } from '../../store/slices/videosSlice'
import { text } from '../../constants/text'
import { routes } from '../../constants/routes'
import type { VideoStatus } from '../../types'

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-[#a0a0b0]">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={17} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-[#f1f1f5]">{value}</p>
    </Card>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const viewerChips: Array<{ value: 'all' | VideoStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'safe', label: 'Safe' },
  { value: 'flagged', label: 'Restricted' },
]

function ViewerHome() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { videos, loading, filter } = useAppSelector((s) => s.videos)
  const user = useAppSelector((s) => s.auth.user)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    dispatch(
      fetchVideos({ status: filter === 'all' ? undefined : filter, search: search || undefined })
    )
  }, [dispatch, filter, search])

  useEffect(() => {
    load()
  }, [load])

  const safeCount = videos.filter((v) => v.status === 'safe').length

  return (
    <MainLayout
      title="Home"
      subtitle={`${safeCount} video${safeCount !== 1 ? 's' : ''} ready to watch`}
    >
      {/* Greeting + search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f5]">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-sm text-gray-400 dark:text-[#60607a] mt-0.5">
              What would you like to watch today?
            </p>
          </div>
        </div>

        {/* Search + chips row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={15} />}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {viewerChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => dispatch(setFilter(chip.value))}
                className={[
                  'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border',
                  filter === chip.value
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#1a1a24] text-gray-600 dark:text-[#a0a0b0] border-gray-200 dark:border-[#2a2a3a] hover:border-gray-400 dark:hover:border-[#60607a]',
                ].join(' ')}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video feed */}
      {loading ? (
        <PageSpinner />
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a24] rounded-full flex items-center justify-center">
            <Film size={32} className="text-gray-300 dark:text-[#60607a]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600 dark:text-[#a0a0b0]">
              No videos found
            </p>
            <p className="text-xs text-gray-400 dark:text-[#60607a] mt-1">
              Try a different search or filter
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured / first safe video hero — desktop only */}
          {filter === 'all' && videos.find((v) => v.status === 'safe') && (
            <div className="hidden lg:block mb-8">
              {(() => {
                const featured = videos.find((v) => v.status === 'safe')!
                return (
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer group h-[280px] bg-gray-900"
                    onClick={() => navigate(routes.videoPlayerPath(featured.id))}
                  >
                    {/* Thumbnail image — falls back to gradient */}
                    {featured.thumbnail ? (
                      <img
                        src={videoService.getThumbnailUrl(featured.id)}
                        alt={featured.title}
                        crossOrigin="use-credentials"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
                    )}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        <Play size={26} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                    {/* Duration badge — bottom right */}
                    {featured.duration && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-[11px] text-white px-2 py-0.5 rounded font-mono">
                        {Math.floor(featured.duration / 60)}:
                        {String(featured.duration % 60).padStart(2, '0')}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          <ShieldCheck size={10} /> Safe
                        </span>
                        <span className="text-xs text-white/60">Featured</span>
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {featured.title}
                      </h3>
                      {featured.description && (
                        <p className="text-sm text-white/70 mt-1 line-clamp-1">
                          {featured.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Section label */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[#f1f1f5]">
              {filter === 'all'
                ? 'All Videos'
                : filter === 'safe'
                  ? 'Safe Videos'
                  : 'Restricted Videos'}
              <span className="ml-2 text-xs font-normal text-gray-400 dark:text-[#60607a]">
                {videos.length} results
              </span>
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </>
      )}
    </MainLayout>
  )
}

export function Dashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { videos, loading, stats } = useAppSelector((s) => s.videos)
  const user = useAppSelector((s) => s.auth.user)
  const isViewer = user?.role === 'viewer'

  useEffect(() => {
    if (!isViewer) {
      dispatch(fetchVideos())
      dispatch(fetchStats())
    }
  }, [dispatch, isViewer])

  // Viewer gets a YouTube-like home feed, not an admin dashboard
  if (isViewer) return <ViewerHome />

  const recent = videos.slice(0, 4)
  const processing = videos.filter((v) => v.status === 'processing' || v.status === 'pending')

  if (loading)
    return (
      <MainLayout title={text.dashboard.title}>
        <PageSpinner />
      </MainLayout>
    )

  return (
    <MainLayout title={text.dashboard.title} subtitle={text.dashboard.subtitle}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={text.dashboard.stats.total}
          value={stats?.total ?? 0}
          icon={Film}
          iconBg="bg-indigo-100 dark:bg-indigo-500/10"
          iconColor="text-indigo-500 dark:text-indigo-400"
        />
        <StatCard
          label={text.dashboard.stats.safe}
          value={stats?.safe ?? 0}
          icon={ShieldCheck}
          iconBg="bg-emerald-100 dark:bg-emerald-500/10"
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
        <StatCard
          label={text.dashboard.stats.flagged}
          value={stats?.flagged ?? 0}
          icon={AlertTriangle}
          iconBg="bg-red-100 dark:bg-red-500/10"
          iconColor="text-red-500 dark:text-red-400"
        />
        <StatCard
          label={text.dashboard.stats.processing}
          value={stats?.processing ?? 0}
          icon={Loader2}
          iconBg="bg-amber-100 dark:bg-amber-500/10"
          iconColor="text-amber-500 dark:text-amber-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent uploads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title={text.dashboard.recentUploads}
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate(routes.library)}>
                  {text.common.viewAll}
                </Button>
              }
            />
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 bg-gray-100 dark:bg-[#2a2a3a] rounded-2xl flex items-center justify-center">
                  <Film size={24} className="text-gray-300 dark:text-[#60607a]" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-[#a0a0b0]">
                  {text.dashboard.noVideos}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">
                  {text.dashboard.noVideosSubtext}
                </p>
                {(user?.role === 'editor' || user?.role === 'admin') && (
                  <Button
                    size="sm"
                    onClick={() => navigate(routes.upload)}
                    icon={<Upload size={14} />}
                    className="mt-2"
                  >
                    Upload Video
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 p-4">
                {recent.map((v) => (
                  <VideoCard key={v.id} video={v} onDelete={(id) => dispatch(deleteVideo(id))} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Processing queue */}
        <div>
          <Card>
            <CardHeader
              title={text.dashboard.processingQueue}
              subtitle={`${processing.length} in queue`}
            />
            <div className="p-4 flex flex-col gap-3">
              {processing.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-[#60607a] text-center py-8">
                  Queue is empty
                </p>
              ) : (
                processing.map((v) => (
                  <div key={v.id} className="bg-gray-50 dark:bg-[#13131c] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-[#f1f1f5] truncate flex-1 mr-2">
                        {v.title}
                      </p>
                      <Badge variant={v.status} pulse />
                    </div>
                    <ProgressBar
                      value={v.processingProgress ?? 0}
                      variant="warning"
                      size="sm"
                      showPercent
                    />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
