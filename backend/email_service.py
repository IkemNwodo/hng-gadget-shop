import httpx
import logging
from typing import Dict, Any, List
from config import settings

logger = logging.getLogger(__name__)

def build_order_email_html(order: Dict[str, Any], items: List[Dict[str, Any]]) -> str:
    """Generate a clean, responsive HTML email template for order confirmation."""
    order_number = order.get("order_number", "ORD-UNKNOWN")
    customer_name = order.get("customer_name", "Valued Customer")
    total_amount = order.get("total_amount", 0.0)
    subtotal = order.get("subtotal", 0.0)
    shipping_fee = order.get("shipping_fee", 0.0)
    tax = order.get("tax", 0.0)
    shipping_addr = order.get("shipping_address", {})
    
    items_rows_html = ""
    for item in items:
        p_name = item.get("product_name", "Item")
        p_qty = item.get("quantity", 1)
        p_price = float(item.get("unit_price", 0.0))
        p_total = float(item.get("total_price", p_price * p_qty))
        p_image = item.get("product_image", "")
        img_tag = f'<img src="{p_image}" width="48" height="48" style="border-radius: 8px; object-fit: cover; margin-right: 12px; vertical-align: middle;" />' if p_image else ''

        items_rows_html += f"""
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b;">
                <div style="display: flex; align-items: center;">
                    {img_tag}
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">{p_name}</div>
                        <div style="color: #64748b; font-size: 12px;">Qty: {p_qty} × ${p_price:,.2f}</div>
                    </div>
                </div>
            </td>
            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; font-weight: 600; color: #0f172a;">
                ${p_total:,.2f}
            </td>
        </tr>
        """

    formatted_address = f"""
    {shipping_addr.get('fullName', customer_name)}<br/>
    {shipping_addr.get('street', '')}<br/>
    {shipping_addr.get('city', '')}, {shipping_addr.get('state', '')} {shipping_addr.get('postalCode', '')}<br/>
    {shipping_addr.get('country', '')}
    """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>Order Confirmation #{order_number}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 16px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                        <!-- Header Banner -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 36px 32px; text-align: center;">
                                <div style="display: inline-block; background-color: #3b82f6; width: 44px; height: 44px; border-radius: 12px; line-height: 44px; font-size: 24px; color: #ffffff; font-weight: bold; margin-bottom: 12px;">
                                    ⚡
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">HNG Tech Shop</h1>
                                <p style="margin: 6px 0 0; color: #94a3b8; font-size: 14px;">Order Confirmed & Being Prepared</p>
                            </td>
                        </tr>

                        <!-- Greeting & Info -->
                        <tr>
                            <td style="padding: 32px 32px 16px;">
                                <p style="margin: 0 0 16px; font-size: 16px; color: #1e293b;">Hi <strong>{customer_name}</strong>,</p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                                    Thank you for choosing HNG Tech Shop! We've received your order and our team is already packaging your premium tech gadgets.
                                </p>
                                
                                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px 20px; margin-top: 24px;">
                                    <table width="100%">
                                        <tr>
                                            <td style="font-size: 13px; color: #64748b;">Order Number:</td>
                                            <td align="right" style="font-size: 14px; font-weight: 700; color: #2563eb;">{order_number}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 13px; color: #64748b; padding-top: 6px;">Payment Status:</td>
                                            <td align="right" style="font-size: 13px; font-weight: 600; color: #16a34a; padding-top: 6px;">Paid (Verified)</td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <!-- Order Items Table -->
                        <tr>
                            <td style="padding: 0 32px;">
                                <h3 style="margin: 24px 0 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Items Purchased</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    {items_rows_html}
                                </table>
                            </td>
                        </tr>

                        <!-- Pricing Summary -->
                        <tr>
                            <td style="padding: 16px 32px;">
                                <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #475569;">
                                    <tr>
                                        <td>Subtotal</td>
                                        <td align="right" style="color: #1e293b;">${subtotal:,.2f}</td>
                                    </tr>
                                    <tr>
                                        <td>Estimated Tax</td>
                                        <td align="right" style="color: #1e293b;">${tax:,.2f}</td>
                                    </tr>
                                    <tr>
                                        <td>Standard Delivery</td>
                                        <td align="right" style="color: #16a34a;">{"FREE" if shipping_fee == 0 else f"${shipping_fee:,.2f}"}</td>
                                    </tr>
                                    <tr style="font-size: 18px; font-weight: 700; color: #0f172a; border-top: 2px solid #e2e8f0;">
                                        <td style="padding-top: 12px;">Total Paid</td>
                                        <td align="right" style="padding-top: 12px; color: #2563eb;">${total_amount:,.2f}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Shipping Address -->
                        <tr>
                            <td style="padding: 16px 32px 32px;">
                                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                                    <h4 style="margin: 0 0 8px; font-size: 14px; color: #0f172a;">Shipping To:</h4>
                                    <div style="font-size: 13px; line-height: 1.5; color: #64748b;">
                                        {formatted_address}
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
                                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                    This email was automatically generated by HNG Tech Shop.<br/>
                                    If you have any questions, reply directly to this email or visit our support desk.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html

