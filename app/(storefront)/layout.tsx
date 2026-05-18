import type { Metadata } from 'next'
import { ArcaNav } from '@/components/storefront/nav/ArcaNav'
import { CartDrawer } from '@/components/storefront/nav/CartDrawer'
import { ArcaFooter } from '@/components/storefront/ArcaFooter'
import { PageTransition } from '@/components/shared/PageTransition'

export const metadata: Metadata = {
  title: { default: 'Arca', template: '%s — Arca' },
  description: 'A treasury of the extraordinary. Luxury fashion, watches, and jewellery.',
  openGraph: {
    siteName: 'Arca',
    type: 'website',
  },
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ArcaNav />
      <CartDrawer />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <ArcaFooter />
    </>
  )
}
