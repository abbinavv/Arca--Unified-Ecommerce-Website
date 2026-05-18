import Link from 'next/link'

const HERO_IMAGE = 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/skeletonWatches/Skeleton%20Watches1.jpeg'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] flex items-end bg-arca-cream overflow-hidden">
      {/* Split panels */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-arca-bone" />
        <div
          className="w-1/2 h-full bg-center bg-cover"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        >
          <div className="w-full h-full bg-arca-ink/10" />
        </div>
      </div>

      {/* Decorative vertical rule */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-arca-sand/60 z-10" />

      {/* Decorative label — top right */}
      <p className="absolute top-12 right-8 md:right-16 text-[10px] tracking-[0.25em] uppercase text-arca-ivory/80 z-10">
        New Season — S/S 2026
      </p>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <p className="text-xs tracking-arca uppercase text-arca-gold mb-6">
            A Treasury of the Extraordinary
          </p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-[-0.01em] text-arca-ink mb-8">
            The New
            <br />
            <em className="not-italic text-arca-charcoal">Collections</em>
          </h1>
          <p className="text-sm leading-relaxed text-arca-stone max-w-xs mb-10">
            Curated pieces from the world's most celebrated ateliers.
            Delivered with the care they deserve.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
            >
              Explore Now
            </Link>
            <Link
              href="/about"
              className="text-xs tracking-arca uppercase text-arca-charcoal border-b border-arca-sand hover:border-arca-ink transition-colors pb-0.5"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[9px] tracking-[0.3em] uppercase text-arca-stone">Scroll</span>
        <div className="w-px h-10 bg-arca-sand" />
      </div>
    </section>
  )
}
