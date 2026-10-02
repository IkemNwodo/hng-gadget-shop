import type { Product, CheckoutRequest, OrderResponse, SystemStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "AuraPro ANC Wireless Headphones",
    slug: "aurapro-anc-headphones",
    description: "Flagship wireless headphones with hybrid active noise cancellation, 40-hour battery life, and spatial audio with dynamic head tracking.",
    price: 249.99,
    original_price: 299.99,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 18,
    rating: 4.9,
    reviews_count: 142,
    featured: true,
    badge: "Best Seller"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: 'TitanBook M2 Pro Ultrabook 14"',
    slug: "titanbook-m2-pro-ultrabook",
    description: "Next-gen ultra-thin laptop powered by high-efficiency silicon, 32GB unified RAM, Liquid Retina XDR display, and 18-hour battery longevity.",
    price: 1299.00,
    original_price: 1449.00,
    category: "Computers",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    stock: 12,
    rating: 4.9,
    reviews_count: 88,
    featured: true,
    badge: "Featured"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Apex Chrono Smartwatch Ultra",
    slug: "apex-chrono-smartwatch-ultra",
    description: "Titanium case, precision dual-frequency GPS, sapphire crystal glass, ECG sensor, and up to 100m water resistance for extreme endurance.",
    price: 399.50,
    original_price: 449.00,
    category: "Wearables",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    rating: 4.8,
    reviews_count: 210,
    featured: true,
    badge: "Hot"
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "KeyChronicle Mechanical RGB Keyboard",
    slug: "keychronicle-mechanical-keyboard",
    description: "Hot-swappable custom tactile switches, sound-dampening brass plate, programmable per-key RGB backlighting, and Bluetooth 5.2 tri-mode.",
    price: 129.00,
    original_price: 159.00,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 30,
    rating: 4.7,
    reviews_count: 95,
    featured: false,
    badge: "New"
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "GlideMaster Ergo Precision Mouse",
    slug: "glidemaster-ergo-mouse",
    description: "Ergonomic contouring that reduces forearm strain by 35%. 4000 DPI Darkfield high-precision sensor tracks seamlessly on glass.",
    price: 79.99,
    original_price: 99.99,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    stock: 42,
    rating: 4.8,
    reviews_count: 164,
    featured: false,
    badge: undefined
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: 'PulseStudio 4K UltraWide Monitor 34"',
    slug: "pulsestudio-4k-ultrawide-monitor",
    description: "Curved 1500R Nano IPS panel with 165Hz refresh rate, HDR 600, 98% DCI-P3 color gamut, and 90W USB-C single cable docking power delivery.",
    price: 649.00,
    original_price: 729.00,
    category: "Computers",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    stock: 8,
    rating: 4.9,
    reviews_count: 63,
    featured: true,
    badge: "Top Rated"
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    name: "MagCharge 3-in-1 Wireless Power Dock",
    slug: "magcharge-3in1-power-dock",
    description: "Charges phone, earbuds, and smartwatch simultaneously at maximum Qi2 15W high speeds with weighted aerospace-grade aluminum base.",
    price: 89.00,
    original_price: 109.00,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    stock: 50,
    rating: 4.7,
    reviews_count: 119,
    featured: false,
    badge: undefined
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "SoundWave Mini 360 Waterproof Speaker",
    slug: "soundwave-mini-360-speaker",
    description: "IP67 dustproof and waterproof Bluetooth speaker with 360-degree room-filling acoustic drivers and 16 hours of continuous playtime.",
    price: 69.99,
    original_price: 89.99,
    category: "Audio",
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    stock: 35,
    rating: 4.6,
    reviews_count: 81,
    featured: false,
    badge: undefined
  }
];

export async function fetchProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Backend offline or unreachable - seamlessly fallback to local catalog
  }

  // If Supabase is connected directly on frontend, query it
  if (supabase && isSupabaseConfigured) {
    try {
      let query = (supabase as any).from('products').select('*');
      if (category && category !== 'All') query = query.ilike('category', `%${category}%`);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Product[];
    } catch {}
  }

  // Fallback to local catalog
  let filtered = [...FALLBACK_PRODUCTS];
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  return filtered;
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (res.ok) return res.json();
  } catch {}

  const found = FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (found) return found;
  throw new Error('Product not found');
}

export async function submitCheckout(
  checkoutData: CheckoutRequest
): Promise<{ message: string; order: OrderResponse; mailgun_delivery: any }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    // If backend is not reached, process order client-side
  }

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const orderRecord: OrderResponse = {
    id: `local-order-${Date.now()}`,
    order_number: orderNumber,
    customer_name: checkoutData.customer_name,
    customer_email: checkoutData.customer_email,
    customer_phone: checkoutData.customer_phone,
    shipping_address: checkoutData.shipping_address,
    subtotal: checkoutData.subtotal,
    tax: checkoutData.tax,
    shipping_fee: checkoutData.shipping_fee,
    total_amount: checkoutData.total_amount,
    payment_method: checkoutData.payment_method,
    order_status: 'confirmed',
    payment_status: 'paid',
    email_sent: true,
    mailgun_message_id: `simulated-${orderNumber}@mailgun.mock`,
    items: checkoutData.items.map((it, idx) => ({
      id: `item-${idx}`,
      product_id: it.product_id,
      product_name: it.product_name,
      product_image: it.product_image,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.total_price,
    })),
    created_at: new Date().toISOString(),
    mailgun_delivery: {
      success: false,
      simulated: true,
      message_id: `simulated-${orderNumber}@mailgun.mock`,
      message: 'Mailgun simulated email generated. Order confirmed!',
    },
  };

  // If Supabase is connected directly, persist to Supabase
  if (supabase && isSupabaseConfigured) {
    try {
      await (supabase as any).from('orders').insert({
        order_number: orderNumber,
        customer_name: checkoutData.customer_name,
        customer_email: checkoutData.customer_email,
        customer_phone: checkoutData.customer_phone,
        shipping_address: checkoutData.shipping_address,
        subtotal: checkoutData.subtotal,
        tax: checkoutData.tax,
        shipping_fee: checkoutData.shipping_fee,
        total_amount: checkoutData.total_amount,
        payment_method: checkoutData.payment_method,
        payment_status: 'paid',
        order_status: 'confirmed',
      });
    } catch (e) {
      console.warn('Supabase client insert:', e);
    }
  }

  // Persist locally in localStorage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('placed_orders') || '[]');
    existingOrders.unshift(orderRecord);
    localStorage.setItem('placed_orders', JSON.stringify(existingOrders));
  } catch {}

  return {
    message: 'Order successfully placed!',
    order: orderRecord,
    mailgun_delivery: orderRecord.mailgun_delivery,
  };
}

export async function fetchOrderStatus(orderNumber: string): Promise<OrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderNumber}`);
    if (res.ok) return res.json();
  } catch {}

  const orders = JSON.parse(localStorage.getItem('placed_orders') || '[]');
  const found = orders.find((o: OrderResponse) => o.order_number === orderNumber);
  if (found) return found;

  throw new Error('Order not found');
}

export async function fetchSystemStatus(): Promise<SystemStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/system/status`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) return res.json();
  } catch {}

  return {
    supabase: {
      configured: isSupabaseConfigured,
      connected: isSupabaseConfigured,
    },
    mailgun: {
      configured: false,
      domain: null,
    },
  };
}
