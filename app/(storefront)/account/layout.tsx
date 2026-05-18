import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const NAV = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/appointments', label: 'Appointments' },
  { href: '/account/service', label: 'Service' },
  { href: '/account/profile', label: 'Profile' },
]

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/account')

  const { data: client } = await supabase
    .from('clients')
    .select('first_name, last_name, email')
    .eq('id', user.id)
    .single()

  const name = client
    ? [client.first_name, client.last_name].filter(Boolean).join(' ')
    : user.email

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-[220px_1fr] gap-12">
        {/* Sidebar */}
        <aside>
          <div className="mb-8">
            <p className="font-display text-xl font-light text-arca-ink">{name}</p>
            <p className="text-xs text-arca-stone mt-1">{user.email}</p>
          </div>

          <nav className="space-y-1">
            {NAV.map(item => (
              <AccountNavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-arca-sand">
            <SignOutButton />
          </div>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

// ── Client components needed inline ──────────────────────────────────────────

function AccountNavLink({ href, label }: { href: string; label: string }) {
  // Static links — active state handled client-side via pathname
  return (
    <Link
      href={href}
      className="block py-2 text-sm text-arca-charcoal hover:text-arca-ink transition-colors"
    >
      {label}
    </Link>
  )
}

function SignOutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="text-xs tracking-arca uppercase text-arca-stone hover:text-arca-ink transition-colors"
      >
        Sign Out
      </button>
    </form>
  )
}
