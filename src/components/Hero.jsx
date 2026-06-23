import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, PlayCircle, ChevronDown, MoveRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Hero.module.css';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: "Faith Meets Family",
    subtitle: "Welcome to PEFA Kawangware 56, a spiritual home where every soul finds purpose.",
    image_url: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1779698892/PK56_uh2j35.jpg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax: Image moves slower, Text fades and moves up
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 0.7], [0, -50]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await supabase
          .from('hero')
          .select('title, subtitle, image_url')
          .eq('published', true)
          .single();

        if (!error && data) {
          setHeroData({
            title: data.title || heroData.title,
            subtitle: data.subtitle || heroData.subtitle,
            image_url: data.image_url || heroData.image_url
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  const scrollToContent = () => {
    const nextSection = containerRef.current?.offsetHeight;
    window.scrollTo({ top: nextSection, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      {/* Background Layer */}
      <div className={styles.heroMedia}>
        <motion.div style={{ y: yImage, scale: scaleImage }} className={styles.imageWrapper}>
          <img src={heroData.image_url} alt="PEFA 56 Sanctuary" className={styles.heroImg} />
        </motion.div>
        <div className={styles.vignetteOverlay} />
      </div>

      {/* Content Layer */}
      <div className={styles.contentWrapper}>
        <AnimatePresence>
          {!isLoading && (
            <motion.div 
              style={{ opacity: opacityText, y: yText }} 
              className={styles.heroContent}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className={styles.heroBadge}>
                <Sparkles size={14} className={styles.goldText} />
                <span>A Place to Belong, A Place to Grow</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className={styles.heroDisplayTitle}>
                {heroData.title}
              </motion.h1>

              <motion.p variants={itemVariants} className={styles.heroLeadText}>
                {heroData.subtitle}
              </motion.p>

              <motion.div variants={itemVariants} className={styles.heroButtonGroup}>
                <Link to="/contact" className={styles.btnPrimary}>
                  Plan Your Visit <MoveRight size={18} />
                </Link>
                <Link to="/sermons" className={styles.btnOutline}>
                  <PlayCircle size={18} /> Watch Online
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Hint */}
      <motion.button 
        onClick={scrollToContent}
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className={styles.scrollText}>Explore PEFA 56</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;