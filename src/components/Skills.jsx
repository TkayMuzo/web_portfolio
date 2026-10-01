import React from 'react';
import { portfolioData } from '../data/portfolio.js';

const ICON_MAP = {
  Python: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11.9 2c-3.1 0-5 1.4-5 3.5v2.2h5.1V8.5H4.2C2.1 8.5 1 10.3 1 12.8c0 2.6 1.3 4.2 3.6 4.2h1.8v-2.5c0-2.3 2-4.2 4.3-4.2h5.1V5.5c0-2.1-1.9-3.5-5-3.5zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="#387EB8"/>
      <path d="M12.1 22c3.1 0 5-1.4 5-3.5v-2.2H12v-.8h7.8c2.1 0 3.2-1.8 3.2-4.3 0-2.6-1.3-4.2-3.6-4.2h-1.8v2.5c0 2.3-2 4.2-4.3 4.2H8.2v4.8c0 2.1 1.9 3.5 5 3.5zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#FFE052"/>
    </svg>
  ),
  'C++': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#00599C">
      <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm-1.5 12.5h-1v-5h1v5zm5 0h-1v-5h1v5z"/>
    </svg>
  ),
  Java: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#E76F00">
      <path d="M9 19c3 1 6 0 8-1-2-1-5-1-8 1zm-1-4c4 1 8 0 10-1-3-1-7-1-10 1zm1-8c0 2-1 3-2 4 3 0 5-2 5-4-1 0-2 0-3 0zm5 3c2 2 1 4 0 5 3-1 4-3 3-5-1 0-2 0-3 0z"/>
    </svg>
  ),
  JavaScript: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
      <path d="M7 17.5v-7.8h2.2v6.2c0 .9.5 1.6 1.4 1.6.8 0 1.2-.5 1.2-1.3v-6.5h2.2v6.4c0 2.1-1.3 3.1-3.3 3.1-2 0-3.3-1-3.7-2.7zm8.5-.2c.5.8 1.4 1.4 2.6 1.4 1.2 0 2-.6 2-1.5 0-1-.7-1.4-1.9-1.9l-.7-.3c-1.8-.7-2.9-1.7-2.9-3.4 0-2 1.6-3.4 3.9-3.4 1.5 0 2.7.6 3.4 1.7l-1.6 1.1c-.4-.6-1-1-1.8-1-.9 0-1.5.6-1.5 1.3 0 .8.6 1.2 1.6 1.6l.7.3c2.1.9 3.2 1.8 3.2 3.6 0 2.2-1.7 3.6-4.2 3.6-2 0-3.3-.8-4.1-2.1l1.7-1z" fill="#000"/>
    </svg>
  ),
  TensorFlow: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF6F00">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 3.2L5.5 8.7v6.6l6.5 3.6 6.5-3.6V8.7L12 5.2zm-2 4.3h4v1.8h-4V9.5zm0 3h4v1.8h-4v-1.8z"/>
    </svg>
  ),
  PyTorch: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#EE4C2C">
      <path d="M13 2a7 7 0 0 0-4 12.3V18l4 2 4-2v-3.7A7 7 0 0 0 13 2zm2 10.5l-2 1-2-1V9l2-1 2 1v3.5z"/>
    </svg>
  ),
  'Scikit-learn': (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#3499CD" strokeWidth="2" fill="none"/>
      <path d="M12 7v10M7 12h10" stroke="#F7931E" strokeWidth="2.5"/>
    </svg>
  ),
  Pandas: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="5" y="4" width="3" height="16" rx="1.5" fill="#150458"/>
      <rect x="10.5" y="8" width="3" height="12" rx="1.5" fill="#FFD43B"/>
      <rect x="16" y="5" width="3" height="15" rx="1.5" fill="#306998"/>
    </svg>
  ),
  NumPy: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#4DABCF"/>
      <text x="6" y="16" fill="#FFFFFF" fontWeight="700" fontSize="11" fontFamily="sans-serif">NP</text>
    </svg>
  ),
  OpenCV: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="#5C3EE8" strokeWidth="2"/>
      <path d="M8 4.5A9 9 0 0 0 4.5 8" stroke="#C40C0C" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 4.5A9 9 0 0 1 19.5 8" stroke="#00A877" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 21a9 9 0 0 1-7.5-4.5" stroke="#C40C0C" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 21a9 9 0 0 0 7.5-4.5" stroke="#00A877" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Linux: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <ellipse cx="12" cy="13" rx="7" ry="8" fill="#FFC107"/>
      <circle cx="10" cy="8" r="1.5" fill="#000"/>
      <circle cx="14" cy="8" r="1.5" fill="#000"/>
      <path d="M10 11q2 2 4 0" stroke="#E65100" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  'Kali Linux': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#557C94">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.5 13.5l-4.5-2.5-4.5 2.5 1-5-3.5-3.5 5-.5L12 4l2 4.5 5 .5-3.5 3.5 1 5z"/>
    </svg>
  ),
  Splunk: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#000000"/>
      <text x="4" y="16" fill="#65A637" fontWeight="bold" fontSize="12" fontFamily="sans-serif">{'>'}</text>
    </svg>
  ),
  Wireshark: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1679A7">
      <path d="M4 18c6-1 11-6 13-14-6 2-10 7-13 14zm14-14c1 6-1 11-6 14 3-4 5-9 6-14z"/>
    </svg>
  ),
  'Burp Suite': (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#FF6633"/>
      <text x="5" y="16" fill="#FFFFFF" fontWeight="bold" fontSize="11" fontFamily="sans-serif">BP</text>
    </svg>
  ),
  Networking: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9963E" strokeWidth="1.8">
      <circle cx="12" cy="5" r="2"/>
      <circle cx="5" cy="19" r="2"/>
      <circle cx="19" cy="19" r="2"/>
      <path d="M12 7v4M12 11l-5 6M12 11l5 6"/>
    </svg>
  ),
  React: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.8">
      <ellipse cx="12" cy="12" rx="10" ry="4.5"/>
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/>
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB"/>
    </svg>
  ),
  Svelte: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF3E00">
      <path d="M19.4 6.7c-1.3-2.3-4.3-3.1-6.6-1.8l-4.5 2.6c-.8.5-1.4 1.3-1.6 2.2-.2.8 0 1.7.5 2.4l1.3-1.1c-.2-.3-.3-.7-.2-1 .1-.4.3-.7.7-.9l4.5-2.6c1.3-.7 3-.3 3.7.9.7 1.3.3 3-.9 3.7l-4.5 2.6c-2.3 1.3-3.1 4.3-1.8 6.6 1.3 2.3 4.3 3.1 6.6 1.8l4.5-2.6c.8-.5 1.4-1.3 1.6-2.2.2-.8 0-1.7-.5-2.4l-1.3 1.1c.2.3.3.7.2 1-.1.4-.3.7-.7.9l-4.5 2.6c-1.3.7-3 .3-3.7-.9-.7-1.3-.3-3 .9-3.7l4.5-2.6c2.3-1.3 3.1-4.3 1.8-6.6z"/>
    </svg>
  ),
  'Tailwind CSS': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#06B6D4">
      <path d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.09 2.15 4.6 2.15C19.67 12 21.33 10.67 22 8c-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.51 6 12 6zm-4 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C9.38 17.85 10.49 19 13 19c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C11.62 13.15 10.51 12 8 12z"/>
    </svg>
  ),
  'Node.js': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#339933">
      <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.3l7.5 4.1v8.2L12 20.7 4.5 16.6V8.4L12 4.3zm0 3.2l-4 2.2v4.6l4 2.2 4-2.2V9.7L12 7.5z"/>
    </svg>
  ),
  Firebase: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFCA28">
      <path d="M3.9 17.5l2.6-16.1 4.3 8.2-6.9 7.9zm16.2 0l-2.4-4.6-2.5-4.8-1.5-2.9-1.9 3.6 8.3 8.7zm-16.2 0l8.1 4.5 8.1-4.5-8.1-15.5-8.1 15.5z"/>
    </svg>
  ),
  PostgreSQL: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="#336791"/>
      <path d="M12 7c-2.5 0-4 1.5-4 4 0 3 2 4 4 4s4-1 4-4c0-2.5-1.5-4-4-4z" fill="#FFFFFF"/>
    </svg>
  ),
  Git: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#F05032">
      <path d="M21.6 10.9l-8.5-8.5c-.8-.8-2.1-.8-2.9 0L8.3 4.3l3.6 3.6c.9-.3 1.9 0 2.5.7.7.7.9 1.8.6 2.7l3.5 3.5c.9-.3 2 .1 2.6.7.9.9.9 2.4 0 3.3-.9.9-2.4.9-3.3 0-.7-.7-.9-1.8-.6-2.7l-3.3-3.3v7.3c.3.2.5.5.6.8.5 1.1.1 2.4-.9 3-.9.6-2.1.4-2.8-.4-.7-.8-.7-2 0-2.8.3-.3.7-.6 1.1-.7v-7.4c-.4-.1-.8-.4-1.1-.7-.8-.8-.8-2 0-2.8.8-.8 2-.8 2.8 0 .3.3.5.7.6 1.1l3.5-3.5-1.9-1.9c-.8-.8-2.1-.8-2.9 0L2.4 10.9c-.8.8-.8 2.1 0 2.9l8.5 8.5c.8.8 2.1.8 2.9 0l7.8-7.8c.8-.8.8-2.1 0-2.9v-.7z"/>
    </svg>
  ),
  GitHub: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#E6EDF3">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  Docker: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#2496ED">
      <path d="M13.9 10.6h2.2v2.2h-2.2v-2.2zm-3.3 0h2.2v2.2h-2.2v-2.2zm-3.3 0h2.2v2.2H7.3v-2.2zm-3.3 0h2.2v2.2H4v-2.2zm9.9-3.3h2.2v2.2h-2.2V7.3zm-3.3 0h2.2v2.2h-2.2V7.3zm-3.3 0h2.2v2.2H7.3V7.3zm6.6-3.3h2.2v2.2h-2.2V4zm7.6 9.8c-.5-.4-1.5-.4-2.1-.1-.3-1.6-1.5-2.7-3.1-2.9-.2 0-.4 0-.6.1v-.8H.7C.3 11.2 0 11.6 0 12.1c0 4.6 3.4 8.7 8.3 8.7 6.1 0 10.8-4.2 12-9.6.9.1 1.7-.1 2.2-.6.4-.4.6-.9.6-1.4 0-.1-.1-.3-.2-.4h-.3z"/>
    </svg>
  ),
  'VS Code': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#007ACC">
      <path d="M17.5 2.1L7.8 11.1 3.5 7.8 1.5 8.8l4.4 3.9-4.4 3.9 2 1 4.3-3.3 9.7 9 4.5-2.2V4.3l-4.5-2.2zm1.5 16.5l-6-5.5 6-5.5v11z"/>
    </svg>
  ),
  Figma: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M8 2h4v5H8a2.5 2.5 0 0 1 0-5z" fill="#F24E1E"/>
      <path d="M12 2h4a2.5 2.5 0 0 1 0 5h-4V2z" fill="#FF7262"/>
      <path d="M8 7h4v5H8a2.5 2.5 0 0 1 0-5z" fill="#A259FF"/>
      <circle cx="14.5" cy="9.5" r="2.5" fill="#1ABCFE"/>
      <path d="M8 12h4v5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 1-5z" fill="#0ACF83"/>
    </svg>
  ),
};

