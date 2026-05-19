import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/product/ProductCard'
import { ShopFilters } from '@/components/storefront/product/ShopFilters'

type SearchParams = Promise<{
  sort?: string
  min?: string
  max?: string
}>

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shop — Arca',
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('name')
  return data ?? []
}

async function getProducts(params: { sort?: string; min?: string; max?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('id, name, brand, price, image_urls')
    .is('deleted_at', null)

  if (params.min) query = query.gte('price', Number(params.min))
  if (params.max) query = query.lte('price', Number(params.max))

  if (params.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (params.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data ?? []
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(sp),
  ])

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-5xl font-light tracking-tight text-arca-ink mb-2">
          All Products
        </h1>
        <div className="w-12 h-px bg-arca-gold mt-4" />
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters */}
        <Suspense fallback={null}>
          <ShopFilters
            categories={categories}
            totalCount={products.length}
          />
        </Suspense>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-sm text-arca-stone mb-2">No products found</p>
              <p className="text-xs text-arca-stone/60">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
