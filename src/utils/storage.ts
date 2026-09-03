import { Product, Order, Voucher, CartItem, OrderStatus, TrackingCheckpoint } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_VOUCHERS } from '../data/mockData';

const PRODUCTS_KEY = 'khan_gadget_products_v1';
const ORDERS_KEY = 'khan_gadget_orders_v1';
const VOUCHERS_KEY = 'khan_gadget_vouchers_v1';
const CART_KEY = 'khan_gadget_cart_v1';
const WISHLIST_KEY = 'khan_gadget_wishlist_v1';

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get stored products', e);
    return INITIAL_PRODUCTS;
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
  return 'Rs. ' + amount.toLocaleString('en-PK');
};

export const resetToDemoDefaults = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(VOUCHERS_KEY, JSON.stringify(INITIAL_VOUCHERS));
  localStorage.removeItem(CART_KEY);
  window.location.reload();
};
