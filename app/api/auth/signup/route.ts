import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, phone } = await req.json()

  if (!email || !password || !firstName) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Create auth user
  const { data, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { first_name: firstName, last_name: lastName },
  })

  if (signUpError || !data.user) {
    return NextResponse.json(
      { error: signUpError?.message ?? 'Could not create account.' },
      { status: 400 }
    )
  }

  // Create client profile using service role (bypasses RLS)
  const { error: profileError } = await supabase.from('clients').insert({
    id: data.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
    phone: phone || null,
  })

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabase.auth.admin.deleteUser(data.user.id)
    return NextResponse.json(
      { error: 'Could not create account. Please try again.' },
      { status: 500 }
    )
  }

  // Send the Supabase signup confirmation email for the unconfirmed user
  await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${req.nextUrl.origin}/auth/verify` },
  })

  return NextResponse.json({ success: true })
}
