export const DEFAULT_CATEGORIES: string[] = [
  'Smartwatches & Wearables',
  'Power Banks',
  'Chargers & Cables',
  'Audio & Earbuds',
  'Cases & Covers',
  'Screen Protectors',
  'Holders & Mounts',
  'Gaming Accessories'
];

export type ProductCategory = 
  | 'All'
  | 'Smartwatches & Wearables'
  | 'Power Banks'
  | 'Chargers & Cables'
  | 'Audio & Earbuds'
  | 'Cases & Covers'
  | 'Screen Protectors'
  | 'Holders & Mounts'
  | 'Gaming Accessories'
  | (string & {});

export const CATEGORIES: ProductCategory[] = [
  'All',
  ...DEFAULT_CATEGORIES
];

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  specs: Record<string, string>;
  isFlashSale?: boolean;
  isDarazMall?: boolean;
  freeDelivery?: boolean;
  variants?: {
    name: string; // e.g. "Color" or "Model"
    options: string[];
  }[];
  reviews?: ProductReview[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Voucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  description: string;
  isActive: boolean;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'card' | 'easypaisa' | 'jazzcash' | 'cod' | 'bank';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  province?: string;
  address: string;
  landmark?: string;
  customerNote?: string;
  addressType?: 'Home' | 'Office';
}

export interface TrackingCheckpoint {
  title: string;
  location: string;
  time: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: {
    product: Product;
    quantity: number;
    selectedVariants?: Record<string, string>;
    priceAtPurchase: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending Verification' | 'Unpaid (COD)';
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedVoucher?: string;
  carrierName: string;
  estimatedDelivery: string;
  customerNote?: string;
  checkpoints: TrackingCheckpoint[];
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisitAt?: string;
}

export interface StoreConfig {
  storeName: string;
  phone: string;
  about: string;
  adminPassword?: string;
  updatedAt?: string;
}

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'KHAN GADGET MALL',
  phone: '01854774406',
  about: "Bangladesh's premium mobile accessories mall for fast chargers, MagSafe cases, earbuds, and gaming gear.",
  adminPassword: 'ESA006##'
};
