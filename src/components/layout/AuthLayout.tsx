import type { ReactNode } from 'react'
import { Logo } from '../ui'
import { text } from '../../constants/text'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex flex-col lg:flex-row">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-white dark:bg-[#111118] border-r border-gray-200 dark:border-[#2a2a3a] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 dark:from-indigo-500/5 via-transparent to-violet-50 dark:to-violet-500/5" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="mx-auto mb-6">
            <Logo size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[#f1f1f5] mb-3">
            {text.app.name}
          </h1>
          <p className="text-gray-500 dark:text-[#a0a0b0] text-lg">{text.app.tagline}</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {['Upload', 'Analyze', 'Stream'].map((step, i) => (
              <div
                key={step}
                className="bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-xl p-4 text-center"
              >
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-[#a0a0b0]">{step}</p>
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
