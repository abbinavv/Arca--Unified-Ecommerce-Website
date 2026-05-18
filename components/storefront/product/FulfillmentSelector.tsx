'use client'

import { useState } from 'react'

const OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days' },
  { id: 'pickup', label: 'Pick Up In-Store', sub: 'Ready in 2 hours' },
  { id: 'ship-store', label: 'Ship from Store', sub: '1–2 business days' },
] as const

type OptionId = (typeof OPTIONS)[number]['id']

export function FulfillmentSelector() {
  const [selected, setSelected] = useState<OptionId>('standard')

  return (
    <div className="space-y-2">
      {OPTIONS.map(opt => {
        const active = selected === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 border transition-colors duration-150 text-left ${
              active ? 'border-arca-ink' : 'border-arca-sand hover:border-arca-stone'
            }`}
          >
            {/* Radio dot */}
            <span
              className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors duration-150 ${
                active ? 'border-arca-ink' : 'border-arca-sand'
              }`}
            >
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-arca-ink block" />
              )}
            </span>

            {/* Labels */}
            <span className="flex-1">
              <span className={`block text-xs font-medium tracking-wide ${active ? 'text-arca-ink' : 'text-arca-charcoal'}`}>
                {opt.label}
              </span>
              <span className="block text-[11px] text-arca-stone mt-0.5">{opt.sub}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
