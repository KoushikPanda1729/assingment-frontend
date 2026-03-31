import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button, Input, Select } from '../../components/ui'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { register, clearError } from '../../store/slices/authSlice'
import { routes } from '../../constants/routes'
import { text } from '../../constants/text'
import type { UserRole } from '../../types'

const roleOptions = [
  { value: 'viewer', label: 'Viewer — Read-only access' },
  { value: 'editor', label: 'Editor — Upload & manage videos' },
  { value: 'admin', label: 'Admin — Full system access' },
]

export function Register() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer' as UserRole,
  })
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  function validate() {
    const e = { name: '', email: '', password: '', confirmPassword: '' }
    if (!form.name.trim()) e.name = text.errors.required
    if (!form.email) e.email = text.errors.required
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = text.errors.invalidEmail
    if (!form.password) e.password = text.errors.required
    else if (form.password.length < 8) e.password = text.errors.passwordMin
    if (form.password !== form.confirmPassword) e.confirmPassword = text.errors.passwordMatch
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    dispatch(clearError())
    if (!validate()) return
    dispatch(
      register({ name: form.name, email: form.email, password: form.password, role: form.role })
    )
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#f1f1f5]">{text.auth.register.title}</h2>
        <p className="text-[#a0a0b0] mt-1 text-sm">{text.auth.register.subtitle}</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={text.auth.fields.name}
          type="text"
          placeholder={text.auth.fields.namePlaceholder}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          leftIcon={<User size={16} />}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <Input
          label={text.auth.fields.confirmPassword}
          type="password"
          placeholder={text.auth.fields.passwordPlaceholder}
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
          leftIcon={<Lock size={16} />}
          autoComplete="new-password"
        />
        <Select
          label={text.auth.fields.role}
          options={roleOptions}
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
        />
        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          {text.auth.register.button}
        </Button>
      </form>

      <p className="text-center text-sm text-[#a0a0b0] mt-6">
        {text.auth.register.switchText}{' '}
        <Link to={routes.login} className="text-indigo-400 hover:text-indigo-300 font-medium">
          {text.auth.register.switchLink}
        </Link>
      </p>
    </AuthLayout>
  )
}
