'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCartStore } from '@/stores/cartStore'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ── Step types ────────────────────────────────────────────────────────────────

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
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [address, setAddress] = useState<Address | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const gst = subtotal * 0.18
  const grand = Math.round((subtotal + gst) * 100) // paise

  useEffect(() => {
    if (items.length === 0) router.replace('/shop')
  }, [items, router])

  async function handleAddressSubmit(addr: Address) {
    setAddress(addr)
    // Create PaymentIntent
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountInPaise: grand,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity })),
      }),
    })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setStep(3)
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
            {(['Address', 'Payment'] as const).map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <span className="w-8 h-px bg-arca-sand" />}
                <span className={step === i + 1 || (i === 1 && step === 3) ? 'text-arca-ink' : ''}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-16">
          {/* Left — steps */}
          <div>
            {step === 1 && (
              <AddressStep onNext={handleAddressSubmit} />
            )}
            {step === 3 && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0A0A08',
                      colorBackground: '#FAFAF7',
                      fontFamily: 'DM Sans, sans-serif',
                      borderRadius: '0px',
                      colorText: '#0A0A08',
                    },
                  },
                }}
              >
                <PaymentStep address={address!} />
              </Elements>
            )}
          </div>

          {/* Right — order summary */}
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

  const field = (
    key: keyof Address,
    label: string,
    placeholder: string,
    required = true
  ) => (
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
        Continue to Payment
      </button>
    </form>
  )
}

// ── Payment step ──────────────────────────────────────────────────────────────

function PaymentStep({ address }: { address: Address }) {
  const stripe = useStripe()
  const elements = useElements()
  const clearCart = useCartStore(s => s.clearCart)
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/orders`,
        shipping: {
          name: address.fullName,
          address: {
            line1: address.line1,
            line2: address.line2 || undefined,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: 'IN',
          },
        },
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed')
      setLoading(false)
    } else {
      clearCart()
      router.push('/account/orders')
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <h2 className="font-display text-3xl font-light text-arca-ink mb-8">Payment</h2>

      {/* Address summary */}
      <div className="p-4 border border-arca-sand text-sm text-arca-charcoal space-y-0.5">
        <p className="font-medium text-arca-ink">{address.fullName}</p>
        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p>{address.city}, {address.state} {address.postalCode}</p>
      </div>

      <PaymentElement />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing…' : 'Place Order'}
      </button>

      <p className="text-[11px] text-arca-stone text-center">
        Secured by Stripe. Your payment info is never stored on our servers.
      </p>
    </form>
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
