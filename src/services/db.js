import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Local storage fallback keys
const STORAGE_KEYS = {
  ORDERS: 'kiki-bakery-orders-v2',
  RESERVATIONS: 'kiki-bakery-reservations-v2',
  CUSTOM: 'kiki-bakery-custom-v2',
};

// Clean object of undefined values which Firestore rejects
const sanitize = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === undefined ? null : value))
  );
};

const getLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveLocal = (key, item) => {
  try {
    const list = getLocal(key);
    list.unshift(item);
    localStorage.setItem(key, JSON.stringify(list));
    return item;
  } catch (err) {
    console.error('Local save error:', err);
    return item;
  }
};

const updateLocal = (key, id, updates) => {
  try {
    const list = getLocal(key);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(key, JSON.stringify(updated));
    return updated.find((i) => i.id === id);
  } catch (err) {
    console.error('Local update error:', err);
    return null;
  }
};

/**
 * Orders (Backpack checkout)
 */
export async function createOrder(orderPayload, user = null) {
  const cleanCustomer = {
    name: orderPayload.customer?.name || user?.displayName || 'Guest Baker',
    phone: orderPayload.customer?.phone || '',
    address: orderPayload.customer?.address || 'Pickup from bakery counter',
    email: user?.email || orderPayload.customer?.email || '',
  };

  const orderDoc = sanitize({
    items: orderPayload.items || [],
    total: Number(orderPayload.total) || 0,
    city: orderPayload.city || 'Pune',
    notes: orderPayload.notes || '',
    paymentMethod: orderPayload.paymentMethod || 'Cash/UPI on Delivery',
    customer: cleanCustomer,
    userId: user?.uid || 'guest',
    userEmail: user?.email || cleanCustomer.email || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Baking',
  });

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderDoc,
        timestamp: serverTimestamp(),
      });
      console.log('✅ Order saved to Cloud Firestore with ID:', docRef.id);
      return { id: docRef.id, ...orderDoc };
    } catch (err) {
      console.error('❌ Firestore createOrder failed:', err.code, err.message);
      if (err.code === 'permission-denied') {
        console.warn('⚠️ FIRESTORE PERMISSION DENIED: Make sure your Firestore Security Rules allow read/write in Firebase Console > Firestore Database > Rules.');
      }
    }
  }

  // Fallback to local storage
  console.info('💾 Saving order to local browser storage fallback');
  const localOrder = { id: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...orderDoc };
  saveLocal(STORAGE_KEYS.ORDERS, localOrder);
  return localOrder;
}

export async function getUserOrders(userId = null) {
  if (isFirebaseConfigured && db && userId && userId !== 'guest') {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getUserOrders error:', err.code, err.message);
    }
  }

  const all = getLocal(STORAGE_KEYS.ORDERS);
  if (!userId) return all;
  return all.filter((o) => o.userId === userId || o.userId === 'guest');
}

export async function getAllOrders() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      if (!snapshot.empty) {
        const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(`📦 Loaded ${orders.length} orders from Cloud Firestore`);
        return orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } else {
        console.log('📦 Firestore orders collection is currently empty');
      }
    } catch (err) {
      console.error('❌ Firestore getAllOrders failed:', err.code, err.message);
      if (err.code === 'permission-denied') {
        console.warn('⚠️ FIRESTORE RULES ERROR: Check Firebase Console > Firestore Database > Rules');
      }
    }
  }
  return getLocal(STORAGE_KEYS.ORDERS);
}

// Real-time listener for Admin orders
export function subscribeAllOrders(callback) {
  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, 'orders');
      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      }, (err) => {
        console.warn('Firestore orders subscription error:', err.message);
        callback(getLocal(STORAGE_KEYS.ORDERS));
      });
    } catch (e) {
      callback(getLocal(STORAGE_KEYS.ORDERS));
      return () => {};
    }
  }
  callback(getLocal(STORAGE_KEYS.ORDERS));
  return () => {};
}

export async function updateOrderStatus(orderId, status) {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, { status });
      console.log(`✅ Updated order ${orderId} status to ${status} in Firestore`);
      return { id: orderId, status };
    } catch (err) {
      console.error('❌ Firestore updateOrderStatus failed:', err.code, err.message);
    }
  }
  return updateLocal(STORAGE_KEYS.ORDERS, orderId, { status });
}

