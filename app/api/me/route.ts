import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const res = NextResponse.json({ role: null, storeId: null })
    // Clear role cookie on sign-out
    res.cookies.set('arca-role', '', { maxAge: 0, path: '/' })
    return res
  }

  const admin = await createAdminClient()
  const { data: staffUser } = await admin
    .from('users')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  const role: string = staffUser?.role ?? 'customer'
  const storeId: string | null = staffUser?.store_id ?? null

  const res = NextResponse.json({ role, storeId })
  // Store role in a lightweight HTTP-only cookie so proxy.ts can read it
  // without a DB round-trip on every request
  res.cookies.set('arca-role', role, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
