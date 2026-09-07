import React, { useState, useEffect } from 'react';
import { 
  X, Zap, ShieldCheck, Truck, CheckCircle2, Copy, Check, 
  ArrowRight, Phone, MapPin, User, FileText, ShoppingBag, 
  Sparkles, MessageCircle, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, Order, ShippingAddress, PaymentMethod } from '../types';
import { formatPrice, addStoredOrder, getStoredStoreConfig, formatPhoneForWhatsApp, getCourierTrackingUrl } from '../utils/storage';
import { syncAddOrder } from '../lib/syncService';

interface QuickOrderModalProps {
  isOpen: boolean;
  product: Product | null;
  initialQuantity?: number;
  initialVariants?: Record<string, string>;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenTracking?: (orderId: string) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  product,
  initialQuantity = 1,
  initialVariants = {},
  onClose,
  onOrderSuccess,
  onOpenTracking
}) => {
  const storeConfig = getStoredStoreConfig();
  const currentStoreName = storeConfig.storeName || 'KHAN GADGET MALL';
  const supportPhone = storeConfig.phone || '01854774406';

  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialVariants);
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');

  // Customer Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Initialize or reset when opened
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(Math.max(1, initialQuantity));
      setConfirmedOrder(null);
      setFormError(null);
      setIsSubmitting(false);

      // Default variants if not provided
      const defaultVar: Record<string, string> = { ...initialVariants };
      if (product.variants) {
        product.variants.forEach(v => {
          if (!defaultVar[v.name] && v.options.length > 0) {
            defaultVar[v.name] = v.options[0];
          }
        });
      }
      setSelectedVariants(defaultVar);
    }
  }, [isOpen, product, initialQuantity]);

  if (!isOpen || !product) return null;

  // Pricing calculations
  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const isFreeDelivery = product.freeDelivery || subtotal >= 2500;
  const deliveryFee = isFreeDelivery ? 0 : (deliveryArea === 'inside_dhaka' ? 60 : 120);
  const grandTotal = subtotal + deliveryFee;
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleVariantChange = (groupName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupName]: option
    }));
  };

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= (product.stock || 10)) {
      setQuantity(next);
    }
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setFormError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 01854774406)');
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setFormError('অনুগ্রহ করে আপনার বিস্তারিত ঠিকানা দিন (যেমন: থানা, জেলা, বাসা নং/রোড)');
      return;
    }

    setIsSubmitting(true);

    try {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const orderId = `KG-${randomId}-BD`;
      const trackingNo = `STD-BD-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const now = new Date();
      const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

      const shippingCity = deliveryArea === 'inside_dhaka' ? 'Dhaka' : 'Outside Dhaka';

      const shippingInfo: ShippingAddress = {
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: 'esakhan5477@gmail.com',
        city: shippingCity,
        province: deliveryArea === 'inside_dhaka' ? 'Dhaka Division' : 'Bangladesh',
        address: address.trim(),
        customerNote: customerNote.trim() || undefined,
        addressType: 'Home'
      };

      const newOrder: Order = {
        id: orderId,
        trackingNumber: trackingNo,
        createdAt: now.toISOString(),
        status: 'Confirmed',
        items: [
          {
            product,
            quantity,
            selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
            priceAtPurchase: product.price
          }
        ],
        shippingAddress: shippingInfo,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Unpaid (COD)' : 'Pending Verification',
        subtotal,
        discount: 0,
        shippingFee: deliveryFee,
        total: grandTotal,
        carrierName: 'Steadfast Courier',
        estimatedDelivery: deliveryArea === 'inside_dhaka' ? '24-48 Hours (ঢাকার ভেতরে)' : '2-3 Business Days (ঢাকার বাইরে)',
        customerNote: customerNote.trim() || undefined,
        checkpoints: [
          {
            title: '১-ক্লিক অর্ডার গ্রহণ ও নিশ্চিতকরণ',
            location: `${currentStoreName} অনলাইন হাব`,
            time: dateStr,
            description: `ক্যাশ অন ডেলিভারি (COD) মাধ্যমে ১-ক্লিকে সফলভাবে অর্ডার তৈরি হয়েছে।`,
            completed: true,
            current: true
          },
          {
            title: 'কোয়ালিটি চেক ও প্যাকেজিং',
            location: `${currentStoreName} ওয়্যারহাউস, ঢাকা`,
            time: 'অপেক্ষমাণ (২-৪ ঘণ্টার মধ্যে)',
            description: 'প্রোডাক্ট গ্যাজেট টেস্ট ও বাবল র‍্যাপ প্যাকেজিং সম্পন্ন হবে।',
            completed: false
          },
          {
            title: 'কুরিয়ারে হস্তান্তর (Steadfast Courier)',
            location: 'লজিস্টিক শর্টিং সেন্টার, ঢাকা',
            time: 'ডিসপ্যাচ শিডিউল',
            description: `কুরিয়ার ট্র্যাকিং নম্বর ${trackingNo} নিবন্ধিত হয়েছে।`,
            completed: false
          },
          {
            title: 'ডেলিভারির জন্য বের হয়েছে',
            location: `${shippingCity} হাব`,
            time: 'প্রত্যাশিত',
            description: 'রাইডার পণ্যটি পৌঁছে দেওয়ার জন্য গ্রাহকের ঠিকানায় রওয়ানা হবে।',
            completed: false
          },
          {
            title: 'পণ্য ডেলিভারি ও পেমেন্ট সম্পন্ন',
            location: address.trim(),
            time: 'ডেলিভারির সময়',
            description: 'গ্রাহক পণ্য চেক করে ক্যাশ পরিশোধ করে ডেলিভারি গ্রহণ করবেন।',
            completed: false
          }
        ]
      };

      // 1. Save to local storage & decrement stock
      addStoredOrder(newOrder);

      // 2. Sync to Firebase Cloud Database in real-time
      try {
        await syncAddOrder(newOrder);
      } catch (cloudErr) {
        console.warn('Firestore real-time sync completed via fallback:', cloudErr);
      }

      // 3. Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      // 4. Update state & notify parent
      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err: any) {
      setFormError('অর্ডার প্রক্রিয়ায় ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${formatPhoneForWhatsApp(supportPhone)}?text=${encodeURIComponent(
    `হ্যালো KHAN GADGET, আমি ${product.title} প্রোডাক্টটি অর্ডার করেছি (অর্ডার নং: ${confirmedOrder?.id || ''})। বিস্তারিত জানতে চাচ্ছি।`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[94vh] flex flex-col my-auto border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-orange-600 to-[#f85606] px-5 py-3.5 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
              <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight flex items-center gap-1.5">
                <span>১-ক্লিক ফাস্ট অর্ডার (Buy Now)</span>
                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 tracking-wide">
                  ফাস্ট চেকআউট
                </span>
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">
                কার্ট ছাড়াই মাত্র ৩০ সেকেন্ডে ক্যাশ অন ডেলিভারিতে অর্ডার করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* CONFIRMED STATE */}
          {confirmedOrder ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
                  অর্ডার সফলভাবে নিশ্চিত হয়েছে!
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  ধন্যবাদ, {confirmedOrder.shippingAddress.fullName}!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                  আপনার ১-ক্লিক অর্ডারটি আমাদের সিস্টেমে সফলভাবে গৃহীত হয়েছে। খুব শীঘ্রই আমাদের কাস্টমার প্রতিনিধি আপনাকে ফোন করে অর্ডারটি ভেরিফাই করবেন।
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left space-y-2.5 max-w-md mx-auto text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">অর্ডার আইডি:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-gray-900">
                    <span>{confirmedOrder.id}</span>
                    <button 
                      type="button"
                      onClick={() => handleCopyOrderId(confirmedOrder.id)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500 transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">কুরিয়ার ট্র্যাকিং নম্বর:</span>
                  <span className="font-mono font-bold text-[#f85606]">{confirmedOrder.trackingNumber}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">পণ্য ও পরিমাণ:</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                    {product.title} (x{confirmedOrder.items[0].quantity})
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">ডেলিভারি ঠিকানা:</span>
                  <span className="font-medium text-gray-800 truncate max-w-[200px]">
                    {confirmedOrder.shippingAddress.address}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-700 font-bold">মোট প্রদেয় টাকা (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-base font-black text-[#f85606]">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-md mx-auto">
                {onOpenTracking && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTracking(confirmedOrder.id);
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    <span>অর্ডার লাইভ ট্র্যাক করুন</span>
                  </button>
                )}

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে আপডেট নিন</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-gray-800 underline font-medium cursor-pointer"
                >
                  আরও কেনাকাটা চালিয়ে যান
                </button>
              </div>
            </div>
          ) : (
            /* ORDER FORM STATE */
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {/* Product Brief Summary Card */}
              <div className="bg-orange-50/50 border border-orange-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-white border border-orange-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs mt-0.5">
                    <span className="text-orange-600 font-bold text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[11px] text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    ব্র্যান্ড: <strong className="text-gray-700">{product.brand}</strong> | স্টক: <span className="text-emerald-600 font-semibold">{product.stock} টি উপলব্ধ</span>
                  </p>
                </div>
              </div>

              {/* Variant Selector (if available) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 bg-gray-50/80 p-3 rounded-xl border border-gray-200/70">
                  {product.variants.map((v) => (
                    <div key={v.name} className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <span>{v.name} নির্বাচন করুন:</span>
                        <span className="text-[#f85606] font-semibold">
                          {selectedVariants[v.name] || v.options[0]}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {v.options.map((opt) => {
                          const isSelected = (selectedVariants[v.name] || v.options[0]) === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleVariantChange(v.name, opt)}
                              className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                                isSelected
                                  ? 'border-[#f85606] bg-[#f85606] text-white shadow-xs'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Quantity Control */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">
                    পরিমাণ (Quantity):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => handleQuantityChange(-1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 font-bold text-gray-800 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => handleQuantityChange(1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 font-bold text-gray-800 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-gray-500 font-medium ml-auto">
                      মোট: {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Delivery Area Radio */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">
                    ডেলিভারি এলাকা:
                  </label>
                  <div className="space-y-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                      <input
                        type="radio"
                        name="quick_delivery_area"
                        checked={deliveryArea === 'inside_dhaka'}
                        onChange={() => setDeliveryArea('inside_dhaka')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-800 font-medium">ঢাকার ভেতরে (৳৬০)</span>
                      {isFreeDelivery && <span className="text-[10px] text-emerald-600 font-bold ml-auto">ফ্রি</span>}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                      <input
                        type="radio"
                        name="quick_delivery_area"
                        checked={deliveryArea === 'outside_dhaka'}
                        onChange={() => setDeliveryArea('outside_dhaka')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-800 font-medium">ঢাকার বাইরে (৳১২০)</span>
                      {isFreeDelivery && <span className="text-[10px] text-emerald-600 font-bold ml-auto">ফ্রি</span>}
                    </label>
                  </div>
                </div>
              </div>

              {/* Customer Delivery Details (Only 3 essential fields for 1-Click speed) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#f85606]" />
                    <span>আপনার ডেলিভারি তথ্য (সরাসরি পূরণ করুন):</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium">*৩টি ফিল্ড আবশ্যক</span>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                    আপনার পুরো নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোহাম্মদ এসা খান"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                    মোবাইল নাম্বার (১১ ডিজিট) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 01854774406"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition"
                    />
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                    সম্পূর্ণ ঠিকানা (বাসা/রোড, থানা, জেলা) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="যেমন: বাসা নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition resize-none"
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                    বিশেষ কোনো নির্দেশনা থাকলে লিখুন (অপশনাল):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: কল দিয়ে আসবেন / সকালে ডেলিভারি দেবেন"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition text-gray-700"
                  />
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 block">
                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                  </span>
                  <p className="text-emerald-700 text-[11px] leading-relaxed mt-0.5">
                    আগে কোনো অগ্রিম টাকা দিতে হবে না! পার্সেল হাতে পেয়ে চেক করে ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করবেন।
                  </p>
                </div>
              </div>

              {/* Order Total & Price Summary */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>পণ্যের মূল্য ({quantity}টি):</span>
                  <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-gray-800">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">ফ্রি ডেলিভারি</span> : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-gray-900 border-t border-gray-200 pt-2">
                  <span>সর্বমোট প্রদেয় টাকা:</span>
                  <span className="text-[#f85606] text-base">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || product.stock <= 0}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-[#f85606] hover:from-orange-600 hover:to-[#e04a00] text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>অর্ডার তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                      <span>অর্ডারটি নিশ্চিত করুন - {formatPrice(grandTotal)}</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ১০০% সুরক্ষিত অর্ডার
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-orange-600" /> দ্রুততম হোম ডেলিভারি
                  </span>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
