import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, User as UserIcon, LogOut, BookOpen, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSetupGuide: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewCheckout: () => void;
  onViewShop: () => void;
  isCheckoutView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSetupGuide,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onViewCheckout,
  onViewShop,
  isCheckoutView,
}) => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, signInWithGoogle, signOut, simulateGoogleLogin, isConfigured, isDemoUser } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const categories = ['All', 'Audio', 'Computers', 'Wearables', 'Accessories'];

  const handleGoogleAuth = async () => {
    setAuthError(null);
    try {
      if (isConfigured) {
        await signInWithGoogle();
      } else {
        // If Supabase credentials are not yet added, use the quick demo sign-in
        simulateGoogleLogin();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
      setTimeout(() => setAuthError(null), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Alert / Status */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/60 text-blue-300 border border-blue-700/50">
              HNG15 Lesson 2
            </span>
            <span className="hidden sm:inline text-slate-400">
              Full-Stack Shop with Supabase Database • Mailgun Receipts • Google Auth
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenSetupGuide}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Integration Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={onViewShop}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                HNG<span className="text-blue-600">Tech</span>
              </span>
              <span className="hidden md:inline-block ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                PRO STORE
              </span>
            </div>
          </div>

          {/* Search Bar (visible when in shop view) */}
          {!isCheckoutView && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search gadgets, laptops, audio..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/80 focus:bg-white border border-transparent focus:border-blue-500 rounded-full text-sm outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Google Auth / Profile */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition text-sm cursor-pointer"
                  >
                    <img
                      src={
                        user.user_metadata?.avatar_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <span className="hidden sm:inline font-medium text-slate-700 max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {user.user_metadata?.full_name || 'Google User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        {isDemoUser && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            Demo Google Account
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleGoogleAuth}
                    className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm transition hover:shadow cursor-pointer"
                    title="Sign in with Google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Sign in with Google</span>
                  </button>

                  {!isConfigured && (
                    <button
                      onClick={() => simulateGoogleLogin()}
                      title="Quick test demo Google account"
                      className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-2 rounded-lg font-medium border border-blue-200 transition cursor-pointer"
                    >
                      Demo User
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar (when in shop view) */}
        {!isCheckoutView && (
          <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-none border-t border-slate-100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {authError && (
        <div className="bg-red-500 text-white text-xs py-1.5 px-4 text-center">
          {authError}
        </div>
      )}
    </header>
  );
};
