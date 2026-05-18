'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 border border-arca-gold mx-auto mb-6 flex items-center justify-center">
          <svg className="w-5 h-5 text-arca-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-light text-arca-ink mb-2">
          Check your email
        </h1>
        <p className="text-sm text-arca-stone mb-8">
          We&apos;ve sent password reset instructions to{' '}
          <span className="text-arca-ink">{email}</span>
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-arca-stone hover:text-arca-gold transition-colors underline underline-offset-2"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-arca-ink text-center mb-1">
        Reset password
      </h1>
      <p className="text-sm text-arca-stone text-center mb-8 tracking-wide">
        Enter your email and we&apos;ll send reset instructions
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm text-arca-stone mt-8">
        <Link href="/auth/login" className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
