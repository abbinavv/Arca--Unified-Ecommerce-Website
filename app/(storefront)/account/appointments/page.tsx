import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { BookAppointmentForm } from './BookAppointmentForm'

export const metadata: Metadata = { title: 'Appointments — Arca' }

const STATUS_COLOR: Record<string, string> = {
  requested: 'text-blue-700 bg-blue-50',
  confirmed: 'text-green-700 bg-green-50',
  completed: 'text-arca-stone bg-arca-cream',
  cancelled: 'text-red-700 bg-red-50',
  rescheduled: 'text-orange-700 bg-orange-50',
}

type Appointment = {
  id: string
  service_type: string | null
  appointment_date: string | null
  appointment_time: string | null
  status: string
  notes: string | null
  stores: { name: string; city: string | null } | null
}

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const todayStr = new Date().toISOString().split('T')[0]

  const [{ data: appointments }, { data: stores }] = await Promise.all([
    supabase
      .from('appointments')
      .select('id, service_type, appointment_date, appointment_time, status, notes, stores(name, city)')
      .eq('client_id', user!.id)
      .order('appointment_date', { ascending: false }),
    supabase
      .from('stores')
      .select('id, name, city')
      .eq('is_active', true)
      .order('name'),
  ])

  const upcoming = (appointments ?? []).filter(
    (a: Appointment) => !a.appointment_date || a.appointment_date >= todayStr
  )
  const past = (appointments ?? []).filter(
    (a: Appointment) => a.appointment_date && a.appointment_date < todayStr
  )

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Appointments</h1>

      <div className="border border-arca-sand p-6 mb-10">
        <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-6">Book a Session</h2>
        <BookAppointmentForm stores={stores ?? []} />
      </div>

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Upcoming ({upcoming.length})</h2>
          <div className="space-y-3">
            {upcoming.map((appt: Appointment) => (
              <div key={appt.id} className="border border-arca-sand px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-arca-ink capitalize">
                    {appt.service_type?.replace(/_/g, ' ') ?? 'Appointment'}
                  </p>
                  <p className="text-xs text-arca-stone mt-0.5">
                    {appt.stores?.name ?? '—'}{appt.stores?.city ? ` · ${appt.stores.city}` : ''}
                  </p>
                  {appt.notes && <p className="text-xs text-arca-stone/70 mt-1">{appt.notes}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  {appt.appointment_date && (
                    <p className="text-xs font-mono text-arca-charcoal">
                      {new Date(appt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short', day: 'numeric', month: 'short',
                      })}
                    </p>
                  )}
                  {appt.appointment_time && (
                    <p className="text-xs font-mono text-arca-stone">{appt.appointment_time.slice(0, 5)}</p>
                  )}
                  {appt.status && (
                    <span className={`inline-block mt-2 text-[10px] tracking-wide uppercase px-2 py-0.5 ${STATUS_COLOR[appt.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                      {appt.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Past</h2>
          <div className="space-y-3 opacity-60">
            {past.map((appt: Appointment) => (
              <div key={appt.id} className="border border-arca-sand px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-arca-ink capitalize">
                    {appt.service_type?.replace(/_/g, ' ') ?? 'Appointment'}
                  </p>
                  <p className="text-xs text-arca-stone">{appt.stores?.name ?? '—'}</p>
                </div>
                <p className="text-xs font-mono text-arca-stone flex-shrink-0">
                  {new Date(appt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {appointments?.length === 0 && (
        <div className="py-20 text-center border border-arca-sand">
          <p className="text-sm text-arca-stone">No appointments yet — book one above.</p>
        </div>
      )}
    </div>
  )
}
