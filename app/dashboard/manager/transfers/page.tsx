import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Transfers — Arca Manager' }

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50',
  approved: 'text-blue-700 bg-blue-50',
  dispatched: 'text-indigo-700 bg-indigo-50',
  completed: 'text-green-700 bg-green-50',
  cancelled: 'text-red-700 bg-red-50',
}

export default async function TransfersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const storeId = staffUser?.store_id
  const { data: transfers } = storeId
    ? await supabase
        .from('allocations')
        .select('id, quantity, status, created_at, products(name, brand), from_location:stores!allocations_from_location_id_fkey(name), to_location:stores!allocations_to_location_id_fkey(name)')
        .or(`from_location_id.eq.${storeId},to_location_id.eq.${storeId}`)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Transfers</h1>

      {!transfers || transfers.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No transfer requests</p>
        </div>
      ) : (
        <div className="border border-arca-sand divide-y divide-arca-sand">
          {transfers.map((t: any) => (
            <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-6">
              <div className="flex-1">
                {t.products?.brand && (
                  <p className="text-[10px] tracking-arca uppercase text-arca-stone">{t.products.brand}</p>
                )}
                <p className="text-sm text-arca-ink">{t.products?.name ?? '—'}</p>
                <p className="text-xs text-arca-stone mt-0.5">
                  {t.from_location?.name ?? '?'} → {t.to_location?.name ?? '?'}
                </p>
              </div>
              <p className="text-sm font-mono text-arca-ink">Qty: {t.quantity}</p>
              <p className="text-xs text-arca-stone hidden md:block">
                {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <span className={`text-[10px] tracking-wide uppercase px-2 py-1 ${STATUS_STYLE[t.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
