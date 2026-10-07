import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

import styles from '../styles/Home.module.css';
import Seo from './Seo';
import Hero from './Hero';
import AcademyPromo from './AcademyPromo';

const DEFAULT_SEO_DESC = 
  "Welcome to PEFA Kawangware 56 Church, a vibrant Christian community in Nairobi, Kenya. " +
  "Dedicated to transforming lives through God's Word, worship, and fellowship.";

const Layout = ({ 
  children, 
  title = "PEFA Kawangware 56 Church", 
  description = DEFAULT_SEO_DESC,
  url = "/",
  showHero = true 
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  return (
    <div className={styles.pageWrapper}>
      <Seo 
        title={title} 
        description={description} 
        url={url} 
        type="website" 
      />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className={styles.progressBar} 
        style={{ scaleX, transformOrigin: '0%' }} 
      />

      {/* Conditionally render Hero for Home or main routes */}
      {showHero && <Hero />}

      <main id="main-content">{children}</main>

      <AcademyPromo />

      {/* Floating Action Button */}
      <a 
        href="https://wa.me/254724435230" 
        className={styles.fabPrayer} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp for prayer requests"
      >
        <FaWhatsapp size={24} />
        <span className={styles.fabText}>Need Prayer?</span>
      </a>
    </div>
  );
};

export default Layout;