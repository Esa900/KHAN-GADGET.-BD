import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Voucher, OrderStatus, TrackingCheckpoint } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_VOUCHERS } from '../data/mockData';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredVouchers, 
  saveStoredVouchers,
  getDeletedProductIds
} from '../utils/storage';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const VOUCHERS_COLLECTION = 'vouchers';

// Helper to sanitize data by replacing undefined with null so Firestore doesn't throw unsupported field errors
export const cleanFirestoreData = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(cleanFirestoreData);
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      result[key] = cleanFirestoreData(val);
    } else {
      result[key] = null;
    }
  }
  return result;
};

// Check if products collection is empty and seed initial data to Firestore
export const seedInitialFirestoreData = async () => {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach(prod => {
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(ref, cleanFirestoreData(prod));
      });
      await batch.commit();
      console.log('Seeded initial products successfully');
    }

    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ORDERS.forEach(order => {
        const ref = doc(db, ORDERS_COLLECTION, order.id);
        batch.set(ref, cleanFirestoreData(order));
      });
      await batch.commit();
    }

    const vouchersSnap = await getDocs(collection(db, VOUCHERS_COLLECTION));
    if (vouchersSnap.empty) {
      console.log('Seeding initial vouchers to Firestore...');
      const batch = writeBatch(db);
      INITIAL_VOUCHERS.forEach(v => {
        const ref = doc(db, VOUCHERS_COLLECTION, v.code);
        batch.set(ref, cleanFirestoreData(v));
      });
      await batch.commit();
    }
  } catch (err) {
    console.error('Error seeding Firestore collections:', err);
  }
};

// Sort products so newest or custom-added products consistently appear first across all devices
export const sortProducts = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.createdAt && !b.createdAt) return -1;
    if (!a.createdAt && b.createdAt) return 1;

    // Check if ID contains timestamp e.g. kg-prod-174...
    const timeA = a.id.startsWith('kg-prod-') ? Number(a.id.replace('kg-prod-', '')) : 0;
    const timeB = b.id.startsWith('kg-prod-') ? Number(b.id.replace('kg-prod-', '')) : 0;
    if (!isNaN(timeA) && !isNaN(timeB) && timeA > 1000000 && timeB > 1000000) {
      return timeB - timeA;
    }
    if (!isNaN(timeA) && timeA > 1000000) return -1;
    if (!isNaN(timeB) && timeB > 1000000) return 1;

    return 0;
  });
};

// Broadcast channel for instantaneous cross-tab and cross-window sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('khan_gadget_sync_channel')
  : null;

export const broadcastSync = (type: 'PRODUCTS_UPDATED' | 'ORDERS_UPDATED' | 'VOUCHERS_UPDATED') => {
  try {
    syncChannel?.postMessage({ type, timestamp: Date.now() });
  } catch (e) {
    // Ignore if not supported
  }
};

// Direct one-time fetch of all products from Firestore (works reliably across mobile & desktop)
export const fetchRemoteProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snapshot.empty) {
      await seedInitialFirestoreData();
      const retrySnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const prods: Product[] = [];
      retrySnap.forEach(d => prods.push(d.data() as Product));
      if (prods.length > 0) {
        const sorted = sortProducts(prods);
        saveStoredProducts(sorted);
        return sorted;
      }
      return getStoredProducts();
    }
    const remoteProducts: Product[] = [];
    snapshot.forEach(docSnap => {
      remoteProducts.push(docSnap.data() as Product);
    });
    const sorted = sortProducts(remoteProducts);
    saveStoredProducts(sorted);
    return sorted;
  } catch (err) {
    console.error('Error fetching live products from cloud:', err);
    return getStoredProducts();
  }
};

