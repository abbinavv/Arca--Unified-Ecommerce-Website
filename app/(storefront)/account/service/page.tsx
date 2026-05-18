import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Service — Arca' }

export default function ServicePage() {
  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Service</h1>
      <div className="flex flex-col items-center justify-center py-24 text-center border border-arca-sand">
        <p className="text-sm text-arca-stone mb-2">No active service tickets</p>
        <p className="text-xs text-arca-stone/60 mb-6">Submit a repair or warranty request for a purchased item</p>
        <Link
          href="/account/orders"
          className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
        >
          View orders
        </Link>
      </div>
    </div>
  )
}
