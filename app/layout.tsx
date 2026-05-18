import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

const OG_IMAGE = 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/skeletonWatches/Skeleton%20Watches1.jpeg'

export const metadata: Metadata = {
  title: 'Arca — A Treasury of the Extraordinary',
  description: 'Luxury ecommerce. Curated collections, bespoke service.',
  openGraph: {
    title: 'Arca — A Treasury of the Extraordinary',
    description: 'Luxury fashion, watches & jewellery. Curated with intention.',
    siteName: 'Arca',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: 'Arca — Luxury Ecommerce' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arca — A Treasury of the Extraordinary',
    description: 'Luxury fashion, watches & jewellery. Curated with intention.',
    images: [OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-arca-ivory text-arca-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
