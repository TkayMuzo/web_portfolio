import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout.jsx';
import ArticleEditor from './ArticleEditor.jsx';
import { supabase, isSupabaseConfigured, uploadMedia } from '../lib/supabase.js';
import { portfolioData } from '../data/portfolio.js';
import { sanitizeArticleHtml, toArticleHtml } from '../lib/articleContent.js';

const initialArticleState = {
  id: '',
  title: '',
  slug: '',
  category: '',
  tags: '',
  excerpt: '',
  content: '',
  cover_image: '',
  status: 'draft',
  featured: false,
  published_at: new Date().toISOString().split('T')[0],
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingArticle, setEditingArticle] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const savedEditorState = useRef('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || !supabase) {
      const staticList = portfolioData.writing.articles.map((a, idx) => ({
        id: a.id || `article-${idx}`,
        title: a.title,
        slug: a.id || `article-${idx}`,
        category: a.category || 'Writing',
        tags: 'Purpose, Growth, Mindset',
        excerpt: a.excerptPlaceholder || 'Reflections and insights.',
        content: a.excerptPlaceholder || 'Article content in draft.',
        cover_image: '',
        status: 'published',
        featured: true,
        published_at: '2024-05-01',
      }));
      setArticles(staticList);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to load articles: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (art = null) => {
    let article;
    if (art) {
      article = {
        ...art,
        tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || ''),
        published_at: art.published_at ? art.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
        content: toArticleHtml(art.content),
      };
    } else {
      article = { ...initialArticleState };
    }
    setEditingArticle(article);
    savedEditorState.current = JSON.stringify(article);
    setIsEditorOpen(true);
    setNotification({ type: '', message: '' });
  };

  const hasUnsavedChanges = () => Boolean(editingArticle && JSON.stringify(editingArticle) !== savedEditorState.current);

  const handleCloseEditor = () => {
    if (hasUnsavedChanges() && !window.confirm('You have unsaved changes. Discard them?')) return;
    setIsEditorOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingArticle.title.trim()) {
      setNotification({ type: 'error', message: 'Article title is required.' });
      return;
    }

    const slug = editingArticle.slug.trim() || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const tagsArray = editingArticle.tags
      ? editingArticle.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: editingArticle.title.trim(),
      slug,
      category: editingArticle.category.trim() || null,
      tags: tagsArray,
      excerpt: editingArticle.excerpt.trim() || null,
      content: sanitizeArticleHtml(editingArticle.content).trim() || null,
      cover_image: editingArticle.cover_image.trim() || null,
      status: editingArticle.status,
      featured: Boolean(editingArticle.featured),
      published_at: editingArticle.published_at ? new Date(editingArticle.published_at).toISOString() : null,
    };

    if (!isSupabaseConfigured() || !supabase) {
      if (editingArticle.id) {
        setArticles(articles.map((a) => (a.id === editingArticle.id ? { ...a, ...payload } : a)));
      } else {
        setArticles([{ ...payload, id: Date.now().toString() }, ...articles]);
      }
      savedEditorState.current = JSON.stringify({ ...editingArticle, ...payload });
      setIsEditorOpen(false);
      setNotification({ type: 'success', message: 'Article updated in local preview (configure Supabase in .env for database save).' });
      return;
    }

    setSaving(true);
    try {
      if (editingArticle.id && editingArticle.created_at) {
        const { error } = await supabase.from('articles').update(payload).eq('id', editingArticle.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Article updated successfully.' });
      } else {
        const { error } = await supabase.from('articles').insert([payload]);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Article published/saved successfully.' });
      }
      savedEditorState.current = JSON.stringify({ ...editingArticle, ...payload });
      setIsEditorOpen(false);
      loadArticles();
    } catch (err) {
      setNotification({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    if (!isSupabaseConfigured() || !supabase) {
      setArticles(articles.filter((a) => a.id !== id));
      setNotification({ type: 'success', message: 'Article removed from preview.' });
      return;
    }

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setNotification({ type: 'success', message: 'Article deleted.' });
      loadArticles();
    } catch (err) {
      setNotification({ type: 'error', message: 'Delete error: ' + err.message });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured() || !supabase) {
      alert('Supabase storage requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be configured in .env.');
      return;
    }

    setUploadingImage(true);
    try {
      const publicUrl = await uploadMedia(file, 'portfolio-media');
      setEditingArticle((prev) => ({ ...prev, cover_image: publicUrl }));
      setNotification({ type: 'success', message: 'Image uploaded successfully.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Upload failed: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.category && a.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(5, 11, 22, 0.7)',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--color-gold)',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <AdminLayout activeTab="articles">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-white)', marginBottom: '0.25rem' }}>
              Articles CMS
            </h1>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}>
              Write, publish, and edit articles, essays, and technical thought leadership.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.3rem' }}
          >
            + Write New Article
          </button>
        </div>

        {notification.message && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${notification.type === 'error' ? '#F87171' : '#34D399'}`,
            color: notification.type === 'error' ? '#FCA5A5' : '#6EE7B7',
          }}>
            {notification.message}
          </div>
        )}

        {/* Filter and Search */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: 'var(--color-navy-card)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <input
            type="text"
            placeholder="Search articles by title or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, flex: '1 1 240px', minWidth: '200px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light-muted)' }}>Status:</span>
            {['all', 'published', 'draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: filterStatus === st ? '1px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: filterStatus === st ? 'rgba(201,150,62,0.15)' : 'transparent',
                  color: filterStatus === st ? 'var(--color-gold-bright)' : 'var(--color-text-light-muted)',
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>Loading articles…</div>
        ) : filteredArticles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--color-navy-card)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '1rem' }}>No articles match your search.</p>
            <button type="button" onClick={() => handleOpenEditor()} className="btn btn-secondary">
              Write Your First Article
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                style={{
                  backgroundColor: 'var(--color-navy-card)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201,150,62,0.2)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '100px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      backgroundColor: art.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: art.status === 'published' ? '#34D399' : '#FBBF24',
                      border: `1px solid ${art.status === 'published' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                      textTransform: 'uppercase',
                    }}>
                      {art.status}
                    </span>
                    {art.category && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>
                        {art.category}
                      </span>
                    )}
                    {art.published_at && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>
                        • {art.published_at.split('T')[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '0.3rem' }}>
                    {art.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.85rem', maxWidth: '650px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {art.excerpt || 'No excerpt provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditor(art)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(201,150,62,0.3)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-gold-bright)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(art.id)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'transparent',
                      color: '#F87171',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editor Modal */}
        {isEditorOpen && editingArticle && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(5, 11, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}>
            <div style={{
              backgroundColor: 'var(--color-navy-card)',
              borderRadius: '20px',
              border: '1px solid rgba(201,150,62,0.4)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-white)' }}>
                  {editingArticle.id ? 'Edit Article' : 'Write New Article'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseEditor}
                  aria-label="Close article editor"
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-light-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Article Title *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    placeholder="e.g. The Power of Purpose in a Student's Journey"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Slug</label>
                    <input
                      type="text"
                      value={editingArticle.slug}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      placeholder="e.g. power-of-purpose"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input
                      type="text"
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      placeholder="e.g. Purpose, Cybersecurity, Personal"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Publish Date</label>
                    <input
                      type="date"
                      value={editingArticle.published_at}
                      onChange={(e) => setEditingArticle({ ...editingArticle, published_at: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingArticle.tags}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tags: e.target.value })}
                    placeholder="Purpose, Student Life, Mindset"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for cards and meta descriptions…"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Cover Image (Upload or URL)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editingArticle.cover_image}
                      onChange={(e) => setEditingArticle({ ...editingArticle, cover_image: e.target.value })}
                      placeholder="Image URL or upload"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <label style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--color-gold)',
                      color: 'var(--color-gold-bright)',
                      fontSize: '0.78rem',
                      cursor: uploadingImage ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor: 'rgba(201,150,62,0.1)',
                    }}>
                      {uploadingImage ? 'Uploading…' : 'Upload'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Article Body / Content</label>
                  <ArticleEditor
                    value={editingArticle.content}
                    onChange={(content) => setEditingArticle((current) => ({ ...current, content }))}
                  />
                  {hasUnsavedChanges() && (
                    <p style={{ color: 'var(--color-gold-light)', fontSize: '0.78rem', marginTop: '0.5rem' }} role="status">Unsaved changes</p>
                  )}
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(5, 11, 22, 0.6)',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                }}>
                  <div>
                    <label style={labelStyle}>Publication Status</label>
                    <select
                      value={editingArticle.status}
                      onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value })}
                      style={{ ...inputStyle, width: '160px', cursor: 'pointer' }}
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="published">Published (Public)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      id="art-featured"
                      type="checkbox"
                      checked={editingArticle.featured}
                      onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="art-featured" style={{ fontSize: '0.88rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                      Mark as Featured Article
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseEditor}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-light-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    {saving ? 'Saving…' : 'Save Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
