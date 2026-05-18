import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account — Arca' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: orders }, { data: wishlist }] = await Promise.all([
    supabase
      .from('orders')
      .select('id, order_number, status, grand_total, created_at')
      .eq('client_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user!.id),
  ])

  const TILES = [
    { href: '/account/orders', label: 'Orders', value: orders?.length ?? 0, suffix: 'recent' },
    { href: '/account/wishlist', label: 'Wishlist', value: wishlist?.length ?? 0, suffix: 'saved' },
  ]

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Overview</h1>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {TILES.map(tile => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group p-6 border border-arca-sand hover:border-arca-ink transition-colors"
          >
            <p className="text-3xl font-mono text-arca-ink mb-1">{tile.value}</p>
            <p className="text-xs text-arca-stone">{tile.suffix} {tile.label.toLowerCase()}</p>
            <p className="text-[10px] tracking-arca uppercase text-arca-gold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      {orders && orders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs tracking-arca uppercase text-arca-stone">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors">
              See all
            </Link>
          </div>
          <div className="divide-y divide-arca-sand border border-arca-sand">
            {orders.map(order => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-arca-cream transition-colors"
              >
                <div>
                  <p className="text-sm text-arca-ink font-mono">#{order.order_number}</p>
                  <p className="text-xs text-arca-stone mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-arca-ink">
                    ₹{Number(order.grand_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'text-amber-600',
    confirmed: 'text-blue-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600',
  }
  return (
    <span className={`text-[10px] tracking-wide uppercase ${map[status] ?? 'text-arca-stone'}`}>
      {status}
    </span>
  )
}
