import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inventory — Arca Manager' }

interface InventoryRow {
  id: string
  quantity: number
  reserved_quantity: number
  available_qty: number | null
  products: { id: string; name: string; brand: string | null; sku: string } | null
}

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const { data: inventory } = staffUser?.store_id
    ? await supabase
        .from('inventory')
        .select('id, quantity, reserved_quantity, available_qty, products(id, name, brand, sku)')
        .eq('location_id', staffUser.store_id)
        .order('available_qty', { ascending: true })
    : { data: [] }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Inventory</h1>
        <div className="flex gap-3">
          <span className="text-xs text-arca-stone self-center">
            {inventory?.length ?? 0} items
          </span>
        </div>
      </div>

      {!inventory || inventory.length === 0 ? (
        <div className="border border-arca-sand py-20 text-center">
          <div className="w-10 h-10 border border-arca-sand mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-arca-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <p className="text-sm text-arca-ink mb-1">No inventory tracked</p>
          <p className="text-xs text-arca-stone">Add products to this store to see stock levels</p>
        </div>
      ) : (
        <div className="border border-arca-sand overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-6 py-3 border-b border-arca-sand bg-arca-cream text-[10px] tracking-arca uppercase text-arca-stone">
            <span>Product</span>
            <span className="text-right">On hand</span>
            <span className="text-right">Reserved</span>
            <span className="text-right">Available</span>
          </div>
          <div className="divide-y divide-arca-sand">
            {inventory.map((row: InventoryRow) => {
              const low = (row.available_qty ?? 0) <= 2
              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-[1fr_80px_80px_80px] gap-4 px-6 py-4 items-center ${low ? 'bg-amber-50' : ''}`}
                >
                  <div>
                    {row.products?.brand && (
                      <p className="text-[10px] tracking-arca uppercase text-arca-stone">{row.products.brand}</p>
                    )}
                    <p className="text-sm text-arca-ink">{row.products?.name ?? '—'}</p>
                    {row.products?.sku && (
                      <p className="text-xs font-mono text-arca-stone/60">{row.products.sku}</p>
                    )}
                  </div>
                  <p className="text-sm font-mono text-arca-ink text-right">{row.quantity}</p>
                  <p className="text-sm font-mono text-arca-stone text-right">{row.reserved_quantity}</p>
                  <p className={`text-sm font-mono text-right font-medium ${low ? 'text-amber-700' : 'text-arca-ink'}`}>
                    {row.available_qty}
                    {low && <span className="ml-1 text-[9px]">↓</span>}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
