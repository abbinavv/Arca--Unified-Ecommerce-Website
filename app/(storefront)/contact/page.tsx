import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Arca',
  description: 'Get in touch with the Arca team.',
}

const CONTACTS = [
  {
    label: 'General Enquiries',
    email: 'hello@arca.com',
    note: 'We respond within one business day.',
  },
  {
    label: 'After-Sales & Repairs',
    email: 'service@arca.com',
    note: 'For warranty claims, repairs, and returns.',
  },
  {
    label: 'Press & Partnerships',
    email: 'press@arca.com',
    note: 'Media, collaborations, and brand enquiries.',
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

        {/* Left */}
        <div>
          <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Get in touch</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-arca-ink leading-tight mb-8">
            We&apos;d love to<br />hear from you.
          </h1>
          <p className="text-sm leading-[1.9] text-arca-stone max-w-sm">
            Whether you have a question about a piece, need advice on a gift, or simply
            want to know more about what we carry — our team is here.
          </p>
        </div>

        {/* Right */}
        <div className="space-y-px bg-arca-sand">
          {CONTACTS.map(c => (
            <div key={c.label} className="bg-arca-ivory p-8">
              <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">{c.label}</p>
              <a
                href={`mailto:${c.email}`}
                className="font-display text-xl font-light text-arca-ink hover:text-arca-gold transition-colors block mb-2"
              >
                {c.email}
              </a>
              <p className="text-xs text-arca-stone">{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Boutique visits */}
      <div className="mt-24 pt-16 border-t border-arca-sand">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">Prefer in person?</p>
        <div className="flex items-center gap-8">
          <p className="text-sm text-arca-charcoal">Visit one of our three boutiques across India.</p>
          <a
            href="/stores"
            className="text-xs tracking-arca uppercase text-arca-charcoal border-b border-arca-sand hover:border-arca-gold hover:text-arca-gold transition-colors pb-0.5 whitespace-nowrap"
          >
            Find a boutique
          </a>
        </div>
      </div>
    </div>
  )
}
