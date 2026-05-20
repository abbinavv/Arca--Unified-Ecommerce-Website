'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { NotificationBell } from './NotificationBell'

const NAV_LINKS = [
  { href: '/shop/women', label: 'Women' },
  { href: '/shop/men', label: 'Men' },
  { href: '/shop/watches', label: 'Watches' },
  { href: '/shop/jewellery', label: 'Jewellery' },
  { href: '/shop/accessories', label: 'Accessories' },
]

export function ArcaNav() {
  const pathname = usePathname()
  const { user, role } = useAuth()
  const openCart = useCartStore(s => s.openCart)
  const itemCount = useCartStore(s => s.itemCount())
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Dashboard link for staff
  function getDashboardHref() {
    if (role === 'corporate_admin') return '/dashboard/admin'
    if (role === 'boutique_manager' || role === 'inventory_controller') return '/dashboard/manager'
    if (role === 'sales_associate' || role === 'service_technician' || role === 'aftersales_specialist') {
      return '/dashboard/staff'
    }
    return null
  }

  const dashboardHref = getDashboardHref()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-arca-ivory/95 backdrop-blur-sm border-b border-arca-sand' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-10">
        {/* Wordmark — left */}
        <Link
          href="/"
          className="font-display text-xl font-light tracking-[0.3em] uppercase text-arca-ink hover:text-arca-gold transition-colors flex-shrink-0"
        >
          Arca
        </Link>

        {/* Mobile — hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 ml-auto"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-arca-ink transition-all ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
          <span className={`block w-5 h-px bg-arca-ink transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-arca-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>

        {/* Center — category links (desktop) */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] tracking-arca uppercase transition-colors hover:text-arca-gold ${
                pathname.startsWith(link.href) ? 'text-arca-ink' : 'text-arca-stone'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — account + cart (desktop) */}
        <div className="hidden md:flex items-center gap-5 flex-shrink-0">
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className="text-[11px] tracking-arca uppercase text-arca-stone hover:text-arca-gold transition-colors"
            >
              Portal
            </Link>
          ) : user ? (
            <Link
              href="/account"
              className="text-[11px] tracking-arca uppercase text-arca-stone hover:text-arca-gold transition-colors"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-[11px] tracking-arca uppercase text-arca-stone hover:text-arca-gold transition-colors"
            >
              Sign in
            </Link>
          )}

          {user && !dashboardHref && <NotificationBell userId={user.id} />}

          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-7 h-7 text-arca-stone hover:text-arca-gold transition-colors"
            aria-label="Cart"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-arca-gold text-white text-[9px] font-medium rounded-full flex items-center justify-center leading-none">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile cart */}
        <button
          onClick={openCart}
          className="md:hidden relative flex items-center justify-center w-7 h-7 text-arca-stone hover:text-arca-gold transition-colors"
          aria-label="Cart"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-arca-gold text-white text-[9px] font-medium rounded-full flex items-center justify-center leading-none">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-arca-ivory border-t border-arca-sand px-6 py-6 space-y-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm tracking-arca uppercase text-arca-charcoal hover:text-arca-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-arca-sand">
            {user ? (
              <Link href="/account" onClick={() => setMenuOpen(false)} className="block text-sm tracking-arca uppercase text-arca-charcoal hover:text-arca-gold transition-colors">
                Account
              </Link>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block text-sm tracking-arca uppercase text-arca-charcoal hover:text-arca-gold transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
