import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { TransferActions } from './TransferActions'

export const metadata: Metadata = { title: 'Transfers — Arca Manager' }

export default async function TransfersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: staffUser } = await supabase
    .from('users').select('store_id').eq('id', user!.id).single()

  const storeId = staffUser?.store_id
  const { data: transfers } = storeId
    ? await supabase
        .from('allocations')
        .select('id, quantity, status, created_at, products(name, brand), from_location:stores!allocations_from_location_id_fkey(name), to_location:stores!allocations_to_location_id_fkey(name)')
        .or(`from_location_id.eq.${storeId},to_location_id.eq.${storeId}`)
        .order('created_at', { ascending: false })
    : { data: [] }

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, city')
    .order('name')

  return (
    <div className="p-8">
      <TransferActions
        transfers={(transfers ?? []) as any}
        stores={stores ?? []}
      />
    </div>
  )
}
