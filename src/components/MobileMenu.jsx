import React, { useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';

const NAV_ICONS = {
  Home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  About: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  Projects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Writing: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Skills: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Services: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Contact: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

export default function MobileMenu({ isOpen, onClose }) {
  const { brand, profile, navigation } = portfolioData;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
        pointerEvents: isOpen ? 'all' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,11,22,0.75)',
          backdropFilter: 'blur(6px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          height: '100%',
          background: 'var(--color-navy-surface)',
          borderLeft: '1px solid rgba(201,150,62,0.2)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          overflowY: 'auto',
        }}
      >
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src={brand.logoPath} alt="TM" style={{ width: '30px' }} />
            <span className="font-serif" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.06em' }}>
              {brand.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'var(--color-text-light-muted)',
              width: '34px',
              height: '34px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >✕</button>
        </div>

        {/* Profile card */}
        <div style={{
          margin: '1.25rem 1.5rem',
          padding: '1rem',
          background: 'var(--color-navy-card)',
          border: '1px solid rgba(201,150,62,0.2)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          <img
            src={profile.portraits.hero}
            alt={profile.fullName}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'top',
              border: '2px solid var(--color-gold)',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{profile.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-bright)', marginTop: '2px' }}>
              Student | Author | Innovator
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '0 1rem', flex: 1 }} aria-label="Mobile navigation">
          {navigation.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.82rem 0.85rem',
                borderRadius: '10px',
                color: 'var(--color-text-light)',
                fontSize: '0.95rem',
                fontWeight: 500,
                marginBottom: '2px',
                textDecoration: 'none',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,150,62,0.09)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--color-gold)', display: 'flex' }}>
                {NAV_ICONS[item.label] || NAV_ICONS.Home}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <a
            href="#contact"
            onClick={onClose}
            className="btn btn-primary"
            style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.85rem' }}
          >
            Let's Connect
          </a>
        </div>
      </div>
    </div>
  );
}
