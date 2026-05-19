import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Arca',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Legal</p>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-2">Privacy Policy</h1>
      <p className="text-xs text-arca-stone mb-12">Last updated: May 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-arca-charcoal">
        {[
          {
            title: '1. Information we collect',
            body: 'We collect information you provide when creating an account, placing an order, or contacting us — including your name, email address, phone number, delivery address, and payment details. We also collect usage data such as pages visited and products viewed to improve your experience.',
          },
          {
            title: '2. How we use your information',
            body: 'Your data is used to process orders, communicate about purchases, personalise recommendations, and improve our services. We do not sell your personal data to third parties. We may share it with trusted service providers (logistics, payment processors) strictly for order fulfilment.',
          },
          {
            title: '3. Data retention',
            body: 'We retain your account information for as long as your account is active. Order records are kept for seven years for accounting and legal compliance. You may request deletion of your account and associated data at any time by contacting hello@arca.com.',
          },
          {
            title: '4. Cookies',
            body: 'We use essential cookies to maintain your session and cart. Analytics cookies (used to understand site performance) are optional and can be declined. We do not use advertising or third-party tracking cookies.',
          },
          {
            title: '5. Your rights',
            body: 'Under applicable data protection laws you have the right to access, correct, or delete your personal data. You may also object to certain processing or request data portability. To exercise these rights, contact hello@arca.com.',
          },
          {
            title: '6. Security',
            body: 'We implement industry-standard security measures including TLS encryption, access controls, and regular audits. Payment data is processed by Stripe and never stored on our servers.',
          },
          {
            title: '7. Contact',
            body: 'For any privacy-related questions or requests, write to hello@arca.com. We will respond within five business days.',
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
