from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import logging

from config import settings
from schemas import ProductSchema, CheckoutRequest, OrderResponse
import database
import email_service

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HNG Tech Shop API",
    description="Backend API for HNG15 Shop - Supabase persistence, Mailgun confirmation emails, and Google Auth support",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    supabase_configured = bool(settings.SUPABASE_URL and not settings.SUPABASE_URL.startswith("your_"))
    mailgun_configured = bool(settings.MAILGUN_API_KEY and not settings.MAILGUN_API_KEY.startswith("your_"))
    
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "supabase": {
            "configured": supabase_configured,
            "url": settings.SUPABASE_URL if supabase_configured else "Not configured (fallback active)"
        },
        "mailgun": {
            "configured": mailgun_configured,
            "domain": settings.MAILGUN_DOMAIN if mailgun_configured else "Not configured (simulation active)"
        }
    }

@app.get("/api/system/status")
def system_status():
    supabase_configured = bool(settings.SUPABASE_URL and not settings.SUPABASE_URL.startswith("your_"))
    mailgun_configured = bool(settings.MAILGUN_API_KEY and not settings.MAILGUN_API_KEY.startswith("your_"))
    
    return {
        "supabase": {
            "configured": supabase_configured,
            "connected": database.get_supabase_client() is not None
        },
        "mailgun": {
            "configured": mailgun_configured,
            "domain": settings.MAILGUN_DOMAIN or None
        }
    }

@app.get("/api/products", response_model=List[ProductSchema])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    products = await database.get_all_products(category=category, search=search)
    return products

@app.get("/api/products/{product_id}", response_model=ProductSchema)
async def get_product(product_id: str):
    product = await database.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/checkout", response_model=Dict[str, Any])
async def checkout(request: CheckoutRequest, background_tasks: BackgroundTasks):
    """
    Process customer checkout:
    1. Validate items and amounts
    2. Persist order in Supabase
    3. Trigger order confirmation email via Mailgun
    4. Return order receipt and status
    """
    if not request.items or len(request.items) == 0:
        raise HTTPException(status_code=400, detail="Cart cannot be empty for checkout")

    # Prepare order dictionary
    order_payload = {
        "customer_name": request.customer_name,
        "customer_email": str(request.customer_email),
        "customer_phone": request.customer_phone,
        "shipping_address": request.shipping_address.model_dump(),
        "subtotal": request.subtotal,
        "tax": request.tax,
        "shipping_fee": request.shipping_fee,
        "total_amount": request.total_amount,
        "payment_method": request.payment_method,
        "user_id": request.user_id
    }

    items_payload = [item.model_dump() for item in request.items]

    # Save to database (Supabase)
    saved_order = await database.save_order(order_payload, items_payload)
    order_number = saved_order.get("order_number")

    # Send confirmation email via Mailgun
    mailgun_result = await email_service.send_order_confirmation_email(saved_order, items_payload)
    
    # Update order with email status
    msg_id = mailgun_result.get("message_id")
    is_sent = mailgun_result.get("success", False) or mailgun_result.get("simulated", False)
    await database.update_order_email_status(order_number, msg_id, is_sent)

    saved_order["mailgun_status"] = mailgun_result
    saved_order["email_sent"] = is_sent
    saved_order["mailgun_message_id"] = msg_id

    return {
        "message": "Order successfully placed!",
        "order": saved_order,
        "mailgun_delivery": mailgun_result
    }

@app.get("/api/orders/{order_number}")
async def get_order_details(order_number: str):
    order = await database.get_order_by_number(order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
