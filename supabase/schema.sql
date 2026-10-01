-- ==============================================================================
-- SUPABASE SCHEMA & POLICIES FOR TAKUDZWA MUZOVAKA PORTFOLIO CMS
-- ==============================================================================

-- 1. Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category TEXT,
    year TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    cover_image TEXT,
    technologies TEXT[] DEFAULT '{}',
    problem TEXT,
    approach TEXT,
    architecture TEXT,
    outcomes TEXT,
    current_stage TEXT,
    github_url TEXT,
    demo_url TEXT,
    paper_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

-- ==============================================================================
-- 3. ARTICLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);

-- ==============================================================================
-- 4. BOOKS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    author TEXT,
    highlights TEXT[] DEFAULT '{}',
    purchase_url TEXT,
    sample_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_books_slug ON public.books(slug);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);

-- ==============================================================================
-- 5. AUTO-UPDATE UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON public.articles;
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_books_updated_at ON public.books;
CREATE TRIGGER trigger_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- PROJECTS POLICIES
-- Public users: read-only access to published projects
CREATE POLICY "Public read published projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Authenticated admins: full CRUD access to all projects
CREATE POLICY "Admins full access to projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ARTICLES POLICIES
-- Public users: read-only access to published articles
CREATE POLICY "Public read published articles"
    ON public.articles FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Authenticated admins: full CRUD access to all articles
CREATE POLICY "Admins full access to articles"
    ON public.articles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- BOOKS POLICIES
-- Public users: read-only access to published books
CREATE POLICY "Public read published books"
    ON public.books FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Authenticated admins: full CRUD access to all books
CREATE POLICY "Admins full access to books"
    ON public.books FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 7. STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- In Supabase Storage, run these statements or create the bucket in the dashboard:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view/download media
CREATE POLICY "Public read portfolio media"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'portfolio-media');

-- Authenticated admins can upload media
CREATE POLICY "Admins insert portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated admins can update media
CREATE POLICY "Admins update portfolio media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media')
    WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated admins can delete media
CREATE POLICY "Admins delete portfolio media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

-- ==============================================================================
-- 8. INITIAL AUTHENTIC SEED DATA MIGRATION
-- ==============================================================================

