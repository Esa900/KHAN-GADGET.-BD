import React from 'react';
import { 
  Smartphone, ShieldCheck, Truck, RefreshCw, Headphones, 
  CreditCard, PhoneCall, Mail, MapPin, Heart, MessageCircle, Lock 
} from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTracking, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">100% Genuine</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Official brand warranty on all products.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">7-Day Return</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Quick exchanges if defective.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Express Courier</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Nationwide via TCS and DEX.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">24/7 Helpline</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                <a href="tel:01854774406" className="hover:text-orange-400 transition">
                  Call: 01854774406
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
              <div className="w-7 h-7 rounded bg-orange-600 flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                KHAN GADGET
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Pakistan's premium mobile accessories mall for fast chargers, MagSafe cases, earbuds, and gaming gear.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-orange-400 font-medium">
              <MapPin className="w-3 h-3" />
              <span>Karachi • Lahore • Islamabad</span>
            </div>
            <div className="pt-1">
              <a 
                href="https://wa.me/8801854774406" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>WhatsApp: 01854774406</span>
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Customer Care</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <button onClick={onOpenTracking} className="hover:text-orange-400 transition text-left cursor-pointer">
                  Track Your Parcel
                </button>
              </li>
              <li>
                <a 
                  href="tel:01854774406" 
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-orange-400" />
                  <span>Call: 01854774406</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/8801854774406" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white text-emerald-400 transition flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li><span className="hover:text-white transition cursor-pointer">Payment & COD Guide</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Returns & Replacement Policy</span></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Top Categories</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><span>65W & 100W GaN Fast Chargers</span></li>
              <li><span>ANC Wireless Earbuds & Audio</span></li>
              <li><span>MagSafe Kickstand Shockproof Cases</span></li>
              <li><span>Ultra-Slim High Capacity Power Banks</span></li>
            </ul>
          </div>

          {/* Verified Payments & Merchant Access */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">
              Secure Payments
            </h4>
            <p className="text-slate-400 text-[11px]">
              Cash on Delivery (COD), JazzCash, EasyPaisa, Visa, and Mastercard.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {['VISA', 'Mastercard', 'EasyPaisa', 'JazzCash', 'COD', '3D Secure'].map((badge) => (
                <span key={badge} className="bg-slate-800 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">
                  {badge}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded border border-slate-700"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>App Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[10px]">
          <div>
            © {new Date().getFullYear()} KHAN GADGET Inc. All rights reserved. High Density E-Commerce Mall.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for mobile accessory shoppers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
