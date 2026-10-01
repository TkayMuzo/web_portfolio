import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { supabase, isSupabaseConfigured, uploadMedia } from '../lib/supabase.js';
import { portfolioData } from '../data/portfolio.js';

const initialBookState = {
  id: '',
  title: '',
  slug: '',
  author: 'Takudzwa Muzovaka',
  description: '',
  highlights: '',
  purchase_url: '',
  sample_url: '',
  cover_image: '',
  status: 'draft',
  featured: false,
};

const asText = (value) => (value == null ? '' : String(value));
const optionalText = (value) => {
  const trimmed = asText(value).trim();
  return trimmed || null;
};

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || !supabase) {
      const staticBook = {
        id: 'the-zimbabwean-india-dream',
        title: portfolioData.writing.book.title,
        slug: 'the-zimbabwean-india-dream',
        author: portfolioData.writing.book.cover.author || 'Takudzwa Muzovaka',
        description: portfolioData.writing.book.description,
        highlights: (portfolioData.writing.book.keyHighlights || []).join('\n'),
        purchase_url: portfolioData.writing.book.links?.buyUrl || '',
        sample_url: portfolioData.writing.book.links?.sampleUrl || '',
        cover_image: '',
        status: 'published',
        featured: true,
      };
      setBooks([staticBook]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to load books: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (b = null) => {
    if (b) {
      setEditingBook({
        ...initialBookState,
        ...b,
        title: asText(b.title),
        slug: asText(b.slug),
        author: asText(b.author) || 'Takudzwa Muzovaka',
        description: asText(b.description),
        purchase_url: asText(b.purchase_url),
        sample_url: asText(b.sample_url),
        cover_image: asText(b.cover_image),
        status: b.status === 'published' ? 'published' : 'draft',
        featured: Boolean(b.featured),
        highlights: Array.isArray(b.highlights) ? b.highlights.join('\n') : asText(b.highlights),
      });
    } else {
      setEditingBook({ ...initialBookState });
    }
    setIsEditorOpen(true);
    setNotification({ type: '', message: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving || uploadingImage) return;

    if (!asText(editingBook.title).trim()) {
      setNotification({ type: 'error', message: 'Book title is required.' });
      return;
    }

    const slug = asText(editingBook.slug).trim()
      || asText(editingBook.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const highlightsArray = asText(editingBook.highlights)
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const purchaseUrl = optionalText(editingBook.purchase_url);
    const sampleUrl = optionalText(editingBook.sample_url);
    const invalidLink = [purchaseUrl, sampleUrl].find((url) => url && !/^https?:\/\//i.test(url));
    if (invalidLink) {
      setNotification({
        type: 'error',
        message: 'Purchase and sample links must start with http:// or https://, or be left empty.',
      });
      return;
    }

    const payload = {
      title: asText(editingBook.title).trim(),
      slug,
      author: asText(editingBook.author).trim() || 'Takudzwa Muzovaka',
      description: optionalText(editingBook.description),
      highlights: highlightsArray,
      purchase_url: purchaseUrl,
      sample_url: sampleUrl,
      cover_image: optionalText(editingBook.cover_image),
      status: editingBook.status === 'published' ? 'published' : 'draft',
      featured: Boolean(editingBook.featured),
    };

    if (!isSupabaseConfigured() || !supabase) {
      if (editingBook.id) {
        setBooks(books.map((b) => (b.id === editingBook.id ? { ...b, ...payload } : b)));
      } else {
        setBooks([{ ...payload, id: Date.now().toString() }, ...books]);
      }
      setIsEditorOpen(false);
      setNotification({ type: 'success', message: 'Book updated in local preview (configure Supabase in .env for database save).' });
      return;
    }

    setSaving(true);
    try {
      if (editingBook.id) {
        const { error } = await supabase.from('books').update(payload).eq('id', editingBook.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Book updated successfully.' });
      } else {
        const { error } = await supabase.from('books').insert([payload]);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Book added successfully.' });
      }
      setIsEditorOpen(false);
      await loadBooks();
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Save error: ' + (err?.message || 'Could not save this book. Please try again.'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    if (!isSupabaseConfigured() || !supabase) {
      setBooks(books.filter((b) => b.id !== id));
      setNotification({ type: 'success', message: 'Book removed from preview.' });
      return;
    }

    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      setNotification({ type: 'success', message: 'Book deleted.' });
      loadBooks();
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
      setEditingBook((prev) => ({ ...prev, cover_image: publicUrl }));
      setNotification({ type: 'success', message: 'Cover image uploaded.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Upload failed: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

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
    <AdminLayout activeTab="books">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-white)', marginBottom: '0.25rem' }}>
              Books CMS
            </h1>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}>
              Manage your published books, reading samples, purchase URLs, and key highlights.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.3rem' }}
          >
            + Add New Book
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

        {/* List of Books */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>Loading books…</div>
        ) : books.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--color-navy-card)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '1rem' }}>No books listed yet.</p>
            <button type="button" onClick={() => handleOpenEditor()} className="btn btn-secondary">
              Add Your First Book
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {books.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--color-navy-card)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201,150,62,0.2)',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '100px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      backgroundColor: b.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: b.status === 'published' ? '#34D399' : '#FBBF24',
                      border: `1px solid ${b.status === 'published' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                      textTransform: 'uppercase',
                    }}>
                      {b.status}
                    </span>
                    {b.featured && (
                      <span style={{
                        padding: '0.15rem 0.55rem',
                        borderRadius: '100px',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(201,150,62,0.15)',
                        color: 'var(--color-gold-bright)',
                        border: '1px solid rgba(201,150,62,0.3)',
                      }}>
                        ★ Featured
                      </span>
                    )}
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light-muted)' }}>
                      By {b.author || 'Takudzwa Muzovaka'}
                    </span>
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '0.35rem' }}>
                    {b.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.88rem', maxWidth: '650px' }}>
                    {b.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditor(b)}
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
                    onClick={() => handleDelete(b.id)}
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

        {/* Modal Editor */}
        {isEditorOpen && editingBook && (
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
                  {editingBook.id ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-light-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {notification.message && (
                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: `1px solid ${notification.type === 'error' ? '#F87171' : '#34D399'}`,
                    color: notification.type === 'error' ? '#FCA5A5' : '#6EE7B7',
                  }}>
                    {notification.message}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Book Title *</label>
                    <input
                      type="text"
                      required
                      value={editingBook.title}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      placeholder="e.g. The Zimbabwean-India Dream"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Slug</label>
                    <input
                      type="text"
                      value={editingBook.slug}
                      onChange={(e) => setEditingBook({ ...editingBook, slug: e.target.value })}
                      placeholder="e.g. the-zimbabwean-india-dream"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Author</label>
                    <input
                      type="text"
                      value={editingBook.author}
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                      placeholder="Takudzwa Muzovaka"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    rows={3}
                    value={editingBook.description}
                    onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                    placeholder="Book overview and core message…"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Key Highlights (One per line)</label>
                  <textarea
                    rows={4}
                    value={editingBook.highlights}
                    onChange={(e) => setEditingBook({ ...editingBook, highlights: e.target.value })}
                    placeholder="Practical guidance&#10;Real experiences&#10;Scholarships & opportunities"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Purchase URL (Leave empty if not yet available)</label>
                    <input
                      type="url"
                      value={asText(editingBook.purchase_url)}
                      onChange={(e) => setEditingBook({ ...editingBook, purchase_url: e.target.value })}
                      placeholder="https://amazon.com/... or gumroad.com/..."
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Sample / Preview URL</label>
                    <input
                      type="url"
                      value={asText(editingBook.sample_url)}
                      onChange={(e) => setEditingBook({ ...editingBook, sample_url: e.target.value })}
                      placeholder="https://..."
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Cover Image (Upload or URL)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={asText(editingBook.cover_image)}
                      onChange={(e) => setEditingBook({ ...editingBook, cover_image: e.target.value })}
                      placeholder="Cover image URL or upload file"
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
                      value={editingBook.status}
                      onChange={(e) => setEditingBook({ ...editingBook, status: e.target.value })}
                      style={{ ...inputStyle, width: '160px', cursor: 'pointer' }}
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="published">Published (Public)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      id="book-featured"
                      type="checkbox"
                      checked={editingBook.featured}
                      onChange={(e) => setEditingBook({ ...editingBook, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="book-featured" style={{ fontSize: '0.88rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                      Feature on Homepage Writing Section
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
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
                    disabled={saving || uploadingImage}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', opacity: saving || uploadingImage ? 0.7 : 1, cursor: saving || uploadingImage ? 'wait' : 'pointer' }}
                  >
                    {saving ? 'Saving Book…' : 'Save Book'}
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
