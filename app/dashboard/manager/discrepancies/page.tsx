import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Discrepancies — Arca Manager' }

interface DiscrepancyRow {
  id: string
  expected_qty: number
  counted_qty: number
  variance: number | null
  discrepancy_type: string | null
  status: string
  notes: string | null
  created_at: string
  products: { name: string | null; brand: string | null; sku: string | null } | null
}

export default async function DiscrepanciesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const { data: items } = staffUser?.store_id
    ? await supabase
        .from('inventory_discrepancies')
        .select('id, expected_qty, counted_qty, variance, discrepancy_type, status, notes, created_at, products(name, brand, sku)')
        .eq('store_id', staffUser.store_id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const pending = items?.filter(i => i.status === 'pending') ?? []
  const resolved = items?.filter(i => i.status !== 'pending') ?? []

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Discrepancies</h1>

      <section className="mb-10">
        <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Pending ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="border border-arca-sand py-10 text-center">
            <p className="text-xs text-arca-stone">No pending discrepancies</p>
          </div>
        ) : (
          <div className="border border-arca-sand divide-y divide-arca-sand">
            {pending.map((row: DiscrepancyRow) => (
              <div key={row.id} className="px-6 py-4 flex items-center justify-between gap-6">
                <div className="flex-1">
                  {row.products?.brand && (
                    <p className="text-[10px] tracking-arca uppercase text-arca-stone">{row.products.brand}</p>
                  )}
                  <p className="text-sm text-arca-ink">{row.products?.name ?? '—'}</p>
                  {row.products?.sku && <p className="text-xs font-mono text-arca-stone/60">{row.products.sku}</p>}
                </div>
                <div className="flex items-center gap-8 text-sm font-mono">
                  <div className="text-center">
                    <p className="text-[10px] text-arca-stone mb-0.5">Expected</p>
                    <p className="text-arca-ink">{row.expected_qty}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-arca-stone mb-0.5">Counted</p>
                    <p className="text-arca-ink">{row.counted_qty}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-arca-stone mb-0.5">Variance</p>
                    <p className={(row.variance ?? 0) < 0 ? 'text-red-700' : 'text-green-700'}>
                      {(row.variance ?? 0) > 0 ? '+' : ''}{row.variance}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] tracking-wide uppercase text-amber-700 bg-amber-50 px-2 py-1">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Resolved ({resolved.length})</h2>
          <div className="border border-arca-sand divide-y divide-arca-sand opacity-60">
            {resolved.map((row: DiscrepancyRow) => (
              <div key={row.id} className="px-6 py-3 flex items-center justify-between gap-4">
                <p className="text-sm text-arca-ink">{row.products?.name ?? '—'}</p>
                <span className="text-xs font-mono text-arca-stone">
                  Variance: {(row.variance ?? 0) > 0 ? '+' : ''}{row.variance}
                </span>
                <span className="text-[10px] tracking-wide uppercase text-green-700 bg-green-50 px-2 py-1">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
