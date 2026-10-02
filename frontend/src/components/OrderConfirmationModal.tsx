import React, { useEffect } from 'react';
import { CheckCircle2, Mail, Package, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { OrderResponse } from '../types';

interface OrderConfirmationModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (order) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [order]);

  if (!order) return null;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMailgunLive = order.mailgun_delivery?.success === true;
  const isMailgunSimulated = order.mailgun_delivery?.simulated === true;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-scaleIn">
        {/* Top Success Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Thank You For Your Order!</h2>
          <p className="text-sm text-slate-600 mt-1">
            Your gadgets are being processed and prepared for rapid shipment.
          </p>

          {/* Order ID Pill */}
          <div className="inline-flex items-center space-x-2 mt-4 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800">
            <span>Order #: <strong>{order.order_number}</strong></span>
            <button
              onClick={copyOrderNumber}
              className="p-1 hover:text-blue-600 transition cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mailgun Status Box */}
        <div className={`p-4 rounded-2xl mb-6 border ${
          isMailgunLive
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-xl ${
              isMailgunLive ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-sm">
                  {isMailgunLive ? 'Confirmation Email Sent via Mailgun' : 'Mailgun Confirmation Dispatched'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isMailgunLive ? 'bg-emerald-200 text-emerald-900' : 'bg-blue-200 text-blue-900'
                }`}>
                  {isMailgunLive ? 'Live API Success' : 'Simulated API'}
                </span>
              </div>
              <p className="text-slate-600 mb-1">
                Sent to: <strong className="text-slate-800">{order.customer_email}</strong>
              </p>
              {order.mailgun_message_id && (
                <p className="text-slate-500 font-mono text-[11px] truncate">
                  Message ID: {order.mailgun_message_id}
                </p>
              )}
              {isMailgunSimulated && (
                <p className="text-[11px] text-blue-700 mt-1 italic">
                  Note: Add your MAILGUN_API_KEY & MAILGUN_DOMAIN to backend/.env for live inbox delivery.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
            <h4 className="font-semibold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              Purchased Items
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/50 last:border-none">
                  <div className="flex items-center space-x-2">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-8 h-8 rounded-lg object-cover bg-white"
                      />
                    )}
                    <div>
                      <span className="font-medium text-slate-800">{item.product_name}</span>
                      <span className="text-slate-400 ml-2">× {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${Number(item.total_price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Amount Paid</span>
              <span className="text-blue-600">${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600">
            <h4 className="font-semibold text-slate-800 mb-1 uppercase tracking-wider text-[11px]">
              Delivery Destination
            </h4>
            <p className="font-medium text-slate-800">{order.shipping_address?.fullName || order.customer_name}</p>
            <p>{order.shipping_address?.street}</p>
            <p>
              {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}
            </p>
            <p>{order.shipping_address?.country}</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
