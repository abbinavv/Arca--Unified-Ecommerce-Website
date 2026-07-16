'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Client = { id: string; first_name: string; last_name: string; email: string }
type Product = { id: string; name: string; brand: string | null; price: number; sku: string | null }
type CartItem = Product & { quantity: number }
type Step = 'client' | 'products' | 'review' | 'done'

function generateOrderNumber() {
  return `ORD-${Date.now().toString().slice(-8)}`
}

export default function SellPage() {
  const [step, setStep] = useState<Step>('client')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [fulfillment, setFulfillment] = useState('in_store')
  const [paymentMethod, setPaymentMethod] = useState('pay_in_store')
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  const [clientQuery, setClientQuery] = useState('')
  const [clientResults, setClientResults] = useState<Client[]>([])
  const [productQuery, setProductQuery] = useState('')
  const [productResults, setProductResults] = useState<Product[]>([])

  async function searchClients(q: string) {
    if (q.length < 2) { setClientResults([]); return }
    const supabase = createClient()
    const { data } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email')
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(8)
    setClientResults(data ?? [])
  }

  async function searchProducts(q: string) {
    if (q.length < 2) { setProductResults([]); return }
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, brand, price, sku')
      .is('deleted_at', null)
      .or(`name.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%`)
      .limit(10)
    setProductResults((data ?? []) as Product[])
  }

  function addToCart(p: Product) {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...p, quantity: 1 }]
    })
    setProductQuery('')
    setProductResults([])
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id))
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const discountAmt = subtotal * (discount / 100)
  const afterDiscount = subtotal - discountAmt
  const gst = afterDiscount * 0.18
  const total = afterDiscount + gst

  async function createOrder() {
    if (!selectedClient || cart.length === 0) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get associate's store_id so order is visible in manager portal
    const { data: staffUser } = await supabase
      .from('users')
      .select('store_id')
      .eq('id', user!.id)
      .single()

    const num = generateOrderNumber()
    const clientId = selectedClient.id === 'walkin' ? null : selectedClient.id

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        client_id: clientId,
        store_id: staffUser?.store_id ?? null,
        order_number: num,
        status: 'confirmed',
        channel: 'in_store',
        fulfillment_type: fulfillment,
        subtotal,
        tax_total: gst,
        discount_total: discountAmt,
        grand_total: total,
        associate_id: user!.id,
      })
      .select('id, order_number')
      .single()

    if (orderErr || !order) {
      setError(orderErr?.message ?? 'Failed to create order')
      setLoading(false)
      return
    }

    const orderItems = cart.map(i => ({
      order_id: order.id,
      product_id: i.id,
      quantity: i.quantity,
      unit_price: i.price,
      line_total: i.price * i.quantity,
    }))
    await supabase.from('order_items').insert(orderItems)

    setOrderNumber(order.order_number)
    setStep('done')
    setLoading(false)
  }

  const STEPS: Step[] = ['client', 'products', 'review']
  const STEP_LABELS: Record<Step, string> = { client: 'Client', products: 'Products', review: 'Review', done: 'Done' }

  if (step === 'done') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 border border-arca-gold mb-6 flex items-center justify-center">
          <svg className="w-7 h-7 text-arca-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Order Created</h1>
        <p className="text-sm text-arca-stone mb-1">
          For {selectedClient?.first_name} {selectedClient?.id !== 'walkin' ? selectedClient?.last_name : '(Walk-in)'}
        </p>
        <p className="text-xs font-mono text-arca-charcoal mt-2 mb-8">#{orderNumber}</p>
        <button
          onClick={() => { setStep('client'); setSelectedClient(null); setCart([]); setDiscount(0); setOrderNumber('') }}
          className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          New Sale
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Point of Sale</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-6 mb-8 text-xs tracking-arca uppercase">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              if (s === 'client') setStep('client')
              else if (s === 'products' && selectedClient) setStep('products')
              else if (s === 'review' && cart.length > 0) setStep('review')
            }}
            className={`flex items-center gap-2 ${step === s ? 'text-arca-ink' : 'text-arca-stone'}`}
          >
            <span className={`w-5 h-5 flex items-center justify-center text-[10px] border ${step === s ? 'border-arca-ink bg-arca-ink text-arca-ivory' : 'border-arca-sand'}`}>
              {i + 1}
            </span>
            {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Step 1 — Client */}
      {step === 'client' && (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Search client</label>
            <input
              type="text"
              value={clientQuery}
              onChange={e => { setClientQuery(e.target.value); searchClients(e.target.value) }}
              placeholder="Name or email..."
              className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
            />
            {clientResults.length > 0 && (
              <div className="border border-arca-sand border-t-0 divide-y divide-arca-sand">
                {clientResults.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setSelectedClient(c); setClientResults([]); setClientQuery(''); setStep('products') }}
                    className="w-full text-left px-4 py-3 hover:bg-arca-cream transition-colors"
                  >
                    <p className="text-sm text-arca-ink">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-arca-stone">{c.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedClient({ id: 'walkin', first_name: 'Walk-in', last_name: '', email: '' })
              setStep('products')
            }}
            className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors underline underline-offset-2"
          >
            Continue as walk-in
          </button>
        </div>
      )}

      {/* Step 2 — Products */}
      {step === 'products' && (
        <div className="space-y-6">
          <p className="text-sm text-arca-charcoal">
            Customer: <span className="font-medium">{selectedClient?.first_name} {selectedClient?.last_name}</span>
          </p>

          <div className="max-w-md">
            <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Add product</label>
            <input
              type="text"
              value={productQuery}
              onChange={e => { setProductQuery(e.target.value); searchProducts(e.target.value) }}
              placeholder="Search by name, brand, or SKU..."
              className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
            />
            {productResults.length > 0 && (
              <div className="border border-arca-sand border-t-0 divide-y divide-arca-sand">
                {productResults.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addToCart(p)}
                    className="w-full text-left px-4 py-3 hover:bg-arca-cream transition-colors flex justify-between items-center"
                  >
                    <div>
                      {p.brand && <span className="text-[10px] text-arca-stone mr-2">{p.brand}</span>}
                      <span className="text-sm text-arca-ink">{p.name}</span>
                    </div>
                    <span className="text-sm font-mono text-arca-charcoal">
                      ₹{Number(p.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border border-arca-sand max-w-lg">
              <div className="divide-y divide-arca-sand">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3 gap-4">
                    <div className="flex-1 min-w-0">
                      {item.brand && <p className="text-[10px] text-arca-stone">{item.brand}</p>}
                      <p className="text-sm text-arca-ink truncate">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 border border-arca-sand text-arca-stone hover:border-arca-ink transition-colors text-xs">−</button>
                      <span className="text-sm font-mono w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 border border-arca-sand text-arca-stone hover:border-arca-ink transition-colors text-xs">+</button>
                    </div>
                    <p className="text-sm font-mono text-arca-ink w-20 text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-arca-sand px-5 py-2.5 flex justify-between">
                <span className="text-xs text-arca-stone">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                <span className="text-sm font-mono text-arca-ink">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep('review')}
            disabled={cart.length === 0}
            className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-40 transition-colors"
          >
            Review Order →
          </button>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 'review' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-3">Fulfillment</label>
              <div className="space-y-2">
                {[['in_store', 'In Store'], ['bopis', 'BOPIS'], ['standard', 'Ship to Customer']] .map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="fulfillment" value={val} checked={fulfillment === val} onChange={e => setFulfillment(e.target.value)} className="accent-arca-ink" />
                    <span className="text-sm text-arca-charcoal">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-3">Payment</label>
              <div className="space-y-2">
                {[['pay_in_store', 'Cash / POS Terminal'], ['card', 'Card (Stripe)']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={e => setPaymentMethod(e.target.value)} className="accent-arca-ink" />
                    <span className="text-sm text-arca-charcoal">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Discount %</label>
              <div className="flex items-center gap-2">
                {[0, 5, 10, 15, 20].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscount(d)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${discount === d ? 'bg-arca-ink text-arca-ivory border-arca-ink' : 'border-arca-sand text-arca-charcoal hover:border-arca-ink'}`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-arca-sand p-6 h-fit">
            <h3 className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">Order Summary</h3>
            <div className="space-y-1.5 text-sm mb-4">
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-arca-charcoal">
                  <span className="truncate mr-2">{i.name} × {i.quantity}</span>
                  <span className="font-mono flex-shrink-0">₹{(i.price * i.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-arca-sand pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-arca-stone">
                <span>Subtotal</span><span className="font-mono">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({discount}%)</span><span className="font-mono">−₹{discountAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <div className="flex justify-between text-arca-stone">
                <span>GST (18%)</span><span className="font-mono">₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-arca-ink font-medium text-sm pt-2 border-t border-arca-sand">
                <span>Total</span><span className="font-mono">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 mt-4">{error}</p>}

            <button
              onClick={createOrder}
              disabled={loading}
              className="w-full mt-6 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing…' : 'Create Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
