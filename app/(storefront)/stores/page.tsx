import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Boutiques — Arca',
  description: 'Visit an Arca boutique in Mumbai, New Delhi, or Bengaluru.',
}

const STORES = [
  {
    name: 'Arca Mumbai Flagship',
    address: 'Ground Floor, Palladium Mall, Lower Parel',
    city: 'Mumbai',
    region: 'Maharashtra',
    hours: 'Mon–Sun, 11 am – 9 pm',
    email: 'mumbai@arca.com',
  },
  {
    name: 'Arca New Delhi',
    address: 'DLF Emporio, Nelson Mandela Road, Vasant Kunj',
    city: 'New Delhi',
    region: 'Delhi',
    hours: 'Mon–Sun, 11 am – 9 pm',
    email: 'delhi@arca.com',
  },
  {
    name: 'Arca Bengaluru',
    address: 'UB City Mall, Vittal Mallya Road',
    city: 'Bengaluru',
    region: 'Karnataka',
    hours: 'Mon–Sun, 11 am – 9 pm',
    email: 'bengaluru@arca.com',
  },
]

export default function StoresPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-24">
      <div className="mb-16">
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">Locations</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-arca-ink leading-tight">
          Our Boutiques
        </h1>
        <p className="text-sm text-arca-stone mt-4 max-w-md leading-relaxed">
          Three addresses, one standard of service. Visit us for private appointments,
          bespoke styling, and complimentary aftercare.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-arca-sand">
        {STORES.map(store => (
          <div key={store.name} className="bg-arca-ivory p-10">
            <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-6">Boutique</p>
            <h2 className="font-display text-2xl font-light text-arca-ink mb-6 leading-snug">
              {store.name}
            </h2>
            <div className="space-y-4 text-sm text-arca-stone">
              <div>
                <p className="text-[10px] tracking-arca uppercase text-arca-charcoal mb-1">Address</p>
                <p>{store.address}</p>
                <p>{store.city}, {store.region}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-arca uppercase text-arca-charcoal mb-1">Hours</p>
                <p>{store.hours}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-arca uppercase text-arca-charcoal mb-1">Contact</p>
                <a
                  href={`mailto:${store.email}`}
                  className="hover:text-arca-gold transition-colors"
                >
                  {store.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-16 border-t border-arca-sand text-center">
        <p className="text-xs tracking-arca uppercase text-arca-stone mb-4">Private appointments</p>
        <p className="text-sm text-arca-charcoal mb-6 max-w-sm mx-auto">
          For a dedicated session with one of our stylists, book through your account.
        </p>
        <a
          href="/account/appointments"
          className="inline-block px-8 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          Book an appointment
        </a>
      </div>
    </div>
  )
}
