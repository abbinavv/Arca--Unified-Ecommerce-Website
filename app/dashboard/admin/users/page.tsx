import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users — Arca Admin' }

const ROLE_BADGE: Record<string, string> = {
  corporate_admin: 'bg-purple-100 text-purple-800',
  boutique_manager: 'bg-blue-100 text-blue-800',
  inventory_controller: 'bg-indigo-100 text-indigo-800',
  sales_associate: 'bg-green-100 text-green-800',
  service_technician: 'bg-amber-100 text-amber-800',
  aftersales_specialist: 'bg-orange-100 text-orange-800',
}

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: staffUsers } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, role, store_id, created_at, stores(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Staff Users</h1>
        <p className="text-sm text-arca-stone">{staffUsers?.length ?? 0} total</p>
      </div>

      <div className="bg-white border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_160px_160px_100px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Name</span>
          <span>Role</span>
          <span>Store</span>
          <span>Joined</span>
        </div>
        {(staffUsers ?? []).map((u: any) => (
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
            <p className="text-xs text-arca-stone">{(u.stores as any)?.name ?? '—'}</p>
            <p className="text-xs text-arca-stone">
              {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
            </p>
          </div>
        ))}
        {(!staffUsers || staffUsers.length === 0) && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-arca-stone">No staff users yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
