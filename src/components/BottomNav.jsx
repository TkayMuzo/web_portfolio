import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';

const ICONS = {
  Home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  About: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4"/>
      <path d="M20 21a8 8 0 1 0-16 0"/>
    </svg>
  ),
  Projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Writing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  More: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="19" cy="12" r="1.5"/>
      <circle cx="5" cy="12" r="1.5"/>
    </svg>
  ),
};

export default function BottomNav({ onOpenMobileMenu }) {
  const { bottomNavigation } = portfolioData;
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      const ids = ['home', 'about', 'projects', 'writing', 'skills', 'services', 'contact'];
      let cur = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Bottom navigation"
        className="bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'rgba(5, 11, 22, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(201, 150, 62, 0.25)',
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.45rem 0 calc(0.45rem + env(safe-area-inset-bottom))',
        }}
      >
        {bottomNavigation.map((item) => {
          if (item.action === 'open_menu') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onOpenMobileMenu}
                aria-label="Open full menu"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '6px 10px',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ padding: '4px', borderRadius: '8px', display: 'flex' }}>
                  {ICONS.More}
                </span>
                {item.label}
              </button>
            );
          }

          const id = item.href?.replace('#', '') || '';
          const isActive = active === id;

          return (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '6px 10px',
                color: isActive ? 'var(--color-gold)' : 'var(--color-text-light-muted)',
                fontSize: '0.62rem',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
              }}
            >
              <span
                style={{
                  padding: '4px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(201, 150, 62, 0.15)' : 'transparent',
                  transition: 'background 0.2s',
                  display: 'flex',
                }}
              >
                {ICONS[item.label] || ICONS.Home}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .bottom-nav { display: flex !important; }
          body { padding-bottom: 68px; }
        }
      `}</style>
    </>
  );
}
