import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Voucher, OrderStatus, TrackingCheckpoint, AnalyticsData, DEFAULT_CATEGORIES, StoreConfig, DEFAULT_STORE_CONFIG } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_VOUCHERS } from '../data/mockData';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredVouchers, 
  saveStoredVouchers,
  getDeletedProductIds,
  getStoredCategories,
  saveStoredCategories,
  getDeletedCategoryNames,
  markCategoryDeleted,
  unmarkCategoryDeleted,
  getStoredVisitorCount,
  saveStoredVisitorCount,
  getOrSetVisitorId,
  getStoredStoreConfig,
  saveStoredStoreConfig,
  BASE_VISITOR_COUNT
} from '../utils/storage';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const VOUCHERS_COLLECTION = 'vouchers';
const SETTINGS_COLLECTION = 'settings';
const CATEGORIES_DOC = 'categories';
const ANALYTICS_DOC = 'analytics';
const STORE_CONFIG_DOC = 'store_config';

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

    // Ensure categories document exists in settings collection
    const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    const catSnap = await getDoc(catRef);
    if (!catSnap.exists() || !catSnap.data()?.list || catSnap.data()?.list.length === 0) {
      const stored = getStoredCategories();
      const initialCats = Array.from(new Set([...DEFAULT_CATEGORIES, ...stored]));
      await setDoc(catRef, {
        list: initialCats,
        updatedAt: new Date().toISOString()
      });
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

export const broadcastSync = (type: 'PRODUCTS_UPDATED' | 'ORDERS_UPDATED' | 'VOUCHERS_UPDATED' | 'CATEGORIES_UPDATED' | 'ANALYTICS_UPDATED' | 'STORE_CONFIG_UPDATED') => {
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

    // If product has a category, make sure this category is recorded in settings/categories in Firestore UNLESS it's deleted
    if (product.category && product.category !== 'All') {
      const deletedCats = getDeletedCategoryNames();
      if (!deletedCats.some(d => d.toLowerCase() === product.category.toLowerCase())) {
        try {
          const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
          const catSnap = await getDoc(catRef);
          let list: string[] = [];
          if (catSnap.exists() && Array.isArray(catSnap.data()?.list)) {
            list = catSnap.data().list;
          } else {
            list = getStoredCategories();
          }
          if (!list.some(c => c.toLowerCase() === product.category.toLowerCase())) {
            const updatedList = [...list, product.category];
            await setDoc(catRef, { list: updatedList, updatedAt: new Date().toISOString() }, { merge: true });
            saveStoredCategories(updatedList);
            broadcastSync('CATEGORIES_UPDATED');
            console.log(`Auto-added category "${product.category}" to Firestore categories.`);
          }
        } catch (catErr) {
          console.warn('Failed to auto-update categories for product:', catErr);
        }
      }
    }

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

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'ORDERS_UPDATED') {
      fetchRemoteOrders().then(onUpdate).catch(console.error);
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

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

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
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

    broadcastSync('ORDERS_UPDATED');
    broadcastSync('PRODUCTS_UPDATED');
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
    let targetOrder = orders.find(o => o.id === orderId);

    // If order was placed on another device and not yet in local storage, fetch from Firestore
    if (!targetOrder) {
      try {
        const docSnap = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
        if (docSnap.exists()) {
          targetOrder = docSnap.data() as Order;
        }
      } catch (e) {
        console.warn('Could not query single order from firestore:', e);
      }
    }

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
    broadcastSync('ORDERS_UPDATED');
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

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'VOUCHERS_UPDATED') {
      onUpdate(getStoredVouchers());
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

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

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
};

// 8. Save or Delete Voucher in Firestore
export const syncSaveVoucher = async (voucher: Voucher): Promise<void> => {
  try {
    const ref = doc(db, VOUCHERS_COLLECTION, voucher.code);
    await setDoc(ref, cleanFirestoreData(voucher));
    broadcastSync('VOUCHERS_UPDATED');
  } catch (err) {
    console.error('Failed to sync voucher to Firestore:', err);
  }
};

export const syncDeleteVoucher = async (code: string): Promise<void> => {
  try {
    const ref = doc(db, VOUCHERS_COLLECTION, code);
    await deleteDoc(ref);
    broadcastSync('VOUCHERS_UPDATED');
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

    // Reset categories doc in Firestore
    const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    await setDoc(catRef, { list: getStoredCategories(), updatedAt: new Date().toISOString() });
    broadcastSync('CATEGORIES_UPDATED');
  } catch (e) {
    console.error('Failed to reset Firestore to demo defaults:', e);
  }
};

// 10. Categories Cloud Sync Functions
export const fetchRemoteCategories = async (): Promise<string[]> => {
  try {
    const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    const snap = await getDoc(catRef);
    if (snap.exists()) {
      const data = snap.data();
      const deletedList: string[] = Array.isArray(data.deletedList) ? data.deletedList : [];
      deletedList.forEach(d => markCategoryDeleted(d));

      if (data && Array.isArray(data.list) && data.list.length > 0) {
        const cleaned = Array.from(
          new Set(
            data.list
              .map((c: any) => (typeof c === 'string' ? c.trim() : ''))
              .filter(c => Boolean(c) && !deletedList.some(d => d.toLowerCase() === c.toLowerCase()))
          )
        );
        saveStoredCategories(cleaned);
        return cleaned;
      }
    } else {
      // Document doesn't exist yet; initialize with local categories
      const initial = getStoredCategories();
      await setDoc(catRef, { 
        list: initial, 
        deletedList: getDeletedCategoryNames(), 
        updatedAt: new Date().toISOString() 
      });
      saveStoredCategories(initial);
      return initial;
    }
  } catch (err) {
    console.warn('Failed to fetch remote categories from Firestore, using local:', err);
  }
  return getStoredCategories();
};

export const subscribeToCategories = (onUpdate: (cats: string[]) => void): (() => void) => {
  const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);

  // Instant direct fetch so other devices immediately receive categories on mount
  fetchRemoteCategories().then((cats) => {
    if (cats && cats.length > 0) {
      onUpdate(cats);
    }
  }).catch(console.error);

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'CATEGORIES_UPDATED') {
      onUpdate(getStoredCategories());
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

  const unsubscribe = onSnapshot(
    catRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const deletedList: string[] = Array.isArray(data.deletedList) ? data.deletedList : [];
        deletedList.forEach(d => markCategoryDeleted(d));

        if (data && Array.isArray(data.list)) {
          const remoteList = Array.from(
            new Set(
              data.list
                .map((c: any) => (typeof c === 'string' ? c.trim() : ''))
                .filter(c => Boolean(c) && !deletedList.some(d => d.toLowerCase() === c.toLowerCase()))
            )
          );
          saveStoredCategories(remoteList);
          onUpdate(remoteList);
          return;
        }
      }
      onUpdate(getStoredCategories());
    },
    (error) => {
      console.warn('Firestore live categories listener fallback to local cache:', error);
      fetchRemoteCategories().then(onUpdate).catch(() => onUpdate(getStoredCategories()));
    }
  );

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
};

