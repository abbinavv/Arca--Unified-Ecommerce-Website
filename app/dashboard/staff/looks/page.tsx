import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sales Looks — Arca Staff' }

export default async function LooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: looks } = await supabase
    .from('sales_looks')
    .select('id, name, is_shared, created_at, product_ids')
    .eq('creator_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Sales Looks</h1>
        <button className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors">
          + Create Look
        </button>
      </div>

      {!looks || looks.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone mb-2">No looks yet</p>
          <p className="text-xs text-arca-stone/60">Create outfit bundles to share with clients</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {looks.map(look => (
            <div key={look.id} className="border border-arca-sand p-5 hover:border-arca-ink transition-colors">
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
    </div>
  )
}
