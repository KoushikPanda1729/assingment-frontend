import { useState } from 'react'
import { Camera, Mail, Shield, Calendar, LogOut, Sun, Moon, User } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, Button, Input, Badge, Avatar } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}

export function Profile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const mode = useAppSelector((s) => s.theme.mode)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <MainLayout title="Profile" subtitle="Manage your account">
      {/* ── Desktop two-column layout ── */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Avatar card */}
          <Card className="p-6 flex flex-col items-center text-center gap-4">
            <div className="relative">
              <Avatar name={user?.name ?? 'User'} size="lg" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-[#1a1a24]">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-[#f1f1f5]">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-400 dark:text-[#60607a] mb-2">{user?.email}</p>
              {user?.role && <Badge variant={user.role} />}
            </div>
          </Card>

          {/* Account details */}
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider mb-4">
              Account
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={13} className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">Role</p>
                    <p className="text-xs text-gray-400 dark:text-[#60607a]">Access level</p>
                  </div>
                </div>
                {user?.role && <Badge variant={user.role} />}
              </div>
              <div className="h-px bg-gray-100 dark:bg-[#2a2a3a]" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={13} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                    Member Since
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#60607a]">
                    {user?.createdAt ? formatDate(user.createdAt) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider mb-4">
              Preferences
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {mode === 'dark' ? (
                    <Sun size={13} className="text-amber-500" />
                  ) : (
                    <Moon size={13} className="text-amber-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                    Appearance
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#60607a] capitalize">
                    {mode} mode
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleTheme())}
                className={[
                  'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
                  mode === 'dark' ? 'bg-indigo-500' : 'bg-gray-200',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200',
                    mode === 'dark' ? 'left-[23px]' : 'left-[3px]',
                  ].join(' ')}
                />
              </button>
            </div>
          </Card>

          {/* Sign out */}
          <Button
            variant="danger"
            fullWidth
            icon={<LogOut size={15} />}
            onClick={() => dispatch(logout())}
          >
            Sign Out
          </Button>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Personal info */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <User size={16} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">
                  Personal Information
                </h3>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">
                  Update your name and email
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
              />
            </div>
            <div className="mt-5 flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(user?.name ?? '')
                  setEmail(user?.email ?? '')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                {saved ? '✓ Saved' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Stats / activity placeholder */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Videos Uploaded', value: '12' },
              { label: 'Safe Videos', value: '9' },
              { label: 'Flagged Videos', value: '3' },
            ].map((s) => (
              <Card key={s.label} className="p-5 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-[#f1f1f5]">{s.value}</p>
                <p className="text-xs text-gray-400 dark:text-[#60607a] mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Security placeholder */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-violet-500 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">
                  Security
                </h3>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">
                  Manage your password and security
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2a2a3a]">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">Password</p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">Last changed never</p>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                  Two-factor authentication
                </p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">Not enabled</p>
              </div>
              <Button variant="ghost" size="sm">
                Enable
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Mobile single-column layout ── */}
      <div className="lg:hidden max-w-2xl mx-auto space-y-5">
        {/* Avatar card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <Avatar name={user?.name ?? 'User'} size="lg" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-[#1a1a24]">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-gray-800 dark:text-[#f1f1f5]">{user?.name}</h2>
              <p className="text-sm text-gray-400 dark:text-[#60607a] mb-2">{user?.email}</p>
              {user?.role && <Badge variant={user.role} />}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
            />
          </div>
          <div className="mt-5 flex gap-3">
            <Button onClick={handleSave} size="sm">
              {saved ? '✓ Saved' : 'Save Changes'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setName(user?.name ?? '')
                setEmail(user?.email ?? '')
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] mb-4">
            Account Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-[#2a2a3a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center">
                  <Shield size={14} className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">Role</p>
                  <p className="text-xs text-gray-400 dark:text-[#60607a]">Access level</p>
                </div>
              </div>
              {user?.role && <Badge variant={user.role} />}
            </div>
            <div className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Calendar size={14} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
                  Member Since
                </p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">
                  {user?.createdAt ? formatDate(user.createdAt) : '—'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5] mb-4">
            Preferences
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/10 rounded-lg flex items-center justify-center">
                {mode === 'dark' ? (
                  <Sun size={14} className="text-amber-500" />
                ) : (
                  <Moon size={14} className="text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">Appearance</p>
                <p className="text-xs text-gray-400 dark:text-[#60607a] capitalize">{mode} mode</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={[
                'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
                mode === 'dark' ? 'bg-indigo-500' : 'bg-gray-200',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200',
                  mode === 'dark' ? 'left-[23px]' : 'left-[3px]',
                ].join(' ')}
              />
            </button>
          </div>
        </Card>

        <Button
          variant="danger"
          fullWidth
          size="lg"
          icon={<LogOut size={17} />}
          onClick={() => dispatch(logout())}
        >
          Sign Out
        </Button>
      </div>
    </MainLayout>
  )
}
