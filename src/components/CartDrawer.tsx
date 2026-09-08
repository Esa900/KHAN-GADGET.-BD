import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  Tag, ShieldCheck, Truck, Check, AlertCircle 
} from 'lucide-react';
import { CartItem, Voucher } from '../types';
import { formatPrice } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  appliedVoucher: Voucher | null;
  onApplyVoucher: (code: string) => { success: boolean; message: string };
  onRemoveVoucher: () => void;
}

const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING_FEE = 199;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher
}) => {
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherFeedback, setVoucherFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressToFreeShip = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Calculate discount from voucher
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
    } else {
      discount = appliedVoucher.discountValue;
    }
  }

  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    const res = onApplyVoucher(voucherInput.trim());
    if (res.success) {
      setVoucherFeedback({ type: 'success', message: res.message });
      setVoucherInput('');
    } else {
      setVoucherFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setVoucherFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50/70 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">শপিং কার্ট</h2>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} টি পণ্য
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1 text-gray-800 dark:text-slate-200">
            <span className="flex items-center gap-1 text-emerald-900 dark:text-emerald-300">
              <Truck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              {isFreeShipping ? '🎉 অভিনন্দন! আপনি ফ্রি হোম ডেলিভারি পেয়েছেন!' : `আরও ${formatPrice(amountNeededForFreeShip)} টাকার পণ্য কিনলে ফ্রি ডেলিভারি!`}
            </span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">{progressToFreeShip}%</span>
          </div>
          <div className="w-full bg-emerald-200/50 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-700 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShip}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-slate-400 py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-gray-800 dark:text-slate-100 text-base">আপনার কার্টটি বর্তমানে খালি</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
                আমাদের খাঁটি ও প্রিমিয়াম মোবাইল গ্যাজেট ও অ্যাক্সেসরিজ পছন্দ করে কার্টে যোগ করুন।
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${index}`}
                className="flex gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200/80 dark:border-slate-700/80 shadow-xs hover:border-gray-300 dark:hover:border-slate-600 transition"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-slate-900 p-1 border border-gray-100 dark:border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate" title={item.product.title}>
                      {item.product.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-0.5 cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Selected Variants */}
                  {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 flex flex-wrap gap-1">
                      {Object.entries(item.selectedVariants).map(([k, v]) => (
                        <span key={k} className="bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-1.5 py-0.2 rounded">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Quantity Adjuster */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-slate-100">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer text-xs disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Voucher & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-800 p-5 bg-gray-50/80 dark:bg-slate-950/80 space-y-3.5">
            {/* Promo Code Input */}
            <div>
              {appliedVoucher ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>কুপন: <strong>{appliedVoucher.code}</strong> কার্যকর ({formatPrice(discount)} ছাড়)</span>
                  </div>
                  <button
                    onClick={onRemoveVoucher}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ডিসকাউন্ট কুপন লিখুন (যেমন: KHAN10)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-600 uppercase font-mono text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    প্রয়োগ করুন
                  </button>
                </form>
              )}

              {voucherFeedback && (
                <div className={`mt-1 text-[11px] font-medium flex items-center gap-1 ${
                  voucherFeedback.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {voucherFeedback.type === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {voucherFeedback.message}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>পণ্যের মোট মূল্য:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>ভাউচার ডিসকাউন্ট:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>হোম ডেলিভারি চার্জ:</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 dark:text-emerald-400 uppercase font-bold">ফ্রি</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-black text-gray-900 dark:text-white">
                <span>সর্বমোট প্রদেয় টাকা:</span>
                <span className="text-base text-emerald-800 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="checkout-proceed-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>১০০% নিরাপদ চেকআউট ও ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
