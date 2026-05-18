'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/stores/cartStore'
import { ProductCard } from '@/components/storefront/product/ProductCard'
import Link from 'next/link'

type WishlistProduct = {
  wishlistId: string
  id: string
  name: string
  brand: string | null
  price: number
  image_urls: string[] | null
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('wishlist_items')
        .select('id, products(id, name, brand, price, image_urls)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setItems(
        (data ?? []).map((row: any) => ({
          wishlistId: row.id,
          ...row.products,
        }))
      )
      setLoading(false)
    }
    load()
  }, [])

  async function removeFromWishlist(wishlistId: string) {
    const supabase = createClient()
    await supabase.from('wishlist_items').delete().eq('id', wishlistId)
    setItems(prev => prev.filter(i => i.wishlistId !== wishlistId))
  }

  function addToCart(product: WishlistProduct) {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image_urls?.[0] ?? null,
      fulfillmentType: 'standard',
    })
    openCart()
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Wishlist</h1>

      {loading ? (
        <div className="py-24 text-center text-sm text-arca-stone">Loading…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-arca-sand">
          <p className="text-sm text-arca-stone mb-4">Your wishlist is empty</p>
          <Link
            href="/shop"
            className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
          >
            Discover pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {items.map(product => (
            <div key={product.wishlistId} className="relative group">
              <ProductCard product={product} />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 py-2 border border-arca-ink text-xs tracking-arca uppercase text-arca-ink hover:bg-arca-ink hover:text-arca-ivory transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.wishlistId)}
                  className="p-2 border border-arca-sand text-arca-stone hover:border-arca-ink hover:text-arca-ink transition-colors"
                  aria-label="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
