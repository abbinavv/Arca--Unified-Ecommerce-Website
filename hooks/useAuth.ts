'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database'

type AuthState = {
  user: User | null
  role: UserRole | 'customer' | null
  storeId: string | null
  loading: boolean
}

async function fetchRoleFromServer(): Promise<{ role: UserRole | 'customer' | null; storeId: string | null }> {
  try {
    const res = await fetch('/api/me')
    if (!res.ok) return { role: 'customer', storeId: null }
    const data = await res.json()
    return { role: data.role ?? 'customer', storeId: data.storeId ?? null }
  } catch {
    return { role: 'customer', storeId: null }
  }
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    storeId: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { role, storeId } = await fetchRoleFromServer()
        setState({ user, role, storeId, loading: false })
      } else {
        setState({ user: null, role: null, storeId: null, loading: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { role, storeId } = await fetchRoleFromServer()
          setState({ user: session.user, role, storeId, loading: false })
        } else {
          setState({ user: null, role: null, storeId: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}
