import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Appointments — Arca' }

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Appointments</h1>
      <div className="flex flex-col items-center justify-center py-24 text-center border border-arca-sand">
        <p className="text-sm text-arca-stone mb-2">No upcoming appointments</p>
        <p className="text-xs text-arca-stone/60 mb-6">Book a private session at one of our boutiques</p>
        <Link
          href="/stores"
          className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
        >
          Find a boutique
        </Link>
      </div>
    </div>
  )
}
