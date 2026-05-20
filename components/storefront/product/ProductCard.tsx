'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export type ProductCardData = {
  id: string
  name: string
  brand: string | null
  price: number
  image_urls: string[] | null
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.image_urls?.[0] ?? null

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
    <Link
      href={`/products/${product.id}`}
      className="group block border border-arca-sand hover:border-arca-charcoal transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-arca-cream overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-arca-bone flex items-center justify-center">
            <span className="font-display text-2xl font-light tracking-[0.3em] uppercase text-arca-stone/20">Arca</span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-arca-ink/0 group-hover:bg-arca-ink/8 transition-colors duration-300 pointer-events-none" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-[9px] tracking-[0.2em] uppercase text-arca-ivory bg-arca-ink/70 px-3 py-1.5">
            View
          </span>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-px bg-arca-sand group-hover:bg-arca-gold transition-colors duration-300" />

      {/* Info */}
      <div className="px-3.5 py-3">
        {product.brand && (
          <p className="text-[9px] tracking-[0.18em] uppercase text-arca-stone mb-1">
            {product.brand}
          </p>
        )}
        <p className="text-sm text-arca-ink leading-snug line-clamp-2 mb-2">
          {product.name}
        </p>
        <p className="text-[13px] font-mono text-arca-charcoal">
          ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>
    </Link>
    </motion.div>
  )
}
