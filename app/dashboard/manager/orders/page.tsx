import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders — Arca Manager' }

type SearchParams = Promise<{ filter?: string }>

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50',
  confirmed: 'text-blue-700 bg-blue-50',
  processing: 'text-blue-700 bg-blue-50',
  ready_for_pickup: 'text-green-700 bg-green-50',
  shipped: 'text-indigo-700 bg-indigo-50',
  delivered: 'text-green-800 bg-green-100',
  cancelled: 'text-red-700 bg-red-50',
}

export default async function ManagerOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { filter } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  let query = supabase
    .from('orders')
    .select('id, order_number, status, fulfillment_type, grand_total, created_at, clients(first_name, last_name)')
    .order('created_at', { ascending: false })

  if (staffUser?.store_id) query = query.eq('store_id', staffUser.store_id)
  if (filter === 'bopis') query = query.eq('fulfillment_type', 'bopis').eq('status', 'ready_for_pickup')

  const { data: orders } = await query.limit(100)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">
          {filter === 'bopis' ? 'BOPIS Queue' : 'Orders'}
        </h1>
        <div className="flex gap-2">
          <a
            href="/dashboard/manager/orders"
            className={`px-3 py-1.5 text-xs tracking-wide border transition-colors ${!filter ? 'bg-arca-ink text-arca-ivory border-arca-ink' : 'border-arca-sand text-arca-charcoal hover:border-arca-ink'}`}
          >
            All
          </a>
          <a
            href="/dashboard/manager/orders?filter=bopis"
            className={`px-3 py-1.5 text-xs tracking-wide border transition-colors ${filter === 'bopis' ? 'bg-arca-ink text-arca-ivory border-arca-ink' : 'border-arca-sand text-arca-charcoal hover:border-arca-ink'}`}
          >
            BOPIS
          </a>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="border border-arca-sand py-20 text-center">
          <div className="w-10 h-10 border border-arca-sand mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-arca-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <p className="text-sm text-arca-ink mb-1">No orders yet</p>
          <p className="text-xs text-arca-stone">Orders placed at this store will appear here</p>
        </div>
      ) : (
        <div className="border border-arca-sand divide-y divide-arca-sand">
          {orders.map((order: any) => (
            <div key={order.id} className="grid grid-cols-[120px_1fr_120px_140px_100px] gap-4 px-6 py-4 items-center hover:bg-arca-cream transition-colors">
              <p className="text-sm font-mono text-arca-ink">#{order.order_number}</p>
              <div>
                <p className="text-sm text-arca-ink">
                  {order.clients?.first_name} {order.clients?.last_name}
                </p>
                <p className="text-xs text-arca-stone capitalize">
                  {order.fulfillment_type?.replace(/_/g, ' ')}
                </p>
              </div>
              <p className="text-xs text-arca-stone">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-sm font-mono text-arca-ink">
                ₹{Number(order.grand_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <span className={`text-[10px] tracking-wide uppercase px-2 py-1 text-center ${STATUS_STYLE[order.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                {order.status?.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
