import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Zap } from 'lucide-react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button, Input } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { login, clearError, setMockUser } from '../../store/slices/authSlice'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'

const demoAccounts = [
  {
    role: 'admin' as const,
    label: 'Admin',
    color: 'text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10',
  },
  {
    role: 'editor' as const,
    label: 'Editor',
    color: 'text-violet-400 border-violet-500/30 hover:bg-violet-500/10',
  },
  {
    role: 'viewer' as const,
    label: 'Viewer',
    color: 'text-sky-400 border-sky-500/30 hover:bg-sky-500/10',
  },
]

export function Login() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  function validate() {
    const e = { email: '', password: '' }
    if (!form.email) e.email = text.errors.required
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = text.errors.invalidEmail
    if (!form.password) e.password = text.errors.required
    setErrors(e)
    return !e.email && !e.password
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    dispatch(clearError())
    if (!validate()) return
    dispatch(login(form))
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#f1f1f5]">{text.auth.login.title}</h2>
        <p className="text-[#a0a0b0] mt-1 text-sm">{text.auth.login.subtitle}</p>
      </div>

      {/* Demo access */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2a2a3a] rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-amber-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-[#a0a0b0]">
            Demo — no backend needed
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {demoAccounts.map(({ role, label, color }) => (
            <button
              key={role}
              onClick={() => dispatch(setMockUser(role))}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all duration-150 ${color}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a3a]" />
        <span className="text-xs text-gray-400 dark:text-[#60607a]">or sign in</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a3a]" />
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={text.auth.fields.email}
          type="email"
          placeholder={text.auth.fields.emailPlaceholder}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
        />
        <Input
          label={text.auth.fields.password}
          type="password"
          placeholder={text.auth.fields.passwordPlaceholder}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
          leftIcon={<Lock size={16} />}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link to="#" className="text-xs text-indigo-400 hover:text-indigo-300">
            {text.auth.login.forgotPassword}
          </Link>
        </div>
        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          {text.auth.login.button}
        </Button>
      </form>

      <p className="text-center text-sm text-[#a0a0b0] mt-6">
        {text.auth.login.switchText}{' '}
        <Link to={routes.register} className="text-indigo-400 hover:text-indigo-300 font-medium">
          {text.auth.login.switchLink}
        </Link>
      </p>
    </AuthLayout>
  )
}
