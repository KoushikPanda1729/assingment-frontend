import type { ReactNode } from 'react'
import { Upload, ShieldCheck, PlayCircle, BarChart2 } from 'lucide-react'
import { Logo } from '../ui'
import { text } from '../../constants/text'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex flex-col lg:flex-row">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Unsplash background image */}
        <img
          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-black/60 to-violet-900/70" />
        <div className="relative z-10 w-full max-w-sm">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 mb-10">
            <Logo size={48} />
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">{text.app.name}</h1>
              <p className="text-indigo-300 text-sm">{text.app.tagline}</p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Your video platform, <span className="text-indigo-300">reimagined.</span>
          </h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed mb-10">
            Upload, analyze sensitivity, and stream your videos — all in one secure platform built
            for teams.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Upload, label: 'Fast & secure uploads', desc: 'Up to 500MB per video' },
              {
                icon: ShieldCheck,
                label: 'AI sensitivity analysis',
                desc: 'Auto-flag content in real time',
              },
              {
                icon: PlayCircle,
                label: 'Smooth adaptive streaming',
                desc: 'HLS with range request support',
              },
              {
                icon: BarChart2,
                label: 'Team analytics dashboard',
                desc: 'Track uploads, status & progress',
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-indigo-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-indigo-300/70">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 lg:p-8 min-h-screen lg:min-h-0">
        {/* Mobile top bar */}
        <div className="w-full max-w-md mb-6 lg:hidden">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-lg font-bold text-gray-900 dark:text-[#f1f1f5]">
              {text.app.name}
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-[#a0a0b0] mt-1">{text.app.tagline}</p>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
