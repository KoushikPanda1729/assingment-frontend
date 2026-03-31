import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
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

export function Library() {
  const dispatch = useAppDispatch()
  const { videos, loading, filter } = useAppSelector((s) => s.videos)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchVideos())
  }, [dispatch])

  const filtered = videos
    .filter((v) => filter === 'all' || v.status === filter)
    .filter((v) => v.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <MainLayout title={text.library.title} subtitle={text.library.subtitle}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={text.library.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-lg p-1 shadow-sm dark:shadow-none">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => dispatch(setFilter(f.value))}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                filter === f.value
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#a0a0b0] hover:text-gray-800 dark:hover:text-[#f1f1f5] hover:bg-gray-100 dark:hover:bg-white/5',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-sm font-medium text-gray-500 dark:text-[#a0a0b0]">
            {text.library.empty}
          </p>
          <p className="text-xs text-gray-400 dark:text-[#60607a]">{text.library.emptySubtext}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} onDelete={(id) => dispatch(deleteVideo(id))} />
          ))}
        </div>
      )}
    </MainLayout>
  )
}
