import type { Metadata } from 'next'
import Link from 'next/link'

const STORAGE = 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/'

export const metadata: Metadata = {
  title: 'Our Story — Arca',
  description:
    'Arca is a curated treasury of luxury goods chosen for provenance, craft, and longevity. Learn about the values that guide every piece we carry.',
}

export default function AboutPage() {
  return (
    <div className="bg-arca-ivory">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-arca-ink text-arca-ivory min-h-[90vh] grid md:grid-cols-2">
        {/* Left: copy */}
        <div className="flex flex-col justify-center px-10 py-20 md:px-16 lg:px-24 xl:px-32">
          <p className="text-xs tracking-arca uppercase text-arca-gold mb-8">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-10">
            Born from a belief that luxury is provenance,&nbsp;not price.
          </h1>
          <div className="space-y-5 text-sm leading-[1.9] text-arca-ivory/70 max-w-md">
            <p>
              Arca began as a quiet conviction: that the most meaningful objects are those whose
              origins you can trace — the atelier, the artisan, the season in which they were
              made. We built a treasury around that conviction, gathering pieces that reward
              the kind of unhurried attention most retail has abandoned.
            </p>
            <p>
              We do not chase trend or volume. Every brand we carry is selected in person, every
              maker known by name. The result is a collection that feels less like a shop and
              more like an inheritance — things chosen to be passed on, not replaced.
            </p>
          </div>
        </div>

        {/* Right: image */}
        <div
          className="min-h-[60vh] md:min-h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${STORAGE}skeletonWatches/Skeleton%20Watches1.jpeg')`,
          }}
          aria-hidden="true"
        />
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────────────── */}
      <section className="bg-arca-cream py-24 px-6">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-xs tracking-arca uppercase text-arca-stone mb-16 text-center">
            What We Stand For
          </p>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-arca-sand">
            {[
              {
                title: 'Provenance',
                body: 'Every maker is known by name, every origin traced to its source. We accept nothing whose story we cannot tell.',
              },
              {
                title: 'Craft',
                body: 'We carry only pieces that reward close inspection — where the construction, the material, and the finish repay the asking price.',
              },
              {
                title: 'Longevity',
                body: 'Each piece is chosen to outlast its season. We think in decades, not in trends, and curate accordingly.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0">
                <h2 className="font-display text-2xl font-light text-arca-ink mb-5">{title}</h2>
                <p className="text-sm leading-[1.9] text-arca-charcoal">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Image Strip ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-arca-ivory">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 gap-3">
          {/* First image — tall */}
          <div
            className="h-[500px] bg-cover bg-center bg-arca-cream"
            style={{
              backgroundImage: `url('${STORAGE}bridalGowns/bridal_gowns1.jpg')`,
            }}
            aria-hidden="true"
          />

          {/* Second column — two stacked images */}
          <div className="flex flex-col gap-3">
            <div
              className="h-[240px] bg-cover bg-center bg-arca-cream"
              style={{
                backgroundImage: `url('${STORAGE}tailoredSuits/tailoredSuits-4.jpeg')`,
              }}
              aria-hidden="true"
            />
            <div
              className="h-[240px] bg-cover bg-center bg-arca-cream"
              style={{
                backgroundImage: `url('${STORAGE}bracelets/bracelet1.jpeg')`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ── Team / Values ─────────────────────────────────────────────────────── */}
      <section className="bg-arca-ivory py-24 px-6 border-t border-arca-sand">
        <div className="max-w-screen-lg mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Quote */}
          <div>
            <blockquote className="font-display text-3xl md:text-4xl font-light text-arca-ink leading-[1.2]">
              &ldquo;Every piece chosen with the same scrutiny we apply to our service.&rdquo;
            </blockquote>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-arca-sand border border-arca-sand">
            {[
              { value: '2019', label: 'Founded' },
              { value: '3', label: 'Cities' },
              { value: '50+', label: 'Brands' },
              { value: '10,000+', label: 'Clients' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-arca-ivory px-8 py-10">
                <p className="font-display text-4xl font-light text-arca-ink mb-2">{value}</p>
                <p className="text-xs tracking-arca uppercase text-arca-stone">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ─────────────────────────────────────────────────────────── */}
      <section className="bg-arca-ink py-24 px-6 text-center">
        <h2 className="font-display text-4xl font-light text-arca-ivory mb-8">
          Explore the Treasury
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/shop"
            className="inline-block border border-arca-ivory text-arca-ivory text-xs tracking-arca uppercase px-10 py-4 hover:bg-arca-ivory hover:text-arca-ink transition-colors duration-200"
          >
            Shop Now
          </Link>
          <a
            href="mailto:hello@arca.com"
            className="text-xs tracking-arca uppercase text-arca-ivory/60 hover:text-arca-ivory transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </section>

    </div>
  )
}
