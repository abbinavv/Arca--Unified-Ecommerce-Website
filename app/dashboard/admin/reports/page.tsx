import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reports — Arca Admin' }

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Reports</h1>
      <p className="text-sm text-arca-stone">CSV exports for orders, inventory, and customer data.</p>
    </div>
  )
}
