'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ClientResult = {
  id: string
  first_name: string
  last_name: string
  email: string
}

type ProductResult = {
  id: string
  name: string
  sku: string
}

const TICKET_TYPES = [
  { value: 'warranty_claim', label: 'Warranty Claim' },
  { value: 'repair', label: 'Repair' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'other', label: 'Other' },
]

const SUPABASE_STORAGE_URL =
  'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/service-ticket-photos'

export default function NewServiceTicketPage() {
  const router = useRouter()

  // Step
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1 — client
  const [clientQuery, setClientQuery] = useState('')
  const [clientResults, setClientResults] = useState<ClientResult[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientResult | null>(null)
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false)

  // Step 1 — product
  const [productQuery, setProductQuery] = useState('')
  const [productResults, setProductResults] = useState<ProductResult[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(null)
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [manualProduct, setManualProduct] = useState('')
  const [useManualProduct, setUseManualProduct] = useState(false)

  // Step 2
  const [ticketType, setTicketType] = useState('repair')
  const [conditionNotes, setConditionNotes] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function searchClients(q: string) {
    if (!q.trim()) { setClientResults([]); return }
    const supabase = createClient()
    const { data } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email')
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(8)
    setClientResults(data ?? [])
    setClientDropdownOpen(true)
  }

  async function searchProducts(q: string) {
    if (!q.trim()) { setProductResults([]); return }
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, sku')
      .or(`name.ilike.%${q}%,sku.ilike.%${q}%`)
      .limit(8)
    setProductResults(data ?? [])
    setProductDropdownOpen(true)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles(prev => [...prev, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setPhotoPreviews(prev => [...prev, ...previews])
  }

  function removePhoto(index: number) {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit() {
    if (!selectedClient) { setError('Please select a client.'); return }
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get store_id
      const { data: userData } = await supabase
        .from('users')
        .select('store_id, first_name, last_name')
        .eq('id', user.id)
        .single()

      // Upload photos
      const photoUrls: string[] = []
      for (const file of photoFiles) {
        const path = `tickets/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('service-ticket-photos')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        photoUrls.push(`${SUPABASE_STORAGE_URL}/${path}`)
      }

      const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`

      const { data: ticket, error: insertError } = await supabase
        .from('service_tickets')
        .insert({
          ticket_number: ticketNumber,
          client_id: selectedClient.id,
          product_id: selectedProduct?.id ?? null,
          assigned_to: user.id,
          store_id: userData?.store_id ?? null,
          type: ticketType,
          status: 'intake',
          condition_notes: conditionNotes || null,
          intake_photos: photoUrls.length > 0 ? photoUrls : null,
        })
        .select('id')
        .single()

      if (insertError) throw insertError

      router.push(`/dashboard/staff/service/${ticket.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'
  const inputClass =
    'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink mb-1">New Service Ticket</h1>
        <p className="text-xs text-arca-stone">Step {step} of 2</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map(s => (
          <div
            key={s}
            className={`h-1 flex-1 transition-colors ${s <= step ? 'bg-arca-ink' : 'bg-arca-sand'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Client search */}
          <div>
            <label className={labelClass}>Client *</label>
            {selectedClient ? (
              <div className="flex items-center justify-between px-3 py-2.5 border border-arca-ink bg-arca-cream">
                <div>
                  <p className="text-sm text-arca-ink">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </p>
                  <p className="text-xs text-arca-stone">{selectedClient.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedClient(null); setClientQuery('') }}
                  className="text-xs text-arca-stone hover:text-arca-ink transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={clientQuery}
                  onChange={e => { setClientQuery(e.target.value); searchClients(e.target.value) }}
                  onBlur={() => setTimeout(() => setClientDropdownOpen(false), 150)}
                  placeholder="Search by name or email…"
                  className={inputClass}
                />
                {clientDropdownOpen && clientResults.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 border border-arca-sand bg-white shadow-sm">
                    {clientResults.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={() => {
                          setSelectedClient(c)
                          setClientDropdownOpen(false)
                          setClientQuery('')
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-arca-cream transition-colors"
                      >
                        <p className="text-sm text-arca-ink">
                          {c.first_name} {c.last_name}
                        </p>
                        <p className="text-xs text-arca-stone">{c.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product search or manual */}
          <div>
            <label className={labelClass}>Product</label>
            <div className="flex items-center gap-3 mb-3">
              <button
                type="button"
                onClick={() => { setUseManualProduct(false); setManualProduct('') }}
                className={`text-xs tracking-arca uppercase transition-colors ${!useManualProduct ? 'text-arca-ink' : 'text-arca-stone'}`}
              >
                Search catalogue
              </button>
              <span className="text-arca-sand text-xs">|</span>
              <button
                type="button"
                onClick={() => { setUseManualProduct(true); setSelectedProduct(null); setProductQuery('') }}
                className={`text-xs tracking-arca uppercase transition-colors ${useManualProduct ? 'text-arca-ink' : 'text-arca-stone'}`}
              >
                Enter manually
              </button>
            </div>

            {useManualProduct ? (
              <input
                type="text"
                value={manualProduct}
                onChange={e => setManualProduct(e.target.value)}
                placeholder="Product name…"
                className={inputClass}
              />
            ) : selectedProduct ? (
              <div className="flex items-center justify-between px-3 py-2.5 border border-arca-ink bg-arca-cream">
                <div>
                  <p className="text-sm text-arca-ink">{selectedProduct.name}</p>
                  <p className="text-xs text-arca-stone font-mono">{selectedProduct.sku}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedProduct(null); setProductQuery('') }}
                  className="text-xs text-arca-stone hover:text-arca-ink transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={productQuery}
                  onChange={e => { setProductQuery(e.target.value); searchProducts(e.target.value) }}
                  onBlur={() => setTimeout(() => setProductDropdownOpen(false), 150)}
                  placeholder="Search by name or SKU…"
                  className={inputClass}
                />
                {productDropdownOpen && productResults.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 border border-arca-sand bg-white shadow-sm">
                    {productResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={() => {
                          setSelectedProduct(p)
                          setProductDropdownOpen(false)
                          setProductQuery('')
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-arca-cream transition-colors"
                      >
                        <p className="text-sm text-arca-ink">{p.name}</p>
                        <p className="text-xs text-arca-stone font-mono">{p.sku}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!selectedClient) { setError('Please select a client first.'); return }
              setError(null)
              setStep(2)
            }}
            className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
          >
            Continue →
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Type */}
          <div>
            <label className={labelClass}>Ticket Type *</label>
            <select
              value={ticketType}
              onChange={e => setTicketType(e.target.value)}
              className={inputClass}
            >
              {TICKET_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition notes */}
          <div>
            <label className={labelClass}>Condition Notes</label>
            <textarea
              value={conditionNotes}
              onChange={e => setConditionNotes(e.target.value)}
              rows={4}
              placeholder="Describe the item's current condition…"
              className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className={labelClass}>Intake Photos</label>
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover border border-arca-sand"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-arca-ink text-arca-ivory text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 h-9 border border-arca-sand text-arca-stone text-xs tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink transition-colors"
            >
              + Add Photos
            </button>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null) }}
              className="px-6 h-10 border border-arca-sand text-arca-stone text-xs tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
