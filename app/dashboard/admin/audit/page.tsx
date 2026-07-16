import { createAdminClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Audit Log — Arca Admin' }

export default async function AuditLogPage() {
  const supabase = await createAdminClient()

  type AuditLog = {
    id: string
    action: string
    table_name: string
    created_at: string
    users: { first_name: string | null; last_name: string | null; email: string } | null
  }

  const { data: logs } = (await supabase
    .from('admin_audit_logs')
    .select('id, action, table_name, created_at, users(first_name, last_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)) as unknown as { data: AuditLog[] | null }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Audit Log</h1>

      <div className="bg-white border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
        <div className="grid grid-cols-[180px_1fr_140px_120px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Time</span>
          <span>Action</span>
          <span>Table</span>
          <span>By</span>
        </div>
        {(logs ?? []).map((log) => (
          <div key={log.id} className="grid grid-cols-[180px_1fr_140px_120px] gap-4 px-6 py-3.5 items-center">
            <p className="text-xs font-mono text-arca-stone">
              {new Date(log.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-arca-ink">{log.action}</p>
            <p className="text-xs font-mono text-arca-stone">{log.table_name}</p>
            <p className="text-xs text-arca-stone truncate">
              {log.users?.first_name ?? log.users?.email ?? '—'}
            </p>
          </div>
        ))}
        {(!logs || logs.length === 0) && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-arca-stone">No audit logs yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
