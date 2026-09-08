import React, { useState, useEffect } from 'react';
import { 
  X, Search, Truck, CheckCircle2, Clock, MapPin, 
  Package, PhoneCall, ShieldCheck, ExternalLink, AlertCircle, Printer 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getStoredOrders, formatPrice, getCourierTrackingUrl, getStoredStoreConfig } from '../utils/storage';
import { fetchRemoteOrders } from '../lib/syncService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId
}) => {
  const storeConfig = getStoredStoreConfig();
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearchingRemote, setIsSearchingRemote] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredOrders();
      setOrders(stored);

      if (initialOrderId) {
        const found = stored.find(
          o => o.id.toLowerCase() === initialOrderId.toLowerCase() ||
               o.trackingNumber.toLowerCase() === initialOrderId.toLowerCase()
        );
        if (found) {
          setSelectedOrder(found);
          setSearchQuery(found.id);
        }
      } else {
        setSelectedOrder(null);
        setSearchQuery('');
      }

      // Fetch fresh orders from cloud database so newly placed orders from any device are tracked immediately
      fetchRemoteOrders().then(remoteList => {
        if (remoteList && remoteList.length > 0) {
          setOrders(remoteList);
          if (initialOrderId) {
            const foundRemote = remoteList.find(
              o => o.id.toLowerCase() === initialOrderId.toLowerCase() ||
                   o.trackingNumber.toLowerCase() === initialOrderId.toLowerCase()
            );
            if (foundRemote) {
              setSelectedOrder(foundRemote);
              setSearchQuery(foundRemote.id);
            }
          }
        }
      }).catch(console.error);
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const rawQ = searchQuery.trim();
    if (!rawQ) return;
    const q = rawQ.toLowerCase();
    const cleanDigits = rawQ.replace(/[^0-9]/g, '');

    let found = orders.find(
      o => o.id.toLowerCase() === q || 
           o.trackingNumber.toLowerCase() === q ||
           (cleanDigits.length >= 7 && o.shippingAddress.phone.replace(/[^0-9]/g, '').includes(cleanDigits))
    );

    if (found) {
      setSelectedOrder(found);
      return;
    }

    // Try fetching fresh orders from Firestore cloud in case the order was placed from another device
    setIsSearchingRemote(true);
    try {
      const remoteList = await fetchRemoteOrders();
      if (remoteList && remoteList.length > 0) {
        setOrders(remoteList);
        found = remoteList.find(
          o => o.id.toLowerCase() === q || 
               o.trackingNumber.toLowerCase() === q ||
               (cleanDigits.length >= 7 && o.shippingAddress.phone.replace(/[^0-9]/g, '').includes(cleanDigits))
        );
      }
    } catch (err) {
      console.warn('Could not query remote orders:', err);
    } finally {
      setIsSearchingRemote(false);
    }

    if (found) {
      setSelectedOrder(found);
    } else {
      setSelectedOrder(null);
      setSearchError('দুঃখিত! এই অর্ডার আইডি (Order ID) বা মোবাইল নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি। দয়া করে সঠিক অর্ডার আইডি বা ফোন নম্বর দিয়ে আবার চেষ্টা করুন।');
    }
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-white text-base sm:text-lg">{storeConfig.storeName || 'KHAN GADGET MALL'} অর্ডার ট্র্যাকিং</h2>
              <p className="text-xs text-emerald-200/90">অর্ডার আইডি বা মোবাইল নম্বর দিয়ে লাইভ পার্সেল ট্র্যাক করুন</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-full hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="অর্ডার আইডি (যেমন: KG-849201-BD) বা ফোন নম্বর লিখুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError('');
                }}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={isSearchingRemote}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60"
            >
              {isSearchingRemote ? 'খোঁজা হচ্ছে...' : 'Track'}
            </button>
          </form>

          {searchError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Privacy Placeholder when no order has been searched yet */}
          {!selectedOrder && !searchError && (
            <div className="py-10 px-4 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3 shadow-xs">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">
                আপনার অর্ডারের বর্তমান অবস্থা জানুন
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                অর্ডার করার পর আপনাকে দেওয়া <span className="font-semibold text-slate-700">অর্ডার আইডি (যেমন: KG-849201-BD)</span> অথবা যে <span className="font-semibold text-slate-700">মোবাইল নম্বর</span> দিয়ে অর্ডার করেছিলেন, তা উপরের বক্সে লিখে <span className="text-emerald-700 font-bold">Track</span> বাটনে ক্লিক করুন।
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার অর্ডার ও ব্যক্তিগত তথ্য ১০০% সুরক্ষিত ও গোপনীয়</span>
              </div>
            </div>
          )}

          {/* Selected Order Tracking View */}
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Order Status Hero Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 font-mono">ORDER ID</span>
                    <h3 className="text-lg font-mono font-black text-white">{selectedOrder.id}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${getStatusBadgeColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-700/60 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Courier Partner</span>
                    <span className="font-semibold text-orange-400">{selectedOrder.carrierName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Tracking Number</span>
                    <span className="font-mono text-gray-200 text-[11px]">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Estimated Delivery</span>
                    <span className="font-semibold text-emerald-400">{selectedOrder.estimatedDelivery}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Total Amount</span>
                    <span className="font-bold text-white">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Direct Courier Partner Live Tracking Link */}
                <div className="pt-3 border-t border-gray-700/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <Truck className="w-4 h-4 text-orange-400" />
                    <span>Courier Consignment: <strong className="font-mono text-white">{selectedOrder.trackingNumber}</strong></span>
                  </div>

                  <a
                    href={getCourierTrackingUrl(selectedOrder.carrierName, selectedOrder.trackingNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Track on Official Courier Website ({selectedOrder.carrierName.split(' ')[0]})</span>
                  </a>
                </div>
              </div>

              {/* Live Tracking Checkpoint Timeline */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Shipment Journey & Status Logs</span>
                </h4>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {selectedOrder.checkpoints.map((cp, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                          cp.completed
                            ? cp.current 
                              ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow'
                              : 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {cp.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <h5 className={`text-xs sm:text-sm font-bold ${
                              cp.current ? 'text-emerald-700' : 'text-gray-900'
                            }`}>
                              {cp.title}
                              {cp.current && (
                                <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold uppercase">
                                  Current Status
                                </span>
                              )}
                            </h5>
                            <span className="text-[11px] text-gray-400 font-mono">{cp.time}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{cp.location}</span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed">
                            {cp.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Recipient Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Items */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5 pb-2 border-b border-gray-100">
                    <Package className="w-4 h-4 text-emerald-700" />
                    <span>Ordered Mobile Accessories</span>
                  </h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-contain rounded border border-gray-100 p-0.5 shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-medium text-gray-800 truncate" title={item.product.title}>
                              {item.product.title}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              Qty: {item.quantity} {item.selectedVariants ? `• ${Object.values(item.selectedVariants).join(', ')}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 ml-2 shrink-0">
                          {formatPrice(item.priceAtPurchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipient */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5 pb-2 border-b border-gray-100">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Delivery Details</span>
                  </h5>
                  <div className="space-y-1 text-gray-600">
                    <p><strong className="text-gray-900">Recipient:</strong> {selectedOrder.shippingAddress.fullName}</p>
                    <p><strong className="text-gray-900">Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                    <p><strong className="text-gray-900">Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
                    <p><strong className="text-gray-900">Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})</p>
                  </div>
                </div>
              </div>

            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};
