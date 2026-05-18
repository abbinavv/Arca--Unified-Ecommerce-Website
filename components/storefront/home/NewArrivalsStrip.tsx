import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ProductCard, type ProductCardData } from '@/components/storefront/product/ProductCard'

type Product = ProductCardData

async function getNewArrivals(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, brand, price, image_urls')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as Product[]
}

export async function NewArrivalsStrip() {
  const products = await getNewArrivals()

  if (products.length === 0) return null

  return (
    <section className="py-20 bg-arca-ivory border-t border-arca-sand">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl font-light tracking-tight text-arca-ink">
            New Arrivals
          </h2>
          <Link
            href="/shop?sort=newest"
            className="hidden md:block text-xs tracking-arca uppercase text-arca-stone hover:text-arca-gold transition-colors border-b border-transparent hover:border-arca-gold pb-0.5"
          >
            See All
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {products.map(product => (
            <div key={product.id} className="flex-shrink-0 w-56 md:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

