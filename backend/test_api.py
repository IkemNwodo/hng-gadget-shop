from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_endpoints():
    print("=== 1. Testing Root / Endpoint ===")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("Root response:", res.json())

    print("\n=== 2. Testing /api/system/status Endpoint ===")
    res = client.get("/api/system/status")
    assert res.status_code == 200
    print("Status response:", res.json())

    print("\n=== 3. Testing /api/products Endpoint ===")
    res = client.get("/api/products")
    assert res.status_code == 200
    products = res.json()
    assert len(products) > 0, "Expected at least 1 product"
    print(f"Products loaded: {len(products)} products found")
    first_product = products[0]
    print(f"Sample product: {first_product['name']} - ${first_product['price']}")

    print("\n=== 4. Testing /api/products with Category filter ===")
    res = client.get("/api/products?category=Audio")
    assert res.status_code == 200
    audio_products = res.json()
    print(f"Audio products found: {len(audio_products)}")

    print("\n=== 5. Testing /api/checkout Endpoint ===")
    checkout_payload = {
        "customer_name": "Ikem Test Customer",
        "customer_email": "ikem.test@gmail.com",
        "customer_phone": "+2348012345678",
        "shipping_address": {
            "fullName": "Ikem Test Customer",
            "street": "Plot 10, Innovation Boulevard",
            "city": "Lagos",
            "state": "Lagos State",
            "postalCode": "100001",
            "country": "Nigeria"
        },
        "items": [
            {
                "product_id": first_product["id"],
                "product_name": first_product["name"],
                "product_image": first_product["image_url"],
                "quantity": 2,
                "unit_price": first_product["price"],
                "total_price": first_product["price"] * 2
            }
        ],
        "subtotal": first_product["price"] * 2,
        "tax": 15.0,
        "shipping_fee": 0.0,
        "total_amount": (first_product["price"] * 2) + 15.0,
        "payment_method": "card",
        "user_id": None
    }

    res = client.post("/api/checkout", json=checkout_payload)
    assert res.status_code == 200, f"Checkout failed: {res.text}"
    checkout_data = res.json()
    order = checkout_data["order"]
    order_number = order["order_number"]
    print("Order Placed Successfully!")
    print(f"Order Number: {order_number}")
    print(f"Total Amount: ${order['total_amount']}")
    print(f"Mailgun Delivery Status: {checkout_data.get('mailgun_delivery')}")

    print("\n=== 6. Testing /api/orders/{order_number} Endpoint ===")
    res = client.get(f"/api/orders/{order_number}")
    assert res.status_code == 200, f"Order fetch failed: {res.text}"
    fetched_order = res.json()
    assert fetched_order["order_number"] == order_number
    print("Fetched Order verification successful! Order exists in store/database.")
    print("\n[SUCCESS] ALL BACKEND TESTS PASSED!")

if __name__ == "__main__":
    test_endpoints()
