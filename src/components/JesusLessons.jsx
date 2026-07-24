import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRight, BookOpen, Quote, Sparkles, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from '../styles/JesusSection.module.css';

const JesusLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('jesus_lessons')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setLessons(data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const featuredLesson = useMemo(() => lessons[0], [lessons]);
  const otherLessons = useMemo(() => lessons.slice(1), [lessons]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className={styles.loader}
      >
        <Sparkles size={40} className={styles.goldIcon} />
        <p>Seeking Wisdom...</p>
      </motion.div>
    </div>
  );

  return (
    <section className={styles.wrapper} id="lessons">
      <div className={styles.container}>
        
        <header className={styles.sectionHeader}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={styles.badge}
          >
            <Sparkles size={14} /> <span>DAILY DISCIPLESHIP</span>
          </motion.div>
          <h2 className={styles.mainTitle}>Teachings of <span>the Master</span></h2>
          <p className={styles.subtitle}>Timeless wisdom for the modern journey</p>
        </header>

        {featuredLesson && (
          <motion.div 
            className={styles.featuredCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.featuredImageWrapper}>
              <img 
                src={featuredLesson.image_url || 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80'} 
                alt={featuredLesson.lesson_title} 
                className={styles.featuredImage}
              />
              <div className={styles.imageOverlay}>
                <span className={styles.scriptureTag}>{featuredLesson.scripture_reference}</span>
              </div>
            </div>
            
            <div className={styles.featuredContent}>
              <div className={styles.dateMeta}>
                <Calendar size={14} /> 
                {new Date(featuredLesson.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
              <h3 className={styles.featuredTitle}>{featuredLesson.lesson_title}</h3>
              <div className={styles.excerpt}>
                <Quote size={24} className={styles.quoteIcon} />
                <div className={styles.markdownWrapper}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {featuredLesson.message.length > 220 
                      ? `${featuredLesson.message.substring(0, 220)}...` 
                      : featuredLesson.message}
                  </ReactMarkdown>
                </div>
              </div>
              <Link to={`/lessons/${featuredLesson.id}`} className={styles.primaryBtn}>
                Explore Teaching <MoveRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}

        {otherLessons.length > 0 && (
          <div className={styles.archiveSection}>
            <h3 className={styles.archiveTitle}>Previous Wisdom</h3>
            <div className={styles.lessonGrid}>
              <AnimatePresence>
                {otherLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/lessons/${lesson.id}`} className={styles.lessonRow}>
                        <div className={styles.rowInfo}>
                          <span className={styles.rowReference}>{lesson.scripture_reference}</span>
                          <h4 className={styles.rowTitle}>{lesson.lesson_title}</h4>
                        </div>
                        <div className={styles.rowArrow}>
                          <BookOpen size={20} />
                        </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JesusLessons;