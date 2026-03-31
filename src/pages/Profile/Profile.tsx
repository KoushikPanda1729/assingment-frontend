import { useState } from 'react'
import {
  Shield,
  Calendar,
  LogOut,
  Sun,
  Moon,
  User,
  Check,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, Button, Input, Badge, Avatar, Modal } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout, updateProfile } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import { authService } from '../../services/authService'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}

function PasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!current || !next || !confirm) {
      setError('All fields are required')
      return
    }
    if (next.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (next !== confirm) {
      setError('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await authService.changePassword({ currentPassword: current, newPassword: next })
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setCurrent('')
        setNext('')
        setConfirm('')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    onClose()
    setCurrent('')
    setNext('')
    setConfirm('')
    setError('')
    setSuccess(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Password"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            icon={success ? <Check size={14} /> : undefined}
          >
            {success ? 'Changed!' : 'Update Password'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <div className="relative">
          <Input
            label="New Password"
            type={showNext ? 'text' : 'password'}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowNext((v) => !v)}
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <Input
          label="Confirm New Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  )
}

export function Profile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const mode = useAppSelector((s) => s.theme.mode)

  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showPwModal, setShowPwModal] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setSaveError('')
    try {
      await dispatch(updateProfile({ name: name.trim() })).unwrap()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setSaveError(typeof err === 'string' ? err : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const themeToggle = (
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
  )

  return (
    <MainLayout title="Profile" subtitle="Manage your account">
      <PasswordModal open={showPwModal} onClose={() => setShowPwModal(false)} />

      {/* ── Desktop two-column layout ── */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Avatar card */}
          <Card className="p-6 flex flex-col items-center text-center gap-4">
            <Avatar name={user?.name ?? 'User'} size="lg" />
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
              {themeToggle}
            </div>
          </Card>

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
          {/* Personal info — name only */}
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
                  Update your display name
                </p>
              </div>
            </div>
            <div className="max-w-sm">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {saveError && <p className="mt-3 text-xs text-red-500">{saveError}</p>}
            <div className="mt-5 flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(user?.name ?? '')
                  setSaveError('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                loading={saving}
                icon={saved ? <Check size={14} /> : undefined}
              >
                {saved ? 'Saved' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                <KeyRound size={16} className="text-violet-500 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">
                  Security
                </h3>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">Manage your password</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">Password</p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">
                  Change your account password
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPwModal(true)}>
                Change
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Mobile single-column layout ── */}
      <div className="lg:hidden max-w-2xl mx-auto space-y-5">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar name={user?.name ?? 'User'} size="lg" />
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
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          {saveError && <p className="mt-3 text-xs text-red-500">{saveError}</p>}
          <div className="mt-5 flex gap-3">
            <Button
              onClick={handleSave}
              size="sm"
              loading={saving}
              icon={saved ? <Check size={14} /> : undefined}
            >
              {saved ? 'Saved' : 'Save Changes'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setName(user?.name ?? '')
                setSaveError('')
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">Password</p>
              <p className="text-xs text-gray-400 dark:text-[#60607a]">
                Change your account password
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPwModal(true)}>
              Change
            </Button>
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
            {themeToggle}
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
