import React, { useState, useEffect } from 'react';
import { History, Eye, ShoppingCart, Heart, ArrowRight, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { getRecentlyViewedIds, formatPrice } from '../utils/storage';

interface RecentlyViewedProps {
  allProducts: Product[];
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  allProducts,
  wishlist,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist
}) => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length > 0) {
      const matched = ids
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p));
      setViewedProducts(matched);
    } else {
      setViewedProducts([]);
    }
  }, [allProducts]);

  const handleClear = () => {
    localStorage.removeItem('khan_gadget_recently_viewed_v1');
    setViewedProducts([]);
  };

  if (viewedProducts.length === 0) return null;

  return (
    <div className="bg-white rounded border border-slate-200 p-3 sm:p-4 shadow-xs my-3">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <span>Recently Viewed Accessories</span>
              <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">(আপনি সম্প্রতি দেখেছেন)</span>
            </h3>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
            {viewedProducts.length} items
          </span>
        </div>

        <button
          onClick={handleClear}
          className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
          title="Clear browsing history"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Horizontal Scroller */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
        {viewedProducts.map((product) => {
          const isWish = wishlist.includes(product.id);
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-slate-50/70 hover:bg-white rounded border border-slate-200 hover:border-orange-400 p-2 transition flex flex-col justify-between cursor-pointer relative"
            >
              <div>
                <div className="relative aspect-square w-full rounded bg-white p-1 mb-1.5 flex items-center justify-center overflow-hidden border border-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => onToggleWishlist(product.id, e)}
                    className={`absolute bottom-1 right-1 p-1 rounded-full shadow-xs transition ${
                      isWish 
                        ? 'bg-rose-50 text-rose-600' 
                        : 'bg-white text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isWish ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                <h4 className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition">
                  {product.title}
                </h4>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span className="font-bold text-xs text-orange-600 font-mono">
                  {formatPrice(product.price)}
                </span>
                <button
                  disabled={isOutOfStock}
                  onClick={(e) => onAddToCart(product, e)}
                  className="p-1 rounded bg-orange-600 hover:bg-orange-500 text-white transition disabled:opacity-40"
                  title="Add to cart"
                >
                  <ShoppingCart className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
