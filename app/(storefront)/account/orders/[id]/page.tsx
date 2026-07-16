import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ new?: string }>

type OrderItem = {
  id: string
  quantity: number
  line_total: number
  products: { name: string | null; brand: string | null; image_urls: string[] | null } | null
}

export const metadata: Metadata = { title: 'Order — Arca' }

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { id } = await params
  const { new: isNew } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, brand, image_urls))')
    .eq('id', id)
    .eq('client_id', user!.id)
    .single()

  if (!order) notFound()

  const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div>
      {isNew && (
        <div className="mb-8 p-6 border border-arca-sand bg-arca-cream flex items-center gap-5">
          <svg viewBox="0 0 44 44" fill="none" className="w-11 h-11 flex-shrink-0">
            <circle
              cx="22" cy="22" r="19"
              stroke="#B8952A" strokeWidth="1.2"
              strokeDasharray="120" strokeDashoffset="120"
              style={{ animation: 'draw-circle 0.45s ease-out 0.05s forwards' }}
            />
            <path
              d="M13 22l6 6 12-12"
              stroke="#B8952A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="28" strokeDashoffset="28"
              style={{ animation: 'draw-tick 0.3s ease-out 0.45s forwards' }}
            />
            <style>{`
              @keyframes draw-circle { to { stroke-dashoffset: 0; } }
              @keyframes draw-tick   { to { stroke-dashoffset: 0; } }
            `}</style>
          </svg>
          <div>
            <p className="text-sm font-medium text-arca-ink">Your order has been placed</p>
            <p className="text-xs text-arca-stone mt-0.5">We&apos;ll confirm and prepare your items. Expect an update within 24 hours.</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/account/orders" className="text-xs text-arca-stone hover:text-arca-ink transition-colors">
          ← Orders
        </Link>
        <span className="text-arca-sand">/</span>
        <h1 className="font-display text-2xl font-light text-arca-ink">
          Order #{order.order_number}
        </h1>
      </div>

      {/* Status timeline */}
      {order.status !== 'cancelled' && (
        <div className="mb-10 p-6 border border-arca-sand">
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full border ${
                    i <= currentStep
                      ? 'bg-arca-ink border-arca-ink'
                      : 'bg-transparent border-arca-sand'
                  }`} />
                  <p className={`text-[9px] tracking-wide uppercase mt-2 ${
                    i <= currentStep ? 'text-arca-ink' : 'text-arca-stone/50'
                  }`}>
                    {step}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mb-4 ${i < currentStep ? 'bg-arca-ink' : 'bg-arca-sand'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_280px] gap-8">
        {/* Items */}
        <div>
          <h2 className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">Items</h2>
          <div className="divide-y divide-arca-sand border border-arca-sand">
            {(order.order_items ?? []).map((item: OrderItem) => (
              <div key={item.id} className="flex items-start gap-4 p-4">
                <div className="w-16 h-20 bg-arca-bone flex-shrink-0 overflow-hidden">
                  {item.products?.image_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.products.image_urls[0]}
                      alt={item.products?.name ?? 'Product'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  {item.products?.brand && (
                    <p className="text-[10px] tracking-arca uppercase text-arca-stone">{item.products.brand}</p>
                  )}
                  <p className="text-sm text-arca-ink">{item.products?.name ?? 'Product'}</p>
                  <p className="text-xs text-arca-stone mt-1">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-mono text-arca-ink whitespace-nowrap">
                  ₹{Number(item.line_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="p-6 border border-arca-sand">
            <h2 className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-arca-charcoal">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(order.subtotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              {order.discount_total > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-mono">−₹{Number(order.discount_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <div className="flex justify-between text-arca-stone text-xs">
                <span>Tax</span>
                <span className="font-mono">₹{Number(order.tax_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-arca-ink font-medium pt-2 border-t border-arca-sand">
                <span className="text-xs tracking-wide uppercase">Total</span>
                <span className="font-mono">₹{Number(order.grand_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-arca-sand">
            <h2 className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Details</h2>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-arca-stone">Order date</dt>
                <dd className="text-arca-ink">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-arca-stone">Channel</dt>
                <dd className="text-arca-ink capitalize">{order.channel?.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-arca-stone">Fulfillment</dt>
                <dd className="text-arca-ink capitalize">{order.fulfillment_type?.replace('_', ' ')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
