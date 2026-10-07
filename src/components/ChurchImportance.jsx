import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchImportance.module.css';
import { motion } from 'framer-motion';
import { Heart, Users, ShieldCheck, Sparkles, ArrowRight, BookOpen, Clock, Compass } from 'lucide-react';
import { getOptimizedImageUrl } from '../image-optimization';
import { useNavigate } from 'react-router-dom';

const ChurchImportance = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('church_importance')
          .select('*')
          .order('id', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          const optimizedPoints = data.map((point) => ({
            ...point,
            imageUrl: getOptimizedImageUrl(point.image_url, { width: 800, quality: 85 }),
            // Calculate approximate reading time per card
            readingTime: Math.max(1, Math.ceil((point.message || '').split(/\s+/).length / 200))
          }));
          setPoints(optimizedPoints);
        }
      } catch (err) {
        console.error('Error fetching church foundations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  const getIcon = useCallback((title = '') => {
    const t = title.toLowerCase();
    if (t.includes('love') || t.includes('heart')) return <Heart className={styles.icon} />;
    if (t.includes('community') || t.includes('people')) return <Users className={styles.icon} />;
    if (t.includes('protect') || t.includes('truth')) return <ShieldCheck className={styles.icon} />;
    return <Sparkles className={styles.icon} />;
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  if (loading) return <SkeletonLoader />;

  if (error) {
    return (
      <section className={styles.importanceSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h3>Unable to load insights</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="church-importance" className={styles.importanceSection}>
      <div className={styles.container}>
        {/* CNN Style Editorial Top Header Bar */}
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.kickerRow}>
              <span className={styles.kickerBadge}>SPECIAL COVERAGE</span>
              <span className={styles.kickerDivider}>|</span>
              <span className={styles.kickerText}>THE LIVING BODY</span>
            </div>

            <h2 className={styles.sectionTitle}>
              The Heart of the <span className={styles.accent}>Church</span>
            </h2>

            <div className={styles.headerBar} />

            <p className={styles.subtitle}>
              Key perspectives on why the local gathering remains God’s primary vessel for global transformation, accountability, and spiritual growth.
            </p>
          </motion.div>
        </header>

        {/* Dense Newsfeed Grid (Zero Unused Space layout) */}
        <motion.div
          className={styles.pointsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {points.map((point, index) => {
            const isFeatured = index === 0; // First item styled as CNN Featured Lead Card
            return (
              <motion.article
                key={point.id}
                className={`${styles.pointCard} ${isFeatured ? styles.featuredCard : ''}`}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/church-importance/${point.id}`)}
              >
                {/* Media Section */}
                <div className={styles.imageWrapper}>
                  <img
                    src={point.imageUrl || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80'}
                    alt={point.title}
                    className={styles.pointImage}
                    loading="lazy"
                  />
                  <div className={styles.badgeOverlay}>
                    <span className={styles.categoryTag}>
                      {getIcon(point.title)}
                      <span>FOCUS #{String(index + 1).padStart(2, '0')}</span>
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className={styles.cardContent}>
                  <div className={styles.metaHeader}>
                    <span className={styles.metaTopic}>FAITH & SOCIETY</span>
                    <span className={styles.dotSeparator}>•</span>
                    <span className={styles.metaTime}>
                      <Clock size={12} />
                      {point.readingTime} min read
                    </span>
                  </div>

                  <h3 className={styles.pointTitle}>{point.title}</h3>

                  <p className={styles.pointDescription}>
                    {point.message && point.message.length > 140
                      ? `${point.message.substring(0, 140).trim()}...`
                      : point.message}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.readMoreText}>
                      Read Full Article <ArrowRight size={14} className={styles.arrowIcon} />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const SkeletonLoader = () => (
  <section className={styles.importanceSection}>
    <div className={styles.container}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonKicker} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonSub} />
      </div>
      <div className={styles.pointsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonLineTitle} />
              <div className={styles.skeletonLineText} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ChurchImportance;