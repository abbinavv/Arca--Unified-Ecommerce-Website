import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PageTransition, StaggerList, StaggerItem } from '@/components/shared/PageTransition'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manager Overview — Arca' }

export default async function ManagerOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users')
    .select('store_id')
    .eq('id', user!.id)
    .single()

  const storeId = staffUser?.store_id

  const today = new Date().toISOString().split('T')[0]

  const [{ data: todayOrders }, { data: bopis }, { data: lowStock }, { data: discrepancies }] =
    await Promise.all([
      storeId
        ? supabase.from('orders').select('id').eq('store_id', storeId).gte('created_at', `${today}T00:00:00`)
        : Promise.resolve({ data: [] }),
      storeId
        ? supabase.from('orders').select('id').eq('store_id', storeId).eq('fulfillment_type', 'bopis').eq('status', 'ready_for_pickup')
        : Promise.resolve({ data: [] }),
      storeId
        ? supabase.from('inventory').select('id').eq('location_id', storeId).lte('available_qty', 2)
        : Promise.resolve({ data: [] }),
      storeId
        ? supabase.from('inventory_discrepancies').select('id').eq('store_id', storeId).eq('status', 'pending')
        : Promise.resolve({ data: [] }),
    ])

  const tiles = [
    { label: "Today's orders", value: todayOrders?.length ?? 0, href: '/dashboard/manager/orders', warn: false },
    { label: 'BOPIS ready', value: bopis?.length ?? 0, href: '/dashboard/manager/orders?filter=bopis', warn: (bopis?.length ?? 0) > 0 },
    { label: 'Low stock items', value: lowStock?.length ?? 0, href: '/dashboard/manager/inventory', warn: (lowStock?.length ?? 0) > 0 },
    { label: 'Pending discrepancies', value: discrepancies?.length ?? 0, href: '/dashboard/manager/discrepancies', warn: (discrepancies?.length ?? 0) > 0 },
  ]

  return (
    <PageTransition>
      <div className="p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-light text-arca-ink">Overview</h1>
          <p className="text-sm text-arca-stone mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {tiles.map(tile => (
            <StaggerItem key={tile.href}>
              <Link
                href={tile.href}
                className={`group block p-5 border transition-colors ${
                  tile.warn
                    ? 'border-amber-200 bg-amber-50 hover:border-amber-400'
                    : 'bg-white border-[#E8E8E4] hover:border-arca-ink'
                }`}
              >
                <p className={`text-2xl font-mono font-light mb-1 ${tile.warn ? 'text-amber-700' : 'text-arca-ink'}`}>
                  {tile.value}
                </p>
                <p className={`text-[11px] ${tile.warn ? 'text-amber-600' : 'text-arca-stone'}`}>{tile.label}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>

        <div className="grid md:grid-cols-2 gap-8">
          <QuickLinks />
        </div>
      </div>
    </PageTransition>
  )
}

function QuickLinks() {
  const links = [
    { href: '/dashboard/manager/inventory', label: 'View inventory' },
    { href: '/dashboard/manager/orders', label: 'Process orders' },
    { href: '/dashboard/manager/discrepancies', label: 'Review discrepancies' },
    { href: '/dashboard/manager/transfers', label: 'Manage transfers' },
    { href: '/dashboard/manager/events', label: 'Boutique events' },
    { href: '/dashboard/manager/analytics', label: 'Store analytics' },
  ]
  return (
    <section>
      <h2 className="text-xs tracking-arca uppercase text-arca-stone mb-4">Quick Navigation</h2>
      <div className="grid grid-cols-2 gap-3">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="px-4 py-3 border border-arca-sand text-sm text-arca-charcoal hover:border-arca-ink hover:text-arca-ink transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
