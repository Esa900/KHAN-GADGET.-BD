import React, { useState, useEffect } from 'react';
import { 
  X, Search, Truck, CheckCircle2, Clock, MapPin, 
  Package, PhoneCall, ShieldCheck, ExternalLink, AlertCircle 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getStoredOrders, formatPrice } from '../utils/storage';

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
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');

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
        } else if (stored.length > 0) {
          setSelectedOrder(stored[0]);
        }
      } else if (stored.length > 0 && !selectedOrder) {
        setSelectedOrder(stored[0]);
      }
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = orders.find(
      o => o.id.toLowerCase() === q || 
           o.trackingNumber.toLowerCase() === q ||
           o.shippingAddress.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      setSearchError('No order found with that Order ID or Tracking Number. Please check and try again.');
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
        return 'bg-orange-100 text-orange-800 border-orange-300';
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
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#f85606] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base sm:text-lg">KHAN GADGET Order Tracking</h2>
              <p className="text-xs text-gray-500">Live parcel tracking powered by Daraz Express & TCS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. KG-849201-BD) or Tracking Number (STD-BD-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-[#f85606] hover:bg-[#e04a00] text-white px-5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Track
            </button>
          </form>

          {searchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick Select from recent orders */}
          {orders.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Recent Orders in this browser:
              </span>
              <div className="flex flex-wrap gap-2">
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setSearchQuery(order.id);
                      setSearchError('');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-mono ${
                      selectedOrder?.id === order.id
                        ? 'border-[#f85606] bg-orange-50 text-[#f85606] font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {order.id} ({order.status})
                  </button>
                ))}
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
              </div>

              {/* Live Tracking Checkpoint Timeline */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#f85606]" />
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
                              ? 'bg-[#f85606] text-white ring-4 ring-orange-100 shadow'
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
                              cp.current ? 'text-[#f85606]' : 'text-gray-900'
                            }`}>
                              {cp.title}
                              {cp.current && (
                                <span className="ml-2 text-[10px] bg-orange-100 text-[#f85606] px-2 py-0.5 rounded-full font-extrabold uppercase">
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
                    <Package className="w-4 h-4 text-[#f85606]" />
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
                    <MapPin className="w-4 h-4 text-[#f85606]" />
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
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Enter an Order ID above to track your parcel.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
