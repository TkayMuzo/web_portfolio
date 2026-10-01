import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';
import { fetchPublishedArticles, fetchPublishedBooks } from '../lib/supabase.js';

export default function Writing() {
  const { writing, brand } = portfolioData;
  const [book, setBook] = useState(writing.book);
  const [articleList, setArticleList] = useState(writing.articles);

  useEffect(() => {
    let isMounted = true;
    fetchPublishedArticles().then((res) => {
      if (isMounted && res?.data?.length) {
        setArticleList(res.data);
      }
    });
    fetchPublishedBooks().then((res) => {
      if (isMounted && res?.data?.length) {
        setBook(res.data[0]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // CMS book records are flat, while the static portfolio book includes cover
  // presentation data. Merge them for this view so either source is safe.
  const fallbackBook = writing.book || {};
  const safeBook = {
    ...fallbackBook,
    ...(book || {}),
    cover: {
      ...(fallbackBook.cover || {}),
      ...(book?.cover || {}),
      author: book?.author || book?.cover?.author || fallbackBook.cover?.author || '',
    },
    keyHighlights: Array.isArray(book?.keyHighlights)
      ? book.keyHighlights
      : Array.isArray(book?.highlights)
        ? book.highlights
        : (fallbackBook.keyHighlights || []),
  };
  const safeArticles = Array.isArray(articleList)
    ? articleList.filter((article) => article && typeof article.title === 'string')
    : [];
  const bookSlug = safeBook.slug || 'the-zimbabwean-india-dream';
  const purchaseUrl = safeBook.purchase_url || safeBook.links?.buyUrl || '';
  const sampleUrl = safeBook.sample_url || safeBook.links?.sampleUrl || '';

  // Only show book action links that exist
  const bookLinks = [
    purchaseUrl && { label: 'Buy Now', href: purchaseUrl, primary: true, external: true },
    sampleUrl && { label: 'Read Sample', href: sampleUrl, primary: false, external: true },
    { label: 'Book Details →', href: `/books/${bookSlug}`, primary: false, external: false },
  ].filter(Boolean);

  return (
    <section
      id="writing"
      style={{
        backgroundColor: 'var(--color-surface-warm)',
        color: 'var(--color-text-dark)',
        padding: 'var(--section-spacing) 0',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="eyebrow" style={{ color: 'var(--color-gold-dark)', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700 }}>
            {writing.sectionLabel.toUpperCase()}
          </span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', color: 'var(--color-text-dark)', lineHeight: 1.2, marginTop: '0.35rem' }}>
            Ideas that Inspire
          </h2>
          <p style={{ color: 'var(--color-text-dark-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '640px', lineHeight: 1.6 }}>
            {writing.heading}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="writing-grid">
          {/* LEFT: Featured Book */}
          <div
            className="card-light"
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              borderRadius: '20px',
              border: '1px solid rgba(201,150,62,0.3)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              display: 'flex',
              gap: '2rem',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {/* Book cover */}
            <div
              style={{
                width: '160px',
                minWidth: '140px',
                aspectRatio: '2/3',
                backgroundColor: 'var(--color-navy)',
                borderRadius: '8px 14px 14px 8px',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'var(--color-white)',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '-6px 10px 25px rgba(5,11,22,0.4), inset 4px 0 8px rgba(255,255,255,0.08)',
                border: '1px solid rgba(201,150,62,0.4)',
                transform: 'perspective(600px) rotateY(-8deg)',
                flexShrink: 0,
                margin: '0 auto',
              }}
            >
              {/* Spine line */}
              <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '2px', background: 'rgba(201,150,62,0.2)', borderRadius: '2px' }} aria-hidden="true" />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={brand.logoPath} alt={brand.name} style={{ width: '32px', height: 'auto', opacity: 0.9 }} />
              </div>
              <div>
                <h4 className="font-serif" style={{ fontSize: '0.88rem', color: 'var(--color-gold-bright)', lineHeight: 1.25, marginBottom: '0.35rem', fontWeight: 700 }}>
                  {(safeBook.cover.title || safeBook.title || '').toUpperCase()}
                </h4>
                <div style={{ fontSize: '0.52rem', color: 'var(--color-gold-light)', letterSpacing: '0.1em' }}>
                  {safeBook.cover.subtitle}
                </div>
              </div>
              <div style={{ fontSize: '0.58rem', color: 'var(--color-text-light-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>
                {safeBook.cover.author}
              </div>
            </div>

            {/* Book info */}
            <div style={{ flex: '1 1 220px' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-gold-dark)',
                border: '1px solid rgba(201,150,62,0.4)',
                borderRadius: '100px',
                padding: '0.2rem 0.7rem',
                marginBottom: '0.85rem',
              }}>
                {safeBook.badge}
              </span>
              <h3 className="font-serif" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', color: 'var(--color-text-dark)', lineHeight: 1.25, marginBottom: '0.65rem', fontWeight: 700 }}>
                {safeBook.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-dark-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {safeBook.description}
              </p>

              {/* Key highlights */}
              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {safeBook.keyHighlights.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                    <span style={{ color: 'var(--color-gold-dark)', display: 'flex', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA buttons — only rendered when actual URLs exist */}
              {bookLinks.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {bookLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link.primary ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                /* Fallback when no book URLs are configured */
                <a
                  href="#contact"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}
                >
                  Get in Touch →
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: Articles */}
          <div
            className="card-light"
            style={{
              padding: '2rem 1.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(229,231,235,0.8)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--color-text-dark)', fontWeight: 600 }}>
                Latest Articles
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                {safeArticles.length} pieces
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              {safeArticles.map((art) => {
                const targetUrl = `/articles/${art.slug || art.id}`;

                return (
                  <a
                    key={art.id}
                    href={targetUrl}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.9rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-gray-50)',
                      border: '1px solid rgba(229,231,235,0.6)',
                      transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-white)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {/* Category icon */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'var(--color-navy)',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)', lineHeight: 1.35, marginBottom: '0.3rem' }}>
                        {art.title}
                      </h4>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--color-gold-dark)',
                        background: 'rgba(201,150,62,0.1)',
                        border: '1px solid rgba(201,150,62,0.25)',
                        borderRadius: '100px',
                        padding: '0.1rem 0.5rem',
                      }}>
                        {art.category}
                      </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .writing-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 2rem;
          align-items: stretch;
        }
        @media (max-width: 960px) {
          .writing-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
