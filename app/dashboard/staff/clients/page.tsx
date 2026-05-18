'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Client = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  city: string | null
}

export default function ClientelingPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email, phone, city')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('first_name')
      .limit(20)

    setResults(data ?? [])
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Clients</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="flex-1 px-4 py-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/60 focus:outline-none focus:border-arca-ink transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {loading && (
        <p className="text-sm text-arca-stone">Searching…</p>
      )}

      {!loading && !searched && (
        <div className="border border-arca-sand py-20 text-center">
          <div className="w-10 h-10 border border-arca-sand mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-arca-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-arca-ink mb-1">No clients found</p>
          <p className="text-xs text-arca-stone">Search by name, email, or phone</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="border border-arca-sand py-20 text-center">
          <div className="w-10 h-10 border border-arca-sand mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-arca-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-arca-ink mb-1">No clients found</p>
          <p className="text-xs text-arca-stone">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="border border-arca-sand divide-y divide-arca-sand">
          {results.map(client => (
            <Link
              key={client.id}
              href={`/dashboard/staff/clients/${client.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-arca-cream transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-arca-bone flex items-center justify-center text-xs font-medium text-arca-charcoal">
                  {(client.first_name?.[0] ?? client.email[0]).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-arca-ink">
                    {[client.first_name, client.last_name].filter(Boolean).join(' ') || '—'}
                  </p>
                  <p className="text-xs text-arca-stone">{client.email}</p>
                </div>
              </div>
              <div className="text-right">
                {client.phone && <p className="text-xs text-arca-stone">{client.phone}</p>}
                {client.city && <p className="text-xs text-arca-stone/60">{client.city}</p>}
                <span className="text-arca-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
