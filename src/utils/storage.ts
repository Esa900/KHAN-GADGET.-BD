import { Product, Order, Voucher, CartItem, OrderStatus, TrackingCheckpoint, DEFAULT_CATEGORIES } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_VOUCHERS } from '../data/mockData';

const PRODUCTS_KEY = 'khan_gadget_products_v2';
const DELETED_PRODUCT_IDS_KEY = 'khan_gadget_deleted_products_v2';
const ORDERS_KEY = 'khan_gadget_orders_v2';
const VOUCHERS_KEY = 'khan_gadget_vouchers_v2';
const CART_KEY = 'khan_gadget_cart_v2';
const WISHLIST_KEY = 'khan_gadget_wishlist_v2';
const RECENTLY_VIEWED_KEY = 'khan_gadget_recently_viewed_v1';
const CATEGORIES_KEY = 'khan_gadget_categories_v2';
const VISITOR_COUNT_KEY = 'khan_gadget_visitor_count_v1';
const VISITOR_ID_KEY = 'khan_gadget_visitor_id_v1';

export const STORE_WHATSAPP_NUMBER = '8801854774406';

export const getCourierTrackingUrl = (carrier: string = '', trackingNo: string = ''): string => {
  const code = encodeURIComponent(trackingNo.trim());
  const c = carrier.toLowerCase();
  if (c.includes('steadfast') || trackingNo.toUpperCase().startsWith('STD-') || trackingNo.toUpperCase().startsWith('STEAD-')) {
    return `https://steadfast.com.bd/t/${code}`;
  }
  if (c.includes('pathao')) {
    return `https://merchant.pathao.com/tracking?consignment_id=${code}`;
  }
  if (c.includes('redx')) {
    return `https://redx.com.bd/track?trackingId=${code}`;
  }
  if (c.includes('paperfly')) {
    return `https://paperfly.com.bd/tracking.php?code=${code}`;
  }
  if (c.includes('sundarban')) {
    return `https://sundarbancourierltd.com/`;
  }
  if (c.includes('ecourier')) {
    return `https://ecourier.com.bd/tracking?id=${code}`;
  }
  return `https://steadfast.com.bd/t/${code}`;
};

