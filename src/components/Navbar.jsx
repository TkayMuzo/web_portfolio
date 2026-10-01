import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function Navbar({ onOpenMobileMenu }) {
  const { brand, navigation } = portfolioData;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sectionIds = navigation.map(n => n.href.replace('#', ''));

    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = sectionIds[0];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      });
      setActive(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          background: scrolled
            ? 'rgba(5,11,22,0.92)'
            : 'rgba(5,11,22,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(201,150,62,0.25)'
            : '1px solid rgba(255,255,255,0.04)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Brand Lockup */}
          <a
            href="#home"
            aria-label="Takudzwa Muzovaka — Home"
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}
          >
            <img
              src={brand.logoPath}
              alt="TM monogram"
              style={{ width: '38px', height: '38px', objectFit: 'contain' }}
            />
            <div style={{ lineHeight: 1.15 }}>
              <div
                className="font-serif"
                style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.1em' }}
              >
                TAKUDZWA
              </div>
              <div
                style={{ color: 'var(--color-gold-bright)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.22em' }}
              >
                MUZOVAKA
              </div>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav aria-label="Primary navigation" className="navbar-desktop-nav">
            {navigation.map(item => {
              const id = item.href.replace('#', '');
              const isActive = active === id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    color: isActive ? 'var(--color-gold-bright)' : 'var(--color-text-light-muted)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    padding: '4px 0',
                    position: 'relative',
                    transition: 'color 0.2s',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--color-gold)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <a
              href="#projects"
              aria-label="Search projects"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-light-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-bright)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-light-muted)')}
              title="Explore projects"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </a>

            <a
              href="#contact"
              className="btn btn-primary navbar-cta"
              style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem' }}
            >
              Let's Connect
            </a>

            {/* Hamburger */}
            <button
              type="button"
              className="navbar-hamburger"
              onClick={onOpenMobileMenu}
              aria-label="Open navigation menu"
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,150,62,0.35)',
                borderRadius: '8px',
                color: 'var(--color-gold)',
                width: '40px',
                height: '40px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so page content starts below navbar */}
      <div style={{ height: '72px' }} aria-hidden="true" />

      <style>{`
        .navbar-desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .navbar-desktop-nav { display: none !important; }
          .navbar-cta { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