const DEFAULT_ICON = (name) => (
  <div style={{
    width: '20px', height: '20px', borderRadius: '50%',
    background: 'var(--color-gold-subtle)',
    border: '1px solid var(--color-gold-border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.55rem', fontWeight: 700, color: 'var(--color-gold-bright)',
    letterSpacing: '0',
  }}>
    {name.slice(0, 2).toUpperCase()}
  </div>
);

export default function Skills() {
  const { skills } = portfolioData;
  const categories = Object.entries(skills.categories).map(([name, items]) => ({
    name,
    items: items.map(skill => ({ name: skill, icon: ICON_MAP[skill] || DEFAULT_ICON(skill) })),
  }));

  return (
    <section
      id="skills"
      style={{
        backgroundColor: 'var(--color-navy)',
        color: 'var(--color-text-light)',
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
          background: 'linear-gradient(to right, transparent, rgba(201, 150, 62, 0.3), transparent)',
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>
              <span className="eyebrow-text">
                {skills.sectionLabel ? skills.sectionLabel.toUpperCase() : 'TOOLS & TECHNOLOGIES'}
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
              {skills.heading}
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
              A focused technical foundation spanning machine learning architectures, cybersecurity, modern web engineering and production tools.
            </p>
          </div>
          <a
            href="#contact"
            className="btn btn-secondary"
            style={{
              borderColor: 'rgba(201, 150, 62, 0.4)',
              color: 'var(--color-gold-bright)',
              fontSize: '0.88rem',
              padding: '0.65rem 1.5rem',
            }}
          >
            Get in Touch →
          </a>
        </div>

        {/* Categories Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="skill-category-card"
              style={{
                padding: '1.5rem 1.75rem',
                backgroundColor: 'var(--color-navy-card)',
                border: '1px solid rgba(201, 150, 62, 0.18)',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}
            >
              {/* Category Header Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.15rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-gold)',
                      boxShadow: '0 0 8px rgba(201, 150, 62, 0.6)',
                      display: 'inline-block',
                    }}
                  />
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--color-gold-bright)',
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {cat.name}
                  </h3>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-light-subtle)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  {cat.items.length} skills
                </span>
              </div>

              {/* Skills Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {cat.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-item-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'rgba(5, 11, 22, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '10px',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'default',
                    }}
                  >
                    {/* Consistent icon container */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        minWidth: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {skill.icon}
                    </div>

                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'var(--color-text-light)',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skill-category-card:hover {
          border-color: rgba(201, 150, 62, 0.32) !important;
        }
        .skill-item-card:hover {
          border-color: rgba(201, 150, 62, 0.5) !important;
          background-color: rgba(201, 150, 62, 0.08) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4), 0 0 10px rgba(201, 150, 62, 0.12);
        }
        @media (max-width: 640px) {
          .skill-category-card {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
