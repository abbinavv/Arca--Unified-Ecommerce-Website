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
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
    <Link href={`/products/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-arca-cream mb-3 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-arca-bone flex items-center justify-center">
            <span className="text-[9px] tracking-arca uppercase text-arca-stone/40">Arca</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.brand && (
          <p className="text-[10px] tracking-arca uppercase text-arca-stone mb-0.5">
            {product.brand}
          </p>
        )}
        <p className="text-sm text-arca-ink leading-snug line-clamp-2 mb-1">
          {product.name}
        </p>
        <p className="text-sm font-mono text-arca-charcoal">
          ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>
    </Link>
    </motion.div>
  )
}
