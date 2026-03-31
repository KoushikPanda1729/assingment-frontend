import type { VideoStatus } from '../../types'

type BadgeVariant = VideoStatus | 'admin' | 'editor' | 'viewer'

interface BadgeProps {
  variant: BadgeVariant
  label?: string
  pulse?: boolean
}

const styles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  safe: {
    bg: 'bg-emerald-500/10 border border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  flagged: {
    bg: 'bg-red-500/10 border border-red-500/20',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  processing: {
    bg: 'bg-amber-500/10 border border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  pending: {
    bg: 'bg-zinc-500/10 border border-zinc-500/20',
    text: 'text-zinc-400',
    dot: 'bg-zinc-400',
  },
  admin: {
    bg: 'bg-indigo-500/10 border border-indigo-500/20',
    text: 'text-indigo-400',
    dot: 'bg-indigo-400',
  },
  editor: {
    bg: 'bg-violet-500/10 border border-violet-500/20',
    text: 'text-violet-400',
    dot: 'bg-violet-400',
  },
  viewer: {
    bg: 'bg-sky-500/10 border border-sky-500/20',
    text: 'text-sky-400',
    dot: 'bg-sky-400',
  },
}

const labels: Record<BadgeVariant, string> = {
  safe: 'Safe',
  flagged: 'Flagged',
  processing: 'Processing',
  pending: 'Pending',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

export function Badge({ variant, label, pulse = false }: BadgeProps) {
  const s = styles[variant]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${s.dot} ${pulse && variant === 'processing' ? 'animate-pulse' : ''}`}
      />
      {label ?? labels[variant]}
    </span>
  )
}
