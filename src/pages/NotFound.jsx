import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, LifeBuoy } from 'lucide-react';
import styles from '../styles/NotFound.module.css';
import Seo from '../components/Seo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={styles.container}
    >
    <Seo title="Page Not Found" description="The page you are looking for does not exist."/>
      <div className={styles.content}>
        {/* Animated 404 Heading */}
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

        {/* Dynamic Search Feature */}
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search for content..." />
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link to="/" className={styles.homeBtn}>
            <Home size={18} /> Home Page
          </Link>
        </div>

        {/* Suggested Links Section */}
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
};

export default NotFound;
