import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/product/ProductCard'
import { ShopFilters } from '@/components/storefront/product/ShopFilters'
import type { Metadata } from 'next'

type Params = Promise<{ category: string }>
type SearchParams = Promise<{ sort?: string; min?: string; max?: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params
  const label = category.charAt(0).toUpperCase() + category.slice(1)
  return { title: `${label} — Arca` }
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

async function getProductsByCategory(
  categorySlug: string,
  filters: { sort?: string; min?: string; max?: string }
) {
  const supabase = await createClient()

  // Match category name case-insensitively
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', categorySlug)
    .single()

  if (!cat) return []

  let query = supabase
    .from('products')
    .select('id, name, brand, price, image_urls')
    .is('deleted_at', null)
    .eq('category_id', cat.id)

  if (filters.min) query = query.gte('price', Number(filters.min))
  if (filters.max) query = query.lte('price', Number(filters.max))

  if (filters.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data ?? []
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { category } = await params
  const sp = await searchParams
  const label = category.charAt(0).toUpperCase() + category.slice(1)

  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(category, sp),
  ])

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-5xl font-light tracking-tight text-arca-ink mb-2">
          {label}
        </h1>
        <div className="w-12 h-px bg-arca-gold mt-4" />
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <Suspense fallback={null}>
          <ShopFilters
            categories={categories}
            currentCategory={category}
            totalCount={products.length}
          />
        </Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-sm text-arca-stone mb-2">No products in {label} yet</p>
              <a
                href="/shop"
                className="text-xs tracking-arca uppercase text-arca-gold hover:text-arca-gold-dk transition-colors"
              >
                Browse all
              </a>
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
