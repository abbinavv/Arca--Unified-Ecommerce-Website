'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/stores/cartStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false)

  useEffect(() => {
    if (!hydrated.current) {
      useCartStore.persist.rehydrate()
      hydrated.current = true
    }
  }, [])

  return <>{children}</>
}
