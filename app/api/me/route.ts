import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ role: null, storeId: null })
  }

  // Use service role to bypass RLS — guaranteed to find the row
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: staffUser } = await admin
    .from('users')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    role: staffUser?.role ?? 'customer',
    storeId: staffUser?.store_id ?? null,
  })
}
