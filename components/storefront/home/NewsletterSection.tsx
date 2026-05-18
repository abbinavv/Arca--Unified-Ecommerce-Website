'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="py-24 bg-arca-cream border-t border-arca-sand">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <p className="text-[10px] tracking-arca uppercase text-arca-gold mb-4">
          Stay informed
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-arca-ink mb-4">
          The Arca Edit
        </h2>
        <p className="text-sm text-arca-stone max-w-md mx-auto mb-10">
          New arrivals, private previews, and invitations to exclusive events.
          Reserved for those who appreciate what endures.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-px bg-arca-gold mx-auto" />
            <p className="text-sm text-arca-charcoal tracking-wide">
              Thank you. You will hear from us soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 bg-transparent border border-arca-sand text-sm text-arca-ink placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="mt-6 text-[11px] text-arca-stone/60">
          No frequency commitments. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
