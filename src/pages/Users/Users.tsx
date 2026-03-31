import { useState, useEffect } from 'react'
import {
  Search,
  Trash2,
  UserCog,
  Users as UsersIcon,
  ShieldCheck,
  PenLine,
  Eye,
} from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import {
  Card,
  CardHeader,
  Badge,
  Avatar,
  Input,
  Button,
  Modal,
  Select,
  PageSpinner,
} from '../../components/ui'
import { userService } from '../../services/userService'
import { useAppSelector } from '../../hooks/useAppSelector'
import type { User, UserRole } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
]

export function Users() {
  const currentUser = useAppSelector((s) => s.auth.user)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('viewer')
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    userService
      .getAll()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleEditOpen(user: User) {
    setEditUser(user)
    setEditRole(user.role)
  }

  async function handleEditSave() {
    if (!editUser) return
    setSaving(true)
    try {
      const updated = await userService.updateRole(editUser.id, editRole)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      setEditUser(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteUser) return
    setSaving(true)
    try {
      await userService.delete(deleteUser.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id))
      setDeleteUser(null)
    } finally {
      setSaving(false)
    }
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    editors: users.filter((u) => u.role === 'editor').length,
    viewers: users.filter((u) => u.role === 'viewer').length,
  }

  if (loading)
    return (
      <MainLayout title="Users" subtitle="Manage user accounts and roles">
        <PageSpinner />
      </MainLayout>
    )

  return (
    <MainLayout title="Users" subtitle="Manage user accounts and roles">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Users',
            value: stats.total,
            icon: UsersIcon,
            iconBg: 'bg-indigo-100 dark:bg-indigo-500/10',
            iconColor: 'text-indigo-500 dark:text-indigo-400',
          },
          {
            label: 'Admins',
            value: stats.admins,
            icon: ShieldCheck,
            iconBg: 'bg-violet-100 dark:bg-violet-500/10',
            iconColor: 'text-violet-500 dark:text-violet-400',
          },
          {
            label: 'Editors',
            value: stats.editors,
            icon: PenLine,
            iconBg: 'bg-sky-100 dark:bg-sky-500/10',
            iconColor: 'text-sky-500 dark:text-sky-400',
          },
          {
            label: 'Viewers',
            value: stats.viewers,
            icon: Eye,
            iconBg: 'bg-gray-100 dark:bg-gray-500/10',
            iconColor: 'text-gray-500 dark:text-gray-400',
          },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 dark:text-[#a0a0b0]">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                <s.icon size={17} className={s.iconColor} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-[#f1f1f5]">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card>
        <CardHeader title="All Users" subtitle={`${filtered.length} users`} />

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100 dark:border-[#2a2a3a]">
          <div className="max-w-sm">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={15} />}
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#2a2a3a]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 dark:text-[#60607a] uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#1f1f2e]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-[#f1f1f5]">{user.name}</p>
                        <p className="text-xs text-gray-400 dark:text-[#60607a]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={user.role} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-[#a0a0b0]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditOpen(user)}
                        disabled={user.id === currentUser?.id}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Edit role"
                      >
                        <UserCog size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteUser(user)}
                        disabled={user.id === currentUser?.id}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-[#60607a] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-gray-50 dark:divide-[#1f1f2e]">
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3.5">
              <Avatar name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-[#f1f1f5] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#60607a] truncate">{user.email}</p>
                <div className="mt-1">
                  <Badge variant={user.role} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleEditOpen(user)}
                  disabled={user.id === currentUser?.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <UserCog size={16} />
                </button>
                <button
                  onClick={() => setDeleteUser(user)}
                  disabled={user.id === currentUser?.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400 dark:text-[#60607a]">
            No users found
          </div>
        )}
      </Card>

      {/* Edit role modal */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit Role"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} loading={saving}>
              Save Changes
            </Button>
          </>
        }
      >
        {editUser && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#13131c] rounded-xl">
              <Avatar name={editUser.name} size="md" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-[#f1f1f5]">
                  {editUser.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#60607a]">{editUser.email}</p>
              </div>
            </div>
            <Select
              label="Role"
              options={roleOptions}
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
            />
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>
              Delete
            </Button>
          </>
        }
      >
        {deleteUser && (
          <p className="text-sm text-gray-600 dark:text-[#a0a0b0]">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-800 dark:text-[#f1f1f5]">
              {deleteUser.name}
            </span>
            ? This action cannot be undone.
          </p>
        )}
      </Modal>
    </MainLayout>
  )
}
