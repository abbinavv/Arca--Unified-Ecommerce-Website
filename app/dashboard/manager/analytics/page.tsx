import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Arca Manager' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const storeId = staffUser?.store_id

  const now = new Date()
  const d7 = new Date(now.getTime() - 7 * 86400000).toISOString()
  const d30 = new Date(now.getTime() - 30 * 86400000).toISOString()

  const [{ data: orders7 }, { data: orders30 }, { data: topProducts }] = await Promise.all([
    storeId
      ? supabase.from('orders').select('grand_total').eq('store_id', storeId).gte('created_at', d7).not('status', 'in', '(cancelled,refunded)')
      : Promise.resolve({ data: [] }),
    storeId
      ? supabase.from('orders').select('grand_total').eq('store_id', storeId).gte('created_at', d30).not('status', 'in', '(cancelled,refunded)')
      : Promise.resolve({ data: [] }),
    storeId
      ? supabase.from('order_items').select('product_id, quantity, line_total, products(name, brand)').order('line_total', { ascending: false }).limit(10)
      : Promise.resolve({ data: [] }),
  ])

  const rev7 = (orders7 ?? []).reduce((s: number, o: any) => s + Number(o.grand_total), 0)
  const rev30 = (orders30 ?? []).reduce((s: number, o: any) => s + Number(o.grand_total), 0)

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Analytics</h1>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="border border-arca-sand p-6">
          <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">Revenue — 7 days</p>
          <p className="text-2xl font-mono text-arca-ink">
            ₹{rev7.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-arca-stone mt-1">{orders7?.length ?? 0} orders</p>
        </div>
        <div className="border border-arca-sand p-6">
          <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">Revenue — 30 days</p>
          <p className="text-2xl font-mono text-arca-ink">
            ₹{rev30.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-arca-stone mt-1">{orders30?.length ?? 0} orders</p>
        </div>
        <div className="border border-arca-sand p-6">
          <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">Avg. order — 30 days</p>
          <p className="text-2xl font-mono text-arca-ink">
            ₹{orders30?.length ? Math.round(rev30 / orders30.length).toLocaleString('en-IN') : '—'}
          </p>
        </div>
      </div>

      {/* Top products */}
      {topProducts && topProducts.length > 0 && (
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Top Products by Revenue</h2>
          <div className="border border-arca-sand divide-y divide-arca-sand">
            {topProducts.map((row: any, i: number) => (
              <div key={row.product_id ?? i} className="flex items-center justify-between px-6 py-3">
                <div>
                  {row.products?.brand && (
                    <p className="text-[10px] tracking-arca uppercase text-arca-stone">{row.products.brand}</p>
                  )}
                  <p className="text-sm text-arca-ink">{row.products?.name ?? '—'}</p>
                </div>
                <p className="text-sm font-mono text-arca-ink">
                  ₹{Number(row.line_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
