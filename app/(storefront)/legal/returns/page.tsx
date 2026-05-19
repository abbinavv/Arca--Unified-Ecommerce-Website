import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Exchanges — Arca',
}

export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Customer care</p>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-2">Returns & Exchanges</h1>
      <p className="text-sm text-arca-stone mb-12 leading-relaxed">
        We want every Arca purchase to be exactly right. If something isn&apos;t, here is how we can help.
      </p>

      <div className="space-y-10">
        {[
          {
            title: 'Return policy',
            points: [
              '30 days from delivery for full-price items',
              'Items must be unworn, unaltered, and in original packaging with tags attached',
              'Footwear must be returned with the original box',
              'Sale items and bespoke/made-to-order pieces are final sale',
              'Fragrance and intimate accessories cannot be returned for hygiene reasons',
            ],
          },
          {
            title: 'How to return',
            points: [
              'Log in to your account and visit Orders',
              'Select the order and click "Request Return"',
              'Choose items and reason — our team will confirm within 24 hours',
              'Pack securely and hand to our courier (we arrange collection)',
              'Refund issued within 5–7 business days of receipt',
            ],
          },
          {
            title: 'Exchanges',
            points: [
              'Exchanges for a different size or colour are welcome within 30 days',
              'Subject to availability — we will confirm before processing',
              'In-boutique exchanges can be done without prior notice',
            ],
          },
          {
            title: 'Refunds',
            points: [
              'Refunded to your original payment method',
              'Bank transfers and UPI refunds take 3–5 business days',
              'Card refunds take 5–10 business days depending on your bank',
              'Original shipping charges are non-refundable unless the item was faulty',
            ],
          },
        ].map(section => (
          <section key={section.title}>
            <h2 className="text-xs tracking-arca uppercase text-arca-charcoal mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.points.map(point => (
                <li key={point} className="flex items-start gap-3 text-sm text-arca-stone">
                  <span className="text-arca-gold text-[10px] mt-1 flex-shrink-0">✦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-16 p-8 bg-arca-cream border border-arca-sand">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Need help?</p>
        <p className="text-sm text-arca-charcoal mb-4">
          Our after-sales team is available Monday to Saturday, 10 am – 7 pm.
        </p>
        <a
          href="mailto:service@arca.com"
          className="text-sm text-arca-ink hover:text-arca-gold transition-colors border-b border-arca-sand hover:border-arca-gold pb-0.5"
        >
          service@arca.com
        </a>
        <span className="text-arca-stone text-sm mx-4">or</span>
        <Link
          href="/account/service"
          className="text-sm text-arca-ink hover:text-arca-gold transition-colors border-b border-arca-sand hover:border-arca-gold pb-0.5"
        >
          Submit a service ticket
        </Link>
      </div>
    </div>
  )
}
