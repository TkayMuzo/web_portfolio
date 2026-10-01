import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from '../router.jsx';
import { portfolioData } from '../data/portfolio.js';

export default function AdminLogin() {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Invalid login credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-navy)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(201,150,62,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--color-navy-card)',
        borderRadius: '20px',
        border: '1px solid rgba(201,150,62,0.3)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        padding: '2.5rem 2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src={portfolioData.brand.logoPath}
            alt="Takudzwa Muzovaka Monogram"
            style={{ width: '48px', height: '48px', margin: '0 auto 1rem', display: 'block' }}
          />
          <h1 className="font-serif" style={{ color: 'var(--color-white)', fontSize: '1.65rem', marginBottom: '0.35rem' }}>
            CMS Admin Portal
          </h1>
          <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.88rem' }}>
            Takudzwa Muzovaka Portfolio Management
          </p>
        </div>

        {!isConfigured && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            color: '#FACC15',
            fontSize: '0.82rem',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}>
            <strong>Supabase Setup Required:</strong> Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> to connect the admin authentication.
          </div>
        )}

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            color: '#F87171',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="admin-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(5, 11, 22, 0.6)',
                color: 'var(--color-white)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label htmlFor="admin-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(5, 11, 22, 0.6)',
                color: 'var(--color-white)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <Link to="/" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
