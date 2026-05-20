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
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setPhotos(files)
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

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

    // Upload photos first
    const photoUrls: string[] = []
    for (const file of photos) {
      const ext = file.name.split('.').pop()
      const path = `${user!.id}/${ticketNumber}/${Date.now()}.${ext}`
      const { data: uploaded } = await supabase.storage
        .from('service-ticket-photos')
        .upload(path, file, { upsert: false })
      if (uploaded) {
        const { data: { publicUrl } } = supabase.storage
          .from('service-ticket-photos')
          .getPublicUrl(uploaded.path)
        photoUrls.push(publicUrl)
      }
    }

    const { error: insertError } = await supabase.from('service_tickets').insert({
      ticket_number: ticketNumber,
      client_id: user!.id,
      product_id: productId,
      type,
      status: 'intake',
      condition_notes: conditionNotes,
      ...(photoUrls.length > 0 && { notes: `Photos: ${photoUrls.join(', ')}` }),
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
      <div className="py-6 text-center">
        <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 mx-auto mb-4">
          <circle cx="28" cy="28" r="24" stroke="#B8952A" strokeWidth="1.2"
            strokeDasharray="151" strokeDashoffset="151"
            style={{ animation: 'draw-circle 0.45s ease-out 0.05s forwards' }} />
          <path d="M17 28l8 8 14-16" stroke="#B8952A" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="36" strokeDashoffset="36"
            style={{ animation: 'draw-tick 0.3s ease-out 0.45s forwards' }} />
          <style>{`@keyframes draw-circle{to{stroke-dashoffset:0}}@keyframes draw-tick{to{stroke-dashoffset:0}}`}</style>
        </svg>
        <p className="text-sm text-arca-ink mb-0.5">Ticket submitted</p>
        <p className="text-xs text-arca-stone">Our team will review and contact you within 48 hours.</p>
        <button
          onClick={() => { setSuccess(false); setProductId(''); setType(''); setConditionNotes(''); setSearch(''); setPhotos([]) }}
          className="mt-5 text-xs text-arca-gold underline underline-offset-2 hover:text-arca-gold-dk transition-colors"
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

      {/* Photo upload */}
      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">
          Photos <span className="normal-case text-arca-stone">(up to 5, optional)</span>
        </label>
        <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-arca-sand hover:border-arca-charcoal transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-arca-stone flex-shrink-0">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span className="text-xs text-arca-stone">
            {photos.length > 0 ? `${photos.length} file${photos.length > 1 ? 's' : ''} selected` : 'Upload photos of the item'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
        {photos.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {photos.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover border border-arca-sand"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-arca-ink text-arca-ivory text-[9px] flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
