import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const STAFF_ROLES = [
  'corporate_admin',
  'boutique_manager',
  'inventory_controller',
  'sales_associate',
  'service_technician',
  'aftersales_specialist',
]

function getDashboardForRole(role: string): string {
  if (role === 'corporate_admin') return '/dashboard/admin'
  if (role === 'boutique_manager' || role === 'inventory_controller') return '/dashboard/manager'
  return '/dashboard/staff'
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Refresh the session cookie (required by @supabase/ssr)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── Unauthenticated: protect private routes ──────────────────────────────────
  if (!user) {
    if (
      path.startsWith('/account') ||
      path.startsWith('/dashboard') ||
      path.startsWith('/checkout')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // ── Read role from cookie (set by /api/me after login — no DB query needed) ──
  const role = request.cookies.get('arca-role')?.value ?? ''
  const isStaff = STAFF_ROLES.includes(role)

  // ── Redirect away from auth pages when already signed in ─────────────────────
  if (path.startsWith('/auth/login') || path.startsWith('/auth/signup')) {
    if (isStaff && role) {
      return NextResponse.redirect(new URL(getDashboardForRole(role), request.url))
    }
    // Customer or role not yet set — let them through to avoid trapping in loop
    return supabaseResponse
  }

  // ── Staff visiting /account → send to their portal ───────────────────────────
  if (path.startsWith('/account') && isStaff) {
    return NextResponse.redirect(new URL(getDashboardForRole(role), request.url))
  }

  // ── Dashboard access control ─────────────────────────────────────────────────
  if (path.startsWith('/dashboard/admin') && role !== 'corporate_admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (
    path.startsWith('/dashboard/manager') &&
    role !== 'boutique_manager' &&
    role !== 'inventory_controller'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (
    path.startsWith('/dashboard/staff') &&
    role !== 'sales_associate' &&
    role !== 'service_technician' &&
    role !== 'aftersales_specialist'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
