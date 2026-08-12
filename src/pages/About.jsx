
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { supabase } from '../supabaseClient';
import styles from '../styles/About.module.css';
import { Compass, Feather, Heart, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { FaDove } from 'react-icons/fa';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';

// Sub-components
import MarkdownDisplay from '../components/MarkdownDisplay';

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax offsets
  const yHeroText = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const yHeroBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const fetchAboutContent = async () => {
      const { data, error } = await supabase.from('about_us').select('*').single();
      if (!error) setAboutContent(data);
    };
    fetchAboutContent();
  }, []);

  if (!aboutContent) return (
    <>
      <Seo title="About Us" url="/about" />
      <div className={styles.loadingScreen}>
        <motion.div 
          animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className={styles.loaderLogo}
        ><Feather size={48} /></motion.div>
      </div>
    </>
  );

  const revealVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className={styles.mainWrapper}>
      <Seo 
        title="About Us" 
        description={aboutContent.subtitle} 
        keywords="About PEFA, Church history, our mission, our beliefs" 
        url="/about"
        type="website"
      />
      <motion.div className={styles.progressLine} style={{ scaleX }} />

      <div className={styles.container}>
        <Breadcrumb />
      </div>

      {/* --- MODERN HERO SECTION --- */}
      <section className={styles.heroSection}>
        <motion.div style={{ y: yHeroBg }} className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        
        <div className={styles.container}>
          <motion.div style={{ y: yHeroText }} className={styles.heroContent}>
            <motion.span 
              initial={{ opacity: 0, tracking: -2 }}
              animate={{ opacity: 1, tracking: 0 }}
              className={styles.kicker}
            >
              ESTABLISHED IN FAITH • DRIVEN BY PURPOSE
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1, delay: 0.2 }}
              className={styles.heroTitle}
            >
              <MarkdownDisplay markdown={aboutContent.title} />
            </motion.h1>
            <motion.div className={styles.heroSubtitle}>
              <MarkdownDisplay markdown={aboutContent.subtitle} />
            </motion.div>
          </motion.div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <span>Scroll to Explore</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* --- STORY SECTION (Interactive Image Reveal) --- */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <motion.div 
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={styles.storyText}
            >
              <div className={styles.iconBox}><Compass size={32} /></div>
              <h2 className={styles.serifTitle}><MarkdownDisplay markdown={aboutContent.our_story_title} /></h2>
              <div className={styles.accentBar} />
              <div className={styles.pLead}><MarkdownDisplay markdown={aboutContent.our_story_p1} /></div>
              <div className={styles.pBody}><MarkdownDisplay markdown={aboutContent.our_story_p2} /></div>
            </motion.div>

            <motion.div 
              className={styles.storyVisual}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.imageRevealWrapper}>
                <img 
                  src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1781692303/IMG_20260609_194629_lmtpxr.jpg" 
                  alt="Our Heritage"
                  className={styles.mainImage}
                />
                <div className={styles.floatingStats}>
                  <div className={styles.statItem}>
                    <h4>20+</h4>
                    <p>Years of Ministry</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MISSION (Glassmorphic Impact Section) --- */}
      <section className={styles.missionSection}>
        <div className={styles.meshGradient} />
        <motion.div 
          className={styles.missionGlassCard}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
        >
          <FaDove className={styles.missionIcon} />
          <h2 className={styles.missionTitle}><MarkdownDisplay markdown={aboutContent.our_mission_title} /></h2>
          <div className={styles.missionText}><MarkdownDisplay markdown={aboutContent.our_mission_p1} /></div>
          <div className={styles.missionDivider} />
        </motion.div>
      </section>

      {/* --- BELIEFS BENTO GRID --- */}
      <section className={styles.bentoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.serifTitle}>Our Foundation</h2>
            <p>The pillars that guide our spiritual journey</p>
          </div>
          
          <div className={styles.bentoGrid}>
            <motion.div whileHover={{ y: -10 }} className={`${styles.bentoCard} ${styles.tall}`}>
              <ShieldCheck className={styles.bentoIcon} />
              <h3>The Bible</h3>
              <p>The inspired, infallible, and authoritative Word of God. Our ultimate map for life’s journey.</p>
              <MarkdownDisplay markdown={aboutContent.bible_context} />
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className={styles.bentoCard}>
              <Heart className={styles.bentoIcon} />
              <h3>The Trinity</h3>
              <p>One God, eternally existent in three persons: Father, Son, and Holy Spirit.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className={styles.bentoCard}>
              <Globe className={styles.bentoIcon} />
              <h3>Our Outreach</h3>
              <div><MarkdownDisplay markdown={aboutContent.digital_age_p1} /></div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className={`${styles.bentoCard} ${styles.wide} ${styles.ctaBackground}`}>
              <div className={styles.ctaContent}>
                <h3><MarkdownDisplay markdown={aboutContent.join_us_title} /></h3>
                <div><MarkdownDisplay markdown={aboutContent.join_us_p1} /></div>
                <button className={styles.modernButton}>
                  Start Your Journey <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
