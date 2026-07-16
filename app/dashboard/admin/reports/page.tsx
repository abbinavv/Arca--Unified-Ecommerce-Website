'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ReportType = 'orders' | 'inventory' | 'customers'

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h]
        const str = val === null || val === undefined ? '' : String(val)
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
      }).join(',')
    ),
  ]
  return lines.join('\n')
}

function download(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [loading, setLoading] = useState<ReportType | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  async function exportOrders() {
    setLoading('orders')
    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select('order_number, status, channel, fulfillment_type, subtotal, tax_total, grand_total, created_at')
      .order('created_at', { ascending: false })
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59')
    const { data } = await query
    download(toCSV(data ?? []), `arca-orders-${Date.now()}.csv`)
    setLoading(null)
  }

  async function exportInventory() {
    setLoading('inventory')
    const supabase = createClient()
    const { data } = await supabase
      .from('inventory')
      .select('id, quantity, reserved_quantity, available_qty, products(name, brand, sku), stores!inventory_location_id_fkey(name)')
      .order('available_qty', { ascending: true })
    type InventoryReportRow = {
      quantity: number
      reserved_quantity: number
      available_qty: number | null
      products: { name: string; brand: string | null; sku: string } | null
      stores: { name: string } | null
    }
    const flat = ((data ?? []) as InventoryReportRow[]).map(row => ({
      product: row.products?.name ?? '',
      brand: row.products?.brand ?? '',
      sku: row.products?.sku ?? '',
      store: row.stores?.name ?? '',
      on_hand: row.quantity,
      reserved: row.reserved_quantity,
      available: row.available_qty,
    }))
    download(toCSV(flat), `arca-inventory-${Date.now()}.csv`)
    setLoading(null)
  }

  async function exportCustomers() {
    setLoading('customers')
    const supabase = createClient()
    const { data } = await supabase
      .from('clients')
      .select('first_name, last_name, email, phone, city, state, created_at')
      .order('created_at', { ascending: false })
    download(toCSV(data ?? []), `arca-customers-${Date.now()}.csv`)
    setLoading(null)
  }

  const btnClass = (type: ReportType) =>
    `w-full flex items-center justify-between px-6 py-5 border border-[#E8E8E4] hover:bg-[#F9F9F7] transition-colors group ${loading === type ? 'opacity-50 pointer-events-none' : ''}`

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-3xl font-light text-arca-ink mb-2">Reports</h1>
      <p className="text-sm text-arca-stone mb-8">Export data as CSV files.</p>

      {/* Date filter */}
      <div className="flex items-center gap-4 mb-8 p-5 border border-[#E8E8E4] bg-[#F9F9F7]">
        <p className="text-[10px] tracking-arca uppercase text-arca-stone flex-shrink-0">Date range</p>
        <div className="flex items-center gap-3 flex-1">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="h-9 px-3 bg-white border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
          />
          <span className="text-arca-stone text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="h-9 px-3 bg-white border border-[#E8E8E4] text-arca-ink text-sm focus:outline-none focus:border-arca-ink transition-colors"
          />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo('') }} className="text-xs text-arca-stone hover:text-arca-ink transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={exportOrders} className={btnClass('orders')}>
          <div className="text-left">
            <p className="text-sm font-medium text-arca-ink">Orders</p>
            <p className="text-xs text-arca-stone mt-0.5">Order number, status, channel, totals, payment</p>
          </div>
          <span className="text-xs tracking-arca uppercase text-arca-gold group-hover:text-arca-gold-dk transition-colors">
            {loading === 'orders' ? 'Exporting…' : 'Export CSV'}
          </span>
        </button>

        <button onClick={exportInventory} className={btnClass('inventory')}>
          <div className="text-left">
            <p className="text-sm font-medium text-arca-ink">Inventory</p>
            <p className="text-xs text-arca-stone mt-0.5">Product, store, on-hand, reserved, available quantities</p>
          </div>
          <span className="text-xs tracking-arca uppercase text-arca-gold group-hover:text-arca-gold-dk transition-colors">
            {loading === 'inventory' ? 'Exporting…' : 'Export CSV'}
          </span>
        </button>

        <button onClick={exportCustomers} className={btnClass('customers')}>
          <div className="text-left">
            <p className="text-sm font-medium text-arca-ink">Customers</p>
            <p className="text-xs text-arca-stone mt-0.5">Name, email, phone, city, segment, join date</p>
          </div>
          <span className="text-xs tracking-arca uppercase text-arca-gold group-hover:text-arca-gold-dk transition-colors">
            {loading === 'customers' ? 'Exporting…' : 'Export CSV'}
          </span>
        </button>
      </div>
    </div>
  )
}
