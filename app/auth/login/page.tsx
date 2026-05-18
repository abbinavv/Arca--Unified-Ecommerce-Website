'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'

function getRoleRedirect(role: UserRole | 'customer' | null, next: string | null): string {
  if (next) return next
  if (role === 'corporate_admin') return '/dashboard/admin'
  if (role === 'boutique_manager' || role === 'inventory_controller') return '/dashboard/manager'
  if (role === 'sales_associate' || role === 'service_technician' || role === 'aftersales_specialist') {
    return '/dashboard/staff'
  }
  return '/'
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError(authError?.message ?? 'Invalid email or password.')
      setLoading(false)
      return
    }

    const { data: staffUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = (staffUser?.role as UserRole) ?? 'customer'
    router.push(getRoleRedirect(role, next))
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-arca-ink text-center mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-arca-stone text-center mb-8 tracking-wide">
        Sign in to your account
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs tracking-arca text-arca-charcoal uppercase">
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-xs text-arca-stone hover:text-arca-gold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="••••••••"
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
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-arca-stone mt-8">
        New to Arca?{' '}
        <Link href="/auth/signup" className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
