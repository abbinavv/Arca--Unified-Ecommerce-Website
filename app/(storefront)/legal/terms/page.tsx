import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Arca',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Legal</p>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-2">Terms of Use</h1>
      <p className="text-xs text-arca-stone mb-12">Last updated: May 2026</p>

      <div className="space-y-8">
        {[
          {
            title: '1. Acceptance of terms',
            body: 'By accessing or using arca.com you agree to be bound by these terms. If you do not agree, please do not use our platform. These terms apply to all visitors, registered users, and customers.',
          },
          {
            title: '2. Products and pricing',
            body: 'All prices are displayed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and to modify prices without notice. Product availability is not guaranteed.',
          },
          {
            title: '3. Orders and payment',
            body: 'An order confirmation email does not constitute acceptance of your order. We reserve the right to cancel orders for any reason including suspected fraud, pricing errors, or stock unavailability. Payment is due at the time of order.',
          },
          {
            title: '4. Shipping and delivery',
            body: 'Delivery timelines are estimates and not guarantees. Arca is not responsible for delays caused by logistics partners or circumstances beyond our control. Risk passes to the customer upon delivery.',
          },
          {
            title: '5. Returns and exchanges',
            body: 'Items may be returned within 30 days of delivery if unworn, unaltered, and in original packaging with tags attached. Sale items and bespoke orders are final sale. To initiate a return, contact service@arca.com or use your account portal.',
          },
          {
            title: '6. Intellectual property',
            body: 'All content on this platform — including images, copy, logos, and design — is owned by Arca or its licensors. You may not reproduce, distribute, or create derivative works without our written permission.',
          },
          {
            title: '7. Limitation of liability',
            body: 'Arca\'s liability is limited to the value of the order in question. We are not liable for indirect, incidental, or consequential damages arising from use of our platform or products.',
          },
          {
            title: '8. Governing law',
            body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.',
          },
        ].map(section => (
          <section key={section.title}>
            <h2 className="text-sm font-medium text-arca-ink mb-2">{section.title}</h2>
            <p className="text-sm leading-[1.9] text-arca-stone">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
