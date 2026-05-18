import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin KPIs — Arca' }

export default async function AdminKPIPage() {
  const supabase = await createClient()

  const d30 = new Date(Date.now() - 30 * 86400000).toISOString()

  const [{ count: totalOrders }, { count: activeUsers }, { count: staffCount }, { data: revenue }] =
    await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', d30),
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('grand_total').gte('created_at', d30).not('status', 'in', '(cancelled,refunded)'),
    ])

  const totalRevenue = (revenue ?? []).reduce((s: number, o: any) => s + Number(o.grand_total), 0)

  const kpis = [
    { label: 'Orders (30d)', value: totalOrders ?? 0 },
    { label: 'Revenue (30d)', value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
    { label: 'Customers', value: activeUsers ?? 0 },
    { label: 'Staff', value: staffCount ?? 0 },
  ]

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white border border-[#E8E8E4] p-6">
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-2">{kpi.label}</p>
            <p className="text-3xl font-mono text-arca-ink">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Catalog', '/dashboard/admin/catalog'],
              ['Users', '/dashboard/admin/users'],
              ['Stores', '/dashboard/admin/stores'],
              ['Reports', '/dashboard/admin/reports'],
            ].map(([label, href]) => (
              <a key={href} href={href}
                className="bg-white border border-[#E8E8E4] px-4 py-3 text-sm text-arca-charcoal hover:border-arca-ink hover:text-arca-ink transition-colors">
                {label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
