import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from config import settings

logger = logging.getLogger(__name__)

# Fallback in-memory catalog
DEFAULT_PRODUCTS: List[Dict[str, Any]] = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "name": "AuraPro ANC Wireless Headphones",
        "slug": "aurapro-anc-headphones",
        "description": "Flagship wireless headphones with hybrid active noise cancellation, 40-hour battery life, and spatial audio with dynamic head tracking.",
        "price": 249.99,
        "original_price": 299.99,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        "stock": 18,
        "rating": 4.9,
        "reviews_count": 142,
        "featured": True,
        "badge": "Best Seller"
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "name": 'TitanBook M2 Pro Ultrabook 14"',
        "slug": "titanbook-m2-pro-ultrabook",
        "description": "Next-gen ultra-thin laptop powered by high-efficiency silicon, 32GB unified RAM, Liquid Retina XDR display, and 18-hour battery longevity.",
        "price": 1299.00,
        "original_price": 1449.00,
        "category": "Computers",
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        "stock": 12,
        "rating": 4.9,
        "reviews_count": 88,
        "featured": True,
        "badge": "Featured"
    },
    {
        "id": "33333333-3333-3333-3333-333333333333",
        "name": "Apex Chrono Smartwatch Ultra",
        "slug": "apex-chrono-smartwatch-ultra",
        "description": "Titanium case, precision dual-frequency GPS, sapphire crystal glass, ECG sensor, and up to 100m water resistance for extreme endurance.",
        "price": 399.50,
        "original_price": 449.00,
        "category": "Wearables",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "stock": 25,
        "rating": 4.8,
        "reviews_count": 210,
        "featured": True,
        "badge": "Hot"
    },
    {
        "id": "44444444-4444-4444-4444-444444444444",
        "name": "KeyChronicle Mechanical RGB Keyboard",
        "slug": "keychronicle-mechanical-keyboard",
        "description": "Hot-swappable custom tactile switches, sound-dampening brass plate, programmable per-key RGB backlighting, and Bluetooth 5.2 tri-mode.",
        "price": 129.00,
        "original_price": 159.00,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        "stock": 30,
        "rating": 4.7,
        "reviews_count": 95,
        "featured": False,
        "badge": "New"
    },
    {
        "id": "55555555-5555-5555-5555-555555555555",
        "name": "GlideMaster Ergo Precision Mouse",
        "slug": "glidemaster-ergo-mouse",
        "description": "Ergonomic contouring that reduces forearm strain by 35%. 4000 DPI Darkfield high-precision sensor tracks seamlessly on glass.",
        "price": 79.99,
        "original_price": 99.99,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
        "stock": 42,
        "rating": 4.8,
        "reviews_count": 164,
        "featured": False,
        "badge": None
    },
    {
        "id": "66666666-6666-6666-6666-666666666666",
        "name": 'PulseStudio 4K UltraWide Monitor 34"',
        "slug": "pulsestudio-4k-ultrawide-monitor",
        "description": "Curved 1500R Nano IPS panel with 165Hz refresh rate, HDR 600, 98% DCI-P3 color gamut, and 90W USB-C single cable docking power delivery.",
        "price": 649.00,
        "original_price": 729.00,
        "category": "Computers",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        "stock": 8,
        "rating": 4.9,
        "reviews_count": 63,
        "featured": True,
        "badge": "Top Rated"
    },
    {
        "id": "77777777-7777-7777-7777-777777777777",
        "name": "MagCharge 3-in-1 Wireless Power Dock",
        "slug": "magcharge-3in1-power-dock",
        "description": "Charges phone, earbuds, and smartwatch simultaneously at maximum Qi2 15W high speeds with weighted aerospace-grade aluminum base.",
        "price": 89.00,
        "original_price": 109.00,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
        "stock": 50,
        "rating": 4.7,
        "reviews_count": 119,
        "featured": False,
        "badge": None
    },
    {
        "id": "88888888-8888-8888-8888-888888888888",
        "name": "SoundWave Mini 360 Waterproof Speaker",
        "slug": "soundwave-mini-360-speaker",
        "description": "IP67 dustproof and waterproof Bluetooth speaker with 360-degree room-filling acoustic drivers and 16 hours of continuous playtime.",
        "price": 69.99,
        "original_price": 89.99,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
        "stock": 35,
        "rating": 4.6,
        "reviews_count": 81,
        "featured": False,
        "badge": None
    }
]

# In-memory orders store fallback
MEM_ORDERS: Dict[str, Dict[str, Any]] = {}

supabase_client = None

