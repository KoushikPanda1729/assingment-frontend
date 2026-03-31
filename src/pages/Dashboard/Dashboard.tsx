import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Film, ShieldCheck, AlertTriangle, Loader2, Upload } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardHeader, Badge, Button, ProgressBar, PageSpinner } from '../../components/ui'
import { VideoCard } from '../../components/video/VideoCard'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchVideos, deleteVideo } from '../../store/slices/videosSlice'
import { text } from '../../constants/text'
import { routes } from '../../constants/routes'
import type { DashboardStats } from '../../types'

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

export function Dashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { videos, loading } = useAppSelector((s) => s.videos)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchVideos())
  }, [dispatch])

  const stats: DashboardStats = {
    total: videos.length,
    safe: videos.filter((v) => v.status === 'safe').length,
    flagged: videos.filter((v) => v.status === 'flagged').length,
    processing: videos.filter((v) => v.status === 'processing' || v.status === 'pending').length,
  }

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
          value={stats.total}
          icon={Film}
          iconBg="bg-indigo-100 dark:bg-indigo-500/10"
          iconColor="text-indigo-500 dark:text-indigo-400"
        />
        <StatCard
          label={text.dashboard.stats.safe}
          value={stats.safe}
          icon={ShieldCheck}
          iconBg="bg-emerald-100 dark:bg-emerald-500/10"
          iconColor="text-emerald-500 dark:text-emerald-400"
        />
        <StatCard
          label={text.dashboard.stats.flagged}
          value={stats.flagged}
          icon={AlertTriangle}
          iconBg="bg-red-100 dark:bg-red-500/10"
          iconColor="text-red-500 dark:text-red-400"
        />
        <StatCard
          label={text.dashboard.stats.processing}
          value={stats.processing}
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
