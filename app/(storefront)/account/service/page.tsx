import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { ServiceTicketForm } from './ServiceTicketForm'

export const metadata: Metadata = { title: 'Service — Arca' }

const STATUS_COLOR: Record<string, string> = {
  intake: 'text-blue-700 bg-blue-50',
  diagnosed: 'text-indigo-700 bg-indigo-50',
  estimate_pending: 'text-amber-700 bg-amber-50',
  estimate_sent: 'text-amber-700 bg-amber-50',
  estimate_approved: 'text-green-700 bg-green-50',
  in_progress: 'text-blue-700 bg-blue-50',
  completed: 'text-green-800 bg-green-100',
  closed: 'text-arca-stone bg-arca-cream',
}

type ServiceTicket = {
  id: string
  ticket_number: string | null
  type: string
  status: string
  condition_notes: string | null
  estimated_cost: number | null
  estimate_total: number | null
  created_at: string
  products: { name: string | null; brand: string | null } | null
}

export default async function ServicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: tickets }, { data: products }] = await Promise.all([
    supabase
      .from('service_tickets')
      .select('id, ticket_number, type, status, condition_notes, estimated_cost, estimate_total, created_at, products(name, brand)')
      .eq('client_id', user!.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('id, name, brand, sku')
      .is('deleted_at', null)
      .order('name'),
  ])

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Service</h1>

      <div className="border border-arca-sand p-6 mb-10">
        <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-6">Submit a Request</h2>
        <ServiceTicketForm products={products ?? []} />
      </div>

      {tickets && tickets.length > 0 ? (
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">
            Your Tickets ({tickets.length})
          </h2>
          <div className="space-y-3">
            {tickets.map((t: ServiceTicket) => (
              <div key={t.id} className="border border-arca-sand px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-xs font-mono text-arca-stone">#{t.ticket_number}</p>
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 ${STATUS_COLOR[t.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                      {t.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-arca-ink">
                    {t.products?.brand ? `${t.products.brand} — ` : ''}
                    {t.products?.name ?? 'Unknown product'}
                  </p>
                  <p className="text-xs text-arca-stone capitalize mt-0.5">
                    {t.type?.replace(/_/g, ' ')}
                  </p>
                  {t.condition_notes && (
                    <p className="text-xs text-arca-stone/70 mt-1 max-w-sm truncate">{t.condition_notes}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-arca-stone">
                    {new Date(t.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: '2-digit',
                    })}
                  </p>
                  {(t.estimate_total || t.estimated_cost) && (
                    <p className="text-sm font-mono text-arca-ink mt-1">
                      Est. ₹{Number(t.estimate_total ?? t.estimated_cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="py-16 text-center border border-arca-sand">
          <p className="text-sm text-arca-stone mb-1">No service tickets yet</p>
          <p className="text-xs text-arca-stone/60">Submit a repair or warranty request above</p>
        </div>
      )}
    </div>
  )
}
