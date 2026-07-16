import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PageTransition, StaggerList } from '@/components/shared/PageTransition'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — Arca Staff' }

export default async function StaffDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users')
    .select('first_name, role, store_id')
    .eq('id', user!.id)
    .single()

  const today = new Date().toISOString().split('T')[0]

  const [{ data: appointments }, { data: tickets }, { data: todayOrders }] = await Promise.all([
    supabase
      .from('appointments')
      .select('id, client_id, service_type, appointment_time, status, clients(first_name, last_name)')
      .eq('associate_id', user!.id)
      .eq('appointment_date', today)
      .order('appointment_time'),
    supabase
      .from('service_tickets')
      .select('id, ticket_number, status, type, clients(first_name, last_name)')
      .eq('assigned_to', user!.id)
      .not('status', 'in', '(completed,cancelled)')
      .order('created_at', { ascending: false })
      .limit(5),
    staffUser?.store_id
      ? supabase
          .from('orders')
          .select('id, grand_total')
          .eq('store_id', staffUser.store_id)
          .eq('associate_id', user!.id)
          .gte('created_at', `${today}T00:00:00`)
      : Promise.resolve({ data: [] }),
  ])

  const isSalesAssociate = staffUser?.role === 'sales_associate'
  const todaySales = (todayOrders ?? []).reduce((s: number, o: { grand_total: number | string }) => s + Number(o.grand_total), 0)

  return (
    <PageTransition>
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-arca-ink">
          Good {getGreeting()}, {staffUser?.first_name ?? 'there'}
        </h1>
        <p className="text-sm text-arca-stone mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* KPI cards */}
      <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Today's appointments"
          value={appointments?.length ?? 0}
          href="/dashboard/staff/appointments"
        />
        {isSalesAssociate && (
          <StatCard
            label="Sales today"
            value={`₹${todaySales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            href="/dashboard/staff/sell"
          />
        )}
        <StatCard
          label="Open tickets"
          value={tickets?.length ?? 0}
          href="/dashboard/staff/service"
        />
      </StaggerList>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Today's appointments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-arca uppercase text-arca-stone">Today&apos;s Appointments</h2>
            <Link href="/dashboard/staff/appointments" className="text-xs text-arca-gold hover:text-arca-gold-dk">
              View all →
            </Link>
          </div>
          {!appointments || appointments.length === 0 ? (
            <EmptyState text="No appointments today" />
          ) : (
            <div className="divide-y divide-arca-sand border border-arca-sand">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-arca-ink">
                      {appt.clients?.first_name} {appt.clients?.last_name}
                    </p>
                    <p className="text-xs text-arca-stone">{appt.service_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-arca-ink">{appt.appointment_time?.slice(0, 5)}</p>
                    <StatusPill status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Service tickets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-arca uppercase text-arca-stone">Open Tickets</h2>
            <Link href="/dashboard/staff/service" className="text-xs text-arca-gold hover:text-arca-gold-dk">
              View all →
            </Link>
          </div>
          {!tickets || tickets.length === 0 ? (
            <EmptyState text="No open tickets" />
          ) : (
            <div className="divide-y divide-arca-sand border border-arca-sand">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/staff/service/${ticket.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-arca-cream transition-colors"
                >
                  <div>
                    <p className="text-sm font-mono text-arca-ink">#{ticket.ticket_number}</p>
                    <p className="text-xs text-arca-stone">
                      {ticket.clients?.first_name} {ticket.clients?.last_name} · {ticket.type}
                    </p>
                  </div>
                  <StatusPill status={ticket.status} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick actions */}
      {isSalesAssociate && (
        <div className="mt-10 pt-8 border-t border-arca-sand">
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <QuickAction href="/dashboard/staff/sell" label="New Sale" />
            <QuickAction href="/dashboard/staff/clients" label="Find Client" />
            <QuickAction href="/dashboard/staff/service" label="New Ticket" />
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function StatCard({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="group block p-5 bg-white border border-[#E8E8E4] hover:border-arca-ink transition-colors">
      <p className="text-2xl font-mono font-light text-arca-ink mb-1">{value}</p>
      <p className="text-[11px] text-arca-stone">{label}</p>
    </Link>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    requested: 'text-blue-700',
    confirmed: 'text-green-700',
    completed: 'text-arca-stone',
    cancelled: 'text-red-600',
    rescheduled: 'text-orange-600',
    intake: 'text-amber-600',
    in_progress: 'text-blue-600',
    awaiting_approval: 'text-orange-600',
  }
  return (
    <span className={`text-[10px] tracking-wide uppercase ${map[status] ?? 'text-arca-stone'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-arca-sand px-4 py-8 text-center">
      <p className="text-xs text-arca-stone">{text}</p>
    </div>
  )
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-5 py-2.5 border border-arca-sand text-xs tracking-arca uppercase text-arca-charcoal hover:border-arca-ink hover:text-arca-ink transition-colors"
    >
      {label}
    </Link>
  )
}
