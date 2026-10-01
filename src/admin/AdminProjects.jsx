import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { supabase, isSupabaseConfigured, uploadMedia } from '../lib/supabase.js';
import { portfolioData } from '../data/portfolio.js';

const initialProjectState = {
  id: '',
  title: '',
  slug: '',
  category: '',
  year: new Date().getFullYear().toString(),
  short_description: '',
  full_description: '',
  problem: '',
  approach: '',
  architecture: '',
  outcomes: '',
  current_stage: '',
  technologies: '',
  github_url: '',
  demo_url: '',
  paper_url: '',
  cover_image: '',
  status: 'draft',
  featured: false,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || !supabase) {
      // Map static data to CMS structure
      const staticList = portfolioData.projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.id,
        category: p.category,
        year: '2025',
        short_description: p.description || '',
        full_description: p.fullDescription || '',
        problem: p.researchQuestion || '',
        approach: '',
        architecture: '',
        outcomes: '',
        current_stage: 'Completed',
        technologies: (p.technologies || []).join(', '),
        github_url: p.links?.github || '',
        demo_url: p.links?.demo || '',
        paper_url: p.links?.paper || '',
        cover_image: '',
        status: 'published',
        featured: p.featured || false,
      }));
      setProjects(staticList);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to load projects: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (proj = null) => {
    if (proj) {
      setEditingProject({
        ...proj,
        technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      });
    } else {
      setEditingProject({ ...initialProjectState });
    }
    setIsEditorOpen(true);
    setNotification({ type: '', message: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProject.title.trim()) {
      setNotification({ type: 'error', message: 'Project title is required.' });
      return;
    }

    const slug = editingProject.slug.trim() || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const techArray = editingProject.technologies
      ? editingProject.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: editingProject.title.trim(),
      slug,
      category: editingProject.category.trim() || null,
      year: editingProject.year.trim() || null,
      short_description: editingProject.short_description.trim() || null,
      full_description: editingProject.full_description.trim() || null,
      problem: editingProject.problem.trim() || null,
      approach: editingProject.approach.trim() || null,
      architecture: editingProject.architecture.trim() || null,
      outcomes: editingProject.outcomes.trim() || null,
      current_stage: editingProject.current_stage.trim() || null,
      technologies: techArray,
      github_url: editingProject.github_url.trim() || null,
      demo_url: editingProject.demo_url.trim() || null,
      paper_url: editingProject.paper_url.trim() || null,
      cover_image: editingProject.cover_image.trim() || null,
      status: editingProject.status,
      featured: Boolean(editingProject.featured),
    };

    if (!isSupabaseConfigured() || !supabase) {
      // Local state update
      if (editingProject.id) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...payload } : p)));
      } else {
        setProjects([{ ...payload, id: Date.now().toString() }, ...projects]);
      }
      setIsEditorOpen(false);
      setNotification({ type: 'success', message: 'Project updated in local preview (configure Supabase in .env for database save).' });
      return;
    }

    setSaving(true);
    try {
      if (editingProject.id && editingProject.created_at) {
        // Update
        const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Project updated successfully.' });
      } else {
        // Create
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Project created successfully.' });
      }
      setIsEditorOpen(false);
      loadProjects();
    } catch (err) {
      setNotification({ type: 'error', message: 'Save error: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    if (!isSupabaseConfigured() || !supabase) {
      setProjects(projects.filter((p) => p.id !== id));
      setNotification({ type: 'success', message: 'Project removed from preview.' });
      return;
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setNotification({ type: 'success', message: 'Project deleted.' });
      loadProjects();
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
      setEditingProject((prev) => ({ ...prev, cover_image: publicUrl }));
      setNotification({ type: 'success', message: 'Image uploaded successfully.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Upload failed: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
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
    <AdminLayout activeTab="projects">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-white)', marginBottom: '0.25rem' }}>
              Projects CMS
            </h1>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}>
              Create, curate, and publish engineering projects and research case studies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.3rem' }}
          >
            + Create New Project
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

        {/* Filter and Search Bar */}
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
            placeholder="Search projects by title or category…"
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

        {/* Projects List Table / Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>Loading projects…</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--color-navy-card)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '1rem' }}>No projects match your current filter.</p>
            <button type="button" onClick={() => handleOpenEditor()} className="btn btn-secondary">
              Add Your First Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
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
                      backgroundColor: proj.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: proj.status === 'published' ? '#34D399' : '#FBBF24',
                      border: `1px solid ${proj.status === 'published' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                      textTransform: 'uppercase',
                    }}>
                      {proj.status}
                    </span>
                    {proj.featured && (
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
                    {proj.category && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light-muted)' }}>
                        {proj.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '0.3rem' }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.85rem', maxWidth: '650px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {proj.short_description || proj.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditor(proj)}
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
                    onClick={() => handleDelete(proj.id)}
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

        {/* Modal Editor Form */}
        {isEditorOpen && editingProject && (
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
              maxWidth: '840px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--color-white)' }}>
                  {editingProject.id ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-light-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 1. Basic Information */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    1. Basic Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Deepfake Detection & Adversarial Robustness Analyzer"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>URL Slug</label>
                      <input
                        type="text"
                        value={editingProject.slug}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        placeholder="e.g. deepfake-detection (auto-generated if empty)"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <input
                        type="text"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="e.g. AI / Machine Learning / Cybersecurity"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Year</label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        placeholder="2025"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Current Stage</label>
                      <input
                        type="text"
                        value={editingProject.current_stage}
                        onChange={(e) => setEditingProject({ ...editingProject, current_stage: e.target.value })}
                        placeholder="e.g. Completed, Research, Prototype"
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Short Description</label>
                      <input
                        type="text"
                        value={editingProject.short_description}
                        onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                        placeholder="Brief summary for project cards"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Structured Content */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    2. Case Study Content
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Full Description / Overview</label>
                      <textarea
                        rows={3}
                        value={editingProject.full_description}
                        onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                        placeholder="Detailed project summary…"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>The Problem / Research Question</label>
                      <textarea
                        rows={2}
                        value={editingProject.problem}
                        onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                        placeholder="What challenge does this project solve?"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Methodology / Approach</label>
                      <textarea
                        rows={2}
                        value={editingProject.approach}
                        onChange={(e) => setEditingProject({ ...editingProject, approach: e.target.value })}
                        placeholder="Techniques and steps taken…"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Technical Architecture</label>
                      <textarea
                        rows={2}
                        value={editingProject.architecture}
                        onChange={(e) => setEditingProject({ ...editingProject, architecture: e.target.value })}
                        placeholder="System components, models, layers…"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Results & Outcomes</label>
                      <textarea
                        rows={2}
                        value={editingProject.outcomes}
                        onChange={(e) => setEditingProject({ ...editingProject, outcomes: e.target.value })}
                        placeholder="Quantifiable or qualitative results…"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Technologies & Links */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    3. Technologies & External Links
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Technologies (Comma-separated)</label>
                      <input
                        type="text"
                        value={editingProject.technologies}
                        onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
                        placeholder="Python, TensorFlow, OpenCV, Docker"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>GitHub Repository URL</label>
                      <input
                        type="url"
                        value={editingProject.github_url}
                        onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Live Demo URL</label>
                      <input
                        type="url"
                        value={editingProject.demo_url}
                        onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Research Paper URL</label>
                      <input
                        type="url"
                        value={editingProject.paper_url}
                        onChange={(e) => setEditingProject({ ...editingProject, paper_url: e.target.value })}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Cover Image (Upload or URL)</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editingProject.cover_image}
                          onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                          placeholder="Image URL or upload below"
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
                  </div>
                </div>

                {/* 4. Status & Visibility */}
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(5, 11, 22, 0.6)',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  <div>
                    <label style={labelStyle}>Publication Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                      style={{ ...inputStyle, width: '160px', cursor: 'pointer' }}
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="published">Published (Public)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      id="proj-featured"
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="proj-featured" style={{ fontSize: '0.88rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                      Feature on Homepage Highlights
                    </label>
                  </div>
                </div>

                {/* Actions */}
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
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    {saving ? 'Saving Project…' : 'Save Project'}
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
