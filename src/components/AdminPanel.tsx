import React, { useState, useRef } from 'react';
import { 
  X, LayoutDashboard, Package, ShoppingBag, Tag, 
  Settings, Plus, Edit2, Trash2, Check, AlertCircle, 
  TrendingUp, Truck, ShieldAlert, ArrowUpRight, DollarSign, 
  Search, Eye, EyeOff, RefreshCw, KeyRound, Lock, Unlock,
  Phone, MessageCircle, FileText, User, MapPin, Banknote,
  Upload, Camera, Image as ImageIcon, Link as LinkIcon, Loader2,
  Printer, ExternalLink, FolderTree, BarChart3, Users, Sparkles, ShieldCheck, Megaphone
} from 'lucide-react';
import { Product, Order, Voucher, OrderStatus, ProductCategory, DEFAULT_CATEGORIES, AnalyticsData, StoreConfig, DEFAULT_STORE_CONFIG } from '../types';
import { formatPrice, resetToDemoDefaults, getCourierTrackingUrl, getStoredVisitorCount, BASE_VISITOR_COUNT } from '../utils/storage';
import { compressImage } from '../utils/image';
import { InvoiceModal } from './InvoiceModal';
import { CategoryManager } from './CategoryManager';
import { AdminAnalytics } from './AdminAnalytics';
import { syncAllLocalToCloud } from '../lib/syncService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  vouchers: Voucher[];
  categories?: string[];
  visitorStats?: AnalyticsData;
  storeConfig?: StoreConfig;
  onAddProduct: (product: Product) => Promise<boolean> | void;
  onUpdateProduct: (product: Product) => Promise<boolean> | void;
  onDeleteProduct: (productId: string) => Promise<boolean> | void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, carrier?: string, note?: string) => void;
  onAddVoucher: (voucher: Voucher) => void;
  onDeleteVoucher: (code: string) => void;
  onAddCategory?: (categoryName: string) => Promise<boolean> | void;
  onDeleteCategory?: (categoryName: string) => Promise<boolean> | void;
  onRenameCategory?: (oldName: string, newName: string) => Promise<boolean> | void;
  onRefreshCloud?: () => void;
  onRefreshAnalytics?: () => void;
  onUpdateStoreConfig?: (config: Partial<StoreConfig>) => Promise<boolean> | void;
  isSyncing?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  vouchers,
  categories,
  storeConfig,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddVoucher,
  onDeleteVoucher,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onRefreshCloud,
  onRefreshAnalytics,
  onUpdateStoreConfig,
  visitorStats,
  isSyncing = false
}) => {
  const availableCategories = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;
  // App Login & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isUploadingCloud, setIsUploadingCloud] = useState(false);
  const [cloudSyncFeedback, setCloudSyncFeedback] = useState<string | null>(null);

  const handleTriggerCloudUpload = async () => {
    setIsUploadingCloud(true);
    setCloudSyncFeedback(null);
    try {
      const res = await syncAllLocalToCloud();
      setCloudSyncFeedback(res.message);
      if (onRefreshCloud) onRefreshCloud();
      setTimeout(() => setCloudSyncFeedback(null), 5000);
    } catch (err: any) {
      setCloudSyncFeedback(err?.message || 'Upload failed');
      setTimeout(() => setCloudSyncFeedback(null), 5000);
    } finally {
      setIsUploadingCloud(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPassword = storeConfig?.adminPassword || 'ESA006##';
    if (passwordInput === targetPassword) {
      setIsAuthenticated(true);
      setPasswordInput('');
      setAuthError('');
      // Auto-sync any local products & categories to cloud on admin login
      syncAllLocalToCloud().then(res => {
        if (onRefreshCloud) onRefreshCloud();
      }).catch(console.error);
    } else {
      setAuthError('Incorrect password. Access denied.');
      setPasswordInput('');
    }
  };

  // Store Controls Management States
  const [storeNameInput, setStoreNameInput] = useState(storeConfig?.storeName || 'KHAN GADGET MALL');
  const [storePhoneInput, setStorePhoneInput] = useState(storeConfig?.phone || '01854774406');
  const [storeAboutInput, setStoreAboutInput] = useState(storeConfig?.about || DEFAULT_STORE_CONFIG.about);
  const [announcementTextInput, setAnnouncementTextInput] = useState(storeConfig?.announcementText ?? DEFAULT_STORE_CONFIG.announcementText ?? '');
  const [announcementEnabledInput, setAnnouncementEnabledInput] = useState(storeConfig?.announcementEnabled !== false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [storeControlsFeedback, setStoreControlsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingStoreControls, setIsSavingStoreControls] = useState(false);

  // Sync inputs if external storeConfig updates from cloud or other device
  React.useEffect(() => {
    if (storeConfig) {
      setStoreNameInput(storeConfig.storeName || 'KHAN GADGET MALL');
      setStorePhoneInput(storeConfig.phone || '01854774406');
      setStoreAboutInput(storeConfig.about || DEFAULT_STORE_CONFIG.about);
      setAnnouncementTextInput(storeConfig.announcementText ?? DEFAULT_STORE_CONFIG.announcementText ?? '');
      setAnnouncementEnabledInput(storeConfig.announcementEnabled !== false);
    }
  }, [storeConfig?.storeName, storeConfig?.phone, storeConfig?.about, storeConfig?.announcementText, storeConfig?.announcementEnabled]);

  const handleSaveStoreControls = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeNameInput.trim()) {
      setStoreControlsFeedback({ type: 'error', message: 'স্টোরের নাম খালি রাখা যাবে না।' });
      return;
    }
    if (!storePhoneInput.trim()) {
      setStoreControlsFeedback({ type: 'error', message: 'যোগাযোগ ও হোয়াটসঅ্যাপ নম্বর খালি রাখা যাবে না।' });
      return;
    }

    const payload: Partial<StoreConfig> = {
      storeName: storeNameInput.trim(),
      phone: storePhoneInput.trim(),
      about: storeAboutInput.trim(),
      announcementText: announcementTextInput.trim(),
      announcementEnabled: announcementEnabledInput
    };

    if (newAdminPassword.trim()) {
      if (newAdminPassword.trim().length < 4) {
        setStoreControlsFeedback({ type: 'error', message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
        return;
      }
      if (newAdminPassword.trim() !== confirmAdminPassword.trim()) {
        setStoreControlsFeedback({ type: 'error', message: 'কনফার্ম পাসওয়ার্ড মিলছে না। দয়া করে পুনরায় চেক করুন।' });
        return;
      }
      payload.adminPassword = newAdminPassword.trim();
    }

    setIsSavingStoreControls(true);
    setStoreControlsFeedback(null);

    try {
      if (onUpdateStoreConfig) {
        await onUpdateStoreConfig(payload);
      }
      setStoreControlsFeedback({
        type: 'success',
        message: 'স্টোরের নাম, ফোন, বিবরণ ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে এবং সকল ডিভাইসে রিয়েল-টাইমে লাইভ হয়ে গেছে!'
      });
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      setTimeout(() => {
        setStoreControlsFeedback(null);
      }, 6000);
    } catch (err: any) {
      setStoreControlsFeedback({
        type: 'error',
        message: err?.message || 'সংরক্ষণ ব্যর্থ হয়েছে।'
      });
    } finally {
      setIsSavingStoreControls(false);
    }
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'products' | 'categories' | 'orders' | 'vouchers' | 'settings'>('dashboard');

  // Category Management & Filtering States
  const [selectedProductCategoryFilter, setSelectedProductCategoryFilter] = useState<string>('All');
  const [isInlineCategoryAddOpen, setIsInlineCategoryAddOpen] = useState(false);
  const [inlineCategoryInput, setInlineCategoryInput] = useState('');

  const handleSaveInlineCategory = async () => {
    const trimmed = inlineCategoryInput.trim();
    if (!trimmed) return;
    if (onAddCategory && !availableCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      await onAddCategory(trimmed);
    }
    setProductForm(prev => ({ ...prev, category: trimmed as ProductCategory }));
    setIsInlineCategoryAddOpen(false);
    setInlineCategoryInput('');
  };

  // Product Management States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'Chargers & Cables',
    brand: 'Anker',
    price: 1999,
    originalPrice: 2999,
    stock: 20,
    image: '',
    description: '',
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: false
  });
  const [productSearch, setProductSearch] = useState('');

  // 4 Pictures State (Slot 0 is Main Cover, Slots 1, 2, 3 are Additional Gallery Photos)
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activeSlotForUpload, setActiveSlotForUpload] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInputText, setUrlInputText] = useState('');

  const processImageFiles = async (files: File[], targetSlot: number | null = null) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setUploadError('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }
    setUploadError('');
    setIsUploadingImage(true);

    try {
      if (targetSlot !== null) {
        // Targeted slot upload (replace or set specific photo 1, 2, 3, or 4)
        const file = validFiles[0];
        setUploadProgressText(`Optimizing picture for Slot ${targetSlot + 1}...`);
        const dataUrl = await compressImage(file, 650, 650, 0.72);
        
        setProductImages(prev => {
          const next = [...prev];
          while (next.length <= targetSlot) {
            next.push('');
          }
          next[targetSlot] = dataUrl;
          return next.filter(Boolean).slice(0, 4);
        });
      } else {
        // Bulk upload: fill empty slots up to 4 total photos
        const remainingCapacity = 4 - productImages.length;
        if (remainingCapacity <= 0) {
          setUploadError('Maximum 4 photos already added. Delete or change an existing photo.');
          setIsUploadingImage(false);
          return;
        }

        const filesToProcess = validFiles.slice(0, remainingCapacity);
        const processedUrls: string[] = [];

        for (let i = 0; i < filesToProcess.length; i++) {
          setUploadProgressText(`Optimizing picture ${i + 1} of ${filesToProcess.length}...`);
          const dataUrl = await compressImage(filesToProcess[i], 650, 650, 0.72);
          processedUrls.push(dataUrl);
        }

        setProductImages(prev => [...prev, ...processedUrls].slice(0, 4));
      }
    } catch (err) {
      console.error('Error processing uploaded image files:', err);
      setUploadError('Failed to process image file(s). Please try again.');
    } finally {
      setIsUploadingImage(false);
      setUploadProgressText('');
      setActiveSlotForUpload(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFiles(Array.from(files), activeSlotForUpload);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFiles(Array.from(files), null);
    }
  };

  const handleTriggerSlotUpload = (slotIndex: number) => {
    setActiveSlotForUpload(slotIndex);
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleTriggerBulkUpload = () => {
    setActiveSlotForUpload(null);
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    setProductImages(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const handleAddUrl = () => {
    const trimmed = urlInputText.trim();
    if (!trimmed) return;
    if (productImages.length >= 4) {
      setUploadError('Maximum 4 pictures allowed per product.');
      return;
    }
    setUploadError('');
    setProductImages(prev => [...prev, trimmed].slice(0, 4));
    setUrlInputText('');
  };

  // Order Management States
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [orderForInvoice, setOrderForInvoice] = useState<Order | null>(null);
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

  // Delete confirmation modals
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);

  if (!isOpen) return null;

  // KPI calculations
  // User mandate: Confirmed Sales Amount ONLY adds up orders when marked as 'Delivered'!
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = deliveredOrders.length;
  const inTransitOrders = orders.filter(o => ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.status));
  const inTransitRevenue = inTransitOrders.reduce((sum, o) => sum + o.total, 0);
  const inTransitCount = inTransitOrders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const pendingCount = pendingOrders.length;
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const totalVisits = Math.max(BASE_VISITOR_COUNT, visitorStats?.totalVisits || getStoredVisitorCount() || BASE_VISITOR_COUNT);
  const uniqueVisitors = Math.max(BASE_VISITOR_COUNT, visitorStats?.uniqueVisitors || BASE_VISITOR_COUNT);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setImageInputMode('upload');
    setUploadError('');
    setUploadProgressText('');
    setActiveSlotForUpload(null);
    setProductImages([]);
    setUrlInputText('');
    setProductForm({
      title: '',
      category: 'Chargers & Cables',
      brand: 'Khan Prime',
      price: 1500,
      originalPrice: 2500,
      stock: 25,
      rating: 4.8,
      reviewCount: 15,
      image: '',
      additionalImages: [],
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
    setImageInputMode('upload');
    setUploadError('');
    setUploadProgressText('');
    setActiveSlotForUpload(null);
    const existing = [prod.image, ...(prod.additionalImages || [])].filter(Boolean);
    setProductImages(existing.slice(0, 4));
    setUrlInputText('');
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;
    setIsSubmittingProduct(true);

    const finalMainImage = productImages[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';
    const finalAdditionalImages = productImages.slice(1, 4).filter(Boolean);

    try {
      if (editingProduct) {
        const updated: Product = {
          ...editingProduct,
          ...productForm as Product,
          image: finalMainImage,
          additionalImages: finalAdditionalImages
        };
        await onUpdateProduct(updated);
      } else {
        const newProd: Product = {
          id: 'kg-prod-' + Date.now(),
          createdAt: new Date().toISOString(),
          title: productForm.title || 'New Accessory',
          category: (productForm.category || 'Chargers & Cables') as ProductCategory,
          brand: productForm.brand || 'Khan Prime',
          price: Number(productForm.price) || 999,
          originalPrice: Number(productForm.originalPrice) || 1499,
          stock: Number(productForm.stock) || 10,
          rating: 4.9,
          reviewCount: 1,
          image: finalMainImage,
          additionalImages: finalAdditionalImages,
          description: productForm.description || 'Premium mobile accessory.',
          specs: productForm.specs || { 'Warranty': '12 Months' },
          isFlashSale: !!productForm.isFlashSale,
          isDarazMall: !!productForm.isDarazMall,
          freeDelivery: !!productForm.freeDelivery
        };
        await onAddProduct(newProd);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error('Failed saving product:', err);
    } finally {
      setIsSubmittingProduct(false);
    }
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = 
      selectedProductCategoryFilter === 'All' || 
      p.category.toLowerCase() === selectedProductCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
                <h3 className="font-black text-sm text-white tracking-tight">AP</h3>
                <p className="text-[10px] text-slate-400">{storeConfig?.storeName || 'KHAN GADGET MALL'} Security System</p>
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
              <span>AP LOGIN</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {storeConfig?.storeName || 'KHAN GADGET MALL'} Security System
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
                <h2 className="font-black text-white text-base sm:text-lg">{storeConfig?.storeName || 'KHAN GADGET MALL'} - AP</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED SESSION
                </span>
              </div>
              <p className="text-xs text-gray-400">Inventory & Order Dispatch Console</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerCloudUpload}
              disabled={isUploadingCloud || isSyncing}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-semibold disabled:opacity-50 shadow-xs"
              title="Upload & Sync All Categories & Products to Cloud (অন্যান্য ডিভাইসে পাঠাতে ক্লাউড আপডেট করুন)"
            >
              <Upload className={`w-3.5 h-3.5 ${isUploadingCloud ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isUploadingCloud ? 'Uploading...' : 'Upload to Cloud'}</span>
            </button>

            {onRefreshCloud && (
              <button
                onClick={onRefreshCloud}
                disabled={isSyncing}
                className="text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-semibold disabled:opacity-50"
                title="Live Cloud Database Sync (অন্যান্য ডিভাইসের ডেটা আনুন)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Cloud Sync'}</span>
              </button>
            )}

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
            { id: 'analysis', label: 'Analysis & Sales', icon: BarChart3 },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${availableCategories.length})`, icon: FolderTree },
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

        {cloudSyncFeedback && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>{cloudSyncFeedback}</span>
            </div>
            <button onClick={() => setCloudSyncFeedback(null)} className="text-emerald-100 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          
          {/* TAB 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">আদায়কৃত মোট বিক্রয়</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{formatPrice(deliveredRevenue)}</div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {deliveredCount} টি অর্ডার ডেলিভার্ড • Delivered Only
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#f85606]">মোট ভিজিটর / ব্যবহারকারী</span>
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f85606] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{totalVisits.toLocaleString('en-BD')}</div>
                  <p className="text-[11px] text-[#f85606] font-semibold mt-1">
                    প্রতিবার ভিজিটে যোগ হচ্ছে ({uniqueVisitors} ইউনিক)
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">ইন-ট্রানজিট পাইপলাইন</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{formatPrice(inTransitRevenue)}</div>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">
                    {inTransitCount} টি অর্ডার ট্রানজিটে • ডেলিভারির অপেক্ষায়
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">মোট অর্ডার ও স্টক</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{orders.length} টি অর্ডার</div>
                  <p className="text-[11px] text-purple-600 font-semibold mt-1">
                    {pendingCount} টি নতুন • লো স্টক অ্যালার্ট: {lowStockCount} টি
                  </p>
                </div>
              </div>

              {/* Quick Link Banner to Analysis Tab */}
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      বিস্তারিত সেলস ও ভিজিটর বিশ্লেষণ দেখতে চান?
                    </h4>
                    <p className="text-xs text-gray-600">
                      ডেলিভার্ড হওয়া অর্ডারসমূহের ক্যাটেগরি আয়, সর্বোচ্চ বিক্রিত পণ্য এবং লাইভ ভিজিটর ট্র্যাকিং দেখুন।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span>Analysis ট্যাবে যান</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
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
                      {orders.slice(0, 6).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80">
                          <td className="py-3 font-mono">
                            <span className="font-bold text-gray-900 block">{order.id}</span>
                            <a 
                              href={getCourierTrackingUrl(order.carrierName, order.trackingNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#f85606] hover:text-orange-700 font-mono flex items-center gap-0.5 hover:underline"
                              title="Track with Courier"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>{order.trackingNumber}</span>
                            </a>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-gray-900">{order.shippingAddress.fullName}</div>
                            <div className="text-[11px] text-gray-500 font-mono">{order.shippingAddress.phone}</div>
                            {(order.customerNote || order.shippingAddress.customerNote) && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded mt-0.5">
                                <FileText className="w-2.5 h-2.5" /> Note
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-gray-600">
                            <div>{order.shippingAddress.city}</div>
                            <div className="text-[10px] text-gray-400 max-w-[130px] truncate">{order.shippingAddress.address}</div>
                          </td>
                          <td className="py-3 text-gray-500">{order.items.length} item(s)</td>
                          <td className="py-3 font-bold text-[#f85606]">{formatPrice(order.total)}</td>
                          <td className="py-3">
                            <span className="bg-orange-100 text-[#f85606] px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setOrderForInvoice(order)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded flex items-center gap-1 transition cursor-pointer"
                                title="Print Invoice / Cash Memo"
                              >
                                <Printer className="w-3 h-3 text-slate-600" />
                                <span className="hidden sm:inline">Invoice</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrderForEdit(order);
                                  setNewStatus(order.status);
                                  setCourierName(order.carrierName || 'Daraz Express (DEX)');
                                }}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded shadow-xs transition cursor-pointer"
                              >
                                Details
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

          {/* TAB 2: Analysis & Sales Performance */}
          {activeTab === 'analysis' && (
            <AdminAnalytics
              orders={orders}
              products={products}
              visitorStats={visitorStats || { totalVisits, uniqueVisitors }}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onViewOrdersTab={() => setActiveTab('orders')}
              onRefreshAnalytics={onRefreshAnalytics}
              isSyncing={isSyncing}
            />
          )}

          {/* TAB 3: Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search by title, brand, category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={selectedProductCategoryFilter}
                      onChange={(e) => setSelectedProductCategoryFilter(e.target.value)}
                      className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-2 font-semibold text-gray-700 focus:outline-none focus:border-orange-500"
                    >
                      <option value="All">All Categories</option>
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {selectedProductCategoryFilter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setSelectedProductCategoryFilter('All')}
                        className="text-[11px] text-orange-600 hover:underline font-bold px-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
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
                                type="button"
                                onClick={() => setProductToDelete(prod)}
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

          {/* TAB: Categories Management */}
          {activeTab === 'categories' && (
            <CategoryManager
              categories={availableCategories}
              products={products}
              onAddCategory={onAddCategory}
              onDeleteCategory={onDeleteCategory}
              onRenameCategory={onRenameCategory}
              onViewCategoryProducts={(cat) => {
                setSelectedProductCategoryFilter(cat);
                setActiveTab('products');
              }}
            />
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
                            <a 
                              href={getCourierTrackingUrl(order.carrierName, order.trackingNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#f85606] hover:text-orange-700 font-mono flex items-center gap-0.5 hover:underline"
                              title="Track with Courier"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>{order.trackingNumber}</span>
                            </a>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-gray-900">{order.shippingAddress.fullName}</div>
                            <div className="text-[11px] text-gray-500 font-mono">{order.shippingAddress.phone} • {order.shippingAddress.city}</div>
                            <div className="text-[10px] text-gray-400 max-w-xs truncate">{order.shippingAddress.address}</div>
                            {(order.customerNote || order.shippingAddress.customerNote) && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200">
                                  <FileText className="w-3 h-3 text-amber-600" />
                                  <span className="truncate max-w-[200px]">Note: {order.customerNote || order.shippingAddress.customerNote}</span>
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-gray-800 uppercase text-[11px]">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold block">{order.paymentStatus}</span>
                          </td>
                          <td className="p-3 text-gray-600">
                            {order.items.reduce((acc, it) => acc + it.quantity, 0)} units
                          </td>
                          <td className="p-3 font-black text-[#f85606]">{formatPrice(order.total)}</td>
                          <td className="p-3">
                            <span className="bg-orange-100 text-[#f85606] font-bold px-2.5 py-1 rounded-full text-[10px]">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setOrderForInvoice(order)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                title="Print Invoice / Cash Memo"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-600" />
                                <span className="hidden sm:inline">Invoice</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrderForEdit(order);
                                  setNewStatus(order.status);
                                  setCourierName(order.carrierName || 'Daraz Express (DEX)');
                                }}
                                className="px-3 py-1.5 bg-[#f85606] hover:bg-[#e04a00] text-white rounded-lg font-bold text-xs transition cursor-pointer shadow-xs"
                              >
                                View Details
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
                          type="button"
                          onClick={() => setVoucherToDelete(v.code)}
                          className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
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
            <div className="max-w-4xl space-y-6">
              
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      <span>Live Store Controls</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-Time Cloud Sync
                    </span>
                  </div>
                  <h2 className="text-xl font-black mt-1.5 text-white">
                    স্টোর কন্ট্রোল ও সেটিংস প্যানেল
                  </h2>
                  <p className="text-xs text-gray-300 mt-0.5">
                    স্টোরের নাম, ফোন নম্বর, পরিচিতি ও এডমিন পাসওয়ার্ড পরিবর্তন করুন। যেকোনো পরিবর্তন সাথে সাথে সকল ডিভাইসে রিয়েল-টাইমে আপডেট হবে।
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-right">
                    <span className="text-[10px] text-gray-400 block">Unique Visitors Baseline</span>
                    <span className="text-xs font-mono font-bold text-amber-300">৮,৭৩৪+ Views Started</span>
                  </div>
                </div>
              </div>

              {/* Feedback Alert */}
              {storeControlsFeedback && (
                <div 
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition animate-in fade-in duration-200 ${
                    storeControlsFeedback.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                  }`}
                >
                  {storeControlsFeedback.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{storeControlsFeedback.message}</span>
                </div>
              )}

              {/* Main Controls Form */}
              <form onSubmit={handleSaveStoreControls} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Option 1: Store Name */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#f85606]" />
                        <span>১. স্টোরের নাম (Store Name)</span>
                      </label>
                      <span className="text-[10px] bg-orange-50 text-[#f85606] font-bold px-2 py-0.5 rounded border border-orange-100">
                        Global Brand Title
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={storeNameInput}
                      onChange={(e) => setStoreNameInput(e.target.value)}
                      placeholder="e.g. KHAN GADGET MALL"
                      className="w-full text-sm font-semibold px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f85606] focus:bg-white text-gray-900 transition"
                    />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      💡 এই নাম পরিবর্তন করলে ওয়েবসাইটের হেডার, ফুটার, কার্ট, চালান (Invoice), ট্র্যাকিং ও ব্রাউজার টাইটেলে এই নতুন নাম রিয়েল-টাইমে পরিবর্তিত হয়ে যাবে।
                    </p>
                  </div>

                  {/* Option 2: Store Helpline & WhatsApp Number */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>২. ফোন ও হোয়াটসঅ্যাপ নম্বর (Helpline & WhatsApp)</span>
                      </label>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100">
                        Live Contact
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={storePhoneInput}
                      onChange={(e) => setStorePhoneInput(e.target.value)}
                      placeholder="e.g. 01854774406"
                      className="w-full text-sm font-mono font-semibold px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-gray-900 transition"
                    />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      💡 এই নম্বর এডিট করলে ওয়েবসাইটের কল বাটন, ফুটার হেল্পলাইন এবং সরাসরি হোয়াটসঅ্যাপ অর্ডার ও চ্যাট লিংকে এই নতুন নম্বর আপডেট হয়ে যাবে।
                    </p>
                  </div>

                </div>

                {/* Option 3: About Store Description */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>৩. স্টোর পরিচিতি / বিবরণ (About Section)</span>
                    </label>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-100">
                      Footer & Branding
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={storeAboutInput}
                    onChange={(e) => setStoreAboutInput(e.target.value)}
                    placeholder="Bangladesh's premium mobile accessories mall for fast chargers, MagSafe cases, earbuds, and gaming gear."
                    className="w-full text-xs leading-relaxed px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-gray-900 transition"
                  />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    💡 ওয়েবসাইটের ফুটারে ব্র্যান্ডের পরিচিতি হিসেবে এই বিবরণটি রিয়েল-টাইমে প্রদর্শিত হবে।
                  </p>
                </div>

                {/* Option 4: Admin Password Change */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-bold text-gray-900">৪. এডমিন প্যানেল পাসওয়ার্ড পরিবর্তন (Admin Password Change)</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        সকল ডিভাইসে এডমিন প্যানেলে লগইন করার জন্য কার্যকর হবে। পাসওয়ার্ড পরিবর্তন না করতে চাইলে খালি রাখুন।
                      </p>
                    </div>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-100">
                      Access Security
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        নতুন পাসওয়ার্ড (New Password)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৪ অক্ষর)"
                          className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        কনফার্ম পাসওয়ার্ড (Confirm New Password)
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                        className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {newAdminPassword && confirmAdminPassword && newAdminPassword !== confirmAdminPassword && (
                    <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>পাসওয়ার্ড দুটি মিলছে না!</span>
                    </div>
                  )}
                </div>

                {/* Option 5: Store Announcement Marquee */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#f85606] flex items-center justify-center font-bold shrink-0">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <span>৫. অফার ও প্রমো নোটিশ বার (Store Announcement Marquee)</span>
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          ওয়েবসাইটের শীর্ষে চলমান অফার/নোটিশ টেক্সট প্রদর্শন ও পরিবর্তন করুন।
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[11px] font-semibold text-gray-700">
                        {announcementEnabledInput ? 'নোটিশ চালু' : 'নোটিশ বন্ধ'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAnnouncementEnabledInput(!announcementEnabledInput)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          announcementEnabledInput ? 'bg-[#f85606]' : 'bg-gray-300'
                        }`}
                        role="switch"
                        aria-checked={announcementEnabledInput}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            announcementEnabledInput ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Textarea for Announcement */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block">
                      চলমান অফার টেক্সট (Marquee Offer Text)
                    </label>
                    <textarea
                      rows={2}
                      value={announcementTextInput}
                      onChange={(e) => setAnnouncementTextInput(e.target.value)}
                      placeholder="যেমন: 🔥 আজকের অর্ডারে ১০% ছাড়! প্রোমোকোড: KHAN10 | সারাদেশে ক্যাশ অন ডেলিভারি | ১০০% জেনুইন গ্যাজেট"
                      className="w-full text-xs leading-relaxed px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#f85606] focus:bg-white text-gray-900 transition font-medium"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      দ্রুত ব্যবহারের জন্য প্রস্তুত ফরম্যাট (ক্লিক করলেই বসে যাবে):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setAnnouncementTextInput('🔥 আজকের স্পেশাল অফার: যেকোনো গ্যাজেট অর্ডারে ১০% ইনস্ট্যান্ট ছাড়! প্রোমোকোড: KHAN10 | সারাদেশে ক্যাশ অন ডেলিভারি')}
                        className="px-2.5 py-1 text-[11px] font-medium bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg border border-orange-200 cursor-pointer transition text-left"
                      >
                        🔥 ১০% ছাড় ও ক্যাশ অন ডেলিভারি
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnnouncementTextInput('⚡ স্পেশাল অফার: ২,০০০ টাকার অর্ডারে সারাদেশে সম্পূর্ণ ফ্রি ডেলিভারি! সীমিত সময়ের জন্য')}
                        className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 cursor-pointer transition text-left"
                      >
                        ⚡ ফ্রি ডেলিভারি অফার
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnnouncementTextInput('✨ নতুন অরিজিনাল MagSafe চার্জার, ইয়ারবাডস ও প্রিমিয়াম কভার কালেকশন স্টক ইন! দ্রুত অর্ডার করুন')}
                        className="px-2.5 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 cursor-pointer transition text-left"
                      >
                        ✨ নিউ স্টক ইন নোটিশ
                      </button>
                    </div>
                  </div>

                  {/* Live Marquee Preview */}
                  {announcementEnabledInput && announcementTextInput.trim() && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        লাইভ প্রিভিউ (ওয়েবসাইটের শীর্ষে যেভাবে চলবে):
                      </span>
                      <div className="bg-slate-900 text-amber-300 py-1.5 px-3 rounded-xl overflow-hidden flex items-center gap-2 border border-slate-800 text-xs">
                        <span className="bg-[#f85606] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shrink-0 shadow-xs">
                          HOT OFFER
                        </span>
                        <div className="overflow-hidden relative whitespace-nowrap flex-1">
                          <span className="font-semibold text-white">{announcementTextInput}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Preview Card */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        লাইভ প্রিভিউ (Live Preview)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      ওয়েবসাইটে যা দেখা যাবে
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">
                        Header Brand Name
                      </span>
                      <div className="text-sm font-black text-white truncate">
                        {storeNameInput || 'KHAN GADGET MALL'}
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">
                        Hotline & WhatsApp
                      </span>
                      <div className="text-sm font-mono font-bold text-emerald-400 truncate">
                        {storePhoneInput || '01854774406'}
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">
                        About Description
                      </span>
                      <div className="text-[11px] text-slate-300 line-clamp-2">
                        {storeAboutInput || DEFAULT_STORE_CONFIG.about}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Save Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>সংরক্ষণ করলে ক্লাউড ডেটাবেজের মাধ্যমে মোবাইল, ল্যাপটপসহ সকল ডিভাইসে তাৎক্ষণিকভাবে লাইভ হবে।</span>
                  </span>

                  <button
                    type="submit"
                    disabled={isSavingStoreControls}
                    className="w-full sm:w-auto px-6 py-3 bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSavingStoreControls ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>আপডেট ও সিঙ্ক হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>সংরক্ষণ ও লাইভ সিঙ্ক করুন (Save Store Controls)</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Dynamic Categories Quick Link & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-[#f85606]" />
                      <span className="font-bold text-gray-900">Active Categories ({availableCategories.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="text-[11px] font-bold text-[#f85606] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Categories</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCategories.map((c) => (
                      <span 
                        key={c}
                        className="bg-white border border-gray-200 text-gray-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 text-xs space-y-1.5">
                  <span className="font-bold text-gray-900 block">Warehouse & Logistics Hub</span>
                  <p className="text-gray-600">
                    Central Distribution: Motijheel Commercial Area, Dhaka, Bangladesh.
                  </p>
                  <p className="text-gray-600">
                    Integrated Logistics: Steadfast Courier, Pathao Express, RedX Logistics, Paperfly, Sundarban Courier.
                  </p>
                </div>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-gray-700 block">Category *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInlineCategoryAddOpen(!isInlineCategoryAddOpen);
                          setInlineCategoryInput('');
                        }}
                        className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{isInlineCategoryAddOpen ? 'Cancel' : '+ New'}</span>
                      </button>
                    </div>

                    {isInlineCategoryAddOpen ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={inlineCategoryInput}
                          onChange={(e) => setInlineCategoryInput(e.target.value)}
                          placeholder="New category..."
                          className="w-full px-2 py-1.5 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveInlineCategory();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSaveInlineCategory}
                          className="px-2.5 py-1.5 bg-orange-600 text-white rounded-lg font-bold text-[10px] shrink-0 hover:bg-orange-700 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        {availableCategories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        {productForm.category && !availableCategories.includes(productForm.category) && (
                          <option value={productForm.category}>{productForm.category}</option>
                        )}
                      </select>
                    )}
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
                    <label className="font-semibold text-gray-700 block mb-1">Price (BDT / ৳) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Original Price (BDT / ৳)</label>
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

                {/* Product Photo Upload / Selector */}
                {/* 4 Product Photos Upload & Gallery Management */}
                <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-[#f85606]" />
                        <span>Product Pictures (৪টি ছবি আপলোড করুন)</span>
                        <span className="bg-orange-100 text-[#f85606] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {productImages.length} / 4
                        </span>
                      </label>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ১ম ছবিটি প্রধান কভার ছবি (Cover Photo), বাকি ৩টি ছবি ডিটেইল গ্যালারি হিসেবে দেখাবে।
                      </p>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('upload');
                          setUploadError('');
                        }}
                        className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer ${
                          imageInputMode === 'upload' 
                            ? 'bg-white text-orange-600 shadow-xs' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload (ফাইল)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('url');
                          setUploadError('');
                        }}
                        className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer ${
                          imageInputMode === 'url' 
                            ? 'bg-white text-orange-600 shadow-xs' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <LinkIcon className="w-2.5 h-2.5" />
                        <span>Web URL (লিংক)</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden native multi-file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  {/* 4 Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const img = productImages[slotIdx];
                      const isCover = slotIdx === 0;

                      return (
                        <div 
                          key={slotIdx}
                          className={`relative rounded-xl border transition flex flex-col items-center justify-between p-2 min-h-[135px] ${
                            img 
                              ? isCover 
                                ? 'border-orange-400 bg-orange-50/40' 
                                : 'border-gray-200 bg-white shadow-2xs'
                              : 'border-dashed border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50/20'
                          }`}
                        >
                          {img ? (
                            <>
                              {/* Slot Badge */}
                              <div className="w-full flex items-center justify-between mb-1.5">
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  isCover 
                                    ? 'bg-[#f85606] text-white shadow-2xs' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {isCover ? '★ Cover (১ম)' : `Photo ${slotIdx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(slotIdx)}
                                  className="w-5 h-5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition cursor-pointer"
                                  title="Remove this photo"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              {/* Thumbnail */}
                              <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 p-1 flex items-center justify-center overflow-hidden my-auto">
                                <img
                                  src={img}
                                  alt={`Slot ${slotIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </div>

                              {/* Bottom Actions */}
                              <div className="w-full flex items-center justify-center gap-1 mt-1.5 pt-1 border-t border-gray-100">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCover(slotIdx)}
                                    className="text-[9px] font-bold text-orange-600 hover:underline px-1 py-0.5 rounded cursor-pointer"
                                    title="Make this photo the primary cover"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleTriggerSlotUpload(slotIdx)}
                                  className="text-[9px] font-bold text-gray-600 hover:text-gray-900 px-1 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </button>
                              </div>
                            </>
                          ) : (
                            <div 
                              onClick={() => handleTriggerSlotUpload(slotIdx)}
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-3 text-center"
                            >
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-1.5 shadow-2xs">
                                <Plus className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold text-gray-800">
                                {isCover ? 'Cover Photo' : `Photo ${slotIdx + 1}`}
                              </span>
                              <span className="text-[9px] text-gray-600">
                                {isCover ? '(প্রধান ছবি)' : '(ছবি যোগ করুন)'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bulk Upload / Drop Zone when less than 4 */}
                  {imageInputMode === 'upload' && productImages.length < 4 && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleTriggerBulkUpload}
                      className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-2.5 ${
                        isDraggingOver 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-orange-200 bg-white hover:bg-orange-50/40'
                      }`}
                    >
                      {isUploadingImage ? (
                        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold py-1">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{uploadProgressText || 'Compressing & uploading pictures...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-xs text-gray-800 block">
                              Click to select up to {4 - productImages.length} pictures at once (বা ড্র্যাগ করুন)
                            </span>
                            <span className="text-[10px] text-gray-600 block">
                              মোবাইল গ্যালারি বা পিসি থেকে একসাথে একাধিক ছবি বেছে নিন
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL Input Mode */}
                  {imageInputMode === 'url' && (
                    <div className="space-y-2 bg-white p-2.5 rounded-xl border border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste image link (e.g. https://...)"
                          value={urlInputText}
                          onChange={(e) => setUrlInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddUrl();
                            }
                          }}
                          className="flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:border-orange-500 text-xs"
                        />
                        <button
                          type="button"
                          disabled={productImages.length >= 4 || !urlInputText.trim()}
                          onClick={handleAddUrl}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add URL</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-600">
                        ওয়েবের যেকোনো ছবির লিংক দিয়ে ৪টি ছবি পর্যন্ত যোগ করতে পারবেন।
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
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
                    disabled={isSubmittingProduct}
                    className="px-5 py-2 bg-[#f85606] text-white rounded-lg font-bold hover:bg-[#e04a00] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingProduct ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Saving to Cloud...</span>
                      </>
                    ) : (
                      <span>Save Accessory</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Full Order Details & Dispatch Management */}
        {selectedOrderForEdit && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-base">
                        Order Details: <span className="font-mono text-orange-400">{selectedOrderForEdit.id}</span>
                      </h3>
                      <span className="bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 rounded text-[10px] border border-orange-500/30">
                        {selectedOrderForEdit.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Tracking: {selectedOrderForEdit.trackingNumber} • {new Date(selectedOrderForEdit.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Print Invoice Button */}
                  <button
                    type="button"
                    onClick={() => setOrderForInvoice(selectedOrderForEdit)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice (চালান)</span>
                  </button>

                  {/* Courier Partner External Tracking */}
                  <a
                    href={getCourierTrackingUrl(selectedOrderForEdit.carrierName, selectedOrderForEdit.trackingNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Track on Courier</span>
                  </a>

                  <button 
                    onClick={() => setSelectedOrderForEdit(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                
                {/* 1. Customer & Delivery Information */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-orange-600" />
                      <span>Customer & Delivery Details (কাস্টমার তথ্য)</span>
                    </h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      {selectedOrderForEdit.shippingAddress.addressType || 'Home Delivery'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Customer Name</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedOrderForEdit.shippingAddress.fullName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone Number</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedOrderForEdit.shippingAddress.phone}</span>
                        <a 
                          href={`tel:${selectedOrderForEdit.shippingAddress.phone}`}
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center gap-1 transition"
                          title="Call Customer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <a 
                          href={`https://wa.me/88${selectedOrderForEdit.shippingAddress.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">City</span>
                      <span className="font-semibold text-slate-800">{selectedOrderForEdit.shippingAddress.city}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Full Delivery Address</span>
                      <span className="font-medium text-slate-800">{selectedOrderForEdit.shippingAddress.address}</span>
                    </div>
                  </div>

                  {/* Customer Note Highlight Box */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                        <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Customer Note (কাস্টমার স্পেশাল নোট):</span>
                      </div>
                      {selectedOrderForEdit.customerNote || selectedOrderForEdit.shippingAddress.customerNote ? (
                        <p className="text-xs text-amber-950 font-semibold italic bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          "{selectedOrderForEdit.customerNote || selectedOrderForEdit.shippingAddress.customerNote}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-amber-700 italic">
                          No special instructions entered by customer.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Purchased Products Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="font-black text-gray-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-orange-600" />
                      <span>Order Items ({selectedOrderForEdit.items.reduce((s, i) => s + i.quantity, 0)} Units)</span>
                    </h4>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5">Unit Price</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrderForEdit.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2.5 flex items-center gap-2.5">
                            <img 
                              src={it.product.image} 
                              alt={it.product.title} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{it.product.title}</div>
                              <div className="text-[10px] text-gray-400">
                                Brand: {it.product.brand} • Category: {it.product.category}
                                {it.selectedVariants && Object.keys(it.selectedVariants).length > 0 && (
                                  <span> • {Object.entries(it.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-2.5 font-medium text-gray-600">{formatPrice(it.priceAtPurchase)}</td>
                          <td className="p-2.5 font-bold text-gray-900">{it.quantity}</td>
                          <td className="p-2.5 font-bold text-gray-900 text-right">{formatPrice(it.priceAtPurchase * it.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. Payment & Bill Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Payment Method</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">Method:</span>
                      <span className="font-black text-emerald-800 uppercase">Cash on Delivery (COD)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">Status:</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {selectedOrderForEdit.paymentStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pt-1 border-t border-emerald-200">
                      Rider must collect cash upon delivering the parcel to the customer.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrderForEdit.subtotal)}</span>
                    </div>
                    {selectedOrderForEdit.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Voucher Discount ({selectedOrderForEdit.appliedVoucher}):</span>
                        <span>-{formatPrice(selectedOrderForEdit.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee:</span>
                      <span>{selectedOrderForEdit.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrderForEdit.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount to Collect:</span>
                      <span className="text-[#f85606] text-base">{formatPrice(selectedOrderForEdit.total)}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Update Status & Dispatch Form */}
                <form onSubmit={handleSaveOrderStatus} className="bg-orange-50/40 border border-orange-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-black text-gray-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-600" />
                    <span>Update Order Status & Dispatch Log</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Update Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                      >
                        <option value="Confirmed">Confirmed (Order Accepted)</option>
                        <option value="Processing">Processing / Quality Check & Packing</option>
                        <option value="Shipped">Shipped to Sorting Center</option>
                        <option value="Out for Delivery">Out for Delivery (Rider Dispatched)</option>
                        <option value="Delivered">Delivered & Signed (Payment Received)</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Courier Partner</label>
                      <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                      >
                        <option value="Steadfast Courier">Steadfast Courier</option>
                        <option value="RedX Logistics">RedX Logistics</option>
                        <option value="Pathao Express">Pathao Express</option>
                        <option value="Paperfly">Paperfly</option>
                        <option value="Sundarban Courier">Sundarban Courier</option>
                        <option value="Daraz Express (DEX)">Daraz Express (DEX)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Tracking Update Note (Visible to customer in live tracking)
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Dispatched from main fulfillment hub via express courier..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-orange-200/70">
                    <p className="text-[10px] text-gray-500 italic">
                      Updating will instantly log this checkpoint to customer live tracking.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForEdit(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#f85606] hover:bg-[#e04a00] text-white rounded-lg font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Update Order Status</span>
                      </button>
                    </div>
                  </div>
                </form>

              </div>
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
                      <option value="fixed">Fixed Amount (৳)</option>
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
                  <label className="font-semibold text-gray-700 block mb-1">Minimum Spend (৳)</label>
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

        {/* MODAL: Confirmation for Deleting Product */}
        {productToDelete && (
          <div 
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setProductToDelete(null)}
          >
            <div 
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-gray-100 text-center animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Delete Product Permanently?</h3>
              <p className="text-xs text-gray-600 mb-2">
                Are you sure you want to remove <strong className="text-gray-900">"{productToDelete.title}"</strong> from the store?
              </p>
              <p className="text-[11px] text-rose-600 bg-rose-50 px-2 py-1 rounded mb-4 font-medium">
                ⚠️ It will be permanently removed and will NOT reappear automatically.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDeletingProduct}
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeletingProduct}
                  onClick={async () => {
                    setIsDeletingProduct(true);
                    try {
                      await onDeleteProduct(productToDelete.id);
                    } finally {
                      setIsDeletingProduct(false);
                      setProductToDelete(null);
                    }
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isDeletingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting from Cloud...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Confirmation for Deleting Voucher */}
        {voucherToDelete && (
          <div 
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setVoucherToDelete(null)}
          >
            <div 
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-gray-100 text-center animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Delete Coupon?</h3>
              <p className="text-xs text-gray-600 mb-4">
                Remove voucher coupon code <strong className="font-mono text-gray-900">{voucherToDelete}</strong>?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVoucherToDelete(null)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                  <button
                  type="button"
                  onClick={() => {
                    onDeleteVoucher(voucherToDelete);
                    setVoucherToDelete(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-sm cursor-pointer"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Official Printable PDF Invoice Modal */}
        <InvoiceModal
          isOpen={Boolean(orderForInvoice)}
          onClose={() => setOrderForInvoice(null)}
          order={orderForInvoice}
        />

      </div>
    </div>
  );
};
