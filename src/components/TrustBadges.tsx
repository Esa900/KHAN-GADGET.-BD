import React from 'react';
import { 
  ShieldCheck, RefreshCw, Truck, Zap, Headphones, 
  CheckCircle2, CreditCard, Lock, Sparkles 
} from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 rounded-xl border border-emerald-200/80 dark:border-slate-800 p-3 sm:p-3.5 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Badge 1 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">১০০% অরিজিনাল গ্যাজেট</h4>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium truncate">অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি</p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">৭ দিনের রিপ্লেসমেন্ট</h4>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium truncate">সহজ রিটার্ন পলিসি</p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0a4625] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">ক্যাশ অন ডেলিভারি</h4>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium truncate">পণ্য দেখে মূল্য পরিশোধ</p>
          </div>
        </div>

        {/* Badge 4 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">সুপার ফাস্ট ডেলিভারি</h4>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium truncate">ঢাকা ২৪-৪৮ ঘণ্টা • সারাদেশে ২-৩ দিন</p>
          </div>
        </div>

      </div>
    </div>
  );
};
