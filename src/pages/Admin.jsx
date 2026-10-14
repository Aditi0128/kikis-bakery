import { useState, useEffect } from 'react';
import {
  getAllOrders,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  getAllCustomOrders,
  updateCustomOrderStatus
} from '../services/db';
import { isFirebaseConfigured } from '../firebase';
import {
  ShoppingBag,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MapPin,
  Filter
} from 'lucide-react';
import cat from '../assets/cat.png';
import logoImg from '../assets/logo.jpg';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'custom'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');

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
    loadData();
  }, []);

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

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const filteredOrders = cityFilter === 'All' ? orders : orders.filter((o) => o.city === cityFilter);
  const filteredReservations = cityFilter === 'All' ? reservations : reservations.filter((r) => r.city === cityFilter);
  const filteredCustom = cityFilter === 'All' ? customOrders : customOrders.filter((c) => c.city === cityFilter);

  return (
    <section className="page admin-page">
      <div className="admin-header-row">
        <div>
          <div className="admin-title-wrap"><img src={logoImg} alt="Kiki Bakery" className="admin-logo-seal" /><h1>Bakery Admin Desk</h1></div>
          <p className="admin-sub">
            Order management, table bookings, and custom cake quotes &bull;{' '}
            <span className={`db-mode-tag ${isFirebaseConfigured ? 'online' : 'demo'}`}>
              {isFirebaseConfigured ? 'Cloud Firestore Connected' : 'Local Demo Mode'}
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
