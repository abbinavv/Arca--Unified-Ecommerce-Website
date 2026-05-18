import Link from 'next/link'

const IMG_WATCH = 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/machanicalWatches/mechanicalwatch1.jpeg'
const IMG_JEWEL = 'https://kpgjktaxddcbsvbowxwx.supabase.co/storage/v1/object/public/product-images/chokerNecklaces/choker_set1.jpg'

export function BrandStorySection() {
  return (
    <section className="bg-arca-ink text-arca-ivory py-28">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Text */}
          <div>
            <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-8">Our Philosophy</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] text-arca-ivory mb-8">
              Curated with
              <br />
              intention.
            </h2>
            <p className="text-sm leading-[1.9] text-arca-stone max-w-sm mb-6">
              Arca was born from a belief that luxury is not merely price —
              it is provenance, craft, and the rare feeling of holding
              something made to last generations.
            </p>
            <p className="text-sm leading-[1.9] text-arca-stone max-w-sm mb-10">
              Every piece in our treasury is chosen with the same scrutiny
              we apply to our service: unhurried, exacting, and entirely
              devoted to your experience.
            </p>
            <Link
              href="/about"
              className="text-xs tracking-arca uppercase text-arca-ivory border-b border-arca-charcoal hover:border-arca-gold hover:text-arca-gold transition-colors pb-0.5"
            >
              Read our story
            </Link>
          </div>

          {/* Visual column */}
          <div className="hidden md:grid grid-cols-2 gap-3 h-[480px]">
            <div
              className="bg-center bg-cover bg-arca-charcoal"
              style={{ backgroundImage: `url('${IMG_WATCH}')` }}
            />
            <div className="flex flex-col gap-3">
              <div
                className="flex-1 bg-center bg-cover bg-[#1C1C1A]"
                style={{ backgroundImage: `url('${IMG_JEWEL}')` }}
              />
              <div className="h-24 bg-arca-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl font-light tracking-[0.3em] uppercase text-arca-gold/80">
                  Arca
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
