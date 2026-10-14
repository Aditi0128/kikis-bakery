import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../services/db';
import { Calendar, Users, MapPin, Sparkles, CheckCircle } from 'lucide-react';

export default function Reservations() {
  const { user } = useAuth();
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setContact(user.email);
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const saved = await createReservation({
        ...data,
        customerName: name || user?.displayName || 'Guest',
        customerContact: contact || user?.email || '',
      }, user);
      setDone(saved);
    } catch (err) {
      console.error('Reservation error:', err);
      alert('Could not book table: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section className="page narrow page-with-ambient">
        <div className="ambient-gradient-backdrop" />
        <div className="card form confirmation-card">
          <div className="confirmation-header">
            <CheckCircle size={44} className="success-icon" />
            <h1>Table booked!</h1>
            <span className="order-num-pill">Booking #{done.id?.slice(-6) || 'TABLE'}</span>
          </div>

          <p className="confirmation-lead">We'll keep the oven warm and your table ready.</p>

          <div className="booking-summary-box">
            <div className="summary-row">
              <MapPin size={18} />
              <span><strong>Bakery Location:</strong> {done.city} Store</span>
            </div>
            <div className="summary-row">
              <Users size={18} />
              <span><strong>Party Size:</strong> {done.guests} Guest{done.guests > 1 ? 's' : ''}</span>
            </div>
            <div className="summary-row">
              <Calendar size={18} />
              <span><strong>Time:</strong> {done.date ? new Date(done.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : 'Scheduled'}</span>
            </div>
            {done.notes && (
              <div className="summary-row notes-row">
                <span><strong>Special Note:</strong> "{done.notes}"</span>
              </div>
            )}
          </div>

          <button className="btn btn-cream full" onClick={() => setDone(null)}>
            Make another booking
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page narrow page-with-ambient">
      <div className="ambient-gradient-backdrop" />
      <div className="page-header text-center">
        <h1>Book a table</h1>
        <p>Reserve a cozy corner by the window with warm morning tea and fresh pastries.</p>
      </div>

      <form className="card form form-enhanced" onSubmit={submit}>
        <div className="form-grid-2">
          <label>
            <span>Your Name</span>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kiki"
            />
          </label>
          <label>
            <span>Phone or Email</span>
            <input
              name="contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </label>
        </div>

        <div className="form-grid-2">
          <label>
            <span>Store Location</span>
            <select name="city">
              <option value="Pune">Pune (Koregaon Park & Kothrud)</option>
              <option value="Mumbai">Mumbai (Bandra Seaside)</option>
            </select>
          </label>
          <label>
            <span>Guests</span>
            <select name="guests">
              <option value="1">1 Person (Quiet reading)</option>
              <option value="2">2 People (Window table)</option>
              <option value="3">3 People</option>
              <option value="4+">4+ People (Large table)</option>
            </select>
          </label>
        </div>

        <label>
          <span>Date and time</span>
          <input type="datetime-local" name="date" required />
        </label>

        <label>
          <span>Special requests</span>
          <textarea name="notes" rows="3" placeholder="Window seat? Birthday pastry sparkler? High chair?" />
        </label>

        <button className="btn btn-red full" type="submit" disabled={loading}>
          {loading ? 'Confirming booking...' : 'Confirm Table Booking'}
        </button>
      </form>
    </section>
  );
}
