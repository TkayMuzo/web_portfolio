import React, { useState } from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function Contact() {
  const { contact } = portfolioData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Project Collaboration',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (contact.formEndpoint) {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, honeypot }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Submission failed');
        }
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', subject: 'Project Collaboration', message: '' });
        setHoneypot('');
      } else if (contact.email) {
        const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
          `${formData.subject}: Message from ${formData.name}`
        )}&body=${encodeURIComponent(
          `${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`
        )}`;
        window.location.href = mailtoUrl;
        setStatus({ type: 'success', message: 'Opening your email client with your message prepared...' });
      } else {
        // No endpoint configured — inform user
        setStatus({
          type: 'info',
          message: 'Contact form endpoint is not yet configured. Please check back soon.',
        });
      }
    } catch {
      setStatus({ type: 'error', message: 'Could not send your message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(209,213,219,0.8)',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: 'var(--color-gray-50)',
    color: 'var(--color-text-dark)',
    fontFamily: 'inherit',
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--color-text-dark)',
    marginBottom: '0.35rem',
  };
  const onFocus = (e) => (e.target.style.borderColor = 'var(--color-gold)');
  const onBlur = (e) => (e.target.style.borderColor = 'rgba(209,213,219,0.8)');

  const statusColors = {
    error: { bg: 'rgba(239,68,68,0.1)', color: '#DC2626', border: '#FCA5A5' },
    success: { bg: 'rgba(16,185,129,0.1)', color: '#059669', border: '#6EE7B7' },
    info: { bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8', border: '#93C5FD' },
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: 'var(--color-navy)', padding: 'var(--section-spacing) 0', position: 'relative' }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow" style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
            GET IN TOUCH
          </span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', color: 'var(--color-white)', lineHeight: 1.2, marginTop: '0.35rem' }}>
            Let's Work Together
          </h2>
          <p style={{ color: 'var(--color-text-light-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '560px', lineHeight: 1.7 }}>
            {contact.description}
          </p>
        </div>

        {/* Direct Contact Channels */}
        {(contact.email || contact.whatsapp) && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2.25rem',
            }}
          >
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                aria-label={`Email: ${contact.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(201,150,62,0.3)',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-gold)';
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                  e.currentTarget.style.background = 'rgba(201,150,62,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-light-muted)';
                  e.currentTarget.style.borderColor = 'rgba(201,150,62,0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {contact.email}
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp: ${contact.whatsapp}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(201,150,62,0.3)',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-gold)';
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                  e.currentTarget.style.background = 'rgba(201,150,62,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-light-muted)';
                  e.currentTarget.style.borderColor = 'rgba(201,150,62,0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.122.553 4.186 1.603 6.007L0 24l6.163-1.617c1.761.96 3.754 1.467 5.868 1.467 6.637 0 12.031-5.394 12.031-12.031S18.668 0 12.031 0zm0 22.029c-1.846 0-3.655-.497-5.234-1.434l-.375-.223-3.891 1.021 1.039-3.791-.244-.389C2.378 15.603 1.832 13.854 1.832 12.03c0-5.624 4.576-10.2 10.2-10.2 5.624 0 10.2 4.576 10.2 10.2 0 5.624-4.576 10.199-10.201 10.199zm5.59-7.64c-.307-.154-1.815-.896-2.096-.998-.281-.103-.486-.154-.691.154-.205.308-.794.998-.973 1.203-.179.205-.359.231-.666.077-.307-.154-1.299-.479-2.474-1.527-.914-.815-1.531-1.821-1.71-2.129-.179-.307-.019-.474.135-.627.139-.138.307-.359.461-.538.154-.179.205-.307.307-.512.103-.205.051-.384-.026-.538-.077-.154-.691-1.664-.947-2.279-.249-.599-.503-.518-.691-.527h-.589c-.205 0-.538.077-.82.384-.281.307-1.075 1.05-1.075 2.56 0 1.51 1.1 2.969 1.254 3.174.154.205 2.164 3.303 5.242 4.632.732.316 1.304.505 1.749.646.735.234 1.404.201 1.933.122.59-.088 1.815-.742 2.072-1.459.256-.717.256-1.331.179-1.459-.076-.128-.281-.205-.588-.359z"/>
                </svg>
                {contact.whatsapp}
              </a>
            )}
          </div>
        )}

        {/* Light Form Card */}
        <div
          className="card-light"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2.25rem)',
            borderRadius: '20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            border: '1px solid rgba(229,231,235,0.9)',
          }}
        >
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Honeypot — invisible to real users; bots that autofill all fields will trip this */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
              <label htmlFor="contact-hp">Leave this empty</label>
              <input
                id="contact-hp"
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            {/* Name & Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label htmlFor="contact-name" style={labelStyle}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="contact-name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder={contact.formFields.name.placeholder}
                  required style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="contact-email" style={labelStyle}>
                  Email <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="contact-email" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder={contact.formFields.email.placeholder}
                  required style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  aria-required="true"
                />
              </div>
            </div>

            {/* Subject dropdown */}
            <div>
              <label htmlFor="contact-subject" style={labelStyle}>
                {contact.formFields.reason.label}
              </label>
              <select
                id="contact-subject" name="subject"
                value={formData.subject} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={onFocus} onBlur={onBlur}
              >
                {contact.formFields.reason.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" style={labelStyle}>
                Message <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                id="contact-message" name="message" rows="5"
                value={formData.message} onChange={handleChange}
                placeholder={contact.formFields.message.placeholder}
                required style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={onFocus} onBlur={onBlur}
                aria-required="true"
              />
            </div>

            {/* Status message */}
            {status.message && (
              <div
                role="alert"
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  backgroundColor: statusColors[status.type]?.bg,
                  color: statusColors[status.type]?.color,
                  border: `1px solid ${statusColors[status.type]?.border}`,
                }}
              >
                {status.message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem 1.5rem',
                fontSize: '1rem',
                boxShadow: '0 4px 18px rgba(201,150,62,0.3)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? 'Sending…' : 'Send Message →'}
            </button>
          </form>

          {/* Bottom note — only shown when no endpoint configured */}
          {!contact.formEndpoint && !contact.email && (
            <p style={{
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(229,231,235,0.8)',
              fontSize: '0.82rem',
              color: 'var(--color-text-dark-subtle)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}>
              Contact form endpoint not yet configured. Your message will be prepared for sending when a contact method is available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
