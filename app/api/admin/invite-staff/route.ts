import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email, firstName, lastName, role, storeId } = body

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  // Verify caller is corporate_admin
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: callerProfile } = await supabase.from('users').select('role').eq('id', caller.id).single()
  if (callerProfile?.role !== 'corporate_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const password = generatePassword()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 500 })
  }

  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    email,
    corporate_email: email,
    first_name: firstName || null,
    last_name: lastName || null,
    role,
    store_id: storeId || null,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ email, password })
}
