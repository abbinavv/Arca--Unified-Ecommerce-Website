'use client'

import { motion } from 'framer-motion'
import { ProductCard, type ProductCardData } from './ProductCard'

export function AnimatedProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {products.map(product => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
