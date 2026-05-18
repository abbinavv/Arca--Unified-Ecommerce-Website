'use client'

import { Suspense, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function VerifyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    })

    if (verifyError) {
      setError(verifyError.message ?? 'Invalid or expired code.')
      setLoading(false)
      return
    }

    router.push('/')
  }

  async function resend() {
    if (!email) return
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email })
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-arca-ink text-center mb-1">
        Verify your email
      </h1>
      <p className="text-sm text-arca-stone text-center mb-2 tracking-wide">
        We sent a 6-digit code to
      </p>
      {email && (
        <p className="text-sm text-arca-ink text-center font-medium mb-8">{email}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-11 h-14 text-center text-lg font-medium bg-transparent border border-arca-sand text-arca-ink focus:outline-none focus:border-arca-ink transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Verifying…' : 'Verify email'}
        </button>
      </form>

      <p className="text-center text-sm text-arca-stone mt-8">
        Didn&apos;t receive a code?{' '}
        <button
          onClick={resend}
          className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors bg-transparent border-none cursor-pointer"
        >
          Resend
        </button>
      </p>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
