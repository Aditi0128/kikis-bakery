import { useState, useEffect } from 'react';
import {
  getAllOrders,
  subscribeAllOrders,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  getAllCustomOrders,
  updateCustomOrderStatus
} from '../services/db';
import { isFirebaseConfigured } from '../firebase';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  Filter,
  ShieldAlert,
  Lock,
  KeyRound,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import cat from '../assets/cat.png';
import logoImg from '../assets/logo.jpg';

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  // Tab & Data state
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');

  // Admin emails configured via .env (comma-separated if multiple)
  const envAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || '')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  const adminPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'kiki2026';

  // Check if current user is an authorized admin
  const isAuthorizedAdmin =
    passcodeUnlocked ||
    (user && (envAdminEmails.length === 0 || envAdminEmails.includes((user.email || '').toLowerCase())));

  const handleUnlockPasscode = (e) => {
    e.preventDefault();
    if (passcode.trim() === adminPasscode) {
      setPasscodeUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, r, c] = await Promise.all([
        getAllOrders(),
        getAllReservations(),
        getAllCustomOrders()
      ]);
      setOrders(o || []);
      setReservations(r || []);
      setCustomOrders(c || []);
    } catch (err) {
      console.error('Error loading admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadData();
      // Listen for new orders in real-time
      const unsubscribe = subscribeAllOrders((realtimeOrders) => {
        setOrders(realtimeOrders || []);
      });
      return () => unsubscribe && unsubscribe();
    }
  }, [isAuthorizedAdmin]);

  const handleOrderStatus = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const handleReservationStatus = async (id, newStatus) => {
    await updateReservationStatus(id, newStatus);
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handleCustomStatus = async (id, newStatus) => {
    await updateCustomOrderStatus(id, newStatus);
    setCustomOrders((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  // 1. Loading state while Firebase checks auth
  if (authLoading) {
    return (
      <section className="page admin-page text-center">
        <div className="card admin-empty" style={{ maxWidth: '420px', margin: '4rem auto' }}>
          <p>Checking bakery manager credentials...</p>
        </div>
      </section>
    );
  }

  // 2. Not Logged In - Staff Lock Screen
  if (!user && !passcodeUnlocked) {
    return (
      <section className="page narrow admin-page">
        <div className="card admin-lock-card">
          <div className="admin-lock-icon-wrap">
            <Lock size={36} className="lock-icon" />
          </div>
          <h2>Bakery Staff & Kitchen Desk</h2>
          <p className="muted">
            This dashboard displays live customer phone numbers, delivery addresses, and revenue. Access is restricted to authorized bakery managers.
          </p>

          <div className="admin-lock-actions">
            <button className="btn btn-red full" onClick={() => setAuthModalOpen(true)}>
              Sign in with Admin Account
            </button>
          </div>

          <div className="auth-divider">
            <span>or unlock with manager passcode</span>
          </div>

          <form onSubmit={handleUnlockPasscode} className="admin-passcode-form">
            <div className="input-with-icon">
              <KeyRound size={18} className="field-icon" />
              <input
                type="password"
                placeholder="Manager passcode (e.g. kiki2026)"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setPasscodeError(false); }}
                required
              />
            </div>
            {passcodeError && (
              <span className="passcode-error-msg">Incorrect passcode. Please try again.</span>
            )}
            <button type="submit" className="btn btn-cream full">
              Unlock Desk
            </button>
          </form>

          <div className="admin-lock-foot">
            <Link to="/" className="link-muted"><ArrowLeft size={16} /> Return to Bakery Home</Link>
          </div>
        </div>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </section>
    );
  }

  // 3. Logged in, but NOT an authorized admin email
  if (user && !isAuthorizedAdmin) {
    return (
      <section className="page narrow admin-page">
        <div className="card admin-lock-card">
          <div className="admin-lock-icon-wrap access-denied">
            <ShieldAlert size={36} className="lock-icon" />
          </div>
          <h2>Access Restricted</h2>
          <p>
            You are signed in as <strong>{user.email}</strong>.
          </p>
          <div className="access-denied-box">
            This account is not authorized to view the bakery admin ledger. Only designated manager accounts can access customer order records.
          </div>

          <div className="admin-lock-actions">
            <button className="btn btn-cream full" onClick={logout}>
              <LogOut size={16} /> Sign Out & Switch Account
            </button>
            <Link to="/menu" className="btn btn-red full">
              Return to Bakery Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 4. Authorized Admin View
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const filteredOrders = cityFilter === 'All' ? orders : orders.filter((o) => o.city === cityFilter);
  const filteredReservations = cityFilter === 'All' ? reservations : reservations.filter((r) => r.city === cityFilter);
  const filteredCustom = cityFilter === 'All' ? customOrders : customOrders.filter((c) => c.city === cityFilter);

  return (
    <section className="page admin-page">
      <div className="admin-header-row">
        <div>
          <div className="admin-title-wrap">
            <img src={logoImg} alt="Kiki Bakery" className="admin-logo-seal" />
            <h1>Bakery Admin Desk</h1>
          </div>
          <p className="admin-sub">
            Order management, table bookings, and custom cake quotes &bull;{' '}
            <span className={`db-mode-tag ${isFirebaseConfigured ? 'online' : 'demo'}`}>
              {isFirebaseConfigured ? 'Cloud Firestore Connected' : 'Local Demo Mode'}
            </span>
            <span className="admin-active-user-badge">
              Manager: {user?.email || 'Passcode Unlocked'}
            </span>
          </p>
        </div>
        <button className="btn btn-cream btn-sm" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon-wrap"><ShoppingBag size={22} /></div>
          <div>
            <span className="metric-label">Active Orders</span>
            <strong className="metric-value">{activeOrdersCount}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon-wrap amber"><Sparkles size={22} /></div>
          <div>
            <span className="metric-label">Total Revenue</span>
            <strong className="metric-value price">₹{totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon-wrap sky"><Calendar size={22} /></div>
          <div>
            <span className="metric-label">Table Bookings</span>
            <strong className="metric-value">{reservations.length}</strong>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon-wrap"><Sparkles size={22} /></div>
          <div>
            <span className="metric-label">Custom Quotes</span>
            <strong className="metric-value">{customOrders.length}</strong>
          </div>
        </div>
      </div>

      {/* Tab controls & City Filter */}
      <div className="admin-controls-bar">
        <div className="tabs admin-tabs">
          <button
            className={activeTab === 'orders' ? 'on' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📦 Backpack Orders ({orders.length})
          </button>
          <button
            className={activeTab === 'reservations' ? 'on' : ''}
            onClick={() => setActiveTab('reservations')}
          >
            🪑 Reservations ({reservations.length})
          </button>
          <button
            className={activeTab === 'custom' ? 'on' : ''}
            onClick={() => setActiveTab('custom')}
          >
            🎂 Custom Quotes ({customOrders.length})
          </button>
        </div>

        <div className="filter-pill-wrap">
          <Filter size={16} />
          <span>City:</span>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="All">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
          </select>
        </div>
      </div>

      {/* Content Panels */}
      {loading ? (
        <div className="card admin-empty"><p>Loading bakery ledger...</p></div>
      ) : activeTab === 'orders' ? (
        filteredOrders.length === 0 ? (
          <div className="card admin-empty">
            <img src={cat} alt="Jiji" />
            <p>No backpack orders yet. Place a test order from the menu!</p>
          </div>
        ) : (
          <div className="admin-cards-list">
            {filteredOrders.map((o) => (
              <div className="card admin-record-card" key={o.id}>
                <div className="admin-record-head">
                  <div>
                    <div className="admin-id-badge">
                      <strong>Order #{o.id?.slice(-6) || 'BAKERY'}</strong>
                      <span className="city-pill">{o.city || 'Pune'}</span>
                    </div>
                    <span className="admin-time muted">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                    </span>
                  </div>
                  <div className="admin-status-control">
                    <span className={`status-pill status-${(o.status || 'Baking').toLowerCase().replace(/\s+/g, '-')}`}>
                      {o.status || 'Baking'}
                    </span>
                    <select
                      value={o.status || 'Baking'}
                      onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                    >
                      <option value="Baking">🧑‍🍳 Baking</option>
                      <option value="Out for Delivery">🧹 Out for Delivery</option>
                      <option value="Delivered">✅ Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="admin-record-body">
                  <div className="customer-info-box">
                    <strong>Customer:</strong> {o.customer?.name || 'Walk-in Guest'} &bull;{' '}
                    <span className="customer-contact"><Phone size={13} /> {o.customer?.phone || 'No phone'}</span>
                    {o.customer?.email && <span> &bull; {o.customer.email}</span>}
                    <div className="customer-addr">
                      <MapPin size={13} /> {o.customer?.address || 'Pickup from counter'}
                    </div>
                    {o.notes && <div className="customer-notes">Note: "{o.notes}"</div>}
                  </div>

                  <div className="order-items-summary">
                    <strong>Items ordered:</strong>
                    <ul>
                      {o.items?.map((it, idx) => (
                        <li key={idx}>
                          <span>{it.qty}x {it.name}</span>
                          <span>₹{(it.price || 0) * (it.qty || 1)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="order-total-line">
                      <span>Payment: {o.paymentMethod || 'COD'}</span>
                      <strong className="price big">Total: ₹{o.total}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'reservations' ? (
        filteredReservations.length === 0 ? (
          <div className="card admin-empty">
            <img src={cat} alt="Jiji" />
            <p>No table reservations recorded yet.</p>
          </div>
        ) : (
          <div className="admin-cards-list">
            {filteredReservations.map((r) => (
              <div className="card admin-record-card" key={r.id}>
                <div className="admin-record-head">
                  <div>
                    <div className="admin-id-badge">
                      <strong>Booking #{r.id?.slice(-6) || 'TABLE'}</strong>
                      <span className="city-pill">{r.city} Store</span>
                    </div>
                    <span className="admin-time muted">
                      Booked for: <strong>{r.date ? new Date(r.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : 'Upcoming'}</strong>
                    </span>
                  </div>
                  <div className="admin-status-control">
                    <span className={`status-pill status-${(r.status || 'Confirmed').toLowerCase()}`}>
                      {r.status || 'Confirmed'}
                    </span>
                    <select
                      value={r.status || 'Confirmed'}
                      onChange={(e) => handleReservationStatus(r.id, e.target.value)}
                    >
                      <option value="Confirmed">🟢 Confirmed</option>
                      <option value="Seated">🍽️ Seated</option>
                      <option value="Completed">🏁 Completed</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="admin-record-body">
                  <div className="customer-info-box">
                    <strong>Guest Name:</strong> {r.customerName || 'Anonymous'}<br />
                    <strong>Contact:</strong> {r.customerContact || r.userEmail || 'N/A'}<br />
                    <strong>Party Size:</strong> {r.guests} person(s)<br />
                    {r.notes && <div><strong>Special Request:</strong> "{r.notes}"</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredCustom.length === 0 ? (
          <div className="card admin-empty">
            <img src={cat} alt="Jiji" />
            <p>No custom celebration orders pending.</p>
          </div>
        ) : (
          <div className="admin-cards-list">
            {filteredCustom.map((c) => (
              <div className="card admin-record-card" key={c.id}>
                <div className="admin-record-head">
                  <div>
                    <div className="admin-id-badge">
                      <strong>Quote #{c.id?.slice(-6) || 'CUST'}</strong>
                      <span className="city-pill">{c.city}</span>
                    </div>
                    <span className="admin-time muted">
                      Occasion: <strong>{c.type}</strong> &bull; Needed by: <strong>{c.date}</strong>
                    </span>
                  </div>
                  <div className="admin-status-control">
                    <span className={`status-pill status-${(c.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status || 'Quote Pending'}
                    </span>
                    <select
                      value={c.status || 'Quote Pending'}
                      onChange={(e) => handleCustomStatus(c.id, e.target.value)}
                    >
                      <option value="Quote Pending">⏳ Quote Pending</option>
                      <option value="Quote Sent">💌 Quote Sent</option>
                      <option value="Confirmed">🎂 Order Confirmed</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="admin-record-body">
                  <div className="customer-info-box">
                    <strong>Client:</strong> {c.name}<br />
                    <strong>Contact:</strong> {c.contact}<br />
                    {c.notes && (
                      <div className="customer-notes">
                        <strong>Flavor & theme specifications:</strong>
                        <p>{c.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}
