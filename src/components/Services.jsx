import React from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function Services() {
  const { services } = portfolioData;

  const getServiceIcon = (id) => {
    switch (id) {
      case 'ai-ml':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.9-1.3 3.5-3.1 3.9l1.8 4.2A3 3 0 0 1 12 18a3 3 0 0 1-2.7-3.9l1.8-4.2A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"></path>
          </svg>
        );
      case 'cybersecurity':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'web-development':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        );
      case 'research-writing':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case 'technology-solutions':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      case 'technology-consulting':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'digital-product-development':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        );
    }
  };

  return (
    <section
      id="services"
      style={{
        backgroundColor: 'var(--color-navy-surface)',
        padding: 'var(--section-spacing) 0',
        position: 'relative',
      }}
    >
      {/* Subtle top divider */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201, 150, 62, 0.25), transparent)',
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>
            <span className="eyebrow-text">
              {services.sectionLabel ? services.sectionLabel.toUpperCase() : 'SERVICES'}
            </span>
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              color: 'var(--color-white)',
              lineHeight: 1.2,
              marginTop: '0.35rem',
            }}
          >
            {services.heading}
          </h2>
          <p
            style={{
              color: 'var(--color-text-light-muted)',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              maxWidth: '620px',
              lineHeight: 1.65,
            }}
          >
            Purpose-driven technology capabilities delivering intelligent machine learning systems, robust security analysis and practical digital solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {services.items.map((svc, idx) => {
            const formattedNum = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={svc.id}
                className="card-dark service-card"
                style={{
                  padding: '2rem 1.75rem',
                  borderRadius: '16px',
                  border: svc.lead ? '1px solid rgba(201, 150, 62, 0.45)' : '1px solid rgba(201, 150, 62, 0.18)',
                  backgroundColor: svc.lead ? 'rgba(16, 27, 46, 0.95)' : 'var(--color-navy-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div>
                  {/* 1. Service Number & Lead Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: svc.lead ? 'var(--color-gold-bright)' : 'rgba(201, 150, 62, 0.65)',
                      }}
                    >
                      {formattedNum}
                    </span>
                    {svc.lead && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--color-gold-bright)',
                          backgroundColor: 'rgba(201, 150, 62, 0.12)',
                          border: '1px solid rgba(201, 150, 62, 0.3)',
                          borderRadius: '100px',
                          padding: '0.18rem 0.65rem',
                        }}
                      >
                        Lead Offering
                      </span>
                    )}
                  </div>

                  {/* 2. Icon */}
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(201, 150, 62, 0.1)',
                      border: '1px solid rgba(201, 150, 62, 0.24)',
                      color: 'var(--color-gold-bright)',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {getServiceIcon(svc.id)}
                  </div>

                  {/* 3. Service Title */}
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: '1.22rem',
                      color: 'var(--color-white)',
                      marginBottom: '0.65rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {svc.title}
                  </h3>

                  {/* 4. Short Description */}
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--color-text-light-muted)',
                      lineHeight: 1.65,
                      marginBottom: '1.75rem',
                    }}
                  >
                    {svc.description}
                  </p>
                </div>

                {/* 5. Action */}
                <a
                  href="#contact"
                  className="service-cta-link"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-gold-bright)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    paddingTop: '0.95rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => {
                    const el = document.getElementById('contact-subject');
                    if (el) el.value = 'Project Collaboration';
                  }}
                >
                  <span>Inquire About Service</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="service-arrow"
                    style={{ transition: 'transform 0.2s' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201, 150, 62, 0.45) !important;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55), 0 0 14px rgba(201, 150, 62, 0.1);
        }
        .service-card:hover .service-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 640px) {
          .service-card {
            padding: 1.5rem 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
