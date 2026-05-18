import { ArcaNav } from '@/components/storefront/nav/ArcaNav'
import { CartDrawer } from '@/components/storefront/nav/CartDrawer'
import { ArcaFooter } from '@/components/storefront/ArcaFooter'

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
        {children}
      </main>
      <ArcaFooter />
    </>
  )
}
