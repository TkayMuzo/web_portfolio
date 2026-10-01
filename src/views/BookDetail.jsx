import React, { useState, useEffect } from 'react';
import { fetchBookBySlug } from '../lib/supabase.js';
import { Link, useRouter } from '../router.jsx';
import { portfolioData } from '../data/portfolio.js';

export default function BookDetail({ params }) {
  const { slug } = params;
  const { navigate } = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchBookBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setBook(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
        <p>Loading book details…</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ color: 'var(--color-white)', fontSize: '2rem', marginBottom: '1rem' }}>Book Not Found</h2>
        <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '2rem' }}>The requested book could not be found.</p>
        <Link to="/#writing" className="btn btn-primary">← Back to Writing</Link>
      </div>
    );
  }

  const highlights = book.highlights || book.keyHighlights || [];
  const purchaseUrl = book.purchase_url || book.links?.buyUrl || '';
  const sampleUrl = book.sample_url || book.links?.sampleUrl || '';

  return (
    <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', minHeight: '100vh', paddingTop: '5rem', paddingBottom: '6rem' }}>
      {/* Top Bar */}
      <div className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => navigate('/#writing')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold-bright)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Writing & Books
          </button>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            Published Book
          </span>
        </div>
      </div>

      <article className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left: 3D Book Cover / Media */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {book.cover_image ? (
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201, 150, 62, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', maxWidth: '320px', width: '100%' }}>
                <img src={book.cover_image} alt={book.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            ) : (
              <div
                style={{
                  width: '240px',
                  aspectRatio: '2/3',
                  backgroundColor: 'var(--color-navy-card)',
                  borderRadius: '10px 18px 18px 10px',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'var(--color-white)',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '-10px 18px 40px rgba(5,11,22,0.7), inset 4px 0 10px rgba(255,255,255,0.08)',
                  border: '1px solid rgba(201,150,62,0.45)',
                  transform: 'perspective(700px) rotateY(-8deg)',
                }}
              >
                <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '3px', background: 'rgba(201,150,62,0.25)', borderRadius: '2px' }} aria-hidden="true" />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={portfolioData.brand.logoPath} alt="TM Monogram" style={{ width: '42px', height: 'auto', opacity: 0.9 }} />
                </div>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--color-gold-bright)', lineHeight: 1.25, marginBottom: '0.5rem', fontWeight: 700 }}>
                    {book.title.toUpperCase()}
                  </h3>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-gold-light)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {book.subtitle || 'A Guide for Students'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>
                  {book.author || 'TAKUDZWA MUZOVAKA'}
                </div>
              </div>
            )}
          </div>

          {/* Right: Book Details & Actions */}
          <div>
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700 }}>
              FEATURED PUBLICATION
            </span>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', lineHeight: 1.2, marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-white)' }}>
              {book.title}
            </h1>
            <p style={{ color: 'var(--color-gold-light)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              By {book.author || 'Takudzwa Muzovaka'}
            </p>

            <div style={{ lineHeight: 1.8, fontSize: '1.02rem', color: '#CBD5E1', marginBottom: '2rem' }}>
              <p>{book.description}</p>
            </div>

            {highlights.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-gold-bright)', marginBottom: '0.85rem' }}>Key Highlights</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {highlights.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '0.6rem', color: '#E2E8F0', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons — strictly no empty or dead links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              {purchaseUrl ? (
                <a
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.6rem' }}
                >
                  Buy the Book ↗
                </a>
              ) : null}

              {sampleUrl ? (
                <a
                  href={sampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.6rem', borderColor: 'var(--color-gold)', color: 'var(--color-gold-bright)' }}
                >
                  Read Sample ↗
                </a>
              ) : null}

              <button
                type="button"
                onClick={() => navigate('/#contact')}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.6rem', borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text-light)' }}
              >
                Inquire Directly →
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
