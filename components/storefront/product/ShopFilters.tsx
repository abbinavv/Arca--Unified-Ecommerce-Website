'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

type Category = { id: string; name: string }

type Props = {
  categories: Category[]
  currentCategory?: string
  totalCount: number
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'New In' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function ShopFilters({ categories, currentCategory, totalCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort') ?? 'newest'
  const minPrice = searchParams.get('min') ?? ''
  const maxPrice = searchParams.get('max') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Result count */}
      <p className="text-xs text-arca-stone mb-8">
        {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
      </p>

      {/* Sort */}
      <div className="mb-8">
        <h3 className="text-[10px] tracking-arca uppercase text-arca-ink mb-3">Sort</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={`block text-sm transition-colors ${
                sort === opt.value
                  ? 'text-arca-ink font-medium'
                  : 'text-arca-stone hover:text-arca-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] tracking-arca uppercase text-arca-ink mb-3">Category</h3>
          <div className="space-y-2">
            <a
              href="/shop"
              className={`block text-sm transition-colors ${
                !currentCategory
                  ? 'text-arca-ink font-medium'
                  : 'text-arca-stone hover:text-arca-charcoal'
              }`}
            >
              All
            </a>
            {categories.map(cat => {
              const slug = cat.name.toLowerCase()
              const active = currentCategory?.toLowerCase() === slug
              return (
                <a
                  key={cat.id}
                  href={`/shop/${slug}`}
                  className={`block text-sm transition-colors ${
                    active
                      ? 'text-arca-ink font-medium'
                      : 'text-arca-stone hover:text-arca-charcoal'
                  }`}
                >
                  {cat.name}
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Price range */}
      <div className="mb-8">
        <h3 className="text-[10px] tracking-arca uppercase text-arca-ink mb-3">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => updateParam('min', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-arca-sand bg-transparent text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
          />
          <span className="text-arca-stone text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => updateParam('max', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-arca-sand bg-transparent text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
          />
        </div>
      </div>
    </aside>
  )
}
