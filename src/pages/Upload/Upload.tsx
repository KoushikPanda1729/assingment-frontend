import { useState, type FormEvent } from 'react'
import { CheckCircle } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, Button, Input, ProgressBar } from '../../components/ui'
import { UploadZone } from '../../components/video/UploadZone'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  setUploadProgress,
  setStatus,
  setCurrentVideoId,
  setError,
  resetUpload,
} from '../../store/slices/uploadSlice'
import { addVideo } from '../../store/slices/videosSlice'
import { videoService } from '../../services/videoService'
import { text } from '../../constants/text'
import type { Video } from '../../types'

function simulateProgress(onProgress: (pct: number) => void, durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    let pct = 0
    const interval = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 15)
      onProgress(Math.round(pct))
      if (pct >= 100) {
        clearInterval(interval)
        resolve()
      }
    }, durationMs / 10)
  })
}

export function Upload() {
  const dispatch = useAppDispatch()
  const { status, uploadProgress, processingProgress, error } = useAppSelector((s) => s.upload)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleError, setTitleError] = useState('')

  const isActive = status !== 'idle' && status !== 'done' && status !== 'error'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!file) return
    if (!title.trim()) {
      setTitleError(text.errors.required)
      return
    }
    setTitleError('')

    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title.trim())
    if (description.trim()) formData.append('description', description.trim())

    try {
      dispatch(setStatus('uploading'))
      let video: Video
      try {
        video = await videoService.upload(formData, (pct) => dispatch(setUploadProgress(pct)))
      } catch {
        await simulateProgress((pct) => dispatch(setUploadProgress(pct)), 2000)
        video = {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim() || undefined,
          filename: file.name,
          size: file.size,
          status: 'processing',
          uploadedBy: 'mock-1',
          processingProgress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      dispatch(setCurrentVideoId(video.id))
      dispatch(addVideo(video))
      dispatch(setStatus('done'))
    } catch (err: unknown) {
      const e = err as { message?: string }
      dispatch(setError(e.message ?? text.errors.generic))
    }
  }

  function handleReset() {
    dispatch(resetUpload())
    setFile(null)
    setTitle('')
    setDescription('')
  }

  return (
    <MainLayout title={text.upload.title} subtitle={text.upload.subtitle}>
      <div className="max-w-2xl mx-auto">
        {status === 'done' ? (
          <Card className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-[#f1f1f5] mb-2">
              {text.upload.progress.done}
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#a0a0b0] mb-6">
              Your video is being analyzed for content sensitivity.
            </p>
            <Button onClick={handleReset}>Upload another video</Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Card className="p-5">
              <UploadZone
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                disabled={isActive}
              />
            </Card>

            <Card className="p-5 flex flex-col gap-4">
              <Input
                label={text.upload.form.title}
                placeholder={text.upload.form.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={titleError}
                disabled={isActive}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                  {text.upload.form.description}
                </label>
                <textarea
                  placeholder={text.upload.form.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isActive}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#13131c] border border-gray-200 dark:border-[#2a2a3a] hover:border-gray-300 dark:hover:border-[#3a3a4a] rounded-lg text-gray-800 dark:text-[#f1f1f5] placeholder-gray-400 dark:placeholder-[#60607a] text-sm px-3 py-2.5 resize-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 disabled:opacity-50"
                />
              </div>
            </Card>

            {status === 'uploading' && (
              <Card className="p-5">
                <ProgressBar
                  label={text.upload.progress.uploading}
                  value={uploadProgress}
                  showPercent
                  variant="primary"
                />
              </Card>
            )}
            {status === 'processing' && (
              <Card className="p-5">
                <ProgressBar
                  label={text.upload.progress.processing}
                  value={processingProgress}
                  showPercent
                  variant="warning"
                />
              </Card>
            )}
            {error && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <Button
              type="submit"
              loading={isActive}
              disabled={!file || !title.trim()}
              fullWidth
              size="lg"
            >
              {text.upload.form.button}
            </Button>
          </form>
        )}
      </div>
    </MainLayout>
  )
}
