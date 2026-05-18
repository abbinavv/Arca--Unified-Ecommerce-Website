import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Service Tickets — Arca Staff' }

const STATUS_STYLE: Record<string, string> = {
  intake: 'text-amber-700 bg-amber-50',
  diagnosed: 'text-blue-700 bg-blue-50',
  estimate_pending: 'text-orange-700 bg-orange-50',
  estimate_sent: 'text-purple-700 bg-purple-50',
  estimate_approved: 'text-green-700 bg-green-50',
  estimate_rejected: 'text-red-700 bg-red-50',
  in_progress: 'text-blue-700 bg-blue-50',
  completed: 'text-arca-stone bg-arca-cream',
  cancelled: 'text-red-700 bg-red-50',
}

export default async function ServiceTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tickets } = await supabase
    .from('service_tickets')
    .select('id, ticket_number, type, status, created_at, estimated_cost, currency, clients(first_name, last_name), products(name)')
    .eq('assigned_to', user!.id)
    .order('created_at', { ascending: false })

  const open = tickets?.filter(t => !['completed', 'cancelled'].includes(t.status)) ?? []
  const closed = tickets?.filter(t => ['completed', 'cancelled'].includes(t.status)) ?? []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Service Tickets</h1>
        <Link
          href="/dashboard/staff/service/new"
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      {/* Open tickets */}
      <section className="mb-10">
        <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Open ({open.length})</h2>
        {open.length === 0 ? (
          <div className="border border-arca-sand py-10 text-center">
            <p className="text-xs text-arca-stone">No open tickets</p>
          </div>
        ) : (
          <div className="divide-y divide-arca-sand border border-arca-sand">
            {open.map((ticket: any) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Closed tickets */}
      {closed.length > 0 && (
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Closed ({closed.length})</h2>
          <div className="divide-y divide-arca-sand border border-arca-sand opacity-60">
            {closed.map((ticket: any) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function TicketRow({ ticket }: { ticket: any }) {
  return (
    <Link
      href={`/dashboard/staff/service/${ticket.id}`}
      className="flex items-center justify-between px-6 py-4 hover:bg-arca-cream transition-colors"
    >
      <div className="flex items-start gap-4">
        <p className="text-sm font-mono text-arca-ink w-20 flex-shrink-0">#{ticket.ticket_number}</p>
        <div>
          <p className="text-sm text-arca-ink">
            {ticket.clients?.first_name} {ticket.clients?.last_name}
          </p>
          {ticket.products?.name && (
            <p className="text-xs text-arca-stone line-clamp-1">{ticket.products.name}</p>
          )}
          <p className="text-xs text-arca-stone/60 mt-0.5 capitalize">{ticket.type?.replace('_', ' ')}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {ticket.estimated_cost && (
          <p className="text-sm font-mono text-arca-ink hidden md:block">
            ₹{Number(ticket.estimated_cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        )}
        <span className={`text-[10px] tracking-wide uppercase px-2 py-1 ${STATUS_STYLE[ticket.status] ?? 'text-arca-stone bg-arca-cream'}`}>
          {ticket.status?.replace(/_/g, ' ')}
        </span>
      </div>
    </Link>
  )
}
