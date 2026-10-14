import { useState, useEffect } from 'react';
import { X, Minus, Plus, ArrowLeft, CheckCircle2, Bike, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/db';
import cat from '../assets/cat.png';

export default function CartDrawer() {
  const { items, setQty, total, open, setOpen, clear } = useCart();
  const { user } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState(false); // false: items list, true: delivery form
  const [orderComplete, setOrderComplete] = useState(null); // confirmation order data
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState('cod');

  // Pre-fill user data when opened
  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [user]);

  // Handle escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const handleClose = () => {
    setOpen(false);
    // Reset view after animation
    setTimeout(() => {
      setCheckoutStep(false);
      setOrderComplete(null);
    }, 300);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderPayload = {
        items,
        total,
        city,
        notes,
        paymentMethod: payment === 'cod' ? 'Cash/UPI on Delivery' : 'Online Demo UPI',
        customer: {
          name,
          phone,
          address,
          email: user?.email || '',
        },
      };

      const placed = await createOrder(orderPayload, user);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: placed.id,
          value: placed.total,
          currency: 'INR',
          items: (placed.items || []).map((i) => ({
            item_id: i.id,
            item_name: i.name,
            price: i.price,
            quantity: i.qty,
          })),
        });
      }
      setOrderComplete(placed);
      clear();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Could not place order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={handleClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <div className="drawer-head-title">
            {checkoutStep && !orderComplete && (
              <button
                className="icon-btn back-btn"
                onClick={() => setCheckoutStep(false)}
                aria-label="Back to items"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>
              {orderComplete
                ? 'Order Confirmed!'
                : checkoutStep
                ? 'Delivery Details'
                : 'Your Backpack'}
            </h2>
          </div>
          <button className="icon-btn" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {orderComplete ? (
            /* Order Placed Success View */
            <div className="checkout-success card">
              <div className="success-icon-wrap">
                <CheckCircle2 size={48} className="success-icon" />
              </div>
              <h3>Fresh Bakes on the Way!</h3>
              <p className="order-num-pill">
                Order <strong>#{orderComplete.id?.slice(-6) || 'BAKERY'}</strong>
              </p>
              <div className="delivery-perk">
                <Bike size={24} />
                <p>
                  Our delivery rider is dispatched. Bread will reach your door in{' '}
                  <strong>{orderComplete.city}</strong> while it is still warm.
                </p>
              </div>
              <div className="order-summary-box">
                <div className="row">
                  <span>Items</span>
                  <span>{orderComplete.items?.reduce((s, i) => s + i.qty, 0)} items</span>
                </div>
                <div className="row">
                  <span>Total</span>
                  <strong className="price">₹{orderComplete.total}</strong>
                </div>
                <div className="row">
                  <span>Payment</span>
                  <span className="muted">{orderComplete.paymentMethod}</span>
                </div>
              </div>
              <button className="btn btn-red full" onClick={handleClose}>
                Back to Bakery
              </button>
            </div>
          ) : checkoutStep ? (
            /* Checkout Form View */
            <form id="checkout-form" className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="checkout-info-banner">
                <Sparkles size={16} /> Delivering warm from our ovens in Mumbai & Pune
              </div>

              <label>
                <span>Full Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kiki Baker"
                />
              </label>

              <label>
                <span>Phone Number</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label>
                <span>City & Delivery Area</span>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Pune">Pune (Kothrud, Viman Nagar, Baner, KP)</option>
                  <option value="Mumbai">Mumbai (Bandra, Colaba, Juhu, Dadar)</option>
                </select>
              </label>

              <label>
                <span>Street Address & Landmarks</span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 4B, Sunflower Lane, near clock tower"
                />
              </label>

              <label>
                <span>Baking or Delivery Notes</span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Extra napkins, warm rolls first, ring buzzer..."
                />
              </label>

              <label>
                <span>Payment Option</span>
                <div className="payment-options">
                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={payment === 'cod'}
                      onChange={() => setPayment('cod')}
                    />
                    <span>💵 Cash / UPI on Delivery</span>
                  </label>
                  <label className="radio-pill">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={payment === 'upi'}
                      onChange={() => setPayment('upi')}
                    />
                    <span>⚡ Quick Scan UPI Demo</span>
                  </label>
                </div>
              </label>
            </form>
          ) : (
            /* Items List View */
            <>
              {items.length === 0 ? (
                <div className="empty">
                  <img src={cat} alt="Jiji" />
                  <p>Nothing here yet. Add something fresh from the menu.</p>
                </div>
              ) : (
                items.map((i) => (
                  <div className="line card" key={i.id}>
                    <img className="line-img" src={i.img} alt={i.name} />
                    <div className="grow">
                      <strong>{i.name}</strong>
                      <div className="price">₹{i.price}</div>
                    </div>
                    <div className="qty">
                      <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Remove one">
                        <Minus size={16} />
                      </button>
                      <span>{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Add one">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {items.length > 0 && !orderComplete && (
          <div className="drawer-foot">
            <div className="row">
              <span>Total</span>
              <strong className="price big">₹{total}</strong>
            </div>

            {checkoutStep ? (
              <button
                type="submit"
                form="checkout-form"
                className="btn btn-red full"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : `Confirm & Place Order (₹${total})`}
              </button>
            ) : (
              <button
                className="btn btn-red full"
                onClick={() => setCheckoutStep(true)}
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
