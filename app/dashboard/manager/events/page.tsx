'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const SEGMENT_OPTIONS = [
  { label: 'All Clients', value: '' },
  { label: 'VIP', value: 'vip' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
]

type BoutiqueEvent = {
  id: string
  name: string
  event_date: string
  event_time: string | null
  invited_segment: string | null
  description: string | null
  rsvp_count: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<BoutiqueEvent[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [invitedSegment, setInvitedSegment] = useState('')
  const [description, setDescription] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const fetchEvents = useCallback(async (sid: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('boutique_events')
      .select('id, name, event_date, event_time, invited_segment, description, event_rsvps(count)')
      .eq('store_id', sid)
      .gte('event_date', today)
      .order('event_date')

    if (data) {
      const mapped: BoutiqueEvent[] = data.map((evt: any) => ({
        id: evt.id,
        name: evt.name,
        event_date: evt.event_date,
        event_time: evt.event_time,
        invited_segment: evt.invited_segment,
        description: evt.description,
        rsvp_count: evt.event_rsvps?.[0]?.count ?? 0,
      }))
      setEvents(mapped)
    }
    setLoading(false)
  }, [today])

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: staffUser } = await supabase
        .from('users').select('store_id').eq('id', user.id).single()
      if (staffUser?.store_id) {
        setStoreId(staffUser.store_id)
        await fetchEvents(staffUser.store_id)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [fetchEvents])

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!eventName || !eventDate) {
      setFormError('Event name and date are required.')
      return
    }
    if (!storeId) {
      setFormError('Store not found for your account.')
      return
    }
    setFormLoading(true)
    setFormError('')
    const supabase = createClient()
    const { error } = await supabase.from('boutique_events').insert({
      store_id: storeId,
      name: eventName,
      event_date: eventDate,
      event_time: eventTime || null,
      invited_segment: invitedSegment || null,
      description: description || null,
    })
    if (error) {
      setFormError(error.message)
      setFormLoading(false)
      return
    }
    setFormLoading(false)
    setFormSuccess(true)
    setShowForm(false)
    setEventName('')
    setEventDate('')
    setEventTime('')
    setInvitedSegment('')
    setDescription('')
    if (storeId) await fetchEvents(storeId)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Events</h1>
        <button
          onClick={() => { setShowForm(v => !v); setFormError(''); setFormSuccess(false) }}
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {formSuccess && (
        <div className="mb-6 px-4 py-3 border border-green-200 bg-green-50">
          <p className="text-xs text-green-700">Event created successfully.</p>
        </div>
      )}

      {/* New Event Form */}
      {showForm && (
        <div className="border border-arca-sand p-6 mb-8">
          <h2 className="font-display text-lg font-light text-arca-ink mb-6">New Event</h2>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Event Name *</label>
              <input
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                required
                placeholder="e.g. Summer Collection Preview"
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Event Date *</label>
              <input
                type="date"
                value={eventDate}
                min={today}
                onChange={e => setEventDate(e.target.value)}
                required
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Event Time</label>
              <input
                type="time"
                value={eventTime}
                onChange={e => setEventTime(e.target.value)}
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Invited Segment</label>
              <select
                value={invitedSegment}
                onChange={e => setInvitedSegment(e.target.value)}
                className="w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
              >
                {SEGMENT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the event…"
                className="w-full px-3 py-2.5 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors resize-none"
              />
            </div>

            {formError && (
              <div className="md:col-span-2">
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{formError}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formLoading}
                className="px-8 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
              >
                {formLoading ? 'Creating…' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">Loading events…</p>
        </div>
      ) : !events || events.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(evt => (
            <div key={evt.id} className="border border-arca-sand p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-display text-xl font-light text-arca-ink">{evt.name}</h2>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {evt.invited_segment && (
                    <span className="text-[10px] tracking-arca uppercase text-arca-gold border border-arca-gold/40 px-2 py-1">
                      {evt.invited_segment}
                    </span>
                  )}
                  <span className="text-[10px] tracking-arca uppercase text-arca-stone border border-arca-sand px-2 py-1">
                    {evt.rsvp_count} RSVP{evt.rsvp_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {evt.description && (
                <p className="text-sm text-arca-stone mb-3">{evt.description}</p>
              )}
              <p className="text-xs font-mono text-arca-charcoal">
                {new Date(evt.event_date + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
                {evt.event_time && ` at ${evt.event_time.slice(0, 5)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
