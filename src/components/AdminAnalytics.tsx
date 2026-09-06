import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  AlertCircle, 
  ArrowUpRight, 
  RefreshCw, 
  Sparkles, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Info
} from 'lucide-react';
import { Order, Product, AnalyticsData, OrderStatus } from '../types';
import { formatPrice, BASE_VISITOR_COUNT } from '../utils/storage';

interface AdminAnalyticsProps {
  orders: Order[];
  products: Product[];
  visitorStats: AnalyticsData;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, carrier?: string, note?: string) => void;
  onViewOrdersTab: () => void;
  onRefreshAnalytics?: () => void;
  isSyncing?: boolean;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  orders,
  products,
  visitorStats,
  onUpdateOrderStatus,
  onViewOrdersTab,
  onRefreshAnalytics,
  isSyncing = false
}) => {
  const [quickDeliveringId, setQuickDeliveringId] = useState<string | null>(null);

  // 1. Delivered Sales: ONLY counted when status is 'Delivered'
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const deliveredSales = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = deliveredOrders.length;

  // 2. In-Transit / Pipeline Orders (Confirmed, Processing, Shipped, Out for Delivery)
  const inTransitOrders = orders.filter(o => 
    ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.status)
  );
  const inTransitSales = inTransitOrders.reduce((sum, o) => sum + o.total, 0);

  // 3. Pending Orders (Yet to be confirmed)
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const pendingSales = pendingOrders.reduce((sum, o) => sum + o.total, 0);

  // 4. Cancelled Orders
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

  // 5. Visitor Stats (starts from baseline 8,734 views)
  const totalVisits = Math.max(BASE_VISITOR_COUNT, visitorStats?.totalVisits || BASE_VISITOR_COUNT);
  const uniqueVisitors = Math.max(BASE_VISITOR_COUNT, visitorStats?.uniqueVisitors || BASE_VISITOR_COUNT);

  // 6. Performance Indicators
  const averageOrderValue = deliveredCount > 0 ? Math.round(deliveredSales / deliveredCount) : 0;
  const deliverySuccessRate = orders.length > 0 
    ? Math.round((deliveredCount / Math.max(1, orders.length - cancelledOrders.length)) * 100) 
    : 100;
  const conversionRate = totalVisits > 0 
    ? ((deliveredCount / totalVisits) * 100).toFixed(2) 
    : '0.00';

  // 7. Category-wise Delivered Sales
  const categorySalesMap: Record<string, { revenue: number; units: number }> = {};
  deliveredOrders.forEach(order => {
    order.items.forEach(item => {
      const cat = item.product.category || 'Other';
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { revenue: 0, units: 0 };
      }
      categorySalesMap[cat].revenue += (item.priceAtPurchase || item.product.price) * item.quantity;
      categorySalesMap[cat].units += item.quantity;
    });
  });

  const categoryBreakdown = Object.entries(categorySalesMap)
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      units: data.units,
      percentage: deliveredSales > 0 ? Math.round((data.revenue / deliveredSales) * 100) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // 8. Top Selling Delivered Products
  const productSalesMap: Record<string, { product: Product; units: number; revenue: number }> = {};
  deliveredOrders.forEach(order => {
    order.items.forEach(item => {
      const prodId = item.product.id;
      if (!productSalesMap[prodId]) {
        productSalesMap[prodId] = {
          product: item.product,
          units: 0,
          revenue: 0
        };
      }
      productSalesMap[prodId].units += item.quantity;
      productSalesMap[prodId].revenue += (item.priceAtPurchase || item.product.price) * item.quantity;
    });
  });

  const topDeliveredProducts = Object.values(productSalesMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Handle Quick Deliver from Analysis Panel
  const handleQuickDeliver = async (order: Order) => {
    setQuickDeliveringId(order.id);
    try {
      await onUpdateOrderStatus(
        order.id, 
        'Delivered', 
        order.carrierName || 'Steadfast Courier', 
        'প্যাকেজ সফলভাবে গ্রাহকের হাতে পৌঁছে দেওয়া হয়েছে ও বিক্রয় সম্পন্ন হয়েছে।'
      );
    } finally {
      setTimeout(() => setQuickDeliveringId(null), 300);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Title & Live Refresh */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Real-Time Business Analysis</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1.5">
            স্টোর সেলস অ্যানালাইসিস ও ভিজিটর রিপোর্ট
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            অর্ডার ডেলিভার্ড (Delivered) হলেই শুধুমাত্র বিক্রয় এমাউন্টে যোগ হয় এবং প্রতিটি ওয়েবসাইটে প্রবেশ ভিজিটরে যোগ হয়।
          </p>
        </div>

        {onRefreshAnalytics && (
          <button
            onClick={onRefreshAnalytics}
            disabled={isSyncing}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer font-bold disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-orange-400' : ''}`} />
            <span>{isSyncing ? 'আপডেট হচ্ছে...' : 'রিফ্রেশ অ্যানালাইসিস'}</span>
          </button>
        )}
      </div>

      {/* Rule Notice Banner: Bengali Explanation of Sales & Visitor Logic */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-bold text-amber-900">
            📌 বিক্রয় ও ভিজিটর গণনা পদ্ধতি (Sales & Visitor Counting Rule):
          </p>
          <p className="text-gray-700 leading-relaxed">
            ১. গ্রাহক অর্ডার কনফার্ম করার পর অর্ডারটি ট্রানজিটে থাকে। অ্যাডমিন প্যানেল থেকে যখন কোনো অর্ডারের স্ট্যাটাস 
            <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black mx-1 border border-emerald-200">
              "Delivered"
            </strong> 
            করা হবে, তখনই সাথে সাথে সেই অর্ডারের মোট টাকা <strong>"আদায়কৃত মোট বিক্রয় (Delivered Sales Amount)"</strong>-এ যোগ হবে।<br />
            ২. যেকেউ ওয়েবসাইটে যেকোনো ডিভাইস বা ব্রাউজার থেকে ভিজিট করলে তা <strong>"মোট ব্যবহারকারী / ভিজিটর (Total Users)"</strong>-এ স্বয়ংক্রিয়ভাবে ১ করে যোগ হয়।
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Delivered Sales (Main Highlight) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400/80 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none transition group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>আদায়কৃত মোট বিক্রয়</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {formatPrice(deliveredSales)}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {deliveredCount} টি অর্ডার ডেলিভার্ড
              </span>
              <span className="text-gray-500 font-medium">Delivered Only</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Users / Website Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/60 rounded-bl-full -z-0 pointer-events-none transition group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#f85606] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#f85606]" />
                <span>মোট ব্যবহারকারী / ভিজিটর</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#f85606] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {totalVisits.toLocaleString('en-BD')}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f85606]"></span>
                <span>প্রতি ভিজিটে যোগ হচ্ছে</span>
              </span>
              <span className="text-orange-600 font-bold">
                {uniqueVisitors} ইউনিক ডিভাইস
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: In-Transit / Pipeline Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>পাইপলাইন / ইন-ট্রানজিট</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {formatPrice(inTransitSales + pendingSales)}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {inTransitOrders.length + pendingOrders.length} টি সক্রিয় অর্ডার
              </span>
              <span className="text-gray-400">ডেলিভারির অপেক্ষায়</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Average Delivered Order Value (AOV) & Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between text-gray-500 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                <span>গড় ডেলিভার্ড ভ্যালু (AOV)</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {formatPrice(averageOrderValue)}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-bold">
                সফল ডেলিভারি: {deliverySuccessRate}%
              </span>
              <span className="text-gray-500 font-semibold">
                কনভার্সন: {conversionRate}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Deliver Action Card: Test or deliver orders to see sales increase instantly */}
      {(inTransitOrders.length > 0 || pendingOrders.length > 0) && (
        <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  ইন-ট্রানজিট ও অপেক্ষমাণ অর্ডার (ডেলিভার্ড মার্ক করে বিক্রয়ে যোগ করুন)
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                নিচের যেকোনো অর্ডারে <strong>"Mark Delivered"</strong> বাটনে ক্লিক করলে তাৎক্ষণিকভাবে তা মূল বিক্রয় এমাউন্টে যোগ হয়ে যাবে।
              </p>
            </div>
            <button
              onClick={onViewOrdersTab}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>সকল অর্ডার দেখুন ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...inTransitOrders, ...pendingOrders].slice(0, 4).map((order) => {
              const isDelivering = quickDeliveringId === order.id;
              return (
                <div 
                  key={order.id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:border-orange-300 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-gray-900">
                        {order.trackingNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        order.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {order.shippingAddress?.fullName} • {order.shippingAddress?.phone}
                    </div>
                    <div className="text-xs font-black text-gray-900 mt-0.5">
                      {formatPrice(order.total)} • {order.items.reduce((s, i) => s + i.quantity, 0)} টি আইটেম
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickDeliver(order)}
                    disabled={isDelivering}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    title="এই অর্ডারটি ডেলিভার্ড হিসেবে মার্ক করে সেলসে যোগ করুন"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDelivering ? 'যোগ হচ্ছে...' : 'Mark Delivered'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Section: Category Breakdown & Top Selling Delivered Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  ক্যাটেগরি ভিত্তিক আদায়কৃত বিক্রয় (Category Sales)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  ডেলিভার্ড হওয়া অর্ডারসমূহের ক্যাটেগরি আয়
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                মোট: {formatPrice(deliveredSales)}
              </span>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                এখনো কোনো অর্ডার ডেলিভার্ড করা হয়নি। অর্ডার ডেলিভার্ড মার্ক করলে এখানে ক্যাটেগরি অনুযায়ী আয় প্রদর্শিত হবে।
              </div>
            ) : (
              <div className="space-y-3.5">
                {categoryBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium text-[11px]">{item.units} টি বিক্রিত</span>
                        <span className="font-black text-gray-900">{formatPrice(item.revenue)}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, item.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>সফল বিক্রয় ক্যাটেগরি: {categoryBreakdown.length} টি</span>
            <span>মোট গ্যাজেট ডেলিভার্ড: {deliveredOrders.reduce((s, o) => s + o.items.reduce((is, i) => is + i.quantity, 0), 0)} পিস</span>
          </div>
        </div>

        {/* Top Selling Delivered Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  সর্বোচ্চ বিক্রিত পণ্যসমূহ (Top Delivered Products)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  যেসব গ্যাজেট সবচেয়ে বেশি ডেলিভার্ড হয়ে আয় এনেছে
                </p>
              </div>
            </div>

            {topDeliveredProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                ডেলিভার্ড পণ্যের তথ্য এখানে তালিকাভুক্ত হবে।
              </div>
            ) : (
              <div className="space-y-3">
                {topDeliveredProducts.map(({ product, units, revenue }, idx) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 object-contain rounded-lg border border-gray-200 bg-white p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-gray-900 truncate">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {product.category} • স্টক বাকি: {product.stock}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-xs text-gray-900">
                        {formatPrice(revenue)}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-600">
                        {units} টি ডেলিভার্ড
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 text-center">
            <button
              onClick={onViewOrdersTab}
              className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>সকল ডেলিভার্ড অর্ডারের রসিদ দেখুন</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Delivered Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>সাম্প্রতিক সফল ডেলিভার্ড অর্ডারসমূহ (Delivered Orders Log)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              এসব অর্ডারের টাকা স্বয়ংক্রিয়ভাবে বিক্রয় এমাউন্টে যুক্ত রয়েছে
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট: {deliveredCount} টি ডেলিভারি
          </span>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-semibold">
              এখনো কোনো অর্ডার 'Delivered' স্ট্যাটাসে নেই।
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              "Orders" ট্যাব থেকে যেকোনো অর্ডারের স্ট্যাটাস 'Delivered' করলেই এখানে এসে জমা হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">অর্ডার আইডি ও ট্র্যাকিং</th>
                  <th className="pb-3">গ্রাহকের নাম ও মোবাইল</th>
                  <th className="pb-3">আইটেম সংখ্যা</th>
                  <th className="pb-3">পেমেন্ট মেথড</th>
                  <th className="pb-3 text-right">আদায়কৃত টাকা</th>
                  <th className="pb-3 text-center pr-2">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveredOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 pl-2">
                      <div className="font-mono font-bold text-gray-900">{order.trackingNumber}</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</div>
                      <div className="text-[11px] text-gray-500">{order.shippingAddress?.phone}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} টি গ্যাজেট
                    </td>
                    <td className="py-3">
                      <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-emerald-600 text-sm">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 text-center pr-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Delivered</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
