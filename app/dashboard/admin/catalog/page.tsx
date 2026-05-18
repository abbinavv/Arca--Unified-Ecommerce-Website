import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Catalog — Arca Admin' }

export default async function AdminCatalogPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, sku, price, category_id, deleted_at, categories(name)')
    .order('created_at', { ascending: false })

  const active = products?.filter(p => !p.deleted_at) ?? []
  const archived = products?.filter(p => p.deleted_at) ?? []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Catalog</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/admin/catalog/new"
            className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-4 text-xs text-arca-stone">
        <span>{active.length} active</span>
        {archived.length > 0 && <span>{archived.length} archived</span>}
      </div>

      <div className="bg-white border border-[#E8E8E4] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_120px_120px_100px_80px] gap-4 px-6 py-3 border-b border-[#E8E8E4] bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span></span>
          <span>Product</span>
          <span>SKU</span>
          <span>Category</span>
          <span className="text-right">Price</span>
          <span></span>
        </div>
        <div className="divide-y divide-[#E8E8E4]">
          {active.map((product: any) => (
            <div key={product.id} className="grid grid-cols-[40px_1fr_120px_120px_100px_80px] gap-4 px-6 py-3.5 items-center hover:bg-[#F9F9F7] transition-colors">
              <div className="w-8 h-8 bg-arca-bone" />
              <div>
                {product.brand && <p className="text-[10px] text-arca-stone">{product.brand}</p>}
                <p className="text-sm text-arca-ink">{product.name}</p>
              </div>
              <p className="text-xs font-mono text-arca-stone">{product.sku ?? '—'}</p>
              <p className="text-xs text-arca-stone">{(product.categories as any)?.name ?? '—'}</p>
              <p className="text-sm font-mono text-arca-ink text-right">
                ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <div className="flex justify-end">
                <Link
                  href={`/dashboard/admin/catalog/${product.id}`}
                  className="text-xs text-arca-gold hover:text-arca-gold-dk transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {active.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-arca-stone">No products yet.</p>
              <Link href="/dashboard/admin/catalog/new" className="text-xs text-arca-gold mt-2 inline-block">
                Add your first product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
