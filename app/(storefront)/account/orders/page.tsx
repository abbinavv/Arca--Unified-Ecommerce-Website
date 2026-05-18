import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders — Arca' }

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  confirmed: 'text-blue-700 bg-blue-50',
  processing: 'text-blue-700 bg-blue-50',
  shipped: 'text-indigo-700 bg-indigo-50',
  delivered: 'text-green-700 bg-green-50',
  cancelled: 'text-red-700 bg-red-50',
  refunded: 'text-gray-600 bg-gray-100',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, grand_total, channel, created_at')
    .eq('client_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-arca-sand">
          <p className="text-sm text-arca-stone mb-4">No orders yet</p>
          <Link
            href="/shop"
            className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-arca-sand border border-arca-sand">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between px-6 py-5 hover:bg-arca-cream transition-colors group"
            >
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm font-mono text-arca-ink">#{order.order_number}</p>
                  <p className="text-xs text-arca-stone mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="hidden md:block text-[10px] tracking-wide uppercase text-arca-stone">
                  {order.channel?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className={`hidden md:inline-block text-[10px] tracking-wide uppercase px-2 py-1 ${STATUS_COLORS[order.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                  {order.status}
                </span>
                <p className="text-sm font-mono text-arca-ink">
                  ₹{Number(order.grand_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <span className="text-arca-stone group-hover:text-arca-ink transition-colors text-sm">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
