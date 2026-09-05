import React, { useState, useEffect } from 'react';
import { 
  X, Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, 
  Heart, Zap, Check, MessageSquare, MapPin, Plus, Minus, MessageCircle, CheckCircle2 
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { formatPrice, addRecentlyViewedId, generateWhatsAppOrderUrl } from '../utils/storage';

interface ProductDetailModalProps {
  product: Product;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  onBuyNow: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  onToggleWishlist: (productId: string) => void;
  onAddReview: (productId: string, review: ProductReview) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onAddReview
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  // Delivery check state
  const [destinationCity, setDestinationCity] = useState('Dhaka');
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  // Track product in Recently Viewed list
  useEffect(() => {
    if (product?.id) {
      addRecentlyViewedId(product.id);
    }
  }, [product?.id]);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.image, product.id]);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleVariantSelect = (groupName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupName]: option
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev: ProductReview = {
      id: 'rev-' + Date.now(),
      author: reviewerName.trim(),
      rating: reviewerRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewerComment.trim(),
      verified: true
    };

    onAddReview(product.id, newRev);
    setReviewerName('');
    setReviewerComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            {product.isDarazMall && (
              <span className="bg-[#f85606] text-white text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                DarazMall Verified
              </span>
            )}
            <span className="text-xs text-gray-500 font-medium">SKU: {product.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Gallery Column */}
            <div>
              {/* Main Image Frame */}
              <div className="aspect-square bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center p-4 relative group">
                <img
                  src={selectedImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2 py-1 rounded-md shadow">
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg border-2 p-1 bg-gray-50 overflow-hidden shrink-0 transition ${
                        selectedImage === img ? 'border-[#f85606]' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`thumbnail-${idx}`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain" 
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Service Badges */}
              <div className="mt-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#f85606]" />
                  <span>100% Authentic Brand</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>7 Days Return Policy</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery Available</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Official Warranty Included</span>
                </div>
              </div>
            </div>

            {/* Product Meta Column */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>

                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-1 leading-snug">
                  {product.title}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-amber-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount} customer reviews)</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium ml-auto">
                    Verified Seller
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#f85606]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Inclusive of all applicable duties & taxes.
                  </p>
                </div>

                {/* Variant Selectors (e.g. Color, Model, Length) */}
                {product.variants && product.variants.map((vGroup) => (
                  <div key={vGroup.name} className="mb-3">
                    <div className="text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Select {vGroup.name}:</span>
                      <span className="text-[#f85606] font-semibold">{selectedVariants[vGroup.name]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vGroup.options.map((opt) => {
                        const active = selectedVariants[vGroup.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleVariantSelect(vGroup.name, opt)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                              active
                                ? 'border-[#f85606] bg-orange-50 text-[#f85606] font-bold shadow-xs'
                                : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity Selector */}
                <div className="my-4 flex items-center justify-between bg-gray-50 p-2.5 rounded-xl">
                  <div className="text-xs font-bold text-gray-700">Quantity:</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-gray-500 ml-2">
                      ({product.stock} units available)
                    </span>
                  </div>
                </div>

                {/* Delivery Checker */}
                <div className="border border-gray-200 rounded-xl p-3 mb-4 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f85606]" /> Delivery Options
                    </span>
                    <span className="text-emerald-700 font-bold">Standard 1-3 Days</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={destinationCity}
                      onChange={(e) => {
                        setDestinationCity(e.target.value);
                        setDeliveryChecked(true);
                      }}
                      className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1 text-xs bg-white focus:outline-none"
                    >
                      <option value="Dhaka">Dhaka (Same Day / Next Day)</option>
                      <option value="Chittagong">Chittagong (1-2 Days Express)</option>
                      <option value="Sylhet">Sylhet (1-2 Days)</option>
                      <option value="Rajshahi">Rajshahi (2 Days)</option>
                      <option value="Khulna">Khulna (2 Days)</option>
                      <option value="Barishal">Barishal (2-3 Days)</option>
                      <option value="Rangpur">Rangpur (2-3 Days)</option>
                      <option value="Comilla">Comilla (1-2 Days)</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {product.freeDelivery 
                      ? '🎉 Free Express Delivery eligible for this item!' 
                      : `Standard Courier delivery to ${destinationCity}: ৳ 149 (Free over ৳ 2,000)`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => onAddToCart(product, quantity, selectedVariants)}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 px-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#f85606] font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onBuyNow(product, quantity, selectedVariants)}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#f85606] hover:bg-[#e04a00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                      isWishlisted 
                        ? 'border-rose-300 bg-rose-50 text-rose-600' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Direct WhatsApp Order Button */}
                <a
                  href={generateWhatsAppOrderUrl(product, quantity, selectedVariants)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Order via WhatsApp (হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন)</span>
                </a>
              </div>

              {/* Trust & Guarantee Badges for Customer Confidence */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-800">১০০% অরিজিনাল</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-gray-800">৭ দিনের রিপ্লেসমেন্ট</span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg">
                  <Truck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="font-semibold text-gray-800">ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">
              Product Overview & Details
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specs Table */}
            {product.specs && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews & Feedback */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#f85606]" />
                  <span>Ratings & Verified Reviews</span>
                </h3>
                <p className="text-xs text-gray-500">Genuine feedback from verified gadget users in Bangladesh</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs bg-orange-50 border border-orange-200 text-[#f85606] font-bold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-orange-50/40 border border-orange-200 p-4 rounded-xl mb-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-800">Share your experience with this gadget</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Qureshi"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Your Rating</label>
                    <select
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                      <option value={2}>⭐⭐ (2 Stars - Below Average)</option>
                      <option value={1}>⭐ (1 Star - Poor)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block mb-1">Review Comments</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Tell other buyers about build quality, charging speed, packaging, etc."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="text-xs font-bold bg-[#f85606] text-white px-4 py-2 rounded-lg hover:bg-[#e04a00] transition"
                >
                  Post Review
                </button>
              </form>
            )}

            {/* Existing Reviews */}
            <div className="space-y-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>

                    <p className="text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to review this accessory!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
