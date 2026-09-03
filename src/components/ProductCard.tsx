import React from 'react';
import { Star, ShoppingCart, Eye, Heart, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/storage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct
}) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className={`group bg-white p-2 rounded border border-slate-200 shadow-sm hover:border-orange-400 hover:shadow transition flex flex-col justify-between relative cursor-pointer ${
        isOutOfStock ? 'opacity-65' : ''
      }`}
    >
      {/* Product Image Area */}
      <div>
        <div className="relative aspect-square w-full rounded bg-slate-100 mb-2 flex items-center justify-center p-2 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
            {product.isDarazMall && (
              <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                MALL
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
            className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full shadow-sm transition z-10 ${
              isWishlisted 
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-xs font-semibold leading-tight h-8 line-clamp-2 text-slate-800 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h4>

        {/* Brand & Ratings */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 mb-1.5">
          <span className="font-medium truncate max-w-[80px]">{product.brand}</span>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-300">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-auto pt-1.5 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-orange-600 font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : product.freeDelivery ? (
            <span className="text-[10px] text-emerald-600 font-medium">Free Ship</span>
          ) : null}
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          disabled={isOutOfStock}
          onClick={(e) => onAddToCart(product, e)}
          className={`w-full py-1.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isOutOfStock 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed text-[11px]'
              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-xs'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
        </button>
      </div>
    </div>
  );
};
