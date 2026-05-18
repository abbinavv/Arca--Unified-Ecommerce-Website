import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Stores — Arca Admin' }

export default async function StoresPage() {
  const supabase = await createClient()
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, city, region, type, is_active')
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Stores</h1>
        <button className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors">
          + Add Store
        </button>
      </div>

      <div className="bg-white border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
        <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Store</span>
          <span>City</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        {(stores ?? []).map(store => (
          <div key={store.id} className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 items-center hover:bg-[#F9F9F7] transition-colors">
            <p className="text-sm text-arca-ink">{store.name}</p>
            <p className="text-xs text-arca-stone">{store.city}</p>
            <p className="text-xs text-arca-stone capitalize">{store.type}</p>
            <span className={`text-[10px] tracking-wide px-2 py-1 ${store.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {store.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
        {(!stores || stores.length === 0) && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-arca-stone">No stores yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
