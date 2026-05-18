'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    // Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    })

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? 'Could not create account.')
      setLoading(false)
      return
    }

    // Create client profile row
    const { error: profileError } = await supabase.from('clients').insert({
      id: data.user.id,
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone || null,
    })

    if (profileError) {
      setError('Account created but profile setup failed. Please contact support.')
      setLoading(false)
      return
    }

    router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-arca-ink text-center mb-1">
        Create your account
      </h1>
      <p className="text-sm text-arca-stone text-center mb-8 tracking-wide">
        Join Arca for a curated experience
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
              First name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={set('firstName')}
              required
              className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
              placeholder="Priya"
            />
          </div>
          <div>
            <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
              Last name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={set('lastName')}
              required
              className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
              placeholder="Sharma"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            autoComplete="email"
            className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
            Phone <span className="normal-case text-arca-stone">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="block text-xs tracking-arca text-arca-charcoal uppercase mb-2">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full h-11 px-4 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone focus:outline-none focus:border-arca-ink transition-colors"
            placeholder="At least 8 characters"
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
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-arca-stone mt-8">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
