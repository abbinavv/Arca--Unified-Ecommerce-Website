import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sell — Arca Staff' }

export default function SellPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Point of Sale</h1>
      <p className="text-sm text-arca-stone">POS selling flow — coming in next build.</p>
    </div>
  )
}
