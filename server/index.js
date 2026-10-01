/**
 * server/index.js
 *
 * Minimal Express server for the Takudzwa Muzovaka portfolio.
 * Exposes a single POST /api/contact endpoint that:
 *   - validates the request server-side
 *   - sends the message via Resend
 *   - forwards to takudzwamuzovaka25@gmail.com
 *
 * The RESEND_API_KEY is only ever read here, server-side.
 * It is never exposed to the browser or bundled by Vite.
 *
 * Run:  node server/index.js
 * Env:  RESEND_API_KEY  (required)
 *       PORT            (optional, default 3001)
 */

import express from 'express';
import { Resend } from 'resend';

// ─── Config ────────────────────────────────────────────────────────────────────
const PORT            = parseInt(process.env.PORT || '3001', 10);
const TO_ADDRESS      = 'takudzwamuzovaka25@gmail.com';
// Resend's shared testing sender — works without a verified domain.
// Replace with a verified custom-domain address before production.
const FROM_ADDRESS    = 'Portfolio Contact <onboarding@resend.dev>';

// Field length limits
const LIMITS = {
  name:    { min: 1, max: 120 },
  email:   { min: 5, max: 254 },
  subject: { min: 1, max: 200 },
  message: { min: 1, max: 5000 },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Escape characters that are meaningful in HTML to prevent XSS in the email body. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

/** Build the HTML email body. All user content is escaped before insertion. */
function buildHtml({ name, email, subject, message }) {
  const eName    = escapeHtml(name);
  const eEmail   = escapeHtml(email);
  const eSubject = escapeHtml(subject);
  const eMessage = escapeHtml(message);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #111827; background: #f9fafb; margin: 0; padding: 0; }
    .card { max-width: 600px; margin: 32px auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    .header { background: #050B16; padding: 28px 32px; }
    .header h1 { color: #C9963E; margin: 0; font-size: 20px; font-weight: 600; }
    .header p { color: #9AA5B8; margin: 4px 0 0; font-size: 14px; }
    .body { padding: 28px 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6B7280; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; line-height: 1.6; }
    .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 15px; color: #111827; line-height: 1.7; }
    .footer { padding: 16px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9AA5B8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Portfolio Contact</h1>
      <p>Submitted via your portfolio contact form</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${eName}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${eEmail}" style="color:#C9963E;">${eEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${eSubject}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${eMessage}</div>
      </div>
    </div>
    <div class="footer">
      Reply directly to this email to respond to ${eName}.
    </div>
  </div>
</body>
</html>`;
}

/** Build a plain-text fallback for email clients that don't render HTML. */
function buildText({ name, email, subject, message }) {
  return [
    'New Portfolio Contact',
    '='.repeat(40),
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
    '='.repeat(40),
    'Reply directly to this email to respond to the sender.',
  ].join('\n');
}

/** Server-side field validation. Returns an error string or null. */
function validate({ name, email, subject, message, honeypot }) {
  // Honeypot — bots fill this hidden field, humans leave it empty
  if (honeypot) return 'Bot detected.';

  if (typeof name    !== 'string' ||
      typeof email   !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string') {
    return 'Invalid request payload.';
  }

  const trimmed = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() };

  for (const [field, lim] of Object.entries(LIMITS)) {
    const val = trimmed[field];
    if (val.length < lim.min) return `${field} is required.`;
    if (val.length > lim.max) return `${field} exceeds maximum length of ${lim.max} characters.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

// ─── App setup ─────────────────────────────────────────────────────────────────
const app = express();

// Parse JSON bodies up to 50 KB — sufficient for the form; rejects excessively large payloads
app.use(express.json({ limit: '50kb' }));

// Very simple CORS: allow the Vite dev server and same origin
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowed = [
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  if (!origin || allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── /api/contact ──────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  // Guard: API key must be configured
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set.');
    return res.status(500).json({ error: 'Server configuration error. Please try again later.' });
  }

  const { name = '', email = '', subject = '', message = '', honeypot = '' } = req.body || {};

  const validationError = validate({ name, email, subject, message, honeypot });
  if (validationError) {
    // Only return the error if it's a user-facing validation message,
    // not a bot-detection message (return 200 to bots to avoid feedback)
    if (validationError === 'Bot detected.') {
      return res.status(200).json({ ok: true }); // silent discard
    }
    return res.status(422).json({ error: validationError });
  }

  const trimmedName    = name.trim();
  const trimmedEmail   = email.trim();
  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from:     FROM_ADDRESS,
      to:       TO_ADDRESS,
      replyTo:  trimmedEmail,
      subject:  `Portfolio Contact: ${trimmedSubject}`,
      html:     buildHtml({ name: trimmedName, email: trimmedEmail, subject: trimmedSubject, message: trimmedMessage }),
      text:     buildText({ name: trimmedName, email: trimmedEmail, subject: trimmedSubject, message: trimmedMessage }),
    });

    if (error) {
      // Log the provider error server-side only; return a generic message to the client
      console.error('[contact] Resend error:', error.name, error.message);
      return res.status(502).json({ error: 'Could not send your message. Please try again later.' });
    }

    console.log(`[contact] Message sent — from: ${trimmedEmail}, subject: "${trimmedSubject}"`);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[contact] Unexpected error:', err.message);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
});

// Health-check (useful for deployment platforms)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Start ─────────────────────────────────────────────────────────────────────
// Vercel invokes this exported Express app as a Function. Locally, keep the
// existing standalone listener used by `npm run server:start`.
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
    if (!process.env.RESEND_API_KEY) {
      console.warn('[server] WARNING: RESEND_API_KEY is not set. /api/contact will return 500.');
    }
  });
}
