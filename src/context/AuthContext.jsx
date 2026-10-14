import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  isFirebaseConfigured
} from '../firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const DEMO_USER_KEY = 'kiki-bakery-demo-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load demo user or listen to real Firebase Auth
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
            isAnonymous: firebaseUser.isAnonymous,
            provider: firebaseUser.providerData?.[0]?.providerId || 'email',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local fallback mode when Firebase credentials are not yet set
      try {
        const saved = localStorage.getItem(DEMO_USER_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error reading local demo user:', err);
      }
      setLoading(false);
    }
  }, []);

  // Google sign in
  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }

    // Demo fallback
    const mockUser = {
      uid: 'demo-google-' + Date.now(),
      email: 'jiji.cat@gmail.com',
      displayName: 'Jiji (Demo Baker)',
      photoURL: null,
      provider: 'google.com',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  // Email / Password login
  const loginWithEmail = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    }

    // Demo fallback
    const mockUser = {
      uid: 'demo-email-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      provider: 'password',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  // Sign up with Email / Password
  const signupWithEmail = async (email, password, displayName) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      return cred.user;
    }

    // Demo fallback
    const mockUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: null,
      provider: 'password',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  // Sign out
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  };

  // Instant 1-click demo login helper
  const demoLogin = (name = 'Kiki Delivery Baker', email = 'kiki@koriko.bakery') => {
    const demo = {
      uid: 'demo-kiki-001',
      displayName: name,
      email: email,
      photoURL: null,
      provider: 'demo',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    setUser(demo);
    return demo;
  };

  const value = {
    user,
    loading,
    isFirebaseConfigured,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    demoLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
