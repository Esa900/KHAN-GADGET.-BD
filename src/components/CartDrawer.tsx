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
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f85606]" />
            <h2 className="font-black text-gray-900 text-base sm:text-lg">Shopping Cart</h2>
            <span className="bg-orange-100 text-[#f85606] text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-2.5 bg-orange-50 border-b border-orange-100 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1 text-gray-800">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#f85606]" />
              {isFreeShipping ? '🎉 You have unlocked Free Courier Delivery!' : `Add ${formatPrice(amountNeededForFreeShip)} more for FREE Delivery`}
            </span>
            <span className="text-[#f85606]">{progressToFreeShip}%</span>
          </div>
          <div className="w-full bg-orange-200/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#f85606] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShip}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-bold text-gray-800 text-base">Your cart is empty</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Explore our authentic mobile chargers, MagSafe cases, and wireless earbuds to fill it up!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-xl bg-[#f85606] text-white text-xs font-bold hover:bg-[#e04a00] transition cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${index}`}
                className="flex gap-3 p-3 bg-white rounded-xl border border-gray-200/80 shadow-xs hover:border-gray-300 transition"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-50 p-1 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-gray-900 truncate" title={item.product.title}>
                      {item.product.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-400 hover:text-rose-600 transition p-0.5 cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Selected Variants */}
                  {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                    <div className="text-[11px] text-gray-500 flex flex-wrap gap-1">
                      {Object.entries(item.selectedVariants).map(([k, v]) => (
                        <span key={k} className="bg-gray-100 px-1.5 py-0.2 rounded">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Quantity Adjuster */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-[#f85606]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 cursor-pointer text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 cursor-pointer text-xs disabled:opacity-40"
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
          <div className="border-t border-gray-200 p-5 bg-gray-50/80 space-y-3.5">
            {/* Promo Code Input */}
            <div>
              {appliedVoucher ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon: <strong>{appliedVoucher.code}</strong> applied ({formatPrice(discount)} OFF)</span>
                  </div>
                  <button
                    onClick={onRemoveVoucher}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. KHAN10)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {voucherFeedback && (
                <div className={`mt-1 text-[11px] font-medium flex items-center gap-1 ${
                  voucherFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {voucherFeedback.type === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {voucherFeedback.message}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Voucher Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600 uppercase font-bold">Free</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-base text-[#f85606]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="checkout-proceed-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCI-DSS Compliant & 3D Secure Encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
