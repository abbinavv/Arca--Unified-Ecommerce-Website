'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Ticket = {
  id: string
  status: string
  estimated_cost: number | null
  estimate_breakdown: { labour: number; parts: number } | null
}

interface Props {
  ticket: Ticket
}

const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'
const inputClass =
  'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'

export default function TicketActions({ ticket }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Diagnosis fields
  const [diagnosisNotes, setDiagnosisNotes] = useState('')
  const [recommendedAction, setRecommendedAction] = useState('')
  const [partsNeeded, setPartsNeeded] = useState('')

  // Estimate fields
  const [labourCost, setLabourCost] = useState(
    ticket.estimate_breakdown?.labour?.toString() ?? ''
  )
  const [partsCost, setPartsCost] = useState(
    ticket.estimate_breakdown?.parts?.toString() ?? ''
  )
  const total =
    (parseFloat(labourCost) || 0) + (parseFloat(partsCost) || 0)

  async function updateTicket(updates: Record<string, string | number | null | boolean>) {
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await (supabase as any)
      .from('service_tickets')
      .update(updates)
      .eq('id', ticket.id)
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    router.refresh()
    setSaving(false)
  }

  const status = ticket.status

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-xs text-red-600 px-4 py-2 border border-red-200 bg-red-50">{error}</p>
      )}

      {/* Diagnosis section — shown when intake or diagnosed */}
      {(status === 'intake' || status === 'diagnosed') && (
        <div className="border border-arca-sand p-6 space-y-4">
          <h3 className="text-xs tracking-arca uppercase text-arca-stone">Diagnosis</h3>

          <div>
            <label className={labelClass}>Diagnosis Notes</label>
            <textarea
              value={diagnosisNotes}
              onChange={e => setDiagnosisNotes(e.target.value)}
              rows={4}
              placeholder="Describe findings…"
              className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors resize-none"
            />
          </div>

          <div>
            <label className={labelClass}>Recommended Action</label>
            <input
              type="text"
              value={recommendedAction}
              onChange={e => setRecommendedAction(e.target.value)}
              placeholder="e.g. Full strap replacement…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Parts Needed</label>
            <textarea
              value={partsNeeded}
              onChange={e => setPartsNeeded(e.target.value)}
              rows={2}
              placeholder="List parts required…"
              className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              updateTicket({
                notes: [diagnosisNotes, recommendedAction, partsNeeded]
                  .filter(Boolean)
                  .join('\n\n---\n\n') || null,
                status: 'diagnosed',
                updated_at: new Date().toISOString(),
              })
            }
            className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Diagnosis'}
          </button>
        </div>
      )}

      {/* Estimate section — shown when diagnosed */}
      {status === 'diagnosed' && (
        <div className="border border-arca-sand p-6 space-y-4">
          <h3 className="text-xs tracking-arca uppercase text-arca-stone">Estimate</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Labour Cost (₹)</label>
              <input
                type="number"
                value={labourCost}
                onChange={e => setLabourCost(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Parts Cost (₹)</label>
              <input
                type="number"
                value={partsCost}
                onChange={e => setPartsCost(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 bg-arca-cream border border-arca-sand">
            <span className="text-xs tracking-arca uppercase text-arca-stone">Total Estimate</span>
            <span className="text-sm font-mono text-arca-ink">
              ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <button
            type="button"
            disabled={saving || total === 0}
            onClick={() =>
              updateTicket({
                estimated_cost: total,
                status: 'estimate_sent',
                estimate_sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            }
            className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? 'Sending…' : 'Send Estimate'}
          </button>
        </div>
      )}

      {/* Approval section — shown when estimate_sent */}
      {status === 'estimate_sent' && (
        <div className="border border-arca-sand p-6 space-y-3">
          <h3 className="text-xs tracking-arca uppercase text-arca-stone">Client Approval</h3>
          <p className="text-sm text-arca-stone">
            Estimate of{' '}
            <span className="font-mono text-arca-ink">
              ₹{Number(ticket.estimated_cost ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>{' '}
            has been sent. Awaiting client response.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateTicket({
                  status: 'estimate_approved',
                  client_approval_status: 'approved',
                  client_approved_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }
              className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? '…' : 'Approved'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateTicket({
                  status: 'estimate_rejected',
                  client_approval_status: 'rejected',
                  client_rejected_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }
              className="px-6 h-10 border border-arca-sand text-arca-stone text-xs tracking-arca uppercase hover:border-arca-ink hover:text-arca-ink transition-colors disabled:opacity-50"
            >
              Rejected
            </button>
          </div>
        </div>
      )}

      {/* Repair progress — shown when estimate_approved */}
      {status === 'estimate_approved' && (
        <div className="border border-arca-sand p-6 space-y-3">
          <h3 className="text-xs tracking-arca uppercase text-arca-stone">Repair Progress</h3>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateTicket({ status: 'in_progress', updated_at: new Date().toISOString() })
              }
              className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
            >
              {saving ? '…' : 'Start Repair'}
            </button>
          </div>
        </div>
      )}

      {/* Mark complete — shown when in_progress */}
      {status === 'in_progress' && (
        <div className="border border-arca-sand p-6 space-y-3">
          <h3 className="text-xs tracking-arca uppercase text-arca-stone">Repair Progress</h3>
          <p className="text-sm text-arca-stone">Repair is currently in progress.</p>
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              updateTicket({ status: 'completed', updated_at: new Date().toISOString() })
            }
            className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50"
          >
            {saving ? '…' : 'Mark Complete'}
          </button>
        </div>
      )}

      {/* Terminal states */}
      {(status === 'completed' || status === 'estimate_rejected') && (
        <div className="px-4 py-3 bg-arca-cream border border-arca-sand">
          <p className="text-xs text-arca-stone">
            This ticket is{' '}
            <span className="text-arca-ink capitalize">{status.replace(/_/g, ' ')}</span>.
          </p>
        </div>
      )}
    </div>
  )
}
