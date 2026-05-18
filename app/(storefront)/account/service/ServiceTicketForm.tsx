'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TICKET_TYPES = [
  { value: 'warranty', label: 'Warranty Claim' },
  { value: 'repair', label: 'Repair' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'cleaning', label: 'Cleaning & Restoration' },
  { value: 'exchange', label: 'Exchange Request' },
]

type Product = { id: string; name: string; brand: string | null; sku: string | null }

export function ServiceTicketForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('')
  const [conditionNotes, setConditionNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const filteredProducts = products
    .filter(p => `${p.brand ?? ''} ${p.name} ${p.sku ?? ''}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 20)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!productId || !type || !conditionNotes.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`

    const { error: insertError } = await supabase.from('service_tickets').insert({
      ticket_number: ticketNumber,
      client_id: user!.id,
      product_id: productId,
      type,
      status: 'intake',
      condition_notes: conditionNotes,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  if (success) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-arca-ink mb-1">Service ticket submitted.</p>
        <p className="text-xs text-arca-stone">Our team will review and contact you within 48 hours.</p>
        <button
          onClick={() => { setSuccess(false); setProductId(''); setType(''); setConditionNotes(''); setSearch('') }}
          className="mt-4 text-xs text-arca-gold underline underline-offset-2"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Product *</label>
        <input
          type="text"
          placeholder="Search by name, brand, or SKU..."
          value={search}
          onChange={e => { setSearch(e.target.value); if (productId) setProductId('') }}
          className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors mb-1"
        />
        {search && !productId && (
          <div className="border border-arca-sand divide-y divide-arca-sand max-h-48 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="px-3 py-2 text-xs text-arca-stone">No products found</p>
            ) : filteredProducts.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setProductId(p.id); setSearch(`${p.brand ? p.brand + ' — ' : ''}${p.name}`) }}
                className="w-full text-left px-3 py-2.5 hover:bg-arca-cream transition-colors"
              >
                {p.brand && <span className="text-[10px] text-arca-stone mr-2">{p.brand}</span>}
                <span className="text-sm text-arca-ink">{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Request type *</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          required
          className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
        >
          <option value="">Select type</option>
          {TICKET_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">
          Condition & issue description *
        </label>
        <textarea
          value={conditionNotes}
          onChange={e => setConditionNotes(e.target.value)}
          rows={4}
          required
          placeholder="Describe the condition of the item and what needs attention..."
          className="w-full px-3 py-2.5 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
      >
        {loading ? 'Submitting…' : 'Submit Ticket'}
      </button>
    </form>
  )
}
