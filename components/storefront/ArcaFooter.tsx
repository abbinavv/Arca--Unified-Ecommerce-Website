import Link from 'next/link'

const FOOTER_LINKS = {
  Shop: [
    { href: '/shop/women', label: 'Women' },
    { href: '/shop/men', label: 'Men' },
    { href: '/shop/watches', label: 'Watches' },
    { href: '/shop/jewellery', label: 'Jewellery' },
    { href: '/shop', label: 'All Products' },
  ],
  Account: [
    { href: '/account', label: 'My Account' },
    { href: '/account/orders', label: 'Orders' },
    { href: '/account/wishlist', label: 'Wishlist' },
    { href: '/account/appointments', label: 'Appointments' },
  ],
  Company: [
    { href: '/about', label: 'About Arca' },
    { href: '/stores', label: 'Our Boutiques' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ],
}

export function ArcaFooter() {
  return (
    <footer className="bg-arca-ink text-arca-sand mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl font-light tracking-[0.3em] uppercase text-arca-ivory mb-4">
              Arca
            </p>
            <p className="text-xs leading-relaxed text-arca-stone max-w-[200px]">
              A treasury of the extraordinary. Curated luxury for the discerning few.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-[10px] tracking-arca uppercase text-arca-ivory mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-arca-stone hover:text-arca-ivory transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-arca-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-arca-stone">
            © {new Date().getFullYear()} Arca. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="text-[11px] text-arca-stone hover:text-arca-ivory transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-[11px] text-arca-stone hover:text-arca-ivory transition-colors">
              Terms of Use
            </Link>
            <Link href="/legal/returns" className="text-[11px] text-arca-stone hover:text-arca-ivory transition-colors">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
