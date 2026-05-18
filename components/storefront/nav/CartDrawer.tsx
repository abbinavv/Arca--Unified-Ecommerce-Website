'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/stores/cartStore'
import Link from 'next/link'
import Image from 'next/image'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()
  const total = subtotal()

  const gst = total * 0.18
  const grand = total + gst

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-arca-ivory flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-arca-sand">
              <h2 className="font-display text-lg font-light tracking-[0.2em] uppercase text-arca-ink">
                Cart
              </h2>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center text-arca-stone hover:text-arca-ink transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <svg className="w-12 h-12 text-arca-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <p className="text-sm text-arca-stone tracking-wide">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-arca-sand">
                  {items.map(item => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onQuantityChange={(q) => updateQuantity(item.id, q)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-arca-sand px-6 py-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-arca-charcoal">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-arca-stone text-xs">
                    <span>GST (18%)</span>
                    <span className="font-mono">₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-arca-ink font-medium pt-2 border-t border-arca-sand">
                    <span className="tracking-wide uppercase text-xs">Total</span>
                    <span className="font-mono">₹{grand.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-3.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="block w-full text-center py-3 border border-arca-sand text-xs tracking-arca uppercase text-arca-charcoal hover:border-arca-ink transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CartLineItem({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem
  onRemove: () => void
  onQuantityChange: (q: number) => void
}) {
  return (
    <li className="flex gap-4 px-6 py-5">
      {/* Image */}
      <div className="relative w-20 h-24 bg-arca-cream flex-shrink-0 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-arca-bone" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {item.brand && (
            <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-0.5">{item.brand}</p>
          )}
          <p className="text-sm text-arca-ink leading-snug line-clamp-2">{item.name}</p>
          {item.fulfillmentType !== 'standard' && (
            <span className="inline-block mt-1 text-[10px] tracking-wide uppercase text-arca-gold border border-arca-gold/40 px-1.5 py-0.5">
              {item.fulfillmentType === 'bopis' ? 'Pick up' : 'Ship from store'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-arca-sand">
            <button
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-arca-charcoal hover:text-arca-ink transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-sm leading-none">−</span>
            </button>
            <span className="w-8 text-center text-xs text-arca-ink font-mono">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-arca-charcoal hover:text-arca-ink transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-sm leading-none">+</span>
            </button>
          </div>

          {/* Price + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-arca-ink">
              ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <button
              onClick={onRemove}
              className="text-arca-stone hover:text-arca-ink transition-colors"
              aria-label="Remove item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
