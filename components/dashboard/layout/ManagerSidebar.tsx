'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@/types/database'

type NavItem = { href: string; label: string }

const MANAGER_NAV: NavItem[] = [
  { href: '/dashboard/manager', label: 'Overview' },
  { href: '/dashboard/manager/inventory', label: 'Inventory' },
  { href: '/dashboard/manager/orders', label: 'Orders & BOPIS' },
  { href: '/dashboard/manager/discrepancies', label: 'Discrepancies' },
  { href: '/dashboard/manager/transfers', label: 'Transfers' },
  { href: '/dashboard/manager/events', label: 'Events' },
  { href: '/dashboard/manager/analytics', label: 'Analytics' },
]

const INVENTORY_CONTROLLER_NAV: NavItem[] = [
  { href: '/dashboard/manager', label: 'Overview' },
  { href: '/dashboard/manager/inventory', label: 'Inventory' },
  { href: '/dashboard/manager/discrepancies', label: 'Discrepancies' },
  { href: '/dashboard/manager/transfers', label: 'Transfers' },
]

type Props = {
  role: UserRole
  userName: string
  storeName: string | null
}

export function ManagerSidebar({ role, userName, storeName }: Props) {
  const pathname = usePathname()
  const navItems = role === 'inventory_controller' ? INVENTORY_CONTROLLER_NAV : MANAGER_NAV

  return (
    <aside className="w-60 flex-shrink-0 border-r border-arca-sand flex flex-col min-h-screen bg-arca-ivory">
      <div className="px-6 py-5 border-b border-arca-sand">
        <Link href="/" className="font-display text-lg font-light tracking-[0.3em] uppercase text-arca-ink">
          Arca
        </Link>
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mt-0.5">Manager Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = item.href === '/dashboard/manager'
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-[#EFEFEC] text-arca-ink'
                  : 'text-arca-stone hover:text-arca-ink hover:bg-arca-cream'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-arca-sand">
        <p className="text-xs text-arca-ink font-medium truncate">{userName}</p>
        {storeName && <p className="text-[11px] text-arca-stone truncate">{storeName}</p>}
        <p className="text-[10px] tracking-wide uppercase text-arca-stone/60 mt-0.5">
          {role.replace('_', ' ')}
        </p>
        <form action="/auth/signout" method="POST" className="mt-3">
          <button className="text-[11px] text-arca-stone hover:text-arca-ink transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
