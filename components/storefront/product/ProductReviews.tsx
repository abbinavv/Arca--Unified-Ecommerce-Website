'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

type Review = {
  id: string
  customer_name: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
}

function Stars({ rating, interactive = false, onChange }: {
  rating: number
  interactive?: boolean
  onChange?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(n) : undefined}
          onMouseEnter={interactive ? () => setHovered(n) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
          aria-label={interactive ? `Rate ${n} star${n > 1 ? 's' : ''}` : undefined}
        >
          <Star
            size={interactive ? 18 : 13}
            strokeWidth={1.5}
            className={
              n <= (hovered || rating)
                ? 'fill-arca-gold text-arca-gold'
                : 'fill-transparent text-arca-sand'
            }
          />
        </button>
      ))}
    </div>
  )
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({ rating: 0, title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('product_feedback')
      .select('id, customer_name, rating, title, comment, created_at')
      .eq('product_id', productId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? [])
        setLoading(false)
      })

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      supabase
        .from('clients')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserName([data.first_name, data.last_name].filter(Boolean).join(' '))
          else setUserName(user.email ?? '')
        })
    })
  }, [productId])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) { window.location.href = '/auth/login'; return }
    if (form.rating === 0) { setFormError('Please select a rating.'); return }
    if (!form.comment.trim()) { setFormError('Please write a review.'); return }

    setSubmitting(true)
    setFormError('')
    const supabase = createClient()
    const { error } = await supabase.from('product_feedback').insert({
      product_id: productId,
      customer_id: userId,
      customer_name: userName,
      rating: form.rating,
      title: form.title || undefined,
      comment: form.comment,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) { setFormError(error.message); return }
    setSubmitted(true)
    setShowForm(false)
    setForm({ rating: 0, title: '', comment: '' })
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0

  return (
    <section className="mt-16 pt-12 border-t border-arca-sand">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-light text-arca-ink">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={Math.round(avg)} />
              <span className="text-xs text-arca-stone">
                {avg.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        {!showForm && !submitted && userId && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 border border-arca-sand text-xs tracking-arca uppercase text-arca-charcoal hover:border-arca-ink hover:text-arca-ink transition-colors"
          >
            Write a review
          </button>
        )}
        {!userId && (
          <a
            href="/auth/login"
            className="text-xs text-arca-gold hover:text-arca-gold-dk transition-colors"
          >
            Sign in to review →
          </a>
        )}
      </div>

      {/* Submission confirmed */}
      {submitted && (
        <div className="mb-8 px-5 py-4 border border-arca-sand bg-arca-cream text-sm text-arca-charcoal">
          Thank you — your review is under review and will appear once approved.
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <form onSubmit={submitReview} className="mb-10 p-6 border border-arca-sand space-y-4">
          <h3 className="text-[10px] tracking-arca uppercase text-arca-stone">Your review</h3>

          <div>
            <p className="text-xs text-arca-stone mb-2">Rating *</p>
            <Stars rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
          </div>

          <div>
            <label className="block text-xs text-arca-stone mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Summarise your experience"
              className="w-full h-10 px-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/40 focus:outline-none focus:border-arca-ink transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-arca-stone mb-1.5">Review *</label>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              rows={4}
              placeholder="Share your thoughts on this piece…"
              className="w-full px-3 py-2.5 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/40 focus:outline-none focus:border-arca-ink transition-colors resize-none"
            />
          </div>

          {formError && (
            <p className="text-xs text-red-600">{formError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError('') }}
              className="px-5 py-2.5 border border-arca-sand text-xs tracking-arca uppercase text-arca-stone hover:border-arca-ink hover:text-arca-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse py-5 border-b border-arca-sand">
              <div className="h-3 w-24 bg-arca-bone rounded mb-2" />
              <div className="h-2.5 w-48 bg-arca-sand rounded mb-3" />
              <div className="h-2.5 w-full bg-arca-sand rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-arca-sand">
          <p className="text-sm text-arca-stone">No reviews yet — be the first.</p>
        </div>
      ) : (
        <div className="divide-y divide-arca-sand">
          {reviews.map(review => (
            <div key={review.id} className="py-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <Stars rating={review.rating} />
                  {review.title && (
                    <p className="text-sm font-medium text-arca-ink mt-1.5">{review.title}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-arca-stone">{review.customer_name}</p>
                  <p className="text-[10px] text-arca-stone/60 mt-0.5">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm leading-relaxed text-arca-charcoal">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