export const getRecentlyViewedIds = (): string[] => {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewedId = (productId: string): string[] => {
  try {
    const current = getRecentlyViewedIds().filter(id => id !== productId);
    const updated = [productId, ...current].slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const generateWhatsAppOrderUrl = (
  product: Product, 
  quantity: number = 1, 
  variants?: Record<string, string>
): string => {
  let message = `*নতুন অর্ডার রিকোয়েস্ট (Khan Gadget)*\n\n`;
  message += `📦 *পণ্য:* ${product.title}\n`;
  message += `💰 *মূল্য:* ৳ ${product.price.toLocaleString('en-BD')} (পরিমাণ: ${quantity})\n`;
  message += `🏷️ *ব্র্যান্ড:* ${product.brand} | *ক্যাটেগরি:* ${product.category}\n`;
  
  if (variants && Object.keys(variants).length > 0) {
    const variantStr = Object.entries(variants).map(([k, v]) => `${k}: ${v}`).join(', ');
    message += `🎨 *ভেরিয়েন্ট:* ${variantStr}\n`;
  }
  
  message += `\nআমি এই পণ্যটি ক্যাশ অন ডেলিভারিতে অর্ডার করতে চাই। দয়া করে বিস্তারিত জানিয়ে কনফার্ম করুন।`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateWhatsAppCartOrderUrl = (
  items: { title: string; price: number; quantity: number; variants?: Record<string, string> }[],
  total: number,
  customerName?: string,
  phone?: string,
  address?: string
): string => {
  let message = `*নতুন কার্ট অর্ডার (Khan Gadget)*\n\n`;
  if (customerName) message += `👤 *কাস্টমার:* ${customerName}\n`;
  if (phone) message += `📞 *ফোন:* ${phone}\n`;
  if (address) message += `📍 *ঠিকানা:* ${address}\n\n`;
  
  message += `🛍️ *অর্ডার আইটেম সমূহ:*\n`;
  items.forEach((it, idx) => {
    message += `${idx + 1}. ${it.title} (Qty: ${it.quantity}) - ৳ ${(it.price * it.quantity).toLocaleString('en-BD')}\n`;
  });
  
  message += `\n💵 *মোট প্রদেয়:* ৳ ${total.toLocaleString('en-BD')} (Cash on Delivery)\n`;
  message += `\nদয়া করে আমার অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const getDeletedProductIds = (): string[] => {
  try {
    const data = localStorage.getItem(DELETED_PRODUCT_IDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const deleteStoredProduct = (productId: string): Product[] => {
  try {
    const deletedIds = getDeletedProductIds();
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem(DELETED_PRODUCT_IDS_KEY, JSON.stringify(deletedIds));
    }
    const current = getStoredProducts();
    const filtered = current.filter(p => p.id !== productId);
    saveStoredProducts(filtered);
    return filtered;
  } catch (e) {
    console.error('Failed to delete stored product', e);
    return [];
  }
};

export const getStoredProducts = (): Product[] => {
  try {
    const deletedIds = getDeletedProductIds();
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      const initial = INITIAL_PRODUCTS.filter(p => !deletedIds.includes(p.id));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: Product[] = JSON.parse(data);
    if (!Array.isArray(parsed)) return INITIAL_PRODUCTS;
    // Strictly filter out any deleted products
    return parsed.filter(p => !deletedIds.includes(p.id));
  } catch (e) {
    console.error('Failed to get stored products', e);
    const deletedIds = getDeletedProductIds();
    return INITIAL_PRODUCTS.filter(p => !deletedIds.includes(p.id));
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get stored orders', e);
    return INITIAL_ORDERS;
  }
};

export const saveStoredOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
};

export const addStoredOrder = (newOrder: Order): void => {
  const currentOrders = getStoredOrders();
  const updated = [newOrder, ...currentOrders];
  saveStoredOrders(updated);

  // Decrement stock for ordered products
  const products = getStoredProducts();
  newOrder.items.forEach(item => {
    const target = products.find(p => p.id === item.product.id);
    if (target) {
      target.stock = Math.max(0, target.stock - item.quantity);
    }
  });
  saveStoredProducts(products);
};

export const updateOrderStatus = (orderId: string, status: OrderStatus, carrier?: string, note?: string): Order | null => {
  const orders = getStoredOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return null;

  const order = { ...orders[orderIndex] };
  order.status = status;
  if (carrier) order.carrierName = carrier;

  // Add new tracking checkpoint automatically
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  
  // Mark prior checkpoints completed
  const currentCheckpoints: TrackingCheckpoint[] = order.checkpoints.map(cp => ({
    ...cp,
    completed: true,
    current: false
  }));

  const newCheckpoint: TrackingCheckpoint = {
    title: `Status Updated to ${status}`,
    location: carrier ? `${carrier} Operations Hub` : 'KHAN GADGET Operations Center',
    time: timeStr,
    description: note || `Order updated to ${status}. Details logged in dispatch system.`,
    completed: true,
    current: true
  };

  order.checkpoints = [...currentCheckpoints, newCheckpoint];
  orders[orderIndex] = order;
  saveStoredOrders(orders);
  return order;
};

export const getStoredVouchers = (): Voucher[] => {
  try {
    const data = localStorage.getItem(VOUCHERS_KEY);
    if (!data) {
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(INITIAL_VOUCHERS));
      return INITIAL_VOUCHERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get vouchers', e);
    return INITIAL_VOUCHERS;
  }
};

export const saveStoredVouchers = (vouchers: Voucher[]): void => {
  try {
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
  } catch (e) {
    console.error('Failed to save vouchers', e);
  }
};

export const getStoredCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
};

export const getStoredWishlist = (): string[] => {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredWishlist = (wishlist: string[]): void => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
};

export const formatPrice = (amount: number): string => {
  return '৳ ' + (amount || 0).toLocaleString('en-BD');
};

// Categories Persistence
export const getStoredCategories = (): string[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading categories from storage:', err);
  }
  return [...DEFAULT_CATEGORIES];
};

export const saveStoredCategories = (categories: string[]): void => {
  try {
    const sanitized = Array.from(new Set(categories.map(c => c.trim()).filter(Boolean)));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Error saving categories to storage:', err);
  }
};

export const addStoredCategory = (categoryName: string): string[] => {
  const trimmed = categoryName.trim();
  if (!trimmed) return getStoredCategories();
  const current = getStoredCategories();
  if (!current.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...current, trimmed];
    saveStoredCategories(updated);
    return updated;
  }
  return current;
};

export const removeStoredCategory = (categoryName: string): string[] => {
  const current = getStoredCategories();
  const updated = current.filter(c => c.toLowerCase() !== categoryName.trim().toLowerCase());
  saveStoredCategories(updated);
  return updated;
};

export const renameStoredCategory = (oldName: string, newName: string): string[] => {
  const current = getStoredCategories();
  const trimmedNew = newName.trim();
  if (!trimmedNew) return current;
  const updated = current.map(c => c.toLowerCase() === oldName.trim().toLowerCase() ? trimmedNew : c);
  saveStoredCategories(updated);
  return updated;
};

// Website Visitors Persistence
export const getStoredVisitorCount = (): number => {
  try {
    const val = localStorage.getItem(VISITOR_COUNT_KEY);
    return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
  } catch {
    return 0;
  }
};

export const saveStoredVisitorCount = (count: number): void => {
  try {
    localStorage.setItem(VISITOR_COUNT_KEY, Math.max(0, count).toString());
  } catch (err) {
    console.error('Error saving visitor count:', err);
  }
};

export const getOrSetVisitorId = (): { id: string; isNew: boolean } => {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = 'vis_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      localStorage.setItem(VISITOR_ID_KEY, id);
      return { id, isNew: true };
    }
    return { id, isNew: false };
  } catch {
    return { id: 'vis_' + Date.now(), isNew: false };
  }
};

export const resetToDemoDefaults = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.removeItem(DELETED_PRODUCT_IDS_KEY);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(VOUCHERS_KEY, JSON.stringify(INITIAL_VOUCHERS));
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(WISHLIST_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  window.location.reload();
};
