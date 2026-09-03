import React, { useState } from 'react';
import { 
  X, LayoutDashboard, Package, ShoppingBag, Tag, 
  Settings, Plus, Edit2, Trash2, Check, AlertCircle, 
  TrendingUp, Truck, ShieldAlert, ArrowUpRight, DollarSign, 
  Search, Eye, EyeOff, RefreshCw, KeyRound, Lock, Unlock 
} from 'lucide-react';
import { Product, Order, Voucher, OrderStatus, ProductCategory } from '../types';
import { formatPrice, resetToDemoDefaults } from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  vouchers: Voucher[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, carrier?: string, note?: string) => void;
  onAddVoucher: (voucher: Voucher) => void;
  onDeleteVoucher: (code: string) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Chargers & Cables',
  'Audio & Earbuds',
  'Cases & Covers',
  'Power Banks',
  'Screen Protectors',
  'Holders & Mounts',
  'Smartwatch Accessories',
  'Gaming Accessories'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  vouchers,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddVoucher,
  onDeleteVoucher
}) => {
  // App Login & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'ESA006##') {
      setIsAuthenticated(true);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Access denied.');
      setPasswordInput('');
    }
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'vouchers' | 'settings'>('dashboard');

  // Product Management States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'Chargers & Cables',
    brand: 'Anker',
    price: 1999,
    originalPrice: 2999,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: '',
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: false
  });
  const [productSearch, setProductSearch] = useState('');

  // Order Management States
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Shipped');
  const [statusNote, setStatusNote] = useState('');
  const [courierName, setCourierName] = useState('Daraz Express (DEX)');

  // Voucher Form State
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState<Voucher>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 2000,
    description: '',
    isActive: true
  });

  if (!isOpen) return null;

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Chargers & Cables',
      brand: 'Khan Prime',
      price: 1500,
      originalPrice: 2500,
      stock: 25,
      rating: 4.8,
      reviewCount: 15,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      description: 'High quality mobile accessory backed by Khan Gadget official warranty.',
      specs: {
        'Warranty': '1 Year Replacement',
        'Compatibility': 'Universal'
      },
      isFlashSale: false,
      isDarazMall: true,
      freeDelivery: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        ...productForm as Product
      };
      onUpdateProduct(updated);
    } else {
      const newProd: Product = {
        id: 'kg-prod-' + Date.now(),
        title: productForm.title || 'New Accessory',
        category: (productForm.category || 'Chargers & Cables') as ProductCategory,
        brand: productForm.brand || 'Khan Prime',
        price: Number(productForm.price) || 999,
        originalPrice: Number(productForm.originalPrice) || 1499,
        stock: Number(productForm.stock) || 10,
        rating: 4.9,
        reviewCount: 1,
        image: productForm.image || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        description: productForm.description || 'Premium mobile accessory.',
        specs: productForm.specs || { 'Warranty': '12 Months' },
        isFlashSale: !!productForm.isFlashSale,
        isDarazMall: !!productForm.isDarazMall,
        freeDelivery: !!productForm.freeDelivery
      };
      onAddProduct(newProd);
    }
    setIsProductModalOpen(false);
  };

  const handleSaveOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;

    onUpdateOrderStatus(selectedOrderForEdit.id, newStatus, courierName, statusNote);
    setSelectedOrderForEdit(null);
    setStatusNote('');
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherForm.code) return;

    onAddVoucher({
      ...voucherForm,
      code: voucherForm.code.trim().toUpperCase()
    });
    setIsVoucherModalOpen(false);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return o.status === orderFilter;
  });

  // If not yet authenticated, show the App Login dialog
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div 
          className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white tracking-tight">App Login</h3>
                <p className="text-[10px] text-slate-400">Store Verification Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white pr-10 tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <div className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-[11px] text-slate-400 font-medium">
                KHAN GADGET Security System
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navbar */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f85606] flex items-center justify-center text-white shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-white text-base sm:text-lg">KHAN GADGET Store Portal</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED SESSION
                </span>
              </div>
              <p className="text-xs text-gray-400">Inventory & Order Dispatch Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (confirm('Reset store back to default demo catalog and sample orders?')) {
                  resetToDemoDefaults();
                }
              }}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Reset to Initial Demo State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPasswordInput('');
                onClose();
              }}
              className="text-xs bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-semibold"
              title="Log out from Store Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 bg-gray-100 border-b border-gray-200 flex overflow-x-auto shrink-0 gap-2 py-2">
          {[
            { id: 'dashboard', label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'vouchers', label: `Vouchers (${vouchers.length})`, icon: Tag },
            { id: 'settings', label: 'Store Controls', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#f85606] shadow-xs border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          
          {/* TAB 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ↑ 18.4% from last 30 days
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f85606] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{orders.length}</div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {deliveredCount} delivered • {pendingCount} active in transit
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Accessories Catalog</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{products.length}</div>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">
                    {CATEGORIES.length} Active Categories
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{lowStockCount}</div>
                  <p className="text-[11px] text-amber-600 font-semibold mt-1">
                    Items with less than 10 units
                  </p>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#f85606] hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">City</th>
                        <th className="pb-2">Items</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80">
                          <td className="py-3 font-mono font-bold text-gray-900">{order.id}</td>
                          <td className="py-3 font-medium">{order.shippingAddress.fullName}</td>
                          <td className="py-3 text-gray-500">{order.shippingAddress.city}</td>
                          <td className="py-3 text-gray-500">{order.items.length} item(s)</td>
                          <td className="py-3 font-bold text-[#f85606]">{formatPrice(order.total)}</td>
                          <td className="py-3">
                            <span className="bg-orange-100 text-[#f85606] px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(order);
                                setNewStatus(order.status);
                                setActiveTab('orders');
                              }}
                              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search by title, brand, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#f85606] hover:bg-[#e04a00] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Accessory</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Badges</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/80">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-contain rounded border border-gray-200 p-0.5 shrink-0 bg-white"
                            />
                            <div className="min-w-0 max-w-xs">
                              <span className="font-bold text-gray-900 block truncate">{prod.title}</span>
                              <span className="text-[11px] text-gray-400">{prod.brand} • {prod.id}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600 font-medium">{prod.category}</td>
                          <td className="p-3">
                            <span className="font-bold text-[#f85606]">{formatPrice(prod.price)}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-gray-400 block line-through">
                                {formatPrice(prod.originalPrice)}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              prod.stock < 10 
                                ? 'bg-rose-50 text-rose-700' 
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {prod.isDarazMall && (
                                <span className="bg-[#f85606] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  Mall
                                </span>
                              )}
                              {prod.isFlashSale && (
                                <span className="bg-amber-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  Flash
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete product "${prod.title}"?`)) {
                                    onDeleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Orders Management */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 overflow-x-auto text-xs">
                  {['All', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        orderFilter === status
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Order & Tracking #</th>
                        <th className="p-3">Buyer Details</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Items Count</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Current Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80">
                          <td className="p-3 font-mono">
                            <span className="font-bold text-gray-900 block">{order.id}</span>
                            <span className="text-[11px] text-[#f85606]">{order.trackingNumber}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-gray-800">{order.shippingAddress.fullName}</div>
                            <div className="text-[11px] text-gray-500">{order.shippingAddress.phone} • {order.shippingAddress.city}</div>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-gray-700 uppercase">{order.paymentMethod}</span>
                            <span className="text-[10px] text-emerald-600 block">{order.paymentStatus}</span>
                          </td>
                          <td className="p-3 text-gray-600">
                            {order.items.reduce((acc, it) => acc + it.quantity, 0)} units
                          </td>
                          <td className="p-3 font-black text-[#f85606]">{formatPrice(order.total)}</td>
                          <td className="p-3">
                            <span className="bg-orange-100 text-[#f85606] font-bold px-2 py-0.5 rounded text-[10px]">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(order);
                                setNewStatus(order.status);
                                setCourierName(order.carrierName || 'Daraz Express (DEX)');
                              }}
                              className="px-3 py-1.5 bg-[#f85606] hover:bg-[#e04a00] text-white rounded-lg font-bold text-xs transition cursor-pointer"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Vouchers Management */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Active Promo Discount Codes</h3>
                  <p className="text-xs text-gray-500">Configure vouchers applied at checkout</p>
                </div>

                <button
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="bg-[#f85606] hover:bg-[#e04a00] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Voucher</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vouchers.map((v) => (
                  <div key={v.code} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-sm bg-orange-50 text-[#f85606] px-2.5 py-1 rounded border border-orange-200">
                          {v.code}
                        </span>
                        <button
                          onClick={() => onDeleteVoucher(v.code)}
                          className="text-gray-400 hover:text-rose-600 transition"
                          title="Delete Voucher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-800">{v.description}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Min. Order Value: {formatPrice(v.minSpend)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-bold">
                        {v.discountType === 'percentage' ? `${v.discountValue}% OFF` : `Flat ${formatPrice(v.discountValue)} OFF`}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Store Controls & Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">KHAN GADGET Store Controls</h3>
                <p className="text-xs text-gray-500">System maintenance and demo data replenishment</p>
              </div>

              <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 text-xs space-y-2">
                <span className="font-bold text-gray-900 block">Warehouse Location</span>
                <p className="text-gray-600">
                  Khan Gadget Central Hub: Plot #14, Korangi Industrial Area, Karachi, Pakistan.
                </p>
                <p className="text-gray-600">
                  Couriers Integrated: Daraz Express (DEX), TCS Logistics, Leopard Courier.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-1">Reset Store Data</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Restores default mobile accessories catalog, initial demo orders for tracking tests, and default vouchers.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data to default demo state?')) {
                      resetToDemoDefaults();
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reset All to Factory Demo
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL: Add/Edit Product */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-900 text-base">
                  {editingProduct ? 'Edit Mobile Accessory' : 'Add New Mobile Accessory'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Ugreen 65W GaN Fast Charger"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Anker / Baseus / Khan Prime"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isDarazMall}
                      onChange={(e) => setProductForm({ ...productForm, isDarazMall: e.target.checked })}
                    />
                    <span>DarazMall Tag</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashSale}
                      onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                    />
                    <span>Flash Sale</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.freeDelivery}
                      onChange={(e) => setProductForm({ ...productForm, freeDelivery: e.target.checked })}
                    />
                    <span>Free Delivery</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#f85606] text-white rounded-lg font-bold hover:bg-[#e04a00]"
                  >
                    Save Accessory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Update Order Status */}
        {selectedOrderForEdit && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-900 text-base">
                  Update Order: {selectedOrderForEdit.id}
                </h3>
                <button onClick={() => setSelectedOrderForEdit(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveOrderStatus} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Change Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing / Packing</option>
                    <option value="Shipped">Shipped to Sorting Center</option>
                    <option value="Out for Delivery">Out for Delivery (Rider Dispatched)</option>
                    <option value="Delivered">Delivered & Signed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Carrier Partner</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="Daraz Express (DEX)">Daraz Express (DEX)</option>
                    <option value="TCS Express Courier">TCS Express Courier</option>
                    <option value="Leopard Courier Services">Leopard Courier Services</option>
                    <option value="M&P Express Logistics">M&P Express Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tracking Log Note (Customer will see this live)</label>
                  <textarea
                    rows={2}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Dispatched from Karachi central warehouse via van #KH-4412"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <p className="text-[11px] text-gray-500 italic">
                  💡 Updating this immediately logs a new tracking checkpoint in the customer's Live Order Tracking timeline!
                </p>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForEdit(null)}
                    className="px-4 py-2 border rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#f85606] text-white rounded-lg font-bold hover:bg-[#e04a00]"
                  >
                    Apply Status & Notify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Create Voucher */}
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-900 text-base">Create Discount Voucher</h3>
                <button onClick={() => setIsVoucherModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveVoucher} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH30"
                    value={voucherForm.code}
                    onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-lg uppercase font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Discount Type</label>
                    <select
                      value={voucherForm.discountType}
                      onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Value *</label>
                    <input
                      type="number"
                      required
                      value={voucherForm.discountValue}
                      onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Minimum Spend (Rs.)</label>
                  <input
                    type="number"
                    value={voucherForm.minSpend}
                    onChange={(e) => setVoucherForm({ ...voucherForm, minSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 15% OFF for new gadget lovers"
                    value={voucherForm.description}
                    onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="px-4 py-2 border rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#f85606] text-white rounded-lg font-bold hover:bg-[#e04a00]"
                  >
                    Save Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
