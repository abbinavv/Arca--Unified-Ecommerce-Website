'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Store,
  Users,
  Tag,
  BarChart2,
  ClipboardList,
  MessageSquare,
  LogOut,
} from 'lucide-react'

const ADMIN_NAV = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/admin/catalog', label: 'Catalog', icon: Package },
  { href: '/dashboard/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/dashboard/admin/stores', label: 'Stores', icon: Store },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/pricing', label: 'Pricing & Promos', icon: Tag },
  { href: '/dashboard/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: BarChart2 },
  { href: '/dashboard/admin/audit', label: 'Audit Log', icon: ClipboardList },
]

type Props = { userName: string }

export function AdminSidebar({ userName }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col min-h-screen bg-arca-ink">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="font-display text-lg font-light tracking-[0.3em] uppercase text-arca-ivory">
          Arca
        </Link>
        <p className="text-[9px] tracking-[0.18em] uppercase text-arca-gold mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {ADMIN_NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-colors ${
                active
                  ? 'bg-white/10 text-arca-ivory'
                  : 'text-white/50 hover:text-arca-ivory hover:bg-white/6'
              }`}
            >
              <Icon
                size={14}
                strokeWidth={1.6}
                className={active ? 'text-arca-gold' : 'text-white/40 group-hover:text-white/70 transition-colors'}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full bg-arca-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] text-arca-gold font-medium">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-arca-ivory font-medium truncate">{userName}</p>
            <p className="text-[9px] tracking-wide uppercase text-white/35 mt-0.5">Corporate Admin</p>
          </div>
        </div>
        <form action="/auth/signout" method="POST">
          <button className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-arca-ivory transition-colors">
            <LogOut size={11} strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
