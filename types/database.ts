export type UserRole = 'customer' | 'admin';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'out_of_stock';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  public_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  weight_grams: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
  product_images?: ProductImage[];
}

export interface Customer {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer_id: string | null;
  status: OrderStatus;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  updated_at: string;
  customers?: Customer | null;
  order_items?: OrderItem[];
}
