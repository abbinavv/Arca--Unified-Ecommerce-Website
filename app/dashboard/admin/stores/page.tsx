'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Store = {
  id: string
  name: string
  address: string | null
  city: string
  region: string | null
  country: string
  type: string | null
  is_active: boolean
}

const emptyForm = {
  name: '',
  address: '',
  city: '',
  region: '',
  country: 'IN',
  type: 'boutique',
  is_active: true,
}

const inputClass = 'w-full h-10 px-3 bg-transparent border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors'
const labelClass = 'block text-[10px] tracking-arca uppercase text-arca-stone mb-2'

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadStores() {
    const supabase = createClient()
    const { data } = await supabase
      .from('stores')
      .select('id, name, address, city, region, country, type, is_active')
      .order('name')
    setStores(data ?? [])
  }

  useEffect(() => { loadStores() }, [])

  function openAdd() {
    setEditingStore(null)
    setForm(emptyForm)
    setError('')
    setPanelOpen(true)
  }

  function openEdit(store: Store) {
    setEditingStore(store)
    setForm({
      name: store.name,
      address: store.address ?? '',
      city: store.city,
      region: store.region ?? '',
      country: store.country,
      type: store.type ?? 'boutique',
      is_active: store.is_active,
    })
    setError('')
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditingStore(null)
    setError('')
  }

  function setField(key: keyof typeof emptyForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.city) {
      setError('Name and city are required.')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const payload = {
      name: form.name,
      address: form.address || null,
      city: form.city,
      region: form.region || null,
      country: form.country,
      type: form.type || null,
      is_active: form.is_active,
    }
    let err
    if (editingStore) {
      const { error: e } = await supabase.from('stores').update(payload).eq('id', editingStore.id)
      err = e
    } else {
      const { error: e } = await supabase.from('stores').insert(payload)
      err = e
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    await loadStores()
    closePanel()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light text-arca-ink">Stores</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal transition-colors"
        >
          + Add Store
        </button>
      </div>

      <div className="bg-white border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
        <div className="grid grid-cols-[1fr_120px_120px_80px_80px] gap-4 px-6 py-3 bg-[#F9F9F7] text-[10px] tracking-arca uppercase text-arca-stone">
          <span>Store</span>
          <span>City</span>
          <span>Type</span>
          <span>Status</span>
          <span></span>
        </div>
        {stores.map(store => (
          <div key={store.id} className="grid grid-cols-[1fr_120px_120px_80px_80px] gap-4 px-6 py-4 items-center hover:bg-[#F9F9F7] transition-colors">
            <p className="text-sm text-arca-ink">{store.name}</p>
            <p className="text-xs text-arca-stone">{store.city}</p>
            <p className="text-xs text-arca-stone capitalize">{store.type}</p>
            <span className={`text-[10px] tracking-wide px-2 py-1 ${store.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {store.is_active ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => openEdit(store)}
              className="text-xs text-arca-stone hover:text-arca-ink transition-colors text-left"
            >
              Edit
            </button>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-arca-stone">No stores yet</p>
          </div>
        )}
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/20" onClick={closePanel} />
          <div className="w-[420px] bg-arca-ivory h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E8E4]">
              <h2 className="font-display text-xl font-light text-arca-ink">
                {editingStore ? 'Edit Store' : 'Add Store'}
              </h2>
              <button onClick={closePanel} className="text-arca-stone hover:text-arca-ink transition-colors text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-6 gap-5">
              <div>
                <label className={labelClass}>Name *</label>
                <input value={form.name} onChange={e => setField('name', e.target.value)} required className={inputClass} placeholder="Mumbai Flagship" />
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <input value={form.address} onChange={e => setField('address', e.target.value)} className={inputClass} placeholder="14 Altamount Road" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City *</label>
                  <input value={form.city} onChange={e => setField('city', e.target.value)} required className={inputClass} placeholder="Mumbai" />
                </div>
                <div>
                  <label className={labelClass}>Region</label>
                  <input value={form.region} onChange={e => setField('region', e.target.value)} className={inputClass} placeholder="Maharashtra" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Country</label>
                  <input value={form.country} onChange={e => setField('country', e.target.value)} className={inputClass} placeholder="IN" />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={form.type} onChange={e => setField('type', e.target.value)} className={inputClass}>
                    <option value="boutique">Boutique</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="popup">Pop-up</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setField('is_active', !form.is_active)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-arca-ink' : 'bg-[#D4C9B5]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <span className="text-xs text-arca-stone">{form.is_active ? 'Active' : 'Inactive'}</span>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

              <div className="flex gap-3 mt-auto pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 h-10 bg-arca-ink text-arca-ivory text-xs tracking-arca uppercase hover:bg-arca-charcoal disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : editingStore ? 'Save Changes' : 'Add Store'}
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  className="px-6 h-10 border border-[#E8E8E4] text-arca-charcoal text-xs tracking-arca uppercase hover:border-arca-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
