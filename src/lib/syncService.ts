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

// Check if products collection is empty and seed initial data to Firestore
export const seedInitialFirestoreData = async () => {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach(prod => {
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(ref, prod);
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
        batch.set(ref, order);
      });
      await batch.commit();
    }

    const vouchersSnap = await getDocs(collection(db, VOUCHERS_COLLECTION));
    if (vouchersSnap.empty) {
      console.log('Seeding initial vouchers to Firestore...');
      const batch = writeBatch(db);
      INITIAL_VOUCHERS.forEach(v => {
        const ref = doc(db, VOUCHERS_COLLECTION, v.code);
        batch.set(ref, v);
      });
      await batch.commit();
    }
  } catch (err) {
    console.error('Error seeding Firestore collections:', err);
  }
};

// 1. Subscribe to Live Products across all devices (Mobile & Laptop)
export const subscribeToProducts = (onUpdate: (products: Product[]) => void) => {
  // First, deliver cached local products immediately for fast startup
  const local = getStoredProducts();
  if (local.length > 0) {
    onUpdate(local);
  }

  const unsubscribe = onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    async (snapshot) => {
      if (snapshot.empty) {
        // If collection was completely empty on first launch, seed it
        await seedInitialFirestoreData();
        return;
      }
      const remoteProducts: Product[] = [];
      snapshot.forEach(docSnap => {
        remoteProducts.push(docSnap.data() as Product);
      });

      // Filter out any locally tombstoned items just in case
      const deletedIds = getDeletedProductIds();
      const filtered = remoteProducts.filter(p => !deletedIds.includes(p.id));

      // Update local storage backup & notify UI
      saveStoredProducts(filtered);
      onUpdate(filtered);
    },
    (error) => {
      console.warn('Firestore live products listener fallback to local cache:', error);
      onUpdate(getStoredProducts());
    }
  );

  return unsubscribe;
};

// 2. Add or Update a product in Firestore (Live Sync)
export const syncSaveProduct = async (product: Product): Promise<void> => {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(ref, product);
  } catch (err) {
    console.error('Failed to sync save product to Firestore:', err);
  }
};

// 3. Delete product from Firestore (Live across all mobile & laptop devices)
export const syncDeleteProduct = async (productId: string): Promise<void> => {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
  }
};

// 4. Subscribe to Live Orders across all devices
export const subscribeToOrders = (onUpdate: (orders: Order[]) => void) => {
  const local = getStoredOrders();
  if (local.length > 0) {
    onUpdate(local);
  }

  const unsubscribe = onSnapshot(
    collection(db, ORDERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const remoteOrders: Order[] = [];
        snapshot.forEach(docSnap => {
          remoteOrders.push(docSnap.data() as Order);
        });
        // Sort newest first
        remoteOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveStoredOrders(remoteOrders);
        onUpdate(remoteOrders);
      }
    },
    (error) => {
      console.warn('Firestore orders listener fallback to local cache:', error);
      onUpdate(getStoredOrders());
    }
  );

  return unsubscribe;
};

// 5. Add an Order to Firestore (Live Sync)
export const syncAddOrder = async (newOrder: Order): Promise<void> => {
  try {
    const ref = doc(db, ORDERS_COLLECTION, newOrder.id);
    await setDoc(ref, newOrder);

    // Also decrement stock in Firestore for each product
    for (const item of newOrder.items) {
      try {
        const prodRef = doc(db, PRODUCTS_COLLECTION, item.product.id);
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await setDoc(prodRef, { ...item.product, stock: newStock }, { merge: true });
      } catch (e) {
        console.error('Error updating stock for product:', item.product.id, e);
      }
    }
  } catch (err) {
    console.error('Failed to sync order to Firestore:', err);
  }
};

// 6. Update Order Status in Firestore (Live Sync)
export const syncUpdateOrderStatus = async (
  orderId: string, 
  status: OrderStatus, 
  carrier?: string, 
  note?: string
): Promise<void> => {
  try {
    const orders = getStoredOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

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

    const ref = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(ref, updatedOrder);
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
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

