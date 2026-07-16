'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Address = {
  fullName: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
}

// ── Root flow ─────────────────────────────────────────────────────────────────

export function CheckoutFlow() {
  const items = useCartStore(s => s.items)
  const subtotal = useCartStore(s => s.subtotal)()
  const clearCart = useCartStore(s => s.clearCart)
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (items.length === 0 && !orderNumber) router.replace('/shop')
  }, [items, router, orderNumber])

  const gst = subtotal * 0.18
  const grand = subtotal + gst

  async function handleAddressSubmit(addr: Address) {
    setAddress(addr)
    setStep(2)
  }

  async function placeOrder() {
    if (!address) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Route order to nearest store by city
      const cityNorm = address.city.trim().toLowerCase()
      const CITY_STORE: Record<string, string> = {
        'mumbai':    '11111111-0000-0000-0000-000000000001',
        'new delhi': '11111111-0000-0000-0000-000000000002',
        'delhi':     '11111111-0000-0000-0000-000000000002',
        'bengaluru': '11111111-0000-0000-0000-000000000003',
        'bangalore': '11111111-0000-0000-0000-000000000003',
      }
      const storeId = CITY_STORE[cityNorm] ?? '11111111-0000-0000-0000-000000000001'

      const num = `ORD-${Date.now().toString().slice(-8)}`

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          client_id: user?.id ?? null,
          store_id: storeId,
          order_number: num,
          status: 'pending',
          channel: 'online',
          fulfillment_type: 'standard',
          subtotal,
          tax_total: gst,
          grand_total: grand,
          notes: `Ship to: ${address.fullName}, ${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`,
        })
        .select('id, order_number')
        .single()

      if (orderErr || !order) {
        setError(orderErr?.message ?? 'Failed to place order')
        setLoading(false)
        return
      }

      // Insert order items
      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.quantity,
        unit_price: i.price,
        line_total: i.price * i.quantity,
      }))
      await supabase.from('order_items').insert(orderItems)

      // Deduct inventory for each item at the routed store.
      // `decrement_inventory` isn't present in the generated Database types yet,
      // so the RPC name/args are asserted via a minimal, explicit function signature
      // instead of casting the whole client to `any`.
      const decrementInventory = supabase.rpc.bind(supabase) as (
        fn: 'decrement_inventory',
        args: { p_product_id: string; p_location_id: string; p_qty: number }
      ) => PromiseLike<{ error: { message: string } | null }>
      for (const item of items) {
        await decrementInventory('decrement_inventory', {
          p_product_id: item.id,
          p_location_id: storeId,
          p_qty: item.quantity,
        })
      }

      clearCart()
      setOrderId(order.id)
      setOrderNumber(order.order_number)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (orderNumber) {
    return (
      <div className="min-h-screen bg-arca-ivory flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          {/* Animated tick */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
              <circle
                cx="40" cy="40" r="36"
                stroke="#B8952A" strokeWidth="1.2"
                strokeDasharray="226" strokeDashoffset="226"
                style={{ animation: 'draw-circle 0.5s ease-out 0.1s forwards' }}
              />
              <path
                d="M24 40l11 11 21-22"
                stroke="#B8952A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="50" strokeDashoffset="50"
                style={{ animation: 'draw-tick 0.35s ease-out 0.55s forwards' }}
              />
            </svg>
          </div>
          <style>{`
            @keyframes draw-circle { to { stroke-dashoffset: 0; } }
            @keyframes draw-tick   { to { stroke-dashoffset: 0; } }
          `}</style>
          <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Order Placed</h1>
          <p className="text-sm text-arca-stone mb-1">Thank you for your order.</p>
          <p className="text-xs font-mono text-arca-stone/70 mt-2 mb-8 tracking-widest">#{orderNumber}</p>
          <div className="flex flex-col gap-3 items-center">
            <Link
              href={`/account/orders/${orderId}?new=1`}
              className="inline-block px-8 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
            >
              View Order
            </Link>
            <Link href="/shop" className="text-xs text-arca-stone hover:text-arca-gold transition-colors">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-arca-ivory">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="font-display text-2xl font-light tracking-[0.3em] uppercase text-arca-ink">
            Arca
          </Link>
          <div className="flex items-center gap-3 text-xs tracking-wide text-arca-stone">
            {['Address', 'Confirm'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <span className="w-8 h-px bg-arca-sand" />}
                <span className={step === i + 1 ? 'text-arca-ink' : ''}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-16">
          <div>
            {step === 1 && <AddressStep onNext={handleAddressSubmit} />}
            {step === 2 && address && (
              <ConfirmStep
                address={address}
                onBack={() => setStep(1)}
                onPlace={placeOrder}
                loading={loading}
                error={error}
              />
            )}
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

// ── Address step ──────────────────────────────────────────────────────────────

function AddressStep({ onNext }: { onNext: (addr: Address) => void }) {
  const [form, setForm] = useState<Address>({
    fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '',
  })

  function set(key: keyof Address, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext(form)
  }

  const field = (key: keyof Address, label: string, placeholder: string, required = true) => (
    <div>
      <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">
        {label}{required && ' *'}
      </label>
      <input
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-display text-3xl font-light text-arca-ink mb-8">Delivery address</h2>
      {field('fullName', 'Full name', 'Your name')}
      {field('line1', 'Address line 1', 'Street address')}
      {field('line2', 'Address line 2', 'Apartment, suite, etc.', false)}
      <div className="grid grid-cols-2 gap-4">
        {field('city', 'City', 'Mumbai')}
        {field('state', 'State', 'Maharashtra')}
      </div>
      {field('postalCode', 'Postal code', '400001')}
      <button
        type="submit"
        className="w-full py-4 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors mt-4"
      >
        Continue →
      </button>
    </form>
  )
}

// ── Confirm step ──────────────────────────────────────────────────────────────

function ConfirmStep({
  address, onBack, onPlace, loading, error,
}: {
  address: Address
  onBack: () => void
  onPlace: () => void
  loading: boolean
  error: string
}) {
  return (
    <div className="space-y-8">
      <h2 className="font-display text-3xl font-light text-arca-ink">Confirm Order</h2>

      <div className="p-5 border border-arca-sand space-y-1">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Delivery to</p>
        <p className="text-sm font-medium text-arca-ink">{address.fullName}</p>
        <p className="text-sm text-arca-charcoal">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p className="text-sm text-arca-charcoal">{address.city}, {address.state} {address.postalCode}</p>
      </div>

      <div className="p-5 border border-arca-sand">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Payment</p>
        <p className="text-sm text-arca-charcoal">Cash on Delivery</p>
        <p className="text-xs text-arca-stone mt-1">Pay when your order arrives.</p>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-arca-sand text-arca-charcoal text-xs tracking-arca uppercase hover:border-arca-ink transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onPlace}
          disabled={loading}
          className="flex-1 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
        >
          {loading ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

// ── Order summary sidebar ─────────────────────────────────────────────────────

function OrderSummary() {
  const items = useCartStore(s => s.items)
  const subtotal = useCartStore(s => s.subtotal)()
  const gst = subtotal * 0.18
  const grand = subtotal + gst

  return (
    <aside className="bg-arca-cream p-8 h-fit">
      <h3 className="text-[10px] tracking-arca uppercase text-arca-stone mb-6">Order Summary</h3>

      <ul className="space-y-4 mb-6 pb-6 border-b border-arca-sand">
        {items.map(item => (
          <li key={item.id} className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {item.brand && (
                <p className="text-[10px] text-arca-stone tracking-wide">{item.brand}</p>
              )}
              <p className="text-xs text-arca-ink line-clamp-2">{item.name}</p>
              <p className="text-[11px] text-arca-stone mt-0.5">Qty {item.quantity}</p>
            </div>
            <span className="text-xs font-mono text-arca-ink whitespace-nowrap">
              ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-arca-charcoal">
          <span>Subtotal</span>
          <span className="font-mono">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-arca-stone text-xs">
          <span>GST (18%)</span>
          <span className="font-mono">₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-arca-ink font-medium pt-3 border-t border-arca-sand">
          <span className="text-xs tracking-wide uppercase">Total</span>
          <span className="font-mono">₹{grand.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </aside>
  )
}
