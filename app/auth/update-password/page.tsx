'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function UpdatePasswordForm() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.push('/account?message=password-updated')
  }

  if (!ready) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-arca-stone">Verifying your reset link…</p>
        <p className="text-xs text-arca-stone/60">
          If nothing happens, your link may have expired.{' '}
          <a href="/auth/reset-password" className="text-arca-gold hover:underline">
            Request a new one
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-light text-arca-ink mb-1">Set new password</h1>
        <p className="text-xs text-arca-stone">Choose a strong password for your account.</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoFocus
            className="w-full px-4 py-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="Re-enter your password"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <p className="text-sm text-arca-stone">Loading…</p>
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  )
}
