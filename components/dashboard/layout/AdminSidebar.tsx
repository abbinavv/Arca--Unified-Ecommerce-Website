'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ADMIN_NAV = [
  { href: '/dashboard/admin', label: 'KPIs' },
  { href: '/dashboard/admin/catalog', label: 'Catalog' },
  { href: '/dashboard/admin/inventory', label: 'Inventory' },
  { href: '/dashboard/admin/stores', label: 'Stores' },
  { href: '/dashboard/admin/users', label: 'Users' },
  { href: '/dashboard/admin/pricing', label: 'Pricing & Promos' },
  { href: '/dashboard/admin/reports', label: 'Reports' },
  { href: '/dashboard/admin/audit', label: 'Audit Log' },
]

type Props = { userName: string }

export function AdminSidebar({ userName }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex-shrink-0 border-r border-arca-sand flex flex-col min-h-screen bg-arca-ink">
      <div className="px-6 py-5 border-b border-arca-charcoal">
        <Link href="/" className="font-display text-lg font-light tracking-[0.3em] uppercase text-arca-ivory">
          Arca
        </Link>
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {ADMIN_NAV.map(item => {
          const active = item.href === '/dashboard/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-[#EFEFEC] text-arca-ink'
                  : 'text-arca-stone hover:text-arca-ink hover:bg-[#EFEFEC]'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-arca-charcoal">
        <p className="text-xs text-arca-ivory font-medium truncate">{userName}</p>
        <p className="text-[10px] tracking-wide uppercase text-arca-stone mt-0.5">Corporate Admin</p>
        <form action="/auth/signout" method="POST" className="mt-3">
          <button className="text-[11px] text-arca-stone hover:text-arca-ivory transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
