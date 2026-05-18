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

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    storeId: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function fetchRole(userId: string) {
      // Check staff users table first
      const { data: staffUser } = await supabase
        .from('users')
        .select('role, store_id')
        .eq('id', userId)
        .single()

      if (staffUser) {
        return { role: staffUser.role as UserRole, storeId: staffUser.store_id ?? null }
      }
      // Fall back to customer
      return { role: 'customer' as const, storeId: null }
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { role, storeId } = await fetchRole(user.id)
        setState({ user, role, storeId, loading: false })
      } else {
        setState({ user: null, role: null, storeId: null, loading: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { role, storeId } = await fetchRole(session.user.id)
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
