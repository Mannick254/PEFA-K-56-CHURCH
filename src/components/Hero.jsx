import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, PlayCircle, MoveRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Hero.module.css';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: "THEME OF THE YEAR 2026",
    subtitle: "ABIDING IN CHRIST (John 15:4)",
    image_url: '',
    cta_primary_text: 'About Us',
    cta_primary_link: '/about',
    cta_secondary_text: 'Watch Online',
    cta_secondary_link: '/sermons'
  });
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax and Fade effects
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scaleContent = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data, error } = await supabase.from('hero').select('*').eq('published', true).single();
        if (data) setHeroData(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Error fetching hero:", err);
      }
    }
    fetchHero();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      {/* Background Layer */}
      <div className={styles.heroMedia}>
        <motion.div style={{ y: yImage }} className={styles.imageWrapper}>
          {heroData.image_url ? (
            <img
              src={heroData.image_url}
              alt="Hero Background"
              fetchPriority="high"
              className={styles.heroImg}
            />
          ) : (
            <div className={styles.placeholderBg} />
          )}
          <div className={styles.overlayGradient} />
        </motion.div>
      </div>

      {/* Content Layer */}
      <motion.div
        style={{ opacity: opacityContent, scale: scaleContent }}
        className={styles.contentWrapper}
      >
        <motion.div 
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className={styles.heroBadge}>
            <Sparkles size={16} className={styles.goldIcon} />
            <span>A PLACE TO BELONG & GROW</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className={styles.heroDisplayTitle}>
            {heroData.title}
          </motion.h1>

          <motion.p variants={itemVariants} className={styles.heroLeadText}>
            {heroData.subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className={styles.heroButtonGroup}>
            <Link to={heroData.cta_primary_link} className={styles.btnPrimary}>
              <span>{heroData.cta_primary_text}</span>
              <MoveRight size={20} />
            </Link>

            <Link to={heroData.cta_secondary_link} className={styles.btnOutline}>
              <PlayCircle size={20} />
              <span>{heroData.cta_secondary_text}</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className={styles.scrollIndicator}
        >
          <div className={styles.mouse}>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={styles.wheel} 
            />
          </div>
          <span className={styles.scrollText}>Scroll to explore</span>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;