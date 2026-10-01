import DOMPurify from 'dompurify';

const ARTICLE_TAGS = [
  'a', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'hr', 'li', 'ol',
  'p', 'pre', 'strong', 'u', 'ul',
];

const ARTICLE_ATTRIBUTES = ['href', 'rel', 'target'];
const ARTICLE_URI_PATTERN = /^(?:(?:https?|mailto):|\/|#)/i;

export function sanitizeArticleHtml(value = '') {
  return DOMPurify.sanitize(String(value || ''), {
    ALLOWED_TAGS: ARTICLE_TAGS,
    ALLOWED_ATTR: ARTICLE_ATTRIBUTES,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: ARTICLE_URI_PATTERN,
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Plain-text articles stay word-for-word intact. This conversion only happens in
// the editor and is persisted when an administrator explicitly saves the article.
export function toArticleHtml(value = '') {
  const content = String(value || '');
  if (!content.trim()) return '';

  const looksLikeHtml = /<\/?(?:a|blockquote|br|code|em|h[1-3]|hr|li|ol|p|pre|strong|u|ul)\b/i.test(content);
  if (looksLikeHtml) return sanitizeArticleHtml(content);

  return sanitizeArticleHtml(
    content
      .split(/\n\s*\n/)
      .filter((paragraph) => paragraph.trim())
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
      .join('')
  );
}

export function articleText(value = '') {
  if (typeof document === 'undefined') return String(value || '').replace(/<[^>]*>/g, ' ');
  const element = document.createElement('div');
  element.innerHTML = sanitizeArticleHtml(toArticleHtml(value));
  return (element.textContent || '').replace(/\s+/g, ' ').trim();
}

export function articleStats(value = '') {
  const text = articleText(value);
  return {
    characters: text.length,
    words: text ? text.split(/\s+/).length : 0,
  };
}
