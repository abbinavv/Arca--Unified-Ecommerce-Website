import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Events — Arca Manager' }

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const today = new Date().toISOString().split('T')[0]
  const { data: events } = staffUser?.store_id
    ? await supabase
        .from('boutique_events')
        .select('id, name, event_date, event_time, invited_segment, description')
        .eq('store_id', staffUser.store_id)
        .gte('event_date', today)
        .order('event_date')
    : { data: [] }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Events</h1>
        <button className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors">
          + New Event
        </button>
      </div>

      {!events || events.length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((evt: any) => (
            <div key={evt.id} className="border border-arca-sand p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-display text-xl font-light text-arca-ink">{evt.name}</h2>
                {evt.invited_segment && (
                  <span className="text-[10px] tracking-arca uppercase text-arca-gold border border-arca-gold/40 px-2 py-1 flex-shrink-0">
                    {evt.invited_segment}
                  </span>
                )}
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