// 1. Subscribe to Live Products across all devices (Mobile & Laptop)
export const subscribeToProducts = (onUpdate: (products: Product[]) => void) => {
  // First, deliver cached local products immediately for fast startup
  const local = getStoredProducts();
  if (local.length > 0) {
    onUpdate(sortProducts(local));
  }

  // Parallel direct fetch ensures other devices get fresh items immediately
  fetchRemoteProducts().then(prods => {
    if (prods && prods.length > 0) {
      onUpdate(prods);
    }
  }).catch(console.error);

  // Cross-tab broadcast listener for 0ms same-browser sync
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'PRODUCTS_UPDATED') {
      fetchRemoteProducts().then(onUpdate).catch(console.error);
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

  const unsubscribe = onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    async (snapshot) => {
      if (snapshot.empty) {
        await seedInitialFirestoreData();
        return;
      }
      const remoteProducts: Product[] = [];
      snapshot.forEach(docSnap => {
        remoteProducts.push(docSnap.data() as Product);
      });

      const sorted = sortProducts(remoteProducts);
      // Update local storage backup & notify UI
      saveStoredProducts(sorted);
      onUpdate(sorted);
    },
    (error) => {
      console.warn('Firestore live products listener fallback to local cache:', error);
      fetchRemoteProducts().then(onUpdate).catch(() => onUpdate(getStoredProducts()));
    }
  );

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
};

// 2. Add or Update a product in Firestore (Live Sync)
export const syncSaveProduct = async (product: Product): Promise<{ success: boolean; error?: string }> => {
  try {
    const sanitized = cleanFirestoreData(product);
    const ref = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(ref, sanitized);
    broadcastSync('PRODUCTS_UPDATED');
    console.log(`Successfully synced product ${product.id} to Firestore.`);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync save product to Firestore:', err);
    return { success: false, error: err?.message || 'Failed to save to cloud' };
  }
};

// 3. Delete product from Firestore (Live across all mobile & laptop devices)
export const syncDeleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(ref);
    broadcastSync('PRODUCTS_UPDATED');
    console.log(`Successfully deleted product ${productId} from Firestore.`);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete product from Firestore:', err);
    return { success: false, error: err?.message || 'Failed to delete from cloud' };
  }
};

// Direct one-time fetch of all orders from Firestore (works reliably across mobile & desktop)
export const fetchRemoteOrders = async (): Promise<Order[]> => {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    if (snapshot.empty) {
      await seedInitialFirestoreData();
      const retrySnap = await getDocs(collection(db, ORDERS_COLLECTION));
      const orders: Order[] = [];
      retrySnap.forEach(d => orders.push(d.data() as Order));
      if (orders.length > 0) {
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveStoredOrders(orders);
        return orders;
      }
      return getStoredOrders();
    }
    const remoteOrders: Order[] = [];
    snapshot.forEach(docSnap => {
      remoteOrders.push(docSnap.data() as Order);
    });
    remoteOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    saveStoredOrders(remoteOrders);
    return remoteOrders;
  } catch (err) {
    console.error('Error fetching live orders from cloud:', err);
    return getStoredOrders();
  }
};

// 4. Subscribe to Live Orders across all devices (Mobile & Laptop)
export const subscribeToOrders = (onUpdate: (orders: Order[]) => void) => {
  const local = getStoredOrders();
  if (local.length > 0) {
    onUpdate(local);
  }

  // Direct fetch ensures newly loaded devices get fresh orders immediately on boot
  fetchRemoteOrders().then(orders => {
    if (orders && orders.length > 0) {
      onUpdate(orders);
    }
  }).catch(console.error);

  const unsubscribe = onSnapshot(
    collection(db, ORDERS_COLLECTION),
    async (snapshot) => {
      if (snapshot.empty) {
        await seedInitialFirestoreData();
        return;
      }
      const remoteOrders: Order[] = [];
      snapshot.forEach(docSnap => {
        remoteOrders.push(docSnap.data() as Order);
      });
      // Sort newest first
      remoteOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveStoredOrders(remoteOrders);
      onUpdate(remoteOrders);
    },
    (error) => {
      console.warn('Firestore orders listener fallback to local cache:', error);
      fetchRemoteOrders().then(onUpdate).catch(() => onUpdate(getStoredOrders()));
    }
  );

  return unsubscribe;
};