-- Projects Seed
INSERT INTO public.projects (
    title, slug, short_description, full_description, category, year, featured, status,
    technologies, problem, approach, architecture, outcomes, current_stage,
    github_url, demo_url, paper_url
) VALUES
(
    'Deepfake Detection & Adversarial Robustness Analyzer',
    'deepfake-detection',
    'Detecting deepfakes and analyzing adversarial robustness using CNN and FGSM adversarial attacks.',
    'An AI-based system for detecting manipulated media and analyzing the robustness of deepfake detection models against adversarial attacks.',
    'AI / Machine Learning / Cybersecurity',
    '2025',
    true,
    'published',
    ARRAY['Python', 'TensorFlow', 'OpenCV', 'CNN', 'MobileNetV2', 'FGSM', 'Computer Vision'],
    'Can a deepfake detector still be trusted when it is deliberately attacked with adversarial perturbations?',
    'Built an end-to-end evaluation pipeline utilizing MobileNetV2 trained on FaceForensics++ benchmark dataset, systematically evaluating resilience against Fast Gradient Sign Method (FGSM) attacks.',
    'Convolutional Neural Network architecture with adversarial perturbation generation layer and confidence degradation evaluation module.',
    'Evaluated detection degradation under varying perturbation epsilons, establishing baseline robustness thresholds.',
    'Research & Evaluation Phase',
    NULL, NULL, NULL
),
(
    'Multi-Modal Crop Disease Prediction',
    'crop-disease-prediction',
    'Combining plant images and environmental data for accurate crop disease prediction.',
    'A multimodal machine learning system combining plant imagery and environmental data to support crop disease prediction.',
    'AI / Agriculture',
    '2025',
    true,
    'published',
    ARRAY['Python', 'TensorFlow', 'MobileNetV2', 'Machine Learning', 'Computer Vision', 'Environmental Sensors'],
    'Can combining plant leaf images with real-time environmental context significantly improve crop disease diagnosis over visual inspection alone?',
    'Dual-stream architecture fusing visual features from leaf imagery with numerical readings from temperature, humidity, and soil sensors.',
    'Vision backbone coupled with dense sensor-processing layers and late feature concatenation classifier.',
    'Enhanced early diagnostic accuracy and reduced false positives in varying climate conditions.',
    'Prototype & Field Testing',
    NULL, NULL, NULL
),
(
    'English–Shona Domain-Specific Machine Translation',
    'english-shona-translation',
    'Machine translation focused on preserving precision in legal, healthcare, and educational contexts.',
    'A domain-specific neural machine translation system for English to Shona, with special attention to legal, medical and educational terminology.',
    'Natural Language Processing / Machine Translation',
    '2024',
    true,
    'published',
    ARRAY['Python', 'PyTorch', 'Transformers', 'NLP', 'Low-Resource Languages', 'Bilingual Evaluation'],
    'How do we prevent critical semantic drift when translating technical, legal, and healthcare terminology into low-resource African languages like Shona?',
    'Domain-targeted corpus curation coupled with fine-tuned transformer architectures and custom bilingual terminology alignment.',
    'Transformer-based sequence-to-sequence model with domain-specific vocabulary injection and back-translation validation.',
    'Improved translation consistency and domain vocabulary accuracy over general-purpose translation baselines.',
    'Research & Corpus Expansion',
    NULL, NULL, NULL
),
(
    'Axterion: Enterprise AI Knowledge Base & Workflow Engine',
    'axterion-enterprise-ai',
    'A privacy-first AI platform that allows teams to search, query and automate workflows across their knowledge base.',
    'An enterprise knowledge intelligence engine featuring local document ingestion, vector semantic search, and private LLM workflow automation.',
    'AI / Full-Stack / Enterprise Systems',
    '2025',
    true,
    'published',
    ARRAY['React', 'Node.js', 'Python', 'FastAPI', 'Vector Embeddings', 'PostgreSQL', 'Docker'],
    'Enterprises need generative AI productivity without leaking proprietary business documents to external public cloud APIs.',
    'Developed a modular Retrieval-Augmented Generation (RAG) platform with localized document chunking, embeddings vector search, and role-based access control.',
    'Decoupled microservice architecture with React frontend, FastAPI RAG service, vector store, and secure storage.',
    'Enabled instant semantic document querying with zero external data leakage.',
    'Active Development',
    NULL, NULL, NULL
),
(
    'Network Intrusion Detection & Threat Classification',
    'network-intrusion-detection',
    'Analyzing network traffic and classifying threats using machine learning.',
    'An automated network security analysis system using machine learning classifiers to detect anomalies and categorize threat patterns in real-time traffic.',
    'Cybersecurity / Machine Learning',
    '2024',
    false,
    'published',
    ARRAY['Python', 'Scikit-learn', 'Wireshark', 'Kali Linux', 'Pandas', 'Networking Protocols'],
    'Traditional signature-based intrusion detection systems miss novel zero-day attack patterns and abnormal traffic deviations.',
    'Extracted flow features from network packet captures and trained ensemble classifiers to distinguish benign traffic from diverse attack vectors.',
    'Packet ingestion pipeline feeding feature extraction engine and multi-class classification ensemble.',
    'Accurately classified port scans, DoS attempts, and unauthorized probing in test traffic.',
    'Completed Study',
    NULL, NULL, NULL
),
(
    'Secure Cloud Infrastructure & DevSecOps Pipeline',
    'secure-cloud-infrastructure',
    'Hardened cloud architecture with automated security scanning, container isolation, and least-privilege access controls.',
    'A production-grade reference architecture incorporating automated static/dynamic vulnerability scanning, container security, and infrastructure-as-code.',
    'Cloud / DevOps / Cybersecurity',
    '2024',
    false,
    'published',
    ARRAY['Docker', 'Linux', 'GitHub Actions', 'CI/CD', 'Security Auditing', 'Bash'],
    'Modern development cycles require automated security guardrails that catch vulnerabilities before production deployment.',
    'Constructed CI/CD workflows integrating automated dependency vulnerability audits, container image scanning, and strict secrets management.',
    'Multi-stage build pipeline with integrated SAST/DAST gating and least-privilege runtime containers.',
    'Prevented vulnerable dependencies and exposed secrets from reaching deployment stages.',
    'Completed Architecture',
    NULL, NULL, NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Books Seed
INSERT INTO public.books (
    title, slug, description, author, highlights,
    purchase_url, sample_url, status, featured, published_at
) VALUES (
    'The Zimbabwean-India Dream',
    'the-zimbabwean-india-dream',
    'A practical guide for Zimbabwean students who want to study in India, with real experiences, insights and steps to help you achieve your dream.',
    'Takudzwa Muzovaka',
    ARRAY['Practical guidance', 'Real experiences', 'Scholarships & opportunities', 'Life in India'],
    NULL, NULL, 'published', true, '2024-01-01 00:00:00+00'
)
ON CONFLICT (slug) DO NOTHING;

-- Articles Seed
INSERT INTO public.articles (
    title, slug, excerpt, content, category, tags, status, featured, published_at
) VALUES
(
    'The Power of Purpose in a Student''s Journey',
    'power-of-purpose',
    'Reflections on how defining a clear purpose transforms academic pursuits, resilience, and personal growth.',
    'When students understand not just what they are studying, but why they are building their knowledge, their entire relationship with education changes. Purpose is the compass that guides long study hours, setbacks, and future aspirations.',
    'Purpose',
    ARRAY['Purpose', 'Student Life', 'Growth', 'Mindset'],
    'published',
    true,
    '2024-03-15 00:00:00+00'
),
(
    'Cybersecurity: Guarding Your Digital Life',
    'cybersecurity-guarding-digital-life',
    'Essential defensive principles and mindset shifts to protect your identity, data, and online presence in an interconnected world.',
    'Cybersecurity is not just a technical discipline for network engineers—it is a daily practice for every digital citizen. Understanding threat vectors, personal privacy hygiene, and adversarial thinking empowers individuals to navigate the web with confidence.',
    'Cybersecurity',
    ARRAY['Cybersecurity', 'Privacy', 'Defense', 'Technology'],
    'published',
    true,
    '2024-05-10 00:00:00+00'
),
(
    'Lessons From My Journey in India',
    'lessons-journey-in-india',
    'Cross-cultural perspectives, adaptability, and technological innovation experienced while studying in India.',
    'Leaving home to pursue higher education in India opened my eyes to vibrant cultural diversity, fast-paced technological adoption, and the importance of adaptability. Here are the core lessons that shaped my outlook on engineering and community.',
    'Personal',
    ARRAY['India', 'Education', 'Culture', 'International Student'],
    'published',
    true,
    '2024-08-20 00:00:00+00'
),
(
    'Building With Purpose',
    'building-with-purpose',
    'Why technology must solve authentic human problems rather than chasing trends for their own sake.',
    'Code and models are only as valuable as the human challenges they alleviate. When we anchor engineering in genuine human needs—whether agricultural diagnostics, linguistic preservation, or digital security—our work gains lasting significance.',
    'Ideas',
    ARRAY['Engineering', 'Impact', 'Philosophy', 'Innovation'],
    'published',
    true,
    '2024-11-01 00:00:00+00'
)
ON CONFLICT (slug) DO NOTHING;
