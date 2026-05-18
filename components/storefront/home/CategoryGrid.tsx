import Link from 'next/link'

const CATEGORIES = [
  {
    href: '/shop/women',
    label: 'Women',
    sub: 'Gowns, jackets, blouses & more',
    image: 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/bridalGowns/bridal_gowns1.jpg',
  },
  {
    href: '/shop/men',
    label: 'Men',
    sub: 'Tailoring, footwear & leather',
    image: 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/tailoredSuits/tailoredSuits-4.jpeg',
  },
  {
    href: '/shop/watches',
    label: 'Watches',
    sub: 'Fine timepieces & haute horlogerie',
    image: 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/analogueDressWatches/Analogue%20Dress%20Watches1.jpeg',
  },
  {
    href: '/shop/jewellery',
    label: 'Jewellery',
    sub: 'Rings, necklaces & fine stones',
    image: 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/bracelets/bracelet1.jpeg',
  },
]

export function CategoryGrid() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-24">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative flex flex-col justify-end min-h-[280px] md:min-h-[360px] overflow-hidden bg-arca-bone"
            style={{ backgroundImage: `url('${cat.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:from-black/80" />

            {/* Decorative corner */}
            <span className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30 group-hover:border-white/70 transition-colors" />

            {/* Text */}
            <div className="relative z-10 p-6">
              <p className="text-[10px] tracking-arca uppercase mb-2 text-white/60">
                {cat.sub}
              </p>
              <h3 className="font-display text-3xl font-light text-white">
                {cat.label}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-[10px] tracking-arca uppercase text-white/0 group-hover:text-white/90 transition-all duration-200">
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
