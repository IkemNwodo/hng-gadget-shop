from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class ProductSchema(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    image_url: str
    stock: int = 10
    rating: float = 4.8
    reviews_count: int = 50
    featured: bool = False
    badge: Optional[str] = None
    created_at: Optional[str] = None

class OrderItemSchema(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    product_image: Optional[str] = None
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")
    unit_price: float = Field(ge=0, description="Unit price")
    total_price: float = Field(ge=0, description="Total line price")

class ShippingAddressSchema(BaseModel):
    fullName: str
    street: str
    city: str
    state: str
    postalCode: str
    country: str = "Nigeria"

class CheckoutRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    shipping_address: ShippingAddressSchema
    items: List[OrderItemSchema]
    subtotal: float
    tax: float = 0.0
    shipping_fee: float = 0.0
    total_amount: float
    payment_method: str = "card"
    user_id: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: dict
    subtotal: float
    tax: float
    shipping_fee: float
    total_amount: float
    order_status: str
    payment_status: str
    email_sent: bool
    mailgun_message_id: Optional[str] = None
    items: List[dict]
    created_at: str
