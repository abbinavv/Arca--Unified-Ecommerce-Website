'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@/types/database'

type NavItem = { href: string; label: string; icon: React.ReactNode }

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

const STAFF_NAV: NavItem[] = [
  { href: '/dashboard/staff', label: 'Dashboard', icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
  { href: '/dashboard/staff/clients', label: 'Clients', icon: <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
  { href: '/dashboard/staff/sell', label: 'Sell', icon: <Icon d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
  { href: '/dashboard/staff/catalog', label: 'Catalog', icon: <Icon d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
  { href: '/dashboard/staff/appointments', label: 'Appointments', icon: <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  { href: '/dashboard/staff/looks', label: 'Looks', icon: <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  { href: '/dashboard/staff/service', label: 'Service', icon: <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
]

const SERVICE_SPECIALIST_NAV: NavItem[] = [
  { href: '/dashboard/staff', label: 'Dashboard', icon: STAFF_NAV[0].icon },
  { href: '/dashboard/staff/appointments', label: 'Appointments', icon: STAFF_NAV[4].icon },
  { href: '/dashboard/staff/service', label: 'Service', icon: STAFF_NAV[6].icon },
]

type Props = {
  role: UserRole
  userName: string
  storeName: string | null
}

export function DashboardSidebar({ role, userName, storeName }: Props) {
  const pathname = usePathname()

  const isServiceSpecialist =
    role === 'service_technician' || role === 'aftersales_specialist'
  const navItems = isServiceSpecialist ? SERVICE_SPECIALIST_NAV : STAFF_NAV

  return (
    <aside className="w-60 flex-shrink-0 border-r border-arca-sand flex flex-col min-h-screen bg-arca-ivory">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-arca-sand">
        <Link href="/" className="font-display text-lg font-light tracking-[0.3em] uppercase text-arca-ink">
          Arca
        </Link>
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mt-0.5">Staff Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = item.href === '/dashboard/staff'
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none ${
                active
                  ? 'bg-arca-ink text-arca-ivory'
                  : 'text-arca-charcoal hover:bg-arca-cream'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
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
