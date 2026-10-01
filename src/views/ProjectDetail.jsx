import React, { useState, useEffect } from 'react';
import { fetchProjectBySlug } from '../lib/supabase.js';
import { Link, useRouter } from '../router.jsx';
import { portfolioData } from '../data/portfolio.js';

export default function ProjectDetail({ params }) {
  const { slug } = params;
  const { navigate } = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchProjectBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setProject(data);
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
        <p>Loading project case study…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ color: 'var(--color-white)', fontSize: '2rem', marginBottom: '1rem' }}>Project Not Found</h2>
        <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '2rem' }}>The requested project case study could not be located.</p>
        <Link to="/#projects" className="btn btn-primary">← Back to Projects</Link>
      </div>
    );
  }

  const technologies = project.technologies || [];
  const links = project.links || {
    github: project.github_url || '',
    demo: project.demo_url || '',
    paper: project.paper_url || '',
  };
  const validLinks = Object.entries(links).filter(([_, url]) => Boolean(url && url.trim()));

  return (
    <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', minHeight: '100vh', paddingTop: '5rem', paddingBottom: '6rem' }}>
      {/* Top Header Bar */}
      <div className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => navigate('/#projects')}
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
            Back to Portfolio
          </button>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            Case Study #{project.number || '01'}
          </span>
        </div>
      </div>

      <article className="container" style={{ maxWidth: '860px' }}>
        {/* Project Header */}
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {project.category && (
              <span style={{
                padding: '0.25rem 0.8rem',
                borderRadius: '100px',
                background: 'rgba(201, 150, 62, 0.12)',
                border: '1px solid rgba(201, 150, 62, 0.3)',
                color: 'var(--color-gold-bright)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}>
                {project.category}
              </span>
            )}
            {project.year && (
              <span style={{
                padding: '0.25rem 0.8rem',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--color-text-light-muted)',
                fontSize: '0.75rem',
              }}>
                {project.year}
              </span>
            )}
          </div>

          <h1 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--color-white)' }}>
            {project.title}
          </h1>

          {(project.short_description || project.description) && (
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-light-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
              "{project.short_description || project.description}"
            </p>
          )}
        </header>

        {/* Cover / Visual Artwork */}
        {project.cover_image ? (
          <div style={{ marginBottom: '3.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(201, 150, 62, 0.25)' }}>
            <img src={project.cover_image} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        ) : project.svgPaths ? (
          <div style={{
            marginBottom: '3.5rem',
            background: 'var(--color-navy-card)',
            border: '1px solid rgba(201, 150, 62, 0.25)',
            borderRadius: '16px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg viewBox="0 0 360 130" style={{ width: '100%', maxHeight: '180px', opacity: 0.9 }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: project.svgPaths }} />
          </div>
        ) : null}

        {/* Overview */}
        {(project.full_description || project.fullDescription) && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-serif" style={{ color: 'var(--color-gold-bright)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Overview</h2>
            <p style={{ color: 'var(--color-white)', lineHeight: 1.8, fontSize: '1.02rem' }}>
              {project.full_description || project.fullDescription}
            </p>
          </section>
        )}

        {/* Challenge / Problem */}
        {(project.problem || project.researchQuestion) && (
          <section style={{ marginBottom: '2.5rem', padding: '1.5rem 1.75rem', background: 'rgba(201, 150, 62, 0.05)', borderLeft: '3px solid var(--color-gold)', borderRadius: '0 12px 12px 0' }}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.5rem', fontWeight: 700 }}>
              The Problem & Core Research Question
            </h2>
            <p style={{ color: 'var(--color-white)', lineHeight: 1.7, fontSize: '1rem' }}>
              {project.problem || project.researchQuestion}
            </p>
          </section>
        )}

        {/* Approach */}
        {project.approach && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-serif" style={{ color: 'var(--color-gold-bright)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Approach & Methodology</h2>
            <p style={{ color: 'var(--color-text-light-muted)', lineHeight: 1.8, fontSize: '1.02rem' }}>
              {project.approach}
            </p>
          </section>
        )}

        {/* Technical Architecture */}
        {project.architecture && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-serif" style={{ color: 'var(--color-gold-bright)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Technical Architecture</h2>
            <p style={{ color: 'var(--color-text-light-muted)', lineHeight: 1.8, fontSize: '1.02rem' }}>
              {project.architecture}
            </p>
          </section>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-serif" style={{ color: 'var(--color-gold-bright)', fontSize: '1.4rem', marginBottom: '0.85rem' }}>Technologies & Tools</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
              {technologies.map((tech) => (
                <span key={tech} style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '100px',
                  background: 'var(--color-navy-card)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-light)',
                  fontSize: '0.85rem',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Results / Outcomes */}
        {project.outcomes && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-serif" style={{ color: 'var(--color-gold-bright)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Results & Outcomes</h2>
            <p style={{ color: 'var(--color-text-light-muted)', lineHeight: 1.8, fontSize: '1.02rem' }}>
              {project.outcomes}
            </p>
          </section>
        )}

        {/* Current Stage */}
        {project.current_stage && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Current Stage
            </h2>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              {project.current_stage}
            </p>
          </section>
        )}

        {/* Links */}
        {validLinks.length > 0 && (
          <section style={{ marginBottom: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '1rem', fontWeight: 700 }}>
              Project Artifacts & Links
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              {validLinks.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ textTransform: 'capitalize', fontSize: '0.9rem', borderColor: 'var(--color-gold)' }}
                >
                  {key} ↗
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section style={{
          marginTop: '4rem',
          padding: '2.5rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(201, 150, 62, 0.12), rgba(5, 11, 22, 0.6))',
          border: '1px solid rgba(201, 150, 62, 0.3)',
          textAlign: 'center',
        }}>
          <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--color-white)', marginBottom: '0.5rem' }}>
            Interested in this research or collaboration?
          </h3>
          <p style={{ color: 'var(--color-text-light-muted)', maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
            Let's discuss technical architecture, methodology, or prospective collaboration opportunities.
          </p>
          <button
            type="button"
            onClick={() => navigate('/#contact')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.8rem' }}
          >
            Get In Touch →
          </button>
        </section>
      </article>
    </div>
  );
}
