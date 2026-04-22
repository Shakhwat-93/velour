// ─── DATABASE TYPES ───────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type DeliveryArea = 'inside_dhaka' | 'outside_dhaka'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface ProductVariant {
  size: string
  price: number
  compare_at_price?: number
  stock_qty: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  images: string[]
  in_stock: boolean
  stock_qty: number
  featured: boolean
  variants?: ProductVariant[]
  created_at: string
  // joined
  category?: Category
}

export interface OrderItem {
  product_id: string
  name: string
  qty: number
  price: number
  size?: string
  image?: string
  product?: Product
}

export interface ShippingAddress {
  full_name: string
  firstName?: string
  lastName?: string
  email?: string
  phone: string
  address?: string
  address_line1: string
  address_line2?: string
  city: string
  postalCode?: string
  postal_code?: string
  delivery_area?: DeliveryArea
  delivery_label?: string
  delivery_fee?: number
  anti_fraud?: {
    device_id: string
    ip_address: string
    user_agent?: string
    checked_at: string
    lock_hours: number
  }
}

export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  items: OrderItem[]
  shipping_address: ShippingAddress
  subtotal: number
  total: number
  courier_data?: unknown
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
}

// ─── CART TYPES ───────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  qty: number
  selectedSize?: string
  selectedPrice?: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// ─── SUPABASE DATABASE SCHEMA ─────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'category'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'category'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      site_settings: {
        Row: SiteSetting
        Insert: SiteSetting
        Update: Partial<SiteSetting>
      }
    }
  }
}
