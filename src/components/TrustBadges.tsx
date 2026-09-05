import React from 'react';
import { 
  ShieldCheck, RefreshCw, Truck, Zap, Headphones, 
  CheckCircle2, CreditCard, Lock, Sparkles 
} from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded border border-orange-200/80 p-3 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Badge 1 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">১০০% অরিজিনাল গ্যাজেট</h4>
            <p className="text-[10px] text-slate-500 truncate">অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি</p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">৭ দিনের রিপ্লেসমেন্ট</h4>
            <p className="text-[10px] text-slate-500 truncate">সহজ রিটার্ন পলিসি</p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">ক্যাশ অন ডেলিভারি</h4>
            <p className="text-[10px] text-slate-500 truncate">পণ্য দেখে মূল্য পরিশোধ</p>
          </div>
        </div>

        {/* Badge 4 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">সুপার ফাস্ট ডেলিভারি</h4>
            <p className="text-[10px] text-slate-500 truncate">ঢাকা ২৪-৪৮ ঘণ্টা • সারাদেশে ২-৩ দিন</p>
          </div>
        </div>

      </div>
    </div>
  );
};
