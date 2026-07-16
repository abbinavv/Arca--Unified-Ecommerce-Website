'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    state: '',
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('clients')
        .select('first_name, last_name, phone, city, state')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          phone: data.phone ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('clients').upsert({
      id: user.id,
      email,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      city: form.city,
      state: form.state,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    type = 'text'
  ) => (
    <div>
      <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-arca-sand bg-transparent text-sm text-arca-ink placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors"
      />
    </div>
  )

  if (loading) return <div className="py-24 text-center text-sm text-arca-stone">Loading…</div>

  return (
    <div>
      <h1 className="font-display text-4xl font-light text-arca-ink mb-10">Profile</h1>

      <form onSubmit={handleSave} className="max-w-md space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block text-[10px] tracking-arca uppercase text-arca-stone mb-2">Email</label>
          <p className="px-4 py-3 border border-arca-sand/60 text-sm text-arca-stone bg-arca-cream">
            {email}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field('firstName', 'First Name', 'First')}
          {field('lastName', 'Last Name', 'Last')}
        </div>
        {field('phone', 'Phone', '+91 98765 43210', 'tel')}
        <div className="grid grid-cols-2 gap-4">
          {field('city', 'City', 'Mumbai')}
          {field('state', 'State', 'Maharashtra')}
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3.5 text-xs tracking-arca uppercase transition-all ${
            saved
              ? 'bg-arca-gold text-white'
              : 'bg-arca-ink text-arca-ivory hover:bg-arca-charcoal'
          } disabled:opacity-50`}
        >
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
