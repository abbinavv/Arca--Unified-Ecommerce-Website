// Re-export generated Supabase types
export type { Database, Json } from './supabase'

export type UserRole =
  | 'corporate_admin'
  | 'boutique_manager'
  | 'inventory_controller'
  | 'sales_associate'
  | 'service_technician'
  | 'aftersales_specialist'

export type AppUser = {
  id: string
  email: string
  role: UserRole
  store_id?: string
  first_name?: string
  last_name?: string
}

export type Client = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  city?: string
  state?: string
}
