import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio.js';
import { fetchPublishedProjects } from '../lib/supabase.js';
import ProjectCard from './ProjectCard.jsx';

export default function Projects({ onSelectProject }) {
  const [projectList, setProjectList] = useState(portfolioData.projects);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchPublishedProjects().then((res) => {
      if (isMounted && res?.data?.length) {
        setProjectList(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProjects = [...projectList]
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));

  const displayedProjects = showAll ? projectList : featuredProjects;

  return (
    <section
      id="projects"
      style={{
        backgroundColor: 'var(--color-navy)',
        padding: 'var(--section-spacing) 0',
        position: 'relative',
      }}
    >
      {/* Subtle top separator */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,150,62,0.3), transparent)',
      }} />

      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem',
        }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
              FEATURED PROJECTS
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', color: 'var(--color-white)', lineHeight: 1.2, marginTop: '0.35rem' }}>
              Some of My Work
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(201,150,62,0.4)', color: 'var(--color-gold-bright)', fontSize: '0.88rem', padding: '0.6rem 1.4rem' }}
          >
            {showAll ? '← Show Featured' : 'View All Projects →'}
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.75rem',
        }}>
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onSelectProject}
            />
          ))}
        </div>

        {/* "View All" hint when showing featured */}
        {!showAll && projectList.length > featuredProjects.length && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {projectList.length - featuredProjects.length} more project{projectList.length - featuredProjects.length !== 1 ? 's' : ''} available
            </p>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="btn btn-secondary"
              style={{ borderColor: 'rgba(201,150,62,0.3)', color: 'var(--color-text-light-muted)', fontSize: '0.85rem' }}
            >
              View All {projectList.length} Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
