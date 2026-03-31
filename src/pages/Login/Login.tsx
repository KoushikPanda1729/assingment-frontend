import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button, Input } from '../../components/ui'
import config from '../../config'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { login, clearError } from '../../store/slices/authSlice'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'

export function Login() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f5]">
          {text.auth.login.title}
        </h2>
        <p className="text-gray-500 dark:text-[#a0a0b0] mt-1 text-sm">{text.auth.login.subtitle}</p>
      </div>

      {/* Google OAuth */}
      <a
        href={`${config.apiUrl}/auth/google`}
        className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-[#2a2a3a] bg-white dark:bg-[#1a1a24] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-4"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-[#f1f1f5]">
          Continue with Google
        </span>
      </a>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a3a]" />
        <span className="text-xs text-gray-400 dark:text-[#60607a]">or sign in with email</span>
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
          type={showPassword ? 'text' : 'password'}
          placeholder={text.auth.fields.passwordPlaceholder}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
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
