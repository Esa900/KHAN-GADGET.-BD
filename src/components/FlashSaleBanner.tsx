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
      <div className="bg-gradient-to-r from-[#0a4625] via-[#0f5132] to-[#14532d] rounded-xl shadow-inner p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-4 relative overflow-hidden border border-emerald-900/60">
        {/* Angular decorative skew background from design */}
        <div className="absolute -right-10 top-0 h-full w-1/2 bg-white/5 skew-x-12 pointer-events-none" />

        <div className="z-10 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              স্পেশাল ফ্ল্যাশ সেল
            </span>
            <span className="text-[11px] font-mono text-emerald-200 font-bold bg-emerald-900/70 px-2 py-0.5 rounded border border-emerald-600/40">
              CODE: KHAN10 (-10%)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
            UP TO 60% OFF
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 uppercase tracking-widest font-medium">
            প্রিমিয়াম মোবাইল এক্সেসরিজ ও হাই-স্পিড চার্জিং গিয়ার
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button 
              onClick={() => copyVoucher('KHAN10')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-4 py-1.5 text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {copiedCode === 'KHAN10' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>কুপন যোগ হয়েছে!</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>১০% কুপন ব্যবহার করুন</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-emerald-200/90">৳ ১,০০০+ অর্ডারে প্রযোজ্য</span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="z-10 flex flex-col items-start sm:items-end gap-1.5 bg-[#08381c]/80 p-3 rounded-xl border border-emerald-800/80 backdrop-blur-xs shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>অফারের সময় বাকি:</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base text-white">
            <span className="bg-emerald-950/80 text-white px-2.5 py-1 rounded-lg border border-emerald-800">{format2(timeLeft.hours)}</span>
            <span className="text-emerald-400">:</span>
            <span className="bg-emerald-950/80 text-white px-2.5 py-1 rounded-lg border border-emerald-800">{format2(timeLeft.minutes)}</span>
            <span className="text-emerald-400">:</span>
            <span className="bg-emerald-950/80 text-amber-300 px-2.5 py-1 rounded-lg border border-emerald-800">{format2(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
