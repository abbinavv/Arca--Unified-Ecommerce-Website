'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Look = {
  id: string
  name: string
  is_shared: boolean
  created_at: string
  product_ids: string[]
  thumbnail_source: string | null
}

type ProductResult = {
  id: string
  name: string
  sku: string
}

const SUPABASE_STORAGE_URL =
  'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/look-thumbnails'

const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'
const inputClass =
  'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'

export default function LooksPage() {
  const [looks, setLooks] = useState<Look[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  // Form state
  const [lookName, setLookName] = useState('')
  const [productQuery, setProductQuery] = useState('')
  const [productResults, setProductResults] = useState<ProductResult[]>([])
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<ProductResult[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isShared, setIsShared] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  async function fetchLooks() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('sales_looks')
      .select('id, name, is_shared, created_at, product_ids, thumbnail_source')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
    setLooks(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchLooks() }, [])

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

  function addProduct(p: ProductResult) {
    if (!selectedProducts.find(sp => sp.id === p.id)) {
      setSelectedProducts(prev => [...prev, p])
    }
    setProductQuery('')
    setProductResults([])
    setProductDropdownOpen(false)
  }

  function removeProduct(id: string) {
    setSelectedProducts(prev => prev.filter(p => p.id !== id))
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setLookName('')
    setProductQuery('')
    setProductResults([])
    setSelectedProducts([])
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setIsShared(false)
    setFormError(null)
  }

  function closeModal() {
    resetForm()
    setModalOpen(false)
  }

  async function handleSubmit() {
    if (!lookName.trim()) { setFormError('Look name is required.'); return }
    setSubmitting(true)
    setFormError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: userData } = await supabase
        .from('users')
        .select('store_id, first_name, last_name')
        .eq('id', user.id)
        .single()

      let thumbnailSource: string | null = null

      if (thumbnailFile) {
        const path = `looks/${Date.now()}-${thumbnailFile.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('look-thumbnails')
          .upload(path, thumbnailFile, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        thumbnailSource = `${SUPABASE_STORAGE_URL}/${path}`
      }

      const creatorName = [userData?.first_name, userData?.last_name].filter(Boolean).join(' ') || user.email || ''

      const { error: insertError } = await supabase.from('sales_looks').insert({
        creator_id: user.id,
        creator_name: creatorName,
        store_id: userData?.store_id ?? '',
        name: lookName.trim(),
        product_ids: selectedProducts.map(p => p.id),
        thumbnail_source: thumbnailSource,
        is_shared: isShared,
      })

      if (insertError) throw insertError

      await fetchLooks()
      closeModal()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Sales Looks</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          + Create Look
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-arca-stone">Loading…</p>
      ) : !looks || looks.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone mb-2">No looks yet</p>
          <p className="text-xs text-arca-stone/60">Create outfit bundles to share with clients</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {looks.map(look => (
            <div key={look.id} className="border border-arca-sand p-5 hover:border-arca-ink transition-colors">
              {look.thumbnail_source && (
                <div className="aspect-square mb-3 border border-arca-sand overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={look.thumbnail_source}
                    alt={look.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-arca-ink">{look.name}</p>
                {look.is_shared && (
                  <span className="text-[10px] tracking-arca uppercase text-arca-gold">Shared</span>
                )}
              </div>
              <p className="text-xs text-arca-stone">
                {look.product_ids?.length ?? 0} piece{look.product_ids?.length !== 1 ? 's' : ''}
              </p>
              <p className="text-[11px] text-arca-stone/60 mt-2">
                {new Date(look.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Look Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10,10,8,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-arca-sand">
              <h2 className="font-display text-xl font-light text-arca-ink">Create Look</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-arca-stone hover:text-arca-ink transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Look name */}
              <div>
                <label className={labelClass}>Look Name *</label>
                <input
                  type="text"
                  value={lookName}
                  onChange={e => setLookName(e.target.value)}
                  placeholder="e.g. Summer Evening…"
                  className={inputClass}
                />
              </div>

              {/* Product search */}
              <div>
                <label className={labelClass}>Products</label>

                {/* Selected chips */}
                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedProducts.map(p => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-arca-cream border border-arca-sand text-xs text-arca-ink"
                      >
                        {p.name}
                        <button
                          type="button"
                          onClick={() => removeProduct(p.id)}
                          className="text-arca-stone hover:text-arca-ink transition-colors leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

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
                          onMouseDown={() => addProduct(p)}
                          className="w-full text-left px-3 py-2.5 hover:bg-arca-cream transition-colors"
                        >
                          <p className="text-sm text-arca-ink">{p.name}</p>
                          <p className="text-xs text-arca-stone font-mono">{p.sku}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className={labelClass}>Thumbnail</label>
                {thumbnailPreview && (
                  <div className="mb-2 w-24 h-24 border border-arca-sand overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="px-4 h-9 border border-arca-sand text-arca-stone text-xs tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink transition-colors"
                >
                  {thumbnailFile ? 'Change Image' : '+ Upload Image'}
                </button>
              </div>

              {/* Is shared */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is-shared"
                  checked={isShared}
                  onChange={e => setIsShared(e.target.checked)}
                  className="w-4 h-4 accent-arca-ink"
                />
                <label htmlFor="is-shared" className="text-xs tracking-arca uppercase text-arca-stone cursor-pointer">
                  Share with clients
                </label>
              </div>

              {formError && (
                <p className="text-xs text-red-600">{formError}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating…' : 'Create Look'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-6 h-10 border border-arca-sand text-arca-stone text-xs tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
