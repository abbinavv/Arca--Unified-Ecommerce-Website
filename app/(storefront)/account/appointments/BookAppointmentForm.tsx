'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SERVICE_TYPES = [
  { value: 'styling_session', label: 'Styling Session' },
  { value: 'personal_shopping', label: 'Personal Shopping' },
  { value: 'product_consultation', label: 'Product Consultation' },
  { value: 'watch_service', label: 'Watch Service Consultation' },
  { value: 'jewellery_consultation', label: 'Jewellery Consultation' },
]

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

type Store = { id: string; name: string; city: string | null }

export function BookAppointmentForm({ stores }: { stores: Store[] }) {
  const router = useRouter()
  const [storeId, setStoreId] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!storeId || !serviceType || !date) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('appointments').insert({
      client_id: user!.id,
      store_id: storeId,
      service_type: serviceType,
      appointment_date: date,
      appointment_time: time || null,
      notes: notes || null,
      status: 'scheduled',
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  if (success) {
    return (
      <div className="py-6 text-center">
        <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 mx-auto mb-4">
          <circle cx="28" cy="28" r="24" stroke="#B8952A" strokeWidth="1.2"
            strokeDasharray="151" strokeDashoffset="151"
            style={{ animation: 'draw-circle 0.45s ease-out 0.05s forwards' }} />
          <path d="M17 28l8 8 14-16" stroke="#B8952A" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="36" strokeDashoffset="36"
            style={{ animation: 'draw-tick 0.3s ease-out 0.45s forwards' }} />
          <style>{`@keyframes draw-circle{to{stroke-dashoffset:0}}@keyframes draw-tick{to{stroke-dashoffset:0}}`}</style>
        </svg>
        <p className="text-sm text-arca-ink mb-0.5">Appointment requested</p>
        <p className="text-xs text-arca-stone">Our team will confirm within 24 hours.</p>
        <button
          onClick={() => { setSuccess(false); setStoreId(''); setServiceType(''); setDate(''); setTime(''); setNotes('') }}
          className="mt-5 text-xs text-arca-gold underline underline-offset-2 hover:text-arca-gold-dk transition-colors"
        >
          Book another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Boutique *</label>
        <select
          value={storeId}
          onChange={e => setStoreId(e.target.value)}
          required
          className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
        >
          <option value="">Select a boutique</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Service *</label>
        <select
          value={serviceType}
          onChange={e => setServiceType(e.target.value)}
          required
          className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
        >
          <option value="">Select service type</option>
          {SERVICE_TYPES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Date *</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={e => setDate(e.target.value)}
          required
          className="w-full h-10 px-3 bg-transparent border border-arca-sand text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Preferred time</label>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot === time ? '' : slot)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                time === slot
                  ? 'border-arca-ink bg-arca-ink text-arca-ivory'
                  : 'border-arca-sand text-arca-stone hover:border-arca-charcoal hover:text-arca-ink'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-[10px] tracking-arca uppercase text-arca-charcoal mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Tell us what you're looking for..."
          className="w-full px-3 py-2.5 bg-transparent border border-arca-sand text-arca-ink text-sm placeholder:text-arca-stone/50 focus:outline-none focus:border-arca-ink transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="md:col-span-2">
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
        </div>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 h-11 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
        >
          {loading ? 'Requesting…' : 'Request Appointment'}
        </button>
      </div>
    </form>
  )
}
