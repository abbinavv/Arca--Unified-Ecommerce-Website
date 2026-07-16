import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, Users, ShoppingBag, UserCheck, Package, Store, BarChart2, FileText } from 'lucide-react'
import { PageTransition, StaggerList, StaggerItem } from '@/components/shared/PageTransition'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Overview — Arca Admin' }

function getReportingWindow() {
  const now = Date.now()
  return {
    d30: new Date(now - 30 * 86400000).toISOString(),
    d7: new Date(now - 7 * 86400000).toISOString(),
    today: new Date(now).toISOString().split('T')[0],
  }
}

export default async function AdminKPIPage() {
  const admin = await createAdminClient()

  const { d30, d7, today } = getReportingWindow()

  const [
    { count: orders30d },
    { count: orders7d },
    { count: customers },
    { count: staffCount },
    { data: revenue30d },
    { data: todayOrders },
    { data: recentOrders },
  ] = await Promise.all([
    admin.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', d30).not('status', 'in', '(cancelled,refunded)'),
    admin.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', d7).not('status', 'in', '(cancelled,refunded)'),
    admin.from('clients').select('id', { count: 'exact', head: true }),
    admin.from('users').select('id', { count: 'exact', head: true }),
    admin.from('orders').select('grand_total').gte('created_at', d30).not('status', 'in', '(cancelled,refunded)'),
    admin.from('orders').select('id, grand_total').gte('created_at', `${today}T00:00:00`).not('status', 'in', '(cancelled,refunded)'),
    admin.from('orders')
      .select('id, order_number, grand_total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const rev30d = (revenue30d ?? []).reduce((s: number, o: { grand_total: number }) => s + Number(o.grand_total), 0)
  const todayRev = (todayOrders ?? []).reduce((s: number, o: { grand_total: number }) => s + Number(o.grand_total), 0)

  const kpis = [
    {
      label: 'Revenue (30d)',
      value: `₹${rev30d.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `${orders30d ?? 0} orders`,
      icon: TrendingUp,
      accent: true,
    },
    {
      label: "Today's revenue",
      value: `₹${todayRev.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `${todayOrders?.length ?? 0} orders today`,
      icon: ShoppingBag,
    },
    {
      label: 'Customers',
      value: customers ?? 0,
      sub: 'registered accounts',
      icon: Users,
    },
    {
      label: 'Staff',
      value: staffCount ?? 0,
      sub: `${orders7d ?? 0} orders this week`,
      icon: UserCheck,
    },
  ]

  const quickLinks = [
    { href: '/dashboard/admin/catalog', label: 'Catalog', desc: 'Products & collections', icon: Package },
    { href: '/dashboard/admin/users', label: 'Users', desc: 'Staff & customers', icon: Users },
    { href: '/dashboard/admin/stores', label: 'Stores', desc: 'Boutique locations', icon: Store },
    { href: '/dashboard/admin/reports', label: 'Reports', desc: 'Export & analytics', icon: BarChart2 },
    { href: '/dashboard/admin/pricing', label: 'Pricing', desc: 'Promos & tax rules', icon: FileText },
    { href: '/dashboard/admin/audit', label: 'Audit Log', desc: 'Admin activity trail', icon: FileText },
  ]

  return (
    <PageTransition>
      <div className="p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-light text-arca-ink">Overview</h1>
          <p className="text-sm text-arca-stone mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* KPI Cards */}
        <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map(kpi => {
            const Icon = kpi.icon
            return (
              <StaggerItem key={kpi.label}>
                <div className={`relative p-5 border overflow-hidden ${kpi.accent ? 'bg-arca-ink border-arca-ink' : 'bg-white border-[#E8E8E4]'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <p className={`text-[10px] tracking-[0.12em] uppercase ${kpi.accent ? 'text-arca-gold' : 'text-arca-stone'}`}>
                      {kpi.label}
                    </p>
                    <Icon size={14} strokeWidth={1.5} className={kpi.accent ? 'text-arca-gold/60' : 'text-arca-sand'} />
                  </div>
                  <p className={`text-2xl font-mono font-light mb-1 ${kpi.accent ? 'text-arca-ivory' : 'text-arca-ink'}`}>
                    {kpi.value}
                  </p>
                  <p className={`text-[11px] ${kpi.accent ? 'text-white/40' : 'text-arca-stone'}`}>{kpi.sub}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerList>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Recent Orders */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] tracking-[0.12em] uppercase text-arca-stone">Recent Orders</h2>
              <Link href="/dashboard/admin/catalog" className="text-[11px] text-arca-gold hover:text-arca-gold-dk transition-colors">
                View all →
              </Link>
            </div>
            <div className="border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
              {!recentOrders || recentOrders.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-xs text-arca-stone">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order: { id: string; order_number: string; grand_total: number; status: string; created_at: string }) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-mono text-arca-ink">#{order.order_number}</p>
                      <p className="text-[11px] text-arca-stone mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 ${statusStyle(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <p className="text-sm font-mono text-arca-ink w-24 text-right">
                        ₹{Number(order.grand_total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick Links */}
          <section className="lg:col-span-2">
            <h2 className="text-[11px] tracking-[0.12em] uppercase text-arca-stone mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ href, label, desc, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group p-3.5 border border-[#E8E8E4] hover:border-arca-ink transition-colors"
                >
                  <Icon size={14} strokeWidth={1.5} className="text-arca-stone group-hover:text-arca-gold transition-colors mb-2.5" />
                  <p className="text-[13px] text-arca-ink font-medium">{label}</p>
                  <p className="text-[10px] text-arca-stone mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}

function statusStyle(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
    refunded: 'bg-red-50 text-red-600',
    ready_for_pickup: 'bg-green-50 text-green-700',
  }
  return map[status] ?? 'bg-arca-cream text-arca-stone'
}
