import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';
import { SOCIAL_ICONS, PLATFORM_LABELS } from './SocialIcons.jsx';

export default function Hero() {
  const { brand, hero, profile, socialLinks } = portfolioData;
  const [textIdx, setTextIdx] = useState(0);
  const roles = profile.rolesDetailed;

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => (i + 1) % roles.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Only render social icons for configured URLs
  const activeSocials = Object.entries(socialLinks).filter(([, url]) => Boolean(url && url.trim()));

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-navy)',
        paddingTop: '2rem',
        paddingBottom: '4rem',
      }}
    >
      {/* Ambient background blobs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,150,62,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,150,62,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Dot-grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-grid">
          {/* LEFT — text content */}
          <div className="hero-text-col">
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(201,150,62,0.1)',
              border: '1px solid rgba(201,150,62,0.3)',
              borderRadius: '100px',
              padding: '0.45rem 1.1rem',
              marginBottom: '1.75rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-gold)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-bright)', fontWeight: 700, letterSpacing: '0.16em' }}>
                STUDENT | AUTHOR | BUILDER | INNOVATOR
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-serif hero-headline"
              style={{
                color: '#fff',
                marginBottom: '1.25rem',
                lineHeight: 1.14,
                fontWeight: 700,
              }}
            >
              Turning<br />
              Ideas into <span style={{ color: 'var(--color-gold-bright)', fontStyle: 'italic' }}>Impact</span>
            </h1>

            {/* Roles subtitle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <span style={{
                width: '28px', height: '1.5px',
                background: 'var(--color-gold)',
                display: 'inline-block', flexShrink: 0,
              }} />
              <span
                style={{
                  color: 'var(--color-gold-light)',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  lineHeight: 1.5,
                }}
              >
                {roles.join(' • ')}
              </span>
            </div>

            {/* Bio */}
            <p style={{
              color: 'var(--color-text-light-muted)',
              fontSize: '1.05rem',
              lineHeight: 1.75,
              maxWidth: '520px',
              marginBottom: '2.25rem',
            }}>
              {hero.bio}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <a href={hero.ctaPrimary.href} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
                {hero.ctaPrimary.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.4rem' }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href={hero.ctaSecondary.href} className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
                {hero.ctaSecondary.label}
              </a>
            </div>

            {/* Social icons — only renders if URLs exist */}
            {activeSocials.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {activeSocials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={PLATFORM_LABELS[platform] || platform}
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(201,150,62,0.3)',
                      display: 'grid', placeItems: 'center',
                      color: 'var(--color-text-light-muted)',
                      transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--color-gold)';
                      e.currentTarget.style.borderColor = 'var(--color-gold)';
                      e.currentTarget.style.background = 'rgba(201,150,62,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--color-text-light-muted)';
                      e.currentTarget.style.borderColor = 'rgba(201,150,62,0.3)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {SOCIAL_ICONS[platform]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — portrait */}
          <div className="hero-image-col">
            {/* Decorative vertical accent */}
            <div aria-hidden="true" className="hero-accent-line" />

            {/* Portrait card */}
            <div className="hero-portrait-wrapper">
              {/* Gold corner accent */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: '-1px', right: '-1px',
                width: '60px', height: '60px',
                borderTop: '2px solid var(--color-gold)',
                borderRight: '2px solid var(--color-gold)',
                borderRadius: '0 var(--radius-card) 0 0',
                pointerEvents: 'none',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: '-1px', left: '-1px',
                width: '60px', height: '60px',
                borderBottom: '2px solid var(--color-gold)',
                borderLeft: '2px solid var(--color-gold)',
                borderRadius: '0 0 0 var(--radius-card)',
                pointerEvents: 'none',
              }} />

              <img
                src={profile.portraits.hero}
                alt={profile.fullName}
                className="hero-portrait-img"
              />

              {/* Vertical ribbon-style element */}
              <div className="hero-ribbon-badge">
                <span className="font-serif hero-ribbon-title">
                  {hero.badge.title}<br />
                  {hero.badge.line2}<br />
                  {hero.badge.line3}
                </span>
                <div className="hero-ribbon-divider" />
                <span className="font-serif hero-ribbon-signature">
                  Takudzwa<br />Muzovaka
                </span>
              </div>
            </div>

            {/* Brand pillars */}
            <div className="hero-pillars">
              {brand.pillars.split('|').map(p => (
                <span key={p} style={{
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  {p.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        opacity: 0.5,
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--color-text-light-muted)', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{
          width: '1px', height: '32px',
          background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
        }} />
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }
        .hero-headline {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-role-text {
          animation: fadeInUp 0.4s ease both;
        }
        .hero-image-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
        }
        .hero-accent-line {
          position: absolute;
          left: -1.5rem;
          top: 5%;
          bottom: 5%;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--color-gold) 30%, var(--color-gold) 70%, transparent);
          border-radius: 2px;
          opacity: 0.5;
        }
        .hero-portrait-wrapper {
          position: relative;
          border-radius: var(--radius-card);
          overflow: visible;
          max-width: 380px;
          width: 100%;
        }
        .hero-portrait-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-card);
          border: 1px solid rgba(201,150,62,0.25);
          display: block;
        }
        .hero-ribbon-badge {
          position: absolute;
          bottom: 1.5rem;
          right: -1.75rem;
          background: rgba(10, 19, 36, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(201,150,62,0.45);
          border-radius: 14px;
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 36px rgba(0,0,0,0.55);
          z-index: 2;
        }
        .hero-ribbon-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-gold);
          letterSpacing: 0.05em;
          text-transform: uppercase;
          line-height: 1.35;
        }
        .hero-ribbon-divider {
          width: 24px;
          height: 1.5px;
          background: var(--color-gold);
          margin: 0.6rem 0;
          opacity: 0.7;
        }
        .hero-ribbon-signature {
          font-size: 0.88rem;
          font-style: italic;
          color: var(--color-gold-light);
          line-height: 1.25;
        }
        .hero-pillars {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }
        .hero-pillars span:not(:last-child)::after {
          content: '|';
          margin-left: 1.25rem;
          color: rgba(201,150,62,0.3);
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .hero-text-col { order: 2; text-align: center; }
          .hero-image-col { order: 1; }
          .hero-portrait-wrapper { max-width: 280px; margin: 0 auto; }
          .hero-ribbon-badge { right: -0.5rem; bottom: 0.5rem; padding: 0.85rem 1rem; }
          .hero-accent-line { display: none; }
          .hero-pillars { justify-content: center; }
          .hero-headline { font-size: clamp(2rem, 6vw, 2.8rem); }
        }
      `}</style>
    </section>
  );
}
