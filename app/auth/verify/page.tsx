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
  const [resent, setResent] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const next = ['', '', '', '', '', '']
    digits.forEach((d, i) => { next[i] = d })
    setOtp(next)
    const lastFilled = Math.min(digits.length, 5)
    inputs.current[lastFilled]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return }
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
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  return (
    <div>
      {/* Mail icon */}
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 border border-arca-sand flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-arca-gold">
            <rect x="2" y="4" width="20" height="16" rx="1" />
            <path d="M2 7l10 7 10-7" />
          </svg>
        </div>
      </div>

      <h1 className="font-display text-2xl font-light text-arca-ink text-center mb-1">
        Check your email
      </h1>
      <p className="text-sm text-arca-stone text-center mb-1 tracking-wide">
        We sent a confirmation link to
      </p>
      {email && (
        <p className="text-sm text-arca-ink text-center font-medium mb-6">{email}</p>
      )}

      <div className="border border-arca-sand bg-arca-cream px-5 py-4 mb-8 text-center">
        <p className="text-xs text-arca-charcoal leading-relaxed">
          Click the link in the email to confirm your account, then{' '}
          <a href="/auth/login" className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors">
            sign in
          </a>
          .
        </p>
      </div>

      {/* OTP fallback — shown if email contains a code instead of a link */}
      <details className="group">
        <summary className="text-xs text-arca-stone text-center cursor-pointer hover:text-arca-ink transition-colors list-none">
          Received a 6-digit code instead?{' '}
          <span className="underline underline-offset-2">Enter it here</span>
        </summary>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                className="w-10 h-13 text-center text-base font-medium bg-transparent border border-arca-sand text-arca-ink focus:outline-none focus:border-arca-ink transition-colors"
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
            className="w-full h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying…' : 'Verify code'}
          </button>
        </form>
      </details>

      <div className="mt-8 pt-6 border-t border-arca-sand text-center">
        {resent ? (
          <p className="text-xs text-arca-stone">Email resent — check your inbox.</p>
        ) : (
          <p className="text-sm text-arca-stone">
            Didn&apos;t receive anything?{' '}
            <button
              onClick={resend}
              className="text-arca-ink underline underline-offset-2 hover:text-arca-gold transition-colors"
            >
              Resend email
            </button>
          </p>
        )}
      </div>
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
