import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import TicketActions from './TicketActions'

export const metadata: Metadata = { title: 'Service Ticket — Arca Staff' }

const STATUS_STEPS = [
  'intake',
  'diagnosed',
  'estimate_sent',
  'estimate_approved',
  'in_progress',
  'completed',
]

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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ticket } = await supabase
    .from('service_tickets')
    .select(
      `id, ticket_number, type, status, condition_notes, notes,
       estimated_cost, estimate_breakdown, intake_photos,
       created_at, updated_at, currency,
       clients(first_name, last_name, email),
       products(name, sku)`
    )
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const client = ticket.clients as { first_name: string; last_name: string; email: string } | null
  const product = ticket.products as { name: string; sku: string } | null

  const currentStepIndex = STATUS_STEPS.indexOf(ticket.status)
  // For rejected, show after estimate_sent
  const displaySteps =
    ticket.status === 'estimate_rejected'
      ? [...STATUS_STEPS.slice(0, 3), 'estimate_rejected']
      : STATUS_STEPS

  const breakdown = ticket.estimate_breakdown as { labour?: number; parts?: number } | null

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/dashboard/staff/service"
        className="text-xs tracking-arca uppercase text-arca-stone hover:text-arca-ink transition-colors mb-6 inline-block"
      >
        ← Service Tickets
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-light text-arca-ink">
              #{ticket.ticket_number}
            </h1>
            <span
              className={`text-[10px] tracking-wide uppercase px-2 py-1 ${STATUS_STYLE[ticket.status] ?? 'text-arca-stone bg-arca-cream'}`}
            >
              {ticket.status?.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-arca-stone capitalize">
            {ticket.type?.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="text-right">
          {client && (
            <p className="text-sm text-arca-ink">
              {client.first_name} {client.last_name}
            </p>
          )}
          {product && (
            <p className="text-xs text-arca-stone mt-0.5">{product.name}</p>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {displaySteps.map((s, i) => {
            const isActive = s === ticket.status
            const isPast =
              ticket.status !== 'estimate_rejected'
                ? i < currentStepIndex
                : i < displaySteps.indexOf(ticket.status)
            return (
              <div key={s} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isActive
                        ? 'bg-arca-ink'
                        : isPast
                        ? 'bg-arca-charcoal'
                        : 'bg-arca-sand'
                    }`}
                  />
                  <span
                    className={`text-[9px] tracking-wide uppercase mt-1 text-center leading-tight ${
                      isActive ? 'text-arca-ink' : 'text-arca-stone/60'
                    }`}
                  >
                    {s.replace(/_/g, ' ')}
                  </span>
                </div>
                {i < displaySteps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1 mb-4 ${isPast || isActive ? 'bg-arca-charcoal' : 'bg-arca-sand'}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Intake info */}
      <div className="border border-arca-sand p-6 mb-6 space-y-4">
        <h2 className="text-xs tracking-arca uppercase text-arca-stone">Intake Info</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">Client</p>
            <p className="text-arca-ink">
              {client ? `${client.first_name} ${client.last_name}` : '—'}
            </p>
            {client?.email && <p className="text-xs text-arca-stone">{client.email}</p>}
          </div>
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">Product</p>
            <p className="text-arca-ink">{product?.name ?? '—'}</p>
            {product?.sku && <p className="text-xs text-arca-stone font-mono">{product.sku}</p>}
          </div>
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">Created</p>
            <p className="text-arca-ink">
              {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          {ticket.estimated_cost && (
            <div>
              <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">
                Estimated Cost
              </p>
              <p className="text-arca-ink font-mono">
                ₹{Number(ticket.estimated_cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              {breakdown && (
                <p className="text-xs text-arca-stone">
                  Labour ₹{breakdown.labour?.toLocaleString('en-IN') ?? 0} · Parts ₹
                  {breakdown.parts?.toLocaleString('en-IN') ?? 0}
                </p>
              )}
            </div>
          )}
        </div>

        {ticket.condition_notes && (
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">
              Condition Notes
            </p>
            <p className="text-sm text-arca-ink whitespace-pre-wrap">{ticket.condition_notes}</p>
          </div>
        )}

        {ticket.notes && (
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-1">
              Diagnosis Notes
            </p>
            <p className="text-sm text-arca-ink whitespace-pre-wrap">{ticket.notes}</p>
          </div>
        )}

        {/* Intake photos */}
        {ticket.intake_photos && ticket.intake_photos.length > 0 && (
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">
              Intake Photos
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ticket.intake_photos.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square block border border-arca-sand hover:border-arca-ink transition-colors overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Intake photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <TicketActions
        ticket={{
          id: ticket.id,
          status: ticket.status,
          estimated_cost: ticket.estimated_cost,
          estimate_breakdown: breakdown
            ? { labour: breakdown.labour ?? 0, parts: breakdown.parts ?? 0 }
            : null,
        }}
      />
    </div>
  )
}
