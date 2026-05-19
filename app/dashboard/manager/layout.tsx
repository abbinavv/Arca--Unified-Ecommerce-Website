import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ManagerSidebar } from '@/components/dashboard/layout/ManagerSidebar'
import type { UserRole } from '@/types/database'

const MANAGER_ROLES: UserRole[] = ['boutique_manager', 'inventory_controller']

export default async function ManagerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard/manager')

  // Use service-role client to bypass RLS — guaranteed to find the row
  const admin = await createAdminClient()
  const { data: staffUser } = await admin
    .from('users')
    .select('first_name, last_name, role, store_id')
    .eq('id', user.id)
    .single()

  if (!staffUser || !MANAGER_ROLES.includes(staffUser.role as UserRole)) {
    redirect('/')
  }

  const { data: store } = staffUser.store_id
    ? await admin.from('stores').select('name').eq('id', staffUser.store_id).single()
    : { data: null }

  const userName = [staffUser.first_name, staffUser.last_name].filter(Boolean).join(' ') || user.email!

  return (
    <div className="flex min-h-screen bg-arca-ivory">
      <ManagerSidebar
        role={staffUser.role as UserRole}
        userName={userName}
        storeName={store?.name ?? null}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
