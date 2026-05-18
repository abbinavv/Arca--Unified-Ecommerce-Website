import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/dashboard/layout/AdminSidebar'

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard/admin')

  const { data: staffUser } = await supabase
    .from('users')
    .select('first_name, last_name, role')
    .eq('id', user.id)
    .single()

  if (!staffUser || staffUser.role !== 'corporate_admin') redirect('/')

  const userName = [staffUser.first_name, staffUser.last_name].filter(Boolean).join(' ') || user.email!

  return (
    <div className="flex min-h-screen bg-[#F5F5F3]">
      <AdminSidebar userName={userName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
