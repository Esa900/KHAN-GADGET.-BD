import React from 'react';
import { 
  Smartphone, ShieldCheck, Truck, RefreshCw, Headphones, 
  CreditCard, PhoneCall, Mail, MapPin, Heart, MessageCircle, Lock 
} from 'lucide-react';
import { StoreConfig } from '../types';

interface FooterProps {
  storeConfig?: StoreConfig;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ storeConfig, onOpenTracking, onOpenAdmin }) => {
  const currentStoreName = storeConfig?.storeName || 'KHAN GADGET MALL';
  const currentPhone = storeConfig?.phone || '01854774406';
  const currentAbout = storeConfig?.about || "Bangladesh's premium mobile accessories mall for fast chargers, MagSafe cases, earbuds, and gaming gear.";
  const rawDigits = currentPhone.replace(/[^0-9]/g, '');
  const whatsappNumber = rawDigits.startsWith('88') ? rawDigits : (rawDigits.startsWith('0') ? '88' + rawDigits : '880' + rawDigits);

  return (
    <footer className="bg-[#052212] text-emerald-100/70 py-8 border-t border-[#093d20] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-[#0d4a27]">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">১০০% অরিজিনাল</h4>
              <p className="text-emerald-300/70 text-[11px] mt-0.5">সব পণ্যে অফিশিয়াল ব্র‍্যান্ড ওয়ারেন্টি।</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">৭ দিনের রিপ্লেসমেন্ট</h4>
              <p className="text-emerald-300/70 text-[11px] mt-0.5">সমস্যা হলে দ্রুত এক্সচেঞ্জ বা রিটার্ন।</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">সারা দেশে ডেলিভারি</h4>
              <p className="text-emerald-300/70 text-[11px] mt-0.5">Steadfast ও RedX এর মাধ্যমে দ্রুত ডেলিভারি।</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">কাস্টমার সাপোর্ট</h4>
              <p className="text-emerald-300/70 text-[11px] mt-0.5">
                <a href={`tel:${currentPhone}`} className="hover:text-emerald-300 transition">
                  কল করুন: {currentPhone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          
          {/* Brand Col */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white uppercase">
                {currentStoreName}
              </span>
            </div>
            <p className="text-emerald-200/70 leading-relaxed text-[11px]">
              {currentAbout}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <MapPin className="w-3 h-3" />
              <span>ঢাকা • চট্টগ্রাম • সিলেট • সারাদেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="pt-1">
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>WhatsApp: {currentPhone}</span>
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">কাস্টমার কেয়ার</h4>
            <ul className="space-y-1.5 text-emerald-200/70 text-[11px]">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition text-left cursor-pointer">
                  অর্ডার ট্র্যাক করুন (Track Order)
                </button>
              </li>
              <li>
                <a 
                  href={`tel:${currentPhone}`} 
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>হটলাইন: {currentPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white text-emerald-400 transition flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  <span>হোয়াটসঅ্যাপ সাপোর্ট ({currentPhone})</span>
                </a>
              </li>
              <li><span className="hover:text-white transition cursor-pointer">ক্যাশ অন ডেলিভারি নিয়মাবলি</span></li>
              <li><span className="hover:text-white transition cursor-pointer">রিটার্ন ও ওয়ারেন্টি পলিসি</span></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">জনপ্রিয় ক্যাটাগরি</h4>
            <ul className="space-y-1.5 text-emerald-200/70 text-[11px]">
              <li><span>GaN ফাস্ট চার্জার ও কেবলস</span></li>
              <li><span>ANC ওয়্যারলেস ইয়ারবাডস ও অডিও</span></li>
              <li><span>ম্যাগসেফ ও শকপ্রুফ কেস</span></li>
              <li><span>হাই-ক্যাপাসিটি পাওয়ার ব্যাংক</span></li>
            </ul>
          </div>

          {/* Verified Payments & Merchant Access */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">
              পেমেন্ট সুবিধা
            </h4>
            <p className="text-emerald-200/70 text-[11px]">
              ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ), বিকাশ, নগদ ও কার্ড।
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {['ক্যাশ অন ডেলিভারি', 'bKash', 'Nagad', 'VISA', 'Mastercard'].map((badge) => (
                <span key={badge} className="bg-[#0b3d1f] text-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded border border-[#145a30]">
                  {badge}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-bold text-emerald-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer bg-[#0b3d1f] hover:bg-[#104e28] px-2.5 py-1.5 rounded-lg border border-[#145a30]"
                title="Admin Panel"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-[#0d4a27] flex flex-col sm:flex-row items-center justify-between gap-2 text-emerald-300/50 text-[10px]">
          <div>
            © {new Date().getFullYear()} {currentStoreName}. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>অরিজিনাল মোবাইল গ্যাজেট ও অ্যাক্সেসরিজের বিশ্বস্ত শপ</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
