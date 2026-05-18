'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50',
  approved: 'text-blue-700 bg-blue-50',
  dispatched: 'text-indigo-700 bg-indigo-50',
  completed: 'text-green-700 bg-green-50',
  cancelled: 'text-red-700 bg-red-50',
}

type Transfer = {
  id: string
  quantity: number
  status: string
  created_at: string
  products: { name: string; brand: string | null } | null
  from_location: { name: string } | null
  to_location: { name: string } | null
}

type Store = { id: string; name: string; city: string | null }
type Product = { id: string; name: string; sku: string | null; brand: string | null }

export function TransferActions({
  transfers,
  stores,
}: {
  transfers: Transfer[]
  stores: Store[]
}) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // New transfer form state
  const [fromStore, setFromStore] = useState('')
  const [toStore, setToStore] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  async function updateStatus(id: string, newStatus: string) {
    setLoadingId(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('allocations')
      .update({ status: newStatus })
      .eq('id', id)
    if (!error) {
      router.refresh()
    }
    setLoadingId(null)
  }

  async function searchProducts(query: string) {
    setProductSearch(query)
    setSelectedProduct(null)
    setProductId('')
    if (query.length < 2) {
      setProducts([])
      return
    }
    setSearchLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, sku, brand')
      .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
      .limit(8)
    setProducts(data ?? [])
    setSearchLoading(false)
  }

  function selectProduct(p: Product) {
    setSelectedProduct(p)
    setProductId(p.id)
    setProductSearch(p.name + (p.sku ? ` (${p.sku})` : ''))
    setProducts([])
  }

  async function handleCreateTransfer(e: React.FormEvent) {
    e.preventDefault()
    if (!fromStore || !toStore || !productId || !quantity) {
      setFormError('Please fill in all required fields.')
      return
    }
    if (fromStore === toStore) {
      setFormError('From and To stores must be different.')
      return
    }
    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 1) {
      setFormError('Quantity must be a positive number.')
      return
    }
    setFormLoading(true)
    setFormError('')
    const supabase = createClient()
    const { error } = await supabase.from('allocations').insert({
      from_location_id: fromStore,
      to_location_id: toStore,
      product_id: productId,
      quantity: qty,
      status: 'pending',
    })
    if (error) {
      setFormError(error.message)
      setFormLoading(false)
      return
    }
    setFormLoading(false)
    setShowForm(false)
    setFromStore('')
    setToStore('')
    setProductSearch('')
    setProductId('')
    setSelectedProduct(null)
    setQuantity('')
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Transfers</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Transfer'}
        </button>
      </div>

      {/* New Transfer Form */}
      {showForm && (
        <div className="border border-arca-sand p-6 mb-8">
          <h2 className="font-display text-lg font-light text-arca-ink mb-6">New Transfer Request</h2>
          <form onSubmit={handleCreateTransfer} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">From Store *</label>
              <select
                value={fromStore}
                onChange={e => setFromStore(e.target.value)}
                required
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              >
                <option value="">Select store</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name}{s.city ? ` — ${s.city}` : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">To Store *</label>
              <select
                value={toStore}
                onChange={e => setToStore(e.target.value)}
                required
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              >
                <option value="">Select store</option>
                {stores.filter(s => s.id !== fromStore).map(s => (
                  <option key={s.id} value={s.id}>{s.name}{s.city ? ` — ${s.city}` : ''}</option>
                ))}
              </select>
            </div>

            <div className="relative md:col-span-2">
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Product *</label>
              <input
                type="text"
                value={productSearch}
                onChange={e => searchProducts(e.target.value)}
                placeholder="Search by name or SKU…"
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              />
              {searchLoading && (
                <p className="absolute text-xs text-arca-stone mt-1">Searching…</p>
              )}
              {products.length > 0 && (
                <div className="absolute z-10 w-full border border-arca-sand bg-white shadow-sm mt-0.5">
                  {products.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProduct(p)}
                      className="w-full text-left px-4 py-2.5 hover:bg-arca-cream transition-colors"
                    >
                      <p className="text-sm text-arca-ink">{p.name}</p>
                      {(p.brand || p.sku) && (
                        <p className="text-[10px] text-arca-stone">
                          {[p.brand, p.sku ? `SKU: ${p.sku}` : null].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {selectedProduct && (
                <p className="text-[10px] text-arca-stone mt-1">
                  Selected: {selectedProduct.name}
                  {selectedProduct.sku ? ` (SKU: ${selectedProduct.sku})` : ''}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              />
            </div>

            {formError && (
              <div className="md:col-span-2">
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{formError}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formLoading || !productId}
                className="px-8 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
              >
                {formLoading ? 'Submitting…' : 'Submit Transfer Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer List */}
      {transfers.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No transfer requests</p>
        </div>
      ) : (
        <div className="border border-arca-sand divide-y divide-arca-sand">
          {transfers.map(t => (
            <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-6">
              <div className="flex-1">
                {t.products?.brand && (
                  <p className="text-[10px] tracking-arca uppercase text-arca-stone">{t.products.brand}</p>
                )}
                <p className="text-sm text-arca-ink">{t.products?.name ?? '—'}</p>
                <p className="text-xs text-arca-stone mt-0.5">
                  {t.from_location?.name ?? '?'} → {t.to_location?.name ?? '?'}
                </p>
              </div>
              <p className="text-sm font-mono text-arca-ink">Qty: {t.quantity}</p>
              <p className="text-xs text-arca-stone hidden md:block">
                {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <span className={`text-[10px] tracking-wide uppercase px-2 py-1 ${STATUS_STYLE[t.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                {t.status}
              </span>
              <div className="flex items-center gap-2">
                {t.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(t.id, 'approved')}
                      disabled={loadingId === t.id}
                      className="px-3 h-8 bg-arca-ink text-arca-ivory text-[10px] tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(t.id, 'cancelled')}
                      disabled={loadingId === t.id}
                      className="px-3 h-8 border border-arca-sand text-arca-stone text-[10px] tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {t.status === 'approved' && (
                  <button
                    onClick={() => updateStatus(t.id, 'dispatched')}
                    disabled={loadingId === t.id}
                    className="px-3 h-8 bg-arca-ink text-arca-ivory text-[10px] tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
                  >
                    Mark Dispatched
                  </button>
                )}
                {t.status === 'dispatched' && (
                  <button
                    onClick={() => updateStatus(t.id, 'completed')}
                    disabled={loadingId === t.id}
                    className="px-3 h-8 bg-arca-ink text-arca-ivory text-[10px] tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
