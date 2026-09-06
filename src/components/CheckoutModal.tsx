import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Banknote, CheckCircle2, ArrowRight, Truck, 
  MapPin, Phone, User, FileText, ShoppingBag, Check, Printer, Sparkles, MessageCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Voucher, ShippingAddress, Order } from '../types';
import { formatPrice, addStoredOrder, generateWhatsAppCartOrderUrl, getStoredStoreConfig } from '../utils/storage';
import { syncAddOrder } from '../lib/syncService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedVoucher: Voucher | null;
  onOrderSuccess: (order: Order) => void;
}

const COMMON_CITIES = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Comilla',
  'Gazipur',
  'Narayanganj',
  'Bogra',
  'Mymensingh',
  'Cox\'s Bazar'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedVoucher,
  onOrderSuccess
}) => {
  const storeConfig = getStoredStoreConfig();
  const currentStoreName = storeConfig.storeName || 'KHAN GADGET MALL';
  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');

  // Fields explicitly requested: Name, Phone, City, Address, Customer Note
  const [fullName, setFullName] = useState('Mohammad Esa Khan');
  const [phone, setPhone] = useState('01854774406');
  const [city, setCity] = useState('Dhaka');
  const [address, setAddress] = useState('House #12, Road #5, Dhanmondi, Dhaka');
  const [customerNote, setCustomerNote] = useState('');
  
  // Payment method: Cash on Delivery pre-selected
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Every time checkout opens, ensure it starts at checkout step
  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setPaymentMethod('cod');
      // Keep customer note ready/fresh for this order
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 2000;
  let discount = 0;
  if (appliedVoucher) {
    discount = appliedVoucher.discountType === 'percentage' 
      ? Math.round((subtotal * appliedVoucher.discountValue) / 100) 
      : appliedVoucher.discountValue;
  }
  const shippingFee = isFreeShipping ? 0 : 199;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      alert('Please fill in Name, Phone, City, and Delivery Address.');
      return;
    }

    setIsSubmitting(true);

    const randomId = Math.floor(100000 + Math.random() * 900000);
    const orderId = `KG-${randomId}-BD`;
    const trackingNo = `STD-BD-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    const shippingInfo: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: 'esakhan5477@gmail.com',
      city: city.trim(),
      province: 'Dhaka Division',
      address: address.trim(),
      customerNote: customerNote.trim() || '',
      addressType: 'Home'
    };

    const newOrder: Order = {
      id: orderId,
      trackingNumber: trackingNo,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants || undefined,
        priceAtPurchase: item.product.price
      })),
      shippingAddress: shippingInfo,
      paymentMethod: 'cod',
      paymentStatus: 'Unpaid (COD)',
      subtotal,
      discount,
      shippingFee,
      total: grandTotal,
      appliedVoucher: appliedVoucher ? appliedVoucher.code : undefined,
      carrierName: 'Steadfast Courier',
      estimatedDelivery: '2-3 Business Days',
      customerNote: customerNote.trim() || '',
      checkpoints: [
        {
          title: 'Order Placed & Verified',
          location: `${currentStoreName} Portal`,
          time: dateStr,
          description: 'Order confirmed with Cash on Delivery (COD). Awaiting warehouse packing.',
          completed: true,
          current: true
        },
        {
          title: 'Quality Check & Packing',
          location: `${currentStoreName} Fulfillment Center, Dhaka`,
          time: 'Upcoming in 2-4 hours',
          description: 'Accessory inspection, barcode tagging & bubble packaging.',
          completed: false
        },
        {
          title: 'Handed to Courier (Steadfast Courier)',
          location: 'Central Logistics Sorting Center, Dhaka',
          time: 'Pending Dispatch',
          description: 'Courier AWB generated. Package scheduled for pickup.',
          completed: false
        },
        {
          title: 'Out for Delivery',
          location: `${city.trim()} Destination Distribution Station`,
          time: 'Expected Soon',
          description: 'Rider assigned to customer route.',
          completed: false
        },
        {
          title: 'Delivered & Paid',
          location: address.trim(),
          time: 'Pending',
          description: 'Recipient cash payment collected upon parcel handover.',
          completed: false
        }
      ]
    };

    // Store order into local storage backup immediately
    addStoredOrder(newOrder);

    // Save order into Firestore Cloud Database so all devices see it in real-time
    try {
      const syncRes = await syncAddOrder(newOrder);
      if (!syncRes.success) {
        console.warn('Firestore cloud sync notice:', syncRes.error);
      }
    } catch (err) {
      console.error('Cloud sync error on order creation:', err);
    }

    setConfirmedOrder(newOrder);
    setIsSubmitting(false);
    setStep('confirmed');

    // Notify parent
    onOrderSuccess(newOrder);

    // Confetti effect
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base sm:text-lg">
                {step === 'confirmed' ? 'Order Confirmed!' : `${currentStoreName} Checkout`}
              </h2>
              <p className="text-[11px] text-gray-500">
                {step === 'confirmed' ? 'Your parcel has been placed successfully' : 'Provide delivery details to confirm your order'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {step === 'checkout' ? (
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              
              {/* Order Items Preview (Compact) */}
              <div className="bg-orange-50/50 border border-orange-200/70 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                  <span>Order Items ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-[#f85606] font-black">{formatPrice(grandTotal)}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-orange-100 text-xs shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 object-contain rounded bg-white"
                      />
                      <div className="max-w-[140px] truncate">
                        <span className="font-semibold text-gray-800 block truncate">{item.product.title}</span>
                        <span className="text-[10px] text-gray-500">Qty: {item.quantity} × {formatPrice(item.product.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>Customer & Delivery Details</span>
                </h3>

                {/* 1. Name & 2. Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Full Name (আপনার নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohammad Esa Khan"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Phone Number (মোবাইল নম্বর) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01854774406"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                {/* 3. City */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    City (শহর) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      list="city-suggestions"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Select or type your city"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                    <datalist id="city-suggestions">
                      {COMMON_CITIES.map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* 4. Address */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Full Address (সম্পূর্ণ ডেলিভারি ঠিকানা) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat #, Road / Street, Area / Sector..."
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                {/* 5. Customer Note */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      <span>Customer Note (কাস্টমার স্পেশাল নোট)</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Write any special instructions (e.g. Call before delivery, delivery timing preference, etc.)..."
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Method: Cash on Delivery Selected */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                  Payment Method (পেমেন্ট পদ্ধতি)
                </label>
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className="p-3.5 rounded-xl border-2 border-orange-500 bg-orange-50/60 flex items-start gap-3 cursor-pointer shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-900">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded">
                        SELECTED
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">
                      পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। অগ্রিম কোনো টাকা দিতে হবে না। (Pay cash when you receive the parcel).
                    </p>
                  </div>
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <div className="text-[11px] text-gray-500 flex items-center gap-2">
                    <span>Subtotal: {formatPrice(subtotal)}</span>
                    {discount > 0 && <span className="text-emerald-600 font-bold">-{formatPrice(discount)}</span>}
                    <span>Delivery: {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="text-lg font-black text-[#f85606]">
                    Total: {formatPrice(grandTotal)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <a
                    href={generateWhatsAppCartOrderUrl(
                      cart.map(c => ({ 
                        title: c.product.title, 
                        price: c.product.price, 
                        quantity: c.quantity, 
                        variants: c.selectedVariants 
                      })),
                      grandTotal,
                      fullName,
                      phone,
                      `${address}, ${city}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    title="Order directly with WhatsApp chat"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>WhatsApp Order</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming...' : 'CONFIRM ORDER (Cash on Delivery)'}</span>
                  </button>
                </div>
              </div>

            </form>
          ) : (
            /* Order Confirmed Step */
            confirmedOrder && (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900">Order Confirmed Successfully!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Thank you! Your Cash on Delivery order is now in our system.
                  </p>
                </div>

                {/* Details Breakdown */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-bold text-gray-900">{confirmedOrder.id}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Tracking Number:</span>
                    <span className="font-mono font-bold text-[#f85606]">{confirmedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Customer:</span>
                    <span className="font-bold text-gray-800">{confirmedOrder.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-mono text-gray-800">{confirmedOrder.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">City & Address:</span>
                    <span className="font-medium text-gray-800 text-right max-w-xs truncate">
                      {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city}
                    </span>
                  </div>
                  {confirmedOrder.customerNote && (
                    <div className="flex items-start justify-between pb-2 border-b border-gray-200 bg-amber-50/70 p-2 rounded">
                      <span className="text-amber-800 font-bold">Customer Note:</span>
                      <span className="text-amber-900 font-medium text-right max-w-xs">
                        "{confirmedOrder.customerNote}"
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-bold text-emerald-700">Cash on Delivery (COD)</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-700 font-bold">Total Payable at Delivery:</span>
                    <span className="text-base font-black text-[#f85606]">{formatPrice(confirmedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Order Live</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
