import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCustomOrder } from '../services/db';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Custom() {
  const { user } = useAuth();
  const [sent, setSent] = useState(null);
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
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const saved = await createCustomOrder(data, user);
      setSent(saved);
    } catch (err) {
      console.error('Custom order error:', err);
      alert('Could not submit quote request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow page-with-ambient">
      <div className="ambient-gradient-backdrop" />
      <div className="page-header text-center">
        <h1>Custom celebration orders</h1>
        <p>Birthdays, weddings, office parties. Tell us what you're dreaming of and our head baker will reply within a day.</p>
      </div>

      {sent ? (
        <div className="card form confirmation-card">
          <div className="confirmation-header">
            <CheckCircle2 size={44} className="success-icon" />
            <h2>Quote Request Received!</h2>
            <span className="order-num-pill">Inquiry #{sent.id?.slice(-6) || 'CUST'}</span>
          </div>
          <p className="confirmation-lead">
            We've logged your <strong>{sent.type}</strong> request for <strong>{sent.city}</strong>. We'll reach out to <strong>{sent.contact}</strong> with a custom flavor menu and quote.
          </p>
          <button className="btn btn-cream full" onClick={() => setSent(null)}>
            Send another request
          </button>
        </div>
      ) : (
        <form className="card form form-enhanced" onSubmit={submit}>
          <div className="form-grid-2">
            <label>
              <span>Your name</span>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kiki"
              />
            </label>
            <label>
              <span>Phone or email</span>
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
              <span>What are you celebrating?</span>
              <select name="type">
                <option value="Birthday">Birthday Cake</option>
                <option value="Wedding">Wedding Tiered Cake</option>
                <option value="Office Party">Office Pastry Box</option>
                <option value="Other">Special Gathering</option>
              </select>
            </label>
            <label>
              <span>Needed by</span>
              <input type="date" name="date" required />
            </label>
          </div>

          <label>
            <span>City</span>
            <select name="city">
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </label>

          <label>
            <span>Tell us more</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Flavours (matcha, chocolate sea salt, strawberry shortcake), estimated servings, special decor..."
            />
          </label>

          <button className="btn btn-red full" type="submit" disabled={loading}>
            {loading ? 'Submitting quote inquiry...' : 'Request a Custom Quote'}
          </button>
        </form>
      )}
    </section>
  );
}
