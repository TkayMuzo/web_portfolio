import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import BottomNav from './components/BottomNav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Writing from './components/Writing.jsx';
import Skills from './components/Skills.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';

// CMS & Routing Imports
import { Router, useRouter, matchPath } from './router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Lazy-loaded views for optimized code splitting
const ProjectDetail = lazy(() => import('./views/ProjectDetail.jsx'));
const ArticleDetail = lazy(() => import('./views/ArticleDetail.jsx'));
const BookDetail = lazy(() => import('./views/BookDetail.jsx'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'));
const AdminProjects = lazy(() => import('./admin/AdminProjects.jsx'));
const AdminArticles = lazy(() => import('./admin/AdminArticles.jsx'));
const AdminBooks = lazy(() => import('./admin/AdminBooks.jsx'));

function MainPortfolio() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="portfolio-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation Header */}
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Section Content */}
      <main id="main">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. About Section */}
        <About />

        {/* 3. Featured & Authentic Projects */}
        <Projects onSelectProject={(p) => setSelectedProject(p)} />

        {/* 4. Writing & Published Books */}
        <Writing />

        {/* 5. Tools & Technologies (Skills) */}
        <Skills />

        {/* 6. Professional Services */}
        <Services />

        {/* 7. Contact Section */}
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Thumb Navigation */}
      <BottomNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <FloatingWhatsApp />

      {/* Case Study Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

function AppRoutes() {
  const { path } = useRouter();

  const fallback = (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)' }}>
      <p>Loading view…</p>
    </div>
  );

  // Public Dynamic Routes
  const projectParams = matchPath('/projects/:slug', path);
  if (projectParams) {
    return (
      <Suspense fallback={fallback}>
        <ProjectDetail params={projectParams} />
      </Suspense>
    );
  }

  const articleParams = matchPath('/articles/:slug', path);
  if (articleParams) {
    return (
      <Suspense fallback={fallback}>
        <ArticleDetail params={articleParams} />
      </Suspense>
    );
  }

  const bookParams = matchPath('/books/:slug', path);
  if (bookParams) {
    return (
      <Suspense fallback={fallback}>
        <BookDetail params={bookParams} />
      </Suspense>
    );
  }

  // Admin CMS Routes
  if (path === '/admin') {
    return (
      <Suspense fallback={fallback}>
        <AdminDashboard />
      </Suspense>
    );
  }
  if (path === '/admin/projects') {
    return (
      <Suspense fallback={fallback}>
        <AdminProjects />
      </Suspense>
    );
  }
  if (path === '/admin/articles') {
    return (
      <Suspense fallback={fallback}>
        <AdminArticles />
      </Suspense>
    );
  }
  if (path === '/admin/books') {
    return (
      <Suspense fallback={fallback}>
        <AdminBooks />
      </Suspense>
    );
  }

  // Default: Authentic Main Portfolio
  return <MainPortfolio />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
