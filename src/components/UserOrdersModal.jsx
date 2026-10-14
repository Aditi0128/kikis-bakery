import { useState, useEffect } from 'react';
import { X, ShoppingBag, Calendar, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, getUserReservations, getUserCustomOrders } from '../services/db';
import cat from '../assets/cat.png';

export default function UserOrdersModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const uid = user?.uid || null;
        const [o, r, c] = await Promise.all([
          getUserOrders(uid),
          getUserReservations(uid),
          getUserCustomOrders(uid),
        ]);
        if (isMounted) {
          setOrders(o);
          setReservations(r);
          setCustomOrders(c);
        }
      } catch (err) {
        console.error('Failed to load user records:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <div className="auth-modal-wrapper orders-modal-wrapper" role="dialog" aria-modal="true">
        <div className="card orders-card">
          <div className="drawer-head orders-head">
            <div>
              <h2>My Bakery Activity</h2>
              <p className="orders-user-badge">{user?.displayName || 'Guest Baker'} &bull; {user?.email || 'Local user'}</p>
            </div>
            <button className="icon-btn" onClick={onClose} aria-label="Close modal">
              <X size={22} />
            </button>
          </div>

          <div className="orders-tabs">
            <button
              className={`orders-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={16} /> Backpack Orders ({orders.length})
            </button>
            <button
              className={`orders-tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <Calendar size={16} /> Table Bookings ({reservations.length})
            </button>
            <button
              className={`orders-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              <Sparkles size={16} /> Custom Quotes ({customOrders.length})
            </button>
          </div>

          <div className="orders-body">
            {loading ? (
              <div className="empty"><p>Checking the bakery records...</p></div>
            ) : activeTab === 'orders' ? (
              orders.length === 0 ? (
                <div className="empty">
                  <img src={cat} alt="Jiji" />
                  <p>No orders yet. Head to the menu to fill your backpack!</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((o) => (
                    <div className="card order-item" key={o.id}>
                      <div className="order-header-row">
                        <div>
                          <strong>Order #{o.id?.slice(-6) || 'BAKERY'}</strong>
                          <span className="order-date">
                            {o.createdAt ? new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently placed'}
                          </span>
                        </div>
                        <span className="order-status-badge">
                          <Clock size={14} /> {o.status || 'Baking'}
                        </span>
                      </div>
                      <div className="order-items-detail">
                        {o.items?.map((it, idx) => (
                          <div key={idx} className="order-subline">
                            <span>{it.qty}x {it.name}</span>
                            <span>₹{it.price * it.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer-row">
                        <span className="muted">Delivery to: {o.city || 'Mumbai'} {o.customer?.address ? `(${o.customer.address})` : ''}</span>
                        <strong className="price">₹{o.total}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : activeTab === 'reservations' ? (
              reservations.length === 0 ? (
                <div className="empty">
                  <img src={cat} alt="Jiji" />
                  <p>No table bookings yet. Book a table in Mumbai or Pune!</p>
                </div>
              ) : (
                <div className="orders-list">
                  {reservations.map((r) => (
                    <div className="card order-item" key={r.id}>
                      <div className="order-header-row">
                        <div>
                          <strong>{r.city} Bakery Table</strong>
                          <span className="order-date">{r.date ? new Date(r.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Upcoming'}</span>
                        </div>
                        <span className="order-status-badge badge-confirmed">
                          <CheckCircle size={14} /> {r.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="order-note-text">
                        <strong>Party size:</strong> {r.guests} guest{r.guests > 1 ? 's' : ''} {r.notes ? `&bull; Note: "${r.notes}"` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              customOrders.length === 0 ? (
                <div className="empty">
                  <img src={cat} alt="Jiji" />
                  <p>No custom celebration orders requested yet.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {customOrders.map((c) => (
                    <div className="card order-item" key={c.id}>
                      <div className="order-header-row">
                        <div>
                          <strong>{c.type} Celebration ({c.city})</strong>
                          <span className="order-date">Needed: {c.date}</span>
                        </div>
                        <span className="order-status-badge">
                          <Clock size={14} /> {c.status || 'Reviewing quote'}
                        </span>
                      </div>
                      <p className="order-note-text">
                        <strong>Contact:</strong> {c.name} ({c.contact})<br />
                        {c.notes && <span><strong>Details:</strong> {c.notes}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
