import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
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
  const orderDoc = {
    ...orderPayload,
    userId: user?.uid || 'guest',
    userEmail: user?.email || orderPayload.customer?.email || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Baking', // Initial bakery status
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderDoc,
        timestamp: serverTimestamp(),
      });
      return { id: docRef.id, ...orderDoc };
    } catch (err) {
      console.warn('Firestore createOrder failed, falling back to local storage:', err);
    }
  }

  // Fallback to local storage
  const localOrder = { id: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...orderDoc };
  saveLocal(STORAGE_KEYS.ORDERS, localOrder);
  return localOrder;
}

export async function getUserOrders(userId = null) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.warn('Firestore getUserOrders failed, falling back to local storage:', err);
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
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getAllOrders failed, falling back to local storage:', err);
    }
  }
  return getLocal(STORAGE_KEYS.ORDERS);
}

export async function updateOrderStatus(orderId, status) {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, { status });
      return { id: orderId, status };
    } catch (err) {
      console.warn('Firestore updateOrderStatus failed, updating locally:', err);
    }
  }
  return updateLocal(STORAGE_KEYS.ORDERS, orderId, { status });
}

/**
 * Table Reservations
 */
export async function createReservation(resPayload, user = null) {
  const resDoc = {
    ...resPayload,
    userId: user?.uid || 'guest',
    userEmail: user?.email || resPayload.email || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        ...resDoc,
        timestamp: serverTimestamp(),
      });
      return { id: docRef.id, ...resDoc };
    } catch (err) {
      console.warn('Firestore createReservation failed, falling back to local:', err);
    }
  }

  const localRes = { id: 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...resDoc };
  saveLocal(STORAGE_KEYS.RESERVATIONS, localRes);
  return localRes;
}

export async function getUserReservations(userId = null) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.warn('Firestore getUserReservations error:', err);
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
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getAllReservations error:', err);
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
      console.warn('Firestore updateReservationStatus error:', err);
    }
  }
  return updateLocal(STORAGE_KEYS.RESERVATIONS, resId, { status });
}

/**
 * Custom Orders (Quotes)
 */
export async function createCustomOrder(customPayload, user = null) {
  const customDoc = {
    ...customPayload,
    userId: user?.uid || 'guest',
    userEmail: user?.email || customPayload.contact || 'guest',
    createdAt: new Date().toISOString(),
    status: 'Quote Pending',
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'custom_orders'), {
        ...customDoc,
        timestamp: serverTimestamp(),
      });
      return { id: docRef.id, ...customDoc };
    } catch (err) {
      console.warn('Firestore createCustomOrder failed, falling back to local:', err);
    }
  }

  const localCustom = { id: 'CST-' + Math.random().toString(36).substring(2, 8).toUpperCase(), ...customDoc };
  saveLocal(STORAGE_KEYS.CUSTOM, localCustom);
  return localCustom;
}

export async function getUserCustomOrders(userId = null) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(
        collection(db, 'custom_orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.warn('Firestore getUserCustomOrders error:', err);
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
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (err) {
      console.warn('Firestore getAllCustomOrders error:', err);
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
      console.warn('Firestore updateCustomOrderStatus error:', err);
    }
  }
  return updateLocal(STORAGE_KEYS.CUSTOM, customId, { status });
}
