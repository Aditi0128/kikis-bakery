import { Link } from 'react-router-dom';
import { STORES } from '../data/menu';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="gingham" aria-hidden="true" />
      <div className="footer-inner">
        <div>
          <div className="logo-brand footer-logo">
            <img src={logoImg} alt="Kiki's Bakery" className="footer-logo-seal" />
            <span className="logo-text">Kiki's Bakery</span>
          </div>
          <p className="muted">Baked fresh every morning in Mumbai and Pune. Hand-delivered while it's still warm.</p>
        </div>
        <div>
          <strong>Visit</strong>
          {STORES.map((s) => <p key={s.city}>{s.city}, daily {s.hours}</p>)}
        </div>
        <div>
          <strong>Explore</strong>
          <p><Link to="/menu">Menu (12 Items)</Link></p>
          <p><Link to="/custom">Custom orders</Link></p>
          <p><Link to="/reservations">Book a table</Link></p>
          <p><Link to="/admin">Admin Desk 🔐</Link></p>
        </div>
      </div>
      <p className="fine">Imaginary bakery created for a digital marketing project. Not affiliated with Studio Ghibli.</p>
    </footer>
  );
}
