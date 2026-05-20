'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { createClient } from '@/lib/supabase/client'

type Props = {
  product: {
    id: string
    name: string
    brand: string | null
    price: number
    image_urls: string[] | null
  }
  wishlistSlot?: React.ReactNode
}

const FULFILLMENT_OPTIONS = [
  { value: 'standard', label: 'Standard Delivery', sub: '3–5 business days' },
  { value: 'bopis', label: 'Pick Up In-Store', sub: 'Ready in 2 hours' },
  { value: 'ship_from_store', label: 'Ship from Store', sub: '1–2 business days' },
] as const

type FulfillmentType = 'standard' | 'bopis' | 'ship_from_store'

export function AddToCartButton({ product, wishlistSlot }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)
  const cartItems = useCartStore(s => s.items)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('standard')
  const [added, setAdded] = useState(false)
  const [availableQty, setAvailableQty] = useState<number | null>(null)
  const [stockLoading, setStockLoading] = useState(true)

  useEffect(() => {
    async function checkStock() {
      setStockLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('inventory')
        .select('available_qty')
        .eq('product_id', product.id)
      const total = (data ?? []).reduce((sum, row) => sum + (row.available_qty ?? 0), 0)
      setAvailableQty(data && data.length > 0 ? total : null)
      setStockLoading(false)
    }
    checkStock()
  }, [product.id])

  const cartQty = cartItems.find(i => i.id === product.id)?.quantity ?? 0
  const isOutOfStock = !stockLoading && (availableQty === null || availableQty <= 0)
  const isMaxInCart = !stockLoading && !isOutOfStock && availableQty !== null && cartQty >= availableQty
  const isDisabled = stockLoading || isOutOfStock || isMaxInCart

  function handleAdd() {
    if (isDisabled) return
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image_urls?.[0] ?? null,
      fulfillmentType: fulfillment,
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  function getButtonLabel() {
    if (stockLoading) return 'Checking stock…'
    if (isOutOfStock) return 'Out of Stock'
    if (isMaxInCart) return 'Max qty in cart'
    if (added) return 'Added to Cart'
    return 'Add to Cart'
  }

  function getButtonClass() {
    if (stockLoading) {
      return 'w-full py-4 text-xs tracking-arca uppercase transition-all bg-arca-cream text-arca-stone cursor-wait'
    }
    if (isOutOfStock || isMaxInCart) {
      return 'w-full py-4 text-xs tracking-arca uppercase transition-all bg-arca-sand text-arca-stone cursor-not-allowed'
    }
    if (added) {
      return 'w-full py-4 text-xs tracking-arca uppercase transition-all bg-arca-gold text-white'
    }
    return 'w-full py-4 text-xs tracking-arca uppercase transition-all bg-arca-ink text-arca-ivory hover:bg-arca-charcoal'
  }

  return (
    <div className="space-y-4">
      {/* Fulfillment selector */}
      <div>
        <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-3">Fulfillment</p>
        <div className="space-y-2">
          {FULFILLMENT_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                fulfillment === opt.value
                  ? 'border-arca-ink bg-arca-cream'
                  : 'border-arca-sand hover:border-arca-charcoal'
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value={opt.value}
                checked={fulfillment === opt.value}
                onChange={() => setFulfillment(opt.value)}
                className="mt-0.5 accent-arca-ink"
              />
              <div>
                <p className="text-xs text-arca-ink leading-snug">{opt.label}</p>
                <p className="text-[11px] text-arca-stone">{opt.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Add to cart + optional wishlist slot */}
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          disabled={isDisabled}
          className={`flex-1 ${getButtonClass().replace('w-full ', '')}`}
        >
          {getButtonLabel()}
        </button>
        {wishlistSlot}
      </div>
    </div>
  )
}
