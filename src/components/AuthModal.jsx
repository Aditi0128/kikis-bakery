import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, demoLogin, isFirebaseConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signupWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin();
    onClose();
  };

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <div className="auth-modal-wrapper" role="dialog" aria-modal="true">
        <div className="card auth-card">
          <div className="auth-header">
            <div>
              <h2>{isSignUp ? 'Join the Bakery' : 'Welcome back'}</h2>
              <p className="auth-sub">
                {isSignUp ? 'Create an account to track fresh deliveries' : 'Sign in to view your orders and table bookings'}
              </p>
            </div>
            <button className="icon-btn auth-close" onClick={onClose} aria-label="Close modal">
              <X size={22} />
            </button>
          </div>

          {!isFirebaseConfigured && (
            <div className="demo-notice">
              <Sparkles size={16} className="sparkle-icon" />
              <span><strong>Demo Mode Active:</strong> Add Firebase credentials in <code>.env</code> for live cloud auth. Local sign-in and 1-click test work right away!</span>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          {/* Google Sign-in */}
          <button type="button" className="btn btn-google full" onClick={handleGoogle} disabled={loading}>
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <label>
                <span>Your Name</span>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input
                    type="text"
                    placeholder="Kiki"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </label>
            )}

            <label>
              <span>Email Address</span>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  placeholder="kiki@bakery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button type="submit" className="btn btn-red full" disabled={loading}>
              {loading ? 'Please wait...' : (isSignUp ? 'Create Bakery Account' : 'Sign In')}
            </button>
          </form>

          <div className="auth-footer-actions">
            <button
              type="button"
              className="link-btn"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>

            {!isFirebaseConfigured && (
              <button
                type="button"
                className="btn btn-cream btn-sm demo-quick-btn"
                onClick={handleDemo}
              >
                ⚡ Quick 1-Click Demo Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
