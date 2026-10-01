import React from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function About() {
  const { about, values, profile, journey, brand } = portfolioData;

  return (
    <section
      id="about"
      style={{
        padding: 'var(--section-spacing) 0',
        background: 'var(--color-navy-surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top border accent */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,150,62,0.4), transparent)',
      }} />

      <div className="container">
        {/* Section label */}
        <div className="section-eyebrow" style={{ marginBottom: '3.5rem' }}>
          <span className="eyebrow-text">{about.sectionLabel}</span>
        </div>

        {/* Two-column grid: Content (Left) & Portrait/Quote (Right) */}
        <div className="about-grid">
          {/* LEFT — content */}
          <div className="about-content-col">
            <h2 className="font-serif about-heading">
              {about.heading}
            </h2>

            {/* Role pillars */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {about.focusPillars.map(pillar => (
                <span
                  key={pillar}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(201,150,62,0.35)',
                    color: 'var(--color-gold-bright)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    background: 'rgba(201,150,62,0.06)',
                  }}
                >
                  {pillar}
                </span>
              ))}
            </div>

            {/* Narrative */}
            <p style={{
              color: 'var(--color-text-light-muted)',
              lineHeight: 1.85,
              fontSize: '1.025rem',
              marginBottom: '2.25rem',
            }}>
              {about.narrative}
            </p>

            {/* Core values grid */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-gold)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '1rem',
              }}>
                {values.sectionLabel}
              </div>
              <div className="values-grid">
                {values.items.map(v => (
                  <div
                    key={v.number}
                    style={{
                      padding: '1.1rem',
                      background: 'var(--color-navy-card)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,150,62,0.35)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.1em' }}>
                      {v.number}
                    </div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light-muted)', lineHeight: 1.5 }}>{v.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a href={about.cta.href} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}>
              {about.cta.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* RIGHT — portrait & quote */}
          <div className="about-image-col">
            <div className="about-portrait-frame">
              <img
                src={profile.portraits.about}
                alt={profile.fullName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  display: 'block',
                  borderRadius: 'inherit',
                }}
              />
              {/* Gold frame accents */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: '-8px', left: '-8px',
                width: '48px', height: '48px',
                borderTop: '2px solid var(--color-gold)',
                borderLeft: '2px solid var(--color-gold)',
                borderRadius: '4px 0 0 0',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: '-8px', right: '-8px',
                width: '48px', height: '48px',
                borderBottom: '2px solid var(--color-gold)',
                borderRight: '2px solid var(--color-gold)',
                borderRadius: '0 0 4px 0',
              }} />
            </div>

            {/* Quote card below portrait */}
            <div style={{
              marginTop: '1.75rem',
              padding: '1.5rem',
              background: 'rgba(201,150,62,0.08)',
              border: '1px solid rgba(201,150,62,0.25)',
              borderRadius: 'var(--radius-card)',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', top: '0.75rem', left: '1rem',
                fontSize: '2.5rem', lineHeight: 1,
                color: 'var(--color-gold)',
                fontFamily: 'Georgia, serif',
                opacity: 0.4,
                userSelect: 'none',
              }}>"</div>
              <p className="font-serif" style={{
                color: 'var(--color-text-light)',
                fontSize: '1rem',
                fontStyle: 'italic',
                lineHeight: 1.6,
                paddingLeft: '1.25rem',
                paddingTop: '0.25rem',
                margin: 0,
              }}>
                {about.quote}
              </p>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--color-gold-bright)',
                letterSpacing: '0.1em',
                marginTop: '0.75rem',
                paddingLeft: '1.25rem',
                fontWeight: 600,
              }}>
                — {about.quoteAuthor}
              </p>
            </div>
          </div>
        </div>

        {/* Journey Timeline below */}
        <div style={{ marginTop: '5rem' }}>
          <div className="section-eyebrow" style={{ marginBottom: '2.5rem' }}>
            <span className="eyebrow-text">{journey.sectionLabel}</span>
          </div>
          <h3 className="font-serif" style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '2.5rem' }}>
            {journey.heading}
          </h3>

          <div className="journey-timeline">
            {journey.items
              .filter((item) => item.title && !item.title.includes('[PLACEHOLDER'))
              .map((item, i, arr) => (
                <div key={i} className="journey-item">
                  {/* Line */}
                  <div className="journey-line-col">
                    <div className="journey-dot" />
                    {i < arr.length - 1 && <div className="journey-connector" />}
                  </div>
                  {/* Content */}
                  <div className="journey-content">
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em',
                      color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '0.35rem',
                    }}>
                      {item.category}
                    </div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.98rem', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    {item.institution && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light-muted)' }}>
                        {item.institution}
                      </div>
                    )}
                    {item.date && !item.date.includes('[PLACEHOLDER') && !item.date.includes('Nothing is listed') && (
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                        {item.date}
                      </div>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .about-image-col {}
        .about-portrait-frame {
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid rgba(201,150,62,0.2);
          position: relative;
        }
        .about-heading {
          color: #fff;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          margin-bottom: 1.25rem;
        }
        .about-content-col {}
        .values-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .journey-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .journey-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        .journey-line-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          padding-top: 3px;
        }
        .journey-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-gold);
          border: 2px solid var(--color-navy-surface);
          box-shadow: 0 0 0 3px rgba(201,150,62,0.2);
          flex-shrink: 0;
        }
        .journey-connector {
          width: 1px;
          flex: 1;
          min-height: 40px;
          background: linear-gradient(to bottom, rgba(201,150,62,0.4), rgba(201,150,62,0.08));
          margin: 4px 0;
        }
        .journey-content {
          padding-bottom: 2rem;
          flex: 1;
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .about-portrait-frame {
            max-width: 280px;
            margin: 0 auto;
          }
          .values-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 500px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
