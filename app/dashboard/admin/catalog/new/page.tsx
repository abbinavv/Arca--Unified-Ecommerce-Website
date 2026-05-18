'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '', sku: '', description: '', price: '', cost: '',
    brand: '', category_id: '', image_url_1: '', image_url_2: '', image_url_3: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categories').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.sku || !form.price) {
      setError('Name, SKU, and price are required.')
      return
    }
    setLoading(true)
    setError('')

    const imageUrls = [form.image_url_1, form.image_url_2, form.image_url_3].filter(Boolean)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('products').insert({
      name: form.name,
      sku: form.sku,
      description: form.description || null,
      price: Number(form.price),
      cost: form.cost ? Number(form.cost) : null,
      brand: form.brand || null,
      category_id: form.category_id || null,
      image_urls: imageUrls.length > 0 ? imageUrls : [''],
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/admin/catalog')
    router.refresh()
  }

  const inputClass = 'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'
  const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/admin/catalog" className="text-xs text-arca-stone hover:text-arca-ink transition-colors">
          ← Catalog
        </Link>
        <h1 className="font-display text-3xl font-light text-arca-ink">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Product name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required className={inputClass} placeholder="Analogue Dress Watch" />
          </div>
          <div>
            <label className={labelClass}>SKU *</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)} required className={inputClass} placeholder="ADW-001" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Brand</label>
            <input value={form.brand} onChange={e => set('brand', e.target.value)} className={inputClass} placeholder="Cartier" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className={inputClass}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} required className={inputClass} placeholder="245000" />
          </div>
          <div>
            <label className={labelClass}>Cost (₹)</label>
            <input type="number" min="0" value={form.cost} onChange={e => set('cost', e.target.value)} className={inputClass} placeholder="145000" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors resize-none"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label className={labelClass}>Image URLs</label>
          <div className="space-y-2">
            {(['image_url_1', 'image_url_2', 'image_url_3'] as const).map((key, i) => (
              <input key={key} value={form[key]} onChange={e => set(key, e.target.value)} className={inputClass} placeholder={`Image ${i + 1} URL`} />
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors">
            {loading ? 'Saving…' : 'Create Product'}
          </button>
          <Link href="/dashboard/admin/catalog" className="px-6 h-11 flex items-center border border-[#E8E8E4] text-arca-charcoal text-xs tracking-arca uppercase hover:border-arca-ink transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
