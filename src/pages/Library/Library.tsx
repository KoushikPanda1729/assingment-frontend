import { useEffect, useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Input, PageSpinner } from '../../components/ui'
import { VideoCard } from '../../components/video/VideoCard'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchVideos, setFilter, deleteVideo } from '../../store/slices/videosSlice'
import { text } from '../../constants/text'
import type { VideoStatus } from '../../types'

const filters: Array<{ value: 'all' | VideoStatus; label: string }> = [
  { value: 'all', label: text.library.filters.all },
  { value: 'safe', label: text.library.filters.safe },
  { value: 'flagged', label: text.library.filters.flagged },
  { value: 'processing', label: text.library.filters.processing },
]

const viewerFilters: Array<{ value: 'all' | VideoStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'safe', label: 'Safe' },
  { value: 'flagged', label: 'Restricted' },
]

export function Library() {
  const dispatch = useAppDispatch()
  const { videos, loading, filter } = useAppSelector((s) => s.videos)
  const role = useAppSelector((s) => s.auth.user?.role)
  const [search, setSearch] = useState('')

  const isViewer = role === 'viewer'

  const load = useCallback(() => {
    dispatch(
      fetchVideos({ status: filter === 'all' ? undefined : filter, search: search || undefined })
    )
  }, [dispatch, filter, search])

  useEffect(() => {
    load()
  }, [load])

  const activeFilters = isViewer ? viewerFilters : filters
  const title = isViewer ? 'Browse' : text.library.title
  const subtitle = isViewer
    ? `${videos.length} video${videos.length !== 1 ? 's' : ''} available`
    : text.library.subtitle

  return (
    <MainLayout title={title} subtitle={subtitle}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={isViewer ? 'Search videos...' : text.library.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        </div>
        <div
          className={[
            'flex items-center gap-1 p-1 rounded-lg shadow-sm dark:shadow-none',
            isViewer
              ? 'bg-transparent gap-2'
              : 'bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a]',
          ].join(' ')}
        >
          {isViewer && (
            <span className="text-xs text-gray-400 dark:text-[#60607a] flex items-center gap-1 mr-1">
              <SlidersHorizontal size={12} /> Filter:
            </span>
          )}
          {activeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => dispatch(setFilter(f.value))}
              className={[
                'transition-all duration-150 font-medium',
                isViewer
                  ? [
                      'px-4 py-1.5 rounded-full text-xs border',
                      filter === f.value
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-sm'
                        : 'bg-white dark:bg-[#1a1a24] text-gray-600 dark:text-[#a0a0b0] border-gray-200 dark:border-[#2a2a3a] hover:border-gray-400 dark:hover:border-[#60607a]',
                    ].join(' ')
                  : [
                      'px-3 py-1.5 rounded-md text-xs',
                      filter === f.value
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-gray-500 dark:text-[#a0a0b0] hover:text-gray-800 dark:hover:text-[#f1f1f5] hover:bg-gray-100 dark:hover:bg-white/5',
                    ].join(' '),
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PageSpinner />
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-sm font-medium text-gray-500 dark:text-[#a0a0b0]">
            {text.library.empty}
          </p>
          <p className="text-xs text-gray-400 dark:text-[#60607a]">{text.library.emptySubtext}</p>
        </div>
      ) : (
        <div
          className={[
            'grid gap-4',
            isViewer
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          ].join(' ')}
        >
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              onDelete={role !== 'viewer' ? (id) => dispatch(deleteVideo(id)) : undefined}
            />
          ))}
        </div>
      )}
    </MainLayout>
  )
}
