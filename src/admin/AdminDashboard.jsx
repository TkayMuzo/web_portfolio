import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { Link, useRouter } from '../router.jsx';
import { portfolioData } from '../data/portfolio.js';

export default function AdminDashboard() {
  const { navigate } = useRouter();
  const [stats, setStats] = useState({
    publishedProjects: 0,
    draftProjects: 0,
    publishedArticles: 0,
    draftArticles: 0,
    publishedBooks: 0,
    draftBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to static numbers
        setStats({
          publishedProjects: portfolioData.projects.length,
          draftProjects: 0,
          publishedArticles: portfolioData.writing.articles.length,
          draftArticles: 0,
          publishedBooks: 1,
          draftBooks: 0,
        });
        setLoading(false);
        return;
      }

      try {
        const [projRes, artRes, bookRes] = await Promise.all([
          supabase.from('projects').select('status'),
          supabase.from('articles').select('status'),
          supabase.from('books').select('status'),
        ]);

        const projects = projRes.data || [];
        const articles = artRes.data || [];
        const books = bookRes.data || [];

        setStats({
          publishedProjects: projects.filter((p) => p.status === 'published').length,
          draftProjects: projects.filter((p) => p.status === 'draft').length,
          publishedArticles: articles.filter((a) => a.status === 'published').length,
          draftArticles: articles.filter((a) => a.status === 'draft').length,
          publishedBooks: books.filter((b) => b.status === 'published').length,
          draftBooks: books.filter((b) => b.status === 'draft').length,
        });
      } catch (err) {
        console.error('Failed to load CMS stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cardStyle = {
    backgroundColor: 'var(--color-navy-card)',
    borderRadius: '16px',
    border: '1px solid rgba(201,150,62,0.25)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <AdminLayout activeTab="overview">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--color-white)', marginBottom: '0.35rem' }}>
              Content Management Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.95rem' }}>
              Welcome back, Takudzwa. Manage your portfolio projects, publications, and articles.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/projects" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
              + New Project
            </Link>
          </div>
        </div>

        {/* Database Connection Notice */}
        {!isSupabaseConfigured() && (
          <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
            color: '#FACC15',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}>
            <strong>⚡ Local Preview Mode (Supabase not configured in .env):</strong>
            <p style={{ marginTop: '0.35rem', color: '#FEF08A' }}>
              Displaying local static data from <code>portfolio.js</code>. To enable database persistence and live editing, create a Supabase project, execute <code>supabase/schema.sql</code>, and configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>.
            </p>
          </div>
        )}

        {/* CMS Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {/* Projects Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', fontWeight: 600 }}>
                  PORTFOLIO
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-white)', marginTop: '0.2rem' }}>
                  Projects
                </h3>
              </div>
              <span style={{ fontSize: '1.8rem' }}>💻</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold-bright)' }}>
                  {stats.publishedProjects}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Published</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-light-muted)' }}>
                  {stats.draftProjects}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Drafts</div>
              </div>
            </div>
            <Link to="/admin/projects" style={{ color: 'var(--color-gold-bright)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
              Manage Projects →
            </Link>
          </div>

          {/* Articles Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', fontWeight: 600 }}>
                  PUBLICATIONS
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-white)', marginTop: '0.2rem' }}>
                  Articles
                </h3>
              </div>
              <span style={{ fontSize: '1.8rem' }}>✍️</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold-bright)' }}>
                  {stats.publishedArticles}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Published</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-light-muted)' }}>
                  {stats.draftArticles}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Drafts</div>
              </div>
            </div>
            <Link to="/admin/articles" style={{ color: 'var(--color-gold-bright)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
              Manage Articles →
            </Link>
          </div>

          {/* Books Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-gold)', fontWeight: 600 }}>
                  AUTHOR
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-white)', marginTop: '0.2rem' }}>
                  Books
                </h3>
              </div>
              <span style={{ fontSize: '1.8rem' }}>📚</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold-bright)' }}>
                  {stats.publishedBooks}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Published</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-light-muted)' }}>
                  {stats.draftBooks}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>Drafts</div>
              </div>
            </div>
            <Link to="/admin/books" style={{ color: 'var(--color-gold-bright)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
              Manage Books →
            </Link>
          </div>
        </div>

        {/* Quick Links / Guide */}
        <div style={{
          backgroundColor: 'var(--color-navy-card)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '1.75rem',
        }}>
          <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '0.75rem' }}>
            Quick Admin Guidance
          </h3>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-text-light-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <li><strong>Draft vs. Published:</strong> Content marked as "Draft" is strictly visible only to authenticated admins in this dashboard. Only "Published" items are exposed on the public portfolio.</li>
            <li><strong>Media Uploads:</strong> You can upload project, article, and book cover images directly to the <code>portfolio-media</code> Supabase storage bucket via the respective editors.</li>
            <li><strong>Safe Fallbacks:</strong> If the database is ever disconnected or in maintenance, the public portfolio seamlessly falls back to the static content in <code>portfolio.js</code>.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
