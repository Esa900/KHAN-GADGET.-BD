import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, RefreshCw, Truck, Tag, Copy, Check } from 'lucide-react';

interface FlashSaleBannerProps {
  onSelectVoucher: (code: string) => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ onSelectVoucher }) => {
  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onSelectVoucher(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="space-y-2.5 mb-3">
      {/* High-Density Hero Flash Sale Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 rounded-lg shadow-inner p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-4 relative overflow-hidden border border-slate-800">
        {/* Angular decorative skew background from design */}
        <div className="absolute -right-10 top-0 h-full w-1/2 bg-white/5 skew-x-12 pointer-events-none" />

        <div className="z-10 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Flash Sale Now
            </span>
            <span className="text-[11px] font-mono text-orange-300 font-semibold">
              CODE: KHAN10 (-10%)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            UP TO 60% OFF
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 uppercase tracking-widest font-medium">
            Premium Mobile Accessories & High-Speed GaN Gear
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button 
              onClick={() => copyVoucher('KHAN10')}
              className="bg-white hover:bg-orange-50 text-slate-900 font-bold px-4 py-1.5 text-xs rounded transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {copiedCode === 'KHAN10' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>VOUCHER APPLIED</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  <span>APPLY 10% VOUCHER</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">Valid on orders over ৳ 1,000</span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="z-10 flex flex-col items-start sm:items-end gap-1.5 bg-slate-900/80 p-2.5 rounded border border-slate-700/80 backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>Deals Expire In:</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base text-white">
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">{format2(timeLeft.hours)}</span>
            <span className="text-slate-500">:</span>
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">{format2(timeLeft.minutes)}</span>
            <span className="text-slate-500">:</span>
            <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">{format2(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      {/* Trust Guarantee Row - High Density Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-white p-2 rounded border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">100% Genuine</div>
            <div className="text-[10px] text-slate-400 truncate">Official Warranty</div>
          </div>
        </div>

        <div className="bg-white p-2 rounded border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">7-Day Easy Return</div>
            <div className="text-[10px] text-slate-400 truncate">Fast Replacements</div>
          </div>
        </div>

        <div className="bg-white p-2 rounded border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">Express Courier</div>
            <div className="text-[10px] text-slate-400 truncate">TCS & Daraz DEX</div>
          </div>
        </div>

        {/* Voucher Fast Apply Card */}
        <div 
          onClick={() => copyVoucher('KHAN10')}
          className="bg-white hover:bg-orange-50/50 p-2 rounded border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer transition"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Voucher: KHAN10</div>
              <div className="text-[10px] text-orange-600 font-semibold truncate">10% OFF Any Item</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-orange-600 px-2 py-0.5 rounded bg-orange-50 border border-orange-200 shrink-0 ml-1">
            {copiedCode === 'KHAN10' ? 'APPLIED' : 'APPLY'}
          </span>
        </div>
      </div>
    </div>
  );
};
