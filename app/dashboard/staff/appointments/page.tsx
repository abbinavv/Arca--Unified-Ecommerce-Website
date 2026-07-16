import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Appointments — Arca Staff' }

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'text-blue-700 bg-blue-50',
  confirmed: 'text-green-700 bg-green-50',
  completed: 'text-arca-stone bg-arca-cream',
  cancelled: 'text-red-700 bg-red-50',
  no_show: 'text-orange-700 bg-orange-50',
}

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, service_type, appointment_date, appointment_time, status, notes, clients(first_name, last_name, email, phone)')
    .eq('associate_id', user!.id)
    .gte('appointment_date', today)
    .order('appointment_date')
    .order('appointment_time')

  type Appointment = NonNullable<typeof appointments>[number]

  const grouped: Record<string, Appointment[]> = {}
  for (const appt of appointments ?? []) {
    const key = appt.appointment_date ?? 'unknown'
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(appt)
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Appointments</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="border border-arca-sand py-16 text-center">
          <p className="text-sm text-arca-stone">No upcoming appointments</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([date, appts]) => (
            <section key={date}>
              <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">
                {date === today ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </h2>
              <div className="divide-y divide-arca-sand border border-arca-sand">
                {(appts ?? []).map((appt) => (
                  <div key={appt.id} className="px-6 py-4 flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <p className="text-sm font-mono text-arca-ink w-12 flex-shrink-0 pt-0.5">
                        {appt.appointment_time?.slice(0, 5)}
                      </p>
                      <div>
                        <p className="text-sm text-arca-ink">
                          {appt.clients?.first_name} {appt.clients?.last_name}
                        </p>
                        <p className="text-xs text-arca-stone">{appt.service_type}</p>
                        {appt.clients?.phone && (
                          <p className="text-xs text-arca-stone/60 mt-0.5">{appt.clients.phone}</p>
                        )}
                        {appt.notes && (
                          <p className="text-xs text-arca-stone mt-1 italic">&ldquo;{appt.notes}&rdquo;</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-1 flex-shrink-0 ${STATUS_STYLE[appt.status] ?? 'text-arca-stone bg-arca-cream'}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