async def send_order_confirmation_email(order: Dict[str, Any], items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Sends an order confirmation email via Mailgun API.
    Returns status dict with success, message_id or reason.
    """
    api_key = settings.MAILGUN_API_KEY.strip()
    domain = settings.MAILGUN_DOMAIN.strip()
    base_url = settings.MAILGUN_API_BASE_URL.rstrip("/")
    customer_email = order.get("customer_email")
    order_number = order.get("order_number")

    # If Mailgun credentials are missing or placeholder, log and return graceful simulated status
    if not api_key or not domain or api_key.startswith("your_") or domain.startswith("your_"):
        logger.warning(f"Mailgun is not configured (MAILGUN_API_KEY/MAILGUN_DOMAIN). Simulating confirmation email for {customer_email}")
        return {
            "success": False,
            "simulated": True,
            "message_id": f"simulated-{order_number}@mailgun.mock",
            "message": "Mailgun credentials not set in .env. Email simulated successfully."
        }

    from_email = settings.MAILGUN_FROM_EMAIL.strip()
    if not from_email:
        from_email = f"HNG Tech Shop <orders@{domain}>"

    subject = f"Order Confirmation #{order_number} - HNG Tech Shop"
    html_content = build_order_email_html(order, items)
    plain_text = f"Thank you for your order {order_number}! Total: ${order.get('total_amount', 0.0):.2f}. We will ship your gadgets shortly."

    url = f"{base_url}/{domain}/messages"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                url,
                auth=("api", api_key),
                data={
                    "from": from_email,
                    "to": customer_email,
                    "subject": subject,
                    "text": plain_text,
                    "html": html_content
                }
            )

            if response.status_code in [200, 201]:
                res_data = response.json()
                msg_id = res_data.get("id", "")
                logger.info(f"Mailgun email successfully sent to {customer_email}, ID: {msg_id}")
                return {
                    "success": True,
                    "simulated": False,
                    "message_id": msg_id,
                    "message": "Confirmation email sent successfully via Mailgun"
                }
            else:
                err_text = response.text
                logger.error(f"Mailgun API error ({response.status_code}): {err_text}")
                return {
                    "success": False,
                    "simulated": False,
                    "status_code": response.status_code,
                    "error": err_text,
                    "message": f"Mailgun error ({response.status_code}): Check API key, domain, or sandbox authorized recipients"
                }

    except Exception as e:
        logger.error(f"Exception when sending Mailgun email: {str(e)}")
        return {
            "success": False,
            "simulated": False,
            "error": str(e),
            "message": f"Failed to connect to Mailgun: {str(e)}"
        }
