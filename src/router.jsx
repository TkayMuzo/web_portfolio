import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext(null);

export function Router({ children }) {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    if (to.startsWith('#')) {
      // Anchor link
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/' + to);
        setCurrentPath('/');
        setTimeout(() => {
          const el = document.querySelector(to);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        const el = document.querySelector(to);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (to !== currentPath) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path: currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a Router');
  return ctx;
}

export function Link({ to, children, className, style, onClick, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !to.startsWith('http') && !to.startsWith('mailto:') && !to.startsWith('tel:')) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...props}>
      {children}
    </a>
  );
}

export function matchPath(pattern, path) {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = pathSegments[i];

    if (pSeg.startsWith(':')) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(aSeg);
    } else if (pSeg !== aSeg) {
      return null;
    }
  }

  return params;
}

export function Route({ path: routePath, component: Component, children }) {
  const { path } = useRouter();
  const params = matchPath(routePath, path);

  if (!params) return null;

  if (Component) {
    return <Component params={params} />;
  }

  if (typeof children === 'function') {
    return children(params);
  }

  return children;
}