/**
 * Table Reservations
 */
export async function createReservation(resPayload, user = null) {
  const resDoc = sanitize({
    customerName: resPayload.customerName || user?.displayName || 'Walk-in Guest',
    customerContact: resPayload.customerContact || user?.email || '',
    city: resPayload.city || 'Pune',
    guests: resPayload.guests || '2',
    date: resPayload.date || new Date().toISOString(),
    notes: resPayload.notes || '',
    userId: user?.uid || 'guest',
    userEmail: user?.email || resPayload.email || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
  });

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        ...resDoc,
        timestamp: serverTimestamp(),
      });
      console.log('✅ Reservation saved to Cloud Firestore with ID:', docRef.id);
      return { id: docRef.id, ...resDoc };
    } catch (err) {
      console.error('❌ Firestore createReservation failed:', err.code, err.message);
    }
  }

  const localRes = { id: 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...resDoc };
  saveLocal(STORAGE_KEYS.RESERVATIONS, localRes);
  return localRes;
}

export async function getUserReservations(userId = null) {
  if (isFirebaseConfigured && db && userId && userId !== 'guest') {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getUserReservations error:', err.message);
    }
  }

  const all = getLocal(STORAGE_KEYS.RESERVATIONS);
  if (!userId) return all;
  return all.filter((r) => r.userId === userId || r.userId === 'guest');
}

export async function getAllReservations() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'reservations'));
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    } catch (err) {
      console.error('❌ Firestore getAllReservations error:', err.code, err.message);
    }
  }
  return getLocal(STORAGE_KEYS.RESERVATIONS);
}

export async function updateReservationStatus(resId, status) {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'reservations', resId);
      await updateDoc(ref, { status });
      return { id: resId, status };
    } catch (err) {
      console.error('❌ Firestore updateReservationStatus error:', err.message);
    }
  }
  return updateLocal(STORAGE_KEYS.RESERVATIONS, resId, { status });
}

/**
 * Custom Orders (Quotes)
 */
export async function createCustomOrder(customPayload, user = null) {
  const customDoc = sanitize({
    name: customPayload.name || user?.displayName || 'Customer',
    contact: customPayload.contact || user?.email || '',
    type: customPayload.type || 'Birthday Cake',
    date: customPayload.date || '',
    city: customPayload.city || 'Pune',
    notes: customPayload.notes || '',
    userId: user?.uid || 'guest',
    userEmail: user?.email || customPayload.contact || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Quote Pending',
  });

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'custom_orders'), {
        ...customDoc,
        timestamp: serverTimestamp(),
      });
      console.log('✅ Custom quote saved to Cloud Firestore with ID:', docRef.id);
      return { id: docRef.id, ...customDoc };
    } catch (err) {
      console.error('❌ Firestore createCustomOrder failed:', err.code, err.message);
    }
  }

  const localCustom = { id: 'CST-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...customDoc };
  saveLocal(STORAGE_KEYS.CUSTOM, localCustom);
  return localCustom;
}

export async function getUserCustomOrders(userId = null) {
  if (isFirebaseConfigured && db && userId && userId !== 'guest') {
    try {
      const q = query(
        collection(db, 'custom_orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getUserCustomOrders error:', err.message);
    }
  }

  const all = getLocal(STORAGE_KEYS.CUSTOM);
  if (!userId) return all;
  return all.filter((c) => c.userId === userId || c.userId === 'guest');
}

export async function getAllCustomOrders() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'custom_orders'));
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    } catch (err) {
      console.error('❌ Firestore getAllCustomOrders error:', err.code, err.message);
    }
  }
  return getLocal(STORAGE_KEYS.CUSTOM);
}

export async function updateCustomOrderStatus(customId, status) {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'custom_orders', customId);
      await updateDoc(ref, { status });
      return { id: customId, status };
    } catch (err) {
      console.error('❌ Firestore updateCustomOrderStatus error:', err.message);
    }
  }
  return updateLocal(STORAGE_KEYS.CUSTOM, customId, { status });
}
