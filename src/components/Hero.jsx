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
    image_url: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1779698892/PK56_uh2j35.jpg',
    cta_primary_text: 'About Us',
    cta_primary_link: '/about',
    cta_secondary_text: 'Watch Online',
    cta_secondary_link: '/sermons'
  });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax and fade effects
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data } = await supabase.from('hero').select('*').eq('published', true).single();
        if (data) setHeroData(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Error fetching hero:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 800); 
      }
    };
    fetchHeroData();
  }, []);

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const wordMaskVariants = {
    hidden: { y: "115%" },
    visible: { 
      y: 0, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section ref={containerRef} className={styles.heroContainer}>
      {/* Background Media Layer */}
      <div className={styles.heroMedia}>
        <motion.div style={{ y: yImage }} className={styles.imageWrapper}>
          <img src={heroData.image_url} alt="" aria-hidden="true" className={styles.heroImg} />
          <div className={styles.overlayGradient} />
        </motion.div>
      </div>

      {/* Main Content Layer */}
      <div className={styles.contentWrapper}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader" exit={{ opacity: 0 }} className={styles.loaderContainer}>
              <div className={styles.spinner} />
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              style={{ opacity: opacityText, scale: scaleText }} 
              className={styles.heroContent}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.heroBadge}
              >
                <Sparkles size={14} className={styles.goldIcon} />
                <span>A PLACE TO BELONG & GROW</span>
              </motion.div>
              
              {/* Title with Split Text Effect */}
              <h1 className={styles.heroDisplayTitle}>
                {heroData.title.split(" ").map((word, i) => (
                  <span key={i} className={styles.wordOverflow}>
                    <motion.span variants={wordMaskVariants} className={styles.wordInner}>
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <motion.p 
                variants={{
                  hidden: { opacity: 0, filter: "blur(10px)" },
                  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1 } }
                }}
                className={styles.heroLeadText}
              >
                {heroData.subtitle}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className={styles.heroButtonGroup}
              >
                <Link to={heroData.cta_primary_link} className={styles.btnPrimary}>
                  <span>{heroData.cta_primary_text}</span>
                  <MoveRight size={20} className={styles.btnIcon} />
                </Link>

                <Link to={heroData.cta_secondary_link} className={styles.btnOutline}>
                  <PlayCircle size={20} className={styles.btnIcon} /> 
                  <span>{heroData.cta_secondary_text}</span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator (Desktop Only) */}
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
};

export default Hero;