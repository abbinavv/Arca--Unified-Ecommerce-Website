import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arca — A Treasury of the Extraordinary',
  description: 'Luxury ecommerce. Curated collections, bespoke service.',
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
