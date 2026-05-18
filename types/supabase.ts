export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      allocation_logs: {
        Row: {
          action: string
          allocation_id: string
          created_at: string
          id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          allocation_id: string
          created_at?: string
          id?: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          allocation_id?: string
          created_at?: string
          id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allocation_logs_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "allocations"
            referencedColumns: ["id"]
          },
        ]
      }
      allocations: {
        Row: {
          created_at: string
          created_by: string | null
          from_location_id: string
          id: string
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["allocation_status"]
          to_location_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_location_id: string
          id?: string
          product_id: string
          quantity: number
          status?: Database["public"]["Enums"]["allocation_status"]
          to_location_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_location_id?: string
          id?: string
          product_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["allocation_status"]
          to_location_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "allocations_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          associate_id: string | null
          client_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          service_type: string | null
          status: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          associate_id?: string | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          service_type?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          associate_id?: string | null
          client_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          service_type?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_associate_id_fkey"
            columns: ["associate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      boutique_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_time: string | null
          id: string
          invited_segment: string | null
          name: string
          notes: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          invited_segment?: string | null
          name: string
          notes?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          id?: string
          invited_segment?: string | null
          name?: string
          notes?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boutique_events_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_collections: {
        Row: {
          brand: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          added_at: string
          client_id: string
          fulfillment_type: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          added_at?: string
          client_id: string
          fulfillment_type?: string
          id?: string
          product_id: string
          quantity?: number
        }
        Update: {
          added_at?: string
          client_id?: string
          fulfillment_type?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          city: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          must_reset_password: boolean
          phone: string | null
          state: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          must_reset_password?: boolean
          phone?: string | null
          state?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          must_reset_password?: boolean
          phone?: string | null
          state?: string | null
        }
        Relationships: []
      }
      event_invitations: {
        Row: {
          client_id: string
          event_id: string
          id: string
          invited_at: string
          rsvp_at: string | null
          status: string
        }
        Insert: {
          client_id: string
          event_id: string
          id?: string
          invited_at?: string
          rsvp_at?: string | null
          status?: string
        }
        Update: {
          client_id?: string
          event_id?: string
          id?: string
          invited_at?: string
          rsvp_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_invitations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "boutique_events"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          available_qty: number | null
          created_at: string
          id: string
          location_id: string
          product_id: string
          quantity: number
          reserved_quantity: number
          updated_at: string
        }
        Insert: {
          available_qty?: number | null
          created_at?: string
          id?: string
          location_id: string
          product_id: string
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Update: {
          available_qty?: number | null
          created_at?: string
          id?: string
          location_id?: string
          product_id?: string
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_discrepancies: {
        Row: {
          counted_qty: number
          created_at: string
          created_by: string | null
          discrepancy_type: string | null
          expected_qty: number
          id: string
          notes: string | null
          product_id: string | null
          resolved_by: string | null
          status: string
          store_id: string | null
          updated_at: string
          variance: number | null
        }
        Insert: {
          counted_qty?: number
          created_at?: string
          created_by?: string | null
          discrepancy_type?: string | null
          expected_qty?: number
          id?: string
          notes?: string | null
          product_id?: string | null
          resolved_by?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
          variance?: number | null
        }
        Update: {
          counted_qty?: number
          created_at?: string
          created_by?: string | null
          discrepancy_type?: string | null
          expected_qty?: number
          id?: string
          notes?: string | null
          product_id?: string | null
          resolved_by?: string | null
          status?: string
          store_id?: string | null
          updated_at?: string
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_discrepancies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_discrepancies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_discrepancies_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_discrepancies_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_discrepancy_logs: {
        Row: {
          action: string
          created_at: string
          discrepancy_id: string | null
          id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          discrepancy_id?: string | null
          id?: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          discrepancy_id?: string | null
          id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_discrepancy_logs_discrepancy_id_fkey"
            columns: ["discrepancy_id"]
            isOneToOne: false
            referencedRelation: "inventory_discrepancies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_discrepancy_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          deep_link: string
          id: string
          is_read: boolean
          message: string
          recipient_client_id: string
          store_id: string | null
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          deep_link?: string
          id?: string
          is_read?: boolean
          message: string
          recipient_client_id: string
          store_id?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          deep_link?: string
          id?: string
          is_read?: boolean
          message?: string
          recipient_client_id?: string
          store_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_client_id_fkey"
            columns: ["recipient_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor_id: string | null
          actor_role: string | null
          created_at: string
          event_type: string | null
          from_status: string | null
          id: string
          notes: string | null
          order_id: string
          to_status: string
        }
        Insert: {
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          event_type?: string | null
          from_status?: string | null
          id?: string
          notes?: string | null
          order_id: string
          to_status: string
        }
        Update: {
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          event_type?: string | null
          from_status?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          quantity: number
          tax_amount: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number
          order_id: string
          product_id?: string | null
          quantity?: number
          tax_amount?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          quantity?: number
          tax_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          associate_id: string | null
          channel: string
          client_id: string | null
          created_at: string
          currency: string
          discount_total: number
          fulfillment_location_id: string | null
          fulfillment_type: string
          grand_total: number
          id: string
          idempotency_key: string | null
          is_tax_free: boolean
          notes: string | null
          order_number: string
          refund_total: number
          status: string
          store_id: string | null
          subtotal: number
          tax_total: number
          updated_at: string
        }
        Insert: {
          associate_id?: string | null
          channel?: string
          client_id?: string | null
          created_at?: string
          currency?: string
          discount_total?: number
          fulfillment_location_id?: string | null
          fulfillment_type?: string
          grand_total?: number
          id?: string
          idempotency_key?: string | null
          is_tax_free?: boolean
          notes?: string | null
          order_number: string
          refund_total?: number
          status?: string
          store_id?: string | null
          subtotal?: number
          tax_total?: number
          updated_at?: string
        }
        Update: {
          associate_id?: string | null
          channel?: string
          client_id?: string | null
          created_at?: string
          currency?: string
          discount_total?: number
          fulfillment_location_id?: string | null
          fulfillment_type?: string
          grand_total?: number
          id?: string
          idempotency_key?: string | null
          is_tax_free?: boolean
          notes?: string | null
          order_number?: string
          refund_total?: number
          status?: string
          store_id?: string | null
          subtotal?: number
          tax_total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_associate_id_fkey"
            columns: ["associate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_fulfillment_location_id_fkey"
            columns: ["fulfillment_location_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          method: string
          order_id: string | null
          payment_reference: string | null
          processed_by: string | null
          status: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          order_id?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          order_id?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback: {
        Row: {
          comment: string
          created_at: string
          customer_id: string
          customer_name: string
          id: string
          product_id: string
          rating: number
          status: string
          store_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          comment?: string
          created_at?: string
          customer_id: string
          customer_name?: string
          id?: string
          product_id: string
          rating: number
          status?: string
          store_id?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          customer_id?: string
          customer_name?: string
          id?: string
          product_id?: string
          rating?: number
          status?: string
          store_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_feedback_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_feedback_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_items: {
        Row: {
          barcode: string
          created_at: string
          deleted_at: string | null
          id: string
          product_id: string
          serial_number: string | null
          status: Database["public"]["Enums"]["item_status_enum"]
          store_id: string | null
        }
        Insert: {
          barcode: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          product_id: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["item_status_enum"]
          store_id?: string | null
        }
        Update: {
          barcode?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          product_id?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["item_status_enum"]
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_warranty_policies: {
        Row: {
          coverage_months: number
          created_at: string
          created_by: string | null
          eligible_services: string[]
          product_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          coverage_months: number
          created_at?: string
          created_by?: string | null
          eligible_services?: string[]
          product_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          coverage_months?: number
          created_at?: string
          created_by?: string | null
          eligible_services?: string[]
          product_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_warranty_policies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_warranty_policies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_warranty_policies_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          collection_id: string | null
          cost: number | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          image_urls: string[]
          name: string
          price: number
          sku: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          collection_id?: string | null
          cost?: number | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[]
          name: string
          price?: number
          sku: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          collection_id?: string | null
          cost?: number | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[]
          name?: string
          price?: number
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string
          created_by: string | null
          details: string | null
          discount_type: string
          discount_value: number
          ends_at: string
          id: string
          is_active: boolean
          name: string
          scope: string
          starts_at: string
          target_category_id: string | null
          target_product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          details?: string | null
          discount_type: string
          discount_value: number
          ends_at: string
          id?: string
          is_active?: boolean
          name: string
          scope: string
          starts_at: string
          target_category_id?: string | null
          target_product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          details?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string
          id?: string
          is_active?: boolean
          name?: string
          scope?: string
          starts_at?: string
          target_category_id?: string | null
          target_product_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_target_category_id_fkey"
            columns: ["target_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      return_items: {
        Row: {
          created_at: string
          exchange_location_id: string | null
          exchange_product_id: string | null
          id: string
          order_item_id: string
          product_id: string
          quantity: number
          reason: string
          return_id: string
        }
        Insert: {
          created_at?: string
          exchange_location_id?: string | null
          exchange_product_id?: string | null
          id?: string
          order_item_id: string
          product_id: string
          quantity: number
          reason?: string
          return_id: string
        }
        Update: {
          created_at?: string
          exchange_location_id?: string | null
          exchange_product_id?: string | null
          id?: string
          order_item_id?: string
          product_id?: string
          quantity?: number
          reason?: string
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_items_exchange_location_id_fkey"
            columns: ["exchange_location_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_exchange_product_id_fkey"
            columns: ["exchange_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string | null
          notes: string | null
          order_id: string
          processed_by: string | null
          refund_amount: number
          status: string
          store_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key?: string | null
          notes?: string | null
          order_id: string
          processed_by?: string | null
          refund_amount?: number
          status?: string
          store_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string | null
          notes?: string | null
          order_id?: string
          processed_by?: string | null
          refund_amount?: number
          status?: string
          store_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_looks: {
        Row: {
          created_at: string
          creator_id: string
          creator_name: string
          id: string
          is_shared: boolean
          name: string
          product_ids: string[]
          store_id: string
          thumbnail_source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          creator_name?: string
          id?: string
          is_shared?: boolean
          name: string
          product_ids?: string[]
          store_id: string
          thumbnail_source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          creator_name?: string
          id?: string
          is_shared?: boolean
          name?: string
          product_ids?: string[]
          store_id?: string
          thumbnail_source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_looks_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_looks_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_addresses: {
        Row: {
          city: string
          client_id: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          postal_code: string
          state: string
        }
        Insert: {
          city: string
          client_id: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          postal_code: string
          state: string
        }
        Update: {
          city?: string
          client_id?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          postal_code?: string
          state?: string
        }
        Relationships: []
      }
      scan_logs: {
        Row: {
          barcode: string
          id: string
          scanned_at: string
          session_id: string
          type: Database["public"]["Enums"]["scan_type_enum"]
        }
        Insert: {
          barcode: string
          id?: string
          scanned_at?: string
          session_id: string
          type?: Database["public"]["Enums"]["scan_type_enum"]
        }
        Update: {
          barcode?: string
          id?: string
          scanned_at?: string
          session_id?: string
          type?: Database["public"]["Enums"]["scan_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_sessions: {
        Row: {
          created_by: string | null
          ended_at: string | null
          id: string
          started_at: string
          status: Database["public"]["Enums"]["session_status_enum"]
          store_id: string | null
          type: Database["public"]["Enums"]["scan_type_enum"]
        }
        Insert: {
          created_by?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          store_id?: string | null
          type: Database["public"]["Enums"]["scan_type_enum"]
        }
        Update: {
          created_by?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          store_id?: string | null
          type?: Database["public"]["Enums"]["scan_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "scan_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_sessions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tickets: {
        Row: {
          approved_estimate_snapshot: Json | null
          assigned_to: string | null
          client_approval_status: string | null
          client_approved_at: string | null
          client_id: string | null
          client_rejected_at: string | null
          condition_notes: string | null
          created_at: string
          currency: string
          estimate_breakdown: Json | null
          estimate_sent_at: string | null
          estimate_subtotal: number | null
          estimate_tax: number | null
          estimate_total: number | null
          estimated_cost: number | null
          id: string
          intake_photos: string[] | null
          notes: string | null
          order_id: string | null
          product_id: string | null
          status: string
          store_id: string | null
          ticket_number: string | null
          type: string
          updated_at: string
        }
        Insert: {
          approved_estimate_snapshot?: Json | null
          assigned_to?: string | null
          client_approval_status?: string | null
          client_approved_at?: string | null
          client_id?: string | null
          client_rejected_at?: string | null
          condition_notes?: string | null
          created_at?: string
          currency?: string
          estimate_breakdown?: Json | null
          estimate_sent_at?: string | null
          estimate_subtotal?: number | null
          estimate_tax?: number | null
          estimate_total?: number | null
          estimated_cost?: number | null
          id?: string
          intake_photos?: string[] | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          status?: string
          store_id?: string | null
          ticket_number?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          approved_estimate_snapshot?: Json | null
          assigned_to?: string | null
          client_approval_status?: string | null
          client_approved_at?: string | null
          client_id?: string | null
          client_rejected_at?: string | null
          condition_notes?: string | null
          created_at?: string
          currency?: string
          estimate_breakdown?: Json | null
          estimate_sent_at?: string | null
          estimate_subtotal?: number | null
          estimate_tax?: number | null
          estimate_total?: number | null
          estimated_cost?: number | null
          id?: string
          intake_photos?: string[] | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          status?: string
          store_id?: string | null
          ticket_number?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          city: string | null
          country: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          region: string | null
          type: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          region?: string | null
          type?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          region?: string | null
          type?: string
        }
        Relationships: []
      }
      transfers: {
        Row: {
          from_boutique_id: string | null
          notes: string | null
          product_id: string | null
          quantity: number
          requested_at: string
          status: string
          to_boutique_id: string | null
          transfer_number: string
          updated_at: string
        }
        Insert: {
          from_boutique_id?: string | null
          notes?: string | null
          product_id?: string | null
          quantity?: number
          requested_at?: string
          status?: string
          to_boutique_id?: string | null
          transfer_number: string
          updated_at?: string
        }
        Update: {
          from_boutique_id?: string | null
          notes?: string | null
          product_id?: string | null
          quantity?: number
          requested_at?: string
          status?: string
          to_boutique_id?: string | null
          transfer_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_boutique_id_fkey"
            columns: ["from_boutique_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_boutique_id_fkey"
            columns: ["to_boutique_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          corporate_email: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          must_reset_password: boolean
          personal_email: string | null
          role: string
          store_id: string | null
        }
        Insert: {
          corporate_email?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          must_reset_password?: boolean
          personal_email?: string | null
          role: string
          store_id?: string | null
        }
        Update: {
          corporate_email?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          must_reset_password?: boolean
          personal_email?: string | null
          role?: string
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_order_store: {
        Args: { p_order_id: string; p_store_id: string }
        Returns: undefined
      }
      auto_deliver_stale_orders: {
        Args: { p_hours_stale?: number; p_store_id: string }
        Returns: number
      }
      close_stale_scan_sessions: { Args: never; Returns: undefined }
      complete_allocation: {
        Args: { p_allocation_id: string; p_performed_by?: string }
        Returns: Json
      }
      create_allocation: {
        Args: {
          p_created_by?: string
          p_from_location_id: string
          p_product_id: string
          p_quantity: number
          p_to_location_id: string
        }
        Returns: Json
      }
      create_product_items_bulk: {
        Args: { p_product_id: string; p_quantity: number }
        Returns: {
          barcode: string
          created_at: string
          deleted_at: string | null
          id: string
          product_id: string
          serial_number: string | null
          status: Database["public"]["Enums"]["item_status_enum"]
          store_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "product_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      decrement_order_inventory: {
        Args: { p_product_id: string; p_quantity: number; p_store_id: string }
        Returns: undefined
      }
      dispatch_allocation: {
        Args: { p_allocation_id: string; p_performed_by?: string }
        Returns: Json
      }
      find_available_locations: {
        Args: {
          p_exclude_location?: string
          p_min_quantity?: number
          p_product_id: string
          p_requesting_city?: string
        }
        Returns: {
          available_qty: number
          city: string
          location_id: string
          priority: number
          region: string
          store_name: string
          store_type: string
        }[]
      }
      fulfill_order_item: {
        Args: {
          p_actor_id?: string
          p_location_id: string
          p_order_id?: string
          p_product_id: string
          p_quantity: number
        }
        Returns: Json
      }
      generate_rsms_barcode: { Args: never; Returns: string }
      get_event_rsvp_counts: {
        Args: { p_event_id: string }
        Returns: {
          pending: number
          rsvp_no: number
          rsvp_yes: number
        }[]
      }
      get_order_items_for_fulfillment: {
        Args: { p_order_id: string }
        Returns: {
          id: string
          image_urls: string[]
          line_total: number
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          unit_price: number
        }[]
      }
      log_admin_activity: {
        Args: { p_action: string; p_details?: Json }
        Returns: undefined
      }
      lookup_warranty_by_order: {
        Args: { p_order_number: string }
        Returns: Json
      }
      lookup_warranty_by_product: {
        Args: { p_product_id: string }
        Returns: Json
      }
      place_omnichannel_order: {
        Args: {
          p_associate_id?: string
          p_channel?: string
          p_client_id: string
          p_currency?: string
          p_discount_total?: number
          p_fulfillment_location_id?: string
          p_fulfillment_type?: string
          p_grand_total?: number
          p_idempotency_key?: string
          p_is_tax_free?: boolean
          p_items?: Json
          p_notes?: string
          p_order_number?: string
          p_store_id: string
          p_subtotal?: number
          p_tax_total?: number
        }
        Returns: Json
      }
      process_return: {
        Args: {
          p_idempotency_key?: string
          p_items: Json
          p_notes?: string
          p_order_id: string
          p_processed_by?: string
          p_refund_amount?: number
          p_store_id: string
          p_type: string
        }
        Returns: Json
      }
      process_scan_event:
        | {
            Args: {
              p_barcode: string
              p_scan_type: string
              p_session_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_barcode: string
              p_scan_type: string
              p_session_id: string
              p_target_status: string
            }
            Returns: undefined
          }
      submit_customer_exchange_request: {
        Args: {
          p_customer_email?: string
          p_item_name?: string
          p_order_number: string
          p_product_id?: string
          p_quantity?: number
          p_reason?: string
          p_store_id?: string
        }
        Returns: Json
      }
      transition_order_status: {
        Args: {
          p_actor_id?: string
          p_new_status: string
          p_notes?: string
          p_order_id: string
        }
        Returns: {
          associate_id: string | null
          channel: string
          client_id: string | null
          created_at: string
          currency: string
          discount_total: number
          fulfillment_location_id: string | null
          fulfillment_type: string
          grand_total: number
          id: string
          idempotency_key: string | null
          is_tax_free: boolean
          notes: string | null
          order_number: string
          refund_total: number
          status: string
          store_id: string | null
          subtotal: number
          tax_total: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      allocation_status: "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED"
      item_status_enum:
        | "IN_STOCK"
        | "SOLD"
        | "RESERVED"
        | "DAMAGED"
        | "RETURNED"
      scan_type_enum: "IN" | "OUT" | "AUDIT" | "RETURN"
      session_status_enum: "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allocation_status: ["PENDING", "IN_TRANSIT", "COMPLETED", "CANCELLED"],
      item_status_enum: ["IN_STOCK", "SOLD", "RESERVED", "DAMAGED", "RETURNED"],
      scan_type_enum: ["IN", "OUT", "AUDIT", "RETURN"],
      session_status_enum: ["ACTIVE", "COMPLETED", "CANCELLED", "EXPIRED"],
    },
  },
} as const