// 5. Add an Order to Firestore (Live Sync with sanitized payload)
export const syncAddOrder = async (newOrder: Order): Promise<{ success: boolean; error?: string }> => {
  try {
    const sanitized = cleanFirestoreData(newOrder);
    const ref = doc(db, ORDERS_COLLECTION, newOrder.id);
    await setDoc(ref, sanitized);
    console.log(`Successfully synced order ${newOrder.id} to Firestore.`);

    // Also decrement stock in Firestore for each product safely
    for (const item of newOrder.items) {
      try {
        const prodRef = doc(db, PRODUCTS_COLLECTION, item.product.id);
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await setDoc(prodRef, { stock: newStock }, { merge: true });
      } catch (e) {
        console.error('Error updating stock for product:', item.product.id, e);
      }
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync order to Firestore:', err);
    return { success: false, error: err?.message || 'Failed to save order to cloud' };
  }
};

// 6. Update Order Status in Firestore (Live Sync)
export const syncUpdateOrderStatus = async (
  orderId: string, 
  status: OrderStatus, 
  carrier?: string, 
  note?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const orders = getStoredOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'Order not found' };

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
    const updatedCheckpoints: TrackingCheckpoint[] = [
      ...targetOrder.checkpoints.map(cp => ({ ...cp, completed: true, current: false })),
      {
        title: `Status Updated to ${status}`,
        location: carrier ? `${carrier} Operations Hub` : 'KHAN GADGET Operations Center',
        time: timeStr,
        description: note || `Order updated to ${status}. Details logged in dispatch system.`,
        completed: true,
        current: true
      }
    ];

    const updatedOrder: Order = {
      ...targetOrder,
      status,
      carrierName: carrier || targetOrder.carrierName,
      checkpoints: updatedCheckpoints
    };

    const sanitized = cleanFirestoreData(updatedOrder);
    const ref = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(ref, sanitized);
    console.log(`Order ${orderId} status updated to ${status} in Firestore.`);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update order status in Firestore:', err);
    return { success: false, error: err?.message || 'Failed to update order in cloud' };
  }
};

// 7. Subscribe to Live Vouchers
export const subscribeToVouchers = (onUpdate: (vouchers: Voucher[]) => void) => {
  const local = getStoredVouchers();
  if (local.length > 0) {
    onUpdate(local);
  }

  const unsubscribe = onSnapshot(
    collection(db, VOUCHERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const remoteVouchers: Voucher[] = [];
        snapshot.forEach(docSnap => {
          remoteVouchers.push(docSnap.data() as Voucher);
        });
        saveStoredVouchers(remoteVouchers);
        onUpdate(remoteVouchers);
      }
    },
    (error) => {
      console.warn('Firestore vouchers listener fallback to local cache:', error);
      onUpdate(getStoredVouchers());
    }
  );

  return unsubscribe;
};

// 8. Save or Delete Voucher in Firestore
export const syncSaveVoucher = async (voucher: Voucher): Promise<void> => {
  try {
    const ref = doc(db, VOUCHERS_COLLECTION, voucher.code);
    await setDoc(ref, voucher);
  } catch (err) {
    console.error('Failed to sync voucher to Firestore:', err);
  }
};

export const syncDeleteVoucher = async (code: string): Promise<void> => {
  try {
    const ref = doc(db, VOUCHERS_COLLECTION, code);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Failed to delete voucher from Firestore:', err);
  }
};

// 9. Reset all data in Firestore to Initial Demo State across all devices
export const syncResetToDemoDefaults = async (): Promise<void> => {
  try {
    // Delete existing products from Firestore
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const batch1 = writeBatch(db);
    productsSnap.forEach(d => batch1.delete(d.ref));
    await batch1.commit();

    // Re-seed default products
    const batch2 = writeBatch(db);
    INITIAL_PRODUCTS.forEach(p => {
      batch2.set(doc(db, PRODUCTS_COLLECTION, p.id), p);
    });
    await batch2.commit();

    // Reset orders
    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    const batch3 = writeBatch(db);
    ordersSnap.forEach(d => batch3.delete(d.ref));
    INITIAL_ORDERS.forEach(o => {
      batch3.set(doc(db, ORDERS_COLLECTION, o.id), o);
    });
    await batch3.commit();

    // Reset vouchers
    const vouchersSnap = await getDocs(collection(db, VOUCHERS_COLLECTION));
    const batch4 = writeBatch(db);
    vouchersSnap.forEach(d => batch4.delete(d.ref));
    INITIAL_VOUCHERS.forEach(v => {
      batch4.set(doc(db, VOUCHERS_COLLECTION, v.code), v);
    });
    await batch4.commit();
  } catch (e) {
    console.error('Failed to reset Firestore to demo defaults:', e);
  }
};

