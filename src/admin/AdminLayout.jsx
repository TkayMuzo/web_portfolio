import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useRouter } from '../router.jsx';
import AdminLogin from './AdminLogin.jsx';
import { portfolioData } from '../data/portfolio.js';

export default function AdminLayout({ children, activeTab = 'overview' }) {
  const { user, loading, signOut } = useAuth();
  const { path, navigate } = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-navy)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gold)'
      }}>
        <p>Verifying admin session…</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', path: '/admin', icon: '📊' },
    { id: 'projects', label: 'Projects', path: '/admin/projects', icon: '💻' },
    { id: 'articles', label: 'Articles', path: '/admin/articles', icon: '✍️' },
    { id: 'books', label: 'Books', path: '/admin/books', icon: '📚' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070D18', color: 'var(--color-white)', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Top Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--color-navy-card)',
        borderBottom: '1px solid rgba(201,150,62,0.25)',
      }} className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={portfolioData.brand.logoPath} alt="TM Monogram" style={{ width: '32px', height: '32px' }} />
          <span className="font-serif" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-white)' }}>
            TM <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>CMS</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{
              background: 'none',
              border: '1px solid rgba(201,150,62,0.3)',
              borderRadius: '8px',
              color: 'var(--color-gold)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {mobileNavOpen ? '✕ Menu' : '☰ Menu'}
          </button>
        </div>
      </header>

      {/* Mobile dropdown navigation */}
      {mobileNavOpen && (
        <div style={{
          backgroundColor: 'var(--color-navy-card)',
          borderBottom: '1px solid rgba(201,150,62,0.3)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                color: path === item.path ? 'var(--color-gold-bright)' : 'var(--color-text-light-muted)',
                backgroundColor: path === item.path ? 'rgba(201,150,62,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />
          <Link to="/" style={{ padding: '0.5rem 1rem', color: 'var(--color-gold)', textDecoration: 'none', fontSize: '0.85rem' }}>
            ↗ View Public Site
          </Link>
          <button
            type="button"
            onClick={signOut}
            style={{
              textAlign: 'left',
              padding: '0.5rem 1rem',
              color: '#F87171',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Sign Out ({user.email})
          </button>
        </div>
      )}

      {/* Main Admin Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Desktop Sidebar */}
        <aside style={{
          width: '260px',
          backgroundColor: 'var(--color-navy-card)',
          borderRight: '1px solid rgba(201,150,62,0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.75rem 1.25rem',
        }} className="admin-desktop-sidebar">
          <div>
            {/* Brand Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={portfolioData.brand.logoPath} alt="TM Monogram" style={{ width: '36px', height: '36px' }} />
              <div>
                <div className="font-serif" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-white)', letterSpacing: '0.05em' }}>
                  TAKUDZWA
                </div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--color-gold-bright)', fontWeight: 600 }}>
                  CMS ADMIN
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {navItems.map((item) => {
                const isActive = path === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      color: isActive ? 'var(--color-gold-bright)' : 'var(--color-text-light-muted)',
                      backgroundColor: isActive ? 'rgba(201,150,62,0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(201,150,62,0.3)' : '1px solid transparent',
                      textDecoration: 'none',
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 600 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Sign Out Footer */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.75rem' }}>
              👤 {user.email}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/" style={{ color: 'var(--color-gold)', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ↗ View Live Portfolio
              </Link>
              <button
                type="button"
                onClick={signOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F87171',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  padding: '4px 0',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main style={{ flex: 1, padding: 'clamp(1.5rem, 3vw, 2.75rem)', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
