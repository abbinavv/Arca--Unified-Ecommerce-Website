import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/storefront/product/AddToCartButton'
import { ProductCard } from '@/components/storefront/product/ProductCard'
import { ProductGallery } from '@/components/storefront/product/ProductGallery'
import { FulfillmentSelector } from '@/components/storefront/product/FulfillmentSelector'
import type { Metadata } from 'next'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, brand')
    .eq('id', id)
    .single()
  if (!data) return { title: 'Product — Arca' }
  return { title: `${data.name}${data.brand ? ` by ${data.brand}` : ''} — Arca` }
}

async function getProduct(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, sku, description, price, brand, category_id, image_urls')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  return data
}

async function getRelated(categoryId: string | null, excludeId: string) {
  if (!categoryId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, brand, price, image_urls')
    .is('deleted_at', null)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(4)
  return data ?? []
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const related = await getRelated(product.category_id, product.id)
  const images: string[] = product.image_urls ?? []

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] text-arca-stone mb-10">
        <Link href="/shop" className="hover:text-arca-ink transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-arca-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <ProductGallery images={images} productName={product.name} />

        {/* Details */}
        <div className="flex flex-col">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs tracking-arca uppercase text-arca-gold mb-3">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h1 className="font-display text-4xl font-light leading-tight text-arca-ink mb-4">
            {product.name}
          </h1>

          {/* SKU */}
          {product.sku && (
            <p className="text-[11px] text-arca-stone mb-6 font-mono">{product.sku}</p>
          )}

          {/* Price */}
          <p className="text-2xl font-mono text-arca-ink mb-8">
            ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            <span className="text-xs font-sans text-arca-stone ml-2">incl. taxes</span>
          </p>

          {/* Fulfillment */}
          <div className="mb-8">
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Fulfillment</p>
            <FulfillmentSelector />
          </div>

          {/* Add to cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              image_urls: product.image_urls,
            }}
          />

          {/* Description */}
          {product.description && (
            <div className="mt-10 pt-8 border-t border-arca-sand">
              <h2 className="text-[10px] tracking-arca uppercase text-arca-stone mb-4">
                About this piece
              </h2>
              <p className="text-sm leading-[1.9] text-arca-charcoal">
                {product.description}
              </p>
            </div>
          )}

          {/* Shipping note */}
          <div className="mt-8 pt-8 border-t border-arca-sand space-y-3">
            {[
              { icon: '✦', text: 'Complimentary gift packaging on all orders' },
              { icon: '✦', text: '30-day returns for unworn items' },
              { icon: '✦', text: 'Authenticity guaranteed' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-arca-gold text-[10px] mt-0.5">{item.icon}</span>
                <p className="text-xs text-arca-stone">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-arca-sand">
          <h2 className="font-display text-3xl font-light text-arca-ink mb-10">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
