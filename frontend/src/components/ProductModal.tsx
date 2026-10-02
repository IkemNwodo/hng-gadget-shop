import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-slate-100 aspect-square md:aspect-auto">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-sm text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviews_count} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-slate-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
                {product.original_price && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ${(product.original_price - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Value props */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 text-[11px] text-slate-600 mb-6">
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-50">
                  <Truck className="w-4 h-4 text-blue-600 mb-1" />
                  <span>Free Express</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-50">
                  <Shield className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>2-Yr Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-50">
                  <RotateCcw className="w-4 h-4 text-purple-600 mb-1" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-xs font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  • {product.stock} in stock
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
