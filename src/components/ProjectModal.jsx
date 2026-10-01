import React, { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  // Only consider authentic links that are non-empty strings (strictly no fake/dead buttons)
  const availableLinks = Object.entries(project.links || {}).filter(([_, url]) => Boolean(url && url.trim()));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 11, 22, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="card-dark"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          border: '1px solid rgba(201, 150, 62, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          backgroundColor: 'var(--color-navy-card)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Matching Mobile App - Project Details Wireframe) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to projects"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-white)' }}>
              Project Details
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--color-text-light-muted)',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Hero Visual Pattern */}
        <div
          style={{
            width: '100%',
            height: '180px',
            backgroundColor: 'var(--color-navy-surface)',
            borderBottom: '1px solid rgba(201, 150, 62, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={`modal-grad-${project.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#101B2E" />
                <stop offset="100%" stopColor="#050B16" />
              </linearGradient>
            </defs>
            <rect width="360" height="120" fill={`url(#modal-grad-${project.id})`} />
            <path d="M0 40H360M0 80H360M90 0V120M180 0V120M270 0V120" stroke="#C9963E" strokeOpacity="0.15" />
            <g dangerouslySetInnerHTML={{ __html: project.svgPaths }} />
          </svg>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Category Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
            <span className="badge-gold">{project.primaryCategory}</span>
            {project.secondaryCategory && (
              <span className="badge-gold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-light-muted)' }}>
                {project.secondaryCategory}
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: 'rgba(201, 150, 62, 0.6)', marginLeft: 'auto', fontFamily: 'monospace' }}>
              #{project.number}
            </span>
          </div>

          {/* Title */}
          <h2
            id="modal-title"
            className="font-serif"
            style={{
              fontSize: '1.65rem',
              color: 'var(--color-white)',
              lineHeight: 1.3,
              marginBottom: '0.75rem'
            }}
          >
            {project.title}
          </h2>

          {/* Research Question */}
          {project.researchQuestion && (
            <p
              className="font-serif"
              style={{
                fontStyle: 'italic',
                color: 'var(--color-gold-light)',
                fontSize: '1.05rem',
                lineHeight: 1.5,
                marginBottom: '1.25rem'
              }}
            >
              "{project.researchQuestion}"
            </p>
          )}

          {/* Overview */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Project Overview
            </h4>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.95rem', lineHeight: '1.65' }}>
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Key Highlights / Stack Checklist (Matching Wireframe) */}
          {project.highlights && project.highlights.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Key Highlights & Stack
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {project.highlights.map((hl, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--color-white)' }}>
                    <span style={{ color: 'var(--color-gold-bright)', display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', marginBottom: '0.65rem', fontWeight: 700 }}>
                Technologies Used
              </h4>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {project.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--color-text-light-muted)',
                      fontSize: '0.82rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs (Strictly rendered ONLY when actual links exist) */}
          {availableLinks.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                flexWrap: 'wrap'
              }}
            >
              {availableLinks.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={key === 'github' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  {key === 'github' ? 'View on GitHub' : key === 'demo' ? 'Live Demo' : 'Read Paper'}
                </a>
              ))}
            </div>
          )}

          {/* Full Case Study Page Route Link */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', paddingTop: '1rem', borderTop: availableLinks.length > 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
            <a
              href={`/projects/${project.slug || project.id}`}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                window.history.pushState({}, '', `/projects/${project.slug || project.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              style={{
                color: 'var(--color-gold-bright)',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              Open Full Case Study Page (SEO Route) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
