import React from 'react';
import { 
  X, Printer, Download, CheckCircle2, ShieldCheck, 
  MapPin, Phone, Calendar, Truck, Package, QrCode, FileText 
} from 'lucide-react';
import { Order } from '../types';
import { formatPrice, getStoredStoreConfig } from '../utils/storage';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen || !order) return null;

  const storeConfig = getStoredStoreConfig();
  const storeName = storeConfig?.storeName || 'KHAN GADGET MALL';
  const storePhone = storeConfig?.phone || '01854774406';

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace('KG-', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Container */}
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-bold text-sm">Official Invoice / Cash Memo</h3>
              <p className="text-[11px] text-slate-400 font-mono">Invoice #{invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF (প্রিন্ট চালান)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-6 print:overflow-visible text-slate-900 text-xs bg-white">
          
          {/* Header & Store Branding */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-lg">
                  {storeName.charAt(0).toUpperCase() || 'K'}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    {storeName}
                  </h1>
                  <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                    Premium Mobile Accessories Mall
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Dhaka, Bangladesh • Hotline: <strong>{storePhone}</strong><br />
                WhatsApp: <strong>{storePhone}</strong>
              </p>
            </div>

            {/* Invoice Badge & Details */}
            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-black text-xs uppercase px-3 py-1 rounded tracking-widest mb-1.5">
                CASH MEMO / INVOICE
              </span>
              <div className="space-y-0.5 text-slate-600 font-mono text-[11px]">
                <p><span className="text-slate-400">Invoice:</span> <strong>#{invoiceNumber}</strong></p>
                <p><span className="text-slate-400">Order ID:</span> <strong>{order.id}</strong></p>
                <p><span className="text-slate-400">Date:</span> {orderDate} {orderTime}</p>
                <p><span className="text-slate-400">Status:</span> <span className="font-bold text-orange-600">{order.status}</span></p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200">
            {/* Bill / Ship To */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                DELIVER TO (গ্রাহকের তথ্য)
              </span>
              <h4 className="text-sm font-black text-slate-900 mb-0.5">
                {order.shippingAddress.fullName}
              </h4>
              <p className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1 my-1">
                <Phone className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>{order.shippingAddress.phone}</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.shippingAddress.address}, {order.shippingAddress.city}</span>
              </p>
              
              {/* Customer Note if present */}
              {(order.customerNote || order.shippingAddress.customerNote) && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded">
                  <strong className="block text-[10px] uppercase text-amber-800 font-bold">Special Instructions:</strong>
                  <span>"{order.customerNote || order.shippingAddress.customerNote}"</span>
                </div>
              )}
            </div>

            {/* Courier Dispatch Meta */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  DISPATCH & COURIER DETAILS
                </span>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Courier Partner:</span>
                    <span className="font-bold text-slate-900">{order.carrierName || 'Steadfast Courier'}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Consignment / Tracking:</span>
                    <span className="font-bold text-orange-600">{order.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Terms:</span>
                    <span className="font-black text-emerald-700 uppercase">Cash on Delivery (COD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-semibold text-slate-800">{order.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="font-mono text-[10px] text-slate-500">
                  <div className="tracking-widest font-black text-xs text-slate-900">||| | |||| | ||| |||| | ||| |</div>
                  <div>SCAN ID: {order.trackingNumber}</div>
                </div>
                <div className="w-9 h-9 border border-slate-300 rounded flex items-center justify-center text-slate-400">
                  <QrCode className="w-7 h-7 text-slate-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="py-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Itemized Summary
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Product Description</th>
                    <th className="py-2.5 px-3">Variant / Options</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {order.items.map((item, idx) => {
                    const lineTotal = item.priceAtPurchase * item.quantity;
                    const variantDetails = item.selectedVariants 
                      ? Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
                      : 'Standard';

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.product.title}</div>
                          <div className="text-[10px] text-slate-400">
                            Brand: {item.product.brand} • SKU: {item.product.id}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{variantDetails}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">{formatPrice(item.priceAtPurchase)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatPrice(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculations & Total Collection Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2 pb-6 border-b border-slate-200">
            {/* Guarantee Note */}
            <div className="sm:max-w-xs space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Mobile Accessories</span>
              </div>
              <p className="leading-relaxed">
                Thank you for shopping at Khan Gadget. All items carry official replacement warranty. Please inspect your parcel before the delivery agent.
              </p>
              <p className="text-[10px] text-slate-400 italic">
                *For exchange or return queries, call our hotline at 01854774406 within 7 days.
              </p>
            </div>

            {/* Financial Totals */}
            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span className="font-mono font-semibold">{formatPrice(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Voucher Discount {order.appliedVoucher ? `(${order.appliedVoucher})` : ''}:</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Courier Delivery Fee:</span>
                <span className="font-mono font-semibold">
                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                </span>
              </div>

              {/* Grand Total Amount to Collect */}
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Total Amount to Collect</span>
                  <span className="font-black text-slate-900 text-sm">সর্বমোট মূল্য (COD):</span>
                </div>
                <span className="font-black text-orange-600 text-xl font-mono">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Verification Stamp */}
          <div className="pt-6 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p>Generated by {storeName} ERP System</p>
              <p className="font-mono text-[10px] text-slate-400">Timestamp: {new Date().toISOString()}</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Authorized Signature & Seal
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden shrink-0">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for printing or PDF export (A4 format).</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
