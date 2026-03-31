import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Film, X } from 'lucide-react'
import { text } from '../../constants/text'

interface UploadZoneProps {
  file: File | null
  onFile: (file: File) => void
  onClear: () => void
  disabled?: boolean
}

const ACCEPTED = { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] }
const MAX_SIZE = 2 * 1024 * 1024 * 1024

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadZone({ file, onFile, onClear, disabled }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0])
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  })

  if (file) {
    return (
      <div className="border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Film size={22} className="text-indigo-500 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-[#f1f1f5] truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-[#60607a] mt-0.5">
            {formatSize(file.size)}
          </p>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={[
        'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
        isDragReject
          ? 'border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-500/5'
          : isDragActive
            ? 'border-indigo-400 dark:border-indigo-500/70 bg-indigo-50 dark:bg-indigo-500/10'
            : 'border-gray-200 dark:border-[#2a2a3a] hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input {...getInputProps()} />
      <div className="w-14 h-14 bg-gray-100 dark:bg-indigo-500/10 border border-gray-200 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Upload
          size={24}
          className={isDragActive ? 'text-indigo-500' : 'text-gray-400 dark:text-[#60607a]'}
        />
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5] mb-1">
        {isDragActive ? 'Drop your video here' : text.upload.dropzone.title}
      </p>
      <p className="text-xs text-gray-400 dark:text-[#60607a] mb-1">
        {text.upload.dropzone.subtitle}
      </p>
      <p className="text-xs text-gray-400 dark:text-[#60607a]">{text.upload.dropzone.formats}</p>
    </div>
  )
}