export const syncSaveCategories = async (
  categories: string[],
  deletedCategories?: string[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    const deletedList = Array.from(new Set([...getDeletedCategoryNames(), ...(deletedCategories || [])]));
    const sanitized = Array.from(
      new Set(
        categories
          .map(c => (typeof c === 'string' ? c.trim() : ''))
          .filter(c => Boolean(c) && !deletedList.some(d => d.toLowerCase() === c.toLowerCase()))
      )
    );
    saveStoredCategories(sanitized);

    const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    await setDoc(catRef, {
      list: sanitized,
      deletedList,
      updatedAt: new Date().toISOString()
    });
    broadcastSync('CATEGORIES_UPDATED');
    console.log('Successfully synced categories to Firestore cloud:', sanitized);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync categories to Firestore:', err);
    return { success: false, error: err?.message || 'Failed to save categories to cloud' };
  }
};

export const syncDeleteCategory = async (categoryName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const trimmed = categoryName.trim();
    if (!trimmed) return { success: false, error: 'Empty category name' };

    markCategoryDeleted(trimmed);

    const catRef = doc(db, SETTINGS_COLLECTION, CATEGORIES_DOC);
    const snap = await getDoc(catRef);

    let currentList: string[] = [];
    let currentDeleted: string[] = [];

    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.list)) currentList = data.list;
      if (Array.isArray(data.deletedList)) currentDeleted = data.deletedList;
    } else {
      currentList = getStoredCategories();
    }

    const updatedList = currentList.filter(c => c.toLowerCase() !== trimmed.toLowerCase());
    const updatedDeleted = Array.from(new Set([...currentDeleted, trimmed.toLowerCase(), ...getDeletedCategoryNames()]));

    saveStoredCategories(updatedList);

    await setDoc(catRef, {
      list: updatedList,
      deletedList: updatedDeleted,
      updatedAt: new Date().toISOString()
    });

    // Update any products in Firestore whose category was this deleted category to a safe fallback
    const fallbackCategory = updatedList[0] || 'Chargers & Cables';
    try {
      const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const batch = writeBatch(db);
      let batchCount = 0;

      productsSnap.forEach(docSnap => {
        const prodData = docSnap.data() as Product;
        if (prodData.category && prodData.category.toLowerCase() === trimmed.toLowerCase()) {
          batch.update(docSnap.ref, { category: fallbackCategory });
          batchCount++;
        }
      });

      if (batchCount > 0) {
        await batch.commit();
        console.log(`Updated ${batchCount} products in Firestore from deleted category "${trimmed}" to "${fallbackCategory}"`);
        broadcastSync('PRODUCTS_UPDATED');
      }
    } catch (prodErr) {
      console.warn('Failed to batch update products for deleted category:', prodErr);
    }

    broadcastSync('CATEGORIES_UPDATED');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync delete category from Firestore:', err);
    return { success: false, error: err?.message || 'Failed to delete category' };
  }
};

