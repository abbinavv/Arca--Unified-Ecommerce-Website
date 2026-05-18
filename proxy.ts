import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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

  // Not logged in → protect account + dashboard routes
  if (!user) {
    if (path.startsWith('/account') || path.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Already logged in → redirect away from auth pages
  if (path.startsWith('/auth/login') || path.startsWith('/auth/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Role-based dashboard protection
  if (path.startsWith('/dashboard')) {
    const { data: staffUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = staffUser?.role

    if (path.startsWith('/dashboard/admin') && role !== 'corporate_admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (
      path.startsWith('/dashboard/manager') &&
      !['boutique_manager', 'inventory_controller'].includes(role ?? '')
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (
      path.startsWith('/dashboard/staff') &&
      !['sales_associate', 'service_technician', 'aftersales_specialist'].includes(role ?? '')
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
