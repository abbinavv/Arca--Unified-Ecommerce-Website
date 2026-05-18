import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Catalog — Arca Staff' }

export default async function CatalogPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, sku, price, image_urls')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Catalog</h1>

      {!products || products.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No products in catalog yet</p>
        </div>
      ) : (
        <div className="divide-y divide-arca-sand border border-arca-sand">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 bg-arca-bone flex-shrink-0 overflow-hidden">
                  {p.image_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  {p.brand && <p className="text-[10px] tracking-arca uppercase text-arca-stone">{p.brand}</p>}
                  <p className="text-sm text-arca-ink">{p.name}</p>
                  {p.sku && <p className="text-xs font-mono text-arca-stone/60">{p.sku}</p>}
                </div>
              </div>
              <p className="text-sm font-mono text-arca-ink">
                ₹{p.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
