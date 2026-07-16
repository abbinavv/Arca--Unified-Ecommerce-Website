import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — Arca Admin' }

export default async function PricingPage() {
  const supabase = await createClient()

  type PromotionRule = {
    id: string
    code: string
    description: string | null
    discount_type: string
    discount_value: number
    min_order_amount: number | null
    max_uses: number | null
    uses_count: number | null
    valid_from: string | null
    valid_until: string | null
    is_active: boolean
  }

  type TaxRate = {
    id: string
    name: string
    rate: number
    region: string | null
    category: string | null
    is_active: boolean
  }

  const db = supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        order: (column: string, opts?: { ascending: boolean }) => {
          limit: (n: number) => Promise<{ data: unknown[] | null }>
        } & Promise<{ data: unknown[] | null }>
      }
    }
  }
  const [{ data: promotionsRaw }, { data: taxRatesRaw }] = await Promise.all([
    db
      .from('promotion_rules')
      .select('id, code, description, discount_type, discount_value, min_order_amount, max_uses, uses_count, valid_from, valid_until, is_active')
      .order('created_at', { ascending: false })
      .limit(50),
    db
      .from('tax_rates')
      .select('id, name, rate, region, category, is_active')
      .order('name'),
  ])
  const promotions = promotionsRaw as PromotionRule[] | null
  const taxRates = taxRatesRaw as TaxRate[] | null

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Pricing & Promotions</h1>

      {/* Promotions */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-arca uppercase text-arca-stone">Promotion Codes</h2>
        </div>

        {!promotions || promotions.length === 0 ? (
          <div className="border border-[#E8E8E4] py-12 text-center">
            <p className="text-sm text-arca-stone">No promotion rules configured</p>
          </div>
        ) : (
          <div className="border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
            <div className="grid grid-cols-[120px_1fr_100px_100px_80px_80px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
              <span>Code</span>
              <span>Description</span>
              <span>Discount</span>
              <span>Min Order</span>
              <span>Uses</span>
              <span>Status</span>
            </div>
            {promotions.map((promo: PromotionRule) => {
              const isExpired = promo.valid_until && new Date(promo.valid_until) < new Date()
              return (
                <div key={promo.id} className="grid grid-cols-[120px_1fr_100px_100px_80px_80px] gap-4 px-6 py-3.5 items-center">
                  <p className="text-sm font-mono text-arca-ink">{promo.code}</p>
                  <p className="text-xs text-arca-stone truncate">{promo.description ?? '—'}</p>
                  <p className="text-sm font-mono text-arca-ink">
                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₹${Number(promo.discount_value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  </p>
                  <p className="text-xs font-mono text-arca-stone">
                    {promo.min_order_amount ? `₹${Number(promo.min_order_amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
                  </p>
                  <p className="text-xs font-mono text-arca-stone">
                    {promo.uses_count ?? 0}{promo.max_uses ? `/${promo.max_uses}` : ''}
                  </p>
                  <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 inline-block ${!promo.is_active || isExpired ? 'text-arca-stone bg-arca-cream' : 'text-green-700 bg-green-50'}`}>
                    {!promo.is_active ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Tax rates */}
      <section>
        <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Tax Rates</h2>

        {!taxRates || taxRates.length === 0 ? (
          <div className="border border-[#E8E8E4] py-12 text-center">
            <p className="text-sm text-arca-stone">No tax rates configured</p>
          </div>
        ) : (
          <div className="border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
            <div className="grid grid-cols-[1fr_120px_120px_120px_80px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
              <span>Name</span>
              <span>Rate</span>
              <span>Region</span>
              <span>Category</span>
              <span>Status</span>
            </div>
            {taxRates.map((tax: TaxRate) => (
              <div key={tax.id} className="grid grid-cols-[1fr_120px_120px_120px_80px] gap-4 px-6 py-3.5 items-center">
                <p className="text-sm text-arca-ink">{tax.name}</p>
                <p className="text-sm font-mono text-arca-ink">{tax.rate}%</p>
                <p className="text-xs text-arca-stone">{tax.region ?? 'All'}</p>
                <p className="text-xs text-arca-stone">{tax.category ?? 'All'}</p>
                <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 inline-block ${tax.is_active ? 'text-green-700 bg-green-50' : 'text-arca-stone bg-arca-cream'}`}>
                  {tax.is_active ? 'Active' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