// Sync all local products and categories to Firestore cloud
export const syncAllLocalToCloud = async (): Promise<{ success: boolean; productsCount: number; categoriesCount: number; message: string }> => {
  try {
    const localProducts = getStoredProducts();
    const localCategories = getStoredCategories();
    const deletedIds = getDeletedProductIds();

    // 1. Sync Categories without resurrecting deleted categories
    await syncSaveCategories(localCategories, getDeletedCategoryNames());

    // 2. Sync all local non-deleted products
    let syncedProds = 0;
    for (const prod of localProducts) {
      if (!deletedIds.includes(prod.id)) {
        await syncSaveProduct(prod);
        syncedProds++;
      }
    }

    // 3. Sync all local vouchers
    const localVouchers = getStoredVouchers();
    for (const v of localVouchers) {
      await syncSaveVoucher(v).catch(() => {});
    }

    // 4. Sync all local orders
    const localOrders = getStoredOrders();
    for (const o of localOrders) {
      try {
        const orderRef = doc(db, ORDERS_COLLECTION, o.id);
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
          await setDoc(orderRef, cleanFirestoreData(o));
        }
      } catch (e) {
        // Continue if single order fails
      }
    }

    return {
      success: true,
      productsCount: syncedProds,
      categoriesCount: localCategories.length,
      message: `Successfully synchronized ${syncedProds} products and ${localCategories.length} categories with cloud database!`
    };
  } catch (err: any) {
    console.error('Failed to sync all local data to cloud:', err);
    return {
      success: false,
      productsCount: 0,
      categoriesCount: 0,
      message: err?.message || 'Cloud sync failed'
    };
  }
};

// Website Visits & Traffic Analytics (Starts at baseline 8,734 views)
export const recordWebsiteVisit = async (): Promise<AnalyticsData> => {
  const { isNew } = getOrSetVisitorId();
  const currentLocal = getStoredVisitorCount();
  const newLocal = Math.max(BASE_VISITOR_COUNT, currentLocal + 1);
  saveStoredVisitorCount(newLocal);

  try {
    const analyticsRef = doc(db, SETTINGS_COLLECTION, ANALYTICS_DOC);
    const snapBefore = await getDoc(analyticsRef);
    if (!snapBefore.exists()) {
      // First time initialization on Firestore with baseline 8,734
      await setDoc(analyticsRef, {
        totalVisits: BASE_VISITOR_COUNT,
        uniqueVisitors: BASE_VISITOR_COUNT,
        lastVisitAt: new Date().toISOString()
      });
    } else {
      const payload: Record<string, any> = {
        totalVisits: increment(1),
        lastVisitAt: new Date().toISOString()
      };
      if (isNew) {
        payload.uniqueVisitors = increment(1);
      }
      await setDoc(analyticsRef, payload, { merge: true });
    }

    const snap = await getDoc(analyticsRef);
    if (snap.exists()) {
      const data = snap.data();
      const rawTotal = Number(data.totalVisits) || newLocal;
      const rawUnique = Number(data.uniqueVisitors) || 0;
      const total = Math.max(BASE_VISITOR_COUNT, rawTotal);
      const unique = Math.max(BASE_VISITOR_COUNT, rawUnique >= BASE_VISITOR_COUNT ? rawUnique : (BASE_VISITOR_COUNT + rawUnique));
      saveStoredVisitorCount(total);
      broadcastSync('ANALYTICS_UPDATED');
      return { totalVisits: total, uniqueVisitors: unique, lastVisitAt: data.lastVisitAt };
    }
  } catch (err) {
    console.warn('Could not record visit to Firestore cloud:', err);
  }

  return { totalVisits: newLocal, uniqueVisitors: BASE_VISITOR_COUNT, lastVisitAt: new Date().toISOString() };
};

