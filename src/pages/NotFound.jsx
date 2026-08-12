import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, LifeBuoy } from 'lucide-react';
import styles from '../styles/NotFound.module.css';
import Seo from '../components/Seo';

export { Page };

function Page({ is404 }) {
  const navigate = useNavigate();

  if (is404) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={styles.container}
      >
        <Seo title="Page Not Found" description="The page you are looking for does not exist." />
        <div className={styles.content}>
          <motion.h1
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={styles.title}
          >
            404
          </motion.h1>

          <h2 className={styles.subtitle}>Lost in Space?</h2>
          <p className={styles.message}>
            The page you're looking for disappeared into a black hole.
            Don't worry, we've got a map for you!
          </p>

          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search for content..." />
          </div>

          <div className={styles.actions}>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
              <ArrowLeft size={18} /> Go Back
            </button>
            <Link to="/" className={styles.homeBtn}>
              <Home size={18} /> Home Page
            </Link>
          </div>

          <div className={styles.suggestions}>
            <p>Try these instead:</p>
            <nav className={styles.navLinks}>
              <Link to="/blog">Blog</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/support" className={styles.supportLink}>
                <LifeBuoy size={14} /> Help Center
              </Link>
            </nav>
          </div>
        </div>
      </motion.div>
    );
  } else {
    return (
      <>
        <h1>500 Internal Server Error</h1>
        <p>Something went wrong.</p>
      </>
    );
  }
}
