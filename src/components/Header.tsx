import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Truck, ShieldCheck, Heart, Shield, 
  Smartphone, Zap, ChevronDown, PhoneCall, Gift, Sparkles, X, Menu,
  MessageCircle, Lock, RefreshCw
} from 'lucide-react';
import { ProductCategory, CATEGORIES } from '../types';
import { formatPrice } from '../utils/storage';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  categories?: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  onRefreshCloud?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
  onOpenWishlist,
  onRefreshCloud,
  isSyncing = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const displayCategories = Array.from(
    new Set(['All', ...(categories && categories.length > 0 ? categories.filter(c => c !== 'All') : CATEGORIES.filter(c => c !== 'All'))])
  );

  const quickSearchTags = ['65W GaN', 'Power Bank', 'MagSafe', 'AirPods Case', 'Privacy Glass', 'Car Mount', 'DL05 Cooler'];

  return (
    <header id="khan-gadget-header" className="sticky top-0 z-40 bg-orange-600 text-white shadow-md">
      {/* Top High-Density Utility Strip */}
      <div className="bg-orange-700/80 text-orange-100 text-[11px] font-medium py-1 px-4 sm:px-6 border-b border-orange-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Flash Deals: Use code <strong className="bg-white/20 px-1 py-0.5 rounded font-mono text-white">KHAN10</strong> for 10% OFF</span>
            </span>
            <span className="hidden md:inline text-orange-300">|</span>
            <span className="hidden md:inline text-orange-100">Free delivery on orders over ৳ 2,000</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <a href="tel:01854774406" className="hidden sm:flex items-center gap-1 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-orange-200" />
              <span>Contact: 01854774406</span>
            </a>
            <a 
              href="https://wa.me/8801854774406" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-200 hover:text-emerald-100 transition font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              <span>WhatsApp: 01854774406</span>
            </a>
            {onRefreshCloud && (
              <button
                onClick={onRefreshCloud}
                disabled={isSyncing}
                className="bg-emerald-950/60 hover:bg-emerald-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 flex items-center gap-1 transition cursor-pointer border border-emerald-500/40 disabled:opacity-50"
                title="Live Cloud Database Sync (অন্যান্য ডিভাইসের ডেটা আপডেট করুন)"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}
            <button
              onClick={onOpenAdmin}
              className="bg-slate-900/40 hover:bg-slate-900/60 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 transition cursor-pointer border border-white/10"
              title="AP"
            >
              <Lock className="w-3 h-3" />
              <span>AP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main High-Density Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-1 rounded text-white hover:bg-orange-700"
              aria-label="Toggle Category Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => { onSelectCategory('All'); onSearchChange(''); }} 
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
            >
              <span className="text-2xl font-black tracking-tighter text-white">
                KHAN GADGET
              </span>
              <span className="hidden sm:inline-block bg-white text-orange-600 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded tracking-wider">
                MALL
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mobile accessories..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full py-1.5 pl-4 pr-10 rounded-sm text-slate-900 text-sm bg-white placeholder-slate-400 focus:outline-none shadow-sm"
              />
              <button 
                onClick={() => setShowSearchSuggestions(false)}
                className="absolute right-2.5 top-1.5 text-orange-600 hover:text-orange-700 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Dropdown */}
            {showSearchSuggestions && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-xl p-3 z-50 text-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  Popular Accessories:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickSearchTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        onSearchChange(tag);
                        setShowSearchSuggestions(false);
                      }}
                      className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Links & Cart */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
            <button 
              onClick={onOpenTracking}
              className="cursor-pointer hover:text-orange-100 transition whitespace-nowrap hidden sm:inline"
            >
              Track My Order
            </button>

            <button
              onClick={onOpenWishlist}
              className="relative cursor-pointer hover:text-orange-100 transition hidden sm:flex items-center gap-1"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Chip */}
            <div 
              id="cart-drawer-trigger"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-orange-700 hover:bg-orange-800 px-3 py-1.5 rounded cursor-pointer transition shadow-xs text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-bold text-sm">{cartCount}</span>
              <span className="text-xs text-orange-200 hidden sm:inline font-mono">
                ({cartTotal > 0 ? formatPrice(cartTotal) : '৳ 0'})
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mobile accessories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-1.5 pl-3 pr-8 rounded-sm text-slate-900 text-xs bg-white placeholder-slate-400 focus:outline-none"
            />
            <button className="absolute right-2 top-1.5 text-orange-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Category Quick Scroll (for smaller viewports) */}
      <div className="lg:hidden bg-orange-700 border-t border-orange-800/80 px-4 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        {displayCategories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              selectedCategory === category
                ? 'bg-white text-orange-600 font-bold'
                : 'text-orange-100 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                <div className="font-bold text-gray-900 text-lg flex items-center gap-1.5">
                  <Smartphone className="w-5 h-5 text-[#f85606]" />
                  <span>KHAN GADGET</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-col space-y-1">
                {displayCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onSelectCategory(category);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => {
                    onOpenTracking();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-lg"
                >
                  <Truck className="w-4 h-4 text-[#f85606]" />
                  <span>Order Tracking</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-lg"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>AP</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">Official Mobile Accessory Store</p>
              <a href="tel:01854774406" className="flex items-center gap-2 text-slate-700 hover:text-orange-600 font-medium">
                <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                <span>Helpline: 01854774406</span>
              </a>
              <a 
                href="https://wa.me/8801854774406" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>WhatsApp: 01854774406</span>
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
