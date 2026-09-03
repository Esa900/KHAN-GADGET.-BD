import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  FlashSaleBanner 
} from './components/FlashSaleBanner';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  OrderTrackingModal 
} from './components/OrderTrackingModal';
import { 
  AdminPanel 
} from './components/AdminPanel';
import { 
  Footer 
} from './components/Footer';
import { 
  Product, ProductCategory, CATEGORIES, CartItem, Voucher, Order, OrderStatus, ProductReview 
} from './types';
import { 
  getStoredProducts, saveStoredProducts, 
  getStoredOrders, saveStoredOrders, updateOrderStatus,
  getStoredVouchers, saveStoredVouchers,
  getStoredCart, saveStoredCart,
  getStoredWishlist, saveStoredWishlist,
  formatPrice 
} from './utils/storage';
import { 
  SlidersHorizontal, Sparkles, X, Check, Heart, 
  ShoppingBag, ArrowUpDown, Filter, Smartphone, Zap, 
  Layers, ShieldCheck, Truck, Clock, RefreshCw,
  MessageCircle, Lock
} from 'lucide-react';

export default function App() {
  // Products, Orders, Vouchers State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Modals visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quick Track Input
  const [quickTrackInput, setQuickTrackInput] = useState('');

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyDarazMall, setOnlyDarazMall] = useState(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [onlyFlashSale, setOnlyFlashSale] = useState(false);

  // Active Voucher in Cart
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Temporary Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Load Initial Data from Persistent LocalStorage
  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setVouchers(getStoredVouchers());
    setCart(getStoredCart());
    setWishlist(getStoredWishlist());
  }, []);

  // Save Cart and Wishlist on changes
  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredWishlist(wishlist);
  }, [wishlist]);

  // Available unique brands for filter
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand)));
    return ['All', ...list];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'All' && item.brand !== selectedBrand) {
        return false;
      }
      // Free delivery
      if (onlyFreeDelivery && !item.freeDelivery) {
        return false;
      }
      // Daraz Mall
      if (onlyDarazMall && !item.isDarazMall) {
        return false;
      }
      // Flash Sale
      if (onlyFlashSale && !item.isFlashSale) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchBrand && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, selectedBrand, onlyFreeDelivery, onlyDarazMall, onlyFlashSale, searchQuery, sortBy]);

  // Cart Management
  const handleAddToCart = (
    product: Product, 
    quantity = 1, 
    selectedVariants?: Record<string, string>, 
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stock, updated[existingIdx].quantity + quantity);
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedVariants }];
      }
    });

    showToast(`Added "${product.title.slice(0, 24)}..." to cart!`);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart');
  };

  const handleBuyNow = (
    product: Product, 
    quantity: number, 
    selectedVariants: Record<string, string>
  ) => {
    handleAddToCart(product, quantity, selectedVariants);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  // Apply Voucher
  const handleApplyVoucher = (code: string): { success: boolean; message: string } => {
    const v = vouchers.find(item => item.code.toUpperCase() === code.toUpperCase() && item.isActive);
    if (!v) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const currentSubtotal = cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
    if (currentSubtotal < v.minSpend) {
      return { 
        success: false, 
        message: `Minimum order value for ${v.code} is ${formatPrice(v.minSpend)}.` 
      };
    }

    setAppliedVoucher(v);
    return { success: true, message: `Voucher ${v.code} applied successfully!` };
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    showToast('Coupon removed');
  };

  // Handle Order Success
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(getStoredOrders()); // Refresh orders list
    setProducts(getStoredProducts()); // Refresh stock levels
    setCart([]); // Clear cart
    setAppliedVoucher(null);
    setActiveTrackingOrderId(newOrder.id);
    setIsTrackingOpen(true);
  };

  // Add Product Review
  const handleAddReview = (productId: string, review: ProductReview) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const currentReviews = p.reviews || [];
        const newReviews = [review, ...currentReviews];
        const avgRating = Number((newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length).toFixed(1));
        return {
          ...p,
          reviews: newReviews,
          reviewCount: p.reviewCount + 1,
          rating: avgRating
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(updatedProducts.find(p => p.id === productId) || null);
    }
    showToast('Thank you! Your verified review has been posted.');
  };

  // Admin Actions
  const handleAdminAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    showToast(`Accessory "${newProd.title}" added to store!`);
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    saveStoredProducts(updated);
    showToast(`Product "${updatedProd.title}" updated.`);
  };

  const handleAdminDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product deleted from catalog.');
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: OrderStatus, carrier?: string, note?: string) => {
    const updated = updateOrderStatus(orderId, status, carrier, note);
    if (updated) {
      setOrders(getStoredOrders());
      showToast(`Order ${orderId} updated to ${status}. Tracking updated!`);
    }
  };

  const handleAdminAddVoucher = (newVoucher: Voucher) => {
    const updated = [...vouchers, newVoucher];
    setVouchers(updated);
    saveStoredVouchers(updated);
    showToast(`Coupon ${newVoucher.code} created!`);
  };

  const handleAdminDeleteVoucher = (code: string) => {
    const updated = vouchers.filter(v => v.code !== code);
    setVouchers(updated);
    saveStoredVouchers(updated);
    showToast(`Coupon ${code} removed.`);
  };

  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotal = cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-orange-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5 fade-in duration-200 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setActiveTrackingOrderId(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* High-Density Layout Container */}
      <main className="w-full max-w-[1440px] mx-auto p-3 sm:p-4 flex gap-4 flex-1">
        
        {/* Left Column: Categories, Filters, and Admin Shortcut */}
        <aside className="w-52 shrink-0 hidden lg:flex flex-col gap-3">
          {/* Categories Card */}
          <div className="bg-white p-3 shadow-sm rounded border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
              Categories
            </h3>
            <ul className="text-xs space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <li
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                      isSelected
                        ? 'text-orange-600 font-bold bg-orange-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <div className="w-1 h-3.5 bg-orange-500 rounded-full" />}
                    <span className="truncate">{cat}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Filters Card */}
          <div className="bg-white p-3 shadow-sm rounded border border-slate-200 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
              Filters
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyDarazMall}
                    onChange={(e) => setOnlyDarazMall(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span className="text-slate-700">Mall Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFreeDelivery}
                    onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span className="text-slate-700">Free Delivery</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFlashSale}
                    onChange={(e) => setOnlyFlashSale(e.target.checked)}
                    className="accent-orange-600 rounded"
                  />
                  <span className="text-slate-700">Flash Sale Deals</span>
                </label>
              </div>

              {(selectedBrand !== 'All' || onlyDarazMall || onlyFreeDelivery || onlyFlashSale) && (
                <button
                  onClick={() => {
                    setSelectedBrand('All');
                    setOnlyDarazMall(false);
                    setOnlyFreeDelivery(false);
                    setOnlyFlashSale(false);
                  }}
                  className="w-full mt-2 py-1 text-[11px] font-semibold text-orange-600 hover:bg-orange-50 rounded text-center transition cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Store Portal Card */}
          <div className="bg-slate-800 text-white p-3 shadow-sm rounded border border-slate-900 mt-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Portal</h3>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-700 p-2 rounded">
                <div className="opacity-70">Catalog Items</div>
                <div className="text-sm font-bold">{products.length}</div>
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <div className="opacity-70">Total Orders</div>
                <div className="text-sm font-bold">{orders.length}</div>
              </div>
            </div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="w-full mt-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-[11px] font-bold rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3" />
              <span>APP LOGIN</span>
            </button>
          </div>
        </aside>

        {/* Center Section: Banner, Header bar & Product Grid */}
        <section className="flex-1 flex flex-col gap-3 min-w-0">
          
          {/* Flash Sale Banner */}
          <FlashSaleBanner 
            onSelectVoucher={(code) => {
              handleApplyVoucher(code);
              showToast(`Coupon ${code} applied to your cart!`);
            }} 
          />

          {/* Catalog Controls / Header Bar */}
          <div className="bg-white p-2.5 rounded border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900">
                {searchQuery ? (
                  <span>Results for &ldquo;<span className="text-orange-600">{searchQuery}</span>&rdquo;</span>
                ) : selectedCategory === 'All' ? (
                  <span>All Mobile Accessories</span>
                ) : (
                  <span>{selectedCategory}</span>
                )}
              </h1>
              <span className="text-[11px] text-slate-400 font-medium">
                ({filteredProducts.length} items)
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded border border-slate-200 p-10 text-center my-4 shadow-sm">
              <Smartphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No matching accessories found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for &ldquo;Charger&rdquo;, &ldquo;Case&rdquo;, or &ldquo;Earbuds&rdquo; or clearing filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setOnlyDarazMall(false);
                  setOnlyFreeDelivery(false);
                  setOnlyFlashSale(false);
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {filteredProducts.map((product, idx) => (
                <React.Fragment key={product.id}>
                  {/* High Density Promotion Card after 2nd product */}
                  {idx === 2 && (
                    <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded p-4 text-white flex flex-col justify-center shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Special Offer</span>
                      <h3 className="text-lg font-black mt-1">Join KHAN Club</h3>
                      <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                        Get 15% off your next order with coupon KHAN15 and free express delivery on all orders.
                      </p>
                      <button 
                        onClick={() => {
                          handleApplyVoucher('KHAN10');
                          showToast('KHAN Club 10% discount applied to your order!');
                        }}
                        className="mt-3 bg-white hover:bg-indigo-50 text-indigo-900 text-xs font-bold py-1.5 px-3 rounded w-max transition cursor-pointer"
                      >
                        CLAIM 10% VOUCHER NOW
                      </button>
                    </div>
                  )}

                  <ProductCard
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onAddToCart={(p, e) => handleAddToCart(p, 1, undefined, e)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={setSelectedProduct}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </section>

        {/* Right Aside: Order Tracking & Secure Payment (from Design HTML) */}
        <aside className="w-64 shrink-0 hidden xl:flex flex-col gap-3">
          {/* Live Order Tracker Card */}
          <div className="bg-white p-3.5 shadow-sm rounded border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Track Order</h3>
              <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">LIVE DEX</span>
            </div>
            
            <div className="flex gap-1 mb-3">
              <input 
                type="text" 
                placeholder="KHN-... (Order ID)" 
                value={quickTrackInput}
                onChange={(e) => setQuickTrackInput(e.target.value)}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
              />
              <button 
                onClick={() => {
                  if (quickTrackInput.trim()) {
                    setActiveTrackingOrderId(quickTrackInput.trim());
                  } else if (orders.length > 0) {
                    setActiveTrackingOrderId(orders[0].id);
                  }
                  setIsTrackingOpen(true);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer"
              >
                CHECK
              </button>
            </div>

            {/* Quick status timeline */}
            <div className="space-y-3 border-l-2 border-slate-200 pl-3.5 ml-1.5 text-xs my-3">
              <div className="relative">
                <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="font-semibold text-slate-800 text-[11px]">Warehouse Dispatch</div>
                <div className="text-[10px] text-slate-400">Inventory Verified</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white" />
                <div className="font-semibold text-slate-800 text-[11px]">In Transit</div>
                <div className="text-[10px] text-slate-400">TCS / Dex Rider Assigned</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="font-semibold text-slate-500 text-[11px]">Delivered</div>
                <div className="text-[10px] text-slate-400">Cash Collected</div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTrackingOrderId(orders[0]?.id);
                setIsTrackingOpen(true);
              }}
              className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded transition cursor-pointer"
            >
              OPEN FULL TRACKER
            </button>
          </div>

          {/* Secure Payment Card */}
          <div className="bg-white p-3.5 shadow-sm rounded border border-slate-200 flex-1 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secure Payment</h3>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
                100% purchase protection. Every order is verified with real-time tracking and instant confirmation.
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-medium text-slate-700 text-[11px]">Cash on Delivery</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-medium text-slate-700 text-[11px]">JazzCash / EasyPaisa</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">INSTANT</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-medium text-slate-700 text-[11px]">Visa / Mastercard</span>
                  <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">3D SECURE</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="text-[10px] text-slate-400 font-medium">© 2024 KHAN GADGET LTD.</div>
              <div className="text-[10px] text-slate-400">Certified Mobile Accessories Mall</div>
            </div>
          </div>
        </aside>

      </main>

      {/* Footer */}
      <Footer 
        onOpenTracking={() => {
          setActiveTrackingOrderId(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODAL: Product Detail */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, q, v) => handleAddToCart(p, q, v)}
          onBuyNow={handleBuyNow}
          onToggleWishlist={(id) => handleToggleWishlist(id)}
          onAddReview={handleAddReview}
        />
      )}

      {/* DRAWER: Shopping Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedVoucher={appliedVoucher}
        onApplyVoucher={handleApplyVoucher}
        onRemoveVoucher={handleRemoveVoucher}
      />

      {/* MODAL: Checkout with Secure Payments */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* MODAL: Live Order Tracking */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={activeTrackingOrderId}
      />

      {/* MODAL: Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        vouchers={vouchers}
        onAddProduct={handleAdminAddProduct}
        onUpdateProduct={handleAdminUpdateProduct}
        onDeleteProduct={handleAdminDeleteProduct}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onAddVoucher={handleAdminAddVoucher}
        onDeleteVoucher={handleAdminDeleteVoucher}
      />

      {/* MODAL / DRAWER: Wishlist */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-bold text-gray-900 text-base">Saved Wishlist ({wishlist.length})</h3>
                </div>
                <button onClick={() => setIsWishlistOpen(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700 text-xs">No saved items yet.</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Click the heart icon on any charger or accessory to save it!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[75vh]">
                  {products.filter(p => wishlist.includes(p.id)).map(prod => (
                    <div key={prod.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-contain rounded bg-white p-1 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                        <div className="font-medium text-gray-900 truncate">{prod.title}</div>
                        <div className="font-bold text-[#f85606]">{formatPrice(prod.price)}</div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              handleAddToCart(prod, 1);
                              setIsWishlistOpen(false);
                            }}
                            className="bg-[#f85606] text-white text-[11px] font-bold px-3 py-1 rounded-md hover:bg-[#e04a00]"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(prod.id)}
                            className="text-gray-400 hover:text-rose-600 text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/8801854774406?text=Hello%20KHAN%20GADGET%2C%20I%20have%20an%20inquiry"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition hover:scale-105 cursor-pointer border border-white/20"
        title="WhatsApp Support: 01854774406"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
        <span className="text-[11px] font-mono hidden md:inline">01854774406</span>
      </a>

    </div>
  );
}