def get_supabase_client():
    global supabase_client
    if supabase_client is not None:
        return supabase_client
    
    url = settings.SUPABASE_URL.strip()
    key = settings.SUPABASE_SERVICE_ROLE_KEY.strip() or settings.SUPABASE_KEY.strip()
    
    if url and key and not url.startswith("your_") and not key.startswith("your_"):
        try:
            from supabase import create_client, Client
            supabase_client = create_client(url, key)
            logger.info("Successfully initialized Supabase Client")
            return supabase_client
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {str(e)}")
            return None
    return None

async def get_all_products(category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
    client = get_supabase_client()
    if client:
        try:
            query = client.table("products").select("*")
            if category and category.lower() != "all":
                query = query.ilike("category", f"%{category}%")
            if search:
                query = query.ilike("name", f"%{search}%")
            
            res = query.execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception as e:
            logger.warning(f"Supabase products fetch failed: {str(e)}. Falling back to local catalog.")

    # Fallback to local catalog
    results = DEFAULT_PRODUCTS
    if category and category.lower() != "all":
        results = [p for p in results if p["category"].lower() == category.lower()]
    if search:
        s = search.lower()
        results = [p for p in results if s in p["name"].lower() or s in p["description"].lower()]
    return results

async def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
    client = get_supabase_client()
    if client:
        try:
            res = client.table("products").select("*").eq("id", product_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.warning(f"Supabase product query error: {str(e)}")

    for p in DEFAULT_PRODUCTS:
        if p["id"] == product_id or p["slug"] == product_id:
            return p
    return None

async def save_order(order_payload: Dict[str, Any], items_payload: List[Dict[str, Any]]) -> Dict[str, Any]:
    client = get_supabase_client()
    order_id = str(uuid.uuid4())
    order_number = order_payload.get("order_number") or f"ORD-{int(datetime.utcnow().timestamp())}"
    
    order_record = {
        "id": order_id,
        "order_number": order_number,
        "user_id": order_payload.get("user_id"),
        "customer_name": order_payload["customer_name"],
        "customer_email": order_payload["customer_email"],
        "customer_phone": order_payload.get("customer_phone"),
        "shipping_address": order_payload["shipping_address"],
        "subtotal": order_payload["subtotal"],
        "tax": order_payload.get("tax", 0.0),
        "shipping_fee": order_payload.get("shipping_fee", 0.0),
        "total_amount": order_payload["total_amount"],
        "payment_method": order_payload.get("payment_method", "card"),
        "payment_status": "paid",
        "order_status": "confirmed",
        "email_sent": False,
        "mailgun_message_id": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if client:
        try:
            # 1. Insert order
            res_order = client.table("orders").insert(order_record).execute()
            actual_order = res_order.data[0] if res_order.data else order_record
            saved_order_id = actual_order.get("id", order_id)

            # 2. Insert order items
            items_to_insert = []
            for item in items_payload:
                items_to_insert.append({
                    "id": str(uuid.uuid4()),
                    "order_id": saved_order_id,
                    "product_id": item.get("product_id") if item.get("product_id") and len(item.get("product_id", "")) > 10 else None,
                    "product_name": item["product_name"],
                    "product_image": item.get("product_image"),
                    "quantity": item["quantity"],
                    "unit_price": item["unit_price"],
                    "total_price": item["total_price"],
                    "created_at": datetime.utcnow().isoformat()
                })
            
            client.table("order_items").insert(items_to_insert).execute()
            actual_order["items"] = items_to_insert
            return actual_order
        except Exception as e:
            logger.error(f"Error persisting order to Supabase: {str(e)}. Storing in-memory.")

    # In-memory storage fallback
    order_record["items"] = items_payload
    MEM_ORDERS[order_number] = order_record
    return order_record

async def update_order_email_status(order_number: str, message_id: Optional[str], sent: bool):
    client = get_supabase_client()
    if client:
        try:
            client.table("orders").update({
                "email_sent": sent,
                "mailgun_message_id": message_id
            }).eq("order_number", order_number).execute()
            return
        except Exception as e:
            logger.warning(f"Could not update Supabase order email status: {str(e)}")

    if order_number in MEM_ORDERS:
        MEM_ORDERS[order_number]["email_sent"] = sent
        MEM_ORDERS[order_number]["mailgun_message_id"] = message_id

async def get_order_by_number(order_number: str) -> Optional[Dict[str, Any]]:
    client = get_supabase_client()
    if client:
        try:
            res = client.table("orders").select("*, order_items(*)").eq("order_number", order_number).execute()
            if res.data and len(res.data) > 0:
                order = res.data[0]
                order["items"] = order.get("order_items", [])
                return order
        except Exception as e:
            logger.warning(f"Error fetching order from Supabase: {str(e)}")
    
    return MEM_ORDERS.get(order_number)
