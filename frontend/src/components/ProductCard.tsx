import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600 text-white shadow-md">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-rose-500 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-2 bg-white/95 backdrop-blur text-slate-800 rounded-xl text-xs font-semibold shadow-lg hover:bg-white flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium uppercase tracking-wider text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <div className="flex items-center space-x-1 text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-xs">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviews_count})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition line-clamp-1">
          {product.name}
        </h3>

        {/* Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-medium text-xs transition flex items-center space-x-1.5 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
            }`}
            title="Add to cart"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-xs font-semibold">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-semibold hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
