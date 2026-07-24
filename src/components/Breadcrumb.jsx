import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from '../styles/Breadcrumb.module.css';

const Breadcrumb = () => {
  const { pathname } = useLocation();

  const crumbs = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((p, i) => ({
      label: p
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()), // Better capitalization logic
      path: paths.slice(0, i + 1).join('/'),
    }));
  }, [pathname]);

  const breadcrumbLdJson = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${window.location.origin}/`,
      },
      ...crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: `${window.location.origin}/${crumb.path}`,
      })),
    ],
  }), [crumbs]);

  return (
    <nav className={styles.container} aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLdJson) }}
      />
      
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.link} title="Home">
            <Home size={16} strokeWidth={2.5} />
            <span className={styles.visuallyHidden}>Home</span>
          </Link>
        </li>

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.path}>
              <li className={styles.separator} aria-hidden="true">
                <ChevronRight size={14} strokeWidth={3} />
              </li>
              <li className={styles.item}>
                {isLast ? (
                  <span 
                    className={styles.active} 
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={`/${crumb.path}`} className={styles.link}>
                    {crumb.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
