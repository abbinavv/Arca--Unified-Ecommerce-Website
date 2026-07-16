'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Category = { id: string; name: string }

const SUPABASE_URL = 'https://kpgjktaxddcbsvbowxwx.supabase.co'

function buildUploadPath(file: File): string {
  return `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '', sku: '', description: '', price: '', cost: '',
    brand: '', category_id: '', image_url_1: '', image_url_2: '', image_url_3: '',
  })
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null])
  const [uploading, setUploading] = useState<boolean[]>([false, false, false])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
      supabase.from('products').select('*').eq('id', id).single(),
    ]).then(([{ data: cats }, { data: product, error: pErr }]) => {
      setCategories(cats ?? [])
      if (pErr || !product) { setNotFound(true); setLoading(false); return }
      const urls: string[] = product.image_urls ?? []
      setForm({
        name: product.name ?? '',
        sku: product.sku ?? '',
        description: product.description ?? '',
        price: String(product.price ?? ''),
        cost: String(product.cost ?? ''),
        brand: product.brand ?? '',
        category_id: product.category_id ?? '',
        image_url_1: urls[0] ?? '',
        image_url_2: urls[1] ?? '',
        image_url_3: urls[2] ?? '',
      })
      setPreviews([urls[0] ?? null, urls[1] ?? null, urls[2] ?? null])
      setLoading(false)
    })
  }, [id])

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleFileChange(index: number, file: File | null) {
    if (!file) return
    const urlKey = (['image_url_1', 'image_url_2', 'image_url_3'] as const)[index]
    setUploading(prev => { const n = [...prev]; n[index] = true; return n })
    const supabase = createClient()
    const path = buildUploadPath(file)
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    setUploading(prev => { const n = [...prev]; n[index] = false; return n })
    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      return
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
    set(urlKey, publicUrl)
    setPreviews(prev => { const n = [...prev]; n[index] = publicUrl; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.sku || !form.price) {
      setError('Name, SKU, and price are required.')
      return
    }
    setSaving(true)
    setError('')

    const imageUrls = [form.image_url_1, form.image_url_2, form.image_url_3].filter(Boolean)

    const supabase = createClient()
    const { error: updateError } = await supabase.from('products').update({
      name: form.name,
      sku: form.sku,
      description: form.description || null,
      price: Number(form.price),
      cost: form.cost ? Number(form.cost) : null,
      brand: form.brand || null,
      category_id: form.category_id || null,
      image_urls: imageUrls.length > 0 ? imageUrls : [''],
    }).eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/dashboard/admin/catalog')
    router.refresh()
  }

  async function handleArchive() {
    if (!confirm('Archive this product? It will be hidden from the storefront.')) return
    const supabase = createClient()
    await supabase.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    router.push('/dashboard/admin/catalog')
    router.refresh()
  }

  const inputClass = 'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'
  const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'

  if (loading) return <div className="p-8"><p className="text-sm text-arca-stone">Loading…</p></div>
  if (notFound) return <div className="p-8"><p className="text-sm text-arca-stone">Product not found.</p></div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/admin/catalog" className="text-xs text-arca-stone hover:text-arca-ink transition-colors">
          ← Catalog
        </Link>
        <h1 className="font-display text-3xl font-light text-arca-ink">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Product name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SKU *</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Brand</label>
            <input value={form.brand} onChange={e => set('brand', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className={inputClass}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cost (₹)</label>
            <input type="number" min="0" value={form.cost} onChange={e => set('cost', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors resize-none"
          />
        </div>

        <div>
          <label className={labelClass}>Images (up to 3)</label>
          <div className="space-y-3">
            {([0, 1, 2] as const).map(i => {
              const urlKey = (['image_url_1', 'image_url_2', 'image_url_3'] as const)[i]
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    {previews[i] && (
                      <Image
                        src={previews[i]!}
                        alt={`Preview ${i + 1}`}
                        width={40}
                        height={40}
                        unoptimized={!previews[i]!.startsWith(SUPABASE_URL)}
                        className="w-10 h-10 object-cover border border-[#E8E8E4] flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        ref={fileRefs[i]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileChange(i, e.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => fileRefs[i].current?.click()}
                        disabled={uploading[i]}
                        className="w-full h-10 px-3 border border-dashed border-[#E8E8E4] text-arca-stone text-xs tracking-wide hover:border-arca-ink hover:text-arca-ink transition-colors disabled:opacity-50"
                      >
                        {uploading[i] ? 'Uploading…' : `Choose image ${i + 1}`}
                      </button>
                    </div>
                  </div>
                  <input
                    value={form[urlKey]}
                    onChange={e => {
                      set(urlKey, e.target.value)
                      if (e.target.value) setPreviews(prev => { const n = [...prev]; n[i] = e.target.value; return n })
                    }}
                    className={inputClass}
                    placeholder={`Or paste image ${i + 1} URL`}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/dashboard/admin/catalog" className="px-6 h-11 flex items-center border border-[#E8E8E4] text-arca-charcoal text-xs tracking-arca uppercase hover:border-arca-ink transition-colors">
              Cancel
            </Link>
          </div>
          <button type="button" onClick={handleArchive} className="text-xs text-red-600 hover:text-red-800 transition-colors">
            Archive product
          </button>
        </div>
      </form>
    </div>
  )
}
