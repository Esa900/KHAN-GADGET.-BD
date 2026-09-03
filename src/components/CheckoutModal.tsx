import React, { useState } from 'react';
import { 
  X, ShieldCheck, CreditCard, Smartphone, Banknote, Building, 
  Lock, CheckCircle2, ArrowRight, Truck, MapPin, AlertCircle, Copy, Printer 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Voucher, ShippingAddress, PaymentMethod, Order } from '../types';
import { formatPrice, addStoredOrder } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedVoucher: Voucher | null;
  onOrderSuccess: (order: Order) => void;
}

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedVoucher,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'otp' | 'confirmed'>('address');
  
  // Shipping details state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Mohammad Esa Khan',
    phone: '01854774406',
    email: 'esakhan5477@gmail.com',
    city: 'Karachi',
    province: 'Sindh',
    address: 'Suite 402, Trade Center, I.I. Chundrigar Road',
    landmark: 'Near City Bank Tower',
    addressType: 'Office'
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    name: 'M ESA KHAN',
    expiry: '12/28',
    cvv: '821'
  });
  const [walletPhone, setWalletPhone] = useState('01854774406');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp] = useState('7842');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 3D-Secure / OTP validation flow for modern Pakistani payments
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'card' || paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
        setStep('otp');
      } else {
        finalizeOrder();
      }
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      finalizeOrder();
    }, 1200);
  };

  const finalizeOrder = () => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const orderId = `KG-${randomId}-PK`;
    const trackingNo = `DEX-PK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    const newOrder: Order = {
      id: orderId,
      trackingNumber: trackingNo,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
        priceAtPurchase: item.product.price
      })),
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Unpaid (COD)' : 'Paid',
      subtotal,
      discount,
      shippingFee,
      total: grandTotal,
      appliedVoucher: appliedVoucher?.code,
      carrierName: 'Daraz Express (DEX)',
      estimatedDelivery: '2-3 Business Days',
      checkpoints: [
        {
          title: 'Order Placed & Verified',
          location: 'KHAN GADGET Portal',
          time: dateStr,
          description: paymentMethod === 'cod' 
            ? 'Order verified via automated COD check. Awaiting warehouse packing.'
            : 'Payment authorized successfully via 256-bit 3D Secure Gateway.',
          completed: true,
          current: true
        },
        {
          title: 'Quality Check & Packing',
          location: 'Khan Gadget Fulfillment Center, Karachi',
          time: 'Upcoming in 2-4 hours',
          description: 'Accessory inspection, barcode tagging & bubble packaging.',
          completed: false
        },
        {
          title: 'Handed to Courier (Daraz Express)',
          location: 'Daraz Logistics Sorting Center',
          time: 'Pending Dispatch',
          description: 'Courier AWB generated. Package scheduled for pickup.',
          completed: false
        },
        {
          title: 'Out for Delivery',
          location: `${address.city} Destination Distribution Station`,
          time: 'Expected Soon',
          description: 'Rider assigned to customer route.',
          completed: false
        },
        {
          title: 'Delivered',
          location: address.address,
          time: 'Pending',
          description: 'Recipient signature & delivery proof.',
          completed: false
        }
      ]
    };

    addStoredOrder(newOrder);
    setConfirmedOrder(newOrder);
    setStep('confirmed');

    // Confetti blast
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti error', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#f85606]" />
            <h2 className="font-black text-gray-900 text-lg">
              {step === 'confirmed' ? 'Order Confirmed!' : 'Secure Daraz Checkout'}
            </h2>
          </div>
          {step !== 'confirmed' && (
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Checkout Steps Progress Indicator */}
        {step !== 'confirmed' && (
          <div className="px-6 py-3 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step === 'address' ? 'text-[#f85606] font-bold' : 'text-emerald-700'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'address' ? 'bg-[#f85606] text-white' : 'bg-emerald-600 text-white'
              }`}>
                1
              </span>
              <span>Delivery Address</span>
            </div>

            <div className="w-8 sm:w-12 h-0.5 bg-orange-200" />

            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#f85606] font-bold' : step === 'otp' ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' || step === 'otp' ? 'bg-[#f85606] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </span>
              <span>Payment Method</span>
            </div>

            <div className="w-8 sm:w-12 h-0.5 bg-orange-200" />

            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Verification</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          
          {/* STEP 1: Delivery Address Form */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="text-xs text-gray-500 font-medium">
                Where should we deliver your KHAN GADGET package?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Daniyal Qureshi"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number (For Courier SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="0300-1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">City *</label>
                  <select
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    {PAKISTAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address (For Invoice)</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="name@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address / House / Office # *</label>
                <textarea
                  required
                  rows={2}
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="House #, Street name, Sector / Area..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Near Masjid, Metro station, etc."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Address Label</label>
                  <div className="flex gap-2">
                    {(['Home', 'Office'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddress({ ...address, addressType: type })}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                          address.addressType === type
                            ? 'border-[#f85606] bg-orange-50 text-[#f85606]'
                            : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order quick summary footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-gray-500">Order Total:</div>
                  <div className="text-base font-black text-[#f85606]">{formatPrice(grandTotal)}</div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method Selection */}
          {step === 'payment' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              <div className="text-xs text-gray-500 font-medium">
                Choose your secure payment channel (256-bit SSL Protected):
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-[#f85606] bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#f85606] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Credit / Debit Card</span>
                      <span className="text-[10px] text-[#f85606] font-bold">Instant</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, PayPak</p>
                  </div>
                </div>

                {/* EasyPaisa */}
                <div
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'easypaisa'
                      ? 'border-[#f85606] bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                    EP
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">EasyPaisa Wallet</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Fast</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pay via mobile number OTP</p>
                  </div>
                </div>

                {/* JazzCash */}
                <div
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#f85606] bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">
                    JC
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">JazzCash Wallet</span>
                      <span className="text-[10px] text-red-700 font-bold">Fast</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Direct mobile account debit</p>
                  </div>
                </div>

                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-[#f85606] bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Cash on Delivery</span>
                      <span className="text-[10px] text-amber-700 font-bold">Doorstep</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pay cash to courier rider</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span>Card Information</span>
                    <span className="text-[11px] text-gray-400 font-normal">3D Secure v2.0 Ready</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                        placeholder="•••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 uppercase"
                    />
                  </div>
                </div>
              )}

              {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-gray-800">
                    {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Mobile Account
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Mobile Account Number</label>
                    <input
                      type="tel"
                      required
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                      placeholder="01854774406"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    You will receive an instant approval push prompt and 4-digit PIN verification to confirm this transaction.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Cash on Delivery Guidelines</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Please prepare exact cash of <strong>{formatPrice(grandTotal)}</strong> for the courier rider. You will receive an automated delivery dispatch SMS before arrival.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  ← Back to Address
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="py-2.5 px-6 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing ? 'Connecting Gateway...' : `Pay ${formatPrice(grandTotal)}`}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 3D Secure / OTP Simulation */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto text-center py-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#f85606] flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-gray-900 text-base">
                {paymentMethod === 'card' ? '3D Secure Bank Verification' : 'Mobile Wallet OTP'}
              </h3>
              <p className="text-xs text-gray-500">
                A one-time verification code has been generated for your transaction of{' '}
                <strong className="text-gray-900">{formatPrice(grandTotal)}</strong>.
              </p>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-800 flex items-center justify-center gap-1.5 font-mono">
                <span>Demo OTP: <strong>{simulatedOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedOtp)}
                  className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-sans hover:bg-amber-100"
                >
                  Auto-Fill
                </button>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 4-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-48 text-center tracking-widest text-lg font-mono font-bold px-3 py-2 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !otpCode}
                  className="px-6 py-2 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isProcessing ? 'Verifying...' : 'Authorize & Place Order'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmed Order Screen */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900">Thank You for Shopping at KHAN GADGET!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your order has been received and sent to our Karachi fulfillment warehouse.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono font-bold text-gray-900">{confirmedOrder.id}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Courier Tracking Number:</span>
                  <span className="font-mono font-bold text-[#f85606] flex items-center gap-1">
                    {confirmedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="font-semibold text-gray-800 text-right truncate max-w-xs">
                    {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="text-sm font-black text-[#f85606]">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onOrderSuccess(confirmedOrder);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track This Order Live</span>
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
          )}

        </div>
      </div>
    </div>
  );
};
