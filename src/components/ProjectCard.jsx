import React from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function ProjectCard({ project, index, onClick }) {
  const isFeatured = project.featured;

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(project);
    }
  };

  return (
    <article
      className="project-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={handleKey}
      aria-label={`View case study: ${project.title}`}
      style={{
        background: 'var(--color-navy-card)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,150,62,0.4)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* SVG thumbnail */}
      <div style={{
        background: 'rgba(5,11,22,0.8)',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <svg
          viewBox="0 0 360 130"
          style={{ width: '90%', height: '90%', opacity: 0.85 }}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: project.svgPaths }}
        />
        {/* Number overlay */}
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.85rem',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
          color: 'rgba(201,150,62,0.6)',
        }}>
          {project.number}
        </div>
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '0.7rem', right: '0.75rem',
          padding: '0.2rem 0.6rem',
          background: 'rgba(201,150,62,0.12)',
          border: '1px solid rgba(201,150,62,0.25)',
          borderRadius: '100px',
          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
          color: 'var(--color-gold-bright)',
        }}>
          {project.primaryCategory}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '1.35rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category Pills (Matching Wireframe) */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{
            padding: '0.2rem 0.65rem',
            background: 'var(--color-gold-subtle)',
            border: '1px solid var(--color-gold-border)',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-gold-bright)',
            letterSpacing: '0.02em',
          }}>
            {project.primaryCategory}
          </span>
          {project.secondaryCategory && (
            <span style={{
              padding: '0.2rem 0.65rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'var(--color-text-light-muted)',
              letterSpacing: '0.02em',
            }}>
              {project.secondaryCategory}
            </span>
          )}
        </div>

        <h3 style={{
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: 1.35,
        }}>
          {project.shortTitle || project.title}
        </h3>

        <p style={{
          color: 'var(--color-text-light-muted)',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          marginBottom: '1rem',
          flex: 1,
        }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {project.technologies.slice(0, 4).map(tech => (
            <span
              key={tech}
              style={{
                padding: '0.2rem 0.55rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                fontSize: '0.7rem',
                color: 'var(--color-text-light-muted)',
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)',
            }}>
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* View Project link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--color-gold-bright)',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 'auto',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            View Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(201,150,62,0.5)', fontFamily: 'monospace' }}>
            #{project.number}
          </span>
        </div>
      </div>
    </article>
  );
}
