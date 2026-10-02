import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { SetupGuideModal } from './components/SetupGuideModal';
import { fetchProducts, fetchSystemStatus } from './services/api';
import type { Product, OrderResponse, SystemStatus } from './types';
import { Sparkles, Database, Mail, Shield, CheckCircle, Info } from 'lucide-react';

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Load products & system status
  useEffect(() => {
    loadProducts();
    loadStatus();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(
        selectedCategory === 'All' ? undefined : selectedCategory,
        searchQuery || undefined
      );
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async () => {
    try {
      const status = await fetchSystemStatus();
      setSystemStatus(status);
    } catch {
      // Backend may be starting up
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewCheckout={() => setIsCheckoutView(true)}
        onViewShop={() => setIsCheckoutView(false)}
        isCheckoutView={isCheckoutView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isCheckoutView ? (
          <CheckoutPage
            onBackToShop={() => setIsCheckoutView(false)}
            onOrderSuccess={(order) => {
              setIsCheckoutView(false);
              setConfirmedOrder(order);
            }}
          />
        ) : (
          <div>
            {/* Hero Section */}
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Architecture Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Integrations Status:
                    </h4>
                    <p className="text-xs text-slate-500">
                      {systemStatus?.supabase.connected
                        ? '✅ Connected to live Supabase DB'
                        : '⚡ Running in demo fallback mode. Connect Supabase & Mailgun keys anytime.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSetupGuideOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer self-start sm:self-auto"
                >
                  View Setup Instructions
                </button>
              </div>
            </div>

            {/* Products Section */}
            <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {selectedCategory === 'All' ? 'Featured Tech & Gadgets' : `${selectedCategory}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing {products.length} {products.length === 1 ? 'gadget' : 'gadgets'}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
                    >
                      <div className="w-full aspect-square bg-slate-200 rounded-xl" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-8 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                  <p className="text-base font-semibold text-slate-800">No gadgets found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for another keyword or selecting a different category.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-16 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base">HNG Tech Shop</span>
            </div>
            <p className="text-slate-400 text-xs">
              Built for HNG15 Lesson 2 Individual Task. Demonstrating full-stack Supabase/Neon persistence, Mailgun confirmation delivery, and Google Cloud Console OAuth.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">Required Implementations</h5>
            <ul className="space-y-2">
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shop Website & Catalog</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-step Checkout Flow</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase / Neon Persistence</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mailgun Confirmation Emails</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Auth (Cloud Console)</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">Technology Stack</h5>
            <ul className="space-y-1.5">
              <li>• FastAPI (Python 3.14) REST API</li>
              <li>• React 19 + TypeScript + Vite 8</li>
              <li>• Tailwind CSS v4 + Lucide Icons</li>
              <li>• Supabase PostgreSQL Client</li>
              <li>• Mailgun REST HTTP Service</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3">Quick Actions</h5>
            <div className="space-y-2">
              <button
                onClick={() => setIsSetupGuideOpen(true)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-left flex items-center justify-between cursor-pointer"
              >
                <span>Setup & API Keys Guide</span>
                <span className="text-blue-400">→</span>
              </button>
              <button
                onClick={() => {
                  setIsCheckoutView(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-left flex items-center justify-between cursor-pointer"
              >
                <span>Back to Top</span>
                <span className="text-blue-400">↑</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          &copy; {new Date().getFullYear()} HNG Tech Shop. Built with excellence for HNG15.
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutView(true)}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ShopContent />
      </CartProvider>
    </AuthProvider>
  );
}
