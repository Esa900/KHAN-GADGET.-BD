import React from 'react';
import { Star, ShoppingCart, Eye, Heart, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/storage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onQuickBuy?: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onQuickBuy,
  onToggleWishlist,
  onSelectProduct
}) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className={`group bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between relative cursor-pointer ${
        isOutOfStock ? 'opacity-65' : ''
      }`}
    >
      {/* Product Image Area */}
      <div>
        <div className="relative aspect-square w-full rounded-lg bg-slate-50 dark:bg-slate-800/80 mb-2 flex items-center justify-center p-2 overflow-hidden border border-slate-100 dark:border-slate-700/60">
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform duration-200 bg-white/90 p-1"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
            {product.isDarazMall && (
              <span className="bg-emerald-800 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                ORIGINAL
              </span>
            )}
            {product.isFlashSale && (
              <span className="bg-amber-500 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-slate-900" /> FLASH
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-1.5 right-1.5 bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </div>
          )}

          {/* Quick Action Heart */}
          <button
            onClick={(e) => onToggleWishlist(product.id, e)}
            className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full shadow-xs transition z-10 ${
              isWishlisted 
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-xs font-semibold leading-tight h-8 line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {product.title}
        </h4>

        {/* Brand & Ratings */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 mb-1.5">
          <span className="font-medium truncate max-w-[80px]">{product.brand}</span>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-300 dark:text-slate-500">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-auto pt-1.5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm sm:text-base">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : product.freeDelivery ? (
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Free Delivery</span>
          ) : null}
        </div>

        {isOutOfStock ? (
          <button
            id={`add-to-cart-btn-${product.id}`}
            disabled
            className="w-full py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed flex items-center justify-center gap-1"
          >
            স্টক শেষ (OUT OF STOCK)
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              id={`quick-buy-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickBuy) onQuickBuy(product, e);
                else onSelectProduct(product);
              }}
              className="flex-1 py-2 px-2 rounded-lg text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs flex items-center justify-center gap-1 transition cursor-pointer"
              title="১-ক্লিক ফাস্ট অর্ডার"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />
              <span>এখনই কিনুন</span>
            </button>
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={(e) => onAddToCart(product, e)}
              className="py-2 px-2.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-center transition cursor-pointer"
              title="কার্টে যোগ করুন"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
