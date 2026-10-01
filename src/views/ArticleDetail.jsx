import React, { useState, useEffect } from 'react';
import { fetchArticleBySlug } from '../lib/supabase.js';
import { Link, useRouter } from '../router.jsx';
import { sanitizeArticleHtml, toArticleHtml } from '../lib/articleContent.js';

export default function ArticleDetail({ params }) {
  const { slug } = params;
  const { navigate } = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setArticle(data);
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
        <p>Loading article…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ color: 'var(--color-white)', fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '2rem' }}>The article you requested could not be found or has not been published.</p>
        <Link to="/#writing" className="btn btn-primary">← Back to Writing</Link>
      </div>
    );
  }

  const safeArticleContent = sanitizeArticleHtml(
    toArticleHtml(article.content || article.excerptPlaceholder || '')
  );

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', minHeight: '100vh', paddingTop: '5rem', paddingBottom: '6rem' }}>
      {/* Top Header Bar */}
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
            Back to Writing
          </button>
          {article.category && (
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
              {article.category}
            </span>
          )}
        </div>
      </div>

      <article className="container" style={{ maxWidth: '780px' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--color-text-light-muted)', fontSize: '0.85rem' }}>
            {formattedDate && <span>{formattedDate}</span>}
            {article.category && <span>• {article.category}</span>}
          </div>

          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 2.9rem)', lineHeight: 1.2, marginBottom: '1.25rem', color: 'var(--color-white)' }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{ fontSize: '1.15rem', color: 'var(--color-gold-light)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
              {article.excerpt}
            </p>
          )}

          {article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {article.tags.map((tag) => (
                <span key={tag} style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.75rem',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {article.cover_image && (
          <div style={{ marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(201, 150, 62, 0.25)' }}>
            <img src={article.cover_image} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div className="article-prose" dangerouslySetInnerHTML={{ __html: safeArticleContent }} />

        {/* Article Footer CTA */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: 600 }}>Takudzwa Muzovaka</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-gold)' }}>Author • Computer Science & AI Student</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/#contact')}
            className="btn btn-secondary"
            style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold-bright)', fontSize: '0.85rem' }}
          >
            Connect with Author →
          </button>
        </div>
      </article>
    </div>
  );
}
