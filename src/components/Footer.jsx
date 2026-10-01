import { portfolioData } from '../data/portfolio.js';
import { SOCIAL_ICONS, PLATFORM_LABELS } from './SocialIcons.jsx';

export default function Footer() {
  const { brand, navigation, socialLinks, footer } = portfolioData;
  const activeSocials = Object.entries(socialLinks || {}).filter(([, url]) => Boolean(url && url.trim()));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-navy)',
        borderTop: '1px solid rgba(201, 150, 62, 0.22)',
        padding: '4.5rem 0 2.5rem',
        color: 'var(--color-text-light-muted)',
        position: 'relative',
      }}
    >
      {/* Subtle gold accent line across top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(201, 150, 62, 0.4), transparent)',
        }}
      />

      <div className="container" style={{ textAlign: 'center' }}>
        {/* Brand Lockup */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <a
            href="#home"
            aria-label="Takudzwa Muzovaka — Back to home"
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src={brand.logoPath}
              alt={brand.name}
              style={{
                width: '44px',
                height: 'auto',
                marginBottom: '0.85rem',
                filter: 'drop-shadow(0 2px 10px rgba(201, 150, 62, 0.35))',
              }}
            />
            <h3
              className="font-serif"
              style={{
                fontSize: '1.25rem',
                color: 'var(--color-white)',
                letterSpacing: '0.12em',
                fontWeight: 700,
                marginBottom: '0.35rem',
              }}
            >
              {brand.name.toUpperCase()}
            </h3>
          </a>

          <p
            className="font-serif"
            style={{
              fontStyle: 'italic',
              color: 'var(--color-gold-light)',
              fontSize: '0.95rem',
              margin: '0.2rem 0 0.5rem',
            }}
          >
            {footer.motto}
          </p>

          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
            }}
          >
            {footer.pillars}
          </div>
        </div>

        {/* Navigation Quick Links */}
        <nav
          aria-label="Footer navigation"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem 1.75rem',
            margin: '1.75rem 0 2.5rem',
          }}
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="footer-nav-link"
              style={{
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--color-text-light-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
                padding: '0.25rem 0.5rem',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Social Icons — only shown when URLs exist */}
        {activeSocials.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {activeSocials.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={PLATFORM_LABELS[platform] || platform}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(201,150,62,0.3)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--color-text-light-muted)',
                  transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-gold)';
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                  e.currentTarget.style.background = 'rgba(201,150,62,0.1)';
                }}
                onMouseLeave={(e) => {
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

        {/* Back to top & copyright bottom row */}
        <div
          className="footer-bottom-row"
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: '0.82rem',
            color: 'var(--color-text-light-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span>{footer.copyright}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <a
              href="/admin"
              style={{
                color: 'rgba(201,150,62,0.65)',
                textDecoration: 'none',
                fontSize: '0.78rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-bright)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,150,62,0.65)')}
            >
              CMS Portal
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="footer-top-btn"
            style={{
              background: 'rgba(201, 150, 62, 0.08)',
              border: '1px solid rgba(201, 150, 62, 0.28)',
              borderRadius: '100px',
              padding: '0.45rem 1.15rem',
              color: 'var(--color-gold-bright)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            <span>Back to top</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .footer-nav-link:hover {
          color: var(--color-gold-bright) !important;
        }
        .footer-top-btn:hover {
          background-color: rgba(201, 150, 62, 0.18) !important;
          border-color: var(--color-gold) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 150, 62, 0.15);
        }
        @media (max-width: 640px) {
          .footer-bottom-row {
            flex-direction: column-reverse !important;
            text-align: center !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
