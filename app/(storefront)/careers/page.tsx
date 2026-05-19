import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers — Arca',
  description: 'Join the Arca team. We are always looking for exceptional people.',
}

const ROLES = [
  { title: 'Senior Sales Associate', location: 'Mumbai', type: 'Full-time' },
  { title: 'After-Sales Specialist', location: 'New Delhi', type: 'Full-time' },
  { title: 'Visual Merchandiser', location: 'Bengaluru', type: 'Full-time' },
  { title: 'Client Relations Manager', location: 'Mumbai', type: 'Full-time' },
]

export default function CareersPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-20 max-w-2xl">
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Careers</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-arca-ink leading-tight mb-6">
          Work with us
        </h1>
        <p className="text-sm leading-[1.9] text-arca-stone">
          Arca is built on the belief that extraordinary experiences require extraordinary people.
          We look for individuals who share our obsession with craft, provenance, and quiet excellence.
          If that sounds like you, we would like to meet.
        </p>
      </div>

      {/* Open roles */}
      <div className="mb-20">
        <h2 className="text-[10px] tracking-arca uppercase text-arca-stone mb-8">Open positions</h2>
        <div className="divide-y divide-arca-sand border-t border-b border-arca-sand">
          {ROLES.map(role => (
            <div
              key={role.title}
              className="flex items-center justify-between py-6 group"
            >
              <div>
                <p className="text-sm font-medium text-arca-ink group-hover:text-arca-gold transition-colors">
                  {role.title}
                </p>
                <p className="text-xs text-arca-stone mt-1">{role.location} · {role.type}</p>
              </div>
              <a
                href={`mailto:careers@arca.com?subject=Application — ${role.title}`}
                className="text-xs tracking-arca uppercase text-arca-stone border-b border-transparent hover:border-arca-gold hover:text-arca-gold transition-colors pb-0.5"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* General applications */}
      <div className="bg-arca-cream p-12 max-w-xl">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">Don&apos;t see your role?</p>
        <h2 className="font-display text-2xl font-light text-arca-ink mb-4">
          Send a general application
        </h2>
        <p className="text-sm text-arca-stone leading-relaxed mb-6">
          We are always interested in meeting talented people, even when we aren&apos;t
          actively hiring. Send us your portfolio and a brief introduction.
        </p>
        <a
          href="mailto:careers@arca.com"
          className="inline-block px-8 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          careers@arca.com
        </a>
      </div>
    </div>
  )
}
