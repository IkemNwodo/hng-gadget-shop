export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  image_url: string;
  stock: number;
  rating: number;
  reviews_count: number;
  featured: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  items: {
    product_id?: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  user_id?: string;
}

export interface OrderResponse {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  payment_status: string;
  email_sent: boolean;
  mailgun_message_id?: string;
  items: {
    id?: string;
    product_id?: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  created_at: string;
  mailgun_delivery?: {
    success: boolean;
    simulated: boolean;
    message_id?: string;
    message: string;
    error?: string;
  };
}

export interface SystemStatus {
  supabase: {
    configured: boolean;
    connected: boolean;
  };
  mailgun: {
    configured: boolean;
    domain: string | null;
  };
}
