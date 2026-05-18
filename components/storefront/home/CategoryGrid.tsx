import Link from 'next/link'

const CATEGORIES = [
  {
    href: '/shop/women',
    label: 'Women',
    sub: 'Gowns, jackets, blouses & more',
    bg: 'bg-arca-bone',
    accent: 'text-arca-charcoal',
  },
  {
    href: '/shop/men',
    label: 'Men',
    sub: 'Tailoring, footwear & leather',
    bg: 'bg-arca-cream',
    accent: 'text-arca-charcoal',
  },
  {
    href: '/shop/watches',
    label: 'Watches',
    sub: 'Fine timepieces & haute horlogerie',
    bg: 'bg-[#EEE9E0]',
    accent: 'text-arca-charcoal',
  },
  {
    href: '/shop/jewellery',
    label: 'Jewellery',
    sub: 'Rings, necklaces & fine stones',
    bg: 'bg-arca-ink',
    accent: 'text-arca-sand',
  },
]

export function CategoryGrid() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <h2 className="font-display text-4xl font-light tracking-tight text-arca-ink">
          Shop by Category
        </h2>
        <Link
          href="/shop"
          className="hidden md:block text-xs tracking-arca uppercase text-arca-stone hover:text-arca-gold transition-colors border-b border-transparent hover:border-arca-gold pb-0.5"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group relative flex flex-col justify-end p-6 min-h-[280px] md:min-h-[360px] ${cat.bg} hover:opacity-90 transition-opacity`}
          >
            {/* Decorative corner mark */}
            <span className="absolute top-4 right-4 w-4 h-4 border-t border-r border-current opacity-20 group-hover:opacity-60 transition-opacity" />

            <div>
              <p className={`text-[10px] tracking-arca uppercase mb-2 opacity-60 ${cat.accent}`}>
                {cat.sub}
              </p>
              <h3 className={`font-display text-3xl font-light ${cat.accent}`}>
                {cat.label}
              </h3>
              <div className={`mt-3 flex items-center gap-2 text-[10px] tracking-arca uppercase ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span>Shop now</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
