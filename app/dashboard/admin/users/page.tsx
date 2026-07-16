'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const ROLE_BADGE: Record<string, string> = {
  corporate_admin: 'bg-purple-100 text-purple-800',
  boutique_manager: 'bg-blue-100 text-blue-800',
  inventory_controller: 'bg-indigo-100 text-indigo-800',
  sales_associate: 'bg-green-100 text-green-800',
  service_technician: 'bg-amber-100 text-amber-800',
  aftersales_specialist: 'bg-orange-100 text-orange-800',
}

const ROLES = [
  { value: 'corporate_admin', label: 'Corporate Admin' },
  { value: 'boutique_manager', label: 'Boutique Manager' },
  { value: 'inventory_controller', label: 'Inventory Controller' },
  { value: 'sales_associate', label: 'Sales Associate' },
  { value: 'service_technician', label: 'Service Technician' },
  { value: 'aftersales_specialist', label: 'After-Sales Specialist' },
]

type StaffUser = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  role: string
  created_at: string
  stores: { name: string } | null
}

type Store = { id: string; name: string; city: string | null }

const inputClass = 'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'
const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'

export default function UsersPage() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: '', storeId: '' })
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')

  const loadUsers = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, role, created_at, stores(name)')
      .order('created_at', { ascending: false })
    setStaffUsers((data as StaffUser[]) ?? [])
  }, [])

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('users')
      .select('id, first_name, last_name, email, role, created_at, stores(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setStaffUsers((data as StaffUser[]) ?? [])
      })
    supabase.from('stores').select('id, name, city').order('name').then(({ data }) => {
      if (!cancelled) setStores(data ?? [])
    })
    return () => {
      cancelled = true
    }
  }, [])

  const needsStore = form.role && form.role !== 'corporate_admin'

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.role) { setInviteError('Email and role are required.'); return }
    if (needsStore && !form.storeId) { setInviteError('Please select a store for this role.'); return }
    setInviting(true)
    setInviteError('')

    const res = await fetch('/api/admin/invite-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        storeId: form.storeId || null,
      }),
    })

    const data = await res.json()
    setInviting(false)

    if (!res.ok) {
      setInviteError(data.error ?? 'Failed to invite staff member.')
      return
    }

    setCredentials({ email: data.email, password: data.password })
    setForm({ email: '', firstName: '', lastName: '', role: '', storeId: '' })
    setShowInvite(false)
    await loadUsers()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Staff Users</h1>
        <button
          onClick={() => { setShowInvite(v => !v); setInviteError(''); setCredentials(null) }}
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          {showInvite ? 'Cancel' : '+ Invite Staff'}
        </button>
      </div>

      {/* Credentials banner */}
      {credentials && (
        <div className="mb-6 p-4 border border-arca-gold bg-arca-cream">
          <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">Account Created — Share These Credentials</p>
          <p className="text-sm text-arca-ink font-medium">{credentials.email}</p>
          <p className="text-sm font-mono text-arca-gold mt-1">{credentials.password}</p>
          <button onClick={() => setCredentials(null)} className="mt-3 text-xs text-arca-stone hover:text-arca-ink transition-colors">
            Dismiss
          </button>
        </div>
      )}

      {/* Invite form */}
      {showInvite && (
        <div className="border border-[#E8E8E4] p-6 mb-8">
          <h2 className="font-display text-lg font-light text-arca-ink mb-6">Invite Staff Member</h2>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>First Name</label>
              <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className={inputClass} placeholder="Priya" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className={inputClass} placeholder="Sharma" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="manager.mumbai@arca.com" />
            </div>
            <div>
              <label className={labelClass}>Role *</label>
              <select required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value, storeId: '' }))} className={inputClass}>
                <option value="">Select role</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            {needsStore && (
              <div>
                <label className={labelClass}>Store *</label>
                <select required value={form.storeId} onChange={e => setForm(p => ({ ...p, storeId: e.target.value }))} className={inputClass}>
                  <option value="">Select store</option>
                  {stores.map(s => <option key={s.id} value={s.id}>{s.name}{s.city ? ` — ${s.city}` : ''}</option>)}
                </select>
              </div>
            )}
            {inviteError && (
              <div className="md:col-span-2">
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{inviteError}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <button type="submit" disabled={inviting} className="px-8 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors">
                {inviting ? 'Creating account…' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff table */}
      <div className="bg-white border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
        <div className="grid grid-cols-[1fr_160px_160px_100px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Name</span>
          <span>Role</span>
          <span>Store</span>
          <span>Joined</span>
        </div>
        {staffUsers.map(u => (
          <div key={u.id} className="grid grid-cols-[1fr_160px_160px_100px] gap-4 px-6 py-4 items-center hover:bg-[#F9F9F7] transition-colors">
            <div>
              <p className="text-sm text-arca-ink">
                {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
              </p>
              <p className="text-xs text-arca-stone">{u.email}</p>
            </div>
            <span className={`text-[10px] tracking-wide px-2 py-1 self-start ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-700'}`}>
              {u.role?.replace(/_/g, ' ')}
            </span>
            <p className="text-xs text-arca-stone">{u.stores?.name ?? '—'}</p>
            <p className="text-xs text-arca-stone">
              {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
            </p>
          </div>
        ))}
        {staffUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-arca-stone">No staff users yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