export const fetchRemoteAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const analyticsRef = doc(db, SETTINGS_COLLECTION, ANALYTICS_DOC);
    const snap = await getDoc(analyticsRef);
    if (snap.exists()) {
      const data = snap.data();
      const rawTotal = Number(data.totalVisits) || getStoredVisitorCount();
      const rawUnique = Number(data.uniqueVisitors) || 0;
      const total = Math.max(BASE_VISITOR_COUNT, rawTotal);
      const unique = Math.max(BASE_VISITOR_COUNT, rawUnique >= BASE_VISITOR_COUNT ? rawUnique : (BASE_VISITOR_COUNT + rawUnique));
      saveStoredVisitorCount(total);
      return { totalVisits: total, uniqueVisitors: unique, lastVisitAt: data.lastVisitAt };
    }
  } catch (err) {
    console.warn('Could not fetch analytics from Firestore:', err);
  }
  return { totalVisits: getStoredVisitorCount(), uniqueVisitors: BASE_VISITOR_COUNT };
};

export const subscribeToAnalytics = (onUpdate: (data: AnalyticsData) => void): (() => void) => {
  const analyticsRef = doc(db, SETTINGS_COLLECTION, ANALYTICS_DOC);

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'ANALYTICS_UPDATED') {
      fetchRemoteAnalytics().then(onUpdate);
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

  const unsubscribe = onSnapshot(
    analyticsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const rawTotal = Number(data.totalVisits) || getStoredVisitorCount();
        const rawUnique = Number(data.uniqueVisitors) || 0;
        const total = Math.max(BASE_VISITOR_COUNT, rawTotal);
        const unique = Math.max(BASE_VISITOR_COUNT, rawUnique >= BASE_VISITOR_COUNT ? rawUnique : (BASE_VISITOR_COUNT + rawUnique));
        saveStoredVisitorCount(total);
        onUpdate({ totalVisits: total, uniqueVisitors: unique, lastVisitAt: data.lastVisitAt });
      }
    },
    (error) => {
      console.warn('Firestore analytics subscription error:', error);
      onUpdate({ totalVisits: getStoredVisitorCount(), uniqueVisitors: BASE_VISITOR_COUNT });
    }
  );

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
};

// Store Controls & Settings Cloud Synchronization
export const fetchRemoteStoreConfig = async (): Promise<StoreConfig> => {
  try {
    const configRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      const data = snap.data();
      const merged: StoreConfig = {
        storeName: data.storeName || DEFAULT_STORE_CONFIG.storeName,
        phone: data.phone || DEFAULT_STORE_CONFIG.phone,
        about: data.about || DEFAULT_STORE_CONFIG.about,
        adminPassword: data.adminPassword || DEFAULT_STORE_CONFIG.adminPassword,
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      saveStoredStoreConfig(merged);
      return merged;
    } else {
      // Document doesn't exist yet, initialize it on Firestore
      const initial = getStoredStoreConfig();
      await setDoc(configRef, cleanFirestoreData(initial));
      return initial;
    }
  } catch (err) {
    console.warn('Could not fetch store config from Firestore:', err);
    return getStoredStoreConfig();
  }
};

export const syncSaveStoreConfig = async (
  config: Partial<StoreConfig>
): Promise<{ success: boolean; config: StoreConfig; error?: string }> => {
  const updatedLocal = saveStoredStoreConfig(config);
  try {
    const configRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    await setDoc(configRef, cleanFirestoreData(updatedLocal), { merge: true });
    broadcastSync('STORE_CONFIG_UPDATED');
    return { success: true, config: updatedLocal };
  } catch (err: any) {
    console.error('Failed to sync store config to Firestore:', err);
    return { success: false, config: updatedLocal, error: err?.message || 'Failed to save to cloud' };
  }
};

export const subscribeToStoreConfig = (onUpdate: (config: StoreConfig) => void): (() => void) => {
  const configRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'STORE_CONFIG_UPDATED') {
      fetchRemoteStoreConfig().then(onUpdate);
    }
  };
  syncChannel?.addEventListener('message', handleBroadcast);

  const unsubscribe = onSnapshot(
    configRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const merged: StoreConfig = {
          storeName: data.storeName || DEFAULT_STORE_CONFIG.storeName,
          phone: data.phone || DEFAULT_STORE_CONFIG.phone,
          about: data.about || DEFAULT_STORE_CONFIG.about,
          adminPassword: data.adminPassword || DEFAULT_STORE_CONFIG.adminPassword,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
        saveStoredStoreConfig(merged);
        onUpdate(merged);
      }
    },
    (error) => {
      console.warn('Firestore store config subscription error:', error);
      onUpdate(getStoredStoreConfig());
    }
  );

  return () => {
    unsubscribe();
    syncChannel?.removeEventListener('message', handleBroadcast);
  };
};

