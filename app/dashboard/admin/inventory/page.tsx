import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inventory — Arca Admin' }

export default async function AdminInventoryPage() {
  const supabase = await createClient()

  const { data: inventory } = await supabase
    .from('inventory')
    .select('id, quantity, reserved_quantity, available_qty, products(name, brand, sku), stores!inventory_location_id_fkey(name)')
    .order('available_qty', { ascending: true })
    .limit(100)

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Inventory — All Stores</h1>

      <div className="bg-white border border-[#E8E8E4] overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_80px_80px_80px] gap-4 px-6 py-3 border-b border-[#E8E8E4] bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Product</span>
          <span>Store</span>
          <span className="text-right">On hand</span>
          <span className="text-right">Reserved</span>
          <span className="text-right">Available</span>
        </div>
        <div className="divide-y divide-[#E8E8E4]">
          {(inventory ?? []).map((row: any) => (
            <div key={row.id} className="grid grid-cols-[1fr_140px_80px_80px_80px] gap-4 px-6 py-3.5 items-center hover:bg-[#F9F9F7] transition-colors">
              <div>
                {row.products?.brand && <p className="text-[10px] text-arca-stone">{row.products.brand}</p>}
                <p className="text-sm text-arca-ink">{row.products?.name ?? '—'}</p>
              </div>
              <p className="text-xs text-arca-stone">{(row.stores as any)?.name ?? '—'}</p>
              <p className="text-sm font-mono text-arca-ink text-right">{row.quantity}</p>
              <p className="text-sm font-mono text-arca-stone text-right">{row.reserved_quantity}</p>
              <p className={`text-sm font-mono text-right ${(row.available_qty ?? 0) <= 2 ? 'text-amber-700 font-medium' : 'text-arca-ink'}`}>
                {row.available_qty}
              </p>
            </div>
          ))}
          {(!inventory || inventory.length === 0) && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-arca-stone">No inventory data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
