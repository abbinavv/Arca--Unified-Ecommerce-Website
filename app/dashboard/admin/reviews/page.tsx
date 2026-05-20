import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'
import { Star } from 'lucide-react'

export const metadata: Metadata = { title: 'Reviews — Arca Admin' }

async function updateStatus(id: string, status: 'published' | 'rejected') {
  'use server'
  const supabase = await createAdminClient()
  await supabase.from('product_feedback').update({ status }).eq('id', id)
  revalidatePath('/dashboard/admin/reviews')
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={11}
          strokeWidth={1.5}
          className={n <= rating ? 'fill-arca-gold text-arca-gold' : 'fill-transparent text-arca-sand'}
        />
      ))}
    </div>
  )
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'pending' } = await searchParams
  const supabase = await createAdminClient()

  const status = tab === 'published' ? 'published' : tab === 'rejected' ? 'rejected' : 'pending'

  const { data: reviews } = await supabase
    .from('product_feedback')
    .select('id, customer_name, rating, title, comment, created_at, status, products(name)')
    .eq('status', status)
    .order('created_at', { ascending: false })

  const { data: counts } = await supabase
    .from('product_feedback')
    .select('status')

  const pending = counts?.filter(r => r.status === 'pending').length ?? 0
  const published = counts?.filter(r => r.status === 'published').length ?? 0
  const rejected = counts?.filter(r => r.status === 'rejected').length ?? 0

  const TABS = [
    { key: 'pending', label: 'Pending', count: pending },
    { key: 'published', label: 'Published', count: published },
    { key: 'rejected', label: 'Rejected', count: rejected },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display text-2xl font-light text-arca-ink mb-1">Reviews</h1>
      <p className="text-sm text-arca-stone mb-8">Moderate customer product feedback</p>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-arca-sand mb-8">
        {TABS.map(t => (
          <a
            key={t.key}
            href={`/dashboard/admin/reviews?tab=${t.key}`}
            className={`pb-3 text-xs tracking-arca uppercase flex items-center gap-2 border-b-2 transition-colors ${
              tab === t.key
                ? 'border-arca-ink text-arca-ink'
                : 'border-transparent text-arca-stone hover:text-arca-charcoal'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-mono ${
                t.key === 'pending' ? 'bg-arca-gold/20 text-arca-gold-dk' : 'bg-arca-bone text-arca-stone'
              }`}>
                {t.count}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Reviews list */}
      {!reviews || reviews.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-arca-sand">
          <p className="text-sm text-arca-stone">No {status} reviews.</p>
        </div>
      ) : (
        <div className="divide-y divide-arca-sand">
          {reviews.map(review => {
            const product = review.products as { name: string } | null
            return (
              <div key={review.id} className="py-6 grid grid-cols-[1fr_auto] gap-6">
                <div className="min-w-0">
                  {/* Product + meta */}
                  <div className="flex items-center gap-3 mb-3">
                    <Stars rating={review.rating} />
                    <span className="text-[10px] text-arca-stone/60">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                  {product && (
                    <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-1">
                      {product.name}
                    </p>
                  )}
                  {review.title && (
                    <p className="text-sm font-medium text-arca-ink mb-1">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-arca-charcoal leading-relaxed line-clamp-3">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-arca-stone mt-2">by {review.customer_name}</p>
                </div>

                {/* Actions */}
                {status === 'pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <form action={updateStatus.bind(null, review.id, 'published')}>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-arca-ink text-arca-ivory text-[11px] tracking-arca uppercase hover:bg-arca-charcoal transition-colors w-full"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={updateStatus.bind(null, review.id, 'rejected')}>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-arca-sand text-[11px] tracking-arca uppercase text-arca-stone hover:border-arca-ink hover:text-arca-ink transition-colors w-full"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
                {status === 'published' && (
                  <form action={updateStatus.bind(null, review.id, 'rejected')}>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-arca-sand text-[11px] tracking-arca uppercase text-arca-stone hover:border-red-400 hover:text-red-500 transition-colors"
                    >
                      Unpublish
                    </button>
                  </form>
                )}
                {status === 'rejected' && (
                  <form action={updateStatus.bind(null, review.id, 'published')}>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-arca-sand text-[11px] tracking-arca uppercase text-arca-stone hover:border-arca-ink hover:text-arca-ink transition-colors"
                    >
                      Re-approve
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
