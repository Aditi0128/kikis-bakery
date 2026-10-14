import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut, Package, ChevronDown, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserOrdersModal from './UserOrdersModal';
import logoImg from '../assets/logo.jpg';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/custom', label: 'Custom orders' },
  { to: '/reservations', label: 'Book a table' },
];

export default function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();

  const envAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || '')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  const isUserAdmin = user && (envAdminEmails.length === 0 || envAdminEmails.includes((user.email || '').toLowerCase()));


  const handleLogout = async () => {
    setUserDropdown(false);
    await logout();
  };

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo-brand" onClick={() => setMobile(false)}>
            <img src={logoImg} alt="Kiki's Bakery Seal" className="nav-logo-seal" />
            <span className="logo-text">Kiki's Bakery</span>
          </Link>

          <nav className={`nav-links ${mobile ? 'is-open' : ''}`}>
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                onClick={() => setMobile(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {l.label}
              </NavLink>
            ))}

            {/* Mobile Auth and Admin action in drawer */}
            <div className="mobile-auth show-sm">
              {isUserAdmin && (
                <Link to="/admin" className="btn btn-cream full" onClick={() => setMobile(false)}>
                  <ShieldCheck size={18} /> Admin Desk
                </Link>
              )}
              {user ? (
                <div className="mobile-user-box" style={{ marginTop: '.6rem' }}>
                  <div className="mobile-user-name">
                    Signed in as <strong>{user.displayName || user.email}</strong>
                  </div>
                  <button
                    className="btn btn-cream full"
                    onClick={() => { setMobile(false); setOrdersOpen(true); }}
                  >
                    <Package size={18} /> My Activity & Orders
                  </button>
                  <button className="btn btn-cream full" onClick={handleLogout}>
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-cream full"
                  style={{ marginTop: '.6rem' }}
                  onClick={() => { setMobile(false); setAuthOpen(true); }}
                >
                  <User size={18} /> Sign In
                </button>
              )}
            </div>
          </nav>

          <div className="nav-actions">
            {/* User Auth at Navbar (Desktop) */}
            <div className="user-nav-container hide-sm">
              {user ? (
                <div className="user-dropdown-wrapper">
                  <button
                    className="btn btn-cream user-pill-btn"
                    onClick={() => setUserDropdown(!userDropdown)}
                    aria-expanded={userDropdown}
                    aria-label="User menu"
                  >
                    <div className="avatar-circle">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'K'}
                    </div>
                    <span className="user-pill-name">{user.displayName || 'Baker'}</span>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdown && (
                    <>
                      <div className="dropdown-backdrop" onClick={() => setUserDropdown(false)} />
                      <div className="card user-dropdown-menu">
                        <div className="user-dropdown-header">
                          <strong>{user.displayName || 'Baker'}</strong>
                          <span className="muted email-sub">{user.email}</span>
                        </div>
                        <hr className="dropdown-divider" />
                        <button
                          className="dropdown-item"
                          onClick={() => { setUserDropdown(false); setOrdersOpen(true); }}
                        >
                          <Package size={16} /> My Orders & Bookings
                        </button>
                        {isUserAdmin && (
                          <Link
                            to="/admin"
                            className="dropdown-item"
                            onClick={() => setUserDropdown(false)}
                          >
                            <ShieldCheck size={16} /> Admin Desk
                          </Link>
                        )}
                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-cream btn-auth"
                  onClick={() => setAuthOpen(true)}
                  aria-label="Sign in"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Backpack Button: Always visible, bold white text with shopping bag */}
            <div className="backpack-btn-wrapper" title="🧺 Backpack = Your Shopping Cart / Order Bag">
              <button
                className="btn btn-red btn-backpack"
                onClick={() => setOpen(true)}
                aria-label="Open backpack (shopping cart)"
              >
                <ShoppingBag size={18} />
                <span className="backpack-label">Backpack</span>
                {count > 0 && <span className="badge">{count}</span>}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="icon-btn show-sm"
              onClick={() => setMobile((m) => !m)}
              aria-label="Toggle menu"
              aria-expanded={mobile}
            >
              {mobile ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Auth and User Records Modals */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <UserOrdersModal isOpen={ordersOpen} onClose={() => setOrdersOpen(false)} />
    </>
  );
}
