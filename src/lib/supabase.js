import { createClient } from '@supabase/supabase-js';
import { portfolioData } from '../data/portfolio.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 10
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// PUBLIC DATA FETCHERS (with automatic fallback to portfolioData)
// ==============================================================================

/**
 * Fetch published projects. If Supabase is offline or unconfigured,
 * fallback to authentic portfolioData.projects.
 */
export async function fetchPublishedProjects() {
  if (!isSupabaseConfigured()) {
    return { data: portfolioData.projects, source: 'fallback' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: portfolioData.projects, source: 'fallback' };
    }

    // Map database fields to the portfolio structure if needed
    const mapped = data.map((p, idx) => ({
      ...p,
      id: p.slug || p.id,
      number: String(idx + 1).padStart(2, '0'),
      primaryCategory: p.category ? p.category.split('/')[0].trim() : 'Project',
      description: p.short_description || p.full_description || '',
      technologies: p.technologies || [],
      links: {
        github: p.github_url || '',
        demo: p.demo_url || '',
        paper: p.paper_url || '',
      },
    }));

    return { data: mapped, source: 'supabase' };
  } catch (err) {
    console.warn('[Supabase] Falling back to static projects:', err.message);
    return { data: portfolioData.projects, source: 'fallback' };
  }
}
/**
 * Fetch a single project by slug or ID with fallback
 */
export async function fetchProjectBySlug(slug) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (data && !error) {
        return {
          ...data,
          id: data.slug,
          primaryCategory: data.category ? data.category.split('/')[0].trim() : 'Project',
          description: data.short_description || data.full_description || '',
          technologies: data.technologies || [],
          links: {
            github: data.github_url || '',
            demo: data.demo_url || '',
            paper: data.paper_url || '',
          },
        };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback to static portfolioData
  const found = portfolioData.projects.find(
    (p) => p.id === slug || p.slug === slug || (p.title && p.title.toLowerCase().includes(slug.toLowerCase()))
  );
  return found || null;
}

/**
 * Fetch published articles with fallback
 */
export async function fetchPublishedArticles() {
  if (!isSupabaseConfigured()) {
    return { data: portfolioData.writing.articles, source: 'fallback' };
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: portfolioData.writing.articles, source: 'fallback' };
    }

    return { data, source: 'supabase' };
  } catch (err) {
    console.warn('[Supabase] Falling back to static articles:', err.message);
    return { data: portfolioData.writing.articles, source: 'fallback' };
  }
}

/**
 * Fetch article by slug with fallback
 */
export async function fetchArticleBySlug(slug) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (data && !error) return data;
    } catch {
      // Fall through
    }
  }

  // Fallback
  return portfolioData.writing.articles.find(
    (a) => a.id === slug || a.slug === slug
  ) || null;
}

/**
 * Fetch published books with fallback
 */
export async function fetchPublishedBooks() {
  const staticBook = {
    ...portfolioData.writing.book,
    id: 'the-zimbabwean-india-dream',
    slug: 'the-zimbabwean-india-dream',
    highlights: portfolioData.writing.book.keyHighlights || [],
    purchase_url: portfolioData.writing.book.links?.buyUrl || '',
    sample_url: portfolioData.writing.book.links?.sampleUrl || '',
    status: 'published',
    featured: true,
  };

  if (!isSupabaseConfigured()) {
    return { data: [staticBook], source: 'fallback' };
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [staticBook], source: 'fallback' };
    }

    return { data, source: 'supabase' };
  } catch (err) {
    console.warn('[Supabase] Falling back to static book:', err.message);
    return { data: [staticBook], source: 'fallback' };
  }
}

/**
 * Fetch book by slug with fallback
 */
export async function fetchBookBySlug(slug) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (data && !error) return data;
    } catch {
      // Fall through
    }
  }

  // Static fallback
  const staticBook = portfolioData.writing.book;
  return {
    ...staticBook,
    id: 'the-zimbabwean-india-dream',
    slug: 'the-zimbabwean-india-dream',
    highlights: staticBook.keyHighlights || [],
    purchase_url: staticBook.links?.buyUrl || '',
    sample_url: staticBook.links?.sampleUrl || '',
    status: 'published',
  };
}

// ==============================================================================
// STORAGE HELPER
// ==============================================================================

/**
 * Upload a media file to Supabase Storage bucket
 */
export async function uploadMedia(file, bucket = 'portfolio-media') {
  if (!supabase) throw new Error('Supabase client not initialized');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data?.publicUrl || '';
}
