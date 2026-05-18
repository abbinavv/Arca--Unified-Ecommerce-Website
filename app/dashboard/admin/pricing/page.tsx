import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — Arca Admin' }

export default function PricingPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Pricing & Promotions</h1>
      <p className="text-sm text-arca-stone">Regional pricing rules, promotions, and tax configuration.</p>
    </div>
  )
}
